
local _decode     = require "cjson.safe".decode
local _split      = require "ngx.re".split
local utils       = require "app.utils"
local _gsub       = string.gsub
local parser_body = _load "#parser_body"

local API     = _load "api"
local API_MOD = {} -- API 方法

------------------------------------------------------
local __ = {}
__.ver   = "22.11.22"
__.name  = "API 辅助函数"
------------------------------------------------------

-- 错误信息
__._err = function (err)
    return {
            ok          = false
        ,   err         = err or "未知错误"
        ,   server_date = ngx.today()
        ,   server_time = ngx.now() * 1000
    }
end

-- 清除字符串前后空白
local function _trim(t)

    for k, v in pairs(t) do
        if type(v) == "string" then
            t[k] = _gsub(v, "^%s*(.-)%s*$", "%1")

        elseif type(v) == "table" then
            _trim(v)
        end
    end

end

-- 取得 api 定义
__._getApiDefine = function()
    local args = ngx.req.get_uri_args()
    local api_name, act_name = args.api, args.act

    if type(api_name) ~= "string" or api_name == "" then return nil end
    if type(act_name) ~= "string" or act_name == "" then return nil end

    -- 不允许访问私有 API
    if utils.str.startsWith(act_name, '_') then return nil end

    -- 使用映射
    local cache_key = api_name .. "." .. act_name
    if type(API_MOD[cache_key]) == 'table' then return API_MOD[cache_key] end

    -- 取出 api 分割的 key 列表
    local keys = _split(api_name, [[\.]])

    -- 取得最后的 API 对象
    local api = API
    for _, k in pairs(keys) do
        -- 不允许访问私有 API
        if utils.str.startsWith(k, '_') then return nil end

        if k ~= "" then
            api = api[k]
            if type(api) ~= "table" then return nil end
        end
    end

    -- 取得处理函数
    local handle = api[act_name]
    if type(handle) ~= "function" then return nil end

    -- 公开函数必须有接口声明
    local config = api[act_name .. "__"]
    if type(config) ~= "table" then return nil end

    -- 存入
    local api_define = {
        handle = handle, -- 处理函数
        config = config, -- 接口配置
    }
    API_MOD[cache_key] = api_define

    return api_define
end

-- 取得请求 Body Data
__._getBodyData = function()
    -- 检查当前请求方式
    if ngx.var.request_method ~= "POST" then return nil end

    -- 读取 body 数据
                 ngx.req.read_body()
    local body = ngx.req.get_body_data()

    -- FormData 提交数据
    local contentType = ngx.var.content_type and string.sub(ngx.var.content_type, 1, 19)
    local isFormData  = contentType == "multipart/form-data"

    -- 解析数据
    local   req   = body and isFormData and parser_body(body) or _decode(body)
    if type(req) ~= "table" then return {} end

    _trim(req) -- 清除字符串前后空白

    return req
end

------------------------------------------------------
return __ -- 返回模块
