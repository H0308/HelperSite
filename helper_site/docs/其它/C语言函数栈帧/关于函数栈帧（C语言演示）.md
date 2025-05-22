# 关于函数栈帧（C语言演示）

## 介绍

在C语言中，程序是以函数为基本单位，而函数的调用、函数返回值的处理以及函数参数的传递等问题都与函数栈帧有关

函数栈帧（stack frame）就是函数调用过程中在程序的调用栈（call stack）所开辟的空间，这些空间是用来存放：

- 函数参数和函数返回值
- 临时变量（包括函数的非静态的局部变量以及编译器自动生产的其他临时变量）
- 保存上下文信息（包括在函数调用前后需要保持不变的寄存器）

## 栈

栈（stack）是现代计算机程序里最为重要的概念之一，几乎每一个程序都使用了栈，没有栈就没有函数，没有局部变量，也就没有我们如今看到的所有的计算机语言

在经典的计算机科学中，栈被定义为一种特殊的容器，用户可以将数据压入栈中（入栈，`push`），也可以将已经压入栈中的数据弹出（出栈，`pop`），但是栈这个容器必须遵守一条规则：先入栈的数据后出栈（First In Last Out， `FIFO`）。就像叠成一叠的书，先叠上去的书在最下面，因此要最后才能取出

在计算机系统中，栈则是一个具有以上属性的动态内存区域。程序可以将数据压入栈中，也可以将数据从栈顶弹出。压栈操作使得栈增大，而弹出操作使得栈减小。

在经典的操作系统中，栈总是向下增长（由高地址向低地址）的。在我们常见的i386或者x86-64下，栈顶由成为esp的寄存器进行定位的

## 函数栈帧的前置知识

### 相关寄存器

```assembly
eax：通用寄存器，保留临时数据，常用于返回值
ebx：通用寄存器，在内存寻址时存放基地址
eip：指令寄存器，保存当前指令的下一条指令的地址
ebp：栈底寄存器
esp：栈顶寄存器
```

!!! note
    寄存器`ebp`和`esp`：

    `esp`寄存器全称为Extended Stack Pointer，中文名为扩展栈指针寄存器。它内存放着一个指针，该指针永远指向系统栈最上面一个栈帧的栈顶。
    
    `ebp`寄存器全称为Extended Base Pointer，中文名为扩展基址指针寄存器。它内存放着一个指针，该指针永远指向系统栈最上面一个栈帧的底部。这两个寄存器在汇编语言中起到了重要的作用，尤其是在函数调用和参数传递过程中

### 相关汇编指令

```assembly
mov：数据转移指令
push：数据入栈，同时esp栈顶寄存器也要发生改变
pop：将数据弹出并放置在对应寄存器中，同时esp栈顶寄存器也要发生改变
sub：减法命令
add：加法命令
call：函数调用，压入返回地址并转入目标函数
jump：通过修改eip，转入目标函数，进行调用
ret：恢复返回地址，压入eip，类似pop eip命令
lea：加载有效地址
```

### 知识基础

- 每一次函数调用，都要为本次函数调用开辟空间，就是函数栈帧的空间。
- 函数栈帧空间的维护是使用了2个寄存器：`esp`和`ebp`，`ebp`记录的是栈底的地址，`esp`记录的是栈顶的地址
- 内存中，上面是高地址，下面是低地址

!!! note
    本次为了演示和理解方便，将采用上面是低地址，下面是高地址
    <img src="关于函数栈帧（C语言演示）.assets\image.png" style="zoom:50%;" >

## 函数栈帧基础剖析

演示环境：编译器VS2013

演示代码：

```c
#include <stdio.h>

int Add(int x, int y)
{
    int z = 0;
    z = x + y;
    return z;
}

int main()
{
    int a = 10;
    int b = 20;
    int ret = 0;
    ret = Add(a, b);
    printf("%d\n", ret);

    return 0;
}
```

### `main`函数由其他函数调用

`main`函数在编译器VS2013上由以下函数调用：

<img src="关于函数栈帧（C语言演示）.assets\image1.png">

在VS2013中，`main`函数被`__tmainCRTStartup()`调用，对应`main`的返回值给一个名为`mainret`的变量

<img src="关于函数栈帧（C语言演示）.assets\image2.png">

!!! note
    上述内容了解即可，在不同的编译器下调用可能不同，在下面的分析中不包括调用`main`函数的函数

    关于其中的`argc`、`argv`和`envp`见[Linux部分讲解](https://www.help-doc.top/Linux/10.%20Linux%E5%91%BD%E4%BB%A4%E8%A1%8C%E4%B8%8E%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F/10.%20Linux%E5%91%BD%E4%BB%A4%E8%A1%8C%E4%B8%8E%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F.html)

### 函数栈帧分析

#### 反汇编

首先，执行函数的调试，并转到反汇编

```assembly
int main()
{
00091410  push        ebp  
00091411  mov         ebp,esp  
00091413  sub         esp,0E4h  
00091419  push        ebx  
0009141A  push        esi  
0009141B  push        edi  
0009141C  lea         edi,[ebp-0E4h]  
00091422  mov         ecx,39h  
00091427  mov         eax,0CCCCCCCCh  
0009142C  rep stos    dword ptr es:[edi]  
    int a = 10;
0009142E  mov         dword ptr [a],0Ah  
    int b = 20;
00091435  mov         dword ptr [b],14h  
    int ret = 0;
0009143C  mov         dword ptr [ret],0  
    ret = Add(a, b);
00091443  mov         eax,dword ptr [b]  
00091446  push        eax  
00091447  mov         ecx,dword ptr [a]  
0009144A  push        ecx  
0009144B  call        _Add (0910E1h)  
00091450  add         esp,8  
00091453  mov         dword ptr [ret],eax  
    printf("%d\n", ret);
00091456  mov         esi,esp  
00091458  mov         eax,dword ptr [ret]  
0009145B  push        eax  
0009145C  push        95858h  
00091461  call        dword ptr ds:[99114h]  
00091467  add         esp,8  
0009146A  cmp         esi,esp  
0009146C  call        __RTC_CheckEsp (09113Bh)  
    //system("pause");

    return 0;
00091471  xor         eax,eax  
}
```

#### 函数栈帧的创建

```assembly
00091410  push        ebp  
00091411  mov         ebp,esp  
00091413  sub         esp,0E4h  
00091419  push        ebx  
0009141A  push        esi  
0009141B  push        edi  
0009141C  lea         edi,[ebp+FFFFFF1Ch]  
00091422  mov         ecx,39h  
00091427  mov         eax,0CCCCCCCCh  
0009142C  rep stos    dword ptr es:[edi]  
00F81410  push        ebp 
```

对于上述汇编指令来说，首先`push`表示压栈操作，压入`ebp`中的数据，并使`esp`指向栈低该位置，如下图所示

<img src="关于函数栈帧（C语言演示）.assets\image3.png" style="zoom:50%;" >

当前`ebp`和`esp`中的值：

<img src="关于函数栈帧（C语言演示）.assets\image4.png">

```assembly
00F81411  mov         ebp,esp 
```

接下来执行`mov`指令，该指令表示，将`esp`中的内容给`ebp`

<img src="关于函数栈帧（C语言演示）.assets\image5.png" style="zoom:40%;" >

对于上述两句汇编代码，VS2013的效果如下：

- 未执行`push`指令之前`ebp`和`esp`中的值：

    <img src="关于函数栈帧（C语言演示）.assets\image6.png">

- 执行`push`指令之后`ebp`和`esp`中的值：

    <img src="关于函数栈帧（C语言演示）.assets\image7.png">

观察到`esp`中的值被赋值到了`ebp`中

```assembly
00F81413  sub         esp,0E4h
```

接下来执行`sub`指令，`sub`指令代表相减，该指令表示将`esp`指令中的值减去`0E4h`（h为16进制后缀），如下图所示

<img src="关于函数栈帧（C语言演示）.assets\image8.png" style="zoom:33%;" >

当前`ebp`和`esp`中的值：

<img src="关于函数栈帧（C语言演示）.assets\image9.png">

`ebp`的地址未改变，`esp`中的地址改变，即`esp`中的初始地址减去`0E4h`后的值

```assembly
00F81419  push        ebx 
00F8141A  push        esi
00F8141B  push        edi
```

接下来的三条`push`指令，向`esp`指向的空间上方压入数据，并且`esp`要指向新的位置，如图所示

```assembly
00F81419  push        ebx 
```

<img src="关于函数栈帧（C语言演示）.assets\image10.png" style="zoom:33%;" >

<img src="关于函数栈帧（C语言演示）.assets\image11.png">

当前`esp`指向的地址空间中存储着`ebx`中的数值

<img src="关于函数栈帧（C语言演示）.assets\image12.png">

```assembly
00F8141A  push        esi
```

<img src="关于函数栈帧（C语言演示）.assets\image13.png" style="zoom:33%;" >

<img src="关于函数栈帧（C语言演示）.assets\image14.png">

当前`esp`指向的地址空间中存储着`esi`中的数值

<img src="关于函数栈帧（C语言演示）.assets\image15.png">

```assembly
00F8141B  push        edi
```

<img src="关于函数栈帧（C语言演示）.assets\image16.png" style="zoom:33%;" >

<img src="关于函数栈帧（C语言演示）.assets\image17.png">

当前`esp`指向的地址空间中存储着`edi`中的数值

<img src="关于函数栈帧（C语言演示）.assets\image18.png">

!!! note
    注意每一次`push`操作相当于`esp-4`（减去双字节`dword`）

```assembly
00F8141C  lea         edi,[ebp-0E4h]
```

接下来执行`lea`指令，`lea`指令表示加载有效地址，上述汇编代码中表示将`ebp-0E4h`的地址加载到`edi`中，因为刚才`esp`中所指的地址为`ebp-0E4h`，故`ebp-0E4h`则就是`esp`未压入`edi`、esi和`ebx`之前的地址

<img src="关于函数栈帧（C语言演示）.assets\image19.png" style="zoom:33%;" >

当前`edi`中的地址

<img src="关于函数栈帧（C语言演示）.assets\image20.png">

对照初始时`esp`中的地址

<img src="关于函数栈帧（C语言演示）.assets\image21.png">

当前的`esp`、`esi`、`ebx`和`edi`

<img src="关于函数栈帧（C语言演示）.assets\image22.png">

当前`esp`、`esi`、`ebx`和`edi`的地址

<img src="关于函数栈帧（C语言演示）.assets\image23.png">

```assembly
00F81422  mov         ecx,39h
00F81427  mov         eax,0CCCCCCCCh 
00F8142C  rep stos    dword ptr es:[edi] 
```

接下来执行三条指令，代表从`edi`空间开始，每次增加4（`dword`），移动57（十六进制的39）行将该空间内容存入`0cccccccch`，一直到`ebp`所在地址

```assembly
00F81422  mov         ecx,39h
```

<img src="关于函数栈帧（C语言演示）.assets\image24.png">

```assembly
00F81427  mov         eax,0CCCCCCCCh 
```

<img src="关于函数栈帧（C语言演示）.assets\image25.png">

```assembly
00F8142C  rep stos    dword ptr es:[edi] 
//当前的esp
0x00EFF8F4  0e 11 09 00
//当前的esi
0x00EFF8F8  0e 11 09 00
//当前的ebx
0x00EFF8FC  00 00 c0 00
//初始的edi
//总共57行，对应ecx中的39h行dword（cccc为word（两个字节类似short类型），cccccccc为dword（四个字节类似int类型），即）
0x00EFF900  cc cc cc cc
0x00EFF904  cc cc cc cc
0x00EFF908  cc cc cc cc
0x00EFF90C  cc cc cc cc
0x00EFF910  cc cc cc cc
0x00EFF914  cc cc cc cc
0x00EFF918  cc cc cc cc
0x00EFF91C  cc cc cc cc
0x00EFF920  cc cc cc cc
0x00EFF924  cc cc cc cc
0x00EFF928  cc cc cc cc
0x00EFF92C  cc cc cc cc
0x00EFF930  cc cc cc cc
0x00EFF934  cc cc cc cc  
0x00EFF938  cc cc cc cc  
0x00EFF93C  cc cc cc cc  
0x00EFF940  cc cc cc cc  
0x00EFF944  cc cc cc cc  
0x00EFF948  cc cc cc cc  
0x00EFF94C  cc cc cc cc  
0x00EFF950  cc cc cc cc  
0x00EFF954  cc cc cc cc  
0x00EFF958  cc cc cc cc  
0x00EFF95C  cc cc cc cc  
0x00EFF960  cc cc cc cc  
0x00EFF964  cc cc cc cc  
0x00EFF968  cc cc cc cc  
0x00EFF96C  cc cc cc cc  
0x00EFF970  cc cc cc cc  
0x00EFF974  cc cc cc cc  
0x00EFF978  cc cc cc cc  
0x00EFF97C  cc cc cc cc  
0x00EFF980  cc cc cc cc  
0x00EFF984  cc cc cc cc  
0x00EFF988  cc cc cc cc  
0x00EFF98C  cc cc cc cc  
0x00EFF990  cc cc cc cc  
0x00EFF994  cc cc cc cc  
0x00EFF998  cc cc cc cc  
0x00EFF99C  cc cc cc cc  
0x00EFF9A0  cc cc cc cc  
0x00EFF9A4  cc cc cc cc  
0x00EFF9A8  cc cc cc cc  
0x00EFF9AC  cc cc cc cc  
0x00EFF9B0  cc cc cc cc  
0x00EFF9B4  cc cc cc cc  
0x00EFF9B8  cc cc cc cc  
0x00EFF9BC  cc cc cc cc  
0x00EFF9C0  cc cc cc cc  
0x00EFF9C4  cc cc cc cc  
0x00EFF9C8  cc cc cc cc  
0x00EFF9CC  cc cc cc cc  
0x00EFF9D0  cc cc cc cc  
0x00EFF9D4  cc cc cc cc  
0x00EFF9D8  cc cc cc cc  
0x00EFF9DC  cc cc cc cc  
0x00EFF9E0  cc cc cc cc  
//当前的ebp
0x00EFF9E4  34 fa ef 00  
```

<img src="关于函数栈帧（C语言演示）.assets\image26.png">

对照初始的`edi`

<img src="关于函数栈帧（C语言演示）.assets\image27.png">

上述代码相当于下面C语言的代码

```assembly
edi = ebp-0E4h;
ecx = 0x39;
eax = 0xCCCCCCCC;
for(; ecx = 0; --ecx,edi+=4)
{
    *(int*)edi = eax;
}
```

至此，`main`函数的函数栈帧空间创建完成，从`esp`空间开始一直到`ebp`为止的空间全为`main`函数的栈帧空间

#### 函数体

```assembly
//Add函数
int Add(int x, int y)
{
000913C0  push        ebp  
000913C1  mov         ebp,esp  
000913C3  sub         esp,0CCh  
000913C9  push        ebx  
000913CA  push        esi  
000913CB  push        edi  
000913CC  lea         edi,[ebp-0CCh]  
000913D2  mov         ecx,33h  
000913D7  mov         eax,0CCCCCCCCh  
000913DC  rep stos    dword ptr es:[edi]  
    int z = 0;
000913DE  mov         dword ptr [z],0  
    z = x + y;
000913E5  mov         eax,dword ptr [x]  
000913E8  add         eax,dword ptr [y]  
000913EB  mov         dword ptr [z],eax  
    return z;
000913EE  mov         eax,dword ptr [z]  
}
000913F1  pop         edi  
000913F2  pop         esi  
000913F3  pop         ebx  
000913F4  mov         esp,ebp  
000913F6  pop         ebp  
000913F7  ret  

//main函数
    int a = 10;
0009142E  mov         dword ptr [ebp-8],0Ah  
    int b = 20;
00091435  mov         dword ptr [ebp-14h],14h  
    int ret = 0;
0009143C  mov         dword ptr [ebp-20h],0  
    ret = Add(a, b);
00091443  mov         eax,dword ptr [ebp-14h]  
00091446  push        eax  
00091447  mov         ecx,dword ptr [ebp-8]  
0009144A  push        ecx  
0009144B  call        000910E1  
00091450  add         esp,8  
00091453  mov         dword ptr [ebp-20h],eax  
```

!!! note
    观察变量的创建时，关闭「显示符号名」
    <img src="关于函数栈帧（C语言演示）.assets\image28.png">

##### 变量`a`的创建

```assembly
int a = 10;
0009142E  mov         dword ptr [ebp-8],0Ah  
```

执行`mov`指令，将`0Ah`值放到地址`ebp-8`处

<img src="关于函数栈帧（C语言演示）.assets\image29.png" style="zoom:33%;" >

当前`ebp`中的地址为：

<img src="关于函数栈帧（C语言演示）.assets\image30.png">

两次减4到新地址，并将该地址上的值从`0xcccccccc`修改为`0x0000000a`（注意小端存储）

<img src="关于函数栈帧（C语言演示）.assets\image31.png">

##### 变量b的创建

```assembly
int b = 20;
00091435  mov         dword ptr [ebp-14h],14h  
```

接下来执行`mov`指令，将`14h`值放到`ebp-14h`（即`ebp-20`）地址处

<img src="关于函数栈帧（C语言演示）.assets\image32.png" style="zoom:33%;" >

当前`ebp`中的地址为：

<img src="关于函数栈帧（C语言演示）.assets\image33.png">

5次减4到新地址，并将该地址上的值从`0xcccccccc`修改为`0x00000014`（注意小端存储）

<img src="关于函数栈帧（C语言演示）.assets\image34.png">

##### 变量`ret`的创建

```assembly
int ret = 0;
0009143C  mov         dword ptr [ebp-20h],0  
```

接下来执行`mov`指令，将数值0放置到`ebp-20h`（`ebp-32`）的地址上

<img src="关于函数栈帧（C语言演示）.assets\image35.png" style="zoom:33%;" >

当前`ebp`中的地址为：

<img src="关于函数栈帧（C语言演示）.assets\image36.png">

8次减4到新地址，并将该地址上的值从`0xcccccccc`修改为`0x00000000`（注意小端存储）

<img src="关于函数栈帧（C语言演示）.assets\image37.png">

至此所有`main`函数中的局部变量全部创建完成，如下图所示：

<img src="关于函数栈帧（C语言演示）.assets\image38.png">

##### 传参

在调用函数之前，需要压栈进行传参操作

```assembly
00091443  mov         eax,dword ptr [ebp-14h]  
00091446  push        eax  
00091447  mov         ecx,dword ptr [ebp-8]  
0009144A  push        ecx  
00091443  mov         eax,dword ptr [ebp-14h] 
```

执行`mov`指令，将`ebp-14h`地址上的值给`eax`，因为`ebp-14h`为变量`b`所在的地址，即将`b`的值给`eax`

<img src="关于函数栈帧（C语言演示）.assets\image39.png">

```assembly
00091446  push        eax 
```

接下来执行`push`指令，将`eax`值压入栈顶，并使`esp`指针指向该位置

<img src="关于函数栈帧（C语言演示）.assets\image40.png" style="zoom:33%;" >

执行`push`之后的`esp`地址：

<img src="关于函数栈帧（C语言演示）.assets\image41.png">

对照`push`执行之前的`esp`的地址：

<img src="关于函数栈帧（C语言演示）.assets\image42.png">

```assembly
00091447  mov         ecx,dword ptr [ebp-8] 
```

接下来执行`mov`指令，将`ebp-8`地址上的数据，即变量`a`中的值给`ecx`

<img src="关于函数栈帧（C语言演示）.assets\image43.png">

```assembly
0009144A  push        ecx 
```

接下来执行`push`指令，将`ecx`值压入栈顶，并使`esp`指针指向该位置

<img src="关于函数栈帧（C语言演示）.assets\image44.png" style="zoom:33%;" >

执行`push`之后的`esp`地址：

<img src="关于函数栈帧（C语言演示）.assets\image45.png">

对照`push`执行之前的`esp`的地址：

<img src="关于函数栈帧（C语言演示）.assets\image46.png">

##### 函数调用

```assembly
0009144B  call        000910E1  
00091450  add         esp,8  
00091453  mov         dword ptr [ebp-20h],eax  
```

首先执行`call`指令，进行函数调用，在执行`call`指令之前先会把`call`指令的下一条指令的地址进行压栈操作，这个操作是为了解决当函数调用结束后要回到`call`指令的下一条指令的地方，继续往后执行

<img src="关于函数栈帧（C语言演示）.assets\image47.png" style="zoom:33%;" >

执行`call`指令后的`esp`的地址和值：

<img src="关于函数栈帧（C语言演示）.assets\image48.png">

对照未执行`call`指令之前`esp`的地址：

<img src="关于函数栈帧（C语言演示）.assets\image49.png">

```assembly
//Add函数跳转
_Add:
000910E1  jmp         000913C0 
//Add函数体
int Add(int x, int y)
{
000913C0  push        ebp  
000913C1  mov         ebp,esp  
000913C3  sub         esp,0CCh  
000913C9  push        ebx  
000913CA  push        esi  
000913CB  push        edi  
000913CC  lea         edi,[ebp-0CCh]  
000913D2  mov         ecx,33h  
000913D7  mov         eax,0CCCCCCCCh  
000913DC  rep stos    dword ptr es:[edi]  
    int z = 0;
000913DE  mov         dword ptr [z],0  
    z = x + y;
000913E5  mov         eax,dword ptr [x]  
000913E8  add         eax,dword ptr [y]  
000913EB  mov         dword ptr [z],eax  
    return z;
000913EE  mov         eax,dword ptr [z]  
}
000913F1  pop         edi  
000913F2  pop         esi  
000913F3  pop         ebx  
000913F4  mov         esp,ebp  
000913F6  pop         ebp  
000913F7  ret  
000910E1  jmp         000913C0 
```

执行`jmp`指令，跳转到指定函数位置

进入`Add`函数后，依旧先要开辟函数栈帧空间

```assembly
000913C0  push        ebp  
000913C1  mov         ebp,esp  
000913C3  sub         esp,0CCh  
000913C9  push        ebx  
000913CA  push        esi  
000913CB  push        edi  
000913CC  lea         edi,[ebp-0CCh]  
000913D2  mov         ecx,33h  
000913D7  mov         eax,0CCCCCCCCh  
000913DC  rep stos    dword ptr es:[edi]  
000913C0  push        ebp  
000913C1  mov         ebp,esp  
```

移动`esp`和`ebp`地址，使其开始维护`Add`函数的栈帧空间

<img src="关于函数栈帧（C语言演示）.assets\image50.png" style="zoom: 50%;" >

<img src="关于函数栈帧（C语言演示）.assets\image51.png">

后面的操作与`main`函数相同，不再重复介绍

栈帧空间开辟结果图

<img src="关于函数栈帧（C语言演示）.assets\image52.png" style="zoom: 67%;" >

<img src="关于函数栈帧（C语言演示）.assets\image53.png">

```assembly
//当前的esp
0x00EFF80C  e4 f9 ef 00  
//当前的esi
0x00EFF810  0e 11 09 00  
//当前的ebx
0x00EFF814  00 00 c0 00  
//初始位置的edi
//33h（十进制下的51）行初始化为0xcccccccc
0x00EFF818  cc cc cc cc  
0x00EFF81C  cc cc cc cc  
0x00EFF820  cc cc cc cc  
0x00EFF824  cc cc cc cc  
0x00EFF828  cc cc cc cc  
0x00EFF82C  cc cc cc cc  
0x00EFF830  cc cc cc cc  
0x00EFF834  cc cc cc cc  
0x00EFF838  cc cc cc cc  
0x00EFF83C  cc cc cc cc  
0x00EFF840  cc cc cc cc  
0x00EFF844  cc cc cc cc  
0x00EFF848  cc cc cc cc  
0x00EFF84C  cc cc cc cc  
0x00EFF850  cc cc cc cc  
0x00EFF854  cc cc cc cc  
0x00EFF858  cc cc cc cc  
0x00EFF85C  cc cc cc cc  
0x00EFF860  cc cc cc cc  
0x00EFF864  cc cc cc cc  
0x00EFF868  cc cc cc cc  
0x00EFF86C  cc cc cc cc  
0x00EFF870  cc cc cc cc  
0x00EFF874  cc cc cc cc  
0x00EFF878  cc cc cc cc  
0x00EFF87C  cc cc cc cc  
0x00EFF880  cc cc cc cc  
0x00EFF884  cc cc cc cc  
0x00EFF888  cc cc cc cc  
0x00EFF88C  cc cc cc cc  
0x00EFF890  cc cc cc cc  
0x00EFF894  cc cc cc cc  
0x00EFF898  cc cc cc cc  
0x00EFF89C  cc cc cc cc  
0x00EFF8A0  cc cc cc cc  
0x00EFF8A4  cc cc cc cc  
0x00EFF8A8  cc cc cc cc  
0x00EFF8AC  cc cc cc cc  
0x00EFF8B0  cc cc cc cc  
0x00EFF8B4  cc cc cc cc  
0x00EFF8B8  cc cc cc cc  
0x00EFF8BC  cc cc cc cc  
0x00EFF8C0  cc cc cc cc  
0x00EFF8C4  cc cc cc cc  
0x00EFF8C8  cc cc cc cc  
0x00EFF8CC  cc cc cc cc  
0x00EFF8D0  cc cc cc cc  
0x00EFF8D4  cc cc cc cc  
0x00EFF8D8  cc cc cc cc  
0x00EFF8DC  cc cc cc cc  
0x00EFF8E0  cc cc cc cc  
//当前的ebp
0x00EFF8E4  e4 f9 ef 00  
```

##### 变量`z`的创建

```assembly
int z = 0;
000913DE  mov         dword ptr [ebp-8],0 
```

执行过程与`main`函数相同，不再介绍，结果如图

<img src="关于函数栈帧（C语言演示）.assets\image54.png" style="zoom:50%;" >

##### 执行加法

```assembly
z = x + y;
000913E5  mov         eax,dword ptr [ebp+8]  
000913E8  add         eax,dword ptr [ebp+0Ch]  
000913EB  mov         dword ptr [ebp-8],eax
```

接下来执行`z = x + y`，首先执行`mov`指令，将`ebp+8`位置的值放到`eax`寄存器中，如下图所示

<img src="关于函数栈帧（C语言演示）.assets\image55.png" style="zoom: 50%;" >

再执行`add`指令，将`ebp+0ch`（即`ebp+12`）位置的值与`eax`中的值相加放置到`eax`中

<img src="关于函数栈帧（C语言演示）.assets\image56.png" style="zoom:50%;" >

执行完`add`指令后`eax`当前值为30

<img src="关于函数栈帧（C语言演示）.assets\image57.png">

<img src="关于函数栈帧（C语言演示）.assets\image58.png">

<img src="关于函数栈帧（C语言演示）.assets\image59.png">

最后执行`mov`指令，将`eax`中的值移动到`ebp-8`（即变量`z`）的地址处

<img src="关于函数栈帧（C语言演示）.assets\image60.png" style="zoom:50%;" >

##### 返回计算结果

```assembly
return z;
000913EE  mov         eax,dword ptr [ebp-8] 
```

执行`mov`指令，将`ebp-8`处的值放到`eax`中

##### 函数栈帧销毁

```assembly
000913F1  pop         edi  
000913F2  pop         esi  
000913F3  pop         ebx  
000913F4  mov         esp,ebp  
000913F6  pop         ebp  
000913F7  ret  
000913F1  pop         edi  
000913F2  pop         esi  
000913F3  pop         ebx  
```

执行三次`pop`指令，依次使`edi`、`esi`、`ebx`出栈，同时使`esp`指针指向`ebp-0CCh`位置处

<img src="关于函数栈帧（C语言演示）.assets\image61.png" style="zoom:50%;" >

```assembly
000913F4  mov         esp,ebp 
```

接下来执行`mov`指令，将初始的`ebp`地址给`esp`，使函数栈帧空间释放

<img src="关于函数栈帧（C语言演示）.assets\image62.png" style="zoom:50%;" >

初始时`esp`和`ebp`的地址

<img src="关于函数栈帧（C语言演示）.assets\image63.png">

执行`mov`指令后的`esp`和`ebp`的地址



<img src="关于函数栈帧（C语言演示）.assets\image64.png">

```assembly
000913F6  pop         ebp 
```

接下来执行`pop`指令，使开始`push`的`ebp`出栈，并且移动`ebp`至`main`函数的`ebp`位置

<img src="关于函数栈帧（C语言演示）.assets\image65.png" style="zoom: 67%;" >

<img src="关于函数栈帧（C语言演示）.assets\image66.png">

```assembly
000913F7  ret 
```

最后执行`ret`指令，将`ebp`当前地址`0x00091450`存入寄存器`eip`中，并使`esp`指针向下移动双字节，并且a此时`Add`函数中所有的局部变量将销毁

<img src="关于函数栈帧（C语言演示）.assets\image67.png">

```assembly
00091450  add         esp,8  
```

接下来执行`main`函数中`call`指令的下一条指令，即地址`0x00091450`对应的指令

执行`add`指令，将8加至`esp`中并使`esp`移动到`main`函数的栈顶

<img src="关于函数栈帧（C语言演示）.assets\image68.png" style="zoom:50%;" >

```assembly
00091453  mov         dword ptr [ebp-20h],eax  
```

执行`mov`指令，将`eax`的值给地址`ebp-20h`（即变量`ret`）

<img src="关于函数栈帧（C语言演示）.assets\image69.png">

<img src="关于函数栈帧（C语言演示）.assets\image70.png">

接着`main`函数继续执行，直到结尾函数栈帧销毁

!!! note
    返回对象是内置类型时，一般都是通过寄存器来带回返回值的，返回对象如果时较大的对象时，一般会在主调函数的栈帧中开辟一块空间，然后把这块空间的地址，隐式传递给被调函数，在被调函数中通过地址找到主调函数中预留的空间，将返回值直接保存到主调函数的

## 总结

通过简单分析`main`函数和`Add`函数之间的栈帧空间开辟以及相互之间的调用，了解到下面几点：

1. 任何函数在执行正式代码之前都需要进行函数栈帧的空间开辟，而函数栈帧的开辟涉及到`esp`栈顶指针和`ebp`栈低指针，这两个指针负责维护二者范围内函数栈帧空间，在此过程中，空间中的内容会被赋值为`0xcccccccc`，导致未赋初始值的变量为随机值
2. 函数局部变量的开辟是通过栈低指针进行地址运算为不同的变量开辟空间
3. 在函数调用过程中，后面的函数参数会被先压栈，再者就是前一个变量，并且形参压栈比调用的函数的栈帧空间开辟的时间要早，由全新的一块空间负责存储调用函数时传入的实参的值，所以在函数中改变形参不会影响实参，因为形参和实参是两块不同的空间。最后在调用的函数的栈帧空间销毁时，先销毁调用的函数的栈帧空间，再通过`esp`指针移动从而销毁形参
4. 在调用的函数返回值时，并不是变量将该值带回，而是通过寄存器存储值，将值返回给调用函数的函数接收