<template>
  <div>
    <edit-payment-document
      ref="editPaymentDocument"
      @close="closePaymentDocument"
      @save="savePaymentDocument"
    />
    <v-card>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="10">
              <div
                align="center"
                class="headline"
              >
                Журнал документов на оплату
              </div>
            </v-col>
            <v-col cols="2">
              <div
                align="center"
              >
                {{ date }}
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10">
              <v-data-table
                :headers="orgAccInfoHeaders"
                :items="orgAccInfoData"
                hide-default-footer
                class="elevation-1"
              />
            </v-col>
            <v-col cols="1">
              <v-btn
                @click="restAccountClick"
              >
                Ввод остатков по Р/С
              </v-btn>
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
          </v-row>
          <v-row>
            <v-col cols="5">
              <v-autocomplete
                v-model="accId"
                label="расч. счет"
                :loading="loadingType.paymentAccounts"
                :items="paymentAccounts"
                item-value="id"
                item-text="shortName"
                @change="paymentAccountChange"
              />
            </v-col>
            <v-col cols="5">
              <span class="headline">{{ paymentAccountInfo }}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="5">
              <v-data-table
                v-model="toPaySelectedRows"
                :headers="toPayHeaders"
                :items="toPayData"
                :items-per-page="50"
                :show-select="true"
                :single-select="false"
                class="elevation-1"
                caption="Документы к оплате"
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
                  </tr>
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
            </v-col>
            <v-col cols="1">
              <v-btn
                width="10"
                @click="addPaymentsClick"
              >
                &#x2190;
              </v-btn>
              <br>
              <v-btn
                width="10"
                @click="deleteSelectedPayments"
              >
                &#x2192;
              </v-btn>
            </v-col>
            <v-col cols="5">
              <v-data-table
                v-model="fromPaySelectedRows"
                :headers="fromPayHeaders"
                :items="fromPayData"
                :show-select="true"
                :single-select="false"
                :items-per-page="50"
                caption="Документы на оплату"
                class="elevation-1"
              >
                <template slot="body.append">
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
            <v-col cols="1">
              <v-btn
                color="blue"
                class="mr-2 mb-2"
                @click="newDocument"
              >
                Н
              </v-btn>
              <br>
              <v-btn
                color="blue"
                class="mr-2 mb-2"
                @click="editDocument"
              >
                Р
              </v-btn>
              <v-btn
                color="blue"
                class="mr-2 mb-2"
                @click="deleteDocument"
              >
                У
              </v-btn>
              <v-btn
                color="blue"
                class="mr-2 mb-2"
                @click="copyDocument"
              >
                К
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="5">
              {{ restPaymentAccountInfo }}
            </v-col>
            <v-col cols="5">
              <v-text-field
                label="Комментарий (необходимо описание)"
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
      date: '01.01.2021',
      loadingType: {},
      payMenu: false,
      x: 0,
      y: 0,
      organizations: [],
      paymentAccounts: [],
      paymentAccountInfo: 'Сумма Р/С: Необходимо описание',
      restPaymentAccountInfo: 'Остаток Р/С: Необходимо описание',
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
          text: 'namePlat1',
          value: 'namePlat1'
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
        }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async selOplat() {
      await this.$axios.$post('/meridian/oper/spDocopl/selOplat', this.axiosConfig)
    },
    closePaymentDocument() {
      console.log('close')
    },
    savePaymentDocument() {
      console.log('open')
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
        this.refreshTables()
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
    init() {
      this.selOplat()
      this.loadingType = {}
      this.fromPaySelectedRows = []
      this.toPaySelectedRows = []
      this.findOrganizatios()
      this.findSpDocoplForPay()
      this.findOrgAccInfo()
    },
    async findOrganizatios() {
      if (!this.organizations.length) {
        this.loadingType.organizations = true
        this.organizations = await this.$axios.$get('/meridian/oper/dict/spOrg/findInternalOrg', this.axiosConfig)
        this.loadingType.organizations = null
      }
    },
    async findOrgAccInfo() {
      if (!this.orgAccInfoData.length) {
        this.orgAccInfoData = await this.$axios.$get('/meridian/oper/spDocopl/getOrgAccInfo', this.axiosConfig)
      }
    },
    async findPaymentAccounts(val) {
      this.loadingType.paymentAccounts = true
      this.paymentAccounts = await this.$axios.$get('/meridian/oper/spAcc/findByOrgId?orgId=' + val, this.axiosConfig)
      this.loadingType.paymentAccounts = null
    },
    async findSpDocoplForPay() {
      this.fromPayData = await this.$axios.$get('/meridian/oper/spDocopl/findSpDocoplForPay', this.axiosConfig)
      let totalSumDoc = 0
      let totalSumOplat = 0
      this.fromPayData.forEach((value) => {
        totalSumDoc += value.sumDoc
        totalSumOplat += value.sumDoc
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
      this.findPaymentAccounts(val)
    },
    paymentAccountChange(val) {
      this.findToPay(val)
    },
    async addPayments() {
      if (this.fromPaySelectedRows && this.fromPaySelectedRows.length) {
        const ids = this.fromPaySelectedRows.map(value => value.id)
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
        await this.$axios.$post('/meridian/oper/spDocopl/deleteSelectedPayments', ids, this.axiosConfig)
        this.refreshTables()
      }
    },
    restAccountClick() {
      alert('необходимо описание')
    }
  }

}
</script>
