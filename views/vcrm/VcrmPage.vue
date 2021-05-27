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
        />

        <v-spacer />

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
            <v-list-item>
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
      breadcrumbs: [
        {
          text: 'Справочник',
          disabled: false,
          href: 'breadcrumbs_link_1'
        },
        {
          text: 'GTIN',
          disabled: true,
          href: 'breadcrumbs_link_2'
        }
      ]
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
      this.breadcrumbs = this.$route.meta.breadcrumb
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
