/**
 * This file contains the configuration used for customising the website, such as the folder to share,
 * the title, used Google fonts, site icons, contact info, etc.
 */
module.exports = {
  // This is what we use to identify who you are when you are initialising the website for the first time.
  // Make sure this is exactly the same as the email address you use to sign in to your Microsoft account.
  // You can also put this in your worker's environment variable if you worry about
  // your email being exposed in public.
  // Format: i@example.com
  userPrincipalName: process.env.USER_PRINCIPLE_NAME || '',

  // [OPTIONAL] This is the website icon to the left of the title inside the navigation bar. It should be placed under the
  // /public directory of your GitHub project (not your OneDrive folder!), and referenced here by its relative path to /public.
  icon: '/icons/128.png',

  // The name of your website. Present alongside your icon.
  title: process.env.NEXT_PUBLIC_TITLE || "OnePortal",

  // The folder that you are to share publicly with OnePortal. Use '/' if you want to share your root folder.
  baseDirectory: process.env.BASE_DIRECTORY || '/',

  // [OPTIONAL] This represents the maximum number of items that one directory lists, pagination supported.
  // Do note that this is limited up to 200 items by the upstream OneDrive API.
  maxItems: process.env.MAX_ITEMS || 100,

  // [USE AT YOUR OWN RISK] Allow to use Cloudflare to proxy downloading
  // which might be against TOS of Cloudflare
  allowProxy: process.env.NEXT_PUBLIC_ALLOW_PROXY || false,

  // [OPTIONAL] If you have network problems when connecting github.io
  // you could replace it to somewhere proxies that.
  PDFPreviewUrlPrefix: process.env.PDF_PREVIEW_URL_PREFIX || 'https://mozilla.github.io/pdf.js/web/viewer.html?file=',

  // [OPTIONAL] We use Google Fonts natively for font customisations.
  // You can check and generate the required links and names at https://fonts.google.com.
  // googleFontSans - the sans serif font used in OnePortal.
  googleFontSans: 'Inter',
  // googleFontMono - the monospace font used in OnePortal.
  googleFontMono: 'Fira Mono',
  // googleFontLinks -  an array of links for referencing the Google font assets.
  googleFontLinks: ['https://fonts.googleapis.com/css2?family=Fira+Mono&family=Inter:wght@400;500;700&display=swap'],

  // [OPTIONAL] The footer component of your website. You can write HTML here, but you need to escape double
  // quotes - changing " to \". You can write anything here, and if you like badges, generate some with https://shields.io
  footer: process.env.NEXT_PUBLIC_FOOTER ||
    'Powered by <a href="https://github.com/EFLKumo/OnePortal" target="_blank" rel="noopener noreferrer">OnePortal</a>. Made with ❤ by spencerwooo, lyc8503, EFL and other contributors.',

  // [OPTIONAL] This is where you specify the folders that are password protected. It is an array of paths pointing to all
  // the directories in which you have .password set. Check the documentation for details.
  protectedRoutes: process.env.NEXT_PUBLIC_ROUTES
    ? process.env.NEXT_PUBLIC_ROUTES.split(',')
    : ['/Private/Personal', '/Demo/😎Another Private Folder Password 123'],

  // [OPTIONAL] Use "" here if you want to remove this email address from the nav bar.
  email: process.env.NEXT_PUBLIC_EMAIL || 'mailto:i@example.com',
  // [OPTIONAL] This is an array of names and links for setting your social information and links.
  // In the latest update, all brand icons inside font awesome is supported and the icon to render is based on the name
  // you provide. See the documentation for details.
  links: process.env.NEXT_PUBLIC_LINKS
    ? JSON.parse(process.env.NEXT_PUBLIC_LINKS)
    : [],
    /*
    [
      {
        name: 'GitHub',
        link: 'https://github.com',
      },
    ],
    */

  // This is a day.js-style datetime format string to format datetimes in the app. Ref to
  // https://day.js.org/docs/en/display/format for detailed specification. The default value is ISO 8601 full datetime
  // without timezone and replacing T with space.
  datetimeFormat: 'YYYY-MM-DD HH:mm:ss',
}
