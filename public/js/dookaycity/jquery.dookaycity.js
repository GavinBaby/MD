/********************************
 * 日程加载插件
 * 2015-01-30
 * 稻壳互联 xiaopig
 *******************************/ 
+function ($) {
  'use strict';
  
  /* 公共类定义
   * ===================================*/
  var DookayCity = function(element, options){ 
    this.$e  = $(element);
    this.options   = $.extend({}, DookayCity.DEFAULTS, options);
    this.$city = $('<div class="dookaycity">'+ this.options.tpl + '</div>');
    
  }
  
  /* 定义默认配置 */
  DookayCity.DEFAULTS = {
    customClass:'', //自定义class
    container:'body',
    data:[],
    group:['ABCD','EFGH','JKLM','NOPQRS','TUVWX','YZ'],
    specialGroup:[{name:'热门',correspond:'hot_city'}],
    correspond:{ 
      firstLetter:'first_letter',
      cityName:'city_name'
    },
    //定义控件模板，其中.dookaycity-tab，dookaycity-tabpanel必须存在
    tpl:'<p class="dookaycity-desc">支持中文/拼音/简拼输入</p><ul class="dookaycity-tab"></ul><div class="dookaycity-tabpanel"></div><a class="close" href="javascript:;">&times;</a>',
    //加载控件前回调 传入 input ，城市控件 和 [tab,tabpanel]的jquery对象
    onLoad:jQuery.noop(),
    //返回当前选择的城市jquer对象，并绑定当前城市的所有数据到data属性中
    onSelect:jQuery.noop(), 
    onShow:jQuery.noop(),
    onHide:jQuery.noop()
  }
  
  /* 格式化数据 */
  DookayCity.prototype.dataFormat =  function(){ 
    var _this = this,
        _group = _this.options.group,
        _sgroup = _this.options.specialGroup,
        _olddata = _this.options.data,
        _newdata = {};
    
    //特殊分组是否有
    var tmp;
    for(var s in _sgroup){ 
      _newdata['special'+s] = [];
      for(var i in _olddata){ 
        tmp = _olddata[i][_sgroup[s].correspond];
        if(tmp && tmp != null && tmp != ''){ 
          _newdata['special'+s].push(_olddata[i]);
        }
      }
    }
    
    for(var g in _group){ 
      _newdata[_group[g]] = {};
      //按字母分组
      var _groupdetail = _group[g].split('');
      for(var d in _groupdetail){ 
        _newdata[_group[g]][_groupdetail[d]] = [];
        for(var i in _olddata){ 
          if(_olddata[i][_this.options.correspond.firstLetter].toLocaleUpperCase() == _groupdetail[d].toLocaleUpperCase()){ 
            _newdata[_group[g]][_groupdetail[d]].push(_olddata[i]);
          }
        }
      }
    }
    return _newdata;
  }
  
  /* 生成控件主体 */
  DookayCity.prototype.creatCityBox = function(p_city){ 
    var _this = this,
        _group = _this.options.group,
        _sgroup = _this.options.specialGroup;
    var $tab = $([]), $tabpanel = $([]), $dd = [], $sdd = [];
    
    var ci = 0, di = 0, _tabname = '';
    for (var c in p_city){ 
      //tab内容
      $tabpanel = $tabpanel.add($('<div class="tabpanel"></div>'));
      if(c == 'special'+ci){ 
        _tabname = _sgroup[ci].name;
        
        $sdd[ci] = $('<dd></dd>');
        for(var i in p_city[c]){ 
          $sdd[ci].append($('<a href="javascript:;">'+ p_city[c][i][_this.options.correspond.cityName] +'</a>').data(p_city[c][i]));
        }
        $tabpanel.eq(ci).append($('<dl class="special"></dl>').append($sdd[ci]));
      }else{ 
        _tabname = c;

        for(var d in p_city[c]){ 
          $dd[di] = $('<dd></dd>');
          for(var i in p_city[c][d]){ 
            $dd[di].append($('<a href="javascript:;">'+ p_city[c][d][i][_this.options.correspond.cityName] +'</a>').data(p_city[c][d][i]));
          }
          if(!$dd[di].is(':empty')){
            $tabpanel.eq(ci).append($('<dl><dt>'+ d +'</dt></dl>').append($dd[di]));
          }
          di++;
        }
        di = 0;
      }
      //tab
      $tab = $tab.add($('<li role="tab">'+ _tabname +'</li>'));
      ci++;
    }
    return [$tab, $tabpanel];
  }
  
  /* tab切换效果 */
  DookayCity.prototype.tab = function(p_citybox){ 
    p_citybox[0].eq(0).add(p_citybox[1].eq(0)).addClass('active');
    p_citybox[0].click(function(){ 
      var $this = $(this);
      if($this.hasClass('active')) return;
      $this.addClass('active').siblings().removeClass('active');
      p_citybox[1].eq($this.index()).addClass('active').siblings().removeClass('active');
    });
  }
  
  /* 选择城市 */
  DookayCity.prototype.selectCity = function(p_city){ 
    var _this = this;
    p_city.click(function(){ 
      var $this = $(this);
   
      _this.options.onSelect($this, _this.$e, _this.$city);//添加选择城市回调函数
      
      _this.$e.val($this.text());
      _this.$city.removeClass('open');
    });
  }
  
  /* 插入html */
  DookayCity.prototype.cityLoad = function(p_citybox){ 
    var _this = this;
    
    //添加插入html前的回调函数
    var $citydata = _this.options.onLoad(_this.$e, _this.$city, p_citybox);
    if(!$citydata) $citydata = p_citybox;
    _this.$city.find('.dookaycity-tab').append($citydata[0])
      .end().find('.dookaycity-tabpanel').append($citydata[1]);
    $(_this.options.container).append(_this.$city);
  }
  
  /* 初始化插件 */
  DookayCity.prototype.initialize = function(){ 
    var _this = this,
        _citybox = _this.creatCityBox(_this.dataFormat());
    
    _this.cityLoad(_citybox);
    _this.tab(_citybox);
    _this.selectCity(_citybox[1].find('a'));

    _this.$city.click(function(event){   
      event.stopPropagation();
    });
    $(document).click(function(){ 
      //_this.$e.blur();
      _this.$city.removeClass('open');
    });
    _this.$e.bind({
      'click':function(event){
        $('.dookaycity').not(_this.$city).removeClass('open');
        event.stopPropagation();
      },
      'focus':function(){ 
        var $this = $(this);
        _this.$city.css({left:$this.offset().left,top:$this.offset().top + $this.outerHeight()}).addClass('open');
      }
    });
    _this.$city.find('.close').click(function(){ 
      _this.$city.removeClass('open');
    });
    
  }
  
  /* 定义插件
   * ===================================*/
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('dookaycity');
      var options = typeof option == 'object' && option;

      if (!data) $this.data('dookaycity', (data = new DookayCity(this, options)));
      data.initialize();
    });
  }

  var old = $.fn.dookayCity

  $.fn.dookayCity             = Plugin;
  $.fn.dookayCity.Constructor = DookayCity;
  
  /* 冲突处理
   * ==================================*/
  $.fn.dookayCity.noConflict = function () {
    $.fn.dookayCity = old;
    return this;
  }
  
  /* 插件API
   * ==================================*/
  
  
}(window.jQuery);