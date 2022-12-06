
local dd_task    = _load "$dd_task"
local utils      = _load "%utils"
local hashid     = _load "#hashid"

local __ = { ver = "v22.12.07" }

__.get__ = {
    "获取待办任务",
    req = {
        { "user_id", "用户编码" },
        { "task_id", "任务编码" },
    },
    res = "$dd_task"
}
__.get = function(t)

    local  res, err = dd_task.get { user_id = t.user_id, task_id = t.task_id }
    if not res then return nil, err and "服务器忙，请稍候再试" or "待办任务不存在" end

    return res

end

__.list__ = {
    "任务列表",
    req = {
        { "user_id"      , "用户编码" },
        { "task_cate_id?", "列表编码" },
    },
    res = "$dd_task[]"
}
__.list = function(t)

    local wh = {
        user_id      = t.user_id,
        task_cate_id = t.task_cate_id or ""
    }

    local res = dd_task.list(wh)
    if not res then return nil, "服务器忙，请稍候再试" end

    return res

end

__.add__ = {
    "添加待办任务",
    req = {
        { "user_id"      , "用户编码" },
        { "task_cate_id?", "列表编码" },
        { "task_name"    , "任务名称" },
    },
    res = "$dd_task"
}
__.add = function(t)

    -- @t : $dd_task
    t.task_id      = hashid.generate()
    t.task_cate_id = t.task_cate_id or ""
    t.task_name    = utils.strip_name(t.task_name)
    t.is_finished  = t.is_finished  or 0
    t.is_important = t.is_important or 0
    t.is_today     = t.is_today     or 0
    t.list_index   = t.list_index   or -1
    t.create_time  = ngx.localtime()
    t.update_time  = ngx.localtime()

    local  ok, err = dd_task.add (t)
    if not ok then return nil, err end

    return __.get(t)

end

__.set__ = {
    "修改待办任务",
    log = true,
    req = {
        { "user_id"       , "用户编码"            },
        { "task_id"       , "待办任务编码"        },
        { "task_name?"    , "任务名称"            },
        { "task_desc?"    , "任务描述"            },
        { "is_finished?"  , "是否完成", "number"  },
        { "is_important?" , "是否重要", "number"  },
        { "is_today?"     , "我的一天", "number"  },
        { "closing_date?" , "截止日期"            },
        { "list_index?"   , "任务排序", "number"  },
    },
    res = "$dd_task"
}
__.set = function(t)

    -- @t : $dd_task
    t.task_name = utils.strip_name(t.task_name)

    local  tOld, err = __.get(t)
    if not tOld then return nil, err end

    -- 生成待更新的数据
    -- @d : $dd_task
    local  d, wh = utils.gen_update(t, tOld, "user_id", "task_id" )
    if not d then return tOld end

    t.update_time = ngx.localtime()

    local  ok, err = dd_task.set(wh)
    if not ok then return nil, err end

    return __.get(t)

end

__.set_name__ = {
    "修改任务名称",
    req = {
        { "user_id"   , "用户编码"  },
        { "task_id"   , "任务编码"  },
        { "task_name" , "任务名称"  },
    },
    res = "$dd_task"
}
__.set_name = function(t)
    t.task_name = utils.strip_name(t.task_name)
    return __.set(t)
end

__.set_is_finished__ = {
    "设置是否重要",
    log = true,
    req = {
        { "user_id"     , "用户编码"            },
        { "task_id"     , "任务编码"            },
        { "is_finished" , "是否完成", "number"  },
    },
    res = "$dd_task"
}
__.set_is_finished = function(t)
    return __.set(t)
end

__.set_is_important__ = {
    "设置是否重要",
    req = {
        { "user_id"     , "用户编码"            },
        { "task_id"     , "任务编码"            },
        { "is_important", "是否重要", "number"  },
    },
    res = "$dd_task"
}
__.set_is_important = function(t)
    return __.set(t)
end

__.set_myday__ = {
    "设置为我的一天",
    log = true,
    req = {
        { "user_id" , "用户编码" },
        { "task_id" , "任务编码" },
        { "myday"   , "我的一天" },
    },
    res = "$dd_task"
}
__.set_myday = function(t)
    return __.set(t)
end

__.set_closing_date__ = {
    "设置截止日期",
    log = true,
    req = {
        { "user_id"      , "用户编码" },
        { "task_id"      , "任务编码" },
        { "closing_date" , "截止日期" },
    },
    res = "$dd_task"
}
__.set_closing_date = function(t)

    local  tOld, err = __.get(t)
    if not tOld then return nil, err end

    -- 生成待更新的数据
    -- @d : $dd_task
    local  d, wh = utils.gen_update(t, tOld, "user_id", "task_id" )
    if not d then return tOld end

    t.update_time = ngx.localtime()

    local  ok, err = dd_task.set(wh)
    if not ok then return nil, err end

    return __.get(t)

end

__.del__ = {
    "删除任务",
    req = {
        { "user_id" , "用户编码" },
        { "task_id" , "任务编码" },
    },
    res = "boolean"
}
__.del = function(t)

    local  ok, err = dd_task.del { user_id = t.user_id, task_id = t.task_id }
    if not ok then return nil, err end

    return true

end

return __
