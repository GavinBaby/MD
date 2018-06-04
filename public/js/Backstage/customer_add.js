/**
 * 供应商添加
 */
$(function () {
    // 获取供应商类型
    $.ajax({
        "dataType": 'jsonp',
        "type": "get",
        "timeout": 20000,
        "async": false,
        "url": '/value_mapping/list',
        "data": {diccode:101},
        "success": function (data) {
            debugger;
            console.log(data);
        },
        "error": function (data) {
            console.log(data);
        }
    });

    //确认添加按钮
    $('#add_account_cancel').on('click', function () {
        // 默认允许提交
        var holdSubmit = true;
        if ($('#customer_add_form').isValid()) {
            if (holdSubmit) {
                // 只提交一次
                holdSubmit = false;
                var params = {
                    name:$("#name").val(),
                    address:$("#address").val(),
                    mobile:$("#mobile").val(),
                    fr:$("#fr").val(),
                    lxr:$("#lxr").val(),
                    sh:$("#sh").val(),
                    bank:$("#bank").val(),
                    account:$("#account").val()
                };
                //新建
                if(!$('#seq_no').val()){
                    params.state = 1;
                    $.ajax({
                        "dataType": 'json',
                        "type": "post",
                        "timeout": 20000,
                        "url": '/base/customer',
                        "data": params,
                        "success": function (data) {
                            debugger;
                            // 弹出添加成功信息
                            $('#addAccountModal').modal('hide');
                            $('#sureReset').modal('show');
                        },
                        "error": function (data) {
                            debugger;
                            console.log(data);
                        }
                    });
                }else{   //更新
                    params.seq_no = $('#seq_no').val();
                    $.ajax({
                        "dataType": 'json',
                        "type": "post",
                        "timeout": 20000,
                        "url": '/base/customer',
                        "data": params,
                        "success": function (data) {
                            $('.tabReload').trigger("click");
                        },
                        "error": function (data) {
                            console.log(data);
                        }
                    });
                }

            }
        }
    });
});
