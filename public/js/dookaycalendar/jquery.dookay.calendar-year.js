/**
 * 由稻壳互联 admin 创建于 2015/3/27.
 * http://www.dookay.com
 */
+function ($) {
  'use strict';

  /* 公共类定义
   * ===================================*/
  var CalendarYear = function(element, options){
    this.$element  = $(element);
    this.options   = $.extend({}, CalendarYear.DEFAULTS, options);

    //开放方法
    this.refresh = CalendarYear.refresh;
  }

  /* 定义默认配置 */
  CalendarYear.DEFAULTS = {
    url:null,
    data:[], //[{date:"2015.1",status:1,other:'other'}]
    active:new Date(), //默认当年
    rangeYear:[], //[2015 , 2018]
    prev:'.prev',
    next:'.next',
    header:'.current-year',
    body:'.calendar-body',
    tpl:'<div class="month">{#month}</div>', //默认模板
    eventsTpl:['{#month}<div class="soldout">售罄</div>','{#month}<div class="price"><div class="wp">￥{price}<span>仅剩{sold}</span></div></div><span class="border"></span>'], //事件模板 数据下标和status相对应
    onClick:$.noop(),
    onLoad:$.noop(),
    onBeforeChange:$.noop(),
    onChange:$.noop()
  }

  //获取数据
  CalendarYear.prototype.getData = function(){
    var _this = this,
      data = _this.options.data;

    if( data.length < 1 ){
      if(_this.options.url != null){
        $.ajax({
          url:_this.options.url,
          async: false,
          success: function(report){
            data = report;
          }
        });
      }
    }
    return data;
  }

  //获取当下月程事件
  function getCurrentEvents(year, month, data){
    var _o_return = {};
    for (var i in data){
      if (data[i]['date'] == year+'.'+(month+1)){
        _o_return = data[i];
        break;
      }
    }
    return _o_return;
  }

  //生成日历
  CalendarYear.prototype.createCalendar = function(date){
    var _this = this,
      data = _this.getData(),
      year = date.getFullYear(),
      month = date.getMonth();

    var $li = $([]),ali = [],label = [];

    for (var i = 0; i<12; i++){

      var currEvent = getCurrentEvents(year, i, data);
      currEvent.year = year;
      currEvent.month = i+1;

      var tpl = _this.options.tpl.replace('{#month}',i+1);

      if(currEvent.date){

        if(_this.options.eventsTpl.length > 0){
          tpl = _this.options.eventsTpl[currEvent.status].replace('{#month}',tpl);
          label = tpl.match(/\{\w*\}/g);
          for(var t in label){
            tpl = tpl.replace(label[t],currEvent[label[t].toString().substring(1,label[t].length-1)]);
          }
        }

        ali[i] = $('<li class="status-'+ currEvent.status +'">'+ tpl +'</li>').data(currEvent);

      }else{

        ali[i] = $('<li>',{html:tpl}).data(currEvent);

      }

      $li = $li.add(ali[i]);

    }

    return $li;
  }

  //插入日历插件
  CalendarYear.prototype.load = function(date, init){
    var _this = this;
    _this.$element.find(_this.options.header).text(date.getFullYear() + '年');
    _this.year = date.getFullYear();

    var $li = _this.createCalendar(date);

    //onClick回调函数
    if(_this.options.onClick){
      $li.click(function(){
        _this.options.onClick.call(_this,$(this));
      });
    }

    _this.$element.find(_this.options.body).empty().html($li);

  }

  //刷新插件
  CalendarYear.refresh = function(date){
    var _this = this;
    if(date == null) date = _this.options.active;
    _this.button(date);
    _this.load(date);
  }

  //切换日期
  CalendarYear.prototype.button = function(date){
    var _this = this,
      year = date.getFullYear();

    var loadCalendar = function (){
      //onBeforeChange回调函数
      if(_this.options.onBeforeChange) {
        _this.options.onBeforeChange.call(_this);
      }
      _this.load( new Date(year, 1, 1 , 0, 0, 0, 0) );
      //onChange回调函数
      if(_this.options.onChange) {
        _this.options.onChange.call(_this);
      }
    }

    var prev = _this.$element.find(_this.options.prev),
      next = _this.$element.find(_this.options.next);

    var isDisable = function(){
      if( _this.options.rangeYear.length < 1 ) return;
      if(year == _this.options.rangeYear[0]){
        prev.addClass('disabled');
      }else{
        prev.removeClass('disabled');
      }
      if(year == _this.options.rangeYear[1]){
        next.addClass('disabled');
      }else{
        next.removeClass('disabled');
      }
    }
    isDisable();

    prev.click(function(){
      if($(this).hasClass('disabled')) return;
      year--;
      isDisable();
      loadCalendar(year);
    });
    next.click(function(){
      if($(this).hasClass('disabled')) return;
      year++;
      isDisable();
      loadCalendar(year);
    });

  }

  //初始化插件
  CalendarYear.prototype.initialize = function(){
    var _this = this;

    var date = _this.options.active;
    _this.load(date);
    _this.button(date);

    //onLoad回调函数
    if(_this.options.onLoad){
      _this.options.onLoad.call(_this);
    }
  }

  /* 定义插件
   * ===================================*/
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('dk.calendarYear');
      var options = typeof option == 'object' && option;

      if (!data) $this.data('dk.calendarYear', (data = new CalendarYear(this, options)));

      typeof option == 'number'? data.refresh(new Date(option, 1, 1, 0, 0, 0)) : data.initialize();
    });
  }

  var old = $.fn.calendarYear;

  $.fn.calendarYear             = Plugin;
  $.fn.calendarYear.Constructor = CalendarYear;

  /* 冲突处理
   * ==================================*/
  $.fn.calendarYear.noConflict = function () {
    $.fn.calendarYear = old;
    return this;
  }

 }(window.jQuery);