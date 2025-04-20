# 关于Muduo库

## Muduo库简介

**Muduo**是一个高性能的C++网络库，由陈硕（Giant Chen）开发并开源。它主要用于构建多线程的TCP网络服务程序，特别适合于高并发、低延迟的应用场景。Muduo的设计理念是简单、高效和易于使用，专注于提供可靠的网络通信功能，同时避免过度设计

## 核心特点

1. **事件驱动模型**：Muduo基于Reactor模式实现，使用`epoll`（Linux系统调用）作为底层事件通知机制。它通过事件循环（EventLoop）来处理I/O事件，能够高效地管理多个连接
2. **多线程支持**：Muduo采用「一个线程一个EventLoop」的设计，主线程负责监听新连接，工作线程池负责处理已建立的连接。这种设计避免了复杂的锁操作，减少了线程间的竞争，提升了性能
3. **非阻塞I/O**：所有网络操作都是非阻塞的，确保了高并发场景下的性能
4. **跨平台性**：虽然Muduo主要针对Linux平台优化，但其代码结构清晰，理论上可以移植到其他支持类似I/O多路复用机制的平台上
5. **轻量级设计**：Muduo不依赖于任何第三方库（如Boost），仅依赖于标准C++库和POSIX API。它专注于核心网络功能，不包含额外的功能（如HTTP解析、序列化等），这使得它更加灵活和高效
6. **回调机制**：Muduo使用回调函数来处理事件（如连接建立、数据到达、连接关闭等），用户可以通过注册回调函数来定义自己的业务逻辑
7. **线程安全**：Muduo对线程安全进行了精心设计，确保在多线程环境下的正确性和高效性

!!! note "一个线程一个EventLoop"

    「一个线程一个EventLoop」是一种在并发编程和异步I/O场景中广泛使用的设计模式。EventLoop（事件循环）是一个不断循环运行的程序结构，它的主要工作是不断地从事件队列中取出事件，并根据事件的类型调用相应的处理函数。在「一个线程一个EventLoop」模式下，每个线程都会独立运行一个 EventLoop。每个EventLoop负责处理该线程所关联的事件，例如网络I/O事件、定时器事件等。这种模式可以避免多线程之间的复杂同步问题，提高程序的并发性能和可维护性

    在网络服务器中，「一个线程一个EventLoop」可以理解为⼀个⽂件描述符只能由⼀个线程进⾏读写，换句话说就是⼀个TCP连接必须归属于某个EventLoop管理，示意图如下：

    <img src="关于Muduo库.assets\download.png">

## 主要组件

1. **`EventLoop`**：事件循环的核心类，负责监听和分发事件，每个线程只能有一个`EventLoop`实例
2. **`TcpServer`**：封装了TCP服务器的功能，用于监听端口并接受客户端连接，支持多线程处理连接
3. **`TcpClient`**：封装了TCP客户端的功能，用于与服务器建立连接
4. **`TcpConnection`**：表示一个TCP连接，封装了连接的生命周期管理，提供了发送数据、关闭连接等功能
5. **`Buffer`**：用于高效的I/O缓冲区管理，支持动态扩展。提供了方便的接口来读取和写入数据
6. **`CountDownLatch`**：因为Muduo库不管是服务端还是客⼾端都是异步操作，对于客⼾端来说如果我们在连接还没有完全建⽴成功的时候发送数据，这是不被允许的。因此可以使⽤Muduo的`CountDownLatch`类进⾏同步控制

下面就常见的组件进行介绍

### `EventLoop`类

该类在`muduo/net/EventLoop.h`文件中，其部分定义如下：

```cpp
class EventLoop : noncopyable
{
public:
    /// Loops forever.
    /// Must be called in the same thread as creation of the object. void loop();
    /// Quits loop.
    /// This is not 100% thread safe, if you call through a raw pointer,
    /// better to call through shared_ptr<EventLoop> for 100% safety. void quit();
    TimerId runAt(Timestamp time, TimerCallback cb);
    /// Runs callback after @c delay seconds.
    /// Safe to call from other threads.
    TimerId runAfter(double delay, TimerCallback cb);
    /// Runs callback every @c interval seconds.
    /// Safe to call from other threads.
    TimerId runEvery(double interval, TimerCallback cb);
    /// Cancels the timer.
    /// Safe to call from other threads. void cancel(TimerId timerId);
private:
    std::atomic<bool> quit_; 
    std::unique_ptr<Poller> poller_; 
    mutable MutexLock mutex_; 
    std::vector<Functor> pendingFunctors_ GUARDED_BY(mutex_);
};
```

其中的`nocopyable`为一个实现当前类不可以被复制，原型如下：

```cpp
class noncopyable
{
public:
    noncopyable(const noncopyable&) = delete;
    void operator=(const noncopyable&) = delete;

protected:
    noncopyable() = default;
    ~noncopyable() = default;
};
```

关于为什么可以这样实现不可被复制可以看[UDP编程接口基本使用](https://www.help-doc.top/Linux/22.%20UDP%E7%BC%96%E7%A8%8B/1.%20UDP%E7%BC%96%E7%A8%8B%E6%8E%A5%E5%8F%A3%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8/1.%20UDP%E7%BC%96%E7%A8%8B%E6%8E%A5%E5%8F%A3%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8.html?h=nocopy#_16)部分讲解

接着是该类中的一些函数：

**`void loop()`**

- **功能**：该函数会启动事件循环，让 `EventLoop` 进入一个无限循环中，不断地从`Poller`中获取就绪的I/O事件，并调用相应的事件处理函数。同时，也会处理定时器事件
- **注意事项**：必须在创建 `EventLoop` 对象的同一个线程中调用该函数，以保证线程安全

**`void quit()`**

- **功能**：用于停止事件循环，使 `loop()` 函数退出循环
- **注意事项**：该函数并非完全线程安全。如果通过原始指针调用，可能会出现竞态条件。为了确保 100% 的安全性，建议使用 `std::shared_ptr<EventLoop>`来调用该函数

**`TimerId runAt(Timestamp time, TimerCallback cb)`**

- **功能**：在指定的时间点`time` 执行回调函数`cb`。`Timestamp`是一个表示时间点的类，`TimerCallback`是一个回调函数类型
- **返回值**：返回一个`TimerId` 类型的对象，用于标识这个定时器，后续可以使用该`TimerId`来取消定时器

**`TimerId runAfter(double delay, TimerCallback cb)`**

- **功能**：在当前时间之后的 `delay` 秒后执行回调函数 `cb`
- **注意事项**：该函数是线程安全的，可以在其他线程中调用
- **返回值**：返回一个 `TimerId` 类型的对象，用于标识这个定时器

**`TimerId runEvery(double interval, TimerCallback cb)`**

- **功能**：每隔 `interval` 秒执行一次回调函数 `cb`
- **注意事项**：该函数是线程安全的，可以在其他线程中调用
- **返回值**：返回一个 `TimerId` 类型的对象，用于标识这个定时器

**`void cancel(TimerId timerId)`**

- **功能**：取消指定 `TimerId` 对应的定时器，使该定时器不再执行
- **注意事项**：该函数是线程安全的，可以在其他线程中调用

### `TcpServer`类

该类定义在`muduo/net/TcpServer.h`文件中，其部分定义如下：

```cpp
typedef std::shared_ptr<TcpConnection> TcpConnectionPtr;
typedef std::function<void (const TcpConnectionPtr&)> ConnectionCallback;
typedef std::function<void (const TcpConnectionPtr&, Buffer*, Timestamp)> MessageCallback;

// InetAddress
class InetAddress : public muduo::copyable
{
public:
    InetAddress(StringArg ip, uint16_t port, bool ipv6 = false);
};

class TcpServer : noncopyable
{
public:
    enum Option
    {
        kNoReusePort,
        kReusePort,
    };

    TcpServer(EventLoop* loop, const InetAddress& listenAddr, const string& nameArg, Option option = kNoReusePort); void setThreadNum(int numThreads); 
    void start();
    /// 当⼀个新连接建⽴成功的时候被调⽤
    void setConnectionCallback(const ConnectionCallback& cb)
    { 
        connectionCallback_ = cb; 
    }
    /// 消息的业务处理回调函数---这是收到新连接消息的时候被调⽤的函数 
    void setMessageCallback(const MessageCallback& cb) 
    { 
        messageCallback_ = cb; 
    }
};
```

`TcpServer` 类是Muduo网络库中用于构建TCP服务器的核心类，它封装了TCP服务器的常见操作和事件处理逻辑，并且不可复制（继承自`noncopyable`），以避免出现多个对象操作同一资源的问题

```cpp
enum Option
{
    kNoReusePort,
    kReusePort,
};
```

**`enum Option`**：这是一个枚举类型，用于指定服务器监听套接字的端口复用选项：

  - `kNoReusePort`：表示不使用端口复用，即默认情况下，同一端口不能被多个进程或套接字同时绑定
  - `kReusePort`：表示使用端口复用，允许多个进程或套接字同时绑定到同一个端口，常用于负载均衡等场景

**构造函数**

```cpp
TcpServer(EventLoop* loop, const InetAddress& listenAddr, const string& nameArg, Option option = kNoReusePort);
```

- **功能**：构造一个 `TcpServer` 对象。
- **参数**：
    - **`loop`**：指向 `EventLoop` 对象的指针，`EventLoop` 负责事件循环和 I/O 多路复用，`TcpServer` 会在这个 `EventLoop` 上运行。
    - **`listenAddr`**：`InetAddress` 类型的对象，表示服务器要监听的地址和端口。
    - **`nameArg`**：服务器的名称，通常用于日志记录和调试。
    - **`option`**：端口复用选项，默认为 `kNoReusePort`。

**`void setThreadNum(int numThreads);`**

**功能**：设置 `TcpServer` 用于处理客户端连接和请求的线程数量。这些线程会组成一个线程池，每个线程都有自己的 `EventLoop`，可以提高服务器的并发处理能力

**`void start();`**

**功能**：启动 `TcpServer`，使其开始监听指定的地址和端口，等待客户端的连接。该函数会创建监听套接字，绑定地址和端口，然后开始监听，同时会启动线程池（如果设置了线程数量）

**`void setConnectionCallback(const ConnectionCallback& cb);`**

- **功能**：设置连接回调函数。当有新的客户端连接建立成功或者连接关闭时，会调用这个回调函数。用户可以通过这个回调函数来处理连接的建立和关闭事件，例如记录日志、初始化连接状态等
- **参数**：`ConnectionCallback`是一个回调函数类型，通常是一个可调用对象（如函数指针、函数对象或lambda表达式）

**`void setMessageCallback(const MessageCallback& cb);`**

- **功能**：设置消息处理回调函数。当服务器收到客户端发送的消息时，会调用这个回调函数。用户可以在这个回调函数中实现具体的业务逻辑，例如解析消息、处理请求等
- **参数**：`MessageCallback`是一个回调函数类型，用于处理接收到的消息

### `TcpClient`类

该类定义在`muduo/net/TcpClient.h`文件中，其部分定义如下：

```cpp
class TcpClient : noncopyable
{
public:
    // TcpClient(EventLoop* loop);
    // TcpClient(EventLoop* loop, const string& host, uint16_t port); 
    TcpClient(EventLoop* loop, const InetAddress& serverAddr, const string& nameArg);
    ~TcpClient(); // force out-line dtor, for std::unique_ptr members.
    void connect();//连接服务器
    void disconnect();//关闭连接 
    // void stop();
    //获取客⼾端对应的通信连接Connection对象的接⼝，发起connect后，有可能还没有连接建⽴成功
    TcpConnectionPtr connection() const
    {
        MutexLockGuard lock(mutex_); 
        return connection_;
    }
    /// 连接服务器成功时的回调函数
    void setConnectionCallback(ConnectionCallback cb)
    { 
        connectionCallback_ = std::move(cb); 
    }
    /// 收到服务器发送的消息时的回调函数
    void setMessageCallback(MessageCallback cb)
    { 
        messageCallback_ = std::move(cb); 
    }
private:
    EventLoop* loop_;
    ConnectionCallback connectionCallback_; 
    MessageCallback messageCallback_;
    WriteCompleteCallback writeCompleteCallback_; 
    TcpConnectionPtr connection_ GUARDED_BY(mutex_);
};
```

`TcpClient` 类是一个用于创建 TCP 客户端的类，它封装了 TCP 客户端的基本操作，例如连接服务器、断开连接等，并且不允许复制（继承自 `noncopyable`）。以下是对该类的详细介绍：

**构造函数**

```cpp
// TcpClient(EventLoop* loop);
// TcpClient(EventLoop* loop, const string& host, uint16_t port); 
TcpClient(EventLoop* loop, const InetAddress& serverAddr, const string& nameArg);
```

- **功能**：构造一个 `TcpClient` 对象。
- **参数**：

    - **`loop`**：指向 `EventLoop` 对象的指针。`EventLoop` 负责事件循环和 I/O 多路复用，`TcpClient` 会在这个 `EventLoop` 上运行，处理网络事件
    - **`serverAddr`**：`InetAddress` 类型的对象，表示要连接的服务器的地址和端口
    - **`nameArg`**：客户端的名称，通常用于日志记录和调试

**析构函数**

```cpp
~TcpClient(); // force out-line dtor, for std::unique_ptr members.
```

- **功能**：析构 `TcpClient` 对象。注释表明这是一个强制外联的析构函数，可能是因为类中包含 `std::unique_ptr` 成员，这样做有助于正确管理资源的生命周期

**`void connect();`**

- **功能**：发起与服务器的连接请求。调用该函数后，`TcpClient` 会尝试连接到构造函数中指定的服务器地址和端口

**`void disconnect();`**

- **功能**：关闭与服务器的连接。调用该函数后，`TcpClient` 会主动断开与服务器的连接

**`void stop();`**

- **功能**：从注释推测，这个函数可能用于停止客户端的一些操作，可能包括停止连接尝试、关闭相关资源等，但具体实现取决于代码细节。

**`TcpConnectionPtr connection() const`**

- **功能**：获取客户端对应的通信连接 `TcpConnection` 对象的智能指针。由于在调用 `connect()` 后，连接可能还未成功建立，所以使用这个函数时需要注意连接状态。
- **实现细节**：使用 `MutexLockGuard` 加锁来保证线程安全，然后返回 `connection_`。

**`void setConnectionCallback(ConnectionCallback cb)`**

- **功能**：设置连接服务器成功时的回调函数。当客户端成功连接到服务器时，会调用这个回调函数，用户可以在回调函数中进行一些初始化操作或处理连接成功的逻辑。
- **参数**：`ConnectionCallback` 是一个回调函数类型，通过 `std::move` 进行转移，避免不必要的拷贝。

**`void setMessageCallback(MessageCallback cb)`**

- **功能**：设置收到服务器发送的消息时的回调函数。当客户端接收到服务器发送的消息时，会调用这个回调函数，用户可以在回调函数中处理接收到的消息
- **参数**：`MessageCallback` 是一个回调函数类型，通过 `std::move` 进行转移

### `TcpConnection`类

该类定义在`muduo/net/TcpConnection.h`文件中，其部分定义如下：

```cpp
class TcpConnection : noncopyable, public std::enable_shared_from_this<TcpConnection>
{
public:
    /// Constructs a TcpConnection with a connected sockfd
    ///
    /// User should not create this object. 
    TcpConnection(EventLoop* loop, const string& name, int sockfd, const InetAddress& localAddr, const InetAddress& peerAddr); 
    bool connected() const { return state_ == kConnected; } 
    bool disconnected() const { return state_ == kDisconnected; }  
    void send(string&& message); // C++11 
    void send(const void* message, int len); 
    void send(const StringPiece& message); // 
    void send(Buffer&& message); // C++11 
    void send(Buffer* message); // this one will swap data 
    void shutdown(); // NOT thread safe, no simultaneous calling
    void setContext(const boost::any& context) 
    { 
        context_ = context; 
    }
    const boost::any& getContext() const
    { 
        return context_; 
    }
    boost::any* getMutableContext()
    { 
        return &context_; 
    }
    void setConnectionCallback(const ConnectionCallback& cb)
    { 
        connectionCallback_ = cb; 
    }
    void setMessageCallback(const MessageCallback& cb)
    { 
        messageCallback_ = cb; 
    }
private:
    enum StateE 
    { 
        kDisconnected, 
        kConnecting, 
        kConnected, 
        kDisconnecting 
    }; 
    EventLoop* loop_;
    ConnectionCallback connectionCallback_; 
    MessageCallback messageCallback_;
    WriteCompleteCallback writeCompleteCallback_; 
    boost::any context_;
};
```

`TcpConnection` 类是Muduo网络库中用于表示一个TCP连接的核心类，它封装了TCP连接的常见操作和状态管理。以下是对该类的详细介绍：

```cpp
class TcpConnection : noncopyable, public std::enable_shared_from_this<TcpConnection>
```

**`std::enable_shared_from_this<TcpConnection>`**：允许`TcpConnection`对象在成员函数内部安全地获取指向自身的 `std::shared_ptr`。这在需要将自身的引用传递给异步操作时非常有用，能避免因对象提前销毁而导致的悬空指针问题

```cpp
TcpConnection(EventLoop* loop, const string& name, int sockfd, const InetAddress& localAddr, const InetAddress& peerAddr);
```

- **功能**：构造一个`TcpConnection`对象，用于管理一个已经建立的TCP连接
- **参数**：

    - **`loop`**：指向`EventLoop`对象的指针，该`EventLoop`负责处理该连接上的I/O事件。
    - **`name`**：连接的名称，通常用于日志记录和调试
    - **`sockfd`**：表示该TCP连接的套接字文件描述符
    - **`localAddr`**：本地地址信息，即服务器端的地址和端口
    - **`peerAddr`**：对端地址信息，即客户端的地址和端口

**状态判断函数**

```cpp
bool connected() const { return state_ == kConnected; } 
bool disconnected() const { return state_ == kDisconnected; }
```

- **`connected()`**：用于判断当前TCP连接是否处于已连接状态。如果连接状态为 `kConnected`，则返回`true`，否则返回`false`
- **`disconnected()`**：用于判断当前TCP连接是否处于已断开状态。如果连接状态为 `kDisconnected`，则返回`true`，否则返回`false`

**数据发送函数**

```cpp
void send(string&& message); // C++11 
void send(const void* message, int len); 
void send(const StringPiece& message); 
void send(Buffer&& message); // C++11 
void send(Buffer* message); // this one will swap data
```

- **功能**：这些函数用于向对端发送数据，提供了多种重载形式，以支持不同类型的数据发送：
    
    - **`send(string&& message)`**：使用 C++11 的右值引用，用于发送一个 `string` 对象，支持移动语义，避免不必要的拷贝
    - **`send(const void* message, int len)`**：发送指定长度的二进制数据
    - **`send(const StringPiece& message)`**：发送一个 `StringPiece` 对象表示的数据，`StringPiece` 是一个轻量级的字符串视图类
    - **`send(Buffer&& message)`**：使用右值引用发送一个 `Buffer` 对象，支持移动语义
    - **`send(Buffer* message)`**：发送一个 `Buffer` 对象的数据，并且会交换 `Buffer` 的内部数据，避免数据拷贝

**关闭连接函数**

```cpp
void shutdown(); // NOT thread safe, no simultaneous calling
```

**功能**：关闭当前的 TCP 连接。需要注意的是，该函数不是线程安全的，不允许同时调用，调用时需要确保线程安全

**上下文管理函数**

```cpp
void setContext(const boost::any& context) 
{ 
    context_ = context; 
}
const boost::any& getContext() const
{ 
    return context_; 
}
boost::any* getMutableContext()
{ 
    return &context_; 
}
```

- **`setContext(const boost::any& context)`**：设置与该TCP连接关联的上下文信息，`boost::any`是一个可以存储任意类型值的容器
- **`getContext() const`**：获取与该TCP连接关联的上下文信息的常量引用
- **`getMutableContext()`**：获取与该TCP连接关联的上下文信息的可变指针，允许修改上下文信息

**回调函数设置函数**

```cpp
void setConnectionCallback(const ConnectionCallback& cb)
{ 
    connectionCallback_ = cb; 
}
void setMessageCallback(const MessageCallback& cb)
{ 
    messageCallback_ = cb; 
}
```

- **`setConnectionCallback(const ConnectionCallback& cb)`**：设置连接状态变化时的回调函数。当连接建立、断开等状态发生变化时，会调用该回调函数
- **`setMessageCallback(const MessageCallback& cb)`**：设置接收到消息时的回调函数。当从对端接收到数据时，会调用该回调函数进行消息处理

### `Buffer`类

该类定义在`muduo/net/Buffer.h`文件中，其部分定义如下：

```cpp
class Buffer : public muduo::copyable
{
public:
    static const size_t kCheapPrepend = 8; 
    static const size_t kInitialSize = 1024; 
    explicit Buffer(size_t initialSize = kInitialSize) 
        : buffer_(kCheapPrepend + initialSize), readerIndex_(kCheapPrepend), writerIndex_(kCheapPrepend); 
    void swap(Buffer& rhs) 
    size_t readableBytes() const 
    size_t writableBytes() const 
    const char* peek() const
    const char* findEOL() const 
    const char* findEOL(const char* start) const 
    void retrieve(size_t len) 
    void retrieveInt64() 
    void retrieveInt32() 
    void retrieveInt16()
    void retrieveInt8() 
    string retrieveAllAsString() 
    string retrieveAsString(size_t len) 
    void append(const StringPiece& str) 
    void append(const char* /*restrict*/ data, size_t len) 
    void append(const void* /*restrict*/ data, size_t len) 
    char* beginWrite() const 
    char* beginWrite() const 
    void hasWritten(size_t len) 
    void appendInt64(int64_t x) 
    void appendInt32(int32_t x) 
    void appendInt16(int16_t x) 
    void appendInt8(int8_t x) 
    int64_t readInt64() 
    int32_t readInt32() 
    int16_t readInt16() 
    int8_t readInt8() 
    int64_t peekInt64() const 
    int32_t peekInt32() const 
    int16_t peekInt16() const 
    int8_t peekInt8() const 
    void prependInt64(int64_t x) 
    void prependInt32(int32_t x) 
    void prependInt16(int16_t x) 
    void prependInt8(int8_t x) 
    void prepend(const void* /*restrict*/ data, size_t len)
private:
    std::vector<char> buffer_; 
    size_t readerIndex_; 
    size_t writerIndex_; 
    static const char kCRLF[];
};
```
`Buffer` 类是一个用于网络数据读写的缓冲区类，继承自 `muduo::copyable` 意味着它是可复制的。该类封装了一系列对缓冲区进行操作的方法，包括数据的读写、查找、追加、前置等操作。以下是对该类的详细介绍：

**静态常量成员**

```cpp
static const size_t kCheapPrepend = 8; 
static const size_t kInitialSize = 1024; 
```

- **`kCheapPrepend`**：缓冲区头部预留的空间大小，固定为8字节，通常用于存储一些额外的元信息，如数据长度等。
- **`kInitialSize`**：缓冲区的初始大小，固定为 1024 字节。

**构造函数**

```cpp
explicit Buffer(size_t initialSize = kInitialSize) 
    : buffer_(kCheapPrepend + initialSize), readerIndex_(kCheapPrepend), writerIndex_(kCheapPrepend)
```

- **功能**：构造一个 `Buffer` 对象。
- **参数**：
    - **`initialSize`**：缓冲区的初始大小，默认值为 `kInitialSize`。
- **初始化**：
    - `buffer_`：使用 `std::vector<char>` 存储缓冲区数据，初始大小为 `kCheapPrepend + initialSize`。
    - `readerIndex_`：读取位置的索引，初始化为 `kCheapPrepend`，表示从预留空间之后开始读取。
    - `writerIndex_`：写入位置的索引，初始化为 `kCheapPrepend`，表示从预留空间之后开始写入。

**交换函数**

```cpp
void swap(Buffer& rhs)
```

- **功能**：交换当前 `Buffer` 对象和另一个 `Buffer` 对象的内容

**空间查询函数**

```cpp
size_t readableBytes() const 
size_t writableBytes() const 
```

- **`readableBytes()`**：返回缓冲区中可读数据的字节数，即`writerIndex_ - readerIndex_`
- **`writableBytes()`**：返回缓冲区中可写入数据的字节数，即`buffer_.size() - writerIndex_`

**数据读取相关函数**

```cpp
const char* peek() const
const char* findEOL() const 
const char* findEOL(const char* start) const 
void retrieve(size_t len) 
void retrieveInt64() 
void retrieveInt32() 
void retrieveInt16()
void retrieveInt8() 
string retrieveAllAsString() 
string retrieveAsString(size_t len) 
```

- **`peek()`**：返回缓冲区中可读数据的起始地址
- **`findEOL()`**：从`peek()`位置开始查找换行符`\n`，返回其地址，如果未找到则返回 `nullptr`
- **`findEOL(const char* start)`**：从指定位置`start`开始查找换行符`\n`，返回其地址，如果未找到则返回 `nullptr`
- **`retrieve(size_t len)`**：将`readerIndex_`向后移动 `len` 个字节，表示已经读取了`len`字节的数据，但是这个函数将读取的内容不会从缓冲区中移除，而是通过移动`readerIndex_`向前来标记这部分数据已被读取。这个函数可以利用到自定义协议中读取长度字段，一般长度字段都是整型，所以这个函数就可以使用为`retrieve(4)`，表示向后读取四个字节
- **`retrieveInt64()`、`retrieveInt32()`、`retrieveInt16()`、`retrieveInt8()`**：分别从缓冲区中读取64位、32位、16位、8位整数，并将`readerIndex_`向后移动相应的字节数
- **`retrieveAllAsString()`**：将缓冲区中所有可读数据以`string`类型返回，并将`readerIndex_`和`writerIndex_`重置为`kCheapPrepend`
- **`retrieveAsString(size_t len)`**：将缓冲区中`len`字节的可读数据以`string`类型返回，并将`readerIndex_`向后移动`len`个字节

**数据写入相关函数**

```cpp
void append(const StringPiece& str) 
void append(const char* /*restrict*/ data, size_t len) 
void append(const void* /*restrict*/ data, size_t len) 
char* beginWrite() const 
void hasWritten(size_t len) 
void appendInt64(int64_t x) 
void appendInt32(int32_t x) 
void appendInt16(int16_t x) 
void appendInt8(int8_t x) 
```

- **`append(const StringPiece& str)`、`append(const char* data, size_t len)`、`append(const void* data, size_t len)`**：将数据追加到缓冲区的写入位置
- **`beginWrite()`**：返回缓冲区中可写入数据的起始地址
- **`hasWritten(size_t len)`**：将 `writerIndex_` 向后移动`len`个字节，表示已经写入了`len`字节的数据
- **`appendInt64(int64_t x)`、`appendInt32(int32_t x)`、`appendInt16(int16_t x)`、`appendInt8(int8_t x)`**：分别将64位、32位、16位、8位整数追加到缓冲区的写入位置

**数据查看相关函数**

```cpp
int64_t readInt64() 
int32_t readInt32() 
int16_t readInt16() 
int8_t readInt8() 
int64_t peekInt64() const 
int32_t peekInt32() const 
int16_t peekInt16() const 
int8_t peekInt8() const 
```

- **`readInt64()`、`readInt32()`、`readInt16()`、`readInt8()`**：分别从缓冲区中读取 64位、32位、16位、8位整数，并将`readerIndex_`向后移动相应的字节数
- **`peekInt64()`、`peekInt32()`、`peekInt16()`、`peekInt8()`**：分别查看缓冲区中可读数据的起始位置的64位、32位、16位、8位整数，但不移动`readerIndex_`

**数据前置相关函数**

```cpp
void prependInt64(int64_t x) 
void prependInt32(int32_t x) 
void prependInt16(int16_t x) 
void prependInt8(int8_t x) 
void prepend(const void* /*restrict*/ data, size_t len)
```
- **`prependInt64(int64_t x)`、`prependInt32(int32_t x)`、`prependInt16(int16_t x)`、`prependInt8(int8_t x)`**：分别将64位、32位、16位、8位整数前置到缓冲区的头部（`kCheapPrepend` 之后）
- **`prepend(const void* data, size_t len)`**：将数据前置到缓冲区的头部（`kCheapPrepend` 之后）

### `CountDownLatch`类

该类定义在`muduo/base/CountDownLatch.h`文件中，其部分定义如下：

```cpp
class CountDownLatch : noncopyable
{
public:
    explicit CountDownLatch(int count); 
    void wait()
    {
        MutexLockGuard lock(mutex_); 
        while (count_ > 0)
        {
            condition_.wait();
        }
    }
    void countDown()
    {
        MutexLockGuard lock(mutex_);
        --count_;
        if (count_ == 0)
        {
            condition_.notifyAll();
        }
    }

    int getCount() const;
private:
    mutable MutexLock mutex_;
    Condition condition_ GUARDED_BY(mutex_); 
    int count_ GUARDED_BY(mutex_);
};
```

`CountDownLatch`类是一个同步工具类，通常用于多线程编程中，其设计目的是让一个或多个线程等待，直到某个操作完成指定的次数。该类继承自`noncopyable`，意味着它不能被复制，保证了每个实例的唯一性和独立性。以下是对该类的详细介绍：

**构造函数**

```cpp
explicit CountDownLatch(int count);
```
- **功能**：构造一个 `CountDownLatch` 对象
- **参数**：
    - **`count`**：初始化计数器的值，该计数器表示需要完成的操作次数


**`void wait()`**

```cpp
void wait()
{
    MutexLockGuard lock(mutex_); 
    while (count_ > 0)
    {
        condition_.wait();
    }
}
```

- **功能**：让当前线程等待，直到计数器的值变为0
- **实现细节**：首先，使用 `MutexLockGuard` 对 `mutex_` 加锁，确保线程安全，避免多个线程同时访问和修改计数器。然后，通过 `while` 循环检查计数器 `count_` 的值，如果 `count_` 大于0，则调用 `condition_.wait()` 使当前线程进入等待状态，释放锁并挂起线程。当计数器变为0时，线程会被唤醒继续执行

**`void countDown()`**

```cpp
void countDown()
{
    MutexLockGuard lock(mutex_);
    --count_;
    if (count_ == 0)
    {
        condition_.notifyAll();
    }
}
```

- **功能**：将计数器的值减1。当计数器的值变为0时，唤醒所有正在等待的线程
- **实现细节**：同样使 `MutexLockGuard`对`mutex_`加锁，保证线程安全。对计数器`count_`进行减1操作。检查减1后的计数器值，如果为0，则调用`condition_.notifyAll()`唤醒所有正在等待的线程

**`int getCount() const`**

- **功能**：获取当前计数器的值
- **实现细节**：该函数被声明为`const`，表示它不会修改对象的状态。由于`count_`受 `mutex_` 保护，所以在获取`count_`值时也需要加锁，以确保线程安全

**使用场景示例**

`CountDownLatch` 常用于以下场景：

- **主线程等待多个子线程完成初始化**：主线程创建多个子线程进行初始化操作，每个子线程完成初始化后调用 `countDown()`，主线程调用 `wait()` 等待所有子线程完成初始化
- **多个子线程等待某个条件达成**：例如，多个子线程等待某个资源准备好，当资源准备好时，调用 `countDown()` 将计数器减为0，唤醒所有等待的子线程

### 使用方式介绍



## 使用场景

Muduo适用于以下场景：

- 高并发的网络服务，如即时通讯、在线游戏、实时数据传输等
- 需要低延迟和高吞吐量的应用
- 需要自定义协议的网络服务，而不是直接使用现成的协议（如HTTP）

## 设计哲学

Muduo的设计哲学可以总结为以下几点：

1. **专注核心功能**：只提供网络通信的核心功能，不涉及高层协议或复杂的功能模块
2. **高性能**：通过非阻塞I/O和多线程优化，确保在高并发场景下的性能
3. **易用性**：API设计简洁直观，便于开发者快速上手
4. **可扩展性**：虽然Muduo本身不提供高级功能，但其模块化设计使得开发者可以轻松扩展

## 使用实例：使用Muduo库实现一个简单网络词典

### 服务端

### 客户端

