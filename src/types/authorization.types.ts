export type Jwt = {
  expiresIn: number
  email: string
  token: string
  userId: number
}

export type AuthorizeUserResponse = {
  access: string
}

export type RefreshAuthUserResponse = {
  access: string
}
