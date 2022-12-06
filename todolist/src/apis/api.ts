
const $api: any = {}

$api.dd = {
        load : ['dd', 'load'],
}

$api.dd.task = {
                 add : ['dd.task', 'add'],
                 del : ['dd.task', 'del'],
                 get : ['dd.task', 'get'],
                list : ['dd.task', 'list'],
                 set : ['dd.task', 'set'],
    set_closing_date : ['dd.task', 'set_closing_date'],
     set_is_finished : ['dd.task', 'set_is_finished'],
    set_is_important : ['dd.task', 'set_is_important'],
           set_myday : ['dd.task', 'set_myday'],
            set_name : ['dd.task', 'set_name'],
}

$api.dd.task_cate = {
         add : ['dd.task_cate', 'add'],
         del : ['dd.task_cate', 'del'],
         get : ['dd.task_cate', 'get'],
        list : ['dd.task_cate', 'list'],
      rename : ['dd.task_cate', 'rename'],
}

$api.pv = {
    check_login : ['pv', 'check_login'],
          login : ['pv', 'login'],
         logout : ['pv', 'logout'],
       register : ['pv', 'register'],
}

$api.pv.user = {
         add : ['pv.user', 'add'],
         del : ['pv.user', 'del'],
         get : ['pv.user', 'get'],
        list : ['pv.user', 'list'],
         set : ['pv.user', 'set'],
}

export default $api;
