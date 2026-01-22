<!-- 添加对Katex的支持 -->
<script defer src="/javascripts/katex.min.js"></script>
<script defer src="https://help-site.oss-cn-hangzhou.aliyuncs.com/js/katex.min.js"></script>
<script defer src="https://help-site.oss-cn-hangzhou.aliyuncs.com/js/auto-render.min.js"></script>

<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# 排序

## 排序的概念

排序：所谓排序，就是使一串记录，按照其中的某个或某些关键字的大小，递增或递减的排列起来的操作

## 排序的稳定性

假定在待排序的记录序列中，存在多个具有相同的关键字的记录，若经过排序，这些记录的相对次序保持不变，即在原序列中，`r[i]=r[j]`，且`r[i]`在`r[j]`之前，而在排序后的序列中，`r[i]`仍在`r[j]`之前，则称这种排序算法是稳定的；否则称为不稳定的

内部排序：数据元素全部放在内存中的排序

外部排序：数据元素太多不能同时放在内存中，根据排序过程的要求不能在内外存之间移动数据的排序

## 常见的排序算法

本篇将分析下面的图中提到的算法进行：

<img src="images\image.png">

对应地，每一个排序的函数声明如下：

```c
//常见的排序算法实现
// 排序实现的接口
 
// 插入排序
void InsertSort(int* a, int n);
 
// 希尔排序
void ShellSort(int* a, int n);
 
// 选择排序
void SelectSort(int* a, int n);
 
// 堆排序
void AdjustDwon(int* a, int n, int root);
void HeapSort(int* a, int n);
 
// 冒泡排序
void BubbleSort(int* a, int n)
 
// 快速排序递归实现
// 快速排序hoare版本
int PartSort1(int* a, int left, int right);
// 快速排序挖坑法
int PartSort2(int* a, int left, int right);
// 快速排序前后指针法
int PartSort3(int* a, int left, int right);
void QuickSort(int* a, int left, int right);
 
// 快速排序 非递归实现
void QuickSortNonR(int* a, int left, int right)
 
// 归并排序递归实现
void MergeSort(int* a, int n)
// 归并排序非递归实现
void MergeSortNonR(int* a, int n)
 
// 计数排序
void CountSort(int* a, int n)
```

如果需要简单地比较不同排序算法的时间消耗，可以使用下面的函数：

```c
// 测试排序的性能对比
void TestOP()
{
    srand(time(0));
    const int N = 100000;
    int* a1 = (int*)malloc(sizeof(int)*N);
    int* a2 = (int*)malloc(sizeof(int)*N);
    int* a3 = (int*)malloc(sizeof(int)*N);
    int* a4 = (int*)malloc(sizeof(int)*N);
    int* a5 = (int*)malloc(sizeof(int)*N);
    int* a6 = (int*)malloc(sizeof(int)*N);
 
    for (int i = 0; i < N; ++i)
    {
        a1[i] = rand();
        a2[i] = a1[i];
        a3[i] = a1[i];
        a4[i] = a1[i];
        a5[i] = a1[i];
        a6[i] = a1[i];
    }
 
    int begin1 = clock();
    InsertSort(a1, N);
    int end1 = clock();
 
    int begin2 = clock();
    ShellSort(a2, N);
    int end2 = clock();
 
    int begin3 = clock();
    SelectSort(a3, N);
    int end3 = clock();
 
    int begin4 = clock();
    HeapSort(a4, N);
    int end4 = clock();
 
    int begin5 = clock();
    QuickSort(a5, 0, N-1);
    int end5 = clock();
 
    int begin6 = clock();
    MergeSort(a6, N);
    int end6 = clock();
 
    printf("InsertSort:%d\n", end1 - begin1);
    printf("ShellSort:%d\n", end2 - begin2);
    printf("SelectSort:%d\n", end3 - begin3);
    printf("HeapSort:%d\n", end4 - begin4);
    printf("QuickSort:%d\n", end5 - begin5);
    printf("MergeSort:%d\n", end6 - begin6);
 
    free(a1);
    free(a2);
    free(a3);
    free(a4);
    free(a5);
    free(a6);
}
```

## 插入排序

### 直接插入排序

所谓直接插入排序，即每一个元素和当前元素之前的元素进行大小比较，如果较大放在该元素的后面，否则放在其前面，如果两个元素相等可以不处理，具体思路分析如下：

```c
//以下面的数组为例
int data[] = { 23,34,84,99,67,26,21,89 };
```

为了更好理解插入排序，首先考虑在已经有序数组中插入一个数据保证整个数组依旧有序的情况

在一个已经有序的数组中插入数据保证整个数组依旧有序，就需要先确定这个元素的插入位置，以升序为例，考虑从后向前比较，如果当前元素大于待插入的元素，那么就需要向后挪动当前数据，这一步是为了确保可以为插入的元素腾出空位，如果当前元素小于待插入的元素，说明该元素的后一个位置就是待插入的元素需要插入的位置

因为要涉及到向后挪动数据且插入的元素只有一个，所以插入前需要确保数组的空间大于等于原数组大小+一个元素的大小

示意图如下：

<img src="images\直接插入排序1.gif">

再根据上面的插入思路扩展到对整个数组进行排序

对整个数组进行排序可以考虑额外开辟一个数组，最后将排序的数组覆盖原数组即可，但是这样会有一定空间复杂度消耗，所以本次考虑原地处理

因为对整个数组排序就需要依次比较当前元素和当前元素之前的元素，同样考虑升序，如果当前元素比前一个元素小，说明需要进行排序，否则一定可以保证当前元素及之前的元素一定满足升序，下面考虑需要挪动的情况：

如果当前元素小于前一个元素，此时就需要找到插入位置，因为当前元素需要改变位置，所以先用一个变量存储当前元素的值，此时就相当于空出一个空间用于挪动数据，再将当前元素之前的元素依次向后挪动（即上面的思路），直到确定插入位置即可

因为数组的第一个元素前面没有其他的元素，所以可以直接跳过，从第二个元素开始进行比较

示意图如下，以移动一个元素为例：

<img src="images\直接插入排序2.gif">

参考代码：

```c
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

void DirectInsert_sort(int* data, int sz)
{
    // 遍历数组
    // 只有一个元素时可以不进行排序，所以从第二个元素（下标为1）开始
    for (int i = 1; i < sz; i++)
    {
        int tmp = data[i];//获取数组的当前元素
        int end = i - 1;//获取数组的当前元素的上一个元素的下标
        //当遇到比tmp大数值时，挪动数据，直到遇到比当前数据小的数据时跳出循环
        while (end >= 0 && data[end] > tmp)
        {
            data[end + 1] = data[end];
            end--;
        }
        //在end的后一个位置插入数据，插入完毕后直接更新i和end继续比较
        data[end + 1] = tmp;
    }
}

int main()
{
    int data[] = { 23,34,84,99,67,26,21,89 };
    int sz = sizeof(data) / sizeof(int);
    DirectInsert_sort(data, sz);
    //打印排序后的数组
    for (int i = 0; i < sz; i++)
        printf("%d ", data[i]);

    return 0;
}
输出结果：
21 23 26 34 67 84 89 99
```

通过分析可以得出直接插入排序在最坏的情况下（数据为完全逆序的状态）时间复杂度为O($N^2$)，而在最好的情况下（已经为有序状态，只需要遍历一遍数据即可），时间复杂度为$O(N)$

因为在比较过程中没有对相等的元素进行判定，即相等的元素之间不会触发移动和交换，所以直接插入排序是稳定的算法

### 希尔排序

希尔排序是直接插入排序的升级版

#### 希尔排序基本思路解析

希尔排序的基本思路是将一组数据按照间隔值`gap`分成`gap`组，对各组进行插入排序，这一步被称作预排序，接着再使用直接插入排序对整体再进行一次排序，具体过程如下：

<img src="images\image2.png">

参考代码如下：

```c
//希尔排序基础思路
void ShellSort(int* data, int sz)
{
    int gap = 3;
    //首先进行三组预排序
    for (int i = 0; i < gap; i++)
    {
        //每一组的排序
        for (int j = gap + i; j < sz; j += gap)
        {
            int end = j - gap;
            int tmp = data[j];
            while (end >= 0)
            {
                if (data[end] > tmp)
                {
                    data[end + gap] = data[end];
                    end -= gap;
                }
                else
                {
                    break;
                }
            }
            data[end + gap] = tmp;
        }
    }

    //最后进行整体插入排序
    gap = 1;
    for (int i = gap; i < sz; i += gap)
    {
        int end = i - 1;
        int tmp = data[i];
        while (end >= 0)
        {
            if (data[end] > tmp)
            {
                data[end + gap] = data[end];
                end--;
            }
            else
            {
                break;
            }
        }
        data[end + gap] = tmp;
    }
}
```

#### 希尔排序优化思路解析

接下来对细节进行分析优化

首先是间隔值`gap`，`gap`决定了分组的数量，也间接决定了最大值走到最后需要的次数，当`gap`特别大时，最大值很快就会到数据的最末尾，但是同时整体越不接近需要的升序；相反，当`gap`特别小时，最大值到数据末尾的次数变多，同时整体越接近有序，所以`gap`数值不容易确定，但是一般取`gap`为整体的`1/3`或者取`1/2`，即`gap = size / 3`或`gap = size / 2` (`size`是数组长度)

第二个问题，如果将预排序和最后的插入排序分开写，那么需要写五个循环，三层循环解决预排序，两层循环解决最后的插入排序，所以可以考虑将预排序与直接插入排序放在一起，达到在同一个循环中解决问题

可以考虑将每一次循环变量移动的位置改为移动一位，代替原来的一次移动`gap`位，如下图所示

<img src="images\image3.png">

而改进后的思路与原来的思路对比：原来的思路是先排一组，排完一组后再排第二组，而改进后的思路是遇到i当前位置是哪一组的就排哪一组的数据，但是需要注意的是，当前的`tmp`所在位置为下一个相差`gap`的位置，该位置需要有确切的数值可以与`end`进行比较，所以`tmp`不能越界，假设当前`tmp`为3，数组最大下标为7，也就是`tmp`所在的下标最大只能为7，即`i + gap`不能超过7，故i最大只能为4，所以i不能超过5

<img src="images\image4.png">

接下来是如何处理预排序和之后的直接排序放在一起的问题，对于这个问题，首先就是`gap`不能为一个固定值，如果`gap`为固定的某一个数值，例如3，那么预排序和直接插入排序还是需要两组循环才能解决，鉴于`gap`最后需要回到1，可以考虑从`gap/3`分组开始，当预排序完`gap`为3的一组时，接下来排`gap`为2的一组，最后着排`gap`为1的一组，因为第一次`gap`为3时已经将数据处理了一遍，而`gap`数值越小，就会使预排序的结果更接近预期的排序结果，所以可以考虑`gap = gap / 3`，每执行完一次预排序就更换一次`gap`间隔值，从而达到预排序与最后的直接插入排序放在一起，因为当`gap`为1时也可以满足预排序的思路，故放在一起也不会有任何冲突，只是间隔值从3变成了1,但是需要注意一个问题，当`gap`小于3时，`gap`最后的商为0，导致`gap`无法取到1，所以需要写成`gap = gap / 3 + 1`

```c
//希尔排序优化思路
void ShellSort_modified(int* data, int sz)
{
    int gap = sz;
    while (gap > 1)
    {
        gap = gap / 3 + 1;// 此处加1是为了确保最后一个gap一定为1，因为最后的直接插入排序是整体各自比较
        for (int i = 0; i < sz - gap; i++)
        {
            int end = i;
            int tmp = data[i + gap];
            while (end >= 0)
            {
                if (data[end] > tmp)
                {
                    data[end + gap] = data[end];
                    end -= gap;
                }
                else
                {
                    break;
                }
            }
            data[end + gap] = tmp;
        }
    }    
}
```

#### 完整希尔排序文件

```c
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

//希尔排序优化思路
void ShellSort_modified(int* data, int sz)
{
    int gap = sz;
    while (gap > 1)
    {
        gap = gap / 3 + 1;// 此处加1是为了确保最后一个gap一定为1，因为最后的直接插入排序是整体各自比较
        for (int i = 0; i < sz - gap; i++)
        {
            int end = i;
            int tmp = data[i + gap];
            while (end >= 0)
            {
                if (data[end] > tmp)
                {
                    data[end + gap] = data[end];
                    end -= gap;
                }
                else
                {
                    break;
                }
            }
            data[end + gap] = tmp;
        }
    }    
}

int main()
{
    int data[] = { 23,34,84,99,67,26,21,89 };
    int sz = sizeof(data) / sizeof(int);
    ShellSort_modified(data, sz);
    for (int i = 0; i < sz; i++)
    {
        printf("%d ", data[i]);
    }

    return 0;
}
输出结果：
21 23 26 34 67 84 89 99
```

希尔排序总结：

1. 希尔排序是对直接插入排序的优化
2. 当`gap > 1`时都是预排序，目的是让数组更接近于有序。当`gap == 1`时，数组已经接近有序的了，这样就会很快。这样整体而言，可以达到优化的效果。我们实现后可以进行性能测试的对比
3. 希尔排序的时间复杂度不好计算，因为`gap`的取值方法很多，导致很难去计算，因此在好些树中给出的希尔排序的时间复杂度都不固定，因为gap是按照Knuth提出的方式取值的，而且Knuth进行了大量的试验统计，所以时间复杂度就按照O($N^{1.25}$)到O($1.6 \times N^{1.25}$)来算
4. 稳定性：不稳定

## 选择排序

### 选择排序

选择排序的基本思路是，定义两个区间指针begin和end，遍历数组中的每一个数据找出最大的数据的下标和最小的数据的下标，之后与`begin`和`end`指针分别交换小数据与`begin`的位置以及大数据和`end`的数值，具体思路如下

```c
//以下面的数据为例
int data[] = { 23,34,90,16,54,44,78,67 };
```

<img src="images\image5.png">

```c
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>

void swap(int* p1, int* p2)
{
    int tmp = *p1;
    *p1 = *p2;
    *p2 = tmp;
}

void SelectSort(int *data, int sz)
{
    int begin = 0;
    int end = sz - 1;
    while (begin < end)
    {
        int max_i = begin;//最大值下标
        int min_i = begin;//最小值下标
        //遍历数组找到最大值的下标和最小值的下标
        for (int i = begin; i <= end; i++)
        {
            if (data[i] > data[max_i])
            {
                max_i = i;
            }

            if (data[i] < data[min_i])
            {
                min_i = i;
            }
        }

        //走完循环交换最大值和最小值
        swap(&data[begin], &data[min_i]);
        //如果begin和max_i重合，则需要更新max_i
        if (begin == max_i)
        {
            max_i = min_i;
        }
        swap(&data[end], &data[max_i]);

        //更新比较区间
        begin++;
        end--;
    }
}

int main()
{
    int data[] = { 23,34,90,16,54,44,78,67 };
    int sz = sizeof(data) / sizeof(int);
    SelectSort(data, sz);
    for (int i = 0; i < sz; i++)
    {
        printf("%d ", data[i]);
    }
    return 0;
}
输出结果：
16 23 34 44 54 67 78 90
```

根据上面的分析，可以看出选择排序的时间复杂度为O($N^2$)，并且选择排序算法不稳定

### 堆排序

[见堆](https://help-doc.top/data-structure/heap/heap.html#_13)

## 交换排序

### 冒泡排序

[见C语言指针](https://help-doc.top/c-lang/ptr/ptr.html#_22)

### 快速排序

#### Hoare版本快速排序

Hoare版本快速排序的过程类似于二叉树前序遍历的过程，基本思想是：在需要排序的数据中选择一个值的下标作为`key`，接着使用左指针和右指针从待排序数据集的起始位置以及其末端位置向中间遍历，左指针找数值比`key`大的数据，右指针找数值比`key`小的数据，交换这两个指针的数据之后接着向中间移动，直到两个指针最后相遇时交换`key`所在的数值以及相遇位置的数值，完成第一趟排序，接着进行左边部分的排序，方法如同第一趟排序，左边排序完毕后进行右边部分的排序，方法如同第二趟排序，直到最后全部排序完成后为止。具体思路如下：

!!! note
    注意`key`是数值的下标

```c
//以下面的数组为例
int data[] = { 23,48,67,45,21,90,33,11 };
```

<img src="images\image6.png">

<img src="images\image7.png">

<img src="images\image8.png">

下面是完整过程递归图

<img src="images\image9.png">

参考代码

```c
void swap(int* num1, int* num2)
{
    int tmp = *num1;
    *num1 = *num2;
    *num2 = tmp;
}

//一趟排序，返回key指向的位置
int PartSort(int* data, int left, int right)
{
    int key = left;//使key指向区间的第一个元素位置
    while (left < right)
    {
        //先让右侧指针先走，右指针找小
        while (left < right && data[right] >= data[key])
        {
            right--;
        }
        //再让左侧指针走，左侧指针找大
        while (left < right && data[left] <= data[key])
        {
            left++;
        }
        
        //交换右侧指针和左侧指针的数据
        swap(&data[right], &data[left]);
    }
    //执行完循环后，交换key所在位置的数据和right与left指针相遇的位置的数值
    swap(&data[key], &data[left]);
    //返回交换后的key指向的元素的位置
    return left;
}

//Hoare版本
void QuickSort_Hoare(int* data, int left, int right)
{
    //当left和right指针指向同一个位置或后一个位置结束排序
    if (left >= right)
    {
        return;
    }

    //获取到当前key的位置
    int key = PartSort(data, left, right);

    QuickSort_Hoare(data, left, key - 1);
    QuickSort_Hoare(data, key + 1, right);
}
```

#### Hoare版本问题分析

1. 在上面的过程分析中，使用第一个元素的位置作为`key`的位置，也可以使用最后一个元素作为`key`的位置，但是需要注意的是，以`key`指向第一个元素的位置为例，`left`指针一定需要指向第一个元素，而不是从第二个元素开始，例如下面的情况：当`key`位置的数据比其他数据都小时，`right`找小将一直向`key`所在位置移动

    <img src="images\image10.png">

    <img src="images\image11.png">

2. 在判断`left`指针或者`right`指针是否需要移动时，需要包括等于的情况，否则会进入死循环，例如下面的情况：当`left`和`right`指针同时指向一个等于`key`所在位置的元素

    <img src="images\image12.png">

3. 对于递归结束的条件来说，需要出现`left`指针的值大于或者等于`right`指针的值，而不是仅仅一个大于或者等于，因为返回相遇的位置，即返回`left`指针或者`right`指针的位置而不是实际返回`key`所在位置，在交换过程中，只是交换`key`对应位置的数值和相遇位置的数值，并没有改变`key`指向的位置
4. 对于`left`指针和`right`指针相遇的位置的数值一定比`key`所在位置的数值小的问题，下面是基本分析：

分析主问题之前，先分析`right`比`left`指针先走的原因：在初始位置时，`left`指针和`right`指针各指向第一个元素和最后一个元素但是`left`指针与`key`指针指向的位置相同，此时让`right`指针先走，而不是`left`指针先走，反之同理，具体原因如下：

<img src="images\image13.png">

接下来分析当`right`指针比`left`指针先走时，两个指针相遇时一定相遇到一个比`key`小的数值的问题

两个指针相遇的方式有两种情况

- 第一种情况：`left`指针向`right`指针移动与其相遇
- 第二种情况：`right`指针向`left`指针移动与其相遇

对于第一种情况，分析如下：

<img src="images\image14.png">

对于第二种情况，分析如下：

<img src="images\image15.png">



#### 挖坑法快速排序

挖坑法快速排序相较于Hoare版本的快速排序没有效率上的优化，但是在理解方式上相对简单，其基本思路为：在数据中随机取出一个数值放入`key`变量中，此时该数值的位置即为一个坑位，接下来`left`指针从第一个元素开始`key`值大的数值，`right`指针从最后一个元素找比`key`值小的数值，此时不用考虑`left`指针和`right`指针谁先走，考虑`right`指针先走，当`right`指针找到小时，将该值放置到`hole`所在位置，更新`hole`到`right`指针的位置，接下来`left`指针找大，当`left`指针找到较`key`大的数值时，将该数值存入`hole`中，更新`hole`为`left`所在位置，如此往复，直到第一趟排序结束。接着进行左边部分的排序，方法如同第一趟排序，左边排序完毕后进行右边部分的排序，方法如同第二趟排序，直到最后全部排序完成后为止。具体思路如下：

!!! note
    注意`key`是数值

```c
//以下面的数组为例
int data[] = { 23,48,67,45,21,90,33,11 };
```

<img src="images\image16.png">

```c
int PartSort_DigHole(int* data, int left, int right)
{
    int hole = left;
    int key = data[left];
    while (left < right)
    {
        while (left < right && data[right] >= key)
        {
            right--;
        }
        data[hole] = data[right];
        hole = right;
        while (left < right && data[left] <= key)
        {
            left++;
        }
        data[hole] = data[left];
        hole = left;
    }
    data[hole] = key;
    return hole;
}

//挖坑法
void QuickSort_DigHole(int* data, int left, int right)
{
    if (left >= right)
    {
        return;
    }

    int hole = PartSort_DigHole(data, left, right);

    QuickSort_DigHole(data, left, hole - 1);
    QuickSort_DigHole(data, hole + 1, right);
}
```

#### 前后指针法快速排序

前后指针法相对Hoare版本和挖坑法也没有效率上的优化，但是理解相对容易，基本思路如下：在前后指针法中，有一个`key`指针，该指针指向一个随机的数值的下标位置，接下来是一个`prev`指针，指向数据的第一个元素的下标位置，以及一个`cur`指针指向第二个元素的下标位置，`cur`指针和`prev`指针向前遍历，当遇到比`key`小的数值时，`prev`指针先移动，再进行`cur`和`prev`进行对应位置的数值交换，接着`cur`指着移动，否则只让`cur`指针移动，当`cur`走到数据的结尾时结束循环，交换`prev`和`key`指针的数据，完成第一趟排序。接着进行左边部分的排序，方法如同第一趟排序，左边排序完毕后进行右边部分的排序，方法如同第二趟排序，直到最后全部排序完成后为止。具体思路如下：

!!! note
    注意`key`是数值的下标，并且用`left`和`right`控制递归区间

<img src="images\image17.png">

```c
int PartSort_Prev_postPointer(int *data, int left, int right)
{
    int key = left;
    int cur = left + 1;
    int prev = left;
    while (cur <= right)
    {
        //++prev != cur可以防止cur和自己本身交换导致多交换一次
        if (data[cur] < data[key] && ++prev != cur)
        {
            prev++;
            swap(&data[cur], &data[prev]);
        }
        cur++;
    }
    swap(&data[prev], &data[key]);
    return prev;
}

//前后指针法
void QuickSort_Prev_postPointer(int* data,int left, int right)
{
    if (left >= right)
    {
        return;
    }

    int key = PartSort_Prev_postPointer(data, left, right);

    QuickSort_Prev_postPointer(data, left, key - 1);
    QuickSort_Prev_postPointer(data, key + 1, right);
}
```

#### 快速排序优化

在快速排序优化部分，采用三数取中的思路对快速排序有大量重复数据或者有序情况下进行优化，所谓三数取中，即第一个元素的位置和最后一个元素的位置加和取一半的数值在数据中的位置，但是此时需要注意的是`key`当前位置为`mid`所在位置，为了不改变原来的快速排序代码，获得中间值下标时，交换`key`位置的值和`mid`位置的值即可

```c
//三数取中
int GetMidIndex(int* data, int left, int right)
{
    int mid = (left + right) / 2;
    //获取左、中、有三个数中的中间数
    if (data[left] > data[mid])
    {
        if (data[mid] > data[right])
        {
            //left>mid>right
            return mid;
        }
        else if (data[left] > data[right])
        {
            //left>right>mid
            return right;
        }
        else
        {
            //right>left>mid
            return left;
        }
    }
    else
    {
        if (data[mid] < data[right])
        {
            //right>mid>left
            return mid;
        }
        else if (data[right] > data[left])
        {
            //mid>right>left
            return right;
        }
        else
        {
            //mid>left>right
            return left;
        }
    }
}
```

以前后指针版本修改为例

```c
#define _CRT_SECURE_NO_WARNINGS 1

#include <stdio.h>
#include <time.h>
#include <stdlib.h>
#include <assert.h>

void swap(int* num1, int* num2)
{
    int tmp = *num1;
    *num1 = *num2;
    *num2 = tmp;
}

//三数取中
int GetMidIndex(int* data, int left, int right)
{
    int mid = (left + right) / 2;
    //获取左、中、有三个数中的中间数
    if (data[left] > data[mid])
    {
        if (data[mid] > data[right])
        {
            //left>mid>right
            return mid;
        }
        else if (data[left] > data[right])
        {
            //left>right>mid
            return right;
        }
        else
        {
            //right>left>mid
            return left;
        }
    }
    else
    {
        if (data[mid] < data[right])
        {
            //right>mid>left
            return mid;
        }
        else if (data[right] > data[left])
        {
            //mid>right>left
            return right;
        }
        else
        {
            //mid>left>right
            return left;
        }
    }
}

int PartSort_Prev_postPointer(int *data, int left, int right)
{
    int mid = GetMidIndex(data, left, right);
    swap(&data[left], &data[mid]);
    int key = left;
    int cur = left + 1;
    int prev = left;
    while (cur <= right)
    {
        //++prev != cur可以防止cur和自己本身交换导致多交换一次
        if (data[cur] < data[key] && ++prev != cur)
        {
            swap(&data[cur], &data[prev]);
        }
        cur++;
    }
    swap(&data[prev], &data[key]);
    return prev;
}

//前后指针法
void QuickSort_Prev_postPointer(int* data,int left, int right)
{
    if (left >= right)
    {
        return;
    }

    int key = PartSort_Prev_postPointer(data, left, right);

    QuickSort_Prev_postPointer(data, left, key - 1);
    QuickSort_Prev_postPointer(data, key + 1, right);
}

int main()
{
    int data[] = { 23,48,67,45,21,90,33,11 };
    int sz = sizeof(data) / sizeof(int);
    QuickSort_Prev_postPointer(data, 0, sz - 1);
    for (int i = 0; i < sz; i++)
    {
        printf("%d ", data[i]);
    }

    return 0;
}
输出结果：
11 21 23 33 45 48 67 90
```

快速排序结合三路划分以及三数随机取中优化

前面提到的快速排序划分实际上都是两路划分，包括相等的值在内分成左右两路，而三路划分是Hoare版本和前后指针法的结合，将数组分为三个部分：左边小于`key`的部分，中间等于`key`的部分，右边大于`key`的部分，这个优化可以解决快速排序在遇到大量等于`key`的数值时效率是最坏的情况，再通过三数随机取中解决出现数据波动大的情况

```c
//以下面的数组为例
int data[] = { 23,23,87,99,23,19,57,45 };
```

<img src="images\image18.png">

```c
//三数随机取中
int GetMidIndex_random(int* data, int left, int right)
{
    int mid = (left + (rand() % (right - left))) / 2;//注意将随机值限制在有效区间
    if (data[left] > data[mid])
    {
        if (data[mid] > data[right])
        {
            return mid;
        }
        else if (data[left] > data[right])
        {
            return right;
        }
        else
        {
            return left;
        }
    }
    else
    {
        if (data[right] > data[mid])
        {
            return mid;
        }
        else if (data[left] > data[right])
        {
            return left;
        }
        else
        {
            return right;
        }
    }
}

void QuickSort_TPart(int* data, int begin, int end)
{
    if (begin >= end)
    {
        return;
    }

    int left = begin;
    int right = end;

    int mid = GetMidIndex_random(data, left, right);
    swap(&data[left], &data[mid]);
    int key = data[left];//注意比较的是key值，不是key所在位置的值

    int cur = left + 1;
    while (cur <= right)
    {
        if (data[cur] < key)
        {
            swap(&data[left], &data[cur]);
            left++;
            cur++;
        }
        else if (data[cur] > key)
        {
            swap(&data[right], &data[cur]);
            right--;
        }
        else
        {
            cur++;
        }
    }

    QuickSort_TPart(data, begin, left - 1);
    QuickSort_TPart(data, right + 1, end);
}
```

#### 快速排序非递归版

由于递归的函数栈帧空间是在栈上创建的，而且栈上的空间较堆空间小，所以当数据量太大时，可以考虑用快速排序的非递归版，一般用栈来实现，基本思路如下：首先将数据的头和尾进行入栈操作，再在循环中通过出栈和获取栈顶元素控制左区间和右区间，可以先执行左区间或者右区间，本处以先右区间再左区间为例，通过需要拆分数据的部分出栈排序，再接着重复步骤最后排序完成，具体思路分析如下：

<img src="images\image19.png">

```c
void QuickSort_NotRecursion(int* data, int left, int right)
{
    ST st = { 0 };
    STInit(&st);
    //压入第一个元素和最后一个元素所在位置
    STPush(&st, left);
    STPush(&st, right);

    while (!STEmpty(&st))
    {
        //获取区间
        int right = STTop(&st);
        STPop(&st);
        int left = STTop(&st);
        STPop(&st);

        //单趟排序
        int key = PartSort_Hoare(data, left, right);

        //更新区间
        //先压右侧区间
        if (key + 1 < right)
        {
            STPush(&st, key + 1);
            STPush(&st, right);
        }

        //再压左侧区间
        if (left < key - 1)
        {
            STPush(&st, left);
            STPush(&st, key - 1);
        }
    }

    STDestroy(&st);
}
```

快速排序的时间复杂度为$O(Nlog_{2}{N})$，空间复杂度为$O(log_{2}{N})$，属于不稳定算法

## 归并排序

归并排序，分为分治以及合并，分治部分可以使用递归或者非递归完成，归并排序的基本思路是：将已有序的子序列合并，得到完全有序的序列；即先使每个子序列有序，再使子序列段间有序。若将两个有序表合并成一个有序表，称为二路归并

### 递归版本

递归版本的归并排序思路如下：先将数组分为不可再分割的只有一个数据的部分，再取小的部分进行尾插，每排序一次就将排序好的数据拷贝到原来的数组中

```c
//以下面的数组为例
int data[] = { 10,5,6,9,1,3,4,7 };
```

<img src="images\image20.png">

<img src="images\image21.png">

<img src="images\image22.png">

```c
void _MergeSort(int* data, int* tmp, int left, int right)
{
    //确定递归结束条件
    if (left == right)
    {
        return;
    }

    //分割数组，首先确定当前数组的中间位置
    int mid = (left + right) / 2;
    _MergeSort(data, tmp, left, mid);
    _MergeSort(data, tmp, mid + 1, right);

    //取小的数值尾插到tmp数组中
    int begin1 = left;
    int end1 = mid;
    int begin2 = mid + 1;
    int end2 = right;
    int i = left;
    while (begin1 <= end1 && begin2 <= end2)
    {
        if (data[begin1] < data[begin2])
        {
            tmp[i++] = data[begin1++];
        }
        else
        {
            tmp[i++] = data[begin2++];
        }
    }
    //存在一个数组先走完的情况
    while (begin1 <= end1)
    {
        tmp[i++] = data[begin1++];
    }

    while (begin2 <= end2)
    {
        tmp[i++] = data[begin2++];
    }

    //排序完之后将tmp数组中的数据拷贝回原来的数组
    memcpy(data + left, tmp + left, sizeof(int) * (right - left + 1));
}

//归并排序递归版
void MergeSort(int* data, int sz)
{
    //因为需要将排序好的数据重新拷贝到原来的数组中，所以需要开辟数组
    int* tmp = (int*)malloc(sizeof(int) * sz);
    assert(tmp);
    //防止主函数递归导致每次都会重新开辟空间，所以使用子函数
    _MergeSort(data, tmp, 0, sz - 1);
    free(tmp);
}
```

### 非递归版本

在归并排序中，不使用递归版本时，需要考虑如何对数据进行分堆以及区间的控制，基本思路如下：在循环中，排序间隔为`gap`的部分数值，再改变`gap`值，重复前面的步骤，直到最后排序完成。具体思路如下：

```c
//以下面的数组为例
int data[] = { 10,5,6,9,1,3,4,7 };
```

<img src="images\image23.png">

```c
//归并排序非递归版本
void MergeSort_NotRecursion(int* data, int sz)
{
    //因为需要将排序好的数据重新拷贝到原来的数组中，所以需要开辟数组
    int* tmp = (int*)malloc(sizeof(int) * sz);
    assert(tmp);
    //开始间隔为1
    int gap = 1;
    while (gap < sz)
    {
        //注意i每一次更新为两倍的gap，因为gap只是代表一组有多少个数据，需要i找到下一组
        for (int i = 0; i < sz; i += 2 * gap)
        {
            int begin1 = i;
            int end1 = i + gap - 1;
            int begin2 = i + gap;
            int end2 = i + 2 * gap - 1;
            int j = begin1;
            while (begin1 <= end1 && begin2 <= end2)
            {
                if (data[begin1] < data[begin2]) 
                {
                    tmp[j++] = data[begin1++];
                }
                else
                {
                    tmp[j++] = data[begin2++];
                }
            }

            while (begin1 <= end1)
            {
                tmp[j++] = data[begin1++];
            }

            while (begin2 <= end2)
            {
                tmp[j++] = data[begin2++];
            }
        }
        memcpy(data, tmp, sizeof(int) * sz);
        gap *= 2;
    }

    free(tmp);
}
```

但是上面的方法存在一个问题，如果数组的数据不是2的次方个，那么将无法完成排序，存在越界问题

```c
//下面是当数组数据为9个时的越界情况
[0, 0] [1 1]
[2, 2] [3 3]
[4, 4] [5 5]
[6, 6] [7 7]
[8, 8] [9 9]

[0, 1] [2 3]
[4, 5] [6 7]
[8, 9] [10 11]

[0, 3] [4 7]
[8, 11] [12 15]

[0, 7] [8 15]
```

越界的情况分为三种：

1. `end1`、`begin2`、`end2`越界，例如[8, 11]、[12, 15]
2. `begin2`、`end2`越界，例如[10, 11]
3. `end2`越界，例如[8, 15]

对于上面的问题可以考虑对边界进行修正

<img src="images\image24.png">

第一种解决方法：

1. 当`begin2`和`end1`越界时，跳出循环不进行后方数据的调整
2. 当`end2`越界时，修正`end2`为数组最后一个元素的位置

<img src="images\image25.png">

```c
//归并排序非递归版本
void MergeSort_NotRecursion(int* data, int sz)
{
    //因为需要将排序好的数据重新拷贝到原来的数组中，所以需要开辟数组
    int* tmp = (int*)malloc(sizeof(int) * sz);
    assert(tmp);
    //开始间隔为1
    int gap = 1;
    while (gap < sz)
    {    
        //注意i每一次更新为两倍的gap，因为gap只是代表一组有多少个数据，需要i找到下一组
        for (int i = 0; i < sz; i += 2 * gap)
        {
            int begin1 = i;
            int end1 = i + gap - 1;
            int begin2 = i + gap;
            int end2 = i + 2 * gap - 1;
            int j = begin1;

            if (begin2 >= sz || end1 >= sz)
            {
                break;
            }

            if (end2 >= sz)
            {
                end2 = sz - 1;
            }

            while (begin1 <= end1 && begin2 <= end2)
            {
                if (data[begin1] < data[begin2]) 
                {
                    tmp[j++] = data[begin1++];
                }
                else
                {
                    tmp[j++] = data[begin2++];
                }
            }

            while (begin1 <= end1)
            {
                tmp[j++] = data[begin1++];
            }

            while (begin2 <= end2)
            {
                tmp[j++] = data[begin2++];
            }
            memcpy(data + i, tmp + i, sizeof(int) * (end2 - i + 1));
        }
        gap *= 2;
    }

    free(tmp);
}
```

第二种解决方法：

直接对所有区间进行修正，将越界的区间修正成左区间大于右区间的不存在区间，此时不存在的区间将不会进入循环，而存在的区间也是有效区间，直接整体拷贝即可

```c
void MergeSort_NotRecursion1(int* data, int sz)
{
    int* tmp = (int*)malloc(sizeof(int) * sz);
    assert(tmp);
    int gap = 1;
    while (gap < sz)
    {
        for (int i = 0; i < sz; i += 2*gap)
        {
            int begin1 = i;
            int end1 = i + gap - 1;
            int begin2 = i + gap;
            int end2 = i + 2 * gap - 1;
            int j = i;

            //1. end1 begin2 end2越界
            if (end1 >= sz)
            {
                end1 = sz - 1;
                //修正的不存在区间
                begin2 = sz;
                end2 = sz - 1;
            }
            else if (begin2 >= sz)//2. begin2 end2 越界
            {
                //修正的不存在区间
                begin2 = sz;
                end2 = sz - 1;
            }
            else if(end2 >= sz)//3. end2越界
            {
                end2 = sz - 1;
            }

            while (begin1 <= end1 && begin2 <= end2)
            {
                if (data[begin1] <= data[begin2])//当使用<=时防止出现相等时进行交换，使得排序稳定
                {
                    tmp[j++] = data[begin1++];
                }
                else
                {
                    tmp[j++] = data[begin2++];
                }
            }

            while (begin1 <= end1)
            {
                tmp[j++] = data[begin1++];
            }

            while (begin2 <= end2)
            {
                tmp[j++] = data[begin2++];
            }
            
        }
        memcpy(data, tmp, sizeof(int) * sz);
        gap *= 2;
    }

    free(tmp);
}
```

### 归并排序小优化

如果数据的个数特别大时，再让数据一直递归到只有一个数据的一层时会导致递归太深从而栈溢出，可以考虑在只有十个数据递归时采用其他排序算法进行优化，此处可以采用直接插入排序，因为每进行一次递归，数据会被分成两部分，所以当递归到只有十个数据时时，数据个数就已经比较小了

<img src="images\image26.png">

!!! note
    这个优化只是在一定程度上有节省，当数据量特别大时，消耗和递归基本上一致

```c
void InsertSort(int* data, int sz)
{
    for (int i = 1; i < sz; i++)
    {
        int tmp = data[i];
        int end = i - 1;
        while (end > 0)
        {
            if (data[end] > tmp)
            {
                data[end + 1] = data[end];
                end--;
            }
            else
            {
                break;
            }
        }
        data[end + 1] = tmp;
    }
}

//归并排序递归版本优化
void _MergeSort_modified(int* data, int* tmp, int left, int right)
{
    //确定递归结束条件
    if (left == right)
    {
        return;
    }

    //小区间优化——直接插入排序
    if ((left - right + 1) < 10)
    {
        InsertSort(data, left - right + 1);
    }

    //分割数组，首先确定当前数组的中间位置
    int mid = (left + right) / 2;
    _MergeSort_modified(data, tmp, left, mid);
    _MergeSort_modified(data, tmp, mid + 1, right);

    //取小的数值尾插到tmp数组中
    int begin1 = left;
    int end1 = mid;
    int begin2 = mid + 1;
    int end2 = right;
    int i = left;
    while (begin1 <= end1 && begin2 <= end2)
    {
        if (data[begin1] < data[begin2])
        {
            tmp[i++] = data[begin1++];
        }
        else
        {
            tmp[i++] = data[begin2++];
        }
    }
    //存在一个数组先走完的情况
    while (begin1 <= end1)
    {
        tmp[i++] = data[begin1++];
    }

    while (begin2 <= end2)
    {
        tmp[i++] = data[begin2++];
    }

    //排序完之后将tmp数组中的数据拷贝回原来的数组
    memcpy(data + left, tmp + left, sizeof(int) * (right - left + 1));
}

//归并排序递归版
void MergeSort_modified(int* data, int sz)
{
    //因为需要将排序好的数据重新拷贝到原来的数组中，所以需要开辟数组
    int* tmp = (int*)malloc(sizeof(int) * sz);
    assert(tmp);
    //防止主函数递归导致每次都会重新开辟空间，所以使用子函数
    _MergeSort_modified(data, tmp, 0, sz - 1);
    free(tmp);
}
```

归并排序的时间复杂度是$O(Nlog_{2}{N})$，空间复杂度为O(N)，归并排序时稳定排序算法

## 计数排序

计数排序又称为鸽巢原理，是对哈希直接定址法的变形应用。具体思路为：

1.  统计相同元素出现次数
2. 根据统计的结果将序列回收到原来的序列中

### 计数排序基本思路

基本思路分析：

```c
//以下面的数组为例
int data[] = { 7,8,9,2,4,5,5,6,3,5 };
```

<img src="images\image27.png">

```c
void CountSort(int* data, int sz)
{
    int max = data[0];
    //遍历数组找出最大值
    for (int i = 0; i < sz; i++)
    {
        if (data[i] > max)
        {
            max = data[i];
        }
    }

    //根据最大值开辟数组
    int* tmp = (int*)calloc(max + 1, sizeof(int));
    assert(tmp);

    //统计数据个数
    for (int i = 0; i < sz; i++)
    {
        tmp[data[i]]++;
    }

    //按照数据个数写回原数组
    int j = 0;
    for (int i = 0; i < (max + 1); i++)
    {
        while (tmp[i] > 0)
        {
            data[j] = i;
            tmp[i]--;
            j++;
        }
    }
}
```

### 计数排序改进思路

上面的数据如果出现下面的情况：

```c
int data[] = { 100,103,104,105,105,107,109,102 };
```

则不能考虑开辟最大元素+1个元素的空间，因为此时总数据个数小于数组的总长度，造成了空间浪费，可以考虑找出数组中的最大值和最小值，取其差值+1开辟数组，并且此时对应的下标应该是两数之差

```c
//计数排序改进思路
void CountSort_modified(int* data, int sz)
{
    int max = data[0];
    int min = data[0];
    //遍历数组找出最大值
    for (int i = 0; i < sz; i++)
    {
        if (data[i] > max)
        {
            max = data[i];
        }

        if (data[i] < min)
        {
            min = data[i];
        }
    }

    int range = max - min + 1;
    //根据最大值开辟数组
    int* tmp = (int*)calloc(range, sizeof(int));
    assert(tmp);

    //统计数据个数
    for (int i = 0; i < sz; i++)
    {
        tmp[data[i] - min]++;
    }

    //按照数据个数写回原数组
    int j = 0;
    for (int i = 0; i < range; i++)
    {
        while (tmp[i] > 0)
        {
            data[j] = i + min;
            tmp[i]--;
            j++;
        }
    }
}
```

通过上面的思路解析，很明显计数排序的局限性很大，需要排序的数据必须非常集中，并且数据只能是整型，否则不容易计数

计数排序的时间复杂度为O(max(N, `range`))，空间复杂度为O(`range`)