<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# initializer_list类

## 介绍

initializer_list类是C++11新增的类，其原型如下：

```c++
template<class T> class initializer_list;
```

有了initializer_list，一些容器也可以实现列表初始化，例如vector中的构造函数：

```c++
vector (initializer_list<value_type> il,
       const allocator_type& alloc = allocator_type());
```

基本使用如下：

```c++
#include <iostream>
#include <vector>

int main()
{
    std::vector<int> v{1,2,3,4,5};
    std::for_each(v.begin(), v.end(), [](int num) -> void {std::cout << num << " ";});
    return 0;
}

输出结果：
1 2 3 4 5
```

## 基本使用

在标准库中，initializer_list可以使用下面的构造函数创建一个空initializer_list对象：

```c++
initializer_list() noexcept;
```

但是，根据官方文档的描述，尽管缺乏有参构造函数，initializer_list类依旧可以创建非空对象，只需要使用花括号列表初始化即可，例如下面的代码：

```c++
std::initializer_list<int> il{1,2,3,4};
```

## 常见函数

initializer_list类有三种常用的函数：

1. `size()`：获取initializer_list对象中的元素个数
2. `begin()`：获取initializer_list对象中第一个元素位置的迭代器
3. `end()`：获取initializer_list对象中最后一个元素下一个位置的迭代器

基本使用如下：

```c++
#include <iostream>
#include <vector>

int main()
{
    std::initializer_list<int> il{1,2,3,4};
    std::cout << il.size() << std::endl;
    std::for_each(il.begin(), il.end(), [](int num) -> void {std::cout << num << " ";});
    return 0;
}

输出结果：
4
1 2 3 4
```