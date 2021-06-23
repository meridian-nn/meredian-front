<template>
  <v-dialog
    v-model="dialog"
    :value="show"
    max-width="1200px"
    padding="0px"
    persistent
    class="edit-payment-document-modal"
    @input="$emit('close')"
  >
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

            <v-col cols="2">
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

            <v-col cols="3">
              <v-autocomplete
                v-model="editedItem.executorId"
                label="Исполнитель"
                :loading="loadingType.executors"
                :items="executors"
                item-value="id"
                item-text="fullName"
                outlined
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
                v-model="editedItem.supplierId"
                label="Поставщик"
                :loading="loadingType.suppliers"
                :items="suppliers"
                item-value="id"
                item-text="clName"
                hide-details="auto"
                :auto-select-first="true"
                outlined
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
                <v-col cols="12">
                  <v-autocomplete
                    v-model="editedItem.myorgId"
                    style="margin-left: 16px"
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
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="editedItem.sumDoc"
                    type="number"
                    style="margin-left: 16px"
                    label="Сумма док-та"
                    outlined
                    hide-details="auto"
                    @input="calcSum"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="editedItem.sumPaid"
                    type="number"
                    label="Оплачено"
                    :readonly="true"
                    outlined
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="editedItem.sumToPay"
                    type="number"
                    style="margin-left: 16px"
                    label="К оплате"
                    :readonly="true"
                    outlined
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="6">
              <v-row>
                <v-col cols="6">
                  <v-autocomplete
                    v-model="editedItem.viddocId"
                    label="Вид документа"
                    :loading="loadingType.documentTypes"
                    :items="documentTypes"
                    item-value="id"
                    item-text="nameViddoc"
                    hide-details="auto"
                    outlined
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

              <v-row class="mb-2">
                <v-col cols="12">
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

          <v-row>
            <v-col col="12">
              <v-expansion-panels style="margin-left: 16px; width: 1116px">
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <span class="text-h6">Договор</span>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content>
                    <v-container>
                      <v-row>
                        <v-col cols="3">
                          <v-autocomplete
                            v-model="editedItem.contractId"
                            label="Договор"
                            :loading="loadingType.contracts"
                            :items="contracts"
                            item-value="id"
                            item-text="numDogInt"
                            outlined
                            hide-details="auto"
                            @change="findClients"
                          />
                        </v-col>

                        <v-col cols="6">
                          <v-autocomplete
                            v-model="editedItem.consumerId"
                            label="Клиент, для кого поставка"
                            :loading="loadingType.clients"
                            :items="clients"
                            item-value="id"
                            item-text="clName"
                            hide-details="auto"
                            :auto-select-first="true"
                            outlined
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>

          <user-notification ref="userNotification" />
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
import UserNotification from '@/components/information_window/UserNotification'
export default {
  name: 'EditPaymentDocument',
  components: {
    UserNotification
  },
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
      // массив исполнителей документа
      executors: [],
      // массив договоров для выбора пользователем
      contracts: [],
      // массив плательщиков
      payers: [],
      // id плательщика документа на оплату
      myorgId: null,
      // массив поставщиков для выбора пользователем
      suppliers: [],
      // массив клиентов для выбора пользователем
      clients: [],

      search: null,
      select: null,
      // переменная, отвечающая за отображениие модального окна
      dialog: false,
      // объект, в котором хранится редактируемый документ
      editedItem: {},
      // id редактируемого документа
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
      this.findClients()
      this.findSuppliers()
      this.findPaymentStatuses()
      this.findContracts()
    },
    // Поиск документа на оплату для редатирования / создания на основе нового документа
    async findEditedItem(copyDoc = false) {
      if (!this.id) {
        return
      }
      const editedItem = await this.$api.payment.docOplForPay.findByIdRead(this.id)
      await this.findDocumentType(editedItem.departmentId)
      await this.findExecutors(editedItem.departmentId)
      // this.findSuppliers(editedItem.contractId)
      await this.findContracts()
      this.editedItem = editedItem
      if (this.editedItem.buyer) {
        this.editedItem.buyerId = this.editedItem.buyer.id
      }
      await this.findPayers()
      if (copyDoc) {
        this.id = null
        this.editedItem.id = null
        this.editedItem.creatorId = null
        this.editedItem.spDocches = []
        this.editedItem.spDocints = []
      }
      this.fillDatesEditedItem()
      this.calcSum(editedItem.sumDoc)
    },
    // поиск подразделений для выбора пользователем
    async findDepartments() {
      if (!this.departments.length) {
        this.loadingType.departments = true
        this.departments = await this.$api.budgetElements.findDepartments()
        this.loadingType.departments = null
      }
    },
    // поиск статусов оплаты документа для выбора пользователем
    async findPaymentStatuses() {
      if (this.paymentStatuses.length) {
        return
      }
      this.loadingType.paymentStatuses = true
      this.paymentStatuses = await this.$api.payment.findPaymentStatuses()
      this.loadingType.paymentStatuses = null
    },
    // поиск типов документов для выбора пользователем
    async findDocumentType(parentId) {
      /* if (!parentId) {
        this.documentTypes = []
        return
      } */
      this.loadingType.documentTypes = true
      this.documentTypes = await this.$api.budgetElements.findAllDocumentsTypes()
      this.loadingType.documentTypes = null
    },
    // обновление списка исполнителей для выбора пользователем после изменения подразделения на форме
    async findExecutors(departmentId) {
      if (!departmentId) {
        this.executors = []
        return
      }
      this.loadingType.executors = true
      const data = this.createCriteriasToSearchUsersByDepartmentId(departmentId)
      this.executors = await this.$api.auth.user.getUsersBySearchCriterias(data)
      this.loadingType.executors = null
    },
    // обновление списка клиентов для выбора пользователем
    async findClients() {
      this.loadingType.clients = true
      if (this.editedItem.contractId == null) {
        this.clients = await this.$api.organizations.findAll()
      } else {
        const data = {
          dogId: this.editedItem.contractId
        }
        this.clients = await this.$api.organizations.findByDogId(data)
        if (this.clients.length) {
          this.editedItem.consumerId = this.clients[this.clients.length - 1].id
        }
      }
      this.loadingType.clients = null
    },
    // обновление списка поставщиков для выбора пользователем
    async findSuppliers() {
      this.loadingType.suppliers = true
      this.suppliers = await this.$api.organizations.findAll()
      this.loadingType.suppliers = null
    },
    // поиск плательщиков для выбора пользователем
    async findPayers() {
      this.loadingType.payers = true
      this.payers = await this.$api.organizations.findInternalOrganizations()
      this.loadingType.payers = null
    },
    // обновление списка договоров для выбора пользователем после изменения поставщика на форме
    async findContracts() {
      this.loadingType.contracts = true
      const data = {
        myDescr: this.getCurrentUser().email
      }
      this.contracts = await this.$api.budgetElements.findContracts(data)
      this.loadingType.contracts = null
    },
    // расчет суммы к оплате документа
    calcSum(val) {
      this.editedItem.sumToPay = (val || 0) - (this.editedItem.sumPaid || 0)
    },
    // функция отработки события изменения подразделения на форме
    departmentChange(depId) {
      // очищаем массивы договоров и поставщиков для выбора пользователем, т.к. они будут изменены выбранным поставщиком
      // delete (this.editedItem.viddocId)
      // this.findDocumentType(depId)
      this.findExecutors(depId)
    },
    getCurrentUser() {
      return this.$store.state.profile.user
    },

    // функция отработки события изменения дат на форме
    dataOplatChange(val) {
      if (!this.editedItem.dataDoc) {
        this.$refs.userNotification.showUserNotification('warning', 'Сначало укажите дату документа!')
        this.editedItem.dataOplat = null
        return
      }
      if (val < this.editedItem.dataDoc) {
        this.$refs.userNotification.showUserNotification('warning', 'Дата оплаты не может быть меньше даты документа!')
        this.editedItem.dataOplat = null
      }
    },

    // функция сохранения документа
    async save() {
      if (!this.checkParamsOfEditedItemAlter()) {
        return
      }
      let errorMessage = null
      this.editedItem.creatorId = this.getCurrentUser().id
      this.editedItem.ispId = 0
      this.editedItem.dataOplat = new Date(this.editedItem.dataOplat).toLocaleDateString()
      this.editedItem.dataDoc = new Date(this.editedItem.dataDoc).toLocaleDateString()
      // this.editedItem.documentKindId = 100

      /* this.editedItem.buyer = {
        id: 123
      } */

      this.editedItem.myOrg = {
        id: this.editedItem.myorgId
      }

      await this.$api.payment.docOplForPay.save(this.editedItem)
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
        this.$refs.userNotification.showUserNotification('error', 'Укажите дату документа и дату оплаты документа!')
        verificationPassed = false
      } else if (!this.editedItem.nameDoc) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите номер документа!')
        verificationPassed = false
      } else if (!this.editedItem.departmentId) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите подразделение!')
        verificationPassed = false
      } else if (!this.editedItem.viddocId) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите тип документа!')
        verificationPassed = false
      } else if (!this.editedItem.sumDoc) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите сумму по договору!')
        verificationPassed = false
      } else if (!this.editedItem.myorgId) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите плательщика!')
        verificationPassed = false
      } else if (!this.editedItem.buyerId) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите покупателя!')
        verificationPassed = false
      } else if (!this.editedItem.executorId) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите исполнителя!')
        verificationPassed = false
      } else if (!this.editedItem.paymentStatus) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите статус платежа!')
        verificationPassed = false
      }
      return verificationPassed
    },

    checkParamsOfEditedItemAlter() {
      let verificationPassed = true
      if (!this.editedItem.dataOplat || !this.editedItem.dataDoc) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите дату документа и дату оплаты документа!')
        verificationPassed = false
        return verificationPassed
      }

      if (!this.editedItem.nameDoc) {
        this.editedItem.nameDoc = '-'
      }

      if (!this.editedItem.myorgId) {
        this.editedItem.myorgId = 159
      }

      if (!this.editedItem.buyerId) {
        this.editedItem.buyerId = 0
      }

      if (!this.editedItem.viddocId) {
        this.editedItem.viddocId = 26
      }

      if (!this.editedItem.sumDoc) {
        this.editedItem.sumDoc = 0
      }

      return verificationPassed
    },

    // функция отработки события нажития на кнопку "отмена"
    cancel() {
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
    newDocument(selOrg) {
      this.reset()
      this.editedItem.paymentStatus = 'BANK'
      if (selOrg) {
        this.editedItem.myorgId = selOrg
      }
      const date = new Date()
      this.editedItem.dataDoc = date.toISOString().substr(0, 10)
      date.setDate(date.getDate() + 3)
      this.editedItem.dataOplat = date.toISOString().substr(0, 10)
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
    }
  }
}
</script>

<style lang="scss">
.container-data {
  margin-left: 0;
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
  padding: 0;
}
.col{
  padding: 10px 10px 0;
}
</style>
