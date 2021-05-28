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
              <v-text-field
                v-model="payer.clName"
                readonly="true"
                label="Плательщик"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="acc.shortName"
                readonly="true"
                label="Расчетный счет"
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

      // выбранная организация
      payer: {},

      // выбранный расчетный счет
      acc: {},

      // список групп
      groups: []
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

    // поиск плательщика для демонстрации пользователю на форме
    async findPayer() {
      this.loadingType.payer = true
      this.payer = await this.$api.organizations.findById(this.payerId)
      this.loadingType.payer = null
    },

    // поиск расчетного счета плательщика для демонстрации на форме
    async findAcc() {
      this.loadingType.acc = true
      this.acc = await this.$api.paymentAccounts.findById(this.accId)
      this.loadingType.acc = null
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
    newDocument(selOrgId, selAccId) {
      this.reset()
      this.payerId = selOrgId
      this.accId = selAccId
      this.findPayer()
      this.findAcc()
      this.dialog = true
    },

    // функция сохранения оплаты по кассе
    async save() {
      if (!this.checkParamsOfEditedItem()) {
        return
      }

      const paymentByCashbox = this.createPaymentByCashbox()
      let errorMessage = null
      this.editedItem.dataDoc = this.date

      await this.$api.payment.savePaymentByCashbox(paymentByCashbox).catch((error) => {
        errorMessage = error
        alert(errorMessage)
      })

      if (errorMessage == null) {
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
      this.spDocch = {}
      this.id = null
    },

    // открытие формы для редактирования документа "Оплата по кассе"
    editDocument(id, accId) {
      this.reset()
      this.id = id
      this.dialog = true
      this.findEditedItem(accId)
    },

    // поиск документа на оплату по id
    async findEditedItem(accId) {
      if (this.id) {
        this.editedItem = await this.$api.payment.docOplForPay.findById(this.id)
        this.editedItem.accId = accId
      }
    }
  }
}
</script>
