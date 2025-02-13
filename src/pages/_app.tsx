import '@fortawesome/fontawesome-svg-core/styles.css'

import '../styles/globals.css'
import '../styles/markdown-github.css'
import {
  faArrowAltCircleDown,
  faCheckCircle,
  faCopy,
  faEnvelope,
  faFile,
  faFileAlt,
  faFileArchive,
  faFileAudio,
  faFileCode,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFilePowerpoint,
  faFileVideo,
  faFileWord,
  faFlag,
  faFolder,
  faTrashAlt,
} from '@fortawesome/free-regular-svg-icons'
import {
  faAngleRight,
  faArrowLeft,
  faArrowRight,
  faBook,
  faCheck,
  faChevronCircleDown,
  faChevronDown,
  faCloud,
  faCopy as faCopySolid,
  faDownload,
  faExclamationCircle,
  faExclamationTriangle,
  faExternalLinkAlt,
  faFileDownload,
  faHome,
  faKey,
  faLanguage,
  faLink,
  faMinus,
  faMusic,
  faPen,
  faPlus,
  faSearch,
  faSignOutAlt,
  faTh,
  faThLarge,
  faThList,
  faUndo,
} from '@fortawesome/free-solid-svg-icons'
import * as Icons from '@fortawesome/free-brands-svg-icons'

import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar'

// Require had to be used to prevent SSR failure in Next.js
// Related discussion: https://github.com/FortAwesome/Font-Awesome/issues/19348
const { library, config } = require('@fortawesome/fontawesome-svg-core')
config.autoAddCss = false

// import all brand icons with tree-shaking so all icons can be referenced in the app
const iconList = Object.keys(Icons)
  .filter(k => k !== 'fab' && k !== 'prefix')
  .map(icon => Icons[icon])

library.add(
  faFileImage,
  faFilePdf,
  faFileWord,
  faFilePowerpoint,
  faFileExcel,
  faFileAudio,
  faFileVideo,
  faFileArchive,
  faFileCode,
  faFileAlt,
  faFile,
  faFlag,
  faFolder,
  faMusic,
  faArrowLeft,
  faArrowRight,
  faAngleRight,
  faFileDownload,
  faCopy,
  faCopySolid,
  faPlus,
  faMinus,
  faDownload,
  faLink,
  faUndo,
  faBook,
  faArrowAltCircleDown,
  faKey,
  faTrashAlt,
  faSignOutAlt,
  faEnvelope,
  faCloud,
  faChevronCircleDown,
  faExternalLinkAlt,
  faExclamationCircle,
  faExclamationTriangle,
  faHome,
  faCheck,
  faCheckCircle,
  faSearch,
  faChevronDown,
  faTh,
  faThLarge,
  faThList,
  faLanguage,
  faPen,
  ...iconList,
)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextNProgress height={1} color="rgb(156, 163, 175, 0.9)" options={{ showSpinner: false }} />
      <Component {...pageProps} />
    </>
  )
}
export default MyApp
