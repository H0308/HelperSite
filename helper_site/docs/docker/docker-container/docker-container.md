<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Docker容器

## 容器介绍

Docker容器是基于镜像创建的轻量级运行环境，把应用及其依赖一起打包，通过操作系统级隔离来运行，同一台机器上可以快速启动、停止和扩缩容多个容器，且具备良好的可移植性与一致性

## 容器状态与转换关系

容器核心状态（常见）：

- Created：容器已创建但未运行（尚未启动进程）
- Running：容器进程正在运行
- Paused：容器进程被暂停（冻结）
- Restarting：容器因重启策略或异常退出后正在重启
- Exited/Stopped：容器进程已结束（正常或异常退出）
- Dead：容器无法被正常管理/清理的异常状态（较少见）

<img src="docker-container.assets\download.png">

## 创建容器

使用下面的命令创建容器：

```bash
docker create [选项] 镜像名称 [命令] [命令行参数]
```

常见选项：

- `-i`：以交互模式运行容器，通常与`-t`同时使用 
- `-P`：随机端口映射，容器内部端口随机映射到主机端口  
- `-p`：指定端口映射，格式为：`主机（宿主）端口:容器端口`（需要注意主机端口不要出现已经用过的端口，否则会报错端口被使用的错误）
- `-t`：为容器重新分配一个伪输入终端，通常与`-i`同时使用  
- `--name="nginx-lb"`：为容器指定一个名称
- `-h "mars"`：指定容器的`hostname`
- `-e username="ritchie"`：设置环境变量  
- `--cpuset-cpus="0-2"`或`--cpuset-cpus="0,1,2"`：绑定容器到指定CPU运行  
- `-m`：设置容器使用内存最大值
- `--network="bridge"`：指定容器的网络连接类型  
- `--link=[]`：添加链接到另一个容器  
- `--volume, -v`：绑定一个卷  
- `--rm`：容器退出时自动删除容器  
- `--restart`：自动重启

??? info "如何理解`-i`和`-t`"

    `-i`实际上就是提供了一个一问一答的入口，用户输入命令可以得到回答，但是并不会显示主机信息、用户信息等，`-t`只是提供主机信息、用户信息等，但是用户输入命令不会有任何回答

## 启动容器

运行已经创建并且处于停止的容器可以使用下面的命令：

```bash
docker start 容器名称...
```

## 停止容器

停止正在运行的容器可以使用下面的命令：

```bash
docker stop 容器名称...
```

常见选项：

- `-s, --signal`：用于指定发送给容器主进程的停止信号，可以使用Linux的信号编号，例如信号`9`表示强制杀死信号`SIGKILL`

## 连接正在运行的指定容器

使用下面的命令连接正在运行的指定容器：

```bash
docker attach [选项] 容器名称
```

常见选项：

- `--sig-proxy`：控制是否把终端收到的信号转发给容器主进程。默认情况下为`--sig-proxy=true`，即产生的信号会转发给容器主进程，设置为`--sig-proxy=false`信号不会转发到容器内进程，避免误退出或被中断

例如：

```bash
docker attach --sig-proxy=false mynginx
```

## 查看指定容器日志

使用下面的命令查看指定容器的运行日志：

```bash
docker logs 容器名称
```

常见选项：

- `-f, --follow`：实时跟踪日志输出  
- `--since`：显示某个开始时间的所有日志  
- `-t, --timestamps`：显示时间戳  
- `-n, --tail`：仅列出最新N条容器日志

例如，实时查看最新的5条日志：

```bash
docker logs -n 5 -f mynginx
```

## 列出容器

使用下面的命令列出**正在运行**的容器：

```bash
docker ps
```

常见选项：

- `-a`：显示所有容器，包括未运行的  
- `-f`：根据条件过滤显示的内容  
- `--format`：指定返回值的模板文件（如`json`或`table`）  
- `-l`：显示latest的容器  
- `-n`：列出最近创建的n个容器  
- `--no-trunc`：不截断输出  
- `-q`：静默模式，只显示容器编号  
- `-s`：显示总的文件大小  

## 在容器中执行命令

使用下面的命令可以在容器中执行命令：

```bash
docker exec [选项] 容器名称 命令 [命令行参数]
```

常见选项：

- `-d`：分离模式，在后台运行  
- `-i`：即使没有附加也保持STDIN打开  
- `-t`：分配一个伪终端
- `-e`：设置环境变量
- `-u, --user`：指定用户 `<name|uid>[:<group|gid>]`  
- `-w, --workdir`：指定工作目录  

例如，在容器中执行可交互的终端`bash`：

```bash
docker exec -it mynginx bash
```

## 创建一个容器并运行指定命令

使用下面的命令创建一个容器并运行指定命令：

```bash
docker run [选项] 镜像名称 [命令][命令行参数]
```

常见选项：

- `-d`：后台运行容器，并返回容器ID
- 其余选项参考[创建容器](https://www.help-doc.top/docker/docker-container/docker-container.html#_3)

## 重启容器

使用下面的命令重启容器：

```bash
docker restart 容器名称...
```

常见选项：

- `-s, --signal`：用于指定发送给容器主进程的停止信号，可以使用Linux的信号编号，例如信号`9`表示强制杀死信号`SIGKILL`

## 杀死容器

使用下面的命令杀死容器：

```bash
docker kill 容器名称...
```

常见选项：

- `-s, --signal`：用于指定发送给容器主进程的停止信号，可以使用Linux的信号编号，例如信号`9`表示强制杀死信号`SIGKILL`

需要注意的是，默认情况下，停止容器命令发送的是`SIGTERM`信号，杀死容器发送的是`SIGKILL`信号