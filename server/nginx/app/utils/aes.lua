
local Aes    = require "resty.aes"
local KEY    = "abcdefgabcdefg12"
local HASH   = { iv = "aaaabbbbccccdddd" }
local CIPHER = Aes.cipher(128, "ecb")

local __ = { _VERSION = "v22.11.26" }

-- 解密文本
__.decrypt = function(text)

    if type(text) ~= "string" or text == "" then
        return nil, "解密文本不能为空"
    end

    local  aes_128_ecb, err = Aes:new(KEY, nil, CIPHER, HASH)
    if not aes_128_ecb then return nil, err end

    local  str_base64 = ngx.decode_base64(text)
    local  str, err = aes_128_ecb:decrypt(str_base64)
    if not str then return nil, err end

    return str

end

-- 加密文本
__.encrypt = function(text)

    if type(text) ~= "string" or text == "" then
        return nil, "加密文本不能为空"
    end

    local  aes_128_ecb, err = Aes:new(KEY, nil, CIPHER, HASH)
    if not aes_128_ecb then return nil, err end

    -- local  str_base64 = ngx.encode_base64(text)
    local  str, err = aes_128_ecb:encrypt(text)
    if not str then return nil, err end

    return ngx.encode_base64(str)

end

return __
