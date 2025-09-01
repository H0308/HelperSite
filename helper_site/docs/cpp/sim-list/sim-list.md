<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# list类模拟实现

## list类模拟实现

### list类节点结构设计

因为list类为本质是带头双向循环链表，所以在设计list类时，需要先设计节点的结构，并且因为每一个节点是一个整体，所以可以考虑将每一个节点的初始化构造放在结构体中，如下代码所示：

```C++
//节点结构
template<class T>
struct _list_node
{
    T data;// 数据类型
    _list_node* prev;// 前驱指针
    _list_node* next;// 后继指针

    //节点构造函数
    _list_node(const T& x = T())
        :data(x)
        ,prev(nullptr)
        ,next(nullptr)
    {}
};
```

### list类非`const`迭代器结构设计

因为list类是带头双向循环链表，所以迭代器不能单单使用普通指针来代替，因为普通指针可以指针的`++`/`--`等操作可以作用到连续空间，链表两个节点空间不一定连续，所以额外重载`++`/`--`等运算符

#### 迭代器基本结构设计

```C++
//迭代器结构
template<class T>
struct _list_iterator
{
    typedef _list_node<T> Node;
    typedef _list_iterator<T> self;

    Node* _node;//迭代器节点
};
```

#### 迭代器构造函数

为了可以将普通指针看作迭代器，需要构造函数使用普通指针进行构造

```C++
//迭代器构造函数
_list_iterator(Node* node)
    :_node(node)
{}
```

考虑下面的代码

```C++
void test()
{
    sim_list::list<int>::iterator it = ls.begin();
    while (it != ls.end())
    {
        cout << *it << " ";
        ++it;
    }
}
```

在上面的测试代码中，当使用迭代器遍历时，需要使用到3个运算符

1. `!=`：不等于运算符
2. `*`：解引用运算符
3. `++`：前置自增运算符

但是由于`it`不是原生指针（内置类型的指针），所以需要额外重载这三个运算符

#### `operator++()`函数

重载前置`++`运算符的本意是让迭代器可以从当前节点移动到下一个节点，所以只需要移动节点类型的指针指向下一个节点即可

```C++
//迭代器前置++运算符重载
self& operator++()
{
    _node = _node->next;
    return *this;
}
```

#### `operator*()`函数

重载`*`运算符本意是为了获取当前有效数据节点数据域中的值，所以返回当前节点数据域的值即可

```C++
//迭代器*运算符重载
T& operator*()
{
    return _node->data;
}
```

#### `operator!=()`函数

重载!=运算符本意是为了判断迭代器指向的当前节点是end()迭代器的位置（即是否已经遍历完链表）

```C++
//迭代器!=运算符重载
//注意end()返回值是个临时对象，具有常性，不能忘记const
bool operator!=(const self& cur)
{
    return _node != cur._node;
}
```

#### `operator++(int)`函数

后置`++`运算符重载需要满足先使用再自增，所以需要提前记录当前节点再改变当前节点指向为下一个节点

```c++
//迭代器后置++运算符重载
self operator++(int)
{
    Node* cur = _node;
    _node = _node->next;
    return cur;
}
```

#### `operator--()`函数

前置`--`运算符重载直接返回上一个节点的位置即可

```C++
//迭代器前置--运算符重载
self& operator--()
{
    node = node->prev;
    return *this;
}
```

#### `operator--(int)`函数

后置`--`运算符重载需要满足先使用再自增，所以需要提前记录当前节点再改变当前节点指向为下一个节点

```C++
//迭代器后置--运算符重载
self operator--(int)
{
    Node* cur = node;
    node = node->prev;
    return cur;
}
```

#### `operator==()`函数

重载`==`运算符为了判断当前节点是否等于指定节点

```c++
//迭代器==运算符重载
bool operator==(const self& cur)
{
    return node == cur.node;
}
```

#### `operator->()`函数

如果模板参数为自定义类型时，访问自定义类型的成员变量时除了可以解引用之后通过`.成员变量`的方式以外，还有`->成员变量`的方式，但是对于list类来说不存在原生指针，只有迭代器，所以迭代器需要重载`->`运算符，考虑下面的代码

```C++
struct test
{
    int num1;
    int num2;
};

void test_operatorTo()
{
    sim_list::list<struct test> ls;
    sim_list::list<struct test>::iterator it = ls.begin();
    //使用直接访问
    cout << (*it).num1 << " " << (*it).num2 << endl;

    //使用间接访问
    cout << it->num1 << " " << it->num2 << endl;
}
```

为了可以使用`->`运算符，需要重载`->`运算符

```C++
//迭代器->运算符重载
T* operator->()//返回对应类型的指针
{
    return &(node->data);//获取当前数据域的地址
}
```

<img src="image\image.png">

所以上面的代码可以转化为

```C++
cout << it.operator->()->num1 << " " << it.operator->()->num2 << endl;
//其中it.operator->()返回自定义类型变量的地址
```

### list类`const`迭代器结构设计

设计`const`迭代器的思路和非`const`迭代器思路基本一致，但是设计`const`迭代器不可以单单是在已有的`iterator`前面加上`const`改为`const iterator`，这种写法会使编译器认为是`T* const`，此时实现的效果是，迭代器指向的内容可以修改，但是指向不可以修改，而需要的`const`迭代器实现的效果是迭代器指向的内容不可以修改，但是指向可以修改，即`const T*`，所以需要单独设计一个`const_iterator`类来解决这个问题

#### 迭代器基本结构设计

```C++
template<class T>
struct _list_iterator_const 
{
    typedef _list_node<T> Node;
    typedef _list_iterator_const<T> self;

    Node* node;
};
```

#### 迭代器构造函数

```C++
//构造函数
//同非const版本一样，使用指针构造迭代器
_list_iterator_const(Node* node)
    :_node(node)
{}
```

#### `operator++()`函数

因为是改变迭代器指针的指向，所以设计`operator++()`函数和非`const`版本的方式相同

```C++
//operator++()函数
self& operator++()
{
    _node = _node->next;
    return *this;
}
```

#### `operator*()`函数

因为`const`版本迭代器不可以通过解引用修改指针指向的内容，所以需要使用`const`修饰返回值

```C++
//operator*()函数
const T& operator*() const
{
    return _node->data;
}
```

#### `operator!=()`函数

对于`!=`运算符来说，和非`const`版本思路相同

```C++
//operator!=()函数
bool operator!=(const self& cur)
{
    return _node != cur._node;
}
```

#### `operator++(int)`函数

对于后置`++`来说与`const`版本同理

```C++
//operator++(int)函数
self& operator++(int)
{
    Node* cur = _node;
    _node = _node->next;
    return cur;
}
```

#### `operator--()`函数

因为`--`改变的是迭代器指向的内容，所以与非`const`版本迭代器思路相同

```C++
self& operator--()
{
    _node = _node->prev;
    return *this;
}
```

#### `operator--(int)`函数

设计后置`--`的思路与非`const`版本相同

```C++
//operator--(int)函数
self& operator--(int)
{
    Node* cur = _node;
    _node = _node->prev;
    return cur;
}
```

#### `operator==()`函数

设计`==`运算符重载函数思路和非`const`版本相同

```C++
//operator==()函数
bool operator==(const self& cur)
{
    return _node = cur._node;
}
```

#### `operator->()`函数

需要满足返回值为`const`类型即可

```c++
const T* operator->()
{
    return &_node->data;
}
```

### `const`版本的迭代器使用问题

上面的`const`版本迭代器实现方式可以应用于对象为`const`类型时，例如下面的测试代码

```c++
void test_const_iterator()
{
    sim_list::list<int> ls;
    ls.push_back(1);
    ls.push_back(2);
    ls.push_back(3);
    ls.push_back(4);
    ls.push_back(5);
    const sim_list::list<int> ls1(ls);// const对象

    sim_list::list<int>::const_iterator cit = ls1.begin();// 编译器自动识别const类型的迭代器

    while (cit != ls1.end())
    {
        //*cit = 2;
        cout << *cit << " ";
        cit++;
    }
    cout << endl;
}
```

但是如果对象不是`const`类型，此时上面的代码就会出现错误，例如下面的测试代码

```C++
void test_const_iterator()
{
    sim_list::list<int> ls;
    ls.push_back(1);
    ls.push_back(2);
    ls.push_back(3);
    ls.push_back(4);
    ls.push_back(5);

    sim_list::list<int>::const_iterator cit = ls.begin();// 编译器无法自动识别const类型的迭代器


    while (cit != ls.end())
    {
        //*cit = 2;
        cout << *cit << " ";
        cit++;
    }
    cout << endl;
}
```

在第二个测试代码中，因为`cit`为`const`类型的迭代器，所以不可以使用非`const`版本的迭代器，但是此时的`begin()`和`end()`均为非`const`版本迭代器，因为对象`ls`为非`const`对象

这里提出两种解决方案：

1. 将`const`版本的`begin()`和`end()`改为`cbegin()`和`cend()`，此时显式使`ls`调用`const`版本的`cbegin()`和`cend()`

    !!! note
        缺点：没有使用到函数重载的优势

    ```C++
    //修改const版本的迭代器
    //begin()函数——const版本
    const_iterator cbegin() const
    {
        return _head->next;
    }

    //begin()函数——const版本
    const_iterator cbegin() const
    {
        return _head->next;
    }

    //测试代码修改为
    void test_const_iterator()
    {
        sim_list::list<int> ls;
        ls.push_back(1);
        ls.push_back(2);
        ls.push_back(3);
        ls.push_back(4);
        ls.push_back(5);

        sim_list::list<int>::const_iterator cit = ls.cbegin();// 显式指定const版本迭代器

        while (cit != ls.cend())
        {
            //*cit = 2;
            cout << *cit << " ";
            cit++;
        }
        cout << endl;
    }
    ```

2. 在`const`版本的迭代器结构中添加非`const`对象向`const`对象转换的构造函数

    !!! note
        缺点：没有调用`const`版本的迭代器

    ```C++
    // 非const对象向const对象转换的构造函数
    //传入非const对象，为了确保安全，使用const修饰形参
    _list_iterator_const(const _list_iterator<T> nonConst)
        :_node(nonConst._node)//使用非const对象中的_node值构造const版本的对象中的_node
    {}
    ```

### `const`版本迭代器和非`const`版本迭代器合并优化

在实现非`const`版本的迭代器时，可以很明显感觉到除了`operator*()`函数和`operator->()`函数两个有不同以外，其余均没有不同，而这两个版本中的这两个函数只是返回值类型不同，那么可以考虑通过模板单独控制这两个返回值类型，现在将类型引用`T&`用模板参数`Ref`指代，将类型指针`T*`用模板参数`Ptr`指代，则`const`版本迭代器和非`const`版本迭代器可以合并为下面的代码：

```C++
//迭代器结构——复合版本
template<class T, class Ref, class Ptr>
struct _list_iterator
{
    typedef _list_node<T> Node;
    typedef _list_iterator<T, Ref, Ptr> self;

    Node* _node;//迭代器节点

    //迭代器构造函数
    _list_iterator(Node* node)
        :_node(node)
    {}

    //迭代器前置++运算符重载
    self& operator++()
    {
        _node = _node->next;
        return *this;
    }

    //迭代器前置--运算符重载
    self& operator--()
    {
        _node = _node->prev;
        return *this;
    }

    //迭代器后置++运算符重载
    self operator++(int)
    {
        Node* cur = _node;
        _node = _node->next;
        return cur;
    }

    //迭代器后置--运算符重载
    self operator--(int)
    {
        Node* cur = _node;
        _node = _node->prev;
        return cur;
    }

    //迭代器*运算符重载
    Ref operator*()
    {
        return _node->data;
    }

    //迭代器->运算符重载
    Ptr operator->()
    {
        return &(_node->data);
    }

    //迭代器!=运算符重载
    bool operator!=(const self& cur)
    {
        return _node != cur._node;
    }

    //迭代器==运算符重载
    bool operator==(const self& cur)
    {
        return _node == cur._node;
    }
};
```

!!! note
    注意，此处也需要考虑到非`const`对象向`const`对象的转换问题，为了更方便解决，采取上面的第一种解决方案，如果直接是`const`对象调用则不需要考虑这个问题

### list类无参构造函数

对于list类来说，因为只有一个头指针作为成员变量，所以无参构造时只需要考虑创建头结点即可

```C++
//头节点处理
void empty_init()
{
    _head = new Node;
    _head->prev = _head;
    _head->next = _head;

    _size = 0;
}

//构造函数
list()
{
    empty_init();
}
```

### list类析构函数

调用`clear()`函数后将头节点资源清理并置为空即可

```C++
//析构函数
~list()
{
    clear();

    delete _head;
    _head = nullptr;
}
```

### list类拷贝构造函数

```C++
//拷贝构造函数
list(list<T>& ls)
{
    empty_init();

    for (auto num : ls)
    {
        push_back(num);
    }
}
```

### list类赋值运算符重载函数

```C++
//赋值运算符重载函数
list<T>& operator=(list<T>& ls)
{
    if (this != &ls)
    {
        for (auto num : ls)
        {
            push_back(num);
        }
    }

    return *this;
}
```

### `begin()`函数

返回第一个有效数据节点的位置即可

```C++
//begin()函数——非const版本
iterator begin()
{
    return _head->next;//隐式类型转换
}

//begin()函数——const版本
const_iterator begin() const
{
    return _head->next;
}
```

### `end()`函数

返回最后一个头节点的位置即可

```C++
//end()函数——非const版本
iterator end()
{
    return _head;
}

//end()函数——const版本
const_iterator end() const
{
    return _head;
}
```

### `insert()`函数

插入节点思路参考带头双向循环链表

!!! note
    可以考虑返回当前节点位置防止迭代器失效问题

```C++
//insert()函数
iterator insert(iterator position, const T& val)
{
    //创建新的节点
    Node* node = new Node(val);
    //改变节点指针指向
    //记录当前position位置的节点
    Node* cur = position._node;
    //改变新节点的指向
    node->next = cur;
    node->prev = cur->prev;
    //改变当前位置节点的前一个节点的后继指针指向
    cur->prev->next = node;
    //改变当前位置节点的前驱指针指向
    cur->prev = node;

    ++_size;

    return position;
}
```

### `push_back()`函数

设计思路参考带头双向循环链表的思路

```C++
//push_back()函数
void push_back(const T& val)
{
    //创建新的节点
    Node* node = new Node(val);//调用节点结构构造函数
    //改变节点指针
    //先记录当前最后一个节点
    Node* tail = _head->prev;
    //改变头节点前驱指针为新节点
    _head->prev = node;
    //改变最后一个节点的后继指针指向新节点
    tail->next = node;
    //改变新节点的指针
    node->prev = tail;
    node->next = _head;

    ++_size;
}
```

### `push_front()`函数

设计思路参考带头双向循环链表的思路

```C++
//push_front()函数
void push_front(const T& val)
{
    //创建新节点
    Node* node = new Node(val);
    //改变指针指向
    //先记录当前第一个节点
    Node* first = _head->next;
    //改变新节点的指针指向
    node->next = first;
    node->prev = _head;
    //改变头指针后继指针指向
    _head->next = node;
    //改变原始第一个节点的前驱指针指向
    first->prev = node;

    ++_size;
}
```

### `erase()`函数

删除节点的思路类似于带头双向链表的删除思路

!!! note
    注意返回删除节点位置的下一个节点的位置防止出现迭代器失效问题

```C++
//erase()函数
iterator erase(iterator position)
{
    //不可以删除头结点
    assert(position != iterator(_head));

    //记录要删除的节点的后一个节点
    Node* cur = position._node->next;
    //改变要删除的节点的前一个节点的后继指针
    position._node->prev->next = cur;
    //改变要删除的节点的后一个节点的前驱指针
    cur->prev = position._node->prev;

    //删除当前位置的指针
    delete position._node;

    --_size;

    return cur;
}
```

### `pop_back()`函数

直接复用`erase()`函数即可，但是需要注意删除的位置不是`end`的位置，而是`end`前一个位置

```C++
//pop_back()函数
void pop_back()
{
    erase(--end());
}
```

### `pop_front()`函数

直接复用`erase()`函数即可

```C++
//pop_front()函数
void pop_front()
{
    //复用erase()函数
    erase(begin());
}
```

### `clear()`函数

调用`erase()`函数循环从头删除即可，但是不可以删除头结点

```C++
//clear()函数
void clear()
{
    iterator it = begin();
    while (it != end())
    {
        it = erase(it);
    }
}
```

## 额外补充

打印函数

当链表中的类型为`int`时，打印函数中的list模板参数直接设置为`int`即可，例如下面的代码：

```C++
//额外补充的函数——标准库中没有
//打印函数
void print_list(const list<int>& ls)
{
    sim_list::list<int>::const_iterator cit = ls.begin();
    while (cit != ls.end())
    {
        cout << *cit << " ";
        cit++;
    }
}
```

但是，上面的代码在模板参数处写定为`int`，如果更换类型，此时就需要在打印函数处同时更改类型。

假设现在的链表为如下：

```C++
sim_list::list<string> ls;
ls.push_back("111111");
ls.push_back("111111");
ls.push_back("111111");
ls.push_back("111111");
```

此时必需更改打印函数中的类型为`string`类型，但是每一次更换类型就要改变函数步骤相对繁琐，如果一个函数中涉及到多个类型的list，此时就无法实现调用打印函数打印链表内容，此时可以考虑使用模板，将list的模板参数设置为模板参数，如下面的代码：

```C++
//额外补充的函数——标准库中没有
//打印函数
template<class T>
void print_list(const list<T>& ls)
{
    sim_list::list<T>::const_iterator cit = ls.begin();
    while (cit != ls.end())
    {
        cout << *cit << " ";
        cit++;
    }
}
```

但是上面的代码没有通过编译，原因在于模板参数，当模板参数在函数模板或者类模板中，编译器开始编译时，可以实现替换，从而生成对应的函数或者类。但是在上面的代码中，`const_iterator`是一个被`typedef`的变量，但是编译器并不知道是重命名的变量，反之编译器可能会认为是静态变量，所以此时到底是`const_iterator`是静态变量还是重命名的变量编译器并不知道，编译器需要在类`sim_list`中确定`const_iterator`的类型，从而实现链接，最后再替换模板参数，因为在模板参数还未被替换时，编译器不能进类`sim_list`中寻找，因为此时类中可能存在未知的内容没有被处理，所以为了确保正常编译通过，此时不可以使用`class T`作为模板参数，而应该使用`typename T`，所以上面的代码修改为：

```C++
//额外补充的函数——标准库中没有
//打印函数
template<typename T>
void print_list(const list<T>& ls)
{
    //此处的typename不可以省略，此处的typename是为了告诉编译器这个需要等到模板参数被替换之后再去类中找的变量
    typename sim_list::list<T>::const_iterator cit = ls.begin();
    while (cit != ls.end())
    {
        cout << *cit << " ";
        cit++;
    }
}
```

另外还有一个问题，上面的打印代码仅仅实现的是list类的内容打印，但是如果此时需要为其他类打印，则需要另外再写一个打印，方式过于繁琐，所以可以考虑为各种类的内容打印写一个通用的函数，此时设计该函数时需要改变函数参数为各种容器，可以考虑使用函数模板，模板参数即为作为函数参数的容器，如下面的代码：

```C++
//各种容器内容打印
template<typename container>
void print_container(const container& con)
{
    typename container::const_iterator it = con.begin();
    while (it != con.end())
    {
        cout << *it << " ";
        it++;
    }
    cout << endl;
}
```