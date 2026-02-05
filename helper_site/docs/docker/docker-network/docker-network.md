<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Docker网络管理

## 为何Docker需要网络管理

容器的网络默认与宿主机及其他容器都是相互隔离，但同时我们也要考虑下面的一些问题，比如：

- 多个容器之间是如何通信的
- 容器和宿主机是如何通信的
- 容器和外界主机是如何通信的
- 容器中要运行一些网络应用，如果要让外部也可以访问这些容器内运行的网络应用应该如何实现
- 容器不想让它的网络与宿主机、与其他容器隔离应该如何实现
- 容器根本不需要网络的时候应该如何实现
- 容器需要更高的定制化网络（如定制特殊的集群网络、定制容器间的局域网）应该如何实现

上述的这些问题都需要我们对容器的网络进行合理的管理才能解决，这就体现出了容器网络管理的重要性

## Docker网络架构简介

Docker容器网络是为应用程序所创造的虚拟环境的一部分，它能让应用从宿主机操作系统的网络环境中独立出来，形成容器自有的网络设备、IP协议栈、端口套接字、IP路由表、防火墙等等与网络相关的模块

Docker 为实现容器网络，主要采用的架构由三部分组成：CNM、Libnetwork 和驱动

## CNM设计规范

Docker网络架构采用的设计规范是 CNM（Container Network Model）。CNM中规定了Docker网络的基础组成要素：Sandbox、Endpoint、Network，如下图所示：

<img src="docker-network.assets\5b8d7baf-b44d-43a2-b9ee-8496437bbaab.webp">

其中：

- Sandbox：提供了容器的虚拟网络栈，也即端口、套接字、IP路由表、防火墙、DNS配置等内容。主要用于隔离容器网络与宿主机网络，形成了完全独立的容器网络环境
- Network：Docker内部的虚拟子网，使得网络内的参与者能够进行通讯
- Endpoint：就是虚拟网络的接口，就像普通网络接口一样，Endpoint的主要职责是负责创建连接。Endpoint类似于常见的网络适配器，那也就意味着一个Endpoint只能接入某一个网络，当容器需要接入到多个网络，就需要多个Endpoint

如上所示，容器B有两个Endpoint并且分别接入Network A和Network B。那么容器A和容器B之间是可以实现通信的，因为都接入了Network A。但是容器A和容器C不可以通过容器B的两个Endpoint通信

## CNM规范实现：Libnetwork

Libnetwork是CNM的一个标准实现。Libnetwork是开源库，采用Go语言编写（跨平台的），也是Docker所使用的库，Docker网络架构的核心代码都在这个库中

Libnetwork实现了CNM中定义的全部三个组件，此外它还实现了本地服务发现、基于Ingress的容器负载均衡，以及网络控制层和管理层等功能

## 驱动

驱动主要负责实现数据层相关内容，例如网络的连通性和隔离性是由驱动来处理的。驱动通过实现特定网络类型的方式扩展了 Docker网络栈，例如桥接网络和覆盖网络

Docker内置了若干驱动，通常被称作原生驱动或者本地驱动。例如Bridge Driver、Host Driver、Overlay Driver、MacVLan Driver、IPVLan Driver、None Driver等等。每个驱动负责创建其上所有网络资源的创建和管理

## Docker常见的网络类型

1. bridge网络：bridge驱动会在Docker管理的主机上创建一个Linux网桥。默认情况下，网桥上的容器可以相互通信（例如可以使用`ping`命令相互连通）。也可以通过bridge驱动程序配置，实现对外部容器的访问。Docker容器的默认网络驱动.当我们需要多个容器在同一个 Docker主机上通信时，桥接网络是最佳选择。在Docker中，如果是自定义的bridge网络，那么可以通过DNS解析实现相互通信（例如`ping`参数可以是容器名称，而不需要是IP地址），但是默认的bridge网络只能通过IP地址进行相互通信。bridge网络工作模式如下图所示：

    <img src="docker-network.assets\b96c6937-2e8a-486b-af05-4346d2fba9b7.webp" style="width: 70%">

2. host网络：对于独立容器，移除容器和Docker主机之间的网络隔离，并直接使用主机的网络。当网络堆栈不应该与 Docker主机隔离，但是希望容器的其他资源被隔离时，主机网络是最佳选择。这种网络当开放端口时需要确保容器要使用的端口在Docker主机上没有使用，否则对应程序会报端口绑定失败的错误。host网络工作模式如下图所示：

    <img src="docker-network.assets\24faa3ab-1c91-4821-a1ad-1ecabcbfe193.webp" style="width: 70%">

3. container网络：这个模式指定新创建的容器和引进存在的一个容器共享一个网络，而不是和宿主机共享。新创建的容器不会创建自己的网卡，配置自己的IP，而是和一个指定的容器共享IP、端口等，两个容器除了网络方面，其他的如文件系统、进程列表等还是隔离的。两个容器的进程可以通过lo（Loopback本地回环）网卡设备通信。对于这种网络来说，如果宿主容器断开连接，寄生容器的网络信息就只剩下lo，只有宿主容器和寄生容器都重启才会重新保持一致。container网络工作模式如下图所示：

    <img src="docker-network.assets\73730f74-4c49-46b0-b74f-9454e58ee63d.webp" style="width: 70%">

4. none网络：Docker容器拥有自己的Network Namespace，但是，并不为Docker容器进行任何网络配置。也就是说，这个Docker容器没有网卡、IP、路由等信息。容器完全网络隔离
5. overlay网络：借助Docker集群模块Docker Swarm搭建的跨Docker Daemon网络。将多个Docker守护进程连接在一起，使集群服务能够相互通信。当我们需要运行在不同Docker主机上的容器进行通信时，或者当多个应用程序使用集群服务协同工作时，覆盖网络是最佳选择

网络驱动与Libnetwork的关系：

<img src="docker-network.assets\download.png">

在Docker安装时，会自动安装一块Docker网卡称为docker0，它是一个网桥设备，主要用于Docker各容器及宿主机的网络通信

## 创建网络

使用下面的命令创建网络：

```bash
docker network create [选项] 网络名称
```

常见选项：

- `-d, --driver`：网络驱动，默认为桥接网络`bridge`
- `--gateway`：网关地址
- `--subnet`：表示网段的CIDR格式的子网
- `--ipv6`：启用IPv6

例如：

```bash
docker network create --driver=bridge --subnet=192.168.0.0/16 br0
```

上面的方式可以创建以下常见的网络：

- `bridge`：默认桥接网络
- `host`：与宿主机共用网络栈  
- `overlay`：多主机/Swarm跨主机网络  
- `macvlan`：为容器分配MAC，像物理机接入网络  
- `ipvlan`：类似`macvlan`，但共享MAC  
- `none`：无网络  

需要注意，这种方式不会创建出container网络，因为container不是网络驱动，container表示“新容器共享已有容器的网络栈”，不创建独立网络或驱动实例

## 查看网络详细信息

使用下面的命令查看网络详细信息：

```bash
docker network inspect [选项] 网络名称...
```

常见选项：

- `-f`：指定输出格式

在这个命令中可以查看到`Containers`字段，这个字段表示当前网络被哪些容器连接，而`IPAM`中的`Config`字段可以看到路由器地址和子网掩码

## 使容器连接到指定网络

使用下面的命令使容器连接到指定网络：

```bash
docker network connect [选项] 网络名称 容器名称
```

常见选项：

- `--ip`：指定IPv4地址
- `--ip6`：指定IPv6地址

需要注意，这个连接方式相当于对已经创建/运行的容器进行追加网络，而不会覆盖掉容器创建/运行时已有的网络。但是注意，不能把容器连接到host网络，也不建议对网络模式是container的容器进行连接

除了上面的方式以外，还可以使用`--network`选项让容器在创建/启动时就确定好网络，使用如下：

```bash
docker run/create --network 网络模式（host、none、bridge等）/bridge网络名称/container:已有网络的容器名称 
```

这种创建方式一旦指定了`--network`和对应的值，就不会直接让容器在创建时就连接默认的`bridge`网络，而是直接使用指定的网络，若指定为`bridge`，则等同于显式连接默认桥接网络

## 使容器从指定网络中断开连接

使用下面的命令使容器从指定网络中断开连接：

```bash
docker network disconnect [选项] 网络名称 容器名称
```

常见选项：

- `-f`：强制退出

## 清除不使用的网络

使用下面的命令清除不使用的网络：

```bash
docker network prune [选项]
```

常见选项：

- `-f`：不进行删除提示

## 删除网络

使用下面的命令删除网络：

```bash
docker network rm [选项] 网络名称...
```

常见选项：

- `-f`：用于强制删除网络。通常情况下，如果网络还有容器连接，该命令会失败。加上`-f`后，会先断开这些连接（或忽略相关阻碍），然后删除网络

## 列出所有网络

使用下面的命令列出所有网络：

```bash
docker network ls [选项]
```

常见选项：

- `-f, --filter`：指定过滤条件
- `--format`：指定格式
- `--no-trunc`：不截断
- `-q, --quiet`：仅显示id