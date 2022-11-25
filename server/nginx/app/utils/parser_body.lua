
local parser = require "resty.multipart.parser"

-- 解析上传文件 body
return function()

    local method  = ngx.var.request_method
    if    method ~= "POST" then return nil, "请使用PSOT请求" end

    local   content_type = ngx.var.http_content_type
    if type(content_type) ~= "string" or content_type == "" then return nil, "content_type is null" end

                   ngx.req.read_body()
    local  body =  ngx.req.get_body_data()
    if not body then return nil, "body is null" end

    -- 解析请求体
    local  form, err = parser.new(body, content_type)
    if not form then return nil, "参数解析失败:" .. err end

    -- 取出参数
    local params = {}

    while true do
        local  _body, _name = form:parse_part()
        if not _body then break end

        params[_name] = _body
    end

    return params

end

