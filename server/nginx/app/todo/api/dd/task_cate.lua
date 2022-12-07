
local dd_task_cate = _load "$dd_task_cate"
local dd_task      = _load "$dd_task"
local pv_user      = _load "$pv_user"
local utils        = _load "%utils"
local hashid       = _load "#hashid"
local db           = _load "%db"

local __ = { ver = "v22.12.07" }

__.get__ = {
    "获取待办事项列表/分组",
    req = {
        { "user_id"     , "用户编码"         },
        { "task_cate_id", "待办事项列表编码" },
    },
    res = "$dd_task_cate"
}
__.get = function(t)

    local  res, err = dd_task_cate.get { user_id = t.user_id, task_cate_id = t.task_cate_id  }
    if not res then return nil, err and "服务器忙，请稍候再试" or "待办事项列表不存在" end

    return res

end

__.list__ = {
    "获取所有待办事项列表/分组",
    req = {
        { "user_id", "用户编码" },
    },
    res = "$dd_task_cate[]"
}
__.list = function(t)
    return dd_task_cate.list {
        user_id   = t.user_id,
       _order_by  = "list_index, task_cate_id"
    }
end

__.add__ = {
    "添加待办事项列表/分组",
    req = {
        { "user_id"         , "用户编码"             },
        { "task_cate_id?"   , "列表编码"             },
        { "task_cate_pid?"  , "分组编码"             },
        { "task_cate_name"  , "列表/分组名称"        },
        { "task_cate_type?" , "数据类型" , "number"  }, -- 0 分组 1 列表
        { "list_index?"     , "排序值"   , "number"  },
    },
    res = "$dd_task_cate"
}
__.add = function(t)

    -- 检查用户
    local  u, err = pv_user.get({ user_id = t.user_id })
    if not u then return nil, err end

    t.user_id        = t.user_id
    t.task_cate_id   = hashid.generate()
    t.task_cate_pid  = t.task_cate_pid  or ""
    t.task_cate_name = t.task_cate_name or "无标题列表"
    t.task_cate_type = t.task_cate_type or 1
    t.list_index     = t.list_index     or -1

    local  ok, err = dd_task_cate.add (t)
    if not ok then return nil, err end

    return __.get(t)

end

__.rename__ = {
    "重命名待办事项列表/分组",
    req = {
        { "user_id"        , "用户编码"             },
        { "task_cate_id"   , "列表编码"             },
        { "task_cate_name" , "列表/分组名称"        },
    },
    res = "$dd_task_cate"
}
__.rename = function(t)

    local  tOld, err = __.get(t)
    if not tOld then return nil, err end

    -- 生成待更新的数据
    -- @d : $dd_task_cate
    local  d, wh = utils.gen_update(t, tOld, "user_id", "task_cate_id")
    if not d then return tOld end

    t.update_time = ngx.localtime()

    local  ok, err = dd_task_cate.set(wh)
    if not ok then return nil, err end

    return __.get(t)

end

__.move__ = {
    "移动列表至分组或取消分组",
    req = {
        { "user_id"        , "用户编码"             },
        { "task_cate_id"   , "列表编码"             },
        { "task_cate_pid?" , "列表/分组编码"        },
    },
    res = "$dd_task_cate"
}
__.move = function(t)

    t.task_cate_pid = t.task_cate_pid or "" -- 未传入则表示取消分组

    local  tOld, err = __.get({ user_id = t.user_id, task_cate_id = t.task_cate_id })
    if not tOld then return nil, err end

    -- 生成待更新的数据
    -- @d : $dd_task_cate
    local  d, wh = utils.gen_update(t, tOld, "user_id", "task_cate_id")
    if not d then return tOld end

    t.update_time = ngx.localtime()

    local  ok, err = dd_task_cate.set(wh)
    if not ok then return nil, err end

    return __.get(t)

end

__.del__ = {
    "删除待办事项列表/分组",
    log = true,
    req = {
        { "user_id"     , "用户编码"         },
        { "task_cate_id", "待办事项列表编码" },
    },
    res = "boolean"
}
__.del = function(t)

    local  res, err = __.get(t)
    if not res then return nil, err end

    -- 取得关联的待办任务
    local tasks, err = dd_task.list({ user_id = t.user_id, task_cate_id = t.task_cate_id })
    if err then return nil, err end

    -- 删除当前列表
    local sqls, i = {}, 1
    sqls[i] = dd_task_cate:del({ user_id = t.user_id, task_cate_id = t.task_cate_id  })

    -- 删除当前列表关联的任务
    for _, task in ipairs(tasks) do
        i = i + 1
        sqls[i] = dd_task:del({ user_id = t.user_id, id = task.task_id, task_cate_id = t.task_cate_id })
    end

    -- 事务执行
    local  ok, err = db.trans(sqls)
    if not ok then return nil, err end

    return true

end

__.sort__ = {
    "排序待办事项列表/分组",
    log = true,
    req = {
        { "user_id", "用户编码"                     },
        { "ids"    , "待办事项列表编码", "string[]" },
    },
    res = "boolean"
}
__.sort = function(t)

    if #t.ids == 0 then return nil, "列表编码列表不能为空" end

    -- 构造对应的编码设置对象的排序值
    local sqls = {}
    for i, id in ipairs(t.ids) do
        sqls[i] = dd_task_cate:set { user_id = t.user_id, task_cate_id = id, { list_index = i } }
    end

    -- 事务执行
    local  ok, err = db.trans(sqls)
    if not ok then return nil, err end

    return true

end

return __
