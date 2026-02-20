<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# 在SpringBoot应用中使用RabbitMQ

## 引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.amqp</groupId>
    <artifactId>spring-rabbit-test</artifactId>
    <scope>test</scope>
</dependency>
```

## 编写配置

```yaml
spring:
  rabbitmq:
    addresses: amqp://admin:admin@127.0.0.1:5672/study

# 或者使用下面分开写的形式
spring:
  rabbitmq:
    host: 127.0.0.1
    port: 5672 # 默认为5672 
    username: admin 
    password: admin
    virtual-host: study # 默认值为 /
```

## 声明队列

编写配置文件，并创建一个Bean：

```java
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;

@Configuration
public class RabbitConfig {
    // 创建工作队列
    @Bean
    public Queue workQueue() {
        // 使用QueueBuilder创建一个名为work-queue的可持久化队列
        return QueueBuilder.durable("work-queue").build();
    }
}
```

## 声明交换机与绑定关系

声明交换机和绑定关系与声明队列类似，但是需要注意多个Bean注入时的冲突问题，使用`@Qualifier`指定Bean。交换机的类型有下面三种：

1. `FanoutExchange`
2. `DirectExchange`
3. `TopicExchange`

=== "声明交换机"

    ```java
    // 发布订阅模式交换机
    @Bean("fanout")
    public FanoutExchange fanoutExchange() {
        return ExchangeBuilder.fanoutExchange("fanout-exchange").durable(true).build();
    }
    // 路由模式交换机
    @Bean("direct")
    public DirectExchange directExchange() {
        return ExchangeBuilder.directExchange("direct-exchange").durable(true).build();
    }
    // 通配符模式交换机
    @Bean("topic")
    public TopicExchange topicExchange() {
        return ExchangeBuilder.topicExchange("direct-exchange").durable(true).build();
    }
    ```

=== "声明绑定关系"

    ```java
    // 队列
    @Bean("fanout-queue")
    public Queue fanoutQueue() {
        return QueueBuilder.durable("fanout-queue").build();
    }
    @Bean("direct-queue")
    public Queue directQueue() {
        return QueueBuilder.durable("direct-queue").build();
    }

    // 绑定关系
    @Bean("fanout-binding")
    public Binding fanoutBinding(@Qualifier("fanout") FanoutExchange fanoutExchange, 
                                    @Qualifier("fanout-queue") Queue queue) {
        return BindingBuilder.bind(queue).to(fanoutExchange);
    }

    // 携带Binding Key
    @Bean("direct-binding")
    public Binding directBinding(@Qualifier("direct") DirectExchange directExchange,
                                 @Qualifier("direct-queue") Queue queue) {
        return BindingBuilder.bind(queue).to(directExchange).with("info");
    }
    ```

## 生产者发送消息

生产者可以使用`RabbitTemplate`对象调用`covertAndSend`方法发送消息：

```java
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@RestController
@RequestMapping("/producer")
public class Producer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @RequestMapping("/work")
    public String workQueue() {
        rabbitTemplate.convertAndSend("", "work-queue", "hello spring-amqp: work-queue");
        return "消息发送成功";
    }
}
```

## 消费者消费消息

使用`@RabbitListener`来声明一个消费者，这个注解可以使用在类上（整个类为一个消费者，此时要执行的方法需要被`@RabbitHandler`修饰），也可以使用在方法上（指定方法为一个消费者），注解中的`queues`参数值为消费的队列名称。方法的参数可以有两种：

1. 消息：`String`类型/`Message`类型，如果是`String`，则参数值即为接收到的消息，否则参数值包含消息以及其他内容（例如`deliveryTag`）
2. 连接：`Channel`类型，参数值即为当前消费者的连接信息

```java
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;

@Component
public class WorkQueueConsumer {
    @RabbitListener(queues = "work-queue")
    public void workQueue(Message message) {
        System.out.println("消费者接收到消息：" + new String(message.getBody()));
    }
}
```

## 发送与接受对象

默认情况下，`convertAndSend`是支持发送一个对象的，但是这个对象必须要实现`Serializable`接口，并且直接发送时消息类型会被设置为Java序列化对象，可读性差，所以可以考虑设置一下发送前对象的序列化方式，以Json为例：

```java
// 返回用于序列化和反序列化的Json对象
@Bean
public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
    return new Jackson2JsonMessageConverter();
}
// 自定义RabbitTemplate对象，使其支持Json序列化和反序列化
@Bean
public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
    RabbitTemplate template = new RabbitTemplate(connectionFactory);
    template.setMessageConverter(jackson2JsonMessageConverter()); // 设置消息转换器
    return template;
}
```

需要注意，如果生产者发送的是某个对象的Json字符串，那么消费者在接收时如果想直接使用该对象作为参数，也同样需要上面的步骤

例如：

=== "自定义对象"

    ```java
    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public class OrderInfo {
        private String orderId; 
        private String name; 
        private long price;
    }
    ```

=== "生产者"

    ```java
    @RequestMapping("/createOrder")
    public String createOrder(){
        //下单相关操作, ⽐如参数校验, 操作数据库等, 代码省略
        //发送消息通知
        String orderId = UUID.randomUUID().toString();
        OrderInfo orderInfo = new OrderInfo(orderId, "商品", 536); 
        rabbitTemplate.convertAndSend("", "order.create",orderInfo); 
        return "下单成功";
    }
    ```

=== "消费者"

    ```java
    @Component
    @RabbitListener(queues = "order.create")
    public class OrderCreateListener {
        @RabbitHandler
        public void ListenerQueue(OrderInfo orderInfo){ 
            System.out.println("接收到消息:"+ orderInfo);
        }
    }
    ```