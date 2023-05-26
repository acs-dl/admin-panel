import { REQUEST_STATUSES, USER_REQUEST_STATUSES } from '@/enums'

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
  module: string[]
  submodule: string[]
  username: string
  type: string
  name: string
}

export type ModuleInfo = {
  user_id: string
  username: string
  module: string
  avatar: string
  submodule: string
  access_level: string
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
  prefix: string
}

export type UserRole = Record<string, string>

export type UserRoles = Record<string, UserRole>

export type ModulePermissions = {
  name: string
  value: number | string
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
  expires_at: string
  deployable: boolean
  link: string
  module_id: number
  name: string
  path: string
  user_id: number
  username: string
  level: number
  phone?: string
  submodule_access_hash?: string
  submodule_id?: string
  children: UserPermissionInfo[]
}

export type ModuleTree = {
  children: UserPermissionInfo[]
  isWasFound: boolean
  type: string
  id: string
}

export type UserMeta = {
  total_count: number
}

export type UserRequest = {
  type: string
  id: string
  module: string
  error: string
  status: REQUEST_STATUSES
  relationshipNames?: string[]
  created_at: string
  user?: {
    type: string
    id: number
  }
  payload?: {
    action: USER_REQUEST_STATUSES
    user_id: string
    username: string
    phone: string
    links?: string[]
    link?: string
    access_level?: number
  }
}

export type UserModuleSearch = {
  searchValue: string
  moduleName: string
}

export type SubmoduleName = {
  submodule?: string
  module: string
  accessLevel?: string
}

export type TelegramChats = {
  submodules: TelegramChat[]
}

export type TelegramChat = {
  id: string
  attributes: {
    members_amount: number
    submodule_access_hash?: string
    submodule_id?: string
    title: string
    photo?: string | null
  }
}
