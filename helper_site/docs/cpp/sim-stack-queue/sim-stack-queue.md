<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# stack和queue模拟实现

## stack和queue模拟实现

对于stack和queue的模拟实现和前面的vector和list有所不同，stack和queue的实现借助了一个缺省容器deque(双端队列)，这里用到了容器适配器的思路

### 容器适配器

适配器是一种设计模式(设计模式是一套被反复使用的、多数人知晓的、经过分类编目的、代码设计经验的总结)，该种模式是将一个类的接口转换成客户希望的另外一个接口

### 双端队列类deque（了解即可）

deque名为双端队列，但实际上并不是队列，因为他的主要用途是在对头和队尾插入数据

对于双端队列来说，为了能够满足下标随机访问，所以需要开辟连续的空间，而如果单单只是开辟连续的空间则和vector没有什么区别，插入数据时依旧需要考虑是否要扩容，所以为了解决这个问题，双端队列中还有另一个做法，开辟多个连续的空间，类似于list的设计，每一个连续的空间各自由一个指针进行维护，最后为了不影响下标的连续访问，还有一个中控数组，负责存储指向每一个连续空间的指针，双端队列的设计方式类似下图所示：

假设默认每一个数据数组已经存满整型数据

<img src="images\image.png">

现在需要在头部插入一个20，插入过程如下：

<img src="images\image1.png">

如果是在尾部插入一个30，插入过程如下：

<img src="images\image2.png">

这两次的数据插入了解到deque的数据头部和尾部插入方式，但是如果现在要中间插入数据，双端队列此时就难以应对了，因为有两种解决方案，如果每一个数组都是满数据状态彼此也有优劣：

1. 第一种方案：对指定数组进行扩容，然后挪动数据再插入数据，类似于vector的`insert()`，但是这种方案会使下标访问操作符重载函数的实现变得困难，因为此时如果插入数据足够多，那么每一个数据数组就会出现元素各不相同的情况，此时很难确定什么时候到下一个数据数组
2. 第二种方案：插入一个数据就开辟一个新数组，将后面的数据依次挪动数据到新数组直到指定位置有空间插入数据，但是这一中方法会使挪动数据的开销变大，如果当数据量特别大时，挪动数据的开销导致的劣势远远大于本身的优势

对于上面两种方案，各有优劣，所以deque一般不用于中间插入和删除数据，对于经常插入数据的vector和list来说就会相对有一定的优势

那么，说完了deque的数据头部插入和尾部插入，如何使用迭代器遍历

对于deque来说，他的迭代器（本处只讨论非`const`迭代器，`const`迭代器类推）设计结构如下：

<img src="images\image3.png">

对于用于遍历的迭代器来说，遍历思路为：

`cur`指针开始时则指向`begin()`的`cur`位置，`node`则指向第一个指向数据数组的指针，一直走到当前数据数组的`last`位置，然后更新遍历迭代器中的`node`为第一个指向数据数组的指针，从`first`位置开始，直到`last`位置，以此类推直到node指向最后一个数据数组的指针，cur走向最后一个数据数组的最后一个元素位置的下一个位置（注意图中的`pos`只是用于标记最后一个元素位置的下一个位置）

从上面简单的了解，可以简单得出deque的缺点：

与vector比较，deque的优势是：头部插入和删除时，不需要搬移元素，效率特别高，而且在扩容时，也不需要搬移大量的元素，因此其效率是必vector高的。

与list比较，其底层是连续空间，空间利用率比较高，不需要存储额外字段。

但是，deque有一个致命缺陷：不适合遍历，因为在遍历时，deque的迭代器要频繁的去检测其是否移动到某段小空间的边界，导致效率低下，而序列式场景中，可能需要经常遍历，因此在实际中，需要线性结构时，大多数情况下优先考虑vector和list，deque的应用并不多，而目前能看到的一个应用就是，STL用其作为stack和queue的底层数据结构。

既然如此，依旧使用deque而不使用其他容器作为适配器的原因是：

stack是一种后进先出的特殊线性数据结构，因此只要具有`push_back()`和`pop_back()`操作的线性结构，都可以作为stack的底层容器，比如vector和list都可以；queue是先进先出的特殊线性数据结构，只要具有`push_back`和`pop_front`操作的线性结构，都可以作为queue的底层容器，比如list。但是STL中对stack和queue默认选择deque作为其底层容器，主要是因为：

1. stack和queue不需要遍历(因此stack和queue没有迭代器)，只需要在固定的一端或者两端进行操作。
2. 在stack中元素增长时，deque比vector的效率高(扩容时不需要搬移大量数据)；queue中的元素增长时，deque不仅效率高，而且内存使用率高。结合了deque的优点，而完美的避开了其缺陷。

### stack模拟实现

```C++
#pragma once

#include <iostream>
#include <deque>

namespace sim_stack
{
    //提供容器缺省参数值为双端队列
    template<class T, class Container = deque<T>>
    class stack
    {
    public:
        //使用对应容器的构造函数
        stack()
            :_con()
        {}

        //push()函数
        void push(const T& val)
        {
            //调用类模版容器的push_back()
            _con.push_back(val);
        }

        //pop()函数
        void pop()
        {
            //调用类模版容器的pop_back()
            _con.pop_back();
        }

        //top()函数_非const版本
        T& top()
        {
            //调用类模版容器的back()
            return _con.back();
        }
        //const版本
        const T& top() const
        {
            //调用类模版容器的back()
            return _con.back();
        }

        //empty()函数
        bool empty()
        {
            //调用类模版容器的empty()
            return _con.empty();
        }

        //size()函数
        const size_t& size()
        {
            //调用类模版容器的size()
            return _con.size();
        }
    private:
        //直接使用容器
        Container _con;
    };
}
```

### queue模拟实现

```C++
#pragma once

#include <iostream>
#include <deque>

namespace sim_queue
{
    template<class T, class Container = deque<T>>
    class queue
    {
    public:
        //使用类模版容器的构造函数
        queue()
            :_con()
        {}

        //push()函数
        void push(const T& val)
        {
            //使用类模版容器的push_back()函数
            _con.push_back(val);
        }

        //pop()函数
        void pop()
        {
            //使用类模版容器的pop_front()函数
            _con.pop_front();
        }

        //front()函数_非const版本
        T& front()
        {
            //使用类模版容器的front()函数
            return _con.front();
        }
        //const版本
        const T& front() const
        {
            //使用类模版容器的front()函数
            return _con.front();
        }

        //back()函数_非const版本
        T& back()
        {
            //使用类模版容器的back()函数
            return _con.back();
        }
        //const版本
        const T& back() const
        {
            //使用类模版容器的back()函数
            return _con.back();
        }
        
        //empty()函数
        bool empty()
        {
            //使用类模版容器的empty()函数
            return _con.empty();
        }

        //size()函数
        const size_t size()
        {
            //使用类模版容器的size()函数
            return _con.size();
        }
    private:
        Container _con;
    };
}
```