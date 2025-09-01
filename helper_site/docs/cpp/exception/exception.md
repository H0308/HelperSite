<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# C++异常

## 基础使用

在C语言中，处理错误一共有两种方式：

1.  终止程序，如`assert`，缺陷：用户难以接受。例如发生内存错误，除0错误时就会终止程序
2. 返回错误码，缺陷：需要程序员自己去查找对应的错误。例如系统的很多库的接口函数都是通过把错误码放到`errno`中，表示错误，如果想查看错误信息而不是错误码，就需要使用`perror`函数，大部分错误的处理方式

但是如果使用类似于终止程序的方式处理，对程序的运行影响是比较大的，所以为了能够处理错误并且不影响程序其他部分的正常运行，C++引入了异常处理

C++的异常处理是当一个函数发现自己无法处理的错误时就可以抛出异常，接着由最近的捕捉异常语句进行捕捉处理

在C++异常中需要使用到三个关键字：

1. `throw`：抛出当前函数出现的异常
2. `try`：包裹可能出现异常的部分，该部分代码一般被称为保护代码
3. `catch`：根据异常的类型进行捕捉

基本结构如下：

```c++
void func()
{
    // ...
    throw exception;// 抛出exception异常
}

try
{
    func();// 包裹可能出现异常的部分
}
catch(exception) // 根据异常类型捕获异常
{
    // 处理异常语句
}
// ... 可以有多个catch进行捕捉
```

使用异常需要注意以下内容：

1. 一个`try`语句可以有多个`catch`跟随
2. 一个`catch`只能捕捉一种类型的异常，并且异常类型的匹配是基本完全匹配（除了父类捕捉子类异常）
3. 当`try`中的部分出现异常，执行完`catch`语句后会继续执行`try`...`catch`语句之后的内容
4. `throw`可以抛出一条语句或者一个对象，当函数执行了`throw`语句后，就会结束当前函数

基本使用如下：

```c++
double divide(int a, int b)
{
    if (b == 0)
    {
        throw "Division by zero condition!";
    }
    return (double)a / b;
}

int main()
{
    int num1 = 0;
    int num2 = 0;
    cin >> num1 >> num2;

    try
    {
        cout << divide(num1, num2) << endl;
    }
    catch (const char* errmsg)
    {
        cout << errmsg << endl;
    }
    return 0;
}
```

## 异常的匹配机制

C++中匹配异常会以优先匹配离`throw`最近一层的`catch`语句（遵循逐层向上抛出捕获的原则），例如下面代码中：

```c++
double divide(int a, int b)
{
    if (b == 0)
    {
        throw "Division by zero condition!";
    }
    return (double)a / b;
}

void func()
{
    int num1 = 0;
    int num2 = 0;
    cin >> num1 >> num2;
    try
    {
        cout << divide(num1, num2) << endl;
    }
    catch (const char* errmsg)
    {
        cout << "1 " << errmsg << endl;
    }
}

int main()
{
    try
    {
        func();
    }
    catch (const char* errmsg)
    {
        cout << "2 " << errmsg << endl;
    }
    return 0;
}

输出结果：
1 Division by zero condition!
```

在`main`函数和`func`函数中均有对`divide`函数的异常捕捉，并且`catch`的参数类型均完全匹配`divide`函数中`throw`的类型，在这个过程中，当`b`为0时，`divide`函数会抛出异常，此时`divide`函数执行结束，回到`func`函数的栈帧空间，因为`func`函数中存在参数类型与异常类型匹配的`catch`语句，此时`divide`抛出的异常会被`func`函数中的`catch`捕捉，执行`func`函数`catch`中的语句，因为`func`后面没有内容，所以当`func`函数执行完成后回到`main`函数的栈帧空间，因为`divide`函数的异常已经被捕获，所以`main`函数不会再执行一次`catch`，尽管存在参数类型与异常类型匹配的`catch`，过程如图以下：

<img src="26. C++异常.assets\image.png">

!!! note
    如果异常即将抛出的是一个对象，那么`catch`接收到的对象是抛出的对象的拷贝，这个对象会在`catch`语句捕捉到后销毁

如果抛出的异常没有被任何`catch`语句捕捉到，此时程序会报错，提示存在未捕捉的异常，为了防止出现这种现象发生，可以在`main`函数中的`try`...`catch`语句的最后一句`catch`后加入`catch(...)`用于捕获到无法被确定类型的`catch`语句块捕获到的异常，这个`catch(...)`语句可以捕获任意类型的异常

```c++
double divide(int a, int b)
{
    if (b == 0)
    {
        throw "Division by zero condition!";
    }
    return (double)a / b;
}

int main()
{
    int num1 = 0;
    int num2 = 0;
    cin >> num1 >> num2;

    try
    {
        divide(num1, num2);
    }
    catch (const string& errmsg)
    {
        cout << "2 " << errmsg << endl;
    }
    catch (...) // catch all exceptions
    {
        cout << "3 Unknown exception" << endl;
    }
    return 0;
}

输出结果：
3 Unknown exception
```

因为`divide`函数抛出的异常是`const char*`类型的常量字符串，在`main`函数中只有一个string类型的`catch`语句（不会隐式类型转换），所以并不会匹配对应的`catch`语句块，接下里匹配`catch(...)`，因为该`catch`语句块可以接收任何类型的异常，所以会被`catch(...)`捕捉

!!! note
    需要注意，`catch(...)`语句一定要写在`try`...`catch`语句的最后，一般在`main`函数写`catch(...)`，如果`catch(...)`语句写在最前面，则不论后面的`catch`语句是否会捕捉，编译器都会报错，因为此时不论什么异常都会优先被`catch(...)`捕捉，此时后面的异常不论是否类型匹配都会失效

## 异常的多次抛出

有时执行的函数抛出的异常在某个函数内没有被处理，此时需要再一次向外抛出，这个过程被称为异常的多次抛出，例如下面的代码：

```c++
double divide(int a, int b)
{
    if (b == 0)
    {
        string s = "Division by zero condition!";
        throw s;
    }
    return (double)a / b;
}

void func()
{
    int num1 = 0;
    int num2 = 0;
    cin >> num1 >> num2;
    try
    {
        cout << divide(num1, num2) << endl;
    }
    catch (const char* errmsg)
    {
        cout << "1 " << errmsg << endl;
    }
    
    throw; // 再一次抛出未处理的异常
}

int main()
{
    try
    {
        func();
    }
    catch (const string& e)
    {
        cout << "catch string" << endl;
    }
    return 0;
}
```

上面的代码中，当`divide`抛出异常时，`func`函数中没有匹配的`catch`语句块，此时`divide`函数抛出的异常还没有被捕获，所以可以单独写`throw`语句代表再次将`divide`函数的异常抛出，回到`main`函数时被`catch`语句块捕捉

## 异常与内存泄漏问题

因为有异常的存在，导致函数的语句执行具有跳转的效果，当出现有资源释放的问题，需要在异常抛出之前或者函数栈帧销毁之前释放，例如下面的代码：

```c++
double divide(int a, int b)
{
    if (b == 0)
    {
        string s = "Division by zero condition!";
        throw s;
    }
    return (double)a / b;
}

void func()
{
    int num1 = 0;
    int num2 = 0;
    cin >> num1 >> num2;

    // 在堆上开辟空间
    int* arr = new int[10];

    try
    {
        cout << divide(num1, num2) << endl;
    }
    catch (...)
    {
        delete[] arr; // 先释放资源
        throw; // 再一次抛出未处理的异常
    }

    // 如果异常已经处理，则释放资源

    delete[] arr;
}

int main()
{
    try
    {
        func();
    }
    catch (const string& errmsg)
    {
        cout << errmsg << endl;
    }

    return 0;
}
```

如果将上面的代码修改为下面的代码：

```c++
double divide(int a, int b)
{
    // ...
}

void func()
{
    // ...

    // 在堆上开辟两个空间
    int* arr = new int[10];
    int* arr1 = new int[10];

    try
    {
        cout << divide(num1, num2) << endl;
    }
    catch (...)
    {
        // 释放空间
        delete[] arr;
        delete[] arr1;
        throw; // 再一次抛出未处理的异常
    }

    // 如果异常已经处理，则释放资源
    
    delete[] arr;
    delete[] arr1;
}

int main()
{
    try
    {
        func();
    }
    catch (const string& errmsg)
    {
        cout << errmsg << endl;
    }

    return 0;
}
```

上面的代码看似与第一次的代码不同的位置只是多开了一块空间，但是实际上在第二次开辟空间时可能会出现开辟失败的问题，即`int* arr1 = new int[10];`可能会执行失败，标准库中`new`关键字会抛出`bad_alloc`异常，所以此位置需要进行`try`...`catch`，但是此时会出现第二个问题，第一次开辟的`arr`空间并未释放，所以修改后的代码如下：

```c++
try
{
    int* arr1 = new int[10];
}
catch(...)
{
    delete[] arr;
}
```

但是如果开了多个空间，就需要更多的`try`...`catch`语句，使得代码变得更加冗长，为了解决这个问题，C++ 11引入了智能指针，具体内容在指针指针部分讲解

上面的问题也称为异常安全问题，资源泄漏是其中的一种，另外还有两种常见的异常安全问题：

1. 构造函数完成对象的构造和初始化，最好不要在构造函数中抛出异常，否则可能导致对象不完整或没有完全初始化
2. 析构函数主要完成资源的清理，最好不要在析构函数内抛出异常，否则可能导致资源泄漏(内存泄漏、句柄未关闭等)

## 自定义异常体系

在C++ 标准库中，有一套基本的异常体系（在`<exception>`中），但是这套体系并不完善，所以大部分情况需要自定义一个异常体系，该自定义异常体系一般由父类异常和子类异常组成，父类定义一个基本的异常，由子类继承父类异常，结合多态完善自定义的异常体系，例如下面的例子：

??? info "服务器开发中通常使用的自定义异常体系实例"
    ```c++
    // 定义父类异常
    class Exception
    {
    public:
        Exception(const string& errmsg, int id)
            :_errmsg(errmsg)
            , _id(id)
        {}
        virtual string what() const
        {
            return _errmsg;
        }
    protected:
        string _errmsg;
        int _id;
    };

    // 子类SQL异常，继承自父类异常
    class SqlException : public Exception
    {
    public:
        SqlException(const string& errmsg, int id, const string& sql)
            :Exception(errmsg, id)
            , _sql(sql)
        {}
        virtual string what() const
        {
            string str = "SqlException:";
            str += _errmsg;
            str += "->";
            str += _sql;
            return str;
        }
    private:
        const string _sql;
    };

    // 子类Cache异常，继承自父类异常
    class CacheException : public Exception
    {
    public:
        CacheException(const string& errmsg, int id)
            :Exception(errmsg, id)
        {}
        virtual string what() const
        {
            string str = "CacheException:";
            str += _errmsg;
            return str;
        }
    };

    // 子类HttpServer异常，继承自父类异常
    class HttpServerException : public Exception
    {
    public:
        HttpServerException(const string& errmsg, int id, const string& type)
            :Exception(errmsg, id)
            , _type(type)
        {}
        virtual string what() const
        {
            string str = "HttpServerException:";
            str += _type;
            str += ":";
            str += _errmsg;

            return str;
        }
    private:
        const string _type;
    };

    // 模拟服务器开发中的异常处理
    void SQLMgr()
    {
        if (rand() % 7 == 0)
        {
            throw SqlException("权限不足", 100, "select * from name = '张三'");
        }
    }

    void CacheMgr()
    {
        // 随机数模拟异常
        if (rand() % 5 == 0)
        {
            throw CacheException("权限不足", 100);
        }
        else if (rand() % 6 == 0)
        {
            throw CacheException("数据不存在", 101);
        }
        SQLMgr();
    }

    void HttpServer()
    {
        if (rand() % 3 == 0)
        {
            throw HttpServerException("请求资源不存在", 100, "get");
        }
        else if (rand() % 4 == 0)
        {
            throw HttpServerException("权限不足", 101, "post");
        }
        CacheMgr();
    }

    int main()
    {
        srand(time(0));
        while (1)
        {
            try 
            {
                // 调用服务器
                HttpServer();
            }
            catch (const Exception& e) // 这里捕获父类对象就可以
            {
                // 多态
                cout << e.what() << endl;
            }
            catch (...)
            {
                cout << "Unkown Exception" << endl;
            }
        }
        return 0;
    }
    ```

## 异常书写规范

在C++ 98中，为了保证异常的抛出和捕捉规范，标准库定义当函数需要抛出异常时，可以指定抛出的异常类型（例如`throw(A, B, C, D)`，其中A，B，C，D为异常类型），如果想表示函数不抛出异常，可以写`throw()`，例如下面的代码：

```c++
// 这里表示这个函数会抛出A/B/C/D中的某种类型的异常
void fun() throw(A，B，C，D);
// 这里表示这个函数只会抛出bad_alloc的异常
void* operator new (std::size_t size) throw (std::bad_alloc);
// 这里表示这个函数不会抛出异常
void* operator delete (std::size_t size, void* ptr) throw();
```

但是因为这个方式有的人遵循，有的人不遵循，导致标准并没有实施得很完善，并且这样写的复杂程度也变高，为了尽可能解决这个问题，C++ 11中可以使用`noexcept`表示函数没有异常抛出，如果函数有异常则不用写任何内容

```c++
// C++11 中新增的noexcept，表示不会抛异常
thread() noexcept;
thread (thread&& x) noexcept;
```

## 异常的优缺点

C++异常的优点： 

1. 异常对象定义好了，相比错误码的方式可以清晰准确的展示出错误的各种信息，甚至可以包含堆栈调用的信息，这样可以帮助更好的定位程序的bug。
2. 返回错误码的传统方式有个很大的问题就是，在函数调用链中，深层的函数返回了错误，则需要层层返回错误，最外层才能拿到错误
3. 很多的第三方库都包含异常，比如boost、gtest、gmock等等常用的库，那么我们使用它们也需要使用异常
4. 部分函数使用异常更好处理，比如构造函数没有返回值，不方便使用错误码方式处理。比如`T& operator[]`这样的函数，如果`pos`越界了只能使用异常或者终止程序处理，没办法通过返回值表示错误

C++异常的缺点： 

1. 异常会导致程序的执行流混乱，并且运行时出错抛异常就会乱跳，从而导致跟踪调试时以及分析程序时比较困难
2. 异常会有一些性能的开销，但是目前基本上可以忽略不计
3. C++没有垃圾回收机制，资源需要自己管理。有了异常非常容易导致内存泄漏、死锁等异常安全问题。这个需要使用RAII（见智能指针部分）来处理资源的管理问题。
4. C++标准库的异常体系定义得不好，导致大家各自定义各自的异常体系，非常的混乱。
5. 异常尽量规范使用，否则后果不堪设想，随意抛异常，外层捕获的用户苦不堪言。所以常见的异常规范有两点：1. 抛出异常类型都继承自一个父类 2. 函数是否抛异常以及抛什么异常，都使用` func() throw();`的方式规范化

总结：异常总体而言，只要控制得好，异常的利大于弊，所以工程中还是鼓励使用异常的。另外面向对象的语言基本都是用异常处理错误，这也可以看出这是大势所趋