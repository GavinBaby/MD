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
    data:[],
    startYear:new Date(),
    tpl:'<div class="month">{#month}</div>',
    eventsTpl:'{#month}<div class="price"><div class="wp">￥{price}<span>仅剩{sold}</span></div></div>',
    noEventsTpl:'{#month}<div class="soldout">售罄</div>',
    onClick:jQuery.noop(),
    onLoad:jQuery.noop(),
    onChange:jQuery.noop()
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
        if(currEvent.status == 1){
          tpl = _this.options.eventsTpl.replace('{#month}',tpl);
        }else{
          tpl = _this.options.noEventsTpl.replace('{#month}',tpl);
        }
        label = tpl.match(/\{\w*\}/g);
        for(var t in label){
          tpl = tpl.replace(label[t],currEvent[label[t].toString().substring(1,label[t].length-1)]);
        }
        ali[i] = $('<li>',{
          html:tpl,
          class:'status-'+ currEvent.status
        }).data(currEvent);
      }else{
        ali[i] = $('<li>',{html:tpl}).data(currEvent);
      }
      $li = $li.add(ali[i]);
    }
    return $li;
  }

  //加载插件
  CalendarYear.prototype.load = function(date, init){
    var _this = this;
    _this.$element.find('.current-year').text(date.getFullYear() + '年');

    var $li = _this.createCalendar(date);

    //onClick回调函数
    if(_this.options.onClick){
      $li.click(function(){
        _this.options.onClick.call(_this,$(this));
      });
    }

    _this.$element.find('.calendar-body').html($li);



  }

  //刷新插件
  CalendarYear.refresh = function(date){
    var _this = this;
    if(date == null) date = _this.options.startYear;
    _this.button(date);
    _this.load(date);
  }

  //切换日期
  CalendarYear.prototype.button = function(date){
    /*//onChange回调函数
     if(!init){
     if(_this.options.onChange){
     $li.click(function(){
     _this.options.onChange.call(_this);
     });
     }
     }*/
  }

  //初始化插件
  CalendarYear.prototype.initialize = function(){
    var _this = this;
    //onLoad回调函数
    if(_this.options.onLoad){
      _this.options.onLoad.call(_this);
    }
    _this.load(_this.options.startYear);
    _this.button(_this.options.startYear);
  }

  /* 定义插件
   * ===================================*/
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('dk.CalendarYear');
      var options = typeof option == 'object' && option;

      if (!data) $this.data('dk.CalendarYear', (data = new CalendarYear(this, options)));
      data.initialize();
    });
  }

  var old = $.fn.calendarYear

  $.fn.calendarYear             = Plugin;
  $.fn.calendarYear.Constructor = CalendarYear;

  /* 冲突处理
   * ==================================*/
  $.fn.calendarYear.noConflict = function () {
    $.fn.calendarYear = old;
    return this;
  }

  /* 插件API
   * ==================================*/
}(window.jQuery);