# Linux命令行与环境变量

## 命令行

前面写C语言时，很少关注过`main`函数的参数，也没有考虑过`main`为什么会有参数。

实际上在C语言中，`main`函数一共有三个参数，在命令行部分先关注前两个参数：

1. `argc`：表示`main`函数接收到参数个数
2. `argv`：表示`main`函数接收的参数

根据下面的代码观察这两个参数具体的效果：

```c
#include <stdio.h>

int main(int argc, char* argv[]) {
    printf("%d\n", argc);
    for(int i = 0; i < argc; i++) {
        printf("%s\n", argv[i]);
    }
}
```

对应的`Makefile`如下：

```makefile
TARGET=test 
SRC=test.c

$(TARGET):$(SRC)
        gcc $^ -o $@ -std=c99

.PHONY:clean
clean:
        rm -f $(TARGET)
```

直接运行程序可以看到下面的结果：

<img src="10. Linux命令行与环境变量.assets\image.png">

如果在输入`./test`后，再输入一些字符串可以看到下面的结果：

<img src="10. Linux命令行与环境变量.assets\image1.png">

可以看到，`argc`的值即为终端上包括`./test`在内的所有字符串的个数，而`argv`是一个字符串数组，存储着终端上包括`./test`在内的以空格间隔的字符串，这个数组的最后一个元素就是`NULL`。这就是`main`函数的两个参数。

前面提到Linux下的命令都是文件，并且因为Linux是C语言编写的，所以所有命令所带有的选项即为存储在`argv`数组中的字符串，而根据不同的参数值实现不同的功能就可以通过类似于下面的形式完成：

```c
#include <stdio.h>
#include <string.h>

int main(int argc, char* argv[])
{
    if(argc == 1) {
        printf("默认功能\n");
    } else if(strcmp(argv[1], "-f1")==0) {
        printf("功能1\n");
    }
    return 0;
}
```

## 简单介绍命令如何传递

在Linux下输入的命令首先会被Shell拿到。

前面提到父进程和子进程的代码是共有的，但是二者数据是各自独立的，但是数据独立实际上只会建立在其中一个进程修改了数据，如果二者都是对变量进行只读不写，那么也没有必要单独为两个进程开辟两个数据空间

对于上面的情况亦是如此，直接在终端上执行的进程，其父进程都是Shell，并且父进程和子进程都只是以只读的方式访问`main`函数的参数，所以就不会出现两个数据空间。

从上面的过程中也可以看出，在设计操作系统、编程语言等时，相互都是存在依赖关系的

## 环境变量

前面提到`main`函数参数实际上有三个，而这第三个参数就是所谓的环境变量`env`，与`argv`一样，`env`是一个字符串数组

使用下面的代码可以看到其中的内容：

```c
#include <stdio.h>

int main(int argc, char* argv[], char* env[])
{
    for(int i = 0; env[i]; i++) {
        printf("%s\n", env[i]);
    }
    return 0;
}
```

需要注意的是，因为`argc`只能表示`argv`中的参数个数，所以对于循环终止条件来说，因为`env`的最后一个位置时`NULL`，所以读取到`NULL`即可停止

运行上面的代码，可以看到结果是一堆字符串，这些字符串就是所谓的环境变量

在Linux中，环境变量和对应的值都是键值对的形式，一共有三种方式查看系统中的环境变量：

1. 程序中遍历`env`数组
2. `env`指令
3. 使用`environ`指针访问

`environ`本质是一个二级指针，其指向的是每一个环境变量的地址，所以通过下面的代码也可以访问到所有的环境变量：

```c
#include <stdio.h>
#include <unistd.h>

// 引入外部变量
extern char** environ;

int main() {
  
  for(int i = 0; environ[i]; i++) {
    printf("%s\n", environ[i]);
  }

  return 0;
}
```

### 环境变量`PATH`

`PATH`指定了命令默认搜索的位置，因为其值中默认是`/.../bin`，所以命令执行是会默认去`/bin`目录下找，所以前面将自己写的程序移动到`/bin`路径下就可以运行是因为默认从`/bin`路径下搜索

可以使用`echo $PATH`查看当前用户的`PATH`环境变量的值

!!! note
    也可以使用`echo ${PATH}`，此处的`{}`表示限定变量的边界

如果需要修改`PATH`值，可以使用`PATH=指定的路径`，但是这种方式只是修改了位于内存的系统进程中对应的`PATH`，而不会影响到本地配置文件中的`PATH`，并且这种方式会覆盖当前系统进程中的`PATH`值。

!!! note
    通过上述方式修改只需要退出当前用户再重新登陆即可重新加载对应的配置文件中的`PATH`

如果需要修改`PATH`对应的配置文件，可以到用户的家目录下找到`.bash_profile`文件，修改其中的`PATH`值为需要的值即可

### 环境变量`HOME`

在Linux中，`HOME`环境变量指定了每一个用户的家目录，对于root用户来说，其值即为`/root`，对于普通用户该值即为`/home/用户名`

使用`echo $HOME`查看结果如下：

普通用户：

<img src="10. Linux命令行与环境变量.assets\image2.png">

root用户：

<img src="10. Linux命令行与环境变量.assets\image3.png">

在用户登录时，首先`bash`会从配置文件中加载对应的值到`HOME`中，此时`bash`进程中的`cwd`就是家目录，因为`HOME`的值为当前用户的家目录，而因为大部分运行在`bash`进程之上的指令都是`bash`进程的子进程，子进程会与父进程共用一块数据，所以子进程的`cwd`与父进程的`cwd`相同。所以如果直接在家目录运行一个普通的程序时，查看其`cwd`值可以看到结果与父进程相同，例如下面的结果：

<img src="10. Linux命令行与环境变量.assets\image4.png">

需要注意，并不是所有的命令都是`bash`进程的子进程，例如`cd`命令

`cd` 命令并不是一个单独的进程，而是一个内建（built-in）命令。所以如果使用`cd`改变当前`bash`的工作路径，`cd`指令通过`chdir`函数对`bash`进程中的数据直接进行修改，从而达到直接改变`bash`进程的`cwd`，例如下面的效果：

!!! note
    为了更加直观得看到当前`bash`进程的`PID`，可以使用`echo $$`命令，其中的`$$`就代表当前`bash`的`PID`

<img src="10. Linux命令行与环境变量.assets\image5.png">

### 环境变量`PWD`

在Linux中，`PWD`中的值为当前用户所处的工作路径，所以使用`pwd`命令查看当前的工作路径实际上就是在读取`PWD`中的值

<img src="10. Linux命令行与环境变量.assets\image6.png">

`PWD`一般用于进程在当前工作路径下创建一个文件，在标准库中提供了一个函数为`getenv`，原型如下：

```c
char *getenv(const char *name); // 参数传递环境变量名，返回环境变量值，如果指定的环境变量不存在，则返回NULL
```

只要获取到了当前路径，就可以在当前路径下创建文件

如果需要在程序中创建或修改一个环境变量，可以使用`putenv`函数，原型如下：

```c
int putenv(char *string);// 参数传递一个键值对，如果指定的环境变量已经存在就实现修改，否则就是新增
```

对应的还有一个`OLDPWD`环境变量，该环境变量的值为上一次的工作路径，这也就是为什么使用`cd -`可以切换为上一次工作路径的原因

<img src="10. Linux命令行与环境变量.assets\image7.png">

### 环境变量`SHELL`

在Linux中，`SHELL`表示当前使用的终端：

<img src="10. Linux命令行与环境变量.assets\image8.png">

### 理解环境变量

环境变量本质是系统提供的具有全局属性的变量，既然是全局属性，则证明所有进程都可以访问到环境变量，这个过程实际上就是通过进程之间的父子关系实现的，因为环境变量本质是被`bash`进程从配置文件加载的，所以`bash`进程和其子进程就都可以看到环境变量。在大部分情况下环境变量是不会被修改的，所以`bash`进程和子进程实际上是共用一块环境变量空间

前面提到有一些指令时内建指令，另一部分是外部命令，常见的内建命令还有`echo`和`export`

在Linux中，`bash`是`shell`脚本语言的一种实现，而`shell`是一个命令行解释器，用户通过它与操作系统进行交互，它可以运行命令、脚本和程序，所以可以在命令行直接创建一个变量，这种变量也被称为本地变量，例如：

<img src="10. Linux命令行与环境变量.assets\image9.png">

本地变量与环境变量基本一致，只是本地变量不具有全局属性，即父子进程不会共享

使用`set`可以查看当前创建的本地变量和环境变量，如果想要清除指定的本地变量可以使用`unset + 本地变量名`

本地变量也可以使用`echo`命令输出：

<img src="10. Linux命令行与环境变量.assets\image10.png">

如果需要将本地变量添加到环境变量，可以使用`export`命令，例如：

<img src="10. Linux命令行与环境变量.assets\image11.png">

也可以直接将变量的初始化结合`export`使用：

<img src="10. Linux命令行与环境变量.assets\image12.png">