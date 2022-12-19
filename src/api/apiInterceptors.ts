import { HTTP_STATUS_CODES } from '@distributedlab/json-api-client'
import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store'
import { router } from '@/router'
import { ROUTE_NAMES } from '@/enums'

export function attachBearerInjector(axios: AxiosInstance): void {
  axios.interceptors.request.use((request): AxiosRequestConfig => {
    const authStore = useAuthStore()

    if (!authStore.accessToken) return request

    if (!request.headers) request.headers = {}
    request.headers['Authorization'] = `Bearer ${authStore.accessToken.token}`
    return request
  })
}

export function attachStaleTokenHandler(axios: AxiosInstance): void {
  axios.interceptors.response.use(
    response => response,
    async error => {
      const config = error?.config
      const isUnauthorized =
        error?.response?.status === HTTP_STATUS_CODES.UNAUTHORIZED &&
        !config?._retry

      if (!isUnauthorized) return Promise.reject(error)

      const authStore = useAuthStore()

      try {
        config._retry = true
        await authStore.restoreSession()
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${authStore.accessToken?.token}`
        return axios(config)
      } catch (_error) {
        authStore.logout()
        router.push({ name: ROUTE_NAMES.login })
        return Promise.reject(_error)
      }
    },
  )
}
