<template>
  <div
    name="journal-of-payment-documents-documents-tables"
    class="journal-of-payment-documents-documents-tables"
  >
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
      <v-col cols="7">
        <div>
          <span class="headline">{{ restPaymentAccountInfo }}</span>
        </div>
      </v-col>
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
        <div>
          <span
            class="headline"
            :class="{'text-danger': currentPaymentAccountBalanceLessThenZero}"
          >{{ paymentAccountInfo }}</span>
        </div>
      </v-col>
    </v-row>

    <v-row class="journal-of-payment-docs-tables-row">
      <payment-by-cashbox
        ref="paymentByCashbox"
        @close="closePaymentByCashbox"
        @cancel="closePaymentByCashbox"
        @save="savePaymentByCashbox"
      />

      <internal-payment
        ref="internalPayment"
        @close="closeInternalPayment"
        @cancel="closeInternalPayment"
        @save="saveInternalPayment"
      />

      <v-col
        class="journal-of-payment-docs-docs-to-pay-col journal-of-payment-docs-to-pay-col-5"
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
              @save="saveSumOplat(props.item)"
              @cancel="cancelSumOplat"
            >
              <div>{{ props.item.sumOplat }}</div>
              <template #input>
                <div class="mt-4 title">
                  Сумма оплаты
                </div>
                <v-text-field
                  v-model="props.item.sumOplat"
                  label="Сумма"
                  single-line
                  counter
                  autofocus
                />
              </template>
            </v-edit-dialog>
          </template>
        </v-data-table>

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

        <v-menu
          v-model="payMenu"
          :position-x="x"
          :position-y="y"
          absolute
          offset-y
        >
          <v-list>
            <v-list-item @click="payedByCashboxForContextMenuOnly">
              <v-list-item-title>
                Оплата по кассе
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="internalMovementForContextMenuOnly">
              <v-list-item-title>
                Вн. перемещение
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="historyOfPaymentForContextMenuOnly">
              <v-list-item-title>
                История оплат
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="deleteFromToPayForContextMenuOnly">
              <v-list-item-title>
                Удалить из "к оплате"
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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

            @click="addPaymentDocument"
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

      <edit-payment-document
        ref="editPaymentDocument"
        @close="closePaymentDocument"
        @cancel="closePaymentDocument"
        @save="savePaymentDocument"
      />

      <v-col
        class="journal-of-payment-docs-docs-from-pay-col journal-of-payment-docs-for-pay-col-5"
      >
        <v-subheader class="font-weight-medium text-subtitle-1">
          <v-row>
            <div
              align="center"
              class="journal-of-documents-subheader-first"
            >
              Документы на оплату
            </div>
            <div>
              <v-text-field
                v-model="date"
                type="date"
                @input="updateDocoplForPay()"
              />
            </div>
          </v-row>
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
              <th>{{ totalSumOplach }}</th>
              <th>{{ totalSumOplat }}</th>
              <th />
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
      <v-col cols="5" />
      <v-col cols="1" />
      <v-col cols="6">
        <v-text-field
          label="Комментарий"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import EditPaymentDocument from '@/views/payment/PaymentDocument/Modals/EditPaymentDocument'
import PaymentByCashbox from '@/views/payment/PaymentDocument/Modals/PaymentByCashbox'
import InternalPayment from '@/views/payment/PaymentDocument/Modals/InternalPayment'

export default {
  name: 'JournalOfPaymentDocumentsDocumentsTables',
  components: {
    EditPaymentDocument,
    PaymentByCashbox,
    InternalPayment
  },
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),

      loadingType: {},

      // Список организаций для выбора пользователем
      organizations: [],

      // Список расчетных счетов выбранной организации для выбора
      paymentAccounts: [],

      // Выбранная организация
      selectedOrganization: null,

      // Выбранный расчетный счет
      accId: null,

      // Шапка таблицы "Документы к оплате"
      toPayHeaders: [
        {
          text: 'Подразделение',
          value: 'depName'
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

      // Список документов таблицы "Документы к оплате"
      toPayData: [],

      // Шапка таблицы "Документы на оплату"
      fromPayHeaders: [
        {
          text: 'Подразделение',
          value: 'depName'
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

      // Список документов таблицы "Документы на оплату"
      fromPayData: [],

      // Итоговая сумма по колонке "Сумма" документов на оплату
      totalSumDoc: 0,
      // Итоговая сумма по колонке "Оплачено" документов на оплату
      totalSumOplach: 0,
      // Итоговая сумма по колонке "К оплате" документов на оплату
      totalSumOplat: 0,

      // Итоговая сумма по колонке "Оплата" документов к оплате
      totalToSumOplat: 0,

      // Массив выбранных строк в таблице "Документы к оплате"
      toPaySelectedRows: [],

      // Массив выбранных строк в таблице "Документы на оплату"
      fromPaySelectedRows: [],

      // Контекстное меню
      payMenu: false,
      x: 0,
      y: 0,
      currentRowForContextMenu: null,

      // Информационное сообщение для пользователя
      snackbarUserNotification: false,
      snackbarUserNotificationTimeout: 3000,
      snackbarUserNotificationColor: '',
      snackbarUserNotificationText: '',

      // Отображение остатков ден. средств на выбранном расчетном счете
      paymentAccountInfo: 'Остаток на Р/С:',
      currentPaymentAccountBalance: 0,
      restPaymentAccountInfo: 'Остаток на Р/Счетах:',

      currentPaymentAccountBalanceLessThenZero: false
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
    },

    async selOplat() {
      await this.$axios.$post('/meridian/oper/spDocopl/selOplat', this.axiosConfig)
    },

    // Обновление таблиц "Документы к оплате" и "Документы на оплату"
    refreshTables() {
      this.findSpDocoplForPay()
      this.findToPay(this.accId)
      this.fromPaySelectedRows = []
      this.toPaySelectedRows = []
    },

    // Поиск организаций для выбора пользователем
    async findOrganizatios() {
      if (!this.organizations.length) {
        this.loadingType.organizations = true
        this.organizations = await this.$axios.$get('/meridian/oper/dict/spOrg/findInternalOrg')
        this.loadingType.organizations = null
      }
    },

    // Функция обработки выбора организации
    organizationChange(val) {
      this.selectedOrganization = val
      this.accId = null
      this.updatePaymentAccountInfo(this.accId)
      this.toPayData = []
      this.totalToSumOplat = 0
      this.findPaymentAccounts(val)
      this.findSpDocoplForPay()
      // this.updateResPaymentAccountInfo()
    },

    // Функция поиска расчетных счетов выбранной организации
    async findPaymentAccounts(val) {
      this.loadingType.paymentAccounts = true
      this.paymentAccounts = await this.$axios.$get('/meridian/oper/spAcc/findByOrgId?orgId=' + val)
      this.loadingType.paymentAccounts = null
      this.updateResPaymentAccountInfo()
    },

    // Функция поиска остатков ден. средств на выбранном расчетном счете
    async updatePaymentAccountInfo(accId) {
      if (!accId) {
        this.paymentAccountInfo = 'Остаток на Р/С: '
        this.currentPaymentAccountBalance = 0
        return
      }

      const data = {
        dateOplat: new Date().toLocaleDateString(),
        orgId: this.selectedOrganization
      }
      const response = await this.$axios.$get('/meridian/oper/spOplat/findByDataOplatAndMyOrgId', { params: data })
      const responseElement = response.find(el => el.acc.id === accId)
      const saldo = responseElement.saldo

      let additionalMessage = ''
      this.currentPaymentAccountBalanceLessThenZero = false
      this.currentPaymentAccountBalance = (saldo - this.totalToSumOplat)

      if (this.currentPaymentAccountBalance < 0) {
        additionalMessage = ' - сумма остатка на расчетном счете меньше нуля!'
        this.currentPaymentAccountBalanceLessThenZero = true
      }

      this.currentPaymentAccountBalance = this.currentPaymentAccountBalance.toFixed(2)
      this.paymentAccountInfo = 'Остаток на Р/С: ' + this.currentPaymentAccountBalance + additionalMessage
    },

    // Функции поиска остатков ден. средств выбранной организации на тек. дату с учетом документов к оплате по всем расчетным счетам организации
    async updateResPaymentAccountInfo() {
      const balanceOfSelectedOrganization = await this.getBalanceOfSelectedOrganization()
      const balanceOfOtherAccounts = await this.getBalanceOfOtherAccounts()

      this.restPaymentAccountInfo = 'Остаток на Р/Счетах: ' + ((balanceOfSelectedOrganization - balanceOfOtherAccounts).toFixed(2))
    },
    async getBalanceOfSelectedOrganization() {
      const data = {
        dateOplat: new Date().toLocaleDateString()
      }
      const response = await this.$axios.$get('/meridian/oper/spOplat/groupByOrg', { params: data })
      const responseElement = response.find(el => el.myOrg.id === this.selectedOrganization)
      return responseElement.saldo
    },
    async getBalanceOfOtherAccounts() {
      let totalToSumOplat = 0
      const arrayOfPromises = []
      this.paymentAccounts.forEach((account) => {
        const promise = this.getSumToPayDocsOfOrgByAccId(account.id)
        arrayOfPromises.push(promise)
      })
      await Promise.all(arrayOfPromises).then((results) => {
        results.forEach((result) => {
          console.log(result)
          totalToSumOplat += result
        })
      })
      return totalToSumOplat
    },
    async getSumToPayDocsOfOrgByAccId(accId) {
      const data = {
        dateDoc: new Date().toLocaleDateString(),
        accId,
        orgId: this.selectedOrganization
      }

      let totalToSumOplat = 0
      const response = await this.$axios.$get('/meridian/oper/spDocopl/findSpDocoplToPay', { params: data })
      response.forEach((value) => {
        totalToSumOplat += value.sumOplat
      })
      return totalToSumOplat
    },

    // Выбор расчетного счета
    paymentAccountChange(val) {
      this.findToPay(val)
    },

    // Поиск документов к оплате по выбранному расчетному счету организации
    async findToPay(val) {
      const data = {
        dateDoc: new Date().toLocaleDateString(),
        accId: val,
        orgId: this.selectedOrganization
      }
      this.toPayData = await this.$axios.$get('/meridian/oper/spDocopl/findSpDocoplToPay', { params: data })
      let totalToSumOplat = 0
      this.toPayData.forEach((value) => {
        totalToSumOplat += value.sumOplat
      })
      this.totalToSumOplat = totalToSumOplat
      this.updatePaymentAccountInfo(val)
    },

    // Вызов контекстного меню таблицы "Документы к оплате"
    showPayMenu(event, item) {
      event.preventDefault()
      this.payMenu = false
      this.currentRowForContextMenu = null
      this.x = event.clientX
      this.y = event.clientY
      this.$nextTick(() => {
        this.payMenu = true
        this.currentRowForContextMenu = item.item
      })
    },

    // Функции обработки изменения суммы оплаты документа к оплате
    // Сохранение измененной суммы оплаты документа
    async saveSumOplat(selectedDoc) {
      this.toPaySelectedRows = []
      this.toPaySelectedRows.push(selectedDoc)

      await this.$axios.$post('/meridian/oper/spDocopl/saveSpDocoplToPay', this.toPaySelectedRows)
      this.toPaySelectedRows = []
      this.refreshTables()
      this.showUserNotification('success', 'Сумма оплаты сохранена', 3000)
      this.updateResPaymentAccountInfo()
    },
    // Отмена внесения измененя в сумму оплаты документа
    cancelSumOplat() {
      this.showUserNotification('error', 'Сумма оплаты не была изменена', 3000)
    },

    // Функции контекстного меню
    // Вызов формы "Оплата по кассе"
    payedByCashboxForContextMenuOnly() {
      this.$refs.paymentByCashbox.newDocument()
      console.log('payed by cashbox')
    },

    // Вн. перемещение
    internalMovementForContextMenuOnly() {
      this.$refs.internalPayment.newDocument()
      console.log('internal movement')
    },

    // Вызов формы "История оплат"
    historyOfPaymentForContextMenuOnly() {
      console.log('hisoty of payment')
    },

    // Перемещение документа из таблицы "Документы к оплате" в таблицу "Документы на оплату"
    deleteFromToPayForContextMenuOnly() {
      this.toPaySelectedRows = []
      this.toPaySelectedRows.push(this.currentRowForContextMenu)
      this.deleteSelectedPayments()
      this.refreshTables()
      this.updateResPaymentAccountInfo()
    },

    // Перемещение документа из таблицы "Документы на оплату" в таблицу "Документы к оплате" по нажатию на стрелку
    addPaymentDocument() {
      if (!this.accId) {
        this.showUserNotification('error', 'Выберите расчётный счёт!', 3000)
        return
      }
      this.addPayments()
      this.updateResPaymentAccountInfo()
    },
    async addPayments() {
      if (this.fromPaySelectedRows && this.fromPaySelectedRows.length) {
        const sumDocs = this.countSumOfArrayElements(this.fromPaySelectedRows.map(value => value.sumDoc))

        if (sumDocs > this.currentPaymentAccountBalance) {
          this.showUserNotification('warning', 'Сумма выбранных документов на оплату превышает сумму остатка по выбранному р/с!', 4000)
        }

        const ids = this.fromPaySelectedRows.map(value => value.id)
        const data = { ids, accId: this.accId }
        await this.$axios.$post('/meridian/oper/spDocopl/payDocument', data)
        this.refreshTables()
      }
    },
    countSumOfArrayElements(array) {
      let sum = 0
      for (let i = 0; i < array.length; i++) {
        sum += array[i]
      }
      return sum
    },

    // Перемещение документа из таблицы "Документы к оплате" в таблицу "Документы на оплату" по нажатию на стрелку
    async deleteSelectedPayments() {
      if (this.toPaySelectedRows && this.toPaySelectedRows.length) {
        const ids = this.toPaySelectedRows.map(value => value.id)
        console.log(ids)
        await this.$axios.$post('/meridian/oper/spDocopl/deleteSelectedPayments', ids)
        this.refreshTables()
        this.updateResPaymentAccountInfo()
      }
    },

    // Поиск документов для таблицы "Документы на оплату" по выбранной организации
    async findSpDocoplForPay() {
      const data = {
        dateDoc: new Date(this.date).toLocaleDateString(),
        orgId: this.selectedOrganization
      }
      this.fromPayData = await this.$axios.$get('/meridian/oper/spDocopl/findSpDocoplForPay', { params: data })
      let totalSumDoc = 0
      let totalSumOplat = 0
      let totalSumOplach = 0
      this.fromPayData.forEach((value) => {
        totalSumDoc += value.sumDoc
        totalSumOplat += value.sumOplat
        totalSumOplach += value.sumOplach
      })
      this.totalSumDoc = totalSumDoc
      this.totalSumOplat = totalSumOplat
      this.totalSumOplach = totalSumOplach
    },

    // Обновление списка документов на оплату при изменении даты
    updateDocoplForPay() {
      if (this.selectedOrganization) {
        this.findSpDocoplForPay()
      }
      this.fromPaySelectedRows = []
      this.toPaySelectedRows = []
    },

    // Функционал кнопок таблицы "Документы на оплату"
    // Добавление нового документа в таблицу "Документы на оплату"
    newDocument() {
      this.$refs.editPaymentDocument.newDocument()
    },

    // Изменение выбранного документа на оплату
    editDocument() {
      if (this.fromPaySelectedRows && this.fromPaySelectedRows.length) {
        if (this.fromPaySelectedRows[0].sumOplach !== 0) {
          this.showUserNotification('error', 'Изменение документа, по которому уже есть оплата, невозможно!', 3000)
          return
        }
        this.$refs.editPaymentDocument.editDocument(this.fromPaySelectedRows[0].id)
      }
    },

    // Удаление выбранных документов на оплату
    async deleteDocument() {
      if (this.fromPaySelectedRows && this.fromPaySelectedRows.length) {
        const selectedRows = this.fromPaySelectedRows
        const isDeletionPossible = this.checkSelectedRowsBeforeDelete(selectedRows)

        if (isDeletionPossible === false) {
          this.showUserNotification('error', 'В выбранных на удаление документах на оплату есть документ, по которому есть оплата! Удаление невозможно!', 5000)
          return
        }

        const ids = this.fromPaySelectedRows.map(value => value.id)
        await this.$axios.$post('/meridian/oper/spDocopl/deletePayment', ids)
        this.findSpDocoplForPay()
      }
    },
    checkSelectedRowsBeforeDelete(selectedRows) {
      let isDeletionPossible = true
      selectedRows.forEach((row) => {
        if (row.sumOplach !== 0) {
          isDeletionPossible = false
        }
      })
      return isDeletionPossible
    },

    // Копирование выбранного документа на оплату
    copyDocument() {
      if (this.fromPaySelectedRows && this.fromPaySelectedRows.length) {
        this.$refs.editPaymentDocument.copyDocument(this.fromPaySelectedRows[0].id)
      }
    },

    // Обработка события "Закрытие формы "Документ на оплату" по нажатию кнопки "Отмена"""
    closePaymentDocument() {
      console.log('close')
      // this.findSpDocoplForPay()
    },

    // Обработка события "Сохранение нового документа на оплату и закрытие формы "Документ на оплату"""
    savePaymentDocument() {
      console.log('open')
      this.findSpDocoplForPay()
      this.fromPaySelectedRows = []
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
    },

    // Обработка события "Закрытие модальной формы оплаты по кассе"
    closePaymentByCashbox() {
      console.log('close payment by cashbox')
    },

    // Обработка события "Сохранение новой оплаты по кассе"
    savePaymentByCashbox() {
      console.log('save payment by cashbox')
    },

    // Обработка события "Закрытие модальной формы внутреннего платежа"
    closeInternalPayment() {
      console.log('close internal payment')
    },

    // Обработка события "Сохранение нового внутреннего платежа"
    saveInternalPayment() {
      console.log('save internal payment')
    }
  }
}
</script>

<style lang="scss">
.journal-of-payment-documents-documents-tables{
  margin-top: 20px;
}
.journal-of-payment-docs-tables-row{
  margin-top: 0px;
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
    flex: 0 0 3.5%;
    max-width: 3.5%;
}
.journal-of-payment-docs-to-pay-col-5 {
    flex: 0 0 40%;
    max-width: 40%;
}
.journal-of-payment-docs-for-pay-col-5 {
    flex: 0 0 53%;
    max-width: 53%;
}
.journal-of-payment-docs-row {
    display: flex;
    flex-wrap: wrap;
    flex: 1 1 auto;
    margin: -12px;
}
.context-menu {
    position: fixed;
    background: white;
    z-index: 999;
    outline: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    cursor: pointer;
}
.journal-of-documents-subheader-first {
  padding-top: 12px;
  margin-top: 9px;
  padding-right: 30px;
}
.text-danger {
  color: red;
}
</style>
