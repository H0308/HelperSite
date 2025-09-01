<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Qt介绍与基础代码解释

## Qt介绍

Qt是一个跨平台的C+图形用户界面应用程序框架。它为应用程序开发者提供了建立艺术级图形界面所需的所有功能。它是完全面向对象的，很容易扩展。Qt为开发者提供了一种基于组件的开发模式，开发者可以通过简单的拖拽和组合来实现复杂的应用程序，同时也可以使用C++语言进行高级开发

Qt发展史：

- 1991年Qt最早由奇趣科技开发
- 1996年进入商业领域，它也是目前流行的LiuX桌面环境KDE的基础
- 2008年奇趣科技被诺基亚公司收购，Qt成为诺基亚旗下的编程工具
- 2012年Qt又被Digia公司收购
- 2014年4月跨平台的集成开发环境Qt Creator3.1.0发布，同年5月20日发布了Qt5.3正式版，至此Qt实现了对IOS、Android、Embedded等各平台的全面支持

Qt支持的平台：

- Windows-XP、Vista、Win7、Win8、Win2008、Win10、Win11
- Unix/X11-Linux、.Sun Solaris、.HP-UX、Compaq Tru64UNlX、IBM AIX、SGI IRIX、FreeBSD、BSD/OS、和其他很多X11平台
- Macintosh Mac OS X
- Embedded-有帧缓冲支持的嵌入式Linux平台，Windows CE
- Android

Qt版本：目前最新的版本是Qt6.但是相对来说Qt6和Qt5之间的核心功能区别不大.并且企业中也仍然有大量的项目在使用Qt5。后面学习过程中也是基于Qt5

Qt的优点：

- 跨平台，几乎支持所有的平台
- 接口简单，容易上手，学习QT框架对学习其他框架有参考意义
- 一定程度上简化了内存回收机制
- 开发效率高，能够快速的构建应用程序
- 有很好的社区氛围，市场份额在缓慢上升
- 可以进行嵌入式开发

## 基础代码解释（基于Widget）

### 选择`QWidget`

在创建项目过程中可以看到类似下面的界面：

<img src="1. Qt介绍与基础代码解释.assets/image-20250523105648993.png">

其中，`Class Name`表示创建的默认模板类名，`Base Class`表示创建的默认模板类的父类，在`Base Class`部分可以有三个选择：

1. `QMainWindow`：表示创建的模板类是一个主窗口类
2. `QWidget`：表示创建的模板类是一个组件窗口类
3. `QDialog`：表示创建的模板类是一个对话框类

默认情况下，默认模版类的类名是头文件名或者源文件的大驼峰形式，也可以自行修改文件名、类名、头文件名。本次选择`QWidget`，然后点击`next`

接着是`Generate Form`，这个选项表示是否生成UI界面，默认情况下是勾选的，勾选后会生成一个`.ui`文件，这个文件是用来设计UI界面的，在这个文件中可以通过拖拽的方式来设计UI界面，也可以通过代码的方式来设计UI界面

如果需要创建多语言版本的程序，则需要在`Translation File`部分选择语言，否则默认`<none>`即可`next`

### 主函数解释

```cpp
#include "widget.h"

#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    Widget w;
    w.show();
    return a.exec();
}
```

在上面的程序代码中，首先创建了一个`QApplication`对象，这个对象是Qt应用程序的核心对象，它负责管理应用程序的事件循环和资源管理。`QApplication`为应用程序类，`QApplication a;`（`a`为应用程序对象，有且仅有一个），`QApplication`管理图形用户界面应用程序的控制流和主要设置。`QApplication`是Qt的整个后台管理的命脉，它包含主事件循环，在其中来自窗口系统和其它资源的所有事件处理和调度。它也处理应用程序的初始化和结束，并且提供对话管理。对于任何一个使用Qt的图形用户界面应用程序，都正好存在一个`QApplication`对象，而不论这个应用程序在同一时间内是不是有0、1、2或更多个窗口

接着创建一个`Widget`类对象，调用其中的`show`函数显示窗口，如果要隐藏就调用`hide`函数，这个类定义在`widget.h`中，在下面会介绍

最后，执行`a.exec()`，程序进入消息循环，等待对用户输入进行响应。这里`main`把控制权转交给Qt，Qt完成事件处理工作，当应用程序退出的时候`exec`的值就会返回。在`exec`中，Qt接受并处理用户和系统的事件并且把它们传递给适当的窗口部件

!!! note

    注意，这里的`exec`函数与Linux中的进程程序替换没有任何关系

### `widget.h`文件

```cpp
#ifndef WIDGET_H
#define WIDGET_H

#include <QWidget>

QT_BEGIN_NAMESPACE
namespace Ui { class Widget; }
QT_END_NAMESPACE

class Widget : public QWidget
{
    Q_OBJECT

public:
    Widget(QWidget *parent = nullptr);
    ~Widget();

private:
    Ui::Widget *ui;
};
#endif // WIDGET_H
```

`widget.h`文件中包含了一个`Widget`类的定义，这个类继承自`QWidget`类，`QWidget`类是Qt中所有用户界面对象的基类，它提供了基本的用户界面功能，比如窗口、按钮、文本框等

在`Widget`类，使用到了一个`Q_OBJECT`宏，这个宏是Qt的元对象系统的一部分，它允许在运行时获取对象的类型信息，并且可以在对象之间进行信号和槽的连接，这一点会在后面的章节介绍

在`Widget`类的构造函数中，存在一个`QWidget *parent = nullptr`，在Qt中，所有的窗口部件都是以树形结构组织的（称为对象树），每个窗口部件都有一个父窗口部件，这个父窗口部件就是`parent`，如果没有父窗口部件，则`parent`为`nullptr`，可以类比HTML中的DOM树

再看该类中的一个成员`Ui::Widget *ui;`，这个成员是一个指向`Ui::Widget`类的指针，它包含了UI界面的所有控件，这个类的定义在`ui_widget.h`文件中，这个文件是由Qt Designer自动生成的，不需要手动修改，其定义如下：

```cpp
#ifndef UI_WIDGET_H
#define UI_WIDGET_H

#include <QtCore/QVariant>
#include <QtWidgets/QApplication>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_Widget
{
public:

    void setupUi(QWidget *Widget)
    {
        if (Widget->objectName().isEmpty())
            Widget->setObjectName(QString::fromUtf8("Widget"));
        Widget->resize(800, 600);

        retranslateUi(Widget);

        QMetaObject::connectSlotsByName(Widget);
    } // setupUi

    void retranslateUi(QWidget *Widget)
    {
        Widget->setWindowTitle(QCoreApplication::translate("Widget", "Widget", nullptr));
    } // retranslateUi

};

namespace Ui {
    class Widget: public Ui_Widget {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_WIDGET_H
```

可以看到，实际上`Ui::Widget`类是一个空类，所以其基本等价于`Ui_Widget`类

### `widget.cpp`文件

```cpp
#include "widget.h"
#include "ui_widget.h"

Widget::Widget(QWidget *parent)
    : QWidget(parent)
    , ui(new Ui::Widget)
{
    ui->setupUi(this);
}

Widget::~Widget()
{
    delete ui;
}
```

在上面的定义中，在`Widget`类的构造函数中，调用了`ui->setupUi(this);`，这个函数将当前`Widget`对象传递给了`Ui_Widget`类，简单来说就是将`form file`生成的界面与当前的`Widget`对象关联起来