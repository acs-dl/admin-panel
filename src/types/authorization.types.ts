export type Jwt = {
  expiresIn: number
  token: string
}

export type AuthorizeUserResponse = {
  access: string
  refresh: string
}

export type RefreshAuthUserResponse = {
  token: string
}

export type NonceMessageResponse = {
  message: string
}
