<template>
  <div
    name="journal-of-payment-docs-documents-tables"
    class="journal-of-payment-docs-documents-tables"
  >
    <div class="journal-of-payment-docs-row">
      <div class="journal-of-payment-docs-list-of-orgs">
        <v-autocomplete
          label="Организация"
          :loading="loadingType.organizations"
          :items="organizations"
          item-value="id"
          item-text="clName"
          @change="organizationChange"
        />
      </div>

      <div class="journal-of-payment-docs-org-payment-accounts-info">
        <div>
          <span class="journal-of-payment-docs-headline">Остаток на Р/Счетах:
            <vue-numeric
              v-model="restPaymentAccountInfo"
              class="journal-of-payment-docs-headline"
              separator="space"
              :precision="2"
              decimal-separator="."
              :output-type="number"
              :read-only="true"
            /></span>
        </div>
        </v-col>
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
            @change="paymentAccountChange"
          />
        </div>

        <div class="journal-of-payment-docs-chousen-payment-account-info">
          <div>
            <span
              class="journal-of-payment-docs-headline"
              :class="{'journal-of-payment-docs-text-danger': currentPaymentAccountBalanceLessThenZero}"
            >Остаток на Р/С:
              <vue-numeric
                v-model="paymentAccountInfo"
                class="journal-of-payment-docs-headline"
                separator="space"
                :precision="2"
                decimal-separator="."
                :output-type="number"
                :read-only="true"
              /></span>
          </div>
        </div>
      </div>

      <div class="journal-of-payment-docs-row">
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

        <div
          class="journal-of-payment-docs-to-pay-col-5"
        >
          <v-subheader class="font-weight-medium text-subtitle-1">
            Документы к оплате
          </v-subheader>

          <v-data-table
            id="journal-of-payment-docs-v-data-table-to-pay-docs"
            v-model="toPaySelectedRows"
            :headers="toPayHeaders"
            :items="toPayData"
            :items-per-page="5"
            :show-select="true"
            :single-select="false"
            :footer-props="{ itemsPerPageText: 'Количество строк на странице:' }"
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
                <th>
                  <vue-numeric
                    v-model="totalToSumOplat"
                    separator="space"
                    :precision="2"
                    decimal-separator="."
                    :output-type="number"
                    :read-only="true"
                  />
                </th>
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

          <user-notification ref="userNotification" />

          <v-menu
            v-model="payMenu"
            :position-x="xToPayMenu"
            :position-y="yToPayMenu"
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

        <edit-payment-document
          ref="editPaymentDocument"
          @close="closePaymentDocument"
          @cancel="closePaymentDocument"
          @save="savePaymentDocument"
        />

        <payment-card-by-document
          ref="paymentCardByDocument"
          @close="closePaymentCardByDocument"
        />

        <div
          class="journal-of-payment-docs-for-pay-col-5"
        >
          <v-subheader class="font-weight-medium text-subtitle-1">
            <v-row>
              <div
                align="center"
                class="journal-of-payment-docs-subheader-first"
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
            id="journal-of-payment-docs-v-data-table-from-pay-docs"
            v-model="fromPaySelectedRows"
            :headers="fromPayHeaders"
            :items="fromPayData"
            :show-select="true"
            :single-select="false"
            :items-per-page="5"
            :footer-props="{ itemsPerPageText: 'Количество строк на странице:' }"
            class="elevation-1 journal-of-payment-docs-docs-from-pay-table"
            @contextmenu:row="showFromPayMenu"
          >
            <!--template #body="{ items }">
              <tbody>
                <tr
                  v-for="item in items"
                  :key="item.td"
                >
                  <td><v-checkbox /></td>
                  <td>{{ item.depName }}</td>
                  <td>{{ item.dataDoc }}</td>
                  <td>{{ item.nameDoc }}</td>
                </tr>
              </tbody>
            </template-->

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
                <th>
                  <vue-numeric
                    v-model="totalSumDoc"
                    separator="space"
                    :precision="2"
                    decimal-separator="."
                    :output-type="number"
                    :read-only="true"
                  />
                </th>
                <th>
                  <vue-numeric
                    v-model="totalSumPaid"
                    separator="space"
                    :precision="2"
                    decimal-separator="."
                    :output-type="number"
                    :read-only="true"
                  />
                </th>
                <th>
                  <vue-numeric
                    v-model="totalSumOplat"
                    separator="space"
                    :precision="2"
                    decimal-separator="."
                    :output-type="number"
                    :read-only="true"
                  />
                </th>
                <th />
              </tr>
            </template>
          </v-data-table>

          <v-menu
            v-model="fromPayMenu"
            :position-x="xFromPayMenu"
            :position-y="yFromPayMenu"
            absolute
            offset-y
          >
            <v-list>
              <v-list-item @click="payDocumentForContextMenuOnly">
                <v-list-item-title>
                  Оплатить
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="historyOfPaymentFromPaymentForContextMenuOnly">
                <v-list-item-title>
                  История оплат
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <div
          class="journal-of-payment-docs-buttons-of-table-docs-for-pay"
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
        </div>
      </div>

      <!--div class="journal-of-payment-docs-row">
        <div class="journal-of-payment-docs-bottom-spacer" />
        <div class="journal-of-payment-docs-bottom-comment">
          <v-text-field
            label="Комментарий"
          />
        </div>
      </div-->
    </div>
  </div>
</template>

<script>
import EditPaymentDocument from '@/views/payment/PaymentDocument/Modals/EditPaymentDocument'
import PaymentByCashbox from '@/views/payment/PaymentDocument/Modals/PaymentByCashbox'
import InternalPayment from '@/views/payment/PaymentDocument/Modals/InternalPayment'
import UserNotification from '@/views/special_components/information_window/UserNotification'
import PaymentCardByDocument from '@/views/payment/PaymentDocument/Modals/PaymentCardByDocument'

export default {
  name: 'JournalOfPaymentDocumentsDocumentsTables',
  components: {
    EditPaymentDocument,
    PaymentByCashbox,
    InternalPayment,
    UserNotification,
    PaymentCardByDocument
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
          value: 'dataOplat'
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
          value: 'myorgName'
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
          value: 'sumPaid'
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
      totalSumPaid: 0,
      // Итоговая сумма по колонке "К оплате" документов на оплату
      totalSumOplat: 0,

      // Итоговая сумма по колонке "Оплата" документов к оплате
      totalToSumOplat: 0,

      // Массив выбранных строк в таблице "Документы к оплате"
      toPaySelectedRows: [],

      // Массив выбранных строк в таблице "Документы на оплату"
      fromPaySelectedRows: [],

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
      restPaymentAccountInfo: 0,
      additionalMessage: ''
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
      this.findSpDocoplForPay()
    },

    // Инициализация журнала оплат
    async selOplat() {
      await this.$api.payment.selOplat()
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

        const data = {
          typeCode: 1
        }
        this.organizations = await this.$api.organizations.findByOrgTypeCode(data)

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
      // this.updateResPaymentAccountInfo()
    },

    // Функция поиска расчетных счетов выбранной организации
    async findPaymentAccounts(val) {
      this.loadingType.paymentAccounts = true

      const data = {
        orgId: val
      }
      let paymentAccounts = await this.$api.paymentAccounts.findAccByOrgId(data)
      paymentAccounts = paymentAccounts.sort(this.compare('shortName'))
      paymentAccounts.forEach((account) => {
        account.shortName = account.shortName + ' - ' + account.numAcc.slice(account.numAcc.length - 4)
      })

      this.paymentAccounts = paymentAccounts

      this.loadingType.paymentAccounts = null
      this.updateResPaymentAccountInfo()
    },

    // Функция поиска остатков ден. средств на выбранном расчетном счете
    async updatePaymentAccountInfo(accId) {
      if (!accId) {
        this.paymentAccountInfo = 'Остаток на Р/С: '
        this.currentPaymentAccountBalance = 0
        this.currentPaymentAccountBalanceLessThenZero = false
        return
      }

      const data = {
        dateOplat: new Date().toLocaleDateString(),
        orgId: this.selectedOrganization
      }
      const response = await this.$api.paymentAccounts.findByDataOplatAndMyOrgId(data)
      const responseElement = response.find(el => el.acc.id === accId)
      const saldo = responseElement.saldo

      this.additionalMessage = ''
      this.currentPaymentAccountBalanceLessThenZero = false
      this.currentPaymentAccountBalance = (saldo - this.totalToSumOplat)

      if (this.currentPaymentAccountBalance < 0) {
        this.additionalMessage = ' - сумма остатка на расчетном счете меньше нуля!'
        this.currentPaymentAccountBalanceLessThenZero = true
      }

      this.currentPaymentAccountBalance = this.currentPaymentAccountBalance.toFixed(2)
      this.paymentAccountInfo = this.currentPaymentAccountBalance
    },

    // Функции поиска остатков ден. средств выбранной организации на тек. дату с учетом документов к оплате по всем расчетным счетам организации
    async updateResPaymentAccountInfo() {
      const balanceOfSelectedOrganization = await this.getBalanceOfSelectedOrganization()
      const balanceOfOtherAccounts = await this.getBalanceOfOtherAccounts()

      console.log('balance of org' + balanceOfSelectedOrganization)
      console.log('balance of other accounts' + balanceOfOtherAccounts)
      this.restPaymentAccountInfo = balanceOfSelectedOrganization - balanceOfOtherAccounts
    },
    async getBalanceOfSelectedOrganization() {
      const data = {
        dateOplat: new Date().toLocaleDateString()
      }
      const response = await this.$api.paymentAccounts.groupByOrg(data)
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
          totalToSumOplat += result
        })
      })
      return totalToSumOplat
    },
    async getSumToPayDocsOfOrgByAccId(accId) {
      const data = this.createCriteriasForRequestToSearchDocsToPay(accId, this.selectedOrganization)
      let totalToSumOplat = 0
      const response = await this.$api.payment.docOplToPay.findDocumentsByCriterias(data)
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
      /* const data = {
        dateDoc: new Date().toLocaleDateString(),
        accId: val,
        orgId: this.selectedOrganization
      } */
      const data = this.createCriteriasForRequestToSearchDocsToPay(val, this.selectedOrganization)
      this.toPayData = await this.$api.payment.docOplToPay.findDocumentsByCriterias(data)
      let totalToSumOplat = 0
      this.toPayData.forEach((value) => {
        totalToSumOplat += value.sumOplat
      })
      this.totalToSumOplat = totalToSumOplat.toFixed(2)
      this.updatePaymentAccountInfo(val)
    },

    // Создает объект с критериями для отбора документов к оплате для запроса на бэк
    createCriteriasForRequestToSearchDocsToPay(accId, orgId) {
      const secDate = new Date()
      const curDateNum = secDate.getDate()
      secDate.setDate(curDateNum + 1)
      console.log(secDate)
      const data = [
        {
          'dataType': 'INTEGER',
          'key': 'accId',
          'operation': 'EQUALS',
          'type': 'AND',
          'values':
          [
            accId
          ]
        },
        {
          'dataType': 'INTEGER',
          'key': 'platId',
          'operation': 'EQUALS',
          'type': 'AND',
          'values':
          [
            orgId
          ]
        },
        {
          'dataType': 'DATE',
          'key': 'dataOplat',
          'operation': 'BETWEEN',
          'type': 'AND',
          'values': [
            new Date().toLocaleDateString(), secDate.toLocaleDateString()
          ]
        }
      ]
      return data
    },

    // Вызов контекстного меню таблицы "Документы к оплате"
    showPayMenu(event, item) {
      event.preventDefault()
      // Закрываем контекстное меню таблицы "Документы на оплату", если оно открыто
      this.fromPayMenu = false
      this.currentRowForContextMenuOfFromPayDocument = null

      this.payMenu = false
      this.currentRowForContextMenu = null
      this.xToPayMenu = event.clientX
      this.yToPayMenu = event.clientY
      this.$nextTick(() => {
        this.payMenu = true
        this.currentRowForContextMenu = item.item
      })
    },

    // Вызов контекстного меню таблицы "Документы на оплату"
    showFromPayMenu(event, item) {
      event.preventDefault()
      // Закрываем контекстное меню таблицы "Документы к оплате", если оно открыто
      this.payMenu = false
      this.currentRowForContextMenu = null

      this.fromPayMenu = false
      this.currentRowForContextMenuOfFromPayDocument = null
      this.xFromPayMenu = event.clientX
      this.yFromPayMenu = event.clientY
      this.$nextTick(() => {
        this.fromPayMenu = true
        this.currentRowForContextMenuOfFromPayDocument = item.item
      })
    },

    // Функции обработки изменения суммы оплаты документа к оплате
    // Сохранение измененной суммы оплаты документа
    async saveSumOplat(selectedDoc) {
      this.toPaySelectedRows = []
      this.toPaySelectedRows.push(selectedDoc)

      // await this.$api.payment.docOplToPay.saveSpDocoplToPay(this.toPaySelectedRows)
      await this.$axios.$post('/oper/spDocopl/saveSpDocoplToPay', this.toPaySelectedRows)

      this.toPaySelectedRows = []
      this.refreshTables()
      this.$refs.userNotification.showUserNotification('success', 'Сумма оплаты сохранена')
      this.updateResPaymentAccountInfo()
    },

    // Отмена внесения измененя в сумму оплаты документа
    cancelSumOplat() {
      this.$refs.userNotification.showUserNotification('error', 'Сумма оплаты не была изменена')
    },

    // Функции контекстного меню таблицы документов к оплате
    // Вызов формы "Оплата по кассе"
    payedByCashboxForContextMenuOnly() {
      this.$refs.paymentByCashbox.editDocument(this.currentRowForContextMenu.docoplId, this.accId)
      console.log('payed by cashbox')
    },

    // Вн. перемещение
    internalMovementForContextMenuOnly() {
      this.$refs.internalPayment.editDocument(this.currentRowForContextMenu.docoplId,
        this.selectedOrganization,
        this.accId)

      console.log('internal movement')
    },

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
    async deleteSelectedPayments() {
      if (this.toPaySelectedRows && this.toPaySelectedRows.length) {
        const ids = this.toPaySelectedRows.map(value => value.id)
        /* await this.$api.payment.docOplToPay.deleteSelectedPayments(ids).catch((error) => {
          const errorMessage = error
          alert(errorMessage)
        }) */
        await this.$axios.$post('/oper/spDocopl/deleteSelectedPayments', ids)

        this.refreshTables()
        this.updateResPaymentAccountInfo()
      }
    },

    // Функции контекстного меню таблицы документов на оплату
    // Вызов формы "История оплат"
    historyOfPaymentFromPaymentForContextMenuOnly() {
      this.$refs.paymentCardByDocument.openForm(this.currentRowForContextMenuOfFromPayDocument.id)
      console.log('hisoty of payment from payment')
    },

    // Оплата документа на оплату через контекстное меню
    payDocumentForContextMenuOnly() {
      this.fromPaySelectedRows = []
      console.log(this.currentRowForContextMenuOfFromPayDocument)
      this.fromPaySelectedRows.push(this.currentRowForContextMenuOfFromPayDocument)
      this.addPaymentDocument()
      this.fromPaySelectedRows = []
    },

    // Перемещение документа из таблицы "Документы на оплату" в таблицу "Документы к оплате" по нажатию на стрелку
    addPaymentDocument() {
      if (!this.accId) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите расчётный счёт!')
        return
      }
      this.addPayments()
      this.updateResPaymentAccountInfo()
    },
    async addPayments() {
      if (this.fromPaySelectedRows && this.fromPaySelectedRows.length) {
        const sumDocs = this.countSumOfArrayElements(this.fromPaySelectedRows.map(value => value.sumDoc))

        if (sumDocs > this.currentPaymentAccountBalance) {
          this.$refs.userNotification.showUserNotification('warning', 'Сумма выбранных документов на оплату превышает сумму остатка по выбранному р/с!', 4000)
        }

        const ids = this.fromPaySelectedRows.map(value => value.id)
        const data = { ids, accId: this.accId }
        /* await this.$api.payment.payDocument(data).catch((error) => {
          const errorMessage = error
          alert(errorMessage)
        }) */
        await this.$axios.$post('/oper/spDocopl/payDocument', data)

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

    // Поиск документов для таблицы "Документы на оплату" по выбранной организации
    async findSpDocoplForPay() {
      const data = this.createCriteriasForRequestToSearchDocsFromPay()

      this.fromPayData = await this.$api.payment.docOplForPay.findDocumentsByCriteriasForTableInDocumentsJournal(data)
      // $axios.$get('/meridian/oper/spDocopl/findSpDocoplForPay', { params: data })
      let totalSumDoc = 0
      let totalSumOplat = 0
      let totalSumPaid = 0
      this.fromPayData.forEach((value) => {
        totalSumDoc += value.sumDoc
        totalSumOplat += value.sumOplat
        totalSumPaid += value.sumPaid

        value.sumPaid = value.sumPaid == null ? 0 : value.sumPaid
        value.sumOplat = value.sumDoc - value.sumPaid
      })
      this.totalSumDoc = totalSumDoc.toFixed(2)
      this.totalSumOplat = totalSumOplat.toFixed(2)
      this.totalSumPaid = totalSumPaid.toFixed(2)
    },

    // Создает объект с критериями отбора документов на оплату для запроса на бэк
    createCriteriasForRequestToSearchDocsFromPay() {
      const chousenDate = new Date(this.date)
      const data = [
        {
          'dataType': 'DATE',
          'key': 'dataDoc',
          'operation': 'GREATER_THAN',
          'type': 'AND',
          'values': [
            chousenDate.toLocaleDateString()
          ]
        }

      ]
      return data
    },

    // Обновление списка документов на оплату при изменении даты
    updateDocoplForPay() {
      this.findSpDocoplForPay()
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
        if (this.fromPaySelectedRows[0].sumPaid !== 0) {
          this.$refs.userNotification.showUserNotification('error', 'Изменение документа, по которому уже есть оплата, невозможно!')
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
          this.$refs.userNotification.showUserNotification('error', 'В выбранных на удаление документах на оплату есть документ, по которому есть оплата! Удаление невозможно!', 5000)
          return
        }

        const ids = this.fromPaySelectedRows.map(value => value.id)
        // await this.$api.payment.DocOplForPay.deleteSelectedPayments(ids)
        await this.$axios.$post('/oper/spDocopl/deletePayment', ids)

        this.findSpDocoplForPay()
      }
    },
    checkSelectedRowsBeforeDelete(selectedRows) {
      let isDeletionPossible = true
      selectedRows.forEach((row) => {
        if (row.sumPaid !== 0) {
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

    // Обработка события "Закрытие модальной формы карточки оплат по документу"
    closePaymentCardByDocument() {
      console.log('close PaymentCardByDocument')
    },

    // Обработка события "Закрытие модальной формы оплаты по кассе"
    closePaymentByCashbox() {
      console.log('close payment by cashbox')
    },

    // Обработка события "Сохранение новой оплаты по кассе"
    savePaymentByCashbox() {
      this.refreshTables()
    },

    // Обработка события "Закрытие модальной формы внутреннего платежа"
    closeInternalPayment() {
      console.log('close internal payment')
    },

    // Обработка события "Сохранение нового внутреннего платежа"
    saveInternalPayment() {
      this.refreshTables()
      console.log('save internal payment')
    },

    // Функция для сортировки массивов по переданному полю
    /* Примеры использования
    arr.sort(compare()); - Обычная типобезопасная сортировка по возрастанию
    arr.sort(compare(-1)); - Обычная типобезопасная сортировка по убыванию
    arr.sort(compare('field')); - Сортировка по свойству field по возрастанию
    arr.sort(compare('field', -1)); - Сортировка по свойству field по убыванию

    Сортировка сначала по полю field1
    при совпадении по полю field2, а если и оно совпало, то по полю field3
    все по возрастанию
    arr.sort(compare('field1', 'field2', 'field3'));

    Сортировка сначала по полю field1 по возрастанию
    при совпадении по полю field2 по убыванию
    arr.sort(compare({
        field1 : 1,
        field2 : -1
    })); */
    compare(field, order) {
      let len = arguments.length
      if (len === 0) {
        return (a, b) => (a < b && -1) || (a > b && 1) || 0
      }
      if (len === 1) {
        switch (typeof field) {
          case 'number':
            return field < 0
              ? (a, b) => (a < b && 1) || (a > b && -1) || 0
              : (a, b) => (a < b && -1) || (a > b && 1) || 0
          case 'string':
            return (a, b) => (a[field] < b[field] && -1) || (a[field] > b[field] && 1) || 0
        }
      }
      if (len === 2 && typeof order === 'number') {
        return order < 0
          ? (a, b) => (a[field] < b[field] && 1) || (a[field] > b[field] && -1) || 0
          : (a, b) => (a[field] < b[field] && -1) || (a[field] > b[field] && 1) || 0
      }
      let fields, orders
      if (typeof field === 'object') {
        fields = Object.getOwnPropertyNames(field)
        orders = fields.map(key => field[key])
        len = fields.length
      } else {
        fields = new Array(len)
        orders = new Array(len)
        for (let i = len; i--;) {
          fields[i] = arguments[i]
          orders[i] = 1
        }
      }
      return (a, b) => {
        for (let i = 0; i < len; i++) {
          if (a[fields[i]] < b[fields[i]]) { return orders[i] }
          if (a[fields[i]] > b[fields[i]]) { return -orders[i] }
        }
        return 0
      }
    }
  }
}
</script>

<style lang="scss">

#journal-of-payment-docs-v-data-table-from-pay-docs td {
    padding: 0 5px !important;
    height: 0px !important;
}

#journal-of-payment-docs-v-data-table-from-pay-docs th {
    padding: 0 5px !important;
    height: 0px !important;
}

#journal-of-payment-docs-v-data-table-to-pay-docs td {
    padding: 0 0px !important;
    height: 0px !important;
}

#journal-of-payment-docs-v-data-table-to-pay-docs th {
    padding: 0 0px !important;
    height: 0px !important;
}

.journal-of-payment-docs-documents-tables{
  margin-top: 20px;
}

.journal-of-payment-docs-to-pay-col-5 {
  flex: 0 0 40%;
  max-width: 40%;
}

.journal-of-payment-docs-arrows {
  padding-left: 5px;
  padding-right: 5px;
  flex: 0 0 3%;
  max-width: 3%;
}

.journal-of-payment-docs-for-pay-col-5 {
  flex: 0 0 54.5%;
  max-width: 54.5%;
}

.journal-of-payment-docs-buttons-of-table-docs-for-pay {
  padding-left: 5px;
  flex: 0 0 2.5%;
  max-width: 2.5%;
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
  flex: 0 0 60%;
  max-width: 60%;
}

.journal-of-payment-docs-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0px;
  min-width: 100%;
}

.journal-of-payment-docs-docs-to-pay-table{
  min-height: 250px;
}

.journal-of-payment-docs-docs-from-pay-table{
  min-height: 250px;
  max-height: 1000px;
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

.journal-of-payment-docs-headline {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.5rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
}

.journal-of-payment-docs-bottom-spacer{
  flex: 0 0 55%;
  max-width: 55%;
}

.journal-of-payment-docs-bottom-comment{
  flex: 0 0 45%;
  max-width: 45%;
}

.journal-of-payment-docs-text-danger {
  color: red;
}

</style>
