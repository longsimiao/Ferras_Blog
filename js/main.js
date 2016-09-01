;$(function()
{
    'use strict';   // 严格模式

    var sidebar = $('#sidebar'),    // 选择侧栏
        mask = $('.mask'),  // 选择mask
        backButton = $('.back-to-top'), //选择侧栏触发器
        sidebar_trigger = $('#sidebar_trigger');    // 选择返回菜单


    // 第一种隐藏侧边栏方法
    /*
    function showSidebar()
    {
        mask.fadeIn();
        sidebar.css('right', 0);  // sidebar.animate({'right': 0});   与上面方法一样
    }

    function hideSidebar()
    {
        mask.fadeOut();
        sidebar.css('right', -sidebar.width())
    }
    */

    // 第二种隐藏侧边栏方法
    function showSidebar()  //显示侧栏
    {
        mask.fadeIn();  //显示mask
        sidebar.css('transform', 'translate(0, 0)'); //调整侧栏相关的css
    }

    function hideSidebar()  // 隐藏侧栏
    {
        mask.fadeOut(); // 隐藏mask
        sidebar.css('transform', 'translate(' + sidebar.width() + 'px' + ', 0)');   //调整侧栏相关的css
    }

    sidebar_trigger.on('click', showSidebar)    // 监听侧栏触发器点击事件
    mask.on('click', hideSidebar)   // 监听mask点击事件
    backButton.on('click', function()   // 监听返回按钮点击事件
    {
        $('html, body').animate({
            scrollTop: 0
        }, 600)
    })

    $(window).on('scroll', function() {     // 监听window的scroll事件
        // 如果已滚动部分高于窗口的高度
        if($(window).scrollTop() > $(window).height())
            backButton.fadeIn();    // 显示返回按钮
        else
            backButton.fadeOut();   //隐藏返回按钮
    })

    $(window).trigger('scroll')     // 触发scroll事件

})

