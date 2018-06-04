$(function() {
	var _w = 456;
	var _h = 344;
	var _old = {};
	var _new = {};
	var _txt = $(".textarea textarea");

	$("#uploadpz").on("change", function() {
		var _this = $(this);
		var fr = new FileReader();
		fr.readAsDataURL(this.files[0]);

		var img = new Image();
		var btn = _this.parent();
		btn.hide();
		var upImg = btn.siblings("#displaypz");
		upImg.addClass("loading");
		fr.onload = function() {
			img.src = this.result;
			img.onload = function() {
				btn.siblings("#displaypz").html(img);
				var ratio = 1;
				if (img.width > img.height) {
					upImg.find("img").addClass("mh");
					ratio = _h / img.height;
				} else {
					upImg.find("img").addClass("mw");
					ratio = _w / img.width;
				}
				upImg.find("img").attr('width','100%').attr('height','100%');
				$("#uploadpz").parent().css('display','block');
				var scroll = new IScroll(upImg[0], {
					zoom : true,
					scrollX : true,
					scrollY : true,
					mouseWheel : true,
					bounce : false,
					wheelAction : 'zoom'
				});
					//ajaxFileUpload("image_btn2", "#image2");
					_new.img = img;
					_new.scroll = scroll;
					_new.ratio = ratio;

				setTimeout(function() {
					upImg.removeClass("loading").find("img").css("opacity", 1);
				}, 1000);
			}
		}
	});
	$("#upload_button").click(function(){
		if(upload_true){
			upload_true = false;
			ajaxFileUpload('uploadpz','#displaypz')
		}

		// $.ajax({
		// 					  type: 'POST',
		// 					  url: '/xdb/web/sharing!sharing.do',
		// 					  data: {"jsonStr" : JSON.stringify(jsonResult)},
		// 					  success: function(date){
		// 						  alert(date.msg);
		// 						  window.location.href="/xdb/web/sharing!sharingDetail.do?sharingId=".concat(date.msg);
		// 					  },
		// 					  dataType: "json"
		// 					});
		// 				return;


	})
	// $(".submit").on(
	// 		"click",
	// 		function() {
	// 			var jsonResult = {
	// 				"image1" : $("#image1").val(),
	// 				"image2" : $("#image2").val(),
	// 				"text3" : $("#text3").val(),
	// 				"template_id":$("#template_id").val(),
	// 				"emp_no":$("#emp_no").val()
	// 			};
	//
	// 			$.ajax({
	// 				  type: 'POST',
	// 				  url: '/xdb/web/sharing!sharing.do',
	// 				  data: {"jsonStr" : JSON.stringify(jsonResult)},
	// 				  success: function(date){
	// 					  alert(date.msg);
	// 					  window.location.href="/xdb/web/sharing!sharingDetail.do?sharingId=".concat(date.msg);
	// 				  },
	// 				  dataType: "json"
	// 				});
	// 			return;
	// 			var oldImg = imageData(_old);
	// 			var newImg = imageData(_new);
    //
	// 			alert(oldImg.substring(0, 50));
	// 			alert(newImg.substring(0, 50));
	// 		});
    //
	function imageData(obj) {
		obj.scroll.enabled = false;
		var canvas = document.createElement('canvas');

		canvas.width = _w;
		canvas.height = _h;
		var ctx = canvas.getContext('2d');

		var w = _w / obj.scroll.scale / obj.ratio;
		var h = _h / obj.scroll.scale / obj.ratio;
		var x = Math.abs(obj.scroll.x) / obj.scroll.scale / obj.ratio;
		var y = Math.abs(obj.scroll.y) / obj.scroll.scale / obj.ratio;

		ctx.drawImage(obj.img, x, y, w, h, 0, 0, _w, _h);
		return canvas.toDataURL();
	}
    //
	function ajaxFileUpload(image, display) {
		if(!_new.img){
			alert("请先上传图片");
			upload_true = true;
			return;
		}
		var newImg =imageData(_new)
		var data = {
			imagedata: newImg
		};
		$.ajax({
			url : '/upload',// servlet请求路径
			type: "POST",
			secureuri : false,
			fileElementId : image,// 上传控件的id
			dataType : 'json',
			data:data,
			success : function(data, status) {
				$(display).val(data.date);
					$.ajax({
						type: "POST",
						url: "/sign",
						dataType: "json",
						data: {},
						success: function (data) {
							$(".scpz_1").fadeOut("slow");
							if(data.data==1){
								$window.ceshi();
								$this.val("已签到");
								$this.attr("class","qdan1");
								$this.attr("disabled",true);
								$("#sign_text").html(data.text)
								$(".qdts").fadeIn();
								window.location.href='/system';
							}
						},
						error: function (data) {
							alert("系统错误");
							window.location.href='/system';
						}
					});
			},
			error : function(data, status, e) {
				alert('上传出错');
				window.location.href='/system';
			}
		});

	}
});
