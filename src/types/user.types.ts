export type VerifiedUser = {
  id: string
  name: string
  position: string
  surname: string
  telegram?: string
}

export type UnverifiedUser = {
  access_level: number
  gitlab_id: number
  id: string
  link: string
  name: string
  path: string
  type: string
  username: string
}

export type ModuleInfo = {
  user_id: string
  username: string
  module: string
  avatar: string
}
