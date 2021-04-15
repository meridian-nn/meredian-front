<template>
  <v-dialog
    v-model="dialog"
    :value="show"
    max-width="860px"
    @input="$emit('close')"
    class="edit-payment-document-modal"
  >
    <template #activator="{ on, attrs }">
      <v-fab-transition>
        <v-btn
          color="blue"
          class="mr-2 mb-2"
          fab
          dark
          small
          fixed
          bottom
          right
          v-bind="attrs"
          v-on="on"
          @click="dialog = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>
    </template>

    <v-card>
      <v-card-title>
        <span class="headline">Распределение платежей</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row class="border-bottom">
            <v-col cols="3">
              <v-subheader class="font-weight-medium text-subtitle-1">Дата документа: </v-subheader>
            </v-col>

            <v-col cols="3">
              <v-menu
                ref="menu1"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="menu"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.dataDoc"
                    label="Дата документа"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    outlined
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="editedItem.dataDoc"
                  no-title
                  scrollable
                  locale="ru-ru"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="menu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu1.save(date)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="3">
              <v-text-field
                v-model="editedItem.nameDoc"
                label="Номер документа"
                outlined
              />
            </v-col>

            <v-col cols="3">
              <v-autocomplete
                v-model="editedItem.departmentId"
                label="Подразделение"
                :loading="loadingType.departments"
                :items="departments"
                item-value="id"
                item-text="nameViddoc"
                outlined
                @change="departmentChange"
              />
            </v-col>
          </v-row>

          <v-row class="border-bottom">
            <v-col cols="3">
              <v-subheader class="font-weight-medium text-subtitle-1">Оплатить до: </v-subheader>
            </v-col>

            <v-col cols="3">
              <v-menu
                ref="menu"
                v-model="menuDataOplat"
                :close-on-content-click="false"
                :return-value.sync="menuDataOplat"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editedItem.dataOplat"
                    label="Оплатить до"
                    prepend-icon="mdi-calendar"
                    readonly
                    outlined
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="editedItem.dataOplat"
                  no-title
                  scrollable
                  locale="ru-ru"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="menu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu.save(date)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="4">
              <v-autocomplete
                v-model="editedItem.viddocId"
                label="Тип документа"
                :loading="loadingType.documentTypes"
                :items="documentTypes"
                item-value="id"
                outlined
                item-text="nameViddoc"
              />
            </v-col>
          </v-row>

          <v-row class="border-bottom">
            <v-col cols="3">
              <v-subheader class="font-weight-medium text-subtitle-1">Поставщик</v-subheader>
            </v-col>

            <v-col cols="4">
              <v-autocomplete
                v-model="editedItem.ispId"
                label="Поставщик"
                :loading="loadingType.executors"
                :items="executors"
                outlined
                item-value="id"
                item-text="fio"
                @change="findContracts"
              />
            </v-col>

            <v-col cols="3">
              <v-text-field
                v-model="editedItem.sumDoc"
                type="number"
                label="Сумма по договору"
                outlined
                @input="calcSum"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="3">
              <v-subheader class="font-weight-medium text-subtitle-1">Плательщик</v-subheader>
            </v-col>

            <v-col cols="7">
              <v-autocomplete
                v-model="editedItem.contractId"
                label="Договор"
                :loading="loadingType.contracts"
                :items="contracts"
                item-value="id"
                item-text="numDogInt"
                @change="findSuppliers"
                outlined
              />
            </v-col>

            <v-col cols="2">
              <v-text-field
                v-model="editedItem.sumPaid"
                type="number"
                outlined
                label="Оплачено"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="3" />

            <v-col cols="7">
              <v-autocomplete
                v-model="editedItem.supplierId"
                label="Плательщик"
                :loading="loadingType.suppliers"
                :items="suppliers"
                item-value="id"
                outlined
                item-text="clName"
              />
            </v-col>

            <v-col cols="2">
              <v-text-field
                v-model="editedItem.toPay"
                type="number"
                outlined
                label="К оплате"
                readonly
              />
            </v-col>
          </v-row>

          <v-row class="border-bottom">
            <v-col cols="3" />

            <v-col cols="8">
              <v-autocomplete
                label="Плательшик"
                v-model="editedItem.myorgId"
                :loading="loadingType.payers"
                :items="payers"
                item-value="id"
                outlined
                item-text="clName"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="3">
              <v-subheader class="font-weight-medium text-subtitle-1">Клиент, для кого поставка</v-subheader>
            </v-col>

            <v-col cols="6">
              <v-autocomplete
                v-model="editedItem.consumerId"
                label="Клиент, для кого поставка"
                :loading="loadingType.suppliers"
                :items="suppliers"
                item-value="id"
                outlined
                item-text="clName"
              />
            </v-col>

            <v-col cols="3">
              <v-autocomplete
                v-model="editedItem.documentKindId"
                label="Вид документа"
                :loading="loadingType.documentKinds"
                :items="documentKinds"
                item-value="id"
                outlined
                item-text="nameViddoc"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="3" />

            <v-col cols="6">
              <v-autocomplete
                v-model="editedItem.paymentStatus"
                label="Статус платежа"
                :loading="loadingType.paymentStatuses"
                :items="paymentStatuses"
                item-value="name"
                item-text="label"
                outlined
              />
            </v-col>
            <v-col cols="3">
              <v-checkbox
                label="Без НДС"
                v-model="editedItem.bnds"
                color="primary"
                :ripple="false"
                dense
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="3" />

            <v-col cols="9">
              <v-textarea
                v-model="editedItem.prim"
                label="Примечание"
                auto-grow
                outlined
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />

        <v-btn
          color="blue darken-1"
          text
          @click="dialog = false"
        >
          Отмена
        </v-btn>

        <v-btn
          color="blue darken-1"
          text
          @click="save"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'EditPaymentDocument',
  props: {
    title: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      menu: false,
      menuDataOplat: false,
      loadingType: {},
      dataDoc: "",
      departments: [],
      documentTypes: [],
      paymentStatuses: [],
      executors: [],
      contracts: [],
      payers: [],
      suppliers: [],
      documentKinds: [],
      search: null,
      select: null,
      dialog: false,
      editedItem: {
        bnds: true,
        consumerId: 0,
        contractId: 0,
        dataCreate: "",
        dataDoc: "",
        dataEdit: "",
        dataOplat: "",
        departmentId: 0,
        descr: "",
        documentKindId: 0,
        flagDel: 0,
        id: 0,
        ispId: 0,
        myorgId: 0,
        nameDoc: "",
        paymentStatus: "CACHE",
        podpis: 0,
        prim: "string",
        prior: 0,
        stepId: 0,
        sumDoc: 0,
        supplierId: 0,
        tipDoc: 0,
        viddocId: 0
      },
      axiosConfig: {
        auth: {
          username: 'admin',
          password: 'Wtrkop45'
        },
        baseURL: 'http://192.168.1.70:9037/meridian',
        proxy: true,
        credentials: false,
        mode: 'no-cors'
      }
    }
  },
  watch: {
    dialog(val) {
      if (val) {
        this.init()
      }
    }
  },
  methods: {
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}.${day}.${year}`
    },
    init() {
      this.findDepartments()
      this.findDocumentType()
      this.findPayers()
      this.findPaymentStatuses()
      this.findDocumentKinds()
      this.findContracts(1)
    },

    async findDepartments() {
      if (!this.departments.length) {
        this.loadingType.departments = true
        this.departments = await this.$axios.$get('http://192.168.1.70:9037/meridian/oper/dict/spViddocopl/findDepartments')
        this.loadingType.departments = null
      }
    },
    async findPaymentStatuses() {
      if (!this.paymentStatuses.length) {
        this.loadingType.paymentStatuses = true
        this.paymentStatuses = await this.$axios.$get('http://192.168.1.70:9037/meridian/oper/spDocopl/findPaymentStatuses')
        this.loadingType.paymentStatuses = null
      }
    },
    async findDocumentType(parentId) {
      if (parentId) {
        this.loadingType.documentTypes = true
        this.documentTypes = await this.$axios.$get('http://192.168.1.70:9037/meridian/oper/dict/spViddocopl/findByParentId?parentId=' + parentId)
        this.loadingType.documentTypes = null
      } else {
        this.documentTypes = []
      }
    },
    async findExecutors(viddocoplId) {
      if (viddocoplId) {
        this.loadingType.executors = true
        this.executors = await this.$axios.$get('http://192.168.1.70:9037/meridian/oper/dict/spIsp/findByViddocopl?viddocoplId=' + viddocoplId)
        this.loadingType.executors = null
      } else {
        this.executors = []
      }
    },
    async findSuppliers(dogId) {
      this.loadingType.suppliers = true
      this.suppliers = await this.$axios.$get('http://192.168.1.70:9037/meridian/oper/dict/spOrg/findByDogId?dogId=' + dogId)
      this.loadingType.suppliers = null
    },
    async findPayers() {
      if (!this.payers.length) {
        this.loadingType.payers = true
        this.payers = await this.$axios.$get('http://192.168.1.70:9037/meridian/oper/dict/spOrg/findPayers')
        this.loadingType.payers = null
      }
    },
    async findDocumentKinds() {
      if (!this.documentKinds.length) {
        this.loadingType.documentKinds = true
        this.documentKinds = await this.$axios.$get('http://192.168.1.70:9037/meridian/oper/dict/spViddoc/findAll')
        this.loadingType.documentKinds = null
      }
    },
    async findContracts(executorId) {
      this.loadingType.contracts = true
      this.contracts = await this.$axios.$get('http://192.168.1.70:9037/meridian/oper/dogSelDogSpisSpec/findByMyDescr?myDescr=' + executorId)
      this.loadingType.contracts = null
    },
    calcSum(val) {
      this.editedItem.toPay = (val || 0) - (this.editedItem.sumPaid || 0)
    },
    departmentChange(val) {
      this.findDocumentType(val)
      this.findExecutors(val)
    },
    async save() {
      let errorMessage = null
      await this.$axios.$post('http://192.168.1.70:9037/meridian/oper/spDocopl/save', {
        ...this.editedItem,
        dataCreate: this.formatDate(this.editedItem.dataCreate),
        dataDoc: this.formatDate(this.editedItem.dataDoc),
        dataEdit: this.formatDate(this.editedItem.dataEdit),
        dataOplat: this.formatDate(this.editedItem.dataOplat)
      }).catch((error) => {
        errorMessage = error
      })
      if (errorMessage === null) {
        this.dialog = false
      }
    },
    cancel() {
      this.reset()
      this.dialog = false
    },
    reset() {
      this.loadingType = {}
      this.editedItem = {
        bnds: true,
          consumerId: 0,
          contractId: 0,
          dataCreate: "",
          dataDoc: "",
          dataEdit: "",
          dataOplat: "",
          departmentId: 0,
          descr: "",
          documentKindId: 0,
          flagDel: 0,
          id: 0,
          ispId: 0,
          myorgId: 0,
          nameDoc: "",
          paymentStatus: "",
          podpis: 0,
          prim: "",
          prior: 0,
          stepId: 0,
          sumDoc: 0,
          supplierId: 0,
          tipDoc: 0,
          viddocId: 0
      }
      this.departments = []
      this.documentTypes = []
      this.contracts = []
      this.executors = []
      this.suppliers = []
    },
    newDocument() {
      this.reset()
      this.dialog = true
    },
    editDocument(editedItem) {
      this.reset()
      this.dialog = true
    }
  }
}
</script>
<style type="scss" scoped>
.col {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.border-bottom {
  position: relative;
  margin-bottom: 15px;
}

.border-bottom::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 30px;
  right: 10px;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
