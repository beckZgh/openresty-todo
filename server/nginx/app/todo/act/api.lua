
local check_login    = _load "api.pv".check_login     -- 检查是否登录
local _err           = _load "#helper"._err           -- 返回错误信息
local _getApiDefine  = _load "#helper"._getApiDefine  -- 取得 API 定义
local _getBodyData   = _load "#helper"._getBodyData   -- 取得 POST 数据

--------------------------------------------------------------------------------
local __ = {}
__.ver   = "22.11.21"
__.name  = "To Do 接口"
--------------------------------------------------------------------------------

-- 检查接口权限
local _checkApiAuth = function (config, req)
    -- 仅本机访问 api
    if config.pv == 'local' then return nil, "权限不足" end

    -- 检查权限
    if config.pv ~= false then
        -- 检查登录
        local  res, err = check_login()
        if not res then return nil, err end

        -- 检查是否同一用户
        if res.user.user_id ~= req.user_id then
            return nil, "操作权限异常"
        end
    end

    return true
end

__.actx = function()

    local time1 = ngx.now() * 1000 -- 处理开始时间

    -- 1) 取得接口定义、及处理函数
    local api = _getApiDefine()
    if type(api) ~= "table" then return _err "接口不存在" end

    -- 2）取得请求数据
    local req = _getBodyData()
    if type(req) ~= 'table' then return _err "请使用POST请求数据" end

    -- 3) 接口权限校验
    local  ok, err = _checkApiAuth(api.config, req)
    if not ok then return _err(err) end

    -- 4) 处理接口逻辑
    local  pok, res, err = pcall(api.handle, req)
    if not pok or not res then return _err(err) end

    -- 5) 日志相关

    local time2 = ngx.now() * 1000 -- 处理结束时间

    return {
            ok          = true
        ,   data        = type(res) == 'table' and res or { ok = true }
        ,   server_date = ngx.today()
        ,   server_time = time2
        ,   request_time= time2 - time1
    }

end

------------------------------------------------------
return __ -- 返回模块
