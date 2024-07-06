---
title: "使用 Prisma 配合 Cloudflare D1 构建应用"
description: "使用 Prisma 配合 Cloudflare D1 构建应用"
pubDate: "2024-07-06 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-07-06-cfd1prisma/11.png"
tags:
  - CloudFlare
  - Prisma
  - D1
  - 前端进阶
---

 ## 介绍
 
 Cloudflare Workers 是一种分布在全球范围内的轻量级无服务器计算形式。它们允许您尽可能靠近最终用户部署和运行应用程序 ,

 D1 是 Cloudflare 的原生无服务器数据库。基于 SQLite，可在通过 Cloudflare 部署应用程序时使用

 Prisma  数据库ORM框架。


## 开始前准备

提前建立一个空的前端node项目。

node版本大于18+

![1](http://img.blog.loli.wang/2024-07-06-cfd1prisma/01.png)

## 创建 CloudFlare Worker
 
 在使用cloudFlare D1 之前先需要安装 **Wrangler** 并登录CloudFlare账户,

 ```bash
  #npm 
  npm install wrangler --save-dev 
  #pnpm
  pnpm add wrangler --save-dev 
 ```

 安装好 **Wrangler** 后, 使用指令登录我们的cloudflare账户

 ```bash
 npx wrangler login
 ```


![2](http://img.blog.loli.wang/2024-07-06-cfd1prisma/02.png)


在仪表盘建立我们 worker ，这个我是我目前建立的worker，然后我们在项目文件下编写我们的wrangler的配置文件
![3](http://img.blog.loli.wang/2024-07-06-cfd1prisma/03.png)


创建文件 wrangler.toml

```bash
# wrangler.toml
name = "d1-prisma" ## 指向我们的worker项目名称
main = "src/index.ts" ## 指定启动入口文件
compatibility_date = "2024-07-01"
```

在src/目录下建立个index.ts , 写个测试的demo

```ts

export default {
  async fetch(request) {
    const data = {
      hello: "hello world Mw!",
    };

    return Response.json(data);
  },
};

```

在package.json中编写发布脚本,并启动本地测试和发布到cloudFlare worker中

```json
{
  "dev":"npx wrangler dev",
  "deploy": "npx wrangler deploy"
}
```
可以看到，本地测试是成功的，

![4](http://img.blog.loli.wang/2024-07-06-cfd1prisma/04.png)
![5](http://img.blog.loli.wang/2024-07-06-cfd1prisma/05.png)

发布到worker , 外网也可以正常访问
![6](http://img.blog.loli.wang/2024-07-06-cfd1prisma/06.png)
![7](http://img.blog.loli.wang/2024-07-06-cfd1prisma/07.png)


## 初始化 Prisma ORM

刚刚那一步我们worker已经正常了。现在我们开始初始化ORM工具 

详细看这篇文章 [cloudFlare D1](https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1#what-is-cloudflare-d1)

安装prisma依赖和对d1的支持

```bash
#pnpm
pnpm add prisma --save-dev
pnpm add @prisma/client @prisma/adapter-d1

```

编写 prisma 配置和数据进行测试 ,创建文件 **/prsima/schema.prisma**

```prisma
//  ./schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}


// 测试写的用户表
model User {
  id       Int     @id @default(autoincrement()) // 用户唯一ID
  email    String  @unique // 用户的联系邮箱 
  name     String? // 用户的名称
}
```

使用指令初始化prisma的数据库，初始化成功后会看到本地有db文件

```bash
npx prisma migrate dev --name init
```

建立测试创建和查询sql的测试文件

```ts
// ./prisma/test.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  console.log(users)
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

```ts
// ./prisma/testCreate.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@prisma.io',
    },
  })
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

编写新的指令 方便测试创建和查看数据库数据
```json
{
   "test:select":"npx tsx ./prisma/test.ts",
   "test:create":"npx tsx ./prisma/testCreate.ts"
}
```

![8](http://img.blog.loli.wang/2024-07-06-cfd1prisma/08.png)

创建新数据
![9](http://img.blog.loli.wang/2024-07-06-cfd1prisma/09.png)

查看所有数据
![10](http://img.blog.loli.wang/2024-07-06-cfd1prisma/10.png)

到目前为止我们Prisma简单配置好了。



## 创建D1 数据库

在我们目前例子中都是通过仪表盘创建的worker项目，创建D1我们也通过仪表盘去创建。当然你也可以选择使用cli或者其他方式去创建
![11](http://img.blog.loli.wang/2024-07-06-cfd1prisma/11.png)
![12](http://img.blog.loli.wang/2024-07-06-cfd1prisma/12.png)

创建好D1数据库后，修改 **wrangler.toml**配置文件,对应你自己的D1配置就好。

```bash

[[d1_databases]]
binding = "DB"  
database_name = "prisma_d1"
database_id = "你自己的D1的id"

```
![13](http://img.blog.loli.wang/2024-07-06-cfd1prisma/13.png)


编写生成迁移文件指令和diff指令到package.json

```json
{
  "transfer":"npx wrangler d1 migrations create prisma_d1 create_user_table",
    "diff": "npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script > migrations/0001_create_user_table.sql",
}
```
执行后会生成 迁移文件的配置和sql文件
![14](http://img.blog.loli.wang/2024-07-06-cfd1prisma/14.png)
![15](http://img.blog.loli.wang/2024-07-06-cfd1prisma/15.png)

新增迁移指令进行迁移，然后开始迁移

```json
{
    "apply:local":"npx wrangler d1 migrations apply prisma_d1 --local",
    "apply:remote":"npx wrangler d1 migrations apply prisma_d1 --remote"
}
```
可以看到我们迁移成功了。去仪表盘看看D1上有没有相关的表文件。是正常和成功的

![16](http://img.blog.loli.wang/2024-07-06-cfd1prisma/16.png)
![16](http://img.blog.loli.wang/2024-07-06-cfd1prisma/17.png)


## 修改index.ts 文件，查询D1数据库内的数据，进行收尾

打开 src/index.ts 并将整个内容替换为以下内容：

```ts
// src/index.ts
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const adapter = new PrismaD1(env.DB);

    const prisma = new PrismaClient({ adapter });

    const users = await prisma.user.findMany();

    const result = JSON.stringify(users);
    return new Response(result);
  },
};

```

重新发布到 Worker 

```bash
pnpm run deploy
```

发布成功后我们去D1仪表盘，随意新增任意条数据作为测试。

![18](http://img.blog.loli.wang/2024-07-06-cfd1prisma/18.png)


访问外网测试地址，看看是否能打印我们从D1数据库中查询出来的全部User数据

![19](http://img.blog.loli.wang/2024-07-06-cfd1prisma/19.png)


测试成功，搭建应用完成

## 心得

无服务器应用远远不止这点应用那么简单，他还有很多可以搭配的方案，我只是写了个小的demo

大晚上写的。累死了，应该没有质量可言把

## 相关文档

[完整Demo](https://github.com/itmowang/prisma-D1-demo)

[prisma 官方完整示例 ](https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-cloudflare#cloudflare-d1)

[prisma 官方D1介绍](https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1)

[D1 文档](https://developers.cloudflare.com/d1/get-started/)

[Workers 文档](https://developers.cloudflare.com/workers/)