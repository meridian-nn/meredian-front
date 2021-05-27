import Cookies from 'js-cookie'
export default class HttpClient {
  constructor({ url }) {
    this.url = url
  }

  authorize(token) {
    this._token = token
  }

  fetch = async(method, methodUrl, params = {}) => {
    const url = new URL(this.url + methodUrl)

    const config = this.config(method, params)

    return await this.call(url, config)
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
      // eslint-disable-next-line require-await
      .then(async(res) => {
        const json = res.json()

        if (res.ok) {
          return json
        } else if (res.status === 401) {
          Cookies.remove('JWT')
        } else {
          return json.then((err) => { throw err })
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
