
local api = _load "api"

local __ = { _VERSION = "v22.11.26" }

__.load__ = {
    "加载基础数据",
    req = {
        { "user_id", "用户编码" },
    },
    res = {
        { "tasks"     , "用户信息" , "$dd_todo"      },
        { "task_cates", "用户信息" , "$dd_todo_cate" },
    }
}
__.load = function(t)
    local tasks      = api.dd.todo.list(t)
    local task_cates = api.dd.todo_cate.list(t)

    return { tasks = tasks or {}, task_cates = task_cates or {} }
end

return __
