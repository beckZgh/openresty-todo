local pv_user        = _load "$pv_user"
local hashid         = _load "#hashid"
local aes            = _load "#aes"
local api            = _load "api"

local session        = require "resty.session"

local __ = { _VERSION = "v22.11.21" }

-- 取得 session
local function _getSession()

    return session.new({
        name   = "todo_uid",
        secret = ngx.decode_base64("LXnL4FVKDiWRrZ2y27zF7xfBMoGjKC4FYxTJy+fgl24="),
    })

end

__.login__ = {
    "手机密码登录",
    pv  = false,  -- 无需检查是否已登录
    log = true,
    req = {
        { "mobile"      , "手机号码"    },
        { "password"    , "用户密码"    },
    },
    types = "$pv_user",
    res = {
        { "user"      , "用户信息" , "$pv_user"      },
        { "tasks"     , "待办任务" , "$dd_todo"      },
        { "task_cates", "任务列表" , "$dd_todo_cate" },
    }
}
__.login = function(t)

    local mobile   = aes.decrypt(t.mobile)
    local password = aes.decrypt(t.password)
    if not mobile or not password then return nil, "账号密码错误" end

    -- 取得用户
    local  user, err = pv_user.get { mobile = mobile }
    if err then return nil, "服务器忙，请稍后再试"  end

    -- 检查密码
    if not user or aes.decrypt(user.password) ~= password then return nil, "账号密码错误" end

    -- 保存当前用户信息
    ngx.ctx.user = user

    -- 替换密码为 8 位 * 号
    user.password = string.rep("*", 8)

    local sss = _getSession()

    sss:start()
    sss.data.uid = user.user_id
    sss:save()

    local dd = api.dd.load(user)

    -- 返回用户信息及权限列表
    return { user = user, tasks = dd.tasks, task_cates = dd.task_cates }

end

__.register__ = {
    "手机密码注册",
    pv  = false,  -- 无需检查是否已登录
    log = true,
    req = {
        { "user_name?"  , "用户昵称"    },
        { "mobile"      , "手机号码"    },
        { "password"    , "用户密码"    },
    },
    res = "boolean"
}
__.register = function(t)

    -- 检查用户是否已注册
    local  user, err = pv_user.get { mobile = t.mobile }
    if err  then return nil, "服务器忙，请稍后再试" end
    if user then return nil, "用户已注册"           end

    -- 注册新用户
    local new_user, err = api.pv.user.add({
        user_id   = hashid.generate(),
        user_name = t.user_name or "To do 用户",
        mobile    = t.mobile,
        password  = aes.encrypt(t.password)
    })
    if not new_user then return nil, err end

    return true

end

__.logout__ = {
    "退出登录",
    pv  = false,  -- 无需检查是否已登录
    log = true,
}
__.logout = function()

    local sss = _getSession()
    sss:destroy()

    return true

end

__.check_login__ = {
    "检查已登录用户",
    pv  = "local",  -- 只能本地调用，不允许通过 api 入口调用
    res = {
        { "user", "用户信息", "@pv_user" },
    }
}
__.check_login = function()

    local sss = _getSession()
    sss:open()

    -- 取得 session uid
    local uid = sss.data.uid
    if type(uid) ~= "string" or uid == "" then return nil, "用户尚未登录" end

    -- 检查用户是否存在
    local  user, err = pv_user.get({ user_id = uid })
    if not user then return nil, err end

    -- 保存当前用户信息
    ngx.ctx.user = user

    -- 自动续期
    if (sss.expires - sss.now) < sss.cookie.renew then
        sss:save()
    end

    return { user = user }

end

return __
