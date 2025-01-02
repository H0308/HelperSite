# 
<style>
    /* SVG容器样式保持不变 */
    #container {
        width: 100%;
        margin: 50px auto;
    }

    #hello-svg {
        width: 100%;
        height: auto;
    }

    /* 定义渐变色 */
    #hello-svg {
        --gradient-1: #FF6B6B, #4ECDC4, #45B7D1;
        --gradient-2: #96E6A1, #D4FC79;
        --gradient-3: #FFD93D, #FF6B6B;
    }

    /* 路径基础样式 */
    .path {
        fill: none;
        stroke-width: 5;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    /* 路径1动画和渐变 */
    .path-1 {
        stroke: url(#gradient1);
        stroke-dasharray: 1800;
        stroke-dashoffset: 1800;
        animation: drawPath1 3s ease forwards;
    }

    /* 路径2动画和渐变 */
    .path-2 {
        stroke: url(#gradient2);
        stroke-dasharray: 600;
        stroke-dashoffset: 600;
        animation: drawPath2 2s ease forwards 3s;
    }

    /* 路径3动画和渐变 */
    .path-3 {
        stroke: url(#gradient3);
        stroke-dasharray: 300;
        stroke-dashoffset: 300;
        animation: drawPath3 1.5s ease forwards 5s;
    }

    /* 动画关键帧保持不变 */
    @keyframes drawPath1 {
        to {
            stroke-dashoffset: 0;
        }
    }

    @keyframes drawPath2 {
        to {
            stroke-dashoffset: 0;
        }
    }

    @keyframes drawPath3 {
        to {
            stroke-dashoffset: 0;
        }
    }
</style>

<div id="container">
    <svg id="hello-svg" data-name="hello" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 582 197">
        <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#FF6B6B"/>
                <stop offset="50%" style="stop-color:#4ECDC4"/>
                <stop offset="100%" style="stop-color:#45B7D1"/>
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#96E6A1"/>
                <stop offset="100%" style="stop-color:#D4FC79"/>
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#FFD93D"/>
                <stop offset="100%" style="stop-color:#FF6B6B"/>
            </linearGradient>
        </defs>
        <path class="path path-1" d="M208,338c38-16.67,73.74-45.72,97.33-66,21.33-18.33,32.67-35.67,37.33-52.67C347.12,203.12,344,192,332,192c-11,0-21,10.33-24.94,27.68-4.52,19.89-22.06,107.82-29.39,149,15.67-72.33,36.33-81.33,53.67-81.33,22.33,0,24.67,18.67,19.42,39-5.43,21.07-7.42,44.32,17.91,44.32,18,0,35.53-8.17,52.67-20,14-9.67,23-24,23-40,0-13.42-8-23.33-20.67-23.33s-24.33,12-24.33,33.33c0,27,16.33,48,44,48,25.67,0,47.67-19.67,62-44.67,13.61-23.74,30.67-64.67,33.33-92.67s-5.33-36-18.67-36-24.67,17.33-28.67,43.33S486,302,491.33,330s28,37.67,46,37.67,38.17-15.67,52-37c16.54-25.51,35.87-67.45,38.67-102,2-24.67-8.67-33.33-20-33.33-14.67,0-23.33,13.33-28,38-4.5,23.81-8,64-2,94,4.64,23.21,25.33,40.33,44.67,40.33s32.67-19,36.67-42.33" transform="translate(-199 -183)"/>
        <path class="path path-2" d="M697.33,287.33C672,287.33,661.33,305,659,327c-2.81,26.54,10.33,41.67,29.67,41.67,22,0,34.54-20.78,36.67-40.67,2-18.67-7.39-39.13-28-40.67" transform="translate(-199 -183)"/>
        <path class="path path-3" d="M714.8,295.12c12.11,12.26,43.53,9.55,56.53-5.79" transform="translate(-199 -183)"/>
        <line class="path path-4" x1="561" y1="181.67" x2="561" y2="181.67"/>
    </svg>
</div>

## 介绍

欢迎来到学习档案，这是一个学习内容记录网站，主要记录了作者学习到的技术知识，如果发现错误或者存在疑问请[联系作者](https://www.help-doc.top/%E4%BD%9C%E8%80%85/%E4%BD%9C%E8%80%85.html)

- 本网站不提供英文版
- 本网站使用下面的字体：
    1. 标题：[霞鹜臻楷](https://github.com/lxgw/LxgwZhenKai)
    2. 内容（非代码）：[OPPO官方字体OPPO Sans](https://www.coloros.com/article/A00000050/)
    3. 代码：[JetBrains Mono](https://www.jetbrains.com/lp/mono/)

## 网站通知

1. Python快速入门、JavaScript快速入门和JavaScript与DOM基础会在2024年底下线，取而代之的是更全面的文档
   
    -- 2024年10月2日

2. 算法部分内容调整

    -- 2024年10月16日

3. JavaScript快速入门文档下线，语法内容查看JavaScript语法基础

    -- 2024年11月13日

4. JavaScript与DOM基础文档下线，具体内容见JavaScript与DOM和BOM操作系列文档

    -- 2024年11月15日

5. 算法的归档部分删除

    -- 2024年11月30日

6. 做出如下调整：

      1. Python快速入门文档下线

      2. 网页部分结构调整：
      
         1. 「其它：JDBC」改名为「JDBC（Java连接数据库技术）」，从原来的「其它」移动到「MySQL」
         2. 「前端」改名为「JavaEE应用开发」

      -- 2024年12月2日

7. 更新网页显示效果，并添加切换主题功能

    -- 2024年12月8日

8. 网页根据设备的尺寸设置是否以新版主题显示，大部分的移动设备网站选择不提供主题切换按钮并默认以旧版主题显示确保网页流畅，绝大部分电脑端保持正常

    -- 2024年12月31日

## 使用指导

本网页提供两种主题，新版主题中包含一些动画和特效，对浏览器性能要求较高，建议在Chrome桌面端浏览器下使用；旧版主题去除了部分动画和特效，并且为了保证阅读性，对背景也有所改动，建议在移动端浏览器性能稍弱的浏览器中使用

对于上文未提到的浏览器可自行尝试哪一种主题更适合阅读并且可以流畅运行

<span style="color:red">注意，切换主题只是改变网页显示效果，并不会改变网页本身对内存的占用</span>

## 使用注意

<span style="color:red">本网站没有权威性，请注意对信息的甄别</span>

## 参考网站

下面是常用的参考文档或官方文档：

[C语言/C++参考文档](https://legacy.cplusplus.com/)

[C语言/C++官方文档](https://en.cppreference.com/w/)

[Java官方文档](https://docs.oracle.com/javase/8/docs/api/)

[前端学习参考文档MDN](https://developer.mozilla.org/en-US/)

[Python标准库官方文档](https://docs.python.org/zh-cn/3/library/index.html)

!!! info "其他参考网站"
    [常用内容参考网站](https://quickref.cn/)，该网站可以提供：编程语言笔记、工具使用技巧等，下面的链接主要来自于该网站

    [git使用指令参考](https://quickref.cn/docs/git.html)

    [Github使用技巧参考](https://quickref.cn/docs/github.html)

    [HTTP状态码参考](https://quickref.cn/docs/http-status-code.html)

    [LaTeX符号代码参考](https://quickref.cn/docs/latex.html)

    [Emmet表达式参考](https://quickref.cn/docs/emmet.html)

    [正则表达式参考](https://quickref.cn/docs/regex.html)