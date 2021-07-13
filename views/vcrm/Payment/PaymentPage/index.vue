<template>
  <div
    v-if="isPaymentPage"
    name="PaymentMenu"
    class="payment-menu"
  >
    <patchnote-window ref="patchnoteWindow" />

    <v-btn
      id="payment-menu-patchnote-window-btn"
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
      <div class="payment-menu-col-2-spacer" />

      <div class="payment-menu-col-2">
        <router-link :to="{ name: 'JournalOfPaymentDocuments' }">
          <v-img :src="require('@/assets/img/payment/journal.png')" />
        </router-link>
        <div
          class="payment-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Журнал документов на оплату
        </div>
      </div>

      <div
        v-if="isHaveBudgetRole"
        class="payment-menu-col-2"
      >
        <router-link :to="{ name: 'PaymentBudgetByDepartments' }">
          <v-img :src="require('@/assets/img/payment/budget.png')" />
        </router-link>
        <div
          class="payment-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Бюджет оплат по подразделениям
        </div>
      </div>

      <div
        v-if="isHaveBudgetRole"
        class="payment-menu-col-2"
      >
        <router-link :to="{ name: 'JournalOfEmailSendingPaymentDocuments' }">
          <v-img :src="require('@/assets/img/payment/email.png')" />
        </router-link>
        <div
          class="payment-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Журнал рассылки на email документов на оплату
        </div>
      </div>

      <div
        v-if="isHaveBudgetRole"
        class="payment-menu-col-2"
      >
        <router-link :to="{ name: 'MoneyDistribution' }">
          <v-img :src="require('@/assets/img/payment/distribution.png')" />
        </router-link>
        <div
          class="payment-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Распределение денежных средств
        </div>
      </div>

      <div
        v-if="isHaveBudgetRole"
        class="payment-menu-col-2"
      >
        <router-link :to="{ name: 'InputOfBalances' }">
          <v-img :src="require('@/assets/img/payment/bank_acc.png')" />
        </router-link>
        <div
          class="payment-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Ввод остатков по Р/С
        </div>
      </div>

      <div class="payment-menu-col-2">
        <router-link :to="{ name: 'RegisterOfDocumentsToPay' }">
          <v-img :src="require('@/assets/img/payment/registry.png')" />
        </router-link>
        <div
          class="payment-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Реестр документов к оплате
        </div>
      </div>

      <div class="payment-menu-col-2">
        <router-link :to="{ name: 'RegisterOfPaymentsByCashbox' }">
          <v-img :src="require('@/assets/img/payment/registry.png')" />
        </router-link>
        <div
          class="payment-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Реестр документов оплат по кассе
        </div>
      </div>

      <div class="payment-menu-col-2-spacer" />
    </v-row>

    <v-row
      v-if="isHaveBudgetRole"
      style="margin-top:150px; width:100%"
    >
      <div class="chart-div">
        <bar-chart
          v-if="loaded"
          :styles="chartStyles"
          :chartdata="chartdata"
          :options="options"
        />
      </div>
    </v-row>
  </div>

  <div v-else>
    <router-view />
  </div>
</template>

<script>
import BarChart from '@/components/charts/Bar.vue'
import PatchnoteWindow from './PatchnoteWindow/index.vue'
export default {
  name: 'PaymentPage',

  components: {
    PatchnoteWindow,
    BarChart
  },

  data() {
    return {
      loaded: false,
      chartdata: {},
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },

  computed: {
    chartStyles() {
      return {
        width: '100%',
        height: '400px'
      }
    },

    isPaymentPage() {
      return this.$route.matched[this.$route.matched.length - 1].name === 'PaymentMenu'
    }
  },

  mounted() {
    this.findDataAboutFromPayDocForChart()
  },

  methods: {
    openPatchnoteWindow() {
      this.$refs.patchnoteWindow.openWindow()
    },

    async findDataAboutFromPayDocForChart() {
      const filtersParams = {
        date: new Date()
      }
      const data = this.createCriteriasForRequestToSearchDocsFromPay(filtersParams)
      const response = await this.$api.payment.docOplForPay.findDocumentsForPayByCriterias(data)
      const dataForChart = this.convertFromPayDataResponseToDataForChart(response)
      this.chartdata.labels = dataForChart.labels
      this.chartdata.datasets = dataForChart.datasets

      this.loaded = true
    },

    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  }
}
</script>

<style lang="scss">
.payment-menu{
  margin: 20px
}

.payment-menu-col-2 {
    flex: 0 0 10%;
    max-width: 10%;
}

.payment-menu-col-2-spacer {
    flex: 0 0 15%;
    max-width: 15%;
}

.payment-menu-col-3 {
    flex: 0 0 15%;
    max-width: 15%;
}

.payment-menu-v-subheader {
    display: flex;
    height: 48px;
    font-size: 0.875rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    padding: 0 16px 0 16px;
}

.chart-div{
  width: 100%;
  padding-left: 50px;
  padding-right: 50px;
  align-items: center;
}
</style>
