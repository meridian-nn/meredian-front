<template>
  <v-dialog
    v-model="dialog"
    :value="show"
    max-width="1200px"
    padding="0px"
    class="edit-payment-document-modal"
    @input="$emit('close')"
  >
    <!--template #activator="{ on, attrs }">
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
    </template-->

    <v-card class="modal-card">
      <v-card-title>
        <span class="headline">Документ на оплату</span>
      </v-card-title>

      <v-card-text>
        <v-container class="container-data">
          <v-row class="border-bottom">
            <v-col cols="2">
              <v-subheader class="font-weight-medium text-subtitle-1">
                Дата документа
              </v-subheader>
            </v-col>

            <v-col cols="2">
              <v-text-field
                v-model="editedItem.dataDoc"
                type="date"
                outlined
              />
            </v-col>

            <v-col cols="3">
              <v-text-field
                v-model="editedItem.nameDoc"
                label="Номер документа"
                outlined
                hide-details="auto"
              />
            </v-col>

            <v-col cols="5">
              <v-autocomplete
                v-model="editedItem.departmentId"
                label="Подразделение"
                :loading="loadingType.departments"
                :items="departments"
                item-value="id"
                item-text="nameViddoc"
                outlined
                hide-details="auto"
                @change="departmentChange"
              />
            </v-col>
          </v-row>

          <v-row class="border-bottom">
            <v-col cols="2">
              <v-subheader class="font-weight-medium text-subtitle-1">
                Оплатить до
              </v-subheader>
            </v-col>

            <v-col cols="2">
              <v-text-field
                v-model="editedItem.dataOplat"
                type="date"
                outlined
                @input="dataOplatChange"
              />
            </v-col>

            <v-col cols="3" />

            <v-col cols="5">
              <v-autocomplete
                v-model="editedItem.viddocId"
                label="Тип документа"
                :loading="loadingType.documentTypes"
                :items="documentTypes"
                item-value="id"
                item-text="nameViddoc"
                outlined
              />
            </v-col>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <v-subheader class="font-weight-medium text-subtitle-1">
                Поставщик
              </v-subheader>
            </v-col>

            <v-col cols="5">
              <v-autocomplete
                v-model="editedItem.ispId"
                label="Поставщик"
                :loading="loadingType.executors"
                :items="executors"
                item-value="id"
                item-text="fio"
                outlined
                hide-details="auto"
                @change="findContracts"
              />
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model.number="editedItem.sumDoc"
                type="number"
                label="Сумма по договору"
                outlined
                hide-details="auto"
                @input="calcSum"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-text>
        <v-container class="container-data">
          <v-row>
            <v-col cols="6">
              <v-row>
                <v-col cols="3">
                  <v-subheader class="font-weight-medium text-subtitle-1">
                    Плательщик
                  </v-subheader>
                </v-col>

                <v-col cols="6">
                  <v-autocomplete
                    v-model="editedItem.contractId"
                    label="Договор"
                    :loading="loadingType.contracts"
                    :items="contracts"
                    item-value="id"
                    item-text="numDogInt"
                    outlined
                    hide-details="auto"
                    @change="findSuppliers"
                  />
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model.number="editedItem.sumPaid"
                    readonly="true"
                    type="number"
                    label="Оплачено"
                    hide-details="auto"
                    outlined
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="3" />

                <v-col cols="6">
                  <v-autocomplete
                    v-model="editedItem.supplierId"
                    label="Поставщик"
                    :loading="loadingType.suppliers"
                    :items="suppliers"
                    item-value="id"
                    item-text="clName"
                    hide-details="auto"
                    outlined
                  />
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="editedItem.toPay"
                    readonly="true"
                    type="number"
                    label="К оплате"
                    hide-details="auto"
                    outlined
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="3" />

                <v-col cols="9">
                  <v-autocomplete
                    v-model="editedItem.myorgId"
                    label="Плательщик"
                    :loading="loadingType.payers"
                    :items="payers"
                    item-value="id"
                    item-text="clName"
                    hide-details="auto"
                    outlined
                  />
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="6">
              <v-row>
                <v-col cols="3">
                  <v-subheader class="font-weight-medium text-subtitle-1">
                    Клиент, для кого поставка
                  </v-subheader>
                </v-col>

                <v-col cols="6">
                  <v-autocomplete
                    v-model="editedItem.consumerId"
                    label="Клиент, для кого поставка"
                    :loading="loadingType.suppliers"
                    :items="suppliers"
                    item-value="id"
                    item-text="clName"
                    hide-details="auto"
                    auto-select-first="true"
                    outlined
                  />
                </v-col>
                <v-col cols="3">
                  <v-autocomplete
                    v-model="editedItem.documentKindId"
                    label="Вид документа"
                    :loading="loadingType.documentKinds"
                    :items="documentKinds"
                    item-value="id"
                    item-text="nameViddoc"
                    hide-details="auto"
                    outlined
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
                    hide-details="auto"
                    outlined
                  />
                </v-col>
                <v-col cols="3">
                  <v-checkbox
                    v-model="editedItem.bnds"
                    label="Без НДС"
                    color="primary"
                    :ripple="false"
                    dense
                    hide-details="auto"
                    outlined
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3" />
                <v-col cols="9">
                  <v-text-field
                    v-model="editedItem.prim"
                    label="Примечание"
                    auto-grow
                    hide-details="auto"
                    outlined
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-snackbar
            v-model="snackbarUserNotification"
            :timeout="snackbarUserNotificationTimeout"
            :color="snackbarUserNotificationColor"
          >
            {{ snackbarUserNotificationText }}

            <template #action="{ attrs }">
              <v-btn
                v-bind="attrs"
                text
                @click="snackbarUserNotification = false"
              >
                Закрыть
              </v-btn>
            </template>
          </v-snackbar>
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

      // объект для отображения загрузки данных для полей
      loadingType: {},

      // массив подразделений для выбора пользователем
      departments: [],

      // массив типов документов для выбора пользователем
      documentTypes: [],

      // массив статусов оплаты документов для выбора пользователем
      paymentStatuses: [],

      // массив поставщиков для выбора пользователем
      executors: [],

      // массив договоров для выбора пользователем
      contracts: [],

      // массив плательщиков для выбора пользователем
      payers: [],

      // массив клиентов для выбора пользователем
      suppliers: [],

      // массив видов документов для выбора пользователем
      documentKinds: [],
      search: null,

      select: null,
      dialog: false,

      // объект, в котором хранится редактируемый документ
      editedItem: {},

      // id редактируемого документа
      id: null,

      // Информационное сообщение для пользователя
      snackbarUserNotification: false,
      snackbarUserNotificationTimeout: 3000,
      snackbarUserNotificationColor: '',
      snackbarUserNotificationText: ''
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

    // Поиск документа на оплату для редатирования / создания на основе нового документа
    async findEditedItem(copyDoc = false) {
      if (this.id) {
        const editedItem = await this.$axios.$get(
          '/meridian/oper/spDocopl/findById/' + this.id
        )
        this.findDocumentType(editedItem.departmentId)
        this.findExecutors(editedItem.departmentId)
        this.findSuppliers(editedItem.contractId)
        this.findContracts(editedItem.ispId)
        this.editedItem = editedItem

        if (copyDoc) {
          this.id = null
          this.editedItem.id = null
          this.editedItem.spDocches = []
          this.editedItem.spDocints = []
        }

        this.fillDatesEditedItem()
        this.calcSum(editedItem.sumDoc)
      }
    },

    // поиск подразделений для выбора пользователем
    async findDepartments() {
      if (!this.departments.length) {
        this.loadingType.departments = true
        this.departments = await this.$axios.$get(
          '/meridian/oper/dict/spViddocopl/findDepartments'
        )
        this.loadingType.departments = null
      }
    },

    // поиск статусов оплаты документа для выбора пользователем
    async findPaymentStatuses() {
      if (!this.paymentStatuses.length) {
        this.loadingType.paymentStatuses = true
        this.paymentStatuses = await this.$axios.$get(
          '/meridian/oper/spDocopl/findPaymentStatuses'
        )
        this.loadingType.paymentStatuses = null
      }
    },

    // поиск типов документов для выбора пользователем
    async findDocumentType(parentId) {
      if (parentId) {
        this.loadingType.documentTypes = true
        this.documentTypes = await this.$axios.$get(
          '/meridian/oper/dict/spViddocopl/findByParentId?parentId=' + parentId
        )
        this.loadingType.documentTypes = null
      } else {
        this.documentTypes = []
      }
    },

    // поиск поставщиков для выбора пользователем
    async findExecutors(viddocoplId) {
      if (viddocoplId) {
        this.loadingType.executors = true
        this.executors = await this.$axios.$get(
          '/meridian/oper/dict/spIsp/findByViddocopl?viddocoplId=' + viddocoplId
        )
        this.loadingType.executors = null
      } else {
        this.executors = []
      }
    },

    // поиск клиентов для выбора пользователем
    async findSuppliers(dogId) {
      this.loadingType.suppliers = true
      this.suppliers = await this.$axios.$get(
        '/meridian/oper/dict/spOrg/findByDogId?dogId=' + dogId
      )
      if (this.suppliers.length) {
        this.editedItem.consumerId = this.suppliers[this.suppliers.length - 1].id
      }
      this.loadingType.suppliers = null
    },

    // поиск плательщиков для выбора пользователем
    async findPayers() {
      if (!this.payers.length) {
        this.loadingType.payers = true

        this.payers = await this.$axios.$get(
          '/meridian/oper/dict/spOrg/findPayers'
        )

        this.loadingType.payers = null
      }
    },

    // поиск видов документов для выбора пользователем
    async findDocumentKinds() {
      if (!this.documentKinds.length) {
        this.loadingType.documentKinds = true
        this.documentKinds = await this.$axios.$get(
          '/meridian/oper/dict/spViddoc/findAll'
        )
        this.loadingType.documentKinds = null
      }
    },

    // поиск договоров для выбора пользователем
    async findContracts(executorId) {
      this.loadingType.contracts = true
      this.contracts = await this.$axios.$get(
        '/meridian/oper/dogSelDogSpisSpec/findByMyDescr?myDescr=' + executorId
      )
      this.loadingType.contracts = null
    },

    // расчет суммы к оплате документа
    calcSum(val) {
      this.editedItem.toPay = (val || 0) - (this.editedItem.sumPaid || 0)
    },

    // функция отработки события изменения подразделения на форме
    departmentChange(val) {
      // очищаем массивы договоров и поставщиков для выбора пользователем, т.к. они будут изменены выбранным поставщиком
      this.contracts = []
      this.suppliers = []

      delete (this.editedItem.ispId)
      delete (this.editedItem.viddocId)
      delete (this.editedItem.contractId)
      delete (this.editedItem.supplierId)
      delete (this.editedItem.consumerId)

      this.findDocumentType(val)
      this.findExecutors(val)
    },

    // функция отработки события изменения дат на форме
    dataOplatChange(val) {
      if (!this.editedItem.dataDoc) {
        this.showUserNotification('warning', 'Сначало укажите дату документа!', 3000)
        this.editedItem.dataOplat = null
        return
      }
      if (val < this.editedItem.dataDoc) {
        this.showUserNotification('warning', 'Дата оплаты не может быть меньше даты документа!', 3000)
        this.editedItem.dataOplat = null
      }
    },

    // функция сохранения документам
    async save() {
      if (!this.checkParamsOfEditedItem()) {
        return
      }

      let errorMessage = null
      this.editedItem.dataOplat = new Date(this.editedItem.dataOplat).toLocaleDateString()
      this.editedItem.dataDoc = new Date(this.editedItem.dataDoc).toLocaleDateString()
      await this.$axios
        .$post(
          '/meridian/oper/spDocopl/save',
          this.editedItem,
          this.axiosConfig
        )
        .catch((error) => {
          errorMessage = error
          alert(errorMessage)
        })
      if (errorMessage == null) {
        this.dialog = false
      }
      this.$emit('save')
    },

    // функция проверки заполнения обязательных полей
    checkParamsOfEditedItem() {
      let verificationPassed = true
      if (!this.editedItem.dataOplat || !this.editedItem.dataDoc) {
        this.showUserNotification('error', 'Укажите дату документа и дату оплаты документа!', 3000)
        verificationPassed = false
      } else if (!this.editedItem.nameDoc) {
        this.showUserNotification('error', 'Укажите номер документа!', 3000)
        verificationPassed = false
      } else if (!this.editedItem.departmentId) {
        this.showUserNotification('error', 'Укажите подразделение!', 3000)
        verificationPassed = false
      } else if (!this.editedItem.viddocId) {
        this.showUserNotification('error', 'Укажите тип документа!', 3000)
        verificationPassed = false
      } else if (!this.editedItem.ispId) {
        this.showUserNotification('error', 'Укажите поставщика!', 3000)
        verificationPassed = false
      } else if (!this.editedItem.sumDoc) {
        this.showUserNotification('error', 'Укажите сумму по договору!', 3000)
        verificationPassed = false
      } else if (!this.editedItem.contractId) {
        this.showUserNotification('error', 'Укажите договор плательщика!', 3000)
        verificationPassed = false
      } else if (!this.editedItem.supplierId) {
        this.showUserNotification('error', 'Укажите поставщика плательщика!', 3000)
        verificationPassed = false
      } else if (!this.editedItem.myorgId) {
        this.showUserNotification('error', 'Укажите плательщика!', 3000)
        verificationPassed = false
      } else if (!this.editedItem.consumerId) {
        this.showUserNotification('error', 'Укажите клиента!', 3000)
        verificationPassed = false
      } else if (!this.editedItem.documentKindId) {
        this.showUserNotification('error', 'Укажите вид документа!', 3000)
        verificationPassed = false
      } else if (!this.editedItem.paymentStatus) {
        this.showUserNotification('error', 'Укажите статус платежа!', 3000)
        verificationPassed = false
      }
      return verificationPassed
    },

    // функция отработки события нажития на кнопку "отмена"
    cancel() {
      console.log('cancel')
      this.reset()
      this.dialog = false
      this.$emit('cancel')
    },

    // функция обнуления всех переменных формы
    reset() {
      this.loadingType = {}
      this.editedItem = {}
      this.documentTypes = []
      this.contracts = []
      this.executors = []
      this.suppliers = []
      this.id = null
    },

    // функция открытия формы для создания нового документа
    newDocument() {
      this.reset()
      this.dialog = true
    },

    // функция открытия формы для редактирования документа
    editDocument(id) {
      this.reset()
      this.id = id
      this.dialog = true
      this.findEditedItem()
    },

    // функция открытия формы для создания нового документа на основе уже имеющегося документа
    copyDocument(id) {
      this.reset()
      this.id = id
      this.dialog = true
      this.findEditedItem(true)
    },

    // функция заполнения дат документа, если форме был передан уже созданный документ
    fillDatesEditedItem() {
      if (!this.editedItem) {
        return
      }
      this.editedItem.dataDoc = new Date(this.parseDate(this.editedItem.dataDoc)).toISOString().substr(0, 10)
      this.editedItem.dataOplat = new Date(this.parseDate(this.editedItem.dataOplat)).toISOString().substr(0, 10)
    },

    // функция парсинга дат для сохранения
    parseDate(date) {
      if (!date) { return '' }
      const [day, month, year] = date.split('.')
      return `${year}-${month}-${day}`
    },

    // Отображение информационного сообщения пользователю
    showUserNotification(color, text, timeout) {
      if (!color ||
      !text ||
      !timeout) {
        return
      }
      this.snackbarUserNotification = true
      this.snackbarUserNotificationColor = color
      this.snackbarUserNotificationTimeout = timeout
      this.snackbarUserNotificationText = text
    }
  }
}

</script>

<style lang="scss">
  .container-data {
    margin-left: 0px;
    max-width: none;
  }
  .modal-card {
    max-width: 1200px;
  }
  .border-bottom {
    position: relative;
    flex-wrap: nowrap;
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
  .v-card-text{
    padding: 0px;
  }
  .col{
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 0px;
  }
</style>
