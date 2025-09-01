<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# HTTP版本介绍

HTTP协议经历了下面的几次发展历程：

1. HTTP/0.9
  
    蒂姆伯纳斯李是一位英国计算机科学家，也是万维网的发明者。他在1989年创建了单行HTTP协议。它只是返回一个网页。这个协议在1991年被命名为HTTP/0.9

2. HTTP/1.0
  
    1996 年，HTTP/1.0发布。该规范是显著扩大，并且支持三种请求方法：`GET`，`HEAD`，和`POST`。HTTP/1.0相对于HTTP/0.9的改进如下：
    
    1. 每个请求都附加了HTTP版本
    2. 在响应开始时发送状态代码
    3. 请求和响应都包含HTTP报文头
    4. 内容类型能够传输HTML文件以外的文档
    
    但是，HTTP/1.0不是官方标准
  
3. HTTP/1.1

    HTTP的第一个标准化版本 HTTP/1.1(RFC 2068)于1997年初发布，支持七种请求方法：`OPTIONS`，`GET`，`HEAD`，`POST`，`PUT`，`DELETE`和`TRACE`

    HTTP/1.1是HTTP 1.0的增强：

    1. 虚拟主机允许从单个IP地址提供多个域
    2. 持久连接和流水线连接允许Web浏览器通过单个持久连接发送多个请求
    3. 缓存支持节省了带宽并使响应速度更快

    HTTP/1.1在接下来的15年左右将非常稳定。在此期间，还出现了HTTPS（安全超文本传输协议）。它是使用SSL/TLS进行安全加密通信的HTTP的安全版本

4. HTTP/2

    由IETF在2015年发布。HTTP/2旨在提高Web性能，减少延迟，增加安全性，使Web应用更加快速、高效和可靠。其具有下面的特点：

    1. 多路复用：HTTP/2允许同时发送多个请求和响应，而不是像HTTP/1.1一样只能一个一个地处理。这样可以减少延迟，提高效率，提高网络吞吐量
    2. 二进制传输：HTTP/2使用二进制协议，与HTTP/1.1使用的文本协议不同。二进制协议可以更快地解析，更有效地传输数据，减少了传输过程中的开销和延迟
    3. 头部压缩：HTTP/2使用HPACK算法对HTTP头部进行压缩，减少了头部传输的数据量，从而减少了网络延迟
    4. 服务器推送：HTTP/2支持服务器推送，允许服务器在客户端请求之前推送资源，以提高性能
    5. 改进的安全性：HTTP/2默认使用 TLS（Transport Layer Security）加密传输数据，提高了安全性
    6. 兼容 HTTP/1.1：HTTP/2可以与HTTP/1.1共存，服务器可以同时支持HTTP/1.1和HTTP/2。如果客户端不支持HTTP/2，服务器可以回退到HTTP/1.1
   
5. HTTP/3

    于2021年5月27日发布，HTTP/3是一种新的、快速、可靠且安全的协议，适用于所有形式的设备。HTTP/3没有使用TCP，而是使用谷歌在2012年开发的新协议QUIC。HTTP/3是继HTTP/1.1和HTTP/2之后的第三次重大修订。HTTP/3带来了革命性的变化，以提高Web性能和安全性。设置HTTP/3网站需要服务器和浏览器支持。目前，谷歌云、Cloudflare和Fastly支持HTTP/3。Chrome、Firefox、Edge、Opera和一些移动浏览器支持HTTP/3

!!! note

    尽管HTTP协议已经发展到了HTTP/3，但是现在使用得更多的还是HTTP/1.1