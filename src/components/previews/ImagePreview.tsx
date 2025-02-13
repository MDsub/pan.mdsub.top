import type { OdFileObject } from '../../types'

import { FC } from 'react'
import { useRouter } from 'next/router'

import { DownloadBtnContainer, PreviewContainer } from './Containers'
import DownloadButtonGroup from '../DownloadBtnGroup'
import { getStoredToken } from '../../utils/protectedRouteHandler'

const ImagePreview: FC<{ file: OdFileObject }> = ({ file }) => {
  const { asPath } = useRouter()
  const [_, token] = getStoredToken(asPath)

  return (
    <>
      <PreviewContainer>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="mx-auto"
          src={`/api/raw?path=${asPath}${token ? `&odpt=${encodeURIComponent(token)}` : ''}`}
          alt={file.name}
          width={file.image?.width}
          height={file.image?.height}
        />
      </PreviewContainer>
      <DownloadBtnContainer>
        <DownloadButtonGroup />
      </DownloadBtnContainer>
    </>
  )
}

export default ImagePreview
