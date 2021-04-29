/* eslint-disable */
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
        '~/plugins/axios',
        '~/plugins/utils',
        { src: '~plugins/vue-tables-2.js', ssr: false },
        { src: '~plugins/vue-json-excel.js', ssr: false },
        { src: '~plugins/vue-html-to-paper.js', ssr: false }
        // { src: '~/plugins/bootstrap', mode: 'client' }
    ],

    buildModules: [
        '@nuxtjs/eslint-module',
        '@nuxtjs/stylelint-module',
        '@nuxtjs/vuetify',
        '@nuxtjs/router',
        '@nuxt/components'
    ],

    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/auth-next',
        '@nuxtjs/proxy'
    ],

    proxy: {
        '/meridian': {
            target: 'http://localhost:9037'
        }
    },
    // server: {
    //   host: '0.0.0.0',
    //   port: 8000 // default: 3000
    // },

    axios: {
        proxy: true,
        credentials: false,
        mode: 'no-cors'
    },

    auth: {
        strategies: {
            local: {
                token: {
                    required: false,
                    type: false
                },
                endpoints: {
                    login: { url: '/meridian/auth/findByCurrentLogin', method: 'get', propertyName: 'data' },
                    logout: false
                }
            }
        },

        redirect: {
            login: '/auth',
            logout: '/',
            callback: '/auth',
            home: '/'
        }
    },

    router: {
        middleware: ['auth']
    },

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

    build: {
        vendor: ['vue-tables-2', 'vue-json-excel', 'vue-html-to-paper']
    }
}