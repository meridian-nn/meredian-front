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
        >
          <v-icon
            color="white"
            @click="openConfirmModal"
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
      </div>

      <div class="sewing-order-log-page-checkbox mr-4">
        <v-checkbox
          v-model="govContract"
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
          show-select
          :single-select="false"
          disable-pagination
          hide-default-footer
          :headers="sewingOrderTableHeaders"
          :items="sewingOrderTableRecords"
          calculate-widths
          :item-class="typeOrder"
          @contextmenu:row="rightClickHandler"
          @update:sort-by="updateSort('by', $event)"
          @update:sort-desc="updateSort('desc', $event)"
        >
          <template #[`item.dataZkzpsv`]="{ item }">
            {{ item.dataZkzpsv | formatDate('DD MMMM YYYY') }}
          </template>

          <template #[`item.planDataManager`]="{ item }">
            {{ item.planDataManager | formatDate('DD MMMM YYYY') }}
          </template>

          <template #[`item.dataRaskroyFact`]="{ item }">
            {{ item.dataRaskroyFact | formatDate('DD MMMM YYYY') }}
          </template>

          <template #[`item.planData`]="{ item }">
            {{ item.planData | formatDate('DD MMMM YYYY') }}
          </template>

          <template #[`body.append`]>
            <infinite-loading
              :key="keyLoading"
              spinner="spiral"
              :identifier="infiniteIdData"
              @infinite="findSpDocoplForPay"
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
            <v-list-item @click="deleteRecord">
              <v-list-item-title>
                Удалить
              </v-list-item-title>
            </v-list-item>
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
      @success="removeSelectElement"
    />

    <modal-print
      :value="modals.print"
      @close="closePrintModal"
    />

    <user-notification ref="userNotification" />
    <message ref="message" />
  </div>
</template>

<script>
import UserNotification from '@/components/information_window/UserNotification'
import Message from '@/components/message/Message'
import ModalEditOrderForTailoring from './modals/EditOrderForTailoring'
import ModalEditOrderForAdditionalWork from './modals/EditOrderForAdditionalWork'
import ModalConfirm from './modals/Confirm'
import ModalPrint from './modals/Print'

export default {
  name: 'SewingOrderLogPage',

  components: {
    ModalEditTailoring: ModalEditOrderForTailoring,
    ModalEditWork: ModalEditOrderForAdditionalWork,
    Message,
    ModalConfirm,
    ModalPrint,
    UserNotification
  },

  async asyncData({ $api }) {
    const manufacturs = await $api.manufacturing.manufacturingRequestJournalFindAll()

    return { manufacturs }
  },

  data() {
    return {
      sortBy: [],
      sortDesc: [],
      infiniteIdData: 0,
      keyLoading: Math.random(),
      pageOfFromPayData: 0,
      contextMenu: false,
      xContextMenu: 0,
      yContextMenu: 0,
      currentRowOfTableForContextMenu: null,
      modals: {
        edit: false,
        editAdd: false,
        confirm: false,
        print: false
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
          sortable: false
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
          width: '120px',
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
          sortable: false
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
      sewingOrderTableRecords: [
        {
          'codGra': 'string',
          'colvo': 0,
          'dataGotovFabr': '2021-07-19T16:13:04.689Z',
          'dataRaskroyFact': '2021-07-19T16:13:04.689Z',
          'dataZkzpsv': '2021-07-19T16:13:04.689Z',
          'dopWork': 0,
          'factData': '2021-07-19T16:13:04.689Z',
          'fioIsp': 'string',
          'flagDel': 0,
          'gosKontrakt': 'string',
          'gostTu': 'string',
          'gotovKonfKarta': 0,
          'gotovMlog': 0,
          'gotovTo': 0,
          'gotovTp': 0,
          'id': 1,
          'ispId': 0,
          'kontrId': 0,
          'korp': 0,
          'mcId': 0,
          'mcIdRaskroy': 0,
          'nameKontr': 'string',
          'nameMc': 'string',
          'nameMcRaskroy': 'string',
          'nameOrg': 'string',
          'nameOrgRaskroy': 'string',
          'nameProizv': 'string',
          'nameRaskroy': 'string',
          'numOsn': 0,
          'numPlanpsv': 0,
          'numSvod': 0,
          'numZaivk': 'string',
          'numZkzpsv': 110,
          'numdog': 'string',
          'orgId': 0,
          'otdId': 0,
          'otvIsp': 'string',
          'parent': 0,
          'planData': '2021-07-19T16:13:04.689Z',
          'planDataManager': '2021-07-19T16:13:04.689Z',
          'prEt': 0,
          'prGotov': 0,
          'prQuality': 0,
          'prb': 0,
          'primProv': 'string',
          'procVip': 0,
          'proizvId': 0,
          'proizvRaskroy': 0,
          'sbst': 0,
          'socrName': 'string',
          'spplnId': 0,
          'tkanData': '2021-07-19T16:13:04.689Z',
          'userId': 0,
          'zkzpsvId': 0,
          'zkzpsvOsn': 0,
          'flagRet': 0
        },

        {
          'codGra': 'string',
          'colvo': 0,
          'dataGotovFabr': '2021-07-19T16:13:04.689Z',
          'dataRaskroyFact': '2021-07-19T16:13:04.689Z',
          'dataZkzpsv': '2021-07-19T16:13:04.689Z',
          'dopWork': 1,
          'factData': '2021-07-19T16:13:04.689Z',
          'fioIsp': 'string',
          'flagDel': 0,
          'gosKontrakt': 'string',
          'gostTu': 'string',
          'gotovKonfKarta': 0,
          'gotovMlog': 0,
          'gotovTo': 0,
          'gotovTp': 0,
          'id': 2,
          'ispId': 0,
          'kontrId': 0,
          'korp': 0,
          'mcId': 0,
          'mcIdRaskroy': 0,
          'nameKontr': 'string',
          'nameMc': 'string',
          'nameMcRaskroy': 'string',
          'nameOrg': 'string',
          'nameOrgRaskroy': 'string',
          'nameProizv': 'string',
          'nameRaskroy': 'string',
          'numOsn': 0,
          'numPlanpsv': 0,
          'numSvod': 0,
          'numZaivk': 'string',
          'numZkzpsv': 120,
          'numdog': 'string',
          'orgId': 0,
          'otdId': 0,
          'otvIsp': 'string',
          'parent': 0,
          'planData': '2021-07-19T16:13:04.689Z',
          'planDataManager': '2021-07-19T16:13:04.689Z',
          'prEt': 0,
          'prGotov': 0,
          'prQuality': 0,
          'prb': 0,
          'primProv': 'string',
          'procVip': 0,
          'proizvId': 0,
          'proizvRaskroy': 0,
          'sbst': 0,
          'socrName': 'string',
          'spplnId': 0,
          'tkanData': '2021-07-19T16:13:04.689Z',
          'userId': 0,
          'zkzpsvId': 0,
          'zkzpsvOsn': 0,
          'flagRet': 1
        },

        {
          'codGra': 'string',
          'colvo': 0,
          'dataGotovFabr': '2021-07-19T16:13:04.689Z',
          'dataRaskroyFact': '2021-07-19T16:13:04.689Z',
          'dataZkzpsv': '2021-07-19T16:13:04.689Z',
          'dopWork': 1,
          'factData': '2021-07-19T16:13:04.689Z',
          'fioIsp': 'string',
          'flagDel': 0,
          'gosKontrakt': 'string',
          'gostTu': 'string',
          'gotovKonfKarta': 0,
          'gotovMlog': 0,
          'gotovTo': 0,
          'gotovTp': 0,
          'id': 3,
          'ispId': 0,
          'kontrId': 0,
          'korp': 0,
          'mcId': 0,
          'mcIdRaskroy': 0,
          'nameKontr': 'string',
          'nameMc': 'string',
          'nameMcRaskroy': 'string',
          'nameOrg': 'string',
          'nameOrgRaskroy': 'string',
          'nameProizv': 'string',
          'nameRaskroy': 'string',
          'numOsn': 0,
          'numPlanpsv': 0,
          'numSvod': 1,
          'numZaivk': 'string',
          'numZkzpsv': 130,
          'numdog': 'string',
          'orgId': 0,
          'otdId': 0,
          'otvIsp': 'string',
          'parent': 0,
          'planData': '2021-07-19T16:13:04.689Z',
          'planDataManager': '2021-07-19T16:13:04.689Z',
          'prEt': 0,
          'prGotov': 0,
          'prQuality': 0,
          'prb': 0,
          'primProv': 'string',
          'procVip': 0,
          'proizvId': 0,
          'proizvRaskroy': 0,
          'sbst': 0,
          'socrName': 'string',
          'spplnId': 0,
          'tkanData': '2021-07-19T16:13:04.689Z',
          'userId': 0,
          'zkzpsvId': 0,
          'zkzpsvOsn': 0,
          'flagRet': 2
        },

        {
          'codGra': 'string',
          'colvo': 0,
          'dataGotovFabr': '2021-07-19T16:13:04.689Z',
          'dataRaskroyFact': '2021-07-19T16:13:04.689Z',
          'dataZkzpsv': '2021-07-19T16:13:04.689Z',
          'dopWork': 1,
          'factData': '2021-07-19T16:13:04.689Z',
          'fioIsp': 'string',
          'flagDel': 0,
          'gosKontrakt': 'string',
          'gostTu': 'string',
          'gotovKonfKarta': 0,
          'gotovMlog': 0,
          'gotovTo': 0,
          'gotovTp': 0,
          'id': 5,
          'ispId': 0,
          'kontrId': 0,
          'korp': 0,
          'mcId': 0,
          'mcIdRaskroy': 0,
          'nameKontr': 'string',
          'nameMc': 'string',
          'nameMcRaskroy': 'string',
          'nameOrg': 'string',
          'nameOrgRaskroy': 'string',
          'nameProizv': 'string',
          'nameRaskroy': 'string',
          'numOsn': 0,
          'numPlanpsv': 0,
          'numSvod': 0,
          'numZaivk': 'string',
          'numZkzpsv': 140,
          'numdog': 'string',
          'orgId': 0,
          'otdId': 0,
          'otvIsp': 'string',
          'parent': 0,
          'planData': '2021-07-19T16:13:04.689Z',
          'planDataManager': '2021-07-19T16:13:04.689Z',
          'prEt': 0,
          'prGotov': 0,
          'prQuality': 0,
          'prb': 0,
          'primProv': 'string',
          'procVip': 0,
          'proizvId': 0,
          'proizvRaskroy': 0,
          'sbst': 0,
          'socrName': 'string',
          'spplnId': 0,
          'tkanData': '2021-07-19T16:13:04.689Z',
          'userId': 0,
          'zkzpsvId': 0,
          'zkzpsvOsn': 0,
          'flagRet': 2
        }
      ],

      govContract: false,

      noOTK: false,

      customerName: ''
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

  methods: {
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

    closeModalEditTailoring() {
      this.sewingOrderTableSelectedRecords = []
      this.modals.edit = false
    },

    closeModalEditWork() {
      this.sewingOrderTableSelectedRecords = []
      this.modals.editAdd = false
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

    async removeSelectElement(params = this.sewingOrderTableSelectedRecords) {
      try {
        await this.$api.manufacturing.manufacturingRequestJournalRemove(params)

        this.closeConfirmModal()
      } catch (e) {
        this.$refs.userNotification.showUserNotification('warning', 'Ошибка сервера, попробуйте позже')
      }
    },

    async saveModalEditTailoring(params = this.sewingOrderTableSelectedRecords) {
      try {
        await this.$api.manufacturing.manufacturingRequestJournalSave(params)

        this.closeModalEditTailoring()
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
      this.pageOfFromPayData = 0
      // Очистить данные
      this.keyLoading = Math.random()
    },

    typeOrder(item) {
      return item.gosKontrakt ? 'red' : 'blue'
    },

    async findSpDocoplForPay($state) {
      const dataForFiltersQuery = this.createCriteriasToSearchForFiltersValues(this.$route.name,
        this.getIdOfFromPayDocsTableOfJournalOfPaymentDocs(), this.getCurrentUser.id)
      const response = await this.$api.uiSettings.findBySearchCriterias(dataForFiltersQuery)
      const filtersParams = JSON.parse(response[0].settingValue)

      const searchCriterias = this.createCriteriasForRequestToSearchDocsFromPay(filtersParams)

      const data = {
        searchCriterias,
        page: this.pageOfFromPayData,
        orders: this.handleSortData
      }

      this.isFiltersForFromPayDocsUsing = searchCriterias.length > 1

      // await this.fillResultsOfDocumentsFromPay(searchCriterias)

      const { content } = await this.$api.payment.docOplForPay.findDocumentsForPayForJournalTable(data)

      if (content.length > 0) {
        this.pageOfFromPayData += 1

        this.fromPayData.push(...content)

        $state.loaded()
      } else {
        $state.complete()
      }
    },

    deleteRecord() {
      if (this.currentRowOfTableForContextMenu.numSvod > 0) {
        this.$refs.userNotification.showUserNotification('warning', 'Заказ входит в сводный заказ! Переформируйте сводный заказ!')
        return
      }

      if (this.currentRowOfTableForContextMenu.flagRet === 0) {
        this.$refs.userNotification.showUserNotification('success', 'Заказ на пошив №' + this.currentRowOfTableForContextMenu.numZkzpsv + ' удален!')
        this.deleteElemFromArray(this.sewingOrderTableRecords, this.sewingOrderTableRecords.indexOf(this.currentRowOfTableForContextMenu))
      } else if (this.currentRowOfTableForContextMenu.flagRet === 1) {
        this.$refs.userNotification.showUserNotification('warning', 'Заказ на пошив №' + this.currentRowOfTableForContextMenu.numZkzpsv + ' помечен на удаление!')
      } else {
        this.$refs.userNotification.showUserNotification('error', 'Заказ на пошив №' + this.currentRowOfTableForContextMenu.numZkzpsv + ' не может быть удален! По нему сформированы накладные!')
      }

      this.currentRowOfTableForContextMenu = null
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
