<script defer src="/javascripts/waline.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
<link rel="stylesheet" href="/stylesheets/waline.min.css" />

# 关于EasyExcel

## 依赖引入

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>easyexcel</artifactId>
    <version>4.0.3</version>
</dependency>
```

## 数据准备

```sql
 
```

## 使用EasyExcel进行数据写入（结合SpringBoot实现下载文件）

```java
@RequestMapping("/excel")
public void downloadExcel(HttpServletResponse response) throws IOException {
    List<BillRecord> billRecordList = billRecordService.queryAllData();

    // 设置响应头
    response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
    response.setCharacterEncoding("utf-8");
    String filename = "book-manager-" + new Date() + "-账单明细表";
    // 防止中文乱码
    String fileName = URLEncoder.encode(filename, StandardCharsets.UTF_8).
            replaceAll("\\+", "%20");
    response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName + ".xlsx");
    // 使用 EasyExcel 写入到响应输出流
    EasyExcel.write(response.getOutputStream(), BillRecord.class)
            .sheet("账单明细表")
            .doWrite(billRecordList);
}
public List<BillRecord> queryAllData() {
    return billRecordMapper.selectList(null);
}
@Mapper
public interface BillRecordMapper extends BaseMapper<BillRecord> {
}
```