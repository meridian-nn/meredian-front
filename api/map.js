export const factory = send => ({
  auth: {
    login(credentials) {
      return send('POST', '', { ...credentials })
    }
  },

  code: {
    markCodeList(params) {
      return send('POST', '/findAll?page=0&size=200', { ...params })
    },

    markCodeSave(params) {

    },

    gtinCodeList(params) {
      return send('POST', '/gtin/findAll?page=0&size=99999999', { ...params })
    },

    gtinCodeSave(params) {
      return send('POST', '/gtinRequest/saveGtinRequest', { ...params })
    },
  }
})
