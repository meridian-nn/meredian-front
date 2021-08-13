<template>
  <div class="incoming-payment-documents-main-div">
    <div class="incoming-payment-documents-row">
      <v-btn
        color="blue"
        class="my-3"
        fab
        dark
        x-small
        data-title="Создание нового входящего платежного документа"
        @click="newIncomingDocument"
      >
        <v-icon dark>
          mdi-plus
        </v-icon>
      </v-btn>

      <v-btn
        :color="statusForEditBtn ? 'blue' : 'grey'"
        class="my-3 mx-3"
        fab
        dark
        x-small
        @click="editIncomingPaymentDocument(selectedIncomingDocuments[0], statusForEditBtn)"
      >
        <v-icon>mdi-file-edit</v-icon>
      </v-btn>

      <v-btn
        :color="statusForDltBtn ? 'blue' : 'grey'"
        class="my-3"
        fab
        dark
        x-small
        @click="deleteIncomingDocuments(statusForDltBtn)"
      >
        <v-icon>mdi-delete-forever</v-icon>
      </v-btn>

      <div class="incoming-payment-documents-filters-btn">
        <v-btn
          v-if="isFiltersUsing"
          color="blue"
          dark
          class="ml-2"
          @click="openFilterFormForIncomingDocuments"
        >
          Фильтры
        </v-btn>
        <v-btn
          v-else
          class="ml-2"
          @click="openFilterFormForIncomingDocuments"
        >
          Фильтры
        </v-btn>
      </div>
    </div>
    <div class="incoming-payment-documents-row">
      <v-data-table
        id="incoming-payment-documents-data-table"
        v-model="selectedIncomingDocuments"
        height="690"
        :headers="incomingDocumentsHeaders"
        fixed-header
        :items="incomingDocuments"
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
              @contextmenu="showContextMenu($event, item)"
              @click="fillFooterParamsOfCurrentRow(item)"
            >
              <td>
                <v-checkbox
                  v-model="selectedIncomingDocuments"
                  class="mt-0 pt-0"
                  :value="item"
                  hide-details
                />
              </td>
              <td>
                {{ item.descr }}
              </td>
              <td>
                {{ item.dataVipis }}
              </td>
              <td>
                {{ item.numFind }}
              </td>
              <td>
                <vue-numeric
                  slot="endBalance"
                  v-model.number="item.sumFind"
                  :read-only="true"
                  separator="space"
                  :precision="2"
                  decimal-separator="."
                  output-type="number"
                />
              </td>
              <td
                class="incoming-document-table-text-inline"
              >
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      v-on="on"
                    >{{ item.platName }}</span>
                  </template>
                  <span>{{ item.platName }}</span>
                </v-tooltip>
              </td>
              <td>
                {{ item.poluchName }}
              </td>
              <td>
                {{ item.fio }}
              </td>
              <td>
                {{ item.numVipis }}
              </td>
              <td>
                {{ item.comment }}
              </td>
              <td>
                {{ item.budCodElem }}
              </td>
              <td>
                {{ item.budElem }}
              </td>
              <td>
                {{ item.budCfo }}
              </td>
            </tr>

            <infinite-loading
              :key="keyLoading"
              spinner="spiral"
              :identifier="infiniteIdOfRecordsData"
              @infinite="findIncomingPaymentDocuments"
            >
              <div slot="no-more" />
              <div slot="no-results" />
            </infinite-loading>
          </tbody>
        </template>
      </v-data-table>
      <v-menu
        v-model="rightClickMenu"
        :position-x="xRightClickMenu"
        :position-y="yRightClickMenu"
        absolute
        offset-y
      >
        <v-list>
          <v-list-item @click="profileOfContractorOpenForm">
            <v-list-item-title>
              Карточка контрагента
            </v-list-item-title>
          </v-list-item>
          <v-list>
            <v-list-item @click="editIncomingPaymentDocument(currentRowOfIncomingDocsForContextMenu, true)">
              <v-list-item-title>
                Редактировать документ
              </v-list-item-title>
            </v-list-item>
          </v-list>
          <v-list>
            <v-list-item @click="deleteIncomingDocuments(true, selectedIncomingDocuments.length > 1 ? null : currentRowOfIncomingDocsForContextMenu)">
              <v-list-item-title>
                Удалить {{ selectedIncomingDocuments.length > 1 ? 'документы' : 'документ' }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-list>
      </v-menu>
    </div>

    <div class="incoming-payment-documents-row">
      <v-subheader class="font-weight-medium text-subtitle-1">
        Итого:
      </v-subheader>

      <div class="incoming-payment-documents-sum-data-field">
        <vue-numeric
          v-model="sumOfDataTableItems"
          separator="space"
          :precision="2"
          decimal-separator="."
          output-type="number"
          :read-only="true"
        />
      </div>

      <v-subheader class="font-weight-medium text-subtitle-1">
        Соисполнитель:
      </v-subheader>

      <div class="incoming-payment-documents-co-executor-field">
        <v-text-field
          v-model.number="coExecutor"
          hide-details="auto"
          height="20"
          :readonly="true"
          outlined
          dense
        />
      </div>
    </div>

    <div class="incoming-payment-documents-bottom-row">
      <v-subheader class="font-weight-medium text-subtitle-1">
        Назначение:
      </v-subheader>

      <div class="incoming-payment-documents-purpose-field">
        <v-text-field
          v-model.number="purpose"
          hide-details="auto"
          :readonly="true"
          outlined
          dense
        />
      </div>
    </div>

    <user-notification ref="userNotification" />
    <profile-of-contractor ref="profileOfContractor" />

    <create-or-edit-incoming-payment-document
      ref="createOrEditIncomingPaymentDocument"
      @save="saveIncomingDocument"
      @cancel="closeIncomingDocument"
    />

    <filters-form-from-outgoing-and-incoming-document
      ref="filtersFormForIncomingDocuments"
      @cancel="closeFiltersFormForIncomingDocuments"
      @saveFilters="saveFiltersFormForIncomingDocuments"
    />
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import UserNotification from '@/components/information_window/UserNotification'
import ProfileOfContractor from '@/views/vcrm/Payment/ProfileOfContractor/ProfileOfContractorPage'
import FiltersFormFromOutgoingAndIncomingDocument
  from '@/components/filters/FiltersFormFromOutgoingAndIncomingDocument.vue'
import createOrEditIncomingPaymentDocument
  from '@/views/vcrm/Payment/IncomingPaymentDocuments/Modal/CreateOrEditIncomingPaymentDocument.vue'

export default {
  name: 'IncomingPaymentDocumentsPage',

  components: {
    InfiniteLoading,
    UserNotification,
    ProfileOfContractor,
    createOrEditIncomingPaymentDocument,
    FiltersFormFromOutgoingAndIncomingDocument
  },

  data() {
    return {
      loadingType: {},

      incomingDocumentsHeaders: [
        {
          text: 'Дескр',
          value: 'descr',
          width: '60px',
          sort: () => false
        },
        {
          text: 'Выписан',
          value: 'dataVipis',
          width: '60px',
          sort: () => false
        },
        {
          text: 'Номер',
          value: 'numFind',
          width: '60px',
          sort: () => false
        },
        {
          text: 'Сумма',
          value: 'sumFind',
          width: '60px',
          sort: () => false
        },
        {
          text: 'Плательщик',
          value: 'platName',
          width: '60px',
          sort: () => false
        },
        {
          text: 'Получатель',
          value: 'poluchName',
          width: '60px',
          sort: () => false
        },
        {
          text: 'Исполнитель',
          value: 'fio',
          width: '60px',
          sort: () => false
        },
        {
          text: '№ вып',
          value: 'numVipis',
          width: '60px',
          sort: () => false
        },
        {
          text: 'Комментарий',
          value: 'comment',
          width: '60px',
          sort: () => false
        },
        {
          text: 'Код элем.',
          value: 'budCodElem',
          width: '60px',
          sort: () => false
        },
        {
          text: 'Элемент',
          value: 'budElem',
          width: '60px',
          sort: () => false
        },
        {
          text: 'ЦФО',
          value: 'budCfo',
          width: '60px',
          sort: () => false
        }
      ],
      incomingDocuments: [],
      selectedIncomingDocuments: [],

      sumOfDataTableItems: 0,

      coExecutor: '',

      purpose: '',

      rightClickMenu: false,
      xRightClickMenu: 0,
      yRightClickMenu: 0,
      currentRowOfIncomingDocsForContextMenu: null,

      keyLoading: Math.random(),
      infiniteIdOfRecordsData: 0,
      pageOfRecords: 0,

      sortBy: [],
      sortDesc: [],

      isFiltersUsing: false
    }
  },

  computed: {
    handleSortData() {
      const { sortDesc } = this
      return this.sortBy.map((item, i) => {
        return {
          'direction': sortDesc[i] ? 'ASC' : 'DESC',
          'property': item
        }
      })
    },

    statusForEditBtn() {
      return this.selectedIncomingDocuments.length === 1
    },

    statusForDltBtn() {
      return this.selectedIncomingDocuments.length > 0
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    async init() {
      await this.initData()
    },

    // Функция открытия формы фильтров таблицы с документами
    openFilterFormForIncomingDocuments() {
      this.$refs.filtersFormForIncomingDocuments.openForm('Входящие платежные документы', this.getIdOfIncomingDocumentsTable())
    },

    // Функция отработки события "Закрытие формы фильтров таблицы с документами"
    closeFiltersFormForIncomingDocuments() {
    },

    // Функция отбработки события "Закрытие формы фильтров таблицы с документами с сохранением"
    saveFiltersFormForIncomingDocuments() {
      this.updateIncomingDocuments()
    },

    showContextMenu(event, item) {
      event.preventDefault()
      this.rightClickMenu = false
      this.currentRowOfIncomingDocsForContextMenu = null
      this.xRightClickMenu = event.clientX
      this.yRightClickMenu = event.clientY
      this.$nextTick(() => {
        this.rightClickMenu = true
        this.currentRowOfIncomingDocsForContextMenu = item
      })
    },

    profileOfContractorOpenForm() {
      this.$refs.profileOfContractor.openForm(this.currentRowOfIncomingDocsForContextMenu)
    },
    newIncomingDocument() {
      this.$refs.createOrEditIncomingPaymentDocument.newOrEditDocument()
    },
    async saveIncomingDocument() {
      await this.init()
      this.updateIncomingDocuments()
      this.$refs.userNotification.showUserNotification('success', 'Новый входящий документ добавлен')
    },

    closeIncomingDocument() {
      this.selectedIncomingDocuments = []
    },

    async initData() {
      const params = this.createStructureForInitIncomingPaymentDocument()
      await this.$api.service.executeStashedFunction(params).catch((error) => {
        alert(error)
      })
    },

    fillFooterParamsOfCurrentRow(item) {
      this.coExecutor = item.fioSoisp
      this.purpose = item.nazn
    },

    updateIncomingDocuments() {
      this.pageOfRecords = 0
      this.incomingDocuments = []
      this.selectedIncomingDocuments = []
      this.infiniteIdOfRecordsData += 1
    },

    updateSort(byDesc, event) {
      if (byDesc === 'by') {
        this.sortBy = event
      } else if (byDesc === 'desc') {
        this.sortDesc = event
      }
      this.pageOfRecords = 0
      this.incomingDocuments = []
      this.selectedIncomingDocuments = []
      this.keyLoading = Math.random()
    },

    async findIncomingPaymentDocuments($state) {
      const dataForFiltersQuery = this.createCriteriasToSearchForFiltersValues(this.$route.name,
        this.getIdOfIncomingDocumentsTable(), this.getCurrentUser.id)
      const response = await this.$api.uiSettings.findBySearchCriterias(dataForFiltersQuery)
      let filtersParams

      if (response.length) {
        filtersParams = JSON.parse(response[0].settingValue)
      }

      const searchCriterias = this.createCriteriasToSearchIncomingPaymentDocuments(filtersParams)
      const params = {
        searchCriterias,
        page: this.pageOfRecords,
        orders: this.handleSortData,
        size: 40
      }

      this.isFiltersUsing = searchCriterias.length > 1

      await this.fillResultsOfIncomingDocuments(searchCriterias)

      const { content } = await this.$api.payment.incomingPaymentDocuments.findPageBySearchCriteriaList(params)

      if (content.length > 0) {
        this.pageOfRecords += 1
        this.incomingDocuments.push(...content)

        $state.loaded()
      } else {
        $state.complete()
      }
    },

    async fillResultsOfIncomingDocuments(searchCriterias) {
      this.sumOfDataTableItems = 0
      const paramsForResults = this.createCriteriasToGetResultsOfIncomingPaymentDocuments(searchCriterias)
      const response = await this.$api.payment.incomingPaymentDocuments.findDocumentsWithGroupBy(paramsForResults)

      if (response.length > 0) {
        const results = response[0]
        if (results.sum_sumFind) {
          this.sumOfDataTableItems = results.sum_sumFind
        }
      }
    },

    editIncomingPaymentDocument(dataForEdit, btnStatus) {
      if (!btnStatus) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите один документ для редактирования')
        return
      }
      this.$refs.createOrEditIncomingPaymentDocument.newOrEditDocument(dataForEdit)
    },

    async deleteIncomingDocuments(statusBtn, dataFromContextMenu) {
      if (!statusBtn) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите документ(ы) на удаление')
        return
      }
      if (dataFromContextMenu) {
        this.selectedIncomingDocuments = []
        this.selectedIncomingDocuments.push(dataFromContextMenu)
      }

      if (confirm(`Вы действительно хотите удалить ${this.selectedIncomingDocuments.length > 1 ? 'выбранные документы' : 'выбранный документ'}?`)) {
        for (const doc of this.selectedIncomingDocuments) {
          if (this.checkClosedPeriod(doc.dataVipis)) {
            this.$refs.userNotification.showUserNotification('error', `Удаление документа №${doc.numFind} невозможно! Нельзя удалять в закрытом периоде!`)
            continue
          }
          const params = this.createStructureForPrepareDeleteIncomingOutgoingPaymentDocumentInitDataProcedure(doc)
          await this.$api.service.executeStashedFunction(params).catch((error) => {
            alert(error)
          })
          const paramsForDelete = this.createStructureForDeleteIncomingOutgoingPaymentDocumentInitDataProcedure({ find_id: doc.findId })
          await this.$api.service.executeStashedFunction(paramsForDelete).catch((error) => {
            alert(error)
          })
          if (doc.findId === this.selectedIncomingDocuments[this.selectedIncomingDocuments.length - 1].findId) {
            this.$refs.userNotification.showUserNotification('success', this.selectedIncomingDocuments.length > 1 ? 'Документы были удалены' : 'Документ был удален')
            await this.initData()
            this.selectedIncomingDocuments = []
            this.updateIncomingDocuments()
          }
        }
      } else {
        this.$refs.userNotification.showUserNotification('error', 'Удаление было отменено')
      }
    }
  }
}
</script>

<style lang="scss">
.incoming-payment-documents-main-div {
  padding: 10px
}

.incoming-payment-documents-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin-bottom: 10px;
  min-width: 100%;
}

.incoming-payment-documents-bottom-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  min-width: 100%;
}

.incoming-payment-documents-sum-data-field {
  width: 250px;
  margin-right: 20px;
  padding-top: 10px;
}

.incoming-payment-documents-co-executor-field {
  width: 250px;
}

#incoming-payment-documents-data-table {
  border-collapse: collapse;
  width: 100%;
  height: 690px;
}

#incoming-payment-documents-data-table table {
  width: 100%;
}

#incoming-payment-documents-data-table td, #incoming-payment-documents-data-table th {
  border: 1px solid #ddd;
  word-break: break-all !important;
  padding: 0 0 !important;
  height: 0 !important;
}

#incoming-payment-documents-data-table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

.incoming-payment-documents-purpose-field {
  width: 90%;
}

.incoming-payment-documents-filters-btn{
  padding-top: 10px;
}
.incoming-document-table-text-inline {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 1px;
}
</style>
