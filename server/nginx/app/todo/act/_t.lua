local api = _load "api"

local __ = {}
__.ver   = "22.11.10"
__.name  = "api测试"
------------------------------------------------------
__.actx = function()

    return api.dd.todo.add({
        user_id = "166940122400086820",
        todo_name = "test1"
    })
end

------------------------------------------------------
return __ -- 返回模块
