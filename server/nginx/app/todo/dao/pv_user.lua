
return {
    --------------------------------------------------------------

        table_name  = "pv_user"
    ,   table_desc  = "系统用户表"
    ,   table_index = {

    }

    ,   field_list = {

            { "user_id"      , "用户编码"    , pk = true     },
            { "user_name"    , "用户名称"    ,               },
            { "user_remark"  , "用户备注"    ,               },
            { "mobile"       , "用户手机"    ,               },
            { "password"     , "用户密码"    ,               },
            { "head_img_url" , "用户头像"    ,  len = 200    },
            { "create_time"  , "创建时间"    ,               },
            { "update_time"  , "更新时间"    ,               },

        }

    --------------------------------------------------------------
    }

