import axios from 'axios'
import { config } from '@/config'
import { JsonApiClient } from '@distributedlab/json-api-client'
import {
  attachBearerInjector,
  attachStaleTokenHandler,
} from './apiInterceptors'

const axiosInstance = axios.create()
attachBearerInjector(axiosInstance)
attachStaleTokenHandler(axiosInstance)

export const api = new JsonApiClient({
  axios: axiosInstance,
  baseUrl: config.API_URL,
})
