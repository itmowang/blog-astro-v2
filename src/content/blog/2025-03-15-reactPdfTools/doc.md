---
title: "React 插件推荐 《React-pdf》 浏览器动态渲染PDF"
description: "React 插件推荐 《React-pdf》 浏览器动态渲染PDF"
pubDate: "2025-03-15 23:27:24"
heroImage: "http://img.blog.loli.wang/2025-03-15-reactPdfTools/01.png"
tags:
  - 前端进阶
  - 操作
---

## 为什么推荐

最近工作上总是有让我很头疼的问题，需要让我显示一个报表单，并且还可以下载成为 PDF。简单来说，就是要实现在线预览和下载功能。正好以前看到过 `react-pdf` 这个插件，这次正好用上了。

前端生成 PDF 并且能动态渲染的插件其实非常少见。像 `canvas + html2pdf` 这种方式，生成的其实是图片格式的 PDF，无法编辑，且存在像素模糊的问题。而 `react-pdf` 可以真正地渲染出可编辑的 PDF 文件。

## 插件介绍

官网 ： [react-pdf](https://react-pdf.org/)

`react-pdf` 允许我们使用 React 组件的方式来构建 PDF 文档。它基于 `@react-pdf/renderer` 库，可以直接在浏览器端生成 PDF，并支持动态内容更新。

## 插件安装

```bash
# npm
npm install @react-pdf/renderer --save

# yarn
yarn add @react-pdf/renderer

# pnpm
pnpm add @react-pdf/renderer

# bun
bun install @react-pdf/renderer
```

## 基本使用

首先，我们需要引入 `react-pdf` 提供的核心组件：

```tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, PDFViewer, Font } from "@react-pdf/renderer";

// @ts-ignore
import MK from '@/assets/font/MK.ttf';

// Register font
Font.register({ family: 'pinru', src: MK });

const data = [
  { id: 1, name: '张三', age: 20, score: 85 },
  { id: 2, name: '李四', age: 22, score: 90 },
  { id: 2, name: '李四', age: 22, score: 90 },
  { id: 2, name: '李四', age: 22, score: 90 },
  { id: 2, name: '李四', age: 22, score: 90 },
  { id: 2, name: '李四', age: 22, score: 90 },
];

// 定义样式
const styles = StyleSheet.create({
  page: {
    fontFamily: 'pinru',
    fontSize: 10,
    padding: 20,
    lineHeight: 2,
  },
  header: { textAlign: 'center', fontSize: 18, marginBottom: 10 },
  table: { display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#000' },
  tableRow: { flexDirection: 'row' },
  tableColHeader: { width: '25%', borderStyle: 'solid', borderWidth: 1, backgroundColor: '#eee', padding: 5, textAlign: 'center' },
  tableCol: { width: '25%', borderStyle: 'solid', borderWidth: 1, padding: 5, textAlign: 'center' },
});
const MyDocument = () => (
  <PDFViewer width="100%" height="100%">
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>报表单</Text>
        <View style={styles.table}>
          {/* 表头 */}
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>ID</Text>
            <Text style={styles.tableColHeader}>姓名</Text>
            <Text style={styles.tableColHeader}>年龄</Text>
            <Text style={styles.tableColHeader}>成绩</Text>
          </View>
          {/* 数据行 */}
          {data.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCol}>{item.id}</Text>
              <Text style={styles.tableCol}>{item.name}</Text>
              <Text style={styles.tableCol}>{item.age}</Text>
              <Text style={styles.tableCol}>{item.score}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  </PDFViewer>
);

const App = () => (
  <div className="h-screen w-screen">
    <h2>React PDF 示例</h2>
    <MyDocument />
  </div>
);

export default App;
```

## 演示效果

![0](http://img.blog.loli.wang/2025-03-15-reactPdfTools/01.png)

## 代码解析

1. `Document`：表示 PDF 文档的根组件。
2. `Page`：定义 PDF 的页面，可以包含多个 `Page`。
3. `Text`：用于添加文本内容。
4. `View`：类似于 `div`，用于布局。
5. `StyleSheet.create`：用于定义 PDF 组件的样式。
6. `PDFDownloadLink`：提供 PDF 下载功能。

## 进阶使用

### 1. 生成多页 PDF

如果需要创建多页 PDF，可以这样实现：

```tsx
const MultiPageDocument = () => (
  <Document>
    {[1, 2, 3].map((pageNum) => (
      <Page key={pageNum} size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>第 {pageNum} 页</Text>
        </View>
      </Page>
    ))}
  </Document>
);
```

### 2. 在页面中直接渲染 PDF 预览

`react-pdf` 还提供了 `PDFViewer` 组件，可以直接在页面中预览 PDF：

```tsx
import { PDFViewer } from "@react-pdf/renderer";

const PDFPreview = () => (
  <PDFViewer width="100%" height="500px">
    <MyDocument />
  </PDFViewer>
);
```

### 3. 处理复杂的报表

对于包含表格的 PDF，可以使用 `react-pdf-table` 或者手动布局：

```tsx
<View style={{ flexDirection: "row", borderBottom: "1pt solid #000" }}>
  <Text style={{ flex: 1 }}>列 1</Text>
  <Text style={{ flex: 1 }}>列 2</Text>
  <Text style={{ flex: 1 }}>列 3</Text>
</View>
```

## 总结

`react-pdf` 是一个非常强大的 PDF 生成工具，可以帮助前端开发者以组件化的方式构建 PDF 文档。它解决了传统 `html2canvas` 方式存在的模糊问题，并提供了丰富的自定义能力。

适用于：
- 动态生成 PDF 文档
- 在线预览和下载
- 生成多页 PDF
- 复杂的表格、报表



