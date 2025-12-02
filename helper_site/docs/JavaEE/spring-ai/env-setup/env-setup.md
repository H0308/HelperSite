<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# SpringAI

## 创建SpringBoot项目并引入SpringAI需要的依赖

本次使用的SpringBoot的版本如下：

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.5.3</version>
    <relativePath/> <!-- lookup parent from repository -->
</parent>
```

本次使用Deepseek的API，DeepSeek的API做了针对OpenAI的兼容，所以可以直接使用OpenAI的依赖，下面的`pom`配置是亲测可用的配置（不考虑流式输出）：

```xml
<dependencies>
  <dependency>
      <groupId>org.springframework.ai</groupId>
      <artifactId>spring-ai-starter-model-openai</artifactId>
      <version>1.0.2</version> <!-- 版本根据Maven仓库任意指定即可 -->
  </dependency>
<dependencies>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-bom</artifactId>
            <version>${spring-ai.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

根据[官方文档](https://docs.springframework.org.cn/spring-ai/reference/api/chat/deepseek-chat.html)的介绍进行如下的配置：

```yaml
spring:
  ai:
    openai:
      api-key: xxxx
      base-url: https://api.deepseek.com
      chat:
        options:
          model: deepseek-chat
          temperature: 0.7
```

## 测试

使用下面的`DeepSeekController`可以得到测试结果：

```java
@RequestMapping("/ds")
@RestController
public class DeepSeekController {
  @Autowired 
  private OpenAiChatModel openAiChatModel; // 使用ChatModel而不是ChatClient

  @RequestMapping("/chat")
  public String chat(String message) {
    return openAiChatModel.call(message);
  }
}
```

<img src="env-setup.assets\image.png">