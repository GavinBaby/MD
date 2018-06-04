//价格日历数据
var o_events = [
  {
    date: '2015-02-04',
    status: 1,
    price:325,
    sold:18,
    inventory:20
  },
  {
    date: '2015-02-05',
    status: 1,
    price:325,
    sold:18,
    inventory:20
  },
  {
    date: '2015-02-06',
    status: 1,
    price:325,
    sold:18,
    inventory:20
  },
  {
    date: '2015-02-07',
    status: 1,
    price:325,
    sold:18,
    inventory:20
  },
  {
    date: '2015-02-08',
    status: 0,
    price:325,
    sold:18,
    inventory:20
  },
  {
    date: '2015-02-09',
    status: 1,
    price:325,
    sold:18,
    inventory:20
  },
  {
    date: '2015-02-10',
    status: 1,
    price:325,
    sold:18,
    inventory:20
  },
  {
    date: '2015-03-03',
    status: 1,
    price:325,
    sold:18,
    inventory:20
  },
  {
    date: '2015-02-22',
    status: 2,
    price:325,
    sold:18,
    inventory:20
  },
  {
    date: '2015-03-15',
    status: 1,
    price:325,
    sold:18,
    inventory:20
  },
  {
    date: '2015-01-29',
    status: 3,
    price:325,
    sold:18,
    inventory:20
  }
];

$(function(){ 

/**
 * 日历样式一 
 ******************************/  
  
  var now = new Date();
  var calendar_first = $('#j_calendarFirst').dookayCalendar({ 
    events:o_events,
    startDate: new Date(now.getFullYear(), now.getMonth()-1, now.getDate(), 0, 0, 0, 0),
    endDate: new Date(now.getFullYear(), now.getMonth()+2, now.getDate(), 0, 0, 0, 0),
    onClick:function(){ 
      
      var $this = $(this);
      $this.addClass('active').parents('tbody').find('td').not($this).removeClass('active');
      var o_data = $this.data('events');
      //快捷设置
      $(calendar_first.data('quikset')).find('.form-control').val(o_data.price);
      
      //常规设置
      var normalModal = $(calendar_first.data('normalset'));
      
      normalModal.find('input[name="inventory"]').val(o_data.inventory);
      normalModal.find('input[name="price"]').val(o_data.price);
      normalModal.find('input[name="date"]').val(calendar_first.data('dookayCalendar').dateFormat(o_data.calendarYear, o_data.calendarMonth+1, o_data.calendarDay));
      normalModal.find('select[name="status"]>option[value="'+ o_data.status +'"]').attr('selected','selected');
      
    }
  });
  var oCalendar = calendar_first.data('dookayCalendar');
  
  //快捷价格设置
  $(calendar_first.data('quikset')).submit(function(){ 
  
    var $this = $(this);
    var n_price = $this.find('input[name="price"]');
    
    //缓存到本地
    o_events[calendar_first.find('td.active').data('events').index].price = parseInt(n_price.val());
    
    //重载日历
    oCalendar.destroy();
    oCalendar.initialize(new Date(calendar_first.data('year'), calendar_first.data('month') ,1));
    
    //保存后清空快捷设置框
    n_price.val('');
    
    return false;
  });
  
  //常规价格设置
  $(calendar_first.data('normalset')).find('form').submit(function(){ 
    var $this = $(this);
    
    var $_active = calendar_first.find('td.active');
  
    var a_form_data = formatFormdata($this.serializeArray());

    if(a_form_data.date == ''){ 
      alert('请先选择日期');
      $this.parents('.modal').modal('hide');
      return false;
    };
    
    //缓存到本地
    var n_eventsIndex = $_active.data('events').index;
    if(n_eventsIndex){ 
      o_events[n_eventsIndex] = a_form_data;
    }else{ 
      o_events.push(a_form_data);
    }
  
    //重载日历
    oCalendar.destroy();
    oCalendar.initialize(new Date(calendar_first.data('year'), calendar_first.data('month') ,1));
    
    $(calendar_first.data('quikset')).find('.form-control').val('');
    $this.parents('.modal').modal('hide');
    return false;
  });

  //批量价格设置
  $(calendar_first.data('batchset')).find('form').submit(function(){ 
    var $this = $(this);
    //格式化表单数据
    var a_form_data = formatFormdata($this.serializeArray());
    //获取日期差
    var a_dates = minusDate(a_form_data.startdate, a_form_data.enddate);
    
    //插入缓存
    var o_temp = {};
    for (var i in a_dates){ 
      o_temp = {};
      var o_e = oCalendar.eventsDate(o_events,a_dates[i]);
      if(o_e.date){ 
        o_events[o_e.index] = o_e;
      }else{ 
        o_temp.date = a_dates[i];
        for (var a in a_form_data){ 
          o_temp[a] = a_form_data[a];
        }
        o_events.push(o_temp);
      }
    }
    //重载日历
    oCalendar.destroy();
    oCalendar.initialize(new Date(calendar_first.data('year'), calendar_first.data('month') ,1));
    
    $this.parents('.modal').modal('hide');
    return false;
  });
  
  /**
   * 日历样式二
   ******************************/
  
  
  
});

/* 表单数据转换为 键=>值 
function formatFormdata(formData){ 
  var a_new = {};
  for(var i in formData){ 
    a_new[formData[i].name] = formData[i].value;
  }
  return a_new;
}

// 计算日期差 返回一个数组 
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
    a[i] = GetDate(temp);
    temp.setTime(temp.getTime() + 24*60*60*1000);
  }
  a[i] = GetDate(de);
  return a;
}
function GetDate(d){
    var month=(d.getMonth()+1).toString();
  var day=(d.getDate()).toString();
  if(month.length<2) month = 0 + month;
  if(day.length<2) day = 0 + day;
  return d.getFullYear() + "-" + month + "-" +  day;
}*/