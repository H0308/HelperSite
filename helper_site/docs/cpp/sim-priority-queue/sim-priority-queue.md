<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# priority_queue模拟实现

## priority_queue模拟实现

实现priority_queue的方式和stack和queue基本类似，因为priority_queue也是一种容器适配器，但是只能使用vector和deque，这里默认使用vector容器作为适配器，因为priority_queue本质是堆结构，所以实现时主要按照堆的实现思路进行

### priority_queue类定义

```c++
//vector作为默认的容器适配器
template<class T, class Container = vector<T>>
class priority_queue
{
private:
    Container _con:
}
```

### priority_queue构造函数

priority_queue主要有两种构造函数：

1. 无参构造函数
2. 迭代器构造函数

!!! note
    需要注意的是，如果不显式实现两个构造函数，则默认是无参构造，该默认构造将会调用容器适配器的构造函数

```c++
//有迭代器构造就必须写显式写空参构造
priority_queue()
    :_con()
{}
//迭代器构造函数
template<class Iterator>
priority_queue(Iterator begin, Iterator end)
    :_con(begin, end)
{
    //向下调整算法建堆
    for (int i = (size()-2)/2; i >=0 ; i--)
    {
        adjustDown(i);
    }
}
```

### priority_queue类`push()`函数

因为按照堆实现思路进行，所以`push()`函数实现思路如下：

1. 向容器适配器中插入数据
2. 通过向上/向下调整算法构建堆

```C++
//向上调整建堆（以大堆为例）
void adjustUp(int child)
{
    //通过孩子获取父亲
    int parent = (child - 1) / 2;
    while (child > 0)
    {
        if (_con[child] > _con[parent])
        {
            swap(_con[child], _con[parent]);
            child = parent;
            parent = (child - 1) / 2;
        }
        else
        {
            break;
        }
    }
}
//向下调整算法
void adjustDown(int parent)
{
    //获取孩子
    int child = parent * 2 + 1;
    while (child < size())
    {
        //如果右孩子大于左孩子，更新当前的孩子为右孩子
        if (child + 1 < size() && _con[child] < _con[child + 1])
        {
            ++child;
        }

        //调整
        if (_con[child] > _con[parent])
        {
            swap(_con[child], _con[parent]);
            parent = child;
            child = parent * 2 + 1;
        }
        else
        {
            break;
        }
    }
}
//push()函数
void push(const T& val)
{
    //调用指定容器的push_back()函数
    _con.push_back(val);
    //找到当前孩子的位置
    int child = _con.size() - 1;
    //向上调整建堆
    //adjustUp(child);
    //向下调整建堆
    //获取到最后一个孩子对应的父亲
    int parent = (child - 1) / 2;
    for (int i = parent; i >= 0; i--)
    {
        adjustDown(i);
    }
}
```

### priority_queue类`pop()`函数

因为按照堆实现思路进行，所以`pop()`函数实现思路如下：

1. 交换根节点数据和最后一个叶子节点的数据
2. 调用容器适配器的删除，除去最后一个数据
3. 向下调整重新为堆

```c++
//pop()函数
void pop()
{
    //先交换堆顶数据和最后一个叶子节点数据
    swap(_con[0], _con[size() - 1]);
    _con.pop_back();
    //向下调整算法调整堆
    adjustDown(0);
}
```

### priority_queue类`size()`函数

```C++
//size()函数
const size_t size()
{
    return _con.size();
}
```

### priority_queue类`empty()`函数

```c++
//empty()函数
bool empty()
{
    return _con.empty();
}
```

### priority_queue类`top()`函数

```c++
//top()函数_const版本
const T& top() const
{
    return _con[0];
}

//top()函数_非const版本
T& top()
{
    return _con[0];
}
```

## 仿函数与priority_queue类模拟实现

在前面的模拟实现中，priority_queue默认是小堆的实现，但是如果此时需要实现大堆，就需要改变向上/向下调整算法，但是这种实现方式不能在一个文件里面同时创建出小堆和大堆，所以此时需要一个函数来控制比较大小，此时就可以用到仿函数

### 仿函数

所谓仿函数就是使用类并且重载`()`运算符，例如对于比较两个数值，小于返回`true`的仿函数

```c++
//仿函数
template<class T>
class less
{
public:
    bool operator()(const T& val1, const T& val2)
    {
        return val1 < val2;
    }
};
```

同样地，可以实现一个比较两个数值，大于返回`true`的仿函数

```c++
template<class T>
class greater
{
public:
    bool operator()(const T& val1, const T& val2)
    {
        return val1 > val2;
    }
};
```

所以此时可以使用仿函数修改向上/向下调整算法

```c++
//向上调整建堆（以大堆为例）
void adjustUp(int child)
{
    //定义仿函数对象，调用对象函数
    Compare com;
    //通过孩子获取父亲
    int parent = (child - 1) / 2;
    while (child > 0)
    {
        if (com(_con[parent], _con[child]))
        {
            swap(_con[child], _con[parent]);
            child = parent;
            parent = (child - 1) / 2;
        }
        else
        {
            break;
        }
    }
}
//向下调整算法
void adjustDown(int parent)
{
    //定义仿函数对象，调用对象函数
    Compare com;
    //获取孩子
    int child = parent * 2 + 1;
    while (child < size())
    {
        //如果右孩子大于左孩子，更新当前的孩子为右孩子
        if (child + 1 < size() && com(_con[child], _con[child + 1]))
        {
            ++child;
        }

        //调整
        if (com(_con[parent], _con[child]))
        {
            swap(_con[child], _con[parent]);
            parent = child;
            child = parent * 2 + 1;
        }
        else
        {
            break;
        }
    }
}
```

此时如果需要实现大堆，则只需要改变`Compare`的类型即可，下面是小堆和大堆的测试代码

```c++
void test()
{
    //小堆
    sim_priority_queue::priority_queue<int> pq;
    //上面的代码等同于
    //sim_priority_queue::priority_queue<int, vector<int>, sim_priority_queue::less<int>> pq;
    pq.push(35);
    pq.push(70);
    pq.push(56);
    pq.push(90);
    pq.push(60);
    pq.push(25);

    while (!pq.empty())
    {
        cout << pq.top() << " ";
        pq.pop();
    }

    cout << endl;

    //大堆
    sim_priority_queue::priority_queue<int, vector<int>, sim_priority_queue::greater<int>> pq2;
    pq2.push(35);
    pq2.push(70);
    pq2.push(56);
    pq2.push(90);
    pq2.push(60);
    pq2.push(25);
    while (!pq2.empty())
    {
        cout << pq2.top() << " ";
        pq2.pop();
    }
}

int main()
{
    test();
}
输出结果：
90 70 60 56 35 25
25 35 56 60 70 90
```

现在考虑前面`sort`函数中的仿函数

默认情况下，使用`sort`函数会对一段区间的内容进行升序排列，但是如果需要控制降序排列就需要用到仿函数

```c++
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main()
{
    vector<int> v{30, 2, 45, 4, 46, 78, 11, 25};
    // 默认升序排列
    sort(v.begin(), v.end());
    for (auto num : v)
    {
        cout << num << " ";
    }
    cout << endl;
    vector<int> v1{30, 2, 45, 4, 46, 78, 11, 25};
    // 使用仿函数匿名对象改为降序排列
    sort(v1.begin(), v1.end(), greater<int>());
    for (auto num : v1)
    {
        cout << num << " ";
    }
}
输出结果：
2 4 11 25 30 45 46 78 
78 46 45 30 25 11 4 2 
```

!!! note
    有了仿函数，除了可以使用内置的一些仿函数，也可自定义自己的仿函数来规定比较方式，这种对于自定义类型并且重载了比较运算符非常便捷