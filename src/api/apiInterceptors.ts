import { HTTP_STATUS_CODES } from '@distributedlab/json-api-client'
import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store'
import { DateUtil } from '@/utils'

export function attachBearerInjector(axios: AxiosInstance): void {
  axios.interceptors.request.use((request): AxiosRequestConfig => {
    const { accessToken } = useAuthStore()

    if (!accessToken || DateUtil.toTimestamp() >= accessToken.expiresIn)
      return request

    if (!request.headers) request.headers = {}
    request.headers['Authorization'] = `Bearer ${accessToken.token}`
    return request
  })
}

export function attachStaleTokenHandler(axios: AxiosInstance): void {
  axios.interceptors.response.use(
    response => response,
    async error => {
      const config = error?.config
      const { restoreSession, logout } = useAuthStore()
      const isUnauthorized =
        error?.response?.status === HTTP_STATUS_CODES.UNAUTHORIZED &&
        !config?._retry &&
        error.config.url !== '/integrations/auth/refresh'

      if (!isUnauthorized) return Promise.reject(error)

      try {
        config._retry = true
        await restoreSession()
        return axios(config)
      } catch (_error) {
        try {
          await logout()
        } catch (logoutError) {
          return Promise.reject(logoutError)
        }
        return Promise.reject(_error)
      }
    },
  )
}
