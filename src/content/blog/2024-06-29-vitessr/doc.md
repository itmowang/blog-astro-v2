---
title: "Vite 搭建 SSR 进行服务器渲染"
description: "Vite 搭建 SSR 进行服务器渲染"
pubDate: "2024-06-29 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-06-29-vitessr/01.png"
tags:
  - Vite SSR
  - SSR
  - 前端进阶
---

### 为什么要使用 SSR

GPT 回复

更快的首屏加载时间：SSR 将初始 HTML 页面在服务器上生成并发送给客户端，从而使用户在请求页面时无需等待 JavaScript 的加载和执行即可看到页面内容。这种方式可以显著提升首屏加载时间和用户体验。

更好的 SEO：搜索引擎蜘蛛能够更容易地抓取和索引由 SSR 生成的页面内容，从而提高网站在搜索引擎中的排名。这对于内容驱动的网站（如博客、新闻网站等）尤为重要。

便于预渲染静态页面：对于不经常变化的页面内容，SSR 可以预渲染并缓存生成的静态页面，从而减少服务器的负载和请求处理时间。

说白了 ，更快的加载速度 不用向 spa 项目一样进行首次进去加载比较久, seo 友好，并且可以预渲染

### 起步工作

安装

```bash
# 安装vue
pnpm add vue
# 安装vite 和 vitejs支持vue的插件
pnpm add vite @vitejs/plugin-vue -D
# 安装服务端插件
pnpm add express
```

创建 vite 配置文件 vite.config.ts

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
});
```

创建 src 目录，建立 App.vue 和 main.ts 目录

```jsx
// main.ts
import { createSSRApp } from "vue";
import App from "./App.vue";

export function createApp() {
  const app = createSSRApp(App);
  return { app };
}
```

```jsx
// App.vue
<template>
  <div>
   <h1>Vite SSR</h1>
  </div>
</template>

<style scoped>

</style>
```

创建 entry-client.ts 和 entry-server.ts 文件， 并且将 index.html 连接至 entry-client.ts

```html
<!-- index.html -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue</title>
    <!--app-head-->
  </head>
  <body>
    <div id="app"><!--app-html--></div>
    <script type="module" src="/src/entry-client.ts"></script>
  </body>
</html>
```

编写客户端入口和服务端入口

```jsx
// entry-client.ts
import { createApp } from "./main";

const { app } = createApp();

app.mount("#app");
```

```ts
// entry-server.ts
import { renderToString } from "vue/server-renderer";
import { createApp } from "./main";

export async function render() {
  const { app } = createApp();

  const ctx = {};
  const html = await renderToString(app, ctx);

  return { html };
}
```


![2](http://img.blog.loli.wang/2024-06-29-vitessr/02.png)
![3](http://img.blog.loli.wang/2024-06-29-vitessr/03.png)



编写编译客户端编译指令 和 服务端编译指令

package.json

```json
{
  "scripts": {
    "build": "pnpm build:client && pnpm build:server",
    "build:client": "vite build --ssrManifest --outDir dist/client",
    "build:server": "vite build --ssr src/entry-server.ts --outDir dist/server"
  }
}
```

执行 pnpm build 命令 , 构建客户端和服务端查看结果

![4](http://img.blog.loli.wang/2024-06-29-vitessr/04.png)

可以看到分别构建了 SSR的客户端和服务端


```bash
# 安装 压缩插件 和 静态资源插件
pnpm add sirv compression
```

编写server.ts 启动服务,完成开发环境场景

```jsx
import express from 'express';
import fs from 'node:fs/promises'


// 区分开发环境和生产环境
const isProd = process.env.NODE_ENV === 'production';

// 根路径
const base = process.env.BASE || '/'

// 启动端口
const port = 3000

// 读取客户端模板
const templateHtml = isProd ? await fs.readFile('./dist//index.html', 'utf-8') : "";

// 读取ssr资源
const ssrManifest = isProd ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', undefined) : undefined;


// 创建http服务
const app = express();

let vite

// 如果不是生产环境，启动vite  , 如果不是启动express中间件
if (!isProd) {
    const { createServer } = await import('vite')

    vite = await createServer({
        server: {
            middlewareMode: true
        },
        appType: 'custom',
        base
    })

    app.use(vite.middlewares)
} else {
    const compression = (await import('compression')).default;
    const sirv = (await import('sirv')).default;

    app.use(compression());
    app.use(base, sirv('./dist/client', { extensions: [] }))

}

// 服务端拦截，并且使用占位符去渲染页面
app.use('*', async (req, res) => {
    try {
        const url = req.originalUrl.replace(base, '/')

        let template
        let render

        if (!isProd) {
            // 如果是开发环境
            template = await fs.readFile('./index.html', 'utf-8')
            template = await vite.transformIndexHtml(url, template)
            render = (await vite.ssrLoadModule('/src/entry-server.ts')).render
        } else {
            // 如果是生产
            template = templateHtml;
            render = (await import('./dist/server/entry-server'))
        }

        const rendered = await render(url, ssrManifest);

        // 占位符替换渲染
        const html = template
            .replace(`<!--app-head-->`, rendered.head ?? '')
            .replace(`<!--app-html-->`, rendered.html ?? '')

        res.status(200).set({ 'Content-Type': 'text/html' }).send(html)

    } catch (e) {
        vite?.ssrFixStacktrace(e)
        console.log(e.stack)
        res.status(500).end(e.stack)
    }
})

// 启动服务
app.listen(port, () => {
    console.log(`SSR项目已经启动 http://localhost:${port}`)
})

```


编写启动指令,因为我们是ts语言, 我们使用antfu大佬写的'tsx'轮子来启动

```bash 
pnpm add tsx -D
```

修改命令

```json
"scripts": {
    "dev":"tsx server",
    "build": "pnpm build:client && pnpm build:server",
    "build:client": "vite build --ssrManifest --outDir dist/client",
    "build:server": "vite build --ssr src/entry-server.ts --outDir dist/server"
},
```

可以看到我们已经启动成功了,页面渲染也正常 ，成功！


![5](http://img.blog.loli.wang/2024-06-29-vitessr/05.png)

![6](http://img.blog.loli.wang/2024-06-29-vitessr/06.png)


### 相关资料

编写的测试模板存放地址：https://github.com/itmowang/vite-vue-ssr-template.git