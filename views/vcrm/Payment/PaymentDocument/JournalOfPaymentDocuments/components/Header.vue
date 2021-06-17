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
          <v-btn
            @click="$router.push({name: 'InputOfBalances'})"
          >
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
      this.findOrgAccInfoAlter()
      // this.findOrganizationsForTotalResults()
    },

    // Поиск организаций с типом "BUDGET"
    async findOrganizationsForTotalResults() {
      const data = {
        typeCode: 1
      }
      const response = await this.$api.organizations.findByOrgTypeCode(data)

      this.orgAccInfoHeaders.push({
        text: '',
        value: 'name'
      })

      response.forEach((element) => {
        const columnOrgValueName = 'org' + element.id + 'Value'
        const columnOrgClearBalanceName = 'org' + element.id + 'ClearBalance'
        const columnOrgValueNumberName = 'org' + element.id + 'ValueSum'
        this.orgAccInfoHeaders.push({
          text: element.shortName,
          orgId: element.id,
          value: columnOrgValueName,
          valueSum: columnOrgValueNumberName,
          clearBalance: columnOrgClearBalanceName
        })
      })

      this.orgAccInfoHeaders.push({
        text: 'Итого',
        orgId: '-',
        value: 'total'

      })
      await this.findOrgAccInfo()
    },

    // Поиск остатков на расчетных счетах найденных организаций
    async findOrgAccInfo(date) {
      this.reset()
      if (date === undefined) {
        date = new Date()
      }
      const data = this.createParamsForRequestPaymentAccGroupByOrg(date, ['myOrg.id', 'myOrg.clName', 'acc.accType'])
      const response = await this.$api.paymentAccounts.groupBy(data)

      this.orgAccInfoData = []

      const orgAccInfoDataAccounts = {}
      orgAccInfoDataAccounts.name = 'р/с'

      const orgAccInfoDataCashbox = {}
      orgAccInfoDataCashbox.name = 'нал.'

      let totalSumOfAccounts = 0
      let totalSumOfCashbox = 0
      for (const orgAccElem of this.orgAccInfoHeaders) {
        const responseElem = response.find(el => el['myOrg.id'] === orgAccElem.orgId)
        if (!responseElem) {
          continue
        }

        const sumOfOtherAccounts = await this.getBalanceOfDocsToPay(orgAccElem.orgId, date)
        const sumOfClearBalance = responseElem.sum_saldo + responseElem.sum_nalich
        const sumOfOrg = sumOfClearBalance - sumOfOtherAccounts
        orgAccInfoDataAccounts[orgAccElem.clearBalance] = sumOfClearBalance
        orgAccInfoDataAccounts[orgAccElem.valueSum] = sumOfOrg
        orgAccInfoDataAccounts[orgAccElem.value] = this.numberToSum(sumOfOrg)
        totalSumOfAccounts += sumOfOrg
        orgAccInfoDataCashbox[orgAccElem.value] = this.numberToSum(0)
        totalSumOfCashbox += 0
      }

      orgAccInfoDataAccounts.total = this.numberToSum(totalSumOfAccounts)
      orgAccInfoDataCashbox.total = this.numberToSum(totalSumOfCashbox)

      this.orgAccInfoData.push(orgAccInfoDataAccounts)
      this.orgAccInfoData.push(orgAccInfoDataCashbox)
    },

    async findOrgAccInfoAlter(date) {
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

        const sumOfClearBalance = responseElem.sum_saldo + responseElem.sum_nalich
        const sumOfOrg = sumOfClearBalance - responseElem.sum_sumToPay

        if (responseElem['acc.accType'] === 'COMMON') {
          this.addOrgIntoHeaders(responseElem)
          /* const sumOfDocToPay = await this.getBalanceOfDocsToPay(responseElem['myOrg.id'], date)
          sumOfOrg = sumOfClearBalance - sumOfDocToPay */

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

    updateSumOfOrg(orgId, sumOfDocsToPay) {
      const keyOfOrg = this.orgAccInfoHeaders.find(el => el.orgId === orgId)
      const sumOfOrg = this.orgAccInfoData[0][keyOfOrg.clearBalance] - sumOfDocsToPay

      this.orgAccInfoData[0][keyOfOrg.valueSum] = sumOfOrg
      this.orgAccInfoData[0][keyOfOrg.value] = this.numberToSum(sumOfOrg)

      this.updateTotalSum()
    },

    updateTotalSum() {
      let totalSum = 0
      for (const elem of this.orgAccInfoHeaders) {
        if (!elem.valueSum) {
          continue
        }

        totalSum += this.orgAccInfoData[0][elem.valueSum]
      }
      this.orgAccInfoData[0].total = this.numberToSum(totalSum)
    },

    async getBalanceOfDocsToPay(orgId, date) {
      const sumToPay = await this.getSumToPayDocsOfOrg(orgId, date)
      const sumPaymentByCashbox = await this.getSumOfPaymentByCashboxOfOrg(orgId, date)
      const totalSumOplat = sumToPay + sumPaymentByCashbox
      return totalSumOplat
    },
    async getSumToPayDocsOfOrg(orgId, date) {
      const data = this.createCriteriasWithoutAccIdForRequestToSearchDocsToPay(orgId, date)
      let totalToSumOplat = 0
      const response = await this.$api.payment.docOplToPay.findDocumentsByCriterias(data)
      response.forEach((value) => {
        totalToSumOplat += value.sumOplat
      })
      return totalToSumOplat
    },
    async getSumOfPaymentByCashboxOfOrg(orgId, date) {
      const data = this.createCriteriasWithoutAccIdForRequestToSearchPaymentsByCashbox(orgId, date)
      let totalPaymentSum = 0
      const response = await this.$api.payment.findPaymentsByCashboxByCriterias(data)
      response.forEach((value) => {
        if (value.paymentOperationSums.length > 0) {
          totalPaymentSum += value.paymentOperationSums[0].paymentSum
        }
      })
      return totalPaymentSum
    },

    findSumOfOrg(orgId) {
      const keyOfOrg = this.orgAccInfoHeaders.find(el => el.orgId === orgId)
      return this.orgAccInfoData[0][keyOfOrg.value]
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
