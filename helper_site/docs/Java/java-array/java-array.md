<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Java数组类型

## 一维数组

### 一维数组的声明

在Java中，数组属于引用数据类型，并且也属于一种对象，所以需要使用`new`创建对象

#### 动态数组初始化

在Java中，动态初始化方式有两种，但是这两种没有本质的区别

```Java
1. 数据类型[] 数组名 = new 数据类型[元素个数]
2. 数据类型 数组名[] = new 数据类型[元素个数]

// 动态数组初始化只会为数组开辟对应的空间
```

!!! note
    需要注意的是，与C/C++语言不同，赋值符左侧的括号中不给元素个数，而在赋值符右侧的括号中给元素个数，并且需要满足赋值符左右两边的数据类型相同

```Java
// 动态初始化数组
int arr[] = new int[5];// 声明int类型数组arr
String arr1[] = new String[5];// 声明String类型数组arr1
```

#### 静态数组的初始化

静态初始化的方式也有两种

```Java
1. 数据类型[] 数组名 = new 数据类型[]{元素1, 元素2, 元素3, 元素4, ...}
2. 数据类型 数组名[] = new 数据类型[]{元素1, 元素2, 元素3, 元素4, ...}

// 赋值符右侧的括号中可以不写元素个数
// 静态初始化会在开辟空间时存入提供的数据
```

但是上面的方法在数组元素过多时会显得冗长，所以可以简写成下面的形式

```Java
1. 数据类型[] 数组名 = {元素1, 元素2, 元素3, 元素4, ...}
2. 数据类型 数组名[] = {元素1, 元素2, 元素3, 元素4, ...}
```

!!! note
    尽管可以简写，但是本质还是第一种中的两种方式

```Java
// 静态初始化数组
int arr2[] = {1, 2, 3, 4, 5};
String arr3[] = {"字符串1", "字符串2"};
```

### 一维数组的访问

#### 数组长度

在Java中，需要获取数组的长度可以使用数组的`length`属性

```Java
package com.epsda.array;

/**
 * ClassName: test_array
 * Package: com.epsda.array
 * Description:
 *
 * @author 憨八嘎
 * @version v1.0
 */
public class test_array {
    public static void main(String[] args) {
        int arr[] = new int[5];
        int length = arr.length;
        System.out.println("length = " + length);
    }
}

输出结果：
length = 5
```

!!! note
    注意，在Java中，数组的长度是数组的属性，而不是方法，不同于C/C++中的容器长度是`size()`

#### 数组的遍历操作

```Java
package com.epsda.array;

/**
 * ClassName: test_array
 * Package: com.epsda.array
 * Description:
 *
 * @author 憨八嘎
 * @version v1.0
 */
public class test_array {
    public static void main(String[] args) {
        int arr[] = new int[5];

        // 插入数据
        for (int i = 0; i < arr.length; i++) {
            arr[i] = i;// 插入数据
            System.out.print(arr[i] + " ");
        }
    }
}

输出结果：
0 1 2 3 4
```

#### 数组中的默认值

在Java中，如果数组开辟了空间，但是并没有放入实际值，那么Java会根据对应的数据类型提供默认值，根据数据类型，有以下默认值：

1. `int/byte/short`：默认值为0
2. `double/float`：默认值为0.0
3. `char`：`'\u0000'`（代表空白字符，其整型值为0）
4. 引用数据类型：`null`
5. 布尔类型：`false`

### 数组中的两个常见异常

#### 越界访问异常`ArrayIndexOutOfBoundsException`

越界访问异常出现在数组的索引超出合法界限

```Java
public class Test_array {
    public static void main(String[] args) {
        int[] arr = new int[3];
        arr[0] = 100;
        arr[1] = 200;
        arr[2] = 300;
        //arr[3] = 400;// 索引3不再数组合法下标范围内

        //arr[-1] = 1000;// 索引-1不再数组合法下标范围内

        for (int i = 0; i <= arr.length; i++) {
            System.out.println(arr[i]);// 索引3不再数组合法下标范围内
        }
    }
}

报错结果：
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: 3
	at com.epsda.array.test_array.main(test_array.java:12)
```

#### 空指针异常`NullPointerException`

空指针异常一般出现在数组名为`null`，但是调用了其属性或者方法

```Java
public class Test_array {
    public static void main(String[] args) {
        int[] arr = new int[3];
        arr = null;// 将数组名改为null
        System.out.println(arr.length);// 数组名指向不存在的地址，但是访问了length属性
    }
}

报错结果：
Exception in thread "main" java.lang.NullPointerException
	at com.epsda.array.test_array.main(test_array.java:5)
```

### Java中的内存划分

在Java中，一共有五种内存

1. 栈（Java虚拟机栈）：Java中的方法在运行时都会进栈，也称栈帧空间
2. 本地方法栈：专门运行native方法，本地方法为对Java功能的扩充
3. 堆(Heap)：每次使用`new`创建对象，都会在堆内存中开辟空间，并为此空间自动分配一个地址值。堆中的数据根据对应的类型都有对应的默认值
4. 方法区(Method Area)：代码暂存区，记录了类的信息以及方法的信息，在方法加载到内存之前，会先将方法和类放置在方法区
5. 程序计数器：存储下一条指令

### 一维数组的内存分析

同C/C++中一样，在Java中，**数组名代表数组的地址**

```Java
package com.epsda.array;

/**
 * ClassName: test_array
 * Package: com.epsda.array
 * Description:
 *
 * @author 憨八嘎
 * @version v1.0
 */
public class test_array {
    public static void main(String[] args) {
        int arr[] = new int[5];
        System.out.println("arr = " + arr);
        }
    }
}

输出结果：
arr = [I@154617c
```

根据前面的Java内存划分，可以分析数组在内存中的结构，以下面的代码为例：

```Java
package com.epsda.array;

/**
 * ClassName: test_array
 * Package: com.epsda.array
 * Description:
 *
 * @author 憨八嘎
 * @version v1.0
 */
public class test_array {
    public static void main(String[] args) {
        // 动态初始化
        int arr[] = new int[5];
        // 尽管没有存入数据，但是有空间和默认值
        System.out.println("arr.length = " + arr.length);
        // 插入数据
        for (int i = 0; i < arr.length; i++) {
            arr[i] = i;
            System.out.print(arr[i] + " ");
        }
    }
}
```

内存中如下：

首先编译为`.class`文件后放入方法区等待方法加载到栈上

<img src="2. Java数组类型.assets/image-20240629203619914.png" alt="image-20240629203619914" />

接着执行栈上的方法

<img src="2. Java数组类型.assets/image-20240629204409502-1719665053280-1.png" alt="image-20240629204409502" />

赋值之后为：

<img src="2. Java数组类型.assets/image-20240629204520353.png" alt="image-20240629204520353" />

!!! note
    同样可以推广到多个数组占用不同空间的情况以及两个数组名指向同一块空间的情况

所以Java中的一维数组可以理解为下面的C语言代码

```C
#include <stdio.h>

int main()
{
    // 动态初始化数组
    int* arr = (int*)malloc(sizeof(int) * 5);
    // 对应int[] arr = new int[5]
    return 0;
}
```

## 二维数组

### 二维数组的声明

在Java中，二维数组同一维数组一样，使用`new`关键字创建数组对象

#### 动态初始化

```java
1. 数据类型[][] 变量名 = new 数据类型[二维数组长度][每一个一维数组长度]
2. 数据类型 变量名[][] = new 数据类型[二维数组长度][每一个一维数组长度]
    
// 也可以写成下面的形式，但是不够美观
数据类型[] 变量名[] = new 数据类型[二维数组长度][每一个一维数组长度]
```

!!! note
    注意，如果动态初始化一个二维数组时，没有给**每一个一维数组长度**值，那么此时在堆上只会开辟一个二维数组，而不会在二维数组的空间内开辟一维数组，因为一维数组的长度不确定

    如果给定了**每一个一维数组长度**，那么这个二维数组和C语言的二维数组相同，类似于一张整齐的表格，但是注意**C语言的普通二维数组是开辟在栈空间的**

#### 静态初始化

```java
1. 数据类型[][] 变量名 = new 数据类型[][]{{元素1,元素2,...}, {元素1,元素2,...}, {元素1,元素2,...}}
2. 数据类型 变量名[][] = new 数据类型[][]{{元素1,元素2,...}, {元素1,元素2,...}, {元素1,元素2,...}}
```

同样可以简写为

```java
1. 数据类型[][] 变量名 = {{元素1,元素2,...}, {元素1,元素2,...}, {元素1,元素2,...}}
2. 数据类型 变量名[][] = {{元素1,元素2,...}, {元素1,元素2,...}, {元素1,元素2,...}}
```

!!! note
    静态初始化是根据一维数组个数和一维数组元素个数推演出二维数组的长度，所以每一个一维数组长度可以不同，类似于C语言中使用动态内存函数开辟的模拟二维数组，例如下面的C语言代码

    ```c
    #include <stdio.h>

    int main()
    {
        // 定义二维数组的长度，二维数组中每一个元素为int*类型
        int* arr = (int*)malloc(sizeof(int*)*元素个数);
        // 定义每一个一维数组的长度，一维数组中每一个元素为int类型
        arr[0] = int(*)malloc(sizeof(int)*元素个数);
        arr[1] = int(*)malloc(sizeof(int)*元素个数);
        arr[2] = int(*)malloc(sizeof(int)*元素个数);
        //...
        return 0;
    }
    ```

### 二维数组的访问

二维数组的访问与一维数组基本一致

```java
package com.epsda.array;

/**
 * ClassName: test_array
 * Package: com.epsda.array
 * Description:
 *
 * @author 憨八嘎
 * @version v1.0
 */
public class test_array {
    public static void main(String[] args) {
		// 静态初始化
        int arr[][] = {{1, 2, 3}, {1, 2}, {1, 2, 3, 4, 5}};
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr[i].length; j++) {
                System.out.print(arr[i][j] + " ");
            }
            System.out.println();
        }
    }
}

输出结果：
1 2 3 
1 2 
1 2 3 4 5
```

### 二维数组的内存分析

同样可以分析出二维数组在内存上的结构：

```java
package com.epsda.array;

/**
 * ClassName: test_array
 * Package: com.epsda.array
 * Description:
 *
 * @author 憨八嘎
 * @version v1.0
 */
public class test_array {
    public static void main(String[] args) {
		// 静态初始化
        int arr[][] = {{1, 2, 3}, {1, 2}, {1, 2, 3, 4, 5}};
        for (int i = 0; i < arr.length; i++) {
            for (int j = 0; j < arr[i].length; j++) {
                System.out.print(arr[i][j] + " ");
            }
            System.out.println();
        }
    }
}
```

<img src="2. Java数组类型.assets/image-20240629212307619.png" alt="image-20240629212307619" />

类比C语言代码如下：

```c
#include <stdio.h>

int main()
{
    // 定义二维数组的长度，二维数组中每一个元素为int*类型
    int* arr = (int*)malloc(sizeof(int*)*3);
    // 定义每一个一维数组的长度，一维数组中每一个元素为int类型
    arr[0] = int(*)malloc(sizeof(int)*3);
    arr[1] = int(*)malloc(sizeof(int)*2);
    arr[2] = int(*)malloc(sizeof(int)*5);
    
    // 上面的代码相当于int arr[][] = new arr[3][]
    // arr[0] = new int[3]
    // arr[0] = new int[2]
    // arr[0] = new int[5]
    return 0;
}
```

