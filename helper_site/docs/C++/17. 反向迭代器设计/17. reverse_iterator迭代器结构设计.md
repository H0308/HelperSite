# `reverse_iterator`迭代器结构设计

前面的list类以及vector类设计了正向迭代器，现在考虑设计反向迭代器，常规的设计思路为单独为反向迭代器建一个新类，这个类中所有的函数全部重新设计，这种思路可取但是并不高效，可以考虑下面的设计思路：

前面了解到了容器适配器，那么是否也可以把正向迭代器设置为反向迭代器的容器适配器从而实现反向迭代器的效果

对于此时的反向迭代器类设计即为如下：

以list类为例

### `reverse_iterator`迭代器基本结构设计

```c++
//反向迭代器
 template<classIterator>
 class_list_reverse_iterator
 {
     typedef_list_reverse_iterator self;
     //使用正向迭代器构造反向迭代器
     _list_reverse_iterator(Iterator it)
         :_it(it)
     {}
 
 private:
     Iterator_it;
 };
```

### `operator*()`函数

首先是对于`operator*()`函数来说，解引用操作符获得的结果即为指针当前指向中的内容，而在正向迭代器中，解引用操作符也是同样的作用，所以此处可以复用正向迭代器的解引用操作符，但是此处是`Iterator`类对象，所以不能使用传统的直接对内置类型解引用的方式，但是可以考虑直接调用`Iterator`类中的`operator*()`函数

对于返回值来说，可以考虑和设计`const`版本的正向迭代器思路一致，使用模板参数区分传递`T&`和`T*`

所以修改原来的类定义为：

```c++
//反向迭代器
 template<class Iterator, class Ref, class Ptr>
 class _list_reverse_iterator
 {
     typedef _list_reverse_iterator self;
     //使用正向迭代器构造反向迭代器
     _list_reverse_iterator(Iterator it)
         :_it(it)
     {}
 
 private:
     Iterator _it;
 };
```

此时的`operator*()`函数即为如下设计：

```c++
//operator*()函数
 Ref operator*()
 {
     return _it.operator*();
 }
```

### operator++()函数

对于前置`++`运算符来说，不同于正向迭代器，因为正向迭代器`++`是从第一个有效数据节点开始一直到头节点结束，而对于反向迭代器来说，其`++`是从最后一个有效数据节点开始向前一直到头节点结束，如下图所示：

<img src="images\Snipaste_2024-05-04_19-54-50.png">

但是可以考虑通过正向迭代器适配出反向迭代器，具体思路如下：

将`begin()`放置在最后一个有效数据节点的位置，即`end()-1`的位置，将`end()`放在头节点的位置即可

所以，`operator++()`函数可以设计为

```c++
//operator++()函数
self& operator++()
{
    --_it;
    return *this;
}
```

### `operator->()`函数

同`operator*()`函数一样，调用`Iterator`中的`operator->()`函数即可

```c++
//operator->()函数
 Ptr operator->()
 {
     return _it.operator->();
 }
```

### `operator!=()`函数

同正向迭代器中的设计思路一致

```c++
//operator!=()函数
bool operator!=(self& s)
{
    return _it != s._it;
}
```

### `rbegin()`函数

```c++
//rbegin()函数——反向——非const版本
reverse_iterator rbegin()
{
    //因为正向迭代器中没有重载-，所以使用--代替
    return reverse_iterator(--end());
}
```

### `rend()`函数

```c++
//rend()函数——反向——非const版本
reverse_iterator rend()
{
    return reverse_iterator(end());
}
```

### `operator--()`函数

```c++
//operator--()函数
self& operator--()
{
    ++_it;
    return *this;
}
```

### `operator==()`函数

```c++
//operator==()函数
bool operator==(const self& s)
{
    return _it == s._it;
}
```

### 测试代码

此时基本的反向迭代器框架已经搭建完成，下面是测试代码：

```c++
void test_reverse_iterator()
{
    sim_list::list<int> ls;
    ls.push_back(1);
    ls.push_back(2);
    ls.push_back(3);
    ls.push_back(4);
    ls.push_back(5);

    sim_list::list<int>::reverse_iterator rit = ls.rbegin();
    while (rit != ls.rend())
    {
        cout << *rit << " ";
        ++rit;
    }
}
```

## `const_reverse_iterator`迭代器设计

对于`const_reverse_iterator`设计来说，不需要更改`reverse_iterator`迭代器的结构，只需要在list类中重定义一个`const`版本即可

```c++
typedef _list_reverse_iterator<iterator, T&, T*> reverse_iterator;// 反向迭代器——非const版本
typedef _list_reverse_iterator<iterator, const T&, const T*> const_reverse_iterator // 反向迭代器——const版本
```

并且将`rbegin()`和`rend()`分别重载一个`const`版本

```c++
//rbegin()函数——反向——const版本
reverse_iterator rbegin() const
{
    //因为正向迭代器中没有重载-，所以使用--代替
    //注意end()此处是常量，但是此处是调用了operator--()，所以可以调用(编译器对const类型能调用普通函数的优化)，如果是内置指针类型则必须写成end()-1
    return reverse_iterator(--end());
}

//rend()函数——反向——const版本
reverse_iterator rend() const
{
    return reverse_iterator(end());
}
```

## `reverse_iterator`迭代器结构设计思路改进

前面在设计`reverse_iterator`迭代器时，直接考虑的`rbegin()`函数的位置在最后一个有效节点的位置，而`rend()`在则在`end()`的位置，这样的思路并没有错误，但是参照SGI版本中的设计：

`rbegin()`和`rend()`设计

<img src="images\image.png">

可以看出，SGI版本在设计`rbegin()`和`rend()`时考虑到和`begin()`与`end()`形成了一种对称关系，如下图所示：

<img src="images\image1.png">

那么此时SGI版本中的反向迭代器是如何处理`operator*()`函数的

<img src="images\image2.png">

<img src="images\image3.png">

配合`rbegin()`和`rend()`遍历思路如下：

取出上一个有效节点的数据，因为`rbegin()`在头节点的位置，所以先取出最后一个节点的数据，迭代器--操作到最后一个有效节点，一直到`rend()`位置结束

参考完SGI版本的迭代器设计，此时可以对上面的设计进行优化为SGI版本

```c++
//operator*()函数
Ref operator*()
{
    Iterator cur = _it;
    //如果不实现--，也可以用-1来代替
    return *(--cur);
}

//rbegin()函数——反向——非const版本
reverse_iterator rbegin()
{
    //因为正向迭代器中没有重载-，所以使用--代替
    return reverse_iterator(end());
}

//rend()函数——反向——非const版本
reverse_iterator rend()
{
    return reverse_iterator(begin());
}

//rbegin()函数——反向——const版本
reverse_iterator rbegin() const
{
    //因为正向迭代器中没有重载-，所以使用--代替
    return reverse_iterator(end());
}

//rend()函数——反向——const版本
reverse_iterator rend() const
{
    return reverse_iterator(begin());
}
```

此时对于`operator->()`函数来说，则需要换一个实现思路：直接取当前`operator*()`结果的地址

```c++
//operator->()函数
Ptr operator->()
{
    return &(operator*());
}
```