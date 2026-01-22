<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# C++中的类型转换

## 引入

C语言中的类型转换 ：

在C语言中，如果赋值运算符左右两侧类型不同，或者形参与实参类型不匹配，或者返回值类型与接收返回值类型不一致时，就需要发生类型转化

C语言中总共有两种形式的类型转换：

1. 隐式类型转换：编译器在编译阶段自动进行，能转就转，不能转就编译失败
2. 显式类型转换：需要用户自己处理，也称强制类型转换

缺陷：

转换的可视性比较差，所有的转换形式都是以一种相同形式书写，难以跟踪错误的转换

例如下面的代码：

```c++
void Test ()
{
     int i = 1;
     // 隐式类型转换
     double d = i;
     printf("%d, %.2f\n" , i, d);
     int* p = &i;
     // 显示的强制类型转换
     int address = (int) p;
     printf("%x, %d\n" , p, address);
}
```

## C++中的三种类型转换

C++中的类型转换可以分为三种：

1. 内置类型与内置类型相互转换
2. 内置类型与自定义类型相互转换
3. 自定义类型和自定义类型相互转换

### 内置类型与内置类型相互转换

内置类型一般情况下支持隐式类型转换，例如`double`类型转换为`int`类型等

但是如果是指针类型转换成普通的数值类型，需要进行强制类型转换，例如`int*`类型转换为`int`类型，之所以可以转换是因为指针类型本身是地址，地址值都是数，所以指针类型与数值类型存在一定的关系

### 内置类型与自定义类型相互转换

#### 内置类型转换为自定义类型

内置类型如果想转换为自定义类型需要通过自定义类型的构造函数并且对应的构造函数没有被`explicit`关键字修饰，这一过程也属于隐式类型转换，例如下面的代码：

```c++
// 内置类型与自定义类型相互转换
class A
{
public:
    A(int a)
        :_a(a)
    {}


private:
    int _a;
};

int main()
{
    // 隐式类型转换--通过构造函数实现内置类型转自定义类型
    A a = 10;

    return 0;
}
```

如果想要实现类的构造函数被声明为`explicit`时，只代表不可以隐式类型转换，不代表不可以使用强制类型转换将内置类型转换为自定义类型，例如下面的代码：

```c++
// 内置类型与自定义类型相互转换
class A
{
public:
    explicit A(int a)
        :_a(a)
    {}


private:
    int _a;
};

int main()
{
    // 修饰为explicit后，禁止隐式类型转换，但是可以显示类型转换
    A a = (A)10;

    return 0;
}
```

#### 自定义类型转换为内置类型

自定义类型如果想要转换为内置类型默认情况下是不可以的，但是可以通过重载强制类型转换实现

重载强制类型转换不可以重载`()`，尽管类型转换的操作符是`()`，因为`()`被仿函数占用了，所以需要重载强制转换后的类型，并且重载类型的函数没有返回值类型，例如下面的代码：

```c++
// 内置类型与自定义类型相互转换
class A
{
public:
    // 重载强制类型转换
    operator int()
    {
        return _a;
    }

private:
    int _a;
};

int main()
{
    int a = (int)A();

    return 0;
}
```

上面的代码也可以不需要写成显示类型转换，因为当重载了强制类型转换后，当需要转换时，会自动调用`operator int()`，所以也可以写成`int a = A();`

同样，如果将`operator int()`声明为`explicit`，就必须显式类型转换

实际上，将自定义类型转换为内置类型的行为在标准库中也存在一定的应用，例如istream和ostream中重载了`operator bool()`、shared_ptr中重载了`operator bool()`等

### 自定义类型与自定义类型相互转换

自定义类型转换为自定义类型默认情况下也是不支持的，最典型的例子就是`const_iterator`和`iterator`，首先看模拟实现中的list

??? quote "模拟实现list"
    ```c++
    #pragma once

    #include <iostream>
    #include <assert.h>
    using namespace std;

    namespace simulate_list
    {
        template<class T>
        struct ListNode
        {
            ListNode<T>* _next;
            ListNode<T>* _prev;

            T _data;

            ListNode(const T& data = T())
                :_next(nullptr)
                , _prev(nullptr)
                , _data(data)
            {}
        };

        template<class T, class Ref, class Ptr>
        struct ListIterator
        {
            typedef ListNode<T> Node;
            typedef ListIterator<T, Ref, Ptr> Self;
            Node* _node;

            ListIterator(Node* node)
                :_node(node)
            {}

            // ++it;
            Self& operator++()
            {
                _node = _node->_next;
                return *this;
            }

            Self& operator--()
            {
                _node = _node->_prev;
                return *this;
            }

            Self operator++(int)
            {
                Self tmp(*this);
                _node = _node->_next;

                return tmp;
            }

            Self& operator--(int)
            {
                Self tmp(*this);
                _node = _node->_prev;

                return tmp;
            }

            Ref operator*()
            {
                return _node->_data;
            }

            Ptr operator->()
            {
                return &_node->_data;
            }

            bool operator!=(const Self& it)
            {
                return _node != it._node;
            }

            bool operator==(const Self& it)
            {
                return _node == it._node;
            }
        };

        template<class T>
        class list
        {
            typedef ListNode<T> Node;
        public:

            typedef ListIterator<T, T&, T*> iterator;
            typedef ListIterator<T, const T&, const T*> const_iterator;

            iterator begin()
            {
                return iterator(_head->_next);
            }

            const_iterator begin() const
            {
                return const_iterator(_head->_next);
            }

            iterator end()
            {
                return iterator(_head);
            }

            const_iterator end() const
            {
                return const_iterator(_head);
            }

            void empty_init()
            {
                _head = new Node();
                _head->_next = _head;
                _head->_prev = _head;
            }

            list()
            {
                empty_init();
            }

            list(initializer_list<T> il)
            {
                empty_init();

                for (const auto& e : il)
                {
                    push_back(e);
                }
            }

            // lt2(lt1)
            list(const list<T>& lt)
            {
                empty_init();

                for (const auto& e : lt)
                {
                    push_back(e);
                }
            }

            // lt1 = lt3
            list<T>& operator=(list<T> lt)
            {
                swap(_head, lt._head);

                return *this;
            }

            ~list()
            {
                clear();
                delete _head;
                _head = nullptr;
            }

            void clear()
            {
                auto it = begin();
                while (it != end())
                {
                    it = erase(it);
                }
            }

            void push_back(const T& x)
            {
                insert(end(), x);
            }

            void pop_back()
            {
                erase(--end());
            }

            void push_front(const T& x)
            {
                insert(begin(), x);
            }

            void pop_front()
            {
                erase(begin());
            }

            // 没有iterator失效
            iterator insert(iterator pos, const T& x)
            {
                Node* cur = pos._node;
                Node* newnode = new Node(x);
                Node* prev = cur->_prev;

                // prev  newnode  cur
                prev->_next = newnode;
                newnode->_prev = prev;
                newnode->_next = cur;
                cur->_prev = newnode;

                return iterator(newnode);
            }

            // erase 后 pos失效了，pos指向节点被释放了
            iterator erase(iterator pos)
            {
                assert(pos != end());

                Node* cur = pos._node;
                Node* prev = cur->_prev;
                Node* next = cur->_next;

                prev->_next = next;
                next->_prev = prev;

                delete cur;

                return iterator(next);
            }

        private:
            Node* _head;
        };
    }
    ```

下面是测试的代码：

```c++
#include "list.h"
#include <list>

int main()
{
    simulate_list::list<int> l1{ 1,2,3,4,5 };

    // 使用自定义的list的const迭代器接收非const的begin()--不可以
    simulate_list::list<int>::const_iterator it = l1.begin();

    list<int> l2{ 1,2,3,4,5 };
    // 使用标准库的list的const迭代器接收非const的begin()--可以
    list<int>::const_iterator it2 = l2.begin();

    return 0;
}
```

在模拟实现的list中，如果将非`const`的`begin()`传递给`const`的迭代器时，编译器会报错为无法转换，此时并不是权限缩小和放大问题，因为`const_iterator`和`iterator`本身就是两个类型，如果两个不同的自定义类型需要进行转换则必须通过构造函数来实现，先看下面两个简单例子理解如何通过构造函数实现自定义类型的相互转换

```c++
class A
{
public:
    A(int a)
        : _a(a)
    {}
private:
    int _a;
};

class B
{
public:
    B(int b)
        :_b(b)
    {}
private:
    int _b;
};

int main()
{
    // 默认情况下，A类型与B类型属于不同类型，无法相互转换
    A a(1);
    B b = a;// 默认情况下错误
    return 0;
}
```

但是如果在`B`中实现用`A`对象中的值来构造则可以实现`A`类型转换为`B`类型

```c++
class A
{
public:
    A(int a)
        : _a(a)
    {}

    // 通过get函数获取私有成员_a的值
    int getA()
    {
        return _a;
    }
private:
    int _a;
};

class B
{
public:
    B(int b)
        :_b(b)
    {}

    // 通过构造函数实现A类型转换为B类型
    B(A& a)
        :_b(a.getA())
    {}
private:
    int _b;
};

int main()
{
    A a(1);
    B b = a; // 通过非explicit构造函数隐式从A类型转换为B类型

    return 0;
}
```

再回到开始的问题，如果希望使`const`迭代器能够接受返回非`const`迭代器的`begin()`就需要在`const`迭代器中增加使用非`const`迭代器构造出`const`迭代器的构造函数，当然可以直接写一个构造函数针对这个问题，例如下面的代码：

```c++
const_iterator(const iterator& it)
    :_node(it._node)
{}
```

但是上面的写法仅限于只使用`const_iterator`类，实际上在使用时既需要考虑`iterator`还需要考虑`const_iterator`，所以需要考虑第二种方法，这种方法也是标准库处理二者直接转换的方法，首先先看标准库的处理方式：

<img src="29. C++中的类型转换.assets\image.png">

首先因为`__list_iterator`是主类，而`iterator`和`const_iterator`只是不同的实例版本

当实例化为`iterator`时，则实现的就是普通的迭代器拷贝构造函数，即函数声明部分为`__list_iterator<T, T&, T*>(const iterator& x)`，其中`__list_iterator<T, T&, T*>`即为实例化后的`iterator`

当实例化为`const_iterator`时，则实现的就是使用普通的迭代器构造一个`const`迭代器，即函数声明部分为`__list_iterator<T, const T&, const T*>(const iterator& x)`，其中`__list_iterator<T, const T&, const T*>`即为实例化后的`const_iterator`

所以，根据上面的思路，可以对原来模拟实现的list中迭代器的部分进行修改，如下：

```c++
namespace simulate_list
{
    // ...

    template<class T, class Ref, class Ptr>
    struct ListIterator
    {
        typedef ListNode<T> Node;
        typedef ListIterator<T, T&, T*> iterator;
        typedef ListIterator<T, const T&, const T*> const_iterator;
        typedef ListIterator<T, Ref, Ptr> Self;
        Node* _node;

        // ...

        // 支持iterator向const_iterator的隐式类型转换
        ListIterator(const iterator& it)
            :_node(it._node)
        {}

        // ...
    };
}
```

## 四种强制类型转换模版

标准C++为了加强类型转换的可视性，引入了四种命名的强制类型转换操作符：`static_cast`、`reinterpret_cast`、`const_cast`和`dynamic_cast`

### `static_cast`

`static_cast`是一种相对安全的强制类型转换，常见转换类型为：

- 基本数据类型之间的转换（如`int`到`double`）
- 指针类型的上行转换（派生类指针转基类指针）
- `void*`指针转换为具体类型指针
- 枚举类型转换

例如下面的代码：

```c++
int main()
{
    double d = 1.1;
    int a = static_cast<int>(d);
    cout << a << endl;

    return 0;
}
```

### `reinterpret_cast`

`reinterpret_cast`是不相关类型之间的位级别重新解释，常见的用法是：

- 指针类型之间的任意转换
- 指针与整数之间的转换
- 函数指针转换

例如下面的代码：

```c++
int main()
{
    int a = 1;

    int* p = &a;

    int a1 = reinterpret_cast<int>(p);
    cout << a1 << endl;

    return 0;
}
```

### `const_cast`

`const_cast`支持将一个`const`的变量的`const`属性取消并赋值给非`const`变量，但是这个行为是不安全的，并且非`const`变量如果是指针，并且对`const`变量进行修改，默认情况下是不会影响到`const`变量中的值，因为`const`变量的值一般情况下本身被存到了寄存器中，当需要使用时将从寄存器加载，不会从内存中加载，而指针尝试对`const`变量修改的行为发生在内存，所以就算修改了也不会影响在寄存器中的值，如果想让`const`变量在使用时从内存中加载，可以使用`volatile`关键字，其作用是告诉编译器不要对该变量进行优化，并且每次访问时都要从内存中读取最新的值，例如下面的代码：

```c++
int main()
{
    // 不使用volatile时从寄存器取，不会影响a的值
    const int a = 2;
    int* p = const_cast<int*>(&a);
    *p = 3;
    cout << *p << endl;
    cout << a << endl;

    // 使用volatile时从内存取，会影响a1的值
    volatile const int a1 = 2;
    int* p1 = const_cast<int*>(&a1);
    *p1 = 3;
    cout << *p << endl;
    cout << a1 << endl;

    return 0;
}

输出结果：
3
2
3
3
```

### `dynamic_cast`和`dynamic_pointer_cast`

`dynamic_cast`用于将一个父类对象的指针/引用转换为子类对象的指针或引用（动态转换）

向上转型：（子类对象指针/引用被父类指针/引用接收）子类对象指针/引用->父类指针/引用（不需要转换，赋值兼容规则）

向下转型：（父类对象指针/引用被子类指针/引用接收）父类对象指针/引用->子类指针/引用（用`dynamic_cast`转型是安全的）

注意：

1. `dynamic_cast`只能用于父类含有虚函数的类（必须满足多态）
2. `dynamic_cast`会先检查是否能转换成功，能成功则转换，不能则返回`NULL`

!!! note
    如果直接将父类对象强制转换给子类指针/引用可能会引发非法访问而出现的随机值

```c++
class A
{
public:
    virtual void f() {}

    int _a = 1;
};

class B : public A
{
public:
    int _b = 2;
};

void fun(A* pa)
{
    B* pb1 = dynamic_cast<B*>(pa);
    if (pb1)
    {
        cout << "pb1:" << pb1 << endl;
        cout << pb1->_a << endl;
        cout << pb1->_b << endl;
        pb1->_a++;
        pb1->_b++;
        cout << pb1->_a << endl;
        cout << pb1->_b << endl;
    }
    else
    {
        cout << "转换失败" << endl;
    }
}

int main()
{
    A a;
    B b;
    fun(&a); // 父类对象的父类指针转型给子类指针
    fun(&b); // 子类对象的父类指针转型给子类指针

    return 0;
}

输出结果：
转换失败
pb1:000000E0D293F9A8
1
2
2
3
```

总结：只有当父类指针指向子类对象时，使用`dynamic_cast`将父类指针转型给子类指针时是成功的，从而保证转型的安全性

需要注意的是，`dynamic_cast`不能用于将父类对象的智能指针转换为子类对象的智能指针，而如果需要转化，则要使用`dynamic_pointer_cast`：

```c++
#include <iostream>
#include <memory>

class A 
{
public:
    virtual void f() {}
    int _a = 1;
    virtual ~A() = default; // 确保正确的多态行为，虚析构函数很重要
};

class B : public A 
{
public:
    int _b = 2;
};

// 使用智能指针版本的函数
void fun(std::shared_ptr<A> pa) 
{
    // 使用dynamic_pointer_cast将父类智能指针转换为子类智能指针
    std::shared_ptr<B> pb = std::dynamic_pointer_cast<B>(pa);
    
    if (pb) 
    {
        std::cout << "转换成功" << std::endl;
        std::cout << "pb指向的地址: " << pb.get() << std::endl;
        std::cout << "_a = " << pb->_a << std::endl;
        std::cout << "_b = " << pb->_b << std::endl;
        
        // 修改值
        pb->_a++;
        pb->_b++;
        
        std::cout << "修改后 _a = " << pb->_a << std::endl;
        std::cout << "修改后 _b = " << pb->_b << std::endl;
    } 
    else 
        std::cout << "转换失败" << std::endl;
}

int main() 
{
    // 创建父类对象的智能指针
    std::shared_ptr<A> pa1 = std::make_shared<A>();
    
    // 创建子类对象的智能指针
    std::shared_ptr<A> pa2 = std::make_shared<B>();
    
    std::cout << "测试父类对象的智能指针转换:" << std::endl;
    fun(pa1); // 父类对象的智能指针转换为子类智能指针（应该失败）
    
    std::cout << "\n测试子类对象的智能指针转换:" << std::endl;
    fun(pa2); // 子类对象的智能指针转换为子类智能指针（应该成功）
    
    return 0;
}
```