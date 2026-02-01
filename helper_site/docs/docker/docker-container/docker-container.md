<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

<!-- 添加对Katex的支持 -->
<script defer src="/javascripts/katex.min.js"></script>
<script defer src="https://help-site.oss-cn-hangzhou.aliyuncs.com/js/katex.min.js"></script>
<script defer src="https://help-site.oss-cn-hangzhou.aliyuncs.com/js/auto-render.min.js"></script>

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
- `--restart`：自动重启，写法如下：
    
    ```bash
    docker create --restart=<policy> 镜像名
    ```

    常见策略：
    
    - `no`：默认值，不自动重启  
    - `on-failure[:max-retries]`：仅在非0退出码时重启，可选最大重试次数  
    - `always`：无论退出原因都重启  
    - `unless-stopped`：与`always`类似，但手动停止后不会再自动重启


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

## 查看指定容器内的进程信息

使用下面的命令查看指定容器内的进程信息：

```bash
docker top 容器名称 [选项]
```

其中的选项可以带上Linux中`ps`命令的选项，例如：

```bash
docker top 132e6efd910f axj
```

## 查看指定容器的资源使用情况

使用下面的命令查看指定容器的资源使用情况：

```bash
docker stats [选项] 容器名称...
```

常见选项：

- `--all, -a`：显示所有的容器，包括未运行的
- `--format`：指定返回值的模板文件（如`table`、`json`）
- `--no-stream`：展示当前状态后直接退出，不再实时更新（默认情况下实时更新）
- `--no-trunc`：不截断输出

## 查看指定容器的详细信息

使用下面的命令查看指定容器的详细信息：

```bash
docker container inspect 容器名称
```

- `-f`：指定返回值的模板文件（如`table`、`json`）
- `-s`：显示总的文件大小

需要注意的是，命令可以省略`container`，Docker会根据容器名称区分是镜像还是容器

## 查看指定容器的端口映射

使用下面的命令查看指定容器的端口映射：

```bash
docker port 容器名称 [指定端口/指定协议]
```

例如，查看`mynginx`的TCP协议下的80端口：

```bash
docker port mynginx 80/tcp
```

## 宿主机和容器之间的数据拷贝

使用下面的命令进行宿主机和容器之间的数据拷贝：

```bash
# 宿主机到容器
docker cp [选项] 宿主机目标路径 容器名称:文件路径
# 容器到宿主机
docker cp [选项] 容器名称:文件路径 宿主机目标路径
```

## 查看指定容器中的文件修改

使用下面的命令查看指定容器中的文件修改：

```bash
docker diff 容器名称
```

常见的标记：

- `A`：Added，新增文件/目录
- `C`：Changed，内容或元数据发生变化（例如权限、时间戳等）
- `D`：Deleted，被删除的文件/目录

## 利用容器创建一个镜像

使用下面的命令利用容器创建一个镜像：

```bash
docker commit [选项] 容器名称 [镜像名称[:tag]]
```

常见选项：

- `-a`：提交的镜像作者
- `-c`：使用Dockerfile中的指令来创建镜像，可修改启动指令，具体见[Docker镜像制作](javascript:;)
- `-m`：提交时的说明文字 
- `-p`：在创建进行时将容器暂停

例如：

```bash
docker commit -a 'epsda' -m 'commit mynginx' -p mynginx
# 修改启动命令CMD的值
docker commit -c 'CMD ["tail","-f","/etc/hosts"]' mynginx mynginx:v2
```

## 暂停正在运行的容器

使用下面的命令暂停正在运行的容器：

```bash
docker pause 容器名称...
```

## 继续运行容器

使用下面的命令继续运行容器：

```bash
docker unpause 容器名称...
```

## 删除容器

使用下面的命令删除容器：

```bash
docker rm 容器名称...
```

常见选项：

- `-f`：删除正在运行的容器

需要注意的是，默认情况下该命令只会删除停止的容器，如果要删除正在运行的容器，就要带`-f`

## 导出容器内容到归档文件中

使用下面的命令导出容器内容到归档文件（后缀为`.tar`）中：

```bash
docker export [选项] 容器名称
```

常见选项：

- `-o`：待写入的文件

该命令尝搭配下面的命令使用：

```bash
docker import [选项] 归档文件名称 [镜像名称[:tag]]
```

常见选项：

- `-c`：使用Dockerfile中的指令来创建镜像 
- `-m`：提交时的说明文字 

需要注意的是，默认情况下，使用`import`命令得到的镜像中`CMD`、`ENV`的值都是`null`，而`load`命令会保留

## 查看容器退出码

使用下面的命令查看容器退出码：

```bash
docker wait 容器名称...
```

需要注意，一旦执行这个命令，终端会阻塞直到容器停止打印出退出码。如果有指定了多个容器，会一直阻塞到最后一个容器退出才会显示所有停止的退出码

## 重命名容器

使用下面的命令重命名容器：

```bash
docker rename 源容器名称 目标名称
```

该命令可以修改正在运行的容器的名称

## 删除闲置容器

使用下面命令删除闲置（已经停止的）容器：

```bash
docker container prune [选项]
```

常见选项：

- `-f, --force`：不进行删除确认提示

## 更新容器的资源配置

使用下面的命令更新容器的资源配置：

```bash
docker update [选项] 容器名称...
```

常见选项：

- `--restart`：设置容器重启配置
- `--cpus`：CPU数量
- `--cpuset-cpus`：指定可使用的CPU
- `--memory`：内存限制
- `--memory-swap`：交换内存限制
- `--cpu-period`：指定容器对CPU的使用在多长时间内重新分配一次
- `--cpu-quota`：指定在该周期内可用于运行容器的最长时间  

其中`--cpu-period`和`--cpu-quota`是一组配合使用的“时间片+配额”机制，核心概念是：**在一个固定周期内，容器最多能用多少CPU时间**：

- `--cpu-period`：调度周期长度，单位是微秒（$\mu s$）
- `--cpu-quota`：在这个周期内，容器最多可用的CPU时间，单位也是微秒 

所以$可用CPU比例 = \frac{quota}{period}$

举例：

- `--cpu-period=100000 --cpu-quota=200000`：表示每100ms里最多用200ms CPU时间，相当于2个CPU
- `--cpu-period=100000 --cpu-quota=25000`：表示每100ms里最多用25ms CPU时间，相当于0.25个CPU