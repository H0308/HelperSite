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