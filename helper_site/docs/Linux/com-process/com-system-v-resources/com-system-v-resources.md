<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# 操作系统管理System V标准中三种资源的方式

前面介绍了四种进程间通信的方式，其中共享内存、消息队列和信号量属于System V标准的通信方式，在使用这三种进程间通信方式时可以发现其中的接口都比较类似，如下表所示：

操作\通信方式|共享内存 | 消息队列 | 信号量
---------|--------|----------|---------
申请资源| `shmget` | `msgget` | `semget`
操作资源| 常规读写操作 | `msgsnd`和`msgrcv` | `semop`
释放资源| `shmctl` | `msgctl` | `semctl`

## 从应用层了解三种通信方式的属性

因为遵循着同一个标准，所以三者的操作都大差不差，所以操作系统底层为了更方便管理这三种资源，就考虑对这三种资源进行统一管理，分析如下：

首先查看共享内存的相关定义：

=== "共享内存结构"

    ```c
    struct shmid_ds {
        struct ipc_perm shm_perm;    /* Ownership and permissions */
        size_t          shm_segsz;   /* Size of segment (bytes) */
        time_t          shm_atime;   /* Last attach time */
        time_t          shm_dtime;   /* Last detach time */
        time_t          shm_ctime;   /* Creation time/time of last
                                        modification via shmctl() */
        pid_t           shm_cpid;    /* PID of creator */
        pid_t           shm_lpid;    /* PID of last shmat(2)/shmdt(2) */
        shmatt_t        shm_nattch;  /* No. of current attaches */
        ...
    };
    ```

=== "共享内存第一个成员结构"

    ```c
    struct ipc_perm {
        key_t          __key;    /* Key supplied to shmget(2) */
        uid_t          uid;      /* Effective UID of owner */
        gid_t          gid;      /* Effective GID of owner */
        uid_t          cuid;     /* Effective UID of creator */
        gid_t          cgid;     /* Effective GID of creator */
        unsigned short mode;     /* Permissions + SHM_DEST and
                                    SHM_LOCKED flags */
        unsigned short __seq;    /* Sequence number */
    };
    ```

接着查看消息队列的相关定义：

=== "消息队列结构"

    ```c
    struct msqid_ds {
        struct ipc_perm msg_perm;   /* Ownership and permissions */
        time_t          msg_stime;  /* Time of last msgsnd(2) */
        time_t          msg_rtime;  /* Time of last msgrcv(2) */
        time_t          msg_ctime;  /* Time of creation or last
                                        modification by msgctl() */
        unsigned long   msg_cbytes; /* # of bytes in queue */
        msgqnum_t       msg_qnum;   /* # number of messages in queue */
        msglen_t        msg_qbytes; /* Maximum # of bytes in queue */
        pid_t           msg_lspid;  /* PID of last msgsnd(2) */
        pid_t           msg_lrpid;  /* PID of last msgrcv(2) */
    };
    ```

=== "消息队列第一个成员结构"

    ```c
    struct ipc_perm {
        key_t          __key;       /* Key supplied to msgget(2) */
        uid_t          uid;         /* Effective UID of owner */
        gid_t          gid;         /* Effective GID of owner */
        uid_t          cuid;        /* Effective UID of creator */
        gid_t          cgid;        /* Effective GID of creator */
        unsigned short mode;        /* Permissions */
        unsigned short __seq;       /* Sequence number */
    };
    ```

最后查看信号量的相关定义：

=== "信号量相关结构"

    ```c
    struct semid_ds {
        struct ipc_perm sem_perm;  /* Ownership and permissions */
        time_t          sem_otime; /* Last semop time */
        time_t          sem_ctime; /* Creation time/time of last
                                        modification via semctl() */
        unsigned long   sem_nsems; /* No. of semaphores in set */
    };
    ```

=== "信号量第一个成员结构"

    ```c
    struct ipc_perm {
        key_t          __key; /* Key supplied to semget(2) */
        uid_t          uid;   /* Effective UID of owner */
        gid_t          gid;   /* Effective GID of owner */
        uid_t          cuid;  /* Effective UID of creator */
        gid_t          cgid;  /* Effective GID of creator */
        unsigned short mode;  /* Permissions */
        unsigned short __seq; /* Sequence number */
    };
    ```

从上面的三部分代码可以看出，不论是共享内存、消息队列，还是信号量，三者的第一个成员都是`struct ipc_perm`结构，这个结构用于存放当前资源的相关权限已经标识符，例如其中的`__key`表示资源在系统中的编号，另外还有对应的`uid`表示持有当前资源的用户，三者除了有`struct ipc_perm`结构外，还有一些其他成员也基本类似，共同组成了指定的资源

其他属性暂时不考虑，主要看每一种资源的第一个成员为什么都是`struct ipc_perm`，实际上这就是操作系统将三种资源都看成一种资源来管理的原因

通过代码获取对应的属性如下：

```c++
void getInfo()
{
    struct shmid_ds buffer; // 系统提供的数据类型
    int n = shmctl(_shmid, IPC_STAT, &buffer);
    if(n < 0) 
        return;
    std::cout << buffer.shm_atime << std::endl;
    std::cout << buffer.shm_cpid << std::endl;
    std::cout << buffer.shm_ctime << std::endl;
    std::cout << buffer.shm_nattch << std::endl;
    std::cout << buffer.shm_perm.__key << std::endl;
}
```

## 从内核层了解三者通信方式管理的本质

操作系统为了管理三种通信方式的资源，会通过一个数据结构进行管理，在Linux 2.6版本的内核中结构如下：

```c
struct ipc_ids {
	int size;
	int in_use;
	int max_id;
	unsigned short seq;
	unsigned short seq_max;
	struct semaphore sem;	
	struct ipc_id* entries;
};
```

通过上面的结构，操作系统创建出三个对象分别为：

=== "共享内存"

    ```c
    static struct ipc_ids shm_ids;
    ```

=== "消息队列"

    ```c
    static struct ipc_ids msg_ids;
    ```

=== "信号量"

    ```c
    static struct ipc_ids sem_ids;
    ```

上面三个结构对象中都存在着一个成员：

```c
struct ipc_id* entries;
```

该成员具体实现如下：

```c
struct ipc_id {
	struct kern_ipc_perm* p;
};
```

对应的`struct kern_ipc_perm`结构如下：

```c
struct kern_ipc_perm
{
	spinlock_t	lock;
	int		deleted;
	key_t		key;
	uid_t		uid;
	gid_t		gid;
	uid_t		cuid;
	gid_t		cgid;
	mode_t		mode; 
	unsigned long	seq;
	void		*security;
};
```

这个结构中的`struct kern_ipc_perm`实际上就是应用层的`struct ipc_perm`，从每一个资源的结构也可以得出这个结论：

=== "共享内存"

    ```c
    struct shmid_kernel /* private to the kernel */
    {	
        struct kern_ipc_perm	shm_perm;
        struct file *		shm_file;
        int			id;
        unsigned long		shm_nattch;
        unsigned long		shm_segsz;
        time_t			shm_atim;
        time_t			shm_dtim;
        time_t			shm_ctim;
        pid_t			shm_cprid;
        pid_t			shm_lprid;
    };
    ```

=== "消息队列"

    ```c
    struct msg_queue {
        struct kern_ipc_perm q_perm;
        time_t q_stime;			/* last msgsnd time */
        time_t q_rtime;			/* last msgrcv time */
        time_t q_ctime;			/* last change time */
        unsigned long q_cbytes;		/* current number of bytes on queue */
        unsigned long q_qnum;		/* number of messages in queue */
        unsigned long q_qbytes;		/* max number of bytes on queue */
        pid_t q_lspid;			/* pid of last msgsnd */
        pid_t q_lrpid;			/* last receive pid */

        struct list_head q_messages;
        struct list_head q_receivers;
        struct list_head q_senders;
    };
    ```

=== "信号量"

    ```c
    struct sem_array {
        struct kern_ipc_perm	sem_perm;	/* permissions .. see ipc.h */
        time_t			sem_otime;	/* last semop time */
        time_t			sem_ctime;	/* last change time */
        struct sem		*sem_base;	/* ptr to first semaphore in array */
        struct sem_queue	*sem_pending;	/* pending operations to be processed */
        struct sem_queue	**sem_pending_last; /* last pending operation */
        struct sem_undo		*undo;		/* undo requests on this array */
        unsigned long		sem_nsems;	/* no. of semaphores in array */
    };
    ```

因为每一个`struct ipc_ids`对象都有一个`struct kern_ipc_perm`成员，这个指针指向着一个动态开辟的空间，现在假设有三个资源的对象如下：

```c
// 共享内存
struct shmid_kernel shm;
// 消息队列
struct msg_queue msg;
// 信号量
struct sem_array sems;
```

操作系统获取到这三个对象就可以访问该对象对应的资源，即结构体中相关的成员。在C语言中，结构体的地址有一个特性：**第一个成员的地址就是结构体的地址**，此时操作系统就可以通过对上面三个对象进行强制类型转换使其成为`struct kern_ipc_perm *p`中的元素，例如：

```c
// 共享内存
p[0] = (struct kern_ipc_perm*)&shm;
// 消息队列
p[1] = (struct kern_ipc_perm*)&msg;
// 信号量
p[2] = (struct kern_ipc_perm*)&sems;
```

此时操作系统就可以通过管理`struct kern_ipc_perm *p`统一对三个资源进行管理，而因为`struct kern_ipc_perm`中含有相关的成员，例如`key`，所以这个`key`实际上是一个三个资源共有的成员，也就是说三个资源都需要同一种`key`

如果此时需要通过`struct kern_ipc_perm *p`访问指定成员就可以再次通过强制转换为具体的资源访问对应资源中的其他成员：

```c
// 共享内存
(struct shmid_kernel*)p[0]->...
// 消息队列
(struct msg_queue*)p[1]->...
// 信号量
(struct sem_array*)p[2]->...
```

实际上，上面的过程就是多态的基本原理，其中`struct kern_ipc_perm`就是基类（父类），`struct shmid_kernel`、`struct msg_queue`和`struct sem_array`就是派生类（子类）

## 再谈共享内存

在共享内存的结构中，存在一个特殊的成员：

```c
struct shmid_kernel /* private to the kernel */
{	
    // ...
    struct file *		shm_file;
    // ...
};
```

这个结构在文件部分也提到过，但是为什么作为内存也会存在这个结构，本质就是以为共享内存本质也是一个打开的文件，但是它并没有使用到文件的相关接口，这也是为什么他比管道的速度快，既然如此，其就需要将对应的地址映射到进程的虚拟地址空间，在进程地址空间结构的`vm_area_struct`中也存在一个结构如下：

```c
struct vm_area_struct {
    // ...
	struct file * vm_file;		/* File we map to (can be NULL). */
    // ...
};
```

通过这个指针，就可以将共享内存这个文件映射到进程地址空间，而进程要访问就需要对应的起始地址和终止地址，即：

```c
struct vm_area_struct {
    // ...
	unsigned long vm_start;		/* Our start address within vm_mm. */
	unsigned long vm_end;		/* The first byte after our end address*/
    // ...
};
```

这就是为什么共享内存可以直接使用常规的读写操作而不需要使用文件接口的原因

同样，如果需要将用户打开的文件映射到进程地址空间，可以使用`mmap`接口：

```c
void *mmap(void *addr, size_t length, int prot, int flags, int fd, off_t offset);
```

接口中的第一个参数表示映射的地址，如果传递`NULL`表示让系统自动选择映射地址，第二个参数表示文件的大小，第三个参数表示文件的权限，第四个参数表示映射文件的类型，第五个参数为文件描述符，第六个参数为文件内容的偏移量。该接口返回映射的地址，在取消映射时需要使用

对于第二个参数来说，其获取的方式有下面三种：

1. 通过`struct stat`结构中的`st_size`属性确定
2. 通过`lseek`获取偏移量确定
3. 通过`fseek`及`ftell`确定

`struct stat`结构定义如下：

```c
struct stat {
    dev_t     st_dev;         /* 设备ID */
    ino_t     st_ino;         /* inode号 */
    mode_t    st_mode;        /* 文件类型和权限 */
    nlink_t   st_nlink;       /* 硬链接数 */
    uid_t     st_uid;         /* 用户ID */
    gid_t     st_gid;         /* 组ID */
    dev_t     st_rdev;        /* 设备类型 */
    off_t     st_size;        /* 文件大小(字节) */
    blksize_t st_blksize;     /* 块大小 */
    blkcnt_t  st_blocks;      /* 分配的块数 */
    time_t    st_atime;       /* 最后访问时间 */
    time_t    st_mtime;       /* 最后修改时间 */
    time_t    st_ctime;       /* 最后状态改变时间 */
};
```

后两种方式获取文件大小的代码如下：

=== "`lseek`获取"

    ```c
    off_t size = lseek(fd, 0, SEEK_END);
    ```

=== "`fseek`及`ftell`获取"

    ```c
    fseek(fp, 0, SEEK_END);
    long size = ftell(fp);
    ```

需要注意，如果文件已经映射到了进程的地址空间，但是文件在取消映射之前已经关闭，此时不会自动取消映射，所以关闭文件后还需要手动解除映射，可以使用`munmap`接口取消映射：

```c
int munmap(void *addr, size_t length);
```

接口第一个参数传递映射的地址，第二个参数传递文件的大小

例如下面使用`mmap`进行文件映射的示例代码：

```c
#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main() {
    // 打开文件
    int fd = open("text.txt", O_RDWR);
    if (fd == -1) {
        perror("open");
        exit(1);
    }

    // 获取文件大小
    struct stat sb;
    if (fstat(fd, &sb) == -1) {
        perror("fstat");
        exit(1);
    }

    // 映射文件
    char *addr = mmap(
        NULL,                   // 让系统自动选择映射地址
        sb.st_size,            // 映射长度
        PROT_READ | PROT_WRITE,// 可读可写
        MAP_SHARED,            // 映射类型为共享
        fd,                    // 文件描述符
        0                      // 偏移量
    );

    if (addr == MAP_FAILED) {
        perror("mmap");
        exit(1);
    }

    // 关闭文件描述符(映射仍然有效)
    close(fd);

    // 使用映射的内存
    printf("文件内容: %s\n", addr);

    // 解除映射
    if (munmap(addr, sb.st_size) == -1) {
        perror("munmap");
        exit(1);
    }

    return 0;
}
```