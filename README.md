<div align="center">
  <img src="./public/header.png" alt="OnePortal" />
  <h2>OnePortal</h2>
  English | <a href="https://github.com/EFLKumo/OnePortal/blob/main/README_cn.md">简体中文</a>
  <p><em>OneDrive public directory listing forked from <a href="https://github.com/lyc8503/onedrive-cf-index-ng">onedrive-cf-index-ng</a>, powered by Cloudflare and Next.js</em></p>

  <img src="https://img.shields.io/badge/OneDrive-2C68C3?style=flat&logo=microsoft-onedrive&logoColor=white" alt="OneDrive" />
  <img src="https://img.shields.io/badge/Cloudflare-f38020?style=flat&logo=Cloudflare&logoColor=white" alt="Cloudflare" />
  <img src="https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white" alt="Next.js" />
</div>

## TL;DR

Showcase, share, preview, and download files inside *your* OneDrive with OnePortal

- Serverless, completely free to host 💸
- Superfast ⚡ and responsive 💦
- Takes less than 15 minutes to set up ⏱️
- Highly customisable ⚒️

🍌 More importantly, we are pretty (●'◡'●)


## What's different
Compared with [onedrive-cf-index-ng](https://github.com/lyc8503/onedrive-cf-index-ng):
- 🚀 Proxy downloading through Cloudflare network
- 🔍 Improved file search with Microsoft Graph Search API
  * The original version uses OneDrive Search API, which randomly misses files and is basically unusable.
- 🔐 Improve security by:
  - allowing to use TOTP instead of password
  - set custom AES secret key and client secret in environment variables
  - rate limit for TOTP authentication
- 😋 Better user interface
- 🍪 Edge function caching for faster load times
- 🛠️ More environment variables
- 🧰 Updated dependencies

*Special thanks to the original author of od-cf-index-ng [@lyc8503](https://github.com/lyc8503) and author of onedrive-vercel-index [@spencerwooo](https://github.com/spencerwooo) and all contributors.*


## 🚀 Quick start
See [OnePortal Wiki](https://efl.notion.site/18bd8cf246098083b8b7cac7aec58917)!

*If you happen to like this project, please give it a star!* :3

## Demo

Live demo at [here](https://opt-demo.eflx.top).

![demo](./public/demo.png)

## Features

<table>
  <tbody>
    <tr>
      <td>
        👀 File preview
      </td>
      <td>
        💠  List / Grid layouts
      </td>
      <td>
        🎥 Video and audio
      </td>
    </tr>
    <tr>
      <td>PDF, EPUB, markdown, code, plain text</td>
      <td>For previewing images and documents with thumbnails</td>
      <td>mp4, mp3, ..., play online or with IINA, PotPlayer ... with subtitles!</td>
    </tr>
    <tr>
      <td>
        📄 Office preview
      </td>
      <td>📝 README.md preview</td>
      <td>📑 Pagination</td>
    </tr>
    <tr>
      <td>docx, pptx, xlsx, ...</td>
      <td>Also renders code blocks, images with relative links, ...</td>
      <td>For folders with 200 or more items</td>
    </tr>
    <tr>
      <td>🔒 Protected folders</td>
      <td>⏬ Multi-file download</td>
      <td>🚀 Proxy download</td>
    </tr>
    <tr>
      <td>Password protected routes and files. <a href="https://efl.notion.site/Protected-folders-18bd8cf2460980abb398e33c593b1b73?pvs=25">Details here</a></td>
      <td>
        Compress and download multiple files or folders.
        <a href="https://efl.notion.site/Download-multi-file-18bd8cf2460980fda0a4c6ec7bec3c09?pvs=25">Details here</a>
      </td>
      <td>
        Download via Cloudflare network (with risk).
        <a href="https://efl.notion.site/Proxy-download-18bd8cf24609808ca7b7f625300d6b54?pvs=25">Details here</a>
      </td>
    </tr>
  </tbody>
</table>

... and more:

- Streamlined deployment, without having to get your tokens manually anymore!
- Direct raw-file serving and hosting ...
- Full dark mode support, style and website customisations ...

> **Note**: This project is focused on showcasing and providing a way for others to download files from your OneDrive. Emphasis on **free** and **serverless**. If you have your own server / need WebDAV / use cloud providers other than OneDrive, checkout [alist](https://github.com/alist-org/alist).

## Documentation

Documentation is hosted at [OnePortal Wiki](https://efl.notion.site/18bd8cf246098083b8b7cac7aec58917).

> I didn't find a solution / My problem is unique?

**Please open an issue for help, before that make sure that you have searched for existing/solved issues.**

## License

[MIT](LICENSE)

<div align="center">
  <img src="./public/footer.png"  alt="footer"/>
  <em>made with ❤️ by <a href="https://eflx.top">EFL</a> & <a href="https://lyc8503.net">lyc8503</a> & <a href="https://spencerwoo.com">spencer woo</a> and contributors</em>
</div>