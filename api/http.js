const rpcUrl = process.env.RPC_URL || 'https://qvm2e.mocklab.io'

async function call(method, params, headers = {}) {
  const axios = require('axios')

  const config = {
    auth: {
      username: 'vrum123',
      password: 'avadon123'
    },
    headers
  }

  try {
    const response = await axios.post(rpcUrl, config)
    return response.data.result
  } catch (error) {
    console.log('error:', error)
    return error
  }
}

export default call
