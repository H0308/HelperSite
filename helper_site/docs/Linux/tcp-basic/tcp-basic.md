# TCP编程接口基本使用

## 本篇介绍

在[UDP编程接口基本使用](https://www.help-doc.top/Linux/udp/udp-basic/udp-basic.html#udp)已经介绍过UDP编程相关的接口，本篇开始介绍TCP编程相关的接口。有了UDP编程的基础，理解TCP相关的接口会更加容易，下面将按照两个方向使用TCP编程接口：

1. 基本使用TCP编程接口实现服务端和客户端通信
2. 使用TCP编程实现客户端控制服务器执行相关命令的程序

## 创建并封装服务端

### 创建服务器类

与UDP一样，首先创建服务器类的基本框架，本次设计的服务器一旦启动就不再关闭，除非手动关闭，所以可以提供两个接口：

1. `start`：启动服务器
2. `stop`：停止服务器

基本结构如下：

```c++
class TcpServer
{
public:
    TcpServer()
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

    ~TcpServer()
    {
    }
};
```

### 创建服务器套接字

创建方式与UDP基本一致，只是在`socket`接口的第二个参数使用`SOCK_STREAM`而不再是`SOCK_DGRAM`，代码如下：

```c++
class TcpServer
{
public:
    TcpServer()
        : _socketfd(-1)
    {
        // 创建服务器套接字
        _socketfd = socket(AF_INET, SOCK_STREAM, 0);

        if (_socketfd < 0)
        {
            LOG(LogLevel::FATAL) << "Server initiated error: " << strerror(errno);
            exit(static_cast<int>(ErrorNumber::SocketFail));
        }
        LOG(LogLevel::INFO) << "Server initated: " << _socketfd;
    }

    // ...

private:
    int _socketfd;  // 服务器套接字
};
```

### 绑定服务器IP地址和端口

绑定方式与UDP基本一致，先使用原生的方式而不是直接使用封装后的`sockaddr_in`结构。在[UDP编程接口基本使用](https://www.help-doc.top/Linux/udp/udp-basic/udp-basic.html#linux)部分已经提到过服务器不需要指定IP地址，所以本次一步到位，代码如下：

```c++
// 默认端口
const uint16_t default_port = 8080;

class TcpServer
{
public:
    TcpServer(uint16_t port = default_port)
        : // ...
        , _port(port)
    {
        // ...

        struct sockaddr_in server;
        server.sin_family = AF_INET;
        server.sin_port = htons(_port);
        server.sin_addr.s_addr = INADDR_ANY;

        int ret = bind(_socketfd, reinterpret_cast<const struct sockaddr *>(&server), sizeof(server));
        if (ret < 0)
        {
            LOG(LogLevel::FATAL) << "Bind error：" << strerror(errno);
            exit(static_cast<int>(ErrorNumber::BindSocketFail));
        }
        LOG(LogLevel::INFO) << "Bind Success";
    }

    // ...

private:
    int _socketfd;  // 服务器套接字
    uint16_t _port; // 服务器端口
};
```

### 开启服务器监听

在UDP部分，走完上面的步骤就已经完成了基本工作，一旦服务器启动就会等待连接。但是在TCP部分则不行，因为TCP是面向连接的，也就是说，使用客户端需要连接使用TCP的客户端必须先建立连接，只有连接建立完成了才可以开始通信。为了可以让客户端和服务端成功建立连接，首先需要让服务器处于监听状态，此时服务器只会一直等待客户端发起连接请求

在Linux中，实现服务器监听可以使用`listen`接口，其原型如下：

```c++
int listen(int sockfd, int backlog);
```

该接口的第一个参数表示当前需要作为传输的套接字，第二个参数表示等待中的客户端的最大个数。之所以会有第二个参数是因为一旦请求连接的客户端太多但是服务器又无法快速得做出响应就会导致用户一直处于等待连接状态从而造成不必要的损失，具体介绍见[理解Linux如何看待连接以及TCP全连接队列](https://www.help-doc.top/Linux/tcp-connection-backlog/tcp-connection-backlog.html)。一般情况下第二个参数不建议设置比较大，而是因为应该根据实际情况决定，但是一定不能为0，本次大小定为8

当监听成功，该接口会返回0，否则返回-1并设置对应的错误码

在TCP中，服务器一旦被创建那么久意味着其需要开始进行监听，所以本次考虑将监听放在构造中：

```c++
// 默认最大支持排队等待连接的客户端个数
const int max_backlog = 8;

class TcpServer
{
public:
    TcpServer(uint16_t port = default_port)
        : _socketfd(-1), _port(port)
    {
        // ...

        ret = listen(_socketfd, max_backlog);
        if (ret < 0)
        {
            LOG(LogLevel::ERROR) << "Listen error：" << strerror(errno);
            exit(static_cast<int>(ErrorNumber::ListenFail));
        }
        LOG(LogLevel::INFO) << "Listen Success";
    }

    // ...
};
```

### 启动服务器

在TCP中，启动服务器的逻辑和UDP的逻辑有一点不同，因为TCP服务器在启动之前先要进行监听，所以实际上此时服务器并没有进入IO状态，所以一旦启动服务器后，首先要做的就是一旦成功建立连接就需要进入收发消息的状态

首先判断服务器是否启动，如果服务器本身已经启动就不需要再次启动，所以还是使用一个`_isRunning`变量作为判断条件，基本逻辑如下：

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

接着就是在监听成功的情况下进入IO状态，这里使用的接口就是`accept`，其原型如下：

```c++
int accept(int sockfd, struct sockaddr * addr, socklen_t * addrlen);
```

该接口的第一个参数表示需要绑定的服务器套接字，第二个参数表示对方的套接字结构，第二个参数表示对方套接字结构的大小，其中第二个参数和第三个参数均为输出型参数

需要注意的是该接口的返回值，当函数执行成功时，该接口会返回一个套接字，这个套接字与前面通过`socket`接口获取到的套接字不同。在UDP中，只有一个套接字，就是`socket`的返回值，但是在TCP中，因为首先需要先监听，此时需要用到的实际上是监听套接字，一旦监听成功，才会给定用于IO的套接字。所以实际上，在TCP中，`socket`接口的返回值对应的是`listen`用的套接字，而`accept`的套接字就是用于IO的套接字

基于上面的概念，现在对前面的代码进行一定的修正：对于前面的成员`_socketfd`，应该修改为`_listen_socketfd`：

```c++
class TcpServer
{
public:
    TcpServer(uint16_t port = default_port)
        : _listen_socketfd(-1), _port(port), _isRunning(false)
    {
        // 创建服务器套接字
        _listen_socketfd = socket(AF_INET, SOCK_STREAM, 0);

        if (_listen_socketfd < 0)
        {
            LOG(LogLevel::FATAL) << "Server initiated error: " << strerror(errno);
            exit(static_cast<int>(ErrorNumber::SocketFail));
        }
        LOG(LogLevel::INFO) << "Server initated: " << _listen_socketfd;
        
        int ret = bind(_listen_socketfd, reinterpret_cast<const struct sockaddr *>(&server), sizeof(server));
        // ...

        ret = listen(_listen_socketfd, max_backlog);
        // ...
    }

    // ...
private:
    int _listen_socketfd; // 服务器监听套接字
    // ...
};
```

接着，对于接收成功也可以创建一个成员变量`_ac_socketfd`，并用其接收`accept`接口的返回值：

```c++
class TcpServer
{
public:
    TcpServer(uint16_t port = default_port)
        : // ...
        , _ac_socketfd(-1)
    {
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
                struct sockaddr_in peer;
                socklen_t length = sizeof(peer);
                _ac_socketfd = accept(_listen_socketfd, reinterpret_cast<struct sockaddr *>(&peer), &length);
                if (_ac_socketfd < 0)
                {
                    LOG(LogLevel::WARNING) << "Accept failed：" << strerror(errno);
                    exit(static_cast<int>(ErrorNumber::AcceptFail));
                }
                LOG(LogLevel::INFO) << "Accept Success: " << _ac_socketfd;
            }
        }
    }
    
    // ...

private:
    // ...
    int _ac_socketfd;     // 服务器接收套接字
    // ...
};
```

后续的代码与UDP思路类似，但是具体实现有些不同。因为UDP是面向数据包的，所以只能「整发整取」，但是TCP是面向字节流的，所以可以「按照需求读取」而不需要「一定完整读取」，而在文件部分，读取和写入文件也是面向字节流的，所以在TCP中，读取和写入就可以直接使用文件的读写接口。但是需要注意，因为读写不是一次性的，所以需要一个循环控制持续读和写：

```c++
// 启动服务器
void start()
{
    if (!_isRunning)
    {
        while (true)
        {
            // ...

            while (true)
            {
                // 读取客户端消息
                char buffer[4096] = {0};
                ssize_t ret = read(_ac_socketfd, buffer, sizeof(buffer) - 1);
                if (ret > 0)
                {
                    LOG(LogLevel::INFO) << "Client: " << inet_ntoa(peer.sin_addr) << ":" << std::to_string(ntohs(peer.sin_port)) << " send: " << buffer;

                    // 向客户端回消息
                    ret = write(_ac_socketfd, buffer, sizeof(buffer));
                }
            }
        }
    }
}
```

### 停止服务器

停止服务器和UDP思路一致，但是需要注意，除了要关闭接收套接字以外还需要关闭监听套接字，此处不再赘述：

=== "停止服务器函数"

    ```c++
    // 停止服务器
    void stop()
    {
        if (_isRunning)
        {
            close(_listen_socketfd);
            close(_ac_socketfd);
        }
    }
    ```

=== "析构函数"

    ```c++
    ~TcpServer()
    {
        stop();
    }
    ```

## 创建并封装客户端

### 创建客户端类

与UDP一致，代码如下：

```c++
class TcpClient
{
public:
    TcpClient()
    {
    }

    // 启动客户端
    void start()
    {
    }

    // 停止客户端
    void stop()
    {
    }

    ~TcpClient()
    {
    }
};
```

### 创建客户端套接字

与UDP一致，此处不再赘述：

```c++
class TcpClient
{
public:
    TcpClient()
        : _socketfd(-1)
    {
        _socketfd = socket(AF_INET, SOCK_STREAM, 0);

        if (_socketfd < 0)
        {
            LOG(LogLevel::FATAL) << "Client initiated error：" << strerror(errno);
            exit(static_cast<int>(ErrorNumber::SocketFail));
        }
        LOG(LogLevel::INFO) << "Client initiated";
    }

    // ...

private:
    int _socketfd;
};
```

### 启动客户端

因为当前是TCP，所以客户端必须先与服务端建立连接才可以进行数据传输。在Linux中，让客户端连接服务端的接口是`connect`，其原型如下：

```c++
int connect(int sockfd, const struct sockaddr *addr, socklen_t addrlen);
```

该接口的第一个参数表示传送数据需要的套接字，第二个参数表示服务器的套接字结构，第三个参数表示第二个参数的大小

如果该接口连接成功或者绑定成功，则返回0，否则返回-1并且设置错误码

!!! note

    需要注意，该接口会在成功连接后自动绑定端口和IP地址，与UDP一样不需要用户手动设置客户端的IP地址和端口

因为需要用到服务器的端口和IP地址，所以在创建客户端对象时需要让用户传递IP地址和端口，所以基本代码如下：

```c++
// 默认服务器端口和IP地址
const std::string default_ip = "127.0.0.1";
const uint16_t default_port = 8080;

class TcpClient
{
public:
    TcpClient(const std::string &ip = default_ip, uint16_t port = default_port)
        : // ...
        , _isRunning(false), _ip(ip), _port(port)
    {
        // ...
    }

    // 启动客户端
    void start()
    {
        if (!_isRunning)
        {
            _isRunning = true;
            // 启动后就进行connect
            struct sockaddr_in server;
            server.sin_family = AF_INET;
            server.sin_addr.s_addr = inet_addr(_ip.c_str());
            server.sin_port = htons(_port);
            int ret = connect(_socketfd, reinterpret_cast<const struct sockaddr *>(&server), sizeof(server));
            if (ret < 0)
            {
                LOG(LogLevel::WARNING) << "Connect failed" << strerror(errno);
                exit(static_cast<int>(ErrorNumber::ConnectFail));
            }
            LOG(LogLevel::INFO) << "Connect Success: " << _socketfd;
            while (true)
            {
                // ...
            }
        }
    }

    // ...

private:
    // ...
    std::string _ip; // 服务器IP地址
    uint16_t _port;  // 服务器端口
    bool _isRunning; // 判断是否正在运行
};
```

在上面的代码中需要注意，不要把`connect`放在循环里，因为建立连接需要一次而不需要每一次发送都建立连接

接着就是写入和读取消息，基本思路与UDP相同，代码如下：

```c++
// 启动客户端
void start()
{
    if (!_isRunning)
    {
        // ...
        while (true)
        {
            // 向服务器写入
            std::string message;
            std::cout << "请输入消息：";
            std::getline(std::cin, message);
            ssize_t ret = write(_socketfd, message.c_str(), message.size());

            // 收到消息
            char buffer[4096] = {0};
            ret = read(_socketfd, buffer, sizeof(buffer));
            if (ret > 0)
                LOG(LogLevel::INFO) << "收到服务器消息：" << buffer;
        }
    }
}
```

### 停止客户端

停止客户端的思路与UDP一致，此处不再赘述：

=== "停止客户端函数"

    ```c++
    // 停止客户端
    void stop()
    {
        if (_isRunning)
            close(_socketfd);
    }
    ```

=== "析构函数"

    ```c++
    ~TcpClient()
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

测试代码如下：

=== "客户端"

    ```c++
    #include "tcp_client.hpp"
    #include <memory>
    
    using namespace TcpClientModule;
    
    int main(int argc, char *argv[])
    {
        std::shared_ptr<TcpClient> tcp_client;
        if (argc == 1)
        {
            // 使用默认端口和IP地址
            tcp_client = std::make_shared<TcpClient>();
        }
        else if (argc == 3)
        {
            std::string ip = argv[1];
            std::uint16_t port = std::stoi(argv[2]);
            // 使用自定义端口和IP地址
            tcp_client = std::make_shared<TcpClient>(ip, port);
        }
        else
        {
            LOG(LogLevel::ERROR) << "错误使用，正确使用为：" << argv[0] << " IP地址 端口号（或者二者都不存在）";
            exit(7);
        }
        
        tcp_client->start();
    
        tcp_client->stop();
    
        return 0;
    }
    ```

=== "服务端"

    ```c++
    #include "tcp_server.hpp"
    #include <memory>
    
    using namespace TcpServerModule;
    
    int main(int argc, char *argv[])
    {
        std::shared_ptr<TcpServer> tcp_server;
        if (argc == 1)
        {
            // 使用默认的端口
            tcp_server = std::make_shared<TcpServer>();
        }
        else if (argc == 2)
        {
            // 使用自定义端口
            std::string port = argv[1];
            tcp_server = std::make_shared<TcpServer>(port);
        }
        else
        {
            LOG(LogLevel::ERROR) << "错误使用，正确方式：" << argv[0] << " 端口（可以省略）";
            exit(6);
        }
    
        tcp_server->start();
    
        tcp_server->stop();
    
        return 0;
    }
    ```

本次设计的客户端支持用户从命令行输入端口和IP地址，否则就直接使用默认，下面是一种结果：

<img src="23. TCP编程接口基本使用.assets/image-20250303212358636.png">

## 客户端退出但服务端没有退出的问题

在UDP中，如果客户端退出但服务端没有退出，下一次客户端再连接该服务端时不会出现问题。但是在TCP中就并不是这样，例如：

<img src="23. TCP编程接口基本使用.assets\Snipaste_2025-03-04_19-13-57.png">

从上图可以看到，如果客户端连接后断开再连接就会出现第二次连接发送消息无法得到回应。之所以出现这个问题就是因为服务器卡在了读写死循环中，解决这个问题的方式很简单，只需要判断`read`接口返回值是否为0，如果为0，说明当前服务器并没有读取到任何内容，直接退出即可：

```c++
// 启动服务器
void start()
{
    if (!_isRunning)
    {
        // ...

        while (true)
        {
            // ...
            
            while(true)
            {
                // 读取客户端消息
                char buffer[4096] = {0};
                ssize_t ret = read(_ac_socketfd, buffer, sizeof(buffer) - 1);
                if (ret > 0)
                {
                    // ...
                }
                else if (ret == 0)
                {
                    LOG(LogLevel::INFO) << "Client disconnected: " << _ac_socketfd;
                    break;
                }
            }
        }
    }
}
```

此时便可以解决上面的问题：

<img src="23. TCP编程接口基本使用.assets/image-20250304193613573.png">

## 文件描述符泄漏问题

在上面的测试结果中可以发现，当客户端退出后再重新连接服务端，此时的文件描述符由4变成了5，但是实际上文件描述符是非常有限的，对于一般的用户机来说，文件描述符最大为1024，而服务器一般为65535，使用下面的指令可以查看：

```shell
ulimit -a
```

在结果中的`open files`一栏即可看到值

既然客户端已经退出了，那么对应的文件描述符就应该关闭而不是持续被占用着，此时就出现了文件描述符泄漏问题。解决这个问题很简答，只需要在判断读取结果小于0时关闭文件描述符再退出即可：

```c++
// 启动服务器
void start()
{
    if (!_isRunning)
    {
        // ...

        while (true)
        {
            // ...

            // ...

            close(_ac_socketfd);
        }
    }
}
```

## 测试云服务器与本地进行通信

### 相同操作系统（客户端和服务端均为Linux）

测试云服务器与本地进行通信最直接的步骤如下：

1. 将服务端程序拷贝到云服务器
2. 本地作为客户端，通过云服务器的公网IP地址连接云服务器的服务端
3. 客户端向云服务器发送信息

具体操作步骤与UDP类似，下面直接展示结果：

<img src="23. TCP编程接口基本使用.assets\Snipaste_2025-03-04_18-27-08.png">

!!! note

    与UDP一样需要注意安全组的问题，以阿里云为例，设置结果如下：
    
    <img src="23. TCP编程接口基本使用.assets\Snipaste_2025-03-04_18-28-11.png">

### 不同操作系统（客户端为Windows，服务端为Linux）

因为Windows中使用接口和Linux中差不多，所以不会再详细介绍，下面直接给出Windows客户端代码：

```c++
#include <winsock2.h>
#include <iostream>
#include <string>

#pragma warning(disable : 4996)

#pragma comment(lib, "ws2_32.lib")

std::string serverip = "47.113.217.80";  // 填写云服务器IP地址
uint16_t serverport = 8888; // 填写云服务开放的端口号

int main()
{
    WSADATA wsaData;
    int result = WSAStartup(MAKEWORD(2, 2), &wsaData);
    if (result != 0)
    {
        std::cerr << "WSAStartup failed: " << result << std::endl;
        return 1;
    }

    SOCKET clientSocket = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (clientSocket == INVALID_SOCKET)
    {
        std::cerr << "socket failed" << std::endl;
        WSACleanup();
        return 1;
    }

    sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(serverport);                  // 替换为服务器端口
    serverAddr.sin_addr.s_addr = inet_addr(serverip.c_str()); // 替换为服务器IP地址

    result = connect(clientSocket, (SOCKADDR *)&serverAddr, sizeof(serverAddr));
    if (result == SOCKET_ERROR)
    {
        std::cerr << "connect failed" << std::endl;
        closesocket(clientSocket);
        WSACleanup();
        return 1;
    }
    while (true)
    {
        std::string message;
        std::cout << "Please Enter@ ";
        std::getline(std::cin, message);
        if(message.empty()) continue;
        send(clientSocket, message.c_str(), message.size(), 0);

        char buffer[1024] = {0};
        int bytesReceived = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
        if (bytesReceived > 0)
        {
            buffer[bytesReceived] = '\0'; // 确保字符串以 null 结尾
            std::cout << "Received from server: " << buffer << std::endl;
        }
        else
        {
            std::cerr << "recv failed" << std::endl;
        }
    }

    closesocket(clientSocket);
    WSACleanup();

    return 0;
}
```

运行结果如下：

<img src="23. TCP编程接口基本使用.assets\Snipaste_2025-03-04_18-48-04.png">

## 多个客户端同时连接服务器

在上面已经测试过一个客户端连接一个服务端，接下来测试多个客户端连接服务端

### 基本现象

使用本地虚拟机和云服务器的客户端本地连接云服务器的服务端：

先使用虚拟机或者云服务器的客户端连接服务端：

<img src="23. TCP编程接口基本使用.assets\Snipaste_2025-03-04_18-53-10.png">

可以看到正常连接，但是此时如果云服务器本地客户端连接云服务器的服务端：

<img src="23. TCP编程接口基本使用.assets\Snipaste_2025-03-04_18-56-59.png">

此时就会发现，尽管云服务器客户端提示连接成功，但是服务器却没有显示接收。如果云服务器的客户端向服务器发送消息也不回得到回应：

<img src="23. TCP编程接口基本使用.assets\Snipaste_2025-03-04_19-41-13.png">

如果终断虚拟机的连接，此时服务器又会显示连接成功：

<img src="23. TCP编程接口基本使用.assets\Snipaste_2025-03-04_18-58-56.png">

之所以会出现这个问题就是因为在上面的逻辑中：只有接收成功了才会发送消息，而一旦接收成功后，就在写入和读取中死循环，此时就导致`accept`不能继续接收。解决这个问题就需要考虑到使用子进程或者新线程，将接收和读写分别放在两个执行进程或者执行流中，根据这个思路下面提供三种解决方案：

1. 子进程版本
2. 新线程版本
3. 线程池版本

### 子进程版本

设计子进程版本的本质就是让子进程执行读写方法，先将读写逻辑抽离到一个函数中：

=== "读写函数"

    ```c++
    // 读写函数
    void read_write_msg(struct sockaddr_in peer)
    {
        while (true)
        {
            // 读取客户端消息
            char buffer[4096] = {0};
            ssize_t ret = read(_ac_socketfd, buffer, sizeof(buffer) - 1);
            if (ret > 0)
            {
                LOG(LogLevel::INFO) << "Client: " << inet_ntoa(peer.sin_addr) << ":" << std::to_string(ntohs(peer.sin_port)) << " send: " << buffer;
    
                // 向客户端回消息
                ret = write(_ac_socketfd, buffer, sizeof(buffer));
            }
            else if (ret == 0)
            {
                LOG(LogLevel::INFO) << "Client disconnected: " << _ac_socketfd;
                break;
            }
        }
    
        close(_ac_socketfd);
    }
    ```

=== "启动服务器函数"

    ```c++
    // 启动服务器
    void start()
    {
        if (!_isRunning)
        {
            _isRunning = true;
    
            while (true)
            {
                struct sockaddr_in peer;
                socklen_t length = sizeof(peer);
                _ac_socketfd = accept(_listen_socketfd, reinterpret_cast<struct sockaddr *>(&peer), &length);
                if (_ac_socketfd < 0)
                {
                    LOG(LogLevel::WARNING) << "Accept failed：" << strerror(errno);
                    exit(static_cast<int>(ErrorNumber::AcceptFail));
                }
                LOG(LogLevel::INFO) << "Accept Success: " << _ac_socketfd;
    
                // 读写逻辑
                read_write_msg(peer);
            }
        }
    }
    ```

接着，为了让子进程执行对应的任务，首先就是创建一个子进程，此处直接使用原生接口：

```c++
// 启动服务器
void start()
{
    if (!_isRunning)
    {
        _isRunning = true;

        while (true)
        {
            // ...

            // 创建子进程
            pid_t pid = fork();
            if (pid == 0)
            {
                // 子进程

                // 读写逻辑
                read_write_msg(peer);

                exit(0);
            }
        }
    }
}
```

但是，这样写还不足以解决问题，在[Linux进程间通信](https://www.help-doc.top/Linux/com-process/com-anonymous-pipe/com-anonymous-pipe.html#_11)提到子进程会拷贝父进程描述符表，此时同样会导致文件描述符泄漏问题，所以父进程和子进程都需要关闭自己不需要的文件描述符：对于父进程来说，其需要关闭读写用的文件描述符，因为写入和读取交给了子进程；对于子进程来说，其需要关闭监听用的文件描述符，因为继续监听其他客户端的连接由父进程进行

基于上面的思路，代码如下：

```c++
// 启动服务器
void start()
{
    if (!_isRunning)
    {
        _isRunning = true;

        while (true)
        {
            // ...

            // 创建子进程
            pid_t pid = fork();
            if (pid == 0)
            {
                // 子进程

                // 关闭监听文件描述符
                close(_listen_socketfd);

                // ...
            }

            // 父进程关闭读写描述符
            close(_ac_socketfd);
        }
    }
}
```

一旦创建了子进程，父进程就需要对其进行等待并回收，如果不回收就会导致内存泄漏问题，回收子进程的方式目前有下面两种：

1. 使用`wait`和`waitpid`接口进行等待
2. 借助子进程退出时发送的`SIGCHILD`信号，使用`SIG_IGN`行为

但是本次不使用上面的任意一种，而是考虑让子进程再创建一个子进程，一旦创建成功就让当前子进程退出，而让新创建的子进程（孙子进程）继续执行后续的代码，因为当前子进程已经退出并且退出前并没有回收新创建的子进程（孙子进程），所以当前孙子进程就会被操作系统托管变成孤儿进程，一旦孙子进程走到了读写逻辑下面的`exit(0)`就会退出，此时操作系统就会自动回收这个孙子进程。这个思路也被称为「双重`fork`（或者[守护进程化](https://www.help-doc.top/Linux/process-relationship-daemon/process-relationship-daemon.html#_6)）」。所以，代码如下：

```c++
// 启动服务器
void start()
{
    if (!_isRunning)
    {
        _isRunning = true;

        while (true)
        {
            // ...

            // 创建子进程
            pid_t pid = fork();
            if (pid == 0)
            {
                // 子进程
                // ...

                // 创建孙子进程
                if (fork())
                    exit(0); // 当前子进程执行exit(0)

                // 孙子进程从此处继续向后执行
                // 读写逻辑
                read_write_msg(peer);

                exit(0);
            }

            // ...
        }
    }
}
```

现在，再进行上面的测试可以发现问题已经解决：

<img src="23. TCP编程接口基本使用.assets\Snipaste_2025-03-04_20-41-34.png">

<img src="23. TCP编程接口基本使用.assets\Snipaste_2025-03-04_20-41-45.png">

### 新线程版本

因为所有线程共享一个文件描述符表，所以不需要手动关闭一些文件描述符，下面使用[前面封装的线程](https://www.help-doc.top/Linux/linux-thread/thread-lib/thread-lib.html?h=%E7%BA%BF#_4)进行演示：

```c++
// 启动服务器
void start()
{
    if (!_isRunning)
    {
        _isRunning = true;

        while (true)
        {
            // ...

            // // 父进程关闭读写描述符
            // close(_ac_socketfd);

            // 创建新线程
            Thread t(std::bind(&TcpServer::read_write_msg, this, peer));
            t.start();
        }
    }
}
```

但是，上面创建的方式可以正常运行吗？为了知道结果，下面进行一次测试：

<img src="23. TCP编程接口基本使用.assets/image-20250313195237027.png">

从上面的结果可以看出，如果上面的写法存在致命的问题，一旦客户端连接服务端就会出现段错误，出现这个问题的原因就在于使用的套接字是一个成员变量，而因为线程之间会共享数据，所以一旦成员变量发生了改变就会影响所有的线程。但是，如果直接看这个代码会感觉没有什么问题，并且也没有涉及到套接字创建成功之后修改套接字的行为，为什么套接字会被改变呢？这里就和操作系统底层实现`accept`有关，此处先不具体说明，只需要知道套接字创建成功，如果线程不及时使用就可能被操作系统回收，而因为线程的执行是异步的，所以可能线程还没有真正走完`start`函数，套接字就被操作系统回收了

那么是否改变一下套接字让其称为局部变量就可以解决问题呢？这里使用一个局部变量接收`accept`的返回值：

```c++
int ac_socketfd = accept(_listen_socketfd, reinterpret_cast<struct sockaddr *>(&peer), &length);
```

对应的，为了让读写函数可以看到这个套接字，就需要传递该套接字：

=== "读写函数"

    ```c++
    // 读写函数
    void read_write_msg(struct sockaddr_in peer, int ac_socketfd)
    {
        LOG(LogLevel::DEBUG) << "套接字：" << ac_socketfd;
        while (true)
        {
            // 读取客户端消息
            char buffer[4096] = {0};
            ssize_t ret = read(ac_socketfd, buffer, sizeof(buffer) - 1);
            if (ret > 0)
            {
                LOG(LogLevel::INFO) << "Client: " << inet_ntoa(peer.sin_addr) << ":" << std::to_string(ntohs(peer.sin_port)) << " send: " << buffer;
    
                // 向客户端回消息
                ret = write(ac_socketfd, buffer, sizeof(buffer));
            }
            else if (ret == 0)
            {
                LOG(LogLevel::INFO) << "Client disconnected: " << ac_socketfd;
                break;
            }
        }
    
        close(ac_socketfd);
    }
    ```

=== "创建线程"

    ```c++
    Thread t(std::bind(&TcpServer::read_write_msg, this, peer, ac_socketfd));
    t.start();
    ```

运行修改后的代码可以发现结果还是一样：

<img src="23. TCP编程接口基本使用.assets/image-20250313211534241.png">

这是因为还需要改变创建线程的方式，因为这里使用的是前面封装的线程库：启动和创建线程对象是分离的，这就导致了上面提到的问题：因为线程的执行是异步的，所以可能线程还没有真正走完`start`函数，并且因为这里的线程对象是一个局部变量，一旦当次循环结束就会被销毁，这样可能会影响到线程的执行，所以这里需要使用到原生创建线程的接口`pthread_create`进行改写：

首先，原生创建线程的接口需要传递一个执行函数和参数，这里无法直接使用`read_write_msg`，所以额外需要一个成员函数，此处称为`routine`，并且为了保证不需要绑定传递`this`，考虑这个函数设置为`static`：

```c++
static void *routine(void *args)
{
}
```

接下来就要思考如何在`routine`中调用`read_write_msg`函数，因为`read_write_msg`是一个成员函数，所以需要使用到`this`进行调用，但是`static`并没有`this`，所以需要额外传递`this`，另外`read_write_msg`有1个参数，因此，需要给`routine`传递两个个参数，但是其只有一个`args`，这个时候就需要用到结构体：

```c++
class TcpServer;

struct data
{
    struct sockaddr_in temp;
    int ac_socketfd;
    TcpServer* self;
};
```

在上面的代码中，定义了一个`data`结构体，其中`self`就是用来接收`this`，需要注意的是，如果这个结构体写在`TcpServer`类之上需要使用`class TcpServer;`作为前置声明

接着使用`pthread_create`创建线程：

```c++
pthread_t pid;
struct data d = {peer, ac_socketfd, this};
pthread_create(&pid, nullptr, routine, &d);
```

最后实现`routine`函数：

```c++
static void *routine(void *args)
{
    struct data *ptr = reinterpret_cast<struct data *>(args);
    ptr->self->read_write_msg(ptr->temp, ptr->ac_socketfd);
    return nullptr;
}
```

此时再次编译运行就可以看到可以正常运行：

<img src="23. TCP编程接口基本使用.assets/image-20250313212054763.png">

??? question "拓展问题"

    如果不修改套接字为局部变量，只是更改线程的创建方式，会发现好像也可以解决问题：
    
    <img src="23. TCP编程接口基本使用.assets/image-20250313212450144.png">

    但是事实真的如此吗？如果此时再创建一个新线程作为客户端连接就会发现问题：
    
    <img src="23. TCP编程接口基本使用.assets/image-20250313212732811.png" alt="image-20250313212732811" />
    
    出现这个问题的关键就在于套接字已经被覆盖为新连接的套接字，导致原来的套接字失效，如果此时在后启动的客户端中再次发消息，就可以看到后启动的客户端响应了先启动的客户端发送的结果：
    
    <img src="23. TCP编程接口基本使用.assets/image-20250313213238644.png">

### 线程池版本

线程池版本和新线程版本的思路非常类似，给出代码不再演示：

```c++
using task_t = std::function<void()>;

// ...

class TcpServer
{
public:
    TcpServer(uint16_t port = default_port)
        : _listen_socketfd(-1), _port(port), _isRunning(false), _ac_socketfd(-1)
    {
        // 创建服务器套接字
        // ...

        // 绑定
        // ...

        // 创建线程池
        _tp = ThreadPool<task_t>::getInstance();
        // 启动线程池
        _tp->startThreads();

        // 监听
        // ...
    }

    // ...

    // 启动服务器
    void start()
    {
        if (!_isRunning)
        {
            _isRunning = true;

            while (true)
            {
                // ...

                // version-3
                _tp->pushTasks(std::bind(&TcpServer::read_write_msg, this, peer, ac_socketfd));
            }
        }
    }

    // 停止服务器
    void stop()
    {
        if (_isRunning)
        {
            _tp->stopThreads();
            // ...
        }
    }

    ~TcpServer()
    {
        stop();
    }

private:
    // ...
    std::shared_ptr<ThreadPool<task_t>> _tp;
    // ...
};
```

此处运行结果与新线程相同，此处不再演示

## 客户端控制服务器执行相关命令的程序

### 思路分析

既然需要客户端控制服务器执行命令就必须要经历下面的步骤：

1. 客户端将命令字符串发送给服务端
2. 服务端创建子进程，利用进程间通信将分析后的命令交给子进程，子进程调用`exec`家族函数将命令执行的结果通过服务器发送给客户端

### 实现

因为服务端本身就是进行接收和返回结果，所以考虑将命令执行单独作为一个类来描述，本次为了执行的安全，考虑只允许用户执行部分命令，并且提供判断命令是否是合法命令，所以少不了需要查询的接口，为了更快速的查询，可以使用`set`集合。另外，因为要执行命令，所以需要一个成员函数`executeCommand`执行对应的命令，所以基本结构如下：

```c++
class Command
{
    Command()
    {
        // 构造可以执行的一些命令
        _commands.insert("ls");
        _commands.insert("pwd");
        _commands.insert("ll");
        _commands.insert("touch");
        _commands.insert("who");
        _commands.insert("whoami");
    }

    // 判断命令是否合法
    bool isValid(std::string cmd)
    {
        auto pos = _commands.find(cmd);
        if (pos == _commands.end())
            return false;
        return true;
    }

    // 执行命令
    std::string executeCommand(const std::string &cmd)
    {
    }

    ~Command()
    {
    }

private:
    std::set<std::string> _commands;
};
```

接着，改变服务端的读写任务的接口，此处不再使用文件的`read`和`write`接口，而是使用`recv`和`send`接口，这两个接口只是比`read`和`write`多了`flags`，其余都一样，并且目前情况下`flags`设置为0即可：

```c++
// 读写函数
void read_write_msg(struct sockaddr_in peer)
{
    while (true)
    {
        // 读取客户端消息
        char buffer[4096] = {0};
        ssize_t ret = recv(_ac_socketfd, buffer, sizeof(buffer) - 1, 0);
        if (ret > 0)
        {
            LOG(LogLevel::INFO) << "Client: " << inet_ntoa(peer.sin_addr) << ":" << std::to_string(ntohs(peer.sin_port)) << " send: " << buffer;

            // 向客户端回消息
            Command cmd;
            if (cmd.isValid(buffer))
            {
                // 命令合法可以执行命令
                std::string ret = cmd.executeCommand(buffer);
                send(_ac_socketfd, ret.c_str(), ret.size(), 0);
            }
            else
            {
                send(_ac_socketfd, "错误指令", sizeof("错误指令"), 0);
            }
        }
        // ...
    }

    // ...
}
```

接下来就是实现执行命令函数，根据前面的分析需要创建子进程调用`exec`家族函数执行对应的命令，但是在标准库中有对应的接口已经实现了这个功能：`popen`，其原型如下：

```c
FILE *popen(const char *command, const char *type);
```

对应的接口就是`pclose`接口，原型如下：

```c
int pclose(FILE *stream);
```

对于`popen`接口来说，其会对传入的命令进行分析并创建子进程执行，将执行结果放到返回值中，因为`FILE`是文件结构，所以只需要使用文件的读写接口即可读取到其中的内容，这个接口第二个参数表示读模式或者写模式，因为是执行命令，所以只需要填入`"r"`即可

结合上面的接口即可完成对应的执行命令函数：

```c++
std::string executeCommand(const std::string &cmd)
{
    FILE *fp = popen(cmd.c_str(), "r");
    if (fp == nullptr)
        return std::string();
    char buffer[1024];
    std::string result;
    while (fgets(buffer, sizeof(buffer), fp))
    {
        result += buffer;
    }
    pclose(fp);
    return result;
}
```

!!! note
    `fgets`会自动添加`\0`，不需要预留`\0`的位置

### 测试

服务端主函数代码和客户端主函数代码不变，下面是测试结果：

<img src="23. TCP编程接口基本使用.assets\Snipaste_2025-03-04_21-48-25.png">