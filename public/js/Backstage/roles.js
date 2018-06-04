/**
 * Created by Administrator on 2017/5/19 0019.
 */
$(function () {
    var $p_id = $("#roles_page");
    //弹出框居中
    $('.modal').on('show.bs.modal', function () {
        $(this).addClass('modal-outer');
    }).on('hidden.bs.modal', function () {
        $(this).removeClass('modal-outer');
    });
//树形菜单
    function getTree(type){
        var list=[];
       $.ajax({
            "dataType": 'json',
            "type": "get",
            "timeout": 20000,
            "async": false,
            "url": '/menu/list',
            "data": {},
            "success": function (data) {
                var a;
                var obj_list;
                for(i=0;i<data.data.length;i++){
                    a="N";
                    obj_list="";
                    if(data.data[i].p_id ==""){
                        obj_list ={
                            id:data.data[i].seq_no,
                            text:data.data[i].name,
                            children:[]
                        };
                        a = data.data[i].seq_no;
                    }
                    for(j=0;j<data.data.length;j++) {
                        if (data.data[j].p_id == a) {
                            obj_list.children.push({id: data.data[j].seq_no, text: data.data[j].name,children:[]});
                        }
                    }

                    if(obj_list!=""){
                        for(j=0;j<obj_list.children.length;j++) {
                            for(k=0;k<data.data.length;k++) {
                                if (data.data[k].p_id == obj_list.children[j].id) {
                                    obj_list.children[j].children.push({id: data.data[k].seq_no, text: data.data[k].name,children:[]});
                                }
                            }
                        }
                        for(j=0;j<obj_list.children.length;j++) {
                            for(z=0;z<obj_list.children[j].children.length;z++) {
                                for(k=0;k<data.data.length;k++) {
                                    if (data.data[k].p_id == obj_list.children[j].children[z].id) {
                                        obj_list.children[j].children[z].children.push({id: data.data[k].seq_no, text: data.rows[k].name});
                                    }
                                }
                            }
                        }
                        list.push(obj_list);
                    }

                }
            if(type=="add"){
                $p_id.find('.tree_add').unbind();
                $p_id.find('.tree_add').tree(list);
            }else{
                $p_id.find('.tree_edit').unbind();
                $p_id.find('.tree_edit').tree(list);
            }
            },
            "error": function (data) {
                console.log(data);
            }
        });
    }

    //查询

    function into() {
        var num_size = 0;
        var params = { // 查询查询参数
            rolename:$p_id.find("#rolename").val()//角色名称
        };

        var table_src = $p_id.find('#role_Table'); // 定义指向
        var ajax_url = '/role/list'; // 定义数据请求路径
        var pageSize = 10 ;// 定义每页长度默认为10
        var aoColumns = [
            {"col_id": "seq_no"},
            {"col_id": "name"},
            {"col_id": "remark"},
            {"col_id": "operat_name"},
            {"col_id": "operat_time"}
        ]; // 定义表格数据列id
        var aoColumnDefs = [{
            "colIndex": 0,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-center" style="font-size: 14px;">'+data+'</div></td>';
            }
        }, {
            "colIndex": 1,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-center" style="font-size: 14px;">'+data+'</div></td>';

            }
        }, {
            "colIndex": 2,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-center" style="font-size: 14px;">'+data+'</div></td>';
            }
        },{
            "colIndex": 3,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-center" style="font-size: 14px;">'+data+'</div></td>';
            }
        },{
            "colIndex": 4,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-center" style="font-size: 14px;">'+data+'</div></td>';
            }
        },{
            "colIndex": 5,
            "html": function (data, type, full) {
                var html=""
                if(full.seq_no!=1){
                    html='<li><a class="employee_del" href="javascript:void(0)" data-id="'+full.seq_no+'"  menu_id = "'+full.seq_no+'" data-toggle="modal">删除</a></li>';
                }
                return  '<td><div class="drop-opt"><a href="javascript:;" id="dropLabel-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">详情<span class="icon-chevron-down"></span></a>'+
                    '<ul class="drop-cnt in" role="menu" aria-labelledby="dropLabel-1">'+
                    '<li><a class="employee_edit"  href="javascript:void(0)"data-id="'+full.seq_no+'"data-type="'+full.seq_no+'"data-name="'+full.name+'" data-title="'+full.remark+'" data-toggle="modal">更改</a></li>'+ html+
                    '   </ul></div></td>';
            }
        }]; // 定义需要改变的列

        // 列表为空时的数据
        var sZeroRecords = '<p class="text-gray-light ml-2 font-18">没有满足搜索条件的结果</p>';

        // 绘画表格
        TableAjax.drawTable(table_src, ajax_url, pageSize, aoColumns, aoColumnDefs, params, sZeroRecords, fnChangeDataCallback,fnDrawCallback);
    };

    //获取到数据的回调函数，需要更该时可定义
    function fnChangeDataCallback(data){
        return data;
    }
    //绘画完成之后的回调函数
    function fnDrawCallback(data){

        $p_id = $("#roles_page");

        //删除的触发事件
        $p_id.find(".employee_del").on("click",function(){
            var d_seqno = {seq_no:$(this).attr('data-id')};
            $p_id.find("#sureDel").modal('show');
            $p_id.find("#confirmDialog").on("click", function () {
                $.ajax({
                    "dataType": 'json',
                    "type": "post",
                    "timeout": 20000,
                    "async": false,
                    "url":'/role_info/del',
                    "data": d_seqno,
                    "success": function (data) {
                        $('.tabReload').trigger("click");
                    },
                    "error": function (data) {
                        console.log(data);
                    }
                });
            });
        });


        //更改的触发事件
        $p_id.find(".employee_edit").on("click",function(){
            getTree("edit");


            $p_id.find("#edit_form")[0].reset();
            $p_id.find('#e_seq_no').val($(this).attr('data-id'));
            $p_id.find('#e_roleno').val($(this).attr('data-type'));
            $p_id.find('#e_rolename').val($(this).attr('data-name'))
            $p_id.find('#e_remarks').val($(this).attr('data-title'));
            var cc =  $p_id.find(".tree_edit").find(".tree-node-checkbox");
            cc.removeClass("checked half-checked");
            var $node = cc.closest('.tree-node');
            $p_id.find(".tree_edit").find(".tree-nodes").css("display" , "block");
            $p_id.find(".tree_edit").find('.tree-node').removeClass('expand');
            $p_id.find(".tree_edit").find(".tree-node-toggle").addClass("expand");

            var seqno = $(this).attr('data-id');
            var sys=[];
            $.ajax({
                "dataType": 'json',
                "type": "get",
                "timeout": 20000,
                "async": false,
                "url": '/role/get',
                "data": {seq_no:seqno},
                "success": function (data) {
                    sys = data.menu_list;
                    for(var j=0;j<sys.length;j++){
                        var bb =sys[j].seq_no;//标签id
                        var bbr = sys[j].p_id;//父级id
                        var $checkboxes = $node.find("#"+bb+"");
                        var $checkb = $node.find("#"+bbr+"");
                        $checkboxes.addClass('checked');
                    }
                    $p_id.find("#editusername").modal('show');
                },
                "error": function (data) {
                    console.log(data);
                }
            });
        });
        return data;
    }
    into();
//点击添加新数据的触发事件
    $p_id.find("#addStaffModal").on("click", function () {
        $p_id.find("#add_form")[0].reset();
        getTree("add");
        $p_id.find("#newusername").modal('show');
    });


    //添加窗口中的确认事件
    $p_id.find("#open_user").on("click", function () {
        // 默认允许提交
        var holdSubmit = true;
        var str=[];
        var clast = $p_id.find(".tree_add").find(".tree-node-checkbox.checked");
        var clast1 = $p_id.find(".tree_add").find(".tree-node-checkbox.half-checked");
        for(var i=0;i< clast.length;i++){
            str.push(clast[i].id);
        }
        for(var i=0;i< clast1.length;i++){
            str.push(clast1[i].id);
        }

        if(str.length==0){
            alert("请授权相关菜单");
            return;
        }
        if ($p_id.find('#add_form').isValid()) {
            if (holdSubmit) {
                // 只提交一次
                holdSubmit = false;
                var  addlist = {
                    name: $p_id.find('#a_rolename').val(),
                    remark: $p_id.find('#a_remarks').val(),
                    menu_id:str.join(','),
                    state:1
                }
                $.ajax({
                    "dataType": 'json',
                    "type": "post",
                    "timeout": 20000,
                    "async": false,
                    "url": '/role/edit',
                    "data": addlist,
                    "success": function (data) {
                        $('.tabReload').trigger("click");
                    },
                    "error": function (data) {
                        console.log(data);
                    }
                });
            }
        }
    });


    //修改页面的确认触发事件
    $p_id.find("#open_edit").on('click', function () {
        var str=[];
        var clast = $p_id.find(".tree_edit").find(".tree-node-checkbox.checked");
        var clast1 = $p_id.find(".tree_edit").find(".tree-node-checkbox.half-checked");
        for(var i=0;i< clast.length;i++){
            str.push(clast[i].id);
        }
        for(var i=0;i< clast1.length;i++){
            str.push(clast1[i].id);
        }
        if(str.length==0){
            alert("请授权相关菜单");
            return;
        }

        var editlist={
            name: $p_id.find('#e_rolename').val(),
            remark: $p_id.find('#e_remarks').val(),
            menu_id:str.join(','),
            roleNo : $p_id.find('#e_roleno').val(),
            seq_no : Number($p_id.find('#e_seq_no').val())
        };
        $.ajax({
            "dataType": 'json',
            "type": "post",
            "timeout": 20000,
            "async": false,
            "url": '/role/edit',
            "data": editlist,
            "success": function (data) {
                $('.tabReload').trigger("click");
            },
            "error": function (data) {
                console.log(data);
            }
        });
    });

});

