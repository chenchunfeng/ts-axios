import { AxiosRequestConfig, AxiosPromise } from './types'
import { buildURL } from '../helpers/url'
import { transformRequest } from '../helpers/data'
import { transformHeaders } from '../helpers/headers'
import xhr from './xhr'

function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfing(config)
  return xhr(config)
}

function processConfing(config: AxiosRequestConfig): void {
  config.url = transformConfig(config)
  config.headers = transformHeadersData(config)
  config.data = transformRequestData(config)
}

function transformConfig(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

function transformHeadersData(config: AxiosRequestConfig): Object {
  const { headers = {}, data } = config
  return transformHeaders(headers, data)
}

function transformRequestData(config: AxiosRequestConfig): string {
  return transformRequest(config.data)
}

export default axios
