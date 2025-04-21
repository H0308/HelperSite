# 关于Muduo库

## Muduo库简介

**Muduo**是一个高性能的C++网络库，由陈硕（Giant Chen）开发并开源。它主要用于构建多线程的TCP网络服务程序，特别适合于高并发、低延迟的应用场景。Muduo的设计理念是简单、高效和易于使用，专注于提供可靠的网络通信功能，同时避免过度设计

## Ubuntu下安装和使用Muduo库

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

## 主要组件介绍

1. **`EventLoop`**：事件循环的核心类，负责监听和分发事件，每个线程只能有一个`EventLoop`实例
2. **`TcpServer`**：封装了TCP服务器的功能，用于监听端口并接受客户端连接，支持多线程处理连接
3. **`TcpClient`**：封装了TCP客户端的功能，用于与服务器建立连接
4. **`TcpConnection`**：表示一个TCP连接，封装了连接的生命周期管理，提供了发送数据、关闭连接等功能
5. **`Buffer`**：用于高效的I/O缓冲区管理，支持动态扩展。提供了方便的接口来读取和写入数据
6. **`CountDownLatch`**：因为Muduo库不管是服务端还是客⼾端都是异步操作，对于客⼾端来说如果我们在连接还没有完全建⽴成功的时候发送数据，这是不被允许的。因此可以使⽤Muduo的`CountDownLatch`类进⾏同步控制

下面就常见的组件进行介绍

### `TcpServer`类和`EventLoop`类

前面已经知道了Muduo库设计的核心思想是「一个线程一个EventLoop」，那么在创建服务器时，本次以TCP为例，首先需要的就是`TcpServer`类，该类的作用就是创建一个TCP服务器，但是这个服务器本身并不进行阻塞等待连接，而是利用到`epoll`模型关心监听套接字的方式来完成对客户端的连接，所以除了需要`TcpServer`类之外，还需要一个`EventLoop`类作为服务器处理连接请求的核心。所以下面先来了解`TcpServer`类和`EventLoop`类

首先是`TcpServer`类，本次主要关心一部分后面重点使用的接口，代码如下：

```cpp title="TcpServer类"
class TcpServer : noncopyable
{
public:
    enum Option
    {
        kNoReusePort,
        kReusePort,
    };

    TcpServer(EventLoop* loop, 
                const InetAddress& listenAddr, 
                const string& nameArg, 
                Option option = kNoReusePort); 
    void setThreadNum(int numThreads); 
    void start();
    /// 当⼀个新连接建⽴成功的时候被调⽤
    void setConnectionCallback(const ConnectionCallback& cb)
    { connectionCallback_ = cb; }
    /// 消息的业务处理回调函数---这是收到新连接消息的时候被调⽤的函数 
    void setMessageCallback(const MessageCallback& cb) { messageCallback_ = cb; }
};
```

首先，该类继承了一个`noncopyable`类，该类的作用就是禁止该类的对象被拷贝，具体实现思想可以参考[UDP编程接口基本使用](https://www.help-doc.top/Linux/22.%20UDP%E7%BC%96%E7%A8%8B/1.%20UDP%E7%BC%96%E7%A8%8B%E6%8E%A5%E5%8F%A3%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8/1.%20UDP%E7%BC%96%E7%A8%8B%E6%8E%A5%E5%8F%A3%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8.html#_16)一节的介绍，此处不再提及

接着是创建对象的构造函数，正如前面提到的思路，Muduo库中的`TcpServer`本身不进行阻塞监听等待，而是利用`epoll`模型关心监听套接字，所以需要传递一个`EventLoop`类的对象地址作为其中的一个初始化参数，而在适当的时机就需要通过该对象启动`EventLoop`开始进行事件关心

然后是`InetAddress`类对象，这个对象在`TcpServer`类中表示当前服务器的地址和端口信息，其原型如下：

```cpp
class InetAddress : public muduo::copyable
{
public:
    InetAddress(StringArg ip, uint16_t port, bool ipv6 = false);
};
```

其中第一个参数就是IP地址，第二个参数表示端口号，第三个参数表示是否使用IPv6地址，默认是不启用IPv6地址，所以是IPv4地址

回到`TcpServer`类的构造函数，接着是后两个参数，第一个表示当前服务器的名称，第二个表示是否开启地址重用，默认也是不开启，如果需要开启，只需要传递参数为`Option`枚举中的`kReusePort`即可

介绍完构造函数之后，接下来看常见的四个函数：

1. `setThreadNum`：这个函数表示设置当前服务器内部线程池中线程的个数，如果不设置，那么默认就是主线程负责获取新连接+IO处理，否则就是主线程的`epoll`模型处理获取新连接，新线程的`epoll`处理IO
2. `start`：这个函数表示启动服务器，但是需要注意的是，这个函数内部不会启动`EventLoop`开启事件关心，可以理解为就是创建套接字、绑定、开启监听以及设置一个标记位标识当前服务器启动，对应的启动`EventLoop`需要单独调用`EventLoop`类中的接口来完成
3. `setConnectionCallback`：这个函数表示在指定的连接状态（连接成功或者连接失败）时需要做出的行为，具体的行为由回调函数来决定
4. `setMessageCallback`：这个函数表示在客户端给服务端发送信息时需要做出的行为，具体的行为也由回调函数来决定

对于前两个函数，上面已经介绍得差不多了，下面主要看后两个函数：`setConnectionCallback`和`setMessageCallback`

首先是`setConnectionCallback`，这个函数的参数是一个`ConnectionCallback`类型的函数对象，具体定义如下：

```cpp
typedef std::function<void (const TcpConnectionPtr&)> ConnectionCallback;
```

而`TcpConnectionPtr`表示一个TCP连接结构对象的指针，其原型如下：

```cpp
typedef std::shared_ptr<TcpConnection> TcpConnectionPtr;
```

接着是`setMessageCallback`，这个函数的参数是一个`MessageCallback`类型的函数对象，具体定义如下：

```cpp
typedef std::function<void (const TcpConnectionPtr&, Buffer*, Timestamp)> MessageCallback;
```

第一个参数与上面`ConnectionCallback`的参数相同，第二个参数表示缓冲区类对象指针，第三个表示一个时间戳，本次不考虑第三个参数，只考虑前两个参数

接着是`EventLoop`类，其原型如下：

```cpp title="EventLoop类"
class EventLoop : noncopyable
{
public:
    /// Loops forever.
    /// Must be called in the same thread as creation of the object. 
    void loop();
    /// Quits loop.
    /// This is not 100% thread safe, if you call through a raw pointer,
    /// better to call through shared_ptr<EventLoop> for 100% safety. 
    void quit();
    TimerId runAt(Timestamp time, TimerCallback cb);
    /// Runs callback after @c delay seconds.
    /// Safe to call from other threads.
    TimerId runAfter(double delay, TimerCallback cb);
    /// Runs callback every @c interval seconds.
    /// Safe to call from other threads.
    TimerId runEvery(double interval, TimerCallback cb);
    /// Cancels the timer.
    /// Safe to call from other threads. 
    void cancel(TimerId timerId);
};
```

在`EventLoop`类中，最核心的函数就是`void loop();`，其用于启动`EventLoop`，而对应地还有`void quit();`接口表示退出，其他接口介绍如下：

1. `runAt`：表示在**指定的时间点**执行指定的任务
2. `runAfter`：表示在**指定的时间之后**执行指定的任务
3. `runEvery`：表示**每隔指定的时间**执行指定的任务
4. `cancel`：表示停止指定的定时器

了解完`TcpServer`类和`EventLoop`类后，接下来需要了解`TcpConnection`和`Buffer`类

### `TcpConnection`类

该类用于描述每一个连接，其原型如下：

```cpp
class TcpConnection : noncopyable, public std::enable_shared_from_this<TcpConnection>
{
public:
    /// Constructs a TcpConnection with a connected sockfd
    ///
    /// User should not create this object. 
    TcpConnection(EventLoop* loop, 
                    const string& name, 
                    int sockfd, 
                    const InetAddress& localAddr, 
                    const InetAddress& peerAddr); 
                
    bool connected() const 
    { return state_ == kConnected; } 
    bool disconnected() const 
    { return state_ == kDisconnected; }  
    void send(string&& message); // C++11 
    void send(const void* message, int len); 
    void send(const StringPiece& message); 
    // void send(Buffer&& message); // C++11 
    void send(Buffer* message); // this one will swap data 
    void shutdown(); // NOT thread safe, no simultaneous calling
    void setContext(const boost::any& context)
    { context_ = context; }
    const boost::any& getContext() const
    { return context_; }
    boost::any* getMutableContext()
    { return &context_; }
    void setConnectionCallback(const ConnectionCallback& cb)
    { connectionCallback_ = cb; }
    void setMessageCallback(const MessageCallback& cb)
    { messageCallback_ = cb; }
private:
    enum StateE 
    { 
        kDisconnected, 
        kConnecting, 
        kConnected, 
        kDisconnecting 
    };
};
```

首先，该类除了继承了一个`noncopyable`类以外，还继承了`enable_shared_from_this`类，这个类在[C++智能指针](#)部分介绍，此处不具体描述

本次主要考虑下面几个函数：

1. `connected`：表示服务端和客户端是否成功建立连接（可以开始接收和发送信息）
2. `disconnected`：表示服务端和客户端是否断开建立连接
3. `send`：表示发送数据的接口，具体使用哪一种版本会在具体场景中具体介绍
4. `shutdown`：表示关闭当前连接

### `Buffer`类

这个类主要表示用于保存发送和接受数据的一个缓冲区，也就是说将来不论是客户端还是服务端，接收和发送的信息都存储在这个类的对象中，该类定义如下：

```cpp
class Buffer {
public:
    static const size_t kCheapPrepend = 8;
    static const size_t kInitialSize = 1024;

    explicit Buffer(size_t initialSize = kInitialSize)
        : buffer_(kCheapPrepend + initialSize), readerIndex_(kCheapPrepend), writerIndex_(kCheapPrepend) {}

    void swap(Buffer &rhs);

    size_t readableBytes() const;
    size_t writableBytes() const;
    const char *peek() const;

    const char *findEOL() const;
    const char *findEOL(const char *start) const;

    void retrieve(size_t len);
    void retrieveInt64();
    void retrieveInt32();
    void retrieveInt16();
    void retrieveInt8();

    std::string retrieveAllAsString();
    std::string retrieveAsString(size_t len);

    void append(const StringPiece &str);
    void append(const char * /*restrict*/ data, size_t len);
    void append(const void * /*restrict*/ data, size_t len);

    char *beginWrite();
    const char *beginWrite() const;

    void hasWritten(size_t len);

    void appendInt64(int64_t x);
    void appendInt32(int32_t x);
    void appendInt16(int16_t x);
    void appendInt8(int8_t x);

    int64_t readInt64();
    int32_t readInt32();
    int16_t readInt16();
    int8_t readInt8();

    int64_t peekInt64() const;
    int32_t peekInt32() const;
    int16_t peekInt16() const;
    int8_t peekInt8() const;

    void prependInt64(int64_t x);
    void prependInt32(int32_t x);
    void prependInt16(int16_t x);
    void prependInt8(int8_t x);

    void prepend(const void * /*restrict*/ data, size_t len);
};
```

在该类中，主要关心下面的函数：

1. `readableBytes`：表示缓冲区可读数据（有效数据）的长度
2. `peek`：获取可读数据区域的起始地址
3. `retrieveAllAsString`：获取缓冲区所有的数据，并以string对象返回
4. `retrieveAsString`：获取缓冲区指定长度的数据，并以string对象返回
5. `peekInt32`：尝试获取缓冲区4个字节的数据，并进行网络字节序转换使其变为当前计算机可以读取的整型数据，但是**不会从缓冲区删除该4字节数据**
6. `retrieveInt32`：从缓冲区中删除4个字节的数据
7. `readInt32`：尝试获取缓冲区4个字节的数据，并进行网络字节序转换使其变为当前计算机可以读取的整型数据，并且**从缓冲区删除该4字节数据**

其他的接口到具体使用到的时候再具体实践中使用时介绍，目前只需要了解上面的接口

### `TcpClient`类

有时除了需要服务器端以外，还需要提供客户端，而在Muduo库中也有创建TCP客户端的类，即`TcpClient`类，该类定义如下：

```cpp
class TcpClient : noncopyable
{
public:
    TcpClient(EventLoop* loop, const InetAddress& serverAddr, const string& nameArg);
    ~TcpClient(); // force out-line dtor, for std::unique_ptr members.
    void connect();//连接服务器
    void disconnect();//关闭连接 
    void stop();
    //获取客⼾端对应的通信连接Connection对象的接⼝，发起connect后，有可能还没有连接建⽴成功
    TcpConnectionPtr connection() const
    {
        MutexLockGuard lock(mutex_); 
        return connection_;
    }
    /// 连接服务器成功时的回调函数
    void setConnectionCallback(ConnectionCallback cb)
    { connectionCallback_ = std::move(cb); }
    /// 收到服务器发送的消息时的回调函数
    void setMessageCallback(MessageCallback cb)
    { messageCallback_ = std::move(cb); }
};
```

从该类的构造函数可以看到，Muduo库的`TcpClient`类在设计时也采用了多路转接，所以也需要一个`EventLoop`对象

接着看其中的函数：

1. `connect`：与服务器建立连接，需要注意，**这个函数不是阻塞的**
2. `disconnect`：与服务器断开连接
3. `stop`：停止客户端
4. `connection`：获取客户端的连接结构对象的地址
5. `setConnectionCallback`：与`TcpServer`的`setConnectionCallback`类似
6. `setMessageCallback`：与`TcpServer`的`setMessageCallback`类似

### `CountDownLatch`类

除了上面的类外，还需要关注一个类`CountDownLatch`，这个类主要是做计数同步操作的，比如一个场景：客户端发起请求与服务器端建立连接，但是可能由于服务器端没有及时获取到这个连接，这就导致客户端以为可以发送信息，但是实际上不能发送信息，所以此时就可以通过`CountDownLatch`类对这种情况进行控制，具体控制方式在接下来的示例会有介绍。下面先了解`CountDownLatch`类如何做同步的，该类定义如下：

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

通过该类的实现可以得出：如果计数器大于0，那么就等待，否则如果计数器等于0，那么就停止等待

## 使用实例：使用Muduo库实现一个简单网络词典

### 服务端

根据上面的介绍，可以考虑设计下面的服务端程序：

### 客户端

