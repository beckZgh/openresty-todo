
declare namespace $api {


    /** 返回类型 */
    type Response <T> = Promise <{
        /** 调用成功     */ ok          : boolean ;
        /** 错误信息     */ err         : string  ;
        /** 返回数据     */ data        : T       ;
        /** 服务器日期   */ server_date : string  ;
        /** 服务器时间戳 */ server_time : number  ;
    }>

    /** 请求设置 */
    interface Option {
        /** 显示加载中   */ showLoading? : boolean ;
        /** 显示错误信息 */ showError?   : boolean ; // 出错时显示错误信息，不返回结果
        /** 延时加载中   */ delay?       : boolean | number;
        /** 其它设置     */ [key: string]: any  ;
    }


    /** 待办事项表 */
    interface $dd_todo {
        /** 用户编码 */ user_id      : string ;
        /** 分类编码 */ todo_cate_id : string ;
        /** 事项编码 */ todo_id      : string ;
        /** 事项名称 */ todo_name    : string ;
        /** 事项描述 */ todo_desc    : string ;
        /** 事项排序 */ list_index   : number ;
        /** 是否完成 */ is_finished  : number ;
        /** 是否重要 */ is_important : number ;
        /** 我的一天 */ myday        : string ;
        /** 截止日期 */ closing_date : string ;
        /** 创建时间 */ create_time  : string ;
        /** 更新时间 */ update_time  : string ;
    }

    /** 待办事项分类表 */
    interface $dd_todo_cate {
        /** 用户编码 */ user_id        : string ;
        /** 列表编码 */ todo_cate_id   : string ;
        /** 分组编码 */ todo_cate_pid  : string ;
        /** 列表名称 */ todo_cate_name : string ;
        /** 排序值   */ list_index     : number ;
    }

    /** 系统用户表 */
    interface $pv_user {
        /** 用户编码 */ user_id      : string ;
        /** 用户名称 */ user_name    : string ;
        /** 用户备注 */ user_remark  : string ;
        /** 用户手机 */ mobile       : string ;
        /** 用户密码 */ password     : string ;
        /** 用户头像 */ head_img_url : string ;
        /** 创建时间 */ create_time  : string ;
        /** 更新时间 */ update_time  : string ;
    }

}

declare namespace $api.dd {  // v22.11.26

    /** 加载基础数据 */
    function load (req?: {
        /** 用户编码 */ user_id? : string ;

    }, opt?: Option): Response <{
        /** 用户信息 */ tasks      : $dd_todo[]     ;
        /** 用户信息 */ task_cates : $dd_todo_cate[];
    }>;

}

declare namespace $api.dd.todo {

    /** 添加待办事项列表 */
    function add (req : {
        /** 用户编码 */ user_id?      : string ;
        /** 分类编码 */ todo_cate_id? : string ;
        /** 事项名称 */ todo_name     : string ;
        /** 事项描述 */ todo_desc?    : string ;
        /** 事项排序 */ list_index?   : number ;
        /** 是否完成 */ is_finished?  : number ;
        /** 是否重要 */ is_important? : number ;
        /** 我的一天 */ is_today?     : number ;
        /** 截止日期 */ closing_date? : string ;
    }, opt?: Option): Response <$dd_todo>;

    /** 删除类别 */
    function del (req : {
        /** 用户编码     */ user_id? : string ;
        /** 待办事项编码 */ todo_id  : string ;
    }, opt?: Option): Response <boolean>;

    /** 获取待办事项 */
    function get (req : {
        /** 用户编码 */ user_id? : string ;
        /** 事项编码 */ todo_id  : string ;
    }, opt?: Option): Response <$dd_todo>;

    /** 类别列表 */
    function list (req?: {
        /** 用户编码 */ user_id?      : string ;
        /** 分类编码 */ todo_cate_id? : string ;
    }, opt?: Option): Response <$dd_todo[]>;

    /** 修改待办事项 */
    function set (req : {
        /** 用户编码     */ user_id?      : string ;
        /** 待办事项编码 */ todo_id       : string ;
        /** 事项名称     */ todo_name?    : string ;
        /** 事项描述     */ todo_desc?    : string ;
        /** 事项排序     */ list_index?   : number ;
        /** 是否完成     */ is_finished?  : number ;
        /** 是否重要     */ is_important? : number ;
        /** 我的一天     */ is_today?     : number ;
        /** 截止日期     */ closing_date? : string ;
    }, opt?: Option): Response <$dd_todo>;

    /** 设置截止日期 */
    function set_closing_date (req : {
        /** 用户编码     */ user_id?     : string ;
        /** 待办事项编码 */ todo_id      : string ;
        /** 截止日期     */ closing_date : string ;
    }, opt?: Option): Response <$dd_todo>;

    /** 设置是否重要 */
    function set_is_finished (req : {
        /** 用户编码     */ user_id?    : string ;
        /** 待办事项编码 */ todo_id     : string ;
        /** 是否完成     */ is_finished : number ;
    }, opt?: Option): Response <$dd_todo>;

    /** 设置是否重要 */
    function set_is_important (req : {
        /** 用户编码     */ user_id?     : string ;
        /** 待办事项编码 */ todo_id      : string ;
        /** 是否重要     */ is_important : number ;
    }, opt?: Option): Response <$dd_todo>;

    /** 设置为我的一天 */
    function set_myday (req : {
        /** 用户编码     */ user_id? : string ;
        /** 待办事项编码 */ todo_id  : string ;
        /** 我的一天     */ myday    : string ;
    }, opt?: Option): Response <$dd_todo>;

    /** 修改任务名称 */
    function set_name (req : {
        /** 用户编码     */ user_id?  : string ;
        /** 待办事项编码 */ todo_id   : string ;
        /** 事项名称     */ todo_name : string ;
    }, opt?: Option): Response <$dd_todo>;

}

declare namespace $api.dd.todo_cate {

    /** 添加待办事项分类 */
    function add (req : {
        /** 用户编码 */ user_id?       : string ;
        /** 分类编码 */ todo_cate_id?  : string ;
        /** 分类名称 */ todo_cate_name : string ;
        /** 分组编码 */ todo_cate_pid? : string ;
        /** 排序值   */ list_index?    : number ;
    }, opt?: Option): Response <$dd_todo_cate>;

    /** 删除待办事项分类 */
    function del (req : {
        /** 用户编码         */ user_id?     : string ;
        /** 待办事项列表编码 */ todo_cate_id : string ;
    }, opt?: Option): Response <boolean>;

    /** 获取待办事项分类 */
    function get (req : {
        /** 用户编码         */ user_id?     : string ;
        /** 待办事项分类编码 */ todo_cate_id : string ;
    }, opt?: Option): Response <$dd_todo_cate>;

    /** 待办事项分类列表 */
    function list (req?: {
        /** 用户编码 */ user_id? : string ;
    }, opt?: Option): Response <$dd_todo_cate[]>;

    /** 修改待办事项分类 */
    function set (req : {
        /** 用户编码 */ user_id?       : string ;
        /** 分类编码 */ todo_cate_id   : string ;
        /** 分组编码 */ todo_cate_pid? : string ;
        /** 列表名称 */ todo_cate_name : string ;
        /** 排序值   */ list_index?    : number ;
    }, opt?: Option): Response <$dd_todo_cate>;

}

declare namespace $api.pv {  // v22.11.21

    /** 检查已登录用户 [local] */
    function check_login (req?: object, opt?: Option): Response <{
        /** 用户信息 */ user : pv_user ;
    }>;

    /** 手机密码登录 */
    function login (req : {
        /** 手机号码 */ mobile   : string ;
        /** 用户密码 */ password : string ;

    }, opt?: Option): Response <{
        /** 用户信息 */ user       : $pv_user         ;
        /** 待办任务 */ tasks      : $dd_todo[]       ;
        /** 任务列表 */ task_cates : $dd_todo_catep[] ;
    }>;

    /** 退出登录 */
    function logout (req?: object, opt?: Option): Response <any>;

    /** 手机密码注册 */
    function register (req : {
        /** 用户昵称 */ user_name? : string ;
        /** 手机号码 */ mobile     : string ;
        /** 用户密码 */ password   : string ;
    }, opt?: Option): Response <boolean>;

}

declare namespace $api.pv.user {

    /** 添加用户 */
    function add (req : {
        /** 用户名称 */ user_name     : string ;
        /** 用户描述 */ user_remark?  : string ;
        /** 手机号码 */ mobile        : string ;
        /** 用户密码 */ password      : string ;
        /** 用户头像 */ head_img_url? : string ;
    }, opt?: Option): Response <$pv_user>;

    /** 删除用户 */
    function del (req?: {
        /** 用户编码 */ user_id? : string ;
    }, opt?: Option): Response <any>;

    /** 获取用户 */
    function get (req?: {
        /** 用户编码 */ user_id? : string ;
    }, opt?: Option): Response <$pv_user>;

    /** 用户列表 */
    function list (req?: object, opt?: Option): Response <$pv_user[]>;

    /** 修改用户 */
    function set (req?: {
        /** 用户编码 */ user_id?      : string ;
        /** 用户名称 */ user_name?    : string ;
        /** 用户描述 */ user_remark?  : string ;
        /** 手机号码 */ mobile?       : string ;
        /** 用户密码 */ password?     : string ;
        /** 用户头像 */ head_img_url? : string ;
    }, opt?: Option): Response <$pv_user>;

}
