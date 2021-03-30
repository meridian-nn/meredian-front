import Cookies from 'js-cookie'
import { timeout } from '~/utils/helpers'
export default {
  state: () => ({
    token: Cookies.get('JWT'),
    email: null,
    registerParams: {
      email: '',
      password: ''
    }
  }),

  actions: {
    async login({ dispatch, commit }, credentials) {
      // const response = await this.$api.auth.login(credentials)

      await timeout(2000)

      const response = { ...credentials }

      dispatch('saveAuthToken', response)

      dispatch('authorize', response)

      commit('SET_TOKEN', response)
    },

    logout() {
      Cookies.remove('JWT')

      window.location.reload()
    },

    saveAuthToken(_, token) {
      Cookies.set('JWT', token)
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
    }
  }
}
