
return {
--------------------------------------------------------------

    table_name  = "dd_task"
,   table_desc  = "待办任务表"
,   table_index = {

}

,   field_list = {

        { "user_id"         , "用户编码"    , pk = true      },
        { "task_cate_id"    , "分类编码"    , pk = true      },
        { "task_id"         , "任务编码"    , pk = true      },
        { "task_name"       , "任务名称"                     },
        { "task_desc"       , "任务描述"                     },
        { "list_index"      , "任务排序"    , "int", len = 1 },
        { "is_finished"     , "是否完成"    , "int", len = 1 },
        { "is_important"    , "是否重要"    , "int", len = 1 },
        { "myday"           , "我的一天"    , "date"         },
        { "closing_date"    , "截止日期"    , "date"         },
        { "create_time"     , "创建时间"    , "datetime"     },
        { "update_time"     , "更新时间"    , "datetime"     },
    }

--------------------------------------------------------------
}

