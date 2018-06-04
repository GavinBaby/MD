/**
 * 销售日报
 */
$(function () {
    //确认添加按钮
    $('#save_sales').on('click', function () {
        // 默认允许提交
        var holdSubmit = true;
        if ($('#sales_add_form').isValid()) {
            if (holdSubmit) {
                // 只提交一次
                holdSubmit = false;
                var params = {
                    barcode:$("#name").val(),
                    name_cn:$("#address").val(),
                    name_en:$("#mobile").val(),
                    supplier:$("#fr").val(),
                    type:$("#lxr").val(),
                    address:$("#sh").val(),
                    gg:$("#bank").val(),
                    price:$("#account").val(),
                    rate:$("#account").val(),
                    watchvalue:$("#account").val(),
                    weight:$("#account").val()
                };
                //新建
                if(!$('#seq_no').val()){
                    params.state = 1;
                    $.ajax({
                        "dataType": 'json',
                        "type": "post",
                        "timeout": 20000,
                        "url": '/base/product',
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
