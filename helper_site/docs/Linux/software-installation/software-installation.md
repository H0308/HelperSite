<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# CentOS软件安装与vim使用

## CentOS软件安装

### 软件生态的概念

软件生态：一款操作系统是否可以在市场上有一席之地最主要看的还是操作系统的软件生态，软件生态包括：论坛、官方文档、软件体系……

### CentOS软件安装

在CentOS下，使用`yum`指令进行软件安装，但是安装软件只能是root用户，如果普通用户想安装只可以使用`sudo`提权（前提是在`sudoers`文件中），例如安装`tree`命令：（root用户下）`yum install -y tree`

!!! note
    在`yum`命令使用使用`-y`选项可以在安装软件的过程中不询问用户

### CentOS软件卸载

软件卸载同软件安装，只有root用户和可以sudo提权的用户可以执行，例如卸载tree命令：（root用户下）`yum remove tree`

### CentOS查看软件包

使用`yum list`可以罗列出远端服务器中可以下载的所有软件，结合管道和`grep`指令可以筛选出需要的软件，例如查找`tree`命令：`yum list | grep tree`

### rz和sz命令

`rz`和`sz`用于Windows机器和云服务器的Linux机器通过XShell传输文件，使用`rz`可以从Windows机器中选择文件发送给Linux机器，使用`sz`可以从Linux机器向Windows机器中发送文件