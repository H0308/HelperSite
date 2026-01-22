<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# JavaScript与BOM操作

## BOM对象

在[BOM介绍]部分已经详细介绍了什么是BOM，这里不再赘述，下面主要介绍BOM中`window`对象的子对象：

1. Navigator对象（`navigator`）：浏览器的对象，可以用来识别浏览器
2. Location对象（`location`）：浏览器的地址栏信息
3. History对象（`history`）：浏览器的历史记录，控制浏览器前进后退
4. Screen对象（`screen`）：屏幕的信息

因为上面的对象都是`window`对象的子对象，所以可以直接调用，例如下面的代码：

```javascript
console.log(navigator);
console.log(history);
console.log(screen);
console.log(location);
```

后面的三个主题将简单介绍`navigator`、`location`和`history`对象的基本操作，详细的内容见对应的官方文档即可

## Navigator对象

浏览器的对象，可以用来识别浏览器，一般会将其作为浏览器类型用于处理兼容性问题，例如官方提供的一段代码，用于判断用户的浏览器品牌和引擎

```javascript
let sBrowser
const sUsrAg = navigator.userAgent

// The order matters here, and this may report false positives for unlisted browsers.

if (sUsrAg.indexOf("Firefox") > -1) {
    sBrowser = "Mozilla Firefox";
    // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
} else if (sUsrAg.indexOf("SamsungBrowser") > -1) {
    sBrowser = "Samsung Internet";
    // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
} else if (
    sUsrAg.indexOf("Opera") > -1 ||
    sUsrAg.indexOf("OPR") > -1
) {
    sBrowser = "Opera";
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
} else if (sUsrAg.indexOf("Trident") > -1) {
    sBrowser = "Microsoft Internet Explorer";
    // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
} else if (sUsrAg.indexOf("Edge") > -1) {
    sBrowser = "Microsoft Edge (Legacy)";
    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
} else if (sUsrAg.indexOf("Edg") > -1) {
    sBrowser = "Microsoft Edge (Chromium)";
    // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64
} else if (sUsrAg.indexOf("Chrome") > -1) {
    sBrowser = "Google Chrome or Chromium";
    // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
} else if (sUsrAg.indexOf("Safari") > -1) {
    sBrowser = "Apple Safari";
    // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
} else {
    sBrowser = "unknown";
}

console.log(`You are using: ${sBrowser}`); // You are using: Google Chrome or Chromium
```

## Location对象

`location`表示的是浏览器地址栏的信息

`location`对象中有下面几个常见的属性和方法：

1. `assign()`：将地址栏的地址修改为新的地址，参数传递一个网页地址字符串
2. `replace()`：使用新的地址替换已有的地址，参数传递一个网页地址字符串
3. `reload()`：刷新页面，参数可以传递一个`true`来强制清缓存刷新
4. `href`：获取当前页面的地址值
5. `search`：获取到地址栏的以`?`参数字符串，例如`/en-US/docs/Location.search?q=123`可以获取到`?q=123`，可以结合`URLSearchParams`类进一步提取参数值，参考[官方文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/search)

例如下面的代码：

=== "HTML"

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <body>
        <button id="btn">点击跳转</button>
    </body>
    <script src="test.js"></script>
    </html>
    ```

=== "JavaScipt"

    ```javascript
    let btn = document.getElementById("btn");
    btn.addEventListener("click", ()=>{
        // location.assign("http://www.baidu.com");
        console.log(location.href);
    });
    ```

## History对象

History对象是浏览器的历史记录，控制浏览器前进后退，其常见的方法有：

1. `back()`：返回上一个网页
2. `forward()`：返回下一个网页
3. `go()`：前往指定的网页。注意这个方法并不是直接传递一个表示网页地址的字符串，因为是history对象的方法，所以只能访问历史访问过的网站，并且是按照数值进行跳转，所以参数传递一个数值，正数表示前进指定个数的网页，负数表示后退指定个数的网页；如果参数传递0，则其效果与`location`对象的`reload`方法效果一样

## 定时器

前面简单了解了`window`对象的三个子对象，但是一般情况下不会经常使用这三个对象，所以做个了解即可，下面主要介绍BOM中重要的功能：定时器

定时器，就是控制某一个行为执行的时间，在BOM中，有两种设置定时器的方式：

1. `setTimeOut()`：直接调用，该函数设置的定时器只能在指定的时间后执行**一次**回调函数中的代码，该函数有两个参数：
   
      1. 第一个参数传递一个回调函数，回调函数中即为指定要执行的代码
      2. 第二个参数表示间隔时间（单位是毫秒），即多久之后执行回调函数中的代码

2. `setInterval()`：直接调用，该函数设置的定时器可以在指定的时间间隔结束后执行**若干次**回调函数中的代码，该函数也有两个参数：

      1. 第一个参数传递一个回调函数，回调函数中即为指定要执行的代码
      2. 第二个参数表示间隔时间（单位是毫秒），即间隔多久执行一次回调函数中的代码

介绍完设置定时器的方式，下面介绍关闭定时器的方式：

1. 对于`setTimeOut()`来说，关闭定时器需要利用到`setTimeOut()`函数的返回值，该函数返回值为计时器的序号，是一个数值类型，用于指定是哪一个计时器，将该返回值传递给`clearTimeout()`函数即可关闭指定的定时器
2. 对于`setInterval()`来说，关闭定时器需要利用到`setInterval()`函数的返回值，将该返回值传递给`clearInterval()`函数即可关闭指定的定时器

!!! note
    需要注意，`setInterval()`函数不会考虑回调函数的执行时间，所以如果回调函数执行比较慢，那么`setInterval()`就无法保证每一次定时器的时间间隔是差不多的，之所以会出现这个问题见[事件循环部分]()分析

`setTimeOut()`和`clearTimeOut()`基本使用如下：

=== "HTML"

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <body>
        <h1 id="countdown"></h1>
    </body>
    <script src="test.js"></script>
    </html>
    ```

=== "JavaScript"

    ```javascript
    let countdown = document.getElementById("countdown");
    let count = 10;

    countdown.innerText = count;

    // 调用setTimeOut()，1秒进行一次count--操作
    const timer = setTimeout(() => {
        countdown.innerText = --count;
    }, 1000);

    // 关闭定时器
    clearTimeout(timer);
    ```

`setInterval()`和`clearInterVal()`基本使用如下：

=== "HTML"

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <body>
        <h1 id="countdown"></h1>
    </body>
    <script src="test.js"></script>
    </html>
    ```

=== "JavaScript"

    ```javascript
    let countdown = document.getElementById("countdown");
    let count = 10;

    countdown.innerText = count;

    // 调用setInterval()，间隔1秒进行一次--count操作
    const timer = setInterval(() => {
        countdown.innerText = --count;

        if(count == 0)
            clearInterval(timer);
    }, 1000);
    ```

如果想使用`setTimeOut()`模拟`setInterval()`过程，可以在回调函数中使用`setTimeOut()`再开启一次定时器，为了避免开多个定时器，可以在开启下一个定时器前关闭前一个定时器，例如下面的代码：

```javascript
// 调用setTimeOut()，1秒进行一次--count操作，在回调函数中再启动一个定时器
// 模拟实现setInterval()
let timer = setTimeout(function countDown() {
    // 先关闭上一个定时器
    clearTimeout(timer);
    countdown.innerText = --count;

    // 开启新的定时器
    timer = setTimeout(countDown, 1000);

    // count为0时结束倒计时
    if(count == 0)
    {
        clearTimeout(timer);
    }
}, 1000);
```

## 事件循环

在JavaScript中，和C/C++、Java一样，每一个函数在执行时都会进入一个调用堆栈，该堆栈最顶部就是正在执行的函数，最底部就是当前调用函数的最外层的函数。在JavaScript中，如果代码写在`<script>`标签中，则堆栈最底部就是`<script>`标签的作用域

但是在调用堆栈的函数都有一个特点，只有调用时才会进栈，一旦执行完就出栈，但是DOM中，对于各种事件的函数来说，并不能确定何时执行，如果某一个函数正在执行，事件的函数再加载到栈中就违反了「堆栈最顶部就是正在执行的函数」，因为被调用的函数还没有执行完

为了解决上面的问题，对于JavaScript中的函数来说，除了有一个调用堆栈的位置存储正在调用的函数以外，还有一个消息队列，一般事件触发的函数会先进入消息队列，如果调用堆栈此时有调用的函数还没有执行完，则事件触发的函数就会等待调用的函数结束执行再加载到调用堆栈中，否则会一直存储在消息队列中

而前面提到的定时器的本质就是利用消息队列，之所以使用`setInterval()`函数创建的定时器无法保证每一次间隔时间差不多是因为该函数只会根据上一次结束调用的时间计算间隔，间隔时间结束后就会将回调函数放入消息队列，如果当前调用堆栈有函数正在执行，则该回调函数就不会立刻执行

在官方文档中，也提到相关的问题：[确保执行时间短于定时器时间间隔](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setInterval#%E7%A1%AE%E4%BF%9D%E6%89%A7%E8%A1%8C%E6%97%B6%E9%97%B4%E7%9F%AD%E4%BA%8E%E5%AE%9A%E6%97%B6%E5%99%A8%E6%97%B6%E9%97%B4%E9%97%B4%E9%9A%94)

在实际开发中，更推荐使用`setTimeOut()`和`setTimeOut()`模拟实现`setInterval()`

## 练习4

可以考虑完成[（附加）DOM和BOM小练习](https://www.help-doc.top/javascript-lang/dom-bom-practice/dom-bom-practice.html#4dombom)

