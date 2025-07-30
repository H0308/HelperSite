# Linux中输入和输出基本过程

## 文件内核级缓冲区

前面在如何理解Linux一切皆文件的特点中提到为了保证在Linux中所有进程访问文件时的方式趋近相同，在`file`结构体中存在一个`files_operations`结构体指针，对应的结构体保存所有文件操作的函数指针（这个结构体也被称为操作表）

每一个`file`结构体中除了有自己的操作表以外还有一个文件的内核级缓冲区，这个缓冲区不同于语言层面的缓冲区，在调用底层系统接口的读或者写时，会有一方先将内容保存到该缓冲区，再将内容移动到指定设备

例如，对于读函数`read`来说，以从磁盘文件读取文件内容为例，首先操作系统会从磁盘中读取文件内容到缓冲区，再由`read`函数从缓冲区将内容读取到指定的设备；对于`write`函数来说，首先操作系统会将内存中需要写入的内容先写入缓冲区，再由`write`函数从缓冲区写入到磁盘中。除了前面提到的两个单一过程外，还要一种复合过程：对文件的内容进行修改。这一种过程既涉及到读取，也涉及到写入，所以首先需要通过操作系统读入需要修改的内容到内核级缓冲区，由`read`函数将缓冲区中的数据读到内存，在程序运行中对读取到的内容进行修改，再通过`write`函数将修改后的内容写入到缓冲区，最后由操作系统从缓冲区写入到磁盘

如果抽象化一下`read`函数和`write`函数的过程可以发现这两个函数的基本行为就是读写缓冲区，所以这两个函数也可以理解为拷贝函数，`read`函数即为将缓冲区中的数据拷贝到内存中的指定位置，`write`函数即为将内存中的数据拷贝到缓冲区

上面整个过程中，`read`函数和`write`函数只完成对缓冲区中的数据进行处理，但是缓冲区中的数据何时移动到指定的设备由操作系统自主决定

!!! note
    如果用户向自主决定何时将内核级缓冲区中的数据刷新到内核级缓冲区可以使用`fsync`函数，其原型如下：

    ```c
    int fsync(int fd);
    ```

读或者写过程示意图如下：

<img src="14. Linux中输入和输出基本过程.assets\image.png">

## 何为重定向

前面提到，文件描述符是Linux中每一个文件的唯一标识符，也就是说，通过文件描述符可以唯一确定一个文件，而`stdin`、`stdout`和`stderr`是每一个C语言程序默认打开的三个文件，对应的文件描述符为0、1和2，而之所以文件描述符是从0开始，本质是因为文件描述符是`fd_array`数组的下标，当用户再打开一个文件时，对应的文件结构指针就会存储到`fd_array`的指定位置，而因为下标0、1和2已经被占用，所以新开的文件对应的下标只能从3开始

现在关闭0号位置的文件，观察效果，例如下面的代码：

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main()
{
    close(0);
    int fd1 = open("test1.txt", O_WRONLY | O_TRUNC | O_CREAT);
    int fd2 = open("test2.txt", O_WRONLY | O_TRUNC | O_CREAT);
    int fd3 = open("test3.txt", O_WRONLY | O_TRUNC | O_CREAT);
    int fd4 = open("test4.txt", O_WRONLY | O_TRUNC | O_CREAT);

    printf("%d\n", fd1);
    printf("%d\n", fd2);
    printf("%d\n", fd3);
    printf("%d\n", fd4);

    close(fd1);
    close(fd2);
    close(fd3);
    close(fd4);

    return 0;
}
```

编译运行上面的代码后可以看到结果如下：

<img src="14. Linux中输入和输出基本过程.assets\image1.png">

如果关闭的是2号文件，观察效果，例如下面的代码：

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main()
{
    close(2);
    int fd1 = open("test1.txt", O_WRONLY | O_TRUNC | O_CREAT);
    int fd2 = open("test2.txt", O_WRONLY | O_TRUNC | O_CREAT);
    int fd3 = open("test3.txt", O_WRONLY | O_TRUNC | O_CREAT);
    int fd4 = open("test4.txt", O_WRONLY | O_TRUNC | O_CREAT);

    printf("%d\n", fd1);
    printf("%d\n", fd2);
    printf("%d\n", fd3);
    printf("%d\n", fd4);

    close(fd1);
    close(fd2);
    close(fd3);
    close(fd4);

    return 0;
}
```

编译运行上面的代码后可以看到结果如下：

<img src="14. Linux中输入和输出基本过程.assets\image2.png">

从上面的代码中可以看出，在Linux中，一个文件被打开时，文件描述符的分配原则是在`fd_array`中找到最小的且没有被其他`file`结构指针占用的位置

以关闭0号位置为例，示意图如下：

<img src="14. Linux中输入和输出基本过程.assets\image3.png">

在上面的演示中，先关闭了某一个文件描述符较前的文件，再打开另一个文件，打开的这个文件所处的位置是就是被关闭的那个文件的位置，此时再使用输出语句输出内容，原本应该输出到文件描述符较前的原始文件中，比如前面的`stdin`，后面却输出到了文件中`test1.txt`，这个过程就称为文件重定向，主要原理就是文件描述符是固定不变的，而输出和输入只认文件描述符，不会在意这个文件描述符对应的位置指向的是哪一个文件

在Linux中，存在一个系统调用接口使得可以在程序中实现重定向，这个函数为`dup2`，其原型如下：

```c
int dup2(int oldfd, int newfd);
```

在Linux操作手册中，`dup2`函数的描述如下：

!!! quote
    dup2() makes newfd be the copy of oldfd, closing newfd first if necessary

参数解释：

1. `oldfd`：该参数表示待拷贝的文件的文件指针对应的文件描述符
2. `newfd`：该参数表示被覆盖的文件的文件指针对应的文件描述符

示意图如下：

<img src="14. Linux中输入和输出基本过程.assets\image5.png">

所以，使用`dup2`就可以实现使用`printf`函数本应该输出到`stdout`中，而输出到`test1.txt`的效果，代码如下：

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <fcntl.h>

int main()
{
    int fd1 = open("test1.txt", O_WRONLY | O_TRUNC | O_CREAT, 0666);
    int fd2 = open("test2.txt", O_WRONLY | O_TRUNC | O_CREAT, 0666);
    int fd3 = open("test3.txt", O_WRONLY | O_TRUNC | O_CREAT, 0666);
    int fd4 = open("test4.txt", O_WRONLY | O_TRUNC | O_CREAT, 0666);

    dup2(fd1, 1);

    printf("%d\n", fd1);
    printf("%d\n", fd2);
    printf("%d\n", fd3);
    printf("%d\n", fd4);

    close(fd1);
    close(fd2);
    close(fd3);
    close(fd4);

    return 0;
}
```

需要注意，因为在使用`dup2`函数之前，`stdout`已经被打开了，此时`open`函数打开`test1.txt`文件时就只能使用3号下标的位置，所以可以看到`dup2`函数的确实现了将内容输出到`test1.txt`文件而不是`stdout`中，此时示意图如下：

<img src="14. Linux中输入和输出基本过程.assets\image6.png">

这里需要注意一个细节：尽管`dup2`函数会关闭被覆盖的文件`stdout`，但是关闭后被拷贝的文件`test1.txt`占用了被覆盖的文件`stdout`的位置，所以再打开其他文件依旧会从7号位置开始，例如下面的代码演示：

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <fcntl.h>

int main()
{
    int fd1 = open("test1.txt", O_WRONLY | O_TRUNC | O_CREAT, 0666);
    int fd2 = open("test2.txt", O_WRONLY | O_TRUNC | O_CREAT, 0666);
    int fd3 = open("test3.txt", O_WRONLY | O_TRUNC | O_CREAT, 0666);
    int fd4 = open("test4.txt", O_WRONLY | O_TRUNC | O_CREAT, 0666);

    dup2(fd1, 1);
    int fd5 = open("test4.txt", O_WRONLY | O_TRUNC | O_CREAT, 0666); // 重定向后打开一个新文件
    
    printf("%d\n", fd1);
    printf("%d\n", fd2);
    printf("%d\n", fd3);
    printf("%d\n", fd4);
    printf("%d\n", fd5);


    close(fd1);
    close(fd2);
    close(fd3);
    close(fd4);
    close(fd5);

    return 0;
}
```

编译运行上面的代码后可以看到结果如下：

<img src="14. Linux中输入和输出基本过程.assets\image7.png">

但是，前面的代码中，只演示了关闭0号位置和2号位置的文件，如果此时关闭1号位置的文件，再打开同样的四个文件，输出每一个文件的文件描述符，从前面的规律可以推出，输出语句会因为1号位置的文件是`test1.txt`而将内容输出到`test1.txt`中，例如下面的代码：

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main()
{
    close(1);
    int fd1 = open("test1.txt", O_WRONLY | O_TRUNC | O_CREAT, 0666);
    int fd2 = open("test2.txt", O_WRONLY | O_TRUNC | O_CREAT, 0666);
    int fd3 = open("test3.txt", O_WRONLY | O_TRUNC | O_CREAT, 0666);
    int fd4 = open("test4.txt", O_WRONLY | O_TRUNC | O_CREAT, 0666);

    printf("%d\n", fd1);
    printf("%d\n", fd2);
    printf("%d\n", fd3);
    printf("%d\n", fd4);

    close(fd1);
    close(fd2);
    close(fd3);
    close(fd4);

    return 0;
}
```

编译运行上面的代码后可以看到不论是`test1.txt`还是其他文件都没有显示需要的内容，控制台也没有正常打印需要的内容

但是如果将代码修改为如下：

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main()
{
    // ...
    fflush(stdout);

    close(fd1);
    close(fd2);
    close(fd3);
    close(fd4);

    return 0;
}
```

编译运行上面的代码后可以看到结果如下：

<img src="14. Linux中输入和输出基本过程.assets\image4.png">

现在就引入了一个问题，为什么加了`fflush(stdout)`就可以看到需要的效果

前面提到，在调用操作系统接口中的读写函数时会涉及到一个文件内核级缓冲区，这个缓冲区是为了减少操作系统进行IO操作时产生的时间和空间的消耗，但是如果用户使用的是语言级别的接口，例如`fread`或者`fwrite`等，那么此时就会出现用户的接口到操作系统的消耗，这个消耗主要来自于语言级函数多次调用系统接口时创建函数栈帧，所以为了减少这种情况下的时间和空间消耗，就存在了语言级别的缓冲区

但是，在[实现进度条](https://www.help-doc.top/Linux/makefile-progress-bar/makefile-progress-bar.html#_1)时提到了`\n`可以刷新语言级别的缓冲区，此处为什么用了`\n`也没有刷新，原因就在于语言级别的缓冲区刷新情况有三种：

1. 行刷新，主要是`stdout`文件时的刷新
2. 满刷新，当语言级别的缓冲区写满时刷新
3. 不缓冲

而此处的`\n`就属于行刷新，但是此时的`printf`认识的`fd`为1的文件并不是`stdout`，所以行刷新就失效了，转换成默认的满刷新，所以需要调用`fflush(stdout)`将当前语言级别缓冲区中的数据调用写函数刷新到操作系统的内核级缓冲区，再由操作系统自主刷新到输出设备中

如果将前面的代码修改为如下，观察效果：

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <fcntl.h>

int main()
{
    close(1);
    int fd1 = open("test1.txt", O_WRONLY | O_TRUNC | O_CREAT, 0666);
    int fd2 = open("test2.txt", O_WRONLY | O_TRUNC | O_CREAT, 0666);
    int fd3 = open("test3.txt", O_WRONLY | O_TRUNC | O_CREAT, 0666);
    int fd4 = open("test4.txt", O_WRONLY | O_TRUNC | O_CREAT, 0666);
    
    printf("%d\n", fd1);
    printf("%d\n", fd2);
    printf("%d\n", fd3);
    printf("%d\n", fd4);

    return 0;
}
```

编译运行上面的代码后可以看到结果如下：

<img src="14. Linux中输入和输出基本过程.assets\image4.png">

可以看到此时尽管没有`fflush(stdout)`也可以正常将内容输出到`test1.txt`，主要原因是当程序即将结束时，会进行缓冲区自动刷新，相当于自动进行了一次`fflush(stdout)`，而前面调用`close(fd)`时之所以没有刷新缓冲区是因为系统内部的文件已经被关闭，语言级的缓冲区无法将内容通过系统调用刷新到系统内核级缓冲区

所以，由上面的结果可以推出，在C语言中，文件结构`FILE`肯定包含文件描述符和缓冲区，而C语言的所有输入输出函数本质也是拷贝函数，只是源头或者目标是其结构体中的缓冲区，对应的源码如下：

```c
struct _IO_FILE {
    int _flags; /* High-order word is _IO_MAGIC; rest is flags. */
#define _IO_file_flags _flags
     //缓冲区相关
 /* The following pointers correspond to the C++ streambuf protocol. */
 /* Note: Tk uses the _IO_read_ptr and _IO_read_end fields directly. */ 
    char* _IO_read_ptr; /* Current read pointer */ 
    char* _IO_read_end; /* End of get area. */ 
    char* _IO_read_base; /* Start of putback+get area. */
    char* _IO_write_base; /* Start of put area. */
    char* _IO_write_ptr; /* Current put pointer. */ 
    char* _IO_write_end; /* End of put area. */ 
    char* _IO_buf_base; /* Start of reserve area. */ 
    char* _IO_buf_end; /* End of reserve area. */
 /* The following fields are used to support backing up and undo. */ 
    char *_IO_save_base; /* Pointer to start of non-current get area. */ 
    char *_IO_backup_base; /* Pointer to first valid character of backup area */ 
    char *_IO_save_end; /* Pointer to end of non-current get area. */
    struct _IO_marker *_markers;
    struct _IO_FILE *_chain;
    int _fileno; //封装的文件描述符#if 0
    int _blksize;
#else
    int _flags2;
#endif
    _IO_off_t _old_offset; /* This used to be _offset but it's too small. */
#define __HAVE_COLUMN /* temporary */
 /* 1+column number of pbase(); 0 is unknown. */ 
    unsigned short _cur_column; 
    signed char _vtable_offset; 
    char _shortbuf[1];
 /* char* _save_gptr; char* _save_egptr; */
    _IO_lock_t *_lock;
#ifdef _IO_USE_OLD_IO_FILE
};
```

结合上面的内容，接下来对前面学习到的Linux重定向符号进行细致化：

在Linux中，重定向符号为`>`，前面学习到的指令写法是：

```shell
内容 > 文件
```

实际上，上面的写法是一种简单的写法，完整的写法如下：

```shell
内容 1 > 文件
```

表示使用指定的文件覆盖文件描述符为1的文件，也就是将指定内容从标准输出转向指定的文件

同样，如果需要关闭标准错误（文件描述符为2的文件），则写法如下：

```shell
内容 2 > 文件
```

如果使用了`cerr`/`perror`和`cout`/`printf`就会发现，默认情况下，二者并不是使用的同一个标准输出（文件描述符为1），而是`cerr`/`perror`使用标准错误（文件描述符为2），`cout`/`printf`使用标准输出（文件描述符为1），所以这种情况下，如果既使用了`cerr`/`perror`打印，也使用了`cout`/`printf`打印，那么当需要同时将标准错误信息和标准输出信息写入到同一个文件时，就可以使用下面的重定向方式：

```shell
内容 1 > 文件 2>&1
```

在上面的指令中，`&`符号与输入输出重定向结合使用时，可以用来指定文件描述符，当看到`&>`或`2>&1`这样的用法时，就表示将标准错误重定向到标准输出的同一位置，所以上面的指令就意味着，先将标准输出内容重定向到指定的文件中，再将标准错误也重定向到指定的文件中

上面的指令也等价于下面的指令：

```shell
内容 1 > 文件 2 >> 和前面相同的文件
```

## 子进程与缓冲区

前面演示的都是只有一个进程打开关闭文件，如果此时在自动刷新语言级别的缓冲区之前创建了一个子进程，观察下面代码的执行效果：

```c
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main()
{
    int fd = open("log.txt", O_CREAT | O_WRONLY | O_APPEND, 0666);
    dup2(fd, stdout->_fileno);
    // C库函数
    printf(" hello printf\n");
    fprintf(stdout, " hello fprintf\n");
    const char *message = " hello fwrite\n";
    fwrite(message, 1, strlen(message), stdout);

    // 系统调用
    const char *w = " hello write\n";
    write(1, w, strlen(w));

    // 创建子进程
    fork();
    return 0;
}
```

编译运行上面的代码，查看`log.txt`文件中的内容：

<img src="14. Linux中输入和输出基本过程.assets\image9.png">

可以看到，除了系统调用接口`write`函数以外，其他的C语言库函数均出现两次打印的情况，本质就是因为语言级缓冲区自动刷新到系统内核级缓冲区机制，而因为`fork`创建了子进程，所以子进程在不修改的情况下会共享父进程中的所有内容，包括语言级缓冲区，所以在最后程序结束时，因为父进程没有刷新语言级缓冲区，所以创建子进程之后，父子进程都要进行一次刷新操作，所以父子进程都通过系统调用接口将数据写入到内核级缓冲区中，而之所以`write`函数没有写入两次，就是因为父进程已经调用完成`write`函数了，系统内核级缓冲区已经有对应的内容，所以此时子进程就不需要再调用了，最后由操作系统决定将所有内容刷新到文件中

## 手撕一个简单的shell（版本2）

### 判断重定向命令与截取

在第一个版本中已经实现了shell基本的功能，但是前面并没有解决重定向问题，本次版本中主要实现重定向的效果

首先观察一条命令目的是将指定内容重定向到指定文件时的基本结构，以`ls`+重定向为例：

```c
// 输出重定向
ls -l > test.txt
// 追加重定向
ls -l >> test.txt
// 输入重定向
ls -l < test.txt
```

可以看到，重定向时需要使用到三个字符：`>`、`>>`和`<`，所以可以通过判断这三个字符判断是否是重定向，接下来的问题就转化为如何判断

在前面获取用户输入的命令时，将用户的输入当成一串字符串看待，接下来在另一个函数中处理该字符串（对字符串进行切割），所以判断其中的字符就需要在切割字符串时处理，并且需要在调用`strtok`函数切割前处理

可以考虑从尾部向前遍历字符串，如果遇到了三个字符中的其中一个就停止，在这个过程中，需要注意两个字符`>`和`>>`，在Linux中，对于追加重定向的符号`>>`来说，不允许两个`>`中含有空格，所以判断是`>`后还需要判断前一个字符是不是`>`，所以判断逻辑主要分成两种：

1. 是否是`>`
    1. 再判断前一个字符是否是`>`
2. 是否是`<`

!!! quote
    这里需要注意出现的先后，不要单独将`>>`拿出来判断，此时如果先写判断是否是`>`的逻辑且判断`>>`是`else if`的分支时，就会出现判断`>>`始终无法进入

反向遍历到三个符号中的一个之后进入对应分支中就可以开始处理分割问题，在C语言中，一个字符串的结尾即为`\0`，所以可以将指定位置置为`\0`达到分割的效果，分割分为三种情况：

1. `>`：将`>`位置置为0，此时前面的内容即为普通命令，后面的内容即为文件名
2. `>>`：将两个`>`位置置为0，此时前面的内容即为普通命令，后面的内容即为文件名
3. `<`：将`<`位置置为0，此时前面的内容即为普通命令，后面的内容即为文件名

需要注意，获取到的文件名不一定一开始就是有效字符，还需要处理第一个有效字符前的空格问题，所以这里可以考虑使用一个宏函数或者内联函数解决，基本思路就是一直遍历到第一个有效字符为止：

=== "宏函数"

    ```c
    // 跳过空白字符
    #define Trim(pos) do {\
        while(isspace(*pos))\
        {\
            pos++;\
        }\
    }while(0)
    ```

=== "内联函数（二级指针版本）"

    ```c
    // 二级指针
    inline void trim(char** pos) 
    {
        while(isspace(*(*pos)))
        {
            (*pos)++;
        }
    }
    ```

=== "内联函数（指针引用版本）"

    ```c
    // 指针引用
    inline void trim(char*& pos)
    {
        while(isspace(*pos))
        {
            pos++;
        }
    }
    ```

!!! note
    上面的宏函数中使用`do...while(0)`结构只是确保主体逻辑代码被代码块包裹，使结构更加清晰

示例代码如下：

```c
// 重定向状态
enum redirStatus
{
    NONE,
    APPEND,
    TRUNCATE,
    INPUT 
};
// 重定向状态码
int redirCode;
// 文件名
char* filename;

void parseInput()
{
    // ...

    // 重定向
    redirCode = NONE;
    filename = nullptr;

    printf("command start: %s\n", input_arr);
    // 判断是否存在重定向符号
    size_t end = strlen(input_arr) - 1;
    while(end)
    {
        if(input_arr[end] == '>')
        {
            // 判断前面一个字符是否是>
            if(input_arr[end - 1] == '>')
            {
                redirCode = APPEND;
                // 切割字符串
                input_arr[end - 1] = 0;
                input_arr[end] = 0;
                // 获取文件名，重定向符的下一个位置
                filename = &input_arr[end+1];
                // 去除空格
                trim(filename);
                // 查找到重定向符号后就可以停止遍历
                break;
            }
            else 
            {
                // 输出重定向
                redirCode = TRUNCATE;
                // 切割字符串
                input_arr[end] = 0;
                // 获取文件名
                filename = &input_arr[end+1];
                // 去除空格
                trim(filename);
                // 查找到重定向符号后就可以停止遍历
                break;
            }
        }
        else if(input_arr[end] == '<')
        {
            // 输入重定向
            redirCode = INPUT;
            // 切割字符串
            input_arr[end] = 0;
            // 获取文件名
            filename = &input_arr[end+1];
            // 去除空格
            trim(filename);
            // 查找到重定向符号后就可以停止遍历
            break;
        }
        else 
        {
            // 一直向前查找
            --end;
        }
    }

    printf("redir: %d\n", redirCode);
    printf("filename: %s\n", filename);
    printf("command end: %s\n", input_arr);

    // 拆分读取的字符串
    for(char* ch = strtok(input_arr, " "); (bool)ch; ch = strtok(nullptr, " "))
    {
       global_argv[global_argc++] = ch; 
    }
}
```

### 执行重定向

执行重定向不可以使用父进程执行，如果使用父进程执行，则后续执行的指令都会受到重定向的影响，所以考虑使用子进程执行

但是这里涉及到一个问题：程序替换时，被替换的代码会受到重定向的影响吗？答案是**会的**，因为重定向改的是`files_struct`结构体，该结构体存在于进程中，由于当前这个进程是子进程，程序替换本质只是替换子进程的代码和数据，而不是替换进程PCB，所以重定向会影响到被替换的代码

本质重定向就是改变输出文件，所以对于三种重定向来说，只需要在不同类型的重定向中执行不同的重定向逻辑即可：

1. 输出重定向：以覆写以及不存在新建的模式打开文件并将`stdout`位置更改为该文件
2. 追加重定向：以追加写以及不存在新建的模式打开文件并将`stdout`位置更改为该文件
3. 输入重定向：以只读模式打开文件并将`stdin`位置更改为该文件

!!! note
    下面的代码中涉及到一些错误情况的处理

示例代码如下：

```c
void executeProgram()
{
    pid_t id = fork();
    if(id == 0)
    {
        // 判断是哪一种重定向
        if(redirCode == TRUNCATE)
        {
            // 输出重定向
            // 1. 打开文件
            // 确保文件不为空
            if(filename)
            {
                int fd = open(filename, O_CREAT | O_WRONLY | O_TRUNC, 0666);
                if(fd < 0)
                {
                    exit(FILEOPENFAIL);
                }
                // 2. 重定向stdout文件为新创文件
                dup2(fd, stdout->_fileno);
            }
            else 
            {
                exit(FILENOTEXISTS);
            }
        }
        else if(redirCode == APPEND)
        {
            if(filename)
            {
                int fd = open(filename, O_CREAT | O_WRONLY | O_APPEND, 0666);
                if(fd < 0)
                {
                    exit(FILEOPENFAIL);
                }
                // 2. 重定向stdout文件为新创文件
                dup2(fd, stdout->_fileno);
            }
            else
            {
                exit(FILENOTEXISTS);
            }
        }
        else if(redirCode == INPUT)
        { 
            if(filename)
            {
                int fd = open(filename, O_RDONLY);
                if(fd < 0)
                {
                    exit(FILEOPENFAIL);
                }
                // 2. 重定向stdout文件为新创文件
                dup2(fd, stdin->_fileno);
            }
            else
            {
                exit(FILENOTEXISTS);
            }
        }
        // 重定向后恢复redirCode标记便于下次使用
        redirCode = NONE;
        // 程序替换
        execvpe(global_argv[0], global_argv, global_env);
        exit(0);
    }
    // ...
}
```

在上面代码中，尽管开启了文件，但是可以不需要关闭文件，因为当一个进程结束并被父进程回收之后，该进程的PCB以及相关的文件结构都会被释放，此时文件就会被自动关闭，所以在Linux中，文件描述符的声明周期随着进程的结束而结束

## 简单实现`stdio.h`中的文件相关操作

本次简单实现主要实现`FILE`结构体、`fwrite`函数、`fopen`函数、`fflush`函数和`fclose`函数

### `FILE`结构体

根据前面的学习，可以知道该结构体主要会存在缓冲区和文件描述符

而因为C语言的缓冲区有三种缓冲方式，所以定义一个`flag`标记缓冲区刷新模式，其值有如下三种：

```c
enum 
{
    LINE, // 行刷新
    FULL, // 满刷新
    NONE, // 不缓冲
};
```

所以此时的`FILE`定义为如下：

```c
#define SIZE 1024
struct myFILE
{
    int _fileno; // 文件描述符
    int _flag; // 刷新方式标记
    char _buffer[SIZE]; // 缓冲区
    int capacity; // 缓冲区容量
    int size; // 缓冲区有效数据个数
};

typedef struct IO_FILE myFILE; 
```

### `fopen`函数

在C语言中，`fopen`函数本质就是打开文件，所以使用到两个参数：

1. 文件名：定义为`const char* filename`
2. 打开模式：定义为`const char* mode`

在函数中，为了代码健壮性可以考虑先判断`filename`是否为空，如果不为空就调用系统接口打开文件，但是打开文件需要考虑打开方式`mode`，本次主要考虑三种：`w`、`r`和`a`，依次判断并打开文件即可

接下来考虑函数的返回值问题，对于标准库中的`fopen`函数来说，其返回值为`FILE*`，但是如果在`fopen`函数中直接返回一个局部变量就会出现野指针问题，所以考虑在函数内部返回一个在堆中开辟的空间

```c
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
```

### `fwrite`函数

写函数本质是将函数的内容拷贝到语言级缓冲区，拷贝过程中需要注意要从缓冲区已有的内容之后开始拷贝，接着如果是行刷新就进行刷新操作，最后返回写入内容个数

!!! note
    本次只考虑行刷新

```c
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
```

### `fflush`函数

对于刷新函数来说，只要语言级缓冲区有内容就可以调用系统接口`write`函数将语言级缓冲区的内容写入内核级缓冲区，写完成后将缓冲区的大小更新为0。可以考虑调用`fsync`函数每一次刷新就将内核级缓冲区的内容刷新到文件中

```c
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
```

### `fclose`函数

关闭函数需要注意关闭之前需要刷新

```c
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

### 链接基本使用
前面已经通过代码编写好了`mystdio.c`源文件，如果现在需要给其他人使用可以将`mystdio.c`源文件编译成`.o`文件，接着只需要将`mystdio.o`文件和`mystdio.h`文件给别人即可，别人只需要将对应的头文件引入，最后编译时将自己的源文件和`mystdio.o`文件一起编译生成可执行程序即可，具体内容将在[软硬链接部分](https://www.help-doc.top/Linux/soft-hard-link/soft-hard-link.html)继续讲解