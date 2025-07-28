---
title: "curl 一些常用的指令"
description: "curl 一些常用的指令"
pubDate: "2025-07-28 23:27:24"
heroImage: "http://img.blog.loli.wang/2025-07-28-curldocs/01.png"
tags:
  - 前端进阶
  - 操作
---

## 
`curl` 命令是一个用于从 URL 获取数据的工具，它可以从 HTTP、HTTPS、FTP、SFTP 等协议中获取数据。

它支持非常多的协议：

```bash
DICT、FILE、FTP、FTPS、GOPHER、GOPHERS、HTTP、HTTPS、IMAP、IMAPS、LDAP、LDAPS、MQTT、POP3、POP3S、RTMP、RTMPS、RTSP、SCP、SFTP、SMB、SMBS、SMTP、SMTPS、TELNET、TFTP、WS 和 WSS
````

### curl 命令的常见用法：

#### 1\. 获取网页内容

这是 `curl` 最基础的用法，它会将指定 URL 的内容直接输出到终端。

```bash
curl [https://example.com](https://example.com)
```

#### 2\. 保存网页内容到文件

如果你希望将获取到的内容保存下来，而不是直接输出，可以使用 `-o` 或 `-O` 选项。

  * **`-o` (小写)**: 将内容保存到你指定的文件名。

    ```bash
    curl -o page.html [https://example.com](https://example.com)
    ```

  * **`-O` (大写)**: 使用 URL 中的文件名来保存内容。例如，下面的命令会创建一个名为 `download.zip` 的文件。

    ```bash
    curl -O [https://example.com/files/download.zip](https://example.com/files/download.zip)
    ```

#### 3\. 查看 HTTP 响应头

在调试时，查看服务器返回的响应头信息非常有用。

  * **`-i` 或 `--include`**: 在输出中包含 HTTP 响应头和响应体。

    ```bash
    curl -i [https://example.com](https://example.com)
    ```

  * **`-I` (大写) 或 `--head`**: 只获取并显示 HTTP 响应头。

    ```bash
    curl -I [https://example.com](https://example.com)
    ```

#### 4\. 发送不同方法的请求

你可以使用 `-X` 选项来指定 HTTP 请求的方法，如 `POST`, `PUT`, `DELETE` 等。

  * **发送 POST 请求**

    ```bash
    curl -X POST [https://api.example.com/data](https://api.example.com/data)
    ```

  * **发送 DELETE 请求**

    ```bash
    curl -X DELETE [https://api.example.com/data/item/123](https://api.example.com/data/item/123)
    ```

#### 5\. 发送数据

在与 API 交互时，经常需要发送数据。

  * **发送表单数据 (`-d` 或 `--data`)**
    这会模拟一个标准的 HTML 表单提交，默认的 `Content-Type` 是 `application/x-www-form-urlencoded`。

    ```bash
    curl -d "name=John Doe&project=curl" [https://example.com/form](https://example.com/form)
    ```

  * **发送 JSON 数据**
    对于现代 API，发送 JSON 数据是常态。你需要手动设置 `Content-Type` 头，并传递 JSON 字符串。

    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"key":"value", "id":123}' [https://api.example.com/items](https://api.example.com/items)
    ```

#### 6\. 添加自定义请求头 (`-H` 或 `--header`)

在需要身份验证或传递特定元数据时，自定义请求头至关重要。

```bash
curl -H "Authorization: Bearer your_api_token" -H "X-Custom-Header: MyValue" [https://api.example.com/user](https://api.example.com/user)
```

#### 7\. 跟随重定向 (`-L` 或 `--location`)

默认情况下，`curl` 不会跟随 HTTP 3xx 重定向。使用 `-L` 选项可以使其请求重定向后的最终 URL。

```bash
# 如果 [http://google.com](http://google.com) 重定向到 [https://www.google.com](https://www.google.com), -L 会获取最终页面的内容
curl -L [http://google.com](http://google.com)
```

#### 8\. 上传文件

`curl` 同样可以轻松处理文件上传。

  * **使用 `-F` 或 `--form` (multipart/form-data)**
    这会模拟一个包含文件上传的表单提交。使用 `@` 符号指定文件路径。

    ```bash
    curl -F "file=@/path/to/your/image.png" -F "username=testuser" [https://example.com/upload](https://example.com/upload)
    ```

  * **使用 `-T` 或 `--upload-file`**
    对于 `PUT` 或 `FTP` 等协议，可以直接上传文件内容作为请求体。

    ```bash
    curl -T /path/to/your/file.txt ftp://[ftp.example.com/remote/](https://ftp.example.com/remote/)
    ```

#### 9\. 断点续传 (`-C -`)

在下载大文件时，如果网络中断，此功能非常有用。`-C -` 告诉 `curl` 自动寻找断点并从那里继续下载。

```bash
# 如果下载中断，再次运行相同命令即可恢复下载
curl -C - -O [https://releases.ubuntu.com/22.04.4/ubuntu-22.04.4-desktop-amd64.iso](https://releases.ubuntu.com/22.04.4/ubuntu-22.04.4-desktop-amd64.iso)
```

#### 10\. 处理 Cookies

`curl` 可以方便地存储和发送 cookies，用于维持会话。

  * **`-c, --cookie-jar <file>`**: 将服务器返回的 Cookies 保存到文件中。
  * **`-b, --cookie <file|string>`**: 从文件或字符串中读取 Cookies 并发送。

<!-- end list -->

```bash
# 1. 登录并将 session cookies 保存到 cookie.txt
curl -c cookie.txt -d "user=admin&pass=secret123" [https://example.com/login](https://example.com/login)

# 2. 使用保存的 cookies 访问需要授权的页面
curl -b cookie.txt [https://example.com/dashboard](https://example.com/dashboard)
```

#### 11\. 静默模式 (`-s` 或 `--silent`)

在脚本中使用 `curl` 时，你可能不希望看到进度条或错误信息。`-s` 会隐藏这些输出。

```bash
# 该命令将只输出响应体，没有其他任何信息
content=$(curl -s [https://api.example.com/data](https://api.example.com/data))
echo $content
```

`curl` 是一个极其强大的工具，它的功能远不止于此。通过 `man curl` 命令可以查看其完整的文档和所有可用选项，探索更多高级用法。

```


以后补充实际场景的使用。