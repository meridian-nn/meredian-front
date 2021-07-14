<template>
  <div
    v-if="isRecordsOfWorkByCards"
    class="records-of-work-by-cards-main-div"
  >
    <div class="records-of-work-by-cards-row">
      <div class="records-of-work-by-cards-header-btn">
        <v-btn
          color="blue"
          class="mx-2"
          fab
          dark
          x-small
          @click="showJournalOfSewingOrders"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
      </div>

      <div class="records-of-work-by-cards-header-btn">
        <v-btn
          color="blue"
          class="mx-2"
          fab
          dark
          x-small
          @click="editRecord"
        >
          <v-icon dark>
            mdi-file-edit
          </v-icon>
        </v-btn>
      </div>

      <div class="records-of-work-by-cards-label">
        <v-subheader class="font-weight-medium text-subtitle-1">
          Месяц
        </v-subheader>
      </div>

      <div class="records-of-work-by-cards-autocomplete-month">
        <v-autocomplete
          v-model="chosenMonth"
          :loading="loadingType.suppliers"
          :items="months"
          item-value="id"
          item-text="name"
          hide-details="auto"
          :auto-select-first="true"
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
          :auto-select-first="true"
          outlined
        />
      </div>

      <div class="records-of-work-by-cards-autocomplete-organizations">
        <v-autocomplete
          v-model="chosenOrg"
          :loading="loadingType.organizations"
          :items="organizations"
          item-value="id"
          item-text="name_podr"
          hide-details="auto"
          outlined
        />
      </div>

      <div class="records-of-work-by-cards-btn">
        <v-btn @click="goToNewPeriod">
          Перейти к новому периоду
        </v-btn>
      </div>

      <div class="records-of-work-by-cards-btn">
        <v-btn @click="recalculationOfOutputForMonth">
          Пересчет выработки за месяц
        </v-btn>
      </div>
    </div>

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
          <v-icon>mdi-binoculars</v-icon> без отбора
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
                <td>
                  {{ item.namePosled }}
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
                <td>
                  {{ item.nameMc }}
                </td>
                <td>
                  {{ item.numZaivk }}
                </td>
                <td>
                  {{ item.nameScheme }}
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
import UserNotification from '~/components/information_window/UserNotification'
export default {
  name: 'RecordsOfWorkByCards',

  components: {
    UserNotification,
    InfiniteLoading
  },

  data() {
    return {
      loadingType: {},

      months: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
      ],

      chosenMonth: {},

      years: [],

      chosenYear: {},

      chosenOrg: {},

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
          value: 'namePosled',
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

      updateRecordsDataWithUserCriterias: true
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
    init() {
      this.elementId = this.getIdOfRecordsTableOfRecordsOfWorkByCards()
      this.findOrganizations()
      this.getTenLastYears()
    },

    showJournalOfSewingOrders() {
      this.$refs.userNotification.showUserNotification('success', 'Переход на форму "Журнал заказов на пошив"')
    },

    editRecord() {
      this.$router.push({ name: 'RecordsOfWorkOnOrder' })
      this.$refs.userNotification.showUserNotification('success', 'Редактирование текущей записи')
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

    // поиск организаций для выбора пользователем
    async findOrganizations() {
      this.loadingType.organizations = true
      const searchCriterias = this.createCriteriasToSearchOrgForRecordsOfWorkByCardsForm()
      this.organizations = await this.$api.service.executeStashedFunctionWithReturnedDataSet(searchCriterias)
      // await this.$api.organizations.findInternalOrganizations()
      this.loadingType.organizations = null
    },

    goToNewPeriod() {
      this.$refs.userNotification.showUserNotification('success', 'Переход к новому периоду')
    },

    addProductionByBranch() {
      this.$refs.userNotification.showUserNotification('success', 'Выработка по филиалу')
    },

    recalculationOfOutputForMonth() {
      this.$refs.userNotification.showUserNotification('success', 'Пересчет выработки за месяц')
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

    async findOrdersOnTailoring($state) {
      let filtersParams
      if (this.updateRecordsDataWithUserCriterias) {
        filtersParams = await this.findUserCriteriasAndFillCriteriasFieldsOnForm()
      }

      const searchCriterias = this.createCriteriasToSearchOrdersOnTailoringByPage(filtersParams)
      const params = { searchCriterias, page: this.pageOfRecords, orders: this.handleSortData }

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
.records-of-work-by-cards-main-div{
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
  width:340px;
  margin-right: 10px;
  margin-top: 5px
}

.records-of-work-by-cards-autocomplete-month {
  width:250px;
  margin-right: 10px;
  margin-top: 5px
}

.records-of-work-by-cards-autocomplete-year {
  width:125px;
  margin-right: 10px;
  margin-top: 5px
}

.records-of-work-by-cards-indentation-for-inputs {
  margin-right: 10px;
  width: 64px;
}

.records-of-work-by-cards-bottom-spacer{
  flex: 0 0 10%;
  max-width: 35%;
}

#records-of-work-by-cards-table-of-records {
  border-collapse: collapse;
  width: 100%;
  height: 750px;
}

#records-of-work-by-cards-table-of-records   table{
  width: 100%;
}
#records-of-work-by-cards-table-of-records   td, #records-of-work-by-cards-table-of-records   th {
  border: 1px solid #ddd;
  word-break:break-all !important;
  padding: 0 0 !important;
  height: 0 !important;
}

#records-of-work-by-cards-table-of-records  th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

.records-of-work-by-cards-td-white-background-class{
  background-color: white;
}

.records-of-work-by-cards-td-green-background-class{
  background-color: green;
}
</style>
