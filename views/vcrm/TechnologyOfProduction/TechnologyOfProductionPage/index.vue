<template>
  <div
    v-if="isTechnologyOfProductionPage"
    name="TechnologyOfProductionMenu"
    class="technology-of-production-menu"
  >
    <patchnote-window ref="patchnoteWindow" />

    <v-btn
      id="technology-of-production-menu-patchnote-window-btn"
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
      <div class="technology-of-production-menu-col-2-spacer" />

      <div class="technology-of-production-menu-col-2">
        <router-link :to="{ name: 'RecordsOfWorkByCards'} ">
          <v-img :src="require('@/assets/img/payment/journal.png')" />
        </router-link>
        <div
          class="technology-of-production-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Запись работы по карточкам
        </div>
      </div>
    </v-row>
  </div>

  <div v-else>
    <router-view />
  </div>
</template>

<script>
import PatchnoteWindow from './PatchnoteWindow/index'

export default {
  name: 'TechnologyOfProductionPage',

  components: {
    PatchnoteWindow
  },

  computed: {
    isTechnologyOfProductionPage() {
      return this.$route.matched[this.$route.matched.length - 1].name === 'TechnologyOfProductionMenu'
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
.technology-of-production-menu-col-2-spacer {
  flex: 0 0 15%;
  max-width: 15%;
}

.technology-of-production-menu{
  margin: 20px
}

.technology-of-production-menu-col-2 {
  flex: 0 0 10%;
  max-width: 10%;
}

.technology-of-production-menu-v-subheader {
  display: flex;
  height: 48px;
  font-size: 0.875rem;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  padding: 0 16px 0 16px;
}
</style>
