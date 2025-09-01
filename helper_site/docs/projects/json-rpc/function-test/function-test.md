<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# 功能测试

## RPC基础功能测试

首先创建服务端程序，在服务端中，通过服务描述建造者创建服务描述对象通过`RpcRouter`类的`registerService`注册该服务，接着将`RpcRouter`的处理请求的接口以及对应的消息类型通过`Dispatcher`的`registerService`进行映射注册，最后启动服务器。本次以下面的服务为例：

```cpp
void add(const Json::Value &params, Json::Value &result)
{
    int num1 = params["num1"].asInt();
    int num2 = params["num2"].asInt();

    result = num1 + num2;
}
```

服务端测试代码如下：

```cpp
int main()
{
    // 使用服务描述工厂创建服务
    std::unique_ptr<rpc_server::rpc_router::ServiceDescFactory> desc_factory = std::make_unique<rpc_server::rpc_router::ServiceDescFactory>();

    // 设置服务名称
    desc_factory->setMethodName("add");
    // 设置参数类型
    desc_factory->setParams("num1", rpc_server::rpc_router::params_type::Integral);
    desc_factory->setParams("num2", rpc_server::rpc_router::params_type::Integral);
    // 设置返回值类型
    desc_factory->setReturnType(rpc_server::rpc_router::params_type::Integral);

    // 设置回调函数——表示具体执行的服务
    desc_factory->setHandler(add);

    // 创建RpcRouter对象
    auto router = std::make_shared<rpc_server::rpc_router::RpcRouter>();
    // 注册可以提供的服务
    router->registerService(desc_factory->buildServiceDesc());

    // 将router中的处理请求的函数注册到Dispatcher中
    auto dispatcher = std::make_shared<dispatcher_rpc_framework::Dispatcher>();
    dispatcher->registerService<request_message::RpcRequest>(public_data::MType::Req_rpc, std::bind(&rpc_server::rpc_router::RpcRouter::handleRpcRequest, router.get(), std::placeholders::_1, std::placeholders::_2));

    // 创建服务器并启动
    auto server = server_factory::ServerFactory::serverCreateFactory(8080);
    server->setMessageCallback(std::bind(&dispatcher_rpc_framework::Dispatcher::executeService, dispatcher.get(), std::placeholders::_1, std::placeholders::_2));
    server->start();

    return 0;
}
```

接下来创建客户端程序，对于客户端来说，就是针对服务端提供的服务进行三种方式发送请求，代码如下：

```cpp
void handlerResult(const Json::Value& result)
{
    LOG(Level::Info, "计算结果为：{}", result.asInt());
}

int main()
{
    // 创建Requestor和RpcCaller对象
    auto requestor = std::make_shared<rpc_client::requestor_rpc_framework::Requestor>();
    auto rpc_caller = std::make_shared<rpc_client::rpc_caller::RpcCaller>(requestor);

    // 创建Dispatcher
    auto dispatcher = std::make_shared<dispatcher_rpc_framework::Dispatcher>();
    dispatcher->registerService<base_message::BaseMessage>(public_data::MType::Resp_rpc, std::bind(&rpc_client::requestor_rpc_framework::Requestor::handleResponse, requestor.get(), std::placeholders::_1, std::placeholders::_2));

    // 创建并启动客户端
    auto client = client_factory::ClientFactory::clientCreateFactory("127.0.0.1", 8080);
    client->setMessageCallback(std::bind(&dispatcher_rpc_framework::Dispatcher::executeService, dispatcher.get(), std::placeholders::_1, std::placeholders::_2));
    client->connect();

    // 组织数据
    auto con = client->connection();

    // 同步处理
    std::string method = "add";
    Json::Value params;
    params["num1"] = 20;
    params["num2"] = 30;
    Json::Value result1;
    bool ret = rpc_caller->call(con, method, params, result1);
    if(!ret)
    {
        LOG(Level::Error, "客户端RpcCaller调用错误");
        return 1;
    }

    LOG(Level::Info, "计算结果为：{}", result1.asInt());

    // 异步处理
    params["num1"] = 50;
    params["num2"] = 60;
    Json::Value result2;
    rpc_client::rpc_caller::RpcCaller::aysnc_response resp;
    ret = rpc_caller->call(con, method, params, resp);
    if (!ret)
    {
        LOG(Level::Error, "客户端RpcCaller调用错误");
        return 1;
    }
    result2 = resp.get();
    LOG(Level::Info, "计算结果为：{}", result2.asInt());

    // 回调处理
    params["num1"] = 70;
    params["num2"] = 90;

    ret = rpc_caller->call(con, method, params, handlerResult);
    if (!ret)
    {
        LOG(Level::Error, "客户端RpcCaller调用错误");
        return 1;
    }

    std::this_thread::sleep_for(std::chrono::seconds(5));

    client->shutdown();

    return 0;
}
```

编译运行上面的代码可以发现服务端可以正常处理客户端的请求

## 结合注册中心的RPC功能测试

接下来测试结合注册中心的RPC功能，主要分为三个测试文件：

1. 注册中心测试代码：具体逻辑为创建注册中心并启动
2. RPC服务服务端测试代码：具体逻辑为创建RPC服务并向注册中心注册，再提供服务
3. 客户端测试代码：具体逻辑为创建客户端并连接注册中心，再从注册中心获取到服务提供者，最后进行三种发送形式的RPC调用

=== "注册中心测试代码"

    ```cpp
    int main()
    {  
        rpc_server::main_server::RegistryServer reg_server(9090);
        reg_server.start();

        return 0;
    }
    ```

=== "RPC服务服务端测试代码"

    ```cpp
    void add(const Json::Value &params, Json::Value &result)
    {
        int num1 = params["num1"].asInt();
        int num2 = params["num2"].asInt();

        result = num1 + num2;
    }

    int main()
    {
        // 使用服务描述工厂创建服务
        std::unique_ptr<rpc_server::rpc_router::ServiceDescFactory> desc_factory = std::make_unique<rpc_server::rpc_router::ServiceDescFactory>();

        // 设置服务名称
        desc_factory->setMethodName("add");
        // 设置参数类型
        desc_factory->setParams("num1", rpc_server::rpc_router::params_type::Integral);
        desc_factory->setParams("num2", rpc_server::rpc_router::params_type::Integral);
        // 设置返回值类型
        desc_factory->setReturnType(rpc_server::rpc_router::params_type::Integral);

        // 设置回调函数——表示具体执行的服务
        desc_factory->setHandler(add);

        // 让服务提供者先向注册中心注册，再提供服务
        rpc_server::main_server::RpcServer server(public_data::host_addr_t("127.0.0.1", 8080), true, public_data::host_addr_t("127.0.0.1", 9090));
        server.registryService(desc_factory->buildServiceDesc());

        server.start();

        return 0;
    }
    ```

=== "客户端测试代码"

    ```cpp
    void handlerResult(const Json::Value &result)
    {
        LOG(Level::Info, "计算结果为：{}", result.asInt());
    }

    int main()
    {
        // 让客户端连接注册中心，再从注册中心获取到服务提供者
        rpc_client::main_client::RpcClient client(true, "127.0.0.1", 9090);

        // 同步处理
        std::string method = "add";
        Json::Value params;
        params["num1"] = 20;
        params["num2"] = 30;
        Json::Value result1;
        bool ret = client.call(method, params, result1);
        if (!ret)
        {
            LOG(Level::Error, "客户端RpcCaller调用错误");
            return 1;
        }

        LOG(Level::Info, "计算结果为：{}", result1.asInt());

        // 异步处理
        params["num1"] = 50;
        params["num2"] = 60;
        Json::Value result2;
        rpc_client::rpc_caller::RpcCaller::aysnc_response resp;
        ret = client.call(method, params, resp);
        if (!ret)
        {
            LOG(Level::Error, "客户端RpcCaller调用错误");
            return 1;
        }
        result2 = resp.get();
        LOG(Level::Info, "计算结果为：{}", result2.asInt());

        // 回调处理
        params["num1"] = 70;
        params["num2"] = 90;

        ret = client.call(method, params, handlerResult);
        if (!ret)
        {
            LOG(Level::Error, "客户端RpcCaller调用错误");
            return 1;
        }

        std::this_thread::sleep_for(std::chrono::seconds(5));

        return 0;
    }
    ```

## 主题功能测试

主题功能一共三个测试文件：

1. 主题服务器测试代码：具体逻辑为创建主题服务器并启动
2. 主题发布客户端测试代码：具体逻辑为创建指定主题后发布消息
3. 主题订阅客户端测试代码：具体逻辑为创建指定主题后订阅主题，执行消息的处理回调

!!! note

    主题订阅客户端之所以也要创建主题，是因为主题订阅客户端并不知道指定的主题是否存在，如果直接订阅会出现订阅失败的问题，所以首先需要先创建主题，去报主题存在，而一旦有消息发布也不会影响，因为同一个主题只会创建一次

=== "主题服务器测试代码"

    ```cpp
    int main()
    {
        auto server = std::make_shared<rpc_server::main_server::TopicServer>(8080);
        server->start();

        return 0;
    }
    ```

=== "主题发布客户端测试代码"

    ```cpp
    int main()
    {
        auto client = std::make_shared<rpc_client::main_client::TopicClient>("127.0.0.1", 8080);
        // 创建主题
        bool ret = client->createTopic("new topic");
        if(!ret)
        {
            LOG(Level::Warning, "创建主题失败");
            return 1;
        }

        // 发布消息：10条消息
        for(int i = 0; i < 10; i++)
        {
            std::string msg = "new topic：" + std::to_string(i);
            client->publishTopicMessage("new topic", msg);
        }

        return 0;
    }
    ```

=== "主题订阅客户端测试代码"

    ```cpp
    void topicCallback(const std::string &topic_name, const std::string &msg)
    {
        LOG(Level::Info, "主题消息：{}", msg);
    }

    int main()
    {
        auto client = std::make_shared<rpc_client::main_client::TopicClient>("127.0.0.1", 8080);
        // 创建主题
        bool ret = client->createTopic("new topic");
        if (!ret)
        {
            LOG(Level::Warning, "创建主题失败");
            return 1;
        }

        // 处理主题消息
        client->subscribeTopic("new topic", topicCallback);
        

        std::this_thread::sleep_for(std::chrono::seconds(10));

        return 0;
    }
    ```