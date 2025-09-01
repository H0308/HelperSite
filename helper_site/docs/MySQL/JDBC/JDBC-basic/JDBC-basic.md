<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# JDBC基础

## JDBC介绍

在开发Java程序时，数据都是存储在内存中，属于临时存储，当程序停止或重启时，内存中的数据就丢失了，为了解决数据的长期存储问题，有如下解决方案：

1. 数据通过I/O流技术，存储在本地磁盘中，解决了持久化问题，但是没有结构和逻辑，不方便管理和维护
2. 通过关系型数据库，将数据按照特定的格式交由数据库管理系统维护。关系型数据库是通过库和表分隔不同的数据，表中数据存储的方式是行和列，区分相同格式不同值的数据

数据存储在数据库，仅仅解决了数据存储的问题，但当程序运行时，需要读取数据，以及对数据做增删改的操作，就需要通过程序的代码进行获取，而在Java中，从数据库获取数据就需要使用到JDBC

JDBC：Java Database Connectivity，意为Java数据库连接。JDBC是Java提供的一组独立于任何数据库管理系统的API。Java提供接口规范，由各个数据库厂商提供接口的实现，厂商提供的实现类封装成`jar`文件，也就是俗称的数据库驱动`jar`包。学习JDBC，充分体现了面向接口编程的好处，程序员只关心标准和规范，而无需关注实现过程

<img src="JDBC基础.assets\image.png">

## JDBC的核心组成

- 接口规范：
    - 为了项目代码的可移植性，可维护性，SUN公司从最初就制定了Java程序连接各种数据库的统一接口规范。这样的话，不管是连接哪一种DBMS软件，Java代码可以保持一致性
    - 接口存储在`java.sql`和`javax.sql`包下
- 实现规范：
    - 因为各个数据库厂商的DBMS软件各有不同，那么各自的内部如何通过SQL实现增、删、改、查等操作管理数据，只有这个数据库厂商自己更清楚，因此把接口规范的实现交给各个数据库厂商自己实现
    - 厂商将实现内容和过程封装成`jar`文件，我们程序员只需要将`jar`文件引入到项目中集成即可，就可以开发调用实现过程操作数据库了

## JDBC搭建步骤

1. 准备数据库。
2. 官网下载数据库连接驱动`jar`包：[驱动下载](https://downloads.mysql.com/archives/c-j/)
3. 创建Java项目，在项目下创建`lib`文件夹，将下载的驱动`jar`包复制到文件夹里。
4. 选中`lib`文件夹右键->Add as Library，与项目集成。
5. 编写代码

!!! note
    需要注意，在下载驱动时，建议选择8.0.x版本的数据库驱动

## JDBC基础六大步骤

1. 注册驱动，通过`com.mysql.cj.jdbc.Driver`类获取类对象
2. 获取数据库连接，使用`DriverManager`类中的`getConnection(String url, String username, String password)`方法获取
    1. 第一个参数为数据库所在的IP地址以、端口号和数据库名，例如`jdbc:mysql://localhost:3306//数据库名`，使用JDBC的链接需要使用前缀：`jdbc:mysql://`
    2. 第二个参数为数据库用户名
    3. 第三个参数为数据库用户名对应的密码
3. 创建`Statement`（后面由`PreparedStatement`替代）对象，通过`Connection`类对象（第二步获取数据库连接方法的返回值）调用`createStatement()`方法获取到`Statement`类对象
4. 创建SQL语句并执行，通过`Statement`类对象调用`executeQuery(String sql)`方法获取结果集
5. 读取结果集打印结果，调用结果集中的`next()`方法判断是否有下一行，因为默认光标会处于查询结果的虚拟表的表头（标题）位置，所以需要读取数据就需要使用`next()`判断是否有下一行再移动到下一行，有多行时需要使用到`while`循环判断是否有下一行。在循环内部，用变量接收获取到的值，通过`getXxx`方法获取每一个字段的值，打印即可
6. 释放资源：遵循先开后关的原则，关闭结果集、`Statement`对象和连接对象

例如，下面的代码：

```java
public class QuickIn {
    public static void main(String[] args) throws Exception{
        // 1. 注册驱动
        Class<?> aClass = Class.forName("com.mysql.cj.jdbc.Driver");

        // 2. 获取数据库连接
        String url = "jdbc:mysql://localhost:3306/databaseTest";
        String username = "root";
        String password = "123456";
        Connection connection = DriverManager.getConnection(url, username, password);

        // 3. 创建Statement对象
        PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM t_emp");

        // 4. 执行SQL语句获取对象
        ResultSet resultSet = preparedStatement.executeQuery();

        // 5. 处理结果
        while(resultSet.next()) {
            int empId = resultSet.getInt("emp_id");
            String empName = resultSet.getString("emp_name");
            String empSalary = resultSet.getString("emp_salary");
            int empAge = resultSet.getInt("emp_age");
            System.out.println(empId + "\t" + empName + "\t" + empSalary + "\t" + empAge);
        }

        // 6.释放资源(先开后关原则)
        resultSet.close();
        preparedStatement.close();
        connection.close();
    }
}
```

## JDBC六大步骤解析

### 注册JDBC驱动

基本方式：注册驱动，通过`com.mysql.cj.jdbc.Driver`类获取类对象

在 Java 中，当使用 JDBC（Java Database Connectivity）连接数据库时，需要加载数据库特定的驱动程序，以便与数据库进行通信。加载驱动程序的目的是为了注册驱动程序，使得 JDBC API 能够识别并与特定的数据库进行交互。从JDK6开始，不再需要显式地调用 `Class.forName()` 来加载 JDBC 驱动程序，只要在类路径中集成了对应的`jar`文件，会自动在初始化时注册驱动程序。

### 获取数据库连接

`Connection`接口是JDBC API的重要接口，用于建立与数据库的通信通道。换而言之，`Connection`对象不为空，则代表一次数据库连接。

在建立连接时，需要指定数据库URL、用户名、密码参数。如果连接的是本机的数据库，则可以省略URL写为：`jdbc:mysql:///数据库名`。
如果对应的URL中有参数，则需要使用`?`分隔数据库名和参数，每一个参数之间用`&`链接：`jdbc:mysql://IP地址:端口号/数据库名称?参数键值对1&参数键值对2`

`Connection` 接口还负责管理事务，`Connection` 接口提供了 `commit` 和 `rollback` 方法，用于提交事务和回滚事务。可以创建 `Statement` 对象，用于执行 SQL 语句并与数据库进行交互。

在使用JDBC技术时，必须要先获取`Connection`对象，在使用完毕后，要释放资源，避免资源占用浪费及泄漏。

### 创建`Statement`对象（使用`PreparedStatement`替换）

`Statement` 接口用于执行 SQL 语句并与数据库进行交互。它是 JDBC API 中的一个重要接口。通过 `Statement` 对象，可以向数据库发送 SQL 语句并获取执行结果。结果集中的结果可以是一个或多个结果。

对于不同的情况，结果集中存储着不同的内容：

1. 增删改：受影响行数单个结果。
2. 查询：单行单列、多行多列、单行多列等结果。

但是`Statement` 接口在执行SQL语句时，会产生SQL注入攻击问题：当使用 `Statement` 执行动态构建的 SQL 查询时，往往需要将查询条件（例如`where`后的条件）与 SQL 语句拼接在一起，此时如果`where`后的条件始终为真，就会返回整个表的结果

例如，下面的代码运行到数据库中就会出现SQL注入攻击问题：

```java
public class QuickIn {
    public static void main(String[] args) throws Exception{
        // ...
        Statement statement = connection.createStatement();

        // 4. 执行SQL语句获取对象
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        ResultSet resultSet = statement.executeQuery("select * from t_emp where '"+name+"'");
        
        // ...
    }
}
```

上面的代码中，如果`name`中的数据通过字符串拼接导致`where`中的条件始终为真（例如输入`abc' or '1' = '1`），就会返回整个表的信息

为了防止出现SQL注入攻击问题，后面使用`PreparedStatement`接口，`PreparedStatement`是`Statement`的子接口

之所以使用`preparedStatement`接口可以防止SQL注入问题，是因为其在使用时需要传入一个带有占位符的SQL语句，例如`SELECT ``***** ``FROM t_emp where emp_age > ?`，其中的`?`即为占位符，对于传入到`?`的数据会默认被`''`包裹，并且传入的数据如果出现数据库中的关键信息，例如`''`会被自动转义

使用`PreparedStatement`接口需要使用`Connection`中的`prepareStatement(String sql)`方法，该方法参数传递一个SQL语句，其中可以含有占位符，返回值是一个`PreparedStatement`对象，使用如下：

```java
PreparedStatement preparedStatement = connection.prepareStatement("select * from t_emp where ? ");
```

使用`PreparedStatement`还可以达到性能提升，`PreparedStatement`是预编译SQL语句，同一SQL语句多次执行的情况下，可以复用，不必每次重新编译和解析

### 获取结果集

刚开始使用了`Statement`对象获取结果集，但是`Statement`会有注入攻击问题，所以转用`PreparedStatement`对象获取结果集，调用`executeQuery()`方法即可，使用如下：

```java
PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM t_emp");
ResultSet resultSet = preparedStatement.executeQuery();
```

需要注意，如果在创建`PreparedStatement`对象使用了占位符，则需要为填充每一个占位符，此时需要使用`setXxx()`，该方法有两个参数，第一个参数代表占位符的下标，从1开始，1表示第一个占位符，以此类推，第二个参数为需要填充占位符的内容

例如下面的代码：

```java
PreparedStatement preparedStatement = connection.prepareStatement("select * from t_emp where ? ");
preparedStatement.setString(1, "emp_age > 25");
ResultSet resultSet = preparedStatement.executeQuery();
```

使用`PreparedStatement`替换`Statement`防止SQL注入攻击：

```java
public class QuickIn {
    public static void main(String[] args) throws Exception{
        // ...
        PreparedStatement preparedStatement = connection.prepareStatement("select * from t_emp where ? ");


        // 4. 执行SQL语句获取对象
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        preparedStatement.setString(1, name);
        ResultSet resultSet = preparedStatement.executeQuery();
        
        // ...
    }
}
```

此时，如果继续输入`abc' or '1' = '1`，在SQL中会被替换为如下：

```sql
select * from t_emp where 'abc\' or \'1\' = \'1'
```

而因为这个数据在指定的数据库中并不存在，所以查询结果为空，而不会返回整个表的数据

### 处理结果

前面的`PreparedStatement`对象调用`executeQuery()`方法获取到对应的结果集后就可以处理结果集中的结果，`next()`方法可以达到先判断是否有下一行再使光标移动到下一行，尽管确定结果集中肯定只有一行实际数据，但是依旧需要调用一次`next()`方法，获取每一列的结果则调用`getXxx()`方法，这个方法存在两个传参方式：

1. 列标：除非只有一个数据，一般不常用
2. 列名：推荐使用

### 关闭资源

在JDBC中，有些资源不能被立即释放，这个做法可以有下面的好处：

1. 避免内存泄漏：如果一个`ResultSet`或`Statement`没有被正确关闭，那么它们所引用的对象将不会被垃圾回收器回收，从而导致内存泄漏
2. 防止资源耗尽：数据库连接池通常有最大连接数的限制。如果连接没有被释放，那么新的请求可能会因为没有可用的连接而阻塞或者失败
3. 提高性能：及时释放不再使用的资源可以减少内存使用，并且使连接能够尽快被重用，这有助于提高应用程序的性能

## 基于`PreparedStatement`接口实现CRUD

CRUD，即Create（创建）、Read（读取）、Update（更新）和Delete（删除）四个单词的首字母缩写。它代表了一组基本的操作，用于与数据库中的数据进行交互。在软件开发中，特别是涉及到数据库的应用程序开发时，CRUD操作是最常见的数据访问模式之一

### 查询单行单列数据

所谓单行单列，就是结果集中只有一行一列存在实际数据，例如下图中的结果就属于单行单列数据：

<img src="JDBC基础.assets\image1.png">

代码如下：

```java
public class SingleRow_SingleCol {
    @Test
    public void Test() throws Exception{
        Connection connection = DriverManager.getConnection("jdbc:mysql:///databaseTest", "root", "123456");
        PreparedStatement preparedStatement = connection.prepareStatement("select count(*) count from t_emp");
        ResultSet resultSet = preparedStatement.executeQuery();
        if(resultSet.next()) {
            System.out.println(resultSet.getInt("count"));
        }

        resultSet.close();
        preparedStatement.close();
        connection.close();
    }
}
```

尽管只有一行数据，因为光标还在表头位置，需要先使用`next()`判断是否有下一行，即是否有结果，再移动到下一行，即移动到结果行，最后读取数据

但是更推荐使用循环进行：

```java
public class SingleRow_SingleCol {
    @Test
    public void Test() throws Exception{
        Connection connection = DriverManager.getConnection("jdbc:mysql:///databaseTest", "root", "123456");
        PreparedStatement preparedStatement = connection.prepareStatement("select count(*) count from t_emp");
        ResultSet resultSet = preparedStatement.executeQuery();
        while (resultSet.next()) {
            System.out.println(resultSet.getInt("count"));
        }

        resultSet.close();
        preparedStatement.close();
        connection.close();
    }
}
```

### 查询单行多列数据

所谓单行单列，就是结果集中只有一行、但是有多列存在实际数据，例如下图中的结果就属于单行单列数据：

<img src="JDBC基础.assets\image2.png">

示例代码：

```java
public class SingleRow_MultiCol {
    @Test
    public void test() throws Exception{
        Connection connection = DriverManager.getConnection("jdbc:mysql:///databaseTest", "root", "123456");
        PreparedStatement preparedStatement = connection.prepareStatement("select * from t_emp where emp_age = 26");
        ResultSet resultSet = preparedStatement.executeQuery();
        while (resultSet.next()) {
            int empId = resultSet.getInt("emp_id");
            String empName = resultSet.getString("emp_name");
            double empSalary = resultSet.getDouble("emp_salary");
            int empAge = resultSet.getInt("emp_age");
            System.out.println(empId + "\t" + empName + "\t" + empSalary + "\t" + empAge);
        }

        resultSet.close();
        preparedStatement.close();
        connection.close();
    }
}
```

与单行单列一样可以将`while`替换成`if`进行判断

### 查询多行多列数据

见基础六大步骤部分的代码演示

### 新增

示例代码：

```java
public class InsertNew {
    @Test
    public void test() throws Exception{
        Connection connection = DriverManager.getConnection("jdbc:mysql:///databaseTest", "root", "123456");
        PreparedStatement preparedStatement = connection.prepareStatement("insert into t_emp (emp_name,emp_salary,emp_age)values  (?, ?,?)");
        preparedStatement.setString(1, "张三");
        preparedStatement.setDouble(2, 564.35);
        preparedStatement.setInt(3, 18);
        int resultSet = preparedStatement.executeUpdate();

        System.out.println(resultSet);

        preparedStatement.close();
        connection.close();
    }
}
```

对于新增来说，除了在调用`prepareStatement`时传递的SQL语句不同以外，还需要注意获取结果的方法也不同，前面执行查询时`executeQuery()`方法，而这里执行插入是`executeUpdate()`，而对于这个方法，其返回值是受影响的行数，而不是一个集合

### 修改

示例代码：

```java
public class UpdateExisted {
    @Test
    public void test() throws Exception{
        Connection connection = DriverManager.getConnection("jdbc:mysql:///databaseTest", "root", "123456");
        PreparedStatement preparedStatement = connection.prepareStatement("update t_emp set emp_salary = 1000 where emp_age = 26");
        int i = preparedStatement.executeUpdate();

        System.out.println(i);

        preparedStatement.close();
        connection.close();
    }
}
```

对于修改表来说，与新增一样都是对表中的数据进行操作，所以执行修改依旧是调用`executeUpdate()`方法，同样该方法的返回值是受影响的行数

### 删除

示例代码：

```java
public class DeleteExisted {
    @Test
    public void test() throws Exception{
        Connection connection = DriverManager.getConnection("jdbc:mysql:///databaseTest", "root", "123456");
        PreparedStatement preparedStatement = connection.prepareStatement("delete from t_emp where emp_name = '张三'");
        int i = preparedStatement.executeUpdate();

        System.out.println(i);

        preparedStatement.close();
        connection.close();
    }
}
```

对于修改表来说，与新增一样都是对表中的数据进行操作，所以执行修改依旧是调用`executeUpdate()`方法，同样该方法的返回值是受影响的行数

## 常见问题

### 资源管理问题

在使用JDBC的相关资源时，比如`Connection`、`PreparedStatement`、`ResultSet`，使用完毕后，要及时关闭这些资源以释放数据库服务器资源和避免内存泄漏是很重要的

### SQL语法问题

`java.sql.SQLSyntaxErrorException`：SQL语句错误异常，一般有几种可能：

1. SQL语句有错误，检查SQL语句，建议SQL语句在SQL工具中测试后再复制到Java程序中
2. 连接数据库的URL中，数据库名称编写错误，也会报该异常

### SQL语句未设置参数问题

`java.sql.SQLException：No value specified for parameter 1`：在使用预编译SQL语句时，如果有`?`占位符，要为每一个占位符赋值，否则报该错误

### 用户名或密码错误问题

在连接数据库的URL中，如果IP或端口写错了，会报如下异常：

`com.mysql.cj.jdbc.exceptions.CommunicationsException: Communications link failure`