import { posix as pathPosix } from 'path-browserify'
import axios from 'redaxios'
import { TOTP } from 'totp-generator'
import { KVNamespace } from '@cloudflare/workers-types'
import CryptoJS from 'crypto-js'
import { v4 as uuidV4 } from 'uuid'

import apiConfig from '../../../config/api.config'
import siteConfig from '../../../config/site.config'
import { getAuthPersonInfo, revealObfuscatedToken } from '../../utils/oAuthHandler'
import { getOdAuthTokens, storeOdAuthTokens } from '../../utils/odAuthTokenStore'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const basePath = pathPosix.resolve('/', siteConfig.baseDirectory)
const clientSecret = revealObfuscatedToken(apiConfig.obfuscatedClientSecret)

/**
 * Encode the path of the file relative to the base directory
 *
 * @param path Relative path of the file to the base directory
 * @returns Absolute path of the file inside OneDrive
 */
export function encodePath(path: string): string {
  let encodedPath = pathPosix.join(basePath, path)
  if (encodedPath === '/' || encodedPath === '') {
    return ''
  }
  encodedPath = encodedPath.replace(/\/$/, '')
  return `:${encodeURIComponent(encodedPath)}`
}

/**
 * Fetch the access token from Redis storage and check if the token requires a renewal
 *
 * @returns Access token for OneDrive API
 */
export async function getAccessToken(): Promise<string> {
  const { accessToken, refreshToken } = await getOdAuthTokens()

  // Return in storage access token if it is still valid
  if (typeof accessToken === 'string') {
    console.log('Fetch access token from storage.')
    return accessToken
  }

  // Return empty string if no refresh token is stored, which requires the application to be re-authenticated
  if (typeof refreshToken !== 'string') {
    console.log('No refresh token, return empty access token.')
    return ''
  }

  // Fetch new access token with in storage refresh token
  const body = new URLSearchParams()
  body.append('client_id', apiConfig.clientId)
  body.append('redirect_uri', apiConfig.redirectUri)
  body.append('client_secret', clientSecret)
  body.append('refresh_token', refreshToken)
  body.append('grant_type', 'refresh_token')

  const resp = await axios.post(apiConfig.authApi, body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  if ('access_token' in resp.data && 'refresh_token' in resp.data) {
    const { expires_in, access_token, refresh_token } = resp.data
    await storeOdAuthTokens({
      accessToken: access_token,
      accessTokenExpiry: parseInt(expires_in),
      refreshToken: refresh_token,
    })
    console.log('Fetch new access token with stored refresh token.')
    return access_token
  }

  return ''
}

/**
 * Helper function to check if the file exists.
 * @param filePath Path of file to check
 * @param accessToken Access token of OneDrive
 */
async function checkFileExists(filePath: string, accessToken: string): Promise<boolean> {
  try {
    await axios.get(`${apiConfig.driveApi}/root${encodePath(filePath)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return true
  } catch (error: any) {
    return false
  }
}

/**
 * Match protected routes in site config to get path of password or totp token.
 * @param path Path cleaned in advance
 * @param accessToken Access token of OneDrive
 * @returns Path to required password or totp token. If not required, return empty string.
 */
export async function getAuthFilePath(path: string, accessToken: string) {
  // Ensure trailing slashes to compare paths component by component. Same for protectedRoutes.
  // Since OneDrive ignores case, lower case before comparing. Same for protectedRoutes.
  path = path.toLowerCase() + '/'
  const protectedRoutes = siteConfig.protectedRoutes as string[]
  let authFilePath = ''

  for (let r of protectedRoutes) {
    r = r.toLowerCase().replace(/\/$/, '') + '/'
    if (path.startsWith(r)) {
      const totpPath = `${r}.totp`
      const totpExists = await checkFileExists(totpPath, accessToken)
      if (totpExists) {
        authFilePath = totpPath
        break
      }

      const passwordPath = `${r}.password`
      const passwordExists = await checkFileExists(passwordPath, accessToken)
      if (passwordExists) {
        authFilePath = passwordPath
        break
      }
    }
  }
  return authFilePath
}

/**
 * Helper function to fetch .password or .totp file
 * @param filePath
 * @param accessToken
 */
const fetchProtectedContent = async (filePath: string, accessToken: string): Promise<string> => {
  const response = await axios.get(`${apiConfig.driveApi}/root${encodePath(filePath)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: {
      select: '@microsoft.graph.downloadUrl,file',
    },
  })

  const downloadUrl = response.data['@microsoft.graph.downloadUrl']
  const content = await axios.get(downloadUrl)
  return content.data.toString()
}

async function readKV(key: string): Promise<string | null> {
  const { OPT_KV } = process.env as unknown as { OPT_KV: KVNamespace }
  return await OPT_KV.get(key)
}

async function writeKV(key: string, value: string) {
  const { OPT_KV } = process.env as unknown as { OPT_KV: KVNamespace }
  await OPT_KV.put(key, value)
}

async function deleteKV(key: string): Promise<void> {
  const { OPT_KV } = process.env as unknown as { OPT_KV: KVNamespace }
  await OPT_KV.delete(key)
}

/**
 * Handles protected route authentication:
 * - Match the cleanPath against an array of user defined protected routes
 * - If a match is found:
 * - 1. Download the .password file stored inside the protected route and parse its contents
 * - 2. Check if the opt-auth-token header is present in the request
 * - The request is continued only if these two contents are exactly the same
 *
 * @param cleanPath Sanitised directory path, used for matching whether route is protected
 * @param accessToken OneDrive API access token
 * @param authPass The passphrase(password or TOTP code), which is not necessary if `authToken` exists
 * @param authToken The token generated by OnePortal.
 */
export async function checkAuthRoute(
  cleanPath: string,
  accessToken: string,
  authPass: string,
  authToken: string,
): Promise<{ code: 200 | 400 | 401 | 403 | 429 | 500 | 503; message: string }> {
  try {
    // Handle authentication through .password or .totp
    const authFilePath = await getAuthFilePath(cleanPath, accessToken)

    // Fetch password from remote file content
    if (authFilePath === '') {
      return { code: 200, message: 'Authenticated.' }
    }

    if (!authPass) authPass = ''
    if (!authToken) authToken = ''

    // Ask user to enter password or TOTP code
    if (authPass === '' && authToken === '') {
      return { code: 400, message: 'Passphrase is empty.' }
    }

    // Client requires an opt-auth-token
    if (authToken === '') {
      // Rate limits
      const record = await readKV(`${authFilePath}TriedAt`)
      if (record) {
        const timestamp = Number(record)
        if (!isNaN(timestamp)) {
          if (Date.now() - timestamp < 15000) {
            return { code: 429, message: 'Too many requests.' }
          }
        } else {
          return { code: 500, message: 'Internal server error. Record is not a valid number.' }
        }
      }

      const uuid = uuidV4()
      const token = CryptoJS.AES.encrypt(`${uuid},${authPass}`, apiConfig.aesKey).toString()
      await writeKV(uuid, Date.now().toString())
      await writeKV(`${authFilePath}TriedAt`, Date.now().toString())
      return { code: 403, message: token }
    }

    if (authFilePath.endsWith('.totp')) {
      const [uuid, code] = CryptoJS.AES.decrypt(authToken, apiConfig.aesKey).toString(CryptoJS.enc.Utf8).split(',')
      const timestamp = Number(await readKV(uuid))

      if (isNaN(timestamp)) {
        return { code: 500, message: 'Internal server error. Not a valid number.' }
      }

      const totpSecret = await fetchProtectedContent(authFilePath, accessToken)
      const totpCode = TOTP.generate(totpSecret, { timestamp }).otp

      if (code === totpCode) return { code: 200, message: 'Authenticated.' }
      else {
        await deleteKV(uuid)
        return { code: 401, message: 'Unauthorized.' }
      }
    }

    if (authFilePath.endsWith('.password')) {
      const password = await fetchProtectedContent(authFilePath, accessToken)
      const [uuid, passwordFromUser] = CryptoJS.AES.decrypt(authToken, apiConfig.aesKey)
        .toString(CryptoJS.enc.Utf8)
        .split(',')
      if (passwordFromUser === password) return { code: 200, message: 'Authenticated.' }
      else {
        try {
          await deleteKV(uuid)
        } catch (e) {}
        return { code: 401, message: 'Unauthorized.' }
      }
    }
  } catch (error: any) {
    return {
      code: 500,
      message: 'Internal server error. Please check your authentication configuration.',
    }
  }
  // Should not reach here, but just in case
  return { code: 500, message: 'Internal server error.' }
}

export default async function handler(req: NextRequest): Promise<Response> {
  // If method is POST, then the API is called by the client to store acquired tokens
  if (req.method === 'POST') {
    const { accessToken, accessTokenExpiry, refreshToken } = await req.json()

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      return new Response('Invalid request body', { status: 400 })
    }

    // verify identity of the authenticated user with the Microsoft Graph API
    const { data, status } = await getAuthPersonInfo(accessToken)
    if (status !== 200) {
      return new Response('Non-200 response from Microsoft Graph API', { status: 500 })
    }

    if (data.userPrincipalName !== siteConfig.userPrincipalName) {
      return new Response('Do not pretend to be the owner!', { status: 403 })
    }

    await storeOdAuthTokens({ accessToken, accessTokenExpiry, refreshToken })
    return new Response('OK')
  }

  // If method is GET, then the API is a normal request to the OneDrive API for files or folders
  const { path = '/', next = '', sort = '' } = Object.fromEntries(req.nextUrl.searchParams)

  // Sometimes the path parameter is defaulted to '[...path]' which we need to handle
  if (path === '[...path]') {
    return new Response(JSON.stringify({ error: 'No path specified.' }), { status: 500 })
  }

  // Besides normalizing and making absolute, trailing slashes are trimmed
  const cleanPath = pathPosix
    .resolve('/', pathPosix.normalize(path))
    .replace(/\/$/, '')
    .replace('.password', '')
    .replace('.totp', '') // Stop from reading password or TOTP code

  const accessToken = await getAccessToken()

  // Return error 403 if access_token is empty
  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'No access token.' }), { status: 503 })
  }

  // Handle protected routes authentication
  const { code, message } = await checkAuthRoute(
    cleanPath,
    accessToken,
    req.headers.get('opt-auth-pass') as string,
    req.headers.get('opt-auth-token') as string,
  )

  // Status code other than 200 means user has not authenticated yet
  if (code !== 200) {
    return new Response(JSON.stringify({ error: message }), { status: code })
  }

  const requestPath = encodePath(cleanPath)
  // Handle response from OneDrive API
  const requestUrl = `${apiConfig.driveApi}/root${requestPath}`
  // Whether path is root, which requires some special treatment
  const isRoot = requestPath === ''

  // Querying current path identity (file or folder) and follow-up query children in folder
  try {
    const { data: identityData } = await axios.get(requestUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        select: 'name,size,id,lastModifiedDateTime,folder,file,video,image',
      },
    })

    // Set edge function caching for faster load times
    const headers: HeadersInit = {}
    headers['Cache-Control'] = apiConfig.cacheControlHeader

    if ('folder' in identityData) {
      const { data: folderData } = await axios.get(`${requestUrl}${isRoot ? '' : ':'}/children`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          ...{
            select: 'name,size,id,lastModifiedDateTime,folder,file,video,image',
            $top: siteConfig.maxItems,
          },
          ...(next ? { $skipToken: next } : {}),
          ...(sort ? { $orderby: sort } : {}),
        },
      })

      // Extract next page token from full @odata.nextLink
      const nextPage = folderData['@odata.nextLink']
        ? folderData['@odata.nextLink'].match(/&\$skiptoken=(.+)/i)[1]
        : null

      // Return paging token if specified
      if (nextPage) {
        return new NextResponse(JSON.stringify({ folder: folderData, next: nextPage }), { headers })
      } else {
        return new NextResponse(JSON.stringify({ folder: folderData }), { headers })
      }
    }
    return new NextResponse(JSON.stringify({ file: identityData }), { headers })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.response?.data ?? 'Internal server error.' }), {
      status: error?.response?.code ?? 500,
    })
  }
}
