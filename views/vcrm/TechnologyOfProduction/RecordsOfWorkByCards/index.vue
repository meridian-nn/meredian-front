<template>
  <div class="records-of-work-by-cards-main-div">
    <div class="records-of-work-by-cards-row">
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
          item-text="clName"
          hide-details="auto"
          outlined
        />
      </div>

      <div class="records-of-work-by-cards-btn">
        <v-btn @click="goToNewPeriod">
          Перейти к новому периоду
        </v-btn>
      </div>
    </div>

    <div class="records-of-work-by-cards-row">
      <div class="records-of-work-by-cards-label">
        <v-subheader class="font-weight-medium text-subtitle-1">
          № заказа
        </v-subheader>
      </div>

      <div class="records-of-work-by-cards-indentation-for-inputs ">
        <v-text-field
          v-model.number="numberOfOrder"
          hide-details="auto"
        />
      </div>

      <div class="records-of-work-by-cards-label">
        <v-subheader class="font-weight-medium text-subtitle-1">
          № заявки
        </v-subheader>
      </div>

      <div class="records-of-work-by-cards-indentation-for-inputs ">
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

      <div class="records-of-work-by-cards-indentation-for-inputs ">
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
        <v-btn @click="addProductionByBranch">
          Занести выработку по филиалу
        </v-btn>
      </div>

      <div class="records-of-work-by-cards-btn">
        <v-btn @click="recalculationOfOutputForMonth">
          Пересчет выработки за месяц
        </v-btn>
      </div>

      <div class="records-of-work-by-cards-row">
        <v-data-table
          id="records-of-work-by-cards-table-of-records"
          v-model="recordsSelectedRows"
          :headers="recordsHeaders"
          fixed-header
          :items="recordsData"
          :show-select="true"
          :single-select="false"
          disable-pagination
          hide-default-footer
          class="elevation-1"
        >
          <template #body="{ items }">
            <tbody>
              <tr
                v-for="item in items"
                :key="item.id"
                :value="item"
              >
                <td>
                  <v-checkbox
                    v-model="recordsSelectedRows"
                    :value="item"
                    hide-details
                  />
                </td>
                <td>
                  {{ item.order }}
                </td>
                <td>
                  {{ item.TP }}
                </td>
                <td>
                  {{ item.nameOfTP }}
                </td>
                <td>
                  {{ item.count }}
                </td>
                <td>
                  {{ item.example }}
                </td>
                <td>
                  {{ item.ratio }}
                </td>
                <td>
                  {{ item.code }}
                </td>
                <td>
                  {{ item.nameOfItem }}
                </td>
                <td>
                  {{ item.application }}
                </td>
                <td>
                  {{ item.separationScheme }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>

        <user-notification ref="userNotification" />
      </div>
    </div>
  </div>
</template>

<script>
import UserNotification from '~/components/information_window/UserNotification'
export default {
  name: 'RecordsOfWorkByCards',

  components: {
    UserNotification
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
          value: 'order',
          width: '64px'
        },
        {
          text: 'ТП',
          value: 'TP',
          width: '40px'
        },
        {
          text: 'Наименование ТП',
          value: 'nameOfTP',
          width: '100px'
        },
        {
          text: 'Количество',
          value: 'count',
          width: '30px'
        },
        {
          text: 'Образец',
          value: 'example',
          width: '30px'
        },
        {
          text: 'Коэффициент',
          value: 'ratio',
          width: '35px'
        },
        {
          text: 'Код',
          value: 'code',
          width: '40px'
        },
        {
          text: 'Наименование изделия',
          value: 'nameOfItem',
          width: '100px'
        },
        {
          text: 'Заявка',
          value: 'application',
          width: '30px'
        },
        {
          text: 'Схема разделения',
          value: 'separationScheme',
          width: '70px'
        }
      ],

      recordsData: []
    }
  },

  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.findOrganizations()
      this.getTenLastYears()
    },

    getTenLastYears() {
      let year = new Date().getFullYear()
      for (let i = 0; i < 10; i++) {
        const yearForPush = year - 1
        year = yearForPush
        this.years.push(yearForPush)
      }
    },

    // поиск организаций для выбора пользователем
    async findOrganizations() {
      this.loadingType.organizations = true
      this.organizations = await this.$api.organizations.findInternalOrganizations()
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
  width:400px;
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
  width: 190px;
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

#records-of-work-by-cards-table-of-records   tr:nth-child(even){background-color: #f2f2f2;}

#records-of-work-by-cards-table-of-records   tr:hover {background-color: #ddd;}

#records-of-work-by-cards-table-of-records  th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}
</style>
