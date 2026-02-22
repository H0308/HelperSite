<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Redis介绍与基本使用

## Redis基本介绍

Redis是一个开源的高性能键值数据库，提供字符串、哈希、列表、集合、有序集合等多种数据结构，具备内存读写带来的低延迟与高吞吐特点，同时支持持久化、主从复制、哨兵与集群机制以实现高可用和水平扩展。它常用于缓存、会话存储、排行榜、消息队列、分布式锁等场景，其优势在于速度快、结构丰富、部署灵活

## Ubuntu上安装和卸载Redis

安装可以使用如下的命令：

```bash
# 更新包索引
sudo apt update

# 安装 Redis
sudo apt install redis-server -y

# 检查版本
redis-server --version

# 启动服务并设置开机自启
sudo systemctl start redis-server
sudo systemctl enable redis-server

# 验证运行状态
sudo systemctl status redis-server
```

修改基本配置：

```bash
sudo nano /etc/redis/redis.conf
```

常见修改的配置如下：

```conf
# 设置密码（取消注释并修改）
requirepass your_strong_password

# 允许远程访问（默认只允许本地，有风险，建议配合防火墙）
# bind 127.0.0.1 ::1
bind 0.0.0.0

# 关闭保护模式（如果允许远程访问）
protected-mode no

# 内存限制（示例：限制 256MB）
maxmemory 256mb
maxmemory-policy allkeys-lru
```

修改完配置之后需要重启Redis服务：

```bash
sudo systemctl restart redis-server
```

完整卸载Redis可以参考如下步骤：

```bash
# 停止服务
sudo systemctl stop redis-server
sudo systemctl disable redis-server

# 卸载并清除配置文件
sudo apt purge redis-server -y
sudo apt autoremove --purge -y

# 手动删除数据目录（谨慎操作！）
sudo rm -rf /etc/redis/
sudo rm -rf /var/lib/redis/
sudo rm -rf /var/log/redis/

# 删除源码安装的文件（如果是源码安装）
sudo rm -f /usr/local/bin/redis-*
```

## Redis常见通用命令

在Redis命令行客户端输入下面的命令可以查看当前版本支持的通用命令：

```bash
help @generic
```

下面介绍几种常见的通用命令：

1. `keys`：查看符合指定规则的所有`key`
2. `del`：删除指定的`key`。支持批量删除，返回实际删除成功的`key`的数量
3. `exists`：判断指定的`key`是否存在
4. `expire`：为指定的`key`设置有效期，单位为秒。
5. `ttl`：查看指定的`key`剩余的有效期。在未给`key`设置有效期时，查出该`key`的结果为`-1`表示永不过期，对一个已经过期的`key`进行查询，则结果为`-2`

常见命令使用示例：

=== "`keys`"

    ```bash
    127.0.0.1:6379> keys *
    1) "name"
    2) "age"
    127.0.0.1:6379>

    # 查询以a开头的key
    127.0.0.1:6379> keys a*
    1) "age"
    127.0.0.1:6379>
    ```

=== "`del`"

    ```bash
    127.0.0.1:6379> del name #删除单个
    (integer) 1  #成功删除1个

    127.0.0.1:6379> keys *
    1) "age"

    127.0.0.1:6379> MSET k1 v1 k2 v2 k3 v3 #批量添加数据
    OK

    127.0.0.1:6379> keys *
    1) "k3"
    2) "k2"
    3) "k1"
    4) "age"

    127.0.0.1:6379> del k1 k2 k3 k4
    (integer) 3   #此处返回的是成功删除的key，由于redis中只有k1,k2,k3 所以只成功删除3个，最终返回
    127.0.0.1:6379>

    127.0.0.1:6379> keys * #再查询全部的key
    1) "age"	#只剩下一个了
    127.0.0.1:6379>
    ```

=== "`exists`"

    ```bash
    127.0.0.1:6379> exists age
    (integer) 1

    127.0.0.1:6379> exists name
    (integer) 0
    ```

=== "`expire`与`ttl`"

    ```bash
    127.0.0.1:6379> expire age 10
    (integer) 1

    127.0.0.1:6379> ttl age
    (integer) 8

    127.0.0.1:6379> ttl age
    (integer) 6

    127.0.0.1:6379> ttl age
    (integer) -2

    127.0.0.1:6379> ttl age
    (integer) -2  #当这个key过期了，那么此时查询出来就是-2 

    127.0.0.1:6379> keys *
    (empty list or set)

    127.0.0.1:6379> set age 10 #如果没有设置过期时间
    OK

    127.0.0.1:6379> ttl age
    (integer) -1  # ttl的返回值就是-1
    ```

## String类型命令

String类型是Redis中最基础的数据类型，键对应的值根据字符串的格式可以是字符串、整数或浮点数，最大长度为512MB。常见的操作命令可以分为两类：

1. 设置和获取键值对
2. 值为整数或浮点数的自增

对于设置和获取，有下面的几种命令：

1. `set`：添加或者修改一个键值对
2. `get`：获取指定`key`的值
3. `mset`：批量添加多个键值对
4. `mget`：批量获取多个键值对

例如下面的例子：

```bash
127.0.0.1:6379> set name Rose  # 原来不存在
OK

127.0.0.1:6379> get name 
"Rose"

127.0.0.1:6379> set name Jack # 原来存在，就是修改
OK

127.0.0.1:6379> get name
"Jack"

127.0.0.1:6379> MSET k1 v1 k2 v2 k3 v3
OK

127.0.0.1:6379> MGET name age k1 k2 k3
1) "Jack" # 之前存在的name
2) "10"   # 之前存在的age
3) "v1"
4) "v2"
5) "v3"
```

其中`set`命令有两种变体：

1. `setex`：添加一个不存在的键值对，如果存在则不进行任何操作。等同于`set key value nx`
3. `setnx`：添加一个键值对并且设置有效期。等同于`set key value ex seconds`

例如下面的例子：

```bash
127.0.0.1:6379> set name Jack  //设置名称
OK
127.0.0.1:6379> setnx name lisi //如果key不存在，则添加成功
(integer) 0
127.0.0.1:6379> get name //由于name已经存在，所以lisi的操作失败
"Jack"
127.0.0.1:6379> setnx name2 lisi //name2 不存在，所以操作成功
(integer) 1
127.0.0.1:6379> get name2 
"lisi"

127.0.0.1:6379> setex name 10 jack
OK

127.0.0.1:6379> ttl name
(integer) 8

127.0.0.1:6379> ttl name
(integer) 7

127.0.0.1:6379> ttl name
(integer) 5
```

对于自增来说，有下面的两种命令：

1. `incr`：针对值为整数，自增1
2. `incrby`：针对值为整数，自增自定义步长
3. `incrbyfloat`：针对值为浮点数，自增自定义步长

例如下面的例子：

```bash
127.0.0.1:6379> get age 
"10"

127.0.0.1:6379> incr age # 增加1
(integer) 11
    
127.0.0.1:6379> get age # 获得age
"11"

127.0.0.1:6379> incrby age 2 # 一次增加2
(integer) 13 # 返回目前的age的值
    
127.0.0.1:6379> incrby age 2
(integer) 15
    
127.0.0.1:6379> incrby age -1 # 也可以增加负数，相当于减
(integer) 14
    
127.0.0.1:6379> incrby age -2 # 一次减少2个
(integer) 12
    
127.0.0.1:6379> DECR age # 相当于incr负数，减少的另一种方法
(integer) 11
    
127.0.0.1:6379> get age 
"11"
```

## Hash类型

在前面的String类型中，想要修改一个键的值必须是替换而不能进行单独修改，如果值是一个Json字符串，那么要修改Json字符串中的某个字段就需要替换掉整个Json字符串，相对比较麻烦。对于Hash类型，值可以相当于一个Java中的`HashMap`，有自己的`key`和`value`，所以在Hash类型中，创建一个Redis的Key（相当于创建一个`HashMap`），接着插入键值对`field`和`value`（相当于`HashMap`中的`key`和`value`）

在Hash类型中，常见的操作也分为两类：

1. 设置和获取键值对
2. 值为整数或浮点数的自增

对于设置和获取，有下面的几种命令：

1. `hset`：添加或者修改一个`field`的值
2. `hget`：获取指定`field`的值
3. `hmset`：批量添加多个`field`的值
4. `hmget`：批量获取多个`field`的值
5. `hgetall`：获取指定`key`下的所有`field`和`value`
6. `hkeys`：获取指定`key`下所有的`field`
7. `hvals`：获取指定`key`下所有的`value`

例如下面的示例：

```bash
127.0.0.1:6379> hset test f1 v1
(integer) 1
127.0.0.1:6379> hget test f1
"v1"
127.0.0.1:6379> hmset test f2 v2 f3 v3 f4 v4
OK
127.0.0.1:6379> hmget test f1 f2 f3 f4
1) "v1"
2) "v2"
3) "v3"
4) "v4"
127.0.0.1:6379> hgetall test
1) "f1"
2) "v1"
3) "f2"
4) "v2"
5) "f3"
6) "v3"
7) "f4"
8) "v4"
127.0.0.1:6379> hkeys test
1) "f1"
2) "f2"
3) "f3"
4) "f4"
127.0.0.1:6379> hvals test
1) "v1"
2) "v2"
3) "v3"
4) "v4"
```

对于`hset`来说，有一个变体：`hsetnx`，与`setnx`类似，但是`hsetnx`不是检测`key`是否存在，而是检测`field`是否存在

对于自增来说，有`hincrby`，作用与`incrby`类似，但是要指定`field`，例如下面的示例：

```bash
127.0.0.1:6379> hset test1 f1 1 # 设置
(integer) 1
127.0.0.1:6379> hincrby test1 f1 2 # 自增2
(integer) 3
127.0.0.1:6379> hincrby test1 f1 2 # 自增2
(integer) 5
```

## List类型

List类型可以理解为是一个双向链表，常见的操作如下：

1. `lpush`：左侧（链表头部）插入元素
2. `lpop`：左侧删除并返回元素，如果没有元素返回`nil`
3. `rpush`：右侧（链表尾部）插入元素
4. `rpop`：右侧删除元素
5. `lrange`：获取指定区间（左闭右闭）的元素，下标从0开始
6. `blpop`：左侧阻塞式删除并返回元素，没有元素时会阻塞等待指定的超时时间，超时没有元素则返回`nil`
7. `brpop`：右侧阻塞式删除并返回元素，没有元素时会阻塞等待指定的超时时间，超时没有元素则返回`nil`

例如下面的示例：

```bash
127.0.0.1:6379> lpush l1 1 2 3 4
(integer) 4
127.0.0.1:6379> lpop l1 3
1) "4"
2) "3"
3) "2"
127.0.0.1:6379> rpush l2 1 2 3 4
(integer) 4
127.0.0.1:6379> rpop l2 3
1) "4"
2) "3"
3) "2"
127.0.0.1:6379> lpush l3 1 2 3 4 5
(integer) 5
127.0.0.1:6379> lrange l3 2 3
1) "3"
2) "2"
```

## Set类型

Set类型类似于`HashSet`，元素值不能重复，常见的操作命令可以分为两类：

1. 设置、获取和删除等元素操作
2. 多个Set类型的`key`进行交集、查集和并集运算

对于元素操作，有下面常见的命令：

1. `sadd`：新增一个或多个元素
2. `srem`：删除指定元素
3. `scard`：返回指定`key`的元素个数
4. `sismember`：判断指定元素是否存在`key`中
5. `smembers`：获取指定`key`的所有元素

例如下面的示例：

```bash
127.0.0.1:6379> sadd s1 1 1 2 3 4 4
(integer) 4
127.0.0.1:6379> smembers s1
1) "1"
2) "2"
3) "3"
4) "4"
127.0.0.1:6379> srem s1 1
(integer) 1
127.0.0.1:6379> scard s1
(integer) 3
127.0.0.1:6379> sismember s1 1
(integer) 0
127.0.0.1:6379> sismember s1 2
(integer) 1
```

对于交集、查集和并集运算，有下面的命令：

1. `sinter`：多个`key`交集运算（取共同）
2. `sdiff`：多个`key`差集运算（取指定`key`有，但是其他`key`没有的）
3. `sunion`：多个`key`并集（将所有的`key`放在指定的新`key`中）

例如下面的示例：

```bash
127.0.0.1:6379> sadd s1 1 2 3
(integer) 3
127.0.0.1:6379> sadd s2 3 4 5
(integer) 3
127.0.0.1:6379> sinter s1 s2 # 取出s1和s2中都有的
1) "3"
127.0.0.1:6379> sdiff s1 s2 # 取出s1有，但是s2没有的
1) "1"
2) "2"
127.0.0.1:6379> sdiff s2 s1 # 取出s2有，但是s1没有的
1) "4"
2) "5"
127.0.0.1:6379> sunion s1 s2 # 取出s1和s2的总和
1) "1"
2) "2"
3) "3"
4) "4"
5) "5"
```

需要注意，上面的交集、并集和差集命令不会影响到原来的`key`，即`s1`和`s2`不会做出任何改变：

```bash
127.0.0.1:6379> scard s1
(integer) 3
127.0.0.1:6379> scard s2
(integer) 3
```

如果需要将交集、并集和差集结果放到一个新的`key`中，可以使用下面的命令：

1. `sinterstore`：取交集，结果保存到一个指定的新`key`中
2. `sdiffstore`：取差集，结果保存到一个指定的新`key`中
3. `sunionstore`：取并集，结果保存到一个指定的新`key`中

例如下面的示例：

```bash
127.0.0.1:6379> sinterstore s3 s1 s2 # 交集保存到s3中
(integer) 1
127.0.0.1:6379> smembers s3
1) "3"
127.0.0.1:6379> sdiffstore s4 s1 s2 # 差集保存到s4中
(integer) 2
127.0.0.1:6379> smembers s4
1) "1"
2) "2"
127.0.0.1:6379> sunionstore s5 s1 s2 # 并集保存到s5中
(integer) 5
127.0.0.1:6379> smembers s5
1) "1"
2) "2"
3) "3"
4) "4"
5) "5"
127.0.0.1:6379> sunionstore s1 s1 s2 # 并集保存到s1中
(integer) 5
127.0.0.1:6379> smembers s1
1) "1"
2) "2"
3) "3"
4) "4"
5) "5"
```

## ZSet类型

ZSet类型（sorted set）在Set的基础上为每个成员增加一个`score`，并按照`score`进行排序。常见的操作命令如下：

1. `zadd`：添加一个或多个元素到sorted set，如果已经存在则更新其`score`值
2. `zrem`：删除sorted set中的一个指定元素
3. `zscore`：获取sorted set中的指定元素的`score`值
4. `zrank`：获取sorted set中的指定元素的排名
5. `zcard`：获取sorted set中的元素个数
6. `zcount`：统计`score`值在给定范围内的所有元素的个数
7. `zincrby`：让sorted set中的指定元素自增，步长为指定的`increment`值
8. `zrange`：按照`score`排序后，获取指定**排名范围**内的元素，下标从0开始
9. `zrangebyscore`：按照`score`排序后，获取指定`score`范围内（左闭右闭）的元素
10. `zdiff`、`zinter`、`zunion`：求差集、交集、并集

注意：所有的排名默认都是升序，如果要降序则在命令的`Z`后面添加`REV`即可，例如：

- **升序**获取sorted set中的指定元素的排名：`zrank key member`
- **降序**获取sorted set中的指定元素的排名：`zrevrank key member`

例如下面的示例：

```bash
127.0.0.1:6379> zadd z1 100 Tom 90 Jack 95 Rose
(integer) 3
127.0.0.1:6379> zrange z1 0 -1 withscores
1) "Jack"
2) "90"
3) "Rose"
4) "95"
5) "Tom"
6) "100"
127.0.0.1:6379> zscore z1 Tom
"100"
127.0.0.1:6379> zrank z1 Rose
(integer) 1
127.0.0.1:6379> zrevrank z1 Rose
(integer) 1
127.0.0.1:6379> zcount z1 90 100
(integer) 3
127.0.0.1:6379> zincrby z1 5 Jack
"95"
127.0.0.1:6379> zrangebyscore z1 95 100 withscores
1) "Jack"
2) "95"
3) "Rose"
4) "95"
5) "Tom"
6) "100"
127.0.0.1:6379> zrem z1 Jack
(integer) 1
127.0.0.1:6379> zcard z1
(integer) 2
```

## 推荐的层级结构

在Redis中没有表的概念，如果有两种类型具有同样的数据，例如商品ID值为1和用户ID值为1，此时`key`直接存1就不合适，对此可以使用`:`进行层级划分，例如：

```
项目名:商品:1
项目名:用户:1
```

这样划分出的结构就是：

```
- 项目名
  - 商品
    - 1
  - 用户
    - 1
```

在一些Redis可视化客户端中就会看到对应的文件夹形式

## Redis的Java客户端（Spring Data Redis）

### 引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

### Spring Data Redis配置文件内容

```yaml
spring:
  redis:
    host: 127.0.0.1
    port: 6379
    password: your_password   # 没有密码可删
    database: 0
    timeout: 5000ms
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
        max-wait: 1000ms
```

### 基本使用

```java
@Autowired
private StringRedisTemplate stringRedisTemplate;

@Autowired
private RedisTemplate<String, Object> redisTemplate;

// String
stringRedisTemplate.opsForValue().set("name", "Jack");
String name = stringRedisTemplate.opsForValue().get("name");

// Object
redisTemplate.opsForValue().set("user:1", new User(1, "Tom"));
Object user = redisTemplate.opsForValue().get("user:1");

// String
stringRedisTemplate.opsForValue().set("age", "18");
String age = stringRedisTemplate.opsForValue().get("age");

// Hash
redisTemplate.opsForHash().put("user:1", "name", "Tom");
Object name = redisTemplate.opsForHash().get("user:1", "name");

// List
redisTemplate.opsForList().leftPush("list:1", "a");
redisTemplate.opsForList().rightPush("list:1", "b");

// Set
redisTemplate.opsForSet().add("set:1", "x", "y", "z");
Boolean isMember = redisTemplate.opsForSet().isMember("set:1", "x");

// ZSet
redisTemplate.opsForZSet().add("zset:1", "Tom", 100);
redisTemplate.opsForZSet().add("zset:1", "Jack", 90);
Set<Object> zset = redisTemplate.opsForZSet().range("zset:1", 0, -1);
```

### 自定义序列化配置

```java
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        // key 采用 String 序列化
        StringRedisSerializer stringSerializer = new StringRedisSerializer();
        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);

        // value 采用 JSON 序列化
        GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer();
        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);

        template.afterPropertiesSet();
        return template;
    }
}
```