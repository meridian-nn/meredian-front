export default {
  ssr: false,

  head: {
    titleTemplate: '%s - foxPro',
    title: 'foxPro',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  css: [],

  components: true,

  plugins: [
    // { src: '~/plugins/bootstrap', mode: 'client' }
  ],

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/router'
  ],

  modules: [
    '@nuxtjs/axios'
  ],
  // server: {
  //   host: '0.0.0.0',
  //   port: 8000 // default: 3000
  // },

  axios: {},

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      themes: {
        light: {
          blue: '#639db1',
          secondary: '#eaeaea'
        }
      }
    }
  },

  build: {}
}
