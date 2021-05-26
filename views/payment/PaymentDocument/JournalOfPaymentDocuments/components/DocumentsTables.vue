<template>
  <div
    name="journal-of-payment-docs-documents-tables"
  >
    <journal-of-payment-documents-header ref="journalOfPaymentDocumentsHeader" />

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
              v-model.number="restPaymentAccountInfo"
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
              v-model.number="paymentAccountInfo"
              class="journal-of-payment-docs-headline"
              separator="space"
              :precision="2"
              decimal-separator="."
              :output-type="number"
              :read-only="true"
            /> {{ additionalMessage }}
          </span>
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

        <div
          id="journal-of-payment-docs-div-v-data-table"
          @contextmenu="showPaymentByCashboxMenuOnly"
        >
          <v-data-table
            id="journal-of-payment-docs-v-data-table-to-pay-docs"
            v-model="toPaySelectedRows"
            height="440"
            :headers="toPayHeaders"
            fixed-header
            :items="toPayData"
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
                      :output-type="number"
                    />
                    <span class="line" />
                  </div>
                </template>
              </v-edit-dialog>
            </template>
          </v-data-table>
        </div>

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

        <v-menu
          v-model="paymentByCashboxMenuOnly"
          :position-x="xPaymentByCashboxMenuOnly"
          :position-y="yPaymentByCashboxMenuOnly"
          absolute
          offset-y
        >
          <v-list>
            <v-list-item @click="payedByCashboxForContextMenuOnly">
              <v-list-item-title>
                Оплата по кассе
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
              class="journal-of-payment-docs-from-pay-subheader-first"
            >
              Документы на оплату
            </div>
            <div>
              <v-btn
                v-if="isFiltersForFromPayDocsUsing"
                color="blue"
                dark
                @click="openFilterFormForFromPayDocs"
              >
                Фильтры
              </v-btn>
              <v-btn
                v-else
                @click="openFilterFormForFromPayDocs"
              >
                Фильтры
              </v-btn>
            </div>
          </v-row>
        </v-subheader>

        <div
          id="journal-of-payment-docs-div-v-data-table-from-pay-docs"
        >
          <v-data-table
            id="journal-of-payment-docs-v-data-table-from-pay-docs"
            v-model="fromPaySelectedRows"
            height="440"
            :headers="fromPayHeaders"
            fixed-header
            :items="fromPayData"
            :show-select="true"
            :single-select="false"
            disable-pagination
            hide-default-footer
            class="elevation-1"
          >
            <template
              #body="{ items }"
            >
              <tbody>
                <tr
                  v-for="item in items"
                  :key="item.id"
                  :value="item"
                  @contextmenu="showFromPayMenu($event, item)"
                  @click="fillCommentOfCurrentRow(item)"
                >
                  <td>
                    <v-checkbox
                      v-model="fromPaySelectedRows"
                      :value="item"
                      class="journal-of-payment-docs-checkbox"
                      hide-details
                    />
                  </td>
                  <td class="journal-of-payment-docs-data">
                    {{ item.dataDoc }}
                  </td>
                  <td class="journal-of-payment-docs-rower">
                    {{ item.nameDoc }}
                  </td>
                  <td class="journal-of-payment-docs-rower">
                    {{ item.myorgName }}
                  </td>
                  <td class="journal-of-payment-docs-data-oplat">
                    {{ item.dataOplat }}
                  </td>
                  <td class="journal-of-payment-docs-sum-doc">
                    {{ item.sumDoc }}
                  </td>
                  <td class="journal-of-payment-docs-sum-paid">
                    {{ item.sumPaid }}
                  </td>
                  <td class="journal-of-payment-docs-sum-oplat">
                    {{ item.sumOplat }}
                  </td>
                  <td class="journal-of-payment-docs-dep-name">
                    {{ item.depName }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </div>

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

      <filters-form-from-pay-docs
        ref="filtersFormFromPayDocs"
        @close="closeFiltersFormFromPayDocs"
        @saveFilters="saveFiltersFormFromPayDocs"
      />

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

    <div class="journal-of-payment-docs-row">
      <div class="journal-of-payment-docs-bottom-toPay-results">
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
                :output-type="number"
                :read-only="true"
              />
            </th>
          </div>
        </div>
      </div>

      <div class="journal-of-payment-docs-bottom-spacer-btw-results" />

      <div class="journal-of-payment-docs-bottom-comment">
        <div class="journal-of-payment-docs-row">
          <div>
            <th>Итого</th>
          </div>

          <div class="journal-of-payment-docs-bottom-spacer-for-fromPay-results" />

          <div class="journal-of-payment-docs-result-text">
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
          </div>

          <div class="journal-of-payment-docs-result-text">
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
          </div>

          <div class="journal-of-payment-docs-result-text">
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
          </div>
        </div>
      </div>
    </div>

    <div class="journal-of-payment-docs-row">
      <div class="journal-of-payment-docs-bottom-spacer" />
      <div class="journal-of-payment-docs-bottom-comment">
        <v-text-field
          v-model="commentOfCurrentRowFromPay"
          readonly
          label="Примечание"
        />
      </div>
    </div>
  </div>
</template>

<script>
import EditPaymentDocument from '@/views/payment/PaymentDocument/Modals/EditPaymentDocument'
import PaymentByCashbox from '@/views/payment/PaymentDocument/Modals/PaymentByCashbox'
import InternalPayment from '@/views/payment/PaymentDocument/Modals/InternalPayment'
import UserNotification from '@/views/special_components/information_window/UserNotification'
import PaymentCardByDocument from '@/views/payment/PaymentDocument/Modals/PaymentCardByDocument'
import JournalOfPaymentDocumentsHeader from './Header'
import FiltersFormFromPayDocs from './filters/FiltersFormFromPayDocs'

export default {
  name: 'JournalOfPaymentDocumentsDocumentsTables',
  components: {
    EditPaymentDocument,
    PaymentByCashbox,
    InternalPayment,
    UserNotification,
    PaymentCardByDocument,
    JournalOfPaymentDocumentsHeader,
    FiltersFormFromPayDocs
  },
  data() {
    return {
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
          text: 'Дата',
          value: 'dataOplat',
          width: '50px'
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
          value: 'sumOplatMask'
        },
        {
          text: 'Счёт',
          value: 'accId'
        },
        {
          text: 'Подразделение',
          value: 'depName'
        }
      ],

      // Список документов таблицы "Документы к оплате"
      toPayData: [],

      // Шапка таблицы "Документы на оплату"
      fromPayHeaders: [
        {
          text: 'Дата',
          value: 'dataDoc',
          cellClass: 'padding:0px; height:0px'
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
          text: 'Подразделение',
          value: 'depName'
        }
      ],

      // Список документов таблицы "Документы на оплату"
      fromPayData: [],

      // Переменная для отображения информационного сообщения, что фильтры для таблицы "Документы на оплату" используются
      isFiltersForFromPayDocsUsing: false,

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

      // Примечание выбранной строки таблицы "Документы на оплату"
      commentOfCurrentRowFromPay: '',

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

      /* Контекстное меню таблицы документов к оплате только для строки итогов
         и только для открытия формы создания нового документа "Оплата по кассе" */
      paymentByCashboxMenuOnly: false,
      xPaymentByCashboxMenuOnly: 0,
      yPaymentByCashboxMenuOnly: 0,

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

    // Секция обработки событий на форме

    // Функция обработки выбора организации
    organizationChange(val) {
      this.selectedOrganization = val
      this.accId = null
      this.updatePaymentAccountInfo(this.accId)
      this.toPayData = []
      this.totalToSumOplat = 0
      this.findPaymentAccounts(val)
    },

    // Выбор расчетного счета
    paymentAccountChange(val) {
      this.findToPay(val)
      this.updateResPaymentAccountInfo()
    },

    // Обработка события "Закрытие формы "Документ на оплату" по нажатию кнопки "Отмена""
    closePaymentDocument() {
      this.fromPaySelectedRows = []
      console.log('close')
    },

    // Обработка события "Сохранение нового документа на оплату и закрытие формы "Документ на оплату""
    savePaymentDocument() {
      this.findSpDocoplForPay()
      console.log('open')
    },

    // Обработка события "Закрытие модальной формы карточки оплат по документу"
    closePaymentCardByDocument() {
      this.fromPaySelectedRows = []
      console.log('close PaymentCardByDocument')
    },

    // Обработка события "Закрытие модальной формы оплаты по кассе"
    closePaymentByCashbox() {
      console.log('close payment by cashbox')
    },

    // Обработка события "Сохранение новой оплаты по кассе"
    savePaymentByCashbox() {
      this.refreshTables()
      this.updateResPaymentAccountInfo()
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

    // Обновление списка документов к оплате, остатков на расчетных счетах выбранной организации и при изменении даты
    updateInformationOnForm() {
      this.$refs.journalOfPaymentDocumentsHeader.findOrgAccInfo(this.date)
      this.findToPay(this.accId)
      this.updateResPaymentAccountInfo()
      this.fromPaySelectedRows = []
      this.toPaySelectedRows = []
    },

    // Вызов контекстного меню таблицы "Документы к оплате"
    // Только для создания нового документа "Оплата по кассе"
    showPaymentByCashboxMenuOnly(event) {
      // Если открыто контекстное меню строки таблицы "Документы к оплате" - отдаем предпочтение ему
      if (this.payMenu === true) {
        return
      }
      event.preventDefault()
      // Закрываем контекстное меню таблицы "Документы на оплату", если оно открыто
      this.fromPayMenu = false
      this.currentRowForContextMenuOfFromPayDocument = null

      this.paymentByCashboxMenuOnly = false
      this.xPaymentByCashboxMenuOnly = event.clientX
      this.yPaymentByCashboxMenuOnly = event.clientY
      this.$nextTick(() => {
        this.paymentByCashboxMenuOnly = true
      })
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

      // await this.$api.payment.docOplToPay.saveSpDocoplToPay(this.toPaySelectedRows)
      await this.$axios.$post('/oper/spDocopl/saveSpDocoplToPay', this.toPaySelectedRows)

      this.toPaySelectedRows = []
      this.refreshTables()
      this.$refs.userNotification.showUserNotification('success', 'Сумма оплаты сохранена')
      this.updateResPaymentAccountInfo()
    },

    // Отмена внесения измененя в сумму оплаты документа
    cancelSumOplat(selectedDoc) {
      if (!selectedDoc.isDoc) {
        return
      }

      this.$refs.userNotification.showUserNotification('error', 'Сумма оплаты не была изменена')
    },

    // Функции контекстного меню таблицы документов к оплате
    // Вызов формы "Оплата по кассе"
    payedByCashboxForContextMenuOnly() {
      if (this.selectedOrganization == null) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите организацию!')
        return
      }

      if (this.accId == null) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите расчетный счет!')
        return
      }

      this.$refs.paymentByCashbox.newDocument(this.selectedOrganization, this.accId)
      console.log('payed by cashbox')
    },

    // Перемещение документа из таблицы "Документы на оплату" в таблицу "Документы к оплате" по нажатию на стрелку
    addPaymentDocument() {
      if (!this.accId) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите расчётный счёт!')
        this.fromPaySelectedRows = []
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

    // Удаление документов из таблицы "Документы к оплате"
    async deleteSelectedPayments() {
      if (this.toPaySelectedRows && this.toPaySelectedRows.length) {
        const ids = this.toPaySelectedRows.map(value => value.id)
        await this.$axios.$post('/oper/spDocopl/deleteSelectedPayments', ids)

        this.refreshTables()
        this.updateResPaymentAccountInfo()
      }
    },

    // Вызов контекстного меню таблицы "Документы на оплату"
    showFromPayMenu(event, item) {
      event.preventDefault()
      // Закрываем контекстное меню таблицы "Документы к оплате", контекстное меню "Оплата по кассе",  если они открыто
      this.payMenu = false
      this.currentRowForContextMenu = null
      this.paymentByCashboxMenuOnly = false

      this.fromPayMenu = false
      this.currentRowForContextMenuOfFromPayDocument = null
      this.xFromPayMenu = event.clientX
      this.yFromPayMenu = event.clientY
      this.$nextTick(() => {
        this.fromPayMenu = true
        this.currentRowForContextMenuOfFromPayDocument = item
      })
    },

    // Заполнение поля "Примечание" под таблице документов на оплату примечанием выбранного документа
    fillCommentOfCurrentRow(item) {
      this.commentOfCurrentRowFromPay = item.prim
    },

    // Оплата документа на оплату через контекстное меню
    payDocumentForContextMenuOnly() {
      this.fromPaySelectedRows = []
      this.fromPaySelectedRows.push(this.currentRowForContextMenuOfFromPayDocument)
      this.addPaymentDocument()
    },

    // Функции контекстного меню таблицы документов на оплату
    // Вызов формы "История оплат"
    historyOfPaymentFromPaymentForContextMenuOnly() {
      this.$refs.paymentCardByDocument.openForm(this.currentRowForContextMenuOfFromPayDocument.id)
      console.log('hisoty of payment from payment')
    },

    // Функционал кнопок таблицы "Документы на оплату"
    // Добавление нового документа в таблицу "Документы на оплату"
    newDocument() {
      if (this.selectedOrganization == null) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите организацию!')
        return
      }
      this.$refs.editPaymentDocument.newDocument(this.selectedOrganization)
    },

    // Изменение выбранного документа на оплату
    editDocument() {
      if (this.fromPaySelectedRows && this.fromPaySelectedRows.length) {
        if (this.fromPaySelectedRows[0].sumPaidNumber !== 0) {
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

    // Вн. перемещение
    internalMovementForContextMenuOnly() {
      this.$refs.internalPayment.editDocument(this.currentRowForContextMenu.docoplId,
        this.selectedOrganization,
        this.accId)

      console.log('internal movement')
    },

    // История платежей по документу
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

    // Функция открытия формы фильтров таблицы "Документы на оплату"
    openFilterFormForFromPayDocs() {
      this.$refs.filtersFormFromPayDocs.openForm()
    },

    // Функция отработки события "Закрытие формы фильтров таблицы "Документов на оплату""
    closeFiltersFormFromPayDocs() {
      console.log('close filters for from pay docs')
    },

    // Функция отбработки события "Закрытие формы фильтров таблицы "Документов на оплату" с сохранением"
    saveFiltersFormFromPayDocs() {
      this.findSpDocoplForPay()
      console.log('save filters for from pay docs')
    },
    // Конец Секции обработки событий на форме

    // Инициализация журнала оплат
    async selOplat() {
      await this.$api.payment.selOplat()
    },

    // Обновление таблиц "Документы к оплате" и "Документы на оплату"
    refreshTables() {
      this.findSpDocoplForPay()
      this.findToPay(this.accId)
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

    // Функция поиска расчетных счетов выбранной организации
    async findPaymentAccounts(val) {
      this.loadingType.paymentAccounts = true

      const data = {
        orgId: val
      }
      let paymentAccounts = await this.$api.paymentAccounts.findAccByOrgId(data)
      paymentAccounts = paymentAccounts.sort(this.customCompare('shortName'))
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
        this.currentPaymentAccountBalance = 0
        this.paymentAccountInfo = this.currentPaymentAccountBalance
        this.currentPaymentAccountBalanceLessThenZero = false
        this.additionalMessage = ''
        return
      }

      const data = {
        dateOplat: new Date(this.date).toLocaleDateString(),
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

    // Функции поиска остатков ден. средств выбранной организации на тек. дату с учетом документов к оплате, оплат по кассе по всем расчетным счетам организации
    async updateResPaymentAccountInfo() {
      const balanceOfSelectedOrganization = await this.getBalanceOfSelectedOrganization()
      const balanceOfOtherAccounts = await this.getBalanceOfOtherAccounts()

      this.restPaymentAccountInfo = balanceOfSelectedOrganization - balanceOfOtherAccounts
    },
    async getBalanceOfSelectedOrganization() {
      const data = {
        dateOplat: new Date(this.date).toLocaleDateString()
      }
      const response = await this.$api.paymentAccounts.groupByOrg(data)
      const responseElement = response.find(el => el.myOrg.id === this.selectedOrganization)
      return responseElement.saldo
    },
    async getBalanceOfOtherAccounts() {
      let totalToSumOplat = 0
      const arrayOfPromises = []
      this.paymentAccounts.forEach((account) => {
        const promiseToPay = this.getSumToPayDocsOfOrgByAccId(account.id)
        const promisePaymentByCashbox = this.getSumOfPaymentByCashboxOfOrgByAccId(account.id)
        arrayOfPromises.push(promiseToPay)
        arrayOfPromises.push(promisePaymentByCashbox)
      })
      await Promise.all(arrayOfPromises).then((results) => {
        results.forEach((result) => {
          totalToSumOplat += result
        })
      })
      return totalToSumOplat
    },
    async getSumToPayDocsOfOrgByAccId(accId) {
      const data = this.createCriteriasForRequestToSearchDocsToPay(accId, this.selectedOrganization, this.date)
      let totalToSumOplat = 0
      const response = await this.$api.payment.docOplToPay.findDocumentsByCriterias(data)
      response.forEach((value) => {
        totalToSumOplat += value.sumOplat
      })
      return totalToSumOplat
    },
    async getSumOfPaymentByCashboxOfOrgByAccId(accId) {
      const data = this.createCriteriasForRequestToSearchPaymentsByCashbox(accId, this.selectedOrganization, this.date)
      let totalPaymentSum = 0
      const response = await this.$api.payment.findPaymentsByCashboxByCriterias(data)
      response.forEach((value) => {
        if (value.paymentOperationSums.length > 0) {
          totalPaymentSum += value.paymentOperationSums[0].paymentSum
        }
      })
      return totalPaymentSum
    },

    // Поиск документов к оплате по выбранному расчетному счету организации
    // Данная функция производит поиск документов к оплате и документов оплат по кассе на текущую дату
    // И добавляет их в таблицу "Документы к оплате"
    async findToPay(accId) {
      this.toPaySelectedRows = []
      this.toPayData = []

      const dataForFiltersQuery = this.createCriteriasToSearchForFiltersValues(this.$route.name, 'journal-of-payment-docs-to-pay-docs')
      const response = await this.$api.uiSettings.findBySearchCriterias(dataForFiltersQuery)
      let filtersParams

      if (response.length) {
        filtersParams = JSON.parse(response[0].settingValue)
      }

      const dataFromPay = this.createCriteriasForRequestToSearchDocsToPay(
        accId, this.selectedOrganization, this.date, filtersParams)
      const toPayDataResponse = await this.$api.payment.docOplToPay.findDocumentsByCriterias(dataFromPay)

      const dataPaymentByCashbox = this.createCriteriasForRequestToSearchPaymentsByCashbox(
        accId, this.selectedOrganization, this.date, filtersParams)
      const paymentByCashboxResponse = await this.$api.payment.findPaymentsByCashboxByCriterias(dataPaymentByCashbox)

      const objFromFunc = this.convertResponsesToDataForToPayTable(paymentByCashboxResponse, toPayDataResponse)

      this.toPayData = objFromFunc.arrayOfData
      this.totalToSumOplat = objFromFunc.totalPaymentSum

      this.updatePaymentAccountInfo(accId)
    },

    // Поиск документов для таблицы "Документы на оплату" по выбранной организации
    async findSpDocoplForPay() {
      this.fromPayData = []
      this.fromPaySelectedRows = []

      const dataForFiltersQuery = this.createCriteriasToSearchForFiltersValues(this.$route.name, 'journal-of-payment-docs-from-pay-docs')
      const response = await this.$api.uiSettings.findBySearchCriterias(dataForFiltersQuery)
      let filtersParams

      if (response.length) {
        filtersParams = JSON.parse(response[0].settingValue)
      }

      const data = this.createCriteriasForRequestToSearchDocsFromPay(filtersParams)

      if (data.length > 1) {
        this.isFiltersForFromPayDocsUsing = true
      } else {
        this.isFiltersForFromPayDocsUsing = false
      }

      this.fromPayData = await this.$api.payment.docOplForPay.findDocumentsByCriteriasForTableInDocumentsJournal(data)
      let totalSumDoc = 0
      let totalSumOplat = 0
      let totalSumPaid = 0
      this.fromPayData.forEach((value) => {
        totalSumDoc += value.sumDoc
        totalSumPaid += value.sumPaid
        totalSumOplat += (value.sumDoc - value.sumPaid)

        value.sumPaid = value.sumPaid == null ? 0 : value.sumPaid
        value.sumOplat = value.sumDoc - value.sumPaid

        value.sumDocNumber = value.sumDoc
        value.sumDoc = this.numberToSum(value.sumDoc)
        value.sumPaidNumber = value.sumPaid
        value.sumPaid = this.numberToSum(value.sumPaid)
        value.sumOplatNumber = value.sumOplat
        value.sumOplat = this.numberToSum(value.sumOplat)
      })
      this.totalSumDoc = totalSumDoc.toFixed(2)
      this.totalSumOplat = totalSumOplat.toFixed(2)
      this.totalSumPaid = totalSumPaid.toFixed(2)
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
  font-size: 1.5rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
}

.journal-of-payment-docs-bottom-spacer{
  flex: 0 0 43%;
  max-width: 43%;
}

.journal-of-payment-docs-bottom-toPay-results{
  flex: 0 0 40%;
  max-width: 40%;
}

.journal-of-payment-docs-bottom-spacer-for-toPay-results{
  flex: 0 0 56%;
  max-width: 56%;
}

.journal-of-payment-docs-bottom-spacer-btw-results{
  flex: 0 0 3%;
  max-width: 3%;
}

.journal-of-payment-docs-bottom-fromPay-results{
  flex: 0 0 57%;
  max-width: 57%;
}

.journal-of-payment-docs-bottom-spacer-for-fromPay-results{
  flex: 0 0 52%;
  max-width: 52%;
}

.journal-of-payment-docs-result-text{
  font-size: 0.75rem;
  padding-right: 15px;
}

.journal-of-payment-docs-bottom-comment{
  flex: 0 0 57%;
  max-width: 57%;
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

.journal-of-payment-docs-brise-input input:focus ~ label, input:valid ~ label  {
  top: 0px;
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
  left: -999px;
  transition: .25s;
  opacity: 0;
  z-index: 6;
}

.journal-of-payment-docs-filter-button{
  background: #639db1;
}

.journal-of-payment-docs-brise-input input:focus ~ .line {
  left: 0;
  opacity: 1;
}

.journal-of-payment-docs-brise-input label {
  position: absolute;
  left: 10px;
  top: 45%;
  transition: ease-out .15s;
  color: #999;
}

.journal-of-payment-docs-rower {
  width: 170px;
}

.journal-of-payment-docs-checkbox {
  margin:0px;
  padding:0px;
  color:#999 !important
}

.journal-of-payment-docs-data {
  width: 80px !important
}

.journal-of-payment-docs-data-oplat {
  width: 100px !important
}

.journal-of-payment-docs-sum-doc {
  width: 84px !important
}

.journal-of-payment-docs-sum-paid {
  width: 84px !important
}

.journal-of-payment-docs-sum-oplat {
  width: 81px !important
}

.journal-of-payment-docs-dep-name {
  width: 123px !important
}

</style>
