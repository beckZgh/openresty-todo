
const $api: any = {}

$api.dd = {
        load : ['dd', 'load'],
}

$api.dd.todo = {
                 add : ['dd.todo', 'add'],
                 del : ['dd.todo', 'del'],
                 get : ['dd.todo', 'get'],
                list : ['dd.todo', 'list'],
                 set : ['dd.todo', 'set'],
    set_closing_date : ['dd.todo', 'set_closing_date'],
     set_is_finished : ['dd.todo', 'set_is_finished'],
    set_is_important : ['dd.todo', 'set_is_important'],
           set_myday : ['dd.todo', 'set_myday'],
            set_name : ['dd.todo', 'set_name'],
}

$api.dd.todo_cate = {
         add : ['dd.todo_cate', 'add'],
         del : ['dd.todo_cate', 'del'],
         get : ['dd.todo_cate', 'get'],
        list : ['dd.todo_cate', 'list'],
         set : ['dd.todo_cate', 'set'],
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
