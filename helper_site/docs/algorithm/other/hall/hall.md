<!-- 添加对Katex的支持 -->
<script defer src="/javascripts/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/contrib/auto-render.min.js"></script>

<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# 霍尔法则

## 多项式求值问题引入

题目链接：[多项式求值](https://pintia.cn/problem-sets/14/exam/problems/type/6?problemSetProblemId=734&page=0)

对于多项式求值问题，例如多项式:
$$
f(x)=5{{x}^{5}}+4{{x}^{4}}+3{{x}^{3}}+2{{x}^{2}}+x+1
$$
常规的计算方法是每一项单独计算，即先计算$5x^5$，再接着计算$4x^4$，以此类推，最后求和即可，实现代码如下：

```c
//其中n是多项式的阶数，a[]中存储系数，x是给定值。函数返回多项式f(x)的值
double f(int n, double a[], double x)
{
    double ans = 0;
    for (int i = 0; i <= n; i++)
    {
        ans += pow(x, i) * a[i];
    }

    return ans;
}
```

但是，上面的代码存在一些问题；

1. 性能可能较低，特别是在`n`较大时，因为`pow(x, i)`函数通常实现较为复杂，计算代价较高
2. 对于浮点运算，多次调用`pow`可能会引入数值稳定性问题

如果不是调用`pow(x, i)`函数计算，则还需要一层循环来单独计算$x^i$的值，算法的时间复杂度为$O(N^2)$

```c
//其中n是多项式的阶数，a[]中存储系数，x是给定值。函数返回多项式f(x)的值
double f( int n, double a[], double x ) {
    double ans = 0;
    for (int i = 0; i <= n; i++) {
        double temp = 1.0;
        
        for (int j = 0; j < i; j++) {
            temp *= x;
        }
        ans += a[i] * temp;
    }
    return ans;
}
```

所以为了减少多次的计算并且提高计算的准确性，可以考虑使用霍尔法则进行计算。

## 什么是霍尔法则

对于多项式的一般式来说：
$$
f(x)={{x}^{n}}+{{x}^{n-1}}+{{x}^{n-2}}+…+{{x}^{2}}+x+1
$$

可以简化为下面的等式：
$$
f(x)=(…((nx+n-1)x+n-2)+…)+x+1
$$

上面的等式即为霍尔法则

证明如下：

设有$n+1$项的$n$次函数

$f(x) = a_nx^n+a_{n-1}x^{n-1}+a_{n-2}x^{n-2}+......+a_2x^2+a_1x+a_0$

将前$n$项提取公因子$x$，得

$f(x) = (a_nx^{n-1}+a_{n-1}x^{n-2}+a_{n-2}x^{n-3}+......+a_2x+a_1)x+a_0$

再将括号内的前$n-1$项提取公因子$x$，得

$f(x) = ((a_nx^{n-2}+a_{n-1}x^{n-3}+a_{n-2}x^{n-4}+......+a_2)x+a_1)x+a_0$

如此反复提取公因子$x$，最后函数化为

$f(x) = (((a_nx+a_{n-1})x+a_{n-2})x+......+a_1)x+a_0$

令

$f_1 = a_nx+a{n-1}$

$f_2 = f_1x+a{n-2}$

$f_3 = f_2x+a{n-3}$

$......$

$f_n = f_{n-1}x+a_0$

此时$f_n$即为所求

使用霍纳法则可以将上面的多项式转化成下面的形式：
$$
f(x)=((((5x+4)+x+3)+x+2)+x+1)+x+1
$$

所以，使用霍尔算法优化后的代码即为：

```c
//其中n是多项式的阶数，a[]中存储系数，x是给定值。函数返回多项式f(x)的值
double f(int n, double a[], double x)
{
    double ans = a[n];
    for (int i = n - 1; i >= 0; i--)
    {
        ans = ans * x + a[i];
    }
    return ans;
}
```

此时上面的代码时间复杂度只与多项式的阶数有关，而因为多项式的阶数为N，此时算法的时间复杂度即为O(N)