<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# Docker存储卷

## 存储卷介绍和作用

存储卷（Volume）是 Docker 提供的持久化数据机制，用于将容器内的数据独立于容器生命周期进行保存与共享，避免容器删除或重建导致数据丢失，同时支持在多个容器之间安全地共享数据，并且相比直接使用容器文件系统，性能更稳定、管理更方便、迁移备份也更容易

## 存储卷分类

- volume（Docker管理卷）：默认映射到宿主机的`/var/lib/docker/volumes`目录下，只需在容器内指定挂载点，实际宿主机目录由Docker daemon自动创建或使用已有目录与卷建立关联，降低了卷与宿主机路径的耦合；缺点是用户无法指定具体宿主机目录，适合临时存储
- bind mount（绑定数据卷）：映射到宿主机指定路径，宿主机与容器内都需要手动指定路径，通过已知路径建立关联
- tmpfs mount（临时数据卷）：映射到宿主机内存中，容器停止后tmpfs会被移除，数据丢失，适合高性能的临时数据存储

## 管理卷操作

### 创建管理卷

使用下面的命令进行管理卷创建：

```bash
docker volume create [选项] [卷名]
```

常见选项：

- `-d, --driver`：指定驱动，默认是`local`
- `--label`：指定元数据

需要注意的是，如果不指定卷名，默认创建的是匿名卷

### 查看管理卷详细信息

使用下面的命令查看管理卷详细信息：

```bash
docker volume inspect [选项] 卷名...
```

常见选项：

- `-f`：指定输出格式

### 列出所有管理卷

使用下面的命令列出所有管理卷：

```bash
docker volume ls [选项]
```

常见选项：

- `--format`：指定输出格式（如`json`、`table`）
- `--filter, -f`：过滤显示内容
- `-q`：仅显示名称

### 删除未被使用的管理卷

使用下面的命令删除未被使用的管理卷：

```bash
docker volume rm [选项] 卷名...
```

常见选项：

- `-f`：强制删除

需要注意的是，删除必须确保卷是处于未使用状态，哪怕是强制删除

### 清理未被使用的匿名管理卷

使用下面的命令删除未被使用的管理卷：

```bash
docker volume prune [选项]
```

常见选项：

- `--filter`：根据指定条件过滤卷
- `-f, --force`：不进行删除提示

## 绑定卷操作

## 临时卷操作

