import { AxiosRequestConfig, AxiosStatic } from './types'
import { extend } from './helpers/util'
import Axios from './core/Axios'
import defaults from './defaults'
import mergeConfig from './core/mergeConfigs'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)

  extend(instance, context)

  return instance as AxiosStatic
}

const axios = createInstance(defaults)

axios.create = function(config) {
  return createInstance(mergeConfig(defaults, config))
}

export default axios
