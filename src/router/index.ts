import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
  useRoute,
  useRouter,
} from 'vue-router'
import { ROUTE_NAMES } from '@/enums'
import { useAuthStore } from '@/store'

enum ROUTE_METAS {
  isRequiredAuth = 'isRequiredAuth',
  isRequiredUnAuth = 'isRequiredUnAuth',
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.uiKit },
  },
  {
    path: '/',
    name: ROUTE_NAMES.adminPanel,
    meta: {
      [ROUTE_METAS.isRequiredAuth]: true,
    },
    component: () => import('@/pages/AdminPanel.vue'),
    redirect: { name: ROUTE_NAMES.verifiedUsers },
    children: [
      {
        path: '/verified-users',
        name: ROUTE_NAMES.verifiedUsers,
        component: () => import('@/pages/VerifiedUsers.vue'),
      },
      {
        path: '/verified-users/:id',
        name: ROUTE_NAMES.userDetails,
        props: true,
        component: () => import('@/pages/UserDetails.vue'),
      },
      {
        path: '/unverified-users',
        name: ROUTE_NAMES.unverifiedUsers,
        component: () => import('@/pages/UnverifiedUsers.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: ROUTE_NAMES.login,
    meta: {
      [ROUTE_METAS.isRequiredUnAuth]: true,
    },
    component: () => import('@/pages/LoginPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

router.beforeEach(async (to, from, next) => {
  if (to.name === ROUTE_NAMES.adminPanel) {
    redirectRouteGuard(to, from, next)
  } else if (
    to.matched.some(record => record.meta[ROUTE_METAS.isRequiredAuth])
  ) {
    inAppRouteGuard(to, from, next)
  } else if (
    to.matched.some(record => record.meta[ROUTE_METAS.isRequiredUnAuth])
  ) {
    authGuard(to, from, next)
  } else {
    next()
  }
})

function redirectRouteGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const accountStore = useAuthStore()
  const isLoggedIn = accountStore.isLoggedIn

  if (isLoggedIn) {
    if (to.name === ROUTE_NAMES.adminPanel) {
      next({ name: ROUTE_NAMES.adminPanel })
    } else {
      next()
    }
  } else {
    next({ name: ROUTE_NAMES.login })
  }
}

function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const accountStore = useAuthStore()
  const isLoggedIn = accountStore.isLoggedIn

  if (isLoggedIn) {
    next({ name: ROUTE_NAMES.adminPanel })
  } else {
    next(next)
  }
}

function inAppRouteGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const accountStore = useAuthStore()
  const isLoggedIn = accountStore.isLoggedIn

  if (isLoggedIn) {
    next()
  } else {
    next({ name: ROUTE_NAMES.login })
  }
}
export { router, useRouter, useRoute }
