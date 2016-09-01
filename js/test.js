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


    var chessBoard = [];
    var me = true;
    var over = false;

// 赢法数组
    var wins = [];

// 赢法的统计数组
    var myWin = [];
    var computerWin = [];

// 初始化chessBoard
    for(var i=0; i<15; i++) {
        chessBoard[i] = [];
        for(var j=0; j<15; j++) {
            chessBoard[i][j] = 0;
        }
    }

// 初始化wins 数组
    for(var i=0; i<15; i++) {
        wins[i] = [];
        for(var j=0; j<15; j++) {
            wins[i][j] = [];
        }
    }

    var count = 0;
// 所有横线赢法
    for(var i=0; i<15; i++) {
        for(var j=0; j<11; j++) {
            for(var k=0; k<5; k++) {
                wins[i][j + k][count] = true;
            }
            count++;
        }
    }

// 所有竖线赢法
    for(var i=0; i<15; i++) {
        for(var j=0; j<11; j++) {
            for(var k=0; k<5; k++) {
                wins[j + k][i][count] = true;
            }
            count++;
        }
    }

// 所有斜线赢法
    for(var i=0; i<11; i++) {
        for(var j=0; j<11; j++) {
            for(var k=0; k<5; k++) {
                wins[i + k][j + k][count] = true;
            }
            count++;
        }
    }

// 所有反斜线赢法
    for(var i=0; i<11; i++) {
        for(var j=14; j>3; j--) {
            for(var k=0; k<5; k++) {
                wins[i + k][j - k][count] = true;
            }
            count++;
        }
    }

// 打印count总数，浏览器console控制台可以看到
    console.log(count);

// 初始化赢法的统计数组
    for(var i=0; i<count; i++) {
        myWin[i] = 0;
        computerWin[i] = 0;
    }

    var chess = document.getElementById('chess');
    var context = chess.getContext('2d');

    context.strokeStyle = "#BFBFBF"

    var logo = new Image();
    logo.src = "images/chess.png";
    logo.onload = function() {
        context.drawImage(logo, 0, 0, 450, 450);
        drawChessBoard();
    }

// 画棋盘
    var drawChessBoard = function() {
        for(var i=0; i<15; i++) {
            context.moveTo(15 + i*30, 15);
            context.lineTo(15 + i*30, 435);
            context.stroke();
            context.moveTo(15, 15 + i*30);
            context.lineTo(435, 15 + i*30);
            context.stroke();   // stroke()用来描边
        }
    }

    var oneStep = function(i, j, me) {
        context.beginPath();
        context.arc(15 + i*30, 15 + j*30, 13, 0, 2*Math.PI);
        context.closePath();
        var gradient = context.createRadialGradient(15 + i*30 + 2, 15 + j*30 - 2, 13, 15 + i*30 + 2, 15 + j*30 - 2, 0);
        if(me) {
            gradient.addColorStop(0, "#0A0A0A");
            gradient.addColorStop(1, "#636766");
        }
        else{
            gradient.addColorStop(0, "#D1D1D1");
            gradient.addColorStop(1, "#F9F9F9");
        }
        context.fillStyle = gradient;
        context.fill();  // fill()用来填充
    }

    chess.onclick = function(e){
        if(over) {
            return;
        }
        if(!me) {
            return;
        }
        var x = e.offsetX;
        var y = e.offsetY;
        var i = Math.floor(x / 30);
        var j = Math.floor(y / 30);
        if(chessBoard[i][j] == 0) {
            oneStep(i, j, me);
            chessBoard[i][j] = 1;

            for(var k=0; k<count; k++) {
                if(wins[i][j][k]) {
                    myWin[k]++;
                    computerWin[k] = 6;
                    if(myWin[k] == 5) {
                        window.alert("你赢了");
                        over = true;
                    }
                }
            }
            if(!over) {
                me = !me;
                computerAI();
            }
        }
    }

    var computerAI = function() {
        var myScore = [];
        var computerScore = [];
        var max = 0;
        var u = 0, v = 0;
        for(var i=0; i<15; i++) {
            myScore[i] = [];
            computerScore[i] = [];
            for(var j=0; j<15; j++) {
                myScore[i][j] = 0;
                computerScore[i][j] = 0;
            }
        }
        for(var i=0; i<15; i++) {
            for(var j=0; j<15; j++) {
                if(chessBoard[i][j] == 0) {
                    for(var k=0; k<count; k++) {
                        if(wins[i][j][k]) {
                            if(myWin[k] == 1) {
                                myScore[i][j] += 200;
                            }
                            else if(myWin[k] == 2){
                                myScore[i][j] += 400;
                            }
                            else if(myWin[k] == 3) {
                                myScore[i][j] += 2000;
                            }
                            else if(myWin[k] == 4) {
                                myScore[i][j] += 10000;
                            }
                            if(computerWin[k] == 1) {
                                computerScore[i][j] += 220;
                            }
                            else if(computerWin[k] == 2){
                                computerScore[i][j] += 440;
                            }
                            else if(computerWin[k] == 3) {
                                computerScore[i][j] += 2200;
                            }
                            else if(computerWin[k] == 4) {
                                computerScore[i][j] += 20000;
                            }
                        }
                    }
                    if(myScore[i][j] > max) {
                        max = myScore[i][j];
                        u = i;
                        v = j;
                    }
                    else if(myScore == max) {
                        if(computerScore[i][j] > computerScore[u][v]) {
                            u = i;
                            v = j;
                        }
                    }
                    if(computerScore[i][j] > max) {
                        max = computerScore[i][j];
                        u = i;
                        v = j;
                    }
                    else if(computerScore == max) {
                        if(myScore[i][j] > myScore[u][v]) {
                            u = i;
                            v = j;
                        }
                    }
                }
            }
        }
        oneStep(u, v, false);
        chessBoard[u][v] = 2;
        for(var k=0; k<count; k++) {
            if(wins[u][v][k]) {
                computerWin[k]++;
                myWin[k] = 6;
                if(computerWin[k] == 5) {
                    window.alert("Computer wins！");
                    over = true;
                }
            }
        }
        if(!over) {
            me = !me;
        }
    }








})

