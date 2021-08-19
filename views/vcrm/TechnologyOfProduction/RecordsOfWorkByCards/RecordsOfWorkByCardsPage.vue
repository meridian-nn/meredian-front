<template>
  <div
    v-if="isRecordsOfWorkByCards"
    class="records-of-work-by-cards-main-div"
  >
    <div class="records-of-work-by-cards-row">
      <div class="records-of-work-by-cards-header-btn">
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              color="blue"
              class="mx-2"
              style="border-radius:50%; width: 32px; height: 32px;"
              min-width="32"
              dark
              x-small
              v-bind="attrs"
              :to="{ name: 'SewingOrderLog' }"
              v-on="on"
            >
              <v-icon dark>
                mdi-plus
              </v-icon>
            </v-btn>
          </template>
          <span>Переход в "Журнал заказов на пошив"</span>
        </v-tooltip>
      </div>

      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <div
            class="records-of-work-by-cards-header-btn"
            v-bind="attrs"
            v-on="on"
          >
            <v-btn
              color="blue"
              class="mx-2"
              style="border-radius:50%; width: 32px; height: 32px;"
              min-width="32"
              x-small
              :disabled="recordsSelectedRows.length === 0 || recordsSelectedRows.length > 1"
            >
              <v-icon
                color="white"
                @click="editRecord"
              >
                mdi-pencil
              </v-icon>
            </v-btn>
          </div>
        </template>
        <span>Редактирование выбранной записи работы по карточкам</span>
      </v-tooltip>

      <records-of-work-on-order
        ref="recordsOfWorkOnOrder"
        @close="closeRecordsOfWorkOnOrder"
      />

      <div class="records-of-work-by-cards-label">
        <v-subheader class="font-weight-medium text-subtitle-1">
          Месяц
        </v-subheader>
      </div>

      <div class="records-of-work-by-cards-autocomplete-month">
        <v-autocomplete
          v-model="chosenMonthId"
          :loading="loadingType.suppliers"
          :items="months"
          item-value="id"
          item-text="name"
          hide-details="auto"
          :auto-select-first="true"
          :readonly="!isHaveTechnologyOfProductionRole"
          outlined
        />
      </div>

      <div class="records-of-work-by-cards-label">
        <v-subheader class="font-weight-medium text-subtitle-1">
          Год
        </v-subheader>
      </div>

      <div class="records-of-work-by-cards-autocomplete-year">
        <v-autocomplete
          v-model="chosenYear"
          :loading="loadingType.years"
          :items="years"
          item-value="id"
          item-text="name"
          hide-details="auto"
          :readonly="!isHaveTechnologyOfProductionRole"
          outlined
        />
      </div>

      <div class="records-of-work-by-cards-autocomplete-organizations">
        <v-autocomplete
          v-model="chosenOrgId"
          :loading="loadingType.organizations"
          :items="organizations"
          item-value="client_id"
          item-text="name_podr"
          hide-details="auto"
          outlined
          @change="organizationChange"
        />
      </div>

      <div class="records-of-work-by-cards-btn">
        <v-dialog
          v-model="goToNewPeriodDialog"
          persistent
          max-width="420"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
            >
              Перейти к новому периоду
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="text-h5">
              ВНИМАНИЕ!
            </v-card-title>
            <v-card-text class="text-h6">
              После перехода к новому периоду все карточки швей текущего периода будут удалены без возможности
              восстановления! Перейти к новому периоду?
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="green darken-1"
                text
                @click="goToNewPeriod"
              >
                Да
              </v-btn>
              <v-btn
                color="green darken-1"
                text
                @click="goToNewPeriodDialog = false"
              >
                Нет
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <div class="records-of-work-by-cards-btn">
        <v-btn @click="recalculationOfOutputForMonth">
          Пересчет выработки за месяц
        </v-btn>
      </div>
    </div>

    <loading-dialog ref="loadingDialog" />

    <div class="records-of-work-by-cards-row">
      <div class="records-of-work-by-cards-label">
        <v-subheader class="font-weight-medium text-subtitle-1">
          № заказа
        </v-subheader>
      </div>

      <div class="records-of-work-by-cards-indentation-for-inputs">
        <v-text-field
          v-model.number="numberOfOrder"
          hide-details="auto"
          @keydown.enter="updateInfo"
        />
      </div>

      <div class="records-of-work-by-cards-label">
        <v-subheader class="font-weight-medium text-subtitle-1">
          № заявки
        </v-subheader>
      </div>

      <div class="records-of-work-by-cards-indentation-for-inputs">
        <v-text-field
          v-model.number="numberOfApplication"
          hide-details="auto"
        />
      </div>

      <div class="records-of-work-by-cards-label">
        <v-subheader class="font-weight-medium text-subtitle-1">
          Код
        </v-subheader>
      </div>

      <div class="records-of-work-by-cards-indentation-for-inputs">
        <v-text-field
          v-model.number="code"
          hide-details="auto"
        />
      </div>

      <div class="records-of-work-by-cards-label">
        <v-subheader class="font-weight-medium text-subtitle-1">
          ТП
        </v-subheader>
      </div>

      <div class="records-of-work-by-cards-indentation-for-inputs ">
        <v-text-field
          v-model.number="TP"
          hide-details="auto"
        />
      </div>

      <div class="records-of-work-by-cards-btn">
        <v-btn @click="updateRecordsInfo">
          <v-icon>mdi-binoculars</v-icon>
        </v-btn>
      </div>

      <div class="records-of-work-by-cards-btn">
        <v-btn @click="updateRecordsInfoWithoutUserCriterias">
          <v-icon>mdi-binoculars</v-icon>
          без отбора
        </v-btn>
      </div>

      <div class="records-of-work-by-cards-btn">
        <v-btn @click="addProductionByBranch">
          Занести выработку по филиалу
        </v-btn>
      </div>

      <div class="records-of-work-by-cards-row">
        <v-data-table
          id="records-of-work-by-cards-table-of-records"
          v-model="recordsSelectedRows"
          height="750"
          :headers="recordsHeaders"
          fixed-header
          :loading="loadingType.recordsData"
          loading-text="Заказы загружаются, подождите"
          no-data-text="Заказы не найдены"
          :items="recordsData"
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
                :class="getBackgroundClass(item.tmkId)"
              >
                <td>
                  <v-checkbox
                    v-model="recordsSelectedRows"
                    :value="item"
                    class="records-of-work-by-cards-table-of-records-checkbox"
                    color="black"
                    hide-details
                  />
                </td>
                <td>
                  {{ item.numZkzpsv }}
                </td>
                <td>
                  {{ item.posledCode }}
                </td>
                <td
                  class="records-of-work-by-cards-table-of-records-cell-truncate"
                >
                  <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                      <span
                        v-bind="attrs"
                        v-on="on"
                      >{{ item.modelName }}</span>
                    </template>
                    <span>{{ item.modelName }}</span>
                  </v-tooltip>
                </td>
                <td>
                  {{ item.colvoMc }}
                </td>
                <td>
                  {{ item.obraz }}
                </td>
                <td>
                  {{ item.coeff }}
                </td>
                <td>
                  {{ item.mcId }}
                </td>
                <td
                  class="records-of-work-by-cards-table-of-records-cell-truncate"
                >
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
                <td>
                  {{ item.numZaivk }}
                </td>
                <td
                  class="records-of-work-by-cards-table-of-records-cell-truncate"
                >
                  <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                      <span
                        v-bind="attrs"
                        v-on="on"
                      >{{ item.nameScheme }}</span>
                    </template>
                    <span>{{ item.nameScheme }}</span>
                  </v-tooltip>
                </td>
              </tr>

              <infinite-loading
                :key="keyLoading"
                spinner="spiral"
                :identifier="infiniteIdOfRecordsData"
                @infinite="findOrdersOnTailoring"
              >
                <div slot="no-more" />
                <div slot="no-results" />
              </infinite-loading>
            </tbody>
          </template>
        </v-data-table>

        <user-notification ref="userNotification" />
      </div>
    </div>
  </div>

  <div v-else>
    <router-view />
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import RecordsOfWorkOnOrder from '@/views/vcrm/TechnologyOfProduction/RecordsOfWorkOnOrder/RecordsOfWorkOnOrderPage.vue'
import UserNotification from '~/components/information_window/UserNotification'
import LoadingDialog from '~/components/loading_dialog/LoadingDialog'

export default {
  name: 'RecordsOfWorkByCards',

  components: {
    UserNotification,
    InfiniteLoading,
    RecordsOfWorkOnOrder,
    LoadingDialog
  },

  data() {
    return {
      loadingType: {
        recordsData: false
      },

      months: [
        {
          id: 1,
          name: 'Январь'
        },
        {
          id: 2,
          name: 'Февраль'
        },
        {
          id: 3,
          name: 'Март'
        },
        {
          id: 4,
          name: 'Апрель'
        },
        {
          id: 5,
          name: 'Май'
        },
        {
          id: 6,
          name: 'Июнь'
        },
        {
          id: 7,
          name: 'Июль'
        },
        {
          id: 8,
          name: 'Август'
        },
        {
          id: 9,
          name: 'Сентябрь'
        },
        {
          id: 10,
          name: 'Октябрь'
        },
        {
          id: 11,
          name: 'Ноябрь'
        },
        {
          id: 12,
          name: 'Декабрь'
        }
      ],

      chosenMonthId: {},

      years: [],

      chosenYear: {},

      chosenOrgId: {},

      // массив организаций
      organizations: [],

      // номер заказа
      numberOfOrder: '',

      // номер заявки
      numberOfApplication: '',

      // код
      code: '',

      TP: '',

      recordsSelectedRows: [],

      recordsHeaders: [
        {
          text: 'Заказ',
          value: 'numZkzpsv',
          width: '25px',
          sort: () => false
        },
        {
          text: 'ТП',
          value: 'posledCode',
          width: '25px',
          sort: () => false
        },
        {
          text: 'Наименование ТП',
          value: 'modelName',
          width: '140px',
          sort: () => false
        },
        {
          text: 'Количество',
          value: 'colvoMc',
          width: '30px',
          sort: () => false
        },
        {
          text: 'Образец',
          value: 'obraz',
          width: '25px',
          sort: () => false
        },
        {
          text: 'Коэффициент',
          value: 'coeff',
          width: '35px',
          sort: () => false
        },
        {
          text: 'Код',
          value: 'mcId',
          width: '25px',
          sort: () => false
        },
        {
          text: 'Наименование изделия',
          value: 'nameMc',
          width: '140px',
          sort: () => false
        },
        {
          text: 'Заявка',
          value: 'numZaivk',
          width: '50px',
          sort: () => false
        },
        {
          text: 'Схема разделения',
          value: 'nameScheme',
          width: '50px',
          sort: () => false
        }
      ],

      recordsData: [],

      pageOfRecords: 0,

      sortBy: [],

      sortDesc: [],

      keyLoading: Math.random(),

      infiniteIdOfRecordsData: 0,

      elementId: null,

      updateRecordsDataWithUserCriterias: true,

      monthOfProizv: null,

      variablesOfForm: {
        orgAnfb: null,
        orgName: null,
        proizvAnfb: null,
        mesAnfb: null,
        godAnfb: null
      },

      orderForRecordsOfWorkOnOrder: {
        tmkId1: 0,
        colvoTmk: 0,
        zschId: 0,
        schcardsId: 0,
        schId: 0
      },

      goToNewPeriodDialog: false,

      canUpdate: false
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

    getBackgroundClass() {
      return (tmkId) => {
        return {
          'records-of-work-by-cards-td-white-background-class': tmkId === 0,
          'records-of-work-by-cards-td-green-background-class': tmkId !== 0
        }
      }
    },

    isRecordsOfWorkByCards() {
      return this.$route.matched[this.$route.matched.length - 1].name === 'RecordsOfWorkByCards'
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    // Инициализация формы
    async init() {
      this.elementId = this.getIdOfRecordsTableOfRecordsOfWorkByCards()
      this.getTenLastYears()

      await this.execSelProizvOur()
      if (!this.organizations ||
        !this.organizations.length) {
        return
      }
      this.chosenOrgId = this.organizations[1].client_id
      await this.findMonthOfProizv()
      await this.initData()
      await this.updateRecordsData()
    },

    // Поиск организации для текущего сотрудника
    // на данный момент получает данные по userId = 'Larisa'
    async execSelProizvOur() {
      this.loadingType.organizations = true
      const params = this.createStructureForSelProizvOurProcedure()
      this.organizations = await this.$api.service.executeStashedFunctionWithReturnedDataSet(params).catch((error) => {
        alert(error)
      })
      this.loadingType.organizations = null

      if (this.organizations ||
        this.organizations.length) {
        this.variablesOfForm.orgAnfb = this.organizations[1].client_id
        this.variablesOfForm.orgName = this.organizations[1].name_podr
        this.variablesOfForm.proizvAnfb = this.organizations[1].proizv_id
      }
    },

    // Поиск текущего месяца для выбранной организации
    async findMonthOfProizv() {
      if (!this.variablesOfForm.orgAnfb) {
        return
      }

      const params = this.createCriteriasForFindMonthOfProizv(this.variablesOfForm)
      const response = await this.$api.manufacturing.findMonthOfProductionBySearchCriterias(params)

      if (!response ||
        !response.length) {
        return
      }

      this.monthOfProizv = response[0]
      this.monthOfProizv.priznak = 1
      this.chosenMonthId = this.months.find(elem => elem.id === this.monthOfProizv.monthCurr).id
      this.variablesOfForm.mesAnfb = this.monthOfProizv.monthCurr
      this.chosenYear = this.years.find(elem => elem === this.monthOfProizv.yearCurr)
      this.variablesOfForm.godAnfb = this.monthOfProizv.yearCurr
    },

    // Инициализация данных формы
    async initData(customParams) {
      const params = this.createStructureForManufacturingInitDataProcedure(customParams || this.monthOfProizv)
      await this.$api.service.executeStashedFunction(params).catch((error) => {
        alert(error)
      })
      this.canUpdate = true
    },

    async organizationChange() {
      this.recordsData = []
      this.loadingType.recordsData = true
      const org = this.organizations.find(orgElem => orgElem.client_id === this.chosenOrgId)

      if (!org) {
        this.$refs.userNotification.showUserNotification('error', 'Произошла ошибка поиска организации в массиве')
        this.loadingType.recordsData = false
        return
      }

      this.variablesOfForm.orgAnfb = org.client_id
      this.variablesOfForm.orgName = org.name_podr
      this.variablesOfForm.proizvAnfb = org.proizv_id

      const customParams = {
        proizvId: org.proizv_id,
        firmaId: org.client_id,
        monthCurr: this.variablesOfForm.mesAnfb,
        yearCurr: this.variablesOfForm.godAnfb,
        priznak: 1
      }

      await this.initData(customParams)
      await this.updateRecordsData()
      this.loadingType.recordsData = false
    },

    showJournalOfSewingOrders() {
      this.$refs.userNotification.showUserNotification('success', 'Переход на форму "Журнал заказов на пошив"')
    },

    // Редактирование выбранной записи на пошив
    async editRecord() {
      if (!this.recordsSelectedRows ||
        !this.recordsSelectedRows.length) {
        return
      }

      this.orderForRecordsOfWorkOnOrder = {
        tmkId1: 0,
        colvoTmk: 0,
        zschId: 0,
        schcardsId: 0,
        schId: 0
      }
      const currentRecord = this.recordsSelectedRows[0]

      if (currentRecord.tmkId === 0) {
        const params = this.createStructureForTechTmkUpdData(currentRecord, this.variablesOfForm)
        if (!params) {
          return
        }

        let curInsTmk = null
        const response = await this.$api.service.executeStashedFunctionWithReturnedDataSet(params).catch((error) => {
          alert(error)
        })

        if (response &&
          response.length) {
          curInsTmk = response[0]
        }

        if (curInsTmk &&
          curInsTmk.tmk_id > 0) {
          this.orderForRecordsOfWorkOnOrder.tmkId1 = curInsTmk.tmk_id
          this.orderForRecordsOfWorkOnOrder.colvoTmk = curInsTmk.colvo
          this.orderForRecordsOfWorkOnOrder.zschId = curInsTmk.zar_sch_cards_id
          this.orderForRecordsOfWorkOnOrder.schcardsId = curInsTmk.scheme_cards_id
          this.orderForRecordsOfWorkOnOrder.schId = curInsTmk.scheme_id
        }
      } else {
        this.orderForRecordsOfWorkOnOrder.tmkId1 = currentRecord.tmkId
        this.orderForRecordsOfWorkOnOrder.colvoTmk = currentRecord.colvoMc
        this.orderForRecordsOfWorkOnOrder.zschId = currentRecord.zarSchCardsId
        this.orderForRecordsOfWorkOnOrder.schcardsId = currentRecord.schemeCardsId
        this.orderForRecordsOfWorkOnOrder.schId = currentRecord.schemeId
      }

      if (this.orderForRecordsOfWorkOnOrder.tmkId1 > 0) {
        await this.$refs.recordsOfWorkOnOrder.openWithObject(this.orderForRecordsOfWorkOnOrder, this.variablesOfForm, currentRecord)
      } else {
        this.$refs.userNotification.showUserNotification('success', 'Выбранная запись не подходит по условиям!')
      }
    },

    async closeRecordsOfWorkOnOrder() {
      this.recordsSelectedRows = []
      await this.initData()
      await this.updateRecordsData()
    },

    updateInfo() {
      console.log('enter pressed')
    },

    async updateRecordsInfo() {
      const filterItem = {
        numZkzpsv: this.numberOfOrder,
        numZaivk: this.numberOfApplication,
        mcId: this.code,
        posledCode: this.TP
      }

      const filterEntityForSave = this.createFilterEntityForSave(this.elementId, this.$route.name, filterItem,
        this.getCurrentUser.id, this.getCurrentUser.id)

      await this.$api.uiSettings.save(filterEntityForSave)
      this.updateRecordsDataWithUserCriterias = true
      this.updateRecordsData()
    },

    updateRecordsInfoWithoutUserCriterias() {
      this.updateRecordsDataWithUserCriterias = false
      this.updateRecordsData()
    },

    getTenLastYears() {
      let year = new Date().getFullYear()
      this.years.push(year)
      for (let i = 0; i < 10; i++) {
        const yearForPush = year - 1
        year = yearForPush
        this.years.push(yearForPush)
      }
    },

    // Переход к новому периоду
    async goToNewPeriod() {
      this.goToNewPeriodDialog = false
      this.$refs.loadingDialog.showLoadingDialog('Производится переход к новому периоду, подождите...')
      const paramsForProcedure = {}

      if (this.variablesOfForm.mesAnfb === 12) {
        paramsForProcedure.newGod = this.variablesOfForm.godAnfb + 1
        paramsForProcedure.newMes = 1
      } else {
        paramsForProcedure.newGod = this.variablesOfForm.godAnfb
        paramsForProcedure.newMes = this.variablesOfForm.mesAnfb + 1
      }

      const params = this.createStructureForTechZarplSetPeriod(this.variablesOfForm, paramsForProcedure)
      await this.$api.service.executeStashedFunction(params).catch((error) => {
        alert(error)
        this.$refs.loadingDialog.closeLoadingDialog()
      })

      await this.findMonthOfProizv()
      await this.initData()
      await this.updateRecordsData()

      this.$refs.userNotification.showUserNotification('success', 'Переход к новому периоду выполнен!')
      this.$refs.loadingDialog.closeLoadingDialog()
    },

    addProductionByBranch() {
      this.$refs.userNotification.showUserNotification('success', 'Выработка по филиалу')
    },

    // Пересчет выработки за месяц
    async recalculationOfOutputForMonth() {
      this.$refs.loadingDialog.showLoadingDialog('Производится пересчет выработки за месяц, подождите...')
      const params = this.createStructureForTechZarAllPereschet(this.variablesOfForm)
      await this.$api.service.executeStashedFunction(params).catch((error) => {
        alert(error)
        this.$refs.loadingDialog.closeLoadingDialog()
      })
      await this.updateRecordsData()
      this.$refs.userNotification.showUserNotification('success', 'Пересчет выработки за месяц выполнен!')
      this.$refs.loadingDialog.closeLoadingDialog()
    },

    updateSort(byDesc, event) {
      if (byDesc === 'by') {
        this.sortBy = event
      } else if (byDesc === 'desc') {
        this.sortDesc = event
      }
      this.pageOfRecords = 0
      this.recordsData = []
      this.keyLoading = Math.random()
    },

    // Обновление таблицы "Заказы на пошив"
    updateRecordsData() {
      this.pageOfRecords = 0
      this.recordsData = []
      this.infiniteIdOfRecordsData += 1
    },

    // Поиск заказов на пошив
    async findOrdersOnTailoring($state) {
      if (!this.canUpdate) {
        return
      }

      let filtersParams
      if (this.updateRecordsDataWithUserCriterias) {
        filtersParams = await this.findUserCriteriasAndFillCriteriasFieldsOnForm()
      }

      const searchCriterias = this.createCriteriasToSearchOrdersOnTailoringByPage(filtersParams)
      const params = {
        searchCriterias,
        page: this.pageOfRecords,
        orders: this.handleSortData,
        size: 200
      }

      const { content } = await this.$api.manufacturing.findPageBySearchCriterias(params)

      if (content.length > 0) {
        this.pageOfRecords += 1
        this.recordsData.push(...content)

        $state.loaded()
      } else {
        $state.complete()
      }
    },

    async findUserCriteriasAndFillCriteriasFieldsOnForm() {
      let filtersParams
      const paramsToSearchUserCriterias = this.createCriteriasToSearchForFiltersValues(this.$route.name,
        this.getIdOfRecordsTableOfRecordsOfWorkByCards(), this.getCurrentUser.id)
      const response = await this.$api.uiSettings.findBySearchCriterias(paramsToSearchUserCriterias)

      if (response.length) {
        filtersParams = JSON.parse(response[0].settingValue)
        this.numberOfOrder = filtersParams.numZkzpsv
        this.numberOfApplication = filtersParams.numZaivk
        this.code = filtersParams.mcId
        this.TP = filtersParams.posledCode
      }

      return filtersParams
    }
  }
}
</script>

<style lang="scss">
.records-of-work-by-cards-main-div {
  margin: 10px;
}

.records-of-work-by-cards-v-subheader {
  display: flex;
  height: 48px;
  font-size: 0.875rem;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  padding: 0 16px 0 16px;
}

.records-of-work-by-cards-label {
  margin-right: 10px;
  margin-top: 5px
}

.records-of-work-by-cards-header-btn {
  margin-top: 12px
}

.records-of-work-by-cards-btn {
  padding-top: 10px;
  margin-right: 10px;
  margin-top: 5px
}

.records-of-work-by-cards-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
  min-width: 100%;
}

.records-of-work-by-cards-autocomplete-organizations {
  width: 340px;
  margin-right: 10px;
  margin-top: 5px
}

.records-of-work-by-cards-autocomplete-month {
  width: 250px;
  margin-right: 10px;
  margin-top: 5px
}

.records-of-work-by-cards-autocomplete-year {
  width: 125px;
  margin-right: 10px;
  margin-top: 5px
}

.records-of-work-by-cards-indentation-for-inputs {
  margin-right: 10px;
  width: 64px;
}

.records-of-work-by-cards-bottom-spacer {
  flex: 0 0 10%;
  max-width: 35%;
}

#records-of-work-by-cards-table-of-records {
  border-collapse: collapse;
  width: 100%;
  height: 750px;
}

#records-of-work-by-cards-table-of-records table {
  width: 100%;
}

#records-of-work-by-cards-table-of-records td, #records-of-work-by-cards-table-of-records th {
  border: 1px solid #ddd;
  word-break: break-all !important;
  padding: 0 0 !important;
  height: 0 !important;
}

#records-of-work-by-cards-table-of-records th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

.records-of-work-by-cards-td-white-background-class {
  background-color: white;
}

.records-of-work-by-cards-td-green-background-class {
  background-color: green;
}

.records-of-work-by-cards-table-of-records-cell-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 1px;
}

.records-of-work-by-cards-table-of-records-checkbox {
  margin:0;
  padding:0;
}
</style>
