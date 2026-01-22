<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Ubuntu下安装和卸载MySQL

下面的演示系统版本：Ubuntu 24.04

## 更新系统软件包

在开始安装之前，建议先更新系统的软件包列表，以确保所有依赖项是最新的。

```bash
sudo apt update && sudo apt upgrade -y
```

## 安装MySQL服务器

Ubuntu的官方软件仓库中通常包含MySQL的最新稳定版本，可以通过`apt`包管理器直接安装

### 安装MySQL服务器

运行以下命令来安装MySQL：

```bash
sudo apt install mysql-server -y
```

### 检查MySQL服务状态
安装完成后，MySQL服务会自动启动。可以使用以下命令检查其状态：

```bash
sudo systemctl status mysql
```

如果服务正在运行，将看到类似以下的输出：

```
● mysql.service - MySQL Community Server
     Loaded: loaded (/lib/systemd/system/mysql.service; enabled; vendor preset: enabled)
     Active: active (running) since ...
```

如果服务未启动，可以手动启动它：

```bash
sudo systemctl start mysql
```

### 配置MySQL安全性
为了提高MySQL的安全性，建议运行 MySQL 自带的安全脚本`mysql_secure_installation`

#### 启动安全配置脚本

运行以下命令：

```bash
sudo mysql_secure_installation
```

#### 按照提示完成配置

- **设置密码验证策略**：选择密码强度（推荐选择`MEDIUM`或更高）
- **设置 root 用户密码**：为MySQL的`root`用户设置一个强密码（默认会跳过输入密码的过程，具体原因在下面会介绍，此处先完成安装步骤）
- **删除匿名用户**：选择`Y`删除匿名用户
- **禁止远程 root 登录**：选择`Y`禁止通过网络远程登录`root`用户
- **删除测试数据库**：选择`Y`删除默认的测试数据库
- **重新加载权限表**：选择`Y`应用更改

## 登录MySQL并验证安装

完成上述步骤后，您可以尝试登录MySQL来验证安装是否成功

### 使用`root`用户登录

运行以下命令并输入之前设置的`root`密码（）：

```bash
sudo mysql -u root -p
```

需要注意，如果跳过了设置密码，那么此处登录就直接会进入MySQL。默认情况下使用`auth_socket`进行身份验证，因此跳过为`root`设置的密码。如果想使用密码身份验证，可以使用登录MySQL并使用下面的命令设置密码：

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '输入新密码';
FLUSH PRIVILEGES;
```

设置完新密码后，下次登录就需要输入刚才设置的新密码进行登录MySQL

### 检查MySQL版本

登录成功后，运行以下SQL命令查看MySQL版本：

```sql
SELECT VERSION();
```

您将看到类似以下的输出：
```
+-------------------------+
| VERSION()               |
+-------------------------+
| 8.0.xx-0ubuntu0.xx.x    |
+-------------------------+
```

### 退出MySQL

输入以下命令退出 MySQL：

```sql
EXIT;
```

## 配置远程访问（可选）

如果您需要从其他机器访问MySQL数据库，请按照以下步骤配置远程访问

### 修改MySQL配置文件

编辑 MySQL 的主配置文件 `/etc/mysql/mysql.conf.d/mysqld.cnf`：

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

找到以下行并注释掉（或修改为 `0.0.0.0`）：

```
bind-address = 127.0.0.1
```

改为：

```
bind-address = 0.0.0.0
```

保存并退出编辑器

### 创建远程用户

登录 MySQL 并创建一个允许远程访问的用户。例如：

```sql
CREATE USER 'remote_user'@'%' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

### 重启MySQL服务
应用更改并重启 MySQL 服务：

```bash
sudo systemctl restart mysql
```

### 配置防火墙规则

确保防火墙允许MySQL的默认端口（3306）流量：

```bash
sudo ufw allow 3306/tcp
sudo ufw reload
```

## 备份与恢复（可选）
定期备份数据库是确保数据安全的重要措施。

### 备份数据库

使用`mysqldump`工具备份数据库：

```bash
mysqldump -u root -p --databases your_database_name > backup.sql
```

### 恢复数据库

使用以下命令从备份文件恢复数据库：

```bash
mysql -u root -p < backup.sql
```

## 卸载 MySQL（可选）

如果您需要卸载 MySQL，可以运行以下命令：

```bash
sudo apt remove --purge mysql-server mysql-client mysql-common -y
sudo rm -rf /etc/mysql /var/lib/mysql
sudo apt autoremove -y
sudo apt autoclean
```