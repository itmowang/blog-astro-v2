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