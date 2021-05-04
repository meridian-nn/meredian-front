<template>
  <div>
    <v-card>
      <v-card-text class="journal-of-payment-docs-card-text">
        <v-container
          class="journal-of-payment-docs-container"
        >
          <v-row>
            <v-col cols="10">
              <div
                align="center"
                class="journal-of-payment-main-row headline"
              >
                Журнал документов на оплату (История)
              </div>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="date"
                type="date"
                @input="updateAllInfo()"
              />
            </v-col>
          </v-row>

          <v-row>
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
            />
          </v-row>

          <v-row>
            <v-col
              cols="12"
              class="journal-of-payment-docs-table-of-accounts-statistics"
            >
              <v-data-table
                :headers="orgAccInfoHeaders"
                :items="orgAccInfoData"
                hide-default-footer
                class="elevation-1"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="5">
              <v-autocomplete
                label="Организация"
                :loading="loadingType.organizations"
                :items="organizations"
                item-value="id"
                item-text="clName"
                @change="organizationChange"
              />
            </v-col>
            <v-col cols="7">
              <div>
                <span class="headline">{{ restPaymentAccountInfo }}</span>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="5">
              <v-autocomplete
                v-model="accId"
                label="Расч. счёт"
                :loading="loadingType.paymentAccounts"
                :items="paymentAccounts"
                item-value="id"
                item-text="shortName"
                @change="paymentAccountChange"
              />
            </v-col>

            <v-col cols="7">
              <div>
                <span
                  class="headline"
                  :class="{'text-danger': currentPaymentAccountBalanceLessThenZero}"
                >{{ paymentAccountInfo }}</span>
              </div>
            </v-col>
          </v-row>

          <v-row class="journal-of-payment-docs-tables-row">
            <v-col
              class="journal-of-payment-docs-docs-to-pay-col journal-of-payment-docs-to-pay-col-5"
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
            </v-col>

            <v-col
              class="journal-of-payment-docs-arrows journal-of-payment-docs-col-1"
            />

            <v-col
              class="journal-of-payment-docs-docs-from-pay-col journal-of-payment-docs-for-pay-col-5"
            >
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
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="5" />
            <v-col cols="1" />
            <v-col cols="6">
              <v-text-field
                label="Комментарий"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>

export default {
  axiosConfig: {
    auth: {
    }
  },
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
      // $axios.$get('/meridian/oper/dict/spOrg/findByOrgTypeCode', { params: data })

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

    updateAllInfo() {
      if (this.selectedOrganization) {
        this.findSpDocoplForPay()
        if (this.accId) {
          this.findToPay(this.accId)
        }
        this.updateResPaymentAccountInfo()
      }
      this.findOrgAccInfo()
      this.fromPaySelectedRows = []
      this.toPaySelectedRows = []
    },

    async findOrgAccInfo() {
      const data = {
        dateOplat: new Date(this.date).toLocaleDateString()
      }
      const response = await this.$api.paymentAccounts.groupByOrg(data)
      // $axios.$get('/meridian/oper/spOplat/groupByOrg', { params: data })
      this.orgAccInfoData = []

      const orgAccInfoDataAccounts = {}
      orgAccInfoDataAccounts.name = 'Расч. счёт'

      const orgAccInfoDataCashbox = {}
      orgAccInfoDataCashbox.name = 'Касса'

      this.orgAccInfoHeaders.forEach((orgAccElem) => {
        const responseElem = response.find(el => el.myOrg.id === orgAccElem.orgId)
        if (responseElem) {
          orgAccInfoDataAccounts[orgAccElem.value] = responseElem.saldo
          orgAccInfoDataCashbox[orgAccElem.value] = 0
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
    /* async findOrgAccInfo() {
      if (!this.orgAccInfoData.length) {
        this.orgAccInfoData = await this.$axios.$get('/meridian/oper/spDocopl/getOrgAccInfo', this.axiosConfig)
      }
    }, */
    async findPaymentAccounts(val) {
      this.loadingType.paymentAccounts = true

      const data = {
        orgId: val
      }
      let paymentAccounts = await this.$api.paymentAccounts.findAccByOrgId(data)
      paymentAccounts = paymentAccounts.sort(this.$compare('shortName'))
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

      // TODO поменять на /oper/spDocopl/findSpDocoplForPayBetweenDates
      this.fromPayData = await this.$api.payment.docOplForPay.findSpDocoplForPay(data)
      // $axios.$get('/meridian/oper/spDocopl/findSpDocoplForPay', { params: data })
      let totalSumDoc = 0
      let totalSumOplat = 0
      let totalSumOplach = 0
      this.fromPayData.forEach((value) => {
        totalSumDoc += value.sumDoc
        totalSumOplat += value.sumOplat
        totalSumOplach += value.sumOplach
      })
      this.totalSumDoc = totalSumDoc
      this.totalSumOplat = totalSumOplat
      this.totalSumOplach = totalSumOplach
    },

    async findToPay(val) {
      const data = {
        dateDoc: new Date(this.date).toLocaleDateString(),
        accId: val,
        orgId: this.selectedOrganization
      }
      this.toPayData = await this.$api.payment.docOplToPay.findSpDocoplToPay(data)
      let totalToSumOplat = 0
      this.toPayData.forEach((value) => {
        totalToSumOplat += value.sumOplat
      })
      this.totalToSumOplat = totalToSumOplat
      this.updatePaymentAccountInfo(val)
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
      const balanceOfSelectedOrganization = this.orgAccInfoData[0]['org' + this.selectedOrganization + 'Value']
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
      const data = {
        dateDoc: new Date(this.date).toLocaleDateString(),
        accId,
        orgId: this.selectedOrganization
      }

      let totalToSumOplat = 0
      const response = await this.$api.payment.docOplToPay.findSpDocoplToPay(data)
      // $axios.$get('/meridian/oper/spDocopl/findSpDocoplToPay', { params: data })
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
        dateOplat: new Date().toLocaleDateString(),
        orgId: this.selectedOrganization
      }
      const response = await this.$api.paymentAccounts.findByDataOplatAndMyOrgId(data)
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
.journal-of-payment-docs-tables-row{
  margin-top: 0px;
}
.journal-of-payment-docs-container{
  padding-top: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
  max-width: none;
}
.journal-of-payment-docs-card-text{
  padding: 0px;
  max-height: 1000px;
}
.journal-of-payment-docs-table-of-accounts-statistics{
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 0px;
  flex: 0 0 99%;
  max-width: 99%;
}
.journal-of-payment-docs-table-of-accounts-statistics-enter-balances{
  padding-left: 0px;
  padding-right: 5px;
}
.journal-of-payment-docs-docs-to-pay-col{
  padding-top: 0px;
  padding-right: 0px;
}
.journal-of-payment-docs-docs-from-pay-col{
  padding-top: 0px;
  padding-left: 0px;
  padding-right: 0px;
}
.journal-of-payment-docs-docs-to-pay-table{
  min-height: 250px;
}
.journal-of-payment-docs-docs-from-pay-table{
  min-height: 250px;
  max-height: 1000px;
}
.journal-of-payment-docs-buttons-of-payment-docs-table{
  padding-top: 0px;
  padding-left: 0px;
  padding-right: 0px;
}
.journal-of-payment-docs-arrows{
  padding-top: 0px;
  padding-left: 0px;
  padding-right: 0px;
}
.journal-of-payment-docs-col-1 {
    flex: 0 0 1%;
    max-width: 1%;
}
.journal-of-payment-docs-to-pay-col-5 {
    flex: 0 0 40%;
    max-width: 40%;
}
.journal-of-payment-docs-for-pay-col-5 {
    flex: 0 0 58%;
    max-width: 58%;
}
.journal-of-payment-docs-row {
    display: flex;
    flex-wrap: wrap;
    flex: 1 1 auto;
    margin: -12px;
}
.journal-of-payment-main-row {
    padding-bottom: 10px;
}

.context-menu {
    position: fixed;
    background: white;
    z-index: 999;
    outline: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    cursor: pointer;
}

.journal-of-documents-subheader-first {
  padding-top: 12px;
  margin-top: 9px;
  padding-right: 30px;
}

.text-danger {
  color: red;
}

</style>
