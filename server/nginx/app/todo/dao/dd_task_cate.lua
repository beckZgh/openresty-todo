
return {
--------------------------------------------------------------

    table_name  = "dd_task_cate"
,   table_desc  = "待办事项列表表"
,   table_index = {

}

,   field_list = {
        { "user_id"        , "用户编码"  , pk = true  },
        { "task_cate_id"   , "列表编码"  , pk = true  },
        { "task_cate_pid"  , "分组编码"  , pk = true  },
        { "task_cate_name" , "列表名称"               },
        { "task_cate_type" , "列表类型"  , "int"      }, -- 0 分组 1 列表
        { "list_index"     , "排序值"    , "int"      },
    }

--------------------------------------------------------------
}

