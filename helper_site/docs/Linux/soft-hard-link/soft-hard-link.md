<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Linux软链接和硬链接

## 介绍和基本使用

在Linux中，存在两种链接：

1. 软链接：软链接有独立的`inode`编号，此时不会更改原始文件的引用计数，其内容上是表示链接的文件的路径
2. 硬链接：硬链接没有独立的`inode`编号，其`inode`编号与其链接的文件相同，使用硬链接会更改原始文件的引用计数，所以本质上硬链接就是文件名和已存在的文件建立映射关系

在Linux中，对一个文件创建软链接可以使用下面的命令：

```shell
ln -s 原始文件 软链接文件名
```

例如下面的示例：

<img src="16. Linux软链接和硬链接.assets\image.png">

通过下图可以看出软链接和原始文件是两个独立的文件，因为软链接有着自己的`inode`编号：

<img src="16. Linux软链接和硬链接.assets\image1.png">

对一个文件创建硬链接则可以使用下面的命令：

```shell
ln 原始文件 硬链接文件名
```

例如下面的示例：

<img src="16. Linux软链接和硬链接.assets\image2.png">

通过下图可以看出硬链接和原始文件是同一个文件，因为二者的`inode`编号是相同的，并且创建完硬链接后改变了原始文件的引用计数：

<img src="16. Linux软链接和硬链接.assets\image3.png">

如果想删除一个软链接或者硬链接，可以使用删除命令`rm`，也可以使用`unlink`命令，例如删除上面的硬链接：

<img src="16. Linux软链接和硬链接.assets\image4.png">

## 软链接和硬链接的使用场景

如果对一个文件既创建了软链接，也创建了一个硬链接，那么删除原文件时，软链接将失效，但是硬链接不会：

<img src="16. Linux软链接和硬链接.assets\image5.png">

此时再访问软链接指向的文件中的内容就会无效：

<img src="16. Linux软链接和硬链接.assets\image6.png">

但是这一操作不会影响硬链接：

<img src="16. Linux软链接和硬链接.assets\image7.png">

因为对于存在硬链接的文件来说，删除原文件就是减少其引用计数，只要引用计数不为0，那么该文件就不会被认为失效，而创建硬链接会增加原文件的引用计数，所以此时删除原文件就只是让原文件的引用计数从2变为1，从而保证文件还在硬盘上存在

从上面删除文件的例子可以看出，**使用硬链接可以做到对原文件的备份**

接下来看软链接的使用：

在当前目录下有一个`test.cpp`文件，其内容如下：

```c++
#include <iostream>
using namespace std;

int main()
{
    cout << "Hello Linux" << endl;
    return 0;
}
```

接着，使用`g++`对该文件直接编译生成可执行文件：

<img src="16. Linux软链接和硬链接.assets\image8.png">

直接运行该文件就可以看到输出：

<img src="16. Linux软链接和硬链接.assets\image9.png">

但是上面的运行需要带`./`限定才能正常运行`a.out`文件，在[Linux命令行与环境变量](https://www.help-doc.top/Linux/command-line-env/command-line-env.html#path)提到之所以需要`./`作为限定是因为Linux默认查找可执行文件的路径是`/bin`路径下，而当前`a.out`文件并不在该目录。当时解决这个问题的办法就是将`a.out`移动到`/bin`路径下

!!! note
    
    实际上，`/bin`也是一个软链接，该链接指向的原文件是`/usr/bin`

在软链接部分，就可以通过为`a.out`创建软链接，再将软链接移动到`/bin`路径下即可执行`a.out`文件：

<img src="16. Linux软链接和硬链接.assets\image10.png">

!!! note

    注意，此时的软链接指向的原文件需要使用绝对路径

接着再使用`test_aout`文件即可执行`a.out`文件：

<img src="16. Linux软链接和硬链接.assets\image11.png">

通过上面的例子可以看出，**软链接的作用主要是相当于一个快捷方式**

## 硬链接在Linux中的使用

!!! note

    关于软链接在系统中的使用前面的例子已经提及，此处不再赘述，下面主要讨论硬链接

在当前目录下新建一个`test`目录，观察其引用计数：

<img src="16. Linux软链接和硬链接.assets\image12.png">

既然是新建的目录，理论上这个目录引用计数应该是1，但是此处是2，说明创建的新目录一定存在除了当前目录自身外的一个硬链接

在前面[Linux常用选项和指令](https://www.help-doc.top/Linux/options-commands/options-commands.html#_5)部分提到，`.`表示当前目录，`..`表示相对于当前目录的上一级目录，本质就是`.`在Linux中是一个特殊的文件，该文件是一个硬链接，该链接指向的就是当前目录，对于`..`也是如此，其也是一个硬链接，指向当前目录的上一级目录

查看`test`目录的`inode`编号如下：

<img src="16. Linux软链接和硬链接.assets\image13.png">

使用下面的指令查看`test`目录下的所有内容以及对应的`inode`编号：

```shell
ls -ai
```

运行结果如下：

<img src="16. Linux软链接和硬链接.assets\image14.png">

可以看到`.`文件的`inode`编号与`test`目录的`inode`编号一致，证明了`test`目录除了文件自身以外，还有一个`.`作为硬链接指向着它，所以`test`目录的引用计数在初始时就是2而不是1

同样，对于`..`来说，查看`test`目录的上一级目录的`inode`编号就可以发现`..`和`test`目录的上一级目录的`inode`编号也是相同的：

<img src="16. Linux软链接和硬链接.assets\image15.png">

<img src="16. Linux软链接和硬链接.assets\image16.png">

现在就可以解释为什么可以使用`.`和`..`来表示当前目录和上一级目录了，但是现在就会有第二个问题：前面提到路径可以一直回退直到根路径，但是为什么回到根路径不论是`..`和`.`都还是根路径

实际上是因为根路径的`.`和`..`指向的目录都是根目录，所以就出现了上面问题中的情况：

<img src="16. Linux软链接和硬链接.assets\image17.png">

!!! note
    
    在Linux中，根目录的`inode`编号为2

从上面的例子中可以是否看出：硬链接除了可以指向普通文件，还可以指向目录。**其实并不是，因为在Linux中是不能给目录创建硬链接的**，主要还是为了防止目录成环问题，而之所以上面可以为当前目录和当前目录的上一级目录建立硬链接是因为Linux本身对`.`和`..`进行的硬编码

## 动态库和静态库

在[Linux下的gcc和gdb](https://www.help-doc.top/Linux/gcc-gdb/gcc-gdb.html#_2)部分提到何为动态库以及何为静态库，此处不再赘述

在Linux中，除了可以使用库中内置的静态库和动态库外，也可以由用户自己创建动态库和静态库，下面使用常见的三种方式创建动态库和静态库

### 创建静态库与使用

??? note "自定义库"

    === "`mystdio.c`"

        ```c
        #include "mystdio.h"

        myFILE* myfopen(const char* filename, const char* mode)
        {
            // 判断文件是否存在
            if(!filename)
            {
                return NULL;
            }
            // 判断模式是否为空
            if(!mode)
            {
                return NULL;
            }

            // 开辟返回的空间
            myFILE* myfile = (myFILE*)malloc(sizeof(myFILE));
            // 文件和模式都不为空时可以开始打开文件
            // 判断是何种模式
            if(strcmp(mode, "w") == 0)
            {
                // 写模式打开
                int fd = open(filename, O_CREAT | O_WRONLY | O_TRUNC, 0666);
                myfile->_fileno = fd;
                myfile->_flag = LINE;
                myfile->_capacity = SIZE;
                myfile->_size = 0;
            }
            else if(strcmp(mode, "r") == 0)
            {
                // 写模式打开
                int fd = open(filename, O_RDONLY); 
                myfile->_fileno = fd;
                myfile->_flag = LINE;
                myfile->_capacity = SIZE;
                myfile->_size = 0;
            }
            else if(strcmp(mode, "a") == 0)
            {
                // 写模式打开
                int fd = open(filename, O_CREAT | O_WRONLY | O_APPEND); 
                myfile->_fileno = fd;
                myfile->_flag = LINE;
                myfile->_capacity = SIZE;
                myfile->_size = 0; 
            }
            
            return myfile;
        }

        int myfwrite(myFILE* stream, const void* ptr, int num)
        {
            // 写函数的本质是将数据拷贝到缓冲区
            memcpy(stream->_buffer+stream->_size, ptr, num);
            stream->_size += num;

            // 判断刷新方式
            if(stream->_flag == LINE && stream->_size > 0 && stream->_buffer[stream->_size - 1] == '\n')
            {
                myfflush(stream);
            }

            return num;
        }

        void myfflush(myFILE* stream)
        {
            if(stream->_size > 0)
            {
                // 刷新的本质是将缓冲区中的数据拷贝到系统缓冲区
                write(stream->_fileno, stream->_buffer, stream->_size);
                // 刷新到外部设备
                fsync(stream->_fileno);
                // 更新缓冲区的_size
                stream->_size = 0;
            }
        }

        void myfclose(myFILE* stream)
        {
            // 关闭之前需要自动刷新
            if(stream->_size > 0)
            {
                myfflush(stream);
            }

            close(stream->_fileno);
        }
        ```

    === "`mystdio.h`"

        ```c
        #define SIZE 1024
        #include <stdio.h>
        #include <string.h>
        #include <sys/types.h>
        #include <sys/stat.h>
        #include <fcntl.h>
        #include <unistd.h>
        #include <stdlib.h>

        enum 
        {
            LINE, // 行刷新
            FULL, // 满刷新
            NONE, // 不缓冲
        };

        struct IO_FILE
        {
            int _fileno; // 文件描述符
            int _flag; // 刷新方式
            char _buffer[SIZE]; // 缓冲区
            int _capacity; // 缓冲区容量
            int _size; // 缓冲区有效数据个数
        };

        typedef struct IO_FILE myFILE; 

        myFILE* myfopen(const char* filename, const char* mode);
        int myfwrite(myFILE* stream, const void* ptr, int num);
        void myfflush(myFILE* stream);
        void myfclose(myFILE* stream);
        ```

    === "`mystring.h`"

        ```c
        #include <stdio.h>

        int mstrlen(const char* str);
        ```

    === "`mystring.c`"

        ```c
        #include "mystring.h"
        
        int mstrlen(const char* str)
        {
            const char* end = str;
            while((*end) != '\0')
            {
                end++;
            }
            
            return end - str;
        }
        ```

#### 方式1

**方式1：将静态库放到`/usr/lib64`目录下，将头文件放到`/usr/include`目录下**

按照下面的步骤进行：

1. 将需要打包为静态库的`.c`文件编译生成`.o`文件
2. 使用`ar -rc lib库名.a 指定的.o文件`生成静态库，注意静态库的名称一定要以`lib`开头，后缀为`.a`
3. 将头文件使用`cp`命令拷贝到`/usr/include`目录下，使用`cp`命令将静态库拷贝到`/usr/lib64`目录下。这一步仅仅只是完成静态库的安装，如果直接编译要生成可执行程序的文件会出现链接报错
4. 编译要生成可执行程序的文件时使用`gcc 文件名 -l+库名称（去掉lib和.a）`

按照上面的过程示例如下：

1. 生成`.o`文件

    <img src="16. Linux软链接和硬链接.assets\image18.png">


2. 生成静态库

    <img src="16. Linux软链接和硬链接.assets\image19.png">

3. 拷贝
4. 编译和运行指定文件

测试文件源代码如下：

```c
#include <mystring.h>
#include <mystdio.h>
#include <stdio.h>

int main()
{
    const char* str = "hello linux";

    myFILE* mfl = myfopen("test.txt", "w");
    int ret = myfwrite(mfl, str, mstrlen(str));
    printf("%d\n", ret);

    myfclose(mfl);

    return 0;
}
```

结果如下：

<img src="16. Linux软链接和硬链接.assets\image20.png">

#### 方式2

**方式2：通过编译器选项指定静态库路径，并且使用当前目录下的头文件**

!!! note

    默认情况下，gcc不会在当前目录查找需要的静态库，也不会在指定目录中自动查找需要的静态库，所以需要指定静态库路径和静态库名称

当前目录下存在静态库、头文件和用于生成可执行程序的源文件：

<img src="16. Linux软链接和硬链接.assets\image21.png">

使用下面的指令指定静态库所在位置：

```shell
gcc 文件名 -L路径 -l静态库（去掉lib和.a）
```

测试源文件代码如下：

```c
#include "mystring.h"
#include "mystdio.h"
#include <stdio.h>

int main()
{
    const char* str = "hello linux";

    myFILE* mfl = myfopen("test.txt", "w");
    int ret = myfwrite(mfl, str, mstrlen(str));
    printf("%d\n", ret);

    myfclose(mfl);

    return 0;
}
```

运行结果如下：

<img src="16. Linux软链接和硬链接.assets\image22.png">

#### 方式3

**方式3：通过编译器选项指定头文件和静态库文件的位置（头文件和静态库文件可能不在当前目录）**

可选：使用`Makefile`自动化生成静态库和`.o`文件

```makefile
libmylib.a:mystdio.o mystring.o
    @ar -rc $@ $^
    @echo "正在打包$@"

%.o:%.c
    @gcc -c $< -o $@
    @echo "正在编译链接生成$@"

.PHONY:clean 
clean:
    @rm -rf libmylib.a *.o
    @echo "已删除"
```

在上面的`Makefile`中，`$@`是自动变量，它在整个规则执行过程中都是有效的，包括`echo`中，另外`%.o:%.c`中的`%`表示模式匹配符号，用于创建通用规则，即根据当前目录的`.c`文件生成同名的`.o`文件

执行上面的`Makefile`就可以得到下面的结果：

<img src="16. Linux软链接和硬链接.assets\image23.png">

使用下面的指令指定头文件所在路径和静态库所在路径：

```shell
gcc 文件名 -I.h所在位置 -L静态库路径 -l静态库名称（去掉lib和.a）
```

测试源文件代码如下：

```c
#include "mystring.h"
#include "mystdio.h"
#include <stdio.h>

int main()
{
    const char* str = "hello linux";

    myFILE* mfl = myfopen("test.txt", "w");
    int ret = myfwrite(mfl, str, mstrlen(str));
    printf("%d\n", ret);

    myfclose(mfl);

    return 0;
}
```

运行结果如下：

<img src="16. Linux软链接和硬链接.assets\image24.png">

### 创建动态库与使用

!!! note

    同样以静态库中的自定义库代码为例

创建动态库的命令不再是`ar`而是直接使用`gcc`，但是在生成动态库前必须保证`.o`文件具有绝对地址，即对`.o`文件的生成方式需要改变：使用`-fPIC`选项生成带有与位置无关码的`.o`文件，即：

```shell
# 1. 使用gcc -fPIC生成带有与位置无关码的.o文件
gcc -c -fPIC mystdio.c mystring.c
# 2. 使用gcc -shared将生成的.o文件打包成动态库
gcc mystdio.o mystring.o -o libmylib.so -shared
```

运行结果如下：

<img src="16. Linux软链接和硬链接.assets\image25.png">

有了动态库之后，就可以按照前面静态库的三种方式进行测试，下面以第三种方式为例：

`Makefile`文件内容如下：

```shell
libmylib.so:mystdio.o mystring.o
    @gcc $^ -o $@ -shared
    @echo "正在打包$@"

%.o:%.c
    @gcc -c $< -o $@ -fPIC
    @echo "正在编译链接生成$@"

.PHONY:clean 
clean:
    @rm -rf libmylib.so *.o
    @echo "已删除"
```

执行`Makefile`结果如下：

<img src="16. Linux软链接和硬链接.assets\image26.png">

测试源文件代码如下：

```c
#include "mystring.h"
#include "mystdio.h"
#include <stdio.h>

int main()
{
    const char* str = "hello linux";

    myFILE* mfl = myfopen("test.txt", "w");
    int ret = myfwrite(mfl, str, mstrlen(str));
    printf("%d\n", ret);

    myfclose(mfl);

    return 0;
}
```

使用同样的指令生成可执行程序：

```shell
gcc 文件名 -I.h所在位置 -L静态库路径 -l静态库名称（去掉lib和.a）
```

运行结果如下：

<img src="16. Linux软链接和硬链接.assets\image28.png">

### 静态库和动态库生成的可执行文件的区别

1. 从文件大小来看，通过动态库生成的可执行程序大小会小于静态库生成的可执行程序大小
2. 使用`ldd`查看静态库生成的可执行程序时不会包含静态库，查看动态库生成的可执行程序是会包含动态库：

    <img src="16. Linux软链接和硬链接.assets\image29.png">

    <img src="16. Linux软链接和硬链接.assets\image30.png">

3. 对于静态库生成的可执行程序来说，如果在生成了可执行程序之后删除对应的静态库不会影响已经生成的可执行程序的运行，但是对于动态库生成的可执行程序来说就会有影响。出现这个问题的本质原因就是静态库已经在可执行程序中包含，但是动态库需要运行时查找

    <img src="16. Linux软链接和硬链接.assets\image31.png">

    <img src="16. Linux软链接和硬链接.assets\image32.png">

如果使用`ldd`查看使用动态库生成的可执行程序就可以看到缺失对应的动态库：

<img src="16. Linux软链接和硬链接.assets\image27.png">

### 软链接与动态库

与静态库类似，如果在当前目录下不存在动态库，但是要根据对应的动态库对一个源文件生成可执行程序时，就需要将动态库放到`/lib64`目录下。除了这种方式外，也可以考虑使用软链接的方式，为其他位置的动态库创建软链接，再将软链接放到`/lib64`目录下

需要注意的是，不同于静态库，动态库如果在使用命令编译时指定了路径使得可执行程序成功生成，但是这个路径不是gcc默认查找的路径，那么就会出现运行结果和删除动态库是类似的，本质就是因为动态库与静态库的第三个不同点，解决方案就是上面提到的两种：

1. 拷贝动态库到`/lib64`目录下 
2. 在`/lib64`中创建一个链接动态库的软链接

### 配置动态库

在Linux中，除了前面提到的两种方式配置动态库外，还有其他两种方式：

1. 修改环境变量，因为gcc之所以在`/usr/include`目录下查找库本质就是因为一个名为`LD_LIBRARY_PATH`的环境变量
2. 配置系统配置文件（在`/etc/ld.so.conf.d/`目录下），创建一个新的配置文件，其内容即为指定库的路径。配置系统配置文件不能忘记使用`ldconfig`命令更新

下面主要演示第三种方式：

!!! note

    需要注意，如果直接使用`env`命令查看当前系统的环境变量发现已经存在一个`LD_LIBRARY_PATH`环境变量，那么可能这个环境变量是一些插件（例如vim）配置的，此时配置时需要注意不要覆盖原来已经有的值

接下来按照下面的步骤进行：

1. 找到动态库所在绝对路径

    <img src="16. Linux软链接和硬链接.assets\image33.png">

2. 将该路径添加到`LD_LIBRARY_PATH`中

    <img src="16. Linux软链接和硬链接.assets\image34.png">


!!! note

    注意，不同的值使用冒号`:`分隔，并且只需要确定动态库所在的目录，不需要指定到动态库文件

此时在其他目录中的源文件编译生成的可执行文件就可以识别到动态库所在位置：

<img src="16. Linux软链接和硬链接.assets\image35.png">

!!! note

    注意，上面四种配置方式都是为了操作系统可以正常让可执行程序的进程加载动态库，而不是为了让编译器找到动态库，所以编译生成可执行程序的步骤依旧需要指定动态库所在位置

### 理解动态库加载过程

动态库加载的简单过程如下：

磁盘中存储着可执行程序和动态库文件，当可执行程序需要运行时，对应的程序就会形成PCB，此时也就有了虚拟地址空间和页表，当运行到需要使用到动态库的内容时，操作系统会将磁盘中的动态库加载到内存，有了物理地址后，就会形成一个虚拟地址，在页表中形成映射。在进程视角里，就会看到共享区存在一个动态库的地址，根据这个地址就可以找到需要的动态库

从上面的过程可以看到，动态库的加载与进程的虚拟地址空间和页表有着密切的联系，下面从这两个方面具体论述动态库的加载过程

#### ELF文件介绍

为了接下来可以更好得理解某些概念，首先提出何为ELF

ELF（Executable and Linkable Format，可执行链接格式）是一种常见的文件格式，用于二进制文件，包括可执行文件、目标代码、共享库以及核心转储

ELF文件格式有下面的四个部分：

1. ELF头（ELF header）：描述文件的主要特性。其位于文件的开始位置，它的主要目的是定位文件的其他部分
2. 程序头表（Program header table）：列举了所有有效的段（segments）和他们的属性。表里记着每个段的开始的位置和位移（offset）、长度，毕竟这些段，都是紧密的放在二进制文件中，需要段表的描述信息，才能把他们每个段分割开
3. 节头表（Section header table）：包含对节（sections）的描述
4. 节（Section）：ELF文件中的基本组成单位，包含了特定类型的数据。ELF文件的各种信息和数据都存储在不同的节中，如代码节存储了可执行代码，数据节存储了全局变量和静态数据等

在ELF文件中的节（Section）中，最常见的有两种：

1. 代码节（`.text`）：用于保存机器指令，是程序的主要执行部分
2. 数据节（`.data`）：保存已初始化的全局变量和局部静态变量

如果想看一个可执行文件的ELF头可以使用下面的指令：

```shell
readelf -h 可执行程序名
```

例如下面的运行结果：

<img src="16. Linux软链接和硬链接.assets\image36.png">

如果想看一个可执行程序的ELF程序头表，可以使用下面的指令：

```shell
readelf -l 可执行程序名
```

例如下面的运行结果：

<img src="16. Linux软链接和硬链接.assets\image37.png">

上表的每一行就是一个数据段，其中`LOAD`数据段即为加载到虚拟地址空间时需要使用的数据段

在Linux中，对于任何一个文件来说，文件的内容就可以类比为一个一维数组，访问其内容就是通过「起始值+偏移量+内容大小（可选））」进行获取，所以对于上面所有的类型来说也是如此，当其需要加载到内存时也是通过对应的方式加载需要的内容

如果想看一个可执行程序的ELF节头表，可以使用下面的指令：

```shell
readelf -S 可执行程序名
```

例如下面的运行结果：

<img src="16. Linux软链接和硬链接.assets\image38.png">

在后面会主要关注`.text`、`.data`和`.got`

ELF本质是二进制文件的格式，那么其由来一定和二进制文件（此处就是可执行程序）的生成有关，在前面使用gcc生成的可执行程序都是通过源文件生成`.o`文件，再通过`.o`文件生成可执行文件，此时每一个`.o`文件都会生成自己的ELF文件，但是为了最后在一个目标可执行程序中，所有`.o`文件就会合并生成一个ELF文件，所以「编译链接」中的「链接」就是在将所有`.o`中相同属性的ELF节合并到一个ELF节，最后整合到ELF文件中，示意图如下：

<img src="16. Linux软链接和硬链接.assets\image39.png">

操作系统需要认识对应的可执行程序，而认识的途径就是通过上面的ELF文件

#### 从汇编看程序加载到执行全过程

CPU要执行进程中的代码，就需要知道对应代码的地址，所以在磁盘的可执行程序中，尽管其未加载到内存，但是在编译链接时就已经形成了地址，使用下面的指令对`main`程序进行反汇编可以看到每一个步骤对应的虚拟地址：

!!! note

    注意，不是物理地址，因为此时可执行程序还没有被加载到内存，只有被加载到内存后，才有物理地址。此时编译器在编译生成可执行程序的过程中使用的模式就是平坦模式

!!! info "平坦模式"
    平坦模式（Flat Mode）是指在计算机系统中的一种内存管理模式，其中整个地址空间被看作是单一的、连续的线性空间。在这种模式下，所有代码和数据都位于一个大的、平坦的地址范围内，没有分段或分区的概念。这种模式简化了编程模型，使得编译器和程序员不需要处理复杂的段选择符或偏移量计算

```shell
objdump -S 可执行程序名
```

运行的部分结果如下：

<img src="16. Linux软链接和硬链接.assets\image40.png">

当可执行程序加载到内存之后，其ELF中的`LOAD`部分的内容就会分别被加载到指定的区域，例如`.text`的内容被加载到代码区、`.data`的内容被加载到数据区等，这个过程就完成了虚拟地址空间的初始化

但是只有初始化还不够，为了保证物理地址和可执行程序的虚拟地址可以匹配，此时就需要页表进行对应的映射

上面整个过程完成，一个可执行程序就从硬盘变为了一个可以被CPU调度的进程

接着，CPU要执行这个进程，PC寄存器就需要找到第一条指令的地址（即找到入口地址），这个地址在ELF头中可以看到`Entry point address`字段：

<img src="16. Linux软链接和硬链接.assets\image41.png">


但是这个地址依旧是虚拟地址，所以依旧需要使用页表进行映射，对应着的就是反汇编代码中的`<_start>`地址（此处`<_start>`相当于[关于函数栈帧：`main`函数被其他函数调用](https://www.help-doc.top/other/func-stack-c/func-stack-c.html#main)的`__tmainCRTStartup()`）

所以，不论是进程还是CPU的PC寄存器，二者访问到的都是虚拟地址，但是这个虚拟地址要和物理地址在页表中建立映射关系。同时CPU内部还有一个寄存器，称为CR3寄存器，其中存储的就是页表本身的物理地址，这个寄存器是操作系统本身使用的。有了CR3寄存器后，就需要一个硬件配合其完成查表的工作，这个硬件称为MMU，也是在CPU内部

!!! note

    注意，CR3不存虚拟地址

通过上面的过程，再次思考为什么需要有虚拟地址和虚拟地址空间：编译器在编译代码时不再需要考虑物理内存，完成操作系统和编译器进行解耦合

#### 理解虚拟地址空间的区域划分

前面提到，虚拟地址空间初始化时会由ELF文件中的内容对指定区域进行初始化，但是并没有看到ELF文件中存在对栈、堆和共享区进行初始化的部分，这些部分如何进行的初始化就是下面需要讨论的问题

实际上，虚拟地址空间中还存在一个结构，称为`vm_area_struct`，即虚拟区域结构，其对应的部分源码如下：

```c
struct vm_area_struct {
    struct mm_struct * vm_mm;    /* The address space we belong to. */
    unsigned long vm_start;        /* Our start address within vm_mm. */
    unsigned long vm_end;        /* The first byte after our end address
                       within vm_mm. */

    /* linked list of VM areas per task, sorted by address */
    struct vm_area_struct *vm_next;
};
```

真正的栈、堆和共享区都是`vm_area_struct`结构对象，有着自己的`vm_start`和`vm_end`用于标记区域的开始和节数，每一个`vm_area_struct`结构对象通过链表进行链接。所以，CPU在访问栈、堆和共享区时实际上访问的也是对应的`vm_area_struct`对象的虚拟地址，在页表中也存在着这些虚拟地址和物理地址的映射

有了上面这种思想，当一个可执行程序有很多内容时，操作系统可以考虑先加载一部分的Section形成`vm_area_struct`对象，再根据需要加载后面的Section，这也就实现了Section的懒加载

所以，如果有多个动态库需要加载，本质上就是创建一个`vm_area_struct`结构对象链接到指定的区域

#### 动态库加载

有了上面的铺垫，再理解动态库加载的过程：使用动态库的可执行程序在调用动态库中的方法时需要知道动态库的地址，动态库还未加载到内存之前，先使用一些内容进行占位，等到执行到指定的动态库代码再加载动态库，此时就形成了动态库的虚拟地址和物理地址映射关系，根据这个虚拟地址替换掉进程中调用动态库代码的占位内容即可。这个过程也被称为地址重定位

看似上面的思路好像没问题，实际上，虚拟地址空间的代码区是不可写的，也就是说，如果进程的代码加载到虚拟地址空间就不无法再更改其中的内容，那么此时又是如何做到使用动态库加载到内存之后的虚拟地址替换进程调用动态库代码的位置的内容

其实，进程调用动态库代码的位置的内容并不是直接写动态库的地址，而是写入一个GOT表的地址，这个表中存储的就是指定动态库和对应的虚拟地址的映射关系，进程在调用动态库代码的位置此时只需要写上调用的是GOT表中的哪一个动态库的下标即可，剩下的就交给GOT表来进行，即当动态库加载到内存后，虚拟地址填充到GOT表指定动态库对应下标即可。这也就是所谓的「生成与位置无关码」

所以，一个动态库之所以可以只加载一次而可以被任何进程所调用，本质就是因为这个GOT表，只需要知道这个GOT表的地址和对应库的下标，即可调用对应动态库中的内容

!!! info "全局偏移量表`.got`"

    GOT（Global Offset Table）：是一个数据结构，它存储了动态链接符号（如函数或变量）的地址。当动态库首次加载时，动态链接器会更新GOT中的条目以指向正确的内存位置

!!! note

    注意，静态库是不存在GOT表的