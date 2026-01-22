<!-- 添加对Katex的支持 -->
<script defer src="/javascripts/katex.min.js"></script>
<script defer src="https://help-site.oss-cn-hangzhou.aliyuncs.com/js/katex.min.js"></script>
<script defer src="https://help-site.oss-cn-hangzhou.aliyuncs.com/js/auto-render.min.js"></script>

<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://help-site.oss-cn-hangzhou.aliyuncs.com/css/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# 移除元素专题

## 本节介绍

前面提到，数组中需要移除元素不可以直接删除，因为数组是一个连续的结构，删除元素只能通过将被删除的元素进行覆盖，此时就必定涉及到将被删除元素的后面元素向前依次挪动，本节主要关注数组中移动元素的问题以及感受双指针算法，在后面会详细介绍本算法

## 示例题目

[力扣27.移除元素](https://leetcode.cn/problems/remove-element/description/)

!!! quote
    给你一个数组 nums 和一个值`val`，你需要 原地 移除所有数值等于`val`的元素。元素的顺序可能发生改变。然后返回`nums`中与`val`不同的元素的数量。

    假设`nums`中不等于`val`的元素数量为`k`，要通过此题，您需要执行以下操作：

    更改`nums`数组，使`nums`的前`k`个元素包含不等于`val`的元素。`nums`的其余元素和`nums`的大小并不重要。

    返回 k。

    **示例 1：**
    
    ```c++
    输入：nums = [3,2,2,3], val = 3
    输出：2, nums = [2,2,_,_]
    解释：你的函数函数应该返回 k = 2, 并且 nums 中的前两个元素均为 2。
    你在返回的 k 个元素之外留下了什么并不重要（因此它们并不计入评测）。
    ```

    示例 2：

    ```c++
    输入：nums = [0,1,2,2,3,0,4,2], val = 2
    输出：5, nums = [0,1,4,0,3,_,_,_]
    解释：你的函数应该返回 k = 5，并且 nums 中的前五个元素为 0,0,1,3,4。
    注意这五个元素可以任意顺序返回。
    你在返回的 k 个元素之外留下了什么并不重要（因此它们并不计入评测）。
    ```
**思路分析：**

1. 解法1：暴力解法

    暴力解法的思路就是移动数组元素的基本逻辑：移除某一个元素就是将该元素后面的每一个元素向前挪动。暴力解法的时间复杂度是$O(N^2)$

2. 解法2：双指针算法

    本题可以使用快慢指针的方法，本质就是双指针算法，其中`slow`指针指向待被覆盖的元素，`fast`找不等于被删除的元素

=== "暴力解法"

    ```c++
    class Solution27_1 
    {
    public:
        int removeElement(vector<int>& nums, int val) 
        {
            int size = nums.size();
            for (int i = 0; i < size; i++) 
            {
                if (nums[i] == val) { // 发现需要移除的元素，就将数组集体向前移动一位
                    for (int j = i + 1; j < size; j++) 
                    {
                        nums[j - 1] = nums[j];
                    }
                    i--; // 因为下标i以后的数值都向前移动了一位，所以i也向前移动一位
                    size--; // 此时数组的大小-1
                }
            }
            return size;

        }
    };
    ```

=== "双指针解法"

    ```c++
    class Solution27_2
    {
    public:
        int removeElement(std::vector<int> &nums, int val)
        {
            // 双指针解法
            // int count = 0;
            int fast = 0, slow = 0;
            while (fast < nums.size())
            {
                if (nums[fast] != val)
                {
                    nums[slow++] = nums[fast];
                }
                fast++;
            }
            // return count;
            // 也可以不用计数器，直接返回slow
            return slow;
        }
    };
    ```

## 相关题目

### 力扣26.删除有序数组中的重复项

[力扣26.删除有序数组中的重复项](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/description/)

参考代码：

```c++
class Solution26
{
public:
    int removeDuplicates(std::vector<int> &nums)
    {
        // 双指针解法
        int size = nums.size();
        int slow = 0;
        int fast = 0;
        while (fast < nums.size())
        {
            if (nums[fast] != nums[slow])
            {
                // slow+1防止越界
                if (slow + 1 < nums.size())
                {
                    nums[slow + 1] = nums[fast];
                }
                slow++;
            }
            fast++;
        }

        return slow + 1;
    }
};
```

### 力扣283.移动零

[力扣283.移动零](https://leetcode.cn/problems/move-zeroes/description/)

参考代码：

```c++
// 双指针解法，具体思路与上题类似
class Solution283
{
public:
    void moveZeroes(std::vector<int> &nums)
    {
        int prev = 0, cur = 0;
        while (cur < nums.size())
        {
            if (nums[cur])
                std::swap(nums[cur++], nums[prev++]);
            else
                cur++;
        }
    }
};
```

### 力扣844.比较含退格的字符

[力扣844.比较含退格的字符](https://leetcode.cn/problems/backspace-string-compare/description/)

参考代码：

=== "暴力解法"

    ```c++
    // 暴力解法——注意string类也有尾删操作
    class Solution844_1
    {
    public:
        std::string remove(std::string s)
        {
            // 暴力解法
            std::string ret;
            for (auto str: s)
            {
                if (str != '#')
                {
                    ret.push_back(str);
                }
                else if (!ret.empty())
                {
                    // string的尾删方法pop_back
                    ret.pop_back();
                }
            }

            return ret;
        }

        bool backspaceCompare(std::string s, std::string t)
        {
            return remove(s) == remove(t);
        }
    };
    ```

=== "双指针解法"

    ```c++
    // 双指针算法
    /*
    * 为什么：判断两个数组内容是否相等，可以定义指向两个数组的指针依次比较每一个字符
    * 如何用：本题涉及到退格符#，所以需要额外遇到#时候的情况，因为#只会影响左侧的字符而不会影响右侧的字符
    * 所以考虑从后往前遍历，但是考虑到#可能与下一个要删除的字符不是紧挨着，所以需要考虑使用一个计数器记录#的个数
    * 在遍历过程中，分为三种情况：
    * 1. 当#计数器为0，直接判断两个数组中的当前字符是否相等，不等则直接返回false，这里需要考虑其中一个可能是空数组
    * 2. 当有一方#计数器不为0，则让该方的下标指针向前移动，直到移动到计数器为0为止
    * 3. 如果当前字符是#，则#计数器加1，并且下标指针向前移动
    */
    class Solution844_2
    {
    public:
        bool backspaceCompare(std::string s, std::string t)
        {
            int si = s.size() - 1, ti = t.size() - 1;
            int skips = 0, skipt = 0;

            // 确保至少有一方有内容
            while (si >= 0 || ti >= 0)
            {
                // 遍历第一个字符数组
                while (si >= 0)
                {
                    if (s[si] == '#')
                    {
                        // 第三种情况
                        skips++;
                        si--;
                    }
                    else if (skips > 0)
                    {
                        // 第二种情况
                        si--;
                        skips--;
                    }
                    else
                    {
                        // 第一种情况
                        break;
                    }
                }
                // 遍历第二个字符数组
                while (ti >= 0)
                {
                    if (t[ti] == '#')
                    {
                        // 第三种情况
                        skipt++;
                        ti--;
                    }
                    else if (skipt > 0)
                    {
                        // 第二种情况
                        ti--;
                        skipt--;
                    }
                    else
                    {
                        // 第一种情况
                        break;
                    }
                }

                // 判断两个字符串当前字符是否相等
                // 必须确保两个字符串都有字符才进行当前字符是否相等的比较
                if (si >= 0 && ti >= 0)
                {
                    if (s[si] != t[ti])
                    {
                        return false;
                    }
                }
                else
                {
                    // 如果有一个字符数组为空，则直接返回false
                    if (si >= 0 || ti >= 0)
                    {
                        return false;
                    }
                }
                si--;
                ti--;
            }

            // 循环全部走完说明相同
            return true;
        }
    };
    ```

### 力扣977.有序数组的平方

[力扣977.有序数组的平方](https://leetcode.cn/problems/squares-of-a-sorted-array/description/)

参考代码：

=== "尾插+排序"

    ```c++
    // 尾插+排序
    class Solution977_1
    {
    public:
        std::vector<int> sortedSquares(std::vector<int> &nums)
        {
            std::vector<int> ret;
            for (auto num: nums)
            {
                ret.push_back(num * num);
            }
            std::sort(ret.begin(), ret.end());
            return ret;
        }
    };
    ```

=== "双指针算法（非原地处理；左闭右闭）"

    ```c++
    // 双指针算法（但非原地处理）
    /*
    * 为什么：本题中存在负数，并且数组是非递减顺序，
    * 所以最大值只有可能出现在最左侧（负数数值越小，平方后越大）和最右侧（正数数值越大，平方后越大）
    * 并且平方值向数组中间依次减小
    * 怎么做：考虑双指针异地处理，比较左指针和右指针对应的值的平方，大的就尾插到异地的数组中
    * 为了避免使用insert函数产生额外的时间复杂度，可以考虑提前开辟空间，并使用一个指针，起始位置指向异地数组的最后一个元素的位置
    */
    // 左闭右闭区间
    class Solution977_2
    {
    public:
        std::vector<int> sortedSquares(std::vector<int> &nums)
        {
            int left = 0, right = nums.size() - 1;
            std::vector<int> ret(nums.size());
            int reti = ret.size() - 1;
            while (left <= right)
            {
                int num1 = nums[left] * nums[left];
                int num2 = nums[right] * nums[right];
                if (num1 < num2)
                {
                    ret[reti--] = num2;
                    right--;
                }
                else
                {
                    ret[reti--] = num1;
                    left++;
                }
            }

            return ret;
        }
    };
    ```

=== "双指针算法（但非原地；左闭右开）"

    ```c++
    // 左闭右开区间
    class Solution977_3
    {
    public:
        std::vector<int> sortedSquares(std::vector<int> &nums)
        {
            int left = 0, right = nums.size();
            std::vector<int> ret(nums.size());
            int reti = ret.size() - 1;
            while (left < right)
            {
                int num1 = nums[left] * nums[left];
                int num2 = nums[right - 1] * nums[right - 1];
                if (num1 < num2)
                {
                    ret[reti--] = num2;
                    right--;
                }
                else
                {
                    ret[reti--] = num1;
                    left++;
                }
            }

            return ret;
        }
    };
    ```