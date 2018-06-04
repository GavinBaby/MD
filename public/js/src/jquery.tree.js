/**
 * Created by Administrator on 2017/5/15 0015.
 */
/**
 * Created by Administrator on 2017/5/15 0015.
 */
$.fn.tree = function (data, options) {

    var defaults = {
        gap: 40,
        speed: 100,
        _tri: 22,
        linker: true,
        checkbox: true
    };

    $.extend(defaults, options);

    function treeNode(node, gap, isLast) {

        var nodesHtml = '',
            toggle = '',
            beforeWidth = defaults.gap,
            children = node.children,
            childrenCount = children ? children.length : 0;
        if (childrenCount) {

            beforeWidth -= defaults._tri;
            nodesHtml += '<ul class="tree-nodes' + (childrenCount == 1 ? ' one-node' : '') + '">';
            toggle = '<span class="tree-node-toggle"></span>';
            for (var i = 0; i < childrenCount; i++) {
                nodesHtml += treeNode(node.children[i], gap + defaults.gap, i == childrenCount - 1);
            }
            nodesHtml += '</ul>';
        }
        var beforeLine = '<em class="before" style="width: ' + beforeWidth + 'px; left: -' + defaults.gap + 'px;"></em>';
        var afterLine = '<em class="after" style="left:-' + defaults.gap + 'px"></em>';
        var nodesLine = '<em class="line" style="left:' + (gap - defaults.gap) + 'px;"></em>';
        if (isLast === undefined) {
            beforeLine = '';
            afterLine = '';
            nodesLine = '';
        } else if (isLast) {
            nodesLine = '';
        }
        var html_ = "";
        if(node.checkbox){
            html_ = '<span style="position: relative;display: inline-block;width: 10px;height: 17px;" id="'+node.id+'"></span>'
        }else{
            html_ = '<span class="tree-node-checkbox " id="'+node.id+'"></span>'
        }
        return '<li class="tree-node"><div class="tree-node-wrap" style="padding-left:' + gap + 'px"><div class="tree-node-box">' + beforeLine + toggle +html_ + node.text + afterLine + '</div></div>' + nodesHtml + nodesLine + '</li>';
    }

    var dom = '<ul class="tree link">';
    for (var i = 0, j = data.length; i < j; i++) {
        dom += treeNode(data[i], defaults._tri);
    }
    dom += '</ul>';
    this.html(dom);

    this.on('click', '.tree-node-wrap', function () {
        var $this = $(this);
        var $nodes = $this.siblings('.tree-nodes');
        if ($nodes.length) {
            $this.find('.tree-node-toggle').toggleClass('expand');
            if($this.find('.tree-node-toggle').hasClass("expand")){
                $this.closest('.tree-node').addClass('expand');
            }else{
                $this.closest('.tree-node').removeClass('expand');
            }
            $this.closest('.tree-node').closest('ul').children("li:last-child").removeClass('expand');
            $nodes.toggle(defaults.speed);
        }

    }).on('click', '.tree-node-checkbox', function (e) {
        e.stopPropagation();
        var $this = $(this);
        var $node = $this.closest('.tree-node');
        var $checkboxes = $node.find('.tree-node-checkbox');
        if ($this.hasClass('checked')) {
            $checkboxes.removeClass('checked');
        } else {
            $checkboxes.removeClass('half-checked').addClass('checked');
        }
        track($node);
    });

    function track($node) {

        $node.parents('.tree-node').each(function (i, item) {
            var $item = $(this);
            var $checkbox = $item.find('.tree-node-checkbox:first');
            var checkboxCount = $item.find('.tree-nodes .tree-node-checkbox').length;
            var checkedCount = $item.find('.tree-nodes  .tree-node-checkbox.checked').length;

            $checkbox.removeClass('checked half-checked');
            if (checkedCount == 0) {
                return true;
            }
           if (checkboxCount !== checkedCount) {
                $checkbox.addClass('half-checked');
            } else {
                $checkbox.removeClass('half-checked').addClass('checked');
           }
        })
    }

    return this;

}