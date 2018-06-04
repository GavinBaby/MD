/********************************
 * 日程加载插件
 * 2015-01-30
 * 稻壳互联 xiaopig
 *******************************/ 
+function ($) {
  'use strict';
  
  /* 公共类定义
   * ===================================*/
  var DookayCalendar = function(element, options){ 
    this.$element  = $(element);
    this.$main  = this.$element.find('.calendar-main');
    this.options   = $.extend({}, DookayCalendar.DEFAULTS, options);

    this.$month  = this.$element.find(this.options.month);
    this.$monthtitle  = this.$element.find(this.options.monthtitle);
    this.$prevyear  = this.$element.find(this.options.prev);
    this.$nextyear  = this.$element.find(this.options.next);
    this.styleDefault = 'calendar-date-default';
    this.styleOld = 'calendar-date-old';
    this.styleFuture = 'calendar-date-future'; 
    
    this.destroy = DookayCalendar.destroy;
    this.initialize = DookayCalendar.initialize;
    this.monthDays = DookayCalendar.monthDays;
    this.eventsDate = DookayCalendar.eventsDate;
    this.dateFormat = DookayCalendar.dateFormat;
  }
  
  // 定义默认配置
  DookayCalendar.DEFAULTS = {
    events:null,
    date:null,
    monthtitle:'.calendar-month',
    month:'.current-month',
    prev:'.calendar-prev-year',
    next:'.calendar-next-year',
    onClick:null
  }
   
  // 返回月天数
  DookayCalendar.monthDays = function (n_year, n_month){ 
    //定义二月的天数
    var _n_feb_days = 28;
    if ( (n_year % 4 == 0) && (n_year % 100 != 0) || (n_year % 400==0) ){
      //润年二月的天数
      _n_feb_days = 29;
    }
   //一年中每个月的天数 
    var _a_moth_days = new Array(31, _n_feb_days, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    return _a_moth_days[n_month];
  }
  
  // 返回给定日期下的日程事件对象
  DookayCalendar.eventsDate = function (s_date){ 
    var _o_return = {},
        _o_events = this.options.events;
    for (var i in _o_events){ 
      if (_o_events[i]['date'] == s_date){ 
        _o_events[i].index = i;
        _o_return = _o_events[i];
        break;
      }
    }
    return _o_return;
  }
  
  // 返回如2015-08-08格式的日期
  DookayCalendar.dateFormat = function (n_year, n_month, n_day){ 
    if(n_month.toString().length == 1) n_month = '0' + n_month;
    if(n_day.toString().length == 1) n_day = '0' + n_day;
    return n_year + '-' + n_month + '-' + n_day;
  }
  
  
  //返回指定日期所生成的日历主体jquery对象
  DookayCalendar.prototype.createCalendar = function(n_year, n_month){
    var _root = this;
    
    var _n_prev_month = n_month - 1,//上个月
        _n_prev_month_year = n_year;
    if(_n_prev_month < 0){
      _n_prev_month = 11;
      _n_prev_month_year = n_year - 1;
    }
    
    var _n_next_month = n_month + 1,//下个月
        _n_next_month_year = n_year;
    if(_n_next_month > 11){
      _n_next_month = 0;
      _n_next_month_year = n_year + 1;
    }
    
    var _n_month_days = _root.monthDays(n_year, n_month),//当月天数
        _n_prev_month_days = _root.monthDays(_n_prev_month_year, _n_prev_month);//上个月天数
    
    var _n_firstday = new Date(n_year, n_month, 1).getDay();//当月第一天是星期几
    
    var _$_tr = new Array(),
        _$_td = new Array(),
        _n_tdId,                // 表格id
        _n_date;                // 日期
    var _s_td_style,            // 表格样式
        _s_cnt,                 // 表格内容
        _o_events = {},          // 当日的日程事件
        _b_events = false;
    
    for(var i = 0; i < 6; i++){ 
      
      for(var c = 0; c < 7; c++){ 
        _o_events = {};
        _b_events = false;
        
        _n_tdId = i * 7 + c;
        _n_date = _n_tdId - _n_firstday + 1;
        if(_n_date < 1){ // 上个月
          _s_td_style = _root.styleOld;
          _n_date = (n_year - 1).toString().substr(-1) + '-' + (_n_prev_month_days + _n_date);
        }else if(_n_date > _n_month_days){ // 下个月
          _s_td_style = _root.styleFuture;
          _n_date = (n_year + 1).toString().substr(-1) + '-' + (_n_date - _n_month_days);
        }else{ 
          _s_td_style = _root.styleDefault;
          _o_events = _root.eventsDate(_root.dateFormat(n_year, n_month+1, _n_date) );
          if(_o_events.date) _b_events = true;
        }
        
        for(var p = 0; p < 4; p++){
          _s_cnt = '';
          _$_td[c] = $('<td></td>').addClass(_s_td_style);
          
          switch(p){ 
            case 0://插入日期
              _$_td[c].addClass('d')
              _s_cnt = _n_date;
            break
            case 1://成人价
              _$_td[c].addClass('h')
              if(_b_events){
                _$_td[c].addClass('status-' + _o_events.status)
                _s_cnt = '￥<strong>' + _o_events.adult +'</strong>';
              } 
            break;
            case 2://儿童价
              _$_td[c].addClass('h')
              if(_b_events){ 
                _$_td[c].addClass('status-' + _o_events.status)
                _s_cnt = '￥<strong>' + _o_events.children +'</strong>';
              }
            break;
            default://存
              if(_b_events){ 
                _$_td[c].addClass('status-' + _o_events.status)
                _s_cnt = _o_events.sold+ '/' + _o_events.inventory;
              }
            break;
          }
          _$_td[c].html(_s_cnt).data('events', _o_events);
          
          if(typeof(_$_tr[i*4 +p]) == 'undefined'){ 
            _$_tr[i*4 +p] = $('<tr></tr>');
          } 
          _$_tr[i*4 +p].append(_$_td[c]);
          
        }
      }
    }
    return $('<tbody></tbody>').append(_$_tr);
  }
  
  /* 加载日历 */
  DookayCalendar.prototype.onload = function(n_year, n_month){
    var _root = this;
    _root.$element.data({'year':n_year, 'month':n_month});
    _root.$month.text( (n_month+1) + '月');
    
    _root.$monthtitle.find('a:eq('+n_month+')').addClass('current').siblings().removeClass('current');

    _root.$main.find('tbody').remove();
    _root.$main.append(_root.createCalendar(n_year,n_month));
    
    _root.$main.find('tbody td').click(function(event){ 
      _root.options.onClick(event, _root.$element);
    });
  }
  
  /* 销毁 */
  DookayCalendar.destroy = function(){ 
    this.$element.find('tbody').remove();
    this.$prevyear.unbind('click');
    this.$nextyear.unbind('click');
    _root.$monthtitle.find('a').removeClass('current').unbind('click');
  }
  
  //初始化
  DookayCalendar.initialize = function(o_date){ 
    var _root = this;
    
    if(o_date == null) o_date = new Date();
    
    var _n_year = o_date.getFullYear();
    var _n_month = o_date.getMonth();
    
    
    _root.onload(_n_year, _n_month);
    
    _root.$monthtitle.find('a').click(function(){ 
      var $this = $(this);
      $this.addClass('current').siblings().removeClass('current');
      _root.onload(_n_year, parseInt($this.text())-1);
    });
    
    var $prevyear = _root.$prevyear.find('.prev-year').text(_n_year-1);
    var $nextyear = _root.$nextyear.find('.next-year').text(_n_year+1);
    _root.$prevyear.click(function(){ 
      _n_year--;
      $prevyear.text(_n_year-1);
      $nextyear.text(_n_year +1);
      _root.onload(_n_year, 11);
    });
    _root.$nextyear.click(function(){ 
      _n_year++;
      $prevyear.text(_n_year-1);
      $nextyear.text(_n_year +1);
      _root.onload(_n_year, 0);
    });
  }
  
  /* 定义插件
   * ===================================*/
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('dookayCalendar2');
      var options = typeof option == 'object' && option;

      if (!data) $this.data('dookayCalendar2', (data = new DookayCalendar(this, options)));
      data.initialize(data.options.date);
    });
  }

  var old = $.fn.dookayCalendar2

  $.fn.dookayCalendar2             = Plugin
  $.fn.dookayCalendar2.Constructor = DookayCalendar
  
  /* 冲突处理
   * ==================================*/
  $.fn.dookayCalendar2.noConflict = function () {
    $.fn.dookayCalendar2 = old;
    return this;
  }
  
  /* 插件API
   * ==================================*/
  
}(window.jQuery);