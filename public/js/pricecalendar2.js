//依赖dookayCalendar.js和jquery.moment.js
$(function(){ 
  var oToday = new Date(),
      startDate = new Date(oToday.getFullYear(), oToday.getMonth(), 1, 0, 0, 0, 0),
      endDate =new Date( moment(startDate).add(5, 'month'));
  
  //节假日信息
  var holiday = {'2015-04-04':'清明','2015-04-05':'清明','2015-04-06':'清明','2015-05-01':'五一','2015-05-02':'五一','2015-05-03':'五一'}

/**
 * 日历样式一 
 ******************************/  
  var calendar = new Array(),
      $calendar = new Array();
  /* 加载日历 */
  $('.j_calendarprice').each(function(nIndex, node) {
    $calendar[nIndex] = $(node);
    if($calendar[nIndex].data('dookayCalendar')) return;
    
    var $pop = $calendar[nIndex].find('.j_calpop_cho'),
      $pop_batch = $calendar[nIndex].find('.j_calpop_batch'),
      $pop_holiday = $calendar[nIndex].find('.j_calpop_holiday');
    
    calendar[nIndex] = $calendar[nIndex].dookayCalendar({ 
      holiday:holiday,
      startDate:startDate,
      endDate:endDate,
      tpl:'<div class="price">￥<strong>{price}</strong></div><span>{sold}/{inventory}</span><span class="base none">{base}</span>',
      onClick:function(event, self, root){ 
        if(self.hasClass('calendar-date-old') || self.hasClass('calendar-date-future')) return;
        //选中效果
        var $alltd = root.css('z-index',5).find('tbody td'),
            $chostart = $alltd.filter('.choose-start'),
            $chotd;
        var tmpsIndex = parseInt($chostart.data('index')),
            tmpnIndex = parseInt(self.data('index'));    
        var stitle = '';
        
        $alltd.not('.choose-start').removeClass('active');
        if($chostart.size() < 1 || tmpsIndex == tmpnIndex){ 
          $chotd = $($.grep( self, function(n,i){ return n;}));
          
          self.addClass('choose-start');
          stitle = self.data('date');
        }else{ 
          $chotd= $($.grep( $alltd, function(n,i){
            return (i>=tmpsIndex && i<=tmpnIndex) || (i<=tmpsIndex && i>=tmpnIndex);
          }));
          
          var tmptit = new Array($chostart.data('date'),self.data('date'));
          tmpsIndex<tmpnIndex?stitle=tmptit[0]+' to ' +tmptit[1]:stitle=tmptit[1]+' to ' +tmptit[0];
        }
        
        $chotd.addClass('active');
        $pop.css({left:self.position().left,top:self.position().top + self.outerHeight()}).data('pop',$chotd).fadeIn(100)
          .find(':header').text(stitle);
      }
    });
    
    //=======================================
    /* 弹出提交设置 */
    $pop.find('form').submit(function(){ 
      var $form = $(this),
          oformdata = formatFormdata($form);
      
      var _allEvents = $calendar[nIndex].data('events'),
          _currEvents = new Array();

      $pop.data('pop').each(function(index, element){ 
        //删除已存在日期的事件
        for (var i in _allEvents){ 
          if(_allEvents[i].date == $(element).data('date')){ 
            _allEvents.splice(i,1);
            break;
          }
        }
        
        //存储当前设置的日期事件
        var _currindex = _currEvents.push({ 
          date:$(element).data('date'),
          status:oformdata['status'],
          sold:oformdata['sold'],
          inventory:oformdata['inventory'],
          base:oformdata['base']
        });
        
        //判断是否为多价格设置
        if(oformdata['hour[]']){ 
          if(typeof(oformdata['hour[]']) == 'string'){ 
            oformdata['hour[]'] = [oformdata['hour[]']];
            oformdata['price[]'] = [oformdata['price[]']];
          }
          var _tmprice = new Array();
          for ( var h in oformdata['hour[]']){ 
            _tmprice.push({ 
              hour:oformdata['hour[]'][h],
              price:oformdata['price[]'][h]
            })
          }
          _currEvents[_currindex-1].price = _tmprice;
        }else{ 
          _currEvents[_currindex-1].price = oformdata['price'];
        }
        
      });
      
      //写入本地缓存
      $.merge(_allEvents, _currEvents);
      
      //重载日历
      calendar[nIndex].data('dookayCalendar').destroy();
      calendar[nIndex].data('dookayCalendar').initialize(new Date($calendar[nIndex].data('year'), $calendar[nIndex].data('month') ,1));
      
      $pop.removeData('pop').fadeOut(100);
      $form.find('button[type="reset"]').trigger('click');
      
      //是否及时提交
      var _submit = calendar[nIndex].css('z-index',1).data('submitfun');
      if(_submit){ 
        if(typeof(eval(_submit)) == "function"){
          eval(_submit + '(calendar[nIndex], _currEvents)');
        }
      }
      
    });
    
    //===========================================
    /* 批量设置 */
    $pop_batch.find('form').submit(function(){ 
      var $form = $(this),
          oformdata = formatFormdata($form);
      var _allEvents = $calendar[nIndex].data('events'),
          _currEvents = new Array();
      
      //获取日期差 minusDate()函数，存放在calendar.style-2.js文件中
      var chodate = minusDate(oformdata.dateStart, oformdata.dateEnd);
      
      for(var i in chodate){ 
        //删除已存在日期的事件
        for (var c in _allEvents){ 
          if(_allEvents[c].date == chodate[i]){ 
            _allEvents.splice(c,1);
            break;
          }
        }
        
        //存储当前设置的日期事件
        var _currindex = _currEvents.push({ 
          date:chodate[i],
          status:oformdata['status'],
          sold:oformdata['sold'],
          inventory:oformdata['inventory']
        });
        
        //判断是否为多价格设置
        if(oformdata['hour[]']){ 
          if(typeof(oformdata['hour[]']) == 'string'){ 
            oformdata['hour[]'] = [oformdata['hour[]']];
            oformdata['price[]'] = [oformdata['price[]']];
          }
          var _tmprice = new Array();
          for ( var h in oformdata['hour[]']){ 
            _tmprice.push({ 
              hour:oformdata['hour[]'][h],
              price:oformdata['price[]'][h]
            })
          }
          _currEvents[_currindex-1].price = _tmprice;
        }else{ 
          _currEvents[_currindex-1].price = oformdata['price'];
        }
      }
      //写入本地缓存
      $.merge(_allEvents, _currEvents);
      
      //重载日历
      calendar[nIndex].data('dookayCalendar').destroy();
      calendar[nIndex].data('dookayCalendar').initialize(new Date($calendar[nIndex].data('year'), $calendar[nIndex].data('month') ,1));
      $pop_batch.fadeOut(100);
      $form.find('button[type="reset"]').trigger('click');
      
      //是否及时提交
      var _submit = calendar[nIndex].css('z-index',1).data('submitfun');
      if(_submit){ 
        if(typeof(eval(_submit)) == "function"){
          eval(_submit + '(calendar[nIndex], _currEvents)');
        }
      }
      
    });
    
    //============================================
    /* 节假日批量设置 */
    $pop_holiday.find('form').submit(function(){ 
      var $form = $(this),
          oformdata = formatFormdata($form);
      var _allEvents = $calendar[nIndex].data('events'),
          _currEvents = new Array();
      //获取节假日日期
      for(var i = 0; i < 6; i++){
        var _tmpdate = moment(startDate).add(i, 'month');
        
        var _currDays = parseInt(moment(startDate).add(i+1, 'month').add(-1, 'days').format('YYYY-MM-DD').substr(-2));//当月天数
        var _tmprice = new Array();
        for (var c = 1; c <= _currDays; c++){ 
          //是否有节假日
          var _tmpday = new Date(_tmpdate.year(), _tmpdate.month(), c);
          var _currday = moment(_tmpday).format('YYYY-MM-DD');
          
          if(_tmpday.getDay() == 0 || _tmpday.getDay() == 6 || holiday[_currday]){
            
            //删除已存在日期的事件
            for (var d in _allEvents){ 
              if(_allEvents[d].date == _currday){ 
                _allEvents.splice(d,1);
                break;
              }
            }
            
            //存储当前设置的日期事件
            var _currindex = _currEvents.push({ 
              date: _currday,
              status:oformdata['status'],
              sold:oformdata['sold'],
              inventory:oformdata['inventory']
            });
            
            //判断是否为多价格设置
            if(oformdata['hour[]']){ 
              if(typeof(oformdata['hour[]']) == 'string'){ 
                oformdata['hour[]'] = [oformdata['hour[]']];
                oformdata['price[]'] = [oformdata['price[]']];
              }
              var _tmprice = new Array();
              for ( var h in oformdata['hour[]']){ 
                _tmprice.push({ 
                  hour:oformdata['hour[]'][h],
                  price:oformdata['price[]'][h]
                })
              }
              _currEvents[_currindex-1].price = _tmprice;
            }else{ 
              _currEvents[_currindex-1].price = oformdata['price'];
            }
          }
        }
      }
      //写入本地缓存
      $.merge(_allEvents, _currEvents);
      
      //重载日历
      calendar[nIndex].data('dookayCalendar').destroy();
      calendar[nIndex].data('dookayCalendar').initialize(new Date($calendar[nIndex].data('year'), $calendar[nIndex].data('month') ,1));
      $pop_holiday.fadeOut(100);
      $form.find('button[type="reset"]').trigger('click');
      
      //是否及时提交
      var _submit = calendar[nIndex].css('z-index',1).data('submitfun');
      if(_submit){ 
        if(typeof(eval(_submit)) == "function"){
          eval(_submit + '(calendar[nIndex], _currEvents)');
        }
      }
      
    });
    
    //============================================
    /* 快捷价格设置 */
    $calendar[nIndex].parent().find('.j_quikset').submit(function(){ 
      var $form = $(this),
          oformdata = formatFormdata($form);
      var _allEvents = $calendar[nIndex].data('events');
      _allEvents.splice(0,_allEvents.length);
      for(var i = 0; i < 6; i++){ 
        var _tmpdate = moment(startDate).add(i, 'month');
        var _tmpcurr = minusDate(_tmpdate.format('YYYY-MM-DD'), moment(startDate).add(i+1, 'month').add(-1, 'days').format('YYYY-MM-DD'));
        
        //写入本地缓存
        for (var c in _tmpcurr){ 
          var _currindex = _allEvents.push({ 
            date:_tmpcurr[c],
            status:oformdata['status'],
            sold:oformdata['sold'],
            inventory:oformdata['inventory']
          });
          
          //判断是否为多价格设置
          if(oformdata['hour[]']){ 
            if(typeof(oformdata['hour[]']) == 'string'){ 
              oformdata['hour[]'] = [oformdata['hour[]']];
              oformdata['price[]'] = [oformdata['price[]']];
            }
            var _tmprice = new Array();
            for ( var h in oformdata['hour[]']){ 
              _tmprice.push({ 
                hour:oformdata['hour[]'][h],
                price:oformdata['price[]'][h]
              })
            }
            _allEvents[_currindex-1].price = _tmprice;
          }else{ 
            _allEvents[_currindex-1].price = oformdata['price'];
          }
        }
        
      }
      $calendar[nIndex].data('events',_allEvents);
      //重载日历
      calendar[nIndex].data('dookayCalendar').destroy();
      calendar[nIndex].data('dookayCalendar').initialize(new Date($calendar[nIndex].data('year'), $calendar[nIndex].data('month') ,1));
      $form.find('button[type="reset"]').trigger('click');
    });
    
  });
  
  //============================================
  /* 打开批量设置弹出框 */
  $('.j_calpop_open').click(function(){ 
    var $cal = $(this).parents('.calparent').find('.tab-pane.active');
    $cal.css("z-index",5);
    $cal.find($(this).data('target')).css({top:80,right:0}).fadeIn(100);
  });
  
  /* 关闭弹出 */
  $('.j_calpopclose').click(function(){ 
    var _p = $(this).removeData('pop').parents('.calendar-pop').fadeOut(100);
    var _wp = _p.parents('.calendar-wrap').css("z-index",1);
    if(_p.hasClass('j_calpop_cho')){
      _wp.find('td').removeClass('active choose-start');
    }
  });
  
  /* 拖动弹出 */
  $('.calendar-pop').draggable({containment:"body",handle: ".panne-header" })
    .find('.panne-header').disableSelection();
  
  //日历控件
  $('.j_datecalendar').each(function(i, n) {
    var $date = $(n).find('.j_datepicker');
    var checkin = $date.eq(0).datepicker({
      format:'yyyy-mm-dd',
      language: 'zh-CN',
      autoclose:true,
      startDate:startDate,
      endDate:endDate,
    }).on('changeDate', function(ev) {
      if (ev.date.valueOf() > checkout.date.valueOf()) {
        var newDate = new Date(ev.date)
        newDate.setDate(newDate.getDate() + 1);
        checkout.setDate(newDate);
        checkout.setStartDate(newDate);
      }
      $date.eq(1).focus();
    }).data('datepicker');
    
    var checkout = $date.eq(1).datepicker({
      format:'yyyy-mm-dd',
      language: 'zh-CN',
      startDate:startDate,
      endDate:endDate,
      autoclose:true
    }).data('datepicker');
  });
  
  $('.add-on').click(function(){ 
    $(this).prev().focus();
  });
  
  /* 小时房价格选择 */
  $('.j_hourprice :checkbox').click(function(){ 
    var _price = $(this).parents('.j_hourprice').find(':text');
    $(this).is(':checked')?_price.removeAttr('disabled'):_price.attr('disabled',true);
    _price.focus();
  });
  
});