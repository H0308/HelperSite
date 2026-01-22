<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# 命名管道与共享内存

## 命名管道介绍和基本使用

理解了匿名管道后，命名管道的理解就会变得容易。在前面使用匿名管道时可以发现，之所以可以匿名是因为由父进程创建，子进程拷贝所以子进程和父进程都可以看到这个管道。但是如果对于任意两个进程，因为进程之间是独立的，需要任意两个进程看到这个管道就需要借助进程通信，但是匿名管道本身就是用于进程通信，所以匿名管道无法用于任意的两个进程。对此，根据一个文件可以被任意一个进程打开并由任意多个进程共享，如果设计一个文件作为两个进程通信方式就可以解决这个问题，此时这个文件也被称为命名管道

在Linux中，创建命名管道的方式有两种：

1. 终端命令`mkfifo 文件名`
2. 函数调用：`int mkfifo(const char *pathname, mode_t mode)`

首先介绍终端命令，使用`mkfifo`命令创建一个管道文件，这个文件的类型是`p`，表示管道（pipe）类型的文件，在当前路径下创建一个命名管道如下图所示：

<img src="2. 命名管道与共享内存.assets/image-20250104173302865.png">

当使用一个指令向管道内写入数据，再使用另外一个指令从管道中读取数据，就可以看到下面的效果：

<img src="2. 命名管道与共享内存.assets\Snipaste_2025-01-04_17-35-49.png">

在匿名管道部分提到过，在终端中指向的指令实际上是一个进程，所以此时使用`echo`的进程向命名管道中写入数据，使用`cat`的进程从命名管道中读取数据，此时就是进程间通信

可以看到，如果两个进程要使用命名管道进行通信，就必须有一个进程先创建命名管道，另外一个进程获取命名管道，所以两个进程使用命名管道的方式为：

1. 创建+使用
2. 获取+使用

如果想要删除一个文件，就可以使用前面提到的`unlink`命令删除管道文件，也可以使用`rm`删除

## 命名管道的原理

之所以叫命名管道，本质就是因为命名管道就是一个文件，一个文件就存在自己的路径，在Linux中，要查找一个文件就会根据这个文件的路径进行查找，此时查出的结果一定是唯一的，所以任意两个进程要通过命名管道进行通信就必须通过路径打开命名管道，也就是打开文件，此时二者就构成了访问同一份资源的通信条件

既然命名管道是一个文件，那么在磁盘上一定有其对应的`inode`编号与文件名映射，那么是否可以直接使用一个普通文件完成进程通信？实际上也是可以的，但是对于普通文件来说，其存在最大的问题就是会将文件中的内容刷新到磁盘上，而对于命名管道来说，之所以单独为他创建一个文件类型，就是因为他不进行内容刷新，完全是内存级别的文件，所以其在磁盘上的`inode`编号和文件名映射也只是占个位置

## 使用函数调用完成两个进程通信

创建命名管道的函数调用为`int mkfifo(const char *pathname, mode_t mode)`，其第一个参数传递路径名称，表示在哪个目录下创建命名管道（可以传递命名管道的名称），第二个参数传递命名管道的权限，其与文件权限一样。如果命名管道创建成功函数返回0，否则返回-1

前面已经介绍过使用命令如何创建命名管道，接下来主要介绍如何使用函数调用创建命名管道，基本上分为下面的步骤：

1. 第一个进程创建命名管道并打开管道进行使用
2. 第二个进程获取（打开）对应的命名管道并进行使用

所以此处需要用到两个可执行程序，首先创建对应的`Makefile`：

```makefile
SERVER=Server
CLINET=Client
SERVER_CC=Server.cc
CLINET_CC=Client.cc
CC=g++

.PHONY: all
all: $(SERVER) $(CLINET)

$(SERVER): $(SERVER_CC)
	$(CC) -o $(SERVER) $(SERVER).cc -std=c++11

$(CLINET): $(CLINET_CC)
	$(CC) -o $(CLINET) $(CLINET).cc -std=c++11

.PHONY: clean
clean:
	rm -f $(SERVER) $(CLINET)
```

在上面的`Makefile`中，为了同时生成出两个可执行程序，需要用到`all`，其依赖关系为两个可执行程序，但是因为这两个可执行程序还不存在，`Makefile`会向下执行直到`all`的依赖全部存在为止。另外，`Server`表示创建命名管道的一方，`Client`表示使用获取命名管道的一方，本次演示`Client`向命名管道中写入，`Server`从命名管道中读取

在匿名管道部分实现了简单的进程池，当时也处理了从面向过程转向面向对象，所以本次直接使用面向对象的思路进行设计

在下面的两个类的设计中，有些内容是共用的，所以放在单独的一个头文件中：

```c++
#ifndef __SHARED_HPP__
#define __SHARED_HPP__

#include <iostream>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

// 定义路径
// 在当前进程的CWD下创建命名管道fifo
const std::string pipe_path = "./fifo";
// 指定命名管道的权限
const mode_t pipe_mode = 0600;
// 缓冲区大小
const int buffer_size = 1024;

#endif
```

**设计`Server`类**

因为要创建命名管道，所以考虑在`Server`类对象创建时就创建命名管道。注意，因为命名管道是一个文件，有文件就会有对应的权限，所以命名管道也有对应的权限，也就是说一个进程创建的管道文件，其他进程需要向该管道读取或者从该管道输入都要有对应的权限，所以在创建管道时也需要给予管道文件的权限：

```c++
class Server
{
public:
    Server()
    {
        // 创建命名管道
        int ret = mkfifo(pipe_path.c_str(), pipe_mode);
        if (ret < 0)
        {
            std::cout << "管道创建失败" << std::endl;
            return;
        }
    }

private:
};
```

接着，因为`Server`需要从命名管道中读取，所以可以考虑实现一个函数用于打开对应的命名管道文件，因为打开文件会返回对应的文件描述符，所以可以考虑添加一个成员`_fd`存储命名管道的文件描述符

```c++
// 打开管道文件
void openFifo()
{
    _fd = open(pipe_path.c_str(), pipe_mode);

    // 错误处理
    if (_fd < 0)
    {
        std::cout << "打开管道失败" << std::endl;
        return;
    }
}
```

在上面的代码中，`_fd`就是成员变量，用于存储管道的文件描述符

因为`Server`是读取数据，所以考虑在`Server`类中提供读取方法，该方法返回读取到的字节数，如果为0，说明读取到文件结尾，可能是写端关闭，否则就是正常读取到的数据，本次以读取字符串为例，为了保证外部可以直到读取到的字符串，需要调用方传递一个实参，此时函数的形参应该应该作为输出型参数，下面有常见的三种写法分别代表不同类型的参数：

1. `*`表示输出型参数
2. `const &`表示输入型参数
3. `&`表示输入输出型参数

```c++
// 从管道中读取数据
int readFromPipe(std::string *out)
{
    char buffer[buffer_size] = {0};
    int ret = read(_fd, buffer, buffer_size);
    if (ret > 0)
        *out = buffer; // 通过输出型参数带离函数

    return ret;
}
```

最后就是关闭管道，关闭管道只需要关闭对应的文件并删除命名管道文件即可，在代码中删除命名管道文件可以使用`unlink`系统调用：

```c++
int unlink(const char *pathname);
```

提供对应的函数如下：

```c++
// 关闭管道
void closePipe()
{
    if (_fd > 0)
        close(_fd);

    // 删除命名管道
    int ret = unlink(pipe_path.c_str());
    if (ret < 0)
    {
        std::cout << "删除命名管道失败" << std::endl;
        return;
    }
}
```

**设计`Client`类**

设计`Client`类的思路和`Server`类的思路非常类似，只需要将`Server`类中的「创建管道」改为「获取（打开）管道」，将「管道读取」改为「管道写入」，代码整体如下：

```c++
class Client
{
public:
    Client()
    {
        // 打开管道
        _fd = open(pipe_path.c_str(), O_WRONLY);
        if (_fd < 0)
        {
            std::cout << "管道打开失败" << std::endl;
            return;
        }
    }

    // 写入
    void writeToPipe()
    {
        const std::string str = "Hello Pipe";
        write(_fd, str.c_str(), str.size());
    }

    // 关闭管道
    void closePipe()
    {
        if (_fd > 0)
            close(_fd);
    }

private:
    int _fd;
};
```

至此，命名管道的用法就是上面的过程，上面两个类还可以对相同的代码进行简化，此处就不再赘述，下面是对应的主函数：

=== "`Server.cc`"

    ```c++
    #include <iostream>
    #include "Server.hpp"
    using namespace std;

    int main()
    {
        // 创建Server类对象
        Server sv;
        sv.openFifo();
        while (true)
        {
            string out;
            int ret = sv.readFromPipe(&out);
            if (ret > 0)
                std::cout << out << std::endl;
            else if (ret == 0) // 读到文件结尾，可能是写端关闭，结束读取
                break;
        }

        // 关闭管道
        sv.closePipe();

        return 0;
    }
    ```

=== "`Client.cc`"

    ```c++
    #include <iostream>
    #include "Client.hpp"
    using namespace std;

    int main()
    {
        // 创建Client类对象
        Client cl;
        while (true)
        {
            cl.writeToPipe();
            sleep(1);
        }

        return 0;
    }
    ```

运行结果如下：

<img src="2. 命名管道与共享内存.assets\Snipaste_2025-01-04_22-17-11.png">

## 共享内存介绍

除了前面提到的两个管道可以进行进程通信外，共享内存也是一种方式，但是共享内存是System V标准下的进程间通信方式。共享内存本质就是在内存上开辟一块空间并将其链接到两个进程的PCB中，从而让两个进程都能看到同一块资源，进而实现进程间通信，具体原理如下图所示：

<img src="2. 命名管道与共享内存.assets\Snipaste_2025-01-05_20-06-09.png">

在上面的原理图中，将共享内存通过页表链接到进程PCB的过程叫做挂接，当进程PCB与共享内存断开连接的过程叫做去关联

因为共享内存在操作系统中可以存在多个，所以操作系统也需要对开辟的共享内存进行管理，而两个进程要想确定找到的是同一个共享内存就必须通过唯一的标识符，所以共享内存就是通过实际的物理内存块+内核数据结构组成

共享内存有如下的特点：

1. 通信速度最快，因为其不需要调用I/O接口，从而不需要内核级文件缓冲区，减少了通信内容的拷贝次数
2. 共享内存没有任何保护机制，导致其不会出现一个进程正在写，另一个进程正在阻塞的现象，所以更加容易出现数据不一致的问题，这也就意味着需要通过加锁以及同步的方式对共享内存进行保护

## 共享内存的基本使用

使用共享内存与前面使用管道的思路是大致一致的，尤其与命名管道非常类似，同样需要一方先向内存中申请共享内存并使用，另一方再获取到共享内存并使用，所以同样需要两个可执行文件

基本步骤如下：

1. 第一个进程申请共享内存并挂接进行使用
2. 第二个进程获取对应的共享内存并挂接进行使用

首先创建对应的`Makefile`：

```makefile
SERVER=Server
CLINET=Client
SERVER_CC=Server.cc
CLINET_CC=Client.cc
CC=g++

.PHONY: all
all: $(SERVER) $(CLINET)

$(SERVER): $(SERVER_CC)
	$(CC) -o $(SERVER) $(SERVER).cc -std=c++11

$(CLINET): $(CLINET_CC)
	$(CC) -o $(CLINET) $(CLINET).cc -std=c++11

.PHONY: clean
clean:
	rm -f $(SERVER) $(CLINET)
```

**设计`Server`类**

本次实现时与命名管道类似，让`Server`类申请共享内存，并从共享内存中读取数据，因为共享内存是由操作系统开辟的，所以进程只能向操作系统申请，此时就需要用到系统调用接口`shmget`：

```c
int shmget(key_t key, size_t size, int shmflg);
```

对于`shmget`函数来说，第一个参数表示共享内存的标识符，这个标识符由用户指定，但是一般情况下用户只需要调用`ftok`函数即可获取到对应的`key_t`值，`ftok`函数如下：

```c
key_t ftok(const char *pathname, int proj_id);
```

该函数传入两个参数，第一个参数表示路径，第二个参数表示项目ID，这两个参数没有固定的内容，但是一般使用有意义的路径和项目ID，该函数返回一个`key_t`的值

`shmget`函数的第二个参数传递共享内存需要开辟的空间大小，因为操作系统每一次读取是按照4kb进行，所以一般建议`size`的值为`4096`的整数倍

!!! note

    需要注意的是，如果需要开辟的共享内存大小不足4096的整数倍，操作系统会开辟刚好大于需求的4096整数倍的共享内存，但是实际给使用方就只有需要的开辟大小

`shmget`第三个参数为标记位，一般常用的有两个标记：

1. `IPC_CREAT`：如果单独使用`IPC_CREAT`，那么就代表如果指定的共享内存不存在就创建，否则就使用已有的共享内存
2. `IPC_EXCL`：单独使用无意义，但是一般配合`IPC_CREAT`可以实现当指定的共享内存不存在时就创建，否则就报错

这两个标记一起使用的方式与`open`函数中的打开模式一样，只需要按位或即可

`shmget`函数申请成功会返回共享内存标识符，否则返回-1。注意，这个标识符并不是前面传入的`key_t`的值，而是类似于数组下标的一个值，从0开始。后面使用的与共享内存相关的大部分操作都会使用共享内存标识符而不是`key_t`值（尽管可以使用`key_t`值，但是不推荐），例如管理共享内存的指令`ipcs -m`和`ipcrm -m 共享内存标识符`，其中`ipcs -m`指令是查看当前用户创建的共享内存的个数，`ipcrm -m 共享内存标识符`表示根据共享内存标识符释放对应的共享内存

!!! note

    需要注意，共享内存与前面的两个管道不同，其生命周期跟随操作系统，而不是跟随进程，所以进程退出不会自动销毁共享内存，需要在代码层面或者指令关闭共享内存

所以，共享内存标识符和`key_t`值的关系为：共享内存标识符是给用户使用的一个标识共享内存的标识符，便于用户更好的去管理共享内存，而`key_t`值是提供给操作系统使用，用于区分不同的共享内存

同样，一些相同的内容可以放在一个公共的头文件中方便调用：

```c++
#ifndef __SHARED_HPP__
#define __SHARED_HPP__

#include <iostream>
#include <unistd.h>
#include <sys/shm.h>
#include <sys/ipc.h>

// 项目路径
const std::string pathName = "./";
// 项目ID
const int proj_id = 25;
// 共享内存大小，4kb
int shm_size = 4096;
// 共享内存权限
mode_t shm_mode = 0600;
#endif
```

有了上面的内容后，就可以开始设计`Server`类，首先是申请共享内存，调用`ftok`函数获取`key_t`值，再通过该值申请共享内存，考虑在`Server`对象创建时自动创建共享内存：

```c++
class Server
{
public:
    Server()
    {
        // 调用ftok函数获取key_t值
        key_t key = ftok(pathName.c_str(), proj_id);
        // 根据key申请共享内存
        // 申请时需要确保不存在创建，存在就报错，确保获取到的是最新的共享内存
        _shmid = shmget(key, shm_size, IPC_CREAT | IPC_EXCL);

        if (_shmid < 0)
        {
            std::cout << "共享内存申请失败" << std::endl;
            return;
        }

        std::cout << "共享内存申请成功" << std::endl;
    }

private:
    int _shmid; // 共享内存标识符
};
```

如果此时创建`Server`对象并执行对应的可执行程序就可以判断是否成功创建共享内存，如下图所示：

<img src="2. 命名管道与共享内存.assets\Snipaste_2025-01-05_21-02-44.png">

创建完成共享内存后，就需要考虑将共享内存挂接到指定的进程中，所以可以使用`shmat`接口：

```c
void *shmat(int shmid, const void *_Nullable shmaddr, int shmflg);
```

该接口虽然有三个参数，但是最后一个参数和第二个参数暂时用不到，只需要传递0和`NULL`即可，第一个参数就是共享内存唯一标识符。该接口返回一个`void *`代表共享内存的起始地址，既然是`void *`证明可以使用共享内存传递任何内容，如果挂接失败，该函数会返回`void *`类型的-1

根据上面的描述，下面实现一个函数用于挂接，为了后面可以向调用层返回共享内存的起始地址，考虑使用一个成员变量接收`shmat`的返回值：

```c++
void Connect()
{
    _shm_address = shmat(_shmid, NULL, 0);
    // 注意不要强制转换为int，可能会因为精度丢失导致报错
    if ((long long)_shm_address < 0)
    {
        std::cout << "挂接失败" << std::endl;
        return;
    }
    std::cout << "挂接成功" << std::endl;
}
```

同样，为了测试挂接是否成功，可以创建`Server`对象，调用挂接方法，如果使用`ipcs -m`看到连接数（`nattach`）不为0，说明挂接成功，需要注意，为了防止进程在查看挂接前退出，可以使用`sleep`接口：

<img src="2. 命名管道与共享内存.assets\Snipaste_2025-01-05_21-34-03.png">

根据打印的结果可以判断挂接已经失败，对应的连接数也为0：

<img src="2. 命名管道与共享内存.assets\Snipaste_2025-01-05_21-34-54.png">

之所以挂接失败，本质上是因为在申请共享内存是并没有读写权限，这也就是为什么会有`shm_mode`的原因，解决方案也很简单，只需要在申请共享内存时在`shmflg`参数部分通过按位或添加读写权限即可：

```c++
class Server
{
public:
    Server()
    {
        // ...
        _shmid = shmget(key, shm_size, IPC_CREAT | IPC_EXCL | shm_mode);

        // ...
    }

private:
    int _shmid; // 共享内存标识符
};
```

此时编译运行即可看到挂接成功：

<img src="2. 命名管道与共享内存.assets\Snipaste_2025-01-05_21-41-18.png">

对应的连接数从0变为1：

<img src="2. 命名管道与共享内存.assets\Snipaste_2025-01-05_21-41-34.png">

完成了挂接之后，接下来就可以让`Server`从共享内存中读取数据了，但是因为共享内存是挂接到进程上而不是在其他位置，所以不需要对应的接口，进程只需要从自己的PCB空间中找到共享内存读取即可，所以为了方便处理，本次以读取字符串为例，并将读取过程设计在`Server`主函数中，`Server`类只需要返回挂接的共享内存起始地址即可：

=== "`Server.hpp`"

    ```c++
    void *getAddress()
    {
        return _shm_address;
    }
    ```

=== "`Server.cc`"

    ```c++
    // 从共享内存中读取
    char *shm_mem = (char *)sv.getAddress();
    while (true)
    {
        // 读取内容的方式与读取堆上的内容相似
        printf("%s\n", shm_mem);
    }
    ```

读取完毕后就是去关联，同样，去关联可以使用对应的接口`shmdt`：

```c++
int shmdt(const void *shmaddr);
```

该函数参数只需要传递共享内存的起始地址即可，函数返回0代表去关联成功，否则失败，实现对应的接口如下：

```c++
void disconnect()
{
    int ret = shmdt(_shm_address);
    if (ret < 0)
    {
        std::cout << "去关联失败" << std::endl;
        return;
    }
    std::cout << "去关联成功" << std::endl;
}
```

去关联结束后，就需要释放共享内存空间，防止内存泄漏，可以使用`shmctl`接口：

```c++
int shmctl(int shmid, int op, struct shmid_ds *buf);
```

对于该接口来说，虽然有三个参数，但是实际上只需要使用前两个参数，第三个参数直接填入`NULL`即可，第一个参数代表共享内存标识符，第二个参数代表一个操作标记，常用的标记为`IPC_RMID`，表示标记共享内存段将被释放，利用该接口可以在Server类中实现，考虑到自动调用，可以考虑使用`Server`对象的析构函数：

```c++
~Server()
{
    // 释放共享内存
    shmctl(_shmid, IPC_RMID, NULL);
    std::cout << "释放共享内存" << std::endl;
}
```

至此，`Server`类就设计完毕了，接下里就是考虑设计`Client`类

**设计`Client`类**

`Client`类用于向共享内存中写入数据，所以依旧还是需要先获取到对应的共享内存，并将对应的共享内存起始地址挂接到`Client`进程的PCB上，考虑在Client初始化对象时就获取共享内存，所以获取的步骤可以写在`Client`类的构造函数中。对于获取共享内存来说，需要保证「存在时获取」，所以只需要使用`IPC_CREAT`即可。同样，为了保存对应的共享内存标识符，可以使用一个成员变量接收`shmget`的返回值：

```c++
class Client
{
public:
    Client()
    {
        key_t key = ftok(pathName.c_str(), proj_id);
        _shmid = shmget(key, shm_size, IPC_CREAT);

        if (_shmid < 0)
        {
            std::cout << " 获取共享内存失败" << std::endl;
            return;
        }
        std::cout << "获取共享内存成功" << std::endl;
    }

private:
    int _shmid; // 共享内存的唯一标识符
};
```

接着处理挂接，思路与`Server`类一致：

```c++
void connect()
{
    _shm_address = shmat(_shmid, NULL, 0);
    if ((long long)_shm_address < 0)
    {
        std::cout << "共享内存挂接失败" << std::endl;
        return;
    }
    std::cout << "共享内存挂接成功" << std::endl;
}
```

在`Client`的主函数中创建`Client`对象，为了可以看到共享内存的链接数，可以添加`sleep`，编译运行后先运行`Server`再运行`Client`结果如下：

<img src="2. 命名管道与共享内存.assets\Snipaste_2025-01-06_11-13-40.png">

与Server一样，Client向上层返回共享内存的起始地址，上层只需要向该空间写入内容即可被Server端读取：

=== "`Client.hpp`"

    ```c++
    void *getAddress()
    {
        return _shm_address;
    }
    ```

=== "`Client.cc`"

    ```c++
    char *str = (char *)cl.getAddress();
    while (true)
    {
        scanf("%s", str);
    }
    ```

最后就是处理`Client`去关联，但是`Client`不需要处理释放共享内存，因为`Server`端已经进行了处理，为了保证`Client`一定可以断开连接，考虑单独写一个接口而不是放在`Client`的析构函数中：

```c++
void disconnect()
{
    int ret = shmdt(_shm_address);
    if (ret < 0)
    {
        std::cout << "去关联失败" << std::endl;
        return;
    }
    std::cout << "去关联成功" << std::endl;
}
```

最后，完善两个程序的主函数如下：

=== "`Server.cc`"

    ```c++
    #include <iostream>
    #include "Server.hpp"

    int main()
    {
        // 创建Server对象
        Server sv;
        sv.Connect();

        // 从共享内存中读取
        char *shm_mem = (char *)sv.getAddress();
        int num = 0;
        while (num++ <= 30)
        {
            // 读取内容的方式与读取堆上的内容相似
            printf("%s\n", shm_mem);
            sleep(1);
        }

        sv.disconnect();

        return 0;
    }
    ```

=== "`Client.cc`"

    ```c++
    #include <iostream>
    #include "Client.hpp"

    int main()
    {
        Client cl;
        cl.connect();

        char *str = (char *)cl.getAddress();
        char ch = 'a';
        while (ch <= 'g')
        {
            str[ch - 'a'] = ch;
            ch++;
            sleep(1);
        }

        cl.disconnect();
        return 0;
    }
    ```

编译运行代码，先运行`Server`，再运行`Client`，在`Client`运行的窗口中输入内容就可以在`Server`端看到输出，为了保证输出的效果，可以使用`sleep`：

`Client`输入：

<img src="2. 命名管道与共享内存.assets\Snipaste_2025-01-06_11-31-59.png">

`Server`输出：

<img src="2. 命名管道与共享内存.assets\Snipaste_2025-01-06_11-31-50.png">

从上面`Server`的输出结果可以看出，尽管`Client`只输入了两次内容，但是`Server`端在等待输入前会一直打印空，在第二次输入之前，会一直打印第一次输入的内容，根据这个特点也就可以看出共享内存没有阻塞等待的特点，这就可能会导致输入的内容和输出的内容不一致的情况

!!! note

    上面的代码中存在一些共性的地方，比如创建或者获取共享内存时的标记可以通过参数传递、去连接的代码和获取共享内存的代码等，可以进行抽离

## 结合命名管道保护共享内存

因为共享内存没有任何保护机制，所以在使用过程中为了防止出现数据不一致的问题，需要对共享内存进行使用保护，常见的保护是进行加锁和同步，但是因为目前还没有提到锁机制，所以暂时用命名管道替代

本次使用命名管道保护共享内存的思路如下：

1. 写端向共享内存中写入数据，写完后向命名管道中写入数据（相当于通知读端可以读取共享内存）
2. 读端读取完命名管道的内容后就会读取共享内存中的数据，否则就会一直阻塞在命名管道

示意图如下：

<img src="2. 命名管道与共享内存.assets\Snipaste_2025-01-06_15-25-48.png">

!!! note

    上面的做法只能保证写端写入时不会被读端读取到不完整的内容，但是会存在读端读取时写端还在写的情况，所以理论上来说读端和写端都需要两个命名管道对操作共享内存的代码进行包裹，本次只演示上面提到的情况

**完善`Server`类**

因为`Server`类需要向命名管道中读取，所以首先`Server`类除了需要申请共享空间外，还需要创建命名管道，并且提供向命名管道中读取数据的接口，使用代码与前面命名管道的代码是一致的，细节不在赘述：

!!! note

    本次规定向命名管道中写入一个整数代表信号

=== "`Server.hpp`"

    ```c++
    class Server
    {
    public:
        Server()
        {
            // ...

            // 创建命名管道
            int ret = mkfifo(pipe_path.c_str(), pipe_mode);
            if (ret < 0)
            {
                std::cout << "命名管道创建失败" << std::endl;
                return;
            }
            std::cout << "命名管道创建成功" << std::endl;
        }

        // ...

        void openPipe()
        {
            _fd = open(pipe_path.c_str(), O_RDONLY);
        }

        ssize_t readFromPipe(int *out)
        {
            ssize_t n = read(_fd, &(*out), sizeof(int));
            return n;
        }

        void closePipe()
        {
            close(_fd);

            // 删除命名管道
            int ret = unlink(pipe_path.c_str());
            if (ret < 0)
            {
                std::cout << "删除命名管道失败" << std::endl;
                return;
            }
            std::cout << "删除命名管道成功" << std::endl;
        }

        // ...

        ~Server()
        {
            // ...

            // 关闭管道
            closePipe();
        }

    private:
        int _shmid;         // 共享内存标识符
        void *_shm_address; // 共享内存起始位置
        int _fd;            // 命名管道文件描述符
    };
    ```

=== "`Server.cc`"

    ```c++
    #include <iostream>
    #include "Server.hpp"

    int main()
    {
        // 创建Server对象
        Server sv;
        sv.Connect();
        sv.openPipe();

        // 从共享内存中读取
        char *shm_mem = (char *)sv.getAddress();
        int num = 0;
        while (num++ <= 30)
        {
            int sig = 0;
            // 等待读取命名管道
            ssize_t n = sv.readFromPipe(&sig);
            if (n == sizeof(int)) // 成功从命名管道读取到数据时说明读到信号，可以读取共享内存
            {
                // 读取内容的方式与读取堆上的内容相似
                printf("%s\n", shm_mem);
            }
            else if (n == 0) // 写端关闭，停止读取
            {
                break;
            }
        }

        sv.disconnect();

        return 0;
    }
    ```

**完善`Client`类**

因为`Client`是写入端，所以需要通知`Server`可以开始进行读取，即需要向命名管道中写入数据代表信号，因为是确保读取端在写入端写完后读取，所以需要再写入共享内存的步骤结束后向命名管道中写入，具体代码如下：

=== "`Client.hpp`"

    ```c++
    class Client
    {
    public:
        Client()
        {
            // ...

            // 打开命名管道
            _fd = open(pipe_path.c_str(), O_WRONLY);
            if (_fd < 0)
            {
                std::cout << "命名管道打开失败" << std::endl;
                return;
            }

            std::cout << "命名管道打开成功" << std::endl;
        }

        // ...

        void writeToPipe()
        {
            int sig = 1;
            write(_fd, &sig, sizeof(int));
        }

        void closePipe()
        {
            close(_fd);
        }

        // ...

    private:
        // ...
        int _fd;            // 命名管道文件描述符
    };

    ```

=== "`Client.cc`"

    ```c++
    #include <iostream>
    #include "Client.hpp"

    int main()
    {
        Client cl;
        cl.connect();

        char *str = (char *)cl.getAddress();
        char ch = 'a';
        while (ch <= 'n')
        {
            str[ch - 'a'] = ch;
            ch++;

            // 向命名管道中写入表示通知写端可以读取
            cl.writeToPipe();
            sleep(1);
        }

        cl.closePipe();
        cl.disconnect();
        return 0;
    }
    ```

编译运行上面的代码，就可以看到不会出现某一条相同的内容被共享内存读取端打印多次了：

<img src="2. 命名管道与共享内存.assets\Snipaste_2025-01-06_16-24-05.png">


## 本节彩蛋（获取时间的接口）

在Linux中，如果想通过代码看到当前的日期和时间可以使用`localtime`接口，这个接口的作用是根据指定的时间戳转换为日期和时间，该接口如下：

```c
struct tm *localtime(const time_t *timep);
```

该接口可以传递一个参数，表示获取当前系统时间的时间戳，可以使用`time`函数获取：

```c
time_t time(time_t *_Nullable tloc);
```

`localtime`返回一个`struct tm`的结构体指针，而`struct tm`结构体原型如下：

```c
struct tm 
{
    int         tm_sec;    /* Seconds          [0, 60] */
    int         tm_min;    /* Minutes          [0, 59] */
    int         tm_hour;   /* Hour             [0, 23] */
    int         tm_mday;   /* Day of the month [1, 31] */
    int         tm_mon;    /* Month            [0, 11]  (January = 0) */
    int         tm_year;   /* Year minus 1900 */
    int         tm_wday;   /* Day of the week  [0, 6]   (Sunday = 0) */
    int         tm_yday;   /* Day of the year  [0, 365] (Jan/01 = 0) */
    int         tm_isdst;  /* Daylight savings flag */

    long        tm_gmtoff; /* Seconds East of UTC */
    const char *tm_zone;   /* Timezone abbreviation */
};
```

所以此时就可以写出下面获取时间的代码：

```c++
#include <iostream>
#include <string>
#include <ctime>

std::string GetCurrTime()
{
    time_t t = time(nullptr);
    struct tm *curr = ::localtime(&t);

    char currtime[32];
    snprintf(currtime, sizeof(currtime), "%d-%d-%d %d:%d:%d",
             curr->tm_year + 1900,
             curr->tm_mon + 1,
             curr->tm_mday,
             curr->tm_hour,
             curr->tm_min,
             curr->tm_sec);
    return currtime;
}
```