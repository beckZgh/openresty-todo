

local pv_user = _load "$pv_user"

local utils   = _load "%utils"
local hashid  = _load "%hashid"
local _quote  = ngx.quote_sql_str

local __ = { ver = "v22.11.21" }

-- 重名检查
local function check_name(t)
-- @t : $pv_user

    if not t.user_name then return nil, "用户名称不能为空" end

    local res, err  = pv_user.get {
        user_name   = t.user_name,
        t.user_id and ("user_id <> " .. _quote(t.user_id)) or nil
    }
    if err then return nil, "服务器忙，请稍候再试" end
    if res then return nil, "用户名称不能重复"     end

    return true

end

-- 检查手机是否重复
local function check_mobile(t)
-- @t : $pv_user

    if not t.mobile then return nil, "手机号码不能为空" end

    local res, err  = pv_user.get {
        mobile      = t.mobile,
        t.user_id and ("user_id <> " .. _quote(t.user_id)) or nil
    }
    if err then return nil, "服务器忙，请稍候再试"  end
    if res then return nil, "手机号码不能重复"      end

    return true

end

__.get__ = {
    "获取用户",
    req = {
        { "user_id", "用户编码" },
    },
    res = "$pv_user"
}
__.get = function(req)

    local t = req

    local  res, err = pv_user.get({ user_id = t.user_id  })
    if not res then return nil, err and "服务器忙，请稍候再试" or "用户不存在" end

    -- 替换密码为 8 位 * 号
    res.password = string.rep("*", 8)

    return res

end

__.list__ = {
    "用户列表",
    res = "$pv_user[]"
}
__.list = function()

    local  list = pv_user.list { "1=1" }
    if not list then return nil, "服务器忙，请稍候再试" end

    -- 替换密码为 8 位 * 号
    for _, d in ipairs(list) do
        d.password = string.rep("*", 8)
    end

    return list

end

__.add__ = {
    "添加用户",
    log = true,
    req = {
      --{ "user_id"         , "用户编码" },
        { "user_name"       , "用户名称" },
        { "user_remark?"    , "用户描述" },
        { "mobile"          , "手机号码" },
        { "password"        , "用户密码" },
        { "head_img_url?"   , "用户头像" },
    },
    res = "$pv_user"
}
__.add = function(req)

    local t = req

    t.user_name = utils.strip_name(t.user_name)

    -- 检查用户不能重名
    local  ok, err = check_name(t)
    if not ok then return nil, err end

    -- 检查手机是否重复
    local  ok, err = check_mobile(t)
    if not ok then return nil, err end

    t.user_id     = hashid.generate()
    t.create_time = ngx.localtime()
    t.update_time = ngx.localtime()

    local  ok, err = pv_user.add (t)
    if not ok then return nil, err end

    return __.get(t)

end

__.set__ = {
    "修改用户",
    log = true,
    req = {
        { "user_id"         , "用户编码" },
        { "user_name?"      , "用户名称" },
        { "user_remark?"    , "用户描述" },
        { "mobile?"         , "手机号码" },
        { "password?"       , "用户密码" },
        { "head_img_url?"   , "用户头像" },
    },
    res = "$pv_user"
}
__.set = function(req)

    local t = req

    t.user_name = utils.strip_name(t.user_name)

    local  tOld, err = __.get(t)
    if not tOld then return nil, err end

    -- 生成待更新的数据
    local  d, wh = utils.gen_update(t, tOld, "user_id")
    if not d then return tOld end

    -- 检查用户不能重名
    if d.user_name then
        local  ok, err = check_name(t)
        if not ok then return nil, err end
    end

    -- 检查手机是否重复
    if d.mobile then
        local  ok, err = check_mobile(t)
        if not ok then return nil, err end
    end

    local  ok, err = pv_user.set(wh)
    if not ok then return nil, err end

    return __.get(t)

end

__.del__ = {
    "删除用户",
    log = true,
    req = {
        { "user_id", "用户编码" },
    },
}
__.del = function(t)

    local user = ngx.ctx.user or {}

    if user.user_id == t.user_id then
       return nil, "不允许删除当前登录的用户"
    end

    local  ok, err = pv_user.del { user_id = t.user_id }
    if not ok then return nil, err end

    return true

end

return __
