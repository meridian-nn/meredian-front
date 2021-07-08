// import Cookies from 'js-cookie'
import size from 'lodash/size'
export default class HttpClient {
  constructor({ url }) {
    this.url = url
  }

  authorize(token) {
    this._token = token
  }

  fetch = async(method, methodUrl, params = {}) => {
    try {
      const url = new URL(this.url + methodUrl)

      if (method === 'GET' && size(params) > 0) {
        url.search = new URLSearchParams(params).toString()
      }

      const config = this.config(method, params)

      return await this.call(url, config)
    } catch (e) {
      console.log(e)
    }
  }

  config(method, params = {}) {
    return {
      method,
      ...(method === 'POST' && {
        body: JSON.stringify(params)
      }),
      headers: this.headers
    }
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

  get headers() {
    const headers = {
      'Content-Type': 'application/json'
    }

    if (window.$nuxt.$store.state.auth.token) {
      headers.Authorization = 'Basic ' + window.$nuxt.$store.state.auth.token
    }

    if (this._token) {
      headers.Authorization = `Bearer ${this._token}`
    }

    return headers
  }
}
