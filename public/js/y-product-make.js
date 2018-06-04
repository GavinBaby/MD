/**
 * Created by YinQichao on 2015/7/23.
 */
$(function(){

  $(".y-system-chargeback-list li input[type=checkbox]").click(function(){
    if($(this).prop("checked")){
      $(this).addClass("active");
      $(this).siblings(".y-system-chargeback-list li span").addClass("active");
      $(this).siblings(".y-system-chargeback-list li input[type=text]").addClass("active").attr("disabled",false);
    }else{
      $(this).removeClass("active");
      $(this).siblings(".y-system-chargeback-list li span").removeClass("active");
      $(this).siblings(".y-system-chargeback-list li input[type=text]").removeClass("active").attr("disabled",true);
    }
  });

  $(".y-traveller-info-list li label").click(function(){
    if($(this).find("input.system").prop("checked")){
      $(".j-system-chargeback").show();
      $(".j-other-chargeback").hide();
    }else{
      $(".j-system-chargeback").hide();
      $(".j-other-chargeback").show();
    }
  });

  $(".y-people-count-list li label").click(function(){
    if($(this).find("input.free").prop("checked")){
      $(".j-free-people-count").show();
      $(".j-fix-people-count").hide();
    }else{
      $(".j-free-people-count").hide();
      $(".j-fix-people-count").show();
    }
  });

  $(".j-find-city-list").click(function(){
    $(".y-find-city-list").toggle();
  });

  $(".y-product-make-send-package-list input[type=checkbox]").click(function(){
    if($(this).prop("checked")){
      $(this).parent("li").find("input.y-normal").attr('disabled',false);
      $(this).parent("li").find("input.j_datepicker").attr('disabled',false);
    }else{
      $(this).parent("li").find("input.y-normal").attr('disabled',true);
      $(this).parent("li").find("input.j_datepicker").attr('disabled',true);
    }
  });

  $(".y-main-product-option-list .head a").click(function(){
    $(this).addClass('active').siblings('a').removeClass('active');
    var _id = $(this).attr("href");
    $(_id).show().siblings('div').hide();
  });

  $(".y-main-product-option-list .head label.choose").click(function(){
    if($(this).find('input').prop("checked")){
      $(this).parents('.head').siblings('.body').show();
      $(this).siblings('a').show();
    }else{
      $(this).parents('.head').siblings('.body').hide();
      $(this).siblings('a').hide();
    }
  });

  $(".y-answer-the-question-list li span.j-close").click(function(){
    $(this).parent('li').remove();
  });
});
