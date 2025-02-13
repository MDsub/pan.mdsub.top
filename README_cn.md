<div align="center">
  <img src="./public/header.png" alt="OnePortal" />
  <h2>OnePortal</h2>
  <a href="https://github.com/EFLKumo/OnePortal/blob/main/README.md">English</a> | 简体中文
  <p><em>基于 <a href="https://github.com/lyc8503/onedrive-cf-index-ng">onedrive-cf-index-ng</a> 的 OneDrive 索引程序,由 Cloudflare 和 Next.js 驱动</em></p>

  <img src="https://img.shields.io/badge/OneDrive-2C68C3?style=flat&logo=microsoft-onedrive&logoColor=white" alt="OneDrive" />
  <img src="https://img.shields.io/badge/Cloudflare-f38020?style=flat&logo=Cloudflare&logoColor=white" alt="Cloudflare" />
  <img src="https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white" alt="Next.js" />
</div>

## 简介

使用 OnePortal 展示、分享、预览和下载 OneDrive 中的文件

- 无服务器,完全免费托管 💸
- 超快速 ⚡ 且响应迅速 💦  
- 15分钟内即可完成设置 ⏱️
- 高度可定制 ⚒️

🍌 更重要的是,我们很漂亮 (●'◡'●)

## 主要改进
相比 [onedrive-cf-index-ng](https://github.com/lyc8503/onedrive-cf-index-ng):
- 🚀 通过 Cloudflare 网络代理下载
- 🔍 使用 Microsoft Graph Search API 改进搜索
  * 原版使用 OneDrive Search API，这会随机性地缺漏文件，已基本不可用
- 🔐 通过以下方式提高安全性:
  - 支持使用 TOTP 而不是密码
  - 在环境变量中设置自定义 AES 密钥和客户端密钥
  - 为 TOTP 验证启用速率限制
- 😋 更好的用户界面
- 🍪 边缘函数缓存以加快加载速度
- 🛠️ 更多环境变量
- 🧰 更新依赖项

*特别感谢 od-cf-index-ng 的原作者 [@lyc8503](https://github.com/lyc8503) 和 onedrive-vercel-index 的作者 [@spencerwooo](https://github.com/spencerwooo) 以及所有贡献者。*

## 🚀 快速开始
查看 [OnePortal Wiki](https://efl.notion.site/18bd8cf246098083b8b7cac7aec58917)!

*如果你喜欢这个项目,请给它一个星标!* :3

## 演示

在[这里](https://opt-demo.eflx.top)查看在线演示。

![demo](./public/demo.png)

## 功能特性

<table>
  <tbody>
    <tr>
      <td>
        👀 文件预览
      </td>
      <td>
        💠 列表/网格布局
      </td>
      <td>
        🎥 视频和音频
      </td>
    </tr>
    <tr>
      <td>PDF、EPUB、markdown、代码、纯文本</td>
      <td>使用缩略图预览图片和文档</td>
      <td>mp4、mp3等,在线播放或使用 IINA、PotPlayer 等播放器播放(支持字幕)!</td>
    </tr>
    <tr>
      <td>
        📄 Office 预览
      </td>
      <td>📝 README.md 预览</td>
      <td>📑 分页</td>
    </tr>
    <tr>
      <td>docx、pptx、xlsx 等</td>
      <td>还可以渲染代码块、相对链接的图片等</td>
      <td>用于包含 200 个或更多项目的文件夹</td>
    </tr>
    <tr>
      <td>🔒 受保护的文件夹</td>
      <td>⏬ 多文件下载</td>
      <td>🚀 代理下载</td>
    </tr>
    <tr>
      <td>密码保护的路由和文件。<a href="https://efl.notion.site/Protected-folders-18bd8cf2460980abb398e33c593b1b73?pvs=25">详情请点击</a></td>
      <td>
        压缩并下载多个文件或文件夹。
        <a href="https://efl.notion.site/Download-multi-file-18bd8cf2460980fda0a4c6ec7bec3c09?pvs=25">详情请点击</a>
      </td>
      <td>
        通过 Cloudflare 网络下载(有风险)。
        <a href="https://efl.notion.site/Proxy-download-18bd8cf24609808ca7b7f625300d6b54?pvs=25">详情请点击</a>
      </td>
    </tr>
  </tbody>
</table>

... 以及更多:

- 简化部署流程,无需手动获取令牌!
- 直接提供原始文件和托管服务...
- 完整的深色模式支持、样式和网站自定义...

> **注意**: 本项目主要专注于展示和提供从你的 OneDrive 下载文件的方式。强调**免费**和**无服务器**。如果你有自己的服务器/需要 WebDAV/使用 OneDrive 以外的云存储提供商,请查看 [alist](https://github.com/alist-org/alist)。

## 文档

文档托管在 [OnePortal Wiki](https://efl.notion.site/18bd8cf246098083b8b7cac7aec58917)。

> 我找不到解决方案/我的问题很特殊?

**请提出 issue 寻求帮助,在此之前请确保你已经搜索过现有/已解决的问题。**

## 许可证

[MIT](LICENSE)

<div align="center">
  <img src="./public/footer.png" alt="footer"/>
  <em>由 <a href="https://eflx.top">EFL</a> & <a href="https://lyc8503.net">lyc8503</a> & <a href="https://spencerwoo.com">spencer woo</a> 和贡献者用 ❤️ 制作</em>
</div>