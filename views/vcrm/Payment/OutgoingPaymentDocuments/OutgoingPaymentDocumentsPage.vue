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
          v-if="isFiltersForFromPayDocsUsing"
          color="blue"
          dark
          class="ml-2"
          @click="openFilterFormOutgoingDocument"
        >
          Фильтры
        </v-btn>
        <v-btn
          v-else
          class="ml-2"
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
        height="640"
        :headers="headers"
        fixed-header
        loading-text="Документы загружаются, подождите"
        :items="outgoingDocuments"
        :show-select="false"
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
    </div>

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
      </v-list>
    </v-menu>

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
      @cancel="closeFiltersFormOutgoingDocument"
      @saveFilters="saveFiltersFormOutgoingDocument"
    />
    <user-notification ref="userNotification" />
    <profile-of-contractor ref="profileOfContractor" />
    <create-outgoing-payment-document
      ref="createOutgoingPaymentDocument"
      @save="saveOutgoingDocument"
    />
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import UserNotification from '@/components/information_window/UserNotification'
import ProfileOfContractor from '@/views/vcrm/Payment/ProfileOfContractor/ProfileOfContractorPage'
import createOutgoingPaymentDocument
  from '@/views/vcrm/Payment/OutgoingPaymentDocuments/Modal/CreateOutgoingPaymentDocumentsPage.vue'
import FiltersFormFromOutgoingAndIncomingDocument from '@/components/filters/FiltersFormFromOutgoingAndIncomingDocument.vue'
// import LoadingDialog from '~/components/loading_dialog/LoadingDialog'

export default {
  name: 'OutgoingPaymentDocuments',
  components: {
    UserNotification,
    ProfileOfContractor,
    createOutgoingPaymentDocument,
    InfiniteLoading,
    FiltersFormFromOutgoingAndIncomingDocument
    // LoadingDialog
  },
  data() {
    return {
      outgoingDocuments: [],
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
          width: '13%',
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
          width: '12%',
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
      currentRowOfTableForContextMenu: null,
      sortBy: [],
      sortDesc: [],
      keyLoading: Math.random(),
      infiniteIdOfRecordsData: 0,
      pageOfRecords: 0,
      isFiltersForFromPayDocsUsing: false
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
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.initData()
      // await this.updateRecordsData()
      // await this.findOutgoingPaymentDocuments()
    },
    generateBudget() {
      this.$refs.userNotification.showUserNotification('success', 'Бюджет сформирован')
    },

    showContextMenu(event, item) {
      event.preventDefault()
      this.rightClickMenu = false
      this.currentRowOfTableForContextMenu = null
      this.xRightClickMenu = event.clientX
      this.yRightClickMenu = event.clientY
      this.$nextTick(() => {
        this.rightClickMenu = true
        this.currentRowOfTableForContextMenu = item.test
      })
    },

    profileOfContractorOpenForm() {
      this.$refs.profileOfContractor.openForm(this.currentRowOfTableForContextMenu)
    },

    newOutgoingDocument() {
      this.$refs.createOutgoingPaymentDocument.newDocument()
    },

    saveOutgoingDocument() {
      this.$refs.userNotification.showUserNotification('success', 'Новый исходящий платежный документ добавлен')
    },

    // updateRecordsData() {
    //   this.pageOfRecords = 0
    //   this.outgoingDocuments = []
    //   this.infiniteIdOfRecordsData += 1
    // },

    // Инициализация данных формы
    async initData(customParams) {
      let params = {}
      if (customParams) {
        params = this.createStructureForOutgoingPaymentDocumentsInitDataProcedure(customParams)
      } else {
        params = this.createStructureForOutgoingPaymentDocumentsInitDataProcedure()
      }
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
      this.keyLoading = Math.random()
    },

    async findOutgoingPaymentDocuments($state) {
      const dataForFiltersQuery = this.createCriteriasToSearchForFiltersValues(this.$route.name,
        this.getIdOfFromOutgoingDocumentsTable(), this.getCurrentUser.id)
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

      this.isFiltersForFromPayDocsUsing = searchCriterias.length > 1

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
      this.$refs.filtersFormFromOutgoingDocument.openForm()
    },
    // Функция отработки события "Закрытие формы фильтров таблицы "Документов на оплату""
    closeFiltersFormOutgoingDocument() {
      console.log('close filters for from pay docs')
    },
    // Функция отбработки события "Закрытие формы фильтров таблицы "Документов на оплату" с сохранением"
    saveFiltersFormOutgoingDocument() {
      this.updateOutgoingDocs()
      console.log('save filters for from pay docs')
    },
    // Обновление таблицы "Документы к оплате
    updateOutgoingDocs() {
      this.pageOfRecords = 0
      this.outgoingDocuments = []
      this.infiniteIdOfRecordsData += 1
    },
    async fillResultsOfOutgoingDocuments(searchCriterias) {
      const dataForResults = this.createCriteriasToGetResultsOfContentForOutgoingPayment(searchCriterias)
      const response = await this.$api.payment.outgoingPayment.findDocumentsWithGroupBy(dataForResults)

      if (response.length > 0) {
        const results = response[0]
        this.totalToSum = this.numberToSum(results.sum_sumFind)
      } else {
        this.totalToSum = 0
      }
    },
    // Заполнение поля "Примечание" под таблице документов на оплату примечанием выбранного документа
    fillAssignmentAndCollaboratorOfCurrentRow(item) {
      this.collaborator = item.fioSoisp
      this.appointment = item.nazn
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

.outgoing-payment-documents-summ-results {
  flex: 0 0 18%;
  max-width: 18%;
}

.outgoing-payment-documents-row p {
  font-weight: bold;
}
</style>
