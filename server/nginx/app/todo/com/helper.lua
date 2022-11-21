
local _decode     = require "cjson.safe".decode
local parser_body = _load "#parser_body"

local API     = _load "api"
local API_MOD = {} -- API 方法

------------------------------------------------------
local __ = {}
__.ver   = "22.11.22"
__.name  = "辅助函数"
------------------------------------------------------

-- 成功信息
__._success = function (data)
    return {
            ok          = true
        ,   data        = data
        ,   err         = ""
        ,   server_date = ngx.today()
        ,   server_time = ngx.now() * 1000
    }
end

-- 错误信息
__._err = function (err)
    return {
            ok          = false
        ,   err         = err or "未知错误"
        ,   server_date = ngx.today()
        ,   server_time = ngx.now() * 1000
    }
end

-- 取得 api 对象下的处理函数
__._getApiMethod = function()
    local args = ngx.req.get_uri_args()
    local api, act = args.api, args.act

    if type(api) ~= "string" or api == "" then return nil, "接口不存在" end
    if type(act) ~= "string" or act == "" then return nil, "接口不存在" end


end

-- 取得请求 Body Data
__._getBodyData = function()
    ngx.req.read_body()
    local  body = ngx.req.get_body_data()

    -- FormData 提交数据
    local contentType = ngx.var.content_type and string.sub(ngx.var.content_type, 1, 19)
    local isFormData  = contentType == "multipart/form-data"

    local  req  = body and isFormData and parser_body(body) or _decode(body)
    if type(req)~="table" then return _err "请使用POST请求数据" end
end

------------------------------------------------------
return __ -- 返回模块
