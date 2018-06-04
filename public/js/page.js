$(function(){
  /********************************
   * 主导航菜单
   * 依赖jquery.ui.tab
   *******************************/
  var leftmenuWp = $('#navAside'),
      leftmenu = $('#j_menu')

  /********************************
   * 侧边导航菜单
   * 依赖jquery.ztree插件
   *******************************/
  var menu_setting = {
    view: {
      dblClickExpand: false,
      showLine: false,
      selectedMulti: false,
      showIcon: false,
      showTitle:false
    },
    data: {
      simpleData: {
        enable:true,
        idKey: "id",
        pIdKey: "pid",
        rootPId: ""
      }
    },
    callback: {
      onClick: function(event, treeId, treeNode){
        if(treeNode.link.indexOf("/meter_reading?")>-1){
          $.learuntab.addTab(treeNode.id,treeNode.link,"区域抄表");
        }else{
          $.learuntab.addTab(treeNode.id,treeNode.link,treeNode.name);
        }

        leftmenu.find('li.active').removeClass('active');
        var _button = $('#'+treeNode.tId+'_switch');
        if(!_button.hasClass('noline_docu')){
          var _menu = $.fn.zTree.getZTreeObj("j_menu");
          _menu.expandNode(treeNode);
        }else{

          $("#"+treeNode.tId).addClass('active');
          /*addTab(treeNode.link, treeNode.name, '#'+treeNode.tId);*/
        }
      }
    }
  };


  $.fn.zTree.init(leftmenu, menu_setting, menu_data);

  //页面加载
  function pageLoad(s_url, $selector){
  }



});

//树加载
function zTreeLoad(s_url, $selector){
  $.fn.zTree.init(leftmenu, menu_setting, menu_data);
}
