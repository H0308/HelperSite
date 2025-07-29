# unordered_map和unordered_set类模拟实现

## unordered_map和unordered_set类模拟实现介绍

在标准库中，unordered_map和unordered_set底层都是哈希桶实现的哈希表，所以本次模拟实现采用同样的结构进行

## 哈希表结构设计

为了和标准库保持一致，在哈希表底层结构的每一个节点设计时，采用一个模版参数，该模版参数用于接收unordered_set的`Key`和unordered_map的`pair<Key, Value>`

```c++
// 哈希数据节点
template <class T>
struct HashData
{
    HashData(const T& _data)
        :_data(data)
        , _next(nullptr)
    {}

    T _data;
    HashData<T>* _next;
};
```

处理哈希表结构的设计，将第二个模版参数`V`作为`HashData`的数据类型，第一个参数用于比较和删除

```c++
// 哈希表结构
template <class K, class V>
class hashtable
{
    typedef HashData<V> Node;

private:
    vector<Node*> _table;
    size_t _count;
};
```

## unordered_map和unordered_set的基本结构设计

接着封装unordered_map和unordered_set的基本结构

```c++
// unordered_set
template <class K>
class unordered_set
{

private:
    hashtable<K, K> _ht; // 哈希表对象
};

// unordered_map
template <class K, class T>
class unordered_map
{

private:
    hashtable<K, pair<K, T>> _ht; // 哈希表对象
};
```

因为unordered_map中是键值对`pair`，而unordered_set只有值，所以为了使二者只使用一个哈希表结构，此时各自需要一个仿函数准确得取出其中的值计算存储位置

对于unordered_set来说，直接取出其中的值即可

```c++
struct KeyofT
{
    K& operator()(const k& key)
    {
        return key;
    }
};
```

对应unordered_map来说，需要取出`pair`中的`first`值

```c++
struct KeyofT
{
    const K& operator()(const pair<K, T>& kv)
    {
        return kv.first;
    }
};
```

将对应的仿函数传给哈希表结构，便于对应函数访问对应的值

```c++
//  底层结构改变
template <class K, class V, class KeyofT>
class hashtable;

// 创建KeyofT对象将需要转换的部分传递给KeyofT对象
KeyofT kot;
kot(data);// 返回unordered_map中的pair的first或者unordered_set中的Key
```

## 迭代器设计

### 基本结构设计

对于二者的迭代器来说，基本思路一致，所以直接在底层中设计迭代器，下面是具体分析思路：

采用哈希桶的结构设计，所以使用一个节点的指针作为迭代器依次访问每一个节点，但是对于迭代器本身来说并不知道哈希表的结构，所以迭代器结构中除了需要一个节点的指针，还需要一个哈希表对象的指针，用于指向已经创建的哈希表对象

```c++
// 前置声明hashtable
template <class K, class V, class KeyofT>
class hashtable;

template <class K, class V, class KeyofT>
struct Iterator
{
    typedef HashData<V> Node;

    Node* _node;
    hashtable<K, V, KeyofT>* _ht;
};
```

这里需要注意，因为哈希表结构定义在`Iterator`结构的下方，在编译时需要提前告诉编译器存在`hashtable`结构，所以需要前置声明

### `operator++()`设计

移动哈希表节点指针一共分为两种情况：

1. 在哈希桶中

    <img src="24. unordered_map和unordered_set类模拟实现.assets\image.png">

2. 准备移动到下一个哈希桶

    <img src="24. unordered_map和unordered_set类模拟实现.assets\image.png">

对于第一种情况来说，直接通过节点的`_next`指针向后移动即可

对于第二种情况来说，需要使用到哈希表结构，并且在准备向下一个哈希桶移动之前，`it`所在位置是当前桶的最后一个节点，需要通过哈希函数先计算出当前`it`所在的桶，从当前桶出发向后查找新桶，此处需要注意计算出的下标是当前所在桶的下标，在循环查找之前需要先向后移动到新的位置，如下图所示：

<img src="24. unordered_map和unordered_set类模拟实现.assets\image2.png">

移动后进入循环开始查找新桶，当找到第一个非空的桶时，跳出循环，否则继续查找

需要注意，例如在本图中，当`it`在9所在的桶位置时，因为会先计算下一个空的位置，而此时已经到达最后一个桶的位置，所以当`it`的新位置超出了桶的范围，直接返回空，否则返回新桶的位置防止出现空指针解引用问题

!!! note
    因为在`operator++()`中需要获取当前表的`size`，但是`size`不是公有属性，而是私有成员`_table`的，为了解决这个问题，可以在哈希表结构中使用友元声明`Iterator`结构

```c++
// 友元声明
template <class K, class V, class KeyofT>
class hashtable
{
    typedef HashData<V> Node;
public:
    // 友元迭代器，访问_table
    template <class K, class V, class KeyofT>
    friend struct Iterator;
    
    // ...
}；

// operator++()
Iterator operator++()
{
    if (_node->_next != nullptr)
    {
        // 如果node处于一个桶中，直接向后移动即可
        _node = _node->_next;
    }
    else
    {
        KeyofT kot;
        // 从node的位置开始
        size_t hashi = kot(_node->_data) % _ht->_table.size();
        hashi++;
        // 找到一个桶的结尾时，需要找到下一个桶
        while(hashi < _ht->_table.size())
        {
            // 找到第一个非空时就退出
            if (_ht->_table[hashi] != nullptr)
            {
                break;
            }
            hashi++;
        }

        if (hashi == _ht->_table.size())
        {
            // 如果走到结尾，则代表已经遍历结束，返回End()
            _node = nullptr;
        }
        else
        {
            // 没有走到结尾返回新位置
            _node = _ht->_table[hashi];
        }

    }

    return *this;
}
```

### `operator!=()`设计

直接比较节点的地址即可，地址不相等则代表不是同一个节点

```c++
// operator!=()
bool operator!=(const Iterator& it)
{
    return _node != it._node;
}
```

### `operator*()`设计

返回当前节点的地址即可

```c++
// operator->()
V* operator->()
{
    return &_node->_data;
}
```

### `operator->()`设计

返回当前节点的内容的引用（减少临时变量拷贝的消耗）即可

```c++
// operator*()
V& operator*()
{
    return _node->_data;
}
```

### `Begin()`设计

在哈希表结构中声明`Iterator`

```c++
typedef Iterator<K, V, KeyofT> Iterator;
```

找到并返回第一个非空的桶的第一个节点即可

!!! note
    需要注意返回时需要返回当前哈希表结构和第一个节点共同构造的迭代器，而在`Begin()`函数中，哈希表结构即为`this`

```c++
// Begin()
Iterator Begin()
{
    // 如果没有节点插入，则直接返回空
    if (_count == 0)
    {
        return Iterator(nullptr, this);
    }
    Node* node = nullptr;
    // 返回第一个非空节点
    for (size_t i = 0; i < _table.size(); i++)
    {
        node = _table[i];
        if (node != nullptr)
        {
            break;
        }
    }

    return Iterator(node, this);
}
```

### `End()`设计

返回空指针和当前表结构指针构造的迭代器即可

```c++
// End()
Iterator End()
{
    return Iterator(nullptr, this);
}
```

### unordered_map和unordered_set迭代器设计

声明哈希表结构中的`Iterator`为`iterator`

!!! note
    类中的模版类型需要加`typename`

```c++
// unordered_set
typedef typename hashtable<K, K, KeyofT>::Iterator iterator;

// unordered_map
typedef typename hashtable<K, pair<K, T>, KeyofT>::Iterator iterator;
```

设计`begin()`和`end()`

```c++
// unordered_map和unordered_set

// begin()
iterator begin()
{
    return _ht.Begin();
}

// end()
iterator end()
{
    return _ht.End();
}
```

## `insert()`函数设计

调用哈希表结构的`Insert()`函数即可

```c++
// unordered_map
// 数据插入
bool insert(const pair<K, T>& kv)
{
    return _ht.Insert(kv);// 调用底层的insert函数
}

// unordered_set
// 数据插入
bool insert(const K& key)
{
    return _ht.Insert(key);// 调用底层的insert函数
}
```

## `erase()`函数设计

调用哈希表结构的`Erase()`函数即可

```c++
// 数据删除
bool erase(const K& key)
{
    return _ht.Erase(key);
}
```

## `find()`函数设计

```c++
// 数据查找
bool find(const K& key)
{
    return _ht.Find(key);
}
```

## 添加`KeyToInt`的`hash`仿函数

添加方式同哈希表

```c++
// unordered_set
template <class K, class hash = Toint<K>>
class unordered_set
{
    // ...
private:
    hashtable<K, K, KeyofT, hash> _ht; // 哈希表对象
}

// unordered_map
template <class K, class T, class hash = Toint<K>>
class unordered_map
{
    // ...
private:
    hashtable<K, pair<K, T>, KeyofT, hash> _ht; // 哈希表对象
};

// 哈希表结构
template <class K, class V, class KeyofT, class hash>
class hashtable
{
    // ...
}
```

对需要调用的位置执行下面的代码

```c++
hash h; // 创建对象
h(Key); // 返回转换后的结果
```

## `const`迭代器

对于unordered_map和unordered_set来说，不允许修改已经插入的元素的`Key`，所以此处先对原有的迭代器以及结构进行调整

```c++
// unordered_set中的成员
hashtable<K, pair<const K, T>, KeyofT, hash> _ht; // 哈希表对象

// unordered_map中的成员
hashtable<K, pair<const K, T>, KeyofT, hash> _ht; // 哈希表对象
```

接下来设计`const`版本的迭代器

在迭代器结构中添加`Ptr`和`Ref`代表插入对象的指针和引用

```c++
template <class K, class V, class Ptr, class Ref, class KeyofT, class hash>
struct Iterator;
```

修改`operator->()`与`operator*()`

```c++
// operator->()
Ptr operator->()
{
    return &_node->_data;
}

// operator*()
Ref operator*()
{
    return _node->_data;
}
```

哈希表结构中的普通迭代器和`const`迭代器声明

```c++
typedef Iterator<K, V, const V*, const V&, KeyofT, hash> constIterator;
typedef Iterator<K, V, V*, V&, KeyofT, hash> Iterator;
```

!!! note
    上面的代码不要颠倒位置，如果交换过后则`constIterator`识别到的`Iterator<K, V, const V*, const V&, KeyofT, hash>`是上面`typedef`的`Iterator`

```c++
const`迭代器的`Begin()`以及`End()
// Begin()
constIterator Begin() const
{
    // 如果没有节点插入，则直接返回空
    if (_count == 0)
    {
        return constIterator(nullptr, this);
    }
    Node* node = nullptr;
    // 返回第一个非空节点
    for (size_t i = 0; i < _table.size(); i++)
    {
        node = _table[i];
        if (node != nullptr)
        {
            break;
        }
    }

    return constIterator(node, this);
}

// End()
constIterator End() const
{
    return constIterator(nullptr, this);
}
```

需要注意此时如果直接传递会报错，因为`const`版本的`Begin()`和`End()`函数是`const`函数，此时的`this`是`const`版本的`this`，所以在构造迭代器的构造函数中需要将形式参数的哈希表结构指针声明为`const`，并且将同类型的成员声明为`const`

```c++
// 哈希表结构指针
const hashtable<K, V, KeyofT, hash>* _ht;

// 迭代器构造函数
Iterator(Node* node, const hashtable<K, V, KeyofT, hash>* ht)
    :_node(node)
    ,_ht(ht)
{}
```

在unordered_map和unordered_set中创建`const`版本的`begin()`和`end()`

```c++
// unordered_map中const迭代器声明
typedef typename hashtable<K, pair<const K, T>, KeyofT, hash>::constIterator const_iterator;
// unordered_set中const迭代器声明
typedef typename hashtable<K, const K, KeyofT, hash>::constIterator const_iterator;

// unordered_map和unordered_set
// begin()
const_iterator begin() const
{
    return _ht.Begin();
}

// End()
const_iterator end() const
{
    return _ht.End();
}
```

## unordered_map中的`operator[]`函数

首先对原有的哈希表`Insert()`函数进行改造，使其返回`pair<Iterator, bool>`，第一个参数为原有节点或者新增节点的迭代器，第二个参数为是否是新插入节点的标记

```c++
// 数据插入
pair<Iterator, bool> Insert(const V& data)
{
    // ...
    KeyofT kot;
    // 存在时不插入
    Node* node = Find((kot(data)));
    if (node)
    {
        return make_pair(Iterator(node, this), false);
    }
    // ...

    Node* newNode = new Node(data);
    // ...

    return make_pair(Iterator(newNode, this), true);
}
```

修改unordered_map和unordered_set中的`insert()`函数的返回值

```c++
// unordered_map
// 数据插入
pair<iterator, bool> insert(const pair<K, T>& kv)
{
    return _ht.Insert(kv);// 调用底层的insert函数
}

// unordered_set
// 数据插入
pair<iterator, bool> insert(const K& key)
{
    return _ht.Insert(key);// 调用底层的insert函数
}
```

设计unordered_map中的`operator[]`函数

```c++
T& operator[](const K& key)
{
    pair<iterator, bool> ret = insert({ key, T() });
    return ret.first->second;
}
```