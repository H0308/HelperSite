<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# 链表

## 链表介绍
链表是线性表中的其中一种结构，链表在物理存储结构上是非连续、非顺序的存储结构，数据元素的逻辑顺序是通过链表中的指针链接次序实现的。在链表中，每一个存储空间都是独立申请的（需要添加数据时申请），也被称为节点（结点）

链表节点有两个组成部分：

1. 当前节点需要保存的数据
2. 保存的节点的位置

```c
//单链表结构体定义
//定义需要存储的数据类型
typedef int SListDataType;

//链表节点结构体定义
typedef struct SListNode
{
    SListDataType data;//存储数据
    struct SListNode* next;//结构体指针指向后一个结构体（节点）
}SLN;

//双向链表结构体定义
//定义存储的数据类型
typedef int DlistDataType;

//链表节点结构体定义
typedef struct DlistNode
{
    DlistDataType data;//存储数据
    struct DlistNode* pprev;//结构体指针指向前一个节点
    struct DListNode* next;//结构体指针指向后一个节点
}DLN;
```

## 链表示意图

以单链表为例

<img src="images\image.png">

## 链表的特点

1. 链式结构在逻辑上是连续的，在物理结构上不一定连续
2. 节点⼀般是从堆上申请的
3. 从堆上申请来的空间，是按照⼀定策略分配出来的，每次申请的空间可能连续，可能不连续

## 链表的分类

<img src="images\image1.png">

<img src="images\image3.png">

## 单链表

### 链表实现前置须知

链表实现时需要熟悉的三个`NULL`：

1. 函数形参中的二级指针`pphead`为`NULL`：说明未正确传入指向链表首节点的指针的地址
2. 头指针`phead`为`NULL`：说明链表中还未创建节点。链表还未创建节点则代表头指针`phead`中的值为`NULL`，而`phead`本身也是指针变量，有着自己的地址，将该地址给二级指针时二级指针则不为空（`pphead = &phead`）
3. 节点指针域为`NULL`：说明当前节点为最后一个节点

### 主要实现功能

```C
//链表数据的打印（遍历链表）
void SLTPrint(SLTNode* phead);
//头部插⼊删除/尾部插⼊删除 
void SLTPushBack(SLTNode** pphead, SLTDataType x);
void SLTPushFront(SLTNode** pphead, SLTDataType x);
void SLTPopBack(SLTNode** pphead);
void SLTPopFront(SLTNode** pphead);
//查找链表中的数据 
SLTNode* SLTFind(SLTNode* phead, SLTDataType x);
//在指定位置之前插⼊数据 
void SLTInsert(SLTNode** pphead, SLTNode* pos, SLTDataType x);
//删除pos节点 
void SLTErase(SLTNode** pphead, SLTNode* pos);
//在指定位置之后插⼊数据 
void SLTInsertAfter(SLTNode* pos, SLTDataType x);
//删除pos之后的节点 
void SLTEraseAfter(SLTNode* pos);
//销毁链表 
void SListDesTroy(SLTNode** pphead);
```

### 链表数据的打印（遍历链表）

```C
//链表数据的打印（遍历链表）
void SLNPrint(SLN* phead)
{
    SLN* pstart = phead;//定义一个临时结构体指针变量，直接使用phead遍历会使最后找不到链表的开始处
    //使用while循环遍历
    //结束条件是pstart不为空指针，因为pstart在遍历的过程中会被更新为当前结构体的下一个结构体地址
    //一旦pstart存储为最后一个节点中存储地址的部分的NULL值则退出循环
    while (pstart)
    {
        printf("%d->", pstart->data);
        pstart = pstart->next;
    }
    printf("NULL\n");
}
```

### 链表的头部插入

```C
//开辟新空间，用于存储需要插入的新数据
SLN* applySpace(SListDataType x)
{
    SLN* phead = (SLN*)malloc(sizeof(SLN));
    assert(phead);
    phead->data = x;
    //开辟的新空间中，存储下一个节点地址的部分要置为空，防止野指针
    phead->next = NULL;

    return phead;
}

//链表的头部插入
void SLNPushFront(SLN** pphead, SListDataType x)
{
    assert(pphead);
    SLN* newnode = applySpace(x);

    //将形参指向的链表的第一个节点的地址给新开辟的节点中的存储下一个节点地址部分
    newnode->next = *pphead;
    *pphead = newnode;//将初始的第一个节点中存储下一个节点的部分存储新开辟的节点的地址
}
```

### 链表的尾部插入

```C
void SLNPushBack(SLN** pphead, SListDataType x)
{
    assert(pphead);

    //开辟新空间
    SLN* newnode = applySpace(x);
    //如果新开辟的空间为链表的第一个节点，则将新节点作为首节点
    if (*pphead == NULL)
    {
        *pphead = newnode;
        return;
    }
    //尾部插入的前提是先找到最后一个节点
    //因为最后一个节点中存储下一个节点地址的部分为NULL，故可以遍历链表直到找到该部分为NULL为止
    SLN* pmove = *pphead;//防止丢失链表的第一个节点
    //使用next作为终止条件，而不是pmove为终止条件，当pmove为终止条件时，即pmove = NULL，
    while (pmove->next)
    {
        pmove = pmove->next;
    }

    pmove->next = newnode;
}
```

### 链表的头部删除

```C
//链表的头部删除
void SLNPopFront(SLN** pphead)
{
    assert(pphead);

    //判断链表是否为空链表
    //如果为空链表则不执行删除操作
    if (*pphead == NULL)
    {
        return;
    }

    SLN* BlocktoFree = *pphead;
    //如果链表不为空时，执行删除操作

    //释放完空间后首节点需要改变
    *pphead = (*pphead)->next;
    //删除节点需要释放开辟的内存空间
    free(BlocktoFree);
}
```

### 链表的尾部删除

```C
//链表的尾部删除void SLNPopBack(SLN** pphead)
{
    assert(pphead);

    //删除之前需要判断链表是不是空链表
    //如果是空链表则不执行删除操作
    if (*pphead == NULL)
    {
        return;
    }

    //如果链表只有一个节点时
    if ((*pphead)->next == NULL)
    {
        free(*pphead);
        *pphead = NULL;
        return;
    }
    
    //如果链表不为空且有多个节点时，执行删除操作
    //先找到尾结点
    SLN* p_end = *pphead;
    SLN* pprev = p_end;
    while (p_end->next)
    {
        pprev = p_end;
        p_end = p_end->next;
    }
    //将倒数第二个节点的存储下一个节点地址的部分置为空
    pprev->next = NULL;
    //释放尾结点的空间
    free(p_end);
    p_end = NULL;
}
```

### 查找链表中的数据

```C
//查找链表中的数据
SLN* SLNFind(SLN* phead, SListDataType x)
{
    SLN* pcur = phead;
    //遍历链表数据
    while (pcur)
    {
        //找到数据返回数据所在节点的地址
        if (pcur->data == x)
        {
            return pcur;
        }
        pcur = pcur->next;
    }
    //未找到数据返回空指针
    return NULL;
}
```

### 在指定位置之前插入数据

```C
//在指定位置之前（在指定位置）插入数据
void SLNInsert(SLN** pphead, SLN* pos, SListDataType x)
{
    assert(pphead);
    //插入的位置不可以为空，否则插入无效
    assert(pos);
    //插入的链表不能为空，否则不存在pos所指向的位置
    assert(*pphead);

    //开辟空间
    //在指定位置之前插入数据时，需要考虑该位置是不是头结点
    //如果需要插入的位置为头结点的位置，则相当于是头部插入操作
    if (pos == *pphead)
    {
        SLNPushFront(pphead, x);
        return;
    }
    //如果需要插入的位置不是头结点位置，则进行后续插入操作
    SLN* newnode = applySpace(x);
    SLN* pprev = *pphead;
    //遍历链表找到pos指向的位置
    while (pprev->next != pos)
    {
        pprev = pprev->next;
    }
    //更改前一节点指针的存储下一节点位置部分的地址为新节点的地址
    pprev->next = newnode;
    //更改新节点的存储下一节点部分的地址为pos
    newnode->next = pos;
    //上述两步可以交换执行顺序
}
```

### 在指定位置之后插入数据

```C
//在指定位置之后插⼊数据 
void SLNInsertAfter(SLN* pos, SListDataType x)
{
    assert(pos);

    //指定位置之后插入数据时注意节点连接顺序
    SLN* newnode = applySpace(x);

    //将新节点中的存储下一节点地址的部分赋值为pos后一节点的地址
    newnode->next = pos->next;
    //将pos节点中的存储下一节点地址的部分赋值为新节点的地址
    pos->next = newnode;
    //上述两步不可以交换执行顺序
}
```

### 删除指定位置的节点

```C
//删除指定位置的节点
void SLNEraseAfter(SLN* pos)
{
    assert(pos);

    //如果pos之后的节点为空，则不执行删除操作
    if (pos->next == NULL)
    {
        return;
    }

    SLN* BlockToFree = pos->next;
    //如果pos之后的节点不为空，执行删除操作
    //将pos节点的存储下一个节点地址的部分更改为待删除节点的后一个节点地址
    pos->next = pos->next->next;
    free(BlockToFree);
    BlockToFree = NULL;
}
```

### 销毁链表

```C
//销毁链表 
void SLNDesTroy(SLN** pphead)
{
    assert(pphead);

    SLN* pcur = *pphead;
    //循环销毁链表
    while (pcur)
    {
        SLN* BlockToFree = pcur;
        pcur = pcur->next;
        free(BlockToFree);
    }
    *pphead = NULL;
}
```

## 双链表

双向链表：即带头双向循环链表

在双向链表中，存在头结点，即默认有一个节点，但是该节点中不存储有效数据，只存储指向上一个节点和下一个节点的地址

!!! note
    在双向链表中，头结点是不可以删除的

在双向链表中，空链表的含义是除了头结点以外没有其他任何节点（即没有存储有效数据的节点）

### 主要实现功能

```c
//双向链表初始化
void DLNInit(DLN** pphead);
//DLN* LTInit();
//双向链表的销毁
void DLNDestroy(DLN* phead);
//双向链表的打印
void DLNPrint(DLN* phead);
//判断双向链表是否为空
bool DLNEmpty(DLN* phead);
//双向链表的尾部插入
void DLNPushBack(DLN* phead, DlistDataType x);
//双向链表的尾部删除
void DLNPopBack(DLN* phead);
//双向链表的头部插入
void DLNPushFront(DLN* phead, DlistDataType x);
//双向链表的头部删除
void DLNPopFront(DLN* phead);
//在pos位置之后插⼊数据 
void DLNInsert(DLN* pos, DlistDataType x);
//删除pos位置的数据
void DLNErase(DLN* pos);
//在双向链表中查找数据
DLN* DLNFind(DLN* phead, DlistDataType x);
```

实现过程思路如图：

<img src="images\image4.png">

### 双向链表初始化

```C
//双向链表初始化
//由于要对双向链表中的头结点的地址进行修改并且也需要改变头结点的内容，故传入二级指针
void DLNInit(DLN** pphead)
{
    *pphead = (DLN*)malloc(sizeof(DLN));
    assert(*pphead);
    //将头结点的数据置为任意值
    (*pphead)->data = -1;//亦可以写成(**pphead).data = -1;
    //将头结点的指针域改为置为指向自己的地址
    (*pphead)->pprev = (*pphead)->next = *pphead;
}
//或者写成带有返回类型的形式
DLN* DLNInit_1()
{
    DLN* phead = (DLN*)malloc(sizeof(DLN));
    assert(phead);
    phead->data = -1;
    phead->pprev = phead->next = phead;

    return phead;
}
```

### 双向链表的打印

```C
//双向链表的打印
void DLNPrint(DLN* phead)
{
    assert(phead);

    //循环打印双向链表中的值
    //循环条件为指针下一次的位置不为头结点的位置，防止打印头结点中的无效数据
    DLN* pcur = phead->next;
    while (pcur != phead)
    {
        printf("%d->", pcur->data);
        pcur = pcur->next;
    }
    printf("|\n");
}
```

### 判断链表是否为空

```c
//判断双向链表是否为空
bool DLNEmpty(DLN* phead)
{
    //判断头结点指针是否为空
    assert(phead);
    if (phead->pprev == phead && phead->next == phead)
    {
        return true;
    }
    else
    {
        return false;
    }
}
```

### 双向链表的尾部插入

```c
//双向链表的新节点空间申请
DLN* applySpace(x)
{
    DLN* newNode = (DLN*)malloc(sizeof(DLN));
    assert(newNode);
    newNode->data = x;
    newNode->pprev = newNode->next = NULL;
    return newNode;
}

//双向链表的尾部插入
void DLNPushBack(DLN* phead, DListDataType x)
{
    assert(phead);

    //为新节点申请空间
    DLN* newNode = applySpace(x);

    //先改变新节点的前后指针指向
    newNode->pprev = phead->pprev;
    newNode->next = phead;
    //改变倒数第二个节点的后指针
    phead->pprev->next = newNode;
    //改变头结点中的前指针
    phead->pprev = newNode;
}
```

### 双向链表的头部插入

```c
//双向链表的头部插入
void DLNPushFront(DLN* phead, DListDataType x)
{
    assert(phead);

    //创建新节点需要申请空间
    DLN* newNode = applySpace(x);
    //改变新节点的前后指针指向
    newNode->pprev = phead;
    newNode->next = phead->next;
    //先改变初始为第一个节点的前指针指向
    phead->next->pprev = newNode;
    //在改变头结点中的后指针
    phead->next = newNode;
    //上述两步不可以交换位置
}
```

### 双向链表的尾部删除

```c
//双向链表的尾部删除
void DLNPopBack(DLN* phead)
{
    assert(phead);

    //判断双向链表是否为空
    assert(phead->next != phead);

    //存储待释放的空间的地址
    DLN* BlockToFree = phead->pprev;
    //使倒数第二个节点的尾指针指向头节点
    phead->pprev->pprev->next = phead;
    //使头节点前指针指向倒数第二个节点
    phead->pprev = phead->pprev->pprev;
    //释放最后一个节点空间
    free(BlockToFree);
    BlockToFree = NULL;
}
```

### 双向链表的头部删除

```c
//双向链表的头部删除
void DLNPopFront(DLN* phead)
{
    assert(phead);
    //判断双向链表是否为空
    assert(phead->next != phead);

    DLN* BlockToFree = phead->next;

    phead->next = phead->next->next;
    phead->next->next->pprev = phead;
    free(BlockToFree);
    BlockToFree = NULL;
}
```

### 双向链表的数据查找

```c
//在双向链表中查找数据
DLN* DLNFind(DLN* phead, DListDataType x)
{
    assert(phead);
    //判断链表是否为空
    assert(phead->next != phead);

    //查找数据
    //将临时指针定位到第一个节点而不是头结点
    DLN* pcur = phead->next;
    while (pcur != phead)
    {
        if (pcur->data == x)
        {
            return pcur;
        }
        pcur = pcur->next;
    }
    //找不到返回空指针
    return NULL;
}
```

### 双向链表中指定位置数据插入

```c
//在pos位置之后插⼊数据 
void DLNInsert(DLN* pos, DListDataType x)
{
    assert(pos);

    //创建新节点需要申请空间
    DLN* newNode = applySpace(x);

    //更改新节点的前指针与后指针的指向
    newNode->pprev = pos;
    newNode->next = pos->next;
    //更改pos位置后的旧节点的前指针指向
    pos->next->pprev = newNode;
    pos->next = newNode;
}
```

### 删除双向链表指定位置数据

```c
//删除pos位置的数据
void DLNErase(DLN* pos)
{
    assert(pos);

    pos->pprev->next = pos->next;
    pos->next->pprev = pos->pprev;
    free(pos);
    pos = NULL;
}
```

### 双向链表的销毁

```c
//双向链表的销毁
void DLNDestroy(DLN* phead)
{
    assert(phead);
    //判断链表是否为空
    assert(phead->next != phead);

    //遍历双向链表进行删除操作
    DLN* pcur = phead->next;
    while (pcur != phead)
    {
        DLN* BlockToFree = pcur;
        pcur = pcur->next;
        free(BlockToFree);
    }
}
```