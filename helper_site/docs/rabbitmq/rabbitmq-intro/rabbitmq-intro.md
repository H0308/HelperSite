<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# RabbitMQ介绍

## 何为MQ

MQ（Message Queue），从字面意思上看，本质是个队列FIFO，只不过队列中存放的内容是消息而已。消息可以非常简单，比如只包含文本字符串，JSON等，也可以很复杂，比如内嵌对象

MQ多⽤于分布式系统之间进行通信，系统之间的调用通常有两种⽅式

1. 同步通信：消息直接从发送方传递到接收方
2. 异步通信：消息由发送方发到服务器，当达到某种条件后，再由服务器转发给接收方

## MQ的作用

MQ主要工作是接收并转发消息，在不同的应用场景下可以展现不同的作用，例如：

1. 异步解耦：在业务流程中，一些操作可能非常耗时，但并不需要即时返回结果。可以借助MQ把这些操作异步化，比如用户注册后发送注册短信或邮件通知，可以作为异步任务处理，而不必等待这些操作完成后才告知用户注册成功
2. 流量削峰：在访问量剧增的情况下，应用仍然需要继续发挥作用，但是这样的突发流量并不常见。如果以能处理这类峰值为标准而投入资源，无疑是巨大的浪费。使用MQ能够使关键组件支撑突发访问压力，不会因为突发流量而崩溃。比如秒杀或者促销活动，可以使用MQ来控制流量，将请求排队，然后系统根据自己的处理能力逐步处理这些请求
3. 消息分发：当多个系统需要对同一数据做出响应时，可以使用MQ进行消息分发。比如支付成功后，支付系统可以向MQ发送消息，其他系统订阅该消息，而无需轮询数据库
4. 延迟通知：在需要在特定时间后发送通知的场景中，可以使用MQ的延迟消息功能，比如在电子商务平台中，如果用户下单后一定时间内未支付，可以使用延迟队列在超时后自动取消订单

## RabbitMQ介绍

RabbitMQ是采用Erlang语言实现AMQP（Advanced Message Queuing Protocol，高级消息队列协议）的消息中间件，它最初起源于金融系统领域，为了在分布式系统中存储和转发消息而设计的

## RabbitMQ工作流程与核心概念

RabbitMQ工作流程如下图：

<img src="rabbitmq-intro.assets\download.png">

在上图中，Producer和Consumer分别对应消息的生产者和消费者（客户端），负责创建消息和接收消息，而Broker可以理解为RabbitMQ的服务器，这个服务器里面有一些虚拟主机，每一个虚拟主机中有交换机和队列

当生产者需要向RabbitMQ服务器推送消息时，首先需要建立TCP连接，这个连接对应的就是图中的Connection，但是生产者的消息并不是直接通过Connection发送给服务器，中间还需要借助虚拟信道Channel，一个Connection内部有多个Channel负责将信息传递给RabbitMQ服务器

当消息到达RabbitMQ的服务器时，首先到达的位置是交换机而非队列，所以实际上生产者发送消息是往交换机发送而非队列，接着由交换机将消息转发给队列

当消费者需要从RabbitMQ服务器拿消息时，同样需要建立TCP连接，也就是说依旧需要Connection和Channel，每一个消费者要拿到消息就要订阅对应的队列

因为生产者和消费者都需要与服务器建立连接，如果频繁建立和释放连接会有资源浪费和性能消耗，所以有Channel可以让消息和读写操作复用到同一个TCP连接，从而实现复用

在上面的流程中，虚拟主机实际上是RabbitMQ为不同的消息队列提供的一种逻辑上的隔离机制，类似MySQL的数据库，是一个逻辑上的集合，一个MySQL服务器可以有多个Database。队列就是存储消息的地方，其与消费者属于多对多的关系，即一个消费者可以订阅多个队列，一个队列可以被多个消费者订阅。交换机主要起到路由转发的作用，根据特定类型和规则将消息转发到对应的队列上

## 何为AMQP协议

AMQP（Advanced Message Queuing Protocol）是一种高级消息队列协议，AMQP定义了一套确定的消息交换功能，包括交换器，队列等.这些组件共同工作，使得生产者能够将消息发送到交换器，然后由队列接收并等待消费者接收。AMQP还定义了一个网络协议，允许客户端应用通过该协议与消息代理和AMQP模型进行交互通信

RabbitMQ是遵从AMQP协议的，换句话说，RabbitMQ就是AMQP协议的Erlang的实现，当然RabbitMQ还支持STOMP2，MQTT2等协议。AMQP的模型结构和RabbitMQ默认的模型结构是一样的

<img src="rabbitmq-intro.assets\download1.png">

## 基础代码演示

### 引入Maven依赖

```xml
<dependency>
    <groupId>com.rabbitmq</groupId>
    <artifactId>amqp-client</artifactId>
    <version>5.7.3</version>
</dependency>
```

### 消息生产者

生产者代码如下：

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
        // 参数分别为队列名称、是否持久化、是否只能有⼀个消费者监听队列、是否自动删除、其他参数
        channel.queueDeclare("intro", true, false, false, null);
        // 发送消息
        String message = "rabbitmq intro";
        // 参数分别为交换机名称、路由名称、配置信息、消息数据
        // 使用默认交换机时，需要确保路由名称和队列名称一致
        channel.basicPublish("", "intro", null, message.getBytes());
        // 释放资源，先关闭信道，再关闭连接
        channel.close();
        connection.close();
    }
}
```

在RabbitMQ控制台中对应的队列中可以看到消息：

<img src="rabbitmq-intro.assets\xw_20260203155338.png" style="width: 70%">

### 消息消费者

消费者代码：

```java
public class Consumer {
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
        // 声明队列（为了防止消费者启动时队列不存在而报错，消费者建议声明队列）
        channel.queueDeclare("intro", true, false, false, null);
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
        channel.basicConsume("intro", true, defaultConsumer);
        // 硬编码以确保收到消息
        Thread.sleep(2000);
        // 释放资源，先关闭信道，再关闭连接
        channel.close();
        connection.close();
    }
}
```

控制台可以看到生产者发送的消息：

```
消费消息：rabbitmq intro
```