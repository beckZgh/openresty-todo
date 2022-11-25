
return {
--------------------------------------------------------------

    table_name  = "dd_todo"
,   table_desc  = "待办事项表"
,   table_index = {

}

,   field_list = {

        { "user_id"         , "用户编码"    , pk = true      },
        { "todo_cate_id"    , "分类编码"    , pk = true      },
        { "todo_id"         , "事项编码"    , pk = true      },
        { "todo_name"       , "事项名称"                     },
        { "todo_desc"       , "事项描述"                     },
        { "list_index"      , "事项排序"    , "int", len = 1 },
        { "is_finished"     , "是否完成"    , "int", len = 1 },
        { "is_important"    , "是否重要"    , "int", len = 1 },
        { "myday"           , "我的一天"    , "date"         },
        { "closing_date"    , "截止日期"    , "date"         },
        { "create_time"     , "创建时间"    , "datetime"     },
        { "update_time"     , "更新时间"    , "datetime"     },
    }

--------------------------------------------------------------
}

