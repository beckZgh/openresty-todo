
local _sub      = string.sub
local _random   = require "resty.random".number
local waf_limit = ngx.shared.app_waf_limit

local hashids   = require "resty.hashids"
local hash      = hashids.new("4006868339@weimember.cn", 18)
local unpack    = unpack

local KEY       = "HASH_INDEX"
local MIN       = 1000
local MAX       = 9999
local PRI       = 53

local __ = { _VERSION = "v21.09.09"}

local LAST_TIME = 0

-- 10位时间戳 + 4位流水号 + 4位随机码
local function get_index()

    local index, err = waf_limit:incr(KEY, 1, 0) -- 流水号加一
    if not index then return nil, err end

    if index == MAX then
        waf_limit:incr(KEY, -MAX)
    elseif index > MAX then
        index = index % MAX -- 取余
    end

    -- 刷新系统时间
    if index == 1 then ngx.update_time() end

    local time = ngx.time()         -- 10位时间戳
    local rand = _random(MIN, MAX)  --  4位随机码

    if time < LAST_TIME then time = LAST_TIME end

    if index == 1 then
        if time <= LAST_TIME then
            time = LAST_TIME + 1
        end
    end

    LAST_TIME = time

    return time .. _sub("0000" .. index, -4) .. rand

end

function __.generate()

    local id  = get_index()
    local ids = __.encode(id)

    return id, ids

end

function __.encode(id, ...)

    if type(id) ~= "string" or #id ~= 18 then
        return nil, "id length must be 18"
    end

    local time  = tonumber(_sub(id,  1, 10))    -- 10位时间戳
    local index = tonumber(_sub(id, 11, 14))    --  4位流水号
    local rand  = tonumber(_sub(id, 15, 18))    --  4位随机码

    if not time or not index or not rand then
        return nil, "wrong number"
    end

    local sign  = (time + index + rand) % PRI
    local ids   = hash:encode(time, index, rand, sign, ...)

    return ids

end

function __.decode(ids)

    if type(ids) ~= "string" or #ids < 18 then return nil, "wrong hash id" end

    local  h = hash:decode(ids)
    if not h then return nil, "decode error" end

    local time  = h[1]    -- 10位时间戳
    local index = h[2]    --  4位流水号
    local rand  = h[3]    --  4位随机码
    local sign  = h[4]    --  验证码

    if not time  then return nil, "time  decode error" end
    if not index then return nil, "index decode error" end
    if not rand  then return nil, "rand  decode error" end
    if not sign  then return nil, "sign  decode error" end

    if sign ~= (time + index + rand) % PRI then
        return nil, "sign error"
    end

    local id = time .. _sub("0000" .. index, -4) .. _sub("0000" .. rand, -4)
    if #id ~= 18 then return nil, "id length must be 18" end

    return id, unpack(h, 5)

end

------------------------------------------------------
return __ -- 返回模块
