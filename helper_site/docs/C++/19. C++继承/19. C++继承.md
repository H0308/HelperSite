# C++继承

## C++继承行为

在C++中，当多个类有共同的成员时，可以考虑使用继承将共同的成员放在单独的类中，剩下的类通过继承获得共用类的成员，这里的共用类通常称为父类，也称为基类，继承父类的类称为子类，也成为派生类

在C++中，可以使用下面的语法格式对类进行继承

```c++
class 子类名 : 继承权限 父类名
```

例如，子类学生和老师继承父类人

```c++
#define _CRT_SECURE_NO_WARNINGS 1

#include <iostream>
using namespace std;

// 父类
class person
{
public:
	void print()
	{
		cout << _age << endl;
		cout << _name << endl;
	}

protected:
	int _age = 20;
	string _name = "姓名";
};

// 子类
class student : public person
{
private:
	int _stu_id;
};

class teacher : public person
{
private:
	int _tea_id;
};

int main()
{
	// 创建子类对象
	student s;
	teacher t;

	// 子类对象可以调用父类方法
	s.print();
	t.print();
	return 0;
}

输出结果：
20
姓名
20
姓名  
```

在上面的代码中，尽管子类`student`和`teacher`没有`print()`方法，但是因为继承了`person`类，`person`类中有`print()`方法，所以可以直接调用

并且子类也拥有父类的成员变量`_age`和`_name`

<img src="19. C++继承.assets\image-20240626093418441.png"/>

当子类不对父类的成员变量进行修改时，子类直接打印父类成员变量的缺省值，而当子类改变父类的成员变量时，则显示改变后的内容，但是不影响`teacher`和`person`两个类

```c++
#define _CRT_SECURE_NO_WARNINGS 1

#include <iostream>
using namespace std;

// 父类
class person
{
public:
	void print()
	{
		cout << _age << endl;
		cout << _name << endl;
	}
    // 为了类外能够访问到_age和_name，访问权限改为public
	int _age = 20;
	string _name = "姓名";
};

// 子类
class student : public person
{
private:
	int _stu_id;
};

class teacher : public person
{
private:
	int _tea_id;
};

int main()
{
	// 创建子类对象
	student s;
	teacher t;

	// 改变不影响其他子类和父类
	person p;
	s._name = "学生";
	s._age = 10;
	s.print();
	t._name = "老师";
	t._age = 30;
	t.print();
	p.print();
	return 0;
}

输出结果：
10
学生
30
老师
20
姓名
```

## 继承权限

在C++中，允许子类以不同的继承权限继承父类，分别有`public`、`private`和`protected`三种权限，对应的成员也有三种权限修饰`public`、`private`和`protected`

!!! note
	对于`class`来说，其默认的继承权限是`private`，所以对于private继承来说，可以省略不写继承权限；对于`struct`来说，其默认的继承权限`public`，所以对于public继承来说，可以省略不写继承权限，**但是还是建议写出继承权限**

三种权限修饰符的所对应的访问范围如下：

1. `public`：允许类内访问，也允许在类外访问（权限最宽松）
2. `protected`：允许类内和子类访问，但是不允许类外访问
3. `private`：允许类内访问，不允许类外和子类访问（权限最严格）

两组两两组合有九种可能情况，这九种可能情况可以归类为一个公式`MIN=(子类继承权限，父类成员权限)`，所以对于父类中是`private`的成员，子类不论是三种继承方式中的任意一种，都无法访问父类的`private`成员

需要注意的是，**不可访问**不等于**没有继承**

对应父类成员是`private`时，尽管子类无法访问当父类的`private`成员，但是子类中依旧有父类`private`成员的空间

```c++
class person
{
private:
	string _age = "姓名";
};

class student : public person
{
private:
	int _id = 2;
};

int main()
{
	student s;

	return 0;
}
```

<img src="19. C++继承.assets\image-20240626103653621-1719369416733-1.png">

上述可以归结为下面的表格

| 继承权限/访问权限 | `public`                                                   | `protected`                                                  | `private`                                                 |
| :---------------: | ---------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
|     `public`      | 子类`public`继承父类`public`成员成为子类`public`成员       | 子类`public`继承父类`protected`成员成为子类`protected`成员   | 子类`public`继承父类`private`成员成为子类`private`成员    |
|    `protected`    | 子类`protected`继承父类`public`成员称为子类`protected`成员 | 子类`protected`继承父类`protected`成员成为子类`protected`成员 | 子类`protected`继承父类`private`成员成为子类`private`成员 |
|     `private`     | 子类`private`继承父类`public`成员成为子类`private`成员     | 子类`private`继承父类`protected`成员成为子类`private`成员    | 子类`private`继承父类`private`成员成为子类`private`成员   |

父类成员权限低，子类成员权限高

```c++
// 父类
class person
{
public:
	void print()
	{
		cout << _age << endl;
		cout << _name << endl;
	}

	int _age = 20;
	string _name = "姓名";
};

// 子类
// 父类成员权限低，子类继承权限高
class student : private person
{
	void modify()
	{
		// 类内访问
		_name = "学生";
	}
private:
	int _stu_id;
};

class teacher : protected person
{
private:
	int _tea_id;
};

int main()
{
	student s;
	//s.print(); private修饰，类外无法访问
	teacher t;
	//t.print(); protected修饰，类外无法访问
	person p;
	p.print();// public修饰，类外类内均可以访问
}

输出结果：
20
姓名
```

父类成员权限高，子类继承权限低

```c++
// 父类
class person
{
private:
	void print()
	{
		cout << _age << endl;
		cout << _name << endl;
	}

	int _age = 20;
	string _name = "姓名";
};

// 子类
// 父类成员权限高，子类继承权限低
class student : private person
{
	void modify()
	{
		// 类内无法访问
		//print();
		//_name = "学生";
	}
private:
	int _stu_id;
};

class teacher : protected person
{
	void modify()
	{
		// 类内无法访问
		//print();
		//_name = "老师";
	}
private:
	int _tea_id;
};

int main()
{
	student s;
	//s.print(); private继承，但是private修饰父类，类内类外无法访问
	teacher t;
	//t.print(); protected继承，但是private修饰父类，类内类外无法访问
	person p;
	//p.print();// private修饰，类外类内均无法访问
}
```

对于父类成员权限高时，尽管子类和类外都无法直接访问，但是父类内可以访问自己的`private`成员，如果父类提供一个函数，函数内部访问`private`成员，而该函数为`protected`则此时子类可以访问，如果为`public`，则子类和类外都可以访问，例如：

```c++
// 父类
class person
{
public:
	void print()
	{
		cout << _age << endl;
		cout << _name << endl;
	}

private:
	int _age = 20;
	string _name = "姓名";
};

// 子类
// 父类成员权限高，子类继承权限低
class student : protected person
{
	void modify()
	{
		// private 类内无法访问
		//_name = "学生";
		// 父类提供public成员函数访问其private成员
		print();
	}
private:
	int _stu_id;
};

class teacher : public person
{
	void modify()
	{
		// private 类内无法访问
		//_name = "学生";
		// 父类提供public成员函数访问其private成员
		print();
	}
private:
	int _tea_id;
};

int main()
{
	student s;
	//s.print(); protected继承，类外无法访问
	teacher t;
	t.print(); // public继承，但是有父类public函数，类内类外都可以访问
	person p;
	p.print();// public修饰成员函数，类外类内可以访问
}

输出结果：
20
姓名
20
姓名
```

## 父类和子类对象赋值转换

对于赋值运算来说，如果左边的类型和右边的类型不同时，会发生类型转换，类型转换的过程中会产生临时变量且其具有常性，所以有如下的情况：

```c++
#define _CRT_SECURE_NO_WARNINGS 1

#include <iostream>
using namespace std;

int main()
{
	int num = 1234;
	// 截断
	// 中间会产生临时变量用于接受num截断后的结果，再将结果给num1
	char num1 = num;
	// 整型提升
	// 中间会产生临时变量用于接受num整型提升后的结果，将结果给num
	num = num1;
	// 因为在转换过程中的临时变量具有常性，所以在给引用赋值时需要使用const引用
	const int& num2 = num1;
	return 0;
}
```

`int`：四个字节下的1234

<img src="19. C++继承.assets\image-20240626110747823-1719371269517-4.png" alt="image-20240626110747823">

`char`：一个字节下的1234，截断04，只留下d2

<img src="19. C++继承.assets\image-20240626110836275-1719371318054-6.png" alt="image-20240626110836275">

将`num1`赋值给`num`进行整型提升后：

<img src="19. C++继承.assets\image-20240626111002834-1719371404597-8.png" alt="image-20240626111002834">

但是上面的效果对于子类和父类有所不同，具体表现为当子类继承父类后，如果将子类对象给父类的对象（包括对象本身、对象的引用和对象的指针）时，此时为父类只能访问子类中继承的部分

```c++
class person
{
protected:
	int _age = 10;
	string _name = "姓名";
	string _address = "地址";
};

class student : public person
{
public:
	void modify(string name = "", int age = 20, string address = "")
	{
		_name = name;
		_age = age;
		_address = address;
	}
private:
	int _stu_id = 20;
};

int main()
{
	person p;
	student s;
	s.modify("学生", 18, "未知");
	p = s;
	person* ptr = &s;
	person& pr = s;
	return 0;
}
```

赋值前：

<img src="19. C++继承.assets\image-20240626113402055-1719372843641-12.png">

直接赋值后：

<img src="19. C++继承.assets\image-20240626113519083-1719372921805-14.png">

指针和引用：

<img src="19. C++继承.assets\image-20240626113901737-1719373143136-16.png">

表现为下图的情况：

<img src="19. C++继承.assets\image-20240626112423785-1719372265107-10.png" style="zoom: 80%;" >



上面的子类赋值给父类，父类访问部分的现象称为赋值兼容转换，这种转换是继承中的一种针对类型转换的特殊处理，也有个形象的说法叫做切割或者切片

但是需要注意的是，如果子类对象不能直接赋值给父类引用或者指针就变为了[多态](https://www.help-doc.top/C%2B%2B/20.%20C%2B%2B%E5%A4%9A%E6%80%81/20.%20C%2B%2B%E5%A4%9A%E6%80%81.html#c)

## 继承中的作用域

目前一共有四种作用域：

1. 类域
2. 命名空间域
3. 局部域
4. 全局域

作用域的影响见下表：

| 域/作用    | 语法查找规则顺序（是否影响） | 生命周期（是否影响）                   |
| ---------- | ---------------------------- | -------------------------------------- |
| 类域       | 影响                         | <span style="color: red">不影响</span> |
| 命名空间域 | 影响                         | <span style="color: red">不影响</span> |
| 局部域     | 影响                         | 影响                                   |
| 全局域     | 影响                         | 影响                                   |

查找规则顺序：

1. **局部域**：这是最内层的作用域，通常指函数体内部，包括函数参数和在函数中声明的变量。局部域中的标识符优先级最高（除非指定了命名空间域），如果局部域中有同名标识符，则会屏蔽外层作用域中的同名标识符

	```c++
	//NameSpace.h
	namespace test 
	{
		int i = 10;
	}
	
	//test.cpp
	#include <iostream>
	#include "NameSpace.h"
	using namespace std;
	using namespace test;
	
	//int i = 5;
	
	int main()
	{
		int i = 4;
		cout << i << endl;// 优先局部
		cout << test::i << endl;// 优先命名空间
		return 0;
	}
	
	输出结果：
	4
	10
	```

2. **类域**：类域是指在类定义中的作用域。类成员的访问取决于它们的访问控制属性（`public`、`protected`、`private`）。在类的成员函数中，可以访问该类的`public`和`protected`成员，而在类的外部，只能访问`public`成员。

3. **全局域**：在所有函数外部声明的标识符属于全局域。全局域中的标识符可以在整个源文件中访问，除非被局部域或类域中的同名标识符所隐藏。如果展开的命名空间中有与全局域同名的变量，此时编译器会报错为“不明确的符号”

4. **命名空间域**：命名空间用于组织代码，避免命名冲突。命名空间中的标识符可以在命名空间外部通过命名空间限定符（`::`）来访问。**如果没有显式指定，编译器不会自动检查命名空间域**。

关系如下图所示：

<img src="19. C++继承.assets/image-20240626152150927-1719386518015-1-1719386536499-3.png" alt="image-20240626152150927" />

因为有类域的存在，所以在继承中，如果子类中存在与父类同名的成员（成员变量和成员函数），则会优先访问子类中的成员，因为子类的成员在子类的类域中，而父类的成员在父类的类域中，这种现象被称为**隐藏或者重定义**（不是同一作用域下的重定义）

```c++
class person
{
protected:
	int _age = 10;
	string _name = "姓名";
};

class student : public person
{
public:
	void print()
	{
		cout << "age = " << _age << endl;
		cout << "name = " << _name << endl;
	}
private:
	int _age = 20;
	string _name = "学生";
};

int main()
{
	student s;
	// 打印子类student的成员而非父类person
	s.print();
	return 0;
}

输出结果：
age = 20
name = 学生
```

如果需要在子类中访问到父类的成员可以指定父类的类域

```c++
class person
{
protected:
	int _age = 10;
	string _name = "姓名";
};

class student : public person
{
public:
	void print()
	{
		// 指定父类的类域中的成员
		cout << "age = " << person::_age << endl;
		cout << "name = " << person::_name << endl;
	}
private:
	int _age = 20;
	string _name = "学生";
};

int main()
{
	student s;
	// 打印子类student的成员而非父类person
	s.print();
	return 0;
}

输出结果：
age = 10
name = 姓名
```

!!! note

	对于成员函数也是如此，只是成员函数的隐藏只需要满足同名[多态中具体介绍](https://www.help-doc.top/C%2B%2B/20.%20C%2B%2B%E5%A4%9A%E6%80%81/20.%20C%2B%2B%E5%A4%9A%E6%80%81.html#_2)

!!! warning
	实际开发中不建议定义重名的成员

## 子类的默认成员函数

在C++中，每一个类会有自己的六大默认成员函数，对于子类来说也是一样，但是在继承中，不同的默认成员函数会有不同，下面以四种默认成员函数为例

### 构造函数

默认情况下，子类会调用父类的构造函数对父类成员初始化，子类自己的成员调用自己的构造函数，而显式写出构造函数后，在初始化列表处，如果需要对父类成员初始化就需要调用父类的构造函数而不能额外指定父类成员单独初始化，并且初始化顺序总是满足父类先初始化（即先调用父类构造函数初始化父类成员），接着初始化子类成员（满足先父后子）

```c++
class person
{
public:
	person(int age = 10, string name = "姓名")
		:_age(age)
		,_name(name)
	{}

protected:
	int _age = 0;
	string _name = "姓名";
};

class student : public person
{
public:
	student(int age = 20, int stu_id = 1)
		:person(age)// 调用父类的构造函数
		//,_age(age) // 不可以显示对父类成员初始化
		,_stu_id(stu_id)
	{}

	void print()
	{
		cout << "age = " << _age << endl;
		cout << "name = " << _name << endl;
		cout << "student_id = " << _stu_id << endl;
	}
private:
	int _stu_id;
};

int main()
{
	student s;
	s.print();
	return 0;
}

输出结果：
age = 20
name = 姓名
student_id = 1
```

### 拷贝构造函数

对于拷贝构造函数来说，因为拷贝构造函数也会走初始化列表，所以对于父类成员的拷贝会走父类成员的拷贝构造，并且这里会涉及到赋值兼容转换，而子类自己的成员则走自己的拷贝构造进行初始化，初始化顺序依旧是先父类成员初始化再子类成员（满足先父后子）

```c++
class person
{
public:
	// 构造函数

	// 拷贝构造函数
	person(const person& p)
	{
		_age = p._age;
		_name = p._name;
	}

protected:
	int _age = 20;
	string _name = "姓名";
};

class student : public person
{
public:
	// 构造函数

	// 子类拷贝构造函数
	student(const student& s)
		:_stu_id(s._stu_id)// 拷贝构造自己的成员
		,person(s)// 先调用父类的拷贝构造函数
		
	{
		//person(s); // 不可以在内部对父类成员进行拷贝构造
	}


	void print()
	{
		cout << "age = " << _age << endl;
		cout << "name = " << _name << endl;
		cout << "student_id = " << _stu_id << endl;
	}
private:
	int _stu_id;
};

int main()
{
	student s;
	s.print();
	student s1(s);
	s1.print();
	return 0;
}

输出结果：
age = 20
name = 姓名
student_id = 1
age = 20
name = 姓名
student_id = 1
```

### 赋值运算符重载函数

对于赋值运算符重载函数来说，因为赋值运算符重载函数默认对内置类型进行浅拷贝，对自定义类型调用其赋值运算符重载函数，而对于子类和父类来说，父类中的成员需要调用父类的赋值运算符重载函数，此处需要注意的是，因为赋值运算符重载函数在当前子类的类域中也有，如果直接写为`operator=()`则会出现无穷递归，正确做法是指定为**父类类域**中的`operator=()`

```c++
class person
{
public:
	// 构造函数

	// 拷贝构造函数

	// 赋值运算符重载函数
	person& operator=(const person& p)
	{
		if (this != &p)
		{
			_age = p._age;
			_name = p._name;
		}

		return *this;
	}

protected:
	int _age = 0;
	string _name = "姓名";
};

class student : public person
{
public:
	// 构造函数

	// 拷贝构造函数

	// 赋值运算符重载函数
	student& operator=(const student& s)
	{
		if (this != &s)
		{
			// 指定调用父类的赋值运算符重载
			person::operator=(s);
			_stu_id = s._stu_id;
		}

		return *this;
	}

	void print()
	{
		cout << "age = " << _age << endl;
		cout << "name = " << _name << endl;
		cout << "student_id = " << _stu_id << endl;
	}
private:
	int _stu_id;
};

int main()
{
	student s;
	s.print();
	student s1(s);
	s1.print();
	student s2;
	s2 = s;
	s2.print();
	return 0;
}

输出结果：
age = 20
name = 姓名
student_id = 1
age = 20
name = 姓名
student_id = 1
age = 20
name = 姓名
student_id = 1
```

### 析构函数

对于析构函数来说，内置类型不处理，自定义类型会调用对应的析构函数，而对于继承中的析构来说，因为子类和父类中可能也存在空间释放，所以子类和父类也会有析构函数，此时的析构函数都被编译器隐式叫`destructor()`，所以**调用父类析构函数时也需要指定类域**

!!! note
	但是，如果在子类中显式调用父类的析构函数就不能保证父类的析构函数最后被执行（构造满足先父后子，析构满足先子后父），所以**<span style="color: red">父类的析构函数不能显示调用</span>**

```c++
class person
{
public:
	// 构造函数

	// 拷贝构造函数

	// 赋值运算符重载函数

	// 析构函数
	~person()
	{

	}

protected:
	int _age = 0;
	string _name = "姓名";
};

class student : public person
{
public:
	// 构造函数

	// 拷贝构造函数

	// 赋值运算符重载函数

	// 析构函数
	~student()
	{
		string name;
		//person::~person(); 指定类域，但是不能显式调用
		name = _name;// 因为父类先被析构，所以此时_name为随机值，从而导致name为随机值
		delete[] ptr;
 	}

	void print()
	{
		cout << "age = " << _age << endl;
		cout << "name = " << _name << endl;
		cout << "student_id = " << _stu_id << endl;
	}
private:
	int _stu_id;
	int* ptr = new int[10] {0};
};

int main()
{
	student s;
	return 0;
}
```

### 总结

对于上面四种默认成员函数来说，处理方式为：

1. 构造函数：父类成员构造走父类，子类成员构造走子类，**满足先父类后子类**
2. 拷贝构造：父类成员拷贝构造走父类（涉及到赋值兼容转换），子类成员拷贝构造走子类
3. 赋值运算符重载符函数：父类成员走父类赋值运算符重载函数（涉及到赋值兼容转换），子类成员拷贝走子类赋值运算符重载符函数
4. 析构函数：父类析构函数不能显式调用，父类成员走父类析构函数，**满足先子类后父类**

## 友元与继承

当父类中有友元函数时，子类无法继承友元函数

```c++
class student;// 需要前置声明
class person 
{
public:
	friend void func(const person& p, const student& s);
protected:
	int _age;
};

class student : public person
{
protected:
	int _id;
};

void func(const person& p, const student& s)
{
	cout << p._age << endl;// 可以访问person中的保护成员
	//cout << s._id << endl; 无法访问student中的保护成员
}

int main()
{
	person p;
	student s;
	func(p, s);
	return 0;
}
```

在C++中，只有类中声明了友元，对应函数才可以访问友元所在类中的成员，所以上述代码中的`func`函数无法访问`student`类中的成员

!!! note
	因为友元声明早于`student`类出现，所以需要有`student`类的前置声明，否则友元函数无法找到`student`类

## 静态成员与继承

在C++中，当父类中含有静态成员，子类继承时，父类和子类共用该静态成员

```c++
class person
{
public:
	person()
	{
		_count++;
	}
public:
	static int _count;
};

int person::_count = 0;

class student : public person
{
private:
	int _id;
};

int main()
{
	person p;
	cout << person::_count << endl;// 创建一个父类对象，_count为1
	student s;
	cout << student::_count << endl;// 创建一个子类对象，因为共用_count，所以_count为2

	return 0;
}
```

上述代码可以理解为：父类对象创建时`_count`增加1，随后子类对象创建，父类成员调用父类构造函数`_count`再增加1，但是因为`static`修饰，父类和子类共用，所以是在原来`_count=1`的基础上增加

## 单继承与多继承

### 多继承介绍

单继承：一个子类只继承一个父类

<img src="19. C++继承.assets/image-20240709103639963.png" alt="image-20240709103639963" style="zoom:50%;" />

多继承：一个子类继承多个父类

<img src="19. C++继承.assets/image-20240709103917263.png" alt="image-20240709103917263" />

从继承的概念来看多继承：对于单继承来说，父类中的成员会在子类中有一份新的拷贝，所以子类中有父类的成员，再看多继承，因为继承自两个父类，所以子类中会有两个父类的成员的新拷贝

```c++
class vegetables
{
protected:
	string _name = "蔬菜";
};

class fruits
{
protected:
	string _name = "水果";
};

class tomato : public vegetables, public fruits
{
public:
	void show()
	{
		cout << vegetables::_name << fruits::_name << endl;
	}
protected:
	int _num;
};

int main()
{
	tomato t;
	t.show();
	return 0;
}

输出结果：
蔬菜水果
```

<img src="19. C++继承.assets/image-20240709104638429.png" alt="image-20240709104638429" />

对于多继承，如果两个父类有同名成员，需要指定类域名，否则编译器无法区分，其余规则可类推

!!! note
	需要注意到：

	当子类继承父类后，子类中会有父类中的成员，在多继承中，第一个继承的父类的成员排在第一个，第二个继承的成员排在第二个，以此类推，父类成员排完后才是本类中特有的成员

### 菱形继承

菱形继承是多继承的一种特殊情况，如果当前子类继承的多个父类继承自另外一个相同的父类，此时就可能产生菱形继承，如图所示：

<img src="19. C++继承.assets/image-20240709110002631.png" alt="image-20240709110002631" />

此时的`vegetable`和`fruit`继承自一个相同父类`plant`，而`vegetable`和`fruit`又作为父类被`tomato`继承，形成菱形继承

!!! note
	菱形继承不一定继承形状必须满足是个菱形，只要是出现两个或以上的子类继承自相同的父类，并且这两个子类又作为另外类的父类，此时就属于菱形继承

```c++
class plants
{
protected:
	string _kind;
};

class vegetables : public plants
{
protected:
	string _name = "蔬菜";
};

class fruits : public plants
{
protected:
	string _name = "水果";
};

class tomato : public vegetables, fruits
{
protected:
	int _num;
};

int main()
{
    vegetables v;
	fruits f;
	tomato t;

	return 0;
}
```

观察到，在菱形继承中，`vegetables`和`plants`类既作为`tomato`的父类，又作为`plant`子类，所以会出现数据冗余和二义性

数据冗余：因为`vegetables`和`fruits`继承自`plants`，所以两个类中都会有`plants`中的成员，接着`tomato`继承`vegetables`和`fruits`，`tomato`中也会存在`vegetables`和`fruits`继承自`plants`的成员，导致出现了数据冗余

<img src="19. C++继承.assets/image-20240709111059396.png" alt="image-20240709111059396" />

二义性：因为`tomato`类中有两个父类`vegetables`和`fruits`继承自`plants`的成员，所以在直接使用`tomato`对象访问时`_kind`时无法明确知道是哪一个对象的`_kind`，产生二义性

对于二义性来说，可以通过指定类域名的方式解决，例如`vegetables::_kind`和`fruits::_kind`，但是对于数据冗余来说并不能通过这个方法解决

### 虚拟继承

为了解决菱形继承中的数据冗余和二义性，可以在继承权限前方使用`virtual`关键字修饰**第一层既作为父类又作为子类的类**，修饰后的两个类继承行为就称为**虚拟继承**

!!! note
	虚拟继承对于数据冗余和二义性的处理方式为：所有子类都共用最高父类的成员

```c++
class plants
{
protected:
	string _kind = "类型";
};

class vegetables : virtual public plants // 修饰既作为父类又作为子类的类
{
protected:
	string _name = "蔬菜";
};

class fruits : virtual public plants // 修饰既作为父类又作为子类的类
{
protected:
	string _name = "水果";
};

class tomato : public vegetables, fruits
{
public:
	void show()
	{
		_kind = "蔬菜+水果";
		cout << _kind << endl;
	}
protected:
	int _num;
};

int main()
{
	tomato t;
	t.show();
	return 0;
}
```

<img src="19. C++继承.assets/image-20240709112523898.png" alt="image-20240709112523898" />

## 继承与组合的选择

### 组合

继承关系：子类和父类是is-a的关系

组合关系：两个类是has-a的关系

例如：

```c++
class tire
{
public:
	void show()
	{
		cout << _type << _size << endl;
	}
private:
	string _type = "米其林";
	int _size = 17;
};

class car
{
public:
	void show()
	{
		t.show();
		cout<< name << endl;
	}
private:
	tire t;// 车子 has a tire
	string name = "沃尔沃";
};

int main()
{
	car c;
	c.show();
	return 0;
}

输出结果：
米其林17
沃尔沃
```

### 二者的选择

继承和组合的选择：

继承允许你根据基类的实现来定义派生类的实现。这种通过生成派生类的复用通常被称为白箱复用(white-box reuse)。术语白箱是相对可视性而言：在继承方式中，基类的内部细节对子类可见。继承一定程度破坏了基类的封装。基类的改变，对派生类有很大的影响。派生类和基类间的依赖关系很强，耦合度高。

对象组合是类继承之外的另一种复用选择。新的更复杂的功能可以通过组装或组合对象来获得。对象组合要求被组合的对象具有良好定义的接口。这种复用风格被称为黑箱复用(black-box reuse)，因为对象的内部细节是不可见的。对象只以黑箱的形式出现。

组合类之间没有很强的依赖关系，耦合度低。优先使用对象组合有助于你保持每个类被封装。**实际尽量多去用组合**。组合的耦合度低，代码维护性好。不过继承也有用武之地的，有些关系就适合继承那就用继承，另外要实现多态，也必须要继承。

总结：因为项目中的代码需要遵守**高内聚，低耦合**，所以当不是特别需要使用继承（比如不需要实现多态或者关系上没有特别强的继承关系），就使用组合，否则使用继承

!!! info
	高内聚，低耦合参考：

	**Coupling（耦合）**

	Coupling is a measure of how tightly two modules are bound to each other. The more tightly coupled, the less independent they are. Since the objective is to make modules as independent as possible, we want them to be loosely coupled. There are at least three reasons why loose coupling is desirable. 

	- Loosely coupled modules are more likely to be reusable. （低耦合便于代码重用）

	- Loosely coupled modules are less likely to create errors in related modules.（低耦合不容易造成连锁问题） 

	- When the system needs to be modified, loosely coupled modules allow us to modify 

	    only modules that need to be changed without affecting modules that do not need to change. （低耦合便于代码修改）

	**Coupling between modules in a software system must be minimized. **（耦合必须最小化）

	**Cohesion（内聚）**
	
	Another issue in modularity is cohesion. Cohesion is a measure of how closely the mod-ules in a system are related. We 	eed to have maximum possible cohesion between modules in a software system. 

	 **Cohesion between modules in a software system must be maximized. **（内聚必须最大化）