<template>
  <div
    v-if="isSupplyMenuPage"
    name="SupplyMenu"
    class="supply-menu"
  >
    <patchnote-window ref="patchnoteWindow" />

    <v-btn
      id="supply-menu-patchnote-window-btn"
      color="blue"
      class="mr-2 mb-2"
      fab
      dark
      small
      fixed
      bottom
      right
    >
      <v-icon @click="openPatchnoteWindow">
        mdi-alert
      </v-icon>
    </v-btn>

    <v-row>
      <div class="supply-menu-col-2-spacer" />

      <div class="supply-menu-col-2">
        <router-link :to="{ name: 'CommodityMenu'} ">
          <v-img :src="require('@/assets/img/supply/commodity_icon.png')" />
        </router-link>
        <div
          class="supply-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Сырье (Снабжение)
        </div>
      </div>

      <div class="supply-menu-col-2">
        <router-link :to="{ name: 'Materials'} ">
          <v-img :src="require('@/assets/img/supply/materials_icon.png')" />
        </router-link>
        <div
          class="supply-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Материалы (Закупки)
        </div>
      </div>

      <v-spacer />
    </v-row>
  </div>

  <div v-else>
    <router-view />
  </div>
</template>

<script>
import PatchnoteWindow from './PatchnoteWindow/PatchnoteWindowPage'

export default {
  name: 'SupplyMenu',
  components: {
    PatchnoteWindow
  },

  computed: {
    isSupplyMenuPage() {
      return this.$route.matched[this.$route.matched.length - 1].name === 'SupplyMenu'
    }
  },

  methods: {
    openPatchnoteWindow() {
      this.$refs.patchnoteWindow.openWindow()
    }
  }
}
</script>

<style lang="scss">
.supply-menu-col-2-spacer {
    flex: 0 0 15%;
    max-width: 15%;
}

.supply-menu{
  margin: 20px
}

.supply-menu-col-2 {
    flex: 0 0 10%;
    max-width: 10%;
}

.supply-menu-v-subheader {
    display: flex;
    height: 48px;
    font-size: 0.875rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    padding: 0 16px 0 16px;
}
</style>
