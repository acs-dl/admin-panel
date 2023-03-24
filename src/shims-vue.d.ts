declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-the-mask' {
  import VueTheMask from 'vue-the-mask'
  export default VueTheMask
}
