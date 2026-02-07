<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Docker容器编排基础

## docker-compose介绍 

docker-compose是Docker官方的开源项目，使用Python编写，实现上调用了Docker服务的API进行容器管理及编排，其官方定义为定义和运行多个Docker容器的应用

docker-compose中有两个非常重要的概念：

- 服务（service）：一个应用的容器，实际上可以包括若干运行相同镜像的容器实例
- 项目（project）：由一组关联的应用容器组成的一个完整业务单元，在`docker-compose.yml`文件中定义，整个`docker-compose.yml`定义一个项目

Compose的默认管理对象是项目，通过子命令对项目中的一组容器进行便捷地生命周期管理。通过compose可以方便的管理多个服务。如下图所示：

<img src="docker-compose-base.assets\6de6134e-8e57-4594-a538-5eb4bc80cc09.webp">

## 为什么需要docker-compose

Docker是一个轻量化的应用程序，Docker官方推荐每个Docker容器中只运行一个进程。如果一个应用需要涉及到MySQL、nginx等环境，那么我们需要分别为应用、数据库和nginx创建单独的Docker容器，然后分别启动容器。想象一下，当构建好Docker之后，每次启动应用，都至少需要执行运行命令三次，或者写一些脚本来实现，这样会比较繁琐。另外，这些Docker容器都是分散独立的，也不方便镜像管理。那既然这些Docker容器都是为了同一个应用服务，我们就应该把它们放到一起，这就引出了docker-compose来解决这类型的问题

## docker-compose相关命令

对于Compose来说，大部分命令的对象既可以是项目本身，也可以指定为项目中的服务或者容器。如果没有特别的说明，命令对象将是项目，这意味着项目中所有的服务都会受到命令影响

docker-compose命令基本格式如下：

```bash
docker compose [选项] 特定命令 [参数]
```

通用选项：

- `-f, --file`：指定使用的`docker-compose`的模版文件，默认为`docker-compose.yml`
- `-p, --project-name`：指定项目的名称，默认使用当前目录名称作为项目名称

Docker Compose的常见命令和作用如下表：

| 命令 | 功能 |
|------|------|
| `docker compose build` | 构建服务 |
| `docker compose config` | 规范的格式来显示服务配置 |
| `docker compose cp` | 在本地系统和服务容器直接拷贝文件 |
| `docker compose create` | 创建服务的容器 |
| `docker compose down` | 停止所有容器，并删除容器 |
| `docker compose events` | 从服务器获取实时事件 |
| `docker compose exec` | 在容器中执行命令 |
| `docker compose images` | 列出所有容器使用的镜像 |
| `docker compose kill` | 强制停止服务的容器 |
| `docker compose logs` | 显示日志 |
| `docker compose ls` | 显示所有项目 |
| `docker compose pause` | 暂停服务 |
| `docker compose port` | 列出所有的端口映射 |
| `docker compose ps` | 该命令可以列出项目中目前的所有容器 |
| `docker compose pull` | 拉取服务镜像 |
| `docker compose push` | 推送服务镜像 |
| `docker compose restart` | 重启或者重启某个服务 |
| `docker compose rm` | 删除服务停止的容器 |
| `docker compose run` | 在指定服务容器上执行相关的命令 |
| `docker compose start` | 启动当前停止的某个容器 |
| `docker compose stop` | 停止当前运行的某个容器 |
| `docker compose top` | 显示运行的进程 |
| `docker compose unpause` | 恢复服务 |
| `docker compose up` | 构建、（重新）创建、启动、链接一个服务相关的容器 |
| `docker compose version` | 查看版本 |

命令的详细介绍参考[官方文档](https://docs.docker.com/reference/cli/docker/compose/)，下面对常见的命令进行介绍

### `docker compose up`

使用该命令会默认会根据当前目录下的配置文件进行项目容器的启动等行为，基本语法如下：

```bash
docker compose up [选项] [服务名称...]
```

常见选项：

- `-d`：在后台运行服务容器，推荐在生产环境下使用该选项
- `--force-recreate`：强制重新创建容器，不能与`--no-recreate`同时使用
- `--no-recreate`：如果容器已经存在，则不重新创建，不能与`--force-recreate`同时使用

需要注意的是，这个命令可以不指定任何一个服务名称，这种情况下默认启动的就是对模板文件中的所有服务进行处理。另外，如果指定的服务已经有正在运行的容器，那么该命令默认行为既不是强制重新创建，也不是不重新创建，而是按需创建（例如服务配置发生修改、镜像发生变化等）

### `docker compose down`

使用该命令会停止所有容器并删除容器和网络，基本语法如下：

```bash
docker compose down [选项] [服务...]
```

常见选项：

- `-v`：删除容器同时删除目录映射。默认不删除

### `docker compose config`

使用该命令可以按照规范的格式输出docker-compose的配置文件，如果文件格式有错误，那么会进行报错，基本语法如下：

```bash
docker compose config [选项]
```

该命令默认检查的是当前目录下的模板文件

### `docker compose run`

该命令可以在指定服务容器上执行相关的命令，官方推荐的是执行一次性的命令，基本语法如下：

```bash
docker compose run 服务名称 一次性命令 命令行参数
```

常见选项：

- `-d`：后台运行容器
- `--name NAME`：为容器指定一个名字
- `--entrypoint CMD`：覆盖默认的容器启动指令
- `-e KEY=VAL`：设置环境变量值，可多次使用选项来设置多个环境变量
- `-u, --user=""`：指定运行容器的用户名或者uid
- `--rm`：运行命令后自动删除容器
- `-p, --publish=[]`：映射容器端口到本地主机

例如启动一个ubuntu服务容器，并执行`ping docker.com`命令：

```bash
docker compose run ubuntu ping docker.com
```

## docker-compose模板文件格式

docker-compose文件基本结构如下：

```yaml
version: 定义docker-compose的语法版本
services（服务集合）:
  servicename（具体服务名称，可以不止一个）:
    image: 镜像名称
    command: 可选，设置后会覆盖镜像的启动命令
    environment: 可选，相当于使用运行/创建容器命令时的--env选项
    volumes: 可选，相当于使用运行/创建容器命令时的-v选项
    networks: 可选，相当于使用运行/创建容器命令时的--network选项
    ports: 可选，相当于使用运行/创建容器命令时的-p选项
    expose: 可选，指定容器暴露的端口
    build: 构建目录
    depends_on: 依赖服务
    env_file: 通过读取文件设置环境变量
networks: 可选，相当于使用创建网络命令
volumes: 可选，相当于使用创建容器命令
```

docker-compose模板文件具体的编写方式可以参考[官方文档](https://docs.docker.com/reference/compose-file/)和[课件](https://www.kdocs.cn/l/cbsXTXtGPxVI?from=docs)中关于docker-compose文件部分
