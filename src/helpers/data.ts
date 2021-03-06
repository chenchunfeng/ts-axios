import { isPlainObject } from './util'

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    data = JSON.stringify(data)
  }

  return data
}

export function transformResponse(data: any): any {
  if (data && typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
      console.log(e)
    }
  }

  return data
}
