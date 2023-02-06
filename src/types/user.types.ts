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

export type UnverifiedModuleUser = {
  id: string
  created_at: string
  module: string
  username: string
  type: string
}

export type ModuleInfo = {
  user_id: string
  username: string
  module: string
  avatar: string
}

export type PositionsResponse = {
  id: string
  positions: string[]
}

export type ModuleBaseInfo = {
  icon: string
  id: string
  name: string
  type: string
}

export type ModulePermissions = {
  name: string
  value: number
}

export type ModulePermissionsResponse = {
  type: string
  id: string
  list: ModulePermissions[]
  req: boolean
}

export type UserPermissionInfo = {
  type: string
  id: string
  access_level: ModulePermissions
  deployable: boolean
  link: string
  module_id: number
  name: string
  path: string
  user_id: number
  username: string
  level: number
}

export type ModuleTree = {
  children: UserPermissionInfo[]
  type: string
  id: string
}

export type UserMeta = {
  total_count: number
}
