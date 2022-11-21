
local api            = _load "api"                    -- api 对象
local _err           = _load "%helper"._err           -- 返回错误信息
local _success       = _load "%helper"._success       -- 返回成功信息
local _getApiMethod  = _load "%helper"._getApiMethod  -- 取得 API 函数

--------------------------------------------------------------------------------
local __ = {}
__.ver   = "22.11.21"
__.name  = "To Do 接口"
--------------------------------------------------------------------------------

__.actx = function()

    local time1 = ngx.now() * 1000 -- 开始处理时间

    local args = ngx.req.get_uri_args()
    local api, act = args.api, args.act

    local time2 = ngx.now() * 1000

    return {
            ok          = true
        ,   api
        ,   act
        ,   data        = {}
        ,   server_date = ngx.today()
        ,   server_time = time2
        ,   request_time= time2 - time1
    }

end

------------------------------------------------------
return __ -- 返回模块
