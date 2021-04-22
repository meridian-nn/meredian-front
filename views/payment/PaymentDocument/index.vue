<template>
  <div>
    <edit-payment-document
      ref="editPaymentDocument"
      @close="closePaymentDocument"
      @cancel="closePaymentDocument"
      @save="savePaymentDocument"
    />
    <v-card>
      <v-card-text class="journal-of-payment-docs-card-text">
        <v-container
          class="journal-of-payment-docs-container"
        >
          <div class="journal-of-payment-main-row">
            <v-col cols="10">
              <div
                align="center"
                class="headline"
              >
                Журнал документов на оплату
              </div>
            </v-col>

            <v-col cols="2">
              <v-text-field
                v-model="date"
                type="date"
                @input="updateAllInfo()"
              />
            </v-col>
          </div>
          <v-row>
            <v-col
              cols="10"
              class="journal-of-payment-docs-table-of-accounts-statistics"
            >
              <v-data-table
                :headers="orgAccInfoHeaders"
                :items="orgAccInfoData"
                hide-default-footer
                class="elevation-1"
              />
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
            <v-col cols="7" />
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
              <span class="headline">{{ paymentAccountInfo }}</span>
            </v-col>
          </v-row>

          <v-row class="journal-of-payment-docs-tables-row">
            <v-col
              class="journal-of-payment-docs-docs-to-pay-col journal-of-payment-docs-col-5"
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
                <template #[`item.sumOplat`]="props">
                  <v-edit-dialog
                    :return-value.sync="props.item.sumOplat"
                    large
                    cancel-text="Закрыть"
                    save-text="Сохранить"
                    @save="saveSumOplat"
                    @cancel="cancelSumOplat"
                  >
                    <div>{{ props.item.sumOplat }}</div>
                    <template #input>
                      <div class="mt-4 title">
                        Сумма оплаты
                      </div>
                      <v-text-field
                        v-model="props.item.sumOplat"
                        :rules="[max25chars]"
                        label="Сумма"
                        single-line
                        counter
                        autofocus
                      />
                    </template>
                  </v-edit-dialog>
                </template>
                <v-menu
                  v-model="payMenu"
                  :position-x="x"
                  :position-y="y"
                  absolute
                  offset-y
                >
                  <v-list>
                    <v-list-item>
                      <v-list-item-title>test</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-data-table>

              <v-snackbar
                v-model="snackSumOplat"
                :timeout="3000"
                :color="snackColorSumOplat"
              >
                {{ snackTextSumOplat }}

                <template #action="{ attrs }">
                  <v-btn
                    v-bind="attrs"
                    text
                    @click="snackSumOplat = false"
                  >
                    Закрыть
                  </v-btn>
                </template>
              </v-snackbar>
            </v-col>

            <v-col
              class="journal-of-payment-docs-arrows journal-of-payment-docs-col-1"
            >
              <div align="center">
                <v-subheader class="font-weight-medium text-subtitle-1" />
                <v-btn
                  color="blue"
                  class="mr-2 mb-2"
                  fab
                  dark
                  small

                  @click="addPaymentsClick"
                >
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <br>
                <v-btn
                  color="blue"
                  class="mr-2 mb-2"
                  fab
                  dark
                  small
                  @click="deleteSelectedPayments"
                >
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </v-col>

            <v-col
              class="journal-of-payment-docs-docs-from-pay-col journal-of-payment-docs-col-5"
            >
              <v-subheader class="font-weight-medium text-subtitle-1">
                Документы на оплату
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
                    <th />
                    <th>{{ totalSumOplat }}</th>
                  </tr>
                </template>
              </v-data-table>
            </v-col>

            <v-col
              class="journal-of-payment-docs-buttons-of-payment-docs-table journal-of-payment-docs-col-1"
            >
              <v-subheader class="font-weight-medium text-subtitle-1" />
              <div align="center">
                <v-btn
                  color="blue"
                  class="mr-2 mb-2"
                  fab
                  dark
                  small
                  @click="newDocument"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>

                <br>
                <v-btn
                  color="blue"
                  class="mr-2 mb-2"
                  fab
                  dark
                  small
                  @click="editDocument"
                >
                  <v-icon>mdi-file-edit</v-icon>
                </v-btn>

                <br>
                <v-btn
                  color="blue"
                  class="mr-2 mb-2"
                  fab
                  dark
                  small
                  @click="copyDocument"
                >
                  <v-icon>mdi-content-copy</v-icon>
                </v-btn>

                <br>
                <v-btn
                  color="blue"
                  class="mr-2 mb-2"
                  fab
                  dark
                  small
                  @click="deleteDocument"
                >
                  <v-icon>mdi-delete-forever</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="5">
              {{ restPaymentAccountInfo }}
            </v-col>
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
import EditPaymentDocument from '@/views/payment/PaymentDocument/Modals/EditPaymentDocument'

export default {
  axiosConfig: {
    auth: {
    }
  },
  name: 'PaymentDocument',
  components: {
    EditPaymentDocument
  },
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      loadingType: {},
      payMenu: false,
      x: 0,
      y: 0,
      snackSumOplat: false,
      snackColorSumOplat: '',
      snackTextSumOplat: '',
      organizations: [],
      selectedOrganization: null,
      paymentAccounts: [],
      paymentAccountInfo: 'Сумма Р/С:',
      restPaymentAccountInfo: 'Остаток Р/С:',
      toPayHeaders: [
        {
          text: 'Подразделение',
          value: 'nameViddoc'
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
      totalSumDoc: 0,
      totalSumOplat: 0,
      totalToSumOplat: 0,
      accId: null,
      orgAccInfoData: [],
      fromPayHeaders: [
        {
          text: 'Подразделение',
          value: 'nameViddoc'
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
      toPaySelectedRows: [],
      fromPaySelectedRows: [],
      orgAccInfoHeaders: [
        {
          text: '',
          value: 'name'
        },
        {
          text: 'Меридиан',
          value: 'org1Value'
        },
        {
          text: 'Золотая нить',
          value: 'org2Value'
        },
        {
          text: 'БРИГ',
          value: 'org3Value'
        },
        {
          text: 'БОФ',
          value: 'org4Value'
        },
        {
          text: 'Голяткино',
          value: 'org5Value'
        },
        {
          text: 'Н шов. б. (Меридиан)',
          value: 'org6Value'
        }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.selOplat()
      this.loadingType = {}
      this.fromPaySelectedRows = []
      this.toPaySelectedRows = []
      this.findOrganizatios()
      // this.findSpDocoplForPay()
      // this.findOrgAccInfo()
      this.findOrgAccInfo()
    },
    updateAllInfo() {
      if (this.selectedOrganization) {
        this.findSpDocoplForPay()
      }
      this.findOrgAccInfo()
      this.fromPaySelectedRows = []
      this.toPaySelectedRows = []
    },
    async selOplat() {
      await this.$axios.$post('/meridian/oper/spDocopl/selOplat', this.axiosConfig)
    },
    async findOrgAccInfo() {
      const data = {
        dateOplat: new Date(this.date).toLocaleDateString()
      }
      await this.$axios.$get('/meridian/oper/spOplat/groupByOrg', { params: data }).then((value) => {
        this.orgAccInfoData = []
        let brigBalance = 0
        let meridianBalance = 0
        let goldenThread = 0
        let bofBalance = 0
        let golyatkinoBalance = 0
        let nShovBalance = 0
        value.forEach((element) => {
          if (element.myOrg.id === 123) {
            brigBalance = element.saldo
          } else if (element.myOrg.id === 159) {
            meridianBalance = element.saldo
          } else if (element.myOrg.id === 19469) {
            goldenThread = element.saldo
          } else if (element.myOrg.id === 22110) {
            bofBalance = element.saldo
          } else if (element.myOrg.id === 31699) {
            golyatkinoBalance = element.saldo
          } else if (element.myOrg.id === 36315) {
            nShovBalance = element.saldo
          }
        })
        this.orgAccInfoData.push({
          name: 'Расч. счёт',
          org1Value: meridianBalance,
          org2Value: goldenThread,
          org3Value: brigBalance,
          org4Value: bofBalance,
          org5Value: golyatkinoBalance,
          org6Value: nShovBalance
        })
        this.orgAccInfoData.push({
          name: 'Касса',
          org1Value: null,
          org2Value: null,
          org3Value: null,
          org4Value: null,
          org5Value: null,
          org6Value: null
        })
      })
    },
    closePaymentDocument() {
      console.log('close')
      this.findSpDocoplForPay()
    },
    savePaymentDocument() {
      console.log('open')
      this.findSpDocoplForPay()
      this.fromPaySelectedRows = []
    },
    showPayMenu(e) {
      e.preventDefault()
      this.showMenu = false
      this.x = e.clientX
      this.y = e.clientY
      this.$nextTick(() => {
        this.payMenu = true
      })
    },
    newDocument() {
      this.$refs.editPaymentDocument.newDocument()
    },
    editDocument() {
      if (this.fromPaySelectedRows && this.fromPaySelectedRows.length) {
        this.$refs.editPaymentDocument.editDocument(this.fromPaySelectedRows[0].id)
      }
    },
    async deleteDocument() {
      if (this.fromPaySelectedRows && this.fromPaySelectedRows.length) {
        const ids = this.fromPaySelectedRows.map(value => value.id)
        await this.$axios.$post('/meridian/oper/spDocopl/deletePayment', ids, this.axiosConfig)
        this.findSpDocoplForPay()
      }
    },
    copyDocument() {
      if (this.fromPaySelectedRows && this.fromPaySelectedRows.length) {
        this.$refs.editPaymentDocument.copyDocument(this.fromPaySelectedRows[0].id)
      }
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
        this.organizations = await this.$axios.$get('/meridian/oper/dict/spOrg/findInternalOrg', this.axiosConfig)
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
      this.paymentAccounts = await this.$axios.$get('/meridian/oper/spAcc/findByOrgId?orgId=' + val, this.axiosConfig)
      this.loadingType.paymentAccounts = null
    },
    async findSpDocoplForPay() {
      const data = {
        dateDoc: new Date(this.date).toLocaleDateString(),
        orgId: this.selectedOrganization
      }
      this.fromPayData = await this.$axios.$get('/meridian/oper/spDocopl/findSpDocoplForPay', { params: data })
      let totalSumDoc = 0
      let totalSumOplat = 0
      this.fromPayData.forEach((value) => {
        totalSumDoc += value.sumDoc
        totalSumOplat += value.sumOplat
      })
      this.totalSumDoc = totalSumDoc
      this.totalSumOplat = totalSumOplat
    },
    async findToPay(val) {
      const data = {
        accId: val
      }
      this.toPayData = await this.$axios.$get('/meridian/oper/spDocopl/findSpDocoplToPay', { params: data }, this.axiosConfig)
      let totalToSumOplat = 0
      this.toPayData.forEach((value) => {
        totalToSumOplat += value.sumOplat
      })
      this.totalToSumOplat = totalToSumOplat
    },
    organizationChange(val) {
      this.selectedOrganization = val
      this.toPayData = []
      this.findPaymentAccounts(val)
      this.findSpDocoplForPay()
      this.updateResPaymentAccountInfo()
    },
    paymentAccountChange(val) {
      this.findToPay(val)
      this.updatePaymentAccountInfo(val)
    },
    async addPayments() {
      if (this.fromPaySelectedRows && this.fromPaySelectedRows.length) {
        const ids = this.fromPaySelectedRows.map(value => value.id)
        console.log(ids)
        const data = { ids, accId: this.accId }
        await this.$axios.$post('/meridian/oper/spDocopl/payDocument', data, this.axiosConfig)
        this.refreshTables()
      }
    },
    addPaymentsClick() {
      if (!this.accId) {
        alert('Выберите расчётный счёт!')
        return
      }
      this.addPayments()
    },
    async deleteSelectedPayments() {
      if (this.toPaySelectedRows && this.toPaySelectedRows.length) {
        const ids = this.toPaySelectedRows.map(value => value.id)
        console.log(ids)
        await this.$axios.$post('/meridian/oper/spDocopl/deleteSelectedPayments', ids, this.axiosConfig)
        this.refreshTables()
      }
    },
    async updateResPaymentAccountInfo() {
      const data = {
        dateOplat: new Date(this.date).toLocaleDateString()
      }
      await this.$axios.$get('/meridian/oper/spOplat/groupByOrg', { params: data }).then((value) => {
        value.forEach((element) => {
          if (element.myOrg.id === this.selectedOrganization) {
            this.restPaymentAccountInfo = 'Остаток Р/С: ' + element.saldo
          }
        })
      })
    },
    async updatePaymentAccountInfo(accId) {
      const data = {
        dateOplat: new Date(this.date).toLocaleDateString(),
        orgId: this.selectedOrganization
      }
      await this.$axios.$get('/meridian/oper/spOplat/findByDataOplatAndMyOrgId', { params: data }).then((value) => {
        value.forEach((element) => {
          if (element.acc.id === accId) {
            this.paymentAccountInfo = 'Сумма Р/С: ' + element.saldo
            console.log(this.paymentAccountInfo)
          }
        })
      })
    },
    saveSumOplat() {
      this.snackSumOplat = true
      this.snackColorSumOplat = 'success'
      this.snackTextSumOplat = 'Сумма оплаты сохранена'

      /* await this.$axios.$post('/meridian/oper/spDocopl/payDocument', data, this.axiosConfig)
      this.refreshTables() */
    },
    cancelSumOplat() {
      this.snackSumOplat = true
      this.snackColorSumOplat = 'error'
      this.snackTextSumOplat = 'Сумма оплаты не была изменена'
    }
    /* restAccountClick() {
      this.$router.push('InputOfBalances')
      // alert('необходимо описание')
    }, */
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
  padding-right: 0px;
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
    flex: 0 0 8.3333333333%;
    max-width: 3.5%;
}
.journal-of-payment-docs-col-5 {
    flex: 0 0 41.6666666667%;
    max-width: 46%;
}
.journal-of-payment-docs-row {
    display: flex;
    flex-wrap: wrap;
    flex: 1 1 auto;
    margin: -12px;
}
.journal-of-payment-main-row {
    display: flex;
    flex-wrap: wrap;
    flex: 1 1 auto;
    margin-left: -12px;
    margin-right:  -12px;
    margin-bottom:  -12px;
}
</style>
