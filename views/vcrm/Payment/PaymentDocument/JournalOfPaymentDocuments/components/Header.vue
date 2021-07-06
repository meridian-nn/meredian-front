<template>
  <div name="journal-of-payment-docs-header">
    <v-col cols="12">
      <div
        align="center"
        class="journal-of-payment-docs-main-row headline"
      >
        Журнал документов на оплату
      </div>
    </v-col>

    <div class="journal-of-payment-docs-row">
      <v-col
        cols="10"
      >
        <v-subheader class="font-weight-medium text-subtitle-1">
          Остатки на расчетных счетах
        </v-subheader>
      </v-col>

      <v-col
        cols="2"
        class="journal-of-payment-docs-table-of-accounts-statistics-enter-balances"
      >
        <div
          align="right"
        >
          <v-btn @click="$router.push({name: 'InputOfBalances'})">
            Ввод остатков по Р/С
          </v-btn>
        </div>
      </v-col>
    </div>

    <div class="journal-of-payment-docs-row">
      <div
        class="journal-of-payment-docs-table-of-accounts-statistics"
      >
        <v-data-table
          id="journal-of-payment-docs-v-data-table-table-of-accounts-statistics"
          :headers="orgAccInfoHeaders"
          :items="orgAccInfoData"
          hide-default-footer
          class="elevation-1"
        />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'JournalOfPaymentDocumentsHeader',
  data() {
    return {
      // Шапка таблицы остатков по расчетным счетам
      orgAccInfoHeaders: [],

      // Данные таблицы остатков по расчетным счетам
      orgAccInfoData: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // this.findOrgAccInfo()
    },

    async findOrgAccInfo(date) {
      this.reset()
      if (date === undefined) {
        date = new Date()
      }
      const data = this.createParamsForRequestPaymentAccGroupByOrg(date, ['myOrg.id', 'myOrg.shortName', 'acc.accType'])
      const response = await this.$api.paymentAccounts.groupBy(data)
      const orgAccInfoDataAccounts = {}
      orgAccInfoDataAccounts.name = 'р/с'
      const orgAccInfoDataCashbox = {}
      orgAccInfoDataCashbox.name = 'нал.'
      let totalSumOfAccounts = 0
      let totalSumOfCashbox = 0
      for (const responseElem of response) {
        if (!responseElem.sum_sumToPay) {
          responseElem.sum_sumToPay = 0
        }
        const sumOfClearBalance = responseElem.sum_saldo + responseElem.sum_nalich + responseElem.sum_vnpl
        const sumOfOrg = sumOfClearBalance - responseElem.sum_sumToPay
        if (responseElem['acc.accType'] === 'COMMON') {
          this.addOrgIntoHeaders(responseElem)
          orgAccInfoDataAccounts['org' + responseElem['myOrg.id'] + 'ClearBalance'] = sumOfClearBalance
          orgAccInfoDataAccounts['org' + responseElem['myOrg.id'] + 'ValueSum'] = sumOfOrg
          orgAccInfoDataAccounts['org' + responseElem['myOrg.id'] + 'Value'] = this.numberToSum(sumOfOrg)
          totalSumOfAccounts += sumOfOrg
        } else if (responseElem['acc.accType'] === 'CASH') {
          orgAccInfoDataCashbox['org' + responseElem['myOrg.id'] + 'ClearBalance'] = sumOfClearBalance
          orgAccInfoDataCashbox['org' + responseElem['myOrg.id'] + 'ValueSum'] = sumOfOrg
          orgAccInfoDataCashbox['org' + responseElem['myOrg.id'] + 'Value'] = this.numberToSum(sumOfOrg)
          totalSumOfCashbox += sumOfOrg
        }
      }
      this.orgAccInfoHeaders.push({
        text: 'Итого',
        orgId: '-',
        value: 'total'
      })
      orgAccInfoDataAccounts.total = this.numberToSum(totalSumOfAccounts)
      orgAccInfoDataCashbox.total = this.numberToSum(totalSumOfCashbox)
      this.orgAccInfoData.push(orgAccInfoDataAccounts)
      this.orgAccInfoData.push(orgAccInfoDataCashbox)
    },

    addOrgIntoHeaders(responseElem) {
      const columnOrgValueName = 'org' + responseElem['myOrg.id'] + 'Value'
      const columnOrgClearBalanceName = 'org' + responseElem['myOrg.id'] + 'ClearBalance'
      const columnOrgValueNumberName = 'org' + responseElem['myOrg.id'] + 'ValueSum'
      this.orgAccInfoHeaders.push({
        text: responseElem['myOrg.shortName'],
        orgId: responseElem['myOrg.id'],
        value: columnOrgValueName,
        valueSum: columnOrgValueNumberName,
        clearBalance: columnOrgClearBalanceName
      })
    },

    reset() {
      this.orgAccInfoData = []
      this.orgAccInfoHeaders = []
      this.orgAccInfoHeaders.push({
        text: '',
        value: 'name'
      })
    }
  }
}

</script>

<style lang="scss">
#journal-of-payment-docs-v-data-table-table-of-accounts-statistics td {
    padding: 0 0 !important;
    height: 0 !important;
}

#journal-of-payment-docs-v-data-table-table-of-accounts-statistics th {
    padding: 0 0 !important;
    height: 0 !important;
}

.journal-of-payment-docs-main-row {
    color: rgba(0, 0, 0, 0.6);
}
.journal-of-payment-docs-row {
    display: flex;
    flex-wrap: wrap;
    flex: 1 1 auto;
    margin: 0;
}

.journal-of-payment-docs-table-of-accounts-statistics-enter-balances{
  padding-left: 0;
  padding-right: 5px;
}

.journal-of-payment-docs-table-of-accounts-statistics{
  padding-bottom: 0;
  flex: 0 0 100%;
  max-width: 100%;
}
</style>
