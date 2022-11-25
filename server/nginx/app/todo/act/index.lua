
local _render     = require "resty.template.safe".render
local _encode     = require "cjson.safe".encode
local _err        = _load "#err_html"
local mlcache     = _load "%mlcache"
local _openx      = io.openx

--------------------------------------------------------------------------------
local __ = {}
__.ver   = "22.11.21"
__.name  = "Todo List"
--------------------------------------------------------------------------------

-- 模板路径
local local_base  = "/todolist/"

-- 读取本地网页模板
local function readfile(app_base, reload)

    if type(app_base) ~= "string" or app_base == "" then return end

    local key = "app_html/" .. app_base
    if reload then mlcache.del(key) end

    return mlcache.get(key, function()

        local  path = "html/" .. app_base .. "app.html"
        local  file = _openx(path, "rb")
        if not file then return end

        local  html = file:read("*a")
                      file:close()
        if not html or html == "" then return end

        return html, nil, 0 -- 永久缓存

    end)

end

__.actx = function()

    -- 取得程序路径和网页模板
    local  app_html = readfile(local_base)
    if not app_html then return _err "页面不存在" end

    -- 检查已登录用户
    local res   = nil
    local user  = res and res.user

    local G = {
            server_date = ngx.today()
        ,   server_time = ngx.now() * 1000
        ,   user        = user
    }

    ngx.header['Content-Type' ] = "text/html;charset=utf-8"
    ngx.header['Cache-Control'] = "no-store"  -- 不缓存

    local _, err = _render(app_html, {
        G  = _encode(G)
    })

    if err then
        ngx.log(ngx.ERR, err)
        return ngx.exit(404)
    end

end

------------------------------------------------------
return __ -- 返回模块
