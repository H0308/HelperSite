# Java中的`BitSet`类

## `BitSet` 基本概念

`BitSet`是Java标准库中实现位图数据结构的类，位于`java.util.BitSet`包中。它用位（bit）来表示布尔值的集合，每个位可以是0（`false`）或1（`true`）。

在Java中，`BitSet`默认不是固定大小的，会根据需要自动扩容，初始容量为64位，但可以根据设置的位索引自动增长
。其内部使用`long[]`数组存储，每个`long`包含64位

`BitSet`类支持的索引范围：0到`Integer.MAX_VALUE` - 1，未设置的位默认为`false`（0）

## 构造方法

1. 无参构造：创建一个空的`BitSet`，初始容量为64位
2. 有参构造：可以指定初始容量，创建一个空的`BitSet`，初始容量为指定的位长度

例如下面的代码：

```java
// 创建默认大小的BitSet（64位）
BitSet bs1 = new BitSet();

// 创建指定初始大小的BitSet
BitSet bs2 = new BitSet(100);
```

## 常用方法

1. `set(int bitIndex)`：将指定索引的位设置为`true`
2. `set(int bitIndex, boolean value)`：将指定索引的位设置为指定的值
3. `clear(int bitIndex)`：将指定索引的位设置为`false`
4. `get(int bitIndex)`：获取指定索引的位状态
5. `size()`：返回当前`BitSet`的大小（即已设置的位的最大索引加1）
6. `isEmpty()`：检查`BitSet`是否为空（即所有位均为`false`）
7. `clear()`：清除`BitSet`中的所有位，将所有位设置为`false`
8. `flip(int bitIndex)`：翻转指定索引的位状态（0变1，1变0）
9. `flip(int fromIndex, int toIndex)`：翻转指定范围内的所有位状态

例如下面的代码：

```java
public class Test {
    public static void main(String[] args) {
        BitSet bs = new BitSet();

        // 设置位
        bs.set(5);           // 将索引5的位设为true
        bs.set(10, true);    // 显式设置索引10为true
        bs.set(15, false);   // 显式设置索引15为false
        // 获取位状态
        boolean bit5 = bs.get(5);  // 获取索引5的位状态

        System.out.println(bit5); // true
        System.out.println(bs.get(10)); // true
        System.out.println(bs.get(15)); // false

        // 清除位
        bs.clear(5);         // 将索引5的位设为false
        bs.clear();          // 清除所有位

        // 翻转位
        bs.flip(5);          // 翻转索引5的位状态
        System.out.println(bit5); // false
        bs.flip(0, 10);      // 翻转索引0到9的所有位

        for (int i = 0; i < 10; i++) {
            System.out.print(bs.get(i) + " ");
            // true true true true true false true true true true
        }

        // 设置范围内的位
        bs.set(5, 15);       // 设置索引5到14的位为true
        bs.set(20, 30, false); // 设置索引20到29的位为false

        // 清除范围内的位
        bs.clear(5, 15);     // 清除索引5到14的位

        // 获取范围内的BitSet
        BitSet subset = bs.get(5, 15);  // 获取索引5到14的子BitSet
    }
}
```

## 位运算操作

```java
BitSet bs1 = new BitSet();
BitSet bs2 = new BitSet();

bs1.set(1);
bs1.set(3);
bs1.set(5);

bs2.set(3);
bs2.set(5);
bs2.set(7);

// 按位与（交集）
bs1.and(bs2);        // bs1 = bs1 & bs2

// 按位或（并集）
bs1.or(bs2);         // bs1 = bs1 | bs2

// 按位异或
bs1.xor(bs2);        // bs1 = bs1 ^ bs2

// 按位与非（差集）
bs1.andNot(bs2);     // bs1 = bs1 & (~bs2)
```

## 查询和统计方法

```java
BitSet bs = new BitSet();
bs.set(1);
bs.set(5);
bs.set(10);

// 统计设置为true的位数
int count = bs.cardinality();  // 返回3

// 检查是否为空
boolean empty = bs.isEmpty();   // 返回false

// 获取BitSet的逻辑大小
int length = bs.length();      // 返回最高位索引+1

// 获取BitSet的实际大小
int size = bs.size();          // 返回实际分配的位数

// 查找下一个设置的位
int next = bs.nextSetBit(0);   // 从索引0开始查找下一个true位
int prev = bs.previousSetBit(10); // 从索引10开始查找前一个true位

// 查找下一个清除的位
int nextClear = bs.nextClearBit(0); // 从索引0开始查找下一个false位
```

## 集合操作相关方法

```java
BitSet bs1 = new BitSet();
BitSet bs2 = new BitSet();

// 检查是否有交集
boolean hasIntersection = bs1.intersects(bs2);

// 克隆
BitSet copy = (BitSet) bs1.clone();

// 转换为字节数组
byte[] bytes = bs1.toByteArray();

// 从字节数组创建BitSet
BitSet fromBytes = BitSet.valueOf(bytes);

// 转换为long数组
long[] longs = bs1.toLongArray();

// 从long数组创建BitSet
BitSet fromLongs = BitSet.valueOf(longs);
```

## 注意事项

1. 线程安全问题：`BitSet`不是线程安全的，多线程环境需要外部同步
2. 不实现`Collection`接口：`BitSet`不是标准的集合类，不能直接用于需要`Collection`的场景
3. 索引限制：只支持非负整数索引
4. 自动扩容：设置较大索引会导致内部数组扩容，可能影响性能