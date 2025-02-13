import axios from 'redaxios'

import { getAccessToken } from '.'
import apiConfig from '../../../config/api.config'
import siteConfig from '../../../config/site.config'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export default async function handler(req: NextRequest): Promise<Response> {
  // Get access token from storage
  const accessToken = await getAccessToken()

  // Get item details (specifically, its path) by its unique ID in OneDrive
  const { id = '' } = Object.fromEntries(req.nextUrl.searchParams)

  const idPattern = /^[a-zA-Z0-9]+$/
  if (!idPattern.test(id)) {
    // ID contains characters other than letters and numbers
    return new Response(JSON.stringify({ error: 'Invalid driveItem ID.' }), { status: 400 })
  }
  const itemApi = `${apiConfig.driveApi}/items/${id}`
  try {
    const { data } = await axios.get(itemApi, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        select: 'id,name,parentReference,file,folder',
      },
    })

    // Check if the item is under baseDirectory
    if (!data.parentReference.path.startsWith(`/drive/root:${siteConfig.baseDirectory}`)) {
      return new NextResponse(JSON.stringify(null), {
        headers: {
          'content-type': 'application/json',
          'Cache-Control': apiConfig.cacheControlHeader,
        },
      })
    }

    // Remove baseDirectory
    data.parentReference.path = data.parentReference.path.replace(siteConfig.baseDirectory, '')

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'Cache-Control': apiConfig.cacheControlHeader,
      },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.response?.data ?? 'Internal server error.' }), {
      status: error?.response?.status ?? 500,
    })
  }
}
