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
                  v-model="paymentAccountInfo"
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

            <div
              id="journal-of-payment-docs-div-v-data-table"
              @contextmenu="showPaymentByCashboxMenuOnly"
            >
              <v-data-table
                id="journal-of-payment-docs-v-data-table-to-pay-docs"
                v-model="toPaySelectedRows"
                :headers="toPayHeaders"
                height="452"
                fixed-header
                :items="toPayData"
                item-key="keyId"
                :show-select="true"
                :single-select="false"
                disable-pagination
                hide-default-footer
                no-data-text=""
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
                    Создать оплату по кассе
                  </v-list-item-title>
                </v-list-item>

                <v-list-item @click="editPaymentByCashboxForContextMenuOnly">
                  <v-list-item-title>
                    Ред. оплату по кассе
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
                    Создать оплату по кассе
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
              <div
                class="journal-of-payment-docs-add-payment-docs"
                data-title="Перенести выбранные документы на оплату в список документов к оплате"
              >
                <v-btn
                  color="blue"
                  class="mr-2 mb-2 "
                  fab
                  dark
                  small
                  @click="addPaymentDocument"
                >
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
              </div>
              <br>

              <div
                class="journal-of-payment-docs-delete-payment-docs"
                data-title="Перенести выбранные документы к оплате в список документов на оплату"
              >
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
        </div>
      </div>

      <edit-payment-document
        ref="editPaymentDocument"
        :value="dialog.editPaymentDocument"
        @close="closePaymentDocument"
        @cancel="closePaymentDocument"
        @save="savePaymentDocument"
      />

      <payment-card-by-document
        ref="paymentCardByDocument"
        :value="dialog.paymentCardByDocument"
        @close="closePaymentCardByDocument"
      />

      <div class="journal-of-payment-docs-right-col">
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
                      <td class="journal-of-payment-docs-from-pay-docs-nameDoc">
                        {{ item.nameDoc }}
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

          <div class="journal-of-payment-docs-buttons-of-table-docs-for-pay">
            <v-subheader class="font-weight-medium text-subtitle-1" />
            <div align="center">
              <div
                class="journal-of-payment-docs-buttons-edit-button"
                data-title="Редактирование выбранного документа на оплату"
              >
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
              </div>

              <br>

              <div
                class="journal-of-payment-docs-buttons-copy-button"
                data-title="Копирование выбранного документа на оплату"
              >
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
              </div>

              <br>
              <div
                class="journal-of-payment-docs-buttons-delete-button"
                data-title="Удаление выбранных документов на оплату"
              >
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

              <div
                class="add-group"
              >
                <label
                  for="add"
                  class="add-group__btn"
                  data-title="Создание новых документов"
                > +
                </label>
                <input
                  id="add"
                  v-model="addGroupShow"
                  class="add-group__input"
                  type="checkbox"
                >
                <button
                  class="add-group__link doc_for_pay"
                  data-title="Создание нового документа на оплату"
                  @click="newDocument"
                >
                  опл
                </button>
                <button
                  class="add-group__link pay_by_cashbox"
                  data-title="Создание новой оплаты по кассе"
                  @click="payedByCashboxForContextMenuOnly"
                >
                  нал
                </button>
                <button
                  class="add-group__link internal_payment"
                  data-title="Создание нового внутреннего платежа"
                  @click="internalMovementForContextMenuOnly"
                >
                  внт
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="journal-of-payment-docs-row"
    >
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
                output-type="number"
                :read-only="true"
              />
            </th>
          </div>
        </div>
      </div>

      <div class="journal-of-payment-docs-bottom-fromPay-results">
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
                output-type="number"
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
                output-type="number"
                :read-only="true"
              />
            </th>
          </div>

          <div class="journal-of-payment-docs-result-text">
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
      </div>
    </div>

    <div
      class="journal-of-payment-docs-row"
    >
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
import EditPaymentDocument from '@/views/vcrm/Payment/PaymentDocument/Modals/EditPaymentDocument'
import PaymentByCashbox from '@/views/vcrm/Payment/PaymentDocument/Modals/PaymentByCashbox'
import InternalPayment from '@/views/vcrm/Payment/PaymentDocument/Modals/InternalPayment'
import UserNotification from '@/components/information_window/UserNotification'
import PaymentCardByDocument from '@/views/vcrm/Payment/PaymentDocument/Modals/PaymentCardByDocument'
import InfiniteLoading from 'vue-infinite-loading'
import JournalOfPaymentDocumentsHeader from './Header'
import FiltersFormFromPayDocs from './filters/FiltersFormFromPayDocs'

export default {
  name: 'JournalOfPaymentDocumentsDocumentsTables',

  components: {
    EditPaymentDocument,
    InfiniteLoading,
    PaymentByCashbox,
    InternalPayment,
    UserNotification,
    PaymentCardByDocument,
    JournalOfPaymentDocumentsHeader,
    FiltersFormFromPayDocs
  },

  data() {
    return {
      dialog: {
        editPaymentDocument: false,
        paymentCardByDocument: false
      },

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
          text: 'Оплата',
          value: 'sumOplatMask',
          width: '60px'
        }
      ],

      // Список документов таблицы "Документы к оплате"
      toPayData: [],

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

      // Итоги по суммам документов по таблице "Документы на оплату"
      totalSumDoc: 0,
      totalSumPaid: 0,
      totalSumToPay: 0,

      // Переменная для отображения информационного сообщения, что фильтры для таблицы "Документы на оплату" используются
      isFiltersForFromPayDocsUsing: false,

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
      additionalMessage: '',

      // Переменная для реализации пагинации таблицы "Документы на оплату"
      pageOfFromPayData: 0,

      // Переменная для реализации обновления данных в таблице "Документы на оплату"
      infiniteIdOfFromPayData: 0,

      // Переменная, которая отвечает за отображение всплывающих кнопок группы добавления новых документов
      addGroupShow: false,
      sortBy: [],
      sortDesc: [],
      keyLoading: Math.random()
    }
  },

  computed: {
    // totalSumDoc() {
    //   return this.fromPayData.reduce((acc, item) => {
    //     return acc + item.sumDocNumber
    //   }, 0)
    // },

    // totalSumPaid() {
    //   return this.fromPayData.reduce((acc, item) => {
    //     return acc + item.sumPaidNumber
    //   }, 0)
    // },

    // totalSumOplat() {
    //   return this.fromPayData.reduce((acc, item) => {
    //     return acc + (item.sumDocNumber - item.sumPaidNumber)
    //   }, 0)
    // }

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
      await this.selOplat()
      await this.$refs.journalOfPaymentDocumentsHeader.findOrgAccInfo(this.date)
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

    // Функция обработки выбора организации
    async organizationChange(orgId) {
      this.accId = null
      await this.updatePaymentAccountInfo(this.accId)
      this.toPayData = []
      this.totalToSumOplat = 0
      await this.findPaymentAccounts(orgId)
      this.selectFirstPaymentAccount()
    },

    // Функция поиска организации и расчетного счета по умолчанию для текущего пользователя
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

    // Обработка события "Закрытие формы "Документ на оплату" по нажатию кнопки "Отмена""
    closePaymentDocument() {
      this.fromPaySelectedRows = []
      this.dialog.editPaymentDocument = false
    },

    // Обработка события "Сохранение нового документа на оплату и закрытие формы "Документ на оплату""
    savePaymentDocument() {
      this.updateDocsForPay()

      this.dialog.editPaymentDocument = false
    },

    // Обработка события "Закрытие модальной формы карточки оплат по документу"
    closePaymentCardByDocument() {
      this.fromPaySelectedRows = []
      this.dialog.paymentCardByDocument = false
    },

    // Обработка события "Закрытие модальной формы оплаты по кассе"
    closePaymentByCashbox() {
      console.log('close payment by cashbox')
    },

    // Обработка события "Сохранение новой оплаты по кассе"
    async savePaymentByCashbox() {
      await this.$refs.journalOfPaymentDocumentsHeader.findOrgAccInfo(this.date)
      await this.refreshTables()
    },

    // Обработка события "Закрытие модальной формы внутреннего платежа"
    closeInternalPayment() {
      console.log('close internal payment')
    },

    // Обработка события "Сохранение нового внутреннего платежа"
    async saveInternalPayment() {
      await this.$refs.journalOfPaymentDocumentsHeader.findOrgAccInfo(this.date)
      await this.refreshTables()
    },

    // Обновление списка документов к оплате, остатков на расчетных счетах выбранной организации и при изменении даты
    async updateInformationOnForm() {
      await this.$refs.journalOfPaymentDocumentsHeader.findOrgAccInfo(this.date)
      await this.findToPay(this.accId)
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

      await this.$api.payment.docOplToPay.saveSpDocoplToPay(this.toPaySelectedRows)
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
      return this.changeSumToPayOfPaymentAccount(this.accId, sumDoc, typeOfOperation, this.date)
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
      this.addGroupShow = false
      this.$refs.paymentByCashbox.newDocument(this.selectedOrganization, this.accId)
      console.log('payed by cashbox')
    },

    editPaymentByCashboxForContextMenuOnly() {
      this.addGroupShow = false

      if (this.currentRowForContextMenu.isDoc) {
        this.$refs.userNotification.showUserNotification('error', 'Был выбран документ к оплате! Выберите оплату по кассе!')
        return
      }

      this.$refs.paymentByCashbox.editDocument(this.currentRowForContextMenu.id)
      console.log('payed by cashbox')
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
      const responseSpOplatSave = await this.changeSumToPayOfPaymentAccount(this.accId, sumDocs, 'SUM', new Date())
      await this.refreshTables()

      if (responseSpOplatSave) {
        await this.$refs.journalOfPaymentDocumentsHeader.findOrgAccInfo(this.date)
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

    // Удаление документов из таблицы "Документы к оплате"
    async deleteSelectedPayments() {
      if (!this.toPaySelectedRows || !this.toPaySelectedRows.length) {
        return
      }

      const sumDocs = this.countSumOfArrayElements(this.toPaySelectedRows.map(value => value.sumOplat))

      const ids = this.toPaySelectedRows.map(value => value.id)
      await this.$api.payment.docOplToPay.deleteSelectedPayments(ids)
      const responseSpOplatSave = await this.changeSumToPayOfPaymentAccount(this.accId, sumDocs, 'DEDUCT', this.date)

      await this.refreshTables()
      if (responseSpOplatSave) {
        await this.$refs.journalOfPaymentDocumentsHeader.findOrgAccInfo(this.date)
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
      console.log('history of payment from payment')
    },

    // Функционал кнопок таблицы "Документы на оплату"
    // Добавление нового документа в таблицу "Документы на оплату"
    newDocument() {
      this.addGroupShow = false
      this.$refs.editPaymentDocument.newDocument(this.selectedOrganization)
    },

    // Изменение выбранного документа на оплату
    editDocument() {
      if (this.fromPaySelectedRows && this.fromPaySelectedRows.length) {
        const selDoc = this.fromPaySelectedRows[0]
        if (selDoc.isVnpl) {
          this.$refs.internalPayment.editDocument(selDoc.id)
        } else {
          this.$refs.editPaymentDocument.editDocument(selDoc.id)
        }
      }
      this.dialog.editPaymentDocument = true
    },

    // Удаление выбранных документов на оплату
    async deleteDocument() {
      if (this.fromPaySelectedRows && this.fromPaySelectedRows.length) {
        const docsFromPay = this.fromPaySelectedRows.filter(item => item.isVnpl === false)
        const vnplDocs = this.fromPaySelectedRows.filter(item => item.isVnpl === true)
        let isDeleteDocsFromPayHappened = false
        let isDeleteVnplDocsHappened = false

        if (docsFromPay.length > 0) {
          await this.deleteDocFromPay(docsFromPay)
          isDeleteDocsFromPayHappened = true
        }

        if (vnplDocs.length > 0) {
          await this.deleteVnpl(vnplDocs)
          isDeleteVnplDocsHappened = true
        }

        if (isDeleteDocsFromPayHappened || isDeleteVnplDocsHappened) {
          await this.updateDocsForPay()
          if (isDeleteVnplDocsHappened) {
            await this.$refs.journalOfPaymentDocumentsHeader.findOrgAccInfo(this.date)
          }
        }
      }
    },

    async deleteVnpl(vnplDocs) {
      for (const vnplDocArr of vnplDocs) {
        const vnplDoc = await this.$api.payment.docOplForPay.findById(vnplDocArr.id)
        vnplDoc.spDocints.sort(this.customCompare('id', -1))
        const spDocint = vnplDoc.spDocints[0]
        const dataOfDoc = this.convertLocaleDateStringToDate(vnplDoc.dataDoc)
        await this.changeVnplOfPaymentAccounts(spDocint.accId, vnplDoc.accId, vnplDoc.sumDoc, dataOfDoc)
        await this.$api.payment.docOplForPay.deleteInternalPaymentDocument(vnplDoc.id)
        // await this.$axios.$post(this.$api.payment.docOplForPay.getDeleteInternalPaymentDocument(), vnplDoc.id, this.getConfigForDeleteMethods())
      }
    },

    async deleteDocFromPay(docsFromPay) {
      const selectedRows = docsFromPay
      const isDeletionPossible = this.checkSelectedRowsBeforeDelete(selectedRows)

      if (isDeletionPossible === false) {
        this.$refs.userNotification.showUserNotification('error', 'В выбранных на удаление документах на оплату есть документ, по которому есть оплата! Удаление невозможно!', 5000)
        return
      }

      const ids = selectedRows.map(value => value.id)
      await this.$api.payment.docOplForPay.deleteSelectedPayments(ids)

      // await this.$axios.$post(this.$api.payment.docOplForPay.getDeletePaymentUrl(), ids)
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

    // Копирование выбранного документа на оплату
    copyDocument() {
      if (this.fromPaySelectedRows && this.fromPaySelectedRows.length) {
        const selDoc = this.fromPaySelectedRows[0]
        if (selDoc.isVnpl) {
          this.$refs.internalPayment.copyDocument(selDoc.id)
        } else {
          this.$refs.editPaymentDocument.copyDocument(selDoc.id)
        }
      }
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

    // Перемещение документа из таблицы "Документы к оплате" в таблицу "Документы на оплату"
    deleteFromToPayForContextMenuOnly() {
      if (!this.currentRowForContextMenu.isDoc) {
        this.deletePaymentByCashbox(this.currentRowForContextMenu)
      } else {
        this.deleteFromPay(this.currentRowForContextMenu)
      }
    },

    async deletePaymentByCashbox(curRow) {
      console.log(curRow.dataOplat)
      const dateOfDoc = this.convertLocaleDateStringToDate(curRow.dataOplat)
      await this.changeSumToPayOfPaymentAccount(curRow.accId, curRow.sumOplat, 'DEDUCT', dateOfDoc)
      await this.$api.payment.deletePaymentUrl(curRow.id)
      await this.refreshTables()
      await this.$refs.journalOfPaymentDocumentsHeader.findOrgAccInfo(this.date)
    },

    deleteFromPay(curRow) {
      this.toPaySelectedRows = []
      this.toPaySelectedRows.push(curRow)
      this.deleteSelectedPayments()
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
      this.updateDocsForPay()
      console.log('save filters for from pay docs')
    },
    // Конец Секции обработки событий на форме

    // Инициализация журнала оплат
    async selOplat() {
      // await this.$axios.$post(this.$api.payment.getSelOplatUrl())
      await this.$api.payment.selOplat()
    },

    // Обновление таблиц "Документы к оплате" и "Документы на оплату"
    async refreshTables() {
      this.updateDocsForPay()
      await this.findToPay(this.accId)
    },

    // Обновление таблицы "Документы к оплате
    updateDocsForPay() {
      this.pageOfFromPayData = 0
      this.fromPaySelectedRows = []
      this.fromPayData = []
      this.infiniteIdOfFromPayData += 1
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

      const data = { searchCriterias, page: this.pageOfFromPayData, orders: this.handleSortData }

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

.journal-of-payment-docs-brise-input input:focus ~ .line {
  left: 0;
  opacity: 1;
}

.journal-of-payment-docs-brise-input input:valid ~ label, input:focus ~ label   {
  top: 0;
  transform: scale(0.94) translateX(-2px);
  color: #639db1;
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

.journal-of-payment-docs-from-pay-docs-sumToPay {
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

.add-group__btn:hover::after {
  content: attr(data-title);
  position: absolute;
  right: 100%; top: -200%;
  z-index: 1;
  background: rgba(255,255,230,0.9);
  font-family: Arial, sans-serif;
  color: black;
  font-size: 11px;
  padding: 5px 10px;
  border: 1px solid #333;
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

.add-group .doc_for_pay:hover::after {
  content: attr(data-title);
  position: absolute; /* Абсолютное позиционирование */
  right: 100%; top: -150%; /* Положение подсказки */
  z-index: 1; /* Отображаем подсказку поверх других элементов */
  background: rgba(255,255,230,0.9); /* Полупрозрачный цвет фона */
  font-family: Arial, sans-serif; /* Гарнитура шрифта */
  color: black;
  font-size: 11px; /* Размер текста подсказки */
  padding: 5px 10px; /* Поля */
  border: 1px solid #333; /* Параметры рамки */
}

.add-group input:checked ~ .pay_by_cashbox {
  transform: translate(-60px, 30px);
  transition-delay: 0.1s;
}

.add-group .pay_by_cashbox:hover::after {
  content: attr(data-title);
  position: absolute; /* Абсолютное позиционирование */
  right: 100%; top: -150%; /* Положение подсказки */
  z-index: 1; /* Отображаем подсказку поверх других элементов */
  background: rgba(255,255,230,0.9); /* Полупрозрачный цвет фона */
  font-family: Arial, sans-serif; /* Гарнитура шрифта */
  color: black;
  font-size: 11px; /* Размер текста подсказки */
  padding: 5px 10px; /* Поля */
  border: 1px solid #333; /* Параметры рамки */
}

.add-group input:checked ~ .internal_payment {
  transform: translate(0, 65px);
  transition-delay: 0.2s;
}

.add-group .internal_payment:hover::after {
  content: attr(data-title);
  position: absolute; /* Абсолютное позиционирование */
  right: 100%; top: -150%; /* Положение подсказки */
  z-index: 1; /* Отображаем подсказку поверх других элементов */
  background: rgba(255,255,230,0.9); /* Полупрозрачный цвет фона */
  font-family: Arial, sans-serif; /* Гарнитура шрифта */
  color: black;
  font-size: 11px; /* Размер текста подсказки */
  padding: 5px 10px; /* Поля */
  border: 1px solid #333; /* Параметры рамки */
}

.journal-of-payment-docs-buttons-edit-button {
  display: inline-block; /* Строчно-блочный элемент */
  position: relative; /* Относительное позиционирование */
}

.journal-of-payment-docs-buttons-edit-button:hover::after {
  content: attr(data-title);
  position: absolute; /* Абсолютное позиционирование */
  right: 100%; top: -160%; /* Положение подсказки */
  z-index: 1; /* Отображаем подсказку поверх других элементов */
  background: rgba(255,255,230,0.9); /* Полупрозрачный цвет фона */
  color: black;
  font-family: Arial, sans-serif; /* Гарнитура шрифта */
  font-size: 11px; /* Размер текста подсказки */
  padding: 5px 10px; /* Поля */
  border: 1px solid #333; /* Параметры рамки */
}

.journal-of-payment-docs-buttons-copy-button {
  display: inline-block; /* Строчно-блочный элемент */
  position: relative; /* Относительное позиционирование */
}

.journal-of-payment-docs-buttons-copy-button:hover::after {
  content: attr(data-title);
  position: absolute; /* Абсолютное позиционирование */
  right: 100%; top: -50%; /* Положение подсказки */
  z-index: 1; /* Отображаем подсказку поверх других элементов */
  background: rgba(255,255,230,0.9); /* Полупрозрачный цвет фона */
  color: black;
  font-family: Arial, sans-serif; /* Гарнитура шрифта */
  font-size: 11px; /* Размер текста подсказки */
  padding: 5px 10px; /* Поля */
  border: 1px solid #333; /* Параметры рамки */
}

.journal-of-payment-docs-buttons-delete-button {
  display: inline-block; /* Строчно-блочный элемент */
  position: relative; /* Относительное позиционирование */
}

.journal-of-payment-docs-buttons-delete-button:hover::after {
  content: attr(data-title);
  position: absolute; /* Абсолютное позиционирование */
  right: 100%; top: -50%; /* Положение подсказки */
  z-index: 1; /* Отображаем подсказку поверх других элементов */
  background: rgba(255,255,230,0.9); /* Полупрозрачный цвет фона */
  color: black;
  font-family: Arial, sans-serif; /* Гарнитура шрифта */
  font-size: 11px; /* Размер текста подсказки */
  padding: 5px 10px; /* Поля */
  border: 1px solid #333; /* Параметры рамки */
}

.journal-of-payment-docs-add-payment-docs {
  display: inline-block; /* Строчно-блочный элемент */
  position: relative; /* Относительное позиционирование */
}

.journal-of-payment-docs-add-payment-docs:hover::after {
  content: attr(data-title);
  position: absolute; /* Абсолютное позиционирование */
  right: 100%; top: -270%; /* Положение подсказки */
  z-index: 1; /* Отображаем подсказку поверх других элементов */
  background: rgba(255,255,230,0.9); /* Полупрозрачный цвет фона */
  color: black;
  font-family: Arial, sans-serif; /* Гарнитура шрифта */
  font-size: 11px; /* Размер текста подсказки */
  padding: 5px 10px; /* Поля */
  border: 1px solid #333; /* Параметры рамки */
}

.journal-of-payment-docs-delete-payment-docs {
  display: inline-block; /* Строчно-блочный элемент */
  position: relative; /* Относительное позиционирование */
}

.journal-of-payment-docs-delete-payment-docs:hover::after {
  content: attr(data-title);
  position: absolute; /* Абсолютное позиционирование */
  right: 100%; top: 100%; /* Положение подсказки */
  z-index: 1; /* Отображаем подсказку поверх других элементов */
  background: rgba(255,255,230,0.9); /* Полупрозрачный цвет фона */
  color: black;
  font-family: Arial, sans-serif; /* Гарнитура шрифта */
  font-size: 11px; /* Размер текста подсказки */
  padding: 5px 10px; /* Поля */
  border: 1px solid #333; /* Параметры рамки */
}

</style>
