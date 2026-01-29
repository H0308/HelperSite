<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Docker镜像与镜像仓库

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

需要注意的是，推送镜像必须要确保当前登录的账户有对应仓库的权限，否则无法推送当前镜像到指定的仓库，此时会报错。如果要推送指定的镜像首先需要使用[标签命令](#)为指定的镜像打上标签再进行推送

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
- `-q`：只显示镜像 ID

## 查看指定镜像的详细信息

使用下面的命令查看指定镜像的详细信息：

```bash
docker image inspect [选项] 镜像名称...
```

详细信息一般可以看到镜像的启动命令、启动端口等信息，具体内容取决于镜像

## 为指定镜像设置标签

使用下面的命令进行标签设置：

```bash
docker tag 源镜像标签 新镜像名称:标签
```

例如：

```bash
docker tag ubuntu:22.04 myregistry.com/myubuntu:22.04
```

