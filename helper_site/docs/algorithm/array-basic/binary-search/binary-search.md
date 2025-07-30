# 二分查找算法

## 介绍

二分查找算法，是一种快速在一组有序且严格递增的区域中找一个指定元素的算法，其基本原理类似于猜数字游戏，先猜一个中间数值，再根据中间数值与目标值进行比较，判断目标值在中间值左侧部分还是右侧部分改变下一次猜的数值

!!! note
    实际上，二分查找的本质是利用了「二段性」，所以只需要查找的区间可以根据某一种条件分为两个子区间，就可以使用二分查找算法，而不一定需要满足「有序且严格递增」

有了基本思路，根据前面的基本思路就需要进行代码实现，二分查找算法根据查找区间右侧端点是否包含分为两种情况，假设左侧端点为`left`，右侧端点为`right`：

1. 左闭右闭区间：[`left`, `right`]，这种情况下最明显的特点就是`left==right`时是有效区间
2. 左闭右开区间：[`left`, `right`)，这种情况下与左闭右闭区间刚好相反，当`left==right`时是无效区间

!!! info
    所谓有效区间，代表该区间内的所有值都是有效可查找的，所以对于闭区间来说，当`left==right`时，也需要进行判断，因为当前值可能是结果，但是对于开区间来说，当`left==right`时，就不需要判断

因为接下来的查找一个循环进行的动作，而在整个循环中，必须保证`left`和`right`构成的区间必须与一开始设定的区间原则一致，例如开始为左闭右开区间，则在整个循环中，必须保证`left`和`right`构成的区间始终为左闭右开区间，这个左闭右开区间在整个过程中也被称为循环不变量

左闭右闭原则下，因为`left`和`right`都是有效值，所以下一次更新时，`left`和`right`对应的值也必须是未比较过的值（即有效值）

<img src="2. 二分查找.assets/image-20241018214429432.png" alt="image-20241018214429432" />

左闭右闭原则下，因为`left`是有效值，`right`是无效值，所以下一次更新时，`left`对应的值是未比较过的值（即有效值），`right`对应的值是比较过的值（即无效值）

<img src="2. 二分查找.assets/image-20241018214545439-1730040795426-5.png" alt="image-20241018214545439" />

代码实现：

=== "左闭右闭原则"

    ```c++
    // 左闭右闭原则
    // 返回指定元素的下标
    int BinarySearch(std::vector<int>& nums, int target)
    {
        // 左闭右闭原则：[left, right]区间，此时left==right是有效区间
        int left = 0;
        int right = nums.size() - 1;
    
        // left <= right, 因为当left==right时，nums[left] == nums[right]有效，此时是最后一次判断
        while (left <= right)
        {
            // 计算出中间值
            // int mid = (left + right) / 2;
            int mid = left + ((right - left) / 2); // 防止溢出——结果等效于上面的写法
            // 除以2也可以使用右移>>
            // int mid = left + ((right - left) >> 1);
            /*
            * 上面的步骤先算出固定不变的间隔值，再通过起始位置加上间隔值间接算出中间值位置
            *  具体步骤如下：
            *  1. 计算 right - left，得到区间的长度
            *  2. 将区间长度除以 2，得到中间值相对于 left 的偏移量
            *  3. 将偏移量加到 left 上，得到中间值的位置
            */
            // 判断是否取到指定值
            if (nums[mid] == target) // 相等——返回
            {
                return mid; // 返回指定值下标
            }
            else if (nums[mid] > target) // 中间值较大——target一定在中间值左边
            {
                // 左闭右闭原则，此时nums[mid]一定不是target
                right = mid - 1;
            }
            else if (nums[mid] < target) // 中间值较小——target一定在中间值右边
            {
                // 左闭右闭原则，此时nums[mid]一定不是target
                left = mid + 1;
            }
        }
    
        // 约定没找到返回-1
        return -1;
    }
    ```

=== "左闭右开原则"

    ```c++
    // 左闭右开原则
    // 返回指定元素的下标
    int BinarySearch(std::vector<int>& nums, int target)
    {
        // 左闭右开原则：[left, right)，此时当left==right时就是无效区间
        int left = 0;
        int right = nums.size();
    
        // 因为left==right是无效区间，所以left不可以等于right
        while (left < right)
        {
            int mid = (left + right) / 2;
            if(nums[mid] == target) // 相等——返回
            {
                return mid;
            }
            else if(nums[mid] > target) // 中间值较大，则目标值一定在中间值右边
            {
                // 左闭右开原则，此时mid的值是下一次的右边界，不包括mid的值
                right = mid;
            }
            else if(nums[mid] < target) // 中间值较小，则目标值一定在中间值左边
            {
                // 左边右开原则，此时mid的值是下一次的左边界，包括mid的值
                left = mid + 1;
            }
        }
    
        // 没找到指定值返回-1
        return -1;
    }
    ```

## 示例题目

[704.二分查找](https://leetcode.cn/problems/binary-search/)


!!! quote
    给定一个 `n` 个元素有序的（升序）整型数组 `nums` 和一个目标值 `target` ，写一个函数搜索 `nums` 中的 `target`，如果目标值存在返回下标，否则返回 `-1`。


    **示例 1:**
    
    ```c++
    输入: nums = [-1,0,3,5,9,12], target = 9
    输出: 4
    解释: 9 出现在 nums 中并且下标为 4
    ```
    
    **示例 2:**
    
    ```c++
    输入: nums = [-1,0,3,5,9,12], target = 2
    输出: -1
    解释: 2 不存在 nums 中因此返回 -1
    ```
    
    **提示：**
    
    1. 你可以假设 `nums` 中的所有元素是不重复的。
    2. `n` 将在 `[1, 10000]`之间。
    3. `nums` 的每个元素都将在 `[-9999, 9999]`之间。

参考代码如下：

=== "左闭右开区间"

    ```c++
    class Solution704_1 {
    public:
        int search(vector<int>& nums, int target) 
        {
            int left = 0;
            int right = nums.size();
            while(left < right)
            {
                int mid = left + (right - left) / 2;
                if(nums[mid] == target)
                {
                    return mid;
                }
                else if(nums[mid] < target)
                {
                    left = mid + 1;
                }
                else 
                {
                    right = mid;
                }
            }
    
            return -1;
        }
    };
    ```

=== "左闭右闭区间"

    ```c++
    class Solution704_2 {
    public:
        int search(vector<int>& nums, int target) 
        {
            int left = 0;
            int right = nums.size() - 1;
            while(left <= right)
            {
                int mid = left + (right - left) / 2;
                if(nums[mid] == target)
                {
                    return mid;
                }
                else if(nums[mid] < target)
                {
                    left = mid + 1;
                }
                else 
                {
                    right = mid - 1;
                }
            }
    
            return -1;
        }
    };
    ```

!!! note
    在使用二分查找算法的**左闭右开区间**逻辑时，需要注意计算中间值不可以使用`left+(right - left + 1) / 2`或者`(left + right + 1) / 2`，此时会导致`mid`和`right`指向同一个位置
    
    在正常的比较逻辑下的`mid`是还未比较的数值（有效值），而`right`代表的是已经比较的数值（无效值），左闭右开区间中`right`更新到`mid`说明`mid`已经比较过而变为无效值
    
    但是当前情况下，`mid`在未比较时就已经与`right`处于同一个位置导致左闭右开原则违背，所以左闭右开区间时计算中间值不可以使用`left+(right - left + 1) / 2`或者`(left + right + 1) / 2`

## 二分算法查找基本模板

这个版本的二分算法模板比较简单，所以也带来了比较强的局限性，简单了解即可

!!! warning
    模板不是死记硬背的，切忌死记硬背

=== "左闭右闭区间"
    ```c++
    // 查找结构（数组）为nums
    int left = 0;
    int right = nums.size() - 1;

    while(left <= right)
    {
        // 1. 第一种中间值求法
        int mid = (right + left) / 2;
        // 2. 第二种中间值求法
        int mid = left + (right - left) / 2; // 防止溢出
        // 3. 第三种中间值求法
        int mid = left + (right - left + 1) / 2; // 求出当元素个数为偶数时，靠右侧的元素位置
        // 下面两种方式分别等价于第二种和第三种，只是除以换成向右移位
        // 4. 第四种中间值求法
        int mid = left + ((right - left) >> 1);
        // 5. 第五种中间值求法
        int mid = left + ((right - left + 1) >> 1); 
    
        if(...) // 根据指定条件填充
        {
            return mid;
        }
        else if(...) // 根据指定条件填充
        {
            left = mid + 1;
        }
        else
        {
            right = mid - 1;
        }
    }
    
    return ...; // 根据指定条件填充
    ```

=== "左闭右开区间"

    ```c++
    // 查找结构（数组）为nums
    int left = 0;
    int right = nums.size();
    
    while(left < right)
    {
        // 1. 第一种中间值求法
        int mid = (right + left) / 2;
        // 2. 第二种中间值求法
        int mid = left + (right - left) / 2; // 防止溢出
        // 下面写法错误
        // int mid = left + (right - left + 1) / 2; // 求出当元素个数为偶数时，靠右侧的元素位置
        // 3. 第三种中间值求法
        int mid = left + ((right - left) >> 1);
        // 下面写法错误
        // int mid = left + ((right - left + 1) >> 1); 
    
        if(...) // 根据指定条件填充
        {
            return mid;
        }
        else if(...) // 根据指定条件填充
        {
            left = mid + 1;
        }
        else
        {
            right = mid;
        }
    }
    
    return ...; // 根据指定条件填充
    ```

## 二分查找算法查找端点模版

二分查找算法查找端点一般是一个结果区间的左右两个端点，本部分的模版需要根据二分查找算法的二段性进行区间划分，从而确定使用哪一种查找端点模版

!!! info
    本模板的思路来自于[力扣34题](https://www.help-doc.top/algorithm/array-basic/binary-search/binary-search.html#34)，具体分析见该题分析

!!! warning
    模板不是死记硬背的，切忌死记硬背

!!! note
    需要注意，不论是左闭右开区间，还是左闭右闭区间，最后返回的左端点和右端点分别是`left`和`left-1`，下面以左闭右开区间为例

=== "找左端点（左闭右开区间）"
    ```c++
    // 查找结构（数组）为nums，目标值为target
    int left = 0;
    int right = nums.size();

    while(left < right)
    {
        // 1. 第一种中间值求法
        int mid = (right + left) / 2;
        // 2. 第二种中间值求法
        int mid = left + (right - left) / 2; // 防止溢出
        // 下面写法错误
        // int mid = left + (right - left + 1) / 2; // 求出当元素个数为偶数时，靠右侧的元素位置
        // 3. 第三种中间值求法
        int mid = left + ((right - left) >> 1);
        // 下面写法错误
        // int mid = left + ((right - left + 1) >> 1); 

        if(...) // 根据指定条件填充
        {
            left = mid + 1;
        }
        else
        {
            right = mid;
        }
    }
    // 特判防止left为数组长度或者left位置的值并非目标值
    if(left > nums.size() || nums[left] != target)
    {
        return -1;
    }

    return left; // 返回左端点
    ```

=== "找右端点（左闭右开区间）"
    ```c++
    // 查找结构（数组）为nums
    int left = 0;
    int right = nums.size();

    while(left < right)
    {
        // 1. 第一种中间值求法
        int mid = (right + left) / 2;
        // 2. 第二种中间值求法
        int mid = left + (right - left) / 2; // 防止溢出
        // 下面写法错误
        // int mid = left + (right - left + 1) / 2; // 求出当元素个数为偶数时，靠右侧的元素位置
        // 3. 第三种中间值求法
        int mid = left + ((right - left) >> 1);
        // 下面写法错误
        // int mid = left + ((right - left + 1) >> 1); 

        if(...) // 根据指定条件填充
        {
            left = mid + 1;
        }
        else
        {
            right = mid;
        }
    }
    // 特判防止left为数组长度或者left位置的值并非目标值
    if(left > nums.size() || nums[left] != target)
    {
        return -1;
    }

    return left - 1; // 返回右端点
    ```


## 相关题目

### 力扣35.搜索插入位置

[力扣35.搜索插入位置](https://leetcode.cn/problems/search-insert-position/description/)

**参考代码：**

```c++
class Solution35 {
public:
    int searchInsert(std::vector<int>& nums, int target) 
    {
        int left = 0;
        int right = nums.size() - 1;
        int mid = 0;
        while(left <= right)
        {
            mid = left + ((right - left) >> 1);
            if(nums[mid] == target)
            {
                return mid;
            }
            else if(nums[mid] > target)
            {
                right = mid - 1;
            }
            else if(nums[mid] < target)
            {
                left = mid + 1;
            }
        }

        // 左闭右闭不能返回right
        // 左闭右开情况下left和right指向的是同一个位置
        // return right;
        return left;
    }
};
```

### 力扣69.x的平方根

[力扣69.x的平方根](https://leetcode.cn/problems/sqrtx/description/)

**问题描述：**

!!! quote
    给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

    请必须使用时间复杂度为$O(\log_{2}{N})$的算法。

    示例 1:
    
    ```c++
    输入: nums = [1,3,5,6], target = 5
    输出: 2
    ```
    
    示例 2:
    
    ```c++
    输入: nums = [1,3,5,6], target = 2
    输出: 1
    ```
    
    示例 3:
    
    ```c++
    输入: nums = [1,3,5,6], target = 7
    输出: 4
    ```

**思路分析：**

1. 解法1：暴力解法
    本题最直观的解法就是依次枚举，直到遇到枚举的数的平方值小于或者等于目标值，返回这个枚举的数值
2. 解法2：二分查找
    本题可以考虑依次枚举出小于等于`x`的数值，但是比较时，不同于暴力解法，从枚举的过程中可以看到推出下面的规律：
    
    <img src="2. 二分查找.assets\Snipaste_2024-10-28_10-32-45.png" style="zoom:50%;" >

    所以，根据上面的规律可以推出满足二段性的区间：1. `mid * mid <= x` 2. `mid * mid > x`

**关键步骤：**

为了保证最后可以记下满足条件的值并返回，在更新`left`之前，先对当前`mid`值进行记录

本题需要注意数值范围，小心越界问题，[C语言/C++数据类型取值范围见表](https://www.help-doc.top/algorithm/common/common.html)

示意图如下：

<img src="2. 二分查找.assets\x的平方根.gif">

**参考代码：**

=== "暴力解法"
    ```c++
    // 力扣69.x的平方根
    // 暴力解法
    class Solution69_1 
    {
    public:
        int mySqrt(int x) 
        {
            size_t ans = 0;
            for(;ans * ans <= x; ans++);
            return (ans - 1);
        }
    };
    ```

=== "二分查找解法"
    ```c++
    // 力扣69.x的平方根
    class Solution69_2 {
    public:
        int mySqrt(int x) 
        {
            // 暴力解法
            // size_t ans = 0;
            // for(;ans * ans <= x; ans++);
            // return (ans - 1);
            size_t left = 0;
            size_t right = x;
            size_t ans = 0;
            // 左闭右闭区间
            while(left <= right)
            {
                size_t mid = left + ((right - left) >> 1);
                // 可能无法刚刚好等于
                // if(ans == x)
                // {
                //     ans = mid;
                //     break;
                // }
                if(mid * mid <= x) // 中间值较小
                {
                    ans = mid;
                    left = mid + 1;
                }
                else if(mid * mid > x) // 中间值较大
                {
                    right = mid - 1;
                }
            }
            return ans;
        }
    };
    ```

### 力扣367.有效的完全平方数

[类似于力扣69题：力扣367.有效的完全平方数](https://leetcode.cn/problems/valid-perfect-square/description/)

**参考代码：**

```c++
// 类似69题型：力扣367.有效的完全平方数
class Solution367 {
public:
    bool isPerfectSquare(int num) 
    {
        size_t left = 0;
        size_t right = num;
        size_t ans = 0;
        // 左闭右闭区间
        while(left <= right)
        {
            size_t mid = left + ((right - left) >> 1);
            if (mid * mid <= num)
            {
                ans = mid;
                left = mid + 1;
            }
            else
            {
                right = mid - 1;
            }
        }

        return ans * ans == num;
    }
};
```

### 力扣34.在排序数组中查找元素的第一个和最后一个位置

[力扣34.在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/description/)

**问题描述：**

!!! quote
    给你一个按照非递减顺序排列的整数数组`nums`，和一个目标值`target`。请你找出给定目标值在数组中的开始位置和结束位置。

    如果数组中不存在目标值`target`，返回`[-1, -1]`。

    你必须设计并实现时间复杂度为$O(\log_{2}{N})$的算法解决此问题。

    示例 1：

    ```c++
    输入：nums = [5,7,7,8,8,10], target = 8
    输出：[3,4]
    ```

    示例 2：

    ```c++
    输入：nums = [5,7,7,8,8,10], target = 6
    输出：[-1,-1]
    ```

    示例 3：

    ```c++
    输入：nums = [], target = 0
    输出：[-1,-1]
    ```

**思路分析：**

1. 解法1：暴力解法
    本题暴力解法就是遍历数组，记录起始位置和终止位置
2. 解法2：二分查找
    题目提到数组是升序但非递减，所以直接找`target`肯定结果不唯一，但是本题需要找的是第一个和最后一个位置对应的下标，所以可以考虑设定两个一定不存在的边界值，使用二分查找确定左右端点。因此可以根据是否是左右端点确定满足二段性的区间

    因为二分查找一次只能查找出一个值，所以左右端点需要分开进行查找，查找的方式有两种：

    1. 查找临界值，本题题干提到数组全是整数，所以一定不存在浮点数，假设找的数值是8，则可以考虑找8.5和7.5，这两个数值一定不存在于数组中，所以可以根据这两个值确定边界，以查找7.5和8.5为例，使用左闭右闭区间或左闭右开区间均是正确思路，因为这个思路本质是查找一个值，而不是确定端点

    2. 查找端点值：这个思路是直接利用二分查找算法找到左端点和右端点，但是不能通过直接的等于就判定一定是起点还是终点。判断如何划分出二段性区间，找这两个端点的思路基本一致，都是为了找一个边界值，所以二段性区间基本一致，对于左端点：找出区间：1. 小于左端点的值 2. 大于等于左端点的值，对于右端点：1. 小于等于右端点的值 2. 大于右端点的值

**关键步骤：**

不论是解法1还是解法2都需要判断`target`是否存在于`nums`中，否则会返回一个不存在的或者奇怪的区间，并且在判断是否存在之前一定要注意先判断是否包含越界情况

1. 解法1示意图如下：

    以`nums = [5,7,7,8,8,10]`, `target = 8`为例

    - 左闭右开区间找7.5
        <img src="2. 二分查找.assets\力扣34左闭右开区间找7.5.gif">
    - 左闭右开区间找8.5
        <img src="2. 二分查找.assets\力扣34左闭右开区间找8.5.gif">

2. 解法2示意图如下：

    以`nums = [5,7,7,8,8,10]`, `target = 8`为例

    - 左闭右开区间找左端点
        找左端点时划分的区间为`<8`和`>=8`，当`nums[mid]`小于8时，因为要得到左端点，所以`>=8`的部分一定含有多个8，所以需要减小`right`位置从而减小区间，所以更新`left`，否则更新`right`，因为是左闭右开区间，所以当`left`和`right`相遇时`[left, right)`无效，结束寻找

        示意图如下：

        <img src="2. 二分查找.assets\力扣34左闭右开区间找左端点.gif">

    - 左闭右开区间找右端点
        找右端点时划分的区间为`<=8`和`>8`，当`nums[mid]`小于等于8时，因为要得到右端点，所以`<=8`的部分必须确保包含所有8，所以此时需要增加`left`从而扩大`<=8`区间，所以更新`right`，否则更新left，因为是左闭右开区间，所以当`left`和`right`相遇时`[left, right)`无效，结束寻找

        示意图如下：

        <img src="2. 二分查找.assets\力扣34左闭右开区间找右端点.gif">

**参考代码：**

=== "解法1"

    ```c++
    class Solution34_1 
    {
    public:
        // 二分查找
        int BinarySearch(std::vector<int>& nums, double target) 
        {
            int left = 0;
            int right = nums.size();

            // 左闭右开区间
            while (left < right) 
            {
                int mid = left + ((right - left) >> 1);
                if (nums[mid] <= target) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }

            return left;
        }

        std::vector<int> searchRange(std::vector<int>& nums, int target) 
        {
            // 存在则继续
            // 找左边界
            int leftHand = BinarySearch(nums, target - 0.5);
            // 找右边界
            int rightHand = BinarySearch(nums, target + 0.5);
            // 判断target是否存在于nums中
            
            // if(leftHand >= nums.size() || nums[leftHand] != target)
            // {
            //     return {-1, -1};
            // }
            // return {leftHand, rightHand - 1};

            // 上面的代码也可以按照下面的形式写，但是注意不可以省略指定类型的vector<int>，
            // 因为此时编译器无法确定{-1, -1}和{leftHand, rightHand - 1}是否是同一个类型
            return leftHand >= nums.size() || nums[leftHand] != target ? 
                    std::vector<int>{-1, -1} : 
                    std::vector<int>{leftHand, rightHand - 1};
        }
    };
    ```

=== "解法2"
    ```c++
    class Solution34_2 
    {
    public:
        std::vector<int> searchRange(std::vector<int>& nums, int target) 
        {
            int left = 0;
            int right = nums.size();

            // 左闭右开区间找左端点
            while(left < right)
            {
                int mid = left + (right - left) / 2;
                // <target和>=target
                if(nums[mid] < target)
                {
                    left = mid + 1;
                }
                else
                {
                    right = mid;
                }
            }
            // 判断当前left是否为目标值以及是否存在越界
            if(left >= nums.size() || nums[left] != target)
            {
                return {-1, -1};
            }
            // 否则记录当前left
            int begin = left;

            // 左闭右开区间找右端点
            left = 0;
            right = nums.size();
            while(left < right)
            {
                int mid = left + (right - left) / 2;
                // <=target和>target
                if(nums[mid] <= target)
                {
                    left = mid + 1;
                }
                else
                {
                    right = mid;
                }
            }

            // 记录右端点的位置
            int last = left - 1;

            return {begin, last};
        }
    };
    ```

### 牛客JZ53.数字在升序数组中出现的次数

[类似力扣34题：牛客网JZ53.数字在升序数组中出现的次数](https://www.nowcoder.com/practice/70610bf967994b22bb1c26f9ae901fa2?tpId=13&tqId=23274&ru=/ta/coding-interviews&qru=/ta/coding-interviews/question-ranking)

**参考代码：**

=== "C++"
    ```c++
    // 牛客类似题目：JZ53 数字在升序数组中出现的次数
    #include <vector>
    class SolutionJZ53 {
    public:
        /**
        * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
        *
        *
        * @param nums int整型vector
        * @param k int整型
        * @return int整型
        */
        // 二分查找
        int BinarySearch(std::vector<int>& nums, double target)
        {
            int left = 0;
            int right = nums.size() - 1;
            // 左闭右闭区间
            while (left <= right)
            {
                int mid = left + ((right - left) >> 1);
                if(nums[mid] <= target)
                {
                    left = mid + 1;
                }
                else
                {
                    right = mid - 1;
                }
            }

            return left;
        }
        int GetNumberOfK(std::vector<int>& nums, int k)
        {
            // 左边界
            int leftHand = BinarySearch(nums, k - 0.5);
            // 右边界
            int rightHand = BinarySearch(nums, k + 0.5);
    
            return rightHand - leftHand;
        }
    };
    ```
=== "C语言"

    ```c++
    /**
        * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
        *
        *
        * @param nums int整型一维数组
        * @param numsLen int nums数组长度
        * @param k int整型
        * @return int整型
        */
    //二分查找
    int BinarySearch(int* nums, int numsLen, double k)
    {
        int left = 0;
        int right = numsLen - 1;
        while (left <= right) {
            int mid = (left + right) / 2;
            if(nums[mid] > k)
            {
                right = mid - 1;
            }
            else if (nums[mid] < k) {
                left = mid + 1;
            }
        }
        //返回 left 而不是 mid
        return left;
    }
    int GetNumberOfK(int* nums, int numsLen, int k )
    {
        return BinarySearch(nums, numsLen, k+0.5)-BinarySearch(nums, numsLen, k-0.5);
    }
    ```

### 力扣852.山脉数组的峰顶索引

[力扣852.山脉数组的峰顶索引](https://leetcode.cn/problems/peak-index-in-a-mountain-array/)

**问题描述：**

!!! quote
    给定一个长度为`n`的整数山脉数组`arr`，其中的值递增到一个峰值元素然后递减。

    返回峰值元素的下标。

    你必须设计并实现时间复杂度为$O(\log_{2}{N})$的解决方案。

    示例 1：

    ```c++
    输入：arr = [0,1,0]
    输出：1
    ```

    示例 2：

    ```c++
    输入：arr = [0,2,1,0]
    输出：1
    ```

    示例 3：

    ```c++
    输入：arr = [0,10,5,2]
    输出：1
    ```

**思路分析：**

1. 解法1：暴力解法
    本题的暴力解法很简单，只需要找到数组中的最大值即可，因为题目保证数组是一个山脉数组，并且根据题干描述「其中的值递增到一个峰值元素然后递减」，说明一定只存在一个峰值元素
2. 解法2：二分查找
    本题就是典型的二分查找应用于非有序且严格递增的区间，但是因为二分查找算法的本质是利用二段性，所以只需要在本题中找到二段性即可使用二分查找算法。本题的二段性可以分为两个区间：1. 左侧小于峰值 2. 右侧小于等于峰值，根据这个二段性区间，可以考虑选用找左侧端点模板

**关键步骤：**

本题并没有直接给出`target`，所以需要分析本题的`target`，根据题目描述「其中的值递增到一个峰值元素然后递减」，所以如果`nums[mid]`如果小于`nums[mid + 1]`，则说明还没有遇到峰值，此时就需要更新`left`，否则更新`right`

**参考代码：**

=== "暴力解法"

    ```c++
    // 找数组最大值
    class Solution852_1
    {
    public:
        int peakIndexInMountainArray(std::vector<int> &nums)
        {
            int maxIndex = 0;
            for(size_t i = 0 ; i < nums.size(); i++)
                if(nums[i] > nums[maxIndex])
                    maxIndex = i;

            return maxIndex;
        }
    };
    ```

=== "二分查找"

    ```c++
    // 二分查找
    class Solution852_2 
    {
    public:
        int peakIndexInMountainArray(std::vector<int>& nums) 
        {
            int left = 0;
            int right = nums.size();

            while(left < right)
            {
                int mid = left + (right - left) / 2;
                if(nums[mid] < nums[mid + 1])
                {
                    left = mid + 1;
                }
                else
                {
                    right = mid;
                }
            }

            return left;
        }
    };

    ```

### 力扣162.寻找峰值

[力扣162.寻找峰值](https://leetcode.cn/problems/find-peak-element/description/)

**问题描述：**

!!! quote
    峰值元素是指其值严格大于左右相邻值的元素。

    给你一个整数数组`nums`，找到峰值元素并返回其索引。数组可能包含多个峰值，在这种情况下，返回任何一个峰值所在位置即可。

    你可以假设`nums[-1]=nums[n]=-∞`。

    你必须实现时间复杂度为$O(\log_{2}{N})$的算法来解决此问题。

    示例 1：

    ```c++
    输入：nums = [1,2,3,1]
    输出：2
    解释：3 是峰值元素，你的函数应该返回其索引 2。
    ```

    示例 2：

    ```c++
    输入：nums = [1,2,1,3,5,6,4]
    输出：1 或 5 
    解释：你的函数可以返回索引 1，其峰值元素为 2；
        或者返回索引 5， 其峰值元素为 6。
    ```

**思路分析：**

1. 解法1：暴力解法
    本题暴力解法与上题暴力解法一致，因为题目提到「返回任何一个峰值所在位置即可」，所以只需要返回第一个较大值即可

2. 解法2：二分查找
    本题二分查找解法与上题二分查找解法一致，因为题目提到「返回任何一个峰值所在位置即可」，所以二段性区间可以假设性得分为：1. 左侧小于峰值 2. 右侧小于等于峰值，同样，根据这个二段性区间，可以考虑选用找左侧端点模板

**关键步骤：**

本题需要注意，题目提到了一个关键条件「你可以假设`nums[-1]=nums[n]=-∞`」，所以如果存在一个数组满足`nums[0]>nums[1]`或者`nums[nums.size()]>nums[nums.size() - 1]`，则其中的`nums[0]`和`nums[nums.size()]`也算是峰值，所以这种情况需要对`mid+1`进行判断，如果`mid+1`已经大于`nums.size()`，就需要修正，修正方法就是通过让`right`先移动一次再移动`left`

以`[1,2]`为例，修正示意图如下：

<img src="2. 二分查找.assets\力扣162left修正.gif" style="zoom:50%">

**参考代码：**

=== "暴力解法"

    ```c++
    class Solution162_1 
    {
    public:
        int findPeakElement(vector<int>& nums) 
        {
            // 找数组最小值
            int maxIndex = 0;
            for(size_t i = 0 ; i < nums.size(); i++)
                if(nums[i] > nums[maxIndex])
                    maxIndex = i;

            return maxIndex;
        }
    };
    ```

=== "二分查找"

    ```c++
    class Solution162_2 
    {
    public:
        int findPeakElement(std::vector<int>& nums) 
        {
            int left = 0;
            int right = nums.size();

            while(left < right)
            {
                int mid = left + (right - left) / 2;
                if(mid + 1 < nums.size() && nums[mid] < nums[mid + 1])
                {
                    left = mid + 1;
                }
                else
                {
                    right = mid;
                }
            }

            return left;
        }
    };
    ```

### 牛客NC107.寻找峰值

[类似力扣162题：牛客NC107.寻找峰值](https://www.nowcoder.com/practice/fcf87540c4f347bcb4cf720b5b350c76?tpId=188&&tqId=38666&rp=1&ru=/activity/oj&qru=/ta/job-code-high-week/question-ranking)

**参考代码：**

=== "C语言（递归查找）"

    ```c
    int _findPeakElement(int* nums, int left, int right) 
    {
        if (left >= right) 
        {
            return left;
        }
        int mid = (left + right) / 2;
        int leftSummit = _findPeakElement(nums, left, mid);
        int rightSummit = _findPeakElement(nums, mid + 1, right);

        return nums[leftSummit] > nums[rightSummit] ? leftSummit : rightSummit;
    }
    int findPeakElement(int* nums, int numsLen) 
    {
        int ret = _findPeakElement(nums, 0, numsLen - 1);
        return ret;
    }
    ```

=== "C++（递归查找）"

    ```c++
    class Solution 
    {
    public:
        int _findPeakElement(vector<int>& nums, int left, int right)
        {
            if (left >= right) {
            return left;
            }
            int mid = (left + right) / 2;
            int leftSummit = _findPeakElement(nums, left, mid);
            int rightSummit = _findPeakElement(nums, mid + 1, right);

            return nums[leftSummit] > nums[rightSummit] ? leftSummit : rightSummit;
        }

        int findPeakElement(vector<int>& nums) 
        {
            int ret = _findPeakElement(nums, 0, nums.size() - 1);
            return ret;
        }
    };
    ```

=== "C语言（二分查找）"
    ```c
    int findPeakElement(int* nums, int numsLen) {
        int left = 0;
        int  right = numsLen;
        while (left < right) {
            int mid = (left + right) / 2;
            if (mid + 1 < numsLen && nums[mid] < nums[mid + 1]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }
    ```

=== "C++（二分查找）"
    ```c++
    class Solution
    {
    public:
        int findPeakElement(vector<int> &nums)
        {
            int left = 0;
            int right = nums.size();
            while (left < right)
            {
                int mid = (left + right) >> 1;
                if (mid + 1 < nums.size() && nums[mid] < nums[mid + 1])
                {
                    left = mid + 1;
                }
                else
                {
                    right = mid;
                }
            }
            return left;
        }
    };
    ```


### 力扣153.寻找旋转排序数组中的最小值

[力扣153.寻找旋转排序数组中的最小值](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/description/)

**问题描述：**

!!! quote

    已知一个长度为`n`的数组，预先按照升序排列，经由1到`n`次旋转后，得到输入数组。例如，原数组`nums = [0,1,2,4,5,6,7]`在变化后可能得到：

    - 若旋转4次，则可以得到`[4,5,6,7,0,1,2]`
    - 若旋转7次，则可以得到`[0,1,2,4,5,6,7]`

    注意，数组`[a[0], a[1], a[2], ..., a[n-1]]`旋转一次 的结果为数组`[a[n-1], a[0], a[1], a[2], ..., a[n-2]]`。

    给你一个元素值互不相同的数组`nums`，它原来是一个升序排列的数组，并按上述情形进行了多次旋转。请你找出并返回数组中的最小元素。

    你必须设计一个时间复杂度为$O(\log_{2}{N})$的算法解决此问题。

    示例 1：

    ```c++
    输入：nums = [3,4,5,1,2]
    输出：1
    解释：原数组为 [1,2,3,4,5] ，旋转 3 次得到输入数组。
    ```

    示例 2：

    ```c++
    输入：nums = [4,5,6,7,0,1,2]
    输出：0
    解释：原数组为 [0,1,2,4,5,6,7] ，旋转 3 次得到输入数组。
    ```

    示例 3：

    ```c++
    输入：nums = [11,13,15,17]
    输出：11
    解释：原数组为 [11,13,15,17] ，旋转 4 次得到输入数组。
    ```

**思路分析：**

1. 解法1：暴力解法
    本题的暴力解法也很简单，只需要找到最小元素即可

2. 解法2：二分查找
    本题的查找区间依旧不满足二分查找的前提条件，但是只要能找到二段性，依旧可以使用二分查找算法解决。本题的二段性比较困难，如果根据题目的「最小元素」作为切入点，会发现找出的并非是满足二段性的区间，而是分成了三个区间：1. 左侧（如果存在）大于最小元素 2. 当前最小元素 3. 右侧（如果存在）大于最小元素。以`[3,4,5,1,2]`为例，如果以「最小元素」为切入点，则会发现最小元素两侧都大于最小元素，所以无法根据这个切入点划分满足二段性的区间。观察数组，可以发现数组的一个特点：持续递增后，到达某一个最大值之后，从下一个最小值再持续递增，所以可以根据这个特点分为两个满足二段性的区间：1. 第一个持续递增区间 2. 第二个持续递增区间

**关键步骤：**

有了区间之后开始进行比较，如果当前值大于第二个区间的最大值，则说明第一个区间绝对没有最小值，此时就更新`left`从而接近第二个区间，否则更新`right`从而接近第一个区间，这里考虑找左端点，所以依旧使用左端点模板。注意不要使用右端点，因为根据二段性区间，第一个持续递增区间和第二个持续递增区间都是满足严格递增，所以两个区间之中的最小值一定是其中一个区间的第一个元素

!!! note
    本题需要注意与力扣852题、力扣162和牛客NC107作区分，本题涉及到目标值左侧和右侧都比目标值大，所以整个图形呈现向下凹的形状


**参考代码：**

=== "暴力解法"

    ```c++
    class Solution153_1 
    {
    public:
        int findMin(std::vector<int>& nums) 
        {
            // 找数组最小值
            int minIndex = 0;
            for(size_t i = 0 ; i < nums.size(); i++)
                if(nums[i] < nums[minIndex])
                    minIndex = i;

            return nums[minIndex];
        }
    };
    ```

=== "二分查找"

    ```c++
    class Solution153_2 
    {
    public:
        int findMin(const std::vector<int>& nums) 
        {
            int left = 0;
            int right = nums.size();
            int last = nums[right - 1];
            while (left < right) 
            {
                int mid = left + (right - left) / 2;
                if (nums[mid] > last) 
                {
                    left = mid + 1;
                } 
                else 
                {
                    right = mid;
                }
            }

            return nums[left];
        }
    };
    ```

### 力扣LCR173.点名

[力扣LCR173.点名](https://leetcode.cn/problems/que-shi-de-shu-zi-lcof/description/)

**问题描述：**

!!! quote
    某班级`n`位同学的学号为`0 ~ n-1`。点名结果记录于升序数组`records`。假定仅有一位同学缺席，请返回他的学号。

    示例 1:

    ```c++
    输入: records = [0,1,2,3,5]
    输出: 4
    ```

    示例 2:

    ```c++
    输入: records = [0, 1, 2, 3, 4, 5, 6, 8]
    输出: 7
    ```

**思路分析：**

1. 解法1：暴力解法

    根据题目描述学生的学号从0开始，一直到`n`，所以数组的元素一定最后一个值为`n`，通过一层`for`循环依次枚举，直到枚举到与数组中不相等的数值就停止，此时该值就是缺失的值，需要注意，这个方法如果缺失的值是最后一个值`n`需要额外判断
    
2. 解法2：异或运算

    这个解法与第一种解法基本一致，根据异或运算的特点，当出现非0值与0异或会得出原数值，相同的值异或得0，所以根据这个特点可以获取到第一个非0的值即为缺失值

3. 解法3：哈希表

    题目中的提示内容可以看到数据范围最大到10000，所以可以开辟一个数组用于直接定址，将数组中的数值依次映射到哈希表中，再遍历哈希表找到值为0的即为缺失值

4. 解法4：数学（等差数列）

    因为题目中提到学号从0开始一直到`n`，中间的每一个值间隔为1，所以可以利用等差求和公式先计算出不缺失值时数组的总和，再用总和减去当前缺失数值时的数组的总和，结果就是缺失值

5. 解法5：二分查找

    本题的二分查找比较隐晦，如果单单看数值可能很难找出关系，可以考虑结合下标看，本题最大的特点就是每一个同学的学号与其下标相同，如果遇到缺失值，则下标就会比对应值小1，根据这个特点，推导出满足二段性的区间：1. 与下标相等 2. 与下标差1

**关键步骤：**

主要讨论第5种解法，有了满足二段性的区间，只需要找到第一个下标与对应值不等的即为缺失值，当下标与对应值相等，说明当前位置及之前位置均没有缺失值，更新`left`减小区间，否则更新`right`以结束循环

**参考代码：**

=== "暴力解法"

    ```c++
    class SolutionLCR173_1 
    {
    public:
        int takeAttendance(vector<int>& records) 
        {
            size_t i = 0;
            for(; i <= records.size(); i++)
            {
                // 缺失最后一个值
                if(i == records.size())
                {
                    return records.size();
                }
                else if(records[i] != i)
                {
                    break;
                }
            }

            return i;
        }
    };
    ```

=== "异或运算"

    ```c++
    class SolutionLCR173_2 
    {
    public:
        int takeAttendance(vector<int>& records) 
        {
            int ret = 0;
            for(size_t i = 0; i <= records.size(); i++)
            {
                if(i == records.size())
                {
                    return records.size();
                }
                else if(records[i] ^ i)
                {
                    ret = i;
                    break;
                }
            }

            return ret;
        }
    };
    ```

=== "哈希表"

    ```c++
    class SolutionLCR173_3 
    {
    public:
        int takeAttendance(vector<int>& records) 
        {
            int hash[10001] = {0};

            for(auto num : records)
            {
                hash[num]++;
            }

            // 遍历哈希表找到为0位置的下标
            int ret = 0;
            for(size_t i = 0; i < 10001; i++)
            {
                if(!hash[i])
                {
                    ret = i;
                    break;
                }
            }

            return ret;
        }
    };
    ```

=== "等差数列"

    ```c++
    class SolutionLCR173_4 
    {
    public:
        int takeAttendance(vector<int>& records) 
        {
            return [&]() -> int{
                int sum = (records.size() + 0) * (records.size() + 1)/2; 
                return sum;
                }() - 
                accumulate(records.begin(), records.end(), 0);
        }
    };
    ```

=== "二分查找"

    ```c++
    class SolutionLCR173_5 
    {
    public:
        int takeAttendance(vector<int>& nums) 
        {
            int left = 0;
            int right = nums.size();

            while(left < right)
            {
                int mid = left + (right - left) / 2;
                if(nums[mid] == mid)
                {
                    left = mid + 1;
                }
                else
                {
                    right = mid;
                }
            }

            return left;
        }
    };
    ```
