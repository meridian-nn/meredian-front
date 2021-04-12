<template>
  <div>
    Распределение платежей
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
                label="расч. счет"
                :loading="loadingType.paymentAccounts"
                :items="paymentAccounts"
                item-value="id"
                item-text="shortName"
              />
            </v-col>
            <v-col cols="5">
              <span class="headline">{{ paymentAccountInfo }}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="5">
              <v-data-table
                :headers="payHeaders"
                :items="payData"
                :items-per-page="50"
                class="elevation-1"
                @contextmenu:row="showPayMenu"
              >
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
            <v-col cols="6">
              <v-data-table
                v-model="docSelectedRows"
                :headers="docHeaders"
                :items="docData"
                :show-select="true"
                :single-select="true"
                :items-per-page="50"
                class="elevation-1"
              >
                <template slot="body.append">
                  <tr>
                    <th>Total</th>
                    <th>150</th>
                    <th>260</th>
                    <th>150</th>
                    <th>260</th>
                    <th>33%</th>
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
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <br>
              <v-btn
                color="blue"
                class="mr-2 mb-2"
                @click="editDocument"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
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
      paymentAccountInfo: 'Сумма Р/С 500 000.00',
      payHeaders: [
        {
          text: 'Счет',
          value: 'account'
        },
        {
          text: 'Контрагент',
          value: 'client'
        },
        {
          text: 'Плательщик',
          value: 'payer'
        },
        {
          text: 'К оплате',
          value: 'toPay'
        }
      ],
      payData: [],
      docHeaders: [
        {
          text: 'Дата',
          value: 'dataDoc'
        },
        {
          text: '№ счета',
          value: 'accountNumber'
        },
        {
          text: 'Срок',
          value: 'dataOplat'
        },
        {
          text: 'Сумма',
          value: 'sumDoc'
        },
        {
          text: 'К оплате',
          value: 'paySum'
        },
        {
          text: 'Исполнитель',
          value: 'executor'
        },
        {
          text: 'Подразделение',
          value: 'department'
        },
        {
          text: 'Плательщик',
          value: 'payer'
        }
      ],
      docData: [],
      docSelectedRows: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
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
      if (this.docSelectedRows && this.docSelectedRows.length) {
        this.$refs.editPaymentDocument.editDocument(this.docSelectedRows[0].id)
      }
    },
    init() {
      this.loadingType = {}
      this.docSelectedRows = []
      this.findOrganizatios()
      this.findDocData()
    },
    async findOrganizatios() {
      if (!this.organizations.length) {
        this.loadingType.organizations = true
        this.organizations = await this.$axios.$get('/meridian/oper/dict/spOrg/findInternalOrg', this.axiosConfig)
        this.loadingType.organizations = null
      }
    },
    async findPaymentAccounts(val) {
      this.loadingType.paymentAccounts = true
      this.paymentAccounts = await this.$axios.$get('/meridian/oper/spAcc/findByOrgId?orgId=' + val, this.axiosConfig)
      this.loadingType.paymentAccounts = null
    },
    async findDocData() {
      this.docData = await this.$axios.$get('/meridian/oper/spDocoplJornal/find', this.axiosConfig)
    },
    organizationChange(val) {
      this.findPaymentAccounts(val)
    }
  }

}
</script>
