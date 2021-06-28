/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'

Vue.prototype.$hostName = 'http://192.168.0.245:9037'

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

const RegistrationPage = dynamicPage(() =>
    import ('~/components/user_registration/userRegistrationPage.vue'))

const CurrentUserEditingPage = dynamicPage( () =>
     import ('~/components/current_user_editing/currentUserEditingPage'))

const UsersEditingPage = dynamicPage(() =>
    import ('~/components/users_editing/usersEditingPage.vue'))

const AuthLogin = dynamicPage(() =>
    import ('~/views/auth/Form/FormLogin'))

const VcrmPage = dynamicPage(() =>
    import ('~/views/vcrm/VcrmPage'))

const PaymentMenuPage = dynamicPage(() =>
    import ('~/views/vcrm/Payment/Menu'))

const JournalOfPaymentDocumentsPage = dynamicPage(() =>
    import ('~/views/vcrm/Payment/PaymentDocument/JournalOfPaymentDocuments'))

const JournalOfPaymentDocumentsFromPayDocsPage = dynamicPage( () =>
    import ('~/views/vcrm/Payment/PaymentDocument/JournalOfPaymentDocuments/components/fromPayDocuments'))

const JournalOfEmailSendingPaymentDocumentsPage = dynamicPage(() =>
    import ('~/views/vcrm/Payment/PaymentDocument/JournalOfEmailSendingPaymentDocuments'))

const PaymentByCashboxPage = dynamicPage(() =>
    import ('~/views/vcrm/Payment/PaymentDocument/Modals/PaymentByCashbox.vue'))

const InternalPaymentPage = dynamicPage(() =>
    import ('~/views/vcrm/Payment/PaymentDocument/Modals/InternalPayment.vue'))

const MoneyDistributionPage = dynamicPage(() =>
    import ('~/views/vcrm/Payment/MoneyDistribution'))

const InputOfBalancesPage = dynamicPage(() =>
    import ('~/views/vcrm/Payment/InputOfBalances'))

const PaymentBudgetByDepartmentsPage = dynamicPage(() =>
    import ('~/views/vcrm/Payment/PaymentBudgetByDepartments'))

const RegisterOfDocumentsToPayPage = dynamicPage(() =>
    import ('~/views/vcrm/Payment/RegisterOfDocumentsToPay'))

const RegisterOfPaymentsByCashboxPage = dynamicPage(() =>
    import ('~/views/vcrm/Payment/RegisterOfPaymentsByCashbox'))

const GtinPage = dynamicPage(() =>
    import ('~/views/vcrm/Gtin/GtinPage'))

const MarkPage = dynamicPage(() =>
    import ('~/views/vcrm/Mark/MarkPage'))

const ChatPage = dynamicPage(() =>
    import ('~/views/vcrm/Chat/ChatPage'))

const SupplyMenuPage = dynamicPage(() =>
    import ('~/views/vcrm/Supply/Menu/MenuPage'))

const CommodityMenuPage = dynamicPage(() =>
    import ('~/views/vcrm/Supply/Сommodity/CommodityMenu/CommodityMenuPage'))

const CommodityLogOfSewingPlanPage = dynamicPage(() =>
    import('~/views/vcrm/Supply/Сommodity/CommodityLogOfSewingPlan/CommodityLogOfSewingPlanPage'))

const ListOfCommodityForSewingApplicationPage = dynamicPage(() =>
    import ('~/views/vcrm/Supply/Сommodity/ListOfCommodityForSewingApplication/ListOfCommodityForSewingApplicationPage'))

const RequisitionLogToSupplierPage = dynamicPage(() =>
    import ('~/views/vcrm/Supply/Сommodity/RequisitionLogToSupplier/RequisitionLogToSupplierPage'))

const StockBalancePage = dynamicPage(() =>
    import ('~/views/vcrm/Supply/Сommodity/StockBalance/StockBalancePage'))

const MaterialsPage = dynamicPage(() =>
    import ('~/views/vcrm/Supply/Materials'))

const WarehouseInventoryPage = dynamicPage(() => {
    import('~/views/vcrm/Supply/Сommodity/WarehouseInventory/WarehouseInventoryPage')
})

Vue.use(Router)

const createRouterConst = new Router({
    mode: 'history',
    scrollBehavior,
    routes: [{
            path: '/meridian',
            component: VcrmPage,
            children: [{
                    path: 'gtin',
                    name: 'GtinPage',
                    component: GtinPage,
                    meta: {
                        breadcrumb: [{
                                text: 'Профиль',
                                disabled: false,
                                href: 'Dashboard'
                            },
                            {
                                text: 'Журнал GTIN',
                                disabled: true,
                                href: 'GtinPage'
                            }
                        ]
                    }
                },

                {
                    path: 'mark',
                    name: 'MarkPage',
                    component: MarkPage,
                    meta: {
                        breadcrumb: [{
                                text: 'Профиль',
                                disabled: false,
                                href: 'Dashboard'
                            },
                            {
                                text: 'Журнал Кодов Маркировки',
                                disabled: true,
                                href: 'MarkPage'
                            }
                        ]
                    }
                },

                {
                    path: 'chat',
                    name: 'ChatPage',
                    component: ChatPage,
                    meta: {
                        breadcrumb: [{
                                text: 'Профиль',
                                disabled: false,
                                href: 'Dashboard'
                            },
                            {
                                text: 'Чат',
                                disabled: true,
                                href: 'ChatPage'
                            }
                        ]
                    }
                },

                {
                    path: 'registration_page',
                    name: 'RegistrationPage',
                    component: RegistrationPage,
                    meta: {
                        breadcrumb: [{
                            text: 'Регистрация нового пользователя',
                            disabled: false
                        }]
                    }
                },

                {
                  path: 'current_user_editing',
                  name: 'CurrentUserEditingPage',
                  component: CurrentUserEditingPage,
                  meta: {
                    breadcrumb: [{
                      text: 'Настройка профиля',
                      disabled: false
                    }]
                  }
                },

                {
                    path: 'users_editing',
                    name: 'UsersEditingPage',
                    component: UsersEditingPage,
                    meta: {
                        breadcrumb: [{
                            text: 'Редактирование аккаунтов пользователей',
                            disabled: false
                        }]
                    }
                },

                {
                    path: 'payment_menu',
                    name: 'PaymentMenu',
                    component: PaymentMenuPage,
                    meta: {
                        breadcrumb: [{
                            text: 'Меню реестра оплат',
                            disabled: false
                        }]
                    }
                },

                {
                    path: 'journal_of_payment_documents',
                    name: 'JournalOfPaymentDocuments',
                    component: JournalOfPaymentDocumentsPage
                },

                {
                    path: 'journal_of_payment_documents_from_pay_docs',
                    name: 'JournalOfPaymentDocumentsFromPayDocs',
                    component: JournalOfPaymentDocumentsFromPayDocsPage
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
                },

                {
                    path: 'warehouse_inventory',
                    name: 'WarehouseInventory',
                    component: WarehouseInventoryPage
                }
            ]
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
