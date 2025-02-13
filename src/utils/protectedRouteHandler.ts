import siteConfig from '../../config/site.config'

// Fetch stored token from localStorage
export function getStoredToken(path: string): [string | '', string | ''] {
  const pass =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem(`opt-auth-pass-${encodeURIComponent(matchProtectedRoute(path))}`) as string)
      : ''
  const token =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem(`opt-auth-token-${encodeURIComponent(matchProtectedRoute(path))}`) as string)
      : ''
  return [pass ? pass : '', token ? token : ''] as const
}

/**
 * Match the specified route against a list of predefined routes
 * @param route directory path
 * @returns whether the directory is protected
 */

export function matchProtectedRoute(route: string): string {
  const protectedRoutes: string[] = siteConfig.protectedRoutes
  let authTokenPath = ''

  for (const r of protectedRoutes) {
    // protected route array could be empty
    if (r) {
      if (
        route.startsWith(
          r
            .split('/')
            .map(p => encodeURIComponent(p))
            .join('/'),
        )
      ) {
        authTokenPath = r
        break
      }
    }
  }
  return authTokenPath
}
