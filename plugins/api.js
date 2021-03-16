import { factory } from '~/api/map'
import HttpClient from '~/api/http'

export default function(ctx, inject) {
  const client = new HttpClient({ url: process.env.API_HOST })

  const api = factory(client.fetch)

  ctx.$api = api
  ctx.$apiClient = client

  inject('api', api)
  inject('apiClient', client)
}
