<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Ubuntu和Docker下安装和卸载RabbitMQ

## 安装RabbitMQ

RabbitMQ依赖Erlang运行时，因此安装前先安装Erlang，再安装RabbitMQ服务

### 更新系统和安装依赖

```bash
sudo apt-get update -y
sudo apt-get install curl gnupg apt-transport-https -y
```

### 添加RabbitMQ官方仓库签名密钥和源

```bash
# 添加RabbitMQ签名密钥
curl -1sLf "https://keys.openpgp.org/vks/v1/by-fingerprint/0A9AF2115F4687BD29803A206B73A36E6026DFCA" \
  | sudo gpg --dearmor -o /usr/share/keyrings/com.rabbitmq.team.gpg

# 添加APT源（以Ubuntu版本名替换<UBUNTU_CODENAME>如jammy, noble）
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/com.rabbitmq.team.gpg] \
  https://deb1.rabbitmq.com/rabbitmq-server/ubuntu <UBUNTU_CODENAME> main" | \
  sudo tee /etc/apt/sources.list.d/rabbitmq.list
```

!!! note

    如果不确定Ubuntu发行版代号，可用命令`lsb_release -cs`或者`lsb_release -a`查看

### 安装Erlang和RabbitMQ

```bash
sudo apt-get update -y

# 安装Erlang（RabbitMQ依赖）
sudo apt-get install -y erlang-base erlang-asn1 erlang-crypto erlang-eldap \
  erlang-ftp erlang-inets erlang-mnesia erlang-os-mon erlang-parsetools \
  erlang-public-key erlang-runtime-tools erlang-snmp erlang-ssl \
  erlang-syntax-tools erlang-tools

# 安装RabbitMQ
sudo apt-get install rabbitmq-server -y
```

安装完成后，RabbitMQ服务会自动启用并作为`systemd`服务启动

### 启动/管理RabbitMQ

```bash
# 启动
sudo systemctl start rabbitmq-server

# 自动开机启动
sudo systemctl enable rabbitmq-server

# 查看状态
sudo systemctl status rabbitmq-server
```

### 启用管理插件（管理界面Web UI）

RabbitMQ 的管理界面不是默认启用的，需要手动开启：

```bash
sudo rabbitmq-plugins enable rabbitmq_management
```

这个命令会启用管理控制台相关插件，不需要重启RabbitMQ服务。启用后UI默认监听 **15672 端口**

### 配置访问管理界面账户

默认RabbitMQ安装会有一个账号：

```
用户名: guest
密码: guest
```

不过**默认只能本地访问（localhost）**管理界面。如果要远程访问或安全控制，建议新建用户：

```bash
# 添加用户
sudo rabbitmqctl add_user 用户名 密码

# 设置为管理员
sudo rabbitmqctl set_user_tags admin administrator

# 允许该用户对默认虚拟主机 / 全部操作
sudo rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
```

这会创建一个名为 `admin` 的管理员账户

### 访问管理界面

在浏览器中打开：

```
http://localhost:15672
```

如果是程序访问，则访问端口为5672

如果是远程服务器，需要将`localhost`替换成服务器IP或域名：

```
http://your-server-ip:15672
```

登录时用上一步设置的账号密码（默认`guest/guest`或你新建的`admin`）

## 卸载RabbitMQ

卸载时建议先停止服务，然后删除软件包和残留文件

### 停止RabbitMQ服务

```bash
sudo systemctl stop rabbitmq-server
```

### 卸载软件包及配置

```bash
# 完全卸载 RabbitMQ
sudo apt-get purge rabbitmq-server -y

# 清理依赖和未使用的软件包
sudo apt-get autoremove -y
```

### 删除残留文件（可选）

如果希望彻底清除所有数据与日志，执行：

```bash
sudo rm -rf /etc/rabbitmq
sudo rm -rf /var/lib/rabbitmq
sudo rm -rf /var/log/rabbitmq
```

### 卸载 Erlang（可选）

如果Erlang是专为RabbitMQ安装的且不再需要：

```bash
sudo apt-get purge erlang* -y
sudo apt-get autoremove -y
```

!!! warning

    使用通配符`erlang*`删除所有Erlang相关包，但要确认系统中没有其他依赖Erlang的应用

## Docker下安装带管理界面的RabbitMQ

### 拉取带管理界面的RabbitMQ镜像

RabbitMQ官方提供了带管理插件（management UI）预装的镜像版本，你可以直接使用带`-management`的tag

```bash
docker pull rabbitmq:management
```

或者指定具体版本，例如：

```bash
docker pull rabbitmq:3-management
```

这会下载包含Web管理界面（默认端口15672）的镜像

### 启动容器

最简单方式就是这样运行：

```bash
docker run -d \
  --name rabbitmq \
  -p 5672:5672 \      # AMQP 消息服务端口
  -p 15672:15672 \    # Web 管理界面端口
  rabbitmq:management
```

说明：

- 5672：RabbitMQ 消息客户端连接端口
- 15672：管理界面 UI 访问端口
- 默认账号密码是`guest / guest`

### 设置默认用户和密码（推荐）

如果想自定义默认登录账号，可以通过环境变量设置：

```bash
docker run -d \
  --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=123456 \
  rabbitmq:management
```

这样在浏览器打开管理界面时，就能用`admin / 123456`登录

### 扩展与插件（可选）

默认管理插件已启用。如果需要额外插件（如MQTT、STOMP等），可以在Dockerfile或容器启动后启用：

```bash
docker exec -it rabbitmq rabbitmq-plugins enable rabbitmq_stomp rabbitmq_mqtt
```

或者通过挂载`enabled_plugins`文件到`/etc/rabbitmq/`并重启容器