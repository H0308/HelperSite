# 字符串基础练习

## 本篇介绍

因为字符串在C++中是字符数组，所以基本操作与数组是大致相似的，其相关操作的时间复杂度也是基本一致的，所以本篇主要介绍字符串相关的题目和部分字符串的算法，并不会涉及到字符串的统一解法

## 力扣125.验证回文串

**问题描述：**

!!! quote

    如果在将所有大写字符转换为小写字符、并移除所有非字母数字字符之后，短语正着读和反着读都一样。则可以认为该短语是一个回文串。

    字母和数字都属于字母数字字符。

    给你一个字符串`s`，如果它是回文串，返回`true`；否则，返回`false`。

    示例 1：

    ```c++
    输入: s = "A man, a plan, a canal: Panama"
    输出：true
    解释："amanaplanacanalpanama" 是回文串。
    ```

    示例 2：

    ```c++
    输入：s = "race a car"
    输出：false
    解释："raceacar" 不是回文串。
    ```

    示例 3：

    ```c++
    输入：s = " "
    输出：true
    解释：在移除非字母数字字符之后，s 是一个空字符串 "" 。
    由于空字符串正着反着读都一样，所以是回文串。
    ```

**思路分析：**

1. 解法1：逆序比较

    这个思路比较直观，因为题目提到字符串还包含符号，所以需要创建一个新的字符串，将字符和数字拼接到该字符串中，再逆序该字符串，将逆序结果与该字符串比较，如果相等返回`true`，否则返回`false`

2. 解法2：双指针

    双指针的思路就是通过比较两个指针当前的字符是否相等作为判断条件，如果相等，就让两个指针同时向中间移动，注意需要包括二者相遇的情况，如果不相等直接返回`false`。如果其中一个指针指向的是符号，那么一直让其移动直到找到字母或者数字即可。上面的一系列步骤都涉及到移动指针，所以在获取指针指向的位置的字符时一定要确保没有越界访问的问题

**参考代码：**

=== "逆序比较"

    ```c++
    class Solution125_1
    {
    public:
        bool isPalindrome(string s)
        {
            string s1;
            // 确保待比较的字符串只有数字和小写字母
            for (char ch: s)
                if (isalnum(ch))
                    s1 += tolower(ch);

            string s2(s1.rbegin(), s1.rend());
            return s1 == s2;
        }
    };
    ```

=== "双指针"

    ```c++
    class Solution125_2
    {
    public:
        bool isPalindrome(string s)
        {
            for (int left = 0, right = s.size() - 1; left <= right;)
            {
                while (left <= s.size() - 1 && !isalnum(s[left]))
                    left++;
                while (right >= 0 && !isalnum(s[right]))
                    right--;

                if (left <= s.size() - 1 && right >= 0 && tolower(s[left]) != tolower(s[right]))
                {
                    return false;
                }
                else
                {
                    left++;
                    right--;
                }
            }

            return true;
        }
    };
    ```

## 力扣344.反转字符串

[力扣344.反转字符串](https://leetcode.cn/problems/reverse-string/description/)

**问题描述：**

!!! quote

    编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组`s`的形式给出。
    
    不要给另外的数组分配额外的空间，你必须原地修改输入数组、使用O(1)的额外空间解决这一问题。
    
    示例 1：
    
    ```c++
    输入：s = ["h","e","l","l","o"]
    输出：["o","l","l","e","h"]
    ```
    
    示例 2：
    
    ```c++
    输入：s = ["H","a","n","n","a","h"]
    输出：["h","a","n","n","a","H"]
    ```

**思路分析：**

反转字符串的本质就是依次交换对应位置的字符，例如"H"和"h"交换、"a"和"a"交换，以此类推。根据思路就可以利用到双指针`left`和`right`分别指向首尾，二者向中间遍历，如果同时指向一个字符，则可以考虑不进行交换，所以交换结束条件就是`left<right`

**参考代码：**

=== "库函数"

    ```c++
    class Solution344_1
    {
    public:
        void reverseString(vector<char> &s)
        {
            reverse(s.begin(), s.end());
        }
    };
    ```

=== "双指针"

    ```c++
    class Solution344_2
    {
    public:
        void reverseString(vector<char> &s)
        {
            for (int start = 0, end = s.size() - 1; start < end; start++, end--)
            {
                swap(s[start], s[end]);
            }
        }
    };
    ```

## 力扣541.反转字符串II

[力扣541.反转字符串II](https://leetcode.cn/problems/reverse-string-ii/description/)

**问题描述：**

!!! quote
    给定一个字符串`s`和一个整数`k`，从字符串开头算起，每计数至`2k`个字符，就反转这`2k`字符中的前`k`个字符。

    - 如果剩余字符少于`k`个，则将剩余字符全部反转。
    - 如果剩余字符小于`2k`但大于或等于`k`个，则反转前`k`个字符，其余字符保持原样。
    
    示例 1：
    
    ```c++
    输入：s = "abcdefg", k = 2
    输出："bacdfeg"
    ```
    
    示例 2：
    
    ```c++
    输入：s = "abcd", k = 2
    输出："bacd"
    ```

**思路分析：**

本题首先需要理解题目的要求，题目看似给出了三个要求，实际上就只有两个要求：

1. 字符数量小于`k`，则反转所有字符
2. 字符数量大于等于`k`但小于`2k`，则反转前`k`个

根据这两个要求就可以模拟出本题需要的结果

**关键步骤：**

在遍历字符串时，其实每一次只需要考虑`2k`部分即可，当`2k`部分全部处理完成后，下标可以直接跳到`2k+1`的位置，而没必要一个字符一个字符向后移动

**参考代码：**

```c++
class Solution541
{
public:
    void reverseString(string &s, int start, int end)
    {
        while (start < end)
        {
            swap(s[start], s[end]);
            start++;
            end--;
        }
    }

    string reverseStr(string s, int k)
    {
        // 注意当i进行一次跳转时，i的位置是下一区间的起始位置
        for (int i = 0; i < s.size(); i += 2 * k)
        {
            if (i + k < s.size())
            {
                reverseString(s, i, i + k - 1);
                continue;
            }
            reverseString(s, i, s.size() - 1);
        }

        return s;
    }
};
```

## 卡码网KamaCoder.替换数字

[卡码网KamaCoder.替换数字](https://kamacoder.com/problempage.php?pid=1064)

**问题描述：**

!!! quote

    **题目描述**
    
    给定一个字符串`s`，它包含小写字母和数字字符，请编写一个函数，将字符串中的字母字符保持不变，而将每个数字字符替换为`number`。例如，对于输入字符串`a1b2c3`，函数应该将其转换为`anumberbnumbercnumber`。
    
    **输入描述**
    
    输入一个字符串`s`，`s`仅包含小写字母和数字字符。
    
    **输出描述**
    
    打印一个新的字符串，其中每个数字字符都被替换为了`number`
    
    **输入示例**
    
    ```c++
    a1b2c3
    ```
    
    **输出示例**
    
    ```c++
    anumberbnumbercnumber
    ```
    
    **提示信息**
    
    数据范围：
    
    ```c++
    1 <= s.length < 10000
    ```

**思路分析：**

1. 解法1：异地处理

    异地处理的方式很简单，遍历到数字字符就插入一个`number`，否则插入原字符，最后返回新字符数组

2. 解法2：原地处理

    原地处理的方式就是预先开辟比原字符串大的空间，具体开多大可以根据题目要求计算，因为题目需要遇到一个数字字符就进行替换，并且替换为`number`，所以需要额外开辟`数字字符数量*number字符个数-1`的空间。在遍历原字符串的过程中，如果遇到了数字字符，就需要移动其后面所有的字符为插入`number`腾出位子

**参考代码：**

=== "异地处理"

    ```c++
    #include <iostream>
    #include <string>
    using namespace std;
    
    int main()
    {
        string s;
        cin >> s;
        string ret;
        for(auto ch : s)
        {
            if(ch >='0' && ch <= '9')
                ret += "number";
            else
                ret += ch;
        }
    
        cout << ret << endl;
    
        return 0;
    }
    ```

=== "原地处理"

    ```c++
    #include <iostream>
    using namespace std;
    int main() 
    {
        string s;
        while (cin >> s) 
        {
            int sOldIndex = s.size() - 1;
            int count = 0; // 统计数字的个数
            for (int i = 0; i < s.size(); i++) 
            {
                if (s[i] >= '0' && s[i] <= '9') 
                {
                    count++;
                }
            }
            // 扩充字符串s的大小，也就是将每个数字替换成"number"之后的大小
            s.resize(s.size() + count * 5);
            int sNewIndex = s.size() - 1;
            // 从后往前将数字替换为"number"
            while (sOldIndex >= 0) 
            {
                if (s[sOldIndex] >= '0' && s[sOldIndex] <= '9') 
                {
                    s[sNewIndex--] = 'r';
                    s[sNewIndex--] = 'e';
                    s[sNewIndex--] = 'b';
                    s[sNewIndex--] = 'm';
                    s[sNewIndex--] = 'u';
                    s[sNewIndex--] = 'n';
                } 
                else 
                {
                    s[sNewIndex--] = s[sOldIndex];
                }
                sOldIndex--;
            }
            cout << s << endl;       
        }
    }
    ```

## 力扣151. 反转字符串中的单词

[力扣151. 反转字符串中的单词](https://leetcode.cn/problems/reverse-words-in-a-string/description/)

**问题描述：**

!!! quote

    给你一个字符串`s`，请你反转字符串中单词的顺序。
    
    单词是由非空格字符组成的字符串。`s`中使用至少一个空格将字符串中的单词分隔开。
    
    返回单词顺序颠倒且单词之间用单个空格连接的结果字符串。
    
    注意：输入字符串`s`中可能会存在前导空格、尾随空格或者单词间的多个空格。返回的结果字符串中，单词间应当仅用单个空格分隔，且不包含任何额外的空格。
    
    示例 1：
    
    ```c++
    输入：s = "the sky is blue"
    输出："blue is sky the"
    ```
    
    示例 2：
    
    ```c++
    输入：s = "  hello world  "
    输出："world hello"
    解释：反转后的字符串中不能存在前导空格和尾随空格。
    ```
    
    示例 3：
    
    ```c++
    输入：s = "a good   example"
    输出："example good a"
    解释：如果两个单词间有多余的空格，反转后的字符串需要将单词间的空格减少到仅有一个。
    ```

**思路分析：**

1. 解法1：暴力解法

    本题的暴力解法很简单，因为反转后的字符串不能包含多余的空格以及字符串前后的空格，所以需要两个函数分别用于去除首尾空格和中间多余空格。接着就是模拟过程，可以考虑头插单词

2. 解法2：整体反转+单词单个反转

    先整体反转再对某一个部分进行反转就可以让指定部分是逆向，其他部分是正向的，这在旋转字符串中也是常见的思路。在本题中依旧先要处理首尾空格和中间多余空格问题，可以和暴力解法一样，通过两个函数分别处理首尾空格和中间多余空格，但是为了讲本题的空间复杂度讲到O(1)，考虑使用[移除元素的思路](https://www.help-doc.top/algorithm/array-basic/remove-element/remove-element.html)来处理首尾空格和中间多余空格，因为本质移除字符串中的空格就是移除字符数组中内容为空格的元素。处理完空格后就可以通过整体反转，再针对每一个单词单独反转即可

**参考代码：**

=== "暴力解法"

    ```c++
    class Solution151_1
    {
    public:
        string trim(string &s)
        {
            int index = 0;
            for (int i = 0; i < s.size(); i++)
            {
                if (s[i] != ' ')
                {
                    index = i;
                    break;
                }
            }
    
            int length = 0;
            for (int i = s.size() - 1; i >= 0; i--)
            {
                if (s[i] != ' ')
                {
                    length = i;
                    break;
                }
            }
    
            return s.substr(index, length - index + 1);
        }
    
        string trimInner(string &s)
        {
            string result;
            bool space = false;
            for (char c: s)
            {
                if (c != ' ')
                {
                    result += c;
                    space = false;
                }
                else if (!space)
                {
                    result += c;
                    space = true;
                }
            }
            return result;
        }
    
        string reverseWords(string s)
        {
            // 去除前导和尾部空格
            string copy = trim(s);
    
            string word;
    
            int wordStart = 0;
    
            for (int i = 0; i < copy.size(); i++)
            {
                if (i + 1 < copy.size() && copy[i] != ' ' && copy[i + 1] == ' ')
                {
                    word.insert(0, copy.substr(wordStart, i - wordStart + 1) + ' ');
                }
                else if (i + 1 < copy.size() && copy[i] == ' ' && copy[i + 1] != ' ')
                {
                    wordStart = i;
                }
            }
    
            // 最后一个单词
            word.insert(0,
                        copy.substr(wordStart, copy.size() - wordStart + 1) + ' ');
    
            string ret = trim(word);
    
            // 去除中间空格
            ret = trimInner(ret);
    
            return ret;
        }
    };
    ```

=== "整体+局部"

    ```c++
    class Solution151_2
    {
    public:
        // 移除字符串中的空格
        // 数组移除元素的思路
        void removeSpaces(string &s)
        {
            int fast = 0, slow = 0;
            while (fast < s.size())
            {
                if (s[fast] != ' ')
                {
                    // 遇到非空格就处理，即删除所有空格。
                    if (slow != 0)
                        s[slow++] = ' '; // 手动控制空格，给单词之间添加空格。slow != 0说明不是第一个单词，需要在单词前添加空格。
                    while (fast < s.size() && s[fast] != ' ')
                    {
                        // 补上该单词，遇到空格说明单词结束。
                        s[slow++] = s[fast++];
                    }
                }
    
                fast++;
            }
    
            s.resize(slow);
        }
    
        // 翻转
        void reverseString(string &s, int start, int end)
        {
            while (start < end)
            {
                swap(s[start], s[end]);
                start++;
                end--;
            }
        }
    
        string reverseWords(string s)
        {
            // 去除字符串中多余的空格
            removeSpaces(s);
            // 整体反转
            reverseString(s, 0, s.size() - 1);
    
            // 再对单个单词进行翻转
            int start = 0;
            for (int i = 0; i < s.size(); i++)
            {
                if (s[i] == ' ')
                {
                    reverseString(s, start, i - 1);
                    start = i + 1;
                }
            }
    
            // 最后翻转剩余的单词
            reverseString(s, start, s.size() - 1);
    
            return s;
        }
    };
    ```

## 卡码网KamaCoder.右旋字符串

[卡码网KamaCoder.右旋字符串](https://kamacoder.com/problempage.php?pid=1065)

**问题描述：**

!!! quote

    **题目描述**
    
    字符串的右旋转操作是把字符串尾部的若干个字符转移到字符串的前面。给定一个字符串`s`和一个正整数`k`，请编写一个函数，将字符串中的后面`k`个字符移到字符串的前面，实现字符串的右旋转操作。 
    
    例如，对于输入字符串`abcdefg`和整数2，函数应该将其转换为`fgabcde`。
    
    **输入描述**
    
    输入共包含两行，第一行为一个正整数`k`，代表右旋转的位数。第二行为字符串`s`，代表需要旋转的字符串。
    
    **输出描述**
    
    输出共一行，为进行了右旋转操作后的字符串。
    
    **输入示例**
    
    ```c++
    2
    abcdefg
    ```
    
    **输出示例**
    
    ```c++
    fgabcde
    ```
    
    **提示信息**
    
    数据范围：
    
    ```c++
    1 <= k < 10000,
    1 <= s.length < 10000;
    ```

**思路分析：**

右旋字符串就是最典型的整体反转再局部反转的题目，假设字符串有`n`个字符，可以考虑先整体反转，再反转前`k`个字符，已经后`n - k`个字符

**参考代码：**

```c++
#include <iostream>
using namespace std;

void reverseString(string& s, int start, int end)
{
    while(start < end)
    {
        swap(s[start++], s[end--]);
    }
}

int main()
{
    int k;
    string s;
    cin >> k >> s;
    
    // 1. 进行整体反转
    reverseString(s, 0, s.size() - 1);
    
    // 2. 翻转前k个
    reverseString(s, 0, k - 1);
    
    // 3. 翻转后n - k个
    reverseString(s, k, s.size() - 1);
    
    cout << s << endl;
    
    return 0;
}
```

## 力扣28.找出字符串中第一个匹配项的下标

[力扣28.找出字符串中第一个匹配项的下标](https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/description/)

**问题描述：**

!!! quote

    给你两个字符串`haystack`和`needle`，请你在`haystack`字符串中找出`needle`字符串的第一个匹配项的下标（下标从0开始）。如果`needle`不是`haystack`的一部分，则返回-1。
    
    示例 1：
    
    ```c++
    输入：haystack = "sadbutsad", needle = "sad"
    输出：0
    解释："sad" 在下标 0 和 6 处匹配。
    第一个匹配项的下标是 0 ，所以返回 0 。
    ```
    
    示例 2：
    
    ```c++
    输入：haystack = "leetcode", needle = "leeto"
    输出：-1
    解释："leeto" 没有在 "leetcode" 中出现，所以返回 -1 。
    ```

**思路分析：**

1. 解法1：暴力解法

    暴力解法就是使用两层`for`循环，外层遍历原字符串，内层遍历子字符串，遇到不匹配的字符时，外层循环更新到当前字符的下一个字符继续匹配直到遇到完全匹配或者没有匹配返回-1

2. 解法2：KMP算法

    KMP算法就是优化字符串匹配问题的暴力解法，主要思路是利用已知条件减少重复匹配，具体见[KMP算法部分](https://www.help-doc.top/algorithm/other/kmp/kmp.html)

**参考代码：**

=== "暴力解法"

    ```c++
    class Solution28_1
    {
    public:
        int strStr(string haystack, string needle)
        {
            int ret = -1;
            for (int i = 0; i < haystack.size(); i++)
            {
                int index = i;
                int j = 0;
                while (j < needle.size())
                {
                    if (i < haystack.size() && haystack[i] == needle[j])
                    {
                        i++;
                        j++;
                    }
                    else
                    {
                        break;
                    }
                }
    
                if (j == needle.size())
                {
                    ret = index;
                    break;
                }
    
                i = index;
            }
    
            return ret;
        }
    };
    ```

=== "KMP算法"

    ```c++
    class Solution28_2
    {
    public:
        void getNext(vector<int> &next, string &needle)
        {
            int prefixEnd = 0;
            for (int suffixEnd = 1; suffixEnd < needle.size(); suffixEnd++)
            {
                while (prefixEnd - 1 >= 0 && needle[prefixEnd] != needle[suffixEnd])
                {
                    prefixEnd = next[prefixEnd - 1];
                }
    
                if (needle[prefixEnd] == needle[suffixEnd])
                {
                    prefixEnd++;
                }
    
                next[suffixEnd] = prefixEnd;
            }
        }
    
        int strStr(string haystack, string needle)
        {
            // 构建next数组
            vector<int> next(needle.size());
            // 填充next值
            getNext(next, needle);
    
            int j = 0;
            // 遍历文本串
            for (int i = 0; i < haystack.size(); i++)
            {
                while (j - 1 >= 0 && haystack[i] != needle[j])
                {
                    j = next[j - 1];
                }
    
                if (haystack[i] == needle[j])
                    j++;
    
                if (j == needle.size())
                    return i - needle.size() + 1;
            }
    
            // 找不到返回-1
            return -1;
        }
    };
    ```

## 力扣459.重复的子字符串

[力扣459.重复的子字符串](https://leetcode.cn/problems/repeated-substring-pattern/description/)

**问题描述：**

!!! quote

    给定一个非空的字符串`s`，检查是否可以通过由它的一个子串重复多次构成。
    
    示例 1:
    
    ```c++
    输入: s = "abab"
    输出: true
    解释: 可由子串 "ab" 重复两次构成。
    ```
    
    示例 2:
    
    ```c++
    输入: s = "aba"
    输出: false
    ```
    
    示例 3:
    
    ```c++
    输入: s = "abcabcabcabc"
    输出: true
    解释: 可由子串 "abc" 重复四次构成。 (或子串 "abcabc" 重复两次构成。)
    ```

**思路分析：**

1. 解法1：暴力解法

    暴力解法就是枚举子字符串依次匹配，如果匹配成功就说明由该子字符串重复多次构成，否则不是。在暴力解法中，可以先判断枚举的子字符串的长度是否可以被原字符串的长度整除，如果可以则说明可能是该字符串，接着从该位置开始枚举字符即可

    暴力解法里面有一个优化细节，因为子串至少需要重复一次，所以子串的长度一定不会超过原字符串长度的一半

2. 解法2：双倍字符串

    对于由某一个子串多次重复形成的字符串来说，如果将该字符串再重复一遍一定能在新字符串中找到原字符串，需要注意，拼接后的字符串需要去掉首尾字符，防止出现在第一组字符串和最后一组字符串中查找到原字符串

3. 解法3：KMP算法

    查找字符串就是KMP算法要做到的事情，但是本题并没有直接告诉模式串，所以首先需要获取到模式串，如何找到这个模式串也可以使用KMP算法，主要就是利用其`next`数组，以文本串`ababab`为例，观察下图：

    <img src="1. 字符串基础练习.assets/image-20241122105920577.png">

    可以看到如果一个字符串是由某一个子串重复多次构成的，那么最长相等前后缀不包含的子字符串一定是构成原字符串的基础子串

    最后，获取到构成原字符串的子串就可以通过取余运算判断余数是否为0判断是否是由子串重复多次构成的字符串，但是注意判断`next`数组最后一个元素不为0，因为如果其为0，说明根本不存在最长相等前后缀，也就就说明与原字符串并不是由某一个子串重复多次构成

    !!! note

        关于KMP算法部分具体看[KMP算法](https://www.help-doc.top/algorithm/other/kmp/kmp.html)，本题不详细介绍其原理

**参考代码：**

=== "暴力解法"

    ```c++
    class Solution459_1
    {
    public:
        bool repeatedSubstringPattern(string s)
        {
            // 枚举子字符串的末尾位置
            // 子串至少重复一次，所以只有一个字符时一定结果为false
            for(int i = 1; i * 2 <= s.size(); i++)
            {
                // 子字符串重复多次，其一定是原字符串长度的倍数
                if(s.size() % i == 0)
                {
                    bool flag = true;
                    // 匹配当前子串是否是原字符串的基础子串
                    for(int j = i; j < s.size(); j++)
                    {
                        // 不需要重新枚举子串
                        if(s[j] != s[j - i])
                        {
                            flag = false;
                            break;
                        }
                    }

                    if(flag)
                    {
                        return true;
                    }
                }
            }

            // 循环走完说明原字符串并不是由某一个子串重复多次构成
            return false;
        }
    };
    ```

=== "双倍字符串"

    ```c++
    class Solution459_2
    {
    public:
        bool repeatedSubstringPattern(string s)
        {
            // 将原字符串进行自我拼接
            string base = s + s;

            // 拼接后的字符串去掉首尾字符后查找原字符串
            // 找到返回true，否则返回false
            base.erase(0, 1);
            base.erase(base.size() - 1, 1);

            size_t pos = base.find(s);

            if (pos == string::npos)
            {
                return false;
            }
            return true;
        }
    };
    ```

=== "KMP算法"

    ```c++
    class Solution459_3
    {
    public:
        void getNext(vector<int> &next, const string &s)
        {
            // 初始化相关变量
            int prefix = 0;
            for (int suffix = 1; suffix < s.size(); suffix++)
            {
                // 前后缀不相同情况
                while (prefix - 1 >= 0 && s[prefix] != s[suffix])
                {
                    prefix = next[prefix - 1];
                }

                // 前后缀相同情况
                if (s[prefix] == s[suffix])
                    prefix++;

                // 更新next数组
                next[suffix] = prefix;
            }
        }

        bool repeatedSubstringPattern(string s)
        {
            if (s.size() <= 1)
            {
                return false;
            }
            // 创建next数组并填充next值
            vector<int> next(s.size());
            getNext(next, s);

            int len = s.size();
            int lps = next[len - 1];

            // 如果 next 数组最后一个值不为0，并且字符串长度是 (len - lps) 的倍数，则说明可以由重复子串构成
            // 判断lps不为0是为了确保字符串有可能由重复的子串构成
            return lps > 0 && len % (len - lps) == 0;
        }
    };
    ```

## 力扣8.字符串转换整数（atoi）

[力扣8.字符串转换整数](https://leetcode.cn/problems/string-to-integer-atoi/description/)

!!! quote
    请你来实现一个 `myAtoi(string s)` 函数，使其能将字符串转换成一个32位有符号整数。

    函数 `myAtoi(string s)` 的算法如下：

    1. 空格：读入字符串并丢弃无用的前导空格（`" "`）
    2. 符号：检查下一个字符（假设还未到字符末尾）为 `-` 还是 `+`。如果两者都不存在，则假定结果为正。
    3. 转换：通过跳过前置零来读取该整数，直到遇到非数字字符或到达字符串的结尾。如果没有读取数字，则结果为0。
    4. 舍入：如果整数数超过 32 位有符号整数范围$[−2^{31},  2^{31} − 1]$，需要截断这个整数，使其保持在这个范围内。具体来说，小于$−2^{31}$的整数应该被舍入为$−2^{31}$，大于$2^{31} − 1$的整数应该被舍入为$2^{31} − 1$。

    返回整数作为最终结果。

    示例 1：

    ```c++
    输入：s = "42"
    输出：42
    解释：加粗的字符串为已经读入的字符，插入符号是当前读取的字符。
    带下划线线的字符是所读的内容，插入符号是当前读入位置。
    第 1 步："42"（当前没有读入字符，因为没有前导空格）
    第 2 步："42"（当前没有读入字符，因为这里不存在 '-' 或者 '+'）
    第 3 步："42"（读入 "42"）
    ```

    示例 2：

    ```c++
    输入：s = " -042"
    输出：-42
    解释：
    第 1 步："-042"（读入前导空格，但忽视掉）
    第 2 步："   -042"（读入 '-' 字符，所以结果应该是负数）
    第 3 步："   -042"（读入 "042"，在结果中忽略前导零）
    ```

    示例 3：

    ```c++
    输入：s = "1337c0d3"
    输出：1337
    解释：
    第 1 步："1337c0d3"（当前没有读入字符，因为没有前导空格）
    第 2 步："1337c0d3"（当前没有读入字符，因为这里不存在 '-' 或者 '+'）
    第 3 步："1337c0d3"（读入 "1337"；由于下一个字符不是一个数字，所以读入停止）
    ```

    示例 4：

    ```c++
    输入：s = "0-1"
    输出：0
    解释：
    第 1 步："0-1" (当前没有读入字符，因为没有前导空格)
    第 2 步："0-1" (当前没有读入字符，因为这里不存在 '-' 或者 '+')
    第 3 步："0-1" (读入 "0"；由于下一个字符不是一个数字，所以读入停止)
    ```

    示例 5：

    ```c++
    输入：`s = "words and 987"`
    输出：0
    解释：
    读取在第一个非数字字符`"w"`处停止。 
    ```

**思路分析：**

1. 开始遇到非数字字符时返回0
2. 否则继续
    1. 跳过空格`" "`
    2. 遇到`+`或`-`时处理返回值正负

        !!! note
            注意`+`也要处理，`+1`和`1`虽然返回结果相同，但是如果直接输入的是`+1`则此时下标指向`+`而非数字1，从而导致最后的结果错误
            
    3. 处理数值返回

        !!! note
            注意处理数值时需要考虑每一次的计算结果是否超过32位整型的最大值和最小值

细节处理：

1. 在获取字符串的数值时，有两种方法，第一种方法是将每一次获取的数值存入一个`vector<int>`中，最后根据位权求和，例如`42`可以表示为`4 * (int)pow(10, vector<int>().size() - 1 - 0) + 2 * (int)pow(10, vector<int>().size() - 1 - 1)`，但是这种方法如果存在前导0，那么也会放入`vector<int>`中，从而导致需要额外处理前导0，所以需要考虑使用第二种方法：考虑到每一次都是从高位开始读取，则可以使用`ret = ret * 10 + digit`(其中`ret`为返回值，初始化为0，`digit`为每一次获取的数字)，在遍历字符数组时，例如542，高位优先读取，所以先读到5，此时，`digit`为5，`ret * 10`为0，所以此时`ret`为5，接着遇到字符4，此时`digit`为4，`ret*10`为50，故`ret`结果为54，最后遇到2，`digit`为2，`ret*10`为540，故结果为542。这个方法适合正向遍历，反向遍历还是需要用到`vector`，那么如果存在前导0，这个方法则不需要考虑，因为当前导字符为0时，`digit`为0，`ret`也为0，`ret*10+digit`就会为0，即`ret`为0，如此往复直到遇到非前导0
2. 越界问题：字符不存在越界，但是`int`类型存在，在32位系统下，范围为`[INT_MIN, INT_MAX]`，因为最后的结果存储在`ret`中，所以每次计算前判断`ret`是否大于`INT_MAX`或者小于`INT_MIN`，因为越界只会存在于`ret = ret*10+digit`中，如果结果`ret`此时越界了，那么计算`*10+digit`前可能没有越界，所以考虑计算式`(INT_MAX - digit) / 10`的结果为临界值，如果`ret`大于该式，那么`ret = ret*10+digit`肯定越界

**参考代码：**

```c++
class Solution8
{
public:
    int myAtoi(string s)
    {
        int ret = 0;
        // 处理开始为非数字字符
        if (islower(s[0]) || isupper(s[0]))
        {
            return 0;
        }
        int flag = 1;
        int i = 0;
        // 处理空格
        while (i < s.size() && isspace(s[i]))
        {
            i++;
        }

        // 处理符号，可能出现+1等情况需要考虑+
        if (i < s.size() && (s[i] == '-' || s[i] == '+'))
        {
            // 处理负号情况
            if (s[i] == '-')
            {
                flag = -1;
            }
            i++;
        }

        while (i < s.size() && isdigit(s[i]))
        {
            int digit = s[i] - '0';
            // 判断是否越界
            if (ret > (INT_MAX - digit) / 10)
            {
                // 检查(ret - digit) / 10是否越界，如果该式越界，则下面的算式也会越界
                // 根据flag来判断返回正越界还是负越界
                return flag == 1 ? INT_MAX : INT_MIN;
            }

            // 通过使用加法运算去除出现前导0的情况
            ret = ret * 10 + digit;
            i++;
        }

        return ret * flag;
    }
};
```