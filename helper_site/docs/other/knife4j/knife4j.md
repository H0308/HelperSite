<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# 关于Knife4j

## 引入依赖

```xml
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
    <version>4.4.0</version>
</dependency>
```

## 创建配置类

```java
@Configuration
public class Knife4jConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                  .title("xx系统 API")
                  .version("1.0")
                  .description("这是一个基于SpringBoot的xx系统API文档"));
    }
}
```

## 修改配置文件

knife4j是在Swagger上做的增强，同样支持SpringDoc，开发者即可完全参考[springdoc-openapi](https://springdoc.org/)的项目说明

```yaml
springdoc:
  api-docs:
    path: /v3/api-docs  # 更改 OpenAPI JSON/YAML 描述文件的路径，默认是 /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html  # 更改 Swagger UI 页面的访问路径，默认是 /swagger-ui.html
  packages-to-scan: org.epsda.forum.controller  # 指定要扫描的包名列表（逗号分隔），只生成这些包下的接口文档
  paths-to-match: /**  # 指定要匹配的请求路径模式（Ant 风格），仅对符合该规则的接口生成文档
# 以下是knife4j的增强配置
knife4j:
  enable: true
  production: false # 不用于生产环境
  setting:
    language: zh_cn # 文档语言为中文
```

## Controller代码

```java
@RestController
@RequestMapping("body")
@Tag(name = "body参数")
public class BodyController {

   @Operation(summary = "普通body请求")
   @PostMapping("/body")
   public ResponseEntity<FileResp> body(@RequestBody FileResp fileResp){
       return ResponseEntity.ok(fileResp);
   }

   @Operation(summary = "普通body请求+Param+Header+Path")
   @Parameters({
           @Parameter(name = "id",description = "文件id",in = ParameterIn.PATH),
           @Parameter(name = "token",description = "请求token",required = true,in = ParameterIn.HEADER),
           @Parameter(name = "name",description = "文件名称",required = true,in = ParameterIn.QUERY)
   })
   // in = ParameterIn.QUERY表示参数在请求字符串中，in = ParameterIn.PATH表示参数在请求路径中
   // in = ParameterIn.HEADER表示参数在请求头中
   @PostMapping("/bodyParamHeaderPath/{id}")
   public ResponseEntity<FileResp> bodyParamHeaderPath(@PathVariable("id") String id,@RequestHeader("token") String token, @RequestParam("name")String name,@RequestBody FileResp fileResp){
       fileResp.setName(fileResp.getName()+",receiveName:"+name+",token:"+token+",pathID:"+id);
       return ResponseEntity.ok(fileResp);
   }
}
```

## 导入API到Postman

在Postman的工作区中点击`import`，然后输入`http://ip:port/v3/api-docs`，Postman会自动识别出所有的API