export default {
  state: () => ({
    users: null,
    user: null
  }),

  actions: {
    async fetchUsers({ commit }) {
      const users = await this.$http.$get('/users')

      commit('SET_USERS', users)
    },

    async fetch({ commit }, id) {
      const user = await this.$http.$get(`/users/${id}`)

      commit('SET_USER', user)
    }
  },

  mutations: {
    SET_USERS(state, users) {
      state.users = users
    },

    SET_USER(state, user) {
      state.user = user
    }
  },

  getters: {
    hasUser: state => (params) => {
      // eslint-disable-next-line max-len
      return state.users.find(user => user.login === params.login && user.password === params.password ? user : false)
    }
  }
}
