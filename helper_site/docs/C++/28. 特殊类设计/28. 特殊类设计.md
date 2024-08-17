# 特殊类设计

## 创建一个不能被拷贝的类

在C++ 98中，创建一个不能被拷贝的类需要对拷贝构造函数和赋值重载函数只声明不定义，并且修饰为`private`，例如下面的代码：

```c++
// 不能被拷贝的类 C++ 98
class A
{
public:
    A()
    {};
private:
    A(const A& a);
    A& operator=(const A& a);
};
```

在C++ 11中，只需要将拷贝构造函数和赋值重载函数修饰为`=delete`即可，例如下面的代码：

```c++
// 不能被拷贝的类 C++ 11
class A
{
public:
    A()
    {};

    A(const A& a) = delete;
    A& operator=(const A& a) = delete;
};
```

## 创建一个只在堆上创建对象的类

创建的对象所在位置一共有三种：

1. 静态区
2. 栈
3. 堆

思路1：

创建对象的基本方式是使用构造函数，上面的三种位置都可以使用构造函数创建一个对象，所以首先将构造函数修饰为`private`使对应类无法创建对象，接下来为保证只在堆上创建对象，可以考虑使用一个静态成员函数（不是静态成员函数需要调用构造函数创建对象才能调用成员函数，但是由于构造函数已经修饰为`private`）`CreateObj()`，因为是在堆上创建的对象，所以只需要返回一个堆上开辟内存的对象即可

!!! note
    此处需要考虑到可能存在使用拷贝构造或者赋值重载函数构造一个新对象，所以可以将这两个函数修饰为`=delete`

```c++
// 只在堆上开辟内存的对象
class A
{
public:
    static A* createObj()
    {
        return new A;
    }

    A(const A& a) = delete;
    A& operator=(const A& a) = delete;
private:
    A()
    {}
};
```

思路2：

给出类构造函数，但是将析构函数修饰为`private`，此时创建的对象不能被销毁，从而达到无法在栈区和静态区创建对象，但是可以在堆上创建对象，只不过这个对象需要手动使用`delete`进行释放，可以提供一个`destroy`函数（可以不修饰为`static`，因为此时有对象的指针，如果是成员函数，则会有`this`指针，当对象指针调用`destroy`函数时，`this`指针所指的对象即为对象指针的对象），用于对对象进行销毁

!!! note
    这个方法可以保证只要是创建的对象需要调用析构函数，则都会创建失败，包括调用拷贝构造函数和赋值重载函数创建的对象

```c++
class A
{
public:
    A()
    {}

    void destroy()
    {
        delete this;
    }

private:
    ~A()
    {

    }
};
```

## 创建一个只在栈上创建对象的类

创建一个只在栈上创建对象的类会比只在堆上相对复杂，默认情况下使用构造函数可以在三个位置创建对象，所以首先考虑第一种方式：将构造函数修饰为`private`，因为只在栈上创建对象，所以还是考虑调用构造函数，但是是在类内部调用构造函数，不论是是不是`private`，类内的成员都可以访问构造函数，所以在类内使用构造函数创建一个栈区对象，同样，创建对象使用一个静态的成员函数，该函数返回对象的值（不可以返回引用）

!!! note
    此时因为还可以使用拷贝构造函数和赋值重载函数创建对象，所以对拷贝构造函数和赋值重载函数修饰为`=delete`，但是此时会遇到一个问题，因为静态成员函数创建一个对象后需要传值返回，此时会产生对象的拷贝行为，所以如果将拷贝构造函数修饰为`=delete`会导致调用静态成员函数创建对象失效，可以考虑给出移动构造函数，因为没有拷贝构造函数时，也可以走移动构造函数，并且静态成员函数返回的也是将亡值，所以会调用移动构造函数

!!! note
    上面限制拷贝构造寒素和赋值重载函数创建对象，但是可以使用移动构造函数创建对象的方式可以在`unique_ptr`中见到，`unique_ptr`类限制了拷贝和赋值，但是并没有限制移动构造函数，如下图所示：
    
    <img src="28. 特殊类设计.assets\image.png">

    <img src="28. 特殊类设计.assets\image1.png">

```c++
class A
{
public:
    static A createObj()
    {
        return A();
    }

    A(A&& a)
    {

    }

    A(const A& a) = delete;
    A& operator=(const A& a) = delete;

private:
    A()
    {}
};
```

对上面的代码进行加强：

因为只在栈上创建对象，所以可以考虑将构造函数修饰为`private`，并且限制使用`new`关键字和`delete`关键字，在C++ 标准中规定，如果一个类中有重载`new`和`delete`时，会执行已经重载的部分，否则执行默认的`new`和`delete`，此时就可以满足不在堆上创建变量，将拷贝构造函数和赋值重载函数修饰为`=delete`，给出移动构造函数

```c++
class A
{
public:
    static A createObj()
    {
        return A();
    }

    A(A&& a)
    {

    }

    A(const A& a) = delete;
    A& operator=(const A& a) = delete;
    void* operator new(size_t size) = delete;
    void operator delete(void* p) = delete;

private:
    A()
    {

    }
};
```

但是，不论是加强后的代码还是原先的代码，都无法保证不在静态区创建变量，因为栈区的变量需要值返回，此时不可以在外部使用指针接收（原先的位置因为函数栈帧销毁可能出现随机值），所以不可以限制析构函数，外部也需要创建一个A类对象用于接收值返回的对象，例如创建对象的代码：

```c++
A a = A::createObj();
static A a1 = A::createObj();
```

## 创建一个无法被继承的父类

在C++ 98中，创建一个无法被继承的父类需要将父类的构造函数设置为私有，子类因为包含父类的成员从而需要调用父类的构造函数，但是此时父类构造函数私有导致子类无法成功通过构造函数创建对象，间接达到父类无法被继承的效果

```c++
class Base
{
public:
    static void getInstance()
    {

    }

private:
    Base()
    {

    }
};
```

在C++ 11中，可以使用`final`关键字修饰父类，此时父类将无法被继承

```c++
class Base final
{
public:
    static void getInstance()
    {

    }

    Base()
    {

    }
private:
};
```

## 创建一个类，该类只能实例化出一个对象（单例设计模式）

### 设计模式与单例模式介绍

设计模式：

设计模式（Design Pattern）是一套被反复使用、多数人知晓的、经过分类的、代码设计经验的总结。为什么会产生设计模式这样的东西呢？就像人类历史发展会产生兵法。最开始部落之间打仗时都是人拼人的对砍。后来春秋战国时期，七国之间经常打仗，就发现打仗也是有套路的，后来孙子就总结出了《孙子兵法》。《孙子兵法》也是类似。

使用设计模式的目的：

为了代码可重用性、让代码更容易被他人理解、保证代码可靠性。 设计模式使代码编写真正工程化；设计模式是软件工程的基石脉络，如同大厦的结构一样。

单例模式：

一个类只能创建一个对象，即单例模式，该模式可以保证系统中该类只有一个实例，并提供一个访问它的全局访问点，该实例被所有程序模块共享。比如在某个服务器程序中，该服务器的配置信息存放在一个文件中，这些配置数据由一个单例对象统一读取，然后服务进程中的其他对象再通过这个单例对象获取这些配置信息，这种方式简化了在复杂环境下的配置管理。

单例模式有两种设计方式：

1. 饿汉模式：在程序运行的开始就自动创建一个对象，缺点：不支持多个单例模式的类的自定义先后顺序并且如果单例对象比较大可能会导致程序响应速度慢
2. 懒汉模式：在程序运行时根据调用位置创建一个对象，此后不再创建对象

### 饿汉模式

因为一个类只能创建一个对象，所以考虑在静态区创建一个对象，这样可以保证不论多少次调用构造函数都只进行一次初始化，并且为了防止该对象被拷贝和赋值，所以需要禁用拷贝构造和赋值重载函数

```c++
// 饿汉模式
class Singleton
{
public:
    Singleton()
    {}

    static Singleton& getInstance()
    {
        return _s;
    }

    Singleton(const Singleton& s) = delete;
    Singleton& operator=(const Singleton& s) = delete;
private:
    static Singleton _s;
};

// 实例化静态对象
Singleton Singleton::_s;
```

### 懒汉模式

因为懒汉是在调用时才创建，所以可以决定调用顺序，但是为了满足单例模式，需要通过指针的控制实现只创建一个变量，指针为空说明还没有对象，指针不为空说明至少已经存在了一个对象，此时就不再创建对象

```c++
// 懒汉模式
class Singleton
{
public:
    Singleton()
    {}
    static Singleton& getInstance()
    {
        if (_p == nullptr)
        {
            _p = new Singleton;
        }
        return *_p;
    }

    Singleton(const Singleton& s) = delete;
    Singleton& operator=(const Singleton& s) = delete;
private:
    static Singleton* _p;
};

// 确保指针只能被初始化一次
Singleton* Singleton::_p = nullptr;
```