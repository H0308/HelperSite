<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Docker简介与基础使用

## 虚拟化与容器化

物理机：实际的服务器或者计算机。相对于虚拟机而言的对实体计算机的称呼。物理机提供给虚拟机以硬件环境，有时也称为"寄主"或"宿主"。

虚拟化：是指通过虚拟化技术将一台计算机虚拟为多台逻辑计算机。在一台计算机上同时运行多个逻辑计算机，每个逻辑计算机可运行不同的操作系统，并且应用程序都可以在相互独立的空间内运行而互不影响，从而显著提高计算机的工作效率。

容器化：容器化是一种虚拟化技术，又称操作系统层虚拟化，这种技术将操作系统内核虚拟化，可以允许用户空间软件实例被分割成几个独立的单元，在内核中运行，而不是只有一个单一实例运行。这个软件实例，也被称为是一个容器。对每个实例的拥有者与用户来说，他们使用的服务器程序，看起来就像是自己专用的。容器技术是虚拟化的一种。Docker是现今容器技术的事实标准。

## 容器化实现

容器虚拟化，有别于主机虚拟化，是操作系统层的虚拟化。通过 namespace 进行各程序的隔离，加上 cgroups 进行资源的控制，以此来进行虚拟化。

## namespace

### 介绍

namespace 是 Linux 内核用来隔离内核资源的方式。通过 namespace 可以让一些进程只能看到与自己相关的一部分资源，而另外一些进程也只能看到与它们自己相关的资源，这两拨进程根本就感觉不到对方的存在。具体的实现方式是把一个或多个进程的相关资源指定在同一个 namespace 中。

Linux namespaces 是对全局系统资源的一种封装隔离，使得处于不同 namespace 的进程拥有独立的全局系统资源，改变一个 namespace 中的系统资源只会影响当前 namespace 里的进程，对其他 namespace 中的进程没有影响。

Linux 提供了多个 API 用来操作 namespace，它们是 `clone()`、`setsns()` 和 `unshare()` 函数，为了确定隔离的到底是哪项 namespace，在使用这些 API 时，通常需要指定一些调用参数：`CLONE_NEWIPC`、`CLONE_NEWNET`、`CLONE_NEWNS`、`CLONE_NEWPID`、`CLONE_NEWUSER`、`CLONE_NEWUTS` 和 `CLONE_NEWCGROUP`。如果要同时隔离多个 namespace，可以使用`|`组合

### `dd`命令

`dd`命令：用于读取、转换并输出数据。`dd` 可从标准输入或文件中读取数据，根据指定的格式来转换数据，再输出到文件、设备或标准输出。

`dd`命令常用选项如下：

- `if=文件名`：输入文件名，默认为标准输入。即指定源文件。
- `of=文件名`：输出文件名，默认为标准输出。即指定目标文件。
- `ibs=bytes`：一次读入 bytes 个字节，即指定一个块大小为 bytes 个字节。
- `obs=bytes`：一次输出 bytes 个字节，即指定一个块大小为 bytes 个字节。
- `bs=bytes`：同时设置读入/输出的块大小为 bytes 个字节。
- `cbs=bytes`：一次转换 bytes 个字节，即指定转换缓冲区大小。
- `skip=blocks`：从输入文件开头跳过 blocks 个块后再开始复制。
- `seek=blocks`：从输出文件开头跳过 blocks 个块后再开始复制。
- `count=blocks`：仅拷贝 blocks 个块，块大小等于 ibs 指定的字节数。
- `conv=<关键字>`，关键字可以有以下 11 种：
    - `conversion`：用指定的参数转换文件。
    - `ascii`：转换 ebcdic 为 ascii
    - `ebcdic`：转换 ascii 为 ebcdic
    - `ibm`：转换 ascii 为 alternate ebcdic
    - `block`：把每一行转换为长度为 cbs，不足部分用空格填充
    - `unblock`：使每一行的长度都为 cbs，不足部分用空格填充
    - `lcase`：把大写字符转换为小写字符
    - `ucase`：把小写字符转换为大写字符
    - `swap`：交换输入的每对字节
    - `noerror`：出错时不停止
    - `notrunc`：不截断输出文件
    - `sync`：将每个输入块填充到 ibs 个字节，不足部分用空（NUL）字符补齐。
- `--help`：显示帮助信息
- `--version`：显示版本信息

??? note "更多单位"

    对于需要指定转换文件大小的选项，例如`ibs`、`obs`、`bs`等，除了可以指定字节为单位以外，还可以指定下面的单位：

    | 后缀                    | 含义                 | 对应字节数                |
    | --------------------- | ------------------ | -------------------- |
    | `c`                   | 字节（Byte）           | 1                    |
    | `w`                   | 16-bit words       | 2                    |
    | `b`                   | 块（block）           | 512                  |
    | `K`                   | 千字节（基于 1024）       | 1024                 |
    | `M`                   | 兆字节（基于 $1024^2$）      | 1 048 576            |
    | `G`                   | 吉字节（基于 $1024^3$）      | 1 073 741 824        |
    | `T`, `P`, `E`, `Z`, … | 更大的单位（依次 1024 倍递增） | —                    |
    | `kB` / `MB` / `GB`    | SI 单位（基于 1000）     | 1000 / 1000² / 1000³ |
    | `KiB` / `MiB` / `GiB` | IEC 单位（基于 1024）    | 1024 / 1024² / 1024³ |

例如，创建一个80MB的文件：

```shell
dd if=/dev/zero of=fdimage.img bs=8k count=10240
```

将文件内容的小写全部转换为大写，输出到一个新的文件中：

```shell
dd if=testfile_2 of=testfile_1 conv=ucase
```

### `mkfs`命令

`mkfs`命令：用于在当前设备上创建Linux文件系统，俗成格式化

基本语法如下：

```shell
mkfs 文件系统格式 需要操作的文件或设备名称
```

常见选项如下：

- `-t 文件系统名称`: 指定要建立何种文件系统；如`ext3`，`ext4`
- `blocks`：指定文件系统的磁盘块数
- `-V`：详细显示模式
- `fs - options`：传递给具体的文件系统的参数

例如，将上面创建的80MB`fdimage.img`文件进行格式化

```shell
mkfs -t ext4 ./fdimage.img
```

结束后可以看到类似下面的信息：

```
mke2fs 1.46.5 (30-Dec-2021)
Discarding device blocks: done                            
Creating filesystem with 20480 4k blocks and 20480 inodes

Allocating group tables: done                            
Writing inode tables: done                            
Creating journal (1024 blocks): done
Writing superblocks and filesystem accounting information: done
```

### `df`命令

`df`命令：用于查看当前Linux系统下文件系统磁盘的使用情况

常见选项如下：

- `-a, --all`：包含所有的具有 0 Blocks 的文件系统
- `-h, --human-readable`：使用人类可读的格式(预设值是不加这个选项的...)
- `-H, --si`：很像`-h`, 但是用1000为单位而不是用1024
- `-t, --type=TYPE`：指定需要的列出文件系统的类型
- `-T, --print-type`：显示文件系统的形式

例如，查看文件系统类型为`ext4`的：

```shell
df -t ext4
```

### `mount`命令

`mount`命令：用于将指定文件或设备挂载到指定目录下

基本语法如下：

```shell
mount 待挂载的文件 挂载的目标目录
```

常见选项如下：

- `-l`：显示已加载的文件系统列表；
- `-t`：指定挂载的文件系统类型，支持常见系统类型（大部分情况可以不指定，`mount`可以自己识别）
- `-o options`：主要用来描述设备或档案的挂接方式，有下面几种值：
    - `loop`：用来把一个文件当成硬盘分区挂接上系统
    - `ro`：采用只读方式挂接设备
    - `rw`：采用读写方式挂接设备

例如，将前面格式化后的`fdimage.img`文件挂载到的`~/test/data`：

```shell
mount fdimage.img ~/test/data
```

但是如果是普通用户，直接挂载会出现报错：

```
epsda@ham-carrier:~/test$ mount fdimage.img test/data
mount: test/data: failed to setup loop device for /home/epsda/test/fdimage.img.
```

所以还需要进行提权：

```shell
sudo mount fdimage.img ~/test/data
```

再使用`df`命令即可查看到刚才挂载的文件：

```
/dev/loop0       71M   24K   66M   1% /home/epsda/test/data
```

### `unshare`命令

`unshare`命令：用于使用与父程序不共享的名称空间运行程序。

基本使用方式：

```shell
unshare 待运行的程序名称
```

常见选项：

- `-i, --ipc`：不共享IPC空间（程序的IPC机制（比如`ipcs`、`msgget`、`semget`等）只看得到隔离后的专属于这个新空间的信息，不再看到父进程的IPC）
- `-m, --mount`：不共享Mount空间（运行的程序有自己的挂载点空间）
- `-n, --net`：不共享Net空间（有独立的网络设备、路由表、IP等，是用来隔离网络环境的基础）
- `-p, --pid`：不共享PID空间（在当前namespace里看不到外部namespace的进程）
- `-u, --uts`：不共享UTS空间（主机名和域名隔离）
- `-U, --user`：不共享用户（让程序拥有独立的用户/组空间）
- `-V, --version`：版本查看
- `--fork`：执行`unshare`的进程`fork`一个新的子进程，在子进程里执行`unshare`传入的参数。
- `--mount-proc`：执行子进程前，将`proc`优先挂载过去

例如，不共享主机名和域名运行`/bin/bash`：

```shell
unshare -u /bin/bash
```

### 进程隔离和挂载隔离

参考[课件](https://www.kdocs.cn/l/chAkGu1MSCUU)