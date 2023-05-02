import { fromBase64 } from 'js-base64'
import { RefreshAuthUserResponse } from '@/types'
import { api } from '@/api'
import mem from 'mem'

const REFRESH_REQUEST_LIFETIME = 10000 //ms

export function parseJwt(token: string) {
  const jwtParts = token.split('.')
  if (jwtParts.length < 1) return null

  const payloadInBase64UrlFormat = jwtParts[1]
  const decodedPayload = fromBase64(payloadInBase64UrlFormat)
  const parsedDecodedPayload = JSON.parse(decodedPayload)

  return {
    expiresIn: parsedDecodedPayload.exp,
    email: parsedDecodedPayload.email,
    token: token,
    userId: parsedDecodedPayload.owner_id,
  }
}

export async function refreshJwt(): Promise<RefreshAuthUserResponse> {
  const { data } = await api.post<RefreshAuthUserResponse>(
    '/integrations/auth/refresh',
    {},
  )
  return data
}

export const memorizedJwtRefresh = mem(refreshJwt, {
  maxAge: REFRESH_REQUEST_LIFETIME,
})
