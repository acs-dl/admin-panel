import { ICON_NAMES } from '@/enums'

export type GlobalFilter = {
  username: (value: string) => string
  module: (value: string) => string
}

export type NotificationObjectPayload = {
  title?: string
  message: string
  iconName?: typeof ICON_NAMES | unknown
}
