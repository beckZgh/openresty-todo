
local api     = _load "api"
local pv_user = _load "$pv_user"

local __ = {}
__.ver   = "22.11.10"
__.name  = "api测试"
------------------------------------------------------

local user = {
    user_id="166896029200018523",
    user_name = "beck3",
    mobile = "13728397709",
    password = "123456"
}

local todo_cate = {
    todo_cate_id = "166896195400018432"
}

__.actx = function()
    local t = {
        user_id      = user.user_id,
        -- todo_cate_id = todo_cate.todo_cate_id,
        todo_id   = "166896496400022891",
        todo_name = "待办事项2313"
    }

    -- local res, err = pv_user.get(t)

    local res, err = api.dd.todo.set(t)
    if err then return { ok = false, err = err } end
    -- local res = api.dd.todo_cate.list()
    return res
end

------------------------------------------------------
return __ -- 返回模块
