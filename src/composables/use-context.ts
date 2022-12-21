/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { VueI18nTranslation } from 'vue-i18n'
import { config } from '@config'
import { ICON_NAMES, ROUTE_NAMES } from '@/enums'
import { app } from '@/main'

export const useContext = (): {
  $t: VueI18nTranslation
  $config: typeof config
  $routes: typeof ROUTE_NAMES
  $icons: typeof ICON_NAMES
} => {
  const { $t, $config, $routes, $icons } = app!._context.config.globalProperties

  return {
    $t,
    $config,
    $routes,
    $icons,
  }
}
