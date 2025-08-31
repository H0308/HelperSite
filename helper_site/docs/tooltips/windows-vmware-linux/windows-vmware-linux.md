# Windows系统下在VMware中配置Linux环境并通过客户端进行连接

## 准备文件

本次总共需要两个软件：

1. VMware：[下载地址](https://www.techpowerup.com/download/vmware-workstation-pro/)
2. Ubuntu系统镜像：[下载地址](https://ubuntu.com/download/desktop)

下载Ubuntu系统镜像直接进入网站点击Download即可，主要考虑下载VMware，因为当前VMware已经被收购了，所以官网已经关闭了，上面这个是一个CDS仓库，与官网下载的内容一样，进入该网站后可以看到下面的页面

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image.png">

下载Windows和Linux版本的VMware就在ws文件夹中，MacOS版本的在fusion中，本次主要关注Windows版本

进入ws文件夹后，可以看到如下界面：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image1.png">

这里罗列的是当前服务器提供的VMware的版本，向下滑动可以找到最新版本，当前最新版本是17.6.1，进入该版本文件夹可以看到如下界面：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image2.png">

点击进入数字编号的文件夹可以看到如下界面：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image3.png">

点击windows文件夹可以看到下面的界面：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image4.png">

点击core文件夹可以看到下面的界面：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image5.png">

选择第一个即可下载对应的安装包如下：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image6.png">

使用解压工具解压到文件夹后即可看到安装程序：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image7.png">

## 安装VMware

双击exe文件，等待一会儿后看到如下界面：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image8.png">

点击下一步，并勾选同意服务协议：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image9.png">

点击下一步（注意）：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image10.png">

如果出现了上面的界面，则选中「自动安装Windows Hypervisor Platform(WHP)」（对应的下面的选项，可以在对应位置手动启动）

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image11.png">

点击下一步：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image12.png">

此处可以在「安装位置」更改VMware的安装位置，这里不会影响后面虚拟系统安装的位置，出现下面的警告直接点击OK即可

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image13.png">

点击下一步：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image14.png">

点击下一步：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image15.png">

点击下一步后点击安装即可

安装完成后界面如下：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image16.png">

点击完成即可

## 启动VMware

第一次启动VMware会看到下面的界面：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image17.png">

选择「将VMware Workstation 17用于个人用途」后点击继续：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image18.png">

点击完成后即可进入主界面：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image19.png">

## 安装Ubuntu系统

### 创建虚拟机

点击「创建新的虚拟机」：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image20.png">

选择「自定义（高级）」：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image21.png">

点击下一步，下面界面的内容默认即可：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image22.png">

点击下一步，下面的界面选择「稍后安装操作系统」：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image23.png">

点击下一步，下面的界面中「客户机操作系统」选择Linux，版本选择「Ubuntu 64位」：

!!! note
    注意，此处的「版本」不要选择「Ubuntu」，要选择「Ubuntu 64位」

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image24.png">

点击下一步，这一步中的「虚拟机名称」按照自己喜好就行，「位置」是接下来创建的虚拟机所在的位置：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image25.png">

点击下一步，默认即可，一般「处理器数量」选择2：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image26.png">

点击下一步，设置「此虚拟机的内存」，2GB朝上：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image27.png">

点击下一步，「网络连接」选择第二个「使用网络地址转换（NAT）」：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image28.png">

点击下一步，默认即可：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image29.png">

点击下一步，默认即可：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image30.png">

点击下一步，默认即可：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image31.png">

点击下一步，设置「最大磁盘大小」，至少位20GB，其他默认即可：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image32.png">

点击下一步，设置磁盘文件存储位置，可以根据喜好放置在指定磁盘：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image33.png">

点击下一步，点击完成：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image34.png">

看到以下界面说明基础配置已经结束：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image35.png">

### 检查网络配置

!!! note
    如果是按照前面的步骤进行，默认情况下是正常的不需要额外配置，但是为了确保正确，可以检查下面提到的内容

点击「编辑」：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image36.png">

选择「虚拟网络编辑器」：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image37.png">

看到如下界面，选择VMnet8：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image38.png">

!!! note
    注意，如果VMware没有安装在C盘，可能看到所有的选项都是不可以改动的（灰色的），可以点击右下角的「更改设置」获取管理员权限即可

点击「NAT设置」，这里面需要注意「网关IP」的前三位一定要与「子网IP」的前三位相同，最后一位可以不同：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image39.png">

### 配置虚拟机镜像

点击「编辑虚拟机设置」：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image40.png">

看到如下界面后选择「CD/DVD（SATA）」：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image41.png">

选择「使用ISO映像文件」，点击「浏览」选择刚才下载的Ubuntu镜像文件：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image42.png">

选择完毕后点击确定：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image43.png">

### 安装系统

点击「开启此虚拟机」：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image44.png">

选择「Try or Install Ubuntu」，鼠标点进虚拟机屏幕区域后可以通过上下键选择：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image45.png">

等待一段时间后，点击下方的「Install Ubuntu」后进入下面的界面：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image46.png">

选择中文：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image47.png">

点击下一步：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image48.png">

点击下一步：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image49.png">

点击下一步：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image50.png">

点击下一步，选择「安装Ubuntu」：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image51.png">

点击下一步，选择「交互安装」：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image52.png">

点击下一步，选择「默认集合」：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image53.png">

点击下一步，这里可以不用选择任何内容：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image54.png">

点击下一步，这一步默认即可：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image55.png">

点击下一步，设置用户名和密码：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image56.png">

点击下一步，默认即可：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image57.png">

点击下一步，这里点击安装：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image58.png">

在下面这个界面等待一段时间：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image59.png">

点击立即重启：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image60.png">

提示移除介质时，在虚拟机界面直接点击++enter++即可，接下来点击创建好的用户并输入密码确定：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image61.png">

当前进入默认是普通用户，为了保证接下来的操作，需要切换到root用户，默认情况下，Ubuntu系统默认root用户密码是随机的，使用下面的指令更改root用户密码：

```shell
sudo passwd
```

输入当前用户的密码（默认不回显）后输入root用户的密码（不要太简单，不然会提示密码无效），使用`su -`命令切换为root用户如下：

<img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image62.png">

## 配置Ubuntu网络

### 步骤 1: 在虚拟机中安装并配置SSH服务

1. **确保网络连接**：在前面VMware的配置中设置好了NAT基本就没有问题
2. **安装SSH服务器**：在虚拟机中打开终端，然后安装OpenSSH服务器：

    ```shell
    sudo apt update
    sudo apt install openssh-server
    ```

3. **配置SSH**：默认情况下，SSH应该已经设置好并监听在端口`22`上，默认可能是注释的，使用下面的命令打开文件检查一下：

    ```shell
    sudo nano /etc/ssh/sshd_config
    ```

    确保**Port 22**这一行没有被注释掉（即前面没有`#`）。如果你想要使用其他端口，可以修改`Port`后面的数字，如下图所示：

    <img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image63.png">

4. **重启SSH服务**：更改后，使用下面的代码重启SSH服务以应用更改：

    ```shell
    sudo service ssh restart
    ```

5. **获取虚拟机IP地址**：找到虚拟机的IP地址，这样可以从外部连接它：

    ```shell
    hostname -I
    ```

### 步骤 2: 从本地计算机连接到虚拟机

1. 打开终端：在你的本地计算机上打开一个终端窗口，以Xshell为例
2. 使用SSH连接到虚拟机：

    点击新建会话

    <img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image64.png">

    按照下面图片输入内容：

    <img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image65.png">

3. 输入密码：系统会提示输入密码。输入正确的密码后，你将登录到虚拟机

!!! note
    此处建议先用普通用户登录，再通过普通用户切换到root用户

## root登录

如果想在终端中直接使用root登录可以按照下面的步骤设置：

1. **修改SSH配置文件**：在虚拟机中编辑`sshd_config`文件，并取消注释或更改以下行：

    ```shell
    PermitRootLogin yes
    ```

    如下图所示：

    <img src="Windows系统下在VMware中配置Linux环境并通过客户端进行连接.assets\image66.png">

2. **重启SSH服务**：更改后，使用下面的代码重启SSH服务以应用更改：

    ```shell
    sudo service ssh restart
    ```

