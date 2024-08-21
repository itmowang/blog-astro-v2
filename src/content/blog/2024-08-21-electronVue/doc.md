---
title: "electron + Vue 搭建第一个桌面端应用"
description: "electron + Vue 搭建第一个桌面端应用"
pubDate: "2024-08-21 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-08-21-electronVue/06.png"
tags:
  - electron
  - Vue
  - 前端进阶
---

## 搭建环境

```bash
# 推荐使用yarn
npm i -g yarn

# 创建工作目录
mkdir electron-vue
cd electron-vue
yarn init

```

修改`package.json`文件

```json
{
  "name": "electron-vue",
  "version": "1.0.0",
  "description": "Hello World!",
  "main": "main.js",
  "author": "Mowang",
  "license": "MIT"
}
```

安装依赖

```bash
# 提前切换成淘宝源
npm config set registry https://registry.npmmirror.com/
# 安装electron 网络原因会无法下载，更换源
yarn config set electron_mirror 'https://npmmirror.com/mirrors/electron/'
# 安装electron
yarn add --dev electron

```

修改 `package.json` 文件,增加启动脚本

```json
{
  "name": "electron-vue",
  "version": "1.0.0",
  "description": "Hello World!",
  "main": "main.js",
  "author": "Mowang",
  "license": "MIT",
  "scripts": {
    "start": "electron ."
  }
}
```

创建 `main.js` 文件

写入

```js
const { app, BrowserWindow } = require("electron/main");
const path = require("node:path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
```

创建 `index.html` 文件

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello World!</title>
    <meta
      http-equiv="Content-Security-Policy"
      content="script-src 'self' 'unsafe-inline';"
    />
  </head>
  <body>
    <h1>Hello World!</h1>
    <p>
      We are using Node.js <span id="node-version"></span>, Chromium
      <span id="chrome-version"></span>, and Electron
      <span id="electron-version"></span>.
    </p>
  </body>
</html>
```

创建 `preload.js` 文件

```js
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
```

![1](http://img.blog.loli.wang/2024-08-21-electronVue/01.png)

运行项目进行启动测试

```bash
yarn start
```

测试成功

![2](http://img.blog.loli.wang/2024-08-21-electronVue/02.png)



## 创建Vue项目

```bash
yarn add vue
yarn add vue-router
yarn add vue-tsc -D
yarn add vite -D
yarn add typescript -D
yarn add @vitejs/plugin-vue

npx tsc --init
```

修改`package.json`文件, 修改 `scripts` 脚本

```json
{
  "scripts": {
    "start": "electron .",
    "dev": "vite",
    "build": "vite build"
  }
}
``` 

修改原有 `index.html` 文件

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
    <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';" />
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

创建 `src/main.ts` 文件
```ts
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.mount('#root');
```

创建 `vite.config.ts` 文件
```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
});
```

建立 `src/App.vue` 文件

```html

<template>
  <div id="app">
    {{msg}}
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
    };
  },
};
</script>

<style>
</style>
```

进行`web`启动的测试  `yarn dev` 能够正常启动vue项目

![3](http://img.blog.loli.wang/2024-08-21-electronVue/03.png)

![4](http://img.blog.loli.wang/2024-08-21-electronVue/04.png)


## 安装其他依赖 让electron支持vite打包出来的代码

```bash
yarn add vite-plugin-electron -D
yarn add vite-plugin-electron-renderer -D
```

在`vite.config.ts`文件中添加如下配置
```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from 'vite-plugin-electron/simple'


export default defineConfig({
  plugins: [vue(),electron({
    main: {
      entry: './main.js',
    },
    preload: {
      input: './preload.js',
    },
    renderer: {},
  })],
});
```

修改 electron 的 `main.js` 文件

```js
const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

// app.whenReady().then(() => {
//   createWindow()

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow()
//     }
//   })
// })

app.whenReady().then(() => {
    const win = new BrowserWindow({
        title: 'Main window',
    })

    // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        // Load your file
        win.loadFile('dist/index.html');
    }
})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
```

修改 `package.json` 中 `main `的指向改为 `dist-electron/main.js`

```json
{
  "main": "dist-electron/main.js"
}
```


![5](http://img.blog.loli.wang/2024-08-21-electronVue/05.png)


修改运行指令

```json
 "scripts": {
    "start": "electron .",
    "dev": "vite",
    "dev:win":"vite build  && electron .",
    "build": "vite build"
  },
```

运行 `yarn dev:win` 测试

![6](http://img.blog.loli.wang/2024-08-21-electronVue/06.png)


## 添加electron-builder打包
(这个应该没上面好说的 比较简单)
