/* eslint-disable */
import path from 'path'
require('dotenv').config({
    path: path.resolve(__dirname, 'config', '.env')
})

export default {
    ssr: false,

    env: {
        USER: process.env.USER,
        PASSWORD: process.env.PASSWORD,
        API_HOST_SOCKET: process.env.API_HOST_SOCKET,
        API_HOST: process.env.API_HOST,
        YM_ENV: process.env.YM_ENV
    },

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
        '~/plugins/custom-compare.js',
        '~/plugins/number-to-sum',
        '~/plugins/criterias-for-requests',
        '~/plugins/mapping-for-responses',
        '~/plugins/mapping-for-queryes-params',
        '~/plugins/system-methods',
        { src: '~/plugins/api', mode: 'client' },
        { src: '~/plugins/format-date' },
        { src: '~plugins/vue-tables-2.js', ssr: false },
        { src: '~plugins/vue-numeric.js', ssr: false },
        { src: '~plugins/vue-json-excel.js', ssr: false },
        { src: '~plugins/vue-html-to-paper.js', ssr: false },
        { src: '~/plugins/pluralize', ssr: false }
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
        '@nuxtjs/proxy'
    ],
    proxy: {
        // '/meridian': {
        //   target: 'http://192.168.1.70:9037'
        // }
    },
    server: {
        host: '0.0.0.0',
        port: 8000 // default: 3000
    },

    axios: {
        baseURL: 'http://192.168.1.70:9037/meridian',
        // proxy: true,
        mode: 'no-cors',
        auth: {
            username: 'admin',
            password: 'Wtrkop45'
        }
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
        vendor: ['vue-tables-2', 'vue-json-excel', 'vue-html-to-paper', 'vue-numeric']
    }
}