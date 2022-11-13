import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: 'http://172.16.200.63:9200/sca/', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 500000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (getToken()) {
      config.headers['authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    // console.log('service.interceptors.request', error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    // console.log('service.interceptors.response success: ', response)
    const res = response.data
    if (response['status'] === 200) {
      return res
    } else {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  async error => {
    var err_msg = error.response['data']['message']
    Message({
      message: err_msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
