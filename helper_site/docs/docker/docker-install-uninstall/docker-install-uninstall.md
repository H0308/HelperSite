<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Ubuntu和Windows下安装和卸载Docker

## Ubuntu安装Docker

### 更新APT软件源和安装必要工具

打开终端（Terminal），先更新包索引并安装所需依赖：

```bash
sudo apt update
sudo apt install -y ca-certificates curl
```

### 添加Docker官方GPG密钥

创建密钥目录，并下载官方签名密钥：

```bash
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

如果下载时出现：

```bash
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
curl: (35) Recv failure: 连接被对方重置
```

这个错误基本上说明Ubuntu机器无法通过HTTPS正常访问Docker官方的GPG Key下载地址`download.docker.com`，连接被远程服务器重置（Connection reset by peer），常见原因是网络访问受限、TLS/HTTPS连接问题，尤其是在国内或者有防火墙/代理环境的服务器上经常出现

解决方式可以考虑切换为国内的镜像源：

改用国内镜像（如阿里云或腾讯云）来下载 Docker 的 GPG key：

```bash
sudo curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
```

或者腾讯云：

```bash
sudo curl -fsSL https://mirrors.cloud.tencent.com/docker-ce/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
```

再继续后面的步骤

### 添加Docker软件源

```bash
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF
```

然后：

```bash
sudo apt update
```

### 安装Docker Engine

运行以下命令安装Docker及其常用组件（包括 CLI、containerd、Compose 插件等）：

```bash
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

安装完成后，Docker服务会自动启动。

### 验证Docker是否成功安装

```bash
sudo docker run hello-world
```

如果输出`Hello from Docker!`则说明 Docker 安装成功。

也可以输入下面的命令查看Docker版本：

```bash
docker --version
```

使用下面的命令查看Docker的运行状态：

```bash
sudo systemctl status docker
```

使用下面的命令查看Docker更详细的信息：

```bash
sudo docker info
```

### 允许当前用户不使用 `sudo` 运行Docker（可选）

（安全视项目情况而定）

```bash
sudo usermod -aG docker $USER
```

然后退出终端重新登录，使权限更新生效

### 配置开机自启

使用下面的命令：

```bash
sudo systemctl enable docker
```

## Ubuntu卸载Docker

### 卸载Docker包

```bash
sudo apt purge -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras
```

这步骤会删除Docker引擎和核心组件包

### 删除Docker数据文件（可选但通常需要）

注意：这步会**永久删除所有容器、镜像、卷、网络等数据**。

```bash
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
```

如有自定义配置，也可以清理：

```bash
sudo rm -rf /etc/docker
```

### 清理软件源和GPG密钥

```bash
sudo rm /etc/apt/sources.list.d/docker.sources
sudo rm /etc/apt/keyrings/docker.asc
```

之后可以执行：

```bash
sudo apt update
sudo apt autoremove -y
```

彻底清理残留依赖

### 其他常见卸载清理（可选）

如果Docker是通过Snap安装的，可以：

```bash
snap list | grep docker
sudo snap remove docker
```

也可检查用户组：

```bash
sudo groupdel docker
```

确保不会留下配置或组设置

## Windows安装和卸载Docker

下载地址：[下载Docker Desktop](https://docs.docker.com/desktop/?utm_source=chatgpt.com)

Windows下安装Docker首先需要确保开启了虚拟化。通常建议选用WSL2作为后端（需要启用`Windows Subsystem for Linux2`功能）

需要注意，建议同时在Windows功能中打开Hyper-V和Windows Subsystem For Linux

!!! note

    如果当前的Windows不支持Hyper-V，那么选“Use WSL 2 instead of Hyper-V”

双击安装程序安装Docker即可，卸载Docker时使用相关的卸载工具卸载即可

## 切换Docker镜像源

### 创建或编辑 Docker 配置文件

```bash
sudo mkdir -p /etc/docker
sudo nano /etc/docker/daemon.json
```

如果文件已经存在，就直接编辑它

### 添加国内镜像源地址

在 `daemon.json` 中写入如下内容，例如：

```json
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
```

其中：

- `docker.m.daocloud.io` — DaoCloud公共加速器
- `hub-mirror.c.163.com` — 网易云镜像加速器
- `mirror.baidubce.com` — 百度云镜像加速器

也可以根据网络测试结果换成其他可用镜像源，保存后退出当前编辑器

### 重新加载并重启 Docker

保存配置后运行：

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

这会使新的镜像源生效

### 检查镜像源是否生效

运行：

```bash
docker info
```

你应该能看到类似这样的输出：

```
Registry Mirrors:
 https://docker.m.daocloud.io/
 https://hub-mirror.c.163.com/
 https://mirror.baidubce.com/
```

如果看见了上面这些镜像地址，就说明配置成功了。需要注意：

- JSON格式必须准确，要确保逗号、引号等符号正确，否则配置文件会导致Docker启动失败
- 如果Docker启动失败，可以查看状态日志：

    ```bash
    sudo journalctl -u docker.service -n 100
    ```

### 专属阿里云加速器（可选）

如果希望镜像下载尽可能稳定和快，可以：

1. 登录阿里云账号
2. 在“容器镜像服务” → 镜像加速器页面获取你自己的加速地址
3. 在 `daemon.json` 的 `registry-mirrors` 中填上你个人的专属加速地址，例如：

```
"https://xxxxx.mirror.aliyuncs.com"
```

也可以同时写入多个镜像源

## 配置镜像目录

Docker默认的安装目录为`/var/lib/docker`,这里面会存放很多很多镜像,所以我们在安装的时候需要考虑这个目录的空间,有三种解决方案：

1. 将`/var/lib/docker`挂载到一个大的磁盘,这种一般我们能控制挂载目录,像腾讯云这种云厂商在安装 K8s 的节点的时候提供了挂载选项,可以直接挂载这个目录过去
2. 安装之前挂载一个大的磁盘，然后创建一个软链接到`/var/lib/docker`，这样就自动安装到我们空间比较大的磁盘了
3. 安装了Docker，然后发现忘了配置这个目录，需要修改Docker的配置文件

下面主要介绍第三种方案：

假设现在有一个磁盘比较大的目录`/data`，首先创建配置文件并输入下面的内容：

```json
{
    "data-root": "/data/var/lib/docker"
}
```

重新加载并重启Docker：

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

修改完成后原目录中的内容也会迁移到新的目录