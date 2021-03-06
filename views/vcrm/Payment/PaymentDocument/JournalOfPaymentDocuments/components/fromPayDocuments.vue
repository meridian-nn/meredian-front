<template>
  <div class="journal-of-payment-docs-from-pay-docs-main-div">
    <div class="journal-of-payment-docs-from-pay-docs-list-of-orgs">
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

    <div class="journal-of-payment-docs-from-pay-docs-list-of-payment-accounts-of-org">
      <v-autocomplete
        v-model="accId"
        label="Расч. счёт"
        :loading="loadingType.paymentAccounts"
        :items="paymentAccounts"
        item-value="id"
        item-text="shortName"
        hide-details="auto"
      />
    </div>

    <div class="journal-of-payment-docs-row">
      <div class="journal-of-payment-docs-for-pay-col">
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
            height="580"
            :headers="fromPayHeaders"
            fixed-header
            :items="fromPayData"
            :show-select="true"
            :single-select="false"
            disable-pagination
            hide-default-footer
            class="elevation-1"
            @update:sort-by="updateSort('by', $event)"
            @update:sort-desc="updateSort('desc', $event)"
          >
            <template #body="{ items }">
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
                      class="journal-of-payment-docs-from-pay-docs-checkbox"
                      hide-details
                    />
                  </td>
                  <td class="journal-of-payment-docs-from-pay-docs-dataDoc">
                    {{ item.dataDoc }}
                  </td>
                  <td class="journal-of-payment-docs-table-cell-truncate">
                    <v-tooltip bottom>
                      <template #activator="{ on, attrs }">
                        <span
                          v-bind="attrs"
                          v-on="on"
                        >{{ item.nameDoc }}</span>
                      </template>
                      <span>{{ item.nameDoc }}</span>
                    </v-tooltip>
                  </td>
                  <td class="journal-of-payment-docs-from-pay-docs-payerName">
                    {{ item.payerName }}
                  </td>
                  <td class="journal-of-payment-docs-from-pay-docs-executorName">
                    {{ item.executorName }}
                  </td>
                  <td class="journal-of-payment-docs-from-pay-docs-dataOplat">
                    {{ item.dataOplat }}
                  </td>
                  <td class="journal-of-payment-docs-from-pay-docs-sumDoc">
                    {{ item.sumDoc }}
                  </td>
                  <td class="journal-of-payment-docs-from-pay-docs-sumPaid">
                    {{ item.sumPaid }}
                  </td>
                  <td class="journal-of-payment-docs-from-pay-docs-sumToPay">
                    {{ item.sumToPay }}
                  </td>
                  <td class="journal-of-payment-docs-from-pay-docs-depName">
                    {{ item.depName }}
                  </td>
                </tr>

                <infinite-loading
                  :key="keyLoading"
                  spinner="spiral"
                  :identifier="infiniteIdOfFromPayData"
                  @infinite="findSpDocoplForPay"
                >
                  <div slot="no-more" />
                  <div slot="no-results" />
                </infinite-loading>
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
            <v-list-item
              v-if="isHaveBudgetRole"
              @click="payDocumentForContextMenuOnly"
            >
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

      <div class="journal-of-payment-docs-buttons-of-table-docs-for-pay">
        <v-subheader class="font-weight-medium text-subtitle-1" />
        <div align="center">
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-btn
                color="blue"
                class="mr-2 mb-2"
                style="border-radius:50%; width: 40px; height: 40px;"
                min-width="40px"
                dark
                small
                v-bind="attrs"
                v-on="on"
                @click="editDocument"
              >
                <v-icon>mdi-file-edit</v-icon>
              </v-btn>
            </template>
            <span>Редактирование выбранного документа на оплату</span>
          </v-tooltip>

          <br>
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-btn
                color="blue"
                class="mr-2 mb-2"
                style="border-radius:50%; width: 40px; height: 40px;"
                min-width="40px"
                dark
                small
                v-bind="attrs"
                v-on="on"
                @click="copyDocument"
              >
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Копирование выбранного документа на оплату</span>
          </v-tooltip>

          <br>
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-btn
                color="blue"
                class="mr-2 mb-2"
                style="border-radius:50%; width: 40px; height: 40px;"
                min-width="40px"
                dark
                small
                v-bind="attrs"
                v-on="on"
                @click="deleteDocument"
              >
                <v-icon>mdi-delete-forever</v-icon>
              </v-btn>
            </template>
            <span>Удаление выбранных документов на оплату</span>
          </v-tooltip>

          <div
            v-if="isHaveBudgetRole"
            class="add-group"
          >
            <v-tooltip left>
              <template #activator="{ on, attrs }">
                <label
                  for="add"
                  class="add-group__btn"
                  v-bind="attrs"
                  data-title="Создание новых документов"
                  v-on="on"
                > +
                </label>
              </template>
              <span>Создание новых документов</span>
            </v-tooltip>
            <input
              id="add"
              v-model="addGroupShow"
              class="add-group__input"
              type="checkbox"
            >
            <v-tooltip left>
              <template #activator="{ on, attrs }">
                <button
                  class="add-group__link doc_for_pay"
                  v-bind="attrs"
                  v-on="on"
                  @click="newDocument"
                >
                  опл
                </button>
              </template>
              <span>Создание нового документа на оплату</span>
            </v-tooltip>
            <v-tooltip left>
              <template #activator="{ on, attrs }">
                <button
                  class="add-group__link pay_by_cashbox"
                  v-bind="attrs"
                  v-on="on"
                  @click="payedByCashboxForContextMenuOnly"
                >
                  нал
                </button>
              </template>
              <span>Создание новой оплаты по кассе</span>
            </v-tooltip>
            <v-tooltip left>
              <template #activator="{ on, attrs }">
                <button
                  v-if="isHaveBudgetRole()"
                  class="add-group__link internal_payment"
                  v-bind="attrs"
                  v-on="on"
                  @click="internalMovementForContextMenuOnly"
                >
                  внт
                </button>
              </template>
              <span>Создание нового внутреннего платежа</span>
            </v-tooltip>
          </div>

          <div
            v-else
            data-title="Добавление нового документа на оплату"
          >
            <v-tooltip left>
              <template #activator="{ on, attrs }">
                <v-btn
                  color="blue"
                  class="mr-2 mb-2"
                  style="border-radius:50%; width: 40px; height: 40px;"
                  min-width="40px"
                  dark
                  small
                  v-bind="attrs"
                  v-on="on"
                  @click="newDocument"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Добавление нового документа на оплату</span>
            </v-tooltip>
          </div>
        </div>
      </div>

      <div class="journal-of-payment-docs-row">
        <div>
          <th>Итого</th>
        </div>

        <div class="journal-of-payment-docs-from-pay-docs-bottom-spacer-for-fromPay-results" />

        <div class="journal-of-payment-docs-from-pay-docs-result-text">
          <th>
            <vue-numeric
              v-model="totalSumDoc"
              separator="space"
              :precision="2"
              decimal-separator="."
              output-type="number"
              :read-only="true"
            />
          </th>
        </div>

        <div class="journal-of-payment-docs-from-pay-docs-result-text">
          <th>
            <vue-numeric
              v-model="totalSumPaid"
              separator="space"
              :precision="2"
              decimal-separator="."
              output-type="number"
              :read-only="true"
            />
          </th>
        </div>

        <div class="journal-of-payment-docs-from-pay-docs-result-text">
          <th>
            <vue-numeric
              v-model="totalSumToPay"
              separator="space"
              :precision="2"
              decimal-separator="."
              output-type="number"
              :read-only="true"
            />
          </th>
        </div>
      </div>

      <div class="journal-of-payment-docs-row">
        <div class="journal-of-payment-docs-from-pay-docs-bottom-comment">
          <v-text-field
            v-model="commentOfCurrentRowFromPay"
            readonly
            label="Примечание"
          />
        </div>
      </div>

      <user-notification ref="userNotification" />

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
    </div>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import UserNotification from '@/components/information_window/UserNotification'
import EditPaymentDocument from '@/views/vcrm/Payment/PaymentDocument/Modals/EditPaymentDocument'
import PaymentCardByDocument from '@/views/vcrm/Payment/PaymentDocument/Modals/PaymentCardByDocument'
import PaymentByCashbox from '@/views/vcrm/Payment/PaymentDocument/Modals/PaymentByCashbox'
import InternalPayment from '@/views/vcrm/Payment/PaymentDocument/Modals/InternalPayment'
import FiltersFormFromPayDocs from './filters/FiltersFormFromPayDocs'

export default {
  name: 'JournalOfPaymentDocumentsFromPayDocuments',

  components: {
    FiltersFormFromPayDocs,
    InfiniteLoading,
    UserNotification,
    EditPaymentDocument,
    PaymentCardByDocument,
    PaymentByCashbox,
    InternalPayment
  },

  data() {
    return {
      // Переменная для отображения информационного сообщения, что фильтры для таблицы "Документы на оплату" используются
      isFiltersForFromPayDocsUsing: false,

      // Массив выбранных строк в таблице "Документы на оплату"
      fromPaySelectedRows: [],

      // Шапка таблицы "Документы на оплату"
      fromPayHeaders: [
        {
          text: 'Дата',
          value: 'dataDoc',
          cellClass: 'padding:0px; height:0px',
          sort: () => false
        },
        {
          text: 'Номер',
          value: 'nameDoc',
          width: '250px',
          sort: () => false
        },
        {
          text: 'Плательщик',
          value: 'myorgName',
          sort: () => false
        },
        {
          text: 'Исполнитель',
          value: 'executorName',
          sort: () => false
        },
        {
          text: 'Дата оплаты',
          value: 'dataOplat',
          sort: () => false
        },
        {
          text: 'Сумма',
          value: 'sumDoc',
          sort: () => false
        },
        {
          text: 'Оплачено',
          value: 'sumPaid',
          sort: () => false
        },
        {
          text: 'К оплате',
          value: 'sumToPay',
          sort: () => false
        },
        {
          text: 'Подразделение',
          value: 'depName',
          sort: () => false
        }
      ],

      // Список документов таблицы "Документы на оплату"
      fromPayData: [],

      // Переменная для реализации обновления данных в таблице "Документы на оплату"
      infiniteIdOfFromPayData: 0,

      // Контекстное меню документов на оплату
      fromPayMenu: false,
      xFromPayMenu: 0,
      yFromPayMenu: 0,
      currentRowForContextMenuOfFromPayDocument: null,

      // Переменная, которая отвечает за отображение всплывающих кнопок группы добавления новых документов
      addGroupShow: false,

      // Итоги по суммам документов по таблице "Документы на оплату"
      totalSumDoc: 0,
      totalSumPaid: 0,
      totalSumToPay: 0,

      loadingType: {},

      organizations: [],
      selectedOrganization: null,

      paymentAccounts: [],
      accId: null,

      // Примечание выбранной строки таблицы "Документы на оплату"
      commentOfCurrentRowFromPay: '',

      // Переменная для реализации пагинации таблицы "Документы на оплату"
      pageOfFromPayData: 0,
      sortBy: [],
      sortDesc: [],
      keyLoading: Math.random()
    }
  },

  computed: {
    handleSortData() {
      const { sortDesc } = this

      return this.sortBy.map((item, i) => {
        return { 'direction': sortDesc[i] ? 'ASC' : 'DESC', 'property': item }
      })
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    async init() {
      await this.updateDocsForPay()
      await this.findOrganizations()
      await this.findDefaultOrgAndAccIdForUserOnForm()
      if (this.selectedOrganization) {
        await this.findPaymentAccounts(this.selectedOrganization)
      }
    },

    updateSort(byDesc, event) {
      if (byDesc === 'by') {
        this.sortBy = event
      } else if (byDesc === 'desc') {
        this.sortDesc = event
      }
      this.pageOfFromPayData = 0
      this.fromPayData = []
      this.keyLoading = Math.random()
    },

    // Функция открытия формы фильтров таблицы "Документы на оплату"
    openFilterFormForFromPayDocs() {
      this.$refs.filtersFormFromPayDocs.openForm()
    },

    // Функция поиска организации и расчетного счета по умолчанию для текущего пользователя
    async findDefaultOrgAndAccIdForUserOnForm() {
      const filtersParams = await this.findDefaultOrgAndAccIdForUser()
      if (filtersParams) {
        this.selectedOrganization = filtersParams.orgId
        this.accId = filtersParams.accId
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

      const sumDocs = this.countSumOfArrayElements(this.fromPaySelectedRows.map(value => value.sumToPayNumber))

      if (sumDocs > this.currentPaymentAccountBalance) {
        this.$refs.userNotification.showUserNotification('warning', 'Сумма выбранных документов на оплату превышает сумму остатка по выбранному р/с!', 4000)
      }

      await this.addPayments()
      const responseSpOplatSave = await this.changeSumToPayOfPaymentAccount(this.accId, sumDocs, 'SUM')
      await this.updateDocsForPay()

      if (responseSpOplatSave) {
        this.$emit('refreshToPayDocs')
      }
    },
    async addPayments() {
      const ids = this.fromPaySelectedRows.map(value => value.id)
      const data = { ids, accId: this.accId }
      await this.$api.payment.payDocument(data)
    },
    countSumOfArrayElements(array) {
      let sum = 0
      for (let i = 0; i < array.length; i++) {
        sum += array[i]
      }
      return sum
    },

    // Функции контекстного меню таблицы документов на оплату
    // Вызов формы "История оплат"
    historyOfPaymentFromPaymentForContextMenuOnly() {
      this.$refs.paymentCardByDocument.openForm(this.currentRowForContextMenuOfFromPayDocument.id)
      console.log('history of payment from payment')
    },

    // Функция отработки события "Закрытие формы фильтров таблицы "Документов на оплату""
    closeFiltersFormFromPayDocs() {
      console.log('close filters for from pay docs')
    },

    // Функция отбработки события "Закрытие формы фильтров таблицы "Документов на оплату" с сохранением"
    saveFiltersFormFromPayDocs() {
      this.updateDocsForPay()
      console.log('save filters for from pay docs')
    },

    // Обновление таблицы "Документы к оплате
    updateDocsForPay() {
      this.pageOfFromPayData = 0
      this.fromPaySelectedRows = []
      this.fromPayData = []
      this.infiniteIdOfFromPayData += 1
    },

    // Изменение выбранного документа на оплату
    editDocument() {
      if (this.fromPaySelectedRows && this.fromPaySelectedRows.length) {
        const selDoc = this.fromPaySelectedRows[0]
        if (selDoc.isVnpl) {
          this.$refs.userNotification.showUserNotification('error', 'У Вас нет прав на редактирование внутреннего платежа!')
        } else {
          this.$refs.editPaymentDocument.editDocument(selDoc.id)
        }
      }
    },

    // Копирование выбранного документа на оплату
    copyDocument() {
      if (this.fromPaySelectedRows && this.fromPaySelectedRows.length) {
        const selDoc = this.fromPaySelectedRows[0]
        if (selDoc.isVnpl) {
          this.$refs.userNotification.showUserNotification('error', 'У Вас нет прав на создание внутреннего платежа!')
        } else {
          this.$refs.editPaymentDocument.copyDocument(selDoc.id)
        }
      }
    },

    // Удаление выбранных документов на оплату
    async deleteDocument() {
      if (this.fromPaySelectedRows && this.fromPaySelectedRows.length) {
        const docsFromPay = this.fromPaySelectedRows.filter(item => item.isVnpl === false)

        if (docsFromPay.length > 0) {
          await this.deleteDocFromPay(docsFromPay)
          await this.updateDocsForPay()
        }
      }
    },

    deleteVnpl() {
      this.$refs.userNotification.showUserNotification('success', 'метод в разработке!')
    },

    async deleteDocFromPay(docsFromPay) {
      const selectedRows = docsFromPay
      const isDeletionPossible = this.checkSelectedRowsBeforeDelete(selectedRows)

      if (isDeletionPossible === false) {
        this.$refs.userNotification.showUserNotification('error', 'В выбранных на удаление документах на оплату есть документ, по которому есть оплата! Удаление невозможно!', 5000)
        return
      }

      const ids = selectedRows.map(value => value.id)
      await this.$api.payment.DocOplForPay.deleteSelectedPayments(ids)

      await this.updateDocsForPay()
    },

    checkSelectedRowsBeforeDelete(selectedRows) {
      let isDeletionPossible = true

      selectedRows.forEach((row) => {
        if (row.sumPaidNumber !== 0) {
          isDeletionPossible = false
        }
      })
      return isDeletionPossible
    },

    // Функционал кнопок таблицы "Документы на оплату"
    // Добавление нового документа в таблицу "Документы на оплату"
    newDocument() {
      this.addGroupShow = false
      this.$refs.editPaymentDocument.newDocument(this.selectedOrganization)
    },

    // Вызов формы "Оплата по кассе"
    payedByCashboxForContextMenuOnly() {
      this.addGroupShow = false
      this.$refs.paymentByCashbox.newDocument(this.selectedOrganization, this.accId)
      console.log('payed by cashbox')
    },

    // Вн. перемещение
    internalMovementForContextMenuOnly() {
      if (!this.selectedOrganization || !this.accId) {
        this.$refs.userNotification.showUserNotification('error', 'Перед созданием внутреннего платежа, выберите организацию и расчетный счет!')
        return
      }

      this.addGroupShow = false
      this.$refs.internalPayment.newDocument(this.selectedOrganization, this.accId)

      console.log('internal movement')
    },

    // Обработка события "Закрытие формы "Документ на оплату" по нажатию кнопки "Отмена""
    closePaymentDocument() {
      this.fromPaySelectedRows = []
      console.log('close')
    },

    // Обработка события "Сохранение нового документа на оплату и закрытие формы "Документ на оплату""
    savePaymentDocument() {
      this.updateDocsForPay()
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
    async savePaymentByCashbox() {
      this.$emit('updateJournalOfPaymentDocumentsHeaderInfo')
      await this.updateDocsForPay()
      this.$emit('refreshToPayDocs')
    },

    // Обработка события "Закрытие модальной формы внутреннего платежа"
    closeInternalPayment() {
      console.log('close internal payment')
    },

    // Обработка события "Сохранение нового внутреннего платежа"
    async saveInternalPayment() {
      this.$emit('updateJournalOfPaymentDocumentsHeaderInfo')
      await this.updateDocsForPay()
    },

    // Поиск организаций для выбора пользователем
    async findOrganizations() {
      this.loadingType.organizations = true
      this.organizations = await this.getBudgetOrganizations()
      this.loadingType.organizations = null
    },

    // Функция обработки выбора организации
    async organizationChange(orgId) {
      this.accId = null
      await this.findPaymentAccounts(orgId)
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

    // Поиск документов для таблицы "Документы на оплату" по выбранной организации
    async findSpDocoplForPay($state) {
      const dataForFiltersQuery = this.createCriteriasToSearchForFiltersValues(this.$route.name,
        this.getIdOfFromPayDocsTableOfJournalOfPaymentDocs(), this.getCurrentUser.id)
      const response = await this.$api.uiSettings.findBySearchCriterias(dataForFiltersQuery)
      let filtersParams

      if (response.length) {
        filtersParams = JSON.parse(response[0].settingValue)
      }

      const searchCriterias = this.createCriteriasForRequestToSearchDocsFromPay(filtersParams)

      const data = { searchCriterias, page: this.pageOfFromPayData, orders: this.handleSortData, size: 200 }

      this.isFiltersForFromPayDocsUsing = searchCriterias.length > 1

      await this.fillResultsOfDocumentsFromPay(searchCriterias)

      const { content } = await this.$api.payment.docOplForPay.findDocumentsForPayForJournalTable(data)

      if (content.length > 0) {
        this.pageOfFromPayData += 1

        content.forEach((value) => {
          value.sumPaid = value.sumPaid ? value.sumPaid : 0
          value.sumToPay = value.sumToPay ? value.sumToPay : 0

          if (value.myOrg) {
            value.payerName = value.myOrg.clName8
          } else {
            value.payerName = value.myorgName
          }

          value.isVnpl = value.nameDoc.substr(0, 4) === 'ВнПл'

          value.sumDocNumber = value.sumDoc
          value.sumDoc = this.numberToSum(value.sumDoc)
          value.sumPaidNumber = value.sumPaid
          value.sumPaid = this.numberToSum(value.sumPaid)
          value.sumToPayNumber = value.sumToPay
          value.sumToPay = this.numberToSum(value.sumToPay)
        })

        this.fromPayData.push(...content)

        $state.loaded()
      } else {
        $state.complete()
      }
    },

    async fillResultsOfDocumentsFromPay(searchCriterias) {
      const dataForResults = this.createCriteriasToGetResultsOfDocsFromPay(searchCriterias)
      const response = await this.$api.payment.docOplForPay.findDocumentsWithGroupBy(dataForResults)

      if (response.length > 0) {
        const results = response[0]
        this.totalSumDoc = this.numberToSum(results.sum_sumDoc)
        this.totalSumPaid = this.numberToSum(results.sum_sumPaid)
        this.totalSumToPay = this.numberToSum(results.sum_sumToPay)
      } else {
        this.totalSumDoc = 0
        this.totalSumPaid = 0
        this.totalSumToPay = 0
      }
    }
  }
}
</script>

<style lang="scss">

.journal-of-payment-docs-from-pay-docs-main-div {
  padding: 10px;
}

.journal-of-payment-docs-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
  min-width: 100%;
}

.journal-of-payment-docs-for-pay-col {
  flex: 0 0 96%;
  max-width: 96%;
}

.journal-of-payment-docs-from-pay-subheader-first {
  padding-right: 30px;
}

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

.journal-of-payment-docs-from-pay-docs-sumToPay {
  width: 81px !important
}

.journal-of-payment-docs-from-pay-docs-depName {
  width: 123px !important
}

.journal-of-payment-docs-buttons-of-table-docs-for-pay {
  padding-left: 5px;
  flex: 0 0 4%;
  max-width: 4%;
}

.journal-of-payment-docs-bottom-fromPay-results{
  flex: 0 0 65%;
  max-width: 65%;
}

.journal-of-payment-docs-from-pay-docs-bottom-spacer-for-fromPay-results{
  flex: 0 0 59%;
  max-width: 59%;
}

.journal-of-payment-docs-from-pay-docs-result-text{
  font-size: 0.75rem;
  padding-right: 54px;
}

.add-group{
  width: 40px;
  height: 40px;
  margin-right: 8px;
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
  position: relative;
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

.journal-of-payment-docs-from-pay-docs-list-of-orgs{
  flex: 0 0 20%;
  max-width: 20%;
}

.journal-of-payment-docs-from-pay-docs-list-of-payment-accounts-of-org{
  flex: 0 0 20%;
  max-width: 20%;
}

.journal-of-payment-docs-from-pay-docs-bottom-comment {
  flex: 0 0 58%;
}

.journal-of-payment-docs-table-cell-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 1px;
}
</style>
