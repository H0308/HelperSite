

# 最大公因数和最小公倍数

## 介绍

最大公因数（英语：highest common factor，hcf），也称最大公约数（英语：greatest common divisor，gcd）是数学词汇，指能够整除多个非零整数的最大正整数。例如8和12的最大公因数为4。最大公因数的值至少为1，例如$gcd(3,7)=1$。如果在计算最大公因数时，两个数中有一方为0，则对于0和任何非零整数$m$，最大公因数被定义为m，即：

- 如果 $a ≠ 0$ 且 $b = 0$，则$gcd(a, 0) = |a|$
- 如果 $a = 0$ 且 $b ≠ 0$，则$gcd(0,b)=|b|$
- 如果 $a = 0$ 且 $b = 0$，则没有定义最大公因数（在这种情况下，通常认为GCD为0是没有意义的，因为所有整数都是0的因数）。

若有一个数$x$，可以被另外两个数$A$、$B$整除，且$x$同时大于或等于$A$和$B$，则$x$为$A$和$B$的公倍数。$A$和$B$的公倍数有无限个，而所有正的公倍数中，最小的公倍数就叫做最小公倍数，即为$lcm(A, B)$

## 最大公因数和最小公倍数的关系

最小公倍数$lcm(a,b) \times gcd(a,b) = |a \times b|$

## 获取最大公因数和最小公倍数

在计算机科学中，最高效的获取最大公因数的算法是：辗转相除法

辗转相除法（也称为欧几里得算法）是一种用于寻找两个正整数最大公因数的经典算法。其基本思想是利用较大数除以较小数，再用较小数去除上面得到的余数，如此循环直到余数为零为止。最后的非零除数就是两数的最大公因数。

具体步骤如下：

1. **确定两个数**：给定两个正整数`a`和`b`
2. **执行除法**：将`a`除以`b`，并得到一个商`q`和一个余数`r`
3. **检查余数**：
    - 如果`r`为0，则`b`是最大公因数
    - 如果`r`不为0，则将`b`赋值给`a`，将`r`赋值给`b`，并重复步骤2
4. **重复上述过程**：继续进行，直到某一步骤中的余数为`b`

!!! note
    在上面的过程中，可以不需要判断`a`和`b`哪个更大，如果`a`小于`b`，在第一次计算时`r`的值依旧是`b`中的值，在接下来的赋值过程中`a`和`b`的值就会进行交换，同样可以获得正确的结果。如果为了在某些特殊情况下少执行一次循环，可以在计算前判断两个数的大小，保证$a \ge b$

获取最大公因数代码循环如下：

=== "C"
    ```c
    int gcd(int a, int b)
    {
        // 保证a >= b，减少一次循环
        if (a < b)
        {
            a = a ^ b;
            b = a ^ b;
            a = a ^ b;
        }

        // 有一方为0，直接返回另一方
        if (b == 0)
            return a;

        // 求商
        int q = a / b;
        // 求余
        int r = a % b;

        // 辗转相除法
        while (r)
        {
            a = b;
            b = r;
            q = a / b;
            r = a % b;
        }

        return b;
    }
    ```

=== "C++"

    ```c++
    int gcd(int a, int b)
    {
        // 保证a >= b，减少一次循环
        if (a < b)
            swap(a, b);

        // 有一方为0，直接返回另一方
        if (b == 0)
            return a;

        // 求商
        int q = a / b;
        // 求余
        int r = a % b;

        // 辗转相除法
        while (r)
        {
            a = b;
            b = r;
            q = a / b;
            r = a % b;
        }

        return b;
    }
    ```

=== "Java"

    ```java
    public static int gcd(int a, int b) {
        // 保证a >= b，减少一次循环
        if (a < b) {
            a = a ^ b;
            b = a ^ b;
            a = a ^ b;
        }

        // 有一方为0，直接返回另一方
        if (b == 0)
            return a;

        // 求商
        int q = a / b;
        // 求余
        int r = a % b;

        // 辗转相除法
        while (r > 0) {
            a = b;
            b = r;
            q = a / b;
            r = a % b;
        }

        return b;
    }
    ```

获取最大公因数递归代码：

=== "C"
    ```C
    int gcd(int a, int b)
    {
        if (b == 0)
            return a;
        return gcd(b, a % b);
    }
    ```

=== "C++"

    ```C++
    int gcd(int a, int b)
    {
        if (b == 0)
            return a;
        return gcd(b, a % b);
    }
    ```

=== "Java"

    ```java
    public static int gcd(int a, int b) {
        if (b == 0) {
            return a;
        }
        return gcd(b, a % b);
    }
    ```

## 根据最大公因数求最大公倍数

根据二者关系可以写出以下代码：

=== "C"
    ```C
    int lcm(int a, int b)
    {
        return a * b / gcd(a, b);
    }
    ```

=== "C++"

    ```C++
    int lcm(int a, int b)
    {
        return a * b / gcd(a, b);
    }
    ```

=== "Java"

    ```Java
    public static int lcm(int a, int b)
    {
        return a * b / gcd(a, b);
    }
    ```

