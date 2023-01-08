
local api     = _load "api"
local _encode = require "cjson.safe".encode

--------------------------------------------------------------------------------
local __ = {}
__.ver   = "22.11.22"
__.name  = "To Do 全局数据"
--------------------------------------------------------------------------------

__.actx = function()

    -- 检查已登录用户
    local res  = api.pv.check_login()
    local user = res and res.user

    -- 取得基础数据
    local dd
    if user and user.user_id then
       dd = api.dd.load(user)
    end

    local G = {
        server_date = ngx.today(),
        server_time = ngx.now() * 1000,
        user        = user,
        tasks       = dd and dd.tasks or {},
        task_cates  = dd and dd.task_cates or {}
    }

    ngx.header['Content-Type' ] = "application/javascript;charset=utf-8"
    ngx.header['Cache-Control'] = "no-store"  -- 不缓存

    ngx.say("var G = ", _encode(G), ";")

end

------------------------------------------------------
return __ -- 返回模块
