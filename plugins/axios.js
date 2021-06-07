export default function({ $axios, store }) {
  $axios.onError((error) => {
    if (error.response.status === 500) {
      alert(error + ' ' + error.response.data)
    }
  })

  if (store.state.auth.token) {
    $axios.defaults.headers.common.Authorization = `Basic ${store.state.auth.token}`
  }
}
