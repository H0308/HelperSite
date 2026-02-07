<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# ElasticSearch安装与基本使用

## ElasticSearch介绍

Elasticsearch是基于Lucene的分布式搜索与分析引擎，能够对大规模数据进行近实时的全文检索、结构化查询与聚合分析。它采用JSON文档存储模型，支持水平扩展、分片与副本机制，提供高可用与高性能，并常与Logstash、Kibana组成ELK/Elastic Stack，用于日志分析、全文检索、监控与数据可视化等场景

## ElasticSearch相关概念

1. index（索引）：具有相同结构的文档集合，类似于关系型数据库的数据库实例（6.0.0版本type废弃后，索引的概念下降到等同于数据库表的级别）。一个集群里可以定义多个索引，如客户信息索引、商品分类索引、商品索引、订单索引、评论索引等等，分别定义自己的数据结构。索引命名要求全部使用小写，建立索引、搜索、更新、删除操作都需要用到索引名称
2. type（类型）：原本是在索引内进行的逻辑细分，但后来发现企业研发为了增强可阅读性和可维护性，制订的规范约束，同一个索引下很少还会再使用type进行逻辑拆分（如同一个索引下既有订单数据，又有评论数据），因而在6.0.0版本之后，此定义废弃
3. document（文档）：一个文档是一个可被索引的基础信息单元，document（文档）是JSON格式的，document就像是MySQL中某个Table里面每一行的数据，document中可以包含多个字段，每个字段可以是文本、数字、日期等类型
4. field（字段）：文档中的一个元素或属性，每个字段都有一个数据类型，如字符串、整数、日期等
5. mapping（映射）：类似于传统关系型数据中table的schema（定义了数据库中的数据如何组织，包括表的结构、字段的数据类型、键（如主键、外键）的设置等），用于定义一个索引的数据的结构（mapping中主要包括字段名、字段数据类型和字段索引类型）。在ES中，可以手动创建mapping，也可以采用默认创建方式。在默认配置下，ES可以根据插入的数据自动地创建mapping

将MySQL中的概念与ES概念进行类比：

| MySQL | ElasticSearch |
| :--- | :--- |
| 表Table | 索引Index |
| 数据行Row | 文档Document |
| 数据列Column | 字段Field |
| 模式Schema | 映射Mapping |

## 安装ElasticSearch

下面主要介绍在Docker上安装ElasticSearch，首先拉取ES镜像：

```bash
docker pull elasticsearch:8.5.3
```

为了便于后续操作和维护ES，可以顺便安装Kibana，同样拉取Kibana镜像：

```bash
docker pull kibana:8.5.3
```

接着，需要保证ES和Kibana连接到同一个网络，这里可以创建一个自定义网络：

```bash
docker network create diy-network
```

接着，先启动ES，再启动Kibana：

```bash
# 启动ES
docker run -d --name es-dev -e "ES_JAVA_OPTS=-Xms256m -Xmx256m" -e 
"discovery.type=single-node" -v /es-plugins:/usr/share/elasticsearch/plugins -e 
"xpack.security.enabled=false" --privileged --network diy-network -p 
9200:9200 -p 9300:9300 elasticsearch:8.5.3

# 启动Kibana
docker run -d --name kibana-dev -e "ELASTICSEARCH_HOSTS=http://oj-es-
dev:9200" -e "I18N_LOCALE=zh-CN" -p15601:5601 --network diy-network kibana:8.5.3
```

注意，需要确保ES启动成功后再启动Kibana，否则Kibana无法连接上ES，启动ES后，可以访问`http://localhost:9200/`进行验证

如果需要对中文句子进行分词，可以使用ES插件，ik分词器，点击[网址](https://release.infinilabs.com/analysis-ik/stable/elasticsearch-analysis-ik-8.5.3.zip)进行下载，下载完成后，将这个压缩包放在容器映射的宿主机目录`/es-plugins`下，需要注意，要先创建一个子目录，例如`elasticsearch-analysis-ik-8.5.3`，再在该子目录中将压缩包进行解压，解压完成后重启ES容器即可

ik分词器默认有两种分词模式：

1. `ik_smart`：分词数量少，倾向于输出更语义完整的词，更适合短词或者关键词的检索场景
2. `ik_max_word`：尽可能细地拆分，会输出所有可能的词，适合需要尽可能匹配更多结果、做词云、关键词统计、召回优先的场景

## 在Kibana开发工具中基本使用ElasticSearch

在Kibana的侧边栏找到“开发工具”，新增如下数据：

```json
PUT /employee/_doc/1
{
 "first_name" : "John",
 "last_name" : "Smith",
 "age" : 25,
 "about" : "I love to go rock climbing",
 "interests": [ "sports", "music" ]
}
PUT /employee/_doc/2
{
 "first_name" : "Jane",
 "last_name" : "Smith",
 "age" : 32,
 "about" : "I like to collect rock albums",
 "interests": [ "music" ]
}
PUT /employee/_doc/3
{
 "first_name" : "Douglas",
 "last_name" : "Fir",
 "age" : 35,
 "about": "I like to build cabinets",
 "interests": [ "forestry" ]
}
```

接着，使用下面的命令进行所有数据的获取：

```json
GET /employee/_search
```

如果要查询单个数据，可以使用下面的命令：

```json
GET /employee/_doc/{id}
```

如果要更新指定数据，使用下面的命令：

```json
POST /employee/_update/3
{
 "doc" : {
 "last_name" : "mark"
 }
}
```

如果要删除指定数据，使用下面的命令：

```json
DELETE /employee/_doc/{id}
```

如果要删除整个索引，可以使用下面的命令：

```json
DELETE /employee
```

## SpringBoot项目与ElasticSearch

首先引入Maven依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
</dependency>
```

本次演示实现一个基于MySQL数据库获取用户列表，并可以支持根据用户用户名进行模糊搜索。数据库设计如下：

```sql
-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户编号',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '头像URL',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `gender` tinyint(1) NULL DEFAULT 2 COMMENT '0女 1男 2保密',
  `birthday` date NULL DEFAULT NULL,
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '省份',
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '城市',
  `level` tinyint NULL DEFAULT 1 COMMENT '会员等级 1-5',
  `points` int NULL DEFAULT 0 COMMENT '积分',
  `status` tinyint(1) NULL DEFAULT 1 COMMENT '状态',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `user_code`(`user_code` ASC) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'U202400001', 'zhangsan', '张三', 'https://example.com/avatar/1.jpg', 'zhangsan@qq.com', '13800138001', 1, '1995-03-15', '北京市', '北京市', 3, 2580, 1, '2026-02-06 22:09:23');
INSERT INTO `users` VALUES (2, 'U202400002', 'lisi', '李四', 'https://example.com/avatar/2.jpg', 'lisi@163.com', '13900139002', 1, '1992-07-22', '上海市', '上海市', 4, 5680, 1, '2026-02-06 22:09:23');
INSERT INTO `users` VALUES (3, 'U202400003', 'wangwu', '王五', 'https://example.com/avatar/3.jpg', 'wangwu@gmail.com', '13700137003', 0, '1998-11-08', '广东省', '广州市', 2, 1280, 1, '2026-02-06 22:09:23');
INSERT INTO `users` VALUES (4, 'U202400004', 'zhaoliu', '赵六', 'https://example.com/avatar/4.jpg', 'zhaoliu@qq.com', '13600136004', 1, '1990-05-20', '浙江省', '杭州市', 5, 12800, 1, '2026-02-06 22:09:23');
INSERT INTO `users` VALUES (5, 'U202400005', 'qianqi', '钱七', 'https://example.com/avatar/5.jpg', 'qianqi@126.com', '13500135005', 0, '1996-09-12', '江苏省', '南京市', 3, 3450, 1, '2026-02-06 22:09:23');
INSERT INTO `users` VALUES (6, 'U202400006', 'sunba', '孙八', 'https://example.com/avatar/6.jpg', 'sunba@qq.com', '13400134006', 1, '1993-12-01', '四川省', '成都市', 4, 7890, 1, '2026-02-06 22:09:23');
INSERT INTO `users` VALUES (7, 'U202400007', 'zhoujiu', '周九', 'https://example.com/avatar/7.jpg', 'zhoujiu@163.com', '13300133007', 0, '1999-04-18', '湖北省', '武汉市', 1, 580, 1, '2026-02-06 22:09:23');
INSERT INTO `users` VALUES (8, 'U202400008', 'wushi', '吴十', 'https://example.com/avatar/8.jpg', 'wushi@gmail.com', '13200132008', 1, '1991-08-30', '陕西省', '西安市', 4, 6780, 1, '2026-02-06 22:09:23');
INSERT INTO `users` VALUES (9, 'U202400009', 'zheng11', '郑十一', 'https://example.com/avatar/9.jpg', 'zheng11@qq.com', '13100131009', 0, '1997-02-25', '湖南省', '长沙市', 2, 1890, 1, '2026-02-06 22:09:23');
INSERT INTO `users` VALUES (10, 'U202400010', 'chen12', '陈十二', 'https://example.com/avatar/10.jpg', 'chen12@126.com', '13000130010', 1, '1994-06-14', '河南省', '郑州市', 3, 4560, 1, '2026-02-06 22:09:23');
INSERT INTO `users` VALUES (11, 'U202400011', 'lin13', '林十三', 'https://example.com/avatar/11.jpg', 'lin13@qq.com', '12900129011', 0, '2000-10-05', '福建省', '厦门市', 1, 320, 1, '2026-02-06 22:09:23');
INSERT INTO `users` VALUES (12, 'U202400012', 'huang14', '黄十四', 'https://example.com/avatar/12.jpg', 'huang14@163.com', '12800128012', 1, '1989-01-28', '山东省', '青岛市', 5, 15680, 1, '2026-02-06 22:09:23');
INSERT INTO `users` VALUES (13, 'U202400013', 'he15', '何十五', 'https://example.com/avatar/13.jpg', 'he15@gmail.com', '12700127013', 0, '1995-07-09', '安徽省', '合肥市', 3, 2890, 1, '2026-02-06 22:09:23');
INSERT INTO `users` VALUES (14, 'U202400014', 'gao16', '高十六', 'https://example.com/avatar/14.jpg', 'gao16@qq.com', '12600126014', 1, '1992-11-17', '江西省', '南昌市', 4, 5670, 1, '2026-02-06 22:09:23');
INSERT INTO `users` VALUES (15, 'U202400015', 'luo17', '罗十七', 'https://example.com/avatar/15.jpg', 'luo17@126.com', '12500125015', 0, '1998-03-22', '云南省', '昆明市', 2, 1560, 1, '2026-02-06 22:09:23');
```

接着，在ElasticSearch中配置连接地址：

```yaml
spring:
  elasticsearch:
    uris: http://localhost:9200 # ElasticSearch运行的IP地址和端口
```

要想操作ElasticSearch首先得有一个索引，在开发工具中操作ElasticSearch时，如果不存在指定索引会报错提示索引不存在，但是使用代码操作时可以通过实体类让ElasticSearch创建索引，例如下面的实体类：

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(indexName = "idx_user") // 声明索引
public class UserDocument {
    @Id // 声明ID（类似于数据库的主键ID）
    @Field(type = FieldType.Text)
    private String userCode;
    @Field(type = FieldType.Integer) // 指定字段类型
    private Integer userId;
    @Field(type = FieldType.Text, 
        analyzer = "ik_smart", // 写入/索引时的分词器
        searchAnalyzer = "ik_max_word") // 搜索时的分词器
    private String nickname;
    @Field(type = FieldType.Text)
    private String username;
    @Field(type = FieldType.Date, 
        format = DateFormat.date_hour_minute_second) // 指定日期显示格式
    private LocalDateTime birthday;
    @Field(type = FieldType.Byte)
    private Integer status;
}
```

!!! note

    需要注意，在ElasticSearch 8.5.3版本中存在使用`@Id`注解后会覆盖实际在Java代码中声明的类型（在ElasticSearch，`_id`默认为`keyword`类型），例如上面的代码，如果给`userId`用`@Id`，那么`@Field(type = FieldType.Integer)`就会失效，其他版本不确定是否有这种情况

有了索引之后，还需要操作索引的方法，这些方法可以通过一个父接口提供，但是首先需要创建子接口继承这个父接口：

```java
@Repository // 持久层操作注解，保证可读性
public interface UserRepository extends 
    ElasticsearchRepository<UserDocument, Integer> { // 第一个泛型表示指定索引，第二个泛型表示索引的ID类型
    
}
```

可以类比一下MybatisPlus的Mapper：

```java
@Mapper
public interface UserMapper extends BaseMapper<User> {
}
```

在`ElasticsearchRepository`提供了一些接口：

| 方法 | 功能说明 |
|---|---|
| `save(T entity)` | 保存单个实体：不存在则新增，已存在则更新覆盖 |
| `saveAll(Iterable<S> entities)` | 批量保存：逐个执行`save`语义，新增或更新 |
| `deleteById(ID id)` | 按主键删除指定文档 |
| `delete(T entity)` | 按实体删除（根据实体 id），等价于 `deleteById(entity.getId())` |
| `findAll(Sort sort)` | 查询全部并按排序返回 |
| `findAll(Pageable pageable)` | 分页查询全部，返回`Page`|

但是，如果要按照指定字段进行查询，需要自行编写接口，有两种思路：

1. 在Spring Data中，可以按照方法名派生查询规则编写方法名
2. 使用`@Query`注解自行编写查询条件

=== "方法名查询规则"

    在Spring Data中，有一下常见的规则：

    - 字段前缀：`find/get/query/read/count/exists/delete` + 字段名 + `By`，其中方法名里的字段必须与实体字段一致（如`Difficulty`对应`difficulty`），例如`findByDifficulty`
    - 连接词：`And` / `Or` / `Not`，例如`findByTitleAndDifficulty` / `findByTitleOrContent`
    - 比较关键字：`Equals`（可省略）、`GreaterThan`、`LessThan`、`Between`、`Like`、`Containing`、`In`、`IsNull`等，例如`findByDifficultyGreaterThan`
    - 排序：`OrderByXxxAsc/Desc`，方法参数可带`Pageable` / `Sort`，例如`findByDifficultyOrderByCreateTimeDesc(Pageable pageable)`
    - 限制条数：`findTop10By...` / `findFirst5By...`

    根据上面的规则，本次需要按照`nickname`进行查询，可以写为：

    ```java
    // 注意包
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.Pageable;    
    
    Page<UserDocument> findUserDocumentByNickname(String nickname, Pageable pageable);
    ```

=== "使用`@Query`编写自定义查询条件"

    在`@Query`中需要直接编写ElasticSearch的DSL JSON，常见规则如下：

    - `@Query`的内容就是ES查询DSL`match`/`term`/`bool`/`should`/`must`等，含义如下：

        - `match`：全文检索，会对字段进行分词后匹配，适用于`text`类型字段
        - `term`：精确匹配，不进行分词，适用于`keyword`/数值/布尔等字段
        - `bool`：组合查询容器，用于把多个查询条件进行组合
        - `must`：必须满足的条件（“且”逻辑），即必须包含关键词才返回
        - `should`：可选条件（“或”逻辑），命中越多得分越高，即可匹配可不匹配，匹配了就更靠前，如果只有一个`should`则相当于`must`

        `bool`包`must`/`should`，`must`/`should`里放`match`/`term`，格式如下：

        ```json
        {
        "bool": {
            "must": [
            { "term": { "difficulty": 1 } }
            ],
            "should": [
            { "match": { "title": "foo" } },
            { "match": { "content": "bar" } }
            ]
        }
        }
        ```

    - 参数使用占位符从`?0`开始依次对应方法参数，依次为`?1`、`?2`等
    - `match`适合全文分词匹配（text），`term`适合精确匹配（keyword/数字/布尔）
    - JSON字符串内双引号需要转义（`\"`），否则会解析失败
    - 方法参数可带`Pageable`/`Sort`，分页与排序由Spring自动追加

    例如：

    ```json
    {
    "bool": {
        "should": [
        { "match": { "title": "?0" } },
        { "match": { "content": "?1" } }
        ],
        "minimum_should_match": 1
    }
    }
    ```

    其中：

    - `bool`：组合查询容器
    - `should`：两个可选条件（标题匹配 `?0` 或 内容匹配 `?1`）
    - `match`：分词后的全文匹配
    - `minimum_should_match: 1`：至少满足一个`should`条件即可命中

    对应的方法为：

    ```java
    @Query("{\"bool\": {\"should\": [{ \"match\": { \"title\": \"?0\" } }, { \"match\": { \"content\": \"?1\" } }], \"minimum_should_match\": 1}}")
    Page<QuestionES> findByTitleOrContent(String keywordTitle, String keywordContent, Pageable pageable);
    ```

    回到当前项目，根据`nickname`进行模糊查询可以写为：

    ```json
    {
      "bool": {
        "must": [
          {
            "match": {
              "nickname": "?0"
            }
          }
        ]
      }
    }
    ```

    对应的方法为：

    ```java
    @Query("{\"bool\":{\"must\":[{\"match\":{\"nickname\":\"?0\"}}]}}")
    Page<UserDocument> findUserDocumentByNickname(String nickname, Pageable pageable);
    ```

接着编写测试的Controller、Service，如下：

=== "`SearchController`"

    ```java
    @RestController
    @RequestMapping("/search")
    public class SearchController {
        @Autowired
        private SearchService searchService;

        @GetMapping("/list")
        public UserListVO list(@RequestBody UserListDTO userListDTO) {
            return searchService.list(userListDTO);
        }
    }
    ```

=== "`SearchService`"

    ```java
    public interface SearchService {
        UserListVO list(UserListDTO userListDTO);
    }
    ```

=== "`SearchServiceImpl`"

    ```java
    @Service
    public class SearchServiceImpl implements SearchService {

        @Autowired
        private UserRepository userRepository;
        @Autowired
        private UserMapper userMapper;

        @Override
        public UserListVO list(UserListDTO userListDTO) {
            // 先获取ES中的数据总数量
            long count = userRepository.count();
            if (count == 0) {
                // 生成数据到ES中
                List<User> users = userMapper.selectList(null);
                List<UserDocument> userDocumentList = new ArrayList<>();
                users.forEach(user -> {
                    UserDocument userDocument = new UserDocument();
                    userDocument.setUserId(user.getId());
                    userDocument.setUsername(user.getUsername());
                    userDocument.setUserCode(user.getUserCode());
                    userDocument.setNickname(user.getNickname());
                    userDocument.setBirthday(user.getBirthday());
                    userDocument.setStatus(user.getStatus());
                    userDocumentList.add(userDocument);
                });
                userRepository.saveAll(userDocumentList); // 存储所有数据
            }

            // 构建排序对象，本次为了演示，用ID倒序进行
            Sort sort = Sort.by(Sort.Direction.DESC, "userId");
            // 构建分页对象，需要注意，第一页默认从0开始
            Pageable pageable = PageRequest.of(userListDTO.getCurrentPage() - 1, userListDTO.getPageSize(), sort);
            String nickname = userListDTO.getNickname();
            Page<UserDocument> userVOPage;
            if (!StringUtils.hasText(nickname)) {
                // 不输入查询条件，返回所有数据
                userVOPage = userRepository.findAll(pageable);
            } else {
                // 输入查询条件，返回满足条件的数据
                userVOPage = userRepository.findUserDocumentByNickname(nickname, pageable);
            }
            List<UserDocument> userDocumentList = userVOPage.getContent();
            List<UserVO> userVOList = new ArrayList<>();
            userDocumentList.forEach(userDocument -> {
                UserVO userVO = new UserVO();
                userVO.setUserId(userDocument.getUserId());
                userVO.setUsername(userDocument.getUsername());
                userVO.setUserCode(userDocument.getUserCode());
                userVO.setNickname(userDocument.getNickname());
                userVO.setBirthday(userDocument.getBirthday());
                userVO.setStatus(userDocument.getStatus());
                userVOList.add(userVO);
            });

            return UserListVO.builder()
                    .currentPage(userVOPage.getNumber() + 1)
                    .totalCount(userVOPage.getTotalElements())
                    .userVOList(userVOList)
                    .build();
        }
    }
    ```

在PostMan测试分别测试不搜索和搜索数据：

=== "不搜索"

    ```json
    GET http://localhost:8080/search/list
    {
        "nickname": "",
        "currentPage": 1,
        "pageSize": 10
    }
    ```

    结果：

    ```json
    {
        "currentPage": 1,
        "totalPages": 2,
        "totalCount": 15,
        "userVOList": [
            {
                "userId": 15,
                "userCode": "U202400015",
                "username": "luo17",
                "nickname": "罗十七",
                "birthday": "1998-03-22T00:00:00",
                "status": 1
            },
            {
                "userId": 14,
                "userCode": "U202400014",
                "username": "gao16",
                "nickname": "高十六",
                "birthday": "1992-11-17T00:00:00",
                "status": 1
            },
            {
                "userId": 13,
                "userCode": "U202400013",
                "username": "he15",
                "nickname": "何十五",
                "birthday": "1995-07-09T00:00:00",
                "status": 1
            },
            {
                "userId": 12,
                "userCode": "U202400012",
                "username": "huang14",
                "nickname": "黄十四",
                "birthday": "1989-01-28T00:00:00",
                "status": 1
            },
            {
                "userId": 11,
                "userCode": "U202400011",
                "username": "lin13",
                "nickname": "林十三",
                "birthday": "2000-10-05T00:00:00",
                "status": 1
            },
            {
                "userId": 10,
                "userCode": "U202400010",
                "username": "chen12",
                "nickname": "陈十二",
                "birthday": "1994-06-14T00:00:00",
                "status": 1
            },
            {
                "userId": 9,
                "userCode": "U202400009",
                "username": "zheng11",
                "nickname": "郑十一",
                "birthday": "1997-02-25T00:00:00",
                "status": 1
            },
            {
                "userId": 8,
                "userCode": "U202400008",
                "username": "wushi",
                "nickname": "吴十",
                "birthday": "1991-08-30T00:00:00",
                "status": 1
            },
            {
                "userId": 7,
                "userCode": "U202400007",
                "username": "zhoujiu",
                "nickname": "周九",
                "birthday": "1999-04-18T00:00:00",
                "status": 1
            },
            {
                "userId": 6,
                "userCode": "U202400006",
                "username": "sunba",
                "nickname": "孙八",
                "birthday": "1993-12-01T00:00:00",
                "status": 1
            }
        ]
    }
    ```

=== "搜索"

    ```json
    GET http://localhost:8080/search/list
    {
        "nickname": "十一",
        "currentPage": 1,
        "pageSize": 10
    }
    ```

    结果：

    ```json
    {
        "currentPage": 1,
        "totalPages": 1,
        "totalCount": 1,
        "userVOList": [
            {
                "userId": 9,
                "userCode": "U202400009",
                "username": "zheng11",
                "nickname": "郑十一",
                "birthday": "1997-02-25T00:00:00",
                "status": 1
            }
        ]
    }
    ```

上面的搜索对于多字匹配较为精确，但是有时用户会输入一个单字，这个单字可能没被分词器当做一个词分离，例如：

```json
GET http://localhost:8080/search/list
{
    "nickname": "十",
    "currentPage": 1,
    "pageSize": 10
}
```

结果是：

```json
{
    "currentPage": 1,
    "totalPages": 1,
    "totalCount": 1,
    "userVOList": [
        {
            "userId": 8,
            "userCode": "U202400008",
            "username": "wushi",
            "nickname": "吴十",
            "birthday": "1991-08-30T00:00:00",
            "status": 1
        }
    ]
}
```

但是根据数据库中的数据，`nickname`有“十”的不止一个，原因就是“十一”、“十二”等被当做一个完整的词语所以没有拆出“十”，解决这个问题的方式很简单粗暴，对于单字，直接用`n-gram`进行单字拆解，对于多字查询条件，就用ik：

首先，添加一个自定义分词配置文件，并在实体类引入这个配置文件，然后修改针对`nickname`字段的配置，确保可以动态指定字段：

=== "配置文件"

    在`src/main/resources`中添加文件名为`elasticsearch-settings.json`的文件，内容如下：

    ```json
    {
        "analysis": {
            "analyzer": {
                "ngram_analyzer": {
                    "tokenizer": "ngram_tokenizer" // 使用下面定义的 n-gram 分词器
                }
            },
            "tokenizer": {
                "ngram_tokenizer": {
                    "type": "ngram",           // 分词器类型：n-gram（滑动窗口切分）
                    "min_gram": 1,             // 最小切分长度：1 个字
                    "max_gram": 2,             // 最大切分长度：2 个字
                    "token_chars": ["letter", "digit"]  // 只对字母和数字切分
                }
            }
        }
    }
    ```

=== "索引实体类"

    ```java
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Document(indexName = "idx_user")
    @Setting(settingPath = "elasticsearch-settings.json") // 引入配置文件，注意SpringBoot版本要大于3.2.x
    public class UserDocument {
        @Id
        @Field(type = FieldType.Text)
        private String userCode;
        @Field(type = FieldType.Integer)
        private Integer userId;
        @Field(type = FieldType.Text)
        private String username;
        // @Field(type = FieldType.Text, analyzer = "ik_smart", searchAnalyzer = "ik_max_word")
        // 修改为如下：
        @MultiField(
                mainField = @Field(type = FieldType.Text, analyzer = "ik_smart", searchAnalyzer = "ik_max_word"), // 字段名为nickname
                otherFields = {
                        @InnerField(suffix = "ngram", type = FieldType.Text, analyzer = "ngram_analyzer") // 字段名为nickname.ngram
                }
        )
        private String nickname;
        @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
        private LocalDateTime birthday;
        @Field(type = FieldType.Byte)
        private Integer status;
    }
    ```

接着，修改`nickname`不为空时的查询逻辑：

```java
// 输入查询条件，返回满足条件的数据
// userVOPage = userRepository.findUserDocumentByNickname(nickname, pageable);
// 根据搜索词长度选择查询策略
// 动态选择字段名
String fieldName = (nickname.length() <= 1)
        ? "nickname.ngram"
        : "nickname";

// 构建match查询并设置fieldName
NativeQuery nativeQuery = NativeQuery.builder()
        .withQuery(query -> query
                .match(matchQuery -> matchQuery
                        .field(fieldName) // 使用动态字段名
                        .query(nickname)))
        .withPageable(pageable)
        .build();
// 进行查询
SearchHits<UserDocument> search = elasticsearchOperations.search(nativeQuery, UserDocument.class);
// 把SearchHits转为Page<SearchHit>，再调用父接口Page的map方法提取每个SearchHit里的实际文档内容，得到Page<UserDocument>对象
userVOPage = SearchHitSupport.searchPageFor(search, pageable).map(SearchHit::getContent);
```

## `Sort`类介绍

`Sort` 是 Spring Data 提供的排序工具类，用于构建数据库/搜索引擎查询的排序规则

常见的方法如下：

```java
Sort.by(direction, properties...)
```

其中，`direction`表示升序和降序：

```java
Sort.Direction.ASC   // 升序：从小到大（1, 2, 3 / A, B, C）
Sort.Direction.DESC  // 降序：从大到小（3, 2, 1 / C, B, A）
```

`properties`表示排序字段名，可以使用单字段：

```java
// 按年龄升序
Sort sort = Sort.by(Sort.Direction.ASC, "age");

// 按创建时间降序
Sort sort = Sort.by(Sort.Direction.DESC, "createTime");
```

也可以多字段排序：

```java
// 方式1：传入多个字段（同方向）
Sort sort = Sort.by(Sort.Direction.DESC, "priority", "createTime");

// 方式2：使用 Order 对象（不同方向）
Sort sort = Sort.by(
    Sort.Order.desc("priority"),     // 先按优先级降序
    Sort.Order.asc("createTime")     // 再按时间升序
);

// 方式3：链式添加
Sort sort = Sort.by("priority").descending()
                .and(Sort.by("createTime").ascending());
```

常用的其他方法：

| 方法 | 作用 |
|------|------|
| `sort.ascending()` | 改为升序 |
| `sort.descending()` | 改为降序 |
| `sort.and(otherSort)` | 合并多个排序 |
| `Sort.unsorted()` | 无排序（默认） |

特殊处理方法：

```java
// 忽略大小写排序
Sort.Order order = Sort.Order.asc("name").ignoreCase();

// 空值处理（JPA支持）
Sort.Order.asc("description").nullsFirst();  // null放前面
Sort.Order.asc("description").nullsLast();   // null放后面
```

## `Pageable`类介绍

`Pageable` 是 Spring Data 提供的**分页参数接口**，用于封装分页查询的页码、每页大小、排序等信息。

创建`Pageable`的方式：

```java
// page: 页码（从0开始，0表示第1页）
// size: 每页记录数
PageRequest.of(page, size)
// 带上排序Sort对象
PageRequest.of(page, size, sort)
```

常用方法如下：

| 方法 | 返回值 | 说明 |
|------|--------|------|
| `getPageNumber()` | `int` | 当前页码（从0开始） |
| `getPageSize()` | `int` | 每页大小 |
| `getOffset()` | `long` | 偏移量（跳过多少条） |
| `getSort()` | `Sort` | 排序信息 |
| `next()` | `Pageable` | 下一页 |
| `previous()` | `Pageable` | 上一页 |
| `first()` | `Pageable` | 第一页 |

需要注意的时页码问题：

| 前端习惯 | 后端（Pageable） | 转换 |
|---------|-----------------|------|
| 第1页 | 0 | `page - 1` |
| 第2页 | 1 | `page - 1` |
| 第n页 | n-1 | `page - 1` |

```java
// 转换示例
public Pageable convert(int frontendPage, int pageSize) {
    return PageRequest.of(frontendPage - 1, pageSize);
}
```

## `Page`类介绍

| 方法 | 返回值类型 | 说明 | 示例值 |
|------|-----------|------|--------|
| `getNumber()` | `int` | 当前页码（**从0开始**） | `0`, `1`, `2`... |
| `getNumber() + 1` | `int` | 当前页码（转为**从1开始**） | `1`, `2`, `3`... |
| `getSize()` | `int` | 每页大小 | `10` |
| `getTotalElements()` | `long` | 总记录数 | `100` |
| `getTotalPages()` | `int` | 总页数 | `10` |
| `getContent()` | `List<T>` | 当前页数据列表 | `List<UserDocument>` |
| `hasContent()` | `boolean` | 当前页是否有数据 | `true` / `false` |
| `hasNext()` | `boolean` | 是否有下一页 | `true` / `false` |
| `hasPrevious()` | `boolean` | 是否有上一页 | `true` / `false` |
| `isFirst()` | `boolean` | 是否是第一页 | `true` / `false` |
| `isLast()` | `boolean` | 是否是最后一页 | `true` / `false` |
| `nextPageable()` | `Pageable` | 下一页的分页对象 | `PageRequest` |
| `previousPageable()` | `Pageable` | 上一页的分页对象 | `PageRequest` |

示例：

```java
return PageResult.<UserVO>builder()
        .currentPage(page.getNumber() + 1)      // 页码+1
        .pageSize(page.getSize())               // 每页大小
        .totalCount(page.getTotalElements())    // 总记录数
        .totalPages(page.getTotalPages())       // 总页数
        .data(page.getContent())                // 数据列表
        .hasNext(page.hasNext())                // 是否有下一页
        .hasPrevious(page.hasPrevious())        // 是否有上一页
        .build();
```