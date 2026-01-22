<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# 常见MCP工具配置

## ChromeDevTools

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

## MySQL MCP

```json
{
  "mcpServers": {
    "mcp-mysql-server": {
      "command": "npx",
      "args": ["-y", "@f4ww4z/mcp-mysql-server"],
      "env": {
        "MYSQL_HOST": "localhost", // 数据库连接地址
        "MYSQL_USER": "root", // 用户名
        "MYSQL_PASSWORD": "root", // 密码
        "MYSQL_DATABASE": "db_name" // 数据库名称
      },
      "transportType": "stdio",
      "autoApprove": [
        "list_tables",
        "connect_db",
        "execute",
        "query",
        "describe_table"
      ]
    }
  }
}
```

## Postman MCP

先到[Postman个人中心](https://web.postman.co/settings/me/api-keys)申请Postman API Key，再到AI编辑器中进行MCP的配置

```json
{
  "mcpServers": {
    "postman-api": {
      "args": [
        "mcp-remote",
        "https://mcp.postman.com/mcp",
        "--header",
        "Authorization: Bearer PMAK-xxx-api-key" // 此处需要输入个人Postman 密钥
      ],
      "command": "npx",
      "disabled": false,
      "disabledTools": [],
      "env": {}
    }
  }
}
```