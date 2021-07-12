// import Cookies from 'js-cookie'
import size from 'lodash/size'
export default class HttpClient {
  constructor({ url }) {
    this.url = url
  }

  authorize(token) {
    this._token = token
  }

  composeUrl(method, methodUrl, params) {
    const url = new URL(this.url + methodUrl)

    if (method === 'GET' && size(params) > 0) {
      url.search = new URLSearchParams(params).toString()
    }

    return url
  }

  composeConfig(method, params = {}, headers = this.headersJson) {
    return {
      method,
      ...(method === 'POST' && {
        body: JSON.stringify(params)
      }),
      headers
    }
  }

  fetch = async(method, methodUrl, params = {}) => {
    const url = this.composeUrl(method, methodUrl, params)
    const config = this.composeConfig(method, params)

    return await this.call(url, config)
  }

  async call(url, config) {
    const response = await fetch(url, config)
      .then((res) => {
        const json = res.json()

        if (res.ok) {
          return json
        } else {
          throw res
        }
      }).catch((error) => {
        throw error
      })

    return response
  }

  get headersJson() {
    const headers = {
      'Content-Type': 'application/json'
    }

    if (window.$nuxt.$store.state.auth.token) {
      headers.Authorization = 'Basic ' + window.$nuxt.$store.state.auth.token
    }

    return headers
  }
}
