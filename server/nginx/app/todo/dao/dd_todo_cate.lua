
return {
--------------------------------------------------------------

    table_name  = "dd_todo_cate"
,   table_desc  = "待办事项分类表"
,   table_index = {

}

,   field_list = {
        { "user_id"        , "用户编码"  , pk = true  },
        { "todo_cate_id"   , "列表编码"  , pk = true  },
        { "todo_cate_pid"  , "分组编码"  , pk = true  },
        { "todo_cate_name" , "列表名称"               },
        { "list_index"     , "排序值"    , "int"      },
    }

--------------------------------------------------------------
}

