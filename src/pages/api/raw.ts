import { posix as pathPosix } from 'path-browserify'
import axios from 'redaxios'

import siteConfig from '../../../config/site.config'
import { cacheControlHeader, driveApi } from '../../../config/api.config'
import { checkAuthRoute, encodePath, getAccessToken } from '.'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export default async function handler(req: NextRequest): Promise<Response> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'No access token.' }), { status: 403 })
  }

  const { path = '/', odpt = '', proxy = false } = Object.fromEntries(req.nextUrl.searchParams)

  // Sometimes the path parameter is defaulted to '[...path]' which we need to handle
  if (path === '[...path]') {
    return new Response(JSON.stringify({ error: 'No path specified.' }), { status: 400 })
  }

  const cleanPath = pathPosix.resolve('/', pathPosix.normalize(path)).replace('.password', '').replace('.totp', '')

  // Handle protected routes authentication
  const token = (req.headers.get('opt-auth-token') as string) ?? decodeURIComponent(odpt)

  const { code, message } = await checkAuthRoute(cleanPath, accessToken, '', token)
  // Status code other than 200 means user has not authenticated yet
  if (code !== 200) {
    return new Response(JSON.stringify({ error: message }), { status: code })
  }

  let headers = {
    'Cache-Control': cacheControlHeader,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  }

  // If message is empty, then the path is not protected.
  // Conversely, protected routes are not allowed to serve from cache.
  if (message !== '') {
    headers['Cache-Control'] = 'no-cache'
  }

  try {
    // Handle response from OneDrive API
    const requestUrl = `${driveApi}/root${encodePath(cleanPath)}`
    const { data } = await axios.get(requestUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        // OneDrive international version fails when only selecting the downloadUrl (what a stupid bug)
        select: 'id,size,@microsoft.graph.downloadUrl',
      },
    })

    if ('@microsoft.graph.downloadUrl' in data) {
      if (proxy && siteConfig.allowProxy) {
        const { headers, data: stream } = await axios.get(data['@microsoft.graph.downloadUrl'] as string, {
          responseType: 'stream',
        })
        headers['Cache-Control'] = cacheControlHeader
        // Send data stream as response
        return new Response(stream, { status: 200, headers: headers })
      } else {
        headers['Location'] = data['@microsoft.graph.downloadUrl'] as string
        return new Response(null, { status: 302, headers: headers })
      }
    } else {
      return new Response(JSON.stringify({ error: 'No download url found.' }), { status: 404, headers: headers })
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.response?.data ?? 'Internal server error.' }), {
      status: error?.response?.status ?? 500,
      headers: headers,
    })
  }
}
