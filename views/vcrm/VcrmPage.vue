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
          :to="{ name: 'Dashboard' }"
        >
          <v-list-item-action class="pr-1 pl-2 mr-1">
            <v-icon class="blue--text">
              mdi-domain
            </v-icon>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title class="font-weight-medium">
              Маркировка
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link>
          <v-list-item-action class="pr-1 pl-2 mr-1">
            <v-icon class="blue--text">
              mdi-brightness-5
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="font-weight-medium">
              Справочник
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group no-action>
          <template #activator>
            <v-list-item-title>Платежи</v-list-item-title>
          </template>
          <MenuItemButton
            title="Журнал документов"
            link="PaymentDocument"
            icon="mdi-brightness-5"
          />
          <MenuItemButton
            title="Распределение ДС"
            link="MoneyDistribution"
            icon="mdi-brightness-5"
          />
          <MenuItemButton
            title="Ввод остатков"
            link="InputOfBalances"
            icon="mdi-brightness-5"
          />
          <MenuItemButton
            title="Реестр"
            link="PaymentDocument"
            icon="mdi-brightness-5"
          />
          <MenuItemButton
            title="История"
            link="HistoryOfPaymentDocuments"
            icon="mdi-brightness-5"
          />
        </v-list-group>
      </v-list>

      <template #append>
        <v-list>
          <v-list-item>
            <v-list-item-action
              class="pr-1 pl-2 mr-1"
            >
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

        <v-btn icon>
          <v-icon color="white">
            mdi-dots-vertical
          </v-icon>
        </v-btn>
      </v-toolbar>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'VcrmPage',

  middleware: 'auth-redirect',

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
    keepOpen() { return this.onClickOutside }
  },

  methods: {
    clickToggleDrawer() {
      this.mini = !this.mini
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
