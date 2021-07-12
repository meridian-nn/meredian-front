<template>
  <div class="record-of-work-on-order-main-div">
    <div class="record-of-work-on-order-row">
      <div class="record-of-work-on-order-label">
        <v-subheader class="font-weight-medium text-subtitle-1">
          Месяц
        </v-subheader>
      </div>

      <div class="record-of-work-on-order-autocomplete-month">
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

      <div class="record-of-work-on-order-label">
        <v-subheader class="font-weight-medium text-subtitle-1">
          Год
        </v-subheader>
      </div>

      <div class="record-of-work-on-order-autocomplete-year">
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

      <div class="record-of-work-on-order-label">
        <v-subheader class="font-weight-medium text-subtitle-1">
          Производство:
        </v-subheader>
      </div>

      <div class="record-of-work-on-order-autocomplete-organizations">
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
    </div>
  <user-notification ref="userNotification" />
  </div>
</template>
<script>
import UserNotification from '~/components/information_window/UserNotification'
export default {
  name: 'RecordOfWorkOnOrder',

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
      organizations: []
    }
  },

  methods: {
    init() {
      this.findOrganizations()
      this.getTenLastYears()
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
      this.loadingType.organizations = null
    }
  }
}
</script>

<style lang="scss">
.record-of-work-on-order-main-div{
  margin: 10px;
}

.record-of-work-on-order-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
  min-width: 100%;
}

.record-of-work-on-order-label {
  margin-right: 10px;
  margin-top: 5px
}

.record-of-work-on-order-autocomplete-month {
  width:250px;
  margin-right: 10px;
  margin-top: 5px
}

.record-of-work-on-order-autocomplete-year {
  width:125px;
  margin-right: 10px;
  margin-top: 5px
}

.record-of-work-on-order-autocomplete-organizations {
  width:400px;
  margin-right: 10px;
  margin-top: 5px
}
</style>
