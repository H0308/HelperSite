<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Docker镜像与镜像仓库

## 镜像与镜像仓库介绍

Docker镜像是打包了应用及其运行所需依赖、环境和配置的只读模板，用来创建容器（类似于C++或者Java中的类，用于创建对象）；镜像仓库则是存放和分发镜像的集中式存储服务，用户可以从仓库拉取镜像或将本地镜像推送到仓库，实现镜像的共享、版本管理与部署。

## 从镜像仓库登录和注销

登录到Docker镜像仓库可以使用下面的命令：

```bash
docker login
```

默认情况下，该命令会直接登录到官方的Docker Hub，也可以指定镜像仓库地址、用户名和密码，格式如下：

```bash
docker login [-u 用户名] [-p 密码] [镜像仓库地址]
```

从镜像仓库登出时可以使用下面的命令：

```bash
docker logout
```

默认情况下是从官方镜像仓库登出，如果需要登出指定镜像仓库，则需要指定对应的仓库地址，即：

```bash
docker logout [镜像仓库地址]
```

## 从镜像仓库拉取镜像

使用下面的命令从镜像仓库拉取镜像：

```bash
docker pull [选项] 镜像名称[:tag|@DIGEST]
```

!!! note

    其中`tag`表示镜像标签，`DIGEST`表示镜像的SHA256值，选择任意一种方式即可

常见的选项有：

- `-a`：拉取所有镜像
- `--disable-content-trust`：忽略镜像校验（默认情况下开启校验）

例如：

```bash
docker pull nginx:1.24.3
```

## 向镜像仓库推送镜像

使用下面的命令可以将本地的镜像推送到指定的镜像仓库：

```bash
docker push [选项] 镜像名称[:tag]
```

常见的选项有：

- `-a`：拉取所有镜像
- `--disable-content-trust`：忽略镜像校验（默认情况下开启校验）

需要注意的是，推送镜像必须要确保当前登录的账户有对应仓库的权限，否则无法推送当前镜像到指定的仓库，此时会报错。如果要推送指定的镜像首先需要使用[标签命令](https://www.help-doc.top/docker/docker-image-registry/docker-image-registry.html#_7)为指定的镜像打上标签再进行推送

例如现在有一个仓库为`epsda/test`，正常推送的命令为：

```bash
docker push espda/test:tagname
```

## 在镜像仓库搜索镜像

使用下面的命令进行搜索：

```bash
docker search [镜像名称]
```

常见的选项有：

- `--no-trunc`：显示完整的镜像描述信息
- `-f 过滤条件`：列出满足指定过滤条件的镜像，具体过滤条件可以参考[文档](https://docs.docker.com/reference/cli/docker/search/#filter)

这个命令不常用，可以访问[官方仓库地址](https://hub.docker.com/explore)进行图形化界面的搜索

## 列出本地所有镜像

使用下面的命令列举出本地所有或者指定名称存在的镜像：

```bash
docker images [选项] [镜像名称][:tag]
```

常见的选项有：

- `-a`：列出本地所有的镜像（含中间映像层，默认情况下，过滤掉中间映像层）
- `--digests`：显示镜像的摘要信息
- `-f`：显示满足条件的镜像，过滤条件可以参考[官方文档](https://docs.docker.com/reference/cli/docker/image/ls/#filter)
- `--format`：指定返回值的模板文件
- `--no-trunc`：显示完整的镜像信息
- `-q`：只显示镜像ID

## 查看指定镜像的详细信息

使用下面的命令查看指定镜像的详细信息：

```bash
docker image inspect [选项] 镜像名称...
```

详细信息一般可以看到镜像的启动命令、启动端口等信息，具体内容取决于镜像

## 为指定镜像设置标签

使用下面的命令进行标签设置：

```bash
docker tag 源镜像名称:标签 新镜像名称:标签
```

例如：

```bash
docker tag ubuntu:22.04 myregistry.com/myubuntu:22.04
```

## 删除指定镜像

使用下面的命令进行镜像删除：

```bash
docker image rmi [选项] 镜像名称...
```

常见的选项有：

- `-f`：强制删除
- `--no-prune`：不移除当前镜像的过程镜像，默认情况下不带该选项

需要注意的是，在删除时，只有删除最后一个引用的才会完全删除数据，否则只是取消标签

那么如何确认制定镜像是否有其他标签引用呢？可以通过`docker image inspect`查看`RepoTags`字段，例如当前的`nginx:1.29.4`有被两个标签为`epsda/test:v1.0`和`epsda/test:v2.0`引用：

```bash
$ docker image inspect nginx:1.29.4
[
    {
        "Id": "...",
        "RepoTags": [
            "epsda/test:v1.0",
            "epsda/test:v2.0",
            "nginx:1.29.4"
        ],
        ...
    }
    ...
]
```

根据输出可以看到标签有三个，删除时，如果仅仅删除`epsda/test:v1.*`那么结果只是取消标签，如下：

```bash
$ docker rmi epsda/test:v1.0 epsda/test:v2.0
Untagged: epsda/test:v1.0
Untagged: epsda/test:v2.0
```

直到删除`nginx:1.29.4`才会提示删除数据：

```bash
$ docker rmi nginx:1.29.4
Untagged: nginx:1.29.4
Deleted: sha256:c881927c4077710ac4b1da63b83aa163937fb47457950c267d92f7e4dedf4aec
```

## 归档指定镜像

使用下面的命令进行镜像归档：

```bash
docker save [选项] 镜像名称...
```

使用时经常带上`-o`选项表示输出的文件（默认是`tar`文件，建议带上`.tar`后缀方便识别）：

```bash
docker save 镜像名称 -o 输出文件.tar
```

## 加载指定镜像

使用下面的命令进行镜像加载：

```bash
docker load [选项] 待加载的文件
```

使用时经常带上`-i`以指定需要加载的文件：

```bash
docker load -i 待加载的文件
```

可以带上`-q`选项以精简输出的信息

## 查看镜像构建历史（层信息）

使用下面的命令查看镜像构建历史：

```bash
docker history [选项] 镜像名称
```

常见选项：

- `-H, --human`：大小和日期采用易读形式（默认）
- `--no-trunc`：显示全部信息，不进行截断
- `-q, --quiet`：只显示镜像ID信息

## 清理本地未被使用的镜像

使用下面的命令进行镜像清理：

```bash
docker image prune [选项]
```

默认行为是：只会删除悬空镜像（dangling images），也就是没有标签、也没有被任何容器引用的镜像层

常见选项：

- `-a`：删除所有未被任何容器使用的镜像（不只是悬空镜像）
- `--filter 过滤条件`：删除满足指定条件的镜像
- `-f`：不提示确认，直接删除

## 从归档中创建镜像

具体见[Docker容器章节](https://www.help-doc.top/docker/docker-container/docker-container.html#_23)

## 构建镜像

具体见[Docker镜像制作章节](javascript:;)