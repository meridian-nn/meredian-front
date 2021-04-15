export const factory = send => ({
  auth: {
    login(credentials) {
      return send('POST', '', { ...credentials })
    },

    user: {
      get() {
        return send('GET', '/auth/findByCurrentLogin',)
      }
    },
  },

  code: {
    markCodeList(params) {
      return send('GET', '/markCode/findAll?page=0&size=9999')
    },

    markCodeSave(params) {

    },

    gtinCodeList(params) {
      return send('GET', `/gtin/findAll?page=0&size=99999999&${new URLSearchParams(params).toString()}`)
    },

    gtinCodeSave(params) {
      return send('POST', `/gtinRequest/saveGtinRequest&${new URLSearchParams(params).toString()}`)
    },
  }
})
