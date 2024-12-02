# 关于XML文件

## 介绍

XML是EXtensible Markup Language的缩写，翻译过来就是可扩展标记语言。所以很明显，XML和HTML一样都是标记语言，也就是说它们的基本语法都是标签。

- 可扩展表示三个字表面上的意思是XML允许自定义格式。但这不代表可以随便写

- 在XML基本语法规范的基础上，你使用的那些第三方应用程序、框架会通过XML约束的方式强制规定配置文件中可以写什么和怎么写

- XML基本语法这个知识点的定位是：我们不需要从零开始，从头到尾的一行一行编写XML文档，而是在第三方应用程序、框架已提供的配置文件的基础上修改。要改成什么样取决于你的需求，而怎么改取决XML基本语法和具体的XML约束

## 在JavaWeb中常见的配置文件

1. `properties`文件，例如前面使用的JDBC中druid连接池就是使用`properties`文件作为配置文件
2. `XML`文件，例如Tomcat就是使用`XML`文件作为配置文件
3. `YAML`文件，例如SpringBoot就是使用`YAML`作为配置文件
4. `json`文件，通常用来做文件传输，也可以用来做前端或者移动端的配置文件

## properties配置文件回顾

前面在使用JDBC连接数据库时，为了防止硬编码使用了配置文件，下面是对应的文件内容：

```properties
driverClassName=com.mysql.jdbc.Driver
url=jdbc:mysql:///databaseTest
username=root
password=123456
initialSize=10
maxActive=20
```

其基本语法规范见对应的[properties文件要求部分](https://www.help-doc.top/Java/16.%20Java%E7%9A%84IO%E6%B5%81/16.%20Java%E7%9A%84IO%E6%B5%81.html#propertiesio)

## 引入XML文件配置

下面是XML文件内容示例：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<students>
    <student>
        <name>张三</name>
        <age>18</age>
    </student>
    <student>
        <name>李四</name>
        <age>20</age>
    </student>
</students>
```

在上面的代码中，第一行是`xml`文件所必须的内容，被称为`xml`文档声明。这部分基本上就是固定格式，一般情况下也不会修改，要注意的是文档声明一定要从第一行第一列开始写。接着`<students></students>`为跟标签，在`xml`文件中，**根标签只能有一对**，与HTML中的标签规则一样，**双标签：开始标签和结束标签必须成对出现，单标签：单标签在标签内关闭**，例如上面代码中`<students></students>`、`<student></student>`等，并且，**标签可以嵌套，但是不能交叉嵌套，但是注释不可以嵌套**，例如上面代码中`<students></students>`中嵌套了`<student></student>`，`<student></student>`中嵌套了`<name></name>`和`<age></age>`

另外，在`xml`中每个标签都可以有属性，属性的格式如下：

1. 属性必须有值
2. 属性值必须加引号，单引号或者双引号都行

前面提到`xml`文件可以自定义格式，但是为了保证标准性，有常用的两种约束：

1. DTD约束：具有简单易上手的特点，但是约束力不强
2. Schema约束：具有复杂难上手的特点，但是约束力强

后面主要会使用Schema约束来编写XML配置文件，Schema约束要求在一个XML文档中，所有标签以及所有属性都必须在约束中有明确的定义

下面是一个`web.xml`文件中的约束声明示例：

```xml
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee 
         http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
```

在上面的声明中，在`xsi:schemaLocation`属性值中有个后缀为`.xsd`的文件，这个就代表当前`xml`文件使用的是Schema约束，如果后缀为`.dtd`的文件，则代表当前`xml`文件使用的是DTD约束

## 使用DOM4J读取XML配置文件内容（了解）

!!! note

    因为后面框架都会自动读取XML配置文件内容，而不需要程序员编写代码读取，所以本部分了解一下即可

使用DOM4J读取的基本步骤如下：

1. 导入`jar`包
2. 创建解析器对象（`SAXReader`）
3. 解析`xml`文件，获得`Document`对象
4. 获取根节点`RootElement`
5. 获取根节点下的子节点

常用API介绍如下：

1. 创建`SAXReader`对象

    ```java
    SAXReader saxReader = new SAXReader();
    ```

2. 解析XML获取`Document`对象：需要传入要解析的XML文件的字节输入流

    ```java
    Document document = reader.read(inputStream);
    ```

3. 获取文档的根标签

    ```java
    Element rootElement = documen.getRootElement()
    ```

4. 获取标签的子标签

    ```java
    //获取所有子标签
    List<Element> sonElementList = rootElement.elements();
    //获取指定标签名的子标签
    List<Element> sonElementList = rootElement.elements("标签名");
    ```

5. 获取标签体内的文本

    ```java
    String text = element.getText();
    ```

6. 获取标签的某个属性的值，例如`id = "001"`

    ```java
    String value = element.attributeValue("001");
    ```

例如下面的代码：

=== "XML文件内容（不使用约束）"

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>

    <jdbc>
        <url>jdbc:mysql://localhost:3306/atguigu</url>
        <username>root</username>
        <passwd>037477..</passwd>
        <driver>com.mysql.cj.jdbc.Driver</driver>
    </jdbc>
    ```

=== "Java代码"

    ```java
    public class ReadXML {
        @Test
        public void test() throws DocumentException {
            // 从resources文件夹获取到xml文件作为输入流
            InputStream resourceAsStream = ReadXML.class.getClassLoader().getResourceAsStream("test.xml");
            // 创建SAXReader对象
            SAXReader saxReader = new SAXReader();
            // 解析XML文件获取Document对象
            Document document = saxReader.read(resourceAsStream);
            // 获取根标签
            Element root = document.getRootElement();
            // 打印跟标签的名称
            System.out.println(root.getName());
            // 根据root标签获取其所有子标签
            List<Element> elements = root.elements();
            // 遍历所有子节点
            for (Element element : elements) {
                // 获取子标签的名称
                System.out.println("——"+element.getName());
                // 获取子标签的值
                System.out.println("————"+element.getText());
            }
        }
    }

    输出结果：
    jdbc
    ——url
    ————jdbc:mysql://localhost:3306/atguigu
    ——username
    ————root
    ——passwd
    ————037477..
    ——driver
    ————com.mysql.cj.jdbc.Driver
    ```