<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# SpringBoot常见YML配置、配置类和工具类代码参考

## SpringBoot/SpringCloud YML常见配置项参考

```yaml
spring:
  application:
    name: book-manager
  servlet:
    multipart:
      max-file-size: 5MB      # 单个文件最大5MB
      max-request-size: 10MB  # 整个请求最大10MB
  datasource:
    url: jdbc:mysql://localhost:3306/book_manager?characterEncoding=utf8&useSSL=false
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
  rabbitmq:
    addresses: amqp://admin:admin@ip:port/blog
    listener:
      simple:
        acknowledge-mode: manual # 手动确认
  data:
    redis:
      host: 47.113.217.80
      port: 6376
      timeout: 60s
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0
          max-wait: 5s
  mail:
    host: smtp.qq.com
    username: 1848312235@qq.com
    password: xxxx
    port: 465
    properties:
      mail.smtp.ssl.enable: true
      personal: "图书管理系统"
  ai:
    openai:
      api-key: xxx
      base-url: https://api.deepseek.com
      chat:
        options:
          model: deepseek-chat
          temperature: 0.7
mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
# ⽇志配置
logging: 
  pattern:
    dateformat: HH:mm:ss 
  level:
    root: info # 默认⽇志级别
    com.epsda.book.controller: debug # 指定包的⽇志级别
# 自定义Hutools验证码配置
captcha:
  width: 100
  height: 40
  session:
    key-name: captcha-key
    date-name: captcha-date
# 自定义头像上传地址
avatar:
  upload:
    path: E:\BookManager\backend\images
# 自定义管理员名称
admin:
  admin-name: book_admin_001
# 自定义跨域地址配置
app:
  cors:
    allowed-origins: http://localhost:9999,http://127.0.0.1:9999
```

## SpringBoot统一返回结果包装

```java
public record Constants() {
    public static final Integer NORMAL = 0;
    public static final Integer SERVER_ERROR = 1;
    public static final Integer SYSTEM_ERROR = 2;
    public static final Integer RESOURCE_NOT_FOUND = 3;
    public static final String SERVER_ERROR_MESSAGE = "服务器异常";
    public static final String SYSTEM_ERROR_MESSAGE = "图书管理系统异常";
    public static final String RESOURCE_NOT_FOUND_MESSAGE = "资源不存在"; 
}

@Data
@AllArgsConstructor
public class ResultWrapper<T> {
    private Integer code;
    private String errMsg;
    private T data;

    // 正常情况
    public static <T> ResultWrapper<T> normal(T data) {
        return new ResultWrapper<>(Constants.NORMAL, "", data);
    }

    // 错误情况
    public static <T> ResultWrapper<T> fail(T data) {
        return new ResultWrapper<>(Constants.SERVER_ERROR, "", data);
    }

    public static <T> ResultWrapper<T> fail(Integer code, String errMsg) {
        return new ResultWrapper<>(Constants.SERVER_ERROR, errMsg, null);
    }

    public static <T> ResultWrapper<T> fail(String errMsg, T data) {
        return new ResultWrapper<>(Constants.SERVER_ERROR, errMsg, data);
    }
}
```

## SpringBoot统一异常

```java
@Slf4j
@ControllerAdvice
@ResponseBody // 防止出现持续返回视图导致的死循环情况
public class ExceptionAdvice {
    @ResponseStatus(value = HttpStatus.SERVICE_UNAVAILABLE)
    @ExceptionHandler(Exception.class)
    public ResultWrapper allExcetionHandler(Exception e) {
        log.info("出现异常：{}", e.getMessage());
        MethodArgumentNotValidException methodValidationException = null;
        if (e instanceof MethodArgumentNotValidException) {
            methodValidationException = (MethodArgumentNotValidException) e;
        }
        String errMsg = e.getMessage();
        if (methodValidationException != null) {
            errMsg = methodValidationException.getBindingResult().getFieldError().getDefaultMessage();
        }

        return ResultWrapper.fail(Constants.SERVER_ERROR, Constants.SERVER_ERROR_MESSAGE + "：" + errMsg);
    }

    @ResponseStatus(value = HttpStatus.SERVICE_UNAVAILABLE)
    @ExceptionHandler(BookManagerException.class)
    public ResultWrapper systemExceptionHandler(Exception e) {
        log.info("出现异常：{}", e.getMessage());

        return ResultWrapper.fail(Constants.SYSTEM_ERROR, Constants.SYSTEM_ERROR_MESSAGE + "：" + e.getMessage());
    }

    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    @ExceptionHandler(NoResourceFoundException.class)
    public ResultWrapper noResourceFoundException(Exception e) {
        log.info("出现异常：{}", e.getMessage());
        return ResultWrapper.fail(Constants.RESOURCE_NOT_FOUND, Constants.RESOURCE_NOT_FOUND_MESSAGE);
    }
}
```

## SpringBoot统一跨域解决

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${app.cors.allowed-origins}") // 参考通用配置文件
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] origins = allowedOrigins.split(",");
        registry.addMapping("/**")
                .allowedOrigins(origins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## 自定义异常参考

```java
@Data
@EqualsAndHashCode(callSuper = true)
public class BookManagerException extends RuntimeException{
    public Integer code;
    public String message;

    public BookManagerException() {
    }

    public BookManagerException(Integer code) {
        this.code = code;
    }

    public BookManagerException(String message) {
        this.message = message;
    }

    public BookManagerException(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
```

## JSON工具类（基于FastJson）

FastJson依赖：

```xml
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2</artifactId>
    <version>2.0.59</version>
</dependency>
```

工具类：

```java
@Slf4j
public class JsonUtil {
    // 对象转Json字符串
    public static String toJson(Object o) {
        try {
            return o == null ? null : JSON.toJSONString(o);
        } catch (Exception e) {
            log.error("对象转JSON字符串出现异常，e：{}", e.getMessage());
            return null;
        }
    }

    // Json字符串转对象
    public static <T> T toObject(String json, Class<T> cls) {
        try {
            if (cls == null || !StringUtils.hasLength(json)) {
                return null;
            }
            return JSON.parseObject(json, cls);
        } catch (Exception e) {
            log.error("JSON字符串转对象出现异常，e：{}", e.getMessage());
            return null;
        }
    }
}
```

## Jwt工具类

引入依赖：

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```

工具类：

```java
public class JwtUtil {
    // 生成密钥
    private final static String secretKeySignature = "uh7Ib5KBKRwQCLal4ziR1UmsVJ07FirkpEJl10JFu+c=";

    // 过期时间
    private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000;

    private static SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKeySignature));
    }

    public static String generateToken(String email, String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("username", username);

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey())
                .compact();
    }

    public static String extractEmail(String token) {
        return (String) extractClaims(token).get("email");
    }

    public static String extractUsername(String token) {
        return (String) extractClaims(token).get("username");
    }

    public static Date extractExpiration(String token) {
        return extractClaims(token).getExpiration();
    }

    private static Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public static boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public static boolean validateToken(String token, String username) {
        try {
            final String tokenUsername = extractUsername(token);
            return (tokenUsername.equals(username) && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }
}
```

## 邮件发送配置类

```java
@Component
public class MailUtil {

    private final JavaMailSender javaMailSender;
    private final MailProperties mailProperties;

    public MailUtil(JavaMailSender javaMailSender, MailProperties mailProperties) {
        this.javaMailSender = javaMailSender;
        this.mailProperties = mailProperties;
    }

    public void sendMail(String to, String subject, String html) throws Exception {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false);
        mimeMessageHelper.setFrom(mailProperties.getUsername(), mailProperties.getProperties().get("personal"));
        mimeMessageHelper.setTo(to);
        mimeMessageHelper.setSubject(subject);
        mimeMessageHelper.setText(html, true);

        javaMailSender.send(mimeMessage);
    }
}
```