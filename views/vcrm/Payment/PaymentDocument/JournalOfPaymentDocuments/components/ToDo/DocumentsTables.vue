<template>
  <div
    name="journal-of-payment-docs-documents-tables"
  >
    <journal-of-payment-documents-header
      ref="journalOfPaymentDocumentsHeader"
    />

    <div class="journal-of-payment-docs-row">
      <div class="journal-of-payment-docs-left-col">
        <div class="journal-of-payment-docs-row">
          <div class="journal-of-payment-docs-list-of-orgs">
            <v-autocomplete
              v-model="selectedOrganization"
              label="Организация"
              :loading="loadingType.organizations"
              :items="organizations"
              item-value="id"
              item-text="clName"
              hide-details="auto"
              @change="organizationChange"
            />
          </div>
        </div>

        <div class="journal-of-payment-docs-row">
          <div class="journal-of-payment-docs-list-of-payment-accounts-of-org">
            <v-autocomplete
              v-model="accId"
              label="Расч. счёт"
              :loading="loadingType.paymentAccounts"
              :items="paymentAccounts"
              item-value="id"
              item-text="shortName"
              hide-details="auto"
              @change="paymentAccountChange"
            />
          </div>
        </div>

        <div class="journal-of-payment-docs-row">
          <div class="journal-of-payment-docs-chousen-payment-account-info">
            <div>
              <span
                class="journal-of-payment-docs-headline"
                :class="{'journal-of-payment-docs-text-danger': currentPaymentAccountBalanceLessThenZero}"
              >Остаток на Р/С:
                <vue-numeric
                  v-model.number="paymentAccountInfo"
                  class="journal-of-payment-docs-headline"
                  separator="space"
                  :precision="2"
                  decimal-separator="."
                  output-type="number"
                  :read-only="true"
                /> {{ additionalMessage }}
              </span>
            </div>
          </div>
        </div>

        <div class="journal-of-payment-docs-row">
          <div class="journal-of-payment-docs-div-v-data-table">
            <v-subheader class="font-weight-medium text-subtitle-1">
              <v-row>
                <div
                  align="center"
                  class="journal-of-payment-docs-subheader-first"
                >
                  Документы к оплате
                </div>
                <div>
                  <v-text-field
                    v-model="date"
                    type="date"
                    @input="updateInformationOnForm()"
                  />
                </div>
              </v-row>
            </v-subheader>

            <v-data-table
              id="journal-of-payment-docs-v-data-table-to-pay-docs"
              v-model="toPaySelectedRows"
              :headers="toPayHeaders"
              fixed-header
              :items="toPayData"
              item-key="keyId"
              :show-select="true"
              :single-select="false"
              disable-pagination
              hide-default-footer
              class="elevation-1"
              @contextmenu:row="showPayMenu"
            >
              <template #[`item.sumOplatMask`]="props">
                <v-edit-dialog
                  :return-value.sync="props.item.sumOplat"
                  large
                  cancel-text="Закрыть"
                  save-text="Сохранить"
                  @save="saveSumOplat(props.item)"
                  @cancel="cancelSumOplat(props.item)"
                >
                  <div>{{ props.item.sumOplatMask }}</div>
                  <template #input>
                    <div class="mt-4 title">
                      Сумма оплаты
                    </div>
                    <div class="journal-of-payment-docs-brise-input">
                      <vue-numeric
                        v-model="props.item.sumOplat"
                        separator="space"
                        :precision="2"
                        decimal-separator="."
                        output-type="number"
                      />
                      <span class="line" />
                    </div>
                  </template>
                </v-edit-dialog>
              </template>
            </v-data-table>

            <user-notification ref="userNotification" />

            <v-menu
              v-model="payMenu"
              :position-x="xToPayMenu"
              :position-y="yToPayMenu"
              absolute
              offset-y
            >
              <v-list>
                <v-list-item @click="deleteFromToPayForContextMenuOnly">
                  <v-list-item-title>
                    Удалить из "к оплате"
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <div
            class="journal-of-payment-docs-arrows"
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
          </div>
        </div>

        <div class="journal-of-payment-docs-row">
          <div>
            <th>Итого</th>
          </div>

          <div class="journal-of-payment-docs-bottom-spacer-for-toPay-results" />

          <div class="journal-of-payment-docs-result-text">
            <th>
              <vue-numeric
                v-model="totalToSumOplat"
                separator="space"
                :precision="2"
                decimal-separator="."
                output-type="number"
                :read-only="true"
              />
            </th>
          </div>
        </div>
      </div>

      <div class="journal-of-payment-docs-right-col">
        <from-pay-documents ref="fromPayDocuments" />
      </div>
    </div>
  </div>
</template>

<script>
import UserNotification from '@/components/information_window/UserNotification'
import FromPayDocuments from '@/views/vcrm/Payment/PaymentDocument/JournalOfPaymentDocuments/components/fromPayDocuments'
import JournalOfPaymentDocumentsHeader from '../Header'

export default {
  name: 'JournalOfPaymentDocumentsDocumentsTables',

  components: {
    UserNotification,
    JournalOfPaymentDocumentsHeader,
    FromPayDocuments
  },

  data() {
    return {
      editPaymentDocumentDialog: false,

      date: new Date().toISOString().substr(0, 10),

      // объект для отображения статусов процесса загрузки данных для полей
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
          text: 'Номер',
          value: 'nameDoc',
          width: '60px'
        },
        {
          text: 'Плательщик',
          value: 'namePlat',
          width: '70px'
        },
        {
          text: 'Исполнитель',
          value: 'executorName',
          width: '70px'
        },
        {
          text: 'Кредит',
          value: 'prCredit',
          width: '80px'
        },
        {
          text: 'Оплата',
          value: 'sumOplatMask',
          width: '60px'
        }
      ],

      // Список документов таблицы "Документы к оплате"
      toPayData: [],

      // Переменная для отображения информационного сообщения, что фильтры для таблицы "Документы на оплату" используются
      isFiltersForFromPayDocsUsing: false,

      // Итоговая сумма по колонке "Оплата" документов к оплате
      totalToSumOplat: 0,

      // Массив выбранных строк в таблице "Документы к оплате"
      toPaySelectedRows: [],

      // Контекстное меню документов к оплате
      payMenu: false,
      xToPayMenu: 0,
      yToPayMenu: 0,
      currentRowForContextMenu: null,

      // Контекстное меню документов на оплату
      fromPayMenu: false,
      xFromPayMenu: 0,
      yFromPayMenu: 0,
      currentRowForContextMenuOfFromPayDocument: null,

      // Отображение остатков ден. средств на выбранном расчетном счете
      paymentAccountInfo: 0,
      currentPaymentAccountBalance: 0,
      currentPaymentAccountBalanceLessThenZero: false,
      additionalMessage: ''
    }
  },

  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.selOplat()
      this.loadingType = {}
      this.fromPaySelectedRows = []
      this.toPaySelectedRows = []
      await this.findDefaultOrgAndAccIdForUserOnForm()
      await this.findOrganizations()
      if (this.selectedOrganization) {
        await this.findPaymentAccounts(this.selectedOrganization)
      }
      if (this.accId) {
        await this.findToPay(this.accId)
      }
    },

    // Секция обработки событий на форме

    // Функция обработки выбора организации
    async organizationChange(orgId) {
      this.accId = null
      await this.updatePaymentAccountInfo(this.accId)
      this.toPayData = []
      this.totalToSumOplat = 0
      await this.findPaymentAccounts(orgId)
      this.selectFirstPaymentAccount()
    },

    async findDefaultOrgAndAccIdForUserOnForm() {
      const filtersParams = await this.findDefaultOrgAndAccIdForUser()
      if (filtersParams) {
        this.selectedOrganization = filtersParams.orgId
        this.accId = filtersParams.accId
      }
    },

    // Выбор расчетного счета
    paymentAccountChange(accId) {
      this.findToPay(accId)
    },

    // Обновление списка документов к оплате, остатков на расчетных счетах выбранной организации и при изменении даты
    async updateInformationOnForm() {
      await this.$refs.journalOfPaymentDocumentsHeader.findOrgAccInfo(this.date)
      await this.findToPay(this.accId)
      this.fromPaySelectedRows = []
      this.toPaySelectedRows = []
    },

    // Вызов контекстного меню таблицы "Документы к оплате"
    showPayMenu(event, item) {
      event.preventDefault()
      // Закрываем контекстное меню таблицы "Документы на оплату", контекстное меню "Оплата по кассе",   если они открыты
      this.fromPayMenu = false
      this.currentRowForContextMenuOfFromPayDocument = null
      this.paymentByCashboxMenuOnly = false

      this.payMenu = false
      this.currentRowForContextMenu = null
      this.xToPayMenu = event.clientX
      this.yToPayMenu = event.clientY
      this.$nextTick(() => {
        this.payMenu = true
        this.currentRowForContextMenu = item.item
      })
    },

    // Функции обработки изменения суммы оплаты документа к оплате
    // Сохранение измененной суммы оплаты документа
    async saveSumOplat(selectedDoc) {
      if (!selectedDoc.isDoc) {
        this.$refs.userNotification.showUserNotification('warning', 'Изменение суммы оплаты по кассе невозможна!')
        return
      }

      this.toPaySelectedRows = []
      this.toPaySelectedRows.push(selectedDoc)

      await this.$api.payment.docOplToPay.saveSpDocoplToPay(this.toPaySelectedRows)
      // await this.$axios.$post('/oper/spDocopl/saveSpDocoplToPay', this.toPaySelectedRows)
      const responseSpOplatSave = await this.changeSumToPayOfPaymentAccountOnForm(selectedDoc)

      this.toPaySelectedRows = []
      await this.refreshTables()
      if (responseSpOplatSave) {
        await this.$refs.journalOfPaymentDocumentsHeader.findOrgAccInfo(this.date)
      }
    },
    changeSumToPayOfPaymentAccountOnForm(selectedDoc) {
      let sumDoc
      let typeOfOperation
      if (selectedDoc.sumOplat < selectedDoc.sumOplatFromRequest) {
        sumDoc = selectedDoc.sumOplatFromRequest - selectedDoc.sumOplat
        typeOfOperation = 'DEDUCT'
      } else {
        sumDoc = selectedDoc.sumOplat - selectedDoc.sumOplatFromRequest
        typeOfOperation = 'SUM'
      }
      return this.changeSumToPayOfPaymentAccount(this.accId, sumDoc, typeOfOperation)
    },

    // Отмена внесения измененя в сумму оплаты документа
    cancelSumOplat(selectedDoc) {
      if (!selectedDoc.isDoc) {
        return
      }

      this.$refs.userNotification.showUserNotification('error', 'Сумма оплаты не была изменена')
    },

    // Функции контекстного меню таблицы документов к оплате

    // Перемещение документа из таблицы "Документы на оплату" в таблицу "Документы к оплате" по нажатию на стрелку
    async addPaymentDocument() {
      if (!this.accId) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите расчётный счёт!')
        this.fromPaySelectedRows = []
        return
      }

      if (!this.fromPaySelectedRows || !this.fromPaySelectedRows.length) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите документы на оплату!')
        return
      }

      const sumDocs = this.countSumOfArrayElements(this.fromPaySelectedRows.map(value => value.sumOplatNumber))

      if (sumDocs > this.currentPaymentAccountBalance) {
        this.$refs.userNotification.showUserNotification('warning', 'Сумма выбранных документов на оплату превышает сумму остатка по выбранному р/с!', 4000)
      }

      await this.addPayments()
      const responseSpOplatSave = await this.changeSumToPayOfPaymentAccount(this.accId, sumDocs, 'SUM')
      await this.refreshTables()

      if (responseSpOplatSave) {
        await this.$refs.journalOfPaymentDocumentsHeader.findOrgAccInfo(this.date)
      }
    },
    async addPayments() {
      const ids = this.fromPaySelectedRows.map(value => value.id)
      const data = { ids, accId: this.accId }
      await this.$api.payment.payDocument(data)
      // await this.$axios.$post('/oper/spDocopl/payDocument', data)
    },
    countSumOfArrayElements(array) {
      let sum = 0
      for (let i = 0; i < array.length; i++) {
        sum += array[i]
      }
      return sum
    },

    // Удаление документов из таблицы "Документы к оплате"
    async deleteSelectedPayments() {
      if (!this.toPaySelectedRows || !this.toPaySelectedRows.length) {
        return
      }

      const sumDocs = this.countSumOfArrayElements(this.toPaySelectedRows.map(value => value.sumOplat))

      const ids = this.toPaySelectedRows.map(value => value.id)
      await this.$api.payment.docOplToPay.deleteSelectedPayments(ids)
      // await this.$axios.$post('/oper/spDocopl/deleteSelectedPayments', ids)
      const responseSpOplatSave = await this.changeSumToPayOfPaymentAccount(this.accId, sumDocs, 'DEDUCT')

      await this.refreshTables()
      if (responseSpOplatSave) {
        await this.$refs.journalOfPaymentDocumentsHeader.findOrgAccInfo(this.date)
      }
    },

    // Перемещение документа из таблицы "Документы к оплате" в таблицу "Документы на оплату"
    deleteFromToPayForContextMenuOnly() {
      if (!this.currentRowForContextMenu.isDoc) {
        this.$refs.userNotification.showUserNotification('warning', 'Удаление оплаты по кассе невозможно!')
        return
      }

      this.toPaySelectedRows = []
      this.toPaySelectedRows.push(this.currentRowForContextMenu)
      this.deleteSelectedPayments()
    },

    // Конец Секции обработки событий на форме

    // Инициализация журнала оплат
    async selOplat() {
      await this.$api.payment.selOplat()
    },

    // Обновление таблиц "Документы к оплате" и "Документы на оплату"
    async refreshTables() {
      // this.updateDocsForPay()
      await this.findToPay(this.accId)
    },

    // Поиск организаций для выбора пользователем
    async findOrganizations() {
      this.loadingType.organizations = true
      this.organizations = await this.getBudgetOrganizations()
      this.loadingType.organizations = null
    },

    // Функция поиска расчетных счетов выбранной организации
    async findPaymentAccounts(orgId) {
      this.loadingType.paymentAccounts = true

      const data = {
        orgId
      }
      let paymentAccounts = await this.$api.paymentAccounts.findAccByOrgId(data)
      paymentAccounts = paymentAccounts.sort(this.customCompare('shortName'))
      paymentAccounts.forEach((account) => {
        account.shortName = account.shortName + ' - ' + account.numAcc.slice(account.numAcc.length - 4)
      })

      this.paymentAccounts = paymentAccounts

      this.loadingType.paymentAccounts = null
    },

    selectFirstPaymentAccount() {
      if (!this.paymentAccounts) {
        return
      }

      this.accId = this.paymentAccounts[0].id
      this.paymentAccountChange(this.accId)
    },

    // Функция поиска остатков ден. средств на выбранном расчетном счете
    async updatePaymentAccountInfo(accId) {
      if (!accId) {
        this.currentPaymentAccountBalance = 0
        this.paymentAccountInfo = this.currentPaymentAccountBalance
        this.currentPaymentAccountBalanceLessThenZero = false
        this.additionalMessage = ''
        return
      }

      const data = this.createCriteriasToSearchBalanceOfPaymentAccount(this.date, this.selectedOrganization, accId)
      const response = await this.$api.paymentAccounts.findBySearchCriteriaList(data)

      if (!response.length) {
        this.currentPaymentAccountBalance = 0
        this.paymentAccountInfo = this.currentPaymentAccountBalance
        this.currentPaymentAccountBalanceLessThenZero = false
        this.additionalMessage = ''
        return
      }

      const responseElement = response[0]
      const saldo = responseElement.saldo
      const nalich = responseElement.nalich
      const vnpl = responseElement.vnpl
      const sumToPay = responseElement.sumToPay

      this.additionalMessage = ''
      this.currentPaymentAccountBalanceLessThenZero = false
      this.currentPaymentAccountBalance = (saldo + nalich + vnpl - sumToPay)

      if (this.currentPaymentAccountBalance < 0) {
        this.additionalMessage = ' - сумма остатка на расчетном счете меньше нуля!'
        this.currentPaymentAccountBalanceLessThenZero = true
      }

      this.currentPaymentAccountBalance = this.currentPaymentAccountBalance.toFixed(2)
      this.paymentAccountInfo = this.currentPaymentAccountBalance
    },

    // Поиск документов к оплате по выбранному расчетному счету организации
    // Данная функция производит поиск документов к оплате и документов оплат по кассе на текущую дату
    // И добавляет их в таблицу "Документы к оплате"
    async findToPay(accId) {
      this.toPaySelectedRows = []
      this.toPayData = []

      const dataToPay = this.createCriteriasForRequestToSearchDocsToPay(
        accId, this.selectedOrganization, this.date)
      const toPayDataResponse = await this.$api.payment.docOplToPay.findDocumentsByCriterias(dataToPay)

      const dataPaymentByCashbox = this.createCriteriasForRequestToSearchPaymentsByCashbox(
        accId, this.selectedOrganization, this.date)
      const paymentByCashboxResponse = await this.$api.payment.findPaymentsByCashboxByCriterias(dataPaymentByCashbox)

      const objFromFunc = this.convertResponsesToDataForToPayTable(paymentByCashboxResponse, toPayDataResponse)

      this.toPayData = objFromFunc.arrayOfData
      this.totalToSumOplat = objFromFunc.totalPaymentSum

      await this.updatePaymentAccountInfo(accId)
    }
  }
}
</script>

<style lang="scss">
#journal-of-payment-docs-v-data-table-from-pay-docs   {
  border-collapse: collapse;
  width: 100%;
  height: 580px;
}

#journal-of-payment-docs-v-data-table-from-pay-docs   table{
  width: 100%;
}
#journal-of-payment-docs-v-data-table-from-pay-docs   td, #journal-of-payment-docs-v-data-table-from-pay-docs   th {
  border: 1px solid #ddd;
  word-break:break-all !important;
  padding: 0 0 !important;
  height: 0 !important;
}

#journal-of-payment-docs-v-data-table-from-pay-docs   tr:nth-child(even){background-color: #f2f2f2;}

#journal-of-payment-docs-v-data-table-from-pay-docs   tr:hover {background-color: #ddd;}

#journal-of-payment-docs-v-data-table-from-pay-docs   th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

#journal-of-payment-docs-v-data-table-to-pay-docs  {
  border-collapse: collapse;
  width: 100%;
  height: 452px;
}

#journal-of-payment-docs-v-data-table-to-pay-docs  table{
  width: 100%;
}
#journal-of-payment-docs-v-data-table-to-pay-docs  td, #journal-of-payment-docs-v-data-table-to-pay-docs  th {
  border: 1px solid #ddd;
  word-break:break-all !important;
  padding: 0 0 !important;
  height: 0 !important;
}

#journal-of-payment-docs-v-data-table-to-pay-docs  tr:nth-child(even){background-color: #f2f2f2;}

#journal-of-payment-docs-v-data-table-to-pay-docs  tr:hover {background-color: #ddd;}

#journal-of-payment-docs-v-data-table-to-pay-docs  th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

.journal-of-payment-docs-to-pay-col-5 {
  flex: 0 0 30%;
  max-width: 30%;
}

.journal-of-payment-docs-arrows {
  padding-left: 5px;
  padding-right: 5px;
  flex: 0 0 10%;
  max-width: 10%;
}

.journal-of-payment-docs-for-pay-col {
  flex: 0 0 96%;
  max-width: 96%;
}

.journal-of-payment-docs-buttons-of-table-docs-for-pay {
  padding-left: 5px;
  flex: 0 0 4%;
  max-width: 4%;
}

.journal-of-payment-docs-list-of-orgs{
  flex: 0 0 40%;
  max-width: 40%;
}

.journal-of-payment-docs-org-payment-accounts-info{
  flex: 0 0 60%;
  max-width: 60%;
}

.journal-of-payment-docs-list-of-payment-accounts-of-org{
  flex: 0 0 40%;
  max-width: 40%;
}

.journal-of-payment-docs-chousen-payment-account-info{
  flex: 0 0 100%;
  max-width: 100%;
}

.journal-of-payment-docs-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
  min-width: 100%;
}

.journal-of-payment-docs-context-menu {
  position: fixed;
  background: white;
  z-index: 999;
  outline: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  cursor: pointer;
}

.journal-of-payment-docs-subheader-first {
  padding-top: 12px;
  margin-top: 9px;
  padding-right: 30px;
}

.journal-of-payment-docs-from-pay-subheader-first {
  padding-right: 30px;
}

.journal-of-payment-docs-headline {
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
}

.journal-of-payment-docs-bottom-spacer{
  flex: 0 0 35%;
  max-width: 35%;
}

.journal-of-payment-docs-bottom-spacer-for-toPay-results{
  flex: 0 0 70%;
  max-width: 70%;
}

.journal-of-payment-docs-bottom-toPay-results{
  flex: 0 0 35%;
  max-width: 35%;
}

.journal-of-payment-docs-bottom-spacer-btw-results{
  flex: 0 0 3%;
  max-width: 3%;
}

.journal-of-payment-docs-bottom-fromPay-results{
  flex: 0 0 65%;
  max-width: 65%;
}

.journal-of-payment-docs-bottom-spacer-for-fromPay-results{
  flex: 0 0 55%;
  max-width: 55%;
}

.journal-of-payment-docs-result-text{
  font-size: 0.75rem;
  padding-right: 15px;
}

.journal-of-payment-docs-bottom-comment{
  flex: 0 0 65%;
  max-width: 65%;
}

.journal-of-payment-docs-text-danger {
  color: red;
}

.journal-of-payment-docs-is-filters-using {
  margin-left: 10px;
  color: green;
}

.journal-of-payment-docs-brise-input {
  position: relative;
  margin: 5px;
  overflow: hidden;
}

.journal-of-payment-docs-brise-input input {
  width: 100%;
  padding: 10px;
  border: none;
  outline: none;
  border-bottom: 1px solid #999;
  box-sizing: border-box;
  font-size: 16px;
  position: relative;
  z-index: 5;
  background: none;
}

.journal-of-payment-docs-brise-input label {
  position: absolute;
  left: 10px;
  top: 45%;
  transition: ease-out .15s;
  color: #999;
}

.journal-of-payment-docs-brise-input input:focus ~ .line {
  left: 0;
  opacity: 1;
}

.journal-of-payment-docs-brise-input input:valid ~ label, input:focus ~ label   {
  top: 0;
  transform: scale(0.94) translateX(-2px);
  color: #639db1;
}

.journal-of-payment-docs-brise-input .line {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  background: #639db1;
  transition: .25s;
  opacity: 0;
  z-index: 6;
}

.journal-of-payment-docs-filter-button{
  background: #639db1;
}

.journal-of-payment-docs-from-pay-docs-checkbox {
  margin:0;
  padding:0;
  color:#999 !important
}

.journal-of-payment-docs-from-pay-docs-dataDoc {
  width: 90px !important
}

.journal-of-payment-docs-from-pay-docs-nameDoc {
  width: 170px !important
}

.journal-of-payment-docs-from-pay-docs-payerName {
  width: 100px !important
}

.journal-of-payment-docs-from-pay-docs-executorName {
  width: 110px !important
}

.journal-of-payment-docs-from-pay-docs-dataOplat {
  width: 110px !important
}

.journal-of-payment-docs-from-pay-docs-sumDoc {
  width: 84px !important
}

.journal-of-payment-docs-from-pay-docs-sumPaid {
  width: 84px !important
}

.journal-of-payment-docs-from-pay-docs-sumOplat {
  width: 81px !important
}

.journal-of-payment-docs-from-pay-docs-depName {
  width: 123px !important
}

.journal-of-payment-docs-left-col {
  flex: 0 0 35%;
  max-width: 35%;
}

.journal-of-payment-docs-right-col {
  flex: 0 0 65%;
  max-width: 65%;
}

.journal-of-payment-docs-div-v-data-table{
  flex: 0 0 90%;
  max-width: 90%;
}

.add-group{
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-group__input {
  display: none;
}

.add-group__btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #639db1;
  color: #fff;
  font-size:26px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.6);
  z-index:2;
}

.add-group__btn:active {
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 1);
}

.add-group__link {
 width: 40px;
  height: 40px;
  background: #639db1;
  border-radius: 50%;
  color:#fff;
  font-size: 15px;
  transition: 0.3s;
  display:flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  position: absolute;
}

.add-group input:checked ~ .doc_for_pay {
  transform: translate(-60px, -30px);
}

.add-group input:checked ~ .pay_by_cashbox {
  transform: translate(-60px, 30px);
  transition-delay: 0.1s;
}

.add-group input:checked ~ .internal_payment {
  transform: translate(0, 65px);
  transition-delay: 0.2s;
}
</style>
