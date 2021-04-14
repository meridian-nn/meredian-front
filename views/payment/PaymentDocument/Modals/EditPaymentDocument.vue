<template>
  <v-dialog
    v-model="dialog"
    :value="show"
    max-width="1000px"
  >

    <v-card>
      <v-card-title>
        <span class="headline">Распределение платежей</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="2">
              <v-text-field
                v-model="editedItem.dataDoc"
                label="Дата документа"
              />
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="editedItem.nameDoc"
                label="Номер документа"
              />
            </v-col>
            <v-col cols="4">
              <v-autocomplete
                v-model="editedItem.departmentId"
                label="Подразделение"
                :loading="loadingType.departments"
                :items="departments"
                item-value="id"
                item-text="nameViddoc"
                @change="departmentChange"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <v-text-field
                v-model="editedItem.dataOplat"
                label="Оплатить до"
              />
            </v-col>
            <v-col cols="4">
              <v-autocomplete
                v-model="editedItem.viddocId"
                label="Тип документа"
                :loading="loadingType.documentTypes"
                :items="documentTypes"
                item-value="id"
                item-text="nameViddoc"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-autocomplete
                v-model="editedItem.ispId"
                label="Исполнитель"
                :loading="loadingType.executors"
                :items="executors"
                item-value="id"
                item-text="fio"
                @change="findContracts"
              />
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="editedItem.sumDoc"
                type="number"
                label="Сумма по договору"
                @input="calcSum"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10">
              <v-autocomplete
                v-model="editedItem.contractId"
                label="Договор"
                :loading="loadingType.contracts"
                :items="contracts"
                item-value="id"
                item-text="numDogInt"
                @change="findSuppliers"
              />
            </v-col>
            <v-col cols="2">
              <v-text-field
                readonly="true"
                v-model="editedItem.sumPaid"
                type="number"
                label="Оплачено"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-autocomplete
                v-model="editedItem.supplierId"
                label="Поставщик"
                :loading="loadingType.suppliers"
                :items="suppliers"
                item-value="id"
                item-text="clName"
              />
            </v-col>
            <v-col cols="2">
              <v-text-field
                readonly="true"
                v-model="editedItem.toPay"
                type="number"
                label="К оплате"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-autocomplete
                label="Плательшик"
                v-model="editedItem.myorgId"
                :loading="loadingType.payers"
                :items="payers"
                item-value="id"
                item-text="clName"
              />
            </v-col>
            <v-col cols="6">
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
            <v-col cols="6">
              <v-autocomplete
                v-model="editedItem.consumerId"
                label="Клиент, для кого поставка"
                :loading="loadingType.suppliers"
                :items="suppliers"
                item-value="id"
                item-text="clName"
              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="editedItem.documentKindId"
                label="Вид документа"
                :loading="loadingType.documentKinds"
                :items="documentKinds"
                item-value="id"
                item-text="nameViddoc"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-autocomplete
                v-model="editedItem.paymentStatus"
                label="Статус платежа"
                :loading="loadingType.paymentStatuses"
                :items="paymentStatuses"
                item-value="name"
                item-text="label"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10">
              <v-text-field
                v-model="editedItem.prim"
                label="Примечание"
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
          @click="cancel"
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
      loadingType: {},
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
      editedItem: {},
      id: null
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
    init() {
      this.findDepartments()
      this.findDocumentType()
      this.findPayers()
      this.findPaymentStatuses()
      this.findDocumentKinds()
    },
    async findEditedItem() {
      if (this.id) {
        const editedItem = await this.$axios.$get('/meridian/oper/spDocopl/findById/' + this.id, this.axiosConfig)
        this.findDocumentType(editedItem.departmentId)
        this.findExecutors(editedItem.departmentId)
        this.findSuppliers(editedItem.contractId)
        this.findContracts(editedItem.ispId)
        this.editedItem = editedItem
        this.calcSum(editedItem.sumDoc)
      }
    },
    async findDepartments() {
      if (!this.departments.length) {
        this.loadingType.departments = true
        this.departments = await this.$axios.$get('/meridian/oper/dict/spViddocopl/findDepartments', this.axiosConfig)
        this.loadingType.departments = null
      }
    },
    async findPaymentStatuses() {
      if (!this.paymentStatuses.length) {
        this.loadingType.paymentStatuses = true
        this.paymentStatuses = await this.$axios.$get('/meridian/oper/spDocopl/findPaymentStatuses', this.axiosConfig)
        this.loadingType.paymentStatuses = null
      }
    },
    async findDocumentType(parentId) {
      if (parentId) {
        this.loadingType.documentTypes = true
        this.documentTypes = await this.$axios.$get('/meridian/oper/dict/spViddocopl/findByParentId?parentId=' + parentId, this.axiosConfig)
        this.loadingType.documentTypes = null
      } else {
        this.documentTypes = []
      }
    },
    async findExecutors(viddocoplId) {
      if (viddocoplId) {
        this.loadingType.executors = true
        this.executors = await this.$axios.$get('/meridian/oper/dict/spIsp/findByViddocopl?viddocoplId=' + viddocoplId, this.axiosConfig)
        this.loadingType.executors = null
      } else {
        this.executors = []
      }
    },
    async findSuppliers(dogId) {
      this.loadingType.suppliers = true
      this.suppliers = await this.$axios.$get('/meridian/oper/dict/spOrg/findByDogId?dogId=' + dogId, this.axiosConfig)
      this.loadingType.suppliers = null
    },
    async findPayers() {
      if (!this.payers.length) {
        this.loadingType.payers = true
        this.payers = await this.$axios.$get('/meridian/oper/dict/spOrg/findPayers', this.axiosConfig)
        this.loadingType.payers = null
      }
    },
    async findDocumentKinds() {
      if (!this.documentKinds.length) {
        this.loadingType.documentKinds = true
        this.documentKinds = await this.$axios.$get('/meridian/oper/dict/spViddoc/findAll', this.axiosConfig)
        this.loadingType.documentKinds = null
      }
    },
    async findContracts(executorId) {
      this.loadingType.contracts = true
      this.contracts = await this.$axios.$get('/meridian/oper/dogSelDogSpisSpec/findByMyDescr?myDescr=' + executorId, this.axiosConfig)
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
      await this.$axios.$post('/meridian/oper/spDocopl/save', this.editedItem, this.axiosConfig).catch((error) => {
        errorMessage = error
        alert(errorMessage)
      })
      if (errorMessage == null) {
        this.dialog = false
      }
    },
    cancel() {
      this.reset()
      this.dialog = false
    },
    reset() {
      this.loadingType = {}
      this.editedItem = {}
      this.documentTypes = []
      this.contracts = []
      this.executors = []
      this.suppliers = []
      this.id = null
    },
    newDocument() {
      this.reset()
      this.dialog = true
    },
    editDocument(id) {
      this.reset()
      this.id = id
      this.dialog = true
      this.findEditedItem()
    }
  }
}
</script>
