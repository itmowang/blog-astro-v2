---
title: "记录一次修复 个人记录Blog 的 RSS "
description: "记录一次修复 个人记录Blog 的 RSS "
pubDate: "2024-07-08 23:27:24"
heroImage: "http://img.blog.loli.wang/2024-07-08-jiluRSS/01.png"
tags:
  - Blog Rss
  - RSS
  - 前端进阶
---

### 为什么要使用 RSS ?

RSS是一种用于发布经常更新的内容的网站的一种数据格式。通过RSS，网站可以将最新的文章、新闻、博客等内容以统一的格式提供给用户。而用户则可以通过RSS订阅这些内容，无需再次访问网站，便能够及时获取更新。


RSS的优点：
    1. 更新及时：RSS订阅可以实时获取最新的内容，用户无需手动刷新页面，从而提高了用户体验。
    2. 离线阅读：RSS订阅可以离线阅读，用户可以在没有网络连接的情况下查看订阅的RSS内容。
    3. 聚合阅读：RSS订阅可以聚合多个来源的RSS内容，用户可以查看来自不同网站的内容。

### 起因

因为之前重新基于沉冰的项目升级除了故障,所以紧急自己写了一版.结果对RSS这部分有遗漏,这次就正好重新补上吧

![1](http://img.blog.loli.wang/2024-07-08-jiluRSS/01.png)
![2](http://img.blog.loli.wang/2024-07-08-jiluRSS/02.png)


### 安装 Astro RSS 插件

```bash
pnpm add @astrojs/rss
```

### 配置 RSS 插件

装载RSS 插件完成后,去修改astro的配置文件，配置文件的site属性一定要有正确配置。

![3](http://img.blog.loli.wang/2024-07-08-jiluRSS/03.png)

然后再pages目录下新建一个 **rss.xml.ts** 文件，然后写上如下代码：

```ts
import rss from '@astrojs/rss';

export function GET(context) {
  return rss({
    // 输出的 xml 中的`<title>`字段
    title: 'Buzz’s Blog',
    // 输出的 xml 中的`<description>`字段
    description: 'A humble Astronaut’s guide to the stars',
    // 从端点上下文获取项目“site”
    // https://docs.astro.build/zh-cn/reference/api-reference/#contextsite
    site: context.site,
    // 输出的 xml 中的`<item>`数组
    // 有关使用内容集合和 glob 导入的示例，请参阅“生成`items`”部分
    items: [],
    // (可选) 注入自定义 xml
    customData: `<language>en-us</language>`,
  });
}
```

然后在 /src/config.ts 中添加以下内容：

```ts
import { defineCollection } from 'astro:content';
import { rssSchema } from '@astrojs/rss';

const blog = defineCollection({
  schema: rssSchema,
});

export const collections = { blog };
```

![4](http://img.blog.loli.wang/2024-07-08-jiluRSS/04.png)

接下来我们启动下本地项目,访问url/rss.xml,就可以看到rss文件了。

接下来进行让展示的内容也出现在rss中

修改**rss.xml.ts** 文件

```ts
import rss from '@astrojs/rss';
import { config_global,config_fun } from "@/theme-simple/config";
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();
export async function GET(context: { site: any; }) {
    const {title,description} = config_global;
    const { sortPosts  } = config_fun;
    const blog = await getCollection('blog');
    return rss({
        // 输出的 xml 中的`<title>`字段
          title, 
        // 输出的 xml 中的`<description>`字段
        description,
        // 从端点上下文获取项目“site”
        site: context.site,
        // 输出的 xml 中的`<item>`数组
        // 有关使用内容集合和 glob 导入的示例，请参阅“生成`items`”部分
        items:blog.sort(sortPosts).map((post) => ({
            link: `/blog/${post.slug}/`,
            // 注意：这不会处理 MDX 文件中的组件或 JSX 表达式。
            content: sanitizeHtml(parser.render(post.body), {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
            }),
            ...post.data,
          })),
        
        // (可选) 注入自定义 xml
        customData: `<language>en-us</language>`,
    });
}
```

![5](http://img.blog.loli.wang/2024-07-08-jiluRSS/05.png)