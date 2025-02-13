import axios from 'redaxios'

import { getAccessToken } from '.'
import apiConfig from '../../../config/api.config'
import siteConfig from '../../../config/site.config'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

/**
 * Sanitize the search query
 *
 * @param query User search query, which may contain special characters
 * @returns Sanitised query string, which:
 * - encodes the '<' and '>' characters,
 * - replaces '?' and '/' characters with ' ',
 * - replaces ''' with ''''
 * Reference: https://stackoverflow.com/questions/41491222/single-quote-escaping-in-microsoft-graph.
 */
function sanitiseQuery(query: string): string {
  const sanitisedQuery = query
    .replace(/'/g, "''")
    .replace('<', ' &lt; ')
    .replace('>', ' &gt; ')
    .replace('?', ' ')
    .replace('/', ' ')
  return encodeURIComponent(sanitisedQuery)
}

export default async function handler(req: NextRequest): Promise<Response> {
  // Get access token from storage
  const accessToken = await getAccessToken()

  // Query parameter from request
  const { q: searchQuery = '' } = Object.fromEntries(req.nextUrl.searchParams)

  try {
    const { data } = await axios.post(
      apiConfig.searchApi,
      {
        requests: [
          {
            entityTypes: ['driveItem'],
            query: {
              queryString: sanitiseQuery(searchQuery),
              size: siteConfig.maxItems,
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    )

    const itemIds =
      data.value?.[0]?.hitsContainers?.[0]?.hits?.map((hit: { resource: { id: any } }) => hit.resource.id) || []

    return new NextResponse(JSON.stringify(itemIds), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': apiConfig.cacheControlHeader,
      },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.response?.data ?? 'Internal server error.' }), {
      status: error?.response?.status ?? 500,
    })
  }
}
