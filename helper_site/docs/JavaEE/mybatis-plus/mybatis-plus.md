<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# MyBatis-Plus

## 依赖引入

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
    <version>3.5.14</version>
</dependency>
```

## 数据准备

```sql
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for book_info
-- ----------------------------
DROP TABLE IF EXISTS `book_info`;
CREATE TABLE `book_info`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `book_name` varchar(127) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `author` varchar(127) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `count` int NOT NULL,
  `price` decimal(7, 2) NOT NULL,
  `publish` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` tinyint NULL DEFAULT 1 COMMENT '0-⽆效, 1-正常, 2-不允许借阅',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of book_info
-- ----------------------------
INSERT INTO `book_info` VALUES (1, '活着', '余华', 29, 22.00, '北京文艺出版社', 1, '2025-09-14 19:38:41', '2025-09-15 19:50:52');
INSERT INTO `book_info` VALUES (2, '平凡的世界', '路遥', 5, 98.56, '北京十月文艺出版社', 1, '2025-09-14 19:38:41', '2025-09-15 19:52:02');
INSERT INTO `book_info` VALUES (3, '三体', '刘慈欣', 9, 102.67, '重庆出版社', 1, '2025-09-14 19:38:41', '2025-09-15 19:52:09');
INSERT INTO `book_info` VALUES (4, '金字塔原理', '麦肯锡', 16, 178.00, '民主与建设出版社', 1, '2025-09-14 19:38:41', '2025-09-15 19:54:32');
INSERT INTO `book_info` VALUES (5, '云边有个小卖部', '张嘉佳', 1, 54.00, '湖南文艺出版社', 1, '2025-09-14 21:35:55', '2025-09-14 21:41:07');
INSERT INTO `book_info` VALUES (6, '被讨厌的勇气：“自我启发之父”阿德勒的哲学课', '岸见一郎', 1, 58.00, '机械工业出版社', 1, '2025-09-15 18:15:04', '2025-09-15 18:15:04');
INSERT INTO `book_info` VALUES (7, '流浪地球', '刘慈欣', 1, 87.00, '四川科学技术出版社', 1, '2025-09-15 18:16:33', '2025-09-15 19:55:21');
INSERT INTO `book_info` VALUES (8, '图书2', '作者2', 29, 22.00, '出版社2', 1, '2025-09-15 21:26:39', '2025-09-15 21:26:39');
INSERT INTO `book_info` VALUES (9, '图书3', '作者2', 29, 22.00, '出版社3', 0, '2025-09-15 21:26:39', '2025-09-20 17:38:50');
INSERT INTO `book_info` VALUES (10, '图书4', '作者2', 29, 22.00, '出版社1', 0, '2025-09-15 21:26:39', '2025-09-20 14:50:07');
INSERT INTO `book_info` VALUES (11, '图书5', '作者2', 29, 22.00, '出版社1', 1, '2025-09-15 21:26:39', '2025-09-15 21:26:39');
INSERT INTO `book_info` VALUES (12, '图书6', '作者2', 29, 22.00, '出版社1', 1, '2025-09-15 21:26:39', '2025-09-15 21:26:39');
INSERT INTO `book_info` VALUES (13, '图书7', '作者2', 29, 22.00, '出版社1', 1, '2025-09-15 21:26:39', '2025-09-15 21:26:39');
INSERT INTO `book_info` VALUES (14, '图书8', '作者2', 29, 22.00, '出版社1', 1, '2025-09-15 21:26:39', '2025-09-15 21:26:39');
INSERT INTO `book_info` VALUES (15, '图书9', '作者2', 29, 22.00, '出版社1', 1, '2025-09-15 21:26:39', '2025-09-15 21:26:39');
INSERT INTO `book_info` VALUES (16, '图书10', '作者2', 29, 22.00, '出版社1', 1, '2025-09-15 21:26:39', '2025-09-15 21:26:39');
INSERT INTO `book_info` VALUES (17, '图书11', '作者2', 29, 22.00, '出版社1', 0, '2025-09-15 21:26:39', '2025-09-20 14:52:12');
INSERT INTO `book_info` VALUES (18, '图书12', '作者2', 29, 22.00, '出版社1', 0, '2025-09-15 21:26:39', '2025-09-20 14:52:12');
INSERT INTO `book_info` VALUES (19, '图书13', '作者2', 29, 22.00, '出版社1', 0, '2025-09-15 21:26:39', '2025-09-20 14:52:12');
INSERT INTO `book_info` VALUES (20, '图书14', '作者2', 29, 22.00, '出版社1', 1, '2025-09-15 21:26:39', '2025-09-15 21:26:39');
INSERT INTO `book_info` VALUES (21, '图书15', '作者2', 29, 22.00, '出版社1', 1, '2025-09-15 21:26:39', '2025-09-15 21:26:39');
INSERT INTO `book_info` VALUES (22, '图书16', '作者2', 29, 22.00, '出版社1', 1, '2025-09-15 21:26:39', '2025-09-15 21:26:39');
INSERT INTO `book_info` VALUES (23, '图书17', '作者2', 29, 22.00, '出版社1', 1, '2025-09-15 21:26:39', '2025-09-15 21:26:39');
INSERT INTO `book_info` VALUES (24, '图书18', '作者2', 29, 22.00, '出版社1', 1, '2025-09-15 21:26:39', '2025-09-15 21:26:39');
INSERT INTO `book_info` VALUES (25, '图书19', '作者2', 29, 22.00, '出版社1', 1, '2025-09-15 21:26:39', '2025-09-15 21:26:39');
INSERT INTO `book_info` VALUES (26, '图书20', '作者2', 29, 22.00, '出版社1', 1, '2025-09-15 21:26:39', '2025-09-15 21:26:39');
INSERT INTO `book_info` VALUES (27, '图书21', '作者2', 29, 22.00, '出版社1', 1, '2025-09-15 21:26:39', '2025-09-15 21:26:39');


SET FOREIGN_KEY_CHECKS = 1;
```

## MyBatis-Plus插件

### 分页插件

如果MyBatisPlus的版本是3.5.9以上的，那么需要引入下面的`jsqlparser`依赖

```xml
<!-- https://mvnrepository.com/artifact/com.baomidou/mybatis-plus-jsqlparser -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-jsqlparser</artifactId>
    <version>3.5.14</version>
</dependency>
```

先创建配置类：

```java
@Configuration
public class MybatisPlusConfig {

    // 分页插件
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor mybatisPlusInterceptor = new MybatisPlusInterceptor();
        PaginationInnerInterceptor paginationInnerInterceptor = new PaginationInnerInterceptor(DbType.MYSQL);
        paginationInnerInterceptor.setMaxLimit(1000L);
        mybatisPlusInterceptor.addInnerInterceptor(paginationInnerInterceptor);
        return mybatisPlusInterceptor;
    }
}
```

MyBatis-Plus要实现分页查询需要指定两个参数：

1. 当前页码
2. 每一页的条目个数

在查询前需要先创建一个`Page`类对象，将上面两个参数传入构造函数中。接着再调用`selectPage`方法传入创建好的`Page`类对象

但是`selectPage`默认是需要传递两个参数的，如果是无条件查询，那么第二个参数传递`null`即可

创建测试类如下：

```java
@SpringBootTest
public class MybatisPlusPageApplicationTests {

    @Autowired
    private BookInfoMapper bookInfoMapper;

    @Test
    public void test() {
        Page<BookInfo> page = new Page<>(3, 10);
        // 无条件查询
        Page<BookInfo> result = bookInfoMapper.selectPage(page, null);
        // 打印分页信息（调试用）
        System.out.println("当前页: " + result.getCurrent());
        System.out.println("每页大小: " + result.getSize());
        System.out.println("总记录数: " + result.getTotal());
        System.out.println("总页数: " + result.getPages());
        System.out.println("数据列表: " + result.getRecords());
    }
}
```

可以看到输出结果如下：

```
当前页: 1
每页大小: 10
总记录数: 27
总页数: 3
数据列表: [
BookInfo(id=1, bookName=活着, author=余华, count=29, price=22.00, publish=北京文艺出版社, status=1, createTime=Sun Sep 14 19:38:41 CST 2025, updateTime=Mon Sep 15 19:50:52 CST 2025), 
BookInfo(id=2, bookName=平凡的世界, author=路遥, count=5, price=98.56, publish=北京十月文艺出版社, status=1, createTime=Sun Sep 14 19:38:41 CST 2025, updateTime=Mon Sep 15 19:52:02 CST 2025), 
BookInfo(id=3, bookName=三体, author=刘慈欣, count=9, price=102.67, publish=重庆出版社, status=1, createTime=Sun Sep 14 19:38:41 CST 2025, updateTime=Mon Sep 15 19:52:09 CST 2025), 
BookInfo(id=4, bookName=金字塔原理, author=麦肯锡, count=16, price=178.00, publish=民主与建设出版社, status=1, createTime=Sun Sep 14 19:38:41 CST 2025, updateTime=Mon Sep 15 19:54:32 CST 2025), 
BookInfo(id=5, bookName=云边有个小卖部, author=张嘉佳, count=1, price=54.00, publish=湖南文艺出版社, status=1, createTime=Sun Sep 14 21:35:55 CST 2025, updateTime=Sun Sep 14 21:41:07 CST 2025), 
BookInfo(id=6, bookName=被讨厌的勇气：“自我启发之父”阿德勒的哲学课, author=岸见一郎, count=1, price=58.00, publish=机械工业出版社, status=1, createTime=Mon Sep 15 18:15:04 CST 2025, updateTime=Mon Sep 15 18:15:04 CST 2025), 
BookInfo(id=7, bookName=流浪地球, author=刘慈欣, count=1, price=87.00, publish=四川科学技术出版社, status=1, createTime=Mon Sep 15 18:16:33 CST 2025, updateTime=Mon Sep 15 19:55:21 CST 2025), 
BookInfo(id=8, bookName=图书2, author=作者2, count=29, price=22.00, publish=出版社2, status=1, createTime=Mon Sep 15 21:26:39 CST 2025, updateTime=Mon Sep 15 21:26:39 CST 2025), 
BookInfo(id=9, bookName=图书3, author=作者2, count=29, price=22.00, publish=出版社 3, status=0, createTime=Mon Sep 15 21:26:39 CST 2025, updateTime=Sat Sep 20 17:38:50 CST 2025), 
BookInfo(id=10, bookName=图书4, author=作者2, count=29, price=22.00, publish=出版社1, status=0, createTime=Mon Sep 15 21:26:39 CST 2025, updateTime=Sat Sep 20 14:50:07 CST 2025)
]
```

如果传递的当前页参数为2，那么就是从第11条开始到第20条数据，可以得到下面的结果：

```
当前页: 2
每页大小: 10
总记录数: 27
总页数: 3
数据列表: [
BookInfo(id=11, bookName=图书5, author=作者2, count=29, price=22.00, publish=出版社1, status=1, createTime=Mon Sep 15 21:26:39 CST 2025, updateTime=Mon Oct 20 12:29:11 CST 2025), 
BookInfo(id=12, bookName=图书6, author=作者2, count=29, price=22.00, publish=出版社1, status=1, createTime=Mon Sep 15 21:26:39 CST 2025, updateTime=Mon Sep 15 21:26:39 CST 2025), 
BookInfo(id=13, bookName=图书7, author=作者2, count=29, price=22.00, publish=出版社1, status=1, createTime=Mon Sep 15 21:26:39 CST 2025, updateTime=Mon Oct 20 12:29:13 CST 2025), 
BookInfo(id=14, bookName=图书8, author=作者2, count=29, price=22.00, publish=出版社1, status=1, createTime=Mon Sep 15 21:26:39 CST 2025, updateTime=Mon Sep 15 21:26:39 CST 2025), 
BookInfo(id=15, bookName=图书9, author=作者2, count=29, price=22.00, publish=出版社1, status=1, createTime=Mon Sep 15 21:26:39 CST 2025, updateTime=Mon Oct 20 12:29:16 CST 2025), 
BookInfo(id=16, bookName=图书10, author=作者2, count=29, price=22.00, publish=出版社1, status=1, createTime=Mon Sep 15 21:26:39 CST 2025, updateTime=Mon Sep 15 21:26:39 CST 2025), 
BookInfo(id=17, bookName=图书11, author=作者2, count=29, price=22.00, publish=出版社1, status=0, createTime=Mon Sep 15 21:26:39 CST 2025, updateTime=Mon Oct 20 12:29:20 CST 2025), 
BookInfo(id=18, bookName=图书12, author=作者2, count=29, price=22.00, publish=出版社1, status=0, createTime=Mon Sep 15 21:26:39 CST 2025, updateTime=Sat Sep 20 14:52:12 CST 2025), 
BookInfo(id=19, bookName=图书13, author=作者2, count=29, price=22.00, publish=出版社1, status=0, createTime=Mon Sep 15 21:26:39 CST 2025, updateTime=Mon Oct 20 12:29:24 CST 2025), 
BookInfo(id=20, bookName=图书14, author=作者2, count=29, price=22.00, publish=出版社1, status=1, createTime=Mon Sep 15 21:26:39 CST 2025, updateTime=Mon Sep 15 21:26:39 CST 2025)
]
```

根据官方文档的描述，`Page`类介绍如下：

`Page` 类继承了 `IPage` 类，实现了简单分页模型。如果你需要实现自己的分页模型，可以继承 `Page` 类或实现 `IPage` 类。`Page`类中有以下的属性：

| 属性名        | 类型    | 默认值 | 描述                             |
| ------------------------ | ----------------- | ---------------- | ------------------------------------------- |
| `records`                | `List<T>`         | `emptyList`      | 查询数据列表                                |
| `total`                  | `Long`            | 0                | 查询列表总记录数                            |
| `size`                   | `Long`            | 10               | 每页显示条数，默认 10                       |
| `current`                | `Long`            | 1                | 当前页                                      |
| `orders`                 | `List<OrderItem>` | `emptyList`      | 排序字段信息                                |
| `optimizeCountSql`       | `boolean`         | `true`           | 自动优化 COUNT SQL                          |
| `optimizeJoinOfCountSql` | `boolean`         | `true`           | 自动优化 COUNT SQL 是否把 join 查询部分移除 |
| `searchCount`            | `boolean`         | `true`           | 是否进行 count 查询                         |
| `maxLimit`               | `Long`            |                  | 单页分页条数限制                            |
| `countId`                | `String`          |                  | XML 自定义 count 查询的 statementId         |

如果想根据具体条件查询，则可以使用MyBatis-Plus的条件构造器，例如根据出版社名称不为“出版社1”的结果进行分页查询，每页三条，则可以写为：

```java
@Test
public void test1() {
    Page<BookInfo> page = new Page<>(1, 3);
    // 构建出版社名称不为“出版社1”的条件构造器
    LambdaQueryWrapper<BookInfo> publisher = new LambdaQueryWrapper<BookInfo>()
                                            .ne(BookInfo::getPublish, "出版社1");
    // 无条件查询
    Page<BookInfo> result = bookInfoMapper.selectPage(page, publisher);
    // 打印分页信息（调试用）
    System.out.println("当前页: " + result.getCurrent());
    System.out.println("每页大小: " + result.getSize());
    System.out.println("总记录数: " + result.getTotal());
    System.out.println("总页数: " + result.getPages());
    System.out.println("数据列表: " + result.getRecords());
}
```

输出结果如下：

```
当前页: 1
每页大小: 3
总记录数: 9
总页数: 3
数据列表: [
BookInfo(id=1, bookName=活着, author=余华, count=29, price=22.00, publish=北京文艺出版社, status=1, createTime=Sun Sep 14 19:38:41 CST 2025, updateTime=Mon Sep 15 19:50:52 CST 2025), 
BookInfo(id=2, bookName=平凡的世界, author=路遥, count=5, price=98.56, publish=北京十月文艺出版社, status=1, createTime=Sun Sep 14 19:38:41 CST 2025, updateTime=Mon Sep 15 19:52:02 CST 2025), 
BookInfo(id=3, bookName=三体, author=刘慈欣, count=9, price=102.67, publish=重庆出版社, status=1, createTime=Sun Sep 14 19:38:41 CST 2025, updateTime=Mon Sep 15 19:52:09 CST 2025)
]
```