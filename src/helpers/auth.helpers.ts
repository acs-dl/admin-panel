import { fromBase64 } from 'js-base64'

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
