<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Spring Security基本使用

## 依赖引入

```xml
<!-- Spring Security相关依赖 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-test</artifactId>
    <scope>test</scope>
</dependency>
<!-- JWT相关依赖 -->
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

## 数据库准备

```sql
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` int NOT NULL,
  `role` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  UNIQUE INDEX `id`(`id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, '管理员');
INSERT INTO `role` VALUES (2, '普通用户');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `password` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `role_id`(`role_id` ASC) USING BTREE,
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', '123456', 1);
INSERT INTO `user` VALUES (2, 'zhangsan', '123456', 2);
INSERT INTO `user` VALUES (3, 'lisi', '123456', 2);

SET FOREIGN_KEY_CHECKS = 1;
```

## 结合JWT做登录校验和权限管理

### 创建JWT工具类

```java
@Component
public class JwtUtil {
    // 服务器签名
    private static final String SERVER_SIGNATURE = "kIEy29oOe+xk6V9umA3ddq96mPjg6hV31fG/3It3TNQ=";
    // 过期时间
    private static final long EXPIRATION = 24 * 60 * 60 * 1000; // 一天
    // 生成安全密钥，String->Byte数组：解码
    private static final SecretKey KEY = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SERVER_SIGNATURE));

    // 生成token
    public static String generate(Map<String, Object> claim) {
        return Jwts.builder()
                .setClaims(claim) // 添加自定义信息
                .setIssuedAt(new Date()) // 设置签名时间
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION)) // 设置token过期时间
                .signWith(KEY) // 签名
                .compact();
    }

    // 解析token
    public static Claims parse(String token) {
        JwtParserBuilder jwtParserBuilder = Jwts.parser().setSigningKey(KEY);
        return jwtParserBuilder.build().parseClaimsJws(token).getBody();
    }
}
```

### 创建Jwt认证过滤器

#### 引入

之所以需要这个，是为了将Jwt认证逻辑整合到Spring Security中，在最基础的Jwt认证过滤中还可以用到拦截器+ Jwt认证，此处的过滤器功能比较类似于前面提到的拦截器

要实现校验，实际上就是为了拿到用户携带的Token，所以在Jwt认证过滤器中需要添加对Token的解析+校验

但是除了上面的解析+校验以外，还需要有一个将得到的用户信息存储到Spring Security上下文的逻辑，因为Spring Security依赖安全上下文（`SecurityContextHolder`）实现权限控制，具体工作流程是：当请求经过过滤器链时，后续的关键组件（如 `FilterSecurityInterceptor`）会从安全上下文中获取用户的 `Authentication` 对象，判断用户是否已认证以及是否拥有访问目标资源的权限，如果未设置上下文，即使 JWT 验证成功，Spring Security 也会认为当前请求是 “未认证” 的，从而拒绝访问受保护资源，其次JWT 认证的核心是 “无状态”（服务器不存储会话信息），而`SecurityContextHolder` 正是实现这一特性的关键

如何实现将用户认证信息存储到Spring Security的上下文？最常见的有两个步骤：

1. 创建认证对象
2. 将认证对象设置到安全上下文

#### 创建认证对象

首先是第一步：***\*创建认证对象\****，在Spring Security中提供了一个`UsernamePasswordAuthenticationToken`的类，这个类是 Spring Security 处理用户名密码认证的默认载体，其包含三个核心属性：

- `principal`：用户主体（通常是 `UserDetails` 对象）
- `credentials`：凭证（通常是密码，认证通过后可置空）
- `authorities`：用户拥有的权限集合（`GrantedAuthority` 集合，来自父类`AbstractAuthenticationToken`）

`UsernamePasswordAuthenticationToken`一般是配合`UserDetailService`使用的，在SpringSecurity中，`UserDetailService`是一个接口，其原型如下：

```java
public interface UserDetailsService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
```

这个方法是根据用户名获取到一个`UserDetails`对象，这个接口中保存了用户的用户名、权限等，定义如下：

```java
public interface UserDetails extends Serializable {
    Collection<? extends GrantedAuthority> getAuthorities(); // 权限集合

    String getPassword(); // 密码

    String getUsername(); // 用户名

    // 账户是否未过期（false则无法登录）
    default boolean isAccountNonExpired() { 
        return true;
    }

    // 账户是否未锁定（false则无法登录）
    default boolean isAccountNonLocked() {
        return true;
    }

    // 凭证（密码）是否未过期（false则无法登录）
    default boolean isCredentialsNonExpired() { 
        return true;
    }

    // 账户是否启用（false则无法登录）
    default boolean isEnabled() {
        return true;
    }
}
```

在SpringSecurity中，`UserDetailService`有以下实现类：

1. `InMemoryUserDetailsManager`：基于内存的用户存储，适用于测试或简单场景，无需数据库，直接在代码中定义用户信息
2. `JdbcUserDetailsManager`：基于 JDBC 的用户存储，通过 SQL 语句从关系型数据库加载用户，但是需遵循固定的表结构（如 `users` 表和 `authorities` 表）
3. `LdapUserDetailsManager`：用于 LDAP（轻量目录访问协议）认证，从 LDAP 服务器加载用户信息
4. Spring Data JPA 集成：通过 JPA 从数据库加载用户，需自定义实现（本质仍是自定义 `UserDetailsService`）
5. OAuth2相关实现：如 `OAuth2UserDetailsService`（扩展自 `UserDetailsService`），用于处理第三方登录用户信息

创建一个`UsernamePasswordAuthenticationToken`对象可以调用下面的构造方法：

```java
public UsernamePasswordAuthenticationToken(
    Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities) {
    super(authorities);
    this.principal = principal;
    this.credentials = credentials;
    super.setAuthenticated(true);
}
```

该方法中的`principal`就是上面通过`UserDetailService`的实现类获取到的一个实现了`UserDetail`的对象，在Spring Security中提供了一个`User`类，这个类实现了`UserDetail`

按照现在的步骤，会发现缺少权限集合和具体获取`User`类对象的方式，那么这个集合和对象从哪里来？这一点在下一节会具体谈到，此处先假设已经创建了`UsernamePasswordAuthenticationToken`对象

#### 将认证对象存储到Spring Security安全上下文中

这一步比较简单，只需要从`SecurityContextHolder`对象中获取到一个上下文对象，再调用`setAuthentication`将上一步的`UsernamePasswordAuthenticationToken`对象存入即可

不过有一个问题：`SecurityContextHolder`是如何保证同一个请求中使用的是同一个上下文对象呢？

SpringBoot项目本质上是多线程的，虽然`SecurityContextHolder.getContext()` 并不是单例的，它的设计与线程绑定（Thread-Bound）相关，但是因为单个请求的处理流程（如从过滤器到控制器、服务层）通常在**同一个线程**中完成，这使得 `SecurityContextHolder.getContext()`能在该请求的整个生命周期内获取到相同的认证信息

根据这一特性，在获取SpringSecurity上下文对象时就不需要额外去保存这个对象

保存的常见写法如下：

```java
// 将认证信息设置到Security上下文中
SecurityContextHolder.getContext().setAuthentication(authToken);
```

#### 继承OncePerRequestFilter类

上面已经讲完了Jwt认证过滤器中要实现的基本逻辑，但是这些逻辑应该写在哪才会被Spring Security调用呢？

既然是过滤器，肯定要实现`Filter`类，但是直接实现这个类还需要处理一些问题，例如过滤器逻辑被多次调用。所以，可以考虑继承`OncePerRequestFilter`，该类中提供了`getAlreadyFilteredAttributeName`方法，这个方法可以获取到请求属性，防止对同一个请求的重复调用

在`OncePerRequestFilter`中提供了一个抽象方法`doFilterInternal`，这个方法的具体实现会在该类的`doFilter`方法中判断没有被重复调用时被调用，具体可以看`OncePerRequestFilter`中`doFilter`的源码，此处不具体赘述

### 实现UserDetail类

上一节提到，在创建`UsernamePasswordAuthenticationToken`需要拿到`User`对象以及权限集合，为了实现这一步，可以考虑自定义实现`UserDetail`并实现`loadByUsername`方法

因为当前是基于数据库实现的数据获取，所以在实现`loadByUsername`方法时需要调用查询数据库的接口查询到对应的数据，例如基于提供的数据库：

```java
// 从数据库查询用户信息
User user = userMapper.findByUsername(username);
if (user == null) {
    throw new UsernameNotFoundException("用户不存在: " + username);
}
@Mapper
public interface UserMapper extends BaseMapper<User> {
    
    /**
     * 根据用户名查询用户信息
     * @param username 用户名
     * @return 用户信息
     */
    @Select("SELECT * FROM user WHERE username = #{username}")
    User findByUsername(String username);
}
```

另外，为了初始化权限集合，还需要查询角色表：

```java
// 查询用户角色信息
Role role = roleMapper.selectById(user.getRoleId());
if (role == null) {
    throw new UsernameNotFoundException("用户角色不存在");
}
// 构建用户权限列表
Collection<GrantedAuthority> authorities = new ArrayList<>();
authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getRole()));
```

`SimpleGrantedAuthority` 是 Spring Security 提供的 `GrantedAuthority` 接口的**默认实现类**，封装用户的权限信息（如角色、操作权限等），提供给 Spring Security 框架进行授权校验，其内部存储一个字符串类型的权限标识（如 `ROLE_管理员`），框架通过比对该标识与接口所需权限，判断用户是否有权访问资源

需要注意的是，此处必须带`ROLE_`前缀，因为 Spring Security 对**角色（Role）和权限（Authority）的区分策略**导致的，在Spring Security中，角色通常被视为一种特殊的权限，且默认要求角色名称必须以 `ROLE_` 为前缀，在 `SecurityConfig` 中配置角色权限时（如 `.hasRole("管理员")`），框架会自动在角色名称前拼接 `ROLE_` 进行校验

最后，创建`User`（Spring Security的）类对象并返回：

```java
// 返回Spring Security的User对象
return new org.springframework.security.core.userdetails.User(
        user.getUsername(),
        user.getPassword(),
        true, // enabled属性
        true, // accountNonExpired属性
        true, // credentialsNonExpired属性
        true, // accountNonLocked属性
        authorities // 权限集合
);
```

### 前三个类的实现与相互调用关系图

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        // 从请求头中获取Authorization字段
        final String authorizationHeader = request.getHeader("Authorization");
        
        String username = null;
        String jwt = null;
        
        // 检查Authorization头是否存在且以"Bearer "开头
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            // 提取JWT Token（去掉"Bearer "前缀）
            jwt = authorizationHeader.substring(7);
            try {
                // 从Token中提取用户名
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                logger.error("无法从JWT Token中提取用户名", e);
            }
        }
        
        // 如果提取到用户名且当前没有认证信息
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // 加载用户详情
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            // 验证Token是否有效
            if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
                
                // 创建认证Token
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, 
                        null, 
                        userDetails.getAuthorities()
                    );
                
                // 设置认证详情
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // 将认证信息设置到Security上下文中
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // 继续执行过滤器链
        filterChain.doFilter(request, response);
    }
}
@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private RoleMapper roleMapper;
    
    /**
     * 根据用户名加载用户信息
     * @param username 用户名
     * @return UserDetails对象
     * @throws UsernameNotFoundException 用户不存在异常
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 从数据库查询用户信息
        User user = userMapper.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("用户不存在: " + username);
        }
        
        // 查询用户角色信息
        Role role = roleMapper.selectById(user.getRoleId());
        if (role == null) {
            throw new UsernameNotFoundException("用户角色不存在");
        }
        
        // 构建用户权限列表
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getRole()));
        
        // 返回Spring Security的User对象
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                true, // enabled
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                authorities
        );
    }
}
```

<img src="spring-security.assets\image.png" style="width: 50%">

### Spring Security配置类

创建一个`Spring Security`的配置类`SecurityConfig`（名称任意），在这个类可以配置以下内容：

1. 密码编码器：用于指定密码的加密/解密方式，常见实现包括明文编码器、BCrypt 编码器等
2. 认证管理器：负责管理认证过程，通常通过`AuthenticationConfiguration`自动配置，用于处理用户登录时的身份验证
3. 安全过滤器链：这是 `SecurityConfig` 中最核心的配置，通过 `HttpSecurity` 定义请求授权规则、过滤器顺序、会话策略等。具体包括：
4. 请求授权规则：配置哪些 URL （`requestMatchers`接收指定的资源路径，`anyRequest`表示任意路径）允许匿名访问、需要特定角色/权限，或必须认证。常见的有以下几种配置：
5. 公开访问：通过 `permitAll()` 配置，允许所有用户（包括未认证用户）访问
6. 需要特定角色：通过`hasRole("角色1")`（仅允许拥有指定角色的用户访问（自动拼接 `ROLE_` 前缀））和`hasAnyRole("角色1", "角色2")`（允许拥有任意指定角色的用户访问）
7. 需要认证：`authenticated()` 要求用户必须登录（无论角色），但不限制具体权限
8. 拒绝所有访问：`denyAll()` 拒绝所有访问，无论是否认证或拥有权限（较少直接使用）
9. IP地址限制：可通过 `access()` 结合 IP 表达式限制访问

    ```java
    .requestMatchers("/internal/**").access((authentication, request) -> 
        new AuthorizationDecision(request.getRemoteAddr().startsWith("192.168."))
    )
    ```

10. CSRF 防护：JWT 无状态认证中通常禁用 CSRF
11. 会话管理策略：配置会话创建方式，JWT 场景下一般设置为无状态（不存储会话）
12. 自定义过滤器：添加自定义过滤器（如 JWT 认证过滤器）到过滤器链中，指定执行顺序

为了让Spring Security可以调用实现JWT认证过滤器以及限制接口访问，就需要具体实现Spring Security配置类：

```java
@Configuration
@EnableWebSecurity // 启用Spring Security
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    /**
     * 配置密码编码器
     * 使用明文密码（仅用于学习，生产环境不推荐）
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }
    
    /**
     * 配置认证管理器
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    /**
     * 配置安全过滤器链
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 禁用CSRF保护（因为使用JWT）
            .csrf(csrf -> csrf.disable())
            
            // 配置请求授权
            .authorizeHttpRequests(authz -> authz
                // 允许登录接口无需认证
                .requestMatchers("/auth/login", "/auth/test").permitAll()
                // 管理员接口需要管理员权限
                .requestMatchers("/admin/**").hasRole("管理员")
                // 用户接口需要普通用户或管理员权限
                .requestMatchers("/user/**").hasAnyRole("普通用户", "管理员")
                // 其他所有请求都需要认证
                .anyRequest().authenticated()
            )
            
            // 配置会话管理为无状态（使用JWT）
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // 添加JWT认证过滤器
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

需要注意JWT认证过滤器要在`UsernamePasswordAuthenticationFilter`，因为当前项目中是基于JWT做是否登录校验的，确保已经登录的用户先经过JWT校验而不是每一次都需要进行用户名和密码校验

在Spring Security中，有一套默认的过滤器链顺序（从先到后），核心过滤器包括：

1. `ChannelProcessingFilter`（通道处理，如 HTTP/HTTPS 切换）
2. `WebAsyncManagerIntegrationFilter`（整合异步请求）
3. `SecurityContextPersistenceFilter`（加载 / 存储安全上下文）
4. `AuthenticationProcessingFilter`（通用认证处理，如 JWT 过滤器通常放在这里）
5. `UsernamePasswordAuthenticationFilter`（用户名密码登录认证）
6. `RememberMeAuthenticationFilter`（记住我认证）
7. `AnonymousAuthenticationFilter`（匿名用户处理）
8. `SessionManagementFilter`（会话管理）
9. `FilterSecurityInterceptor`（最终权限校验）

### 整合登录处理接口

先实现Controller：

```java
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // 允许跨域请求
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
    
  
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("认证服务正常运行！");
    }
}
```

接着，实现`AuthService`。上面实现了一大堆目的就是在登录时可以做校验，那么校验的逻辑可以是什么呢？实际上，可以实现一种逻辑：

给未登录的用户创建一个`UsernamePasswordAuthenticationToken`对象并进入认证，在认证过程中，调用自定义的`UserDetail`实现类和提供的密码校验器进行用户名和密码的校验，如果认证通过，那么就说明是有效的用户，构建一个包含JWT Token的响应并返回即可，如下：

```java
public LoginResponse login(LoginRequest loginRequest) {
    try {
        // 使用Spring Security进行认证
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(), 
                loginRequest.getPassword()
            )
        );
        
        // 认证成功，获取用户信息
        User user = userMapper.findByUsername(loginRequest.getUsername());
        Role role = roleMapper.selectById(user.getRoleId());
        
        // 生成JWT Token
        String token = jwtUtil.generateToken(user.getUsername(), role.getRole());
        
        return new LoginResponse(token, user.getUsername(), role.getRole(), "登录成功");
        
    } catch (AuthenticationException e) {
        throw new RuntimeException("用户名或密码错误");
    }
}
```

因为在自定义的`UserDetail`实现类都创建了一个新的权限列表，这样可以确保每一次请求都是重新获取并设置最新的权限

对于已经认证的用户，只需要从Token中校验相关信息并更新权限列表即可

## 方法级权限校验

#### 基础介绍

上面的配置有针对类的（`/admin/**`, `/user/**`），也有针对方法的（`/auth/login, /auth/register, /auth/test`），有的时候我们可能不想使用上面的配置，那么可以考虑使用方法级权限校验

首先需要在配置类`SecurityConfig`上添加`@EnableMethodSecurity`：

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    // ...
}
```

接着，在方法上添加`@PreAuthorize`注解，其值可以是`hasRole()`函数，例如：

```java
@RestController
@RequestMapping("/method")
public class MethodController {

    // 管理员和用户都能访问
    @RequestMapping("/all")
    @PreAuthorize("hasRole('管理员') or hasRole('普通用户')")
    public String all() {
        return "管理员和用户都能访问";
    }

    // 只有普通用户可以访问
    @RequestMapping("/onlyUser")
    @PreAuthorize("hasRole('普通用户')")
    public String onlyUser() {
        return "用户都能访问";
    }

    // 只有普通管理员可以访问
    @RequestMapping("/onlyAdmin")
    @PreAuthorize("hasRole('管理员')")
    public String onlyAdmin() {
        return "管理员能访问";
    }
}
```

除了`hasRole()`以外，在`@PreAuthorize`中还可以添加下面的内容：

### 角色权限相关

- `hasRole('ADMIN')` - 检查是否有指定角色
- `hasAnyRole('USER', 'ADMIN')` - 检查是否有任意一个指定角色
- `hasAuthority('READ')` - 检查是否有指定权限
- `hasAnyAuthority('READ', 'WRITE')` - 检查是否有任意一个指定权限

### 用户身份相关

- `isAuthenticated()` - 检查用户是否已认证
- `isAnonymous()` - 检查是否为匿名用户
- `isRememberMe()` - 检查是否通过记住我功能登录
- `isFullyAuthenticated()` - 检查是否完全认证（排除记住我）

### 用户信息相关

- `principal.username == 'admin'` - 检查当前用户名
- `authentication.name == 'john'` - 检查认证对象的名称
- `principal.id == #userId` - 检查用户ID（`#userId`为方法参数）

### 逻辑运算符

- `and` 或 `&&` - 逻辑与
- `or` 或 `||` - 逻辑或
- `not` 或 `!` - 逻辑非

### 方法参数访问

- `#param` - 访问方法参数
- `#param.property` - 访问参数的属性
- `@beanName.method(#param)` - 调用Spring Bean的方法

### 常用组合示例

- `hasRole('ADMIN') or (hasRole('USER') and #userId == principal.id)`
- `hasAuthority('READ') and @securityService.canAccess(#resourceId)`
- `isAuthenticated() and principal.username != 'guest'`