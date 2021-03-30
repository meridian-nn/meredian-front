<template>
  <v-dialog
    v-model="dialog"
    :value="show"
    max-width="1000px"
    @input="$emit('close')"
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
                v-model="editedItem.myorgId"
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
            <v-col cols="12">
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
                v-model="editedItem.sumDoc"
                type="number"
                label="Сумма оплаты"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-autocomplete
                label="Плательшик"
                :loading="loadingType.payers"
                :items="payers"
                item-value="id"
                item-text="clName"
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
                v-model="editedItem.descr"
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
          @click="$emit('close')"
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
  axiosConfig: {
    auth: {
      username: 'admin',
      password: 'Wtrkop45'
    }
  },
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
      editedItem: {}
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
    async findDepartments() {
      if (!this.departments.length) {
        this.loadingType.departments = true
        this.departments = await this.$axios.$get('/oper/dict/spViddocopl/findDepartments', this.axiosConfig)
        this.loadingType.departments = null
      }
    },
    async findPaymentStatuses() {
      if (!this.paymentStatuses.length) {
        this.loadingType.paymentStatuses = true
        this.paymentStatuses = await this.$axios.$get('/oper/spDocopl/findPaymentStatuses', this.axiosConfig)
        this.loadingType.paymentStatuses = null
      }
    },
    async findDocumentType(parentId) {
      if (parentId) {
        this.loadingType.documentTypes = true
        this.documentTypes = await this.$axios.$get('/oper/dict/spViddocopl/findByParentId?parentId=' + parentId, this.axiosConfig)
        this.loadingType.documentTypes = null
      } else {
        this.documentTypes = []
      }
    },
    async findExecutors(viddocoplId) {
      if (viddocoplId) {
        this.loadingType.executors = true
        this.executors = await this.$axios.$get('/oper/dict/spIsp/findByViddocopl?viddocoplId=' + viddocoplId, this.axiosConfig)
        this.loadingType.executors = null
      } else {
        this.executors = []
      }
    },
    async findSuppliers(dogId) {
      this.loadingType.suppliers = true
      this.suppliers = await this.$axios.$get('/oper/dict/spOrg/findByDogId?dogId=' + dogId, this.axiosConfig)
      this.loadingType.suppliers = null
    },
    async findPayers() {
      if (!this.payers.length) {
        this.loadingType.payers = true
        this.payers = await this.$axios.$get('/oper/dict/spOrg/findPayers', this.axiosConfig)
        this.loadingType.payers = null
      }
    },
    async findDocumentKinds() {
      if (!this.documentKinds.length) {
        this.loadingType.documentKinds = true
        this.documentKinds = await this.$axios.$get('/oper/dict/spViddoc/findAll', this.axiosConfig)
        this.loadingType.documentKinds = null
      }
    },
    async findContracts(executorId) {
      this.loadingType.contracts = true
      this.contracts = await this.$axios.$get('/oper/dogSelDogSpisSpec/findByMyDescr?myDescr=' + executorId, this.axiosConfig)
      this.loadingType.contracts = null
    },
    departmentChange(val) {
      this.findDocumentType(val)
      this.findExecutors(val)
    },
    async save() {
      let errorMessage = null
      await this.$axios.$post('/oper/spDocopl/save', this.editedItem, this.axiosConfig).catch((error) => {
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
