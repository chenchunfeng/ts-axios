import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeader } from '../helpers/headers'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, method = 'get', url, headers, responseType, timeout } = config

    const request = new XMLHttpRequest()
    if (responseType) {
      request.responseType = responseType
    }
    if (timeout) {
      request.timeout = timeout
    }
    // 网络错误
    request.onerror = function() {
      reject(
        createError({
          message: 'netword error',
          config,
          request
        })
      )
    }
    request.ontimeout = function() {
      reject(
        createError({
          message: `timeout of ${timeout} ms exceeded`,
          config,
          request,
          code: 'CONNABORTED'
        })
      )
    }
    // 第三个参数为异步
    request.open(method.toUpperCase(), url!, true)

    // 监听完成回调
    request.onreadystatechange = () => {
      // 4 为完成
      if (request.readyState !== 4) {
        return
      }
      if (request.status === 0) {
        return
      }

      // 返回结果
      const response: AxiosResponse = {
        request,
        config,
        headers: parseHeader(request.getAllResponseHeaders()),
        data: responseType && responseType !== 'text' ? request.response : request.responseText,
        status: request.status,
        statusText: request.statusText
      }
      handleResponse(response)
    }
    // 处理非200错误码
    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError({
            message: `request failded witch status code ${response.status}`,
            config,
            request,
            response
          })
        )
      }
    }
    // 添加header
    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name] // 都没用到，删除又有什么用.....
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    // 取消CancelToken
    if (config.CancelToken) {
      config.CancelToken.promise.then(reason => {
        reject(reason)
        request.abort()
      })
    }

    request.send(data)
  })
}