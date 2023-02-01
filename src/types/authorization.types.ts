export type Jwt = {
  expiresIn: number
  email: string
  token: string
  userId: number
}

export type AuthorizeUserResponse = {
  access: string
  refresh: string
}

export type RefreshAuthUserResponse = {
  access: string
  refresh: string
}

export type NonceMessageResponse = {
  message: string
}
