
local _encode     = require "cjson.safe".encode
local check_login = _load "api.pv".check_login     -- 检查是否登录

--------------------------------------------------------------------------------
local __ = {}
__.ver   = "22.11.22"
__.name  = "To Do 全局数据"
--------------------------------------------------------------------------------

__.actx = function()

    -- 检查已登录用户
    local res   = check_login()
    local user  = res and res.user

    local G = {
        server_date = ngx.today(),
        server_time = ngx.now() * 1000,
        user        = user,
    }

    ngx.header['Content-Type' ] = "application/javascript;charset=utf-8"
    ngx.header['Cache-Control'] = "no-store"  -- 不缓存

    ngx.say("var G = ", _encode(G), ";")

end

------------------------------------------------------
return __ -- 返回模块
