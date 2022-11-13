import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 500000 // request timeout
})

console.log('process.env.NODE_ENV', process.env.NODE_ENV)

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['authorization'] = getToken()
      // config.headers['authorization'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDIwLTEwLTE1IDEwOjUwOjQ5IiwiZXhwIjoiMjAyMC0xMC0xNSAxMjo1MDo0OSIsImV4cFJlYXNvbiI6bnVsbCwic3ViIjoicGxhdGZvcm1Vc2VyIiwidXNlciI6eyJjYWNoZUtleSI6IlowMDQ0U0FTUEMiLCJnaWQiOiJaMDA0NFNBUyIsImVtYWlsIjoibmFuLnpob3UuZXh0QHNpZW1lbnMuY29tIiwiY2xpZW50VHlwZSI6IlBDIiwiYXBwSWQiOiIxMDAyIn0sImR1cmF0aW9uIjoiNzE5OSIsImV4cGlyZWQiOmZhbHNlLCJleHBpcmVkSGFsZiI6ZmFsc2UsInRhc2tTZXJ2aWNlIjpmYWxzZSwiYW5vbnltb3VzIjpmYWxzZSwicGxhdGZvcm1Vc2VyIjp0cnVlLCJlbWFsbFVzZXIiOmZhbHNlLCJzdXBwbGllclVzZXIiOmZhbHNlfQ.AgkfUTxYzUQLnC0VRr0_5vxkDV483DYZ4lBFVpVVGtc'
    }
    // console.log(config.headers['authorization'])
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
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // console.log('service.interceptors.response success: ', response)
    // const res = response.data
    // if (res['success']) {
    //   return response
    // } else {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //   return Promise.reject(new Error(res.message || 'Error'))
    // }
    return response
  },
  async error => {
    // console.log('service.interceptors.response error: ', error)
    // console.log('service.interceptors.response error.response: ', error.response)
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    // return Promise.reject(error)
    const errorResponseData = error.response.data || {}
    if (errorResponseData.message === '用户token无效') {
      Message({
        message: errorResponseData.message,
        type: 'error',
        duration: 5 * 1000
      })
      // 后端退出登录必须传token，都失效了，怎么传token(后端问题)
      // const url = await this.$store.dispatch('user/logout')
      // console.log('跳出登录的地址是', url)
      // window.location.href = url

      const loginUrl = process.env.VUE_APP_LOGIN_URL
      const serviceUrl = process.env.VUE_APP_SERVICE_URL
      axios.get(`${loginUrl}`, {
        params: {
          clientType: 'PC',
          appId: '0430',
          redirectUrl: serviceUrl,
          _: Date.now()
        }
      }).then((res) => {
        const data = res.data || {}
        console.log(res['data'])
        data.data && (window.location.href = data.data)
      })
    } else {
      Message({
        message: errorResponseData.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  }
)

export default service
