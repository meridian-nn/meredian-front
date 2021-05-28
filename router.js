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

const PaymentMenuPage = dynamicPage(() =>
  import ('~/views/vcrm/Payment/Menu'))

const JournalOfPaymentDocumentsPage = dynamicPage(() =>
  import ('~/views/vcrm/Payment/PaymentDocument/JournalOfPaymentDocuments'))

const JournalOfEmailSendingPaymentDocumentsPage = dynamicPage(() =>
  import ('~/views/vcrm/Payment/PaymentDocument/JournalOfEmailSendingPaymentDocuments'))

const PaymentByCashboxPage = dynamicPage(() =>
  import ('~/views/vcrm/Payment/PaymentDocument/Modals/PaymentByCashbox.vue'))

const InternalPaymentPage = dynamicPage(() =>
  import ('~/views/vcrm/Payment/PaymentDocument/Modals/InternalPayment.vue'))

const HistoryOfPaymentDocumentsPage = dynamicPage(() =>
  import ('~/views/vcrm/Payment/HistoryOfJournalOfPaymentDocuments-not-using'))

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

Vue.use(Router)

const createRouterConst = new Router({
    mode: 'history',
    scrollBehavior,
    routes: [
      {
        path: '/meridian',
        component: VcrmPage,
        children: [
          {
            path: 'gtin',
            name: 'GtinPage',
            component: GtinPage,
            meta: {
              breadcrumb: [
                {
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
              breadcrumb: [
                {
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
              breadcrumb: [
                {
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
            path: 'payment_menu',
            name: 'PaymentMenu',
            component: PaymentMenuPage,
            meta: {
              breadcrumb: [
                {
                  text: 'Меню реестра оплат',
                  disabled: false
                }
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
