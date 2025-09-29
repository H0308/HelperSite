# 内网穿透部署

## 资源准备

1. 内网穿透软件包：[frp](https://github.com/fatedier/frp/releases/tag/v0.65.0)，下载`frp_0.65.0_linux_amd64.tar.gz
`
2. 可以连接公网的云服务器（本次是Ubuntu 24.04）
3. 本地虚拟机（本次是Ubuntu 24.04）

## 云服务器`frp`服务配置

下载并解压内网穿透软件包，打开`frps.toml`文件，里面存放着当前`frp`服务的服务端端口，这个端口用于后续`frp`客户端进行连接，例如设置端口为8081：

```ini
bindPort = 8081
```

使用下面的命令启动`frp`服务：

```bash
# -c表示指定配置文件
./frps -c frps.toml 
```

启动后可以看到云服务器开始在`0.0.0.0:8081`端口开始监听

## 本地虚拟机`frp`服务配置

打开`frpc.toml`文件，首先配置要连接的`frp`服务端IP地址和端口，例如：

```ini
serverAddr = "8.110.214.88" # frp服务端IP地址
serverPort = 7011 # frp服务端服务的端口
```

接下来配置代理，例如：

```ini
[[proxies]]
name = "remote-connect" # 服务名称，自定义
type = "tcp" # 使用TCP协议
localIP = "127.0.0.1" # 本地IP
localPort = 22 # 本地SSH服务端口
remotePort = 9011 # 提供给外部远程登录时使用的端口
```

这个配置的作用是将本地机器的SSH服务（端口22）通过`frp`服务器暴露到公网。当通过云服务器`8.110.214.88:9011`端口连接时，`frp`会将这个连接转发到本地机器的`127.0.0.1:22`端口，从而实现远程SSH登录到内网机器的功能

使用下面的命令启动`frp`服务：

```ini
# -c表示指定配置文件
./frpc -c frps.toml 
```

一旦连接成功，可以在`frp`服务端看到有客户端连接成功的日志

!!! note

    注意：
    
    1. 现在可能还不能通过公网的任意一台设备进行连接，需要配置云服务器的安全组，开放的端口即为上面设置的7011和9011，访问来源是任意即可
    2. 如果虚拟机开启了防火墙（可以使用`sudo ufw status`），则需要配置端口，例如：
        ```bash
        sudo ufw allow 9011
        ```

## 开启本地虚拟机`frp`服务开机自启动

!!! note

    云服务器因为很少关机，所以基本上不配置，如果需要配置，只需要按照本地虚拟机的配置方式照葫芦画瓢即可，但是需要改变涉及到`frpc`的地方为`frps`

配置步骤如下：

1. 将`frpc`文件和其配置文件放到系统指定目录下
2. 改变文件的拥有者并设置可执行权限

    ```bash
    sudo mkdir -p /etc/frp
    sudo cp /home/yourname/frpc.toml /etc/frp/frpc.toml # /home/yourname替换为实际的frpc.toml文件所在目录
    sudo cp /home/yourname/frpc /usr/local/bin/frpc # # /home/yourname替换为实际的frpc文件所在目录
    sudo chown root:root /usr/local/bin/frpc
    sudo chmod +x /usr/local/bin/frpc
    ```

3. 创建`systemd`服务文件

    ```bash
    sudo vim /etc/systemd/system/frpc.service # 也可以使用其他文本编辑器
    ```

4. 编辑配置文件内容

    ```ini
    [Unit]
    Description=FRP Client Service # frp服务端就将Client修改为Server
    After=network.target

    [Service]
    Type=simple
    User=root
    Group=root
    ExecStart=/usr/local/bin/frpc -c /etc/frp/frpc.toml # 如果是frp服务端，需要配置为frps，就是第一步拷贝的文件路径
    Restart=always
    RestartSec=3
    LimitNOFILE=1048576

    [Install]
    WantedBy=multi-user.target
    ```

    说明：

    1. `User=root`：如果你的`frp`需要绑定`80`、`443`等特权端口，必须用`root`。如不需要，可改为你自己的用户
    2. `Restart=always`：崩溃后自动重启
    3. `LimitNOFILE=1048576`：提升文件描述符限制，避免高并发时出错
    4. `After=network.target`：确保网络启动后再启动`frp`服务

5. 重载`systemd`配置并启用自启动

    ```bash
    # 重载systemd配置
    sudo systemctl daemon-reload 
    # 启用开机自启
    # 如果是frp服务端，需要将frpc修改为frps，后面类似
    sudo systemctl enable frpc
    # 启动服务
    sudo systemctl start frpc
    # 查看状态
    sudo systemctl status frpc
    # 查看日志（实时）
    sudo journalctl -u frpc -f 
    ```

其他服务管理命令：

```bash
# 启动
sudo systemctl start frps
# 停止
sudo systemctl stop frps
# 重启
sudo systemctl restart frps
# 查看状态
sudo systemctl status frps
# 查看日志（实时）
sudo journalctl -u frps -f
# 禁用自启
sudo systemctl disable frps
```