

local api     = _load "api"
local hashid  = _load "%hashid"
local mlcache = _load "%mlcache"
local utils   = _load "%utils"
local pv_user = _load "$pv_user"

local aes     = require "resty.aes"
local KEY     = "abcdefgabcdefg12"

local __ = { _VERSION = "v22.11.21" }

local cookie_cid = "todo_cid"
local cookie_uid = "todo_uid"

local function _decrypt(text)

	if type(text) ~= "string" or text == "" then
		return nil, "密文不能为空"
	end

    local hash   = { iv = "aaaabbbbccccdddd" }
    local cipher = aes.cipher(128,"ecb")

    local  aes_128_ecb, err = aes:new(KEY, nil, cipher, hash)
    if not aes_128_ecb then return nil, err end

    local  str_base64 = ngx.decode_base64(text)
    local  str, err = aes_128_ecb:decrypt(str_base64)
	if not str then return nil, err end

    return str

end

-- 设置 cookie
local function set_cookie(user)
-- @user : $pv_user

    if type(user) ~= "table" then return end

    local  cid = user.CompanyID
    if not cid then return end

  --local time = ngx.time() + 7*24*60*60  -- 7天有效
    local time = ngx.time() + 1*1*60*60   -- 1小时有效
    local  uid = hashid.encode(user.UserID, time)
    if not uid then return end

    local cookie = ";path=/"
                .. ";expires=" .. ngx.cookie_time(time)
                .. ";samesite=strict;httponly"

    ngx.header["Set-Cookie"] = {
        cookie_cid .. "=" .. cid .. cookie,
        cookie_uid .. "=" .. uid .. cookie,
    }

end

-- 删除 cookie
local function del_cookie()

    ngx.header["Set-Cookie"] = {
        cookie_cid .. "=;path=/;expires=" .. ngx.cookie_time(0),
        cookie_uid .. "=;path=/;expires=" .. ngx.cookie_time(0),
    }

end

__.logout__ = {
    "退出登录",
    pv  = false,  -- 无需检查是否已登录
    log = true,
}
__.logout = function()

    local cid = utils.strip(ngx.var["cookie_" .. cookie_cid])
    local uid = utils.strip(ngx.var["cookie_" .. cookie_uid])

    if cid and uid then
        local user
        local user_id = hashid.decode(uid)

        -- 超级管理员检查登录
        local key = "todo_login/" .. cid .. "/" .. user_id
        local res = mlcache.get(key)

        if res then
            user = res
        else
            user = api.cache.get_admin_user { CompanyID = cid, UserID = user_id }
        end

        -- 保存当前用户信息
        if user then ngx.ctx.user = user end
    end

    -- 删除 cookie
    del_cookie()

    return true

end

__.login__ = {
    "手机密码登录",
    pv  = false,  -- 无需检查是否已登录
    log = true,
    req = {
        { "mobile"      , "手机号码"    },
        { "password"    , "用户密码"    },
    },
    res = "$pv_user"
}
__.login = function(t)

	-- 使用密文传递
	t.mobile     = _decrypt ( t.mobile      )
	t.password   = _decrypt ( t.password    )

	if not t.mobile or not t.password then return nil, "账号密码错误" end

    local  user, err = pv_user.get { mobile = t.mobile }
    if err then return nil, "服务器忙，请稍后再试"  end
    if not user or user.password ~= t.password then return nil, "账号密码错误" end

    -- 保存当前用户信息
    ngx.ctx.user = user

    -- 替换密码为 8 位 * 号
    user.password = string.rep("*", 8)

    set_cookie(user)

    -- 返回用户信息及权限列表
    return user

end

__.register__ = {
    "手机密码注册",
    pv  = false,  -- 无需检查是否已登录
    log = true,
    req = {
        { "mobile"      , "手机号码"    },
        { "password"    , "用户密码"    },
    },
    res = "$pv_user"
}
__.login = function(t)

	-- 使用密文传递
	t.mobile     = _decrypt ( t.mobile      )
	t.password   = _decrypt ( t.password    )

	if not t.mobile or not t.password then return nil, "账号密码错误" end

    local  user, err = pv_user.get { mobile = t.mobile }
    if err then return nil, "服务器忙，请稍后再试"  end
    if not user or user.password ~= t.password then return nil, "账号密码错误" end

    -- 保存当前用户信息
    ngx.ctx.user = user

    -- 替换密码为 8 位 * 号
    user.password = string.rep("*", 8)

    set_cookie(user)

    -- 返回用户信息及权限列表
    return user

end

__.check_login__ = {
    "检查已登录用户",
    pv  = "local",  -- 只能本地调用，不允许通过 api 入口调用
    res = {
        { "user"    , "用户信息" , "@UserWithCompany"       },
        { "pv"      , "用户权限" , "string[]"               },
        { "menus"   , "报表菜单" , "@ReportMenuDefine[]"    },
    }
}
__.check_login = function()

    local cid = ngx.var["cookie_" .. cookie_cid]
    local uid = ngx.var["cookie_" .. cookie_uid]

    if type(cid) ~= "string" or cid == "" then return nil, "用户尚未登录" end

    -- 检查商户是否开通
    local  company, err = api.dd.getCompany(cid)
    if not company then return nil, err end

    local  user_id, time = hashid.decode(uid)
    if not user_id then return nil, "用户尚未登录" end

    time = tonumber(time) or 0
    if time < ngx.time() then return nil, "用户登录已过期" end

    -- 超级管理员检查登录
    local key = "admin_login/" .. cid .. "/" .. user_id
    local res = mlcache.get(key)
    if res then return res end

    local  user, err = api.cache.get_admin_user { CompanyID = cid, UserID = user_id }
    if not user then return nil, err end

    if user.StopFlag == 1 then return nil, "用户已停用" end

    user.CompanyName = company.CompanyName

    -- 加载用户权限
    local  pv, err = api.cache.get_admin_menus(user)
    if not pv then return nil, err end

    -- 自定义报表菜单
    local menus = api.rpt_menus.admin_rpt_menus()

    -- 保存当前用户信息
    ngx.ctx.user = user

    set_cookie(user)

    -- 返回用户信息及权限列表
    return { user = user, pv = pv, menus = menus }

end

__.change_password__ = {
    "修改密码",
    log = true,
    req = {
        { "OldPassword", "旧密码"  },
        { "NewPassword", "新密码"  },
    },
    res = "boolean"
}
__.change_password = function(req)

    local t = req
    t.OldPassword = utils.strip(t.OldPassword)
    t.NewPassword = utils.strip(t.NewPassword)

    if not t.OldPassword then return nil, "旧密码不能为空" end
    if not t.NewPassword then return nil, "新密码不能为空" end
    if t.OldPassword == t.NewPassword then return nil, "新密码不能与旧密码相同" end

    local  ctx_user = ngx.ctx.user
    if not ctx_user then return nil, "用户尚未登录" end

    local  user, err = pv_user.get { CompanyID = ctx_user.CompanyID, UserID = ctx_user.UserID }
    if err then return nil, "服务器忙，请稍后再试" end
    if not user then return nil, "用户不存在" end

    if user.Password ~= t.OldPassword then return nil, "旧密码错误" end

    local ok, err = pv_user.set {
        CompanyID   = user.CompanyID,
        UserID      = user.UserID, {
        --------------------------
        Password    = t.NewPassword
    }}

    api.cache.del_admin_user(user)  -- 删除用户缓存 v21.11.30

    if not ok then return nil, err end

    return true

end

return __
