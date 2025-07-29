# stack类

## stack类介绍

1. stack是一种容器适配器，专门用在具有后进先出操作的上下文环境中，其删除只能从容器的一端进行元素的插入与提取操作。
2. stack是作为容器适配器被实现的，容器适配器即是对特定类封装作为其底层的容器，并提供一组特定的成员函数来访问其元素，将特定类作为其底层的，元素特定容器的尾部(即栈顶)被压入和弹出。
3. stack的底层容器可以是任何标准的容器类模板或者一些其他特定的容器类
4. 标准容器vector、deque、list均符合这些需求，默认情况下，如果没有为stack指定特定的底层容器，默认情况下使用deque。

## stack类定义

```c++
template <class T, class Container = deque<T> > class stack;
```

stack类为类模板，所以在使用时需要带上类型表示一个具体的类，例如数据类型为`int`类型的stack使用时需要写为`stack<int>`

## stack类常见构造函数

| 构造函数     | 函数原型                                                     |
| ------------ | ------------------------------------------------------------ |
| 无参构造函数 | `explicit stack (const container_type& ctnr = container_type());` |

!!! note
    上面表格中的构造函数均含有自定义空间配置器并带有缺省值，使用默认即可

!!! note
    使用stack类需要包含头文件`<stack>`

示例代码：

```C++
#include <iostream>
#include <stack>
using namespace std;

int main()
{
    stack<int> st;
    st.push(1);
    st.push(2);
    st.push(3);
    st.push(4);
    st.push(5);

    //打印栈
    while (!st.empty())
    {
        cout << st.top() << " ";
        st.pop();
    }
    cout << endl;

    return 0;
}
输出结果：
5 4 3 2 1
```

## stack数据操作

| 函数      | 功能                           |
| --------- | ------------------------------ |
| `empty()` | 判断调用对象栈是否为空栈       |
| `size()`  | 获取调用对象栈中的有效数据个数 |
| `top()`   | 获取调用对象栈中的栈顶元素     |
| `push()`  | 向调用对象栈顶插入元素         |
| `pop()`   | 弹出调用对象栈顶元素           |
| `swap()`  | 交换调用对象栈和指定栈         |

### `empty()`函数

使用`empty()`函数可以判断调用对象栈是否为空栈

| 函数      | 函数原型              |
| --------- | --------------------- |
| `empty()` | `bool empty() const;` |

示例代码：

```C++
#include <iostream>
#include <stack>
using namespace std;

int main()
{
    stack<int> st;
    stack<int> st1;
    st.push(1);
    st.push(2);
    st.push(3);
    st.push(4);
    st.push(5);

    cout << "st: " << st.empty() << endl;
    cout << "st1: " << st1.empty() << endl;
    return 0;
}
输出结果：
st: 0
st1: 1
```

### `size()`函数

使用`size()`函数可以获取调用对象栈中的有效数据个数

| 函数     | 函数原型                  |
| -------- | ------------------------- |
| `size()` | `size_type size() const;` |

示例代码：

```C++
#include <iostream>
#include <stack>
using namespace std;

int main()
{
    stack<int> st;
    stack<int> st1;
    st.push(1);
    st.push(2);
    st.push(3);
    st.push(4);
    st.push(5);

    cout << "st: " << st.size() << endl;
    cout << "st1: " << st1.size() << endl;
    return 0;
}
输出结果：
st: 5
st1: 0
```

### `top()`函数

使用`top()`函数可以获取调用对象栈中的栈顶元素

|             函数原型             |
| -------------------------------- |
| `value_type& top();`             |
| `const value_type& top() const;` |

!!! note
    注意，如果栈为空时取栈内元素将会出现断言错误

示例代码：

```C++
#include <iostream>
#include <stack>
using namespace std;

int main()
{
    stack<int> st;
    stack<int> st1;
    st.push(1);
    st.push(2);
    st.push(3);
    st.push(4);
    st.push(5);

    cout << "st: " << st.top() << endl;
    // 断言错误
    //cout << "st1: " << st1.top() << endl;
    return 0;
}
输出结果：
5
```

### `push()`函数

使用`push()`函数可以向调用对象栈内插入数据

| 函数     | 函数原型                             |
| -------- | ------------------------------------ |
| `push()` | `void push (const value_type& val);` |

示例代码：

```C++
#include <iostream>
#include <stack>
using namespace std;

int main()
{
    stack<int> st;
    st.push(1);
    st.push(2);
    st.push(3);
    st.push(4);
    st.push(5);

    //打印栈
    while (!st.empty())
    {
        cout << st.top() << " ";
        st.pop();
    }
    cout << endl;

    return 0;
}
输出结果：
5 4 3 2 1
```

### `pop()`函数

使用`pop()`函数可以弹出调用对象栈的栈顶元素

| 函数    | 函数原型      |
| ------- | ------------- |
| `pop()` | `void pop();` |

!!! note
    注意，当栈中没有元素时，调用`pop()`函数会出现断言错误

```C++
#include <iostream>
#include <stack>
using namespace std;

int main()
{
    stack<int> st;
    stack<int> st1;
    st.push(1);
    st.push(2);
    st.push(3);
    cout << st.top() << " ";
    st.pop();
    st.push(4);
    st.push(5);
    //打印栈
    while (!st.empty())
    {
        cout << st.top() << " ";
        st.pop();
    }
    cout << endl;

    // 断言错误
    //cout << "st1: " << st1.top() << endl;
    return 0;
}
输出结果：
3 5 4 2 1
```

### `swap()`函数

使用`swap()`函数可以交换调用对象栈和指定对象栈

| 函数     | 函数原型                |
| -------- | ----------------------- |
| `swap()` | `void swap (stack& x);` |

示例代码：

```C++
#include <iostream>
#include <stack>
using namespace std;

int main()
{
    stack<int> st;
    stack<int> st1;

    st.push(1);
    st.push(1);
    st.push(1);
    st.push(1);
    st.push(1);

    st1.push(2);
    st1.push(2);
    st1.push(2);
    st1.push(2);
    st1.push(2);

    cout << "交换前：" << endl;
    //打印栈
    while (!st.empty())
    {
        cout << st.top() << " ";
        st.pop();
    }
    cout << endl;

    //打印栈
    while (!st1.empty())
    {
        cout << st1.top() << " ";
        st1.pop();
    }
    cout << endl;

    // 注意打印已经使栈为空，需要重新插入元素
    st.push(1);
    st.push(1);
    st.push(1);
    st.push(1);
    st.push(1);

    st1.push(2);
    st1.push(2);
    st1.push(2);
    st1.push(2);
    st1.push(2);

    st.swap(st1);

    cout << "交换后：" << endl;

    //打印栈
    while (!st.empty())
    {
        cout << st.top() << " ";
        st.pop();
    }
    cout << endl;

    //打印栈
    while (!st1.empty())
    {
        cout << st1.top() << " ";
        st1.pop();
    }
    cout << endl;

    return 0;
}
交换前：
1 1 1 1 1
2 2 2 2 2
交换后：
2 2 2 2 2
1 1 1 1 1
```