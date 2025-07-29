# C++多态

## 虚函数

在菱形继承中学习到对继承修饰为`virtual`可以实现虚拟继承，在多态中，可以使用`virtual`关键字修饰函数，被`virtual`修饰的函数即为虚函数

## 虚函数重写

在继承中，如果子类中存在一个与父类同名的函数，则该子类函数会隐藏父类对应的函数，而为了实现函数重写，需要将父类函数修饰为`virtual`（子类对应的函数可以不写`virtual`，但是建议写上），此时子类中与父类重名的函数被视为**虚函数重写（也称覆盖）**，若父类中的函数没有被`virtual`修饰，则子类中如果存在与其同名的函数，则被视为**隐藏**

虚函数重写需要满足：

1. 函数返回类型相同
2. 函数名相同
3. 函数参数完全相同

```C++
// 父类
class Animal
{
public:
	virtual void shout()
	{
		cout << "叫声" << endl;
	}

	// 正常函数
	void eat()
	{
		cout << "吃东西" << endl;
	}
};

// 子类
class cat : public Animal
{
public:
	// 重写父类的虚函数——重写
	virtual void shout()
	{
		cout << "喵喵" << endl;
	}

	// 正常函数——隐藏
	void eat()
	{
		cout << "猫吃东西" << endl;
	}
};
```


但是虚函数重写条件存在两个例外：

1. 第一个例外（不常见）：协变

	所谓协变，即当父类虚函数返回值类型为父类的指针或引用，子类虚函数返回值类型为子类的指针或引用，这种情况下子类中与父类同名的虚函数和父类中的虚函数也构成重写

	```C++
	class Base
	{
	public:
		// 父类返回当前类或者其父类指针类型
		virtual Base* func()
		{
			cout << "Base* func()" << endl;
			return this;
		}
	};

	class Derive : public Base
	{
	public:
		// 子类返回当前类指针类型
		virtual Derive* func()
		{
			cout << "Derive* func()" << endl;
			return this;
		}
	};
	```

2. 第二个例外：析构函数的重写

	对于普通子类对象来说，析构函数是否是重写没有影响，因为子类对象在析构之后，子类的析构函数会默认调用父类的析构函数，不论是否存在隐藏

	```c++
	class Base
	{
	public:
		~Base()
		{
			cout << "~Base()" << endl;
		}
	};

	class Derive : public Base
	{
	public:
		~Derive()
		{
			cout << "~Derive()" << endl;
		}
	};

	int main()
	{
		// 普通对象
		Derive d;

		return 0;
	}
	输出结果：
	~Derive()
	~Base()
	```

	但是如果是父类的指针指向子类对象的话，一旦子类没有重写析构函数，就只会调用父类的析构函数，因为是父类的指针，父类指针销毁会先调用父类的析构函数，再销毁该指针
	```c++
	class Base
	{
	public:
		~Base()
		{
			cout << "~Base()" << endl;
		}
	};

	class Derive : public Base
	{
	public:
		~Derive()
		{
			cout << "~Derive()" << endl;
		}
	};

	int main()
	{
		Base* b = new Derive;
		delete b;

		return 0;
	}
	输出结果：
	~Base()  
	```
	但是多态条件中，父类指针指向子类对象，此时如果使用上面的方法写析构函数，则有可能会出现子类内存泄漏问题，所以父类析构函数需要设计成虚函数（析构函数会被处	为`destructor()`函数，所以子类和父类同名），这样在父类指针指向一个子类对象时，销毁父类指针会先走子类的析构函数（因为是多态，指针指向哪个对象就调哪个对象的析构函数），然后再走父类的析构函数，最后释放指针`b`的空间

	```c++
	class Base
	{
	public:
		virtual ~Base()
		{
			cout << "~Base()" << endl;
		}
	};

	class Derive : public Base
	{
	public:
		virtual ~Derive()
		{
			cout << "~Derive()" << endl;
		}
	};

	int main()
	{
		// 普通对象
		//Derive d;

		Base* b = new Derive;
		delete b;

		return 0;
	}
	输出结果：
	~Derive()
	~Base()
	```

	综上所述，**析构函数需要设计成虚函数**

## 多态

### 多态基本介绍

所谓多态，即多种形态，例如在动物界中，不同的动物有不同的叫声，所以不同的动物就是“动物”的不同形态。在C++中，**多态首先需要继承**，接着需要满足下面两个条件才能构成多态：

1. 子类重写父类的虚函数
2. **父类的指针或者引用**指向子类对象，**调用虚函数**

结合多态的要求，使用下面的例子实现多态

```C++
class Animal
{
public:
	virtual void shout()
	{
		cout << "叫声" << endl;
	}
private:
	string _kind;
};

class cat : public Animal
{
public:
	// 重写父类的虚函数
	virtual void shout()
	{
		cout << "喵喵" << endl;
	}
};

class dog : public Animal
{
public:
	// 重写父类的虚函数
	virtual void shout()
	{
		cout << "汪汪" << endl;
	}
};

// 使用父类引用形参接收子类对象，调用虚函数
void func(Animal& a)
{
	a.shout();
}

int main()
{
	Animal a;// 创建父类对象
	cat c; // 创建子类对象
	dog d; // 创建子类对象

	func(a);
	func(c);
	func(d);

	return 0;
}

输出结果：
叫声
喵喵
汪汪
```

### 成员函数隐藏与重写的区别

首先，对于隐藏来说，子类的成员函数只需要与父类的成员函数重名时，就可以构成隐藏，而对于重写来说，基本要求三个位置（返回值类型、函数名以及形式参数）全部相同并且需要用`virtual`关键字修饰，考虑下面的例子

```C++
// 父类
class Animal
{
public:
	virtual void shout()
	{
		cout << "叫声" << endl;
	}

	// 正常函数
	void eat()
	{
		cout << "吃东西" << endl;
	}
};

// 子类
class cat : public Animal
{
public:
	// 重写父类的虚函数
	virtual void shout()
	{
		cout << "喵喵" << endl;
	}

	// 正常函数
	void eat()
	{
		cout << "猫吃东西" << endl;
	}

};

// 子类
class dog : public Animal
{
public:
	// 重写父类的虚函数
	virtual void shout()
	{
		cout << "汪汪" << endl;
	}

	void eat()
	{
		cout << "狗吃东西" << endl;
	}
};

// 使用父类引用形参接收子类对象，调用虚函数
void func(Animal& a)
{
	// 虚函数调用
	a.shout();
	// 非虚函数调用
	a.eat();

	cout << endl;
}

int main()
{
	Animal a;// 创建父类对象
	cat c; // 创建子类对象
	dog d; // 创建子类对象

	func(a);
	func(c);
	func(d);

	// 创建子类对象调用子类非虚函数
	cat().eat();
	dog().eat();

	return 0;
}

输出结果：
叫声
吃东西

喵喵
吃东西

汪汪
吃东西

猫吃东西
狗吃东西
```

根据输出结果可以看出，对于重写的函数来说，函数的调用取决于实参是哪一个对象，而隐藏的函数不论是父类对象还是子类对象，只要是父类类型变量，都会调用父类的函数，如果需要访问子类函数，则需要额外创建子类对象

### `override`关键字

在C++中，可以使用`override`关键字来判断子类是否重写的是父类中对应的虚函数，如果没有则编译报错

```C++
class Animal
{
public:
	virtual void func()
	{
		cout << "父类" << endl;
	}
};

class cat : public Animal
{
public:
    // 与父类中的虚函数不同名不构成重写，但是加了override关键字
	virtual void func1() override
	{
		cout << "子类" << endl;
	}
};

报错提示：
'cat::func1': method with override specifier 'override' did not override any base class methods
```

### 不可继承类和不可重写函数

在C++中，可以使用`final`关键字修饰类或者成员函数，此时该类或者函数无法被继承或者重写

```C++
// 不可继承类
class Base final
{

};

class Derive : public Base
{

};
报错提示：
a 'final' class type cannot be used as a base class	
    
// 不可重写函数
class Base
{
public:
	virtual void func() final
	{

	}
};

class Derive : public Base
{
public:
	void func()
	{

	}
};
报错提示：
cannot override 'final' function "Base::func"
```

### 抽象类与多态

在C++中，当类中至少含有一个抽象函数时，该类即为抽象类（也称接口类）

所谓抽象类，即无法实例化出对象的类

抽象函数，即**没有函数定义只有函数声明且函数声明后出现`=0`**的函数（也称纯虚函数），考虑下面的示例：

```C++
// 抽象类
class Base
{
public:
	virtual void func() = 0;
};
```

对于抽象类来说，如果有子类继承了该抽象类，则子类必须重写父类中的抽象方法，否则子类也会因为存在函数为纯虚函数导致变为抽象类而无法实例化出对象

```c++
// 抽象类
class Base
{
public:
	virtual void func() = 0;
};

class Derive : public Base
{
public:
	virtual void func() override
	{
		cout << "子类" << endl;
	}
};

void func(Base& b)
{
	b.func();
}

int main()
{
	Derive d;
	func(d);
	return 0;
}

输出结果：
子类
```

有了抽象类，多态就会变得更合理化，考虑开始时的动物类，`Animal`类本身作为一个大集体是没有叫声的，所以可以没必要实现`shout()`函数，而具体到`cat`类和`dog`类有自己的叫声，所以需要具体实现。另外因为`Animal`类是一个大集体，所以不需要实例化出一个实际对象，所以使用抽象类也可以刚刚好满足这个条件，这也是为什么多态的第二个条件需要是父类的指针或者引用的其中一个原因

```c++
class Animal
{
public:
	virtual void shout() = 0;
};

class cat : public Animal
{
public:
	// 重写父类的虚函数
	virtual void shout()
	{
		cout << "喵喵" << endl;
	}
};

class dog : public Animal
{
public:
	// 重写父类的虚函数
	virtual void shout()
	{
		cout << "汪汪" << endl;
	}
};

// 使用父类引用形参接收子类对象，调用虚函数
void func(Animal& a)
{
	// 虚函数调用
	a.shout();
	cout << endl;
}

int main()
{
	cat c;
	dog d;
	func(c);
	func(d);
	return 0;
}
```

### 实现继承与接口继承

普通函数的继承是一种实现继承，派生类继承了基类函数，可以使用函数，继承的是函数的实现。

虚函数的继承是一种接口继承，派生类继承的是基类虚函数的接口，目的是为了重写，达成多态，继承的是接口。所以**如果不实现多态，不要把函数定义成虚函数**

## 多态的原理

### 虚函数表的存在

考虑下面代码中，`Base`类和`Derive`类的大小（64位机下）

```c++
class Base
{
public:
	virtual func()
	{
		cout << "~Base()" << endl;
	}
};

class Derive : public Base
{
public:
	virtual ~Derive()
	{
		cout << "~Derive()" << endl;
	}
};

int main()
{
	cout << "Base: " << sizeof(Base) << endl;
	cout << "Derive: " << sizeof(Derive) << endl;

	return 0;
}
输出结果：
Base: 8
Derive: 8
```

在类和对象一节了解到如果一个类中没有成员变量只包含成员函数，那么类只有1字节的大小，但是这两个类的大小都是8字节，原因就是虚函数表

当类中定义了虚函数，那么对应的类中就会有虚函数表，但是类中不会直接存储一张表，而是存储一个表指针，该指针是一个指向函数指针数组首元素地址的指针

![image-20240711174402775](20. C++多态.assets/image-20240711174402775.png)

虚函数表中第一个元素存储的地址值

![image-20240711174343941](20. C++多态.assets/image-20240711174343941.png)

所谓虚函数表，就是一个一维函数指针数组，在类定义了虚函数时，每一个虚函数的跳转指令(call指令)的地址都会存储到虚函数表中

如果父类中定义了虚函数，则父类中会有一张虚表，此时子类如果继承了父类并且重写了父类对应的虚函数，则子类中也会有一张虚函数表，该虚函数表中存储着子类的虚函数

![image-20240711174807164](20. C++多态.assets/image-20240711174807164.png)

而之所以能实现多态，就是靠的虚函数表，但是不同于普通函数，考虑下面的代码：

```c++
class Base
{
public:
	virtual void func1()
	{
		cout << "Base::func1()" << endl;
	}

	virtual void func2()
	{
		cout << "Base::func2()" << endl;
	}

	void func3()
	{
		cout << "Base::func3()" << endl;
	}
};

class Derive : public Base
{
public:
	virtual void func1()
	{
		cout << "Derive::func1()" << endl;
	}

	void func3()
	{
		cout << "Derive::func3()" << endl;
	}
};

void func(Base& b)
{
    // 重写的虚函数
	b.func1();
    // 普通函数
	b.func3();
}

int main()
{
	Base b;
	Derive d;

	func(b);
	cout << endl;
	func(d);

	return 0;
}
输出结果：
Base::func1()
Base::func3()

Derive::func1()
Base::func3()
```

在上面的代码中，父类`Base`中有两个虚函数`func1()`和`func2()`，所以父类的虚表中存在两个虚函数，但是父类中还有一个普通函数，普通函数并没有放在虚表中，接着子类`Derive`中，因为重写了父类中的`func1()`函数，所以子类虚表中的`func1()`不同于父类中的`func1()`，但是子类并没有重写`func2()`，所以对于子类的虚函数表来说，也存在两个虚函数`func1()`和`func2()`，只是子类的`func2()`与父类的`func2()`共用一个地址

![image-20240711175848717](20. C++多态.assets/image-20240711175848717.png)

### 动态绑定和静态绑定

正是因为有了虚函数表，才有了多态的实现。

在编译与链接部分提到，一个函数在链接时会生成一个符号表，该符号表中存储的函数名和函数地址，编译器在调用函数时，根据符号表中的地址可以找到该函数完成调用，但是对于多态中的虚函数来说，因为在编译链接时并不知道是哪一个对象在调用虚函数，所以无法确定调用的哪个对象中的虚函数，

对于在编译链接部分对函数生成符号表的操作称为**静态绑定**，而在运行时才确定调用函数地址的操作称为**动态绑定**

虚函数表在多态中相当于一个虚拟的符号表，当父类对象调用虚函数时，会去父类对象中的虚函数表找对应的虚函数跳转地址，当子类对象调用虚函数时，会去子类对象中的虚函数表找对应的虚函数地址，所以才有了父类对象调用父类虚函数，子类对象调用子类虚函数，形参多态

对上面的代码进行解析：

对于前面出现的`func1()`，当执行父类对象给父类引用`b`时，`b->func1()`就会去父类对象中的虚函数表中找`func1()`对应的地址，即`0x00007ff6f1421537`，`b->func2()`也是同样的道理；当执行子类对象给父类引用`b`时，`b->func1()`就会去子类对象的虚函数表中找`func1()`对应的地址，因为和父类的`func1()`地址不同，所以调用的`func1()`函数也就不同，这也是为什么虚函数重写也被称为覆盖，接着调用`func2()`函数，因为子类中并没有重写父类的虚函数`func2()`，所以子类虚函数中`func2()`对应的地址与父类中的相同，此时调用的虚函数也是同一个

但是对于`func3()`来说，因为`func3()`属于普通函数，所以`func3()`在编译链接时就已经确定了是父类中的`func3()`的地址，所以只要是调用`func3()`，不论是子类对象调用还是父类对象对象调用，只要调用变量的类型是父类类型，就会调用父类的`func3()`

在了解了虚函数表的存在后，思考下面三个问题：

1. 虚函数存放在哪里

    !!! question "Answer" 
		
		虚函数存放在代码段（常量区）

2. 虚函数表存放在哪里

    !!! question "Answer" 
		
		虚函数表存放在代码段（常量区）

3. 虚函数表指针存放在哪里

    !!! question "Answer"
		
		虚函数表指针存放在对象中，对象存放在栈

通过下面的代码大致看一下虚函数表的位置：

```c++
class Base
{
public:
	virtual void func1()
	{}

	void func() {}
};

class Derive : public Base
{
public:
	virtual void func1()
	{}
};


int main()
{
	// 栈区变量
	int num = 0;
	printf("%p\n", &num);
	// 堆区变量
	int* arr = new int[10];
	printf("%p\n", arr);
	// 常量区变量
	printf("%p\n", &Base::func);
	const char* str = "abc";
	printf("%p\n", str);

	Base b;
	Derive d;
	printf("%p\n", *(int*)&b);// 取出b对象前四个字节中的数据
	printf("%p\n", *(int*)&d);// 取出d对象前四个字节中的数据

	return 0;
}

输出结果：
007DFDA4
00E7E828
00B61488
00B68B4C
00B68B34
00B68B40
```

!!! note
	上面的代码需要注意，对于对象的地址来说，如果直接`&b`取出来的是栈区的对象的地址，但是虚表的位置是虚函数表指针的地址，二者并不相同；另外因为`b`是自定义类型，所以不可以写成`(int)B`，**内置类型和自定义类型没有关联不可以强制转换**，但是对于对象的地址中的内容可以通过指针取到因为要取头四个字节中的内容，所以需要强转为`int*`，写成`(int*)&b`，在取出其中的内容，即虚函数表指针的内容`*(int*)&b`

### 多态的必要条件思考

在多态中，满足是继承的前提后，有两个必要条件：

1. 重写父类中的虚函数
2. 使用父类的指针或者引用指向子类对象，调用虚函数

首先对于第一个条件，如果子类重写了父类中的虚函数，那么子类的虚函数表中对应的同名虚函数的地址和父类的地址就会不同，因为重写的虚函数地址覆盖了父类对应的虚函数地址（子类拷贝父类的虚函数表再覆盖）

对于第二个条件，如果直接使用父类对象接收子类对象，那么就会发生切片行为，此时父类对象访问不到子类对象中的虚函数表指针，进而无法访问到虚函数表中的虚函数地址（直接使用父类对象，则会因为是父类对象而调用的是父类中的`vptr`变量的值）；当使用父类的指针或引用去调用虚函数时，实际上是在调用由子类对象的`vptr`（父类中也有同样的对象，因为子类继承父类）指向的虚函数表中的函数。另外因为指针或引用允许操作任何派生类对象，指针或引用并未创建新的对象，而是指向了已存在的子类对象，从而可以在运行时选择动态绑定而不是静态绑定

## 继承和多态中的面试题

### 多继承中的指针偏移

对于下面的程序，下面说法正确的是( )

```c++
class Base1
{
public:
	int _b1;
};

class Base2
{
public:
	int _b2;
};

class Derive : public Base1, public Base2 
{
public:
	int _d; 
};

int main() {
	Derive d;
	Base1* p1 = &d;
	Base2* p2 = &d;
	Derive* p3 = &d;
	return 0;
}
```

- [ ] A：`p1 == p2 == p3`
- [ ] B：`p1 < p2 < p3`
- [x] C：`p1 == p3 != p2`
- [ ] D：`p1 != p2 != p3`

!!! tip

	解析：

	首先需要理解什么是继承中的指针偏移，使用指访问时，指针访问到的第一个成员的位置相对于所访问类的成员的起始位置的偏移量即为继承中的指针偏移量

	在本题中，因为`Derive`继承自`Base1`和`Base2`，所以`Derive`中既有`Base1`中的成员，也有`Base2`的成员，但是按照继承的顺序，`Base1`的成员在`Derive`对象的内存中排在第一个位置，接着就是`Base2`的成员，最后才是`Derive`的成员。当使用`p1`指针访问`Derive`中的成员时，因为发生了切片行为，所以`p1`只能访问属于`Base1`的成员，也就是`p1`指向第一个成员`_b1`，接着`p2`指针访问`Derive`中的成员时，因为发生了切片行为，所以`p2`只能访问属于`Base2`的成员，也就是`p2`指向第二个成员`_b2`，最后就是`p3`指针访问`Derive`中的成员，此时没有切片现象产生，所以`p3`可以访问`Derive`中的所有成员，但是此时位置在`_b1`成员处，所以指针偏移量为`p1==p3!=p2`，如下图所示：
	<img src="20. C++多态.assets/image-20240711191216161.png" alt="image-20240711191216161" />

### 虚函数中的缺省参数问题

以下程序输出结果是什么（）

```c++
class A
{
public:
	virtual void func(int val = 1) 
	{ 
		std::cout << "A->" << val << std::endl; 
	}
	virtual void test() 
	{ 
		func(); 
	}
};

class B : public A
{
public:
	void func(int val = 0) 
	{ 
		std::cout << "B->" << val << std::endl; 
	}
};

int main()
{
	B* p = new B;
	p->test();
	return 0;
}
```

- [ ] A: A->0
- [x] B: B->1
- [ ] C: A->1
- [ ] D: B->0
- [ ] E: 编译出错
- [ ] F: 以上都不正确

!!! tip

	解析：

	首先需要清楚的是，虚函数的确定是一个动态绑定的过程，而缺省参数是静态绑定的，所以在子类`B`中重写的`func`函数中的缺省值是无效的（《Effective C++》条款37：绝不重新定义继承而来的缺省参数值）<br/>
	在本题中，因为`p`指针指向一个`B`类型的对象，所以访问的是`B`中函数，在`B`中并没有`test()`函数，但是`B`继承自`A`，所以访问`A`中的`test()`函数。对于A中的`test()`函数来说，存在一个指针`this`，因为是`B`类对象调用，而因为虚函数会存在一张虚函数表中，所以尽管`B`没有重写`test()`函数，`B`的虚函数表中依旧有`test()`函数，只不过和`A`类是同一个虚函数，因为是子类的虚函数表指针，所以这个`this`指针存储的是`B`对象的地址，从而在调用`test()`中的`func()`函数时访问的是`B`类中的虚函数`func()`<br/>
	结合上面两个原因：首先缺省值重新赋予是无效的，所以B类中重写的虚函数`func()`中`val`的缺省值依旧还是`A`类中的1，接着因为访问的`B`的`func()`函数，所以输出`B->1`
	
	思考：
	
	如果将指向`B* p = new B`改为`A* p = new B`，结果会改变吗？
	
	答案是**不变**，因为使用`A`类型的指针`p`指向`B`时，依旧是子类的虚函数表指针调用`test()`函数（多态的第二个条件），所以`this`中存的依旧是子类对象的地址

### 多态与内存对齐问题

思考下面程序中两次`print()`的结果：

```cpp
#include <iostream>

class Base
{
public:
    int a = 1;
    virtual void print(int n = 2)
    {
        std::cout << "Base: " << a + n << std::endl;
    }
};

class Derive : public Base
{
public:
    int b = 3;
    void print(int n = 10) override
    {
        std::cout << "Derive: " << b + n << std::endl;
    }
};

int main()
{
    Base *arr = new Derive[10];
    arr[7].print();
    delete[] arr;

    Base *ptr = new Derive();
    ptr->print();
    delete ptr;

    return 0;
}
```

!!! tip

	解析：

	首先考虑第二个`print()`，因为是父类指针指向子类对象，满足多态条件，根据上一题的分析，输出结果应该为`Derive: 5`；回到第一个`print()`，首先通过`Base *arr = new Derive[10];`创建了10个`Derive`对象并使用`Base*`的指针指向每一个`Derive`对象，接着访问到数组的第8个元素，`arr[7]`可以化简为`*(arr + sizeof(Base) * 7)`，对应着就是偏移到第7个元素，如果计算数组大小时的确是使用`sizeof(Base)`，那么实际上结果依旧与第二个`print()`结果一样，但是如果计算数组大小时是使用`sizeof(Derive)`，此时就需要分类进行讨论：
	
	1. 在gcc下，没有默认的内存对齐大小，内存对齐大小就是每一个成员自身的大小，也就是说，`Base`大小为$8（虚函数表指针）+ 4（int类型大小）+ 4（补充值）= 16$，但是对于`Derive`来说，计算方式就是$8（虚函数表指针）+ 4（int类型大小）+ 4（Derive类int类型变量大小）= 16$，此时没有填充值，因为结构体大小刚好为最大对齐数的整数倍
	2. 在VS2022下，存在默认的内存对齐大小为8，对于`Base`来说，结构体大小依旧为16，但是对于`Derive`来说，计算方式就是$8（虚函数表指针）+ 4（Base类中int类型大小）+ 4（补充值）+ 4（Derive类中int类型大小）= 20$，但是因为存在默认内存对齐大小，所以根据[计算公式](https://www.help-doc.top/C%E8%AF%AD%E8%A8%80/3.%20C%E8%AF%AD%E8%A8%80%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B%E5%92%8C%E5%8F%98%E9%87%8F/3.%20C%E8%AF%AD%E8%A8%80%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B%E5%92%8C%E5%8F%98%E9%87%8F.html#_38)实际的`Derive`类大小为24

	此时，如果是gcc，那么结果与使用`sizeof(Base)`是相同的，但是如果是VS2022，那么就会出现越界访问错误。所以，基于这个问题，**永远不要用基类指针指向派生类对象数组**