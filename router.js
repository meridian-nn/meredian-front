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

const PaymentMenuPage = dynamicPage(() =>
    import ('~/views/payment/Menu'))

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

const PaymentBudgetByDepartmentsPage = dynamicPage(() =>
    import ('~/views/payment/PaymentBudgetByDepartments'))

const RegisterOfDocumentsToPayPage = dynamicPage(() =>
    import ('~/views/payment/RegisterOfDocumentsToPay'))

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
            path: '/meridian/payment_menu',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'PaymentMenu',
                component: PaymentMenuPage,
                meta: {
                    breadcrumb: [
                        { text: 'Меню реестра оплат', disabled: false }
                    ]
                }
            }]
        },
        {
            path: '/meridian/journal_of_payment_documents',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'JournalOfPaymentDocuments',
                component: JournalOfPaymentDocumentsPage
            }]
        },
        {
            path: '/meridian/journal_of_email_sending_payment_documents',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'JournalOfEmailSendingPaymentDocuments',
                component: JournalOfEmailSendingPaymentDocumentsPage
            }]
        },
        {
            path: '/meridian/payment_by_cashbox',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'PaymentByCashbox',
                component: PaymentByCashboxPage
            }]
        },
        {
            path: '/meridian/internal_payment',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'InternalPayment',
                component: InternalPaymentPage
            }]
        },
        {
            path: '/meridian/history_of_payment_documents',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'HistoryOfPaymentDocuments',
                component: HistoryOfPaymentDocumentsPage
            }]
        },
        {
            path: '/meridian/money_distribution',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'MoneyDistribution',
                component: MoneyDistributionPage
            }]
        },
        {
            path: '/meridian/input_of_balances',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'InputOfBalances',
                component: InputOfBalancesPage
            }]
        },
        {
            path: '/meridian/payment_budget_by_departmens',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'PaymentBudgetByDepartments',
                component: PaymentBudgetByDepartmentsPage
            }]
        },
        {
            path: '/meridian/register_of_documents_to_pay',
            component: VcrmPage,
            children: [{
                path: '',
                name: 'RegisterOfDocumentsToPay',
                component: RegisterOfDocumentsToPayPage
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