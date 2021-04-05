import Vue from 'vue'
import Router from 'vue-router'

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

const AuthPage = dynamicPage(() => import('~/views/auth/AuthPage'))
const AuthLogin = dynamicPage(() => import('~/views/auth/Form/FormLogin'))
const VcrmPage = dynamicPage(() => import('~/views/vcrm/VcrmPage'))
const DashboardPage = dynamicPage(() => import('~/views/vcrm/Dashboard'))
const PaymentDocumentPage = dynamicPage(() => import('~/views/payment/PaymentDocument'))
const GtinPage = dynamicPage(() => import('~/views/vcrm/Dashboard/Gtin'))
const MarkPage = dynamicPage(() => import('~/views/vcrm/Dashboard/Mark'))

Vue.use(Router)

const createRouterConst = new Router({
  mode: 'history',

  scrollBehavior,

  routes: [
    {
      path: '/',
      component: VcrmPage,
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: DashboardPage,
          children: [
            {
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
              path: 'payment-document',
              name: 'PaymentDocumentPage',
              component: PaymentDocumentPage,
              meta: {
                breadcrumb: [
                  { text: 'Профиль', disabled: false, href: 'Dashboard' },
                  { text: 'Реестр оплат', disabled: true, href: 'PaymentDocumentPage' }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      path: '/auth',
      name: 'Auth',
      component: AuthPage,
      children: [
        {
          path: 'login',
          name: 'Login',
          component: AuthLogin
        }
      ]
    }
  ].filter((route) => {
    return process.env.NODE_ENV !== 'production' ? route : !('production' in route)
  })
})

export function createRouter() {
  return createRouterConst
}
