# JSON在Java后端的应用

## 本篇介绍

在[JavaScript内建对象部分](https://www.help-doc.top/javascript-lang/js-built-in-object/js-built-in-object.html#json)已经介绍过什么是JSON对象以及JSON的相关格式要求，本篇文档不涉及到写一个JSON字符串，只是介绍如何在后端实现JSON字符串和Java对象的相互转换

## Java对象转换为JSON字符串

在Java中，可以使用一个第三方工具包Jackson将Java对象转换为JSON对象，假设现在有一个类如下（注意使用了Lombok）：

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
class Person {
    private String name;
    private Integer age;
    private String gender;

}
```

如果需要将这个类转换为JSON字符串，首先需要使用到Jackson工具包，[官网地址](https://github.com/FasterXML/jackson)，因为是`jar`包，所以需要前面提到的操作将其添加到项目或者模块中

接下来就是用这个库：

1. 创建`ObjectMapper`对象
2. 通过`ObjectMapper`对象调用其`writeValueAsString`方法将指定对象作为参数转换为JSON字符串

例如下面的代码：

```java
@Test
// 将对象转换成JSON字符串
public void testWriteJSON() throws JsonProcessingException {
    Person person = new Person("zhangsan", 18, "male");
    ObjectMapper objectMapper = new ObjectMapper();
    String personStr = objectMapper.writeValueAsString(person);
    System.out.println(personStr);
}
```

## JSON字符串转换为Java对象

步骤如下：

1. 创建`ObjectMapper`对象
2. 通过`ObjectMapper`对象调用其`readValue`方法，第一个参数传递JSON字符串，第二个参数传递目标类的字节码

例如下面的代码：

```java
@Test
// 将JSON字符串转换为指定类对象
public void testReadJSON() throws JsonProcessingException {
    String personStr = "{\"name\":\"zhangsan\",\"age\":18,\"gender\":\"male\"}";
    ObjectMapper objectMapper = new ObjectMapper();
    Person person = objectMapper.readValue(personStr, Person.class);
    System.out.println(person);
}
```

## Java集合转JSON字符串

因为步骤和上面一致，下面仅提供演示代码

=== "Map对象转JSON字符串"

    ```java
    @Test
    // Map转JSON
    public void testMapToJSON() throws JsonProcessingException {
        HashMap<String, String> map = new HashMap<>();
        map.put("a", "A");
        map.put("b", "B");

        ObjectMapper objectMapper = new ObjectMapper();
        String s = objectMapper.writeValueAsString(map);
        System.out.println(s);
    }
    ```

=== "序列集合或者Java数组转JSON字符串"

    ```java
    @Test
    // List与数组转JSON
    public void testListToJSON() throws JsonProcessingException {
        List<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);

        ObjectMapper objectMapper = new ObjectMapper();
        String s = objectMapper.writeValueAsString(list);
        System.out.println(s);

        // 集合中存储类对象
        Person person = new Person("lisi", 18, "male");
        ArrayList<Person> people = new ArrayList<>();
        people.add(person);

        ObjectMapper objectMapper1 = new ObjectMapper();
        String s1 = objectMapper1.writeValueAsString(people);
        System.out.println(s1);
    }
    ```

## JSON字符串转Java集合

因为步骤和上面一致，下面仅提供演示代码

=== "JSON字符串转Map"

    ```java
    @Test
    public void testJSONToMap() throws JsonProcessingException {
        String jsonObject = "{\"key1\":\"value1\", \"key2\":\"value2\"}";
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> map = objectMapper.readValue(jsonObject, Map.class);
        System.out.println(map);
    }
    ```

=== "JSON字符串转List"

    ```java
    @Test
    public void testJSONToList() throws JsonProcessingException {
        String jsonArray = "[\"one\", \"two\", \"three\"]";
        ObjectMapper objectMapper = new ObjectMapper();
        List<String> list = objectMapper.readValue(jsonArray, List.class);
        System.out.println(list);
    }
    ```