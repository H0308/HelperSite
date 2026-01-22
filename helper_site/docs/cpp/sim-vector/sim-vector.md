<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# vector模拟实现

## vector模拟实现

因为vector类是一种模版类，所以在设计vector类时需要考虑到使用模版，本次模拟实现参考SGI版本的源代码实现基础版本并结合一部分PJ版本的思路

### vector类设计

```C++
#pragma once

#include <iostream>
#include <cassert>
using namespace std;

namespace sim_vector
{
    template<class T>
    class vector
    {
    public:
        typedef T* iterator;//将普通指针作为迭代器
        typedef const T* const_iterator;//将const指针作为const迭代器

        //无参构造函数
        vector()
            :_start(nullptr)
            ,_finish(nullptr)
            ,_end_of_storage(nullptr)
        {}

        //根据个数构造函数
        vector(size_t n, const T& val = T());

        //根据个数构造函数
        vector(int n, const T& val = T());

        //根据迭代器区间构造函数
        template<class InputIterator>
        vector(InputIterator first, InputIterator last);

        //拷贝构造函数
        vector(const vector<T>& v);
        
        //赋值运算符重载函数——内部交换思路
        vector<T>& operator=(vector<T> v);

        //swap()函数
        void swap(vector<T> v);

        //析构函数
        ~vector();

        //获取有效数据个数函数
        const size_t size() const;

        //获取容量大小函数
        const size_t capacity() const;

        //begin()函数_非const
        iterator begin();

        //begin()函数_const
        const_iterator begin() const;

        //end()函数_非const
        iterator end();

        //end()函数_const
        const_iterator end() const;

        //reserve()函数
        void reserve(size_t newCapacity);

        //push_back()函数
        void push_back(const T& val);

        //empty()函数
        bool empty();

        //pop_back()函数
        void pop_back();

        //resize()函数
        void resize(size_t newSize, T val = T());

        //operator[]()函数_非const
        T& operator[](const size_t pos);

        //operator[]()函数_const
        const T& operator[](const size_t pos) const;

        //insert()函数
        iterator insert(iterator pos, T val = T());

        //erase()函数
        iterator erase(iterator pos);
    private:
        iterator _start;
        iterator _finish;
        iterator _end_of_storage;
    };
}
```

### vector类构造函数

设计vector类时主要使用指针来实现，所以构造函数中使所有指针均为空即可

```c++
//构造函数
vector()
    :_start(nullptr)
    ,_finish(nullptr)
    ,_end_of_storage(nullptr)
{}
```

### vector类根据个数构造函数

```c++
//根据个数构造函数
vector(size_t n, const T& val = T())
    :_start(nullptr)
    ,_finish(nullptr)
    ,_end_of_storage(nullptr)
{
    for (size_t i = 0; i < n; i++)
    {
        push_back(val);
    }
}
```

### vector类根据迭代器区间构造函数

为了满足vector类的迭代器区间不局限于本类的迭代器，所以需要用到函数模版

```C++
//根据迭代器区间构造函数
template<class InputIterator>
vector(InputIterator first, InputIterator last)
    :_start(nullptr)
    ,_finish(nullptr)
    ,_end_of_storage(nullptr)
{
    iterator tmp = _start;
    //根据指定区间构造
    while (first != last)
    {
        push_back(*first);
        first++;
    }
}
```

有了迭代器区间的构造函数后，使用根据个数的构造函数将会出问题，下面是测试报错信息

测试代码如下：

```C++
void test_give()
{
    //使用迭代器区间构造vector
    string s = "hello world";
    sim_vector::vector<char> s1(s.begin(), s.end());
    for (size_t i = 0; i < s1.size(); i++)
    {
        cout << s1[i] << " ";
    }

    //根据个数构造函数
    sim_vector::vector<int> v(10, 1);
    for (size_t i = 0; i < v.size(); i++)
    {
        cout << v[i] << " ";
    }
}

int main()
{
    test_give();

    return 0;
}
报错信息：
无法取消引用类型为“InputIterator”的操作数
```

上面的代码之所以会出现问题是因为当同时存在根据迭代器区间构造函数和根据个数的构造函数，若在调用时想使用根据个数的构造函数创建对象则编译器会默认匹配根据迭代器区间构造函数创建对象，而此时的迭代器参数值为整型常数，当解引用整型常数时就会出现问题

而编译器之所以会优先匹配迭代器区间而非个数是因为个数的构造函数的第一个参数为`size_t`类，而整型字面量默认是`int`类型，所以存在隐式类型转换，为了避免类型转换，编译器选择了模版迭代器函数

解决方案为：重载一个参数类型为`int`的根据个数的构造函数

```C++
//根据个数构造函数
vector(int n, const T& val = T())
    :_start(nullptr)
    , _finish(nullptr)
    , _end_of_storage(nullptr)
{
    for (int i = 0; i < n; i++)
    {
        push_back(val);
    }
}
```

### vector类拷贝构造函数

设计拷贝构造函数时，需要将每个指针指向位置的值给新的对象，思路如下：

<img src="image\image.png">

下面是示例代码：

```C++
//拷贝构造函数
vector(const vector<T>& v)
    :_start(nullptr)
    ,_finish(nullptr)
    ,_end_of_storage(nullptr)
{
    //为新对象开辟空间
    reserve(v.capacity());
    //拷贝数据
    memcpy(_start, v._start, sizeof(T) * v.size());
    //更改指针指向
    _finish = _start + v.size();
}
```

上面的拷贝构造函数测试如下：

```C++
void test_copy()
{
    //使用拷贝构造
    sim_vector::vector<int> v(10, 1);
    sim_vector::vector<int> v1(v);

    for (auto num : v1)
    {
        cout << num << " ";
    }
}

int main()
{
    test_copy();
    
    return 0;
}
输出结果：
1 1 1 1 1 1 1 1 1 1
```

根据上面的测试貌似没有任何问题，但是下面的测试将会出现问题

测试代码如下：

```C++
void test_copy()
{
    //使用拷贝构造_自定义类型
    sim_vector::vector<string> v(3, "111111");
    sim_vector::vector<string> v1(v);

    for (auto num : v1)
    {
        cout << num << " ";
    }
}

int main()
{
    test_copy();
    
    return 0;
}
```

上面的代码导致程序崩溃，具体原因为当vector的元素类型为涉及到资源分配的自定义类型时，析构函数对同一个空间进行了两次析构，因为第一次析构时已经将原空间释放，第二次析构就会出错，具体分析如下：

<img src="image\image1.png">

创建`v`对象时，会创建3个string类对象，使用下标遍历访问可以通过地址找到指定的string对象，例如第一个string类对象

<img src="image\image2.png">

如果直接使用上面的拷贝方式，拷贝过程中就会直接按照字节拷贝给`v1`对象，此时`v1`对象中的string类对象与`v`对象中的string类对象相同，因为`v`和`v1`中的string类对象共用一块内存空间，所以在最后释放过程中，因为先释放`v1`对象，释放的过程中会依次先释放每一个string类对象，最后再释放`v1`对象的空间，而此时当`v`对象释放时，先释放string类对象，因为`v1`释放过程中已经释放了string类对象，`v`对象二次释放导致程序崩溃

!!! note
    数组元素地址不等于元素本身的地址

所以可以考虑使用深拷贝的解决方案：

```C++
//拷贝构造函数
vector(const vector<T>& v)
    :_start(nullptr)
    ,_finish(nullptr)
    ,_end_of_storage(nullptr)
{
    //为新对象开辟空间
    reserve(v.capacity());
    //拷贝数据
    //memcpy(_start, v._start, sizeof(T) * v.size());
    for (size_t i = 0; i < v.size(); i++)
    {
        _start[i] = v._start[i];
    }
    //更改指针指向
    _finish = _start + v.size();
}
```

测试上面的代码会发现，这个代码已经可以满足当元素为string类时的拷贝构造，测试代码如下：

```C++
void test_copy()
{
    sim_vector::vector<string> v(3, "111111");
    sim_vector::vector<string> v1(v);

    for (size_t i = 0; i < v.size(); i++)
    {
        cout << v[i] << " ";
    }
    cout << endl;
    for (size_t i = 0; i < v.size(); i++)
    {
        v1[i] = "222";
        cout << v1[i] << " ";
    }
    cout << endl;
    //不改变原来的内容
    for (size_t i = 0; i < v.size(); i++)
    {
        cout << v[i] << " ";
    }
}

int main()
{
    test_copy();
    
    return 0;
}
输出结果：
111111 111111 111111
222 222 222
111111 111111 111111
```

如果模板参数为当前模拟实现的vector类时又会出现上面同样的问题，下面是库内的vector类的测试结果作为对比：

```C++
#include <vector>

//杨辉三角题目测试
class Solution {
public:
    vector<vector<int>> generate(int numRows) {
        vector<vector<int>> vv(numRows);
        //初始化每一个vector<int>元素
        for (size_t i = 0; i < numRows; i++)
        {
            vv[i].resize(i + 1, 1);//将每一个vector<int>初始化为i+1个数组，并初始化为1
        }

        //构造杨辉三角
        for (size_t i = 2; i < numRows; i++)
        {
            for (size_t j = 1; j < i; j++)
            {
                vv[i][j] = vv[i - 1][j] + vv[i - 1][j - 1];
            }
        }
        return vv;
    }
};

int main()
{
    vector<vector<int>> vv = Solution().generate(3);
    vector<vector<int>> vv1(vv);
    for (size_t i = 0; i < vv1.size(); i++)
    {
        for (size_t j = 0; j < vv1[i].size(); j++) {
            cout << vv1[i][j] << " ";
        }
        cout << endl;
    }
    return 0;
}
输出结果：
1
1 1
1 2 1
```

当模板参数切换为模拟实现的类时：

```C++
//杨辉三角题目测试
class Solution {
public:
    sim_vector::vector<sim_vector::vector<int>> generate(int numRows) {
        sim_vector::vector<sim_vector::vector<int>> vv(numRows);
        //初始化每一个vector<int>元素
        for (size_t i = 0; i < numRows; i++)
        {
            vv[i].resize(i + 1, 1);//将每一个vector<int>初始化为i+1个数组，并初始化为1
        }

        //构造杨辉三角
        for (size_t i = 2; i < numRows; i++)
        {
            for (size_t j = 1; j < i; j++)
            {
                vv[i][j] = vv[i - 1][j] + vv[i - 1][j - 1];
            }
        }
        return vv;
    }
};

int main()
{
    sim_vector::vector<sim_vector::vector<int>> vv = Solution().generate(3);
    sim_vector::vector<sim_vector::vector<int>> vv1(vv);
    for (size_t i = 0; i < vv1.size(); i++)
    {
        for (size_t j = 0; j < vv1[i].size(); j++) {
            cout << vv1[i][j] << " ";
        }
        cout << endl;
    }
    return 0;
}
```

使用上面的测试会发现，同样在析构时出现同一空间进行两次析构导致程序崩溃，下面的是原因分析

<img src="image\image3.png">

由上图可以看出，即使模板参数类型为`vector<int>`，和模板参数类型为string类也没有什么区别，那么问题在何处

观察上面的拷贝构造函数的实现代码可以发现，`_start[i] = v._start[i]`涉及到一个赋值运算，而string类本身已经重载过赋值运算符，所以是深拷贝，但是模拟类还没有实现赋值运算符的重载，所以在这里赋值时实际上还是调用的编译器默认的赋值运算符重载函数，依旧是浅拷贝，导致拷贝的结果也就是新对象装着被拷贝对象的旧内容，所以需要实现赋值运算符重载函数

#### vector类赋值运算符重载函数

```C++
//赋值运算符重载函数——内部重新赋值思路
vector<T>& operator=(vector<T> v)
{
    if (this != &v)
    {
        reserve(v.capacity());
        for (size_t i = 0; i < v.size(); i++)
        {
            _start[i] = v._start[i];
        }
        //改变指针指向
        _finish = _start + v.size();
    }
    return *this;
}

//赋值运算符重载函数——内部交换思路
vector<T>& operator=(vector<T> v)
{
    if (this != &v)
    {
        swap(v);
    }
    return *this;
}
```

现在再对模拟实现的vector类进行相同的测试

```C++
//杨辉三角题目测试
class Solution {
public:
    sim_vector::vector<sim_vector::vector<int>> generate(int numRows) {
        sim_vector::vector<sim_vector::vector<int>> vv(numRows);
        //初始化每一个vector<int>元素
        for (size_t i = 0; i < numRows; i++)
        {
            vv[i].resize(i + 1, 1);//将每一个vector<int>初始化为i+1个数组，并初始化为1
        }

        //构造杨辉三角
        for (size_t i = 2; i < numRows; i++)
        {
            for (size_t j = 1; j < i; j++)
            {
                vv[i][j] = vv[i - 1][j] + vv[i - 1][j - 1];
            }
        }
        return vv;
    }
};

int main()
{
    sim_vector::vector<sim_vector::vector<int>> vv = Solution().generate(3);
    sim_vector::vector<sim_vector::vector<int>> vv1(vv);
    for (size_t i = 0; i < vv1.size(); i++)
    {
        for (size_t j = 0; j < vv1[i].size(); j++) {
            cout << vv1[i][j] << " ";
        }
        cout << endl;
    }
    return 0;
}
输出结果：
1
1 1
1 2 1
```

### vector类析构函数

```C++
//析构函数
~vector()
{
    delete[] _start;
    _start = _finish = _end_of_storage = nullptr;
}
```

### vector类获取有效数据个数函数

当两个指针指向同一个空间时，二者差值即为两个指针相差的数据个数

```C++
//获取有效数据个数函数
const size_t size() const
{
    return _finish - _start;
}
```

### vector类获取容量大小函数

当两个指针指向同一个空间时，尾指针减头指针即为容量大小

```C++
//获取容量大小函数
const size_t capacity() const
{
    return _end_of_storage - start;
}
```

### vector类`begin()`函数

对于非`const`的对象时，调用非`const`的`begin()`函数

对于`const`的对象时，调用`const`的`begin()`函数

```C++
//begin()函数_非const
iterator begin()
{
    return _start;
}

//begin()函数_const
const_iterator begin() const
{
    return _start;
}
```

### vector类`end()`函数

对于非`const`的对象时，调用非`const`的`end()`函数

对于`const`的对象时，调用`const`的`end()`函数

```C++
//end()函数_非const
iterator end()
{
    return _finish;
}

//end()函数_const
const_iterator end() const
{
    return _finish;
}
```

### vector类`reserve()`函数

设计`reserve()`函数时需要注意，因为基本的扩容思路是开辟新空间再释放原空间，此时会涉及到指针指向的位置改变，而如果`_start`指针和`_finish`指针不是指向同一块空间时，那么就无法计算出`size`和`capacity`

下面是错误代码演示：

```C++
//reserve()函数
void reserve(size_t newCapacity)
{
    //如果capacity比当前的capacity小或者相等时不进行处理
    int before = capacity();
    if (newCapacity <= before)
    {
        return;
    }

    //进行扩容
    T* tmp = new T[newCapacity];
    //如果有数据时进行数据移动
    if (_start)
    {
        memcpy(tmp, _start, sizeof(T) * size());
        //释放原空间
        delete[] _start;
    }

    //改变原指针指向
    _start = tmp;
    _finish = _start + size();
    _end_of_storage = _start + newCapacity;
}
调用函数reserve(10)测试输出结果：
0
0
18446743418279207180
10
```

错误原因分析：

<img src="image\image4.png">

通过上面的分析可以得出错误的原因主要是`size()`函数计算的值为随机值，导致`_finish`指针错误，最后在测试中调用`size()`函数计算错误

因为拷贝数据的过程中，每个数据的间隔值不变，所以再扩容之前先记录开始的`size`即可

正确代码如下

```C++
//reserve()函数
void reserve(size_t newCapacity)
{
    //如果capacity比当前的capacity小或者相等时不进行处理
    size_t beforeCapacity = capacity();
    if (newCapacity <= beforeCapacity)
    {
        return;
    }

    //进行扩容
    T* tmp = new T[newCapacity];
    //记录开始的size
    size_t beforeSize = size();
    //如果有数据时进行数据移动
    if (_start)
    {
        memcpy(tmp, _start, sizeof(T) * size());
        //释放原空间
        delete[] _start;
    }

    //改变原指针指向
    _start = tmp;
    _finish = _start + beforeSize;
    _end_of_storage = _start + newCapacity;
}
```

### vector类`push_back()`函数

vector类中的数据尾插时需要注意是否需要扩容，即当前对象的`_finish`指针和`_end_of_storage`指针是否指向同一个位置，不需要扩容时直接插入数据后改变`_finish`指针即可

```C++
//push_back()函数
void push_back(const T& val)
{
    //判断是否需要扩容
    if (_finish == _end_of_storage)
    {
        size_t beforeCapacity = capacity();
        reserve(beforeCapacity == 0 ? 4 : beforeCapacity * 2);
    }

    //扩容完毕后插入数据
    (*_finish) = val;//改变指向位置的值
    ++_finish;
}
```

### vector类`empty()`函数

当`_start`指针和`_finish`指针均指向起始位置时说明空间中无数据

```C++
//empty()函数
bool empty()
{
    return _start == _finish;
}
```

### vector类`pop_back()`函数

设计`pop_back()`函数需要注意如果空间中无数据时不可以执行删除

```C++
//pop_back()函数
void pop_back()
{
    //空间内无数据时不允许删除
    assert(!empty());

    --_finish;
}
```

### vector类`resize()`函数

设计`resize()`函数思路和string类中的思路一致，分三种情况讨论即可

需要注意的是，设计初始化值时，不要直接使用值，而是使用匿名对象调用对应的构造函数，因为vector中存储的数据类型不一定时内置类型，也有可能是自定义类型

另外对于初始化来说，不能是简单的赋值行为，需要考虑到深拷贝问题

!!! note
    内置类型也有默认无参构造函数，但是用得非常少，注意指针无法使用对应的构造函数

```C++
//resize()函数
void resize(size_t newSize, T val = T())
{
    //当newSize小于当前的size时删除数据
    if (newSize <= size())
    {
        _finish = _start + newSize;
        _end_of_storage = _finish;
        return;
    }

    //当newSize大于当前的size时扩容+初始化
    //当newSize大于当前的capacity时进行扩容
    if (newSize > capacity())
    {
        reserve(newSize);
    }

    //初始化
    while (_finish != (_start + newSize))
    {
        //初始化
        *_finish = val;
        _finish++;
    }
}
```

### vector类`operator[]()`重载函数

返回指定位置的数据引用即可

对于非`const`的对象时，调用非`const`的`operator[]()`函数

对于`const`的对象时，调用`const`的`operator[]()`函数

```C++
//operator[]()函数_非const
T& operator[](const size_t pos)
{
    assert(pos >= 0);
    assert(pos < size());
    return *(_start + pos);
}

//operator[]()函数_const
const T& operator[](const size_t pos) const
{
    assert(pos >= 0);
    assert(pos < size());
    return *(_start + pos);
}
```

### vector类`insert()`函数

对于`insert()`函数来说，插入数据的思路和string类的插入思路基本一致

```C++
//insert()函数
void insert(iterator pos, T val = T())
{
    //确保位置合理
    assert(pos >= _start);
    assert(pos <= _finish);

    //当空间不足时进行扩容
    if (_finish == _end_of_storage)
    {
        reserve(capacity() * 2);
    }

    //将pos位置及以后的数据向后挪动一个位置
    iterator tmp = _finish + 1;
    while (tmp >= pos)
    {
        *tmp = *(tmp - 1);
        tmp--;
    }

    //pos位置插入数据
    (*pos) = val;
    ++_finish;
}
```

上面的代码中，如果在插入时没有涉及到空间扩容时没有问题，但是如果一旦涉及到空间扩容则会导致`pos`为野指针，测试如下：

```C++
//插入时无空间扩容
void test_insert()
{
    //插入五个数据时会扩容
    sim_vector::vector<int> v;
    v.push_back(1);
    v.push_back(2);
    v.push_back(3);
    v.push_back(4);
    v.push_back(5);

    //因为当前的capacity为8，足够插入一个数据，故插入过程不需要扩容
    sim_vector::vector<int>::iterator pos = std::find(v.begin(), v.end(), 2);
    v.insert(pos, 20);
    for (auto num : v)
    {
        cout << num << " ";
    }
    cout << endl;
}

int main()
{
    test_insert();

    return 0;
}
输出结果：
1 20 2 3 4 5

//插入过程中有空间扩容
void test_insert()
{
    //再插入一个数据时需要扩容到空间大小为8
    sim_vector::vector<int> v;
    v.push_back(1);
    v.push_back(2);
    v.push_back(3);
    v.push_back(4);

    sim_vector::vector<int>::iterator pos = std::find(v.begin(), v.end(), 2);
    v.insert(pos, 20);
    for (auto num : v)
    {
        cout << num << " ";
    }
    cout << endl;
}

int main()
{
    test_insert();

    return 0;
}
输出结果：
1 2 3 4 -842150451
```

出现上面的错误原因是因为扩容导致`pos`指针指向的位置失效，具体分析如下：

<img src="image\image5.png">

<img src="image\image5.png">

修改方式如下：

```C++
//insert()函数
void insert(iterator pos, T val = T())
{
    //确保位置合理
    assert(pos >= _start);
    assert(pos <= _finish);

    //记录pos与_start的差值
    size_t gap = pos - _start;
    //当空间不足时进行扩容
    if (_finish == _end_of_storage)
    {
        reserve(capacity() * 2);
        //扩容时更新pos
        pos = _start + gap;
    }

    //将pos位置及以后的数据向后挪动一个位置
    iterator tmp = _finish + 1;
    while (tmp >= pos)
    {
        *tmp = *(tmp - 1);
        tmp--;
    }

    //pos位置插入数据
    (*pos) = val;
    ++_finish;
}
```

但是上面的代码还存在第二个问题，如果在调用`insert()`函数后，如果涉及到扩容，虽然`insert()`函数内部解决了因为扩容导致的`pos`位置失效，但是并没有改变调用处的`pos`，如果在调用之后想改变`pos`位置的值，此时也会出现非法访问，从而出现随机值

测试如下：

```C++
void test_insert()
{
    sim_vector::vector<int> v;
    v.push_back(1);
    v.push_back(2);
    v.push_back(3);
    v.push_back(4);
    //v.push_back(5);

    sim_vector::vector<int>::iterator pos = std::find(v.begin(), v.end(), 2);
    v.insert(pos, 20);
    for (auto num : v)
    {
        cout << num << " ";
    }
    cout << endl;
    (*pos)++;
    for (auto num : v)
    {
        cout << num << " ";
    }
}

int main()
{
    test_insert();

    return 0;
}
```

`insert()`函数内部涉及到扩容时改变pos位置：

<img src="image\image7.png">

但是在函数外部并没有改变pos的位置：

<img src="image\image8.png">

所以在设计`insert()`函数时可以考虑返回`pos`位置

```C++
//insert()函数
iterator insert(iterator pos, T val = T())
{
    //确保位置合理
    assert(pos >= _start);
    assert(pos <= _finish);

    //记录pos与_start的差值
    size_t gap = pos - _start;
    //当空间不足时进行扩容
    if (_finish == _end_of_storage)
    {
        reserve(capacity() * 2);
        //扩容时更新pos
        pos = _start + gap;
    }

    //将pos位置及以后的数据向后挪动一个位置
    iterator tmp = _finish + 1;
    while (tmp >= pos)
    {
        *tmp = *(tmp - 1);
        tmp--;
    }

    //pos位置插入数据
    (*pos) = val;
    ++_finish;

    return pos;
}
```

!!! note
    所以在使用`insert()`函数，需要考虑上面出现的两种问题，这两种问题统称为迭代器失效问题

### vector类`erase()`函数

设计`erase()`函数时，和string类的思想基本一致，但vector类删除的是迭代器指向位置的数据

```C++
//erase()函数
void erase(iterator pos)
{
    //确保位置有效
    assert(pos >= _start);
    assert(pos < _finish);

    //将pos后的数据向pos位置移动
    iterator tmp = pos + 1;
    while (tmp < _finish)
    {
        *(tmp - 1) = *tmp;
        tmp++;
    }

    --_finish;
}
```

上面的代码中直接删除对象空间中的数据没有任何问题，但是根据理解来说，如果在调用函数之后还想改变`pos`位置的值时就会访问错误，得到的结果也是随机值，实际上面的操作结果为：

```C++
void test_erase()
{
    sim_vector::vector<int> v;
    v.push_back(1);
    v.push_back(2);
    v.push_back(3);
    v.push_back(4);

    sim_vector::vector<int>::iterator pos = std::find(v.begin(), v.end(), 1);
    v.erase(pos);
    for (auto num : v)
    {
        cout << num << " ";
    }
    
    cout << endl;
    (*pos)++;
    for (auto num : v)
    {
        cout << num << " ";
    }
}

int main()
{
    test_erase();

    return 0;
}
输出结果：
2 3 4 
3 3 4
```

结果应该是报错，因为没有`pos`位置的数据1，但是改变了后一个数据的位置并且正常输出，对比库中的`erase()`函数测试结果：

```C++
#include <vector>

void test_erase()
{
    vector<int> v;
    v.push_back(1);
    v.push_back(2);
    v.push_back(3);
    v.push_back(4);

    vector<int>::iterator pos = std::find(v.begin(), v.end(), 1);
    v.erase(pos);
    for (auto num : v)
    {
        cout << num << " ";
    }

    cout << endl;
    (*pos)++;
    for (auto num : v)
    {
        cout << num << " ";
    }
}

int main()
{
    test_erase();

    return 0;
}
```

<img src="image\image9.png">

标准库中的`erase()`函数此时直接报错，和正常理解没有歧义

上面的对比涉及到了两个平台的实现方式，第一种没有报错的对应与Linux下的g++，第二种报错的对应于VS下的MSVC

所以在使用`erase()`函数时，也需要注意迭代器失效的问题，因为再使用一开始的`pos`不同的平台结果不一样，即结果未定义

解决方式为记录删除的数据的下一个数据的位置，为函数加上返回值（被删除数据的下一个数据的位置）

```C++
//erase()函数
iterator erase(iterator pos)
{
    //确保位置有效
    assert(pos >= _start);
    assert(pos < _finish);

    //将pos后的数据向pos位置移动
    iterator tmp = pos + 1;
    while (tmp < _finish)
    {
        *(tmp - 1) = *tmp;
        tmp++;
    }

    --_finish;

    return pos;
}
```

### vector类`swap()`函数

```C++
//swap()函数
void swap(vector<T> v)
{
    std::swap(_start, v._start);
    std::swap(_finish, v._finish);
    std::swap(_end_of_storage, v._end_of_storage);
}
```