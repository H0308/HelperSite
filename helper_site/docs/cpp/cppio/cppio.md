# C++ IO流

C++系统中实现了一个庞大的类库，其中`ios`为基类，其他类都是直接或间接派生自`ios`类

在C++中，IO流分为三种：

1. 标准输入输出流
2. 文件读写流
3. `stringstream`流

示意图如下：

<img src="30. C++IO流.assets\image.png">

## 标准输入输出流

根据上面的示意图，C++标准库提供了4个全局流对象`cin`、`cout`、`cerr`、`clog`，使用`cout`进行标准输出，即数据从内存流向控制台（显示器）。使用`cin`进行标准输入即数据通过键盘输入到程序中，使用`cerr`用来进行标准错误的输出，以及使用`clog`进行日志的输出

从上图可以看出，`cout`、`cerr`、`clog`是`ostream`类的三个不同的对象，因此这三个对象现在基本没有区别，只是应用场景不同

基本使用如下：

```c++
#include <iostream>
using namespace std;

int main()
{
    // cin
    int a = 0;
    cin >> a;

    // cout、cerr、clog
    cout << "Hello World!" << endl;
    cerr << "Hello World!" << endl;
    clog << "Hello World!" << endl;

    return 0;
}
```

在使用上面的标准输入输出流时需要注意：

1. `cin`为缓冲流。所谓缓冲流，就是会等待键盘输入数据然后保存在缓冲区中，当要提取时，是从缓冲区中拿。如果一次输入过多，则只会提取需要的部分；如果输入错误，必须在回车之前修改，否则就会出现相关错误问题。因为存在缓冲区，所以只有把输入缓冲区中的数据取完后，在使用`cin`对象才会要求输入新的数据。对于出错时（例如用于接收输入的变量类型与输入的数据类型不匹配），则会设置对应的状态位为1进行标记，除非错误标记被清除，否则一旦有错误标记，`cin`无法继续读取
2. 空格和回车都作为数据之间的默认分隔符，分隔符不会被读入，所以多个数据可以在一行输入，也可以分行输入。但如果是字符型和字符串，则空格（ASCII码为32）无法用`cin`输入，字符串中也不能有空白字符（空格、制表符或者换行换行符），对于需要读取带空格的字符串可以使用`cin`对象中的`getline`函数一次获取一行数据并以回车为结束标记
    !!! note
        需要注意，此处提到的`getline`函数是iostream中的成员函数，而不是string类中的友元函数
3. 在C++标准库中，已经重载了内置类型的流提取和流插入运算符，但是对于自定义类型来说，如果需要使用标准输入输出就必须对流提取和流插入运算符做重载

## C++ IO流的错误状态

在C++中，IO流错误状态可以分为四种：

1. `goodbit`：正常读取标记，使用`good()`函数可以获取到对应`good`位是否为1
2. `eofbit`：读取到文件结尾结束标记，使用`eof()`函数可以获取到对应`eofbit`位是否为1
3. `failbit`：读取异常标记，一般是普通问题，例如读取时变量的类型与输入数据的类型不匹配，使用`fail()`函数可以获取到对应`failbit`位是否为1
4. `badbit`：IO流错误，一般出现均为IO流严重错误，使用`bad()`函数可以获取到对应`badbit`位是否为1

基本使用如下：

```c++
#include <iostream>
using namespace std;

int main()
{

    // 确定状态码
    cout << cin.good() << endl;
    cout << cin.eof() << endl;
    cout << cin.fail() << endl;
    cout << cin.bad() << endl << endl;

    int a = 0;
    cin >> a;

    cout << cin.good() << endl;
    cout << cin.eof() << endl;
    cout << cin.fail() << endl;
    cout << cin.bad() << endl << endl;

    cin >> a;
    cout << cin.good() << endl;
    cout << cin.eof() << endl;
    cout << cin.fail() << endl;
    cout << cin.bad() << endl << endl;

    return 0;
}
```

上面的代码中，如果输入的内容只是一个正常的整数，那么只要在`int`范围内就可以正常被变量`a`接收，单数如果输入的是一个类似于`2ll`的内容（包含非整数的内容）时，此时就会出现第二次输入无法触发，并且对应的`failbit`标记被设置为1，但是第一次的`cin`会读取到非数值前的最后一个数值（例如`2ll`的`2`），此时因为读取到了内容，所以只有`goodbit`被设置为1

因为第二次读取时，`failbit`被设置为1，所以在当前情况下，如果之后还有`cin`进行读取，除非将错误标记清除并且可以读取到缓冲区的`ll`，否则之后的会`cin`会一直无法读取，可以考虑下面的清除方式：

```c++
#include <iostream>
using namespace std;

int main()
{
    // ...

    // 清空缓冲区
    if (cin.fail())
    {
        char c = 0;
        // 清空状态码
        cin.clear();
        // 通过一个字符一个字符读取，做到清空缓冲区
        while (cin.get(c))
        {
            // 读到换行符，退出循环
            if (c == '\n')
            {
                break;
            }
        }
    }

    // 可以继续输入
    cin >> a;
    cout << cin.good() << endl;
    cout << cin.eof() << endl;
    cout << cin.fail() << endl;
    cout << cin.bad() << endl << endl;

    return 0;
}
```

## C++循环读取数据原理

有了前面对错误状态的认识，现在可以解释下面的代码可以正常执行的原因：

```c++
#include <iostream>
using namespace std;

int main()
{
    int a = 0;

    // 循环读取数据
    while (cin >> a)
    {
        cout << a << endl;
    }

    return 0;
}
```

在`iostream`类中，有一个类型重载函数`explicit operator bool() const`，其作用是将流对象强制转换为布尔类型从而进行判断，这个强制转换的过程可以理解为：当正常读取时，因为`cin`对象的`goodbit`位会被设置为1，否则其他位置为1，通过这个特性，只需要在`goodbit`位被设置为1时，就返回`true`，否则就返回`false`

在C语言中，也有对应类似的操作：

```c++
#include <stdio.h>

int main()
{
    int a = 0;
    while (scanf("%d", &a) != EOF)
    {
        printf("%d\n", a);
    }

    return 0;
}
```

此处C语言利用的则是`scanf`的返回值特性

上面的操作也被称为持续读取输入，在一些需要处理IO的OJ题上经常碰到这种做法，对于这种循环输入，也可以使用一个约定俗成的快捷键终止读取：++ctrl+z++（不是++ctrl+c++，该快捷键会直接结束进程，如果输入后面还有其他逻辑则无法执行）

## C++标准输入输出流效率问题

因为C++需要兼容C语言的输入输出，但是C++和C语言各有各的缓冲区，如果在一个C++程序中，既使用了`cout`，又使用了`printf`，此时就会出现同步的问题，对于`cin`和`scanf`也是如此，所以为了输入输出效率有时会考虑将同步关闭，下面是解除同步的方式：

```c++
#include <iostream>

int main() {
    // 解除同步
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);

    int n;
    std::cin >> n; // 使用 C++ 的输入
    std::cout << n << std::endl; // 使用 C++ 的输出
    printf("%d\n", n); // 使用 C 的输出

    return 0;
}
```

上面的代码中，可以不需要写`cout.tie(nullptr)`，因为`cout`与`cin`是绑定的，当使用`cin`时，它会自动刷新`cout`，解除这种绑定的目的是防止这种自动刷新以提高输入输出效率，所以一般情况下只需要使用一个`tie`函数即可

## C++文件读取写入流

C++根据文件内容的数据格式分为二进制文件和文本文件。采用文件流对象操作文件的一般步骤：

1. 定义一个文件流对象，有两种主要方式：
    - 单独创建读取和写入对象：使用`ifstream`创建读取对象：`ifstream ifile`（只输入用）；使用`ofstream`创建写入对象：`ofstream ofile`（只输出用）
    - 一次创建二用对象：使用`fstream`创建即可写入又可读取对象：`fstream iofile`(既输入又输出用)
2. 使用文件流对象的成员函数打开一个磁盘文件，使得文件流对象和磁盘文件之间建立联系
3. 使用提取和插入运算符对文件进行读写操作，或使用成员函数进行读写
4. 关闭文件（一般来说，可以不用显示调用`close`函数）

### 文本文件

示例代码：

```c++
#include <iostream>
#include <fstream>
using namespace std;

int main()
{
    // 创建对象并打开文件
    ofstream os("test.txt");
    // 上面的代码等价于
    // ofstream os;
    // os.open("test.txt");
    
    // 直接写一个字符串，第一个参数为字符串地址（C风格的字符串），第二个参数为需要写入的字符串长度
    os.write("hello world\n", 12);
    os.write("hello", 5);
    // 写入一个字符
    os.put('a');
    // 上面的代码等价于
    // os << 'a';
    // 写入一个字符串
    // os << "hello world" << endl;
    
    // 关闭文件
    os.close();

    // 读文件
    ifstream ifs("test.txt");
    // 读取一个字符
    char c = 0;
    ifs.get(c);
    // 上面的代码等价于
    // ifs >> c;

    cout << c << endl;
    // 让文件指针回到最开始
    ifs.seekg(ios::beg);

    // 读取一个字符串
    char buf[1024] = {0};
    ifs.getline(buf, 1024);
    char buf1[6] = { 0 };
    int num = ifs.getline(buf1, 6).gcount();

    cout << buf << endl;
    cout << num << endl;

    return 0;
}
```

!!! note
    可以通过`gcount`函数获取到`getline`函数读取到的实际字符个数

上面的代码中，因为文件的写入读取流`fstream`是`iostream`的子类，所以也可以使用对应的流提取和流插入运算符，但是需要注意的是，在读取过程中，读取的是一个字符串时，必须确保字符串中没有默认分隔符，否则流提取运算符无法读取到分隔符后面的内容（例如上面代码中的`hello world\n`使用流提取只会读取到`hello`）

需要注意上面代码中使用的是iostream中的`getline`函数的使用，该函数有两种形式：

1. `istream& getline (char* s, streamsize n)`：这一种形式默认读取`n`个字符到字符串`s`中，并且默认分隔符为`\n`，即读取到`\n`就不会继续读取。所以上面的代码中`hello world\n`的`\n`无法被读取
2. `istream& getline (char* s, streamsize n, char delim )`：这一种形式前面的两个参数与第一种形式一致，但是分隔符为指定的`delim`字符，如果在读取到的字符串中遇到了`delim`时就直接停止并且不添加`delim`到字符串中

上面`getline`的两种形式，当读取的内容小于用于接收读取内容的容器大小，则会提前结束并设置`eofbit`位。默认情况下，如果`n`大于0，则会自动在存储的字符串后自动添加一个空字符`\0`，即使提取的是空字符串也是如此

在istream头文件中，`get`函数一共有四个版本，上面的代码只使用了其中的一个版本，四个版本原型如下：

1. `int get()`：一次获取一个字符，返回对应字符的ASCII码值，否则返回`eof`
2. `istream& get( char_type& ch )`：一个获取一个字符存储到`char`类型的变量中，返回一个`istream`对象
3. `istream& get (char* s, streamsize n)`：获取`n`个字符存储到`s`数组中，返回一个`istream`对象，默认情况下，本函数的结束标志为`\n`
4. `istream& get (char* s, streamsize n, char delim)`：获取`n`个字符存储到`s`数组中，返回一个`istream`对象，默认情况下，本函数的结束标志为`delim`

与`getline`函数一致，当读取的内容小于用于接收读取内容的容器大小，则会提前结束并设置`eofbit`位。默认情况下，如果`n`大于0，则会自动在存储的字符串后自动添加一个空字符`\0`，即使提取的是空字符串也是如此

如果是string类的友元函数，则`getline`函数的原型如下：

1. `istream& getline (istream& is, string& str, char delim)`：获取以字符`delim`结尾之前的字符串放入对象`str`中
2. `istream& getline (istream& is, string& str)`：获取以字符`'\n'`结尾之前的字符串放入对象`str`中

使用string类的`getline`函数则上面的代码可以修改为：
```c++
#include <iostream>
#include <string>
#include <fstream>
using namespace std;

int main()
{
    // ...

	string str;
	int num = getline(ifs, str).gcount();

	cout << str << endl;
	cout << num << endl;

	return 0;
}
```
需要注意此时的`gcount`函数不会返回字符串的内容长度，不同于iostream中的`getline`函数，string的友元`getline`函数因为存储的对象是string，所以`getline`函数不会在字符串末尾自动添加`\0`

!!! note
    这里需要注意，C++中的string底层因为本质还是字符串数组，而之所以`getline`函数不会添加`\0`，是因为string类本质上是通过内部的成员记录插入字符的个数进行字符管理，根据有效字符个数显示字符串

对于同一个流读取，与C语言相同，在第一次读取后如果还有其他读取，其他读取会从第一次读取时的光标位置继续读取，如果想指定具体位置，可以使用`seekg`函数设置光标位置，该函数也存在两个版本：

1. `istream& seekg (streampos pos)`：直接指定默认提供的位置：`ios_base::beg`（文件开始位置）、`ios_base::cur`（文件光标当前位置，直接使用与不适用`seekg`函数一样）和`ios_base::end`（文件末尾位置）
2. `istream& seekg (streamoff off, ios_base::seekdir way)`：该函数表示从文本文件`way`位置开始向后偏移`off`个字符后的光标位置，`way`的取值与第一个版本的`pos`取值相同

### 二进制文件

二进制文件与文本文件读取的方式基本一致，只是在打开文件或者创建读取/写入对象时需要指定使用`binary`的方式打开

读取流构造定义如下：

```c++
// 字符串作为文件名
explicit ifstream (const char* filename, ios_base::openmode mode = ios_base::in);

// string类型对象作为文件名
explicit ifstream (const string& filename, ios_base::openmode mode = ios_base::in);
```

写入流构造定义如下：

```c++
// 字符串作为文件名
explicit ifstream (const char* filename, ios_base::openmode mode = ios_base::out);

// string类型对象作为文件名
explicit ifstream (const string& filename, ios_base::openmode mode = ios_base::out);
```

如果是文本文件，则第二个参数`mode`可以不传递而直接使用缺省值，但是如果是二进制文件，就需要传递对应的模式，写入流：`out | binary`，读取流：`in | binary`

除了有`binary`模式，还有下面的几种模式：

1. `ate`：从文件末尾开始
2. `app`：追加模式
3. `trunc`：覆写模式

基本使用如下（实现文件复制）：

```c++
#include <iostream>
#include <fstream>
using namespace std;

int main()
{
    ifstream is("C:\\Users\\18483\\Music\\conan-1.mp3", ios::in | ios::binary);
    ofstream os("conan-2.mp3", ios::out | ios::binary);
    // 每一次读取一个字符写入到指定位置
    char c = 0;
    while (is.get(c))
    {
        os.put(c);
    }

    return 0;
}
```

### 向文件中写入/读取对象内容（深浅拷贝问题）

以自定义`Date`类为例：

```c++
class Date
{
    friend ostream& operator << (ostream& out, const Date& d);
    friend istream& operator >> (istream& in, Date& d);

public:
    Date(int year = 1, int month = 1, int day = 1)
        :_year(year)
        , _month(month)
        , _day(day)
    {}

    operator bool()
    {
        // 这里是随意写的，假设输入_year为0，则结束
        if (_year == 0)
            return false;
        else
            return true;
    }
private:
    int _year;
    int _month;
    int _day;
};

// 重载流插入和流提取
istream& operator >> (istream& in, Date& d)
{
    in >> d._year >> d._month >> d._day;
    return in;
}

ostream& operator << (ostream& out, const Date& d)
{
    out << d._year << " " << d._month <<" "<< d._day ;
    return out;
}
```

模拟配置文件属性：

```c++
struct ServerInfo
{
    char _address[32];
    int _port;
    Date _date;
};
```

写入对象内容到配置文件/读取对象内容到配置文件工具类：

```c++
struct ConfigManager
{
public:
    ConfigManager(const char* filename)
        :_filename(filename)
    {}

    void WriteBin(const ServerInfo& info)
    {
        ofstream ofs(_filename, ios_base::out | ios_base::binary);
        ofs.write((const char*)&info, sizeof(info));
    }

    void ReadBin(ServerInfo& info)
    {
        ifstream ifs(_filename, ios_base::in | ios_base::binary);
        ifs.read((char*)&info, sizeof(info));
    }

    void WriteText(const ServerInfo& info)
    {
        ofstream ofs(_filename);
        ofs << info._address << " " << info._port<< " "<<info._date;
    }

    void ReadText(ServerInfo& info)
    {
        ifstream ifs(_filename);
        ifs >> info._address >> info._port>>info._date;
    }

private:
    string _filename; // 配置文件
};
```

测试代码：

```c++
int main()
{
    ServerInfo winfo = { "192.0.0.1", 80, { 2022, 4, 10 } };
    
    // 二进制读写
    ConfigManager cf_bin("test.bin");
    cf_bin.WriteBin(winfo);
    ServerInfo rbinfo;
    cf_bin.ReadBin(rbinfo);
    cout << rbinfo._address << "  " << rbinfo._port << "  " << rbinfo._date << endl;
    // 文本读写
    ConfigManager cf_text("test.text");
    cf_text.WriteText(winfo);
    ServerInfo rtinfo;
    cf_text.ReadText(rtinfo);
    cout << rtinfo._address << "  " << rtinfo._port << "  " << rtinfo._date << endl;
    return 0;
}
```

上面的代码中，如果将配置文件中的`char`数组改为`string`类型，此时就可能会出现深浅拷贝问题，因为存储的字符串中的字符个数大于`string`底层的`buffer`缓冲区之后，`string`就会在堆区开辟空间存储字符串，此时直接向文件中进行写入时，写入的就是对应指向堆区空间的指针，如果是读取和写入时两个单独的程序进程处理，那么此时写入时的堆区位置在程序结束就被销毁了，此时读取时读到的是一个就是一个野指针，从而导致读取失败程序崩溃

## `stringstream`流简单介绍

在C++中，可以使用`stringstream`类对象来处理字符串与其他类型的转化问题

在程序中如果想要使用`stringstream`，必须要包含头文件。在该头文件下，标准库三个类：`istringstream`、`ostringstream` 和 `stringstream`，分别用来进行流的输入、输出和输入输出操

作，下面主要介绍`stringstream`

一般情况下`stringstream`可以用来做如下的事情：

1. 将数值类型数据格式化为字符串

    ```c++
    #include <iostream>
    #include <sstream>
    using namespace std;

    int main()
    {
        int a = 12345678;
        string sa;
        // 将一个整形变量转化为字符串，存储到string类对象中
        stringstream s;
        s << a;
        s >> sa;

        s.str(""); // 清空底层string对象（将s中的内容用空字符串替换）
        s.clear();   // 清空s, 不清空会转化失败
        double d = 12.34;
        s << d;
        s >> sa;
        string sValue;
        sValue = s.str();   // str()方法：返回stringsteam中管理的string类型
        cout << sValue << endl;
        return 0;
    }
    ```

    上面的代码中，需要使用`clear`函数，因为`stringstream`在进行一次内容写入时（例如`s>>sa`），会将其内部状态设置为`badbit`，因此下一次转换是必须调用`clear`函数将状态重置为`goodbit`才可以转换，但是`clear`不会将`stringstream`对象底层字符串清空掉，如果不清空，在多次转换时，会将结果全部累积在底层`string`对象中，所以需要使用`void str (const string& s)`方法清空字符串

    !!! note
        如果`str`函数不传递任何参数，则原型为：`string str() const;`，相当于获取`stringstream`存储的字符串

2. 字符串拼接

    ```c++
    #include <iostream>
    #include <sstream>
    using namespace std;

    int main()
    {
        stringstream sstream;
        // 将多个字符串放入 sstream 中
        sstream << "first" << " " << "string,";
        sstream << " second string";
        cout << "strResult is: " << sstream.str() << endl;
        // 清空 sstream
        sstream.str("");
        sstream << "third string";
        cout << "After clear, strResult is: " << sstream.str() << endl;
        return 0;
    }
    ```

3. 序列化和反序列化结构数据

    !!! note
        序列化：输出对象内容
        
        反序列化：读取对象内容

    ```c++
    struct ChatInfo
    {
        string _name; // 名字
        int _id;      // id
        Date _date;   // 时间
        string _msg;  // 聊天信息
    };
    int main()
    {
        // 结构信息序列化为字符串
        ChatInfo winfo = { "张三", 135246, { 2022, 4, 10 }, "晚上一起看电影吧" 
    };
        ostringstream oss;
        oss << winfo._name << " " << winfo._id << " " << winfo._date << " " << winfo._msg;
        string str = oss.str();
        cout << str << endl<<endl;

        ChatInfo rInfo;
        istringstream iss(str);
        iss >> rInfo._name >> rInfo._id >> rInfo._date >> rInfo._msg;
        cout << "-------------------------------------------------------" << endl;
        cout << "姓名：" << rInfo._name << "(" << rInfo._id << ") ";
        cout <<rInfo._date << endl;
        cout << rInfo._name << ":>" << rInfo._msg << endl;
        cout << "-------------------------------------------------------" << endl;
        return 0;
    }
    ```

    需要注意，在上面的代码中，因为流插入和流提取默认分隔符为空格和换行，所以序列化和反序列化时可以不用保证流提取时和流插入时格式一致，但是需要保证流插入和流提取对应的变量顺序必须相同

使用`stringstream`流的优势：`stringstream`实际是在其底层维护了一个string类型的对象用来保存结果。`stringstream`使用`string`类对象代替字符数组，可以避免缓冲区溢出的危险，而且其会对参数类型进行推演，不需要格式化控制，也不会出现格式化失败的风险，因此使用更方便，也更安全