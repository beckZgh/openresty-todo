
local dd_todo_cate = _load "$dd_todo_cate"
local dd_todo      = _load "$dd_todo"

local pv_user      = _load "$pv_user"
local utils        = _load "%utils"
local hashid       = _load "%hashid"
local db           = _load "%db"

local __ = { ver = "v22.11.21" }

__.get__ = {
    "获取待办事项分类",
    req = {
        { "user_id"     , "用户编码"         },
        { "todo_cate_id", "待办事项分类编码" },
    },
    res = "$dd_todo_cate"
}
__.get = function(t)

    local  res, err = dd_todo_cate.get { user_id = t.user_id, todo_cate_id = t.todo_cate_id  }
    if not res then return nil, err and "服务器忙，请稍候再试" or "待办事项分类不存在" end

    return res

end

__.list__ = {
    "待办事项分类列表",
    req = {
        { "user_id", "用户编码" },
    },
    res = "$dd_todo_cate[]"
}
__.list = function(t)

    local  res = dd_todo_cate.list { user_id = t.user_id }
    if not res then return nil, "服务器忙，请稍候再试" end

    return res

end

__.add__ = {
    "添加待办事项分类",
    log = true,
    req = {
        { "user_id"        , "用户编码"             },
        { "todo_cate_id?"  , "分类编码"             },
        { "todo_cate_name" , "分类名称"             },
        { "todo_cate_pid?" , "分组编码"             },
        { "list_index?"    , "排序值"   , "number"  },
    },
    res = "$dd_todo_cate"
}
__.add = function(t)

    -- 检查用户
    local  u, err = pv_user.get({ user_id = t.user_id })
    if not u then return nil, err end

    t.user_id        = t.user_id
    t.todo_cate_id   = hashid.generate()
    t.todo_cate_name = t.todo_cate_name
    t.todo_cate_pid  = t.todo_cate_pid or ''
    t.list_index     = t.list_index or -1

    local  ok, err = dd_todo_cate.add (t)
    if not ok then return nil, err end

    return __.get(t)

end

__.set__ = {
    "修改待办事项分类",
    log = true,
    req = {
        { "user_id"        , "用户编码"             },
        { "todo_cate_id"   , "分类编码"             },
        { "todo_cate_pid?" , "分组编码"             },
        { "todo_cate_name" , "列表名称"             },
        { "list_index?"    , "排序值"   , "number"  },
    },
    res = "$dd_todo_cate"
}
__.set = function(t)

    local  tOld, err = __.get(t)
    if not tOld then return nil, err end

    -- 生成待更新的数据
    -- @d : $dd_todo_cate
    local  d, wh = utils.gen_update(t, tOld, "user_id", "todo_cate_id")
    if not d then return tOld end

    t.update_time = ngx.localtime()

    local  ok, err = dd_todo_cate.set(wh)
    if not ok then return nil, err end

    return __.get(t)

end

__.del__ = {
    "删除待办事项分类",
    log = true,
    req = {
        { "user_id"     , "用户编码"         },
        { "todo_cate_id", "待办事项列表编码" },
    },
    res = "boolean"
}
__.del = function(t)

    local  res, err = __.get(t)
    if not res then return nil, err end

    -- 取得关联的待办事项
    local todos, err = dd_todo.list({ user_id = t.user_id, todo_cate_id = t.todo_cate_id })
    if err then return nil, err end

    local sqls, i = {}, 1
    sqls[i] = dd_todo_cate:del({ user_id = t.user_id, todo_cate_id = t.todo_cate_id  })

    -- 清空删除列表关联
    for _, todo in ipairs(todos) do
        i = i + 1
        sqls[i] = dd_todo:set({ user_id = t.user_id, todo_id = todo.todo_id }, { todo_cate_id = "" })
    end

    local  ok, err = db.trans(sqls)
    if not ok then return nil, err end

    return true

end

return __
