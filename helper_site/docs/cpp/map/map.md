# map类

## map类介绍与简单使用

与set类不同的是，map类是KV模型的平衡二叉树（红黑树），因为是Key_Value模型，所以map类总是以key进行排序，map也是用来存储数据的，与序列式容器（forward_list）不同的是，其里面存储的是<key, value>结构的**键值对**（`pair`）

!!! note
    用来表示具有一一对应关系的一种结构，该结构中一般只包含两个成员变量`key`和`value`，`key`代表键值，`value`表示与`key`对应的信息。下面是SGI版本的键值对定义：

    ```c++
    template <class T1, class T2>
    struct pair {
       typedef T1 first_type;
       typedef T2 second_type;

       T1 first;
       T2 second;
       pair() : first(T1()), second(T2()) {}
       pair(const T1& a, const T2& b) : first(a), second(b) {}

       template <class U1, class U2>
       pair(const pair<U1, U2>& p) : first(p.first), second(p.second) {}
    };
    ```

map类的特点：

1. 因为底层还是类似于二叉搜索树，但是进行了优化，所以效率为$log_{2}{N}$
2. map类中的`key`值无法被修改，一旦插入了就没有再次修改的机会
3. map类支持下标访问
4. map类按照`key`升序排序

### map类

[map官方文档](https://legacy.cplusplus.com/reference/map/map/?kw=map)

简单使用实例：

map类没有直接添加key_value键值对的构造函数，所以需要使用其他方式进行内容添加

首先介绍map类中的`insert()`函数，与set类的`insert()`不同的是，map类需要使用pair对象作为参数传递给`insert()`函数，下面是`insert()`函数原型之一

```c++
pair<iterator,bool> insert (const value_type& val);

// 其中value_type为pair<const key_type, mapped_type>
// key_type为第一个模版参数Key
// mapped_type为第二个模版参数T
```

所以在插入数据时，首先需要一个pair对象，前面提供了pair结构的原型，其中有三种构造函数

1. 无参构造：`first`和`second`给类型初始值
2. 有参构造：给定`first`和`second`对应的值进行初始化
3. 拷贝构造：使用已经存在的`pair`对象构造

有了`pair`对象的构造，结合`insert()`函数就可以为map类添加对象，下面提供五种方式：

```c++
#define _CRT_SECURE_NO_WARNINGS 1

#include <iostream>
#include <map>
using namespace std;

int main()
{
	// map的五种构造方式
	
	// 1. 创建pair对象再通过insert()函数插入到map中
	pair<string, string> p1("字符串1", "字符串2");
	map<string, string> m1;
	m1.insert(p1);

	// 2. 匿名对象插入
	map<string, string> m2;
	m2.insert(pair<string, string>("字符串1", "字符串2"));

	// 3. 无explicit修饰下的隐式类型转换
	map<string, string> m3;
	m3.insert({ "字符串1", "字符串2" });

	// 4. make_pair函数
	map<string, string> m4;
	m4.insert(make_pair("字符串1", "字符串2"));

	// 5. initializer_list
	map<string, string> m5 = { {"字符串1", "字符串2"}, {"字符串3", "字符串4"} };

	return 0;
}

```

上面代码中的第三种方式与下面的过程等价

```c++
pair<string, string> p2 = { "字符串1", "字符串2" }; // 隐式类型转换
m3.insert(p2);
```

以二叉搜索树中：统计水果出现的次数为例

```c++
#include <iostream>
#include <map>
using namespace std;

int main()
{

	string arr[] = { "苹果", "西瓜", "苹果", "西瓜", "苹果", "苹果", "西瓜", "苹果", "香蕉", "苹果", "香蕉" };
	map<string, int> m;
	// 插入数据
	for (auto str : arr)
	{
		m.insert({str, 0});
	}

	// 迭代器遍历
	auto it = m.begin();
	while (it != m.end())
	{
		cout << (*it).first << "->" << it->second << endl;
		++it;
	}
	cout << endl;
    
    // 查找+删除
	auto pos = m.find("苹果");
	m.erase(pos);
	auto it1 = m.begin();
	while (it1 != m.end())
	{
		cout << (*it1).first << "->" << it1->second << endl;
		++it1;
	}

	return 0;
}
```

需要注意map中的`operator[]`函数，如果想要实现在二叉搜索树中的计数，可以使用该函数

```c++
#define _CRT_SECURE_NO_WARNINGS 1

#include <iostream>
#include <map>
using namespace std;

int main()
{

	string arr[] = { "苹果", "西瓜", "苹果", "西瓜", "苹果", "苹果", "西瓜", "苹果", "香蕉", "苹果", "香蕉" };
	map<string, int> m;
	for (auto str : arr)
	{
		m[str]++;
	}

	auto it = m.begin();
	while (it != m.end())
	{
		cout << it->first << "->" << it->second << endl;
		++it;
	}

	return 0;
}
```

在map类中，`operator[]`函数的本质是通过[]中的`key`查找`key`对应的`value`值，如果`key`不存在就插入，将`value`设置为对应类型的默认值，如果`key`存在就返回`value`

这个函数的调用可以类比成下面的思路：

```c++
(*((this->insert(make_pair(k,mapped_type()))).first)).second
```

将其拆解为三部分：

1. ```c++
    (this->insert(make_pair(k,mapped_type())))
    ```

    该部分本质是调用了一个`insert()`函数，在map类中`insert()`函数返回`pair<iterator, bool>`，如果插入成功证明插入的键值对一开始不存在，返回插入后位置的迭代器，并将`bool`类型的变量设置为`true`表示插入成功；如果键值对一开始存在，返回存在的键值对位置的迭代器，并将`bool`类型的变量设置为`false`表示插入失败

2. ```c++
    (*(pair<iterator, bool>.first))
    ```

    该部分本质是调用插入节点的迭代器访问该迭代器的`first`值，因为这个键值对中的`iterator`存储的成功插入或者已经存在于map中的键值对位置的迭代器，所以该迭代器指向的是一个实际的节点，即一个实际的键值对节点，解引用该节点就可以取到其中的内容

3. ```c++
    (*iterator).second // iterator表示已经插入的节点或者原有节点位置的迭代器
    ```

    该部分就是取出迭代器指向的节点中的`second`的值

所以，在map类中`operator[]`可以用于下面的行为：

1. 不存在[]中的`key`，插入该`key`
2. 存在[]中的`key`，**返回key对应的`value`**
3. 存在[]中的`key`，**查找/修改key对应的`value`**

### multimap类

与map类基本相同，但是multimap类允许数据出现重复，并且multimap类不支持`operator[]`函数和`at`函数

[multimap官方文档](https://legacy.cplusplus.com/reference/map/multimap/?kw=multimap)

基本使用与map类和multiset类似，不再做演示

### 题目练习

#### 随机链表的复制

本题可以使用map进行优化，具体见[链表算法部分](https://www.help-doc.top/%E7%AE%97%E6%B3%95/2.%20%E9%93%BE%E8%A1%A8%E7%AF%87/2.%20%E9%93%BE%E8%A1%A8%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0/2.%20%E9%93%BE%E8%A1%A8%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0.html#138)

#### 前K个高频元素

见[算法：栈和队列基础练习](https://www.help-doc.top/%E7%AE%97%E6%B3%95/6.%20%E6%A0%88%E5%92%8C%E9%98%9F%E5%88%97%E7%AF%87/2.%20%E6%A0%88%E5%92%8C%E9%98%9F%E5%88%97%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0/2.%20%E6%A0%88%E5%92%8C%E9%98%9F%E5%88%97%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0.html#347k)

#### 前K个高频单词

见[算法：栈和队列基础练习](https://www.help-doc.top/%E7%AE%97%E6%B3%95/6.%20%E6%A0%88%E5%92%8C%E9%98%9F%E5%88%97%E7%AF%87/2.%20%E6%A0%88%E5%92%8C%E9%98%9F%E5%88%97%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0/2.%20%E6%A0%88%E5%92%8C%E9%98%9F%E5%88%97%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0.html#692k)