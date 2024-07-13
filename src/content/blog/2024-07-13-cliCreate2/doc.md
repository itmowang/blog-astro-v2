---
title: "重写自己脚手架工具之旅"
description: "重写自己脚手架工具之旅"
pubDate: "2024-07-14 23:27:25"
heroImage: "http://img.blog.loli.wang/2024-07-13-cliCreate2x/01.png"
tags:
  - MW-create
  - ts
  - 前端进阶
---

回首往昔，无趣的过往。没有任何精彩的事情发生，只有空的躯壳像NPC一样再运作。上一次写我的脚手架工具已经是一年前了，当时很多不成熟的思维也慢慢得到了改正，所以决定重新写一份了，毕竟每年都要好好的检查下自己嘛

## 必备项目依赖

-- kolorist 控制台命令行操控颜色的脚本库
-- minimist 参数解析器 类似 mw create --template 这种
-- prompts 一个提示用户选择的库
-- unbuild 构建工具



## 开始编写

安装我们所需要使用到的依赖

```bash
pnpm add kolorist minimist prompts unbuild typescript -D
```

初始化**tsconfig.json**

```json

{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2020",
    "outDir": "lib",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "declaration": false,
    "sourceMap": false,
    "noUnusedLocals": true,
    "esModuleInterop": true
  },
  "exclude": ["template", "lib"]
}


```

整理合理的项目目录
![1](http://img.blog.loli.wang/2024-07-13-cliCreate2/01.png)


编写 unbuild 的配置文件

```ts
// build.config.ts

import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    "./src/index",
  ],
  outDir: "lib",
  declaration: true,
});

```

修改package.json 修改Bin软链接指令，编写unbuild的本地打包测试指令

```json
{
  "name": "create-mw",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "npx  unbuild --stub"
  },
  "bin": {
    "cre":"index.js"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "engines": {
    "node": "^18.0.0 || >=20.0.0"
  },
  "devDependencies": {
    "@types/minimist": "^1.2.5",
    "@types/node": "^20.14.10",
    "kolorist": "^1.8.0",
    "minimist": "^1.2.8",
    "prompts": "^2.4.2",
    "tsx": "^4.16.2",
    "typescript": "^5.5.3",
    "unbuild": "^2.0.0"
  }
}
```

修改**index.js** 入口文件代码让他指向我们打包出来的js文件
```jsx
#!/usr/bin/env node

import './lib/index.mjs'
```


打包后，**npm link** 后测试下是否正常，执行命令cre 看看是否正常

![2](http://img.blog.loli.wang/2024-07-13-cliCreate2/02.png)


然后我们使用**minimist** 来进行一个参数解析。 解析后让他成为能够获取 cre --template 获取这种在命令里的参数

```ts
// 参数解析器
const argv = minimist(process.argv.slice(2), {})

console.log(argv);

```

![2](http://img.blog.loli.wang/2024-07-13-cliCreate2/04.png)
![2](http://img.blog.loli.wang/2024-07-13-cliCreate2/03.png)

```jsx
import minimist from "minimist";
import prompts from "prompts";
import {
  blue,
  cyan,
  green,
  lightBlue,
  lightGreen,
  lightRed,
  magenta,
  red,
  reset,
  yellow,
} from "kolorist";

// 参数解析器 方便解析我们需要的
const argv = minimist(process.argv.slice(2), {});

console.log(argv);

//  获取项目路径
const cwd = process.cwd();

console.log(cwd);

// prettier-ignore
const helpMessage = `\
Usage: create-vite [OPTION]... [DIRECTORY]

Create a new Vite project in JavaScript or TypeScript.
With no arguments, start the CLI in interactive mode.

Options:
  -t, --template NAME        use a specific template

Available templates:
${yellow   ('vanilla-ts     vanilla'  )}
${green    ('vue-ts         vue'      )}
${cyan     ('react-ts       react'    )}
${cyan     ('react-swc-ts   react-swc')}
${magenta  ('preact-ts      preact'   )}
${lightRed ('lit-ts         lit'      )}
${red      ('svelte-ts      svelte'   )}
${blue     ('solid-ts       solid'    )}
${lightBlue('qwik-ts        qwik'     )}`


const FRAMEWORKS = [
  {
    name: "vanilla",
    display: "Vanilla",
    color: yellow,
    variants: [
      {
        name: "vanilla-ts",
        display: "TypeScript",
        color: blue,
      },
      {
        name: "vanilla",
        display: "JavaScript",
        color: yellow,
      },
    ],
  },
  {
    name: "solid",
    display: "Solid",
    color: blue,
    variants: [
      {
        name: "solid-ts",
        display: "TypeScript",
        color: blue,
      },
      {
        name: "solid",
        display: "JavaScript",
        color: yellow,
      },
    ],
  },
];

// 将 FRAMEWORKS 中存在的variants转换成一维数组 并转换成一维数组
const TEMPLATES = FRAMEWORKS.map(
  (item) => (item.variants && item.variants.map((v) => v.name)) || [item.name]
).flat(Infinity);

// 默认文件名
const defaultTargetDir = "cre-Project";

// 初始化函数
const init = async () => {
  try {
    // prompts
    const result = await prompts([
      {
        type: "text",
        name: "projectName",
        message: "Project name:",
        initial: defaultTargetDir,
      },
      {
        type: "select",
        name: "overwrite",
        message: "Current directory",
        initial: 0,
        choices: [
          {
            title: 'Remove existing files and continue',
            value: 'yes',
          },
          {
            title: 'Cancel operation',
            value: 'no',
          },
          {
            title: 'Ignore files and continue',
            value: 'ignore',
          },
        ],
      }
    ]);

    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

init();

```


没写完 临时有别的东西要写，下次更新。。。。