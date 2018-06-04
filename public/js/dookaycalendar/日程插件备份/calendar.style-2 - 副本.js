/********************************
 * 日程加载插件 本插件依赖jquery.moment.js
 * 2015-01-25
 * 稻壳互联 xiaopig
 *******************************/ 
+function ($) {
  'use strict';
  
  /* 公共类定义
   * ===================================*/
  
  // 构造函数
  var DookayCalendar = function(element, options){ 
    this.$element  = $(element);
    this.options   = $.extend({}, DookayCalendar.DEFAULTS, options);
    if(this.$element.data('url')) this.options.eventsUrl = this.$element.data('url');
    if(this.$element.data('tpl')) this.options.tpl = this.$element.data('tpl');
    if(this.$element.data('beforegetdata')) this.options.beforeGetData = this.$element.data('beforegetdata');
    
    this.$prev = this.$element.find(this.options.prev);
    this.$next = this.$element.find(this.options.next);
    
    this.styleDefault = 'calendar-date-default';
    this.styleOld = 'calendar-date-old';
    this.styleFuture = 'calendar-date-future';
    this.yearEn = ['zero','noe','two','three','four','five','six','seven','eight','nine'];
    this.monthEn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
    
    this.dateFormat = DookayCalendar.dateFormat;
    this.destroy = DookayCalendar.destroy;
    this.initialize = DookayCalendar.initialize;
    this.monthDays = DookayCalendar.monthDays;

  }
  
  /* 定义默认配置 */
  DookayCalendar.DEFAULTS = {
    eventsUrl:null,
    date:null,
    holiday:{},
    startDate:null,
    endDate:null,
    title:'.calendar-month',
    prev:'.calendar-prev-month',
    next:'.calendar-next-month',
    tpl:'<div class="price">￥<strong>{price}</strong></div><span>{sold}/{inventory}</span>',
    onClick:null,
    beforeGetData:null
  }
  
  /* 返回月天数 */
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
  
  /* 返回给定日期下的日程事件对象 */
  DookayCalendar.prototype.eventsDate = function (o_events, s_date){ 
    var _o_return = {};
        //_o_events = this.options.events;
    for (var i in o_events){ 
      if (o_events[i]['date'] == s_date){ 
        o_events[i].index = i;
        _o_return = o_events[i];
        break;
      }
    }
    return _o_return;
  }
  
  //从服务端返回日程事件数据
  DookayCalendar.prototype.getEvents = function (n_year, n_month){ 
    var _root = this,
        o_data =[];
    var _events = this.$element.data('events') || {};
    
     var _sname = 'date'+_root.yearEn[parseInt(n_year.toString().substr(-1))]+_root.monthEn[n_month];
    
    //判断是否已经请求过服务端
    var _loadEvents = _root.$element.data('loadevents') || [];
    if($.inArray(_sname, _loadEvents) != -1) return _events[_sname];
    _loadEvents.push(_sname);
    _root.$element.data('loadevents',_loadEvents);
    
    /*$.ajax({ 
      url:_root.options.eventsUrl,
      data:{year:n_year,month:n_month},
      async: false,
      success: function(data){ 
        var _before = _root.options.beforeGetData;
        if(_before != null){
          if(typeof(_before) == 'string'){ 
            if(typeof(eval(_before)) == "function"){
              eval(_before+'(_root.$element, data)');
            }
          }
          
          
        }else{
         o_data = data;
        }
      }
    });*/
    
    o_data = [ 
      [],
      [ 
        {
          date: '2015-02-04',
          status: 1,
          //小时房这样输出数据
          price:[
            { 
              hour:3,
              price:145
            },
            { 
              hour:4,
              price:268
            }
          ],
          sold:18,
          inventory:20
        },
        {
          date: '2015-02-05',
          status: 1,
          price:[
            { 
              hour:3,
              price:145
            },
            { 
              hour:4,
              price:268
            }
          ],
          sold:18,
          inventory:20
        }
      ],
      [ 
        {
          date: '2015-03-11',
          status: 1,
          price:[
            { 
              hour:3,
              price:145
            },
            { 
              hour:4,
              price:268
            }
          ],
          sold:18,
          inventory:20
        },
        {
          date: '2015-03-12',
          status: 1,
          price:[
            { 
              hour:3,
              price:145
            },
            { 
              hour:4,
              price:268
            }
          ],
          sold:18,
          inventory:20
        }
      ],
      [
        {
          date: '2015-04-04',
          status: 1,
          price:[
            { 
              hour:3,
              price:145
            },
            { 
              hour:4,
              price:268
            }
          ],
          sold:18,
          inventory:20
        }
      ],[],[],[]
    ]
    
    if(_events[_sname]){
      //如果已经存在缓存，合并 缓存和请求返回值
      for(var i in o_data[n_month]){ 
        for(var c in _events[_sname]){ 
          if(_events[_sname][c].date == o_data[n_month][i].date){ 
            o_data[n_month][i] = _events[_sname][c];
            break;
          }
        }
      }
      $.merge(o_data[n_month],_events[_sname]);
    }
    
     _events[_sname] = o_data[n_month];
    _root.$element.data({'events':_events});
    return _events[_sname];
  }
  
  /* 返回如2015-08-08格式的日期 */
  DookayCalendar.dateFormat = function (n_year, n_month, n_day){ 
    if(n_month.toString().length == 1) n_month = '0' + n_month;
    if(n_day.toString().length == 1) n_day = '0' + n_day;
    return n_year + '-' + n_month + '-' + n_day;
  }
  
  /* 返回指定日期所生成的日历主体jquery对象 */
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
    
    //计算填充日期所需要表格的行数
    //var n_tr_count=Math.ceil( (_n_month_days + _n_firstday)/7 );
    
    //生成html
    var _$_tr = new Array(),
        _$_td = new Array(),
        _n_did,                  // 表格id
        _n_date;                 // 日期号
    
    var _s_td_style,            // 日程事件状态样式class类
        _o_evens = {},          // 日程事件对象
        _s_events_cnt,          // 默认日程事件内容
        _s_formatdate;

    var a_label = _root.options.tpl.match(/\{\w*\}/g);//获取模板标签
    
    //获取上、当、下月的数据
    var o_prevEvents = _root.getEvents(_n_prev_month_year, _n_prev_month),
        o_currEvents = _root.getEvents(n_year,n_month),
        o_nextEvents = _root.getEvents(_n_next_month_year, _n_next_month);
    
    for(var i = 0; i < 6; i++){ 
      
      for(var c = 0; c < 7; c++){ 
        _n_did = i * 7 + c;
        _n_date = _n_did - _n_firstday + 1;
        
        _s_td_style = _root.styleDefault;//默认日期表格样式类
        _s_events_cnt = '';
        
        var _tmpdate = new Date(n_year, n_month, _n_date);
        
        if(_n_date < 1){
          //上个月
          _n_date = _n_prev_month_days + _n_date;
          _s_td_style = _root.styleOld;
          _s_formatdate = _root.dateFormat(_n_prev_month_year, _n_prev_month+1, _n_date);
          
          _o_evens = _root.eventsDate(o_prevEvents, _s_formatdate);
          
          _o_evens.calendarYear = _n_prev_month_year;
          _o_evens.calendarMonth = _n_prev_month;
          
          _tmpdate = new Date(_n_prev_month_year, _n_prev_month, _n_date);
        }else if(_n_date > _n_month_days){ 
          //下个月
          _n_date = _n_date - _n_month_days;
          _s_td_style = _root.styleFuture;
          _s_formatdate = _root.dateFormat(_n_next_month_year, _n_next_month+1, _n_date)

          _o_evens = _root.eventsDate(o_nextEvents, _s_formatdate);
          
          _o_evens.calendarYear = _n_next_month_year;
          _o_evens.calendarMonth = _n_next_month;
          
          _tmpdate = new Date(_n_next_month_year, _n_next_month, _n_date);
        }else{ 
          //当月
          _s_formatdate = _root.dateFormat(n_year, n_month+1, _n_date);
          _o_evens = _root.eventsDate(o_currEvents,_s_formatdate);
          _o_evens.calendarYear = n_year;
          _o_evens.calendarMonth = n_month;
        }
        _o_evens.calendarDay = _n_date;
        
        //判断当前日期下是否有日程事件
        if(_o_evens.date){ 
            _s_td_style = _s_td_style + ' status-' + _o_evens.status;
            
            //替换模板
            _s_events_cnt = _root.options.tpl;
            for(var t in a_label){ 
              if(a_label[t] == '{price}'){ 
                //判断是否多价格
                if(typeof(_o_evens.price) == 'object'){ 
                  _o_evens.hour = _o_evens.price[0].hour;
                  _s_events_cnt = _s_events_cnt.replace('{price}',_o_evens.price[0].price);
                }
              }
              _s_events_cnt = _s_events_cnt.replace(a_label[t],_o_evens[a_label[t].substr(1,a_label[t].length-2)]);
            }
        };
        
        //判断是否为节假日
        
        if(_tmpdate.getDay() == 0 || _tmpdate.getDay() == 6){ 
          _s_td_style+=' calendar-date-holiday';
        }
        var _hday = _root.options.holiday[moment(_tmpdate).format('YYYY-MM-DD')]
        if(_hday){ 
          _s_td_style+=' calendar-date-holiday';
          _s_events_cnt ='<span class="holiday-name">'+_hday+'</span>'+_s_events_cnt;
        }
        
        _$_td[c] = $('<td class="' + _s_td_style + '" data-date="' + _s_formatdate + '" data-index="' + _n_did + '"><div class="calendar-date-content"><span class="calendar-date">' + _n_date + '</span>' + _s_events_cnt + '</td>').data('events', _o_evens);
      }
      _$_tr[i] = $('<tr></tr>').append(_$_td);
    }
    return $('<tbody></tbody>').append(_$_tr);
  }
  
  /* 加载日历 */
  DookayCalendar.prototype.onload = function(n_year, n_month){
    var _root = this;
    _root.$element.data({'year':n_year, 'month':n_month});
    _root.$element.find(_root.options.title).html('<span class="year">'+n_year + '<i>年</i></span><span class="month">' + (n_month + 1) + '<i>月</i></span>');
    _root.$element.find('tbody').remove();
    
    _root.$element.find('table').append(_root.createCalendar(n_year,n_month));
    
    _root.$element.find('tbody td').click(function(event){ 
      _root.options.onClick(event, $(this), _root.$element);
    });
    
  }
  
  /* 销毁 */
  DookayCalendar.destroy = function(){ 
    this.$element.find('tbody').remove();
    this.$next.unbind('click');
    this.$prev.unbind('click');
  }
  
  //检测开始和结束日期
  DookayCalendar.prototype.checkBtn = function(n_year, n_month){ 
    
    var _root = this;
    var o_startDate = _root.options.startDate,
    o_endDate = _root.options.endDate;
    if(o_startDate != null){
      if(o_startDate.getFullYear() + o_startDate.getMonth() < n_year+n_month){ 
        _root.$prev.removeClass('disabled');
      }else{ 
        _root.$prev.addClass('disabled');
      }
    }
    if(o_endDate != null){
      if(o_endDate.getFullYear() + o_endDate.getMonth() > n_year + n_month){ 
        
        _root.$next.removeClass('disabled');
      }else{ 
        _root.$next.addClass('disabled');
      }
    } 
  }
  
  //初始化日历
  DookayCalendar.initialize = function(o_date){ 
    var _root = this;
    if(o_date == null) o_date = new Date();
    
    var _n_year = o_date.getFullYear();
    var _n_month = o_date.getMonth();
    
    _root.onload(_n_year, _n_month);
    
    _root.checkBtn(_n_year, _n_month);
    
    /*切换到下个月*/
    _root.$next.click(function(){ 
      if($(this).hasClass('disabled')) return;

      _n_month = _n_month + 1;
      if(_n_month > 11){
        _n_month = 0;
        _n_year = _n_year + 1;
      }
      _root.onload(_n_year, _n_month);
      
      _root.checkBtn(_n_year, _n_month);
    })
    
    /*切换到上一月*/
    _root.$prev.click(function(){ 
      if($(this).hasClass('disabled')) return;
      
      _n_month = _n_month - 1;
      if(_n_month < 0){
        _n_month = 11;
        _n_year = _n_year - 1;
      }
      _root.onload(_n_year, _n_month);
       
      _root.checkBtn(_n_year, _n_month);
    }); 
    
  }
  
  // 定义共有方法
  
  /* 定义插件
   * ===================================*/
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('dookayCalendar');
      var options = typeof option == 'object' && option;

      if (!data) $this.data('dookayCalendar', (data = new DookayCalendar(this, options)));
      data.initialize(data.options.date);
    });
  }

  var old = $.fn.dookayCalendar

  $.fn.dookayCalendar             = Plugin
  $.fn.dookayCalendar.Constructor = DookayCalendar
  
  /* 冲突处理
   * ==================================*/
  $.fn.dookayCalendar.noConflict = function () {
    $.fn.dookayCalendar = old;
    return this;
  }
  
  /* 插件API
   * ==================================*/
  
}(window.jQuery);

/* 表单数据转换为 键=>值 */
function formatFormdata(form) {
	var o = {};
	var a = form.serializeArray();
	$.each(a, function () {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
}

/* 计算日期差 返回一个数组 */
function minusDate(begin, end){
  var ab = begin.split("-");
  var ae = end.split("-");
  var db = new Date();
  db.setFullYear(ab[0], ab[1]-1, ab[2]);
  var de = new Date();
  de.setFullYear(ae[0], ae[1]-1, ae[2]);
  var a = [];
  for (var i=0,temp=db;temp < de;i++)
  {
    a[i] = minusGetDate(temp);
    temp.setTime(temp.getTime() + 24*60*60*1000);
  }
  a[i] = minusGetDate(de);
  return a;
}
function minusGetDate(d){
    var month=(d.getMonth()+1).toString();
  var day=(d.getDate()).toString();
  if(month.length<2) month = 0 + month;
  if(day.length<2) day = 0 + day;
  return d.getFullYear() + "-" + month + "-" +  day;
}