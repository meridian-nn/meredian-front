<template>
  <div class="history-of-journal-of-docs-main-div">
    <div class="history-of-journal-of-docs-row">
      <div
        align="center"
        class="history-of-journal-of-docs-main-row-headline"
      >
        Журнал документов на оплату (История)
      </div>

      <div
        class="history-of-journal-of-docs-date"
      >
        <v-text-field
          v-model="date"
          type="date"
          @input="updateAllInfo()"
        />
      </div>
    </div>

    <div class="history-of-journal-of-docs-row">
      <div>
        <v-subheader class="font-weight-medium text-subtitle-1">
          Остатки на расчетных счетах
        </v-subheader>
      </div>
    </div>

    <div class="history-of-journal-of-docs-row">
      <div
        class="history-of-journal-of-docs-table-of-accounts-statistics"
      >
        <v-data-table
          :headers="orgAccInfoHeaders"
          :items="orgAccInfoData"
          hide-default-footer
          class="elevation-1"
        >
          <!--template #body="{ items }">
            <tbody>
              <tr
                v-for="item in items"
                :key="item.id"
              >
                <td><vue-numeric
                  v-model="totalSumOplat"
                  separator="space"
                  :precision="2"
                  decimal-separator="."
                  :output-type="number"
                  :read-only="true"
                /> </td>
                <td>{{ item }}</td>
                <td>{{ item.dataDoc }}</td>
                <td>{{ item.nameDoc }}</td>
              </tr>
            </tbody>
          </template-->
        </v-data-table>
      </div>
    </div>

    <div class="history-of-journal-of-docs-row">
      <div class="history-of-journal-of-docs-orgs">
        <v-autocomplete
          label="Организация"
          :loading="loadingType.organizations"
          :items="organizations"
          item-value="id"
          item-text="clName"
          @change="organizationChange"
        />
      </div>

      <div class="history-of-journal-of-docs-orgs-acc-stats">
        <span class="headline">{{ restPaymentAccountInfo }}</span>
      </div>
    </div>

    <div class="history-of-journal-of-docs-row">
      <div class="history-of-journal-of-docs-acc">
        <v-autocomplete
          v-model="accId"
          label="Расч. счёт"
          :loading="loadingType.paymentAccounts"
          :items="paymentAccounts"
          item-value="id"
          item-text="shortName"
          @change="paymentAccountChange"
        />
      </div>

      <div class="history-of-journal-of-docs-acc-stat">
        <span
          class="headline"
          :class="{'history-of-journal-of-docs-text-danger': currentPaymentAccountBalanceLessThenZero}"
        >{{ paymentAccountInfo }}</span>
      </div>
    </div>

    <div class="history-of-journal-of-docs-row">
      <div
        class="history-of-journal-of-docs-tbl-to-pay"
      >
        <v-subheader class="font-weight-medium text-subtitle-1">
          Документы к оплате
        </v-subheader>

        <v-data-table
          v-model="toPaySelectedRows"
          :headers="toPayHeaders"
          :items="toPayData"
          :items-per-page="5"
          :show-select="true"
          :single-select="false"
          class="elevation-1 journal-of-payment-docs-docs-to-pay-table"
          @contextmenu:row="showPayMenu"
        >
          <template slot="body.append">
            <tr>
              <th>Итого</th>
              <th />
              <th />
              <th />
              <th />
              <th />
              <th>{{ totalToSumOplat }}</th>
              <th />
            </tr>
          </template>
        </v-data-table>
      </div>

      <div
        class="history-of-journal-of-docs-spacer-btwn-tables"
      />

      <div class="history-of-journal-of-docs-tbl-from-pay">
        <v-subheader class="font-weight-medium text-subtitle-1">
          <div
            align="center"
            class="journal-of-documents-subheader-first"
          >
            Документы на оплату
          </div>
        </v-subheader>

        <v-data-table
          v-model="fromPaySelectedRows"
          :headers="fromPayHeaders"
          :items="fromPayData"
          :show-select="true"
          :single-select="false"
          :items-per-page="5"
          class="elevation-1 journal-of-payment-docs-docs-from-pay-table"
        >
          <template
            slot="body.append"
          >
            <tr>
              <th>Итого</th>
              <th />
              <th />
              <th />
              <th />
              <th />
              <th>{{ totalSumDoc }}</th>
              <th>{{ totalSumOplach }}</th>
              <th>{{ totalSumOplat }}</th>
              <th />
            </tr>
          </template>
        </v-data-table>
      </div>
    </div>

    <div class="history-of-journal-of-docs-row">
      <v-col cols="5" />
      <v-col cols="1" />
      <v-col cols="6">
        <v-text-field
          label="Комментарий"
        />
      </v-col>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PaymentDocument',
  components: {
  },
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      loadingType: {},
      payMenu: false,
      x: 0,
      y: 0,
      snackbarUserNotification: false,
      snackbarUserNotificationColor: '',
      snackbarUserNotificationText: '',
      organizations: [],
      selectedOrganization: null,
      currentRowForContextMenu: null,
      paymentAccounts: [],
      paymentAccountInfo: 'Остаток на Р/С:',
      currentPaymentAccountBalance: 0,
      currentPaymentAccountBalanceLessThenZero: false,
      restPaymentAccountInfo: 'Остаток на Р/Счетах:',
      accId: null,
      toPayHeaders: [
        {
          text: 'Подразделение',
          value: 'depName'
        },
        {
          text: 'Дата',
          value: 'dataDoc'
        },
        {
          text: 'Номер',
          value: 'nameDoc'
        },
        {
          text: 'Плательщик',
          value: 'namePlat'
        },
        {
          text: 'Кредит',
          value: 'prCredit'
        },
        {
          text: 'Оплата',
          value: 'sumOplat'
        },
        {
          text: 'Счёт',
          value: 'accId'
        }
      ],
      toPayData: [],
      fromPayHeaders: [
        {
          text: 'Подразделение',
          value: 'depName'
        },
        {
          text: 'Дата',
          value: 'dataDoc'
        },
        {
          text: 'Номер',
          value: 'nameDoc'
        },
        {
          text: 'Плательщик',
          value: 'namePlat'
        },
        {
          text: 'Дата оплаты',
          value: 'dataOplat'
        },
        {
          text: 'Сумма',
          value: 'sumDoc'
        },
        {
          text: 'Оплачено',
          value: 'sumOplach'
        },
        {
          text: 'К оплате',
          value: 'sumOplat'
        },
        {
          text: 'Примечание',
          value: 'prim'
        }
      ],
      fromPayData: [],
      totalSumDoc: 0,
      totalSumOplat: 0,
      totalToSumOplat: 0,
      totalSumOplach: 0,
      toPaySelectedRows: [],
      fromPaySelectedRows: [],
      orgAccInfoData: [],
      orgAccInfoHeaders: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loadingType = {}
      this.fromPaySelectedRows = []
      this.toPaySelectedRows = []
      this.findOrganizatios()
      this.findOrganizationsForTotalResults()
    },
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
        this.orgAccInfoHeaders.push({
          text: element.shortName,
          orgId: element.id,
          value: columnOrgValueName
        })
      })
      this.findOrgAccInfo()
    },

    async updateAllInfo() {
      this.loadingType.timeChanged = true

      await this.findOrgAccInfo()
      if (this.selectedOrganization) {
        await this.updateResPaymentAccountInfo()
        await this.findSpDocoplForPay()
        if (this.accId) {
          await this.findToPay(this.accId)
        }
      }

      this.loadingType.timeChanged = null
      this.fromPaySelectedRows = []
      this.toPaySelectedRows = []
    },

    async findOrgAccInfo() {
      const data = {
        dateOplat: new Date(this.date).toLocaleDateString()
      }
      const response = await this.$api.paymentAccounts.groupByOrg(data)
      this.orgAccInfoData = []

      const orgAccInfoDataAccounts = {}
      orgAccInfoDataAccounts.name = 'Расч. счёт'

      const orgAccInfoDataCashbox = {}
      orgAccInfoDataCashbox.name = 'Касса'

      this.orgAccInfoHeaders.forEach((orgAccElem) => {
        const responseElem = response.find(el => el.myOrg.id === orgAccElem.orgId)
        if (responseElem) {
          orgAccInfoDataAccounts[orgAccElem.value] = this.numberToSum(responseElem.saldo)
          orgAccInfoDataCashbox[orgAccElem.value] = this.numberToSum(0)
        }
      })

      this.orgAccInfoData.push(orgAccInfoDataAccounts)
      this.orgAccInfoData.push(orgAccInfoDataCashbox)
    },

    refreshTables() {
      this.findSpDocoplForPay()
      this.findToPay(this.accId)
      this.fromPaySelectedRows = []
      this.toPaySelectedRows = []
    },

    async findOrganizatios() {
      if (!this.organizations.length) {
        this.loadingType.organizations = true

        const data = {
          typeCode: 1
        }
        this.organizations = await this.$api.organizations.findByOrgTypeCode(data)

        this.loadingType.organizations = null
      }
    },

    async findPaymentAccounts(val) {
      this.loadingType.paymentAccounts = true

      const data = {
        orgId: val
      }
      let paymentAccounts = await this.$api.paymentAccounts.findAccByOrgId(data)
      paymentAccounts = paymentAccounts.sort(this.customCompare('shortName'))
      paymentAccounts.forEach((account) => {
        account.shortName = account.shortName + ' - ' + account.numAcc.slice(account.numAcc.length - 4)
      })

      this.paymentAccounts = paymentAccounts
      this.loadingType.paymentAccounts = null
      this.updateResPaymentAccountInfo()
    },

    async findSpDocoplForPay() {
      const data = {
        dateDoc: new Date(this.date).toLocaleDateString(),
        orgId: this.selectedOrganization
      }

      this.fromPayData = await this.$api.payment.docOplForPay.findSpDocoplForPayBetweenDates(data)
      let totalSumDoc = 0
      let totalSumOplat = 0
      let totalSumOplach = 0
      this.fromPayData.forEach((value) => {
        totalSumDoc += value.sumDoc
        totalSumOplat += value.sumOplat
        totalSumOplach += value.sumOplach
      })
      this.totalSumDoc = totalSumDoc.toFixed(2)
      this.totalSumOplat = totalSumOplat.toFixed(2)
      this.totalSumOplach = totalSumOplach.toFixed(2)
    },

    async findToPay(val) {
      const data = this.createCriteriasForRequest(val, this.selectedOrganization)
      this.toPayData = await this.$api.payment.docOplToPay.findDocumentsByCriterias(data)
      let totalToSumOplat = 0
      this.toPayData.forEach((value) => {
        totalToSumOplat += value.sumOplat
      })
      this.totalToSumOplat = totalToSumOplat.toFixed(2)
      this.updatePaymentAccountInfo(val)
    },
    createCriteriasForRequest(accId, orgId) {
      const secDate = new Date(this.date)
      const curDateNum = secDate.getDate()
      secDate.setDate(curDateNum + 1)
      const data = [
        {
          'dataType': 'INTEGER',
          'key': 'accId',
          'operation': 'EQUALS',
          'type': 'AND',
          'values':
          [
            accId
          ]
        },
        {
          'dataType': 'INTEGER',
          'key': 'platId',
          'operation': 'EQUALS',
          'type': 'AND',
          'values':
          [
            orgId
          ]
        },
        {
          'dataType': 'DATE',
          'key': 'dataOplat',
          'operation': 'BETWEEN',
          'type': 'AND',
          'values': [
            new Date(this.date).toLocaleDateString(), secDate.toLocaleDateString()
          ]
        }
      ]
      return data
    },

    organizationChange(val) {
      this.selectedOrganization = val
      this.accId = null
      this.updatePaymentAccountInfo(this.accId)
      this.toPayData = []
      this.totalToSumOplat = 0
      this.findPaymentAccounts(val)
      this.findSpDocoplForPay()
      // this.updateResPaymentAccountInfo()
    },

    paymentAccountChange(val) {
      this.findToPay(val)
    },

    countSumOfArrayElements(array) {
      let sum = 0
      for (let i = 0; i < array.length; i++) {
        sum += array[i]
      }
      return sum
    },

    async updateResPaymentAccountInfo() {
      let balanceOfSelectedOrganization = this.orgAccInfoData[0]['org' + this.selectedOrganization + 'Value']
      balanceOfSelectedOrganization = balanceOfSelectedOrganization === undefined ? 0 : balanceOfSelectedOrganization
      const balanceOfOtherAccounts = await this.getBalanceOfOtherAccounts()

      this.restPaymentAccountInfo = 'Остаток на Р/Счетах: ' + ((balanceOfSelectedOrganization - balanceOfOtherAccounts).toFixed(2))
    },
    async getBalanceOfOtherAccounts() {
      let totalToSumOplat = 0
      const arrayOfPromises = []
      this.paymentAccounts.forEach((account) => {
        const promise = this.getSumToPayDocsOfOrgByAccId(account.id)
        arrayOfPromises.push(promise)
      })
      await Promise.all(arrayOfPromises).then((results) => {
        results.forEach((result) => {
          console.log(result)
          totalToSumOplat += result
        })
      })
      return totalToSumOplat
    },

    async getSumToPayDocsOfOrgByAccId(accId) {
      const data = this.createCriteriasForRequest(accId, this.selectedOrganization)
      let totalToSumOplat = 0
      const response = await this.$api.payment.docOplToPay.findDocumentsByCriterias(data)
      response.forEach((value) => {
        totalToSumOplat += value.sumOplat
      })
      return totalToSumOplat
    },

    async updatePaymentAccountInfo(accId) {
      if (!accId) {
        this.paymentAccountInfo = 'Остаток на Р/С: '
        this.currentPaymentAccountBalance = 0
        this.currentPaymentAccountBalanceLessThenZero = false
        return
      }

      const data = {
        dateOplat: new Date(this.date).toLocaleDateString(),
        orgId: this.selectedOrganization
      }
      const response = await this.$api.paymentAccounts.findByDataOplatAndMyOrgId(data)

      if (response.length === 0) {
        this.paymentAccountInfo = 'Остаток на Р/С: '
        this.currentPaymentAccountBalance = 0
        this.currentPaymentAccountBalanceLessThenZero = false
        return
      }

      const responseElement = response.find(el => el.acc.id === accId)
      const saldo = responseElement.saldo

      let additionalMessage = ''
      this.currentPaymentAccountBalanceLessThenZero = false
      this.currentPaymentAccountBalance = (saldo - this.totalToSumOplat)

      if (this.currentPaymentAccountBalance < 0) {
        additionalMessage = ' - сумма остатка на расчетном счете меньше нуля!'
        this.currentPaymentAccountBalanceLessThenZero = true
      }

      this.currentPaymentAccountBalance = this.currentPaymentAccountBalance.toFixed(2)
      this.paymentAccountInfo = 'Остаток на Р/С: ' + this.currentPaymentAccountBalance + additionalMessage
    },

    showUserNotification(color, text) {
      if (!color ||
      !text) {
        return
      }
      this.snackbarUserNotification = true
      this.snackbarUserNotificationColor = color
      this.snackbarUserNotificationText = text
    }
  }
}
</script>

<style lang="scss">
.v-data-table td {
    padding: 0 0px !important;
    height: 0px !important;
}

.v-data-table th {
    padding: 0 0px !important;
    height: 0px !important;
}

.history-of-journal-of-docs-main-div {
  padding: 10px
}

.history-of-journal-of-docs-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0px;
  min-width: 100%;
}

.history-of-journal-of-docs-main-row-headline {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.5rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
  flex: 0 0 90%;
  max-width: 90%;
}

.history-of-journal-of-docs-date {
  flex: 0 0 10%;
  max-width: 10%;
}

.history-of-journal-of-docs-table-of-accounts-statistics{
  flex: 0 0 100%;
  max-width: 100%;
}

.history-of-journal-of-docs-orgs{
  flex: 0 0 40%;
  max-width: 40%;
}

.history-of-journal-of-docs-orgs-acc-stats{
  flex: 0 0 60%;
  max-width: 60%;
  color: rgba(0, 0, 0, 0.6);
}

.history-of-journal-of-docs-acc{
  flex: 0 0 40%;
  max-width: 40%;
}

.history-of-journal-of-docs-acc-stat{
  flex: 0 0 60%;
  max-width: 60%;
  color: rgba(0, 0, 0, 0.6);
}

.history-of-journal-of-docs-tbl-to-pay{
  flex: 0 0 40%;
  max-width: 40%;
}

.history-of-journal-of-docs-spacer-btwn-tables{
  flex: 0 0 2%;
  max-width: 2%;
}

.history-of-journal-of-docs-tbl-from-pay{
  flex: 0 0 58%;
  max-width: 58%;
}

.history-of-journal-of-docs-text-danger {
  color: red;
}

</style>
