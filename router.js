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
    import ('~/views/payment/HistoryOfJournalOfPaymentDocuments-not-using'))

const MoneyDistributionPage = dynamicPage(() =>
    import ('~/views/payment/MoneyDistribution'))

const InputOfBalancesPage = dynamicPage(() =>
    import ('~/views/payment/InputOfBalances'))

const PaymentBudgetByDepartmentsPage = dynamicPage(() =>
    import ('~/views/payment/PaymentBudgetByDepartments'))

const RegisterOfDocumentsToPayPage = dynamicPage(() =>
    import ('~/views/payment/RegisterOfDocumentsToPay'))

const RegisterOfPaymentsByCashboxPage = dynamicPage(() =>
    import ('~/views/payment/RegisterOfPaymentsByCashbox'))

const GtinPage = dynamicPage(() =>
    import ('~/views/barcode/Gtin'))

const MarkPage = dynamicPage(() =>
    import ('~/views/barcode/Mark'))

const ChatPage = dynamicPage(() =>
    import ('~/views/vcrm/Dashboard/Chat/ChatPage'))

const SupplyMenuPage = dynamicPage(() =>
    import ('~/views/supply/Menu'))

const CommodityMenuPage = dynamicPage(() =>
    import ('~/views/supply/Сommodity/Menu'))

const CommodityLogOfSewingPlanPage = dynamicPage(() =>
    import ('~/views/supply/Сommodity/CommodityLogOfSewingPlan'))

const ListOfCommodityForSewingApplicationPage = dynamicPage(() =>
    import ('~/views/supply/Сommodity/ListOfCommodityForSewingApplication'))

const RequisitionLogToSupplierPage = dynamicPage(() =>
    import ('~/views/supply/Сommodity/RequisitionLogToSupplier'))

const StockBalancePage = dynamicPage(() =>
    import ('~/views/supply/Сommodity/StockBalance'))

const MaterialsPage = dynamicPage(() =>
    import ('~/views/supply/Materials'))

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
                    },

                    {
                        path: 'payment_menu',
                        name: 'PaymentMenu',
                        component: PaymentMenuPage,
                        meta: {
                            breadcrumb: [
                                { text: 'Меню реестра оплат', disabled: false }
                            ]
                        }
                    },

                    {
                        path: 'journal_of_payment_documents',
                        name: 'JournalOfPaymentDocuments',
                        component: JournalOfPaymentDocumentsPage
                    },

                    {
                        path: 'payment_by_cashbox',
                        name: 'PaymentByCashbox',
                        component: PaymentByCashboxPage
                    },

                    {
                        path: 'internal_payment',
                        name: 'InternalPayment',
                        component: InternalPaymentPage
                    },

                    {
                        path: 'payment_budget_by_departmens',
                        name: 'PaymentBudgetByDepartments',
                        component: PaymentBudgetByDepartmentsPage
                    },

                    {
                        path: 'journal_of_email_sending_payment_documents',
                        name: 'JournalOfEmailSendingPaymentDocuments',
                        component: JournalOfEmailSendingPaymentDocumentsPage
                    },

                    {
                        path: 'history_of_payment_documents',
                        name: 'HistoryOfPaymentDocuments',
                        component: HistoryOfPaymentDocumentsPage
                    },

                    {
                        path: 'money_distribution',
                        name: 'MoneyDistribution',
                        component: MoneyDistributionPage
                    },

                    {
                        path: 'input_of_balances',
                        name: 'InputOfBalances',
                        component: InputOfBalancesPage
                    },

                    {
                        path: 'register_of_documents_to_pay',
                        name: 'RegisterOfDocumentsToPay',
                        component: RegisterOfDocumentsToPayPage
                    },

                    {
                        path: 'register_of_payments_by_cashbox',
                        name: 'RegisterOfPaymentsByCashbox',
                        component: RegisterOfPaymentsByCashboxPage
                    },

                    {
                        path: 'supply_menu',
                        name: 'SupplyMenu',
                        component: SupplyMenuPage,
                        meta: {
                            breadcrumb: [
                                { text: 'АРМ Снабжение', disabled: false }
                            ]
                        }
                    },

                    {
                        path: 'commodity_menu',
                        name: 'CommodityMenu',
                        component: CommodityMenuPage,
                        meta: {
                            breadcrumb: [
                                { text: 'АРМ Снабжение / Сырье (Снабжение)', disabled: false }
                            ]
                        }
                    },

                    {
                        path: 'commodity_log_of_sewing_plan',
                        name: 'CommodityLogOfSewingPlan',
                        component: CommodityLogOfSewingPlanPage,
                    },

                    {
                        path: 'list_of_commodity_for_sewing_application',
                        name: 'ListOfCommodityForSewingApplication',
                        component: ListOfCommodityForSewingApplicationPage,
                    },

                    {
                        path: 'requisition_log_to_supplier',
                        name: 'RequisitionLogToSupplier',
                        component: RequisitionLogToSupplierPage,
                    },

                    {
                        path: 'stock_balance',
                        name: 'StockBalance',
                        component: StockBalancePage,
                    },

                    {
                        path: 'materials',
                        name: 'Materials',
                        component: MaterialsPage
                    }

                ]
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