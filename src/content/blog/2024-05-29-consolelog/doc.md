---
title: "好玩的console - 水一篇"
description: "奇妙的console - 水一篇"
pubDate: "2024-05-29 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-05-27-webUpload/01.png"
tags:
    - 好玩的console
    - 跨域解决
    - 前端进阶
---


## console.log

常规的打印

```jsx
console.log("魔王");
```

![1](http://img.blog.loli.wang/2024-05-29-consolelog/01.png)

## console.warm

警告的打印

```jsx
console.warn("魔王");
```

![2](http://img.blog.loli.wang/2024-05-29-consolelog/02.png)


## console.error

错误的打印


```jsx
console.error("魔王");
```


![3](http://img.blog.loli.wang/2024-05-29-consolelog/03.png)


## console.dir

输出对象

```jsx
 const obj = { name: "魔王", age: 999 };
 console.dir(obj);
```

![4](http://img.blog.loli.wang/2024-05-29-consolelog/04.png)


## console.clear()

清空控制台

```jsx
console.clear();
```

![5](http://img.blog.loli.wang/2024-05-29-consolelog/05.png)


## console.table

以表格的形式输出对象或者数组

```jsx
const test = ["Apple", "Banana", "Orange"];
    const test1 = {
      name: "mowang",
      age: 999,
    };
    console.table(test);
    console.table(test1);
```

![6](http://img.blog.loli.wang/2024-05-29-consolelog/06.png)


## console.assert()

用于条件不满足的时候输出信息


```jsx
console.assert(2 + 2 === 5, "2+2不等于5");
```

![7](http://img.blog.loli.wang/2024-05-29-consolelog/07.png)

