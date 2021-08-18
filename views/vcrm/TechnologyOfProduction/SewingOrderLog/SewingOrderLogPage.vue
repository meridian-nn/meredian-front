<template>
  <div class="sewing-order-log-page">
    <div class="sewing-order-log-page-row">
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <div
            class="mr-1"
            v-bind="attrs"
            v-on="on"
          >
            <v-btn
              style="border-radius:50%; width: 40px; height: 40px;"
              min-width="40px"
              small
              color="blue"
              :disabled="sewingOrderTableSelectedRecords.length === 0 || sewingOrderTableSelectedRecords.length > 1"
            >
              <v-icon
                color="white"
                @click="openModal('edit')"
              >
                mdi-pencil
              </v-icon>
            </v-btn>
          </div>
        </template>
        <span>Редактирование выбранного заказа на пошив</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <div
            class="mr-1"
            v-bind="attrs"
            v-on="on"
          >
            <v-btn
              style="border-radius:50%; width: 40px; height: 40px;"
              min-width="40px"
              small
              color="red"
              :disabled="sewingOrderTableSelectedRecords.length === 0"
            >
              <v-icon
                color="white"
                @click="deleteRecord"
              >
                mdi-delete
              </v-icon>
            </v-btn>
          </div>
        </template>
        <span>Удаление выбранных заказов на пошив</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            class="mr-1"
            style="border-radius:50%; width: 40px; height: 40px;"
            min-width="40px"
            small
            color="red"
            v-bind="attrs"
            :disabled="sewingOrderTableSelectedRecords.length === 0"
            @click="openModal('print')"
            v-on="on"
          >
            <v-icon color="white">
              mdi-printer
            </v-icon>
          </v-btn>
        </template>
        <span>Открытие формы печати</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            class="mr-1"
            style="border-radius:50%; width: 40px; height: 40px;"
            min-width="40px"
            small
            color="blue"
            v-bind="attrs"
            @click="openModal('filter')"
            v-on="on"
          >
            <v-icon color="white">
              mdi-filter
            </v-icon>
          </v-btn>
        </template>
        <span>Фильтры для заказов на пошив</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            class="mr-1"
            style="border-radius:50%; width: 40px; height: 40px;"
            min-width="40px"
            small
            color="blue"
            v-bind="attrs"
            @click="openModal('search')"
            v-on="on"
          >
            <v-icon color="white">
              mdi-magnify
            </v-icon>
          </v-btn>
        </template>
        <span>Поиск в журнале заказов на пошив</span>
      </v-tooltip>

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
          height="710"
          fixed-header
          :loading="loadingType.sewingOrderTableRecords"
          loading-text="Заказы загружаются, подождите"
          no-data-text="Заказы не найдены"
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
          <template #body="{ items }">
            <tbody>
              <tr
                v-for="item in items"
                :key="item.id"
                :value="item"
                :class="getBackgroundAndFontClass(item)"
                @contextmenu="rightClickHandler($event, item)"
                @click="fillCustomerName(item)"
                @dblclick="fillingDefectForOrder"
              >
                <td>
                  <v-checkbox
                    v-model="sewingOrderTableSelectedRecords"
                    :value="item"
                    class="sewing-order-log-page-records-table-checkbox"
                    hide-details
                  />
                </td>
                <td>
                  <v-icon
                    v-if="item.prEt === 1"
                    color="rgb(0,0,255)"
                  >
                    mdi-check
                  </v-icon>
                </td>
                <td>
                  <v-icon
                    v-if="item.prQuality === 1"
                  >
                    mdi-check
                  </v-icon>
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.numPlanpsv }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.numZkzpsv }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.dataZkzpsv }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract sewing-order-log-page-records-table-cell-truncate' : 'sewing-order-log-page-records-table-cell-truncate'">
                  <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                      <span
                        v-bind="attrs"
                        v-on="on"
                      >{{ item.nameProizv }}</span>
                    </template>
                    <span>{{ item.nameProizv }}</span>
                  </v-tooltip>
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.mcId }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract sewing-order-log-page-records-table-cell-truncate' : 'sewing-order-log-page-records-table-cell-truncate'">
                  <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                      <span
                        v-bind="attrs"
                        v-on="on"
                      >{{ item.nameMc }}</span>
                    </template>
                    <span>{{ item.nameMc }}</span>
                  </v-tooltip>
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.nameEd }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.colvo }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.planDataManager }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.factData }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract sewing-order-log-page-records-table-cell-truncate' : 'sewing-order-log-page-records-table-cell-truncate'">
                  <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                      <span
                        v-bind="attrs"
                        v-on="on"
                      >{{ item.nameRaskroy }}</span>
                    </template>
                    <span>{{ item.nameRaskroy }}</span>
                  </v-tooltip>
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.numZaivk }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.numSvod }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.dataRaskroyFact }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.fioIsp }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.otvIsp }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract sewing-order-log-page-records-table-cell-truncate' : 'sewing-order-log-page-records-table-cell-truncate'">
                  <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                      <span
                        v-bind="attrs"
                        v-on="on"
                      >{{ item.gostTu }}</span>
                    </template>
                    <span>{{ item.gostTu }}</span>
                  </v-tooltip>
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract sewing-order-log-page-records-table-cell-truncate' : 'sewing-order-log-page-records-table-cell-truncate'">
                  <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                      <span
                        v-bind="attrs"
                        v-on="on"
                      >{{ item.codGra }}</span>
                    </template>
                    <span>{{ item.codGra }}</span>
                  </v-tooltip>
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.planData }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.gotovKonfKarta }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.gotovTo }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.gotovMl }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.gotovTp }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.gotovOtk }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.print }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.kroy }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.nameKroy }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.govcontract }}
                </td>
                <td :class="item.gos_kontrakt > 0 ? 'font-size-for-govcontract font-bold-for-govcontract' : ''">
                  {{ item.contract }}
                </td>
              </tr>
            </tbody>
            <infinite-loading
              :key="keyLoading"
              spinner="spiral"
              :identifier="infiniteIdData"
              @infinite="findSewingOrderTableRecords"
            >
              <div slot="no-more" />
              <div slot="no-results" />
            </infinite-loading>
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
            <v-list-item @click="openModal('size')">
              <v-list-item-title>
                Просмотр заказа по размерам
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="openModal('planDate')">
              <v-list-item-title>
                Отметка о выполнении пошива
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="openModal('planDate')">
              <v-list-item-title>
                Отметка о выполнении раскроя
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="openModal('actualConsumptionRawMaterials')">
              <v-list-item-title>
                Фактический расход сырья
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="openModal('providingOrderWithRawMaterials')">
              <v-list-item-title>
                Обеспечение заказа сырьем
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="openModal('oldOrderCard')">
              <v-list-item-title>
                Карточка заказа старая
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="openModal('tailoringOrder')">
              <v-list-item-title>
                Заказ на пошив
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
          dense
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
      v-if="modals.edit"
      :edit="sewingOrderTableSelectedRecords[0]"
      :value="modals.edit"
      @close="closeModal('edit')"
      @save="saveModalEditTailoring"
    />

    <modal-edit-work
      v-if="modals.editAdd"
      :edit="sewingOrderTableSelectedRecords[0]"
      :value="modals.editAdd"
      @close="closeModal('editAdd')"
      @save="saveModalEditWork"
    />

    <modal-confirm
      :value="modals.confirm"
      @close="closeModal('confirm')"
      @success="deleteRecord"
    />

    <modal-print
      :value="modals.print"
      :selected-records="sewingOrderTableSelectedRecords"
      @close="closeModal('print')"
    />

    <modal-filter
      v-if="modals.filter"
      :value="modals.filter"
      @save="saveFilter"
      @close="closeModal('filter')"
    />

    <modal-plan-date
      :value="modals.planDate"
      @close="closeModal('planDate')"
    />

    <modal-size
      v-if="modals.size"
      :data-for-modal="currentRowOfTableForContextMenu"
      :value="modals.size"
      @close="closeModal('size')"
    />

    <modal-actual-consumption-raw-materials
      :value="modals.actualConsumptionRawMaterials"
      @close="closeModal('actualConsumptionRawMaterials')"
    />

    <modal-old-order-card
      :value="modals.oldOrderCard"
      @close="closeModal('oldOrderCard')"
    />

    <modal-tailoring-order
      :data="currentRowOfTableForContextMenu"
      :value="modals.tailoringOrder"
      @close="closeModal('tailoringOrder')"
    />

    <modal-raw-materials
      :data="currentRowOfTableForContextMenu"
      :value="modals.rawMaterials"
      @close="closeModal('rawMaterials')"
    />

    <modal-search
      v-if="modals.search"
      :value="modals.search"
      @save="saveFilter"
      @close="closeModal('search')"
    />

    <filling-defect-on-order-for-tailoring
      v-if="modals.fillingDefectOnOrderForTailoring"
      :value="modals.fillingDefectOnOrderForTailoring"
      @close="closeModal('fillingDefectOnOrderForTailoring')"
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
import ModalSearch from './modals/Search'
import ModalSize from './modals/Size'
import ModalPlanDate from './modals/PlanDate'
import ModalTailoringOrder from './modals/TailoringOrder'
import ModalRawMaterials from './modals/RawMaterials'
import ModalActualConsumptionRawMaterials from './modals/ActualConsumptionRawMaterials'
import ModalOldOrderCard from './modals/OldOrderCard'
import FillingDefectOnOrderForTailoring from './modals/FillingDefectOnOrderForTailoring'

export default {
  name: 'SewingOrderLogPage',

  components: {
    ModalEditTailoring: ModalEditOrderForTailoring,
    ModalEditWork: ModalEditOrderForAdditionalWork,
    Message,
    ModalConfirm,
    ModalPrint,
    ModalSize,
    ModalFilter,
    ModalPlanDate,
    ModalTailoringOrder,
    ModalActualConsumptionRawMaterials,
    ModalOldOrderCard,
    UserNotification,
    ModalRawMaterials,
    FillingDefectOnOrderForTailoring,
    ModalSearch,
    InfiniteLoading
  },

  data() {
    return {
      loadingType: {
        sewingOrderTableRecords: false
      },
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
        filter: false,
        size: false,
        planDate: false,
        tailoringOrder: false,
        rawMaterials: false,
        actualConsumptionRawMaterials: false,
        oldOrderCard: false,
        fillingDefectOnOrderForTailoring: false,
        search: false
      },
      sewingOrderTableSelectedRecords: [],
      sewingOrderTableHeaders: [
        {
          text: 'Эт',
          value: 'prEt',
          width: '20px',
          sortable: false
        },
        {
          text: 'К',
          value: 'prQuality',
          width: '20px',
          sortable: false
        },
        {
          text: 'План',
          value: 'numPlanpsv',
          width: '60px',
          sort: () => false
        },
        {
          text: 'Заказ',
          value: 'numZkzpsv',
          width: '60px',
          sort: () => false
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
          width: '150px',
          sort: () => false
        },
        {
          text: 'Код',
          value: 'mcId',
          width: '60px',
          sort: () => false
        },
        {
          text: 'Наименование МЦ',
          value: 'nameMc',
          width: '200px',
          sortable: false
        },
        {
          text: 'Ед.',
          value: '', // name_ed нет в респонсе
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
          value: 'factData',
          width: '95px',
          sort: () => false
        },
        {
          text: 'Раскрой',
          value: 'nameRaskroy',
          width: '130px',
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
          value: 'fioIsp',
          width: '120px',
          sort: () => false
        },
        {
          text: 'Отв.исп',
          value: 'otvIsp',
          width: '120px',
          sort: () => false
        },
        {
          text: 'ГОСТ/ТУ',
          value: 'gostTu',
          width: '150px',
          sort: () => false
        },
        {
          text: 'Код ЗП',
          value: 'codGra',
          width: '150px',
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
          value: 'gotovKonfKarta',
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
      isNeedToInitDataForSewingOrderTable: true,
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
    },

    getCurrentUser() {
      return this.$store.state.profile.user
    }
  },

  mounted() {
    this.init()
  },
  created() {
    // Инициализация данных для текущего пользователя
    this.initDataForCurrentUser()
  },
  methods: {
    init() {
      this.canUpdate = true
      this.updateSewingOrderTableRecords()
    },

    rightClickHandler(event, item) {
      event.preventDefault()

      this.contextMenu = false
      this.currentRowOfTableForContextMenu = null
      this.xContextMenu = event.clientX
      this.yContextMenu = event.clientY
      this.$nextTick(() => {
        this.contextMenu = true
        this.currentRowOfTableForContextMenu = item
      })
    },

    fillCustomerName(item) {
      this.customerName = item.nameKontr
    },

    openModal(name) {
      if (name === 'edit' ||
        name === 'editAdd') {
        this.openEditModal()
      } else if (name === 'providingOrderWithRawMaterials') {
        this.$refs.userNotification.showUserNotification('warning', 'Форма в разработке')
      } else {
        this.modals[name] = true
      }
    },

    openEditModal() {
      const editingRecord = this.sewingOrderTableSelectedRecords[0]

      if (editingRecord.dopWork === 0) {
        this.modals.edit = true
      } else {
        this.modals.editAdd = true
      }
    },

    closeModal(name) {
      this.modals[name] = false
      this.sewingOrderTableSelectedRecords = []
      // if (name === 'edit' ||
      //   name === 'editAdd') {
      //   this.isNeedToInitDataForSewingOrderTable = true
      //   this.updateSewingOrderTableRecords()
      // }
    },

    async saveModalEditTailoring(params = this.sewingOrderTableSelectedRecords) {
      try {
        await this.$api.manufacturing.manufacturingRequestJournalSave(params)

        await this.updateSewingOrderTableRecords()
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
      this.sewingOrderTableSelectedRecords = []
      this.keyLoading = Math.random()
    },

    /* typeOrder(item) {
      return item.gosKontrakt ? 'red' : 'blue'
    }, */

    // Обновление таблицы "Заказы на пошив"
    updateSewingOrderTableRecords() {
      this.page = 0
      this.sewingOrderTableRecords = []
      this.sewingOrderTableSelectedRecords = []
      this.infiniteIdData += 1
      this.loadingType.sewingOrderTableRecords = false
    },

    async findSewingOrderTableRecords($state) {
      this.loadingType.sewingOrderTableRecords = true

      // Поиск пользовательских настроек фильтров
      const dataForFiltersQuery = this.createCriteriasToSearchForFiltersValues(this.$route.name,
        this.getIdOfFilterSewingOrderLog(), this.getCurrentUser.id)

      const response = await this.$api.uiSettings.findBySearchCriterias(dataForFiltersQuery)

      let filtersParams

      if (response.length) {
        try {
          filtersParams = JSON.parse(response[0].settingValue)
        } catch (error) {
          console.log(error)
        }
      }

      // Поиск данных в таблице "manufacturing_request_journal"
      const searchCriterias = this.createCriteriasToSearchSewingOrderLogDataByPage(filtersParams)
      const data = {
        searchCriterias,
        page: this.page,
        orders: this.handleSortData,
        size: 200
      }

      const { content } = await this.$api.manufacturing.manufacturingRequestJournalFindPageBySearchCriteriaList(data)

      if (content.length > 0) {
        this.page += 1

        this.sewingOrderTableRecords.push(...content)
        $state.loaded()
      } else {
        $state.complete()
      }
      this.loadingType.sewingOrderTableRecords = false
    },

    async initDataForCurrentUser() {
      if (!this.isNeedToInitDataForSewingOrderTable) {
        return
      }

      const params = this.createStructureForSewingOrderLogPageInitDataProcedure()
      await this.$api.service.executeStashedFunction(params)
      this.isNeedToInitDataForSewingOrderTable = false
    },

    async deleteRecord() {
      if (
        (!this.sewingOrderTableSelectedRecords ||
          !this.sewingOrderTableSelectedRecords.length) &&
        !this.currentRowOfTableForContextMenu
      ) {
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

      const params = this.createStructureForDelZkzpsvProcedure(currentOrder.zkzpsvId)
      const response = await this.$api.service.executeStashedFunctionWithReturnedDataSet(params)

      if (response.flagRet === 0) {
        this.$refs.userNotification.showUserNotification('success', 'Заказ на пошив №' + currentOrder.numZkzpsv + ' удален!')

        this.updateSewingOrderTableRecords()
      } else if (response.flagRet === 1) {
        this.$refs.userNotification.showUserNotification('warning', 'Заказ на пошив №' + currentOrder.numZkzpsv + ' помечен на удаление!')

        this.updateSewingOrderTableRecords()
      } else {
        this.$refs.userNotification.showUserNotification('error', 'Заказ на пошив №' + currentOrder.numZkzpsv + ' не может быть удален! По нему сформированы накладные!')
      }
    },

    getBackgroundAndFontClass(data) {
      let classes = []
      if (data.flagDel === 0) {
        if (data.factData === '01.01.1900') {
          if (data.parent === 0) {
            if (data.dopWork === 1) {
              classes = 'background-pink'
            } else {
              classes = 'background-white'
            }
          } else {
            classes = 'background-green-blue'
          }
        } else {
          classes = 'background-yellow'
        }
      } else {
        classes = 'background-grey'
      }

      if (data.prb === 0) {
        classes += ' font-black'
      }
      if (data.prb === 1) {
        classes += ' font-vinous'
      }
      if (data.prb === 2) {
        classes += ' font-red'
      }

      return classes
    },

    fillingDefectForOrder() {
      this.modals.fillingDefectOnOrderForTailoring = true
    },
    saveFilter() {
      this.isNeedToInitDataForSewingOrderTable = false
      this.updateSewingOrderTableRecords()
    }
  }
}
</script>

<style lang="scss">
.sewing-order-log-page {
  padding: 10px;

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
  height: 710px;
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

.sewing-order-log-page-records-table-cell-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 1px;
}

.sewing-order-log-page-records-table-checkbox {
  margin:0;
  padding:0;
}

.background-pink {
  background-color: rgb(251,198,199);
}
.background-white {
  background-color: rgb(255, 255, 255);
}
.background-green-blue {
  background-color: rgb(175,236,239);
}
.background-yellow {
  background-color: rgb(248,248,190);
}
.background-grey {
  background-color: rgb(192,192,192);
}
.font-red {
  color: rgb(255,0,0);
}
.font-black {
  color: rgb(0,0,0);
}
.font-vinous {
  color: rgb(128,0,64);
}
.font-size-for-govcontract {
  font-size: 1rem;
}
.font-bold-for-govcontract {
  font-weight: bold;
}
#sewing-order-log-page-records-table tr:hover {
  border-color: inherit;
}

.sewing-order-log-page-btn {
  flex: 0 0 10%;
  max-width: 10%;
}
</style>
