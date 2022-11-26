
local dd_todo    = _load "$dd_todo"

local utils      = _load "%utils"
local hashid     = _load "#hashid"


local __ = { ver = "v22.11.21" }

__.get__ = {
    "获取待办事项",
    req = {
        { "user_id", "用户编码" },
        { "todo_id", "事项编码" },
    },
    res = "$dd_todo"
}
__.get = function(t)

    local  res, err = dd_todo.get { user_id = t.user_id, todo_id = t.todo_id }
    if not res then return nil, err and "服务器忙，请稍候再试" or "待办事项不存在" end

    return res

end

__.list__ = {
    "类别列表",
    req = {
        { "user_id"      , "用户编码" },
        { "todo_cate_id?", "分类编码" },
    },
    res = "$dd_todo[]"
}
__.list = function(t)

    local wh = {
        user_id      = t.user_id,
        todo_cate_id = t.todo_cate_id
    }
    if type(t.todo_cate_id) ~= "string" or t.todo_cate_id == "" then wh.todo_cate_id = nil end

    local  res = dd_todo.list(wh)
    if not res then return nil, "服务器忙，请稍候再试" end

    return res

end

__.add__ = {
    "添加待办事项列表",
    log = true,
    req = {
        { "user_id"          , "用户编码"            },
        { "todo_cate_id?"    , "分类编码"            },
        { "todo_name"        , "事项名称"            },
        { "todo_desc?"       , "事项描述"            },
        { "list_index?"      , "事项排序", "number"  },
        { "is_finished?"     , "是否完成", "number"  },
        { "is_important?"    , "是否重要", "number"  },
        { "is_today?"        , "我的一天", "number"  },
        { "closing_date?"    , "截止日期"            },
        -- { "deadline?"        , "截止时间"            },
    },
    res = "$dd_todo"
}
__.add = function(t)

    -- @t : $dd_todo
    t.todo_name    = utils.strip_name(t.todo_name)
    t.todo_id      = hashid.generate()
    t.todo_cate_id = t.todo_cate_id or ""
    t.is_finished  = t.is_finished  or 0
    t.is_important = t.is_important or 0
    t.is_today     = t.is_today     or 0
    t.list_index   = t.list_index   or -1
    t.create_time  = ngx.localtime()
    t.update_time  = ngx.localtime()

    local  ok, err = dd_todo.add (t)
    if not ok then return nil, err end

    return __.get(t)

end

__.set__ = {
    "修改待办事项",
    log = true,
    req = {
        { "user_id"          , "用户编码"            },
        { "todo_id"          , "待办事项编码"        },
        { "todo_name?"       , "事项名称"            },
        { "todo_desc?"       , "事项描述"            },
        { "list_index?"      , "事项排序", "number"  },
        { "is_finished?"     , "是否完成", "number"  },
        { "is_important?"    , "是否重要", "number"  },
        { "is_today?"        , "我的一天", "number"  },
        { "closing_date?"    , "截止日期"            },
    },
    res = "$dd_todo"
}
__.set = function(t)

    -- @t : $dd_todo
    t.cate_name = utils.strip_name(t.cate_name)

    local  tOld, err = __.get(t)
    if not tOld then return nil, err end

    -- 生成待更新的数据
    -- @d : $dd_todo
    local  d, wh = utils.gen_update(t, tOld, "user_id", "todo_id" )
    if not d then return tOld end

    t.update_time = ngx.localtime()

    local  ok, err = dd_todo.set(wh)
    if not ok then return nil, err end

    return __.get(t)

end

__.set_name__ = {
    "修改任务名称",
    log = true,
    req = {
        { "user_id"          , "用户编码"            },
        { "todo_id"          , "待办事项编码"        },
        { "todo_name"        , "事项名称"            },
    },
    res = "$dd_todo"
}
__.set_name = function(t)
    t.cate_name = utils.strip_name(t.cate_name)
    return __.set(t)
end

__.set_is_finished__ = {
    "设置是否重要",
    log = true,
    req = {
        { "user_id"     , "用户编码"            },
        { "todo_id"     , "待办事项编码"        },
        { "is_finished" , "是否完成", "number"  },
    },
    res = "$dd_todo"
}
__.set_is_finished = function(t)
    return __.set(t)
end

__.set_is_important__ = {
    "设置是否重要",
    log = true,
    req = {
        { "user_id"     , "用户编码"            },
        { "todo_id"     , "待办事项编码"        },
        { "is_important", "是否重要", "number"  },
    },
    res = "$dd_todo"
}
__.set_is_important = function(t)
    return __.set(t)
end

__.set_myday__ = {
    "设置为我的一天",
    log = true,
    req = {
        { "user_id" , "用户编码"     },
        { "todo_id" , "待办事项编码" },
        { "myday"   , "我的一天"     },
    },
    res = "$dd_todo"
}
__.set_myday = function(t)
    return __.set(t)
end

__.set_closing_date__ = {
    "设置截止日期",
    log = true,
    req = {
        { "user_id"      , "用户编码"     },
        { "todo_id"      , "待办事项编码" },
        { "closing_date" , "截止日期"     },
    },
    res = "$dd_todo"
}
__.set_closing_date = function(t)

    local  tOld, err = __.get(t)
    if not tOld then return nil, err end

    -- 生成待更新的数据
    -- @d : $dd_todo
    local  d, wh = utils.gen_update(t, tOld, "user_id", "todo_id" )
    if not d then return tOld end

    t.update_time = ngx.localtime()

    local  ok, err = dd_todo.set(wh)
    if not ok then return nil, err end

    return __.get(t)

end

__.del__ = {
    "删除类别",
    log = true,
    req = {
        { "user_id" , "用户编码"     },
        { "todo_id" , "待办事项编码" },
    },
    res = "boolean"
}
__.del = function(t)

    local  ok, err = dd_todo.del { user_id = t.user_id, todo_id = t.todo_id }
    if not ok then return nil, err end

    return true

end

return __
