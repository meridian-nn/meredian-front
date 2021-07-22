<template>
  <v-app class="">
    <v-navigation-drawer
      v-model="drawer"
      class="header secondary"
      app
      mini-variant-width="84"
      :mini-variant.sync="mini"
      width="285"
    >
      <v-toolbar class="blue">
        <img
          class="header__logo"
          src="~/assets/img/Logo.png"
          alt="logo"
        >
      </v-toolbar>

      <v-divider />

      <v-list @click.native.stop="mini = mini">
        <v-list-item
          v-if="isHaveGTINRole"
          link
          :to="{ name: 'GtinPage' }"
        >
          <v-list-item-action class="pr-1 pl-2 mr-1">
            <v-icon class="blue--text">
              mdi-barcode-scan
            </v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title class="font-weight-medium">
              Маркировка
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="isCanOpenPaymentRegister"
          link
          :to="{ name: 'PaymentMenu' }"
        >
          <v-list-item-action class="pr-1 pl-2 mr-1">
            <v-icon class="blue--text">
              mdi-credit-card
            </v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title class="font-weight-medium">
              Реестр оплат
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="isHaveSupplyRole"
          link
          :to="{ name: 'SupplyMenu' }"
        >
          <v-list-item-action class="pr-1 pl-2 mr-1">
            <v-img :src="require('@/assets/img/supply/supply_menu.png')" />
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title class="font-weight-medium">
              Снабжение
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="isHaveTechnologyOfProductionRole"
          link
          :to="{ name: 'TechnologyOfProductionMenu' }"
        >
          <v-list-item-action class="pr-1 pl-2 mr-1">
            <v-icon class="blue--text">
              mdi-forklift
            </v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title class="font-weight-medium">
              Технология производства
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          link
          :to="{ name: 'ChatPage' }"
        >
          <v-list-item-action class="pr-1 pl-2 mr-1">
            <v-icon class="blue--text">
              mdi-wechat
            </v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title class="font-weight-medium">
              Чат
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template #append>
        <v-list>
          <v-list-item>
            <v-list-item-action class="pr-1 pl-2 mr-1">
              <v-btn
                icon
                @click.native.stop="mini = !mini"
              >
                <v-icon color="blue">
                  mdi-menu
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-toolbar class="blue">
        <v-breadcrumbs
          class="white--text"
          :items="breadcrumbs"
        >
          <template #item="{ item }">
            <v-breadcrumbs-item
              active-class="tmp"
              :link="item.link"
              :href="item.href"
              :to="{ name: item.name }"
              :disabled="item.disabled"
            >
              {{ item.text }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>

        <v-spacer />

        <template v-if="isAdmin">
          <v-menu offset-y>
            <template #activator="{ attrs, on }">
              <v-btn
                text
                v-bind="attrs"
                class="white--text"
                v-on="on"
              >
                Админ-панель
                <v-icon color="white">
                  mdi-chevron-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item :to="{ name: 'RoleEditPage' }">
                <v-icon class="mr-2">
                  mdi-account-key
                </v-icon>

                <v-list-item-title>
                  Роли
                </v-list-item-title>
              </v-list-item>

              <v-list-item :to="{ name: 'RegistrationPage' }">
                <v-icon class="mr-2">
                  mdi-account-check
                </v-icon>

                <v-list-item-title>
                  Регистрация пользователя
                </v-list-item-title>
              </v-list-item>

              <v-list-item :to="{ name: 'UsersEditingPage' }">
                <v-icon class="mr-2">
                  mdi-account-edit
                </v-icon>
                <v-list-item-title>
                  Редактирование аккаунтов пользователей
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <v-menu offset-y>
          <template #activator="{ attrs, on }">
            <v-btn
              text
              v-bind="attrs"
              class="white--text"
              v-on="on"
            >
              {{ user.email }}
              <v-icon color="white">
                mdi-chevron-down
              </v-icon>

              <v-avatar
                class="mr-2"
                size="36"
              >
                <img
                  src="http://i.pravatar.cc/150?img=53"
                  alt="avatar"
                >
              </v-avatar>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              :to="{ name: 'CurrentUserEditingPage' }"
            >
              <v-icon class="mr-2">
                mdi-account-settings
              </v-icon>

              <v-list-item-title>
                Настройки
              </v-list-item-title>
            </v-list-item>

            <v-list-item
              href="#"
              @click="logout"
            >
              <v-icon class="mr-2">
                mdi-exit-to-app
              </v-icon>

              <v-list-item-title>
                Выйти
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>

      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'VcrmPage',

  middleware: 'auth-not-authorized',

  async asyncData({ store }) {
    await store.dispatch('profile/fetch')
  },

  data() {
    return {
      drawer: true,
      mini: false,
      breadcrumbs: []
    }
  },

  computed: {
    keepOpen() {
      return this.onClickOutside
    },

    user() {
      return this.$store.state.profile.user
    }
  },

  watch: {
    $route: {
      immediate: true,
      handler() {
        this.hasBreadcrumbs()
        this.mini = true
      }
    }
  },

  methods: {
    clickToggleDrawer() {
      this.mini = !this.mini
    },

    logout() {
      this.$store.dispatch('auth/logout')
    },

    hasBreadcrumbs() {
      const crumbs = []
      const matched = this.$route.matched

      matched.forEach(function(route, i, arr) {
        if (route?.meta?.breadcrumb) {
          if (Array.isArray(route?.meta?.breadcrumb)) {
            const tmpArray = route.meta.breadcrumb.map((item) => {
              return { ...item, href: item.path, disabled: i === arr.length - 1, link: false }
            })

            crumbs.push(...tmpArray)
          } else {
            crumbs.push({ ...route.meta.breadcrumb, href: route.path, name: route.name, disabled: i === arr.length - 1, link: true })
          }
        }
      })

      this.breadcrumbs = crumbs
    },

    onClickOutside() { return true }
  }
}
</script>
<style lang="scss">
.header {
  &__logo {
    max-width: 250px;
  }
}
.v-application a.v-breadcrumbs__item {
    color: white !important;
}
.theme--light.v-breadcrumbs .v-breadcrumbs__divider, .theme--light.v-breadcrumbs .v-breadcrumbs__item--disabled {
  color: white !important;
}

.v-navigation-drawer .v-list{
  height: calc(100% - 65px);
}
</style>
