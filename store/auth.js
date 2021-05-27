import Cookies from 'js-cookie'
import { btoa } from 'isomorphic-base64'
import { timeout } from '~/utils/helpers'
export default {
  state: () => ({
    token: Cookies.get('JWTmeredian'),
    email: null,
    registerParams: {
      email: '',
      password: ''
    }
  }),

  actions: {
    async login({ dispatch, commit }, credentials) {
      // eslint-disable-next-line no-useless-catch
      try {
        await this.$axios.$get('http://192.168.1.70:9037/meridian/gtin/findAll?page=0&size=200', { auth: credentials, headers: { 'X-Requested-With': 'XMLHttpRequest' } })

        await timeout(200)

        const response = btoa(`${credentials.username}:${credentials.password}`)

        dispatch('saveAuthToken', response)
      } catch (e) {
        throw e
      }
    },

    logout() {
      Cookies.remove('JWTmeredian')

      window.location.reload()
    },

    saveAuthToken(_, token) {
      Cookies.set('JWTmeredian', token)
    },

    authorize({ state, getters }, token) {
      if (token || getters.hasSession) {
        this.$apiClient.authorize(token || state.token)
      }
    },

    async sendEmail({ commit }, params) {
      await this.$api.auth.sendEmail(params)

      commit('SET_EMAIL', params.email)
    },

    async confirmPassword({ state }, params) {
      return await this.$api.auth.confirmPassword({
        ...params
      })
    }
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },

    SET_EMAIL(state, email) {
      state.email = email
    }
  },

  getters: {
    hasSession(state) {
      return Boolean(state.token)
    },

    getToken(state) {
      return state.token
    }
  }
}
