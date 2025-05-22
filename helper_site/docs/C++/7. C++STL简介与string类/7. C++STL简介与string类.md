# C++STL简介与string类

## STL简介

STL(standard template libaray-标准模板库)：是C++标准库的重要组成部分，不仅是一个可复用的组件库，而且是一个包罗数据结构与算法的软件框架

### STL的版本

1. 原始版本

    Alexander Stepanov、Meng Lee 在惠普实验室完成的原始版本，本着开源精神，他们声明允许任何人任意运用、拷贝、修改、传播、商业使用这些代码，无需付费。唯一的条件就是也需要向原始版本一样做开源使用。 HP 版本--所有STL实现版本的始祖。

2. P. J. 版本

    由P. J. Plauger开发，继承自HP版本，被Windows Visual C++采用，不能公开或修改，缺陷：可读性比较低，符号命名比较怪异。

3. RW版本

    由Rouge Wage公司开发，继承自HP版本，被C+ + Builder 采用，不能公开或修改，可读性一般。

4. SGI版本

    由Silicon Graphics Computer Systems，Inc公司开发，继承自HP版 本。被GCC(Linux)采用，可移植性好，可公开、修改甚至贩卖，从命名风格和编程 风格上看，阅读性非常高。

### STL的六大组件

<img src="image\image.png">

!!! note
    在上面的图中，空间配置器实际上就是在内存池中申请空间。另外，`string`类型本不属于`STL`，因为出现得早，没被划分到`STL`中，但是其接口基本上和`STL`中其他容器的接口类似，故将其列入上图中的`STL`容器部分

## string类

在C语言中，字符串是以`'\0'`结尾的字符数组，为了操作方便，C语言还提供了和字符串相关的函数放在`string.h`中，但是在C语言中，函数和字符串类型是分割的，不符合面向对象编程的思想，并且在操作字符串的过程中还需要注意防止越界

## 标准库中的string类

1. 字符串是表示字符序列的类
2. 标准的字符串类提供了对此类对象的支持，其接口类似于标准字符容器的接口，但添加了专门用于操作
3. 单字节字符字符串的设计特性
4. `string`类是使用`char`即作为它的字符类型，使用它的默认`char_traits`和分配器类型(关于模板的更多信息，请参阅`basic_string`)
5. `string`类是`basic_string`模板类的一个实例，它使用`char`来实例化`basic_string`模板类，并用`char_traits`和`allocator`作为`basic_string`的默认参数(根于更多的模板信息请参考`basic_string`)
6. string本质上是以字符作为元素的vector特化版本；不存在0字符结尾这个概念，能装入`\0`这种数据

!!! note
    关于string是否可以存储`\0`可以参考下面的代码演示结果：
    ```c++
    #include <iostream>
    #include <string>

    int main()
    {
        std::string str;
        str.push_back('h');
        str.push_back('\0');
        for (char str1 : str)
        {
            std::cout << str1 << std::endl;
            if (str1 == '\0')
            {
                std::cout << R"(打印了\0)" << std::endl; // 使用原始字符串
            }
        }

        return 0;
    }

    ```
    
    上面的代码中使用了[原始字符串](https://www.help-doc.top/C%2B%2B/25.%20C%2B%2B11%E7%9B%B8%E5%85%B3%E6%96%B0%E7%89%B9%E6%80%A7/C%2B%2B%2011%E7%9B%B8%E5%85%B3%E6%96%B0%E7%89%B9%E6%80%A7.html#_1)

!!! note
    注意，string类独立于所使用的编码来处理字节:如果用来处理多字节或变长字符(如UTF-8)的序列，这个类的所有成员(如长度或大小)以及它的迭代器，将仍然按照字节(而不是实际编码的字符)来操作。

总结：

1. `string`是表示字符串的字符串类
2. 该类的接口与常规容器的接口基本相同，再添加了一些专门用来操作`string`的常规操作。
3. `string`在底层实际是：`basic_string`模板类的别名，`typedef basic_string<char, char_traits, allocator> string`;
4. 不能操作多字节或者变长字符的序列。

!!! note
    在使用`string`类时，必须包含`#include`头文件以及`using namespace std;`（或者展开需要使用的内容）

## string类的常用接口

| 构造函数                   | 函数原型                                                     |
| -------------------------- | ------------------------------------------------------------ |
| 无参构造函数               | `string();`                                                  |
| 拷贝构造函数               | `string (const string& str);`                                |
| 子串构造函数               | `string (const string& str, size_t pos, size_t len = npos);` |
| 使用字符串构造函数         | `string (const char* s);`                                    |
| 使用部分字符串构造函数字符 | `string (const char* s, size_t n);`                          |

```C++
//无参构造函数
#include <iostream>
using namespace std;

int main()
{
    string s1;

    return 0;
}

//使用字符串构造函数
#include <iostream>
using namespace std;

int main()
{
    string s2("hello world");
    cout << s2 << endl;

    return 0;
}
输出结果：
hello world

//使用部分字符串构造函数
#include <iostream>
using namespace std;

int main()
{
    string s3("hello world", 5);
    cout << s3 << endl;
    return 0;
}
输出结果：
hello

//子串构造函数
#include <iostream>
using namespace std;

int main()
{
    string s4 = "hello world";//当构造函数没有explicit时，可以使用赋值
    string s5(s4, 0, 7);
    cout << s5 << endl;

    return 0;
}
输出结果：
hello w
```

!!! note
    对于函数`string (const string& str, size_t pos, size_t len = npos);`来说，`pos`为起始位置，`len`为需要取的字符串的长度，如果`len`参数大于字符串的可提供的长度，那么会一直取到字符串结尾；如果使用缺省值`npos`（缺省值为`-1`），那么同样会取到字符串结尾

`string`类也有析构函数`~string()`和赋值运算符重载函数

| 赋值运算符重载函数                                   |
| :--------------------------------------------------- |
| `string& operator= (const string& str);`（对象赋值） |
| `string& operator= (const char* s);`（字符串赋值）   |
| `string& operator= (char c);`（字符赋值）            |

## string类对象对容量的操作

| 函数         | 功能                                                                             |
| ------------ | -------------------------------------------------------------------------------- |
| `size()`     | 返回字符串有效字符长度                                                           |
| `length()`   | 返回字符串有效字符长度                                                           |
| `capacity()` | 返回当前为字符串开辟的空间大小                                                   |
| `reserve()`  | 为字符串预留指定的空间                                                           |
| `resize()`   | 将有效字符的个数修改成指定个数，多出的空间默认使用\0填充，也可以使用指定字符填充 |

### `size()`函数与`length()`函数

!!! note
    对于计算字符串有效字符长度的函数来说不会计算`'\0'`，并且`size()`和`length()`的效果相同

```C++
#include <iostream>
using namespace std;

int main()
{
    string s1("hello world");
    cout << s1.size() << endl;
    cout << s1.length() << endl;
    return 0;
}
输出结果：
11
11
```

### `capacity()`函数

```C++
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello world";
    cout << s1.size() << endl;
    cout << s1.capacity() << endl;
    return 0;
}
输出结果：
11
15
```

在上面的代码中，`size()`和`capacity()`并不相等，所以`size()`不等同于`capacity()`，可以类比到数据结构中顺序表的有效数据个数`size`和`capacity`

#### `capacity`的扩容方式

在VS环境下面，运行下面的代码可以大致估算得到`capacity`的扩容倍数

```C++
#include <iostream>
using namespace std;

int main()
{
    string s = "";
    size_t sz = s.capacity();
    cout << "start：" << sz << '\n';
    cout << "making s grow:\n";
    for (int i = 0; i < 100; ++i)
    {
        s.push_back('c');
        if (sz != s.capacity())
        {
            sz = s.capacity();
            cout << "capacity changed: " << sz << '\n';
        }
    }
    return 0;
}
输出结果：
start：15
making s grow:
capacity changed: 31
capacity changed: 47
capacity changed: 70
capacity changed: 105
```

!!! note
    计算`capacity`时不会计算`\0`所存在的空间

在上面的代码中，因为并没有计算`\0`所在的空间，所以实际结果为：

```C++
start：16
making s grow:
capacity changed: 32
capacity changed: 48
capacity changed: 71
capacity changed: 106
```

观察到，除了第一次和第二次以外，其余均为大致1.5倍增长，但是第一次和第二次的增长并不是2倍，而是因为VS将第一次存储字符串的位置分成了两部分，第一个部分是`_buf[16]`数组，第二个部分是`*ptr`，指向超过16个字符时存储的动态开辟的内存空间

对于下面的代码中，有一个11个字符（不包括`\0`）的字符串

```C++
#include <iostream>
using namespace std;

int main()
{
    string s = "hello world";
    size_t sz = s.capacity();
    cout << "start：" << sz << '\n';
    cout << "making s grow:\n";
    for (int i = 0; i < 100; ++i)
    {
        s.push_back('c');
        if (sz != s.capacity())
        {
            sz = s.capacity();
            cout << "capacity changed: " << sz << '\n';
        }
    }
    return 0;
}
输出结果：
start：15
making s grow:
capacity changed: 31
capacity changed: 47
capacity changed: 70
capacity changed: 105
capacity changed: 157
```

此时`hello world\0`存储的位置在`_buf[16]`数组中

<img src="image\image1.png"><img src="image\image2.png">

如果字符串的长度大于16时，则不会存储到`_buf[16]`中，而是存储到`ptr`指针指向的内存空间

<img src="image\image3.png">

可以推测出，在设计`string`类时，底层的成员变量有下面几种

```C++
class string
{
private:
    char _buf[16];//长度为16的数组
    char* ptr;//指向存储char类型元素的空间
    size_t size;
    size_t capacity;
};
```

所以在VS下，第一次和第二次之间是两倍的关系并不是扩容两倍，而是改变了存储位置

### `reserve()`函数

使用`reserve()`函数可以为字符串预留指定大小的空间，此时当指定大小远大于前面扩容的大小时一般不会再进行扩容

```C++
#include <iostream>
using namespace std;

int main()
{
    string s = "hello world";
    s.reserve(100);
    size_t sz = s.capacity();
    cout << "start：" << sz << '\n';
    cout << "making s grow:\n";
    for (int i = 0; i < 100; ++i)
    {
        s.push_back('c');
        if (sz != s.capacity())
        {
            sz = s.capacity();
            cout << "capacity changed: " << sz << '\n';
        }
    }
    return 0;
}
输出结果：
start：111
making s grow:
```

!!! note
    在VS下，使用`reserve()`函数指定的大小一般会被编译器扩大一小部分，但是在GCC下指定多少就是多少，所以在上面的代码中，虽然指定的大小为100，但是实际的大小为111
    但是不论时哪种编译平台，都要至少保证开辟的大小不能小于指定大小

使用`reserve()`函数时，如果已经有空间时，对原始空间进行扩容时不会改变有效字符长度`size`值，只会改变`capacity`的值，从而达到扩容的效果

!!! note
    注意，若扩容的值小于原始空间时，那么此时`reserve()`函数不起任何效果

```C++
#include <iostream>
using namespace std;

int main()
{
    string s = "hello world";
    size_t sz = s.capacity();
    cout << "start_capacity：" << sz << '\n';
    cout << "start_size：" << s.size() << '\n';
    s.reserve(200);
    cout << "after_capacity：" << s.capacity() << '\n';
    cout << "after_size：" << s.size() << '\n';

    return 0;
}
输出结果：
start_capacity：15
start_size：11
after_capacity：207
after_size：11
```

!!! note

    在扩容之后，尽管原始字符串的大小小于`_buf[16]`数组的长度，也会被移动到`ptr`指向的空间，如图所示

    执行`reserve()`函数前：

    <img src="image\image4.png">

    执行`reserve()`函数后：

    <img src="image\image5.png">



### `resize()`函数

不同于`reserve()`函数，使用`resize()`函数可以将原始空间扩容并且初始化扩容的空间，默认初始化字符为`\0`，当指定为某一个字符后，则将初始化对应字符

```C++
#include <iostream>
using namespace std;

int main()
{
    string s = "hello world";
    cout << "start_capacity：" << s.capacity() << '\n';
    cout << "start_size：" << s.size() << '\n';
    s.resize(200);
    cout << "after_capacity：" << s.capacity() << '\n';
    cout << "after_size：" << s.size() << '\n';

    return 0;
}
输出结果：
start_capacity：15
start_size：11
after_capacity：207
after_size：200
```

在上面的代码中，使用`resize()`函数时会同时改变`size`的大小和`capacity`的大小，`size`的大小刚好为`resize()`函数的参数值，并且默认将其余部分初始化为`\0`

<img src="image\image6.png">

也可以指定某一个字符

```C++
#include <iostream>
using namespace std;

int main()
{
    string s = "hello world";
    cout << "start_capacity：" << s.capacity() << '\n';
    cout << "start_size：" << s.size() << '\n';
    s.resize(200, '*');
    cout << "after_capacity：" << s.capacity() << '\n';
    cout << "after_size：" << s.size() << '\n';

    return 0;
}
```

<img src="image\image7.png" >

!!! note
    使用`resize()`函数还可以达到删除字符的效果，当扩容值参数的大小小于已经存在的字符串的长度时

```C++
#include <iostream>
using namespace std;

int main()
{
    string s = "hello world";
    cout << "start_capacity：" << s.capacity() << '\n';
    cout << "start_size：" << s.size() << '\n';
    s.resize(5);
    cout << s << endl;
    cout << "after_capacity：" << s.capacity() << '\n';
    cout << "after_size：" << s.size() << '\n';
    
    return 0;
}
输出结果：
start_capacity：15
start_size：11
hello
after_capacity：15
after_size：5
```

!!! note
    注意，尽管使用`resize()`函数后改变了`size`的大小，但是对于`capacity`来说，一旦在开始确定好了大小，那么使用`resize()`改变`size`的值使其小于已经设定的值，此时不会改变`capacity`的大小，因为缩容是非法的，如果支持缩容，那么证明可以支持`free`释放部分空间

## string类对象的操作

此处展示部分可能用得到的成员函数，全部成员函数参考文档：[string - C++ Reference (cplusplus.com)](https://legacy.cplusplus.com/reference/string/string/?kw=string)


| 函数         | 功能                       | 函数原型                                                     |
| ------------ | -------------------------- | ------------------------------------------------------------ |
| `push_back`  | 在字符串后尾插指定字符     | `void push_back (char c);`                                   |
| `append`     | 在字符串后追加一个字符串   | `string& append (const char* s);`（常用）                    |
| `operator+=` | 在字符串后追加字符串或字符 | `string& operator+= (const string& str);`（追加string类对象） |
|              |                            | `string& operator+= (const char* s);`（追加字符串）          |
|              |                            | `string& operator+= (char c);`（追加字符）                   |

### `push_back()`函数

使用`push_back()`函数可以在字符串后追加字符

```C++
#include <iostream>
using namespace std;

int main()
{
    string s = "hello";
    s.push_back('w');
    cout << s << endl;
    return 0;
}
输出结果：
hellow
```

### `append()`函数

使用`append()`函数可以在字符串后追加字符串

```C++
#include <iostream>
using namespace std;

int main()
{
    string s = "hello";
    s.append(" world");
    cout << s << endl;
    return 0;
}
输出结果：
hello world
```

### `operator+=()`函数（`+=`运算符重载函数）

使用`operator+=()`函数可以达到`append()`和`push_back()`的效果

```C++
#include <iostream>
using namespace std;

int main()
{
    string s = "hello world";
    string s1 = "CPP";

    //追加字符
    s += 'c';
    cout << s << endl;
    //追加字符串
    s = "hello";
    s += " world";
    cout << s << endl;
    //追加对象
    s = "hello ";
    s += s1;
    cout << s << endl;

    return 0;
}
输出结果：
hello worldc
hello world
hello CPP
```

### `operator+()`函数（+运算符重载函数）

使用`operator+()`函数可以将两个字符串相加（即合并但不改变原来的字符串）

|                           函数原型                           |
| :----------------------------------------------------------: |
| `string operator+ (const string& lhs, const string& rhs);`（将两个string类对象的字符串相加） |
| `string operator+ (const string& lhs, const char*   rhs);``string operator+ (const char*   lhs, const string& rhs);`（将字符串和对象的字符串相加） |
| `string operator+ (const string& lhs, char rhs);``string operator+ (char lhs, const string& rhs);`（将字符和对象的字符串相加） |

```C++
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello";
    string s2 = " world";
    string s3 = s1 + s2;
    cout << s1 << endl;
    cout << s2 << endl;
    cout << s3 << endl;
    return 0;
}
输出结果：
hello
 world
hello world
```

### `assign()`函数

使用`assign()`函数可以将一个对象或者字符串赋值给另一个对象

|                                    函数原型                  |
| ------------------------------------------------------------ |
| `string& assign (const string& str);`（对象赋值给调用对象）  |
| `string& assign (const string& str, size_t subpos, size_t sublen = npos);`（赋值对象中的部分字符给调用对象） |
| `string& assign (const char* s);`（将字符串赋值给调用对象）  |
| `string& assign (const char* s, size_t n);`（将部分字符串赋值给调用对象） |
| `string& assign (size_t n, char c);`（使用字符`c`填充调用对象的空间） |

```C++
//对象赋值给调用对象
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello";
    string s2("world");

    s1.assign(s2);//将s2中的内容覆盖s1对象中的内容
    cout << s1 << endl;

    return 0;
}
输出结果：
world

//赋值对象中的部分字符给调用对象
#include <iostream>
using namespace std;

int main()
{
    string s1 = "world";
    string s2 = "Linux";

    s1.assign(s2, 2, 2);//从第二个位置开始赋值2个字符给s1对象（包括第二个位置的字符）
    cout << s1 << endl;
    return 0;
}
输出结果：
nu

//将字符串赋值给调用对象
#include <iostream>
using namespace std;

int main()
{
    string s1 = "xxxxxxx";
    cout << s1 << endl;
    s1.assign("hello world");
    cout << s1 << endl;

    return 0;
}
输出结果：
xxxxxxx
hello world

//将部分字符串赋值给调用对象
#include <iostream>
using namespace std;

int main()
{
    string s1 = "xxxxxx";
    s1.assign("hello world", 5);//默认从0开始，拷贝5个字符包括0位置的字符
    cout << s1 << endl;
    return 0;
}
输出结果：
hello

//使用字符c填充调用对象的空间
#include <iostream>
using namespace std;

int main()
{
    string s1 = "xxxxx";
    s1.assign(5, 'C');
    cout << s1 << endl;
    return 0;
}
输出结果：
CCCCC
```

### `insert()`函数

使用`insert()`函数可以指定插入某个内容到字符串指定位置中

!!! note
    在插入过程中会涉及挪动数据以及扩容问题，所以不建议大量使用

| 函数原型                                                     |
| ------------------------------------------------------------ |
| `string& insert (size_t pos, const string& str);`（在调用对象的字符串`pos`位置中插入对象中的字符串） |
| `string& insert (size_t pos, const string& str, size_t subpos, size_t sublen = npos);`（在调用对象的`pos`位置插入对象中`subpos`位置开始的指定个数的字符串） |
| `string& insert (size_t pos, const char* s);`（在调用对象`pos`位置插入字符串`s`） |
| `string& insert (size_t pos, const char* s, size_t n);`（在调用对象`pos`位置插入指定个数个字符串中的字符） |
| `string& insert (size_t pos, size_t n, char c);`（在调用对象`pos`位置插入`n`个字符`c`）`void insert (iterator p, size_t n, char c);`（迭代器`p`位置开始插入`n`个字符`c`） |
| `iterator insert (iterator p, char c);`（在调用对象迭代器`p`指向位置插入字符`c`） |

!!! note
    注意插入字符串时不会覆盖原来`pos`位置存在的字符，原来`pos`位置及以后的字符向后移动

```C++
//在调用对象的字符串pos位置中插入对象中的字符串
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello-world";
    string s2 = " my ";

    s1.insert(5, s2);
    cout << s1 << endl;

    return 0;
}
输出结果：
hello my -world

//在调用对象的pos位置插入对象中subpos位置开始的指定个数的字符串
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello world";
    string s2 = "hello Linux";

    s1.insert(5, s2, 5, 6);
    cout << s1 << endl;
    return 0;
}
输出结果：
hello Linux world

//在调用对象pos位置插入字符串s
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello world";

    s1.insert(6, "CPP ");
    cout << s1 << endl;

    return 0;
}
输出结果：
hello CPP world

//在调用对象pos位置插入指定个数个字符串中的字符
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello world";

    s1.insert(6, "CPP is", 4);
    cout << s1 << endl;

    return 0;
}
输出结果：
hello CPP world

//迭代器p位置开始插入n个字符c
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello world";
    s1.insert(s1.begin() + 6, 3, 'c');//在下标6位置开始连续插入字符'c'
    cout << s1 << endl;
    return 0;
}
输出结果：
hello cccworld

//在调用对象迭代器p指向位置插入字符c
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello world";
    s1.insert(s1.begin() + 5, 'c');//在下标5位置插入字符'c'
    cout << s1 << endl;
    return 0;
}
输出结果：
helloc world
```

### `erase()`函数

使用`erase()`函数可以删除指定对象中的内容

| 函数原型                                                     |
| ------------------------------------------------------------ |
| `string& erase (size_t pos = 0, size_t len = npos);`（删除调用对象`pos`位置开始`len`长度的字符） |
| `iterator erase (iterator p);`（删除迭代器`p`指向位置的字符） |

!!! note
    因为删除字符会涉及到挪动数据，所以不推荐大量使用`erase()`函数

```c++
//删除调用对象pos位置开始len长度的字符
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello world";
    s1.erase(5, 3);
    cout << s1 << endl;
    return 0;
}
输出结果：
hellorld

//删除迭代器p指向位置的字符
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello world";
    s1.erase(s1.begin() + 5);
    cout << s1 << endl;
    return 0;
}
输出结果：
helloworld
```

### `replace()`函数

使用`replace()`函数可以替换调用对象的字符串中的字符

!!! note
    因为替换的字符串可能比被替换的字符串长，所以可能涉及到空间的扩容和数据的移动，不推荐大量使用`replace()`函数

| 函数功能                                                     |
| ------------------------------------------------------------ |
| `string& replace (size_t pos,  size_t len,  const string& str);`（使用对象中的字符串替换调用对象`pos`位置开始`len`长度的字符串） |
| `string& replace (size_t pos,  size_t len,  const string& str, size_t subpos, size_t sublen);`（使用对象中的`subpos`位置开始的`sublen`长度的字符串替换调用对象`pos`位置开始的`len`长度的字符串） |
| `string& replace (size_t pos,  size_t len,  const char* s);`（使用字符串`s`替换调用对象`pos`位置开始的`len`长度的字符串） |
| `string& replace (size_t pos,  size_t len,  const char* s, size_t n);`（使用字符串中的`n`个字符替换调用对象`pos`位置开始的`len`长度的字符串） |
| `string& replace (size_t pos,  size_t len,  size_t n, char c);`（使用`n`个字符替换调用对象`pos`位置开始的`len`长度的字符串） |

```C++
//使用对象中的字符串替换调用对象pos位置开始len长度的字符串
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello world";
    string s2 = "Linux";

    s1.replace(6, 5, s2);
    cout << s1 << endl;
    return 0;
}
输出结果：
hello Linux

//使用对象中的subpos位置开始的sublen长度的字符串替换调用对象pos位置开始的len长度的字符串
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello world";
    string s2 = "hello CPP";

    s1.replace(6, 3, s2, 6, 3);
    cout << s1 << endl;
    s1.replace(6, 5, s2, 6, 3);
    cout << s1 << endl;
    return 0;
}
输出结果：
hello CPPld
hello CPP

//使用字符串s替换调用对象pos位置开始的len长度的字符串
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello world";

    s1.replace(6, 3, "Linux");
    cout << s1 << endl;
    return 0;
}
输出结果：
hello Linuxld

//使用字符串中的n个字符替换调用对象pos位置开始的len长度的字符串
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello world";

    s1.replace(6, 3, "Linux", 3);
    cout << s1 << endl;
    return 0;
}
输出结果：
hello Linld

//使用n个字符替换调用对象pos位置开始的len长度的字符串
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello world";

    s1.replace(6, 5, 5, 'c');
    cout << s1 << endl;
    return 0;
}
输出结果：
hello ccccc
```

### `find()`函数

使用`fine()`函数可以在string对象中从前往后找某一个字符或者字符串

|                                     函数原型                 |
| ------------------------------------------------------------ |
| `size_t find (const string& str, size_t pos = 0) const;`（在调用对象的字符串中从`pos`位置开始找出现对象字符串的开始位置） |
| `size_t find (const char* s, size_t pos = 0) const;`（在调用对象的字符串中从`pos`位置找出出现字符串的开始位置） |
| `size_t find (const char* s, size_t pos, size_t n) const;`（在调用对象的字符串中从`pos`位置开始找字符串`s`中的`n`个字符的开始位置） |
| `size_t find (char c, size_t pos = 0) const;`（在调用对象的字符串中从`pos`位置开始找字符`c`的开始位置） |

```C++
//在调用对象的字符串中从pos位置开始找出现对象字符串的开始位置
#include <iostream>
using namespace std;

int main()
{
    string s1 = "This is a test string: hello world.";
    string s2 = "test";
    size_t index = s1.find(s2);
    cout << index << endl;
    return 0;
}
输出结果：
10

//在调用对象的字符串中从pos位置找出出现字符串的开始位置
#include <iostream>
using namespace std;

int main()
{
    string s1 = "This is a test string: hello world.";

    size_t pos = s1.find("is");
    while (pos != string::npos)
    {
        cout << pos << endl;
        pos = s1.find("is", pos + 1);//注意+1更改pos位置防止死循环
    }
    return 0;
}
输出结果：
2
5

//在调用对象的字符串中从pos位置开始找字符串s中的n个字符的开始位置
#include <iostream>
using namespace std;

int main()
{
    string s1 = "this is a test string: hello world.";

    size_t pos = s1.find("this is a test string", 0, 1);
    while (pos != string::npos)
    {
        cout << pos << " ";
        pos = s1.find("this is a test string", pos + 1, 1);
    }

    return 0;
}
输出结果：
0 10 13 16

//在调用对象的字符串中从pos位置开始找字符c的开始位置
//替换对象的字符串中的空格为'--'
#include <iostream>
using namespace std;

int main()
{
    string s1 = "this is a test string: hello world.";

    size_t pos = s1.find(' ');
    while (pos != string :: npos)
    {
        s1.replace(pos, 1, "--");
        pos = s1.find(' ');//因为替换了空格，所以每一次从头找时不会死循环
    }
    cout << s1 << endl;
    return 0;
}
输出结果：
this--is--a--test--string:--hello--world.
```

针对第三个题目做出的一点优化（包含之前的接口函数的使用）

第一种优化：

```C++
#include <iostream>
using namespace std;

int main()
{
    string s1 = "this is a test string: hello world.";

    size_t pos = s1.find(' ');
    //第一优化思路：提前开辟足够大小的空间避免replace的扩容
    //统计空格的个数
    int count = 0;
    for (auto ptr : s1)
    {
        if (ptr == ' ')
        {
            count++;
        }
    }
    s1.reserve(s1.size() + count);//因为替换的字符由两个，去掉替换的空格的位置之后多出来的空间即为需要的额外空间


    while (pos != string::npos)
    {
        s1.replace(pos, 1, "--");
        pos = s1.find(' ', pos + 2);//第二优化思路：因为空格被替换为了--，为了使pos指向下一个要找的位置
                                    //直接让pos跳过替换字符个数个下标
    }
    cout << s1 << endl;
    return 0;
}
输出结果：
this--is--a--test--string:--hello--world.
```

第二种优化思路：以空间换时间

```C++
#include <iostream>
using namespace std;

int main()
{
    string s1 = "this is a test string: hello world.";
    string newString;

    for (auto ptr : s1)
    {
        if (ptr != ' ')
        {
            newString += ptr;
        }
        else
        {
            newString += "--";
        }
    }

    cout << newString << endl;

    return 0;
}
输出结果：
this--is--a--test--string:--hello--world.
```

### `swap()`函数

使用`swap()`函数可以交换调用对象的字符串和另一个对象中的字符串

!!! note
    对于任意类型，标准库中还有个全局函数`swap()`，对比于string类中的`swap()`来说，类string中的`swap()`函数执行效率会被全局函数`swap()`效率更高，因为全局的`swap()`函数在拷贝过程中会调用对应对象类的拷贝构造函数，此时会有额外的空间和时间消耗

全局函数`swap()`定义：

<img src="image\image8.png" >

在前面推测过字符串存储的位置可能是数组或者指针，但是不论是那种，实际上都是地址，只要改变指向两个字符串的指针的指向即可完成交换，所以效率会比全局函数的`swap()`高

| 函数     | 函数原型                   |
| -------- | -------------------------- |
| `swap()` | `void swap (string& str);` |

```C++
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello world";
    string s2 = "hello Linux";
    cout << "交换前：" << s1 << endl;
    cout << "交换前：" << s2 << endl;
    s1.swap(s2);
    cout << "交换后：" << s1 << endl;
    cout << "交换后：" << s2 << endl;
    return 0;
}
输出结果：
交换前：hello world
交换前：hello Linux
交换后：hello Linux
交换后：hello world
```

### `c_str()`函数

使用`c_str()`函数可以按照C语言字符串的形式返回调用对象中的字符串

| 函数      | 函数原型                     |
| --------- | ---------------------------- |
| `c_str()` | `const char* c_str() const;` |

```C++
#include <iostream>
using namespace std;

int main()
{
    string s1("hello world");
    s1 += '\0';
    s1 += '\0';
    s1 += "-----";
    //s1 += "--\0----";//注意这样子写编译器会认为是\0字符串的终止，后面内容不会读入
    cout << s1 << endl;//调用重载的operator<<函数打印自定义类型
    cout << s1.c_str() << endl;//使用内置<<打印，按照size的大小打印
    cout << (void*)s1.c_str() << endl;//打印字符串所在地址，找\0结束
    return 0;
}
输出结果：
hello world-----
hello world
0000016D82281D70
```

使用场景：

```C++
//打开文件
#include <iostream>
#include <cassert>
using namespace std;

int main()
{
    string filename = "text.txt";
    FILE* fout = fopen(filename.c_str(), "w");
    assert(fout);

    return 0;
}
```

需要注意，`c_str()`函数返回的是一个字符串数组的地址，该数组中的内容和调用对象中的字符串内容相同，但是不能确定后续该字符串数组一直有效，可能调用对象改变会影响字符串数组（甚至在函数调用时不可以返回`c_str()`），所以为了使用安全，最好将`c_str()`重新拷贝到一个新数组中

### `substr()`函数

使用`substr()`函数可以截取字符串中的某一部分字符串作为子字符串返回

| 函数       | 函数原型                                                   |
| ---------- | ---------------------------------------------------------- |
| `subStr()` | `string substr (size_t pos = 0, size_t len = npos) const;` |

```C++
//找文件的后缀名
#include <iostream>
using namespace std;

int main()
{
    string s1 = "text.txt";

    //先找到后缀点
    size_t pos = s1.find('.');
    //再取pos位置开始的字符到结尾
    string suffix = s1.substr(pos);
    cout << suffix << endl;
    return 0;
}
输出结果：
.txt

//找网站域名
#include <iostream>
using namespace std;

int main()
{
    string s1 = "https://blog.csdn.net/m0_73281594?spm=1010.2135.3001.5343";
    //首先跳过网站协议部分
    size_t pos = s1.find("//");
    //再找网站第二个/
    size_t pos1 = s1.find('/', pos + 2);

    //取域名
    string web = s1.substr(pos + 2, pos1 - (pos + 2));
    cout << web << endl;
    return 0;
}
输出结果：
blog.csdn.net
```

### `rfind()`函数

使用`rfinde()`函数可以从字符串的最后一个字符向前找指定字符或字符串

| 函数原型（与`find()`类似）                                   |
| ------------------------------------------------------------ |
| `size_t rfind (const string& str, size_t pos = npos) const;` |
| `size_t rfind (const char* s, size_t pos = npos) const;`     |
| `size_t rfind (const char* s, size_t pos, size_t n) const;`  |
| `size_t rfind (char c, size_t pos = npos) const;`            |

```C++
//使用rfind()函数优化找文件后缀
#include <iostream>
using namespace std;

int main()
{
    string s1 = "test.txt.tar.zip";

    //找最后一个后缀点位置
    size_t pos = s1.rfind('.');
    //取pos位置开始到结尾的字符串
    string suffix = s1.substr(pos);

    cout << suffix << endl;

    return 0;
}
输出结果：
.zip
```

### `find_first_of()`函数

使用`find_first_of()`函数可以在对象字符串中匹配指定字符串中的内容

| 函数原型                                                     |
| ------------------------------------------------------------ |
| `size_t find_first_of (const string& str, size_t pos = 0) const;`（从`pos`位置开始在调用对象的字符串中匹配对象的字符串中的字符） |
| `size_t find_first_of (const char* s, size_t pos = 0) const;`（从`pos`位置开始在调用对象的字符串中匹配字符串中的字符） |
| `size_t find_first_of (const char* s, size_t pos, size_t n) const;`（从`pos`位置开始，在调用对象的字符串中匹配字符串中`n`位置之前的字符串的字符） |
| `size_t find_first_of (char c, size_t pos = 0) const;`（从`pos`位置开始，在调用对象的字符串中匹配字符`c`） |

```C++
//从pos位置开始在调用对象的字符串中匹配对象的字符串中的字符
//返回aeiou五个字符在字符串中出现的下标位置
#include <iostream>
using namespace std;

int main()
{
    string s1 = "this is a test string: hello world.";
    string s2 = "aeiou";
    size_t index[50] = {0};
    size_t count = 0;
    int i = 0;
    while (count != string::npos)
    {
        count = s1.find_first_of(s2, count + 1);
        index[i++] = count;
    }
    for (auto num : index)
    {
        if (num != 0 && num != string::npos)
        {
            cout << num << " ";
        }
    }
    return 0;
}
输出结果：
2 5 8 11 18 24 27 30

//从pos位置开始，在调用对象的字符串中匹配字符串中的n个字符
#include <iostream>
using namespace std;

int main()
{
    string s1 = "this is a test string: hello world.";
    size_t index[50] = { 0 };
    size_t count = 0;
    int i = 0;
    while (count != string::npos)
    {
        count = s1.find_first_of("iscpp", count + 1, 2);
        index[i++] = count;
    }
    for (auto num : index)
    {
        if (num != 0 && num != string::npos)
        {
            cout << num << " ";
        }
    }
    return 0;
}
输出结果：
2 3 5 6 12 15 18
```

同样的函数还有：

1. `find_last_of()`函数：在字符串中匹配指定字符串的字符最后一次在原始字符串中的位置
2. `find_first_not_of()`函数：在字符串中找出指定字符串中不存在的字符第一次出现的位置
3. `find_last_not_of()`函数：在字符串中找出指定字符串中不存在的字符最后一次在原始字符串中的位置

### relational operators系列函数

比较字符串之间关系的运算符：（底层调用`compare()`函数）

| 函数           | 函数原型                                                     |
| -------------- | ------------------------------------------------------------ |
| `operator==()` | `bool operator== (const string& lhs, const string& rhs);`    |
|                | `bool operator== (const char*   lhs, const string& rhs);`    |
|                | `bool operator== (const string& lhs, const char*   rhs);`（判断两个字符串/对象的字符串是否相等） |
| `operator!=()` | `bool operator!= (const string& lhs, const string& rhs);`    |
|                | `bool operator!= (const char*   lhs, const string& rhs);`    |
|                | `bool operator!= (const string& lhs, const char*   rhs);`（判断两个字符串/对象的字符串是否不相等） |
| `operator<()`  | `bool operator<  (const string& lhs, const string& rhs);`    |
|                | `bool operator<  (const char*   lhs, const string& rhs);`    |
|                | `bool operator<  (const string& lhs, const char*   rhs);`（判断第一个字符串/对象的字符串是否小于第二个字符串/对象的字符串） |
| `operator<=()` | `bool operator<= (const string& lhs, const string& rhs);`    |
|                | `bool operator<= (const char*   lhs, const string& rhs);`    |
|                | `bool operator<= (const string& lhs, const char*   rhs);`（判断第一个字符串/对象的字符串是否小于等于第二个字符串/对象的字符串） |
| `operator>()`  | `bool operator>  (const string& lhs, const string& rhs);`    |
|                | `bool operator>  (const char*   lhs, const string& rhs);`    |
|                | `bool operator>  (const string& lhs, const char*   rhs);`（判断第一个字符串/对象的字符串是否大于第二个字符串/对象的字符串） |
| `operator>=()` | `bool operator>= (const string& lhs, const string& rhs);`    |
|                | `bool operator>= (const char*   lhs, const string& rhs);`    |
|                | `bool operator>= (const string& lhs, const char*   rhs);`（判断第一个字符串/对象的字符串是否大于等于第二个字符串/对象的字符串） |

### `getline()`函数

使用`getline()`函数可以获取到指定字符（默认`'\n'`）结尾之前的字符串，具体内容见[C++ IO流](https://www.help-doc.top/C%2B%2B/30.%20C%2B%2BIO%E6%B5%81/30.%20C%2B%2BIO%E6%B5%81.html#c_2)部分

!!! note
    不同于`cin`，`cin`遇到空白字符时就会停止读入，`getline()`函数遇到`'\n'`（或者指定字符）才结束

| 函数原型                                                     |
| ------------------------------------------------------------ |
| `istream& getline (istream& is, string& str, char delim);`（获取以字符`delim`结尾之前的字符串放入对象`str`中） |
| `istream& getline (istream& is, string& str);`（获取以字符`'\n'`结尾之前的字符串放入对象str中） |

```C++
#include <iostream>
#include <string>
using namespace std;

int main()
{
    string s1;
    string s2;
    getline(cin, s1);
    cin >> s2;
    cout << s1 << endl;
    cout << s2 << endl;
    return 0;
}
输入：
hello world[Enter]
hello world[Enter]
输出结果：
hello world
hello
```

!!! note
    使用`getline()`函数需要包头文件`string`

`getline()`函数的使用练习：[字符串最后一个单词的长度_牛客题霸_牛客网 (nowcoder.com)](https://www.nowcoder.com/practice/8c949ea5f36f422594b306a2300315da?tpId=37&&tqId=21224&rp=5&ru=/activity/oj&qru=/ta/huawei/question-ranking)

参考代码：

```C++
#include <cstddef>
#include <iostream>
#include <string>
using namespace std;

int main() {
    string str;
    getline(cin, str);
    //倒着找空格
    size_t pos = str.rfind(' ');
    //取出字符
    if(pos != string::npos)
    {
        string str1 = str.substr(pos);
        cout << str1.size() - 1 << endl;
    }
    else
    {
        cout << str.size()<< endl;
    }
}
```

## string类对象的访问及遍历操作

| 函数           | 功能                                                                    |
| -------------- | ----------------------------------------------------------------------- |
| `operator[]()` | 返回`pos`位置的字符                                                     |
| `begin`+`end`  | `begin`获取第一个字符的迭代器 + `end`获取最后一个字符下一个位置的迭代器 |
| 范围`for`      | C++11支持更简洁的范围`for`的新遍历方式                                  |
| `at()`         | 访问字符串中指定位置的字符                                              |

!!! note
    注意迭代器中的`end`为最后一个字符的下一个位置，一般指向`\0`，形成左闭右开区间

```C++
#include <iostream>
using namespace std;

int main()
{
    string s = "hello world";
    //下标遍历
    for (size_t i = 0; i < s.size(); i++)
    {
        cout << s[i] << " ";
    }
    cout << endl;
    //迭代器遍历
    //获取起始地址
    for (string::iterator ptr = s.begin(); ptr != s.end(); ptr++)
    {
        cout << *ptr << "-";
    }
    cout << endl;
    //范围for
    for (auto ptr : s)
    {
        cout << ptr << "*";
    }
    cout << endl;
    //at()函数
    for (int i = 0; i < s1.size(); i++)
    {
        cout << s1.at(i) << " ";
    }

    return 0;
}
输出结果：
h e l l o   w o r l d
h-e-l-l-o- -w-o-r-l-d-
h*e*l*l*o* *w*o*r*l*d*
h e l l o   w o r l d
```

在上面的代码中是，使用了三种遍历字符串的方式，但是实际上常用的方式为下标访问的方式，并且范围`for`的本质也是迭代器，`auto ptr`本质就是调用`s.begin()`函数给`string : iterator ptr`，s的本质即为`s.end()`，通过汇编代码可以验证这一点

直接使用迭代器：

<img src="image\image9.png">

范围`for`：

<img src="image\image10.png">

### `operator[]()`与`at()`函数

对于string类来说，可以使用下标进行访问

```C++
#include <iostream>
using namespace std;

int main()
{
    string s = "hello world";
    //下标遍历
    for (size_t i = 0; i < s.size(); i++)
    {
        cout << s[i] << " ";
    }
    cout << endl;

    //at()函数
    for (int i = 0; i < s1.size(); i++)
    {
        cout << s1.at(i) << " ";
    }

    return 0;
}
输出结果：
h e l l o   w o r l d
h e l l o   w o r l d
```

`operator[]`和`at()`函数均可以使用下标的形式访问字符串，但是`at()`函数可以在对字符串进行越界访问时抛出异常，而不是像`operator[]`越界访问一样断言终止程序

```C++
//operator[]
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello world";
    cout << s1[100] << endl;
    return 0;
}
```

`operator[]`越界访问断言报错：

<img src="image\image11.png">

```C++
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello world";

    try
    {
        //使用try_catch捕获越界访问异常
        cout << s1.at(100) << endl;
    }
    catch (const exception& e)
    {
        cout << e.what() << endl;
    }
    return 0;
}
输出结果：
invalid string position
```

### string类迭代器遍历

#### 正向遍历

- 使用`begin`和`end`可以从前往后遍历字符串，使用迭代器`iterator`

| 函数      | 函数原型                                             |
| --------- | ---------------------------------------------------- |
| `begin()` | `iterator begin();`（针对于普通对象）                |
|           | `const_iterator begin() const;`（针对于`const`对象） |
| `end()`   | `iterator end();`（针对于普通对象）                  |
|           | `const_iterator end() const;`（针对于`const`对象）   |

```C++
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello world";
    string::iterator ptr = s1.begin();
    while (ptr != s1.end())
    {
        cout << *ptr << " ";
        ptr++;
    }

    return 0;
}
输出结果：
h e l l o   w o r l d
```

在上面的代码中，因为`begin()`和`end()`均返回`iterator`，所以迭代器类型需要选择`iterator`

对于`const`对象来说，需要使用`const`类型的迭代器

```C++
#include <iostream>
using namespace std;

int main()
{
    const string s2 = "hello world";
    string::const_iterator cptr = s2.begin();
    while (cptr != s2.end())
    {
        cout << *cptr << " ";
        ++cptr;
    }
}
输出结果：
h e l l o   w o r l d
```

在上面的代码中，使用了`const`类型的迭代器，但是注意该迭代器对于指针来说只是修饰指针指向的内容不可以修改，但是指针可以改变指向

!!! note
    对于`const`修饰的迭代器来说，还可以使用`cbegin()`和`cend()`

#### 逆向遍历

- 使用`rbegin`和`rend`可以从后往前遍历字符串，此时使用的迭代器为`reverse_iterator`

| 函数       | 函数原型                                                    |
| ---------- | ----------------------------------------------------------- |
| `rbegin()` | `reverse_iterator rbegin();`（针对普通对象）                |
|            | `const_reverse_iterator rbegin() const;`（针对`const`对象） |
| `rend()`   | `reverse_iterator rend();`（针对普通对象）                  |
|            | `const_reverse_iterator rend() const;`（针对`const`对象）   |

```C++
#include <iostream>
using namespace std;

int main()
{
    string s1 = "hello world";

    string::reverse_iterator ptr1 = s1.rbegin();
    while (ptr1 != s1.rend())
    {
        cout << *ptr1 << " ";
        ptr1++;
    }

    return 0;
}
```

在上面的代码中，使用`rbegin()`和`rend()`，返回类型为`reverse iterator`，故迭代器类型需要选择`reverse_iterator`

!!! note
    注意此时`ptr1`并不是`--`，而是`++`，因为此时的`rbegin`为字符串最后一个有效字符的前一个位置，而`rend`为字符串第一个有效字符的前一个位置，形成左闭右开

当使用迭代器的对象为`const`修饰时，迭代器需要同样使用`const`修饰的迭代器

```C++
#include <iostream>
using namespace std;

int main()
{
    string::const_reverse_iterator cptr1 = s2.rbegin();
    while (cptr1 != s2.rend())
    {
        cout << *cptr1 << " ";
        cptr1++;
    }
    return 0;
}
输出结果：
d l r o w   o l l e h
```

在上面的代码中，使用了`const`类型的迭代器，但是注意该迭代器对于指针来说只是修饰指针指向的内容不可以修改，但是指针可以改变指向

!!! note
    对于`const`修饰的迭代器来说，还可以使用`crbegin()`和`crend()`

