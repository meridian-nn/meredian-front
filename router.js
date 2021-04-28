/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'

Vue.prototype.$hostName = 'http://192.168.1.70:9037'

const dynamicPage = importer => () => {
    return importer().then(mod => mod.default || mod)
}

function scrollBehavior(to, from, savedPosition) {
    let position = { x: 0, y: 0 }

    if (to.name === from.name) {
        return false
    }

    if (savedPosition) {
        position = savedPosition
    }

    return position
}

const AuthPage = dynamicPage(() =>
    import ('~/views/auth/AuthPage'))
const AuthLogin = dynamicPage(() =>
    import ('~/views/auth/Form/FormLogin'))
const VcrmPage = dynamicPage(() =>
    import ('~/views/vcrm/VcrmPage'))
const DashboardPage = dynamicPage(() =>
    import ('~/views/vcrm/Dashboard'))
const PaymentDocumentPage = dynamicPage(() =>
    import ('~/views/payment/PaymentDocument/JournalOfPaymentDocuments'))
const PaymentByCashboxPage = dynamicPage(() =>
    import ('~/views/payment/PaymentDocument/Modals/PaymentByCashbox.vue'))
const InternalPaymentPage = dynamicPage(() =>
    import ('~/views/payment/PaymentDocument/Modals/InternalPayment.vue'))
const HistoryOfPaymentDocumentsPage = dynamicPage(() =>
    import ('~/views/payment/HistoryOfJournalOfPaymentDocuments'))
const MoneyDistributionPage = dynamicPage(() =>
    import ('~/views/payment/MoneyDistribution'))
const InputOfBalancesPage = dynamicPage(() =>
    import ('~/views/payment/InputOfBalances'))

Vue.use(Router)

const createRouterConst = new Router({
    mode: 'history',

    scrollBehavior,

    routes: [{
            path: '/',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'Dashboard',
                component: DashboardPage
            }]
        },
        {
            path: '/',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'PaymentDocument',
                component: PaymentDocumentPage
            }]
        },
        {
            path: '/',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'PaymentByCashbox',
                component: PaymentByCashboxPage
            }]
        },
        {
            path: '/',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'InternalPayment',
                component: InternalPaymentPage
            }]
        },
        {
            path: '/',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'HistoryOfPaymentDocuments',
                component: HistoryOfPaymentDocumentsPage
            }]
        },
        {
            path: '/',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'MoneyDistribution',
                component: MoneyDistributionPage
            }]
        },
        {
            path: '/',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'InputOfBalances',
                component: InputOfBalancesPage
            }]
        },
        {
            path: '/auth',
            name: 'Auth',
            component: AuthPage,
            children: [{
                path: '/login',
                name: 'Login',
                component: AuthLogin
            }]
        }
    ].filter((route) => {
        return process.env.NODE_ENV !== 'production' ? route : !('production' in route)
    })
})

export function createRouter() {
    return createRouterConst
}