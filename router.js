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
  import('~/views/auth/AuthPage'))

const RegistrationPage = dynamicPage(() =>
  import('~/components/user_registration/userRegistrationPage.vue'))

const CurrentUserEditingPage = dynamicPage(() =>
  import('~/components/current_user_editing/currentUserEditingPage'))

const UsersEditingPage = dynamicPage(() =>
  import('~/components/users_editing/usersEditingPage.vue'))

const AuthLogin = dynamicPage(() =>
  import('~/views/auth/Form/FormLogin'))

const VcrmPage = dynamicPage(() =>
  import('~/views/vcrm/VcrmPage'))

const PaymentMenuPage = dynamicPage(() =>
  import('~/views/vcrm/Payment/Menu'))

const JournalOfPaymentDocumentsPage = dynamicPage(() =>
  import('~/views/vcrm/Payment/PaymentDocument/JournalOfPaymentDocuments'))

const JournalOfEmailSendingPaymentDocumentsPage = dynamicPage(() =>
  import('~/views/vcrm/Payment/PaymentDocument/JournalOfEmailSendingPaymentDocuments'))

const PaymentByCashboxPage = dynamicPage(() =>
  import('~/views/vcrm/Payment/PaymentDocument/Modals/PaymentByCashbox.vue'))

const InternalPaymentPage = dynamicPage(() =>
  import('~/views/vcrm/Payment/PaymentDocument/Modals/InternalPayment.vue'))

const HistoryOfPaymentDocumentsPage = dynamicPage(() =>
  import('~/views/vcrm/Payment/HistoryOfJournalOfPaymentDocuments-not-using'))

const MoneyDistributionPage = dynamicPage(() =>
  import('~/views/vcrm/Payment/MoneyDistribution'))

const InputOfBalancesPage = dynamicPage(() =>
  import('~/views/vcrm/Payment/InputOfBalances'))

const PaymentBudgetByDepartmentsPage = dynamicPage(() =>
  import('~/views/vcrm/Payment/PaymentBudgetByDepartments'))

const RegisterOfDocumentsToPayPage = dynamicPage(() =>
  import('~/views/vcrm/Payment/RegisterOfDocumentsToPay'))

const RegisterOfPaymentsByCashboxPage = dynamicPage(() =>
  import('~/views/vcrm/Payment/RegisterOfPaymentsByCashbox'))

const GtinPage = dynamicPage(() =>
  import('~/views/vcrm/Gtin/GtinPage'))

const MarkPage = dynamicPage(() =>
  import('~/views/vcrm/Mark/MarkPage'))

const ChatPage = dynamicPage(() =>
  import('~/views/vcrm/Chat/ChatPage'))

const SupplyMenuPage = dynamicPage(() =>
  import('~/views/vcrm/Supply/Menu/MenuPage'))

const CommodityMenuPage = dynamicPage(() =>
  import('~/views/vcrm/Supply/Сommodity/CommodityMenu/CommodityMenuPage'))

const CommodityLogOfSewingPlanPage = dynamicPage(() =>
  import('~/views/vcrm/Supply/Сommodity/CommodityLogOfSewingPlan/CommodityLogOfSewingPlanPage'))

const ListOfCommodityForSewingApplicationPage = dynamicPage(() =>
  import('~/views/vcrm/Supply/Сommodity/ListOfCommodityForSewingApplication/ListOfCommodityForSewingApplicationPage'))

const RequisitionLogToSupplierPage = dynamicPage(() =>
  import('~/views/vcrm/Supply/Сommodity/RequisitionLogToSupplier/RequisitionLogToSupplierPage'))

const StockBalancePage = dynamicPage(() =>
  import('~/views/vcrm/Supply/Сommodity/StockBalance/StockBalancePage'))

const MaterialsPage = dynamicPage(() =>
  import('~/views/vcrm/Supply/Materials'))

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
    meta: {
      breadcrumb: [{
        text: 'Профиль',
        disabled: false,
        href: 'Dashboard'
      }
      ]
    },
    children: [{
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
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          {
            text: 'Регистрация нового пользователя',
            disabled: false
          }
        ]
      }
    },

    {
      path: 'current_user_editing',
      name: 'CurrentUserEditingPage',
      component: CurrentUserEditingPage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          {
            text: 'Настройка профиля',
            disabled: false
          }
        ]
      }
    },

    {
      path: 'users_editing',
      name: 'UsersEditingPage',
      component: UsersEditingPage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          {
            text: 'Редактирование аккаунтов пользователей',
            disabled: false
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
            text: 'Профиль',
            disabled: true
          },
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
      component: JournalOfPaymentDocumentsPage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          {
            text: 'Меню реестра оплат',
            disabled: false
          }
        ]
      }
    },

    {
      path: 'payment_by_cashbox',
      name: 'PaymentByCashbox',
      component: PaymentByCashboxPage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          {
            text: 'Меню реестра оплат',
            disabled: false
          }
        ]
      }
    },

    {
      path: 'internal_payment',
      name: 'InternalPayment',
      component: InternalPaymentPage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          {
            text: 'Меню реестра оплат',
            disabled: false
          }
        ]
      }
    },

    {
      path: 'payment_budget_by_departmens',
      name: 'PaymentBudgetByDepartments',
      component: PaymentBudgetByDepartmentsPage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          {
            text: 'Меню реестра оплат',
            disabled: false
          }
        ]
      }
    },

    {
      path: 'journal_of_email_sending_payment_documents',
      name: 'JournalOfEmailSendingPaymentDocuments',
      component: JournalOfEmailSendingPaymentDocumentsPage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          {
            text: 'Меню реестра оплат',
            disabled: false
          }
        ]
      }
    },

    {
      path: 'history_of_payment_documents',
      name: 'HistoryOfPaymentDocuments',
      component: HistoryOfPaymentDocumentsPage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          {
            text: 'Меню реестра оплат',
            disabled: false
          }
        ]
      }
    },

    {
      path: 'money_distribution',
      name: 'MoneyDistribution',
      component: MoneyDistributionPage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          {
            text: 'Меню реестра оплат',
            disabled: false
          }
        ]
      }
    },

    {
      path: 'input_of_balances',
      name: 'InputOfBalances',
      component: InputOfBalancesPage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          {
            text: 'Меню реестра оплат',
            disabled: false
          }
        ]
      }
    },

    {
      path: 'register_of_documents_to_pay',
      name: 'RegisterOfDocumentsToPay',
      component: RegisterOfDocumentsToPayPage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          {
            text: 'Меню реестра оплат',
            disabled: false
          }
        ]
      }
    },

    {
      path: 'register_of_payments_by_cashbox',
      name: 'RegisterOfPaymentsByCashbox',
      component: RegisterOfPaymentsByCashboxPage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          {
            text: 'Меню реестра оплат',
            disabled: false
          }
        ]
      }
    },

    {
      path: 'supply_menu',
      name: 'SupplyMenu',
      component: SupplyMenuPage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
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
          {
            text: 'Профиль',
            disabled: true
          },
          { text: 'АРМ Снабжение / Сырье (Снабжение)', disabled: false }
        ]
      }
    },

    {
      path: 'commodity_log_of_sewing_plan',
      name: 'CommodityLogOfSewingPlan',
      component: CommodityLogOfSewingPlanPage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          { text: 'АРМ Снабжение / Сырье (Снабжение)', disabled: false }
        ]
      }
    },

    {
      path: 'list_of_commodity_for_sewing_application',
      name: 'ListOfCommodityForSewingApplication',
      component: ListOfCommodityForSewingApplicationPage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          { text: 'АРМ Снабжение / Сырье (Снабжение)', disabled: false }
        ]
      }
    },

    {
      path: 'requisition_log_to_supplier',
      name: 'RequisitionLogToSupplier',
      component: RequisitionLogToSupplierPage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          { text: 'АРМ Снабжение / Сырье (Снабжение)', disabled: false }
        ]
      }
    },

    {
      path: 'stock_balance',
      name: 'StockBalance',
      component: StockBalancePage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          { text: 'АРМ Снабжение / Сырье (Снабжение)', disabled: false }
        ]
      }
    },

    {
      path: 'materials',
      name: 'Materials',
      component: MaterialsPage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          { text: 'АРМ Снабжение / Сырье (Снабжение)', disabled: false }
        ]
      }
    },

    {
      path: 'warehouse_inventory',
      name: 'WarehouseInventory',
      component: WarehouseInventoryPage,
      meta: {
        breadcrumb: [
          {
            text: 'Профиль',
            disabled: true
          },
          {
            text: 'АРМ Снабжение / Сырье (Снабжение)',
            disabled: false
          }
        ]
      }
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
