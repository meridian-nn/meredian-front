<template>
  <div class="money-distribution-main-div">
    <div class="money-distribution-row">
      <div
        align="center"
        class="money-distribution-main-row-headline"
      >
        Распределение ДС по подразделениям
      </div>

      <div class="money-distribution-date">
        <v-text-field
          v-model="date"
          type="date"
          @input="updateAllInfo()"
        />
      </div>
    </div>

    <div class="money-distribution-row-budget-for-distribution-border-bottom">
      <div class="money-distribution-budget-for-distribution-spacer" />

      <div class="money-distribution-budget-for-distribution-text">
        Бюджет для распределения
      </div>

      <div class="money-distribution-budget-for-distribution-sum">
        <div class="money-distribution-brise-input">
          <vue-numeric
            v-model.number="budgetDistributionSum"
            separator="space"
            :precision="2"
            decimal-separator="."
          />
          <span class="line" />
        </div>
      </div>

      <div class="money-distribution-not-allocated-text">
        Не распределено
      </div>

      <div class="money-distribution-not-allocated-sum">
        <v-subheader class="font-weight-medium text-subtitle-1">
          <vue-numeric
            :value="budgetNotDistributedSum"
            separator="space"
            :precision="2"
            decimal-separator="."
            output-type="number"
            :read-only="true"
          />
        </v-subheader>
      </div>

      <div class="money-distribution-budget-for-distribution-spacer-menu" />
    </div>

    <div class="money-distribution-row">
      <div id="departmentsDataTable">
        <v-client-table
          v-model="departmentsDataTable"
          :loading="loadingType.departments"
          :columns="departmentsColumns"
          :options="departmentsOptions"
        />
      </div>
    </div>

    <div class="money-distribution-row">
      <div
        class="money-distribution-table-total-text-for-dep"
      >
        Итого
      </div>

      <div
        class="money-distribution-table-total-val"
      >
        <vue-numeric
          :value="totalSumOfDistributionSum"
          separator="space"
          :precision="2"
          decimal-separator="."
          output-type="number"
          :read-only="true"
        />
      </div>
    </div>

    <div class="money-distribution-dep-row">
      <div class="money-distribution-dep-col">
        <v-autocomplete
          v-model="selectedDepId"
          label="Отдел"
          :loading="loadingType.departments"
          :items="departments"
          item-value="id"
          item-text="nameViddoc"
          hide-details="auto"
          outlined
          @change="departmentChange"
        />
      </div>

      <div class="money-distribution-dep-for-distribution-text">
        Выделено
      </div>

      <div
        class="money-distribution-dep-for-distribution-sum"
      >
        <div class="money-distribution-brise-input">
          <vue-numeric
            v-model.number="depDistributionSum"
            separator="space"
            :precision="2"
            decimal-separator="."
            output-type="number"
          />
          <span class="line" />
        </div>
      </div>

      <div class="money-distribution-not-allocated-dep-text">
        Не распределено
      </div>

      <div class="money-distribution-not-allocated-dep-sum">
        <v-subheader class="font-weight-medium text-subtitle-1">
          <div :class=" {'money-distribution-text-danger': notDistributedLessThenZero}">
            <vue-numeric
              :value="departmentRestDistributionSum"
              separator="space"
              :precision="2"
              decimal-separator="."
              output-type="number"
              :read-only="true"
            />
          </div>
        </v-subheader>
      </div>
    </div>

    <div class="money-distribution-dep-row">
      <div id="moneyDistributionData">
        <v-client-table
          ref="table"
          v-model="moneyDistributionData"
          :columns="columns"
          :options="options"
        >
          <vue-numeric
            slot="distributionSum"
            :key="row.id"
            v-model="row.distributionSum"
            slot-scope="{row, update}"
            separator="space"
            :precision="2"
            decimal-separator="."
            output-type="number"
            @input="update(row.distributionSum)"
          />
          <input
            slot="note"
            v-model="row.note"
            slot-scope="{row, update}"
            type="text"
            @input="update(row.note)"
          >
        </v-client-table>
      </div>

      <div
        v-if="moneyDistributionData.length > 0"
        class="money-distribution-table-total-text"
      >
        Итого
      </div>

      <div
        v-if="moneyDistributionData.length > 0"
        class="money-distribution-table-total-val"
      >
        <vue-numeric
          :value="departmentRestDistributionTotal"
          separator="space"
          :precision="2"
          decimal-separator="."
          output-type="number"
          :read-only="true"
        />
      </div>
    </div>

    <div class="money-distribution-dep-row">
      <v-col cols="3" />

      <v-col
        cols="3"
        class="money-distribution-save-button"
      >
        <div
          align="center"
          class="headline"
        >
          <v-btn @click="save">
            Сохранить
          </v-btn>
        </div>
      </v-col>

      <v-col
        cols="3"
        class="money-distribution-cancel-button"
      >
        <div
          align="center"
          class="headline"
        >
          <v-btn
            @click="cancel"
          >
            Отмена
          </v-btn>
        </div>
      </v-col>

      <v-col cols="3" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MoneyDistribution',

  data() {
    return {
      date: new Date().toISOString().substr(0, 10),

      // объект для отображения загрузки данных для полей
      loadingType: {},

      // объект с информацией о выделенном бюджете на выбранную дату
      budget: {},
      // сумма выделенного бюджета на выбранную дату
      budgetDistributionSum: 0,

      // сумма распределенного бюджета на выбранную дату
      budgetNotDistributedSum: 0,

      // id выбранного отдела
      selectedDepId: null,

      // выбранный отдел с информацией по бюджету
      selectedDepartment: {},

      // сумма выделенного бюджета на отделу
      depDistributionSum: 0,

      // сумма распределенного бюджета по отделу
      depDistributedSum: 0,

      // признак, показывающий что не распределенный бюджет по отделу меньше 0
      notDistributedLessThenZero: false,

      // массив отделов для выбора пользователем
      departments: [],

      // таблица данных по распределению бюджета по подразделениям выбранного отдела
      moneyDistributionData: [],
      columns: ['department.nameViddoc', 'distributionSum', 'note'],
      options: {
        filterable: false,
        pagination: { show: false },
        texts: { noResults: '' },
        caption: false,
        filterByColumn: false,
        perPage: 15,
        dateFormat: 'YYYY-MM-DD',
        editableColumns: ['distributionSum', 'note'],
        headings: {
          'department.nameViddoc': 'Подразделение',
          distributionSum: 'Сумма',
          note: 'Примечание'
        },
        datepickerOptions: {
          showDropdowns: true,
          autoUpdateInput: true
        },
        uniqueKey: 'keyId'
      },

      // таблица данных по распределению общего бюджета по отделам
      departmentsDataTable: [],
      departmentsColumns: ['name', 'distributionSumMask', 'notDistributedSumMask'],
      departmentsOptions: {
        filterable: false,
        pagination: { show: false },
        texts: { noResults: '' },
        filterByColumn: false,
        headings: {
          name: 'Отдел',
          distributionSumMask: 'Выделено',
          notDistributedSumMask: 'Не распределено'
        }
      }
    }
  },
  computed: {
    // функция для расчета суммы не распределенного бюджета на отдел
    departmentRestDistributionSum() {
      const notDistributed = (this.depDistributionSum - this.depDistributedSum)
      this.notDistributedLessThenZero = (notDistributed < 0)

      return notDistributed
    },

    departmentRestDistributionTotal() {
      return this.depDistributionSum - this.departmentRestDistributionSum
    },

    totalSumOfDistributionSum() {
      return this.departmentsDataTable.reduce((acc, item) => {
        return acc + Number(item.distributionSum) || 0
      }, 0)
    }
  },
  watch: {
    moneyDistributionData: {
      handler() {
        this.calcDepDistributedSum()
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },

  methods: {
    // Расчет распределеной суммы по отделу
    calcDepDistributedSum() {
      this.depDistributedSum = this.moneyDistributionData.length === 0
        ? 0
        : this.moneyDistributionData.reduce((acc, item) => { return acc + item.distributionSum || 0 }, 0)
    },

    async init() {
      await this.findDepartments()
      this.selectedDepartment = {}
      await this.findDepOfCurrentUser()
      await this.findBudgetByDate()
    },

    findDepOfCurrentUser() {
      const currentUser = this.getCurrentUser
      if (currentUser.department) {
        this.selectedDepId = currentUser.department.id
      }
    },

    // Обновление информации на форме при изменении даты
    async updateAllInfo() {
      await this.init()

      if (this.selectedDepId) {
        await this.departmentChange(this.selectedDepId)
      }
    },

    // Поиск бюджета на распределение на выбранную дату
    async findBudgetByDate() {
      const searchCriterias = this.createCriteriasForSearchBudgetByDate(this.date)
      const response = await this.$api.payment.moneyDistributionByDepartments.findBySearchCriterias(searchCriterias)
      if (response.length === 0) {
        this.budgetDistributionSum = 0
        this.budgetNotDistributedSum = 0 - this.calcTotalOfDistributionSumByDep()
      } else {
        this.budget = response[0]

        if (this.budget.distributionSum) {
          this.budgetDistributionSum = this.budget.distributionSum
        } else {
          this.budgetDistributionSum = 0
        }

        this.budgetNotDistributedSum = this.budget.distributionSum - this.calcTotalOfDistributionSumByDep()
      }
    },

    calcTotalOfDistributionSumByDep() {
      return this.departmentsDataTable.reduce((acc, item) => {
        return acc + Number(item.distributionSum) || 0
      }, 0)
    },

    // Поиск отделов для выбора пользователем на форме
    async findDepartments() {
      if (!this.departments.length) {
        this.loadingType.departments = true
        const searchCriterias = this.createCriteriaToSearchMainDepartments()
        this.departments = await this.$api.budgetElements.findDepartmentsBySearchCriterias(searchCriterias)
        this.loadingType.departments = null
      }

      this.departmentsDataTable = await this.findInfoForDepDataTable()
    },

    // Поиск информации о бюджетах всех отделов для демонстрации в таблице departmentsDataTable
    async findInfoForDepDataTable(departments = this.departments) {
      const searchCriteriasForMoneyDistrByDeps = this.createCriteriasToSearchMoneyDistributionByDepartments(this.date, departments)
      // eslint-disable-next-line vue/max-len
      const moneyDistrByDepsResponse = await this.$api.payment.moneyDistributionByDepartments.findBySearchCriterias(searchCriteriasForMoneyDistrByDeps)

      const searchCriteriasForMoneyDistrByDivisions = this.createParamsToSearchMoneyDistributionByDepParents(this.date, departments)
      const moneyDistrByDivisionsResponse = await this.$api.payment.moneyDistributionByDepartments.groupBy(searchCriteriasForMoneyDistrByDivisions)
      return this.convertMoneyDistributionByDepToDataForTable(moneyDistrByDepsResponse, moneyDistrByDivisionsResponse, departments)
    },

    // Обработка события "Выбор отдела пользователем на форме"
    async departmentChange(depId) {
      await this.findByDepartmentId(depId)
      await this.loadMoneyDistribution(depId)

      this.depDistributedSum = this.selectedDepartment.distributedSum
      this.depDistributionSum = this.selectedDepartment.distributionSum
    },

    // Поиск информации по выбранному подразделению
    async findByDepartmentId(depId) {
      const searchCriterias = this.createCriteriasToSearchMoneyDistributionByDepId(depId, this.date)
      const response = await this.$api.payment.moneyDistributionByDepartments.findBySearchCriterias(searchCriterias)

      if (response.length > 0) {
        this.selectedDepartment = response[0]
      } else {
        this.selectedDepartment = {
          department: {
            id: this.selectedDepId
          },
          distributionDate: this.getDateForSave(),
          distributionSum: 0,
          distributedSum: 0
        }
      }
    },

    // Поиск информации о распределении бюджета на подразделения выбранного отдела
    async loadMoneyDistribution(depParentId) {
      const searchCriteriasForDivisions = this.createCriteriasToSearchDivisions(depParentId)
      const divisions = await this.$api.budgetElements.findDepartmentsBySearchCriterias(searchCriteriasForDivisions)
      const searchCriteriasForMoneyDistribution = this.createCriteriasToSearchMoneyDistributionByDepParentId(depParentId, this.date)
      const moneyDistributionByDivisions = await this.$api.payment.moneyDistributionByDepartments.findBySearchCriterias(
        searchCriteriasForMoneyDistribution)
      // eslint-disable-next-line vue/max-len
      this.moneyDistributionData = this.convertMoneyDistributionsByDivisionsInDataForTable(divisions, moneyDistributionByDivisions, this.getDateForSave())
    },

    // Обработка события сохранения распределения бюджетов на форме
    async save() {
      this.budget.distributionSum = this.budgetDistributionSum
      this.budget.distributedSum = null
      this.budget.distributionDate = this.getDateForSave()

      // Сохранение распределения бюджета на отделы
      await this.$api.payment.moneyDistributionByDepartments.save(this.budget)

      if (this.selectedDepartment.department) {
        this.selectedDepartment.distributionSum = this.depDistributionSum || 0
        this.selectedDepartment.distributedSum = this.depDistributedSum || 0

        // Сохранение распределения бюджета на выбранный отдел
        await this.$api.payment.moneyDistributionByDepartments.save(this.selectedDepartment)

        // Сохранение распределения бюджета на подразделения отдела
        await this.$api.payment.moneyDistributionByDepartments.saveAll(this.moneyDistributionData)
      }

      await this.findDepartments()
      await this.findBudgetByDate()
      if (this.selectedDepartment.department) {
        await this.findByDepartmentId(this.selectedDepartment.department.id)
        await this.loadMoneyDistribution(this.selectedDepartment.department.id)
      }
    },

    getDateForSave() {
      return new Date(this.date).toLocaleDateString()
    },

    cancel() {
      this.updateAllInfo()
    }
  }
}
</script>

<style lang="scss">
.money-distribution-main-div {
  padding: 10px
}

.money-distribution-table-total-text {
  flex-basis: 447px;
}

.money-distribution-table-total-text-for-dep {
  flex-basis: 534px;
}

.money-distribution-main-row-headline {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.5rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
  flex: 0 0 90%;
  max-width: 90%;
}

.money-distribution-date {
  flex: 0 0 10%;
  max-width: 10%;
}

.money-distribution-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
}

.money-distribution-dep-row{
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
  padding: 10px 0;
}

.money-distribution-budget-for-distribution-row {
  align-items: center !important;
  justify-content: center !important;
  flex: 0 0 80%;
  max-width: 80%;
}

.money-distribution-row-budget-for-distribution-border-bottom {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
  padding-bottom: 15px;
  position: relative;
}

.money-distribution-row-budget-for-distribution-border-bottom::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 10px;
  right: 10px;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.4);
}

.money-distribution-budget-for-distribution-spacer {
  flex: 0 0 15%;
  max-width: 15%;
}

.money-distribution-budget-for-distribution-text{
  font-weight: 500 !important;
  font-size: 1rem !important;
  flex: 0 0 14%;
  max-width: 14%;
  margin-top: 15px;
  color: rgba(0, 0, 0, 0.6);
}

.money-distribution-budget-for-distribution-sum{
  flex: 0 0 20%;
  max-width: 20%;
  padding-left: 10px;
  padding-right: 10px;
}

.money-distribution-brise-input {
  position: relative;
  margin: 5px;
  overflow: hidden;
}

.money-distribution-brise-input input {
  width: 100%;
  padding: 10px;
  border: none;
  outline: none;
  border-bottom: 1px solid #999;
  box-sizing: border-box;
  font-size: 16px;
  position: relative;
  z-index: 5;
  background: none;
}

.money-distribution-brise-input label {
  position: absolute;
  left: 10px;
  top: 45%;
  transition: ease-out .15s;
  color: #999;
}

.money-distribution-brise-input input:valid ~ label, input:focus ~ label  {
  top: 0;
  transform: scale(0.94) translateX(-2px);
  color: #639db1;
}

.money-distribution-brise-input .line {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  background: #639db1;
  transition: .25s;
  opacity: 0;
  z-index: 6;
}

.money-distribution-brise-input input:focus ~ .line {
  left: 0;
  opacity: 1;
}

.money-distribution-not-allocated-text{
  padding-left: 0;
  padding-right: 0;
  font-weight: 500 !important;
  font-size: 1rem !important;
  flex: 0 0 10%;
  max-width: 10%;
  margin-top: 15px;
  color: rgba(0, 0, 0, 0.6);
}

.money-distribution-not-allocated-sum{
  padding-left: 0;
  padding-right: 0;
  flex: 0 0 20%;
  max-width: 20%;
  margin-top: 5px;
}

.money-distribution-budget-for-distribution-spacer-menu {
  flex: 0 0 16%;
  max-width: 16%;
}

.money-distribution-dep-for-distribution-text{
  flex: 0 0 7%;
  max-width: 7%;
  padding-right: 16px;
  font-weight: 500 !important;
  font-size: 1rem !important;
  padding-top:15px;
  color: rgba(0, 0, 0, 0.6);
}

.money-distribution-dep-for-distribution-sum{
  flex: 0 0 13%;
  max-width: 13%;
  padding-right: 10px;
}

.money-distribution-not-allocated-dep-text{
  flex: 0 0 10%;
  max-width: 10%;
  font-weight: 500 !important;
  font-size: 1rem !important;
  padding-top:15px;
  color: rgba(0, 0, 0, 0.6);
}

.money-distribution-not-allocated-dep-sum{
  flex: 0 0 15%;
  max-width: 15%;
  padding-top: 5px;
}

.money-distribution-card-text{
  min-height: 750px;
  padding: 0;
}

.money-distribution-dep-spacer {
  flex: 0 0 5%;
  max-width: 5%;
}

.money-distribution-dep-second-spacer {
  flex: 0 0 10%;
  max-width: 10%;
}

.money-distribution-dep-end-spacer {
  flex: 0 0 20%;
  max-width: 20%;
}

.money-distribution-dep-col{
  flex: 0 0 15%;
  max-width: 15%;
  padding-right: 15px;
}

.money-distribution-save-button{
  padding-left: 0;
}

.money-distribution-cancel-button{
  padding-left: 0;
}

.money-distribution-text-danger {
  color: red;
}

#moneyDistributionData {
  border-collapse: collapse;
  width: 100%;
}

#moneyDistributionData table{
  width: 100%
}

#moneyDistributionData td, #moneyDistributionData th {
  border: 1px solid #ddd;
  padding: 0;
}

#moneyDistributionData tr:nth-child(even){background-color: #f2f2f2;}

#moneyDistributionData tr:hover {background-color: #ddd;}

#moneyDistributionData th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

#departmentsDataTable {
  border-collapse: collapse;
  width: 100%;
}

#departmentsDataTable table{
  width: 100%
}

#departmentsDataTable td, #departmentsDataTable th {
  border: 1px solid #ddd;
  padding: 0;
}

#departmentsDataTable tr:nth-child(even){background-color: #f2f2f2;}

#departmentsDataTable tr:hover {background-color: #ddd;}

#departmentsDataTable th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

</style>
