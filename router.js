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
const JournalOfPaymentDocumentsPage = dynamicPage(() =>
    import ('~/views/payment/PaymentDocument/JournalOfPaymentDocuments'))
const JournalOfEmailSendingPaymentDocumentsPage = dynamicPage(() =>
    import ('~/views/payment/PaymentDocument/JournalOfEmailSendingPaymentDocuments'))
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
const GtinPage = dynamicPage(() =>
    import ('~/views/vcrm/Dashboard/Gtin'))
const MarkPage = dynamicPage(() =>
    import ('~/views/vcrm/Dashboard/Mark'))
const ChatPage = dynamicPage(() =>
    import ('~/views/vcrm/Dashboard/Chat/ChatPage'))

Vue.use(Router)

const createRouterConst = new Router({
    mode: 'history',

    scrollBehavior,

    routes: [{
            path: '/meridian',
            component: VcrmPage,
            children: [{
                path: 'dashboard',
                name: 'Dashboard',
                component: DashboardPage,
                children: [{
                        path: 'gtin',
                        name: 'GtinPage',
                        component: GtinPage,
                        meta: {
                            breadcrumb: [
                                { text: 'Профиль', disabled: false, href: 'Dashboard' },
                                { text: 'Журнал GTIN', disabled: true, href: 'GtinPage' }
                            ]
                        }
                    },
                    {
                        path: 'mark',
                        name: 'MarkPage',
                        component: MarkPage,
                        meta: {
                            breadcrumb: [
                                { text: 'Профиль', disabled: false, href: 'Dashboard' },
                                { text: 'Журнал Кодов Маркировки', disabled: true, href: 'MarkPage' }
                            ]
                        }
                    },


                    {
                        path: 'chat',
                        name: 'ChatPage',
                        component: ChatPage,
                        meta: {
                            breadcrumb: [
                                { text: 'Профиль', disabled: false, href: 'Dashboard' },
                                { text: 'Чат', disabled: true, href: 'ChatPage' }
                            ]
                        }
                    }
                ],
            }]
        },
        {
            path: '/meridian',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'JournalOfPaymentDocuments',
                component: JournalOfPaymentDocumentsPage
            }]
        },
        {
            path: '/meridian',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'JournalOfEmailSendingPaymentDocuments',
                component: JournalOfEmailSendingPaymentDocumentsPage
            }]
        },
        {
            path: '/meridian',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'PaymentByCashbox',
                component: PaymentByCashboxPage
            }]
        },
        {
            path: '/meridian',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'InternalPayment',
                component: InternalPaymentPage
            }]
        },
        {
            path: '/meridian',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'HistoryOfPaymentDocuments',
                component: HistoryOfPaymentDocumentsPage
            }]
        },
        {
            path: '/meridian',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'MoneyDistribution',
                component: MoneyDistributionPage
            }]
        },
        {
            path: '/meridian',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'InputOfBalances',
                component: InputOfBalancesPage
            }]
        },
        {
            path: '/meridian/auth',
            name: 'Auth',
            component: AuthPage,
            children: [{
                path: 'login',
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