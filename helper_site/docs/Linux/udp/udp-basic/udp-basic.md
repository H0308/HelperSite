<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# UDP编程接口基本使用

## 本篇介绍

在前面[网络基础](https://www.help-doc.top/Linux/net-basic/net-basic.html)部分和[Socket编程基础](https://www.help-doc.top/Linux/socket-basic/socket-basic.html#socket)部分已经介绍了网络的基本工作模式，有了这些理论基础之后，下面先从UDP编程开始从操作部分深入网络

在本篇中，主要考虑下面的内容：

1. 创建并封装服务端：了解创建服务端的基本步骤
2. 创建并封装客户端，测试客户端和服务端通信：了解创建客户端的基本步骤和二者通信
3. 测试云服务器与本地进行通信：从本地通信到真正实现网络通信
4. 整体代码优化：对常见属性进行封装，优化封装的服务端和客户端

根据上面的内容，本次设计的服务器功能就是接受客户端发送的信息并向客户端返回服务端收到的信息

## 创建并封装服务端

### 创建服务器类

因为需要对服务器进行封装，所以首先创建服务器类的基本框架，本次设计的服务器一旦启动就不再关闭，除非手动关闭，所以可以提供两个接口：

1. `start`：启动服务器接口
2. `stop`：停止服务器接口

所以基本框架如下：

```c++
class UdpServer
{
public:
    UdpServer()
    {
    }

    // 启动服务器
    void start()
    {
    }

    // 停止服务器
    void stop()
    {
    }

    ~UdpServer()
    {
    }

private:
};
```

### 创建服务器套接字

既然要创建服务器，首先就是对服务器的相关信息进行设置。首先需要创建socket文件描述，可以使用`socket`接口，该接口原型如下：

```c
int socket(int domain, int type, int protocol);
```

该接口的第一个参数表示网络协议家族，可以选择的选择选项有很多，其中包括`AF_UNIX`和`AF_INET`，因为本次是网络通信，所以该参数选择`AF_INET`，第二个参数表示协议类型，在网络通信部分分为两种：TCP和UDP，对应的值分别为`SOCK_STREAM`和`SOCK_DGRAM`，因为本次是UDP，所以选择`SOCK_DGRM`

??? info "关于`SOCK_STREAM`和`SOCK_DGRAM`"

    根据Linux操作手册的描述：
    
    1. `SOCK_STREAM`：Provides sequenced, reliable, two-way, connection-based byte streams（提供序列化的、可靠的、双工的、面向有连接的字节流）
    2. `SOCK_DGRAM`：Supports datagrams (connectionless, unreliable messages of a fixed maximum length)（支持数据包，即无连接、不可靠的固定长度信息）

??? info "全双工、半双工和单工"

    全双工、半双工和单工是描述通信双方在数据传输时的交互模式，具体对比如下：
    
    1. 全双工（Full Duplex）：双方可以同时互相发送和接收数据，就像电话通话两端都能同时说话和听对方
    2. 半双工（Half Duplex）：双方均可发送和接收数据，但同一时间只能有一方传输。例如，对讲机通信时，一旦你在讲话，另一方必须等待直到你停止后才能回应
    3. 单工（Simplex）：数据只能单向传输，通信只有一端发送，而另一端只接收。例如，广播视频信号中，电视台只能发送信号，观众只能接收信号

第三个参数表示指定采用的具体协议。通常传入0表示让系统自动选择适合`domain`和`type`参数的默认协议

该接口返回值为一个新套接字的文件描述符，否则返回-1并设置错误码

根据这个接口的描述可以知道当前服务器类需要一个成员`_socketfd`用于接收`socket`的返回值，代码如下：

```c++
class UdpServer
{
public:
    UdpServer()
        : _socketfd(-1)
    {
        // 创建服务器套接字
        _socketfd = socket(AF_INET, SOCK_DGRAM, 0);
    }

    // ...

private:
    int _socketfd; // 套接字文件描述符
};
```

在创建服务器套接字失败时可以考虑使用日志系统显示相关的信息，一旦服务器创建异常，说明此时服务器无法正常创建，可以直接退出函数，为了保证可读性，可以将错误码定义为宏，代码如下：

```c++
// 错误码枚举类
enum class errorNumber
{
    ServerSocketFail = 1, // 创建套接字失败
};

class UdpServer
{
public:
    UdpServer()
        : _socketfd(-1)
    {
        // 创建服务器套接字
        _socketfd = socket(AF_INET, SOCK_DGRAM, 0);

        if (_socketfd < 0)
        {
            LOG(LogLevel::FATAL) << "服务器启动异常：" << strerror(errno);
            exit(static_cast<int>(errorNumber::ServerSocketFail));
        }

        LOG(LogLevel::INFO) << "服务器启动成功：" << _socketfd;
    }

    // ...

private:
    int _socketfd; // 套接字文件描述符
};
```

### 绑定服务器IP地址和端口

前面的过程只是创建了一个可以写入的位置，`socket`接口可以类比文件部分的`open`接口，在网络部分接下来的步骤并不是写入，而应该是绑定端口和IP地址，确保其他计算机可以找到当前服务器和具体进程。在Linux中，绑定可以使用`bind`接口，该接口原型如下：

```c++
int bind(int sockfd, const struct sockaddr *addr, socklen_t addrlen);
```

该接口的第一个参数表示需要绑定的套接字对应的文件描述符，第二个参数表示套接字结构，第三个参数表示套接字结构的大小

如果绑定成功，该接口返回0，否则返回-1并设置错误码

对于第一个参数和第三个参数来说，二者作用和含义明显，此处不作过多介绍，下面就第二个参数详细介绍：

在[Socket编程基础](https://www.help-doc.top/Linux/socket-basic/socket-basic.html#socketapi)部分提到`sockaddr`可以理解为`sockaddr_in`结构和`sockaddr_un`的父类，而因为本次创建的是网络通信，所以要使用的结构就是`sockaddr_in`，既然参数部分是`sockaddr`结构而不是`sockaddr_in`，那么在传递实参时就需要进行**强制类型转换**

那么，既然需要用户传递`sockaddr_in`结构，那么这个结构中就存在一些属性需要用户去设置。在[Socket编程基础](https://www.help-doc.top/Linux/socket-basic/socket-basic.html#socketapi)部分的示意图已经了解到`sockaddr_in`有下面的几种成员：

1. 16位地址类型：用于区分当前是何种类型的通信，对应的成员名是`sin_family`
2. 16位端口号：对应的成员名是`sin_port`
3. 32位IP地址：对应的成员名是`sin_addr`
4. 8字节填充

因为第四个成员可以不需要考虑，只是用于占位，所以可以忽略，下面就前面三种类型进行详细介绍：

首先是16为地址类型，其类型是`sa_family_t`。在底层，该类型是一个宏：

```c
struct sockaddr_in
{
    __SOCKADDR_COMMON (sin_);
    // ...
};

#define	__SOCKADDR_COMMON(sa_prefix) \
  sa_family_t sa_prefix##family

typedef unsigned short int sa_family_t;
```

这个宏利用到了[C语言的`##`运算符](https://www.help-doc.top/c-lang/preprocess/preprocess.html#_7)，其含义是将sa_prefix##替换为宏传递的值，因为在`__SOCKADDR_COMMON (sin_)`设置`sa_prefix`对应的`sin_`，所以拼接后为`sin_family`，因为`sa_family_t`代表的是`unsigned short int`，所以`sin_family`就是一个`unsigned short int`的值

因为当前是网络通信，所以对应值就是`AF_INET`，但是需要注意，这里传递的`AF_INET`和前面在`socket`接口传递的`AF_INET`含义不同，在使用`socket`时，指定`AF_INET`表明了`socket`所使用的协议族，它决定了内部数据结构和通信规则，而在调用`bind`时，指定`AF_INET`是因为需要通过这个成员来正确解析后续的地址信息

第二个成员是16位端口号，对于端口来说，其类型是`in_port_t`。在底层，对应源码如下：

```c
struct sockaddr_in
{
    // ...
    in_port_t sin_port;			/* Port number.  */
    // ...
};

typedef uint16_t in_port_t;

typedef __uint16_t uint16_t;

typedef unsigned short int __uint16_t;
```

所以，本质`in_port_t`也是`unsigned short int`，但是因为使用`unsigned short int`和`__uint16_t`都不够简单，所以直接使用`uint16_t`

需要注意的是，在[Socket编程基础](https://www.help-doc.top/Linux/socket-basic/socket-basic.html#socketapi)提到过网络字节流时使用的都是大端，所以如果当前服务器是小端存储，那么就需要转换，否则就不需要转换。这里有两种处理方式：

1. 判断当前设备是否是大端，如果是就直接写端口号，否则就需要对端口号进行小端到大端的转化，具体判断方式参考[进制转换与类型在内存的存储方式](https://www.help-doc.top/c-lang/num-in-memory/num-in-memory.html#_17)
2. 不论是大端还是小端都进行转换，如果是大端就不变，否则就变成大端

本次考虑第二种处理方式，系统提供了相关的接口处理大小端转换问题，如下：

```c
uint16_t htons(uint16_t hostshort);
```

最后考虑第三个成员：IP地址，其类型是一个结构体：`struct in_addr`，其原型如下：

```c
struct sockaddr_in
{
    // ...
    struct in_addr sin_addr;		/* Internet address.  */
    // ...
};

typedef uint32_t in_addr_t;
struct in_addr
{
    in_addr_t s_addr;
};

typedef __uint32_t uint32_t;
typedef unsigned int __uint32_t;
```

实际上就是一个结构体包含了一个`unsigned int`类型的成员，所以在底层，IP地址是一个无符号整数，在设置IP地址时，需要具体指定到`sin_addr`

??? info "`struct sockaddr_in`的第四个成员"

    在底层，第四个成员如下：
    
    ```c
    struct sockaddr_in
    {
        /* Pad to size of `struct sockaddr'.  */
        unsigned char sin_zero[sizeof (struct sockaddr)
                    - __SOCKADDR_COMMON_SIZE
                    - sizeof (in_port_t)
                    - sizeof (struct in_addr)];
    };
    ```

以上就是`bind`接口的第二个参数的详细介绍，下面根据上面的介绍对指定的套接字进行绑定：

因为需要创建端口号和IP地址，所以需要增加两个成员，其中端口号使用的类型是`uint16_t`，而IP地址是字符串类型，之所以使用字符串是为了在使用时更方便，但是如果使用字符串，字符串使用的格式是点分十进制，而需要的是一个无符号整型的整数，此时就需要进行转换，并且还需要将IP地址也转换为大端字节序，这个问题对应地解决方案是`inet_addr`接口，其原型如下：

```c
in_addr_t inet_addr(const char *cp);
```

这个接口可以将指定的点分十进制字符串格式的IP地址转换为`in_addr_t`类型，并且转换为大端字节序

接着对创建的端口号成员和IP地址成员进行初始化，本次可以考虑给定一个默认的值：`8080`和`127.0.0.1`，也可以让用户在创建服务器时自行设定

在构造函数内部，首先就是创建一个`struct sockaddr_in`结构的对象，接着就是根据前面的提示对结构体成员进行填充，因为结构体对象一旦创建就不能再通过整体赋值的方式初始化，只能通过对每一个成员单独赋值初始化。但是填充具体值之前，建议将`struct sockaddr_in`进行<a href="javascript:;" class="custom-tooltip" data-title="在实际编程中，很多结构体可能存在未赋值的内存区域（比如结构体填充的字节或是未初始化的成员）。清空结构体可以避免因内存中残留的垃圾数据造成意外行为或错误。这样做有助于提高代码的健壮性，尤其是在后续对结构体进行单独成员赋值时，确保未被赋值的区域保持预期的状态">清空操作</a>（即全部初始化为0），下面有两种方法：

1. 使用`memset`接口进行清空
2. 使用`bzero`接口进行清空

本次考虑使用`bzero`接口进行，其原型如下：

```c
#include <strings.h>

void bzero(void *s, size_t n);
```

!!! note

    这个接口和`memset`接口的效果相同

清空后就是对每个成员进行赋值初始化

初始化`struct sockaddr_in`对象后，就可以对指定套接字的对应文件描述符进行绑定。同样，考虑使用日志系统显示相关信息

综上，代码如下：

```c++
// 错误码枚举类
enum class ErrorNumber
{
    // ...
    BindSocketFail,       // 绑定失败
};

// 默认端口和IP地址
const std::string default_ip = "127.0.0.1";
const uint16_t default_port = 8080;

class UdpServer
{
public:
    UdpServer(const std::string &ip = default_ip, uint16_t port = default_port)
        : // ... 
        , _ip(ip), _port(port)
    {
        // ...

        // 绑定端口号和IP地址
        struct sockaddr_in saddrIn;

        saddrIn.sin_family = AF_INET;
        saddrIn.sin_port = htons(_port);
        saddrIn.sin_addr.s_addr = inet_addr(_ip.c_str());

        // 使用reinterpret_cast强制类型转换
        int ret = bind(_socketfd, reinterpret_cast<const sockaddr *>(&saddrIn), sizeof(sockaddr_in));

        if (ret < 0)
        {
            LOG(LogLevel::FATAL) << "Bind error" << strerror(errno);
            exit(static_cast<int>(ErrorNumber::BindSocketFail));
        }

        LOG(LogLevel::INFO) << "Bind success";
    }

    // ...

private:
    // ...
    uint16_t _port;  // 端口号
    std::string _ip; // 点分十进制IP地址
};
```

至此，服务器创建完成，总结一下创建服务器一共分为两步：

1. 创建服务器套接字对应的文件描述符
2. 根据套接字对应的文件描述符进行协议家族、端口号和IP地址进行绑定

### 启动服务器

启动服务器就需要用到一个变量标记当前服务器是否已经启动，所以需要一个成员`_isRunning`，该变量初始化为`false`，如果当前服务器并没有启动，就可以启动服务器，否则就不需要启动

所谓的启动服务器就是让服务器执行指定的任务，本次服务端就是负责接收信息并回复客户端发送的信息

因为服务器一般情况下一旦启动就不会再关闭，为了模拟这种情况，考虑服务器启动后就是一个死循环，在这个循环内部就是服务器执行任务的逻辑，所以基本结构如下：

```c++
// 启动服务器
void start()
{
    if (!_isRunning)
    {
        _isRunning = true;
        while (true)
        {
        }
    }
}
```

接下来就是考虑服务器执行的任务：接收客户端的消息并返回客户端的消息。对于这个任务可以拆为两个任务：

1. 接收客户端消息
2. 返回客户端接收到的消息

首先考虑接收客户端消息，接收客户端消息可以使用`recvfrom`接口，其原型如下：

```c
ssize_t recvfrom(int sockfd, void *buf, size_t len, int flags,
                struct sockaddr *src_addr, socklen_t *addrlen);
```

如果仔细观察上面的接口可以发现其和之前文件部分的`read`接口很类似，该接口的第一个参数表示用于接收的套接字对应的文件描述符，第二个参数表示缓冲区，用于存储接收到的数据，第三个参数表示缓冲区的大小，第四个参数表示是否是一个标记位，传递0表示使用默认的阻塞模式和行为，第五个参数表示客户端的套接字结构，第六个参数表示客户端套接字结构的大小

对于前四个参数都很好理解，关键是第五个参数，为什么服务器端接收还需要知道客户端套接字结构，具体来说，为什么服务器端接收需要知道客户端的端口和IP地址。最简单的解释就是因为UDP是无连接协议，服务器没有固定的连接信息，所以每次收到数据包时，需要知道数据包的来源（客户端的IP和端口），以便在需要回复数据时能正确定位到发送方，另外获取客户端信息有助于日志记录、错误排查以及实时监控，这样可以更准确地定位是哪个客户端发来了数据以及可能出现的问题所在

但是，需要注意，后两个参数是输出型参数，也就是说，第四个参数和第五个参数的值并不需要用户指定

该接口返回读取到的字节数，否则返回-1

根据这个接口的介绍，可以设计第一个任务的逻辑如下，同样考虑结合日志显示相应的信息：

!!! note

    建议接收数据时留下一个位置用于存放`\0`

```c++
// 启动服务器
void start()
{
    if (!_isRunning)
    {
        _isRunning = true;
        while (true)
        {
            // 1. 接收客户端信息
            char buffer[1024] = {0};
            struct sockaddr_in peer;
            socklen_t length = sizeof(peer);
            // sizeof(buffer) - 1留下一个位置存放\0
            ssize_t ret = recvfrom(_socketfd, buffer, sizeof(buffer) - 1, 0, reinterpret_cast<struct sockaddr *>(&peer), &length);

            if (ret > 0)
            {
                struct sockaddr_in temp = static_cast<struct sockaddr_in>(peer);

                // 1.1 打印信息
                LOG(LogLevel::INFO) << buffer;
            }
        }
    }
}
```

为了知道是哪一个客户端发送的消息，可以考虑打印出客户端消息的同时打印出客户端的端口和IP地址，此处需要注意：

首先，因为`recvfrom`接口的第四个参数类型是`struct sockaddr`，这个结构中默认不带有端口和IP地址，所以还需要转换回网络套接字结构对象

接着，因为网络使用的是大端，而一般的客户机都是小端，所以考虑将收到的端口和IP地址转换回小端字节序，对应地可以使用接口：

```c
// 将大端字节序端口转换为小端字节序
uint16_t ntohs(uint16_t netshort);
// 将IP地址转换为小端字节序并按照点分十进制存储到一个静态空间，注意此处返回的不是字符串
char *inet_ntoa(struct in_addr in);
```

!!! note

    对于「将IP地址转换为小端字节序并按照点分十进制存储」可以使用接口`inet_ntop`，该接口原型如下：

    ```c++
    const char *inet_ntop(int af, const void * src, char *dst, socklen_t size);
    ```

    该接口的第一个参数表示协议族，网络通信传递`AF_INET`，第二个参数传递`struct in_addr`类型变量的地址，第三个参数传递一个用于存储结果的空间地址，第四个参数传递第三个参数的大小

    因为这个接口可以在函数的内部创建一个临时空间作为接口的第三个实参，如果是多线程情况下就不会出现多个线程访问同一块空间的问题

    该接口返回一个IP地址字符串

    示例代码如下：

    ```c++
    void test()
    {
        struct sockaddr_in local;
        char ipbuffer[64];
        const char *ip = ::inet_ntop(AF_INET, &local.sin_addr, ipbuffer, sizeof(ipbuffer));
    }
    ```

结合这两个接口完善信息的打印：

```c++
// ...
struct sockaddr_in temp = reinterpret_cast<struct sockaddr_in>(peer);

// 1.1 打印信息
LOG(LogLevel::INFO) << "Client: " 
                    << inet_ntoa(temp.sin_addr) << ":" 
                    << ntohs(temp.sin_port) 
                    << " send: " << buffer;
// ...
```

至此，服务器可以显示从客户端接收的消息，第一个任务完成，接下来处理第二个任务，服务器向客户端回复收到的信息。既然是回复，那么肯定涉及到发送信息，此时就可以使用`sendto`接口，其原型如下：

```c
ssize_t sendto(int sockfd, const void *buf, size_t len, int flags,
                const struct sockaddr *dest_addr, socklen_t addrlen);
```

如果仔细观察上面的接口可以发现其和之前文件部分的`write`接口很类似，前四个参数和`recvfrom`一样，不再赘述，下面主要介绍第五个参数：

第五个参数表示目标网络套接字结构，既然是发送，肯定需要知道对方的端口和IP地址，所以第五个参数需要使用者自己创建对象并填充对应值

第六个参数和`recvfrom`一样

该接口返回成功发送的字节数，否则返回-1

因为在前面已经获取到了客户端的端口和IP地址，只需要直接赋值就可以正确设置客户端的网络套接字结构，所以基本逻辑如下：

```c++
// 2. 回应客户端
ssize_t n = sendto(_socketfd, buffer, sizeof(buffer), 0, reinterpret_cast<const struct sockaddr *>(&temp), sizeof(temp));

if (n > 0)
{
    // 2.1 打印回复信息
    LOG(LogLevel::INFO) << "Server received: "
                        << buffer
                        << ", and send to: "
                        << inet_ntoa(temp.sin_addr) << ":"
                        << ntohs(temp.sin_port);
}
```

### 停止服务器

停止服务器的逻辑很简单，只需要判断`_isRunning`是否为`true`，如果为`true`就调用文件部分提到的`close`接口关闭`_socketfd`并将`_isRunning`设置为`false`即可，为了保证对象销毁时可以自动释放，考虑在析构函数中调用停止服务器的接口：

=== "停止服务器接口"

    ```c++
    // 停止服务器
    void stop()
    {
        if (_isRunning)
            close(_socketfd);
    }
    ```

=== "析构函数"

    ```c++
    ~UdpServer()
    {
        stop();
    }
    ```

## 创建并封装客户端

### 创建客户端类

对客户端进行封装首先需要大致的框架，因为客户端主要是向服务器发送内容，所以主要任务就是发送信息，也就是启动客户端，对应地客户端也可以有停止客户端的接口，所以基本框架如下：

```c++
class UdpClient
{
public:
    UdpClient()
    {
    }

    // 启动客户端
    void start()
    {
    }

    // 结束客户端
    void stop()
    {
    }

    ~UdpClient()
    {
    }

private:
};
```

### 创建客户端套接字

创建客户端套接字的方式和服务端，此处不再赘述，代码如下：

```c++
enum class ErrorNumber
{
    ClientSocketFail = 1, // 创建套接字失败
};

class UdpClient
{
public:
    UdpClient()
        : _socketfd(-1)
    {
        _socketfd = socket(AF_INET, SOCK_DGRAM, 0);

        if (_socketfd < 0)
        {
            LOG(LogLevel::FATAL) << "Client initiate error: " << strerror(errno);

            exit(static_cast<int>(ErrorNumber::ClientSocketFail));
        }

        LOG(LogLevel::INFO) << "Client initiated: " << _socketfd;
    }

    // ...

private:
    int _socketfd; // 套接字文件描述符
};
```

### *绑定客户端IP地址和端口

实际上，客户端并不需要绑定IP地址和端口，如果客户端由程序员绑定，那么假设有两个公司上线的客户端使用的端口是一样的，就会出现一个软件先打开之后可以正常收到服务器发送的数据，但是另外一个软件的服务器就无法正确发送信息到对应的软件上，即一个端口只能对应一个进程，但是一个进程可以有多个端口

那么，客户端难道不需要端口吗？**并不是**，如果客户端没有端口，那么服务器只能通过IP地址找到具体客户端设备，但是找不到对应地进程，既然如此，客户端的端口怎么确定？实际上这个端口由**操作系统自行分配**

那么服务器端又为什么需要程序员手动绑定端口号？因为服务器端口号如果是随机的，而软件中请求服务器的端口号是固定的，那么一个软件可能在某一天可以正常收到服务器发送的数据，但是下一次因为服务器端口号是变化的，就无法正常收到信息

综上所述，**服务器端需要程序员手动绑定IP地址和端口号，而客户端不需要程序员手动绑定IP地址和端口号，由操作系统自行分配并绑定**

### 启动客户端

启动客户端和启动服务端的设计思路基本一致，基本框架如下：

```c++
// 启动客户端
void start()
{
    if (!_isRunning)
    {
        _isRunning = true;
        while (true)
        {
        }
    }
}
```

因为客户端的任务是向服务器端发送数据，所以需要知道服务端的IP地址和端口号，同样可以给定一个默认IP地址和端口，也可以由用户自行设置：

```c++
class UdpClient
{
public:
    UdpClient(const std::string ip = default_ip, uint16_t port = default_port)
        : //...
        , _ip(ip)
        , _port(port)
    {
        // ...
    }

    // ...

private:
    // ...
    std::string _ip; // 服务器IP地址
    uint16_t _port;  // 服务器端口号
    // ...
};
```

下面就是设计客户端的任务，本次设计客户端的任务为：向服务器发送信息并回显服务器回复的信息，同样，将这个任务拆为两个任务如下：

1. 向服务器发送信息
2. 回显服务器回复的信息

首先设计第一个任务，既然是向服务器发送信息，那么就要使用到`sendto`接口，这个接口在前面已经介绍过，此处不再赘述，代码如下：

```c++
// 1. 向服务器发送数据
struct sockaddr_in local;
bzero(&local, 0);
local.sin_family = AF_INET;
local.sin_port = htons(_port);
local.sin_addr.s_addr = inet_addr(_ip.c_str());

// 1.1 读取输入信息
std::string message;
getline(std::cin, message);

// 1.2 发送数据
ssize_t ret = sendto(_socketfd, message.c_str(), message.size(), 0, reinterpret_cast<const struct sockaddr *>(&local), sizeof(local));

if (ret < 0)
    LOG(LogLevel::WARNING) << "客户端未发送成功";
```

接着设计第二个任务，回显服务器信息本质就是接收服务器的信息并显示，所以需要使用`recvfrom`接口，同样，这个接口在前面已经介绍过，此处不再赘述，代码如下：

```c++
// 2. 回显服务器的信息
struct sockaddr_in temp;
socklen_t length = sizeof(temp);
char buffer[1024] = {0};
ssize_t n = recvfrom(_socketfd, buffer, sizeof(buffer) - 1, 0, reinterpret_cast<struct sockaddr *>(&temp), &length);

if (n > 0)
    LOG(LogLevel::INFO) << "收到服务器信息：" << buffer;
```

### 停止客户端

思路与服务器端一致，代码如下：

=== "停止客户端接口"

    ```c++
    // 结束客户端
    void stop()
    {
        if (_isRunning)
            close(_socketfd);
    }
    ```

=== "析构函数"

    ```c++
    ~UdpClient()
    {
        stop();
    }
    ```

## 本地通信测试

**测试步骤：**

1. 先启动服务端，再启动客户端
2. 客户端向服务器端发送信息

**测试目标：**

1. 客户端可以正常向服务器端发送信息
2. 服务端可以正常显示客户端信息并正常向客户端返回客户端发送的信息
3. 客户端可以正常显示服务端回复的信息

**测试代码如下：**

=== "客户端"

    ```c++
    #include "udp_client.hpp"
    
    #include <memory>
    
    using namespace UdpClientModule;
    using namespace LogSystemModule;
    
    int main(int argc, char *argv[])
    {
        std::shared_ptr<UdpClient> client;
        if (argc == 1)
        {
            // 创建客户端对象——使用默认端口和IP地址
            client = std::make_shared<UdpClient>();
        }
        else if (argc == 3)
        {
            // 获取到用户输入的端口和IP地址
            std::string ip = argv[1];
            uint16_t port = std::stoi(argv[2]);
    
            // 创建客户端对象——用户自定义端口和IP地址
            client = std::make_shared<UdpClient>(ip, port);
        }
        else
        {
            LOG(LogLevel::ERROR) << "错误使用，正确使用为：" << argv[0] << " IP地址 端口号（或者二者都不存在）";
            exit(3);
        }
    
        // 启动客户端
        client->start();
    
        return 0;
    }
    ```

=== "服务端"

    ```c++
    #include "udp_server.hpp"
    #include <memory>
    
    using namespace UdpServerModule;
    
    int main()
    {
        // 创建UdpServerModule对象
        std::shared_ptr<UdpServer> udp_server = std::make_shared<UdpServer>();
    
        udp_server->start();
    
        return 0;
    }
    ```

本次设计的客户端支持用户从命令行输入端口和IP地址，否则就直接使用默认，下面是一种结果：

<img src="1. UDP编程接口基本使用.assets/image-20250226174931942.png">

## 测试云服务器与本地进行通信

### 相同操作系统（客户端和服务端均为Linux）

因为此时需要确保服务端运行在云服务器的公网IP上，否则客户端无法找到服务端，服务端测试代码修改如下：

```c++
#include "udp_server.hpp"
#include <memory>

using namespace UdpServerModule;

int main(int argc, char *argv[])
{
    // 创建UdpServerModule对象
    std::shared_ptr<UdpServer> udp_server;
    if (argc == 1)
    {
        udp_server = std::make_shared<UdpServer>();
    }
    else if (argc == 3)
    {
        std::string ip = argv[1];
        uint16_t port = std::stoi(argv[2]);
        udp_server = std::make_shared<UdpServer>(ip, port);
    }

    udp_server->start();

    return 0;
}
```

测试云服务器与本地进行通信最直接的步骤如下：

1. 将服务端程序拷贝到云服务器
2. 本地作为客户端，通过云服务器的公网IP地址连接云服务器的服务端
3. 客户端向云服务器发送信息

根据上面的步骤依次进行：

**将服务端程序拷贝到云服务器：**

<img src="1. UDP编程接口基本使用.assets\Snipaste_2025-02-26_19-23-29.png">

因为传输到云服务器的文件默认是没有可执行权限的，所以需要使用`chmod`指令设置可执行权限：

<img src="1. UDP编程接口基本使用.assets\Snipaste_2025-02-26_19-25-20.png">

接着，指定IP地址为云服务器公网IP地址，端口为8080，运行云服务器的服务端：

<img src="1. UDP编程接口基本使用.assets\Snipaste_2025-02-26_19-47-32.png">

从上图可以看到，虽然创建套接字成功，但是绑定失败。之所以出现这个问题是因为**云服务器的公网IP地址是不允许用户自行绑定**的，但是如果是虚拟机就可以进行绑定IP地址（非127.0.0.1地址）

那么有没有什么办法解决呢？**有**，但是在实现解决方案之前先了解下面的知识：

前面的代码在启动时都为服务器设置启动IP地址，但是思考一个问题，启动服务器真的需要指定IP地址吗？**并不需要**，那如果不需要指定服务器端IP地址，客户端怎么找到服务器呢？回答这个问题之前先解释为什么启动服务器不需要指定IP地址。实际上，之所以不需要IP地址是因为一台服务器可能有多个IP地址，此时如果服务器固定IP地址，那么此时就会出现服务器只能接收传送到固定IP地址的信息，就算服务器有很多IP地址也只有一个IP地址可以使用，很明显这个效果并不符合UDP协议的特点，因为UDP协议是面向无连接的，既然都不需要连接，为什么还需要指定IP地址，所以启动服务器不需要指定IP地址。有了这个概念之后，再解释没有指定服务器端IP地址，客户端怎么找到服务器，实际上只需要客户端启动的时候指定已经知道的服务器IP地址和端口号即可，对应的服务器只需要设置好端口号即可完成通信

有了上面的概念，对服务器端代码修改如下：

=== "服务器端封装代码"

    ```c++
    // 默认端口和IP地址
    // const std::string default_ip = "127.0.0.1"; 去除

    // ...

    class UdpServer
    {
    public:
        UdpServer(uint16_t port = default_port /* const std::string &ip = default_ip 服务器端不需要指定IP地址 */)
            : _socketfd(-1), _port(port), _isRunning(false) /* , _ip(ip) */
        {
            // ...

            // 绑定端口号和IP地址
            // ...
            // saddrIn.sin_addr.s_addr = inet_addr(_ip.c_str());
            // 服务器端IP地址设置为任意
            saddrIn.sin_addr.s_addr = INADDR_ANY;

            // ...
        }

        // ...

    private:
        // ...
        // std::string _ip; // 点分十进制IP地址——去除
        // ...
    };
    ```

=== "主函数"

    ```c++
    #include "udp_server.hpp"
    #include <memory>

    using namespace UdpServerModule;

    int main(int argc, char *argv[])
    {
        // 创建UdpServerModule对象
        std::shared_ptr<UdpServer> udp_server;
        if (argc == 1)
        {
            udp_server = std::make_shared<UdpServer>();
        }
        else if (argc == 2)
        {
            // std::string ip = argv[1]; 去除
            uint16_t port = std::stoi(argv[1]);
            udp_server = std::make_shared<UdpServer>(port);
        }
        else
        {
            LOG(LogLevel::ERROR) << "错误使用，正确使用：" << argv[0] << " 端口（或者不写）";
            exit(4);
        }

        udp_server->start();

        return 0;
    }
    ```

在上面的服务器端封装代码中，因为不需要指定IP地址，在绑定时，对于`struct sockaddr_in`中的IP地址字段设置为`INADDR_ANY`表示`0.0.0.0`，即任意IP地址

!!! info "关于`INADDR_ANY`"

    在底层实际上就是0：

    ```c++
    #define	INADDR_ANY		((in_addr_t) 0x00000000)
    ```

现在再按照前面提到的三步进行云服务器与本地进行通信：

**将服务端程序拷贝到云服务器：**

前面两步不变，只演示最后一步：

<img src="1. UDP编程接口基本使用.assets\Snipaste_2025-02-26_20-09-46.png">

可以看到服务器已经正常启动了

**本地作为客户端，通过云服务器的公网IP地址连接云服务器的服务端：**

启动本地的客户端：

<img src="1. UDP编程接口基本使用.assets\Snipaste_2025-02-26_20-11-22.png">

**客户端向云服务器发送信息**

如果客户端可以正常发送信息并且回显服务器回复的信息，服务器可以正常显示来自客户端的信息并且正常回复客户端收到的信息，那么说明连接成功：

<img src="1. UDP编程接口基本使用.assets\Snipaste_2025-02-26_20-34-57.png">

从上图中可以看到，客户端和服务端已经可以正常通信，至此，从前面的本地通信测试完成了网络通信

??? warning "云服务器安全组问题"

    需要注意，如果使用修改后的代码可以实现本地通信，但是使用修改后的代码无法实现网络通信（例如客户端正确指定云服务器IP地址和端口号并正常启动，服务器也是正常启动，但是客户端发送消息服务端并没有反应），此时可能是云服务器的安全组问题，如果云服务器的安全组并没有允许其他设备通过UDP协议向当前云服务器发送信息，那么就会出现客户端发送消息服务端没有反应的情况。对于这种情况可以在云服务的安全组配置中允许UDP协议和对应的端口，下面以阿里云为例：

    1. 进入安全组

        <img src="1. UDP编程接口基本使用.assets\Snipaste_2025-02-26_20-41-16.png">

    2. 点击管理规则

        <img src="1. UDP编程接口基本使用.assets\Snipaste_2025-02-26_20-41-57.png">

    3. 点击手动添加

        <img src="1. UDP编程接口基本使用.assets\Snipaste_2025-02-26_20-42-48.png">

    4. 按照下图进行设置

        <img src="1. UDP编程接口基本使用.assets\Snipaste_2025-02-26_20-43-44.png">

    <span style="color: red; font-size: 20px">注意，测试完毕后不要遗忘删除UDP协议安全组保证服务器安全</span>

### 不同操作系统（客户端为Windows，服务端为Linux）

因为Windows和Linux尽管系统底层不同，但是使用的都是同一个网络协议栈，所以二者可以通信，这一点在前面[网络基础部分](https://www.help-doc.top/Linux/net-basic/net-basic.html#_7)已经提到过此处不再赘述，有了上面通信的基础，下面演示Windows作为客户端连接Linux上的服务端，因为Windows中使用接口和Linux中差不多，所以不会再详细介绍，下面直接给出Windows客户端代码：

```c++
#include <iostream>
#include <cstdio>
#include <thread>
#include <string>
#include <cstdlib>

// 引入Windows网络编程相关的库
#include <WinSock2.h>
#include <Windows.h>

// 用特定的编译器警告，警告代码4996通常与使用被微软标记为"不安全"或"已弃用"的函数相关
#pragma warning(disable : 4996) 

// 告诉编译器链接Windows Socket 2库
// 相当于在项目设置中手动添加这个库作为依赖项ws2_32.lib包含了Windows平台下所有网络编程相关的函数实现
#pragma comment(lib, "ws2_32.lib")

std::string serverip = "";  // 填写云服务器IP地址
uint16_t serverport = 8888; // 填写云服务中服务端端口号

int main()
{
    WSADATA wsd;
    WSAStartup(MAKEWORD(2, 2), &wsd);

    struct sockaddr_in server;
    memset(&server, 0, sizeof(server));
    server.sin_family = AF_INET;
    server.sin_port = htons(serverport);
    server.sin_addr.s_addr = inet_addr(serverip.c_str());

    SOCKET sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    if (sockfd == SOCKET_ERROR)
    {
        std::cout << "socker error" << std::endl;
        return 1;
    }
    std::string message;
    char buffer[1024];
    while (true)
    {
        std::cout << "Please Enter@ ";
        std::getline(std::cin, message);
        if(message.empty()) continue;
        sendto(sockfd, message.c_str(), (int)message.size(), 0, (struct sockaddr *)&server, sizeof(server));
        struct sockaddr_in temp;
        int len = sizeof(temp);
        int s = recvfrom(sockfd, buffer, 1023, 0, (struct sockaddr *)&temp, &len);
        if (s > 0)
        {
            buffer[s] = 0;
            std::cout << buffer << std::endl;
        }
    }

    closesocket(sockfd);
    WSACleanup();
    return 0;
}
```

在VS2022上运行上面的代码并连接服务器：

<img src="1. UDP编程接口基本使用.assets\Snipaste_2025-02-27_16-19-15.png">

向服务端发送信息：

<img src="1. UDP编程接口基本使用.assets\Snipaste_2025-02-27_16-21-54.png">

可以看到服务端已经接收到客户端发送的信息，说明发送成功

??? info "关于`WinSock2.h`"

    `WinSock2.h`是Windows Sockets API（应用程序接口）的头文件，用于在Windows平台上进行网络编程。它包含了Windows Sockets2（Winsock2）所需的数据类型、函数声明和结构定义，使得开发者能够创建和使用套接字进行网络通信。在编写使用Winsock2的程序时，需要在源文件中包含`WinSock2.h`头文件。这样，编译器就能够识别并理解Winsock2中定义的数据类型和函数，从而能够正确地编译和链接网络相关的代码。此外，与`WinSock2.h`头文件相对应的是`ws2_32.1ib`库文件。在链接阶段，需要将这个库文件链接到程序中，以确保运行时能够找到并调用Winsock2 API中实现的函数
    
    在`WinSock2.h`中定义了一些重要的数据类型和函数，如：
    
    1. `WSADATA`：保存初始化`Winsock`库时返回的信息
    2. `S0CKET`:表示一个套接字描述符，用于在网络中唯一标识一个套接字
    3. `sockaddr_in`：IPv4地址结构体，用于存储IP地址和端口号等信息
    4. `socket()`：创建一个新的套接字
    5. `bind()`：将套接字与本地地址绑定
    6. `listen()`：将套接字设置为监听模式，等待客户端的连接请求
    7. `accept()`：接受客户端的连接请求，并返回一个新的套接字描述符，用于与客户端进行通信

??? info "关于`WSAStartup`"

    `WSAStartup`函数是Windows Sockets API的初始化函数，它用于初始化Winsock库。该函数在应用程序或DLL调用任何Windows套接字函数之前必须首先执行，它扮演着初始化的角色
    
    以下是`WSAStartup`函数的一些关键点：
    
    它接受两个参数：`wVersionRequested`和`lpWSAData`。`wVersionRequested`用于指定所请求的Winsock版本，通常使用`MAKEWORD(major, minor)`宏，其中`major`和`minor`分别表示请求的主版本号和次版本号。`lpWSAData`是一个指向`WSADATA`结构的指针，用于接收初始化信息。如果函数调用成功，它会返回0；否则，返回错误代码。`WSAStartup`函数的主要作用是向操作系统说明我们将使用哪个版本的Winsock库，从而使得该库文件能与当前的操作系统协同工作。成功调用该函数后，Winsock库的状态会被初始化，应用程序就可以使用Winsock提供的一系列套接字服务，如地址家族识别、地址转换、名字查询和连接控制等。这些服务使得应用程序可以与底层的网络协议栈进行交互，实现网络通信。在调用`WSAStartup`函数后，如果应用程序完成了对请求的Socket库的使用，应调用`WSACleanup`函数来解除与Socket库的绑定并释放所占用的系统资源

### 服务端显示的客户端IP地址

在上面的测试中如果将服务端收到客户端发送的消息时回显的IP地址与<a href="javascript:;" class="custom-tooltip" data-title="Windows使用ipconfig查看的IP地址，Linux使用ifconfig查看的IP地址">客户端实际的IP地址</a>对比会发现并不相同，实际上因为是不同局域网通信，经过了运营商的转发，所以服务端显示的客户端的IP地址准确来说是虚拟IP地址，具体见后面章节叙述

## 部分细节优化

在前面对服务端和客户端进行封装时，可以发现有些代码其实是可以进行合并的，还有一部分代码是可以进行封装的，下面就这些代码进行优化

### 合并重复代码

在出现错误时，服务端和客户端的退出码应该是一致的，此时可以对错误码枚举类进行抽取放到一个公共的文件中：

```c++
// 文件errors.hpp中
#pragma once

// 错误码枚举类
enum class ErrorNumber
{
    SocketFail = 1, // 创建套接字失败（供服务端和客户端使用）
    BindSocketFail, // 绑定失败（供服务端使用）
};
```

再在服务端封装文件和客户端封装文件中引入该文件并修改指定位置的代码即可，不再演示

### 封装端口和IP地址

在前面封装服务端和客户端时经常需要对`struct sockaddr_in`结构进行操作，尤其是端口号和IP地址，除了需要获取到值外还需要对获取到的值进行大小端转换，为了简化这个操作，可以考虑对`struct sockaddr_in`结构进行封装，基本思路如下：

**封装基本结构**

既然是对`struct sockaddr_in`结构进行封装，那么肯定少不了`struct sockaddr_in`对象，那么在构造时可以考虑两种构造方式：

1. 直接使用`struct sockaddr_in`对象进行构造：服务器和客户端均可使用
2. 使用端口进行构造：大部分情况给服务器创建对象使用
3. 使用端口和IP地址进行构造：大部分情况给客户端创建对象使用

因为在上面客户端和服务器端中都频繁获取IP地址和端口号，所以可以考虑添加IP地址和端口号作为单独的成员并提供单独的接口返回给调用者，所以基本结构如下：

```c++
class SockAddrIn
{
    // 无参构造
    SockAddrIn()
    {
    }

    // 根据指定的sockaddr_in对象进行构造
    SockAddrIn(const struct sockaddr_in &s)
        : _s_addr_in(s)
    {
    }

    // 根据具体端口构造
    SockAddrIn(uint16_t port)
        : _port(port)
    {
        // 内部通过传入的端口对sockaddr_in对象进行初始化
    }

    // 根据端口和IP地址构造
    SockAddrIn(uint16_t port, std::string ip)
        : _ip(ip), _port(port)
    {
        
    }

    // 返回IP地址
    std::string getIp()
    {
        return _ip;
    }

    // 返回端口号
    uint16_t getPort()
    {
        return _port;
    }

    ~SockAddrIn()
    {
    }

private:
    struct sockaddr_in _s_addr_in;
    std::string _ip;
    uint16_t _port;
};
```

在前面封装客户端和服务端可以发现需要对端口和IP地址进行各种转换，所以本次封装类的第二个作用就是简化使用，即提供转换接口。在前面使用端口号和IP地址时，最经常转换的过程就是大端转小端，所以本次就对大端转小端的接口进行封装，但是如果需要使用者单独调用，那么和直接调用转换函数没什么区别，所以考虑返回给使用者的值是已经转换完成的值。根据这个思路提供下面两个接口：

=== "大端转换为本地端口值"

    ```c++
    // 大端转换为本地端口值
    void NetPort2Local()
    {
        _port = ntohs(_s_addr_in.sin_port);
    }
    ```

=== "将IP地址转换为小端字节序并按照点分十进制存储"

    ```c++
    // 将IP地址转换为小端字节序并按照点分十进制存储
    void NetIP2Local()
    {
        char buffer[1024] = {0};
        _ip = inet_ntop(AF_INET, &_s_addr_in.sin_addr, buffer, sizeof(buffer));
    }
    ```

因为不需要外部调用，所以需要将该接口作为私有接口供类内成员调用：

```c++
private:
    // 大端转换为本地端口值
    void NetPort2Local()
    {
        _port = ntohs(_s_addr_in.sin_port);
    }

    // 将IP地址转换为小端字节序并按照点分十进制存储
    void NetIP2Local()
    {
        char buffer[1024] = {0};
        const char *ip = inet_ntop(AF_INET, &_s_addr_in.sin_addr, buffer, sizeof(buffer));
        _ip = buffer;
    }
```

接着，为了保证外部获取到的就是转换后的值，可以考虑在两个构造中调用对应的方法：

=== "根据指定的`sockaddr_in`对象进行构造"

    ```c++
    // 根据指定的sockaddr_in对象进行构造
    SockAddrIn(const struct sockaddr_in &s)
        : _s_addr_in(s)
    {
        // 转换为本地小端用于使用
        NetIP2Local();
        NetPort2Local();
    }
    ```

=== "根据具体端口构造"

    ```c++
    // 根据具体端口构造
    SockAddrIn(uint16_t port)
        : _port(port)
    {
        // 内部通过传入的端口对sockaddr_in对象进行初始化
        _s_addr_in.sin_family = AF_INET;
        _s_addr_in.sin_port = htons(_port);
        _s_addr_in.sin_addr.s_addr = INADDR_ANY;
    }
    ```

=== "根据端口和IP地址构造"

    ```c++
    // 根据端口和IP地址构造
    SockAddrIn(uint16_t port, std::string ip)
        : _ip(ip), _port(port)
    {
        _s_addr_in.sin_family = AF_INET;
        _s_addr_in.sin_port = htons(_port);
        _s_addr_in.sin_addr.s_addr = inet_addr(_ip.c_str());
    }
    ```

最后，在前面使用`recvfrom`和`sendto`接口时还遇到需要强制转换的情况，所以可以提供一个接口返回已经转换后的结构地址，这里考虑使用对`&`进行重载：

```c++
// 重载&
struct sockaddr *operator&()
{
    return reinterpret_cast<struct sockaddr *>(&_s_addr_in);
}
```

并且提供获取`struct sockaddr_in`对象长度的接口：

```c++
// 获取struct sockaddr_in对象长度
socklen_t getLength()
{
    return sizeof(_s_addr_in);
}
```

根据上面封装的结构下面对客户端和服务端进行修改：

=== "服务端"

    ```c++
    class UdpServer
    {
    public:
        UdpServer(uint16_t port = default_port)
            : // ...
            , _sa_in(port)
            // ...
        {
            // ...

            // 绑定端口号和IP地址
            // struct sockaddr_in saddrIn;

            // saddrIn.sin_family = AF_INET;
            // saddrIn.sin_port = htons(_port);
            // // saddrIn.sin_addr.s_addr = inet_addr(_ip.c_str());
            // // 服务器端IP地址设置为任意
            // saddrIn.sin_addr.s_addr = INADDR_ANY;

            // 使用reinterpret_cast强制类型转换
            // int ret = bind(_socketfd, reinterpret_cast<const sockaddr *>(&saddrIn), sizeof(sockaddr_in));

            int ret = bind(_socketfd, &_sa_in, _sa_in.getLength());

            // ...
        }

        // 启动服务器
        void start()
        {
            if (!_isRunning)
            {
                _isRunning = true;
                while (true)
                {
                    // 1. 接收客户端信息
                    // ...
                    struct sockaddr_in peer;
                    // ...
                    
                    if (ret > 0)
                    {
                        // 1.1 打印信息
                        // struct sockaddr_in temp = peer;
                        // LOG(LogLevel::INFO) << "Client: "
                        //                     << inet_ntoa(temp.sin_addr) << ":"
                        //                     << ntohs(temp.sin_port)
                        //                     << " send: " << buffer;

                        SockAddrIn temp(peer);
                        LOG(LogLevel::INFO) << "Client: "
                                            << temp.getIp() << ":"
                                            << temp.getPort()
                                            << " send: " << buffer;

                        // 2. 回应客户端
                        // ssize_t n = sendto(_socketfd, buffer, sizeof(buffer), 0, reinterpret_cast<const struct sockaddr *>(&temp), sizeof(temp));

                        ssize_t n = sendto(_socketfd, buffer, sizeof(buffer), 0, &temp, temp.getLength());

                        if (n > 0)
                        {
                            // 2.1 打印回复信息
                            // LOG(LogLevel::INFO) << "Server received: "
                            //                     << buffer
                            //                     << ", and send to: "
                            //                     << inet_ntoa(temp.sin_addr) << ":"
                            //                     << ntohs(temp.sin_port);
                            LOG(LogLevel::INFO) << "Server received: "
                                                << buffer
                                                << ", and send to: "
                                                << temp.getIp() << ":"
                                                << temp.getPort();
                        }
                    }
                }
            }
        }

        // ...

    private:
        // ...

        // uint16_t _port; // 端口号
        // // std::string _ip; // 点分十进制IP地址——去除
        SockAddrIn _sa_in;

        // ...
    };
    ```

=== "客户端"

    ```c++
    class UdpClient
    {
    public:
        UdpClient(const std::string ip = default_ip, uint16_t port = default_port)
            : // ...
            , _sa_in(port, ip)
        {
            // ...
        }

        // 启动客户端
        void start()
        {
            if (!_isRunning)
            {
                _isRunning = true;
                while (true)
                {
                    // 1. 向服务器发送数据
                    // struct sockaddr_in local;
                    // bzero(&local, 0);
                    // local.sin_family = AF_INET;
                    // local.sin_port = htons(_port);
                    // local.sin_addr.s_addr = inet_addr(_ip.c_str());

                    // ...

                    // 1.2 发送数据
                    // ssize_t ret = sendto(_socketfd, message.c_str(), message.size(), 0, &local, sizeof(local));
                    ssize_t ret = sendto(_socketfd, message.c_str(), message.size(), 0, &_sa_in, _sa_in.getLength());

                    // ...
                }
            }
        }

        // ...

    private:
        // ...

        // std::string _ip; // 服务器IP地址
        // uint16_t _port;  // 服务器端口号
        SockAddrIn _sa_in;

        // ...
    };
    ```

### 快速实现多个类不被拷贝

有的时候，有不止一个类需要防止被拷贝，如果每个类都单独写删除拷贝构造等函数会显得臃肿，为了简化这一步，可以考虑让子类继承一个禁用拷贝构造、赋值重载的父类，这样，一旦子类要拷贝就必须要拷贝父类成员，而父类成员此时无法被拷贝就间接实现了子类无法被拷贝。例如上面的服务器，防止拷贝就可以写成：

=== "禁用拷贝构造和赋值重载的父类"

    ```c++
    class NoCopy
    {
    public:
        NoCopy()
        {
        }
        NoCopy(const NoCopy &np) = delete;
        NoCopy operator=(const NoCopy &np) = delete;
        ~NoCopy()
        {
        }
    };
    ```

=== "服务器类"

    ```c++
    class UdpServer : public NoCopy
    {
        // ...
    };
    ```