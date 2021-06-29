<template>
  <v-dialog
    v-model="dialog"
    :value="show"
    max-width="1000px"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="10">
            <span class="headline">Оплата по кассе</span>
          </v-col>
          <v-col cols="2">
            <div
              align="center"
            >
              {{ date }}
            </div>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="payerId"
                label="Плательщик"
                :loading="loadingType.payers"
                :items="payers"
                item-value="id"
                item-text="clName"
                outlined
                hide-details="auto"
                @change="organizationChange"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="accId"
                label="Расчетный счет"
                :loading="loadingType.paymentAccounts"
                :items="accs"
                item-value="id"
                item-text="shortName"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model.number="editedItem.sumDoc"
                type="number"
                label="Сумма"
              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="editedItem.typeOfPaymentTransactionId"
                label="Группа"
                :loading="loadingType.groups"
                :items="groups"
                item-value="id"
                item-text="name"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.prim"
                label="Примечание"
              />
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
  name: 'PaymentByCashbox',

  components: {
    UserNotification
  },

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // текущая дата
      date: new Date().toLocaleDateString(),

      // признак видимости диалогового окна
      dialog: false,

      // объект для отображения загрузки данных для полей
      loadingType: {},

      // id документа на оплату
      id: null,

      // документ на оплату
      editedItem: {},

      // id выбранной организации
      payerId: null,

      // id выбранного расчетного счета
      accId: null,

      // массив организаций для выбора пользователем
      payers: [],

      // массив расчетных счетов для выбора пользователем
      accs: [],

      // список групп
      groups: [],

      // переменная, которая означает что документ открыт для редактирования
      editedDocument: false,

      sumDocOfEditedItem: 0,
      payerIdOfEditedItem: null,
      accIdOfEditedItem: null
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
      // this.findPayers()
      this.findGroups()
    },

    // поиск плательщиков
    async findPayers() {
      this.loadingType.organizations = true
      this.payers = await this.getBudgetOrganizations()
      this.loadingType.organizations = null

      if (this.payerId) {
        await this.findAccsOfChousenOrg()
      }
    },

    // Функция обработки выбора организации
    async organizationChange() {
      await this.findAccsOfChousenOrg()
      this.selectCashPaymentAccount()
    },

    // выбор первого расчетного счета из массива расчетных счетов
    selectCashPaymentAccount() {
      if (!this.accs) {
        return
      }

      const cashAcc = this.accs.find(item => item.accType === 'CASH')

      if (cashAcc) {
        this.accId = cashAcc.id
      }
    },

    // поиск расчетных счетов выбранной организации
    async findAccsOfChousenOrg() {
      this.loadingType.paymentAccounts = true

      const data = {
        orgId: this.payerId
      }
      let paymentAccounts = await this.$api.paymentAccounts.findAccByOrgId(data)
      paymentAccounts = paymentAccounts.sort(this.customCompare('shortName'))
      paymentAccounts.forEach((account) => {
        account.shortName = account.shortName + ' - ' + account.numAcc.slice(account.numAcc.length - 4)
      })

      this.accs = paymentAccounts

      this.loadingType.paymentAccounts = null
    },

    // поиск групп для выбора пользователем на форме
    async findGroups() {
      if (!this.groups.length) {
        this.loadingType.groups = true
        this.groups = await this.$api.payment.typesOfPaymentTransactions.findAll()
        this.loadingType.groups = null
      }
    },

    // Открытие формы для создания нового документа "Оплата по кассе"
    async newDocument(selOrgId, selAccId) {
      this.reset()
      this.editedDocument = false
      this.payerId = selOrgId
      await this.findPayers()
      this.selectCashPaymentAccount()
      this.dialog = true
    },

    async editDocument(id) {
      this.reset()
      this.editedDocument = true
      await this.findEditedItem(id)
      await this.findPayers()
      await this.findAccsOfChousenOrg()
      this.dialog = true
    },

    // поиск документа на оплату по id
    async findEditedItem(id) {
      this.editedItem = await this.$api.payment.findPaymentByCashboxById(id)
      this.payerId = this.editedItem.payer.id
      this.accId = this.editedItem.acc.id
      this.payerIdOfEditedItem = this.payerId
      this.accIdOfEditedItem = this.accId
      this.editedItem.sumDoc = this.editedItem.paymentOperationSums[0].paymentSum
      this.editedItem.sumDocOfEditedItem = this.editedItem.sumDoc
      this.editedItem.typeOfPaymentTransactionId = this.editedItem.paymentOperationSums[0].paymentOperationTypeId
      this.editedItem.prim = this.editedItem.comment
    },

    // функция сохранения оплаты по кассе
    async save() {
      if (!this.checkParamsOfEditedItem()) {
        return
      }

      if (this.editedDocument) {
        await this.saveEditedPaymentByCashbox()
      } else {
        await this.saveNewPaymentByCashbox()
      }
    },

    async saveEditedPaymentByCashbox() {
      let errorMessage = null
      this.editPaymentByCashbox()

      await this.$api.payment.savePaymentByCashbox(this.editedItem).catch((error) => {
        errorMessage = error
        alert(errorMessage)
      })

      if (errorMessage == null) {
        await this.changeSumToPayOfPaymentAccount(this.accIdOfEditedItem, this.editedItem.sumDocOfEditedItem, 'DEDUCT')
        await this.changeSumToPayOfPaymentAccount(this.accId, this.editedItem.sumDoc, 'SUM')
        this.dialog = false
      }
      this.$emit('save')
    },

    editPaymentByCashbox() {
      this.editedItem.acc = {
        id: this.accId
      }

      this.editedItem.payer = {
        id: this.payerId
      }

      this.editedItem.paymentOperationSums[0].paymentOperationTypeId = this.editedItem.typeOfPaymentTransactionId
      this.editedItem.paymentOperationSums[0].paymentSum = this.editedItem.sumDoc
      this.editedItem.comment = this.editedItem.prim
    },

    async saveNewPaymentByCashbox() {
      const paymentByCashbox = this.createPaymentByCashbox()
      let errorMessage = null
      this.editedItem.dataDoc = this.date

      await this.$api.payment.savePaymentByCashbox(paymentByCashbox).catch((error) => {
        errorMessage = error
        alert(errorMessage)
      })

      if (errorMessage == null) {
        await this.changeSumToPayOfPaymentAccount(this.accId, this.editedItem.sumDoc, 'SUM')
        this.dialog = false
      }
      this.$emit('save')
    },

    // Создает документ "Оплата по кассе" для запроса на основе данных, введенных пользователем на форме
    createPaymentByCashbox() {
      const paymentByCashbox = {
        comment: this.editedItem.prim,
        payer: {
          id: this.payerId
        },
        paymentDate: this.date,
        paymentOperationSums: [
          {
            paymentOperationTypeId: this.editedItem.typeOfPaymentTransactionId,
            paymentSum: this.editedItem.sumDoc
          }
        ],
        paymentType: {
          id: 1
        },
        acc: {
          id: this.accId
        }
      }
      return paymentByCashbox
    },

    // функция проверки заполнения обязательных полей
    checkParamsOfEditedItem() {
      let verificationPassed = true
      if (!this.editedItem.typeOfPaymentTransactionId) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите группу!')
        verificationPassed = false
      } else if (!this.editedItem.sumDoc) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите сумму оплаты по кассе!')
        verificationPassed = false
      } else if (!this.payerId) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите плательщика!')
        verificationPassed = false
      } else if (!this.accId) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите расчетный счет!')
        verificationPassed = false
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
      this.payers = []
      this.accs = []
      this.loadingType = {}
      this.editedItem = {}
      this.spDocch = {}
      this.id = null
      this.sumDocOfEditedItem = 0
      this.payerId = null
      this.accId = null
      this.payerIdOfEditedItem = null
      this.accIdOfEditedItem = null
    }

  }
}
</script>
