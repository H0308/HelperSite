<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# 顺序结构与顺序表

## 线性表

线性表（linearlist）是n个具有相同特性的数据元素的有限序列

线性表是一种在实际中广泛使用的数据结构，常见的线性表：顺序表、链表、栈、队列、字符串...

!!! note
    线性表在逻辑上是线性结构，也就说是连续的⼀条直线。但是在物理结构上并不⼀定是连续的，线性表在物理上存储时，通常以数组和链式结构的形式存储

## 顺序表

### 顺序表和数组

顺序表的底层结构是数组，对数组的封装，实现了常用的增删改查等接口

!!! note
    顺序表在逻辑结构上连续，并且在物理结构上也是连续

### 顺序表的分类

#### 静态顺序表

数组的大小固定的顺序表

```C
//静态顺序表
typedef int SLDataType;
#define N 7
typedef struct SeqList_static
{
    SLDataType SeqList[N];//数组长度为7的顺序表
    int size;//有效数值的个数，此处有效数值相当于数组的下标，并且总是指向最后一个有效数值的下一位
}SL_s;
```

<img src="images\image.png">

#### 动态顺序表

数组大小可以指定改变的顺序表

```C
typedef int SLDataType;
typedef struct SeqList_dynamic
{
    SLDataType* SeqList;//指向可以修改大小的数据空间
    int size;//有效数据个数
    int capacity;//数据空间的总大小
}SL_d;
```

<img src="images\image1.png">

#### 静态顺序表和动态顺序表的比较

静态顺序表空间给少了不够用，给多了造成空间浪费，实际使用顺序表更多使用动态顺序表

### 动态顺序表的实现

#### 主要实现功能

```C
//初始化和销毁 
void SLInit(SL* ps);
void SLDestroy(SL* ps);
void SLPrint(SL* ps);
//扩容 
void SLCheckCapacity(SL* ps);
//头部插⼊删除 / 尾部插⼊删除 
void SLPushBack(SL* ps, SLDataType x);
void SLPopBack(SL* ps);
void SLPushFront(SL* ps, SLDataType x);
void SLPopFront(SL* ps);
//指定位置之前插⼊/删除数据 
void SLInsert(SL* ps, int pos, SLDataType x);
void SLErase(SL* ps, int pos);
int SLFind(SL* ps, SLDataType x);
```

#### 顺序表的初始化

```C
//顺序表的初始化
void SLInit(SL_d* ps)
{
    assert(ps);//确保没有传入空指针
    ps->SeqList = NULL;
    ps->size = 0;
}
```

#### 顺序表的销毁

```C
//顺序表的销毁
void SLDestroy(SL_d* ps)
{
    assert(ps);

    if (ps->SeqList)
    {
        free(ps->SeqList);
    }
    
    ps->SeqList = NULL;
    ps->size = 0;
    ps->capacity = 0;
}
```

#### 顺序表的打印

```C
//顺序表的打印
void SLPrint(SL_d* ps)
{
    assert(ps);
    assert(ps->SeqList);

    for (int i = 0; i < ps->size; i++)
    {
        printf("%d ", ps->SeqList[i]);
    }
    putchar('\n');
}
```

#### 顺序表的尾部插入

基本思路：判断是否需要扩容再进行尾部插入

1. 当顺序表有足够的空间插入时（包括有内容和顺序表为空）：直接在顺序表尾部插入
2. 当顺序表空间已满时：扩容后再插入

<img src="images\image2.png">

```C
//顺序表的扩容 
void SLCheckCapacity(SL_d* ps)
{
    assert(ps);
    
    SLDataType* temp = NULL;
    if (ps->size == ps->capacity)
    {
        int newCapacity = ps->capacity;
        temp = (SLDataType*)realloc(ps->SeqList, (newCapacity =  (ps->capacity == 0) ? 4 : (ps->capacity * 2)) * sizeof(SLDataType));//扩容规则：成倍数增加（一般1.5倍或2倍）
        assert(temp);
        ps->SeqList = temp;
        ps->capacity = newCapacity;
        temp = NULL;
    }
}

//顺序表的尾部插入
//当顺序表有足够的空间插入时（包括有内容和顺序表为空）
void SLPushBack(SL_d* ps, SLDataType x)
{
    assert(ps);
    
    //顺序表的扩容 
    SLCheckCapacity(ps);//确保SeqList指针不为空之后判断容量是否足够

    //当顺序表有足够的空间插入时（包括有内容和顺序表为空）
    ps->SeqList[ps->size] = x;
    ps->size++;

    //当顺序表空间已满时
    //先进行扩容操作
    //再进行插入
}
```

#### 顺序表的头部插入

基本思路：判断容量是否足够再进行头部插入

1. 当顺序表有足够的空间插入时（包括有内容和顺序表为空）：直接在顺序表尾部插入
2. 当顺序表空间已满时：扩容后再插入

```C
//顺序表的扩容 
void SLCheckCapacity(SL_d* ps)
{
    assert(ps);
    
    SLDataType* temp = NULL;
    if (ps->size == ps->capacity)
    {
        int newCapacity = ps->capacity;
        temp = (SLDataType*)realloc(ps->SeqList, (newCapacity =  (ps->capacity == 0) ? (ps->capacity) : (ps->capacity * 2)) * sizeof(SLDataType));//扩容规则：成倍数增加（一般1.5倍或2倍）
        assert(temp);
        ps->SeqList = temp;
        ps->capacity = newCapacity;
        temp = NULL;
    }
}

//顺序表的头部插入
void SLPushFront(SL_d* ps, SLDataType x)
{
    assert(ps);

    //顺序表的扩容
    SLCheckCapacity(ps);//确保SeqList指针不为空之后判断容量是否足够

    //顺序表有足够的空间插入时（包括有内容和顺序表为空）
    for (int i = ps->size - 1; i >= 0; i--)
    {
        ps->SeqList[i + 1] = ps->SeqList[i];//ps->SeqList[0] = ps->SeqList[1]
    }
    ps->SeqList[0] = x;
    ps->size++;

    //当顺序表空间已满时
    //先进行扩容操作
    //再进行插入
}
```

#### 顺序表的尾部删除

基本思路：将有效数值变量前移达到“看不见即删除”的效果

```C
//顺序表的尾部删除
void SLPopBack(SL_d* ps)
{
    assert(ps);
    assert(ps->size);//确保顺序表内不为空
    ps->size--;
}
```

#### 顺序表的头部删除

基本思路：将后面的值一一往前覆盖，并且有效数值变量前移

```C
//顺序表的头部删除
void SLPopFront(SL_d* ps)
{
    assert(ps);
    assert(ps->size);

    for (int i = 0; i < ps->size - 1; i++)
    {
        ps->SeqList[i] = ps->SeqList[i + 1];
    }
    ps->size--;
}
```

#### 顺序表的指定位置插入

基本思路：以插入位置（第一个数值位置为1）为标准，将插入位置后面的内容向后移动，并且有效数值变量后移

```C
//顺序表的指定位置插入
void SLInsert(SL_d* ps, int pos, SLDataType x)
{
    assert(ps);
    
    for (int i = ps->size - 1; i >= pos - 1; i--)
    {
        ps->SeqList[i + 1] = ps->SeqList[i];
    }
    ps->SeqList[pos - 1] = x;
    ps->size++;
}
```

#### 顺序表的指定位置删除

基本思路：以删除位置（第一个数值位置为1）为标准，将删除位置之后的数值覆盖删除位置的数值，并且有效数值前移

```C
//顺序表的指定位置删除
void SLErase(SL_d* ps, int pos)
{
    assert(ps);

    for (int i = pos; i < ps->size ; i++)
    {
        ps->SeqList[i - 1] = ps->SeqList[i];
    }
    ps->size--;
}
```

#### 顺序表中的数值查找

基本思路：遍历顺序表查找

```C
//使用遍历顺序表在顺序表中找指定数值
int SLFind(SL_d* ps, SLDataType x)
{
    assert(ps);
    for (int i = 0; i < ps->size; i++)
    {
        if (ps->SeqList[i] == x)
        {
            return i + 1;
        }
    }
    return 0;
}
```

### 顺序表应用——通讯录

#### 主要实现的功能

1. 至少能够存储100个⼈的通讯信息
2. 能够保存用户信息：名字、性别、年龄、电话、地址等
3. 增加联系⼈信息
4. 删除指定联系⼈
5. 查找制定联系⼈
6. 修改指定联系⼈
7. 显示联系⼈信息

```C
//初始化通讯录 
void InitContact(contact* con);
//添加通讯录数据 
void AddContact(contact* con);
//删除通讯录数据 
void DelContact(contact* con);
//展示通讯录数据 
void ShowContact(contact* con);
//查找通讯录数据 
void FindContact(contact* con);
//修改通讯录数据 
void ModifyContact(contact* con);
//销毁通讯录数据 
void DestroyContact(contact* con);
```

#### 初始化通讯录

```C
//初始化通讯录
void InitContact(contact* con)
{
    SLInit(&con);
}
```

#### 添加通讯录数据

```C
//添加联系人
void AddContact(contact* con)
{
    info c = { 0 };
    printf("请输入联系人姓名：");
    scanf("%s", c.name);
    printf("请输入联系人年龄：");
    scanf("%d", &(c.age));
    printf("请输入联系人性别：");
    scanf("%s", c.gender);
    printf("请输入联系人电话：");
    scanf("%s", c.phoneNum);
    printf("请输入联系人住址：");
    scanf("%s", c.address);

    assert(con);
    SLPushBack(con, c);
}
```

#### 展示通讯录数据

```C
//显示联系人
void ShowContact(contact* con)
{
    assert(con);
    printf("姓名\t年龄\t性别\t\t电话\t住址\n");
    for (int i = 0; i < con->size; i++)
    {
        printf("%s\t%d\t%s\t\t%s\t%s\t\n", 
            con->SeqList[i].name, con->SeqList[i].age, 
            con->SeqList[i].gender, con->SeqList[i].phoneNum, 
            con->SeqList[i].address);
    }
}
```

#### 删除通讯录数据

```C
//查找联系人，以按名字查找为例
int FindContact(contact* con, char *name)
{
    assert(con);
    assert(con->SeqList);

    for (int i = 0; i < con->size; i++)
    {
        if (strcmp(con->SeqList[i].name, name) == 0)
        {
            printf("姓名\t年龄\t性别\t\t电话\t住址\n");
            printf("%s\t%d\t%s\t\t%s\t%s\t\n",
                con->SeqList[i].name, con->SeqList[i].age,
                con->SeqList[i].gender, con->SeqList[i].phoneNum,
                con->SeqList[i].address);
            return i + 1;
        }
        else
        {
            continue;
        }
        if(i == con->size - 1)
        { 
            printf("查找无此人");
            return 0;
        }
    }
}


//删除联系人
void DelContact(contact* con, char *name)
{
    assert(con);
    assert(con->SeqList);

    //删除联系人首先得有需要删除的联系人，以按名字查找为例
    if (FindContact(con, name))
    {
        SLErase(con, FindContact(con, name));
    }
}
```

#### 查找通讯录数据

```C
//查找联系人，以按名字查找为例
int FindContact(contact* con, char *name)
{
    assert(con);
    assert(con->SeqList);

    for (int i = 0; i < con->size; i++)
    {
        if (strcmp(con->SeqList[i].name, name) == 0)
        {
            printf("查找到的联系人如下：\n");
            printf("姓名\t年龄\t性别\t\t电话\t住址\n");
            printf("%s\t%d\t%s\t\t%s\t%s\t\n",
                con->SeqList[i].name, con->SeqList[i].age,
                con->SeqList[i].gender, con->SeqList[i].phoneNum,
                con->SeqList[i].address);
            return i + 1;
        }
    }
    printf("查找无此人\n");
    return 0;
}
```

#### 修改通讯录数据

```C
//修改联系人
void ModifyContact(contact* con, char* name)
{
    assert(con);
    assert(con->SeqList);
    //修改联系人前提得有需要修改的联系人
    int ret = FindContact(con, name) - 1;//函数返回的不是下标，而是当前内容所在的位置，从1开始计数
    if (ret)
    {
        printf("请输入需要修改的联系人姓名：");
        scanf("%s", con->SeqList[ret].name);
        printf("请输入需要修改的联系人年龄：");
        scanf("%d", &(con->SeqList[ret].age));
        printf("请输入需要修改的联系人性别：");
        scanf("%s", con->SeqList[ret].gender);
        printf("请输入需要修改的联系人电话：");
        scanf("%s", con->SeqList[ret].phoneNum);
        printf("请输入需要修改的联系人住址：");
        scanf("%s", con->SeqList[ret].address);    
    }
}
```

#### 销毁通讯录数据

```C
//销毁通讯录
void DestroyContact(contact* con)
{
    SLDestroy(con);
}
```