# 基础模块设计

## 工具模块设计

### 日志模块

本次项目中使用到spdlog作为日志信息底层模块，但是直接使用spdlog会比较麻烦，所以考虑对spdlog进行封装，基本思路可以参考前面的[Linux日志系统](https://www.help-doc.top/Linux/linux-thread/log/log.html)

本次封装后，使用者可以按照如下方式使用：

1. 自主决定日志等级
2. 选择文件输出或者控制台输出
3. 使用[C++格式化字符串](https://www.help-doc.top/cpp/format/format.html)控制日志内容

根据上面的需求，首先需要三个函数：

1. 切换日志等级
2. 启用文件输出
3. 启用控制台输出

设计如下：

=== "切换日志等级"

    ```cpp
    // 日志等级，与spdlog等级对应
    enum class Level
    {
        Debug,
        Info,
        Warning,
        Error,
        Critical
    };

    // ...

    // 设置日志等级
    void setLevel(const Level l)
    {
        switch (l)
        {
        case Level::Debug:
            spdlog::set_level(spdlog::level::debug);
            break;
        case Level::Info:
            spdlog::set_level(spdlog::level::info);
            break;
        case Level::Warning:
            spdlog::set_level(spdlog::level::warn);
            break;
        case Level::Error:
            spdlog::set_level(spdlog::level::err);
            break;
        case Level::Critical:
            spdlog::set_level(spdlog::level::critical);
            break;
        default:
            break;
        }
    }
    ```

=== "启用文件输出"

    ```cpp
    const std::string filepath = "log/log.txt";

    // 启用文件输出
    void enableFileLog()
    {
        std::unique_lock<std::mutex> lock(mode_mtx_);
        spdlog::drop_all(); // 清除上一次的指针
        logger_ = spdlog::basic_logger_mt("file_log", filepath);
    }
    ```

=== "启用控制台输出"

    ```cpp
    // 启用控制台输出
    void enableConsoleLog()
    {
        std::unique_lock<std::mutex> lock(mode_mtx_);
        spdlog::drop_all(); // 清除上一次的指针
        logger_ = spdlog::stdout_color_mt("console_log");
    }
    ```

在日志模块对象创建时，默认启用控制台输出，并且设置日志等级为`debug`，格式为`[年-月-日 时:分:秒] [日志等级] [文件名:行号] 日志内容`，所以设计日志模块的构造函数如下：

```cpp
LogSystem()
{
    // 默认等级
    spdlog::set_level(spdlog::level::debug);
    // 默认格式
    spdlog::set_pattern("[%Y-%m-%d %H:%M:%S] [%^%l%$] %v");
    // 默认控制台打印
    logger_ = spdlog::stdout_color_mt("console_log");
}
```

因为日志输出从程序运行到结束都只需要使用一个对象，所以本次考虑使用单例模式，设计如下：

```cpp
class LogSystem
{
private:
    // ...

    // 禁用拷贝构造和赋值
    LogSystem(const LogSystem &) = delete;
    LogSystem &operator=(const LogSystem &) = delete;

public:
    static std::shared_ptr<LogSystem> getInstance()
    {
        static std::once_flag init_flag;
        std::call_once(init_flag, []
                        { baseLog_ = std::shared_ptr<LogSystem>(new LogSystem()); });

        return baseLog_;
    }

    // ...

private:
    static std::shared_ptr<LogSystem> baseLog_;
    // ...
};

std::shared_ptr<LogSystem> LogSystem::baseLog_ = nullptr;
```

接着，提供一个获取到`spdlog::logger`的函数，便于上层可以调用spdlog的日志输出函数：

```cpp
// 获取日志指针
std::shared_ptr<spdlog::logger> getLogger()
{
    return logger_;
}
```

为了便于上层使用，下面提供一些宏定义：

1. 更改输出位置
2. 通用日志宏

首先是更改输出位置，只需要创建一个日志模块对象，然后调用对应的函数即可：

```cpp
// 获取日志系统类对象
std::shared_ptr<LogSystem> ls = LogSystem::getInstance();

#define ENABLE_FILE_LOG() ls->enableFileLog()
#define ENABLE_CONSOLE_LOG() ls->enableConsoleLog()
```

对于通用日志宏来说，首先需要针对每一个日志等级提供一个对应的宏：

```cpp
// 日志宏定义，带有文件名和行号
// ##运算符的主要作用是处理没有提供可变参数时的逗号问题
#define LOG_DEBUG(format, ...) \
    ls->getLogger()->debug("[{}:{}] " format, __FILE__, __LINE__, ##__VA_ARGS__)

#define LOG_INFO(format, ...) \
    ls->getLogger()->info("[{}:{}] " format, __FILE__, __LINE__, ##__VA_ARGS__)

#define LOG_WARN(format, ...) \
    ls->getLogger()->warn("[{}:{}] " format, __FILE__, __LINE__, ##__VA_ARGS__)

#define LOG_ERROR(format, ...) \
    ls->getLogger()->error("[{}:{}] " format, __FILE__, __LINE__, ##__VA_ARGS__)

#define LOG_CRITICAL(format, ...) \
    ls->getLogger()->critical("[{}:{}] " format, __FILE__, __LINE__, ##__VA_ARGS__)
```

关于宏中的不定参数，可以参考[关于C++日志库spdlog](https://www.help-doc.top/other/spdlog/spdlog.html#_21)

接着，提供一个通用宏，接收用户传递的日志等级和日志内容，再根据日志等级调用对应的日志宏：

```cpp
// 通用日志宏，可以指定日志级别
#define LOG(level, format, ...)              \
    switch (level)                           \
    {                                        \
    case log_system::Level::Debug:           \
        LOG_DEBUG(format, ##__VA_ARGS__);    \
        break;                               \
    case log_system::Level::Info:            \
        LOG_INFO(format, ##__VA_ARGS__);     \
        break;                               \
    case log_system::Level::Warning:         \
        LOG_WARN(format, ##__VA_ARGS__);     \
        break;                               \
    case log_system::Level::Error:           \
        LOG_ERROR(format, ##__VA_ARGS__);    \
        break;                               \
    case log_system::Level::Critical:        \
        LOG_CRITICAL(format, ##__VA_ARGS__); \
        break;                               \
    default:                                 \
        LOG_INFO(format, ##__VA_ARGS__);     \
        break;                               \
    }
```

### JSON序列化和反序列化封装

此处封装只是对JSON的函数操作封装，对应的JSON相关函数使用方式参考[关于JSONCPP](https://www.help-doc.top/other/jsoncpp/jsoncpp.html)

JSON工具类提供序列化和反序列化接口，这两个函数使用方式分别如下：

1. 接收一个JSON对象，将对象序列化为JSON字符串通过参数返回给上层（不是通过返回值）
2. 接收一个JSON字符串，将JSON字符串反序列化为对象通过参数返回给上层（不是通过返回值）

=== "序列化"

    ```cpp
    // JSON字符串转换为普通字符串，外部需要传递JSON字符串
    static bool serialize(const Json::Value &json_object, std::string &json_str)
    {
        std::stringstream ss;          // 先实例化⼀个⼯⼚类对象
        Json::StreamWriterBuilder swb; // 通过⼯⼚类对象来⽣产派⽣类对象
        std::unique_ptr<Json::StreamWriter> sw(swb.newStreamWriter());
        int ret = sw->write(json_object, &ss);
        if (ret != 0)
        {
            LOG(log_system::Level::Error, "JSON序列化失败");
            return false;
        }
        json_str = ss.str();
        return true;
    }
    ```

=== "反序列化"

    ```cpp
    // 普通字符串转换为JSON字符串，外部需要对JSON字符串进行处理
    static bool deserialize(const std::string &json_str, Json::Value &json_object)
    {
        // 实例化⼯⼚类对象
        Json::CharReaderBuilder crb;
        // ⽣产CharReader对象
        std::string errs;
        std::unique_ptr<Json::CharReader> cr(crb.newCharReader());
        bool ret = cr->parse(json_str.c_str(), json_str.c_str() + json_str.size(), &json_object, &errs);
        if (ret == false)
        {
            LOG(Level::Error, "JSON反序列化失败: {}", errs);
            return false;
        }
        return true;
    }
    ```

### UUID生成封装

在前面的应用层协议模块的介绍中提到请求/响应ID为UUID类型，为了在使用时方便，同样对UUID生成过程进行封装，本次考虑使用Boost库中的UUID生成器，封装如下：

```cpp
static std::string generate_uuid()
{
    // 使用boost库生成uuid
    // 创建一个随机数生成器
    boost::uuids::random_generator generator;

    // 生成一个随机 UUID
    boost::uuids::uuid id = generator();
    return boost::uuids::to_string(id);
}
```

## 枚举字段和宏定义

在项目中会经常使用到一些字段，为了简化上层使用和统一，针对下面的字段进行描述：

1. 用于JSON序列化和反序列化的字段
2. 应用层协议中的消息类型
3. 返回状态码
4. 消息发送模式
5. 主题操作类型
6. 服务操作类型

分别设计如下：

=== "用于JSON序列化和反序列化的字段"

    ```cpp
    // 请求和响应中body需要的字段
    #define KEY_METHOD "method"       // 方法名
    #define KEY_PARAMS "parameters"   // 方法参数
    #define KEY_TOPIC_KEY "topic_key" // 主题名称
    #define KEY_TOPIC_MSG "topic_msg" // 主题信息
    #define KEY_OPTYPE "optype"       // 操作类型
    #define KEY_HOST "host"           // 端口
    #define KEY_HOST_IP "ip"          // IP地址
    #define KEY_HOST_PORT "port"      // 端口号
    #define KEY_RCODE "rcode"         // 返回状态码
    #define KEY_RESULT "result"       // 返回值
    ```

=== "应用层协议中的消息类型"

    ```cpp
    // 应用层协议中的消息类型
    enum class MType
    {
        Req_rpc = 0, // RPC请求
        Resp_rpc,    // RPC响应
        Req_topic,   // 主题请求
        Resp_topic,  // 主题响应
        Req_service, // 服务请求
        Resp_service // 服务响应
    };
    ```

=== "返回状态码"

    ```cpp
    // 返回状态码
    enum class RCode
    {
        RCode_fine = 0,          // 正常
        RCode_parse_failed,      // 解析失败
        RCode_wrong_msgType,     // 错误的消息类型
        RCode_invalid_msg,       // 无效消息
        RCode_disconneted,       // 连接断开
        RCode_invalid_params,    // 错误参数
        RCode_not_found_service, // 未找到服务
        RCode_invalid_opType,    // 无效操作类型
        RCode_not_found_topic,   // 未找到主题
        RCode_internal_error     // 内部错误
    };
    ```

=== "消息发送模式"

    ```cpp
    // 消息发送模式
    enum class RType
    {
        Req_async = 0, // 异步模式
        Req_callback   // 回调模式
    };
    ```

=== "主题操作类型"

    ```cpp
    // 主题操作类型
    enum class TopicOptype
    {
        Topic_create = 0, // 主题创建
        Topic_remove,     // 主题移除
        Topic_subscribe,  // 主题订阅
        Topic_cancel,     // 主题取消
        Topic_publish     // 主题消息发布
    };
    ```

=== "服务操作类型"

    ```cpp
    // 服务操作类型
    enum class ServiceOptype
    {
        Service_register = 0, // 服务注册
        Service_discover,     // 服务发现
        Service_online,       // 服务上线
        Service_offline,      // 服务下线
        Service_wrong_type,   // 错误服务类型
        Service_unknown       // 不存在的服务类型
    };
    ```

对于错误码，更多的时候需要看到错误码对应的错误信息，所以考虑提供一个错误码转错误信息的函数，设计如下：

```cpp
// 获取错误原因字符串
std::string errReason(RCode code)
{
    switch (code)
    {
    case RCode::RCode_fine:
        return "正常";
    case RCode::RCode_parse_failed:
        return "解析失败";
    case RCode::RCode_wrong_msgType:
        return "错误的消息类型";
    case RCode::RCode_invalid_msg:
        return "无效消息";
    case RCode::RCode_disconneted:
        return "连接断开";
    case RCode::RCode_invalid_params:
        return "错误参数";
    case RCode::RCode_not_found_service:
        return "未找到服务";
    case RCode::RCode_invalid_opType:
        return "无效操作类型";
    case RCode::RCode_not_found_topic:
        return "未找到主题";
    case RCode::RCode_internal_error:
        return "内部错误";
    default:
        return "无指定的错误原因";
    }

    return "";
}
```

## 基类设计

### 设计思想及抽象类介绍

为了保证代码的开闭原则，考虑抽象类和子类的设计，确保在更换部分模块时使用处的代码不需要修改

??? info "开闭原则"

    **开闭原则（Open-Closed Principle, OCP）** 是面向对象设计中的一个核心原则，由Bertrand Meyer提出，是SOLID原则之一。它的核心思想是：对扩展开放，对修改关闭（Open for extension, closed for modification）

      - 对扩展开放（Open for extension）：软件实体（类、模块、函数等）应该允许在不修改原有代码的情况下进行功能的扩展
      - 对修改关闭（Closed for modification）：当需求变化时，不需要去改动已有的代码逻辑

    通过遵循开闭原则，可以提高系统的可维护性、可复用性和稳定性。当系统需要新增功能时，只需添加新代码，而不需要修改已有代码，从而降低了引入错误的风险

    要实现“对扩展开放，对修改关闭”，通常使用以下技术手段：

     1. 抽象（Abstract） + 多态（Polymorphism）：定义接口或抽象类，具体行为由子类实现。新增功能时，只需要增加新的子类，不需要修改调用者代码

        ```cpp
        #include <iostream>
        #include <vector>

        // 抽象类：图形接口
        class Shape 
        {
        public:
            virtual double area() const = 0; // 纯虚函数
            virtual ~Shape() = default;
        };

        // 扩展：矩形
        class Rectangle : public Shape 
        {
        private:
            double width, height;
        public:
            Rectangle(double w, double h) : width(w), height(h) {}
            double area() const override 
            {
                return width * height;
            }
        };

        // 扩展：圆形
        class Circle : public Shape 
        {
        private:
            double radius;
        public:
            Circle(double r) : radius(r) {}
            double area() const override 
            {
                return 3.14 * radius * radius;
            }
        };

        // 面积计算器：对所有图形统一处理
        class AreaCalculator 
        {
        public:
            static double calculate(const Shape& shape) 
            {
                return shape.area();
            }
        };

        int main() 
        {
            Rectangle rect(5, 10);
            Circle circle(7);

            std::cout << "Rectangle Area: " << AreaCalculator::calculate(rect) << std::endl;
            std::cout << "Circle Area: " << AreaCalculator::calculate(circle) << std::endl;

            return 0;
        }
        ```

     2. 策略模式（Strategy Pattern）：将算法封装为独立的类，运行时可以动态切换策略，而不是硬编码逻辑
     3. 插件机制 / 模块化设计：通过配置文件或反射机制加载外部模块，使得系统具备动态扩展能力

在本次项目中，考虑设计思路为：

1. 连接管理：服务端可能不止收到一个客户端的连接，而一个客户端的连接可能包含很多信息，例如客户端的端口和IP地址，所以为了方便管理，需要设计一个连接类来管理每一个客户端的连接，在这个连接类中，除了提供最基础的连接信息外，还需要提供一个发送接口，这样可以确保发送接口的使用方式是统一的，即只能通过连接类的连接对象发送数据
2. 消息处理过程：服务端或者客户端都是从缓冲区读取数据，而不是读取传输过来的数据，所以需要一个缓冲区类，接着需要有一个类用于判断读取到的数据是否完整以及构建一个序列化之后的数据，这个类就是应用层协议类，一旦应用层协议类判断数据已经完整就可以将数据保存起来，而在序列化时需要拿到待序列化的数据，即还需要一个类来保存读取到的数据以及作为构建序列化数据的来源，所以此时还需要设计一个消息类，这个类内部需要提供设置协议中的字段的接口和获取协议中的字段的接口
3. 客户端和服务端：封装客户端和服务端，提供对外的接口，供上层使用，简化整体连接操作

!!! note "应用层协议类的数据构建接口和消息类的序列化与反序列化接口的关系"

    应用层协议类的数据构建接口是将正文长度、消息类型、请求/响应ID、请求/响应ID长度和正文5个字段组合构建出一个完整的满足约定协议的消息，而消息类的序列化和反序列化接口只是对消息的正文（例如请求RPC服务，客户端需要发送请求的服务和参数，服务端需要返回的接口）进行序列化和反序列化，而不对其他字段进行操作

根据上面的思路，分别设计下面的基类：

1. Buffer基类：用于处理网络数据的缓冲区，用于存储接收到的数据，向外提供需要的读取接口
2. Message基类：对消息进行封装，提供设置应用层协议相关字段（不包括正文中的字段）的接口，同时提供序列化和反序列化接口用于后续应用层协议模块使用，最后提供一个判断消息是否完整的接口
3. Connection基类：对网络连接进行封装，提供连接的获取、判断连接是否正常和发送接口
4. Protocol基类：应用层协议的基类，提供获取消息字段和构建消息的接口，同时提供判断消息是否完整的接口
5. Client基类：用于客户端的封装，提供连接服务器、断开服务器、获取当前客户端连接对象和判断当前连接是否正常的接口
6. Server基类：用于服务端的封装，提供启动服务器的接口

### Buffer基类设计

根据前面对应用层协议格式的约定，提供下面的接口：

1. 获取缓冲区有效数据大小
2. 尝试读取4字节数据，但是不删除该数据
3. 删除4字节数据
4. 读取并删除4字节数据
5. 获取指定长度的数据

设计出Buffer基类如下：

```cpp
class BaseBuffer
{
public:
    using ptr = std::shared_ptr<BaseBuffer>;
    // 可读数据大小
    virtual size_t readableSize() = 0;
    // 尝试获取4字节数据，但是不从缓冲区删除
    virtual int32_t peekInt32() = 0;
    // 删除4字节数据
    virtual void retrieveInt32() = 0;
    // 读取并删除4字节数据
    virtual int32_t readInt32() = 0;
    // 获取指定长度的数据
    virtual std::string retrieveAsString(size_t len) = 0;
};
```

### Message基类设计

根据上面的设计思路，需要在Message基类中提供下面的接口：

1. 设置消息类型
2. 获取消息类型
3. 设置请求/响应ID
4. 获取请求/响应ID
5. 序列化
6. 反序列化

除了上面的接口以外，还需要提供一个判断正文内容是否有效的接口。因为序列化、反序列化以及判断接口都取决于上层使用的序列化和反序列化的方式，所以在当前父类中不提供具体的实现，而其他四个函数可以直接实现，因为根据应用层协议格式的约定，对应设置的字段都是固定的

设计出Message基类如下：

```cpp
class BaseMessage
{
public:
    using ptr = std::shared_ptr<BaseMessage>;

    virtual ~BaseMessage() {}
    // 设置请求/响应ID
    virtual void setId(const std::string &id)
    {
        req_resp_id_ = id;
    }
    // 获取请求/响应ID
    virtual std::string getReqRespId()
    {
        return req_resp_id_;
    }
    // 设置消息类型
    virtual void setMType(public_data::MType mtype)
    {
        mtype_ = mtype;
    }
    // 获取消息类型
    virtual public_data::MType getMtype()
    {
        return mtype_;
    }
    // 序列化
    virtual bool serialize(std::string &msg) = 0;
    // 反序列化
    virtual bool deserialize(const std::string &msg) = 0;
    // 检查消息是否合法
    virtual bool check() = 0;

protected:
    public_data::MType mtype_;
    std::string req_resp_id_;
};
```

### Connection基类设计

根据上面的设计思路，需要在Connection基类中提供下面的接口：

1. 获取当前连接对象
2. 判断当前连接是否正常
3. 发送数据

本次项目中，发送的数据为基于`BaseMessage`的子类对象序列化后的成员变量尼尔和构建出的应用层协议字段组成的完整消息，所以需要在参数部分传递一个`BaseMessage`对象指针

设计出Connection基类如下：

```cpp
class BaseConnection
{
public:
    using ptr = std::shared_ptr<BaseConnection>;
    // 发送
    virtual void send(const base_message::BaseMessage::ptr &msg) = 0;
    // 关闭连接
    virtual void shutdown() = 0;
    // 判断连接是否正常
    virtual bool connected() = 0;
};
```

### Protocol基类设计

应用层协议类是最直接和缓冲区类产生联系的类，因为应用层协议类需要从缓冲区类中读取数据。根据前面的思路，需要在Protocol基类中提供下面的接口：

1. 判断数据是否完整
2. 构建完整的满足协议格式的内容
3. 解析数据存储到消息类中

设计出Protocol基类如下：

```cpp
// 抽象协议类
class BaseProtocol
{
public:
    using ptr = std::shared_ptr<BaseProtocol>;
    // 判断是否是有效数据
    virtual bool canProcessed(const base_buffer::BaseBuffer::ptr &buf) = 0;
    // 收到消息时的处理，从buffer中读取数据交给Message类处理
    virtual bool getContentFromBuffer(const base_buffer::BaseBuffer::ptr &buf, base_message::BaseMessage::ptr &msg) = 0;
    // 序列化接口，用于序列化Message类的成员
    virtual std::string constructProtocol(const base_message::BaseMessage::ptr &msg) = 0;
    // 不提供反序列化
};
```

### Client基类设计

根据上面的设计思路，需要在Client基类中提供下面的接口：

1. 连接服务器
2. 断开服务器
3. 获取当前客户端连接对象
4. 判断当前连接是否正常

除了上面的接口以外，还需要提供三个设置回调函数的接口，确保封装的客户端可以执行的任务是由上层决定的。现在考虑回调函数的参数和返回值类型，在底层客户端部分，只有连接建立成功、收到消息和断开连接三个状态，后面的消息处理都是建立在收到消息基础之上，所以三个回调函数的参数都存在`BaseConnection`对象指针，返回值为`void`，而对于收到消息来说，需要对消息进行处理（例如获取消息），所以还需要有`BaseMessage`对象指针

设计出Client基类如下：

=== "回调类型"

    ```cpp
    // 定义在枚举字段和宏定义所在文件中
    // 连接回调函数
    using connectionCallback_t = std::function<void(const base_connection::BaseConnection::ptr &)>;
    // 关闭连接时回调函数
    using closeCallback_t = std::function<void(const base_connection::BaseConnection::ptr &)>;
    // 收到消息时回调函数
    using messageCallback_t = std::function<void(const base_connection::BaseConnection::ptr &, base_message::BaseMessage::ptr &)>;
    ```

=== "Client基类设计"

    ```cpp
    // 客户端抽象
    class BaseClient
    {
    public:
        using ptr = std::shared_ptr<BaseClient>;
        virtual void setConnectionCallback(const public_data::connectionCallback_t &cb)
        {
            cb_connection_ = cb;
        }
        virtual void setCloseCallback(const public_data::closeCallback_t &cb)
        {
            cb_close_ = cb;
        }
        virtual void setMessageCallback(const public_data::messageCallback_t &cb)
        {
            cb_message_ = cb;
        }

        // 连接服务端
        virtual void connect() = 0;
        // 关闭连接
        virtual void shutdown() = 0;
        // 获取连接对象
        virtual base_connection::BaseConnection::ptr connection() = 0;
        // 判断是否连接
        virtual bool connected() = 0;

    protected:
        public_data::connectionCallback_t cb_connection_;
        public_data::closeCallback_t cb_close_;
        public_data::messageCallback_t cb_message_;
    };
    ```

### Server基类设计

根据前面的思路，服务端只需要有一个启动服务器的接口。接着，与客户端一样需要处理三种情况，所以也需要三个回调函数，类型与客户端部分提到的一致。设计Server基类如下：

```cpp
// 服务端抽象
class BaseServer
{
public:
    using ptr = std::shared_ptr<BaseServer>;
    virtual void setConnectionCallback(const public_data::connectionCallback_t &cb)
    {
        cb_connection_ = cb;
    }
    virtual void setCloseCallback(const public_data::closeCallback_t &cb)
    {
        cb_close_ = cb;
    }
    virtual void setMessageCallback(const public_data::messageCallback_t &cb)
    {
        cb_message_ = cb;
    }

    // 启动服务器
    virtual void start() = 0;

protected:
    public_data::connectionCallback_t cb_connection_;
    public_data::closeCallback_t cb_close_;
    public_data::messageCallback_t cb_message_;
};
```

## 派生类设计

### Buffer派生类设计

根据前面的抽象类，接下来依次实现对应的派生类，首先是Buffer基类的派生类，本次项目是基于Muduo库实现的，所以本次的Buffer派生类只需要基于Muduo库中的Buffer类实现即可：

!!! note

    关于Muduo库中的Buffer类介绍，可以参考[关于Muduo库](https://www.help-doc.top/other/muduo/muduo.html#buffer)

```cpp
// 基于Muduo库中的Buffer进行再次封装，满足可扩展性
// 方法实现底层全部调用Muduo中Buffer类中的方法
class MuduoBuffer : public base_buffer::BaseBuffer
{
public:
    MuduoBuffer(muduo::net::Buffer *buf)
        : buffer_(buf)
    {
    }
    using ptr = std::shared_ptr<MuduoBuffer>;
    // 可读数据大小
    virtual size_t readableSize() override
    {
        return buffer_->readableBytes();
    }
    // 尝试获取4字节数据，但是不从缓冲区删除
    virtual int32_t peekInt32() override
    {
        return buffer_->peekInt32(); // 会进行网络字节序转换
    }
    // 删除4字节数据
    virtual void retrieveInt32() override
    {
        buffer_->retrieveInt32();
    }
    // 读取并删除4字节数据
    virtual int32_t readInt32() override
    {
        return buffer_->readInt32();
    }
    // 获取指定长度的数据
    virtual std::string retrieveAsString(size_t len) override
    {
        return buffer_->retrieveAsString(len);
    }

private:
    muduo::net::Buffer *buffer_; // 基于Muduo库的Buffer
};
```

### Message派生类设计

#### 基于`BaseMessage`的`JsonMessage`子类设计

本次项目中，Message派生类一共有两个，这两个子类都是基于JSON实现的，表示JSON请求消息类和JSON响应消息类，在这两个子类中，主要实现序列化和反序列化函数即可，为了不需要在请求类和响应类中重复实现序列化和反序列化函数，考虑创建一个基于JSON的基类，然后让请求类和响应类继承这个基类，而这个类中主要实现正文字段的序列化和反序列化函数即可，下面考虑该类的设计：

既然是正文序列化和反序列化，那么少不了的就是JSON对象，所以需要一个成员`body_`，用于保存反序列化结果，如下：

```cpp
class JsonMessage : public base_message::BaseMessage
{
public:
    using ptr = std::shared_ptr<JsonMessage>;
protected:
    Json::Value body_;
};
```

接着实现序列化函数，序列化函数内部主要思路需要调用上面实现的JSON序列化工具类，将序列化后的字符串存储到参数中返回给上层，参考代码如下：

```cpp
virtual bool serialize(std::string &msg) override
{
    // 判断Json对象是否为空
    if (body_.isNull())
    {
        LOG(Level::Warning, "正文字段Body为空，序列化失败");
        return false;
    }

    // 调用Json工具类方法进行序列化
    if (!json_util::JsonUtil::serialize(body_, msg))
    {
        LOG(Level::Warning, "对Body序列化失败");
        return false;
    }

    return true;
}
```

对于反序列化函数也是类似，参考代码如下：

```cpp
virtual bool deserialize(const std::string &msg) override
{
    if (msg.empty())
    {
        LOG(Level::Warning, "反序列化失败，字符串为空");
        return false;
    }

    // 调用Json工具类方法进行反序列化
    if (!json_util::JsonUtil::deserialize(msg, body_))
    {
        LOG(Level::Warning, "反序列化失败");
        return false;
    }

    return true;
}
```

#### 基于`JsonMessage`的`JsonRequest`和`JsonResponse`子类设计

接着，实现两个基于`JsonMessage`的子类`JsonRequest`和`JsonResponse`，其中在`JsonRequest`中不需要额外实现其他函数，因为正文字段的检查取决于不同的请求类型，在后续的请求子类中再具体实现，在`JsonResponse`中需要实现`check`函数用于对返回值状态码类型进行检查，因为不论是否存在结果，在本次项目中都需要返回状态码，所以在`JsonResponse`中实现最基础的`check`函数，对应地需要两个函数分别为设置返回状态码和获取返回状态码。参考代码如下：

=== "`JsonRequest`子类"

    ```cpp
    class JsonRequest : public JsonMessage
    {
    public:
        using ptr = std::shared_ptr<JsonRequest>;
    };
    ```

=== "`JsonResponse`子类"

    ```cpp
    class JsonResponse : public JsonMessage
    {
    public:
        using ptr = std::shared_ptr<JsonResponse>;
        // 检查返回值是否合法
        virtual bool check() override
        {
            // 判断返回值字段是否存在或者是否为整数，不是返回false
            if (body_[KEY_RCODE].isNull() || !body_[KEY_RCODE].isInt())
            {
                LOG(Level::Warning, "返回值类型错误");
                return false;
            }

            return true;
        }

        // 设置和返回状态码
        virtual void setRCode(const public_data::RCode r)
        {
            body_[KEY_RCODE] = static_cast<int>(r);
        }

        virtual public_data::RCode getRCode()
        {
            return static_cast<public_data::RCode>(body_[KEY_RCODE].asInt());
        }
    };
    ```

#### 基于`JsonRequest`的`RpcRequest`子类设计

在RPC请求中，根据前面的模块介绍，正文中需要包含请求的服务名和服务需要的参数，所以在`RpcRequest`中实现设置/获取服务名和参数的函数，其中，服务名是字符串类型，而参数取决于具体的服务，所以只能为JSON对象类型。接着实现对应的`check`函数，函数内部分别检查服务名是否存在且为字符串以及参数是否存在且为JSON对象类型即可。实现如下：

```cpp
class RpcRequest : public json_message::JsonRequest
{
public:
    using ptr = std::shared_ptr<RpcRequest>;
    // 实现检查方法
    virtual bool check() override
    {
        // 判断方法名是否存在且为字符串
        if (body_[KEY_METHOD].isNull() || !body_[KEY_METHOD].isString())
        {
            LOG(Level::Warning, "方法名错误");
            return false;
        }

        // 判断参数是否存在且为JSON对象
        if (body_[KEY_PARAMS].isNull() || !body_[KEY_PARAMS].isObject())
        {
            LOG(Level::Warning, "参数错误");
            return false;
        }

        return true;
    }

    // 设置和获取方法
    void setMethod(const std::string &m)
    {
        // method_ = m;
        body_[KEY_METHOD] = m;
    }

    std::string getMethod()
    {
        return body_[KEY_METHOD].asString();
    }

    // 设置和获取参数
    void setParams(const Json::Value &p)
    {
        // parameters_ = p;
        body_[KEY_PARAMS] = p;
    }

    Json::Value getParams()
    {
        return body_[KEY_PARAMS];
    }
};
```

需要注意的是，不要在`RpcRequest`中再包含服务名成员和服务参数成员，因为二者都是正文的内容，只需要向表示正文的JSON对象`body_`中插入即可

#### 基于`JsonRequest`的`TopicRequest`子类设计

在主题请求中，根据前面的模块介绍，正文中需要包含请求的主题名称（字符串）和请求操作类型（枚举类型，整型），如果请求类型是`Topic_publish`（主题消息发布），那么还需要携带待转发的消息（字符串），所以需要提供设置/获取主题名称、请求操作类型和待转发消息的函数。接着，实现`check`函数，分别检查主题名称是否存在且为字符串、请求操作类型是否存在且为整型以及如果请求操作类型为`Topic_publish`则是否存在待转发的消息且为字符串。实现如下：

```cpp
class TopicRequest : public json_message::JsonRequest
{
public:
    using ptr = std::shared_ptr<TopicRequest>;
    // 检查三个字段
    virtual bool check() override
    {
        // 检查主题名称
        // 判断主题是否存在且为字符串
        if (body_[KEY_TOPIC_KEY].isNull() || !body_[KEY_TOPIC_KEY].isString())
        {
            LOG(Level::Warning, "主题名称错误");
            return false;
        }

        // 检查主题操作类型
        // 判断是否存在操作类型且为整数
        if (body_[KEY_OPTYPE].isNull() || !body_[KEY_OPTYPE].isInt())
        {
            LOG(Level::Warning, "主题操作类型错误");
            return false;
        }

        // 检查消息
        // 判断是否为Topic_publish，如果是再检查是否存在消息且为字符串
        if (body_[KEY_OPTYPE].asInt() == static_cast<int>(public_data::TopicOptype::Topic_publish) &&
            (body_[KEY_TOPIC_MSG].isNull() || !body_[KEY_TOPIC_MSG].isString()))
        {
            LOG(Level::Warning, "主题消息错误");
            return false;
        }

        return true;
    }

    // 设置和获取主题名称
    void setTopicName(const std::string &n)
    {
        body_[KEY_TOPIC_KEY] = n;
    }

    std::string getTopicName()
    {
        return body_[KEY_TOPIC_KEY].asString();
    }

    // 设置和获取主题操作类型
    void setTopicOptype(const public_data::TopicOptype &op)
    {
        body_[KEY_OPTYPE] = static_cast<int>(op);
    }

    public_data::TopicOptype getTopicOptype()
    {
        return static_cast<public_data::TopicOptype>(body_[KEY_OPTYPE].asInt());
    }

    // 设置和获取主题信息
    void setMessage(const std::string &m)
    {
        body_[KEY_TOPIC_MSG] = m;
    }

    std::string getMessage()
    {
        return body_[KEY_TOPIC_MSG].asString();
    }

};
```

#### 基于`JsonRequest`的`ServiceRequest`子类设计

在服务请求中，根据前面的模块介绍，正文需要包含请求的服务类型（整型）和提供的服务（字符串），如果服务类型是`Service_discover`就不要求需要携带主机信息（包括IP地址和端口号，类型为JSON对象），其他的服务类型都必须携带主机信息，所以需要提供设置/获取服务类型、提供的服务和主机信息的函数。接着，在`check`函数中实现检查服务类型是否存在且为整型、提供的服务是否存在且为字符串以及如果服务类型不为`Service_discover`是否存在主机信息且为JSON对象。实现如下：

```cpp
// 主机信息类型
using host_addr_t = std::pair<std::string, uint16_t>;

class ServiceRequest : public json_message::JsonRequest
{
public:
    using ptr = std::shared_ptr<ServiceRequest>;
    // 检查字段
    virtual bool check() override
    {
        // 检查方法名
        // 判断方法名是否存在且为字符串
        if (body_[KEY_METHOD].isNull() || !body_[KEY_METHOD].isString())
        {
            LOG(Level::Warning, "方法名称错误");
            return false;
        }

        // 检查主题操作类型
        // 判断是否存在操作类型且为整数
        if (body_[KEY_OPTYPE].isNull() || !body_[KEY_OPTYPE].isInt())
        {
            LOG(Level::Warning, "服务操作类型错误");
            return false;
        }

        // 检查消息
        // 判断是否存在主机信息
        if ((body_[KEY_OPTYPE].asInt() != static_cast<int>(public_data::ServiceOptype::Service_discover)) &&
            (body_[KEY_HOST].isNull() || !body_[KEY_HOST].isObject()) &&
            (body_[KEY_HOST][KEY_HOST_IP].isNull() || !body_[KEY_HOST][KEY_HOST_IP].isString()) &&
            (body_[KEY_HOST][KEY_HOST_PORT].isNull() || !body_[KEY_HOST][KEY_HOST_PORT].isInt()))
        {
            LOG(Level::Warning, "主机信息错误");
            return false;
        }

        return true;
    }

    // 设置/获取服务操作类型
    void setServiceOptype(const public_data::ServiceOptype so)
    {
        body_[KEY_OPTYPE] = static_cast<int>(so);
    }

    public_data::ServiceOptype getServiceOptye()
    {
        return static_cast<public_data::ServiceOptype>(body_[KEY_OPTYPE].asInt());
    }

    // 设置和获取方法名
    void setMethod(const std::string& n)
    {
        body_[KEY_METHOD] = n;
    }

    std::string getMethod()
    {
        return body_[KEY_METHOD].asString();
    }

    // 设置和获取服务操作类型
    void setHost(const public_data::host_addr_t &host)
    {
        // 以一个对象的方式插入到body_中
        Json::Value val;
        val[KEY_HOST_IP] = host.first;
        val[KEY_HOST_PORT] = host.second;
        body_[KEY_HOST] = val;
    }

    public_data::host_addr_t getHost()
    {
        public_data::host_addr_t host;
        host.first = body_[KEY_HOST][KEY_HOST_IP].asString();
        host.second = body_[KEY_HOST][KEY_HOST_PORT].asInt();

        return host;
    }

};
```

#### 基于`JsonResponse`的`RpcResponse`子类设计

在RPC响应中，根据前面的模块介绍，正文中需要包含返回值和返回状态码，所以在`RpcResponse`中实现设置/获取返回值和返回状态码的函数，但是设置返回值和返回状态码函数已经在父类`JsonResponse`中存在，所以此处可以不需要再写一遍。其中，返回值类型取决于上层的处理函数，此处无法确定，而返回状态码为整型。接着实现对应的`check`函数，函数内部分别检查返回值是否存在（但是不判断具体类型）以及返回状态码是否存在且为整型即可。实现如下：

```cpp
class RpcResponse : public json_message::JsonResponse
{
public:
    using ptr = std::shared_ptr<RpcResponse>;

    // ! 需要重新实现check
    virtual bool check() override
    {
        // 判断返回状态码
        if (body_[KEY_RCODE].isNull() || !body_[KEY_RCODE].isInt())
        {
            LOG(Level::Warning, "返回状态码错误");
            return false;
        }

        // 判断返回值
        // 因为返回值可能不止一种类型，所以此处不判断返回值的类型是否正确
        // 而是交给上层进行处理
        if (body_[KEY_RESULT].isNull())
        {
            LOG(Level::Warning, "返回值错误");
            return false;
        }

        return true;
    }

    // 获取和设置返回值
    void setResult(const Json::Value &v)
    {
        body_[KEY_RESULT] = v;
    }

    Json::Value getResult()
    {
        return body_[KEY_RESULT];
    }
};
```

#### 基于`JsonResponse`的`TopicResponse`子类设计

在主题响应中，根据前面的模块介绍，只存在返回状态码，而返回状态码的设置、获取和检查都在父类`JsonResponse`中实现，所以对于`TopicResponse`来说只是一个空的子类：

```cpp
class TopicResponse : public json_message::JsonResponse
{
public:
    using ptr = std::shared_ptr<TopicResponse>;
};
```

#### 基于`JsonResponse`的`ServiceResponse`子类设计

在服务响应中，根据前面的模块介绍，正文需要包含服务类型（整型）、返回状态码（整型）和请求的服务名称（字符串），如果服务类型是`Service_discover`就要求需要携带主机信息集（包括多个主机的IP地址和端口号，类型为JSON数组），其他的服务类型就不必携带主机信息，**此处与服务请求相反**，所以需要提供请求的服务名称、服务类型和主机信息集的函数。接着，在`check`函数中实现检查返回状态码是否存在且为整型、服务类型是否存在且为整型以及如果服务类型为`Service_discover`提供的服务是否存在且为字符串是否存在主机信息集且为JSON数组类型。实现如下：

```cpp
class ServiceResponse : public json_message::JsonResponse
{
public:
    using ptr = std::shared_ptr<ServiceResponse>;

    // ! 需要实现check
    virtual bool check() override
    {
        // 判断返回状态码
        if (body_[KEY_RCODE].isNull() || !body_[KEY_RCODE].isInt())
        {
            LOG(Level::Warning, "返回状态码错误");
            return false;
        }

        if (body_[KEY_OPTYPE].isNull() || !body_[KEY_OPTYPE].isInt())
        {
            LOG(Level::Warning, "服务操作类型错误");
            return false;
        }

        // 判断操作类型是否存在且为Service_discover
        // 如果存在需要判断是否存在方法名和主机信息数组
        if ((body_[KEY_OPTYPE].isInt() == static_cast<int>(public_data::ServiceOptype::Service_discover)) &&
            (body_[KEY_METHOD].isNull() || !body_[KEY_METHOD].isString()) &&
            (body_[KEY_HOST].isNull() || !body_[KEY_HOST].isArray()))
        {
            LOG(Level::Warning, "操作类型为Service_discover，但是返回值错误");
            return false;
        }

        return true;
    }

    // 设置/获取服务类型
    public_data::ServiceOptype getServiceOptype()
    {
        return static_cast<public_data::ServiceOptype>(body_[KEY_OPTYPE].asInt());
    }

    void setServiceOptye(const public_data::ServiceOptype& o)
    {
        body_[KEY_OPTYPE] = static_cast<int>(o);
    }

    // 设置/获取方法名和主机信息
    void setMethod(const std::string &name)
    {
        body_[KEY_METHOD] = name;
    }

    std::string getMethod()
    {
        return body_[KEY_METHOD].asString();
    }

    // ! 注意主机信息是一个数组
    void setHosts(const std::vector<public_data::host_addr_t> &hosts)
    {
        std::for_each(hosts.begin(), hosts.end(), [this](public_data::host_addr_t h)
        {
            Json::Value host;
            host[KEY_HOST_IP] = h.first;
            host[KEY_HOST_PORT] = h.second;

            body_[KEY_HOST].append(host); 
        });
    }

    std::vector<public_data::host_addr_t> getHosts()
    {
        std::vector<public_data::host_addr_t> hosts;
        int length = body_[KEY_HOST].size();
        for (int i = 0; i < length; i++)
            hosts.emplace_back(body_[KEY_HOST][i][KEY_HOST_IP].asString(),
                                body_[KEY_HOST][i][KEY_HOST_PORT].asInt());

        return hosts;
    }
};
```

### Protocol派生类设计

根据前面的父类结构，对应的子类需要实现下面三个函数：

1. 缓冲区数据是否可以被处理
2. 将消息类中的正文和其他协议格式字段组合构建一个完整的满足协议格式的字符串
3. 解析缓冲区中的完整数据

首先考虑「缓冲区数据是否可以被处理」函数，在这个函数中，先<a href="javascript:;" class="custom-tooltip" data-title="意味着使用不删除数据的读取接口">尝试</a>取出前4个字节的数据，接着，判断读取到的值加上4个字节是否小于等于缓冲区剩余数据大小，如果大于，说明缓冲区的数据不足以处理，否则可以处理。根据这个思路，函数实现如下：

```cpp
// 有效数据字段长度
const int32_t valid_length_field_length = 4;

virtual bool canProcessed(const base_buffer::BaseBuffer::ptr &buf) override
{
    if (buf->readableSize() < valid_length_field_length)
        return false;
    // 尝试从获取到缓冲区前4个字节
    int32_t valid_length = buf->peekInt32();
    // 计算预期总长度
    int32_t expect_length = valid_length + valid_length_field_length;
    // 获取实际大小
    int32_t real_length = buf->readableSize();

    if (real_length < expect_length)
    {
        LOG(Level::Warning, "长度不足，无法处理");
        return false;
    }

    return true;
}
```

接着考虑构建函数，首先对参数中的消息类成员进行序列化，即调用消息类的序列化接口对`body_`进行序列化，接着分别设置应用层协议的其他字段，此处需要注意，**凡是涉及到数值类型的都需要转换为网络字节序**，防止在使用`peekInt32`接口时出现问题。最后，将构建好的数据拼接到结果字符串中，此处也需要注意一点，**凡是涉及到数值类型的不要直接使用`to_string`转换为字符串**，因为这种转换方式改变了数据的字节表示，在前面的协议约定中，例如请求/响应ID大小，规定为4字节，如果该值的大小为86，则此时转换为字符串即为`"86"`，大小为2个字节，不符合协议规定。要保证这个问题不会出现，就需要使用`append`，具体操作为：将待添加的数值转换为`const char *`类型，将该地址重新解释为`char*`类型，指定长度为4字节，此时指针就会直接将整型的内存表示（4个字节的二进制数据）原样复制到字符串中，这样在后面获取时就会直接将该二进制表示转换为本机字节序对应的值。根据这个思路，实现如下：

```cpp
virtual std::string constructProtocol(const base_message::BaseMessage::ptr &msg) override
{
    // 对每一个字段序列化，需要注意网络字节序的转换，使用htonl
    std::string body_str;
    if (!msg->serialize(body_str))
    {
        LOG(Level::Error, "序列化失败");
        return "ErrorSerialize";
    }

    std::string id = msg->getReqRespId();
    auto mtype = htonl(static_cast<int32_t>(msg->getMtype()));
    int32_t id_len = htonl(id.size());
    int32_t h_total_len = sizeof(mtype) + sizeof(id_len) + id.size() + body_str.size();
    // 对总长度进行网络字节序转换
    int32_t n_total_len = htonl(h_total_len);

    std::string result;
    result.reserve(sizeof(n_total_len) + h_total_len); // 提前开辟空间，提高性能

    // 构建应用层协议
    result.append(reinterpret_cast<const char *>(&n_total_len), sizeof(n_total_len));
    result.append(reinterpret_cast<const char *>(&mtype), sizeof(mtype));
    result.append(reinterpret_cast<const char *>(&id_len), sizeof(id_len));
    result.append(id);
    result.append(body_str);

    return result;
}
```

最后考虑解析函数，本次设计的解析函数是**假设用户已经判断数据是可以被处理的，即`canProcessed`函数返回`true`**，基本思路为从缓冲区依次取出数据，并对正文进行反序列化，将对应的数据存储到消息类对象中。这里涉及到创建消息类对象，在创建消息时可以使用工厂的方式，即提供一个通用的方式创建对象。对于消息类对象来说，其子类非常多，而每一个子类对应着不同的消息类型，所以此处可以根据消息类型来决定创建的子类对象，为了可以保证多态，此处的函数返回值为父类指针类型，实现工厂如下：

```cpp
// 根据消息类型确定
static base_message::BaseMessage::ptr messageCreateFactory(public_data::MType mtype)
{
    switch (mtype)
    {
    case public_data::MType::Req_rpc:
        return std::make_shared<request_message::RpcRequest>();
    case public_data::MType::Req_topic:
        return std::make_shared<request_message::TopicRequest>();
    case public_data::MType::Req_service:
        return std::make_shared<request_message::ServiceRequest>();
    case public_data::MType::Resp_rpc:
        return std::make_shared<response_message::RpcResponse>();
    case public_data::MType::Resp_topic:
        return std::make_shared<response_message::TopicResponse>();
    case public_data::MType::Resp_service:
        return std::make_shared<response_message::ServiceResponse>();
    }
    return base_message::BaseMessage::ptr(); // 相当于返回nullptr，即shared_ptr<base_message::BaseMessage>();
}
```

当然，此处也可以考虑使用可变模板参数，根据指定的子类类型创建消息类对象：

```cpp
template<class T, class ...Args>
static std::shared_ptr<T> messageCreateFactory(Args&& ...args)
{
    return std::make_shared<T>(std::forward<Args>(args)...);
}
```

有了前面的思路，接下来实现解析函数：

```cpp
virtual bool getContentFromBuffer(const base_buffer::BaseBuffer::ptr &buf, base_message::BaseMessage::ptr &msg) override
{
    // 从缓冲区中获取每一个字段，默认已经判断数据可以处理
    // 即canProcessed返回true
    int32_t valid_length = buf->readInt32();
    int32_t mtype = buf->readInt32();
    int32_t id_length = buf->readInt32();
    std::string id = buf->retrieveAsString(id_length);
    // 正文部分，总长度-有效数据长度字段的长度-消息类型字段的长度-ID字段的长度-ID的长度
    std::string body = buf->retrieveAsString(valid_length - sizeof(mtype) - sizeof(id_length) - id.size());

    // 创建消息对象
    // 根据消息类型创建对象
    msg = message_factory::MessageFactory::messageCreateFactory(static_cast<public_data::MType>(mtype));
    if (!msg)
    {
        LOG(Level::Error, "根据消息类型创建消息对象指针失败，指针为空");
        return false;
    }

    // 对正文部分进行反序列化，将其中的JSON对象存储到成员body_中
    if (!msg->deserialize(body))
    {
        LOG(Level::Error, "正文部分反序列化失败");
        return false;
    }

    // 设置字段
    msg->setId(id);
    msg->setMType(static_cast<public_data::MType>(mtype));

    return true;
}
```

### Connection派生类设计

本次项目中实现的Connection派生类是基于Muduo库实现的，使用到的就是Muduo库中的`TcpConnection`，需要注意的是，在封装`send`接口时需要先将参数的消息类对象使用协议类中的构建函数构建出满足协议格式的数据再发送，所以在Connection派生类中除了有`TcpConnection`成员外，还需要有协议类成员。整体设计如下：

```cpp
class MuduoConnection : public base_connection::BaseConnection
{
public:
    using ptr = std::shared_ptr<MuduoConnection>;

    MuduoConnection(const base_protocol::BaseProtocol::ptr &pro, const muduo::net::TcpConnectionPtr &con)
        : pro_(pro), con_(con)
    {
    }

    // 发送
    virtual void send(const base_message::BaseMessage::ptr &msg) override
    {
        // 获取待发送的数据
        std::string content = pro_->constructProtocol(msg);
        // 调用TcpConnection的发送
        con_->send(content);
    }
    // 关闭连接
    virtual void shutdown() override 
    {
        con_->shutdown();
    }
    // 判断连接是否正常
    virtual bool connected() override
    {
        return con_->connected();
    }

private:
    base_protocol::BaseProtocol::ptr pro_; // 使用协议中的方法获取到待发送的数据
    muduo::net::TcpConnectionPtr con_;     // 使用Muduo库中的TcpConnection
};
```

### Client派生类设计

本次项目中实现的Client派生类是基于Muduo库实现的，所以在Client派生类中少不了需要使用到Muduo库中的`TcpClient`，而对于创建一个`TcpClient`需要用到其他相关的组件，此处不具体介绍，详细见[关于Muduo库](https://www.help-doc.top/other/muduo/muduo.html)，除了需要的组件外，还需要创建出协议类成员，在调用连接建立回调函数时需要创建连接对象和收到消息处理时的回调函数时需要对消息进行解析

除了回调函数以外，基本的设计思路参考[关于Muduo库](https://www.help-doc.top/other/muduo/muduo.html)设计客户端的思想，基本实现如下：

```cpp
class MuduoClient : public base_client::BaseClient
{
public:
    using ptr = std::shared_ptr<MuduoClient>;
    MuduoClient(const std::string &ip, uint16_t port)
        : loop_(loopThread_.startLoop()), client_(loop_, muduo::net::InetAddress(ip, port), "MuduoClient"),
            pro_(protocol_factory::ProtocolFactory::createProtocolFactory()),
            count_(1) // 确保客户端在连接建立成功后发送消息
    {
        // 设置回调函数
        // 1. 连接回调
        client_.setConnectionCallback(std::bind(&MuduoClient::connectionCallback, this, std::placeholders::_1));
        // 2. 消息回调
        client_.setMessageCallback(std::bind(&MuduoClient::messgaeCallback, this, std::placeholders::_1, std::placeholders::_2, std::placeholders::_3));
    }

    // 连接服务端
    virtual void connect() override
    {
        client_.connect();
        // 客户端开始在同步计数器等待，防止未连接时发送信息
        count_.wait();
    }

    // 关闭连接
    virtual void shutdown() override
    {
        // 调用TcpClient的断开接口
        client_.disconnect();
    }

    // 获取连接对象
    virtual base_connection::BaseConnection::ptr connection() override
    {
        return con_;
    }

    // 判断是否连接
    virtual bool connected() override
    {
        return con_ && con_->connected();
    }

private:
    // 连接回调函数
    void connectionCallback(const muduo::net::TcpConnectionPtr &con)
    {
        
    }

    // 收到消息时的回调
    void messgaeCallback(const muduo::net::TcpConnectionPtr &con, muduo::net::Buffer *buffer, muduo::Timestamp t)
    {
        
    }

private:
    muduo::net::EventLoopThread loopThread_;
    muduo::net::EventLoop *loop_;
    base_connection::BaseConnection::ptr con_;
    muduo::net::TcpClient client_;
    muduo::CountDownLatch count_;
    base_protocol::BaseProtocol::ptr pro_;
};
```

这里需要注意两个问题：

1. 管理`EventLoop`对象时不要使用智能指针，因为这个对象的销毁和创建并不是由当前类管理的，属于「借用」资源，而不是「拥有」资源，对于这种借用资源直接使用普通指针即可
2. **一定要保证`BaseConnection`指针声明在`TcpClient`对象之前，这样可以确保先析构`TcpClient`对象，再析构`BaseConnection`**，因为`TcpClient`对象析构时会调用连接断开的回调函数，该函数内部会访问连接对象，一旦这个连接对象先被析构了就是野指针访问了，如果`reset`函数内部不进行对解引用操作，那么就算空指针调用函数也不会因为有问题，但是`reset`内部会进行`*this`，而此时`this`为`nullptr`，所以如果`BaseConnection`指针声明在`TcpClient`对象之后就会出现野指针错误

下面重点介绍两个回调函数的设计：

1. 连接回调函数：当连接建立时，需要创建一个Connection派生类对象，这个对象依赖于两个成员：`Protocol`派生类成员和`TcpConnection`成员，当连接断开时需要释放Connection派生类对象
2. 消息处理回调函数：当客户端收到消息时，需要调用Protocol派生类的解析函数从Buffer派生类中获取到有效数据存储到消息类对象中，整个过程是一个死循环，直到缓冲区的数据不足以被处理为止，处理完消息后，就可以调用消息回调函数处理拿到的消息

为了更方便创建出对象并且在后续修改构造函数时不需要多个文件之间来回改变，根据上面的两个函数的设计思路可以设计出三个工厂：创建Protocol派生类成员工厂、创建出Connection派生类工厂以及创建出Buffer派生类工厂。三者创建方式基本一致，为了保证可以实现多态，此处函数的返回值应为派生类对应的基类而非固定的派生类，实现如下：

=== "Protocol派生类工厂"

    ```cpp
    class ProtocolFactory
    {
    public:
        template <class ...Args>
        static base_protocol::BaseProtocol::ptr createProtocolFactory(Args &&...args)
        {
            return std::make_shared<length_value_protocol::LengthValueProtocol>(std::forward<Args>(args)...);
        }
    };
    ```

=== "Connection派生类工厂"

    ```cpp
    class ConnectionFactory
    {
    public:
        template<class ...Args>
        static base_connection::BaseConnection::ptr createConnectionFactory(Args && ...args)
        {
            return std::make_shared<muduo_connection::MuduoConnection>(std::forward<Args>(args)...);
        }
    };
    ```

=== "Buffer派生类工厂"

    ```cpp
    // 缓冲区工厂
    class BufferFactory
    {
    public:
        template<class ...Args>
        static base_buffer::BaseBuffer::ptr bufferCreateFactory(Args&&... args)
        {
            return std::make_shared<muduo_buffer::MuduoBuffer>(std::forward<Args>(args)...);
        }
    };
    ```

有了上面的工厂和思路后，接下来设计连接回调和消息回调：

=== "连接回调"

    ```cpp
    void connectionCallback(const muduo::net::TcpConnectionPtr &con)
    {
        if (con->connected())
        {
            LOG(Level::Info, "客户端连接成功");
            // 设置连接对象指针，便于接下来调用send
            con_ = connection_factory::ConnectionFactory::createConnectionFactory(pro_, con);
            // 更改同步计数器，减到0表示成功连接，唤醒客户端，可以进行消息发送
            count_.countDown();
        }
        else if (con->disconnected())
        {
            con_.reset(); // 重置连接指针
            std::cout << "客户端断开连接" << std::endl;
        }
    }
    ```

=== "消息回调"


    ```cpp
    void messgaeCallback(const muduo::net::TcpConnectionPtr &con, muduo::net::Buffer *buffer, muduo::Timestamp t)
    {
        // 创建出BaseBuffer对象
        base_buffer::BaseBuffer::ptr b_buffer = buffer_factory::BufferFactory::bufferCreateFactory(buffer);

        // 判断缓冲区中的数据是否可以处理（数据不会过小，也不会过大）
        while (true)
        {
            if (!pro_->canProcessed(b_buffer))
            {
                // 无法处理时也有可能是数据过大
                if (b_buffer->readableSize() >= public_data::max_data_size)
                {
                    LOG(Level::Warning, "数据过大，无法处理");
                    break;
                }

                // 否则就是数据过小（无法满足LV协议格式的处理规则）
                break;
            }

            // 创建BaseMessage对象指针，交给BaseProtocol中的反序列化接口创建对象
            base_message::BaseMessage::ptr b_msg;
            if (!pro_->getContentFromBuffer(b_buffer, b_msg))
            {
                LOG(Level::Warning, "反序列化处理失败");
                break;
            }

            // 如果设置了回调函数就处理
            // 处理收到的消息
            if (cb_message_)
                cb_message_(con_, b_msg);
        }
    }
    ```

同样，为了便于创建客户端对象，提供对应的工厂：

```cpp
class ClientFactory
{
public:
    template <class... Args>
    static base_client::BaseClient::ptr clientCreateFactory(Args &&...args)
    {
        return std::make_shared<muduo_client::MuduoClient>(std::forward<Args>(args)...);
    }
};
```

### Server派生类设计

本次项目中实现的Server派生类是基于Muduo库实现的，所以在Server派生类中少不了需要使用到Muduo库中的`TcpServer`，而对于创建一个`TcpServer`需要用到其他相关的组件，此处不具体介绍，详细见[关于Muduo库](https://www.help-doc.top/%E5%85%B6%E5%AE%83/%E5%85%B3%E4%BA%8EMuduo%E5%BA%93/%E5%85%B3%E4%BA%8EMuduo%E5%BA%93.html)，除了需要的组件外，还需要创建出协议类成员，在调用连接建立回调函数时需要创建连接对象和收到消息处理时的回调函数时需要对消息进行解析

除了上面提到的内容，服务端与客户端还有一个不同之处，客户端只需要管理自己的连接，但是服务端需要管理多个客户端连接，所以此处还需要一张哈希表，用于建立TcpConnection类对象和BaseConnection派生类对象的联系

除了回调函数以外，基本的设计思路参考[关于Muduo库](https://www.help-doc.top/other/muduo/muduo.html)设计服务端思想，基本结构如下：

```cpp
class MuduoServer : public base_server::BaseServer
{
public:
    using ptr = std::shared_ptr<MuduoServer>;

    MuduoServer(uint16_t port)
        : server_(loop_.get(),
                    muduo::net::InetAddress("0.0.0.0", port),
                    "dict_server",
                    muduo::net::TcpServer::kReusePort),
            loop_(std::make_shared<muduo::net::EventLoop>()),
            pro_(protocol_factory::ProtocolFactory::createProtocolFactory())
    {
        // 设置回调
        // 1. 连接回调
        server_.setConnectionCallback([this](const muduo::net::TcpConnectionPtr &con)
                                        { this->connectionCallback(con); });
        // 2. 消息回调
        server_.setMessageCallback([this](const muduo::net::TcpConnectionPtr &con, muduo::net::Buffer *buffer, muduo::Timestamp t)
                                    { this->messageCallback(con, buffer, t); });
    }

    // 启动服务器
    virtual void start() override
    {
        server_.start();
        loop_->loop();
    }

private:
    // 连接回调函数，用于管理TcpConnection和BaseConnection
    // 连接建立成功，则创建BaseConnection对象并将对应地{TcpConnection, BaseConnection}插入到哈希表中，再根据是否设置连接回调函数选择是否执行该函数
    // 连接断开时，需要将BaseConnection对象从哈希表中移除，并根据是否设置连接关闭回调函数选择是否执行该函数
    void connectionCallback(const muduo::net::TcpConnectionPtr &con)
    {
        
    }

    // 客户端发送消息时的处理
    void messageCallback(const muduo::net::TcpConnectionPtr &con, muduo::net::Buffer *buffer, muduo::Timestamp t)
    {
        
    }

private:
    std::shared_ptr<muduo::net::EventLoop> loop_; // 事件模型，先初始化
    muduo::net::TcpServer server_;                // 服务器
    std::unordered_map<muduo::net::TcpConnectionPtr, base_connection::BaseConnection::ptr> tcp_cons_; // Muduo链接和封装连接进行映射，用于管理连接结构
    std::mutex manage_map_mtx_; // 管理哈希表保证线程安全
    base_protocol::BaseProtocol::ptr pro_; // 创建MuduoConnection时需要
};
```

接着，考虑回调函数的设计，对于服务端来说，一旦检测到客户端成功建立连接，就需要创建对应的Connection派生类对象并将其添加到哈希表中，如果设置了连接成功处理回调就调用该函数处理，而连接断开时，就需要将该连接从哈希表中移除，如果设置了断开连接处理回调函数就调用该函数处理，而消息处理回调与客户端基本一致，额外需要注意的是，在调用消息处理回调时，需要从哈希表中获取到Connection派生类对象，如果此时没有获取到，说明不存在该连接或者连接异常，此时需要断开连接以免后续出现其他问题。根据这个思路，两个回调函数设计如下：

=== "连接处理回调"

    ```cpp
    void connectionCallback(const muduo::net::TcpConnectionPtr &con)
    {
        if (con->connected())
        {
            // 创建BaseConnection对象
            base_connection::BaseConnection::ptr b_con = connection_factory::ConnectionFactory::createConnectionFactory(pro_, con);
            {
                // 插入到哈希表
                std::unique_lock<std::mutex> lock(manage_map_mtx_);
                tcp_cons_.insert({con, b_con});
            }

            // 如果设置了回调就调用
            // 处理连接
            if(cb_connection_) 
                cb_connection_(b_con);
        }
        else if (con->disconnected())
        {
            // 查找是否存在对应的BaseConnection对象
            base_connection::BaseConnection::ptr b_con;
            {
                auto pos = tcp_cons_.find(con);
                if(pos == tcp_cons_.end())
                {
                    LOG(Level::Warning, "不存在指定的连接");
                    con->shutdown();
                    return ;
                }
                // 找到了就获取
                b_con = pos->second;
                // 移除键值对
                tcp_cons_.erase(con);
            }

            // 如果设置了回调就调用
            // 关闭BaseConnection
            if(cb_close_)
                cb_close_(b_con);
        }
    }
    ```

=== "消息处理回调"

    ```cpp
    void messageCallback(const muduo::net::TcpConnectionPtr &con, muduo::net::Buffer *buffer, muduo::Timestamp t)
    {
        // 创建出BaseBuffer对象
        base_buffer::BaseBuffer::ptr b_buffer = buffer_factory::BufferFactory::bufferCreateFactory(buffer);

        // 判断缓冲区中的数据是否可以处理（数据不会过小，也不会过大）
        while(true)
        {
            if (!pro_->canProcessed(b_buffer))
            {
                // 无法处理时也有可能是数据过大
                if (b_buffer->readableSize() >= public_data::max_data_size)
                {
                    LOG(Level::Warning, "数据过大，无法处理");
                    break;
                }

                // 否则就是数据过小（无法满足LV协议格式的处理规则）
                break;
            }

            // 创建BaseMessage对象指针，交给BaseProtocol中的反序列化接口创建对象
            base_message::BaseMessage::ptr b_msg;
            if(!pro_->getContentFromBuffer(b_buffer, b_msg))
            {
                LOG(Level::Warning, "反序列化处理失败");
                break;
            }

            // 如果设置了回调函数就处理
            // 处理收到的消息
            base_connection::BaseConnection::ptr b_con;
            {
                std::unique_lock<std::mutex> lock(manage_map_mtx_);
                auto pos = tcp_cons_.find(con);
                // 不存在连接时直接断开，防止之后的处理也出现异常
                if(pos == tcp_cons_.end())
                {
                    LOG(Level::Warning, "不存在指定的连接");
                    con->shutdown();
                    break;
                }

                b_con = pos->second;
            }

            if(cb_message_)
                cb_message_(b_con, b_msg);
        }

    }
    ```

同样，为了便于创建服务端对象，提供对应的工厂：

```cpp
class ServerFactory
{
public:
    template <class... Args>
    static base_server::BaseServer::ptr serverCreateFactory(Args &&...args)
    {
        return std::make_shared<muduo_server::MuduoServer>(std::forward<Args>(args)...);
    }
};
```

## 消息分发模块设计

### 基础版本

消息分发模块的基本思路很简单，只需要根据具体的类型调用对应的回调函数，所以在消息分发模块中需要提供注册回调的函数和执行回调的函数。在注册回调的函数中，需要让上层传递注册类型以及回调函数，而执行回调的函数是将来注册到客户端以及服务端中，用于消息到来时执行的函数，即前面设计客户端和服务端时提到的收到消息时的回调函数`messageCallback`，具体的逻辑就是从消息类中获取当前消息对应的类型，找到对应的回调函数进行执行即可

从上面的思路来看，在消息分发模块中需要有一张消息类型和消息处理回调函数的映射表，而所谓的注册就是将消息类型和对应的消息处理回调映射关系，而所谓的执行回调，就是根据消息类型取出回调函数传递参数并执行。需要注意的是，在执行回调中如果没有找到指定消息类型对应的回调函数，那么说明这种消息类型存在问题，此时为了防止后续出现问题，依旧直接断开客户端的连接

所以，整个类的基本设计如下：

```cpp
class Dispatcher
{
public:
    using ptr = std::shared_ptr<Dispatcher>;

    // 注册服务
    void registerService(const public_data::MType& m, const public_data::messageCallback_t& cb)
    {  
        std::unique_lock<std::mutex> lock(mtx_);
        auto pos = type_calls.find(m);
        if(pos != type_calls.end())
        {
            LOG(Level::Warning, "已经存在指定的消息类型，插入失败");
            return;
        }
        type_calls.insert({m, cb});
    }

    // 根据操作类型执行回调
    void executeService(const base_connection::BaseConnection::ptr &con, base_message::BaseMessage::ptr & msg)
    {
        std::unique_lock<std::mutex> lock(mtx_);
        auto pos = type_calls.find(msg->getMtype());
        if (pos == type_calls.end())
        {
            LOG(Level::Warning, "不存在指定的消息类型，分发失败");
            con->shutdown();
            return;
        }

        (pos->second)(con, msg);
    }

private:
    std::unordered_map<public_data::MType, public_data::messageCallback_t> type_calls; // 消息类型和回调函数的映射
    std::mutex mtx_;                                                                   // 管理哈希表的互斥锁
};
```

### 优化版本（回调函数的第二个参数支持Message类派生类对象）

虽然上面的实现已经可以满足需要的功能，但是此时对于上层来说，可以设置的回调类型必须是`messageCallback_t`，而且必须是完全一样的类型，不允许出现父类指针接受子类对象指针的情况，这就对上层使用造成了一种使用上的困扰，如下：

```cpp
void func(const base_connection::BaseConnection::ptr &con, base_message::BaseMessage::ptr &msg)
{
    // 可以直接调用BaseMessage中的函数
    std::string req_id = msg->getReqRespId();
    // 但是如果要调用其子类的函数，例如
    // std::string method = msg->getMethod();
    // 就会出现无法访问到getMethod
    // 对应的处理方式就是动态转换父类对象指针为子类对象指针
    std::shared_ptr<request_message::RpcRequest> rpc_req = std::dynamic_pointer_cast<request_message::RpcRequest>(msg);
    // 此时才可以调用getMethod
    std::string method = rpc_req->getMethod();
}
```

最直接解决这个问题的想法就是将`registerService`设置为模板函数，如下：

```cpp
template <class T>
void registerService(const public_data::MType &m, const T &cb)
{
    std::unique_lock<std::mutex> lock(mtx_);
    auto pos = type_calls.find(m);
    if (pos != type_calls.end())
    {
        LOG(Level::Warning, "已经存在指定的消息类型，插入失败");
        return;
    }

    type_calls.insert({m, T});
}
```

但是这种写法会产生一个问题，那就是消息类型和回调映射的容器无法接收不同类型，既然无法接收不同的类型，那么就考虑创建出一个具体的类型，这个类型内部就保存任意类型的回调函数以及提供一个执行函数，函数内部对Message基类指针转换为子类指针再传递给任意类型的回调函数执行上层设计的逻辑（也就是回到可以满足基础功能的`Dispatcher`类中，上层调用`executeService`时根据消息类型获取到回调函数传递参数并执行的函数逻辑），但是为了这一点，该类依旧需要使用模板，这就造成了这个类是个模板类，对于容器来说依旧是不同类型：

```cpp
template <class T>
class Callback
{
public:
    Callback(cconst T& handler)
        : handler_(handler)
    {
    }
    void excuteService(const BaseConnection::ptr &conn, const base_message::BaseMessage::ptr &msg)
    {
        auto type_msg = std::dynamic_pointer_cast<T>(msg);
        handler_(conn, type_msg);
    }
private:
    T handler_;
};
```

即在`registerService`变为如下方式：

```cpp
template <class T>
void registerService(const public_data::MType &m, const T &cb)
{
    std::unique_lock<std::mutex> lock(mtx_);
    auto pos = type_calls.find(m);
    if (pos != type_calls.end())
    {
        LOG(Level::Warning, "已经存在指定的消息类型，插入失败");
        return;
    }

    std::shared_ptr<Callback<T>> type_msg = std::make_shared<Callback<T>>(cb);

    type_calls.insert({m, type_msg});
}
```

但是此时对应的容器就需要修改为：

```cpp
std::unordered_map<public_data::MType, Callback<T>> type_calls;
```

修改后会发现依旧不被允许。但是此时解决方式会变得比较容易，因为既然是不同类类型，那可以考虑使用**多态**，让容器存储父类即可，在这个父类中不保存任何内容，只需要有对应的执行回调的纯虚函数即可：

```cpp
class BaseCallback
{
public:
    using ptr = std::shared_ptr<BaseCallback>;
    virtual void excuteService(const base_connection::BaseConnection::ptr &conn, base_message::BaseMessage::ptr &msg) = 0;
};
```

再让`Callback`类继承`BaseCallback`即可，内部逻辑不变：

```cpp
template <class T>
class Callback : public BaseCallback
{
public:
    // ...

private:
    T handler_;
};
```

对应的`registerService`就修改为：

```cpp
template <class T>
void registerService(const public_data::MType &m, const T &cb)
{
    // ...

    std::shared_ptr<BaseCallback> type_msg = std::make_shared<Callback<T>>(cb);

    type_calls.insert({m, type_msg});
}
```

但是现在还存在一个问题，这个模板类型`T`代表的是回调函数类型，而不是具体的类类型，上层在使用这个函数还需要创建一个回调函数类型，这个过程依旧比较繁琐，甚至不亚于最开始的转换过程，那么此时就需要修改`Callback`类中关于`T`的定义，当前`T`表示任意回调函数类型，而实际上本次修改的目的是为了让上层可以直接使用具体Message派生类类型作为回调函数第二个参数的类型，所以只需要写死回调函数的类型，让`T`表示第二个参数中智能指针的类型即可，即提供一个回调函数类型`callback_t`，并修改回调函数成员的类型为`callback_t`：

```cpp
template <class T>
class Callback : public BaseCallback
{
public:
    using ptr = std::shared_ptr<Callback>;
    using callback_t = std::function<void(const base_connection::BaseConnection::ptr &, std::shared_ptr<T> &)>;
    Callback(callback_t handler)
        : handler_(handler)
    {
    }
    // ...

private:
    callback_t handler_;
};
```

此时因为`T`不再表示回调函数类型，对于`registerService`中`T`的定义也需要修改，此时修改`registerService`函数的第二个参数为：

```cpp
template <class T>
void registerService(const public_data::MType &m, const Callback<T>::callback_t &cb)
```

这样，`T`就表示为类类型，而不再是回调函数类型。但是，此时会出现一个报错：

```
use the 'typename' keyword to treat nontype "dispatcher_rpc_framework::Callback<T>::callback_t [with T=T]" as a type in a dependent context
```

这个报错表示编译器无法确定`callback_t`是一个类型，为了解决这个问题，需要使用到`typename`关键字修饰，如下：

```cpp
template <class T>
void registerService(const public_data::MType &m, const typename Callback<T>::callback_t &cb)
```

此时就可以实现上面的功能，使用方式变为：

```cpp
void func(const base_connection::BaseConnection::ptr &con, const request_message::RpcRequest::ptr &msg)
{
    std::string method = msg->getMethod();
}

dispatcher_->registerService<request_message::RpcRequest>(public_data::MType::Req_rpc, std::bind(&func, std::placeholders::_1, std::placeholders::_2));
```

至此，消息分发模块设计完毕