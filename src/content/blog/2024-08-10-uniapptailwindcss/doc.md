---
title: "如何再Uniapp中使用Tailwindcss"
description: "如何再Uniapp中使用Tailwindcss "
pubDate: "2024-08-10 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-08-10-uniapptailwindcss/01.png"
tags:
  - tailwindcss
  - uniapp 
  - 前端进阶
---

## 先使用npm 安装tailwindcss

```bash
pnpm add tailwindcss
```

## 命令创建 tailwind.config.js 配置文件 并修改

```bash
npx tailwindcss init
```

```js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{vue,js}', './App.vue'],
  theme: {
    extend: {},
  },
  plugins: [],
}

```

### 根目录新建 tailwind-input.css

```css
/* @tailwind base; */
@tailwind components;
@tailwind utilities;
```

### 编写监听指令

编写监听指令，每次启动项目的时候启动，会自动编译你对css所做出的更改

```bash
npx tailwindcss -o ./static/tailwind.css --watch
```

写入到启动命令中，每次输入npm run css 进行启动

```json
 "scripts": {
    "css": "npx tailwindcss -o ./static/tailwind.css --watch"
  }
```
![2](http://img.blog.loli.wang/2024-08-10-uniapptailwindcss/01.png)


## APP.vue中 全局引用我们生成的css 即可

![2](http://img.blog.loli.wang/2024-08-10-uniapptailwindcss/02.png)


## 测试

我们给按钮让它进行向上面加上一个上边距

![2](http://img.blog.loli.wang/2024-08-10-uniapptailwindcss/03.png)

成功