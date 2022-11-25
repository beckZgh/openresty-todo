
local _request = _load "#request"
local _decode  = require "cjson.safe".decode

local WXDEV_BASE_URL = "http://127.0.0.1:23186/v2"
local __ = {}
__.ver   = "22.11.10"
__.name  = "api测试"
------------------------------------------------------
__.actx = function()
    -- local login_result = ngx.config.prefix() .. "html/loginresult.json"
    -- -- return login_result
    -- local res, err = _request('http://127.0.0.1:23186/v2/login?result-output=' .. login_result)
    -- if  res.reason ~= "OK" then return nil, err end

    -- return res.body

    local login_result = ngx.config.prefix() .. "html/loginresult.json"
    local res, err = _request(WXDEV_BASE_URL .. "/login?qr-format=base64&result-output=" .. login_result)
    if err then return nil, err end

    local res, err = _decode("test")
    if not res then return nil, err end

    return res.qrcode
end

------------------------------------------------------
return __ -- 返回模块
