<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# 基础环境搭建

## 创建父工程和子工程

在新版的IDEA中，选择下面的内容：

<img src="env-setup.assets\image.png">

<img src="env-setup.assets\image1.png">

此时生成的即为父工程

接着，在父工程中的`pom`文件中使用`properties`标签来管理依赖的版本，例如：

```xml
<properties>
   <maven.compiler.source>17</maven.compiler.source> 
   <maven.compiler.target>17</maven.compiler.target> 
   <java.version>17</java.version>
   <mybatis.version>3.0.3</mybatis.version>
   <mysql.version>8.0.33</mysql.version>
   <spring-cloud.version>2022.0.3</spring-cloud.version>
 </properties>
```

使用`DependencyManagement`来声明依赖，但是不会引入对应的`jar`包，一般放在父工程的`pom`文件中，如果在父工程的`pom`中指定了依赖版本，那么子工程不显式写版本就会继承父工程指定的版本，否则使用子工程指定的版本，而使用`dependencies`标签直接引入依赖，会引入对应的`jar`包

注意，父工程的`packaging`标签内容为`pom`而不是`jar`：

```xml
<packaging>pom</packaging>
```

## SpringCloud版本选择

根据[官方文档](https://spring.io/projects/spring-cloud)的介绍进行选择：

<img src="env-setup.assets\image2.png">

不同的SpringCloud第三方可能对SpringBoot最高支持版本不一致，例如SpringCloud Alibaba：

<img src="env-setup.assets\image3.png">

如果使用了SpringBoot3.2.4以上的版本或者SpringCloud 2023.0.1以上的版本都可能存在兼容性问题导致部分功能无法实现

## 远程调用

学了RestTemplate和OpenFeign，后面主要使用OpenFeign，使接口调用更加贴近本地调用的形式，对于RestTemplate的使用，直接看[课件](https://www.kdocs.cn/l/caWDCjR62Xll)

## 服务注册和负载均衡

主要以Nacos为主，对于Eureka，后续补充笔记