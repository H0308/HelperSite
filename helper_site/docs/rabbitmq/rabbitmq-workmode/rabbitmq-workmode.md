<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />
<script defer src="https://help-site.oss-cn-hangzhou.aliyuncs.com/js/mermaid.min.js"></script>

# RabbitMQ工作模式介绍

## 基本概览

在RabbitMQ中提供了7种工作模式，分别为：

1. 简单模式
2. 工作队列模式（work queues）
3. 发布/订阅模式（publish/subscribe）
4. 路由模式（routing）
5. 通配符模式（topics）
6. RPC（RPC通信）
7. 生产者消息确认模式（publisher confirms）

下面针对这7种工作模式进行介绍

## 简单模式

简单模式工作图如下：

```mermaid
flowchart LR
    P((P<br/>生产者)) -->|发送消息| Q[Queue<br/>队列]
    Q -->|消费消息| C((C<br/>消费者))
    
    style P fill:#87CEEB,stroke:#333
    style C fill:#90EE90,stroke:#333
    style Q fill:#F0E68C,stroke:#333,stroke-width:2px
```

简单模式就是“点对点”的一种形式，即一个消费者对应一个生产者。参考代码见[基础代码演示](https://www.help-doc.top/rabbitmq/rabbitmq-intro/rabbitmq-intro.html#_1)

## 工作队列模式

工作队列模式工作图如下：

```mermaid
flowchart LR
    P((P<br/>生产者)) -->|发送消息| Q[Queue<br/>队列]
    Q -->|消息1| C1((C₁<br/>消费者1))
    Q -.->|消息2| C2((C₂<br/>消费者2))
    
    style P fill:#87CEEB,stroke:#333
    style C1 fill:#90EE90,stroke:#333
    style C2 fill:#90EE90,stroke:#333
    style Q fill:#F0E68C,stroke:#333,stroke-width:2px
```

工作队列模式最大的特点就是一个生产者对应多个消费者，多个消费者同时从队列中获取消息，不会出现消息重复消费，例如有10条数据，两个消费者，那么两个消费者最后消费的消息总数为10条。参考代码如下：

=== "生产者"

    ```java
    public class Producer {
        public static void main(String[] args) throws IOException, TimeoutException {
            // 创建连接对象工厂
            ConnectionFactory connectionFactory = new ConnectionFactory();
            // 设置属性
            connectionFactory.setHost("127.0.0.1");
            connectionFactory.setPort(5672);
            connectionFactory.setUsername("admin");
            connectionFactory.setPassword("admin");
            connectionFactory.setVirtualHost("study");
            // 拿到连接对象
            Connection connection = connectionFactory.newConnection();
            // 获取信道
            Channel channel = connection.createChannel();
            // 设置交换机，使用内置交换机，无需手动设置
            // 设置队列
            channel.queueDeclare("work-queue", true, false, false, null);
            // 发送10条消息
            for (var i = 0; i < 10; i++) {
                String message = "rabbitmq intro-" + i;
                channel.basicPublish("", "work-queue", null, message.getBytes());
            }
            // 释放资源，先关闭信道，再关闭连接
            channel.close();
            connection.close();
        }
    }
    ```

=== "消费者1"

    ```java
    public class Consumer1 {
        public static void main(String[] args) throws IOException, TimeoutException {
            // 创建连接对象工厂
            ConnectionFactory connectionFactory = new ConnectionFactory();
            // 设置属性
            connectionFactory.setHost("127.0.0.1");
            connectionFactory.setPort(5672);
            connectionFactory.setUsername("admin");
            connectionFactory.setPassword("admin");
            connectionFactory.setVirtualHost("study");
            // 拿到连接对象
            Connection connection = connectionFactory.newConnection();
            // 获取信道
            Channel channel = connection.createChannel();
            // 声明队列（为了防止消费者启动时队列不存在而报错，消费者建议声明队列）
            channel.queueDeclare("work-queue", true, false, false, null);
            // 消费消息
            DefaultConsumer defaultConsumer = new DefaultConsumer(channel) {
                @Override
                public void handleDelivery(String consumerTag,
                                        Envelope envelope,
                                        AMQP.BasicProperties properties,
                                        byte[] body) throws IOException {
                    System.out.println("消费消息：" + new String(body));
                }
            };

            channel.basicConsume("work-queue", true, defaultConsumer);
            // 硬编码以确保收到消息
            // Thread.sleep(2000);
            // 释放资源，先关闭信道，再关闭连接
            // 为了演示效果，此处不关闭资源
            // channel.close();
            // connection.close();
        }
    }
    ```

=== "消费者2"

    ```java
    public class Consumer2 {
        public static void main(String[] args) throws IOException, TimeoutException {
            // 创建连接对象工厂
            ConnectionFactory connectionFactory = new ConnectionFactory();
            // 设置属性
            connectionFactory.setHost("127.0.0.1");
            connectionFactory.setPort(5672);
            connectionFactory.setUsername("admin");
            connectionFactory.setPassword("admin");
            connectionFactory.setVirtualHost("study");
            // 拿到连接对象
            Connection connection = connectionFactory.newConnection();
            // 获取信道
            Channel channel = connection.createChannel();
            // 声明队列（为了防止消费者启动时队列不存在而报错，消费者建议声明队列）
            channel.queueDeclare("work-queue", true, false, false, null);
            // 消费消息
            DefaultConsumer defaultConsumer = new DefaultConsumer(channel) {
                @Override
                public void handleDelivery(String consumerTag,
                                        Envelope envelope,
                                        AMQP.BasicProperties properties,
                                        byte[] body) throws IOException {
                    System.out.println("消费消息：" + new String(body));
                }
            };

            channel.basicConsume("work-queue", true, defaultConsumer);
            // 硬编码以确保收到消息
            // Thread.sleep(2000);
            // 释放资源，先关闭信道，再关闭连接
            // 为了演示效果，此处不关闭资源
            // channel.close();
            // connection.close();
        }
    }
    ```

为了看到效果，先启动两个消费者，再启动生产者，就可以看到两个消费者分别消费了一定数量的消息

## 发布/订阅模式

发布/订阅模式工作图如下：

```mermaid
flowchart LR
    P((P<br/>生产者)) -->|发布消息| X{{X<br/>交换机<br/>Fanout}}
    X -->|广播| Q1[Queue₁<br/>队列1]
    X -->|广播| Q2[Queue₂<br/>队列2]
    Q1 --> C1((C₁<br/>消费者1))
    Q2 --> C2((C₂<br/>消费者2))
    
    style P fill:#87CEEB,stroke:#333
    style X fill:#DDA0DD,stroke:#333,stroke-width:2px
    style Q1 fill:#F0E68C,stroke:#333
    style Q2 fill:#F0E68C,stroke:#333
    style C1 fill:#90EE90,stroke:#333
    style C2 fill:#90EE90,stroke:#333
```

在发布/订阅模式中，只要指定的队列“订阅了”对应的交换机，那么发布的消息就会走到对应的队列中，由该队列的消费者进行消费

与工作队列模式不同的是，发布/订阅模式中生产者发布了多少消息，每一个队列的消费者就会接收到相同数量的消息，相当于每条消息都拷贝给所有的消费者，即消息会重复

参考代码如下：

=== "生产者"

    ```java
    public class Producer {
        public static void main(String[] args) throws IOException, TimeoutException {
            // 创建连接对象工厂
            ConnectionFactory connectionFactory = new ConnectionFactory();
            // 设置属性
            connectionFactory.setHost("127.0.0.1");
            connectionFactory.setPort(5672);
            connectionFactory.setUsername("admin");
            connectionFactory.setPassword("admin");
            connectionFactory.setVirtualHost("study");
            // 拿到连接对象
            Connection connection = connectionFactory.newConnection();
            // 获取信道
            Channel channel = connection.createChannel();
            // 声明交换机为Fanout
            // 参数分别为交换机名称、交换机类型和是否持久化
            channel.exchangeDeclare("fanout-exchange", BuiltinExchangeType.FANOUT, true);
            // 声明队列
            channel.queueDeclare("fanout-queue1", true, false, false, null);
            channel.queueDeclare("fanout-queue2", true, false, false, null);
            // 绑定队列和交换机
            channel.queueBind("fanout-queue1", "fanout-exchange", "");
            channel.queueBind("fanout-queue2", "fanout-exchange", "");
            // 发送消息
            String msg = "hello fanout";
            channel.basicPublish("fanout-exchange", "", null, msg.getBytes());
            // 关闭资源
            channel.close();
            connection.close();
        }
    }
    ```

=== "消费者1"

    ```java
    public class Consumer1 {
        public static void main(String[] args) throws IOException, TimeoutException, InterruptedException {
            // 创建连接对象工厂
            ConnectionFactory connectionFactory = new ConnectionFactory();
            // 设置属性
            connectionFactory.setHost("127.0.0.1");
            connectionFactory.setPort(5672);
            connectionFactory.setUsername("admin");
            connectionFactory.setPassword("admin");
            connectionFactory.setVirtualHost("study");
            // 拿到连接对象
            Connection connection = connectionFactory.newConnection();
            // 获取信道
            Channel channel = connection.createChannel();
            // 声明队列
            channel.queueDeclare("fanout-queue1", true, false, false, null);
            // 消费消息
            DefaultConsumer defaultConsumer = new DefaultConsumer(channel) {
                // 重写DefaultConsumer中的handleDelivery方法
                // 参数分别是消费者标签、消息的封包信息、配置信息、消息
                @Override
                public void handleDelivery(String consumerTag,
                                        Envelope envelope,
                                        AMQP.BasicProperties properties,
                                        byte[] body) throws IOException {
                    System.out.println("消费消息：" + new String(body));
                }
            };
            // 参数分别是队列名称、是否自动确认消息接收、消息回调函数
            channel.basicConsume("fanout-queue1", true, defaultConsumer);
            // 硬编码以确保收到消息
            Thread.sleep(2000);
            // 释放资源，先关闭信道，再关闭连接
            channel.close();
            connection.close();
        }
    }
    ```

=== "消费者2"

    ```java
    public class Consumer2 {
        public static void main(String[] args) throws IOException, TimeoutException, InterruptedException {
            // 创建连接对象工厂
            ConnectionFactory connectionFactory = new ConnectionFactory();
            // 设置属性
            connectionFactory.setHost("127.0.0.1");
            connectionFactory.setPort(5672);
            connectionFactory.setUsername("admin");
            connectionFactory.setPassword("admin");
            connectionFactory.setVirtualHost("study");
            // 拿到连接对象
            Connection connection = connectionFactory.newConnection();
            // 获取信道
            Channel channel = connection.createChannel();
            // 声明队列
            channel.queueDeclare("fanout-queue2", true, false, false, null);
            // 消费消息
            DefaultConsumer defaultConsumer = new DefaultConsumer(channel) {
                // 重写DefaultConsumer中的handleDelivery方法
                // 参数分别是消费者标签、消息的封包信息、配置信息、消息
                @Override
                public void handleDelivery(String consumerTag,
                                        Envelope envelope,
                                        AMQP.BasicProperties properties,
                                        byte[] body) throws IOException {
                    System.out.println("消费消息：" + new String(body));
                }
            };
            // 参数分别是队列名称、是否自动确认消息接收、消息回调函数
            channel.basicConsume("fanout-queue2", true, defaultConsumer);
            // 硬编码以确保收到消息
            Thread.sleep(2000);
            // 释放资源，先关闭信道，再关闭连接
            channel.close();
            connection.close();
        }
    }
    ```

## 路由模式

路由模式工作图如下：

```mermaid
flowchart LR
    P((P<br/>生产者)) -->|routingKey=error| X{{X<br/>直连交换机<br/>Direct}}
    X -->|匹配error| Q1[Queue₁<br/>错误日志]
    X -.->|不匹配| Q2[Queue₂<br/>信息日志]
    Q1 --> C1((C₁<br/>消费者1))
    Q2 --> C2((C₂<br/>消费者2))
    
    style P fill:#87CEEB,stroke:#333
    style X fill:#DDA0DD,stroke:#333,stroke-width:2px
    style Q1 fill:#F0E68C,stroke:#333
    style Q2 fill:#F0E68C,stroke:#333,stroke-dasharray: 5 5
    style C1 fill:#90EE90,stroke:#333
    style C2 fill:#90EE90,stroke:#333,stroke-dasharray: 5 5
```

路由模式就是由交换机根据Routing Key和Binding Key的比对判断应该走哪个队列，这个比对必须是完全匹配，而不是模糊匹配。参考代码：

=== "生产者"

    ```java
    public class Producer {
        public static void main(String[] args) throws IOException, TimeoutException {
            // 创建连接对象工厂
            ConnectionFactory connectionFactory = new ConnectionFactory();
            // 设置属性
            connectionFactory.setHost("127.0.0.1");
            connectionFactory.setPort(5672);
            connectionFactory.setUsername("admin");
            connectionFactory.setPassword("admin");
            connectionFactory.setVirtualHost("study");
            // 拿到连接对象
            Connection connection = connectionFactory.newConnection();
            // 获取信道
            Channel channel = connection.createChannel();
            // 声明交换机为Fanout
            // 参数分别为交换机名称、交换机类型和是否持久化
            channel.exchangeDeclare("routing-exchange", BuiltinExchangeType.DIRECT, true);
            // 声明队列
            channel.queueDeclare("routing-queue1", true, false, false, null);
            channel.queueDeclare("routing-queue2", true, false, false, null);
            // 绑定队列和交换机
            channel.queueBind("routing-queue1", "routing-exchange", "error"); // 错误信息队列
            channel.queueBind("routing-queue2", "routing-exchange", "info"); // 日志信息队列
            // 发送消息
            String errMsg = "hello error";
            channel.basicPublish("routing-exchange", "error", null, errMsg.getBytes());
            String infoMsg = "hello info";
            channel.basicPublish("routing-exchange", "info", null, infoMsg.getBytes());
            // 关闭资源
            channel.close();
            connection.close();
        }
    }
    ```

=== "消费者1"

    ```java
    public class Consumer1 {
        public static void main(String[] args) throws IOException, TimeoutException, InterruptedException {
            // 创建连接对象工厂
            ConnectionFactory connectionFactory = new ConnectionFactory();
            // 设置属性
            connectionFactory.setHost("127.0.0.1");
            connectionFactory.setPort(5672);
            connectionFactory.setUsername("admin");
            connectionFactory.setPassword("admin");
            connectionFactory.setVirtualHost("study");
            // 拿到连接对象
            Connection connection = connectionFactory.newConnection();
            // 获取信道
            Channel channel = connection.createChannel();
            // 声明队列
            channel.queueDeclare("routing-queue1", true, false, false, null);
            // 消费消息
            DefaultConsumer defaultConsumer = new DefaultConsumer(channel) {
                // 重写DefaultConsumer中的handleDelivery方法
                // 参数分别是消费者标签、消息的封包信息、配置信息、消息
                @Override
                public void handleDelivery(String consumerTag,
                                        Envelope envelope,
                                        AMQP.BasicProperties properties,
                                        byte[] body) throws IOException {
                    System.out.println("消费消息：" + new String(body));
                }
            };
            // 参数分别是队列名称、是否自动确认消息接收、消息回调函数
            channel.basicConsume("routing-queue1", true, defaultConsumer);
            // 硬编码以确保收到消息
            Thread.sleep(2000);
            // 释放资源，先关闭信道，再关闭连接
            channel.close();
            connection.close();
        }
    }
    ```

=== "消费者2"

    ```java
    public class Consumer2 {
        public static void main(String[] args) throws IOException, TimeoutException, InterruptedException {
            // 创建连接对象工厂
            ConnectionFactory connectionFactory = new ConnectionFactory();
            // 设置属性
            connectionFactory.setHost("127.0.0.1");
            connectionFactory.setPort(5672);
            connectionFactory.setUsername("admin");
            connectionFactory.setPassword("admin");
            connectionFactory.setVirtualHost("study");
            // 拿到连接对象
            Connection connection = connectionFactory.newConnection();
            // 获取信道
            Channel channel = connection.createChannel();
            // 声明队列
            channel.queueDeclare("routing-queue2", true, false, false, null);
            // 消费消息
            DefaultConsumer defaultConsumer = new DefaultConsumer(channel) {
                // 重写DefaultConsumer中的handleDelivery方法
                // 参数分别是消费者标签、消息的封包信息、配置信息、消息
                @Override
                public void handleDelivery(String consumerTag,
                                        Envelope envelope,
                                        AMQP.BasicProperties properties,
                                        byte[] body) throws IOException {
                    System.out.println("消费消息：" + new String(body));
                }
            };
            // 参数分别是队列名称、是否自动确认消息接收、消息回调函数
            channel.basicConsume("routing-queue2", true, defaultConsumer);
            // 硬编码以确保收到消息
            Thread.sleep(2000);
            // 释放资源，先关闭信道，再关闭连接
            channel.close();
            connection.close();
        }
    }
    ```

在上面的示例中，消费者1会从`routing-queue1`中拿到数据，对应的消息即为`hello error`，消费者2会从`routing-queue2`中拿到数据，对应的消息即为`hello info`

## 通配符模式

通配符模式工作图如下：

```mermaid
flowchart LR
    P((P<br/>生产者)) -->|item.create| X{{X<br/>交换机<br/>Topic}}
    X -->|item.*| Q1[Queue₁<br/>商品事件]
    X -->|item.delete| Q2[Queue₂<br/>删除事件]
    X -.->|不匹配order.*| Q3[Queue₃<br/>订单事件]
    Q1 --> C1((C₁<br/>消费者1))
    Q2 --> C2((C₂<br/>消费者2))
    Q3 --> C3((C₃<br/>消费者3))
    
    style P fill:#87CEEB,stroke:#333
    style X fill:#DDA0DD,stroke:#333,stroke-width:2px
    style Q1 fill:#F0E68C,stroke:#333
    style Q2 fill:#F0E68C,stroke:#333
    style Q3 fill:#F0E68C,stroke:#333,stroke-dasharray: 5 5
    style C1 fill:#90EE90,stroke:#333
    style C2 fill:#90EE90,stroke:#333
    style C3 fill:#90EE90,stroke:#333,stroke-dasharray: 5 5
```

通配符模式可以说是路由模式的一种升级版，从完全匹配到支持模糊匹配，只要满足匹配规则即可。其余特点与路由模式类似

## RPC通信

[RPC](https://www.help-doc.top/projects/json-rpc/intro/intro.html#rpc)通信不完全算是RabbitMQ的主要功能，但是因为可以借助RabbitMQ来实现，所以官方也提供了这种模式，基本工作图如下：

```mermaid
flowchart LR
    subgraph Client["客户端"]
        CP((C<br/>调用方))
    end
    
    subgraph Server["服务端"]
        SQ[rpc_queue<br/>请求队列]
        SP((S<br/>执行方))
        RQ[reply_queue<br/>响应队列]
    end
    
    CP -->|发送请求<br/>correlation_id| SQ
    SQ --> SP
    SP -->|返回结果| RQ
    RQ -->|匹配correlation_id| CP
    
    style CP fill:#87CEEB,stroke:#333
    style SP fill:#FFB6C1,stroke:#333
    style SQ fill:#F0E68C,stroke:#333
    style RQ fill:#F0E68C,stroke:#333
```

在RPC通信中，不再有生产者和消费者的概念，而是客户端和服务端，当客户端调用指定服务时，会将请求和`correlation_id`一同发送给服务端（RabbitMQ服务器）的请求队列，服务端处理完结果之后，将响应和接收到的`correlation_id`发到响应队列，客户端判断`correlation_id`来确定是否是自己请求的服务进行结果处理，进而实现RPC

尽管可以使用RabbitMQ实现RPC通信，但是实际应用中使用的更多还是其他的RPC服务，例如grpc等

## 生产者消息确认模式

前面介绍的模式都是在考虑消息如何被存储到队列中的问题，但是生产者消息确认模式只是考虑消息是否到达队列，当生产者发送消息给交换机之后，交换机将消息保存到队列中就会发送一条确认消息给生产者，告诉其消息已送达，但是消息是否会被消费者正确处理，在生产者消息确认模式中并不知道