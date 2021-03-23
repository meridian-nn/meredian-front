import Cookies from 'js-cookie'

export default function({ store }) {
  const token = Cookies.get('AUTH_TOKEN_COOKIE')

  if (token) {
    store.commit('auth/SET_TOKEN', token)

    store.dispatch('profile/fetch', token)
  }
}
