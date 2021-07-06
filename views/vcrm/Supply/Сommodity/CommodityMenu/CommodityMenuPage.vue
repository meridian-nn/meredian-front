<template>
  <div
    v-if="isCommodityMenu"
    name="СommodityMenu"
    class="commodity-menu"
  >
    <div
      class="supply-menu-title font-weight-medium text-subtitle-1"
    >
      Документы
    </div>

    <v-row>
      <div class="supply-menu-col-2-spacer" />

      <div class="supply-menu-col-2">
        <router-link :to="{ name: 'CommodityLogOfSewingPlan'} ">
          <v-img :src="require('@/assets/img/supply/journal_icon.png')" />
        </router-link>
        <div
          class="supply-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Журнал сырья по плану пошива
        </div>
      </div>

      <div class="supply-menu-col-2">
        <router-link :to="{ name: 'ListOfCommodityForSewingApplication'} ">
          <v-img :src="require('@/assets/img/supply/list_icon.png')" />
        </router-link>
        <div
          class="supply-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Список сырья по заявке на пошив
        </div>
      </div>

      <div class="supply-menu-col-2">
        <router-link :to="{ name: 'RequisitionLogToSupplier'} ">
          <v-img :src="require('@/assets/img/journal2.png')" />
        </router-link>
        <div
          class="supply-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Журнал заявок поставщику
        </div>
      </div>
    </v-row>

    <div class="commodity-menu-reports">
      <v-subheader class="font-weight-medium text-subtitle-1">
        Отчеты
      </v-subheader>

      <v-row>
        <div class="supply-menu-col-2-spacer" />

        <div class="supply-menu-col-2">
          <router-link :to="{ name: 'StockBalance'} ">
            <v-img :src="require('@/assets/img/payment/registry.png')" />
          </router-link>
          <div
            class="supply-menu-v-subheader font-weight-medium text-subtitle-1"
            align="center"
          >
            Складские остатки
          </div>
        </div>
      </v-row>
    </div>
  </div>

  <div v-else>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'CommodityMenu',
  computed: {
    isCommodityMenu() {
      return this.$route.matched[this.$route.matched.length - 1].name === 'CommodityMenu'
    }
  }
}
</script>

<style lang="scss">
.supply-menu-col-2-spacer {
    flex: 0 0 15%;
    max-width: 15%;
}

.commodity-menu{
  margin: 20px
}

.commodity-menu-reports{
  margin-top: 50px
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

.supply-menu-title {
    display: flex;
    height: 48px;
    font-size: 0.875rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    padding: 0 16px 0 16px;
}

/* .supply-menu-title::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 10px;
  right: 10px;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.4);
} */
</style>
