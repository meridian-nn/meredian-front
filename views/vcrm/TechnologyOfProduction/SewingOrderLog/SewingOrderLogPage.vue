<template>
  <div class="sewing-order-log-page">
    <div class="sewing-order-log-page-row">
      <div class="sewing-order-log-page-btn mr-4">
        <v-btn
          fab
          small
          color="blue"
        >
          <v-icon
            color="white"
            @click="openEditModal"
          >
            mdi-pencil
          </v-icon>
        </v-btn>

        <v-btn
          fab
          small
          color="red"
          disabled
        >
          <v-icon
            color="white"
            @click="deleteRecord"
          >
            mdi-delete
          </v-icon>
        </v-btn>

        <v-btn
          fab
          small
          color="red"
          @click="openPrintModal"
        >
          <v-icon color="white">
            mdi-printer
          </v-icon>
        </v-btn>

        <v-btn
          fab
          small
          color="blue"
          @click="openFilterModal"
        >
          <v-icon color="white">
            mdi-filter
          </v-icon>
        </v-btn>
      </div>

      <div class="sewing-order-log-page-checkbox mr-4">
        <v-checkbox
          v-model="govContract"
          disabled
          class="mr-2"
          label="ГОСКОНТРАКТ"
        />

        <v-checkbox
          v-model="noOTK"
          label="Нет проверки ОТК"
        />
      </div>

      <div class="sewing-order-log-page-btn">
        <v-btn small>
          Формирование уведомления о приемке для склада
        </v-btn>
      </div>
    </div>

    <div class="sewing-order-log-page-row">
      <div class="sewing-order-log-page__table">
        <v-data-table
          id="sewing-order-log-page-records-table"
          v-model="sewingOrderTableSelectedRecords"
          height="650"
          fixed-header
          :loading="loadingType.sewingOrderTableRecords"
          loading-text="Заказы загружаются, подождите"
          show-select
          :single-select="false"
          disable-pagination
          hide-default-footer
          :headers="sewingOrderTableHeaders"
          :items="sewingOrderTableRecords"
          calculate-widths
          @contextmenu:row="rightClickHandler"
          @update:sort-by="updateSort('by', $event)"
          @update:sort-desc="updateSort('desc', $event)"
        >
          <template slot="body.append">
            <infinite-loading
              :key="keyLoading"
              spinner="spiral"
              :identifier="infiniteIdData"
              @infinite="findSewingOrderTableRecords"
            />
          </template>
        </v-data-table>

        <v-menu
          v-model="contextMenu"
          :position-x="xContextMenu"
          :position-y="yContextMenu"
          absolute
          offset-y
        >
          <v-list>
            <v-list-item>
              <v-list-item-title>
                Сформировать заказ на доп.работу
              </v-list-item-title>
            </v-list-item>
            <!--v-list-item @click="deleteRecord">
              <v-list-item-title>
                Удалить
              </v-list-item-title>
            </v-list-item-->
          </v-list>
        </v-menu>
      </div>
    </div>

    <div class="sewing-order-log-page-row">
      <v-subheader class="font-weight-medium text-subtitle-1">
        Заказчик:
      </v-subheader>

      <div class="sewing-order-log-page-customer-field">
        <v-text-field
          v-model.number="customerName"
          hide-details="auto"
          :readonly="true"
          outlined
        />
      </div>
    </div>

    <div class="sewing-order-log-page-row">
      <div class="sewing-order-log-page-secondary-work-rectangle" />
      <v-subheader
        class="font-weight-medium text-subtitle-1"
      >
        Заказ на дополнительную работу
      </v-subheader>

      <div class="sewing-order-log-page-order-complete-rectangle" />
      <v-subheader
        class="font-weight-medium text-subtitle-1"
      >
        Заказ выполнен
      </v-subheader>

      <div
        class="sewing-order-log-page-defect-checked-label"
      >
        Бордовым цветом подсвечены позиции, где есть проверки базы по браку
      </div>

      <div
        class="sewing-order-log-page-defect-checked-and-have-comments-label"
      >
        Красным цветом подсвечены позиции, где есть замечания базы по браку
      </div>
    </div>

    <modal-edit-tailoring
      :value="modals.edit"
      @close="closeModalEditTailoring"
      @save="saveModalEditTailoring"
    />

    <modal-edit-work
      :value="modals.editAdd"
      @close="closeModalEditWork"
      @save="saveModalEditWork"
    />

    <modal-confirm
      :value="modals.confirm"
      @close="closeConfirmModal"
      @success="deleteRecord"
    />

    <modal-print
      :value="modals.print"
      @close="closePrintModal"
    />

    <modal-filter
      :value="modals.filter"
      @close="closeFilterModal"
    />

    <user-notification ref="userNotification" />
    <message ref="message" />
  </div>
</template>

<script>
import UserNotification from '@/components/information_window/UserNotification'
import Message from '@/components/message/Message'
import InfiniteLoading from 'vue-infinite-loading'
import ModalEditOrderForTailoring from './modals/EditOrderForTailoring'
import ModalEditOrderForAdditionalWork from './modals/EditOrderForAdditionalWork'
import ModalConfirm from './modals/Confirm'
import ModalPrint from './modals/Print'
import ModalFilter from './modals/Filter'

export default {
  name: 'SewingOrderLogPage',

  components: {
    ModalEditTailoring: ModalEditOrderForTailoring,
    ModalEditWork: ModalEditOrderForAdditionalWork,
    Message,
    ModalConfirm,
    ModalPrint,
    ModalFilter,
    UserNotification,
    InfiniteLoading
  },

  data() {
    return {
      loadingType: {},
      sortBy: [],
      sortDesc: [],
      infiniteIdData: 0,
      keyLoading: Math.random(),
      page: 0,
      contextMenu: false,
      xContextMenu: 0,
      yContextMenu: 0,
      currentRowOfTableForContextMenu: null,
      modals: {
        edit: false,
        editAdd: false,
        confirm: false,
        print: false,
        filter: false
      },
      sewingOrderTableSelectedRecords: [],
      sewingOrderTableHeaders: [
        {
          text: 'План',
          value: 'numPlanpsv',
          width: '35px',
          sortable: false
        },
        {
          text: 'Заказ',
          value: 'numZkzpsv',
          width: '40px',
          sortable: false
        },
        {
          text: 'Дата',
          value: 'dataZkzpsv',
          width: '93px',
          sort: () => false
        },
        {
          text: 'Производство',
          value: 'nameProizv',
          width: '100px',
          sortable: false
        },
        {
          text: 'Код',
          value: 'mcId',
          width: '60px',
          sortable: false
        },
        {
          text: 'Наименование МЦ',
          value: 'nameMc',
          width: '220px',
          sortable: false
        },
        {
          text: 'Ед.',
          value: 'nameProizv',
          width: '50px',
          sortable: false
        },
        {
          text: 'Кол-во',
          value: 'colvo',
          width: '60px',
          sort: () => false
        },
        {
          text: 'План',
          value: 'planDataManager',
          width: '125px',
          sortable: false
        },
        {
          text: 'Факт',
          value: 'dataZkzpsv',
          width: '95px',
          sort: () => false
        },
        {
          text: 'Раскрой',
          value: 'nameRaskroy',
          width: '100px',
          sort: () => false
        },
        {
          text: 'Заявка',
          value: 'numZaivk',
          width: '100px',
          sort: () => false
        },
        {
          text: 'СводЗк',
          value: 'numSvod',
          width: '80px',
          sort: () => false
        },
        {
          text: 'Факт',
          value: 'dataRaskroyFact',
          width: '95px',
          sort: () => false
        },
        {
          text: 'Исполнитель',
          value: 'numZaivk',
          width: '100px',
          sort: () => false
        },
        {
          text: 'Отв.исп',
          value: 'otvIsp',
          width: '100px',
          sort: () => false
        },
        {
          text: 'Заявка',
          value: 'numZaivk',
          width: '100px',
          sort: () => false
        },
        {
          text: 'ГОСТ/ТУ',
          value: 'gostTu',
          width: '100px',
          sort: () => false
        },
        {
          text: 'Код ЗП',
          value: 'codGra',
          width: '100px',
          sort: () => false
        },
        {
          text: 'Фабрика',
          value: 'planData',
          width: '125px',
          sort: () => false
        },
        {
          text: 'КК',
          value: 'numZaivk',
          width: '40px',
          sort: () => false
        },
        {
          text: 'ТО',
          value: 'gotovTo',
          width: '40px',
          sort: () => false
        },
        {
          text: 'МЛ',
          value: 'gotovMl',
          width: '40px'
        },
        {
          text: 'ТП',
          value: 'gotovTp',
          width: '40px'
        },
        {
          text: 'ОТК',
          value: 'gotovOtk',
          width: '50px'
        },
        {
          text: 'Печать',
          value: 'print',
          width: '70px'
        },
        {
          text: 'Крой',
          value: 'kroy',
          width: '60px'
        },
        {
          text: 'Наименвоание кроя',
          value: 'nameKroy',
          width: '140px'
        },
        {
          text: 'Госконтракт',
          value: 'govcontract',
          width: '95px'
        },
        {
          text: 'Договор',
          value: 'contract',
          width: '70px'
        }
      ],
      sewingOrderTableRecords: [],
      govContract: false,

      noOTK: false,

      customerName: ''
    }
  },

  async fetch() {
    await this.init()
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

    getCurrentUser() {
      return this.$store.state.profile.user
    }
  },

  methods: {
    async init() {
      await this.initDataForCurrentUser()
    },

    async initDataForCurrentUser() {
      const params = this.createStructureForSewingOrderLogPageInitDataProcedure()
      await this.$api.service.executeStashedFunction(params)
    },

    rightClickHandler(event, item) {
      event.preventDefault()

      this.contextMenu = false
      this.currentRowOfTableForContextMenu = null
      this.xContextMenu = event.clientX
      this.yContextMenu = event.clientY
      this.$nextTick(() => {
        this.contextMenu = true
        this.currentRowOfTableForContextMenu = item.item
      })
    },

    async closeModalEditTailoring() {
      this.modals.edit = false
      await this.fullUpdateTableOfRecordsWithInitData()
    },

    async closeModalEditWork() {
      this.modals.editAdd = false
      await this.fullUpdateTableOfRecordsWithInitData()
    },

    async fullUpdateTableOfRecordsWithInitData() {
      this.loadingType.sewingOrderTableRecords = true
      this.sewingOrderTableRecords = []
      this.sewingOrderTableSelectedRecords = []
      await this.initDataForCurrentUser()
      await this.updateSewingOrderTableRecords()
      this.loadingType.sewingOrderTableRecords = false
    },

    openEditModal() {
      if (!this.sewingOrderTableSelectedRecords ||
        !this.sewingOrderTableSelectedRecords.length) {
        this.$refs.userNotification.showUserNotification('warning', 'Выберите запись для редактирования!')
        return
      }

      const editingRecord = this.sewingOrderTableSelectedRecords[0]

      if (editingRecord.dopWork === 0) {
        this.modals.edit = true
      } else {
        this.modals.editAdd = true
      }
    },

    closeConfirmModal() {
      this.modals.confirm = false
    },

    openConfirmModal() {
      this.modals.confirm = true
    },

    closePrintModal() {
      this.modals.print = false
    },

    openPrintModal() {
      this.modals.print = true
    },

    closeFilterModal() {
      this.modals.filter = false
    },

    openFilterModal() {
      this.modals.filter = true
    },

    async saveModalEditTailoring(params = this.sewingOrderTableSelectedRecords) {
      try {
        await this.$api.manufacturing.manufacturingRequestJournalSave(params)

        await this.closeModalEditTailoring()
      } catch (e) {
        this.$refs.userNotification.showUserNotification('warning', 'Ошибка сервера, попробуйте позже')
      }
    },

    saveModalEditWork() {
      console.log('edit add save')
    },

    updateSort(byDesc, event) {
      if (byDesc === 'by') {
        this.sortBy = event
      } else if (byDesc === 'desc') {
        this.sortDesc = event
      }
      this.page = 0
      this.sewingOrderTableRecords = []
      this.keyLoading = Math.random()
    },

    /* typeOrder(item) {
      return item.gosKontrakt ? 'red' : 'blue'
    }, */

    // Обновление таблицы "Заказы на пошив"
    updateSewingOrderTableRecords() {
      this.page = 0
      this.sewingOrderTableRecords = []
      this.infiniteIdData += 1
    },

    async findSewingOrderTableRecords($state) {
      /* const dataForFiltersQuery = this.createCriteriasToSearchForFiltersValues(this.$route.name,
        'filter-sewing-order-log', this.getCurrentUser.id)

      const response = await this.$api.uiSettings.findBySearchCriterias(dataForFiltersQuery)

      let filtersParams

      if (response.length) {
        filtersParams = JSON.parse(response[0].settingValue)
      } */

      const searchCriterias = this.createCriteriasToSearchSewingOrderLogDataByPage()
      const data = {
        searchCriterias,
        page: this.pageOfFromPayData,
        orders: this.handleSortData
      }

      const { content } = await this.$api.manufacturing.manufacturingRequestJournalFindPageBySearchCriteriaList(data)

      if (content.length > 0) {
        this.page += 1

        this.sewingOrderTableRecords.push(...content)

        $state.loaded()
      } else {
        $state.complete()
      }
    },

    async deleteRecord() {
      if ((!this.sewingOrderTableSelectedRecords ||
          !this.sewingOrderTableSelectedRecords.length) &&
        !this.currentRowOfTableForContextMenu) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите заказ для удаления!')
        return
      }

      let currentOrder

      if (this.currentRowOfTableForContextMenu) {
        currentOrder = this.currentRowOfTableForContextMenu
      } else {
        currentOrder = this.sewingOrderTableSelectedRecords[0]
      }

      if (currentOrder.numSvod > 0) {
        this.$refs.userNotification.showUserNotification('warning', 'Заказ входит в сводный заказ! Переформируйте сводный заказ!')
        return
      }

      const params = this.createStructureForDelZkzpsvProcedure(currentOrder.id)
      const response = await this.$api.service.executeStashedFunctionWithReturnedDataSet(params)

      if (response.flagRet === 0) {
        this.$refs.userNotification.showUserNotification('success', 'Заказ на пошив №' + currentOrder.numZkzpsv + ' удален!')
      } else if (response.flagRet === 1) {
        this.$refs.userNotification.showUserNotification('warning', 'Заказ на пошив №' + currentOrder.numZkzpsv + ' помечен на удаление!')
      } else {
        this.$refs.userNotification.showUserNotification('error', 'Заказ на пошив №' + currentOrder.numZkzpsv + ' не может быть удален! По нему сформированы накладные!')
      }

      this.currentRowOfTableForContextMenu = null
      await this.fullUpdateTableOfRecordsWithInitData()
    }
  }
}
</script>

<style lang="scss">
.sewing-order-log-page {
  padding: 20px;

  &__table {
    overflow: auto;
  }

  &-checkbox {
    display: flex;
    align-items: center;
  }
}

#sewing-order-log-page-records-table {
  border-collapse: collapse;
  width: 100%;
  height: 650px;
}

#sewing-order-log-page-records-table table {
  width: 100%;
}

#sewing-order-log-page-records-table td, #sewing-order-log-page-records-table th {
  border: 1px solid #ddd;
  word-break: break-all !important;
  padding: 0 0 !important;
  height: 0 !important;
}

#sewing-order-log-page-records-table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

.sewing-order-log-page-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex: 1 1 auto;
  margin: 0;
  min-width: 100%;
}

.sewing-order-log-page-secondary-work-rectangle {
  height: 30px;
  width: 50px;
  background-color: indianred;
  margin-top: 7px;
}

.sewing-order-log-page-order-complete-rectangle {
  height: 30px;
  width: 50px;
  background-color: lightyellow;
  margin-top: 7px;
}

.sewing-order-log-page-defect-checked-label {
  color: indianred;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 12px;
}

.sewing-order-log-page-defect-checked-and-have-comments-label {
  color: red;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 12px;
}

.sewing-order-log-page-customer-field {
  width: 1000px;
}
</style>
