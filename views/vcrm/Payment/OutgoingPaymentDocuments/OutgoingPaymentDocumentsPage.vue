<template>
  <div class="outgoing-payment-documents-main-div">
    <v-row>
      <v-col
        cols="2"
        class="mt-5"
      >
        <v-btn
          color="blue"
          fab
          dark
          x-small
          data-title="Создание нового исходящего документа"
          @click="newOutgoingDocument"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>

        <v-btn
          :color="statusForEditBtn ? 'blue' : 'grey'"
          class="mx-3"
          fab
          dark
          x-small
          @click="editOutgoingPaymentDocument(outgoingDocsRows[0], statusForEditBtn)"
        >
          <v-icon>mdi-file-edit</v-icon>
        </v-btn>

        <v-btn
          :color="statusForDltBtn ? 'blue' : 'grey'"
          fab
          dark
          x-small
          @click="deleteOutgoingDocuments(statusForDltBtn)"
        >
          <v-icon>mdi-delete-forever</v-icon>
        </v-btn>

        <v-btn
          v-if="isFiltersUsing"
          color="blue"
          dark
          class="ml-3"
          @click="openFilterFormOutgoingDocument"
        >
          Фильтры
        </v-btn>
        <v-btn
          v-else
          class="ml-3"
          @click="openFilterFormOutgoingDocument"
        >
          Фильтры
        </v-btn>
      </v-col>

      <v-spacer />
      <v-col cols="4">
        <div class="outgoing-payment-main">
          <button
            class="budget-btn"
            @click="generateBudget"
          >
            Сформировать бюджет
          </button>
        </div>
      </v-col>
    </v-row>

    <div class="outgoing-payment-documents-row">
      <v-data-table
        id="outgoing-payment-documents-table"
        v-model="outgoingDocsRows"
        height="640"
        :headers="headers"
        fixed-header
        loading-text="Документы загружаются, подождите"
        :items="outgoingDocuments"
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
              @click="fillAssignmentAndCollaboratorOfCurrentRow(item)"
            >
              <td>
                <v-checkbox
                  v-model="outgoingDocsRows"
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
                  v-model="item.sumFind"
                  separator="space"
                  :precision="2"
                  decimal-separator="."
                  output-type="number"
                  :read-only="true"
                />
              </td>
              <td>
                {{ item.platName }}
              </td>
              <td
                class="outgoing-document-table-poluchName"
                :title="item.poluchName"
              >
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
                {{ item.budElemName }}
              </td>
              <td>
                {{ item.budCfo }}
              </td>
            </tr>

            <infinite-loading
              :key="keyLoading"
              spinner="spiral"
              :identifier="infiniteIdOfRecordsData"
              @infinite="findOutgoingPaymentDocuments"
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

          <v-list-item @click="editOutgoingPaymentDocument(currentRowOfOutgoingDocsForContextMenu, true)">
            <v-list-item-title>
              Редактировать документ
            </v-list-item-title>
          </v-list-item>

          <v-list-item @click="deleteOutgoingDocuments(true, outgoingDocsRows.length > 1 ? null : currentRowOfOutgoingDocsForContextMenu)">
            <v-list-item-title>
              Удалить {{ outgoingDocsRows.length > 1 ? 'документы' : 'документ' }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <div class="outgoing-payment-documents-row mt-3">
      <p class="pt-2">
        Итого
      </p>
      <div class="outgoing-payment-documents-summ-results" />

      <p class="pt-2">
        <vue-numeric
          v-model="totalToSum"
          separator="space"
          :precision="2"
          decimal-separator="."
          output-type="number"
          :read-only="true"
        />
      </p>

      <div class="outgoing-payment-documents-summ-results" />

      <p class="mr-3 pt-2">
        Соисполнитель:
      </p>
      <div style="min-width: 500px;">
        <v-text-field
          v-model="collaborator"
          class="pt-0"
          readonly
        />
      </div>
    </div>

    <div class="outgoing-payment-documents-row mt-5">
      <p class="mr-3 pt-2">
        Назначение:
      </p>
      <v-text-field
        v-model="appointment"
        class="pt-0"
        readonly
      />
    </div>
    <filters-form-from-outgoing-and-incoming-document
      ref="filtersFormFromOutgoingDocument"
      @saveFilters="saveFiltersFormOutgoingDocument"
    />
    <user-notification ref="userNotification" />
    <profile-of-contractor ref="profileOfContractor" />
    <create-or-edit-outgoing-payment-document
      ref="createOrEditOutgoingPaymentDocument"
      @save="saveOutgoingDocument"
    />
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import UserNotification from '@/components/information_window/UserNotification'
import ProfileOfContractor from '@/views/vcrm/Payment/ProfileOfContractor/ProfileOfContractorPage'
import CreateOrEditOutgoingPaymentDocument from '@/views/vcrm/Payment/OutgoingPaymentDocuments/Modal/CreateOrEditOutgoingPaymentDocumentsPage.vue'
import FiltersFormFromOutgoingAndIncomingDocument from '@/components/filters/FiltersFormFromOutgoingAndIncomingDocument.vue'

export default {
  name: 'OutgoingPaymentDocuments',
  components: {
    UserNotification,
    CreateOrEditOutgoingPaymentDocument,
    InfiniteLoading,
    FiltersFormFromOutgoingAndIncomingDocument,
    ProfileOfContractor
  },
  data() {
    return {
      outgoingDocuments: [],
      outgoingDocsRows: [],
      headers: [
        {
          text: 'Дескр',
          value: 'descr',
          width: '4%',
          sort: () => false

        },
        {
          text: 'Выписан',
          value: 'dataVipis',
          width: '6%',
          sort: () => false
        },
        {
          text: 'Номер',
          value: 'numFind',
          width: '10%',
          sort: () => false
        },
        {
          text: 'Сумма ',
          value: 'sumFind',
          width: '10%',
          sort: () => false
        },
        {
          text: 'Плательщик',
          value: 'platName',
          width: '7%',
          sort: () => false
        },
        {
          text: 'Получатель',
          value: 'poluchName',
          width: '210px',
          cellClass: 'outgoing-document-table-poluchName',
          sort: () => false
        },
        {
          text: 'Испольнитель',
          value: 'fio',
          width: '7%',
          sort: () => false
        },
        {
          text: '№ вып.',
          value: 'numVipis',
          width: '5%',
          sort: () => false
        },
        {
          text: 'Комментарий',
          value: 'comment',
          width: '11%',
          sort: () => false
        },
        {
          text: 'Код элемента',
          value: 'budCodElem',
          width: '7%',
          sort: () => false
        },
        {
          text: 'Элемент',
          value: 'budElemName',
          width: '10%',
          sort: () => false
        },
        {
          text: 'ЦФО',
          value: 'budCfo',
          width: '8%',
          sort: () => false
        }
      ],
      totalToSum: 0,
      collaborator: null,
      appointment: null,
      rightClickMenu: false,
      xRightClickMenu: 0,
      yRightClickMenu: 0,
      currentRowOfOutgoingDocsForContextMenu: null,
      sortBy: [],
      sortDesc: [],
      keyLoading: Math.random(),
      infiniteIdOfRecordsData: 0,
      pageOfRecords: 0,
      isFiltersUsing: false
    }
  },
  computed: {
    statusForDltBtn() {
      return this.outgoingDocsRows.length > 0
    },
    statusForEditBtn() {
      return this.outgoingDocsRows.length === 1
    },
    handleSortData() {
      const { sortDesc } = this
      return this.sortBy.map((item, i) => {
        return {
          'direction': sortDesc[i] ? 'ASC' : 'DESC',
          'property': item
        }
      })
    }
  },
  watch: {},
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.initData()
    },
    async generateBudget() {
      if (this.outgoingDocsRows.length === 0) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите документы для формирования записей в бюджет')
        return
      }
      this.$refs.userNotification.showUserNotification('warn', 'Формирование записей в бюджет')
      for (const doc of this.outgoingDocsRows) {
        const params = this.createStructureForGenerateBudgetInOutgoingPaymentDocumentInitDataProcedure(doc)
        await this.$api.service.executeStashedFunction(params).catch((error) => {
          alert(error)
        })
      }
      const paramsForLoadData = this.createStructureForLoadDataAfterGenerateBudgetInOutgoingPaymentDocumentInitDataProcedure()
      const dataForReport = await this.$api.service.executeStashedFunction(paramsForLoadData).catch((error) => {
        alert(error)
      })
      console.log('ВОТ ЧЁ ', dataForReport)
      this.$refs.userNotification.showUserNotification('success', 'Бюджет сформирован')
    },
    newOutgoingDocument() {
      this.fillAssignmentAndCollaboratorOfCurrentRow()
      this.$refs.createOrEditOutgoingPaymentDocument.newOrEditDocument()
    },
    async saveOutgoingDocument() {
      this.$refs.userNotification.showUserNotification('success', 'Новый исходящий платежный документ добавлен')
      this.currentRowOfOutgoingDocsForContextMenu = null
      await this.init()
      this.updateOutgoingDocs()
    },

    // Инициализация данных формы
    async initData() {
      const params = this.createStructureForOutgoingPaymentDocumentsInitDataProcedure()
      await this.$api.service.executeStashedFunction(params).catch((error) => {
        alert(error)
      })
    },

    updateSort(byDesc, event) {
      if (byDesc === 'by') {
        this.sortBy = event
      } else if (byDesc === 'desc') {
        this.sortDesc = event
      }
      this.pageOfRecords = 0
      this.outgoingDocuments = []
      this.outgoingDocsRows = []
      this.keyLoading = Math.random()
    },

    async findOutgoingPaymentDocuments($state) {
      const dataForFiltersQuery = this.createCriteriasToSearchForFiltersValues(this.$route.name,
        this.getIdOfOutgoingDocumentsTable(), this.getCurrentUser.id)
      const response = await this.$api.uiSettings.findBySearchCriterias(dataForFiltersQuery)
      let filtersParams

      if (response.length) {
        filtersParams = JSON.parse(response[0].settingValue)
      }

      const searchCriterias = this.createCriteriasForFindOutgoingPaymentDocuments(filtersParams)
      const params = {
        searchCriterias,
        page: this.pageOfRecords,
        orders: this.handleSortData
      }

      this.isFiltersUsing = searchCriterias.length > 1

      await this.fillResultsOfOutgoingDocuments(searchCriterias)

      const { content } = await this.$api.payment.outgoingPayment.findPageBySearchCriterias(params)
      if (content.length > 0) {
        this.pageOfRecords += 1
        this.outgoingDocuments.push(...content)

        $state.loaded()
      } else {
        $state.complete()
      }
    },
    // Функция открытия формы фильтров таблицы "Документы на оплату"
    openFilterFormOutgoingDocument() {
      this.fillAssignmentAndCollaboratorOfCurrentRow()
      this.$refs.filtersFormFromOutgoingDocument.openForm('Исходящие платежные документы', this.getIdOfOutgoingDocumentsTable())
    },
    // Функция отбработки события "Закрытие формы фильтров таблицы "Документов на оплату" с сохранением"
    saveFiltersFormOutgoingDocument() {
      this.updateOutgoingDocs()
    },
    // Обновление таблицы "Документы к оплате
    updateOutgoingDocs() {
      this.pageOfRecords = 0
      this.outgoingDocuments = []
      this.outgoingDocsRows = []
      this.infiniteIdOfRecordsData += 1
    },
    async fillResultsOfOutgoingDocuments(searchCriterias) {
      this.totalToSum = 0
      const dataForResults = this.createCriteriasToGetResultsOfContentForOutgoingPayment(searchCriterias)
      const response = await this.$api.payment.outgoingPayment.findDocumentsWithGroupBy(dataForResults)

      if (response.length > 0) {
        const results = response[0]
        if (results.sum_sumFind) {
          this.totalToSum = this.numberToSum(results.sum_sumFind)
        }
      }
    },
    // Заполнение поля "Назначение" и "Соисполнитель" под таблицей исходящих платежных документов
    fillAssignmentAndCollaboratorOfCurrentRow(item) {
      if (!item) {
        this.collaborator = null
        this.appointment = null
      } else {
        this.collaborator = item.fioSoisp
        this.appointment = item.nazn
      }
    },
    showContextMenu(event, item) {
      event.preventDefault()
      this.rightClickMenu = false
      this.currentRowOfOutgoingDocsForContextMenu = null
      this.xRightClickMenu = event.clientX
      this.yRightClickMenu = event.clientY
      this.$nextTick(() => {
        this.rightClickMenu = true
        this.currentRowOfOutgoingDocsForContextMenu = item
      })
    },
    profileOfContractorOpenForm() {
      this.$refs.profileOfContractor.openForm(this.currentRowOfOutgoingDocsForContextMenu)
    },
    editOutgoingPaymentDocument(dataForEdit, btnStatus) {
      if (!btnStatus) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите один документ для редактирования')
        return
      }
      this.fillAssignmentAndCollaboratorOfCurrentRow()
      this.$refs.createOrEditOutgoingPaymentDocument.newOrEditDocument(dataForEdit)
    },
    async deleteOutgoingDocuments(statusBtn, dataFromContextMenu) {
      if (!statusBtn) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите документ(ы) на удаление')
        return
      }
      if (dataFromContextMenu) {
        this.outgoingDocsRows = []
        this.outgoingDocsRows.push(dataFromContextMenu)
      }
      if (confirm(`Вы действительно хотите удалить ${this.outgoingDocsRows.length > 1 ? 'выбранные документы' : 'выбранный документ'}?`)) {
        for (const doc of this.outgoingDocsRows) {
          if (this.checkClosedPeriodAll(doc.dataVipis)) {
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
          if (doc.findId === this.outgoingDocsRows[this.outgoingDocsRows.length - 1].findId) {
            this.$refs.userNotification.showUserNotification('success', this.outgoingDocsRows.length > 1 ? 'Документы были удалены' : 'Документ был удален')
            await this.initData()
            this.outgoingDocsRows = []
            this.updateOutgoingDocs()
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
.outgoing-payment-documents-main-div {
  padding: 10px;
}

.outgoing-payment-main {
  display: flex;
  justify-content: flex-end;
}

.budget-btn {
  width: max-content;
  height: auto;
  font-size: 1rem;
  background: #639db1;
  border: none;
  margin: 20px;
  outline: 2px solid #639db1;
  outline-offset: 4px;
  border: 2px solid #639db1;
  cursor: pointer;
  color: white;
  transition: all 250ms;
  padding: 4px;
}

.budget-btn:hover {
  outline-offset: -4px;
  color: rgb(34, 34, 34);
  background: none;
}

.outgoing-payment-documents-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
}

#outgoing-payment-documents-table {
  border-collapse: collapse;
  width: 100%;
  height: 640px;
}

#outgoing-payment-documents-table table {
  width: 100%;
}

#outgoing-payment-documents-table td, #outgoing-payment-documents-table th {
  border: 1px solid #ddd;
  word-break: break-all !important;
  padding: 0 !important;
  height: 0 !important;
}

#outgoing-payment-documents-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

#outgoing-payment-documents-table tr:hover {
  background-color: #ddd;
}

#outgoing-payment-documents-table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

.outgoing-payment-documents-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
}

.outgoing-payment-documents-summ-results {
  flex: 0 0 20.6%;
  max-width: 20.6%;
}

.outgoing-payment-documents-row p {
  font-weight: bold;
}

.outgoing-document-table-poluchName {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 1px;
}
</style>
