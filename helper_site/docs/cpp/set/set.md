# set类

## set类介绍与简单使用

set类是一种关联式容器，在数据检索时比序列式容器效率更高。本质是一个常规的二叉搜索树，但是为了防止出现单支树导致效率下降进行了相关优化

set类也满足二叉搜索树的特点：

1. 元素不重复：**因此可以用来去重**
2. 默认中序遍历是升序
3. 比较的平均次数为$log_{2}{N}$
4. set中的元素不可以修改
5. set中的底层使用二叉搜索树(红黑树)来实现
6. 默认按照`key`升序排序

### set类

!!! note
	使用set类需要包含头文件`<set>`

[set官方文档](https://legacy.cplusplus.com/reference/set/set/)

简单使用实例：

```c++
#define _CRT_SECURE_NO_WARNINGS 1

#include <iostream>
#include <set>
using namespace std;

int main()
{
	set<int> s;
	// 使用数组构造set，去重+排序
	int array[] = { 1, 3, 5, 7, 9, 2, 4, 6, 8, 0, 1, 3, 5, 7, 9, 2, 4, 6, 8, 0 };
	for (auto e : array)
	{
		// 插入数据
		s.insert(e);
	}

	// 使用正向迭代器遍历set
	set<int>::iterator it = s.begin();
	while (it != s.end())
	{
		cout << *it << " ";
		++it;
	}
	cout << endl;
	// 使用反向迭代器遍历set
	set<int>::reverse_iterator rit = s.rbegin();
	while (rit != s.rend())
	{
		cout << *rit << " ";
		++rit;
	}

	cout << endl;

	// 计数
	// set会去重，所以每一种数字只会出现1次
	cout << s.count(3) << endl;

	// 查找+删除
	s.erase(s.find(3));
	// 范围for遍历
	for (auto e : s)
	{
		cout << e << " ";
	}
	return 0;
}
```

!!! note
	需要注意使用`s.erase(s.find(3));`时，一定要确保`find()`函数中的参数一定要存在，因为`find()`函数中的参数不存在返回end迭代器的位置，所以`erase`会断言报错，如果直接传入删除的值`s.erase(3)`，则不论是否存在都不会报错

对于`count()`函数来说，也可以用来判断内容是否在set中，因为当内容在set中，`count()`函数返回1，否则返回0

需要注意的两个函数`lower_bound()`和`upper_bound()`，这两个函数放在一起的作用是获取到当前中序遍历的[lower_bound, upper_bound]区间

```c++
#define _CRT_SECURE_NO_WARNINGS 1

#include <iostream>
#include <set>
using namespace std;

int main()
{
	set<int> s;
	// 使用数组构造set，去重+排序
	int array[] = { 1, 3, 5, 7, 9, 2, 4, 6, 8, 0, 1, 3, 5, 7, 9, 2, 4, 6, 8, 0 };
	for (auto e : array)
	{
		// 插入数据
		s.insert(e);
	}
	
    // lower_bound与upper_bound
	set<int>::iterator it = s.lower_bound(3);
	while (it != s.upper_bound(8))
	{
		cout << *it << " ";
		++it;
	}
	return 0;
}
输出结果：
3 4 5 6 7 8
```

首先解释`lower_bound(3)`的意思，在这个函数中，`lower_bound()`会取到**第一个**大于或者等于3的数值，返回其位置的迭代器，所以`lower_bound(3)`返回的是3所在位置的迭代器，接着`upper_bound(8)`，对于`upper_bound(8)`会返回**除8以外的**比8大的数值位置的迭代器，也就是**第一个**大于8的数值位置的迭代器，所以上面的程序结果最后会输出8是因为取出了[3, 8]中的所有位于set容器中的值

### multiset类

multiset类与set类不同的是，**multiset类允许数据出现重复**

[multiset类官方文档](https://legacy.cplusplus.com/reference/set/multiset/)

简单使用实例：

```c++
#define _CRT_SECURE_NO_WARNINGS 1

#include <iostream>
#include <set>
using namespace std;

int main()
{
	// 使用数组构造multiset，排序
	int array1[] = { 1, 3, 5, 7, 9, 2, 4, 6, 8, 0, 1, 3, 5, 7, 9, 2, 4, 6, 8, 0 };
	multiset<int> ms;
	for (auto num : array1)
	{
		ms.insert(num);
	}

	// 范围for遍历
	for (auto num : ms)
	{
		cout << num << " ";
	}
	cout << endl;

	// 统计3的次数
	cout << ms.count(3) << endl;

	// lower_bound和upper_bound
    // 在multiset中会打印[第一个4, 最后一个4]中的所有4
	multiset<int>::iterator it = ms.lower_bound(4); 
	while (it != ms.upper_bound(4))
	{
		cout << *it << " ";
		++it;
	}
	return 0;
}
```

需要注意`erase()`函数在multiset中的两个用法有些许不同：

```c++
#define _CRT_SECURE_NO_WARNINGS 1

#include <iostream>
#include <set>
using namespace std;

int main()
{
	int array2[] = { 1, 3, 5, 3, 3, 2, 4, 6, 8, 0, 1, 3, 3, 7, 9, 2, 4, 6, 3, 0 };
	multiset<int> ms1;
	for (auto num : array2)
	{
		ms1.insert(num);
	}

	for (auto num : ms1)
	{
		cout << num << " ";
	}
	cout << endl;
	// 使用find查找后删除
	ms1.erase(ms1.find(3));
	for (auto num : ms1)
	{
		cout << num << " ";
	}
	cout << endl;
	// 直接删除
	ms1.erase(3);
	for (auto num : ms1)
	{
		cout << num << " ";
	}

	return 0;
}

输出结果：
0 0 1 1 2 2 3 3 3 3 3 3 4 4 5 6 6 7 8 9
0 0 1 1 2 2 3 3 3 3 3 4 4 5 6 6 7 8 9
0 0 1 1 2 2 4 4 5 6 6 7 8 9
```

如果`multiset`中指定数值有重复，`multiset`类中`find()`函数会找到**中序遍历的第一个值**为指定值（不存在则返回其他与指定值相同的节点）的位置，返回该位置的迭代器，所以时调用`erase()`函数，将`find()`返回的迭代器传给`erase()`函数，**删除的就是中序遍历的第一个值**，而如果直接调用`erase()`函数，传入指定值，则**一次性全部删除**

### 题目练习

#### 环形链表Ⅱ

具体见[算法：链表部分](https://www.help-doc.top/data-structure/linked-list/linked-list.html#142ii)

#### 两个数组的交集

具体见[算法：哈希表部分](https://www.help-doc.top/algorithm/hash-table/hash-table-basic/hash-table-basic.html#349)

