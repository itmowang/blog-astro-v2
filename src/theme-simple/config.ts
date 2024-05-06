
const today = new Date();
const copy = `© ${today.getFullYear()} YOUR NAME HERE.`;

export const config_global: Record<string, any> = {
    title: '魔王の博客',
    description: '高兴的使用astro构建',
    url: 'https://blog.loli.wang/',
    favicon: "/favicon.ico",
    locales: "zh-CN", // 'en-us'
    image: "/placeholder-social.jpg",
    copy,
    linkInfo:{
        title: "Link",
        description: "Link description",
    },
    archive: {
        title: "Archive",
        description: "Archive description",
    },
}

export const config_author: Record<string, string> = {
    name: "Mowang",
    avatar: "https://avatars.githubusercontent.com/u/137391282?v=4",
    bio: "Your bio",
}

export const config_menu: Record<string, string>[] = [
    { name: 'Blog', path: '/' },
    { name: 'Life', path: '/life' },
    { name: 'Archive', path: '/archive' },
    { name: 'Link', path: '/link' },
    { name: 'About', path: '/about' },
    { name: 'Github', path: 'https://github.com/itmowang' },
]


export const config_link: Record<string, string>[] = [
    {
        icon:"https://avatars.githubusercontent.com/u/137391282?v=4",
        href:"https://github.com/itmowang",
        name:"魔王の博客",
        desc:"1111111"
    },
    {
        icon:"https://www.wdssmq.com/zb_users/avatar/1.png",
        href:"https://www.wdssmq.com/",
        name:"沉冰浮水",
        desc:"1111111"
    },
    {
        icon:"https://fastly.jsdelivr.net/gh/xiangshu233/cdn@2.8/img/custom/touxiang.jpg",
        href:"https://xiangshu233.cn/",
        name:"傲慢或香橙",
        desc:"1111111"
    },
    {
        icon:"https://avatars.githubusercontent.com/u/7686097?v=4",
        href:"https://blog.isluo.com/",
        name:"Logic",
        desc:"1111111"
    },
    {
        icon:"https://gravatar.fghrsh.net/avatar/0c5d77513a08b8c3e38336859b53b027?s=80&d=mm&r=G",
        href:"https://www.fghrsh.net/",
        name:"FGHRSH 的博客",
        desc:"1111111"
    },
]

export const config_authorsPages: Record<string, any> = {
    pageSize: 10,
}

export const config_fun = {
    sortPosts: (a: any, b: any) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime(),
    getPagination: (count: number, size: number, current: number = 1, tpl: string = "/page/%num%/") => {
        const total = Math.ceil(count / size);
        const prevNum = current > 1 ? current - 1 : -1;
        const nextNum = current < total ? current + 1 : -1;
        const _link = (num: number) => {
            return tpl.replace("%num%", num.toString());
        };
        return {
            current: current,
            total: total,
            tpl: tpl,
            prev: {
                num: prevNum,
                link: prevNum > 0 ? _link(prevNum) : "",
            },
            next: {
                num: nextNum,
                link: nextNum > 0 ? _link(nextNum) : "",
            },
        };
    }
}