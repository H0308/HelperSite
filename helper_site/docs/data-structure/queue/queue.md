# 队列

## 队列介绍

队列：只允许在一端进行插入数据操作，在另一端进行删除数据操作的特殊线性表，队列具有先进先出FIFO(First In First Out) 

入队列：进行插入操作的一端称为队尾

出队列：进行删除操作的一端称为队头

<img src="images\image.jpeg">

!!! note
    注意队列不同于栈，出队列顺序和入队列顺序必定刚好相反（即满足先进先出）

## 队列实现

队列也可以数组和链表的结构实现，使用链表的结构实现更优一些，因为如果使用数组的结构，出队列在数组头上出数据，效率会比较低

### 队列结构

```c
//基本结构
//定义队列的数据节点
typedef struct QueueNode
{
    QDataType data;
    struct QueueNode* next;// 下一个数据节点的位置
}QNode;

//定义管理队列的结构
typedef struct Queue
{
    QNode* phead;// 队列头
    QNode* ptail;// 队列尾，便于找尾结点，省去每次入队都需要遍历队列
    int size;// 队列的数据个数
}Queue;
```

### 队列主要实现功能

```c
//初始化队列
void QueueInit(Queue* q);
//销毁队列
void QueueDestroy(Queue* q);
//数据入队
void QueuePush(Queue* q, QDataType x);
//数据出队
void QueuePop(Queue* q);
//获取队尾数据
QDataType QueueRear(Queue* q);
//获取队头数据
QDataType QueueFront(Queue* q);
//判断队列是否为空
bool QueueEmpty(Queue* q);
//获取队列元素个数
int QueueSize(Queue* q);
```

#### 初始化队列

```c
//初始化队列
void QueueInit(Queue* q)
{
    //判断是否存在队列
    assert(q);

    q->phead = q->ptail = NULL;
    q->size = 0;
}
```

#### 销毁队列

```c
//销毁队列
void QueueDestroy(Queue* q)
{
    //确保有队列的存在
    assert(q);
    //删除队列的每一个节点
    //注意循环条件不要用!QueueEmpty(q)，因为如果!QueueEmpty(q)只能说明队列不为空，但是q->phead是否为空不确定
    while (q->phead)
    {
        QNode* next = q->phead->next;
        free(q->phead);
        q->phead = next;
    }
    q->phead = q->ptail = NULL;
    q->size = 0;
}
```

#### 数据入队

```c
//数据入队
void QueuePush(Queue* q, QDataType x)
{
    //确保存在队列
    assert(q);

    //为数据创建节点
    QNode* newNode = (QNode*)malloc(sizeof(QNode));
    assert(newNode);
    newNode->data = x;
    newNode->next = NULL;
    //插入数据
    //队列为空，更新头和尾节点
    //队列不为空，更新尾结点
    //尾插思路
    if (!q->ptail)
    {
        q->phead = q->ptail = newNode;
    }
    else
    {
        q->ptail->next = newNode;
        q->ptail = q->ptail->next;//更新ptail到新的节点
    }

    //注意更新size
    q->size++;
}
```

#### 数据出队

```c
//数据出队
void QueuePop(Queue* q)
{
    //确保有队列存在
    assert(q);
    //如果队列为空不执行删除
    assert(!QueueEmpty(q));

    //头删思路
    if (q->phead == q->ptail)
    {
        //注意考虑到最后一个指针的ptail需要置空问题，防止野指针
        q->ptail = NULL;
    }
    QNode* next = q->phead->next;
    free(q->phead);
    q->phead = next;

    //注意更新size
    q->size--;
}
```

#### 获取队尾数据

```c
//获取队尾数据
QDataType QueueRear(Queue* q)
{
    //确保有队列存在
    assert(q);
    //确保队列不为空
    assert(!QueueEmpty(q));

    //返回ptail指向的位置的值
    return q->ptail->data;
}
```

#### 获取队头数据

```c
//获取队头数据
QDataType QueueFront(Queue* q)
{
    //确保有队列存在
    assert(q);
    //确保队列不为空
    assert(!QueueEmpty(q));

    //返回phead指向的位置的值
    return q->phead->data;
}
```

#### 判断队列是否为空

```c
//判断队列是否为空
bool QueueEmpty(Queue* q)
{
    //确保有队列的存在
    assert(q);

    return q->phead == NULL && q->ptail == NULL && q->size == 0;
}
```

#### 获取队列元素个数

```c
//获取队列元素个数
int QueueSize(Queue* q)
{
    //确保有队列的存在
    assert(q);

    return q->size;
}
```

## 队列基础练习

### 用队列实现栈

见[算法：栈和队列篇](https://www.help-doc.top/%E7%AE%97%E6%B3%95/6.%20%E6%A0%88%E5%92%8C%E9%98%9F%E5%88%97%E7%AF%87/2.%20%E6%A0%88%E5%92%8C%E9%98%9F%E5%88%97%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0/2.%20%E6%A0%88%E5%92%8C%E9%98%9F%E5%88%97%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0.html#225)

### 用栈实现队列

见[算法：栈和队列篇](https://www.help-doc.top/%E7%AE%97%E6%B3%95/6.%20%E6%A0%88%E5%92%8C%E9%98%9F%E5%88%97%E7%AF%87/2.%20%E6%A0%88%E5%92%8C%E9%98%9F%E5%88%97%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0/2.%20%E6%A0%88%E5%92%8C%E9%98%9F%E5%88%97%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0.html#232)

### 设计循环队列

见[算法：栈和队列篇](https://www.help-doc.top/%E7%AE%97%E6%B3%95/6.%20%E6%A0%88%E5%92%8C%E9%98%9F%E5%88%97%E7%AF%87/2.%20%E6%A0%88%E5%92%8C%E9%98%9F%E5%88%97%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0/2.%20%E6%A0%88%E5%92%8C%E9%98%9F%E5%88%97%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0.html#622)