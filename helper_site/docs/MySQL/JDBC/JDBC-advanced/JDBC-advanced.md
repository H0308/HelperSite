<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# JDBC高级

## JDBC工具类封装（版本1）

前面每一次使用JDBC时都需要进行以下重复的操作：

1. 创建连接池
2. 获取连接
3. 连接的回收

这些重复的操作就会在一个项目中出现代码的冗余，为了解决这个问题，可以对部分代码进行封装从而实现代码复用

为了保证工具类的正常使用，所有成员方法必须是静态的

因为创建连接池的步骤是先于其他操作的，所以可以考虑使用静态代码块包裹，但是为了保证其他方法可以访问到创建的连接池，需要将连接池对象引用作为静态成员属性

获取连接和连接的回收只需要简单封装对应的`getConnection()`方法以及`close()`方法即可

下面的代码以封装Druid连接池结合软编码为例：

```java
public class JDBCUtil {
    // 连接对象引用
    private static DataSource dataSource;

    static {
        // 通过软编码的形式获取到druid连接池配置内容
        Properties properties = new Properties();
        InputStream resourceAsStream = JDBCUtil.class.getClassLoader().getResourceAsStream("druid.properties");
        try {
            properties.load(resourceAsStream);
            dataSource = DruidDataSourceFactory.createDataSource(properties);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // 获取连接对象
    public static Connection getConnection() {
        try {
            return dataSource.getConnection();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // 释放连接
    public static void release(Connection connection) {
        try {
            connection.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
```

!!! note
    需要注意，静态代码块不能使用`throws`向上层抛异常

## `ThreadLocal`类

JDK 1.2的版本中就提供`java.lang.ThreadLocal`，为解决多线程程序的并发问题提供了一种新的思路。使用这个工具类可以很简洁地编写出优美的多线程程序。通常用来在在多线程中管理共享数据库连接、`Session`等。

`ThreadLocal`用于保存某个线程共享变量，原因是在Java中，每一个线程对象中都有一个`ThreadLocalMap<ThreadLocal， Object>`，其`key`就是一个`ThreadLocal`，而`Object`即为该线程的共享变量

而这个返回的`map`是通过`ThreadLocal`的`set`和`get`方法操作的。对于同一个`static ThreadLocal`，不同线程只能从中`get`，`set`，`remove`自己的变量，而不会影响其他线程的变量。其作用如下：

- 在进行对象跨层传递的时候，使用`ThreadLocal`可以避免多次传递，打破层次间的约束
- 线程间数据隔离
- 进行事务操作，用于存储线程事务信息
- 数据库连接，`Session`会话管理

主要使用的方法：

1. 方法：`ThreadLocal对象.get`：获取`ThreadLocal`中当前线程共享变量的值
2. 方法：`ThreadLocal对象.set`：设置`ThreadLocal`中当前线程共享变量的值
3. 方法：`ThreadLocal对象.remove`：移除`ThreadLocal`中当前线程共享变量的值

## 结合`ThreadLocal`类完善`JDBC`工具类

第一个版本的JDBC工具类最大的问题就是如果一个用户在一定的时间内多次访问数据库的情况下，可能会出现多次从连接池获取对象再释放从而造成资源的浪费。例如下面的代码：

```java
@Test
public void test01 () {
    Connection connection1 = JDBCUtil.getConnection();
    Connection connection2 = JDBCUtil.getConnection();
    Connection connection3 = JDBCUtil.getConnection();

    System.out.println(connection1);
    System.out.println(connection2);
    System.out.println(connection3);
}

输出结果：
10月 01, 2024 5:25:39 下午 com.alibaba.druid.pool.DruidDataSource info
INFO: {dataSource-1} inited
com.mysql.cj.jdbc.ConnectionImpl@73a8da0f
com.mysql.cj.jdbc.ConnectionImpl@50dfbc58
com.mysql.cj.jdbc.ConnectionImpl@4416d64f
```

因为一个用户可以看作是一个线程，则可以控制该用户自己所在的线程内使用的是同一个链接对象，这里就需要使用一个`ThreadLocal`来实现，而对应的`ThreadLocal`中的类型就是`Connection`，因为需要确保连接对象在同一个线程内唯一

```java
// 创建ThreadLocal类对象
private static ThreadLocal<Connection> threadLocal = new ThreadLocal<>();
```

确保连接对象在同一个线程内唯一，本质就是为了确保在获取连接对象时是同一个连接对象，所以此时就不可以直接调用`getConnection()`方法获取，而是先从`ThreadLocal`中获取，如果没有则通过`getConnection()`方法获取，否则就直接返回`ThreadLocal`中的`Connection`对象。所以第一个版本的JDBC工具类中的获取连接方法可以修改为：

```java
// 获取连接对象
public static Connection getConnection() {
    try {
        // 从ThreadLocal中获取Connection对象
        Connection connection = threadLocal.get();
        // 如果connection为空，则代表是第一个获取，创建Connection对象
        if (connection == null) {
            connection = dataSource.getConnection();
            // 传入threadLocal中
            threadLocal.set(connection);
        }

        return connection;
    } catch (SQLException e) {
        throw new RuntimeException(e);
    }
}
```

对于释放连接，首先要做的就是从`ThreadLocal`中移除已经存在的`Connection`对象，这里就需要先进行一次获取，确保是某一个线程所拥有的`Connection`对象，随后再释放该对象。因为一个线程内只使用同一个`Connection`对象，所以此处只需要释放一次，从而也就不需要传递参数

```java
// 释放连接
public static void release() {
    try {
        Connection connection = threadLocal.get();
        if (connection != null) {
            threadLocal.remove();
            connection.close();
        }
    } catch (SQLException e) {
        throw new RuntimeException(e);
    }
}
```

对同样的代码进行测试：

```java
@Test
public void test01 () {
    Connection connection1 = JDBCUtil.getConnection();
    Connection connection2 = JDBCUtil.getConnection();
    Connection connection3 = JDBCUtil.getConnection();

    System.out.println(connection1);
    System.out.println(connection2);
    System.out.println(connection3);
}

输出结果：
@Test
public void test01 () {
    Connection connection1 = JDBCUtil.getConnection();
    Connection connection2 = JDBCUtil.getConnection();
    Connection connection3 = JDBCUtil.getConnection();

    System.out.println(connection1);
    System.out.println(connection2);
    System.out.println(connection3);
}

输出结果：
com.mysql.cj.jdbc.ConnectionImpl@11f0a5a1
com.mysql.cj.jdbc.ConnectionImpl@11f0a5a1
com.mysql.cj.jdbc.ConnectionImpl@11f0a5a1
```

使用多线程进行测试：

```java
public class TestUtil {
    public static void main(String[] args) {
        new Thread(() -> {
            Connection connection1 = JDBCUtil.getConnection();
            Connection connection2 = JDBCUtil.getConnection();
            Connection connection3 = JDBCUtil.getConnection();

            System.out.println(connection1);
            System.out.println(connection2);
            System.out.println(connection3);
        }).start();

        new Thread(() -> {
            Connection connection1 = JDBCUtil.getConnection();
            Connection connection2 = JDBCUtil.getConnection();
            Connection connection3 = JDBCUtil.getConnection();

            System.out.println(connection1);
            System.out.println(connection2);
            System.out.println(connection3);
        }).start();
    }
}

输出结果：
com.mysql.cj.jdbc.ConnectionImpl@7b357a56
com.mysql.cj.jdbc.ConnectionImpl@7b357a56
com.mysql.cj.jdbc.ConnectionImpl@7b357a56
com.mysql.cj.jdbc.ConnectionImpl@41d07095
com.mysql.cj.jdbc.ConnectionImpl@41d07095
com.mysql.cj.jdbc.ConnectionImpl@41d07095 
```

## DAO封装介绍

DAO：Data Access Object，数据访问对象

Java是面向对象语言，数据在Java中通常以对象的形式存在。一张表对应一个实体类，一张表的操作对应一个DAO对象。在Java操作数据库时，一般会将对同一张表的增删改查操作统一维护起来，维护的这个类就是DAO层。DAO层只关注对数据库的操作，供业务层Service调用

封装一个简单的员工DAO层接口和实现类：

!!! note
    本次封装只是简单的封装，并没有提供参数传递实参，其他思路基本一致

```java
// 接口
public interface EmployeeDAO {
    // 查询所有员工
    List<Employee> selectAll();

    // 按照员工号查询员工
    Employee SelectById();

    // 修改员工的信息
    int updateEmployee();

    // 插入新员工
    int insertEmployee();

    // 删除员工
    int deleteEmployee();
}

// 实现类
public class EmployeeDAOImpl implements EmployeeDAO {

    @Override
    public List<Employee> selectAll() {
        // 查询
        return List.of();
    }

    @Override
    public Employee SelectById() {
        // 查询
        return null;
    }

    @Override
    public int updateEmployee() {
        // 修改
        return 0;
    }

    @Override
    public int insertEmployee() {
        // 插入
        return 0;
    }

    @Override
    public int deleteEmployee() {
        // 删除
        return 0;
    }
}
```

## BaseDAO工具类设计

`BaseDAO`工具类：基本上每一个数据表都应该有一个对应的DAO接口及其实现类，发现对所有表的操作（增、删、改、查）代码重复度很高，所以可以抽取公共代码，给这些DAO的实现类可以抽取一个公共的父类，复用增删改查的基本操作，称为`BaseDAO`工具类

对于重复度很高的四个操作的代码主要可以分为两种：

1. 查询：主要执行`executeQuery()`。
2. 修改、删除和新增：主要执行`executeInsert()`

作为工具类的`BaseDao`类来说，可以考虑下面的设计思路：

1. 修改、删除和新增：
    1. 参数1：因为是工具类方法，所以无法确定到底是「修改、删除和新增」中的哪一个，所以需要传递一个参数代表SQL语句，其类型需要与创建`preparedStatement()`方法参数类型一致
    2. 参数2：对于三种操作来说，都有可能涉及到具体的内容，所以需要使用在SQL中需要使用到占位符。为了保证本方法对三种操作都有效「修改一般一个占位符->一个内容、删除一般一个占位符->一个内容、新增一般多个占位符->多个内容」，可以考虑使用可变参数，可变参数的类型则为`Object`，确保对于不同的占位符对应的具体内容都可以正常接收
    3. 方法体：
        1. 获取连接对象
        2. 传入SQL语句
        3. 判断是否有占位符，如果有，根据可变参数个数填入可变参数数组中的数据；否则进行后面的步骤
        4. 调用`executeUpdate()`方法，并获取影响的行数
        5. 释放资源
        6. 返回对应的行数

    示例代码：

    ```java
    // 修改、新增和删除
    public static int modify(String sql, Object...params) throws Exception{
        // 获取连接对象
        Connection connection = JDBCUtil.getConnection();
        // 执行SQL语句
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
        // 判断是否有参数
        for (int i = 0; params != null &&  i < params.length ; i++) {
            preparedStatement.setObject(i + 1, params[i]);
        }

        int i = preparedStatement.executeUpdate();
        // 关闭连接
        JDBCUtil.release();
        preparedStatement.close();

        return i;
    }
    ```

    !!! note
        需要注意：因为不确定SQL语句中每一个可用占位符对应的类型，所以此处只能使用`setObject()`方法，因为`i`从0开始，而占位符从1开始，所以需要传入`i + 1`，在函数返回影响的行数之前，需要进行资源释放防止资源泄漏

2. 查询：查询存在三种情况：1. 单行单列 2. 单行多列 3. 多行多列。对于这三种情况来说，可以返回一个`List`集合：单行单列，集合中只有一个值（可以通过`List`集合的`getFirst()`方法获取，也可以通过`get(0)`获取）；单行多列，集合中只有一个对象（可以通过`List`集合的`getFirst()`方法获取，也可以通过`get(0)`获取）；多行多列，集合中有多个对象。考虑到将来可能查询的不只是一种类型（例如员工类、学生类或者老师类等），所以返回的`List`集合对应的泛型位置不可以是具体的类型，此时需要用到泛型方法
    1. 参数3：单行单列、单行多列和多行多列都有可能涉及到占位符，所以需要使用到可变参数
    2. 参数2：所有操作都涉及到SQL语句，所以需要传递对应的SQL语句
    3. 参数1：通过前面两个参数可以获取到一个结果集，需要遍历结果集将结果集中的数据存储到集合泛型对应的类的每一个字段中，但是会出现一个问题，因为无法确定具体是哪一个类型，也就无法直接确定该类中的字段（泛型没有具体字段）。直接调用行不通，那就反着来：使用反射，在传递参数时指示调用者需要传递具体类的类对象，在方法中就可以使用该类对象调用对应获取私有成员的方法间接获取到对应类的字段，再进行赋值，将结果存储到集合中
    4. 方法体：
        1. 获取连接对象
        2. 传入SQL语句
        3. 判断是否有占位符，如果有，根据可变参数个数填入可变参数数组中的数据；否则进行后面的步骤
        4. 执行SQL语句
        5. 实例化集合
        6. 获取结果集
        7. 获取结果的列数，作为工具类的方法，无法确定一共有多少个字段，所以需要使用结果集中的`getMetaData()`方法获取到一个`ResultSetMetaData`对象（结果集元数据对象），该对象中有一个方法`getColumnCount()`可以获取到结果集的列数，一个列代表一个字段，有了列数，也就可以确定字段的个数
        8. 遍历结果集，在遍历过程结果集中，通过反射创建一个对象，最好使用无参构造。接下来遍历每一列，这个过程中需要获取到每一行每一列对应的值，可以使用结果集的`getObject()`方法，因为无法确定具体字段，也就无法确定`getXxx`方法的具体类型，使用`getObject()`最合适。接着通过调用结果集元数据对象的`getColumnLabel()`方法（不推荐使用`getColumnName()`，因为这个方法只会取到列的真实名称，忽略别名）获取到列名（或者列的别名）。通过反射的`getDeclaredFieldName()`方法，参数传递列名获取到一个字段，调用其`set()`方法，将创建的对象和值传入方法中即可，如此往复直到结束一行数据，将对象存入到集合中。注意这一过程中，尽量执行「破私有为公有」
        9. 释放资源
        10. 返回`List`集合

    示例代码：

    ```java
    // 查询
    public static <T> List<T> select(Class<T> classType, String sql, Object...params) throws Exception{
        Connection connection = JDBCUtil.getConnection();
        PreparedStatement preparedStatement = connection.prepareStatement(sql);
        for (int i = 0; params != null && i < params.length; i++) {
            preparedStatement.setObject(i + 1, params[i]);
        }
        ArrayList<T> ts = new ArrayList<>();
        ResultSet resultSet = preparedStatement.executeQuery();
        // 获取结果集元数据
        ResultSetMetaData metaData = resultSet.getMetaData();
        // 获取列
        int columnCount = metaData.getColumnCount();
        while (resultSet.next()) {
            // 反射创建一个对象
            T t = classType.newInstance();

            // 遍历列
            for (int i = 0; i < columnCount; i++) {
                Object object = resultSet.getObject(i + 1);
                // 获取列名
                String columnLabel = metaData.getColumnLabel(i + 1);
                // 反射获取字段
                Field declaredField = classType.getDeclaredField(columnLabel);
                declaredField.setAccessible(true);
                // 通过反射赋值
                declaredField.set(t, object);
            }

            ts.add(t);
        }

        // 释放资源
        resultSet.close();
        preparedStatement.close();
        JDBCUtil.release();

        // 返回结果
        return ts;
    }
    ```

## DAO实现类与BaseDao结合（测试）

员工实体类：

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Employee {
    private Integer empId;
    private String empName;
    private Double empSalary;
    private Integer empAge;
}
```

DAO实现类完善：

```java
public class EmployeeDAOImpl implements EmployeeDAO{

    @Override
    public List<Employee> selectAll(){
        try {
            return BaseDao.select(Employee.class, "SELECT emp_id empId, emp_name empName, emp_salary empSalary, emp_age empAge FROM t_emp", null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public Employee SelectById() {
        // 查询
        try {
            List<Employee> list = BaseDao.select(Employee.class, "SELECT emp_id empId, emp_name empName, emp_salary empSalary, emp_age empAge FROM t_emp where emp_age = ?", 26);
            // 单行单列只有一个对象，只获取第一个对象
            return list.getFirst();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public int updateEmployee() {
        // 修改
        try {
            return BaseDao.modify("update t_emp set emp_name = '村上春树' where emp_age = ?", 18);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public int insertEmployee() {
        // 插入
        try {
            return BaseDao.modify("insert into t_emp (emp_name, emp_salary, emp_age) values (?, ?, ?)", "王五", 684.11, 33);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public int deleteEmployee() {
        try {
            return BaseDao.modify("delete from t_emp where emp_name = ?", "张三");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
```

!!! note
    需要注意，在查询时，因为`Employee`类字段名为小驼峰式，与数据库中的表头不对应，所以需要在查询时为表头取别名

测试方法：

```java
@Test
public void test02 () {
    // 查询所有
    EmployeeDAOImpl employee = new EmployeeDAOImpl();
    List<Employee> employees = employee.selectAll();
    employees.forEach(System.out::println);

    // 按照id查询
    Employee employee1 = employee.SelectById();
    System.out.println(employee1);

    // 修改、删除和新增
    int i = employee.updateEmployee();
    int i1 = employee.deleteEmployee();
    int i2 = employee.insertEmployee();
    System.out.println(i);
    System.out.println(i1);
    System.out.println(i2);
}
```