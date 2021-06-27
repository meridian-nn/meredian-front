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

      <div
        class="money-distribution-budget-for-distribution-sum"
      >
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

      <div
        class="money-distribution-not-allocated-text"
      >
        Не распределено
      </div>

      <div class="money-distribution-not-allocated-sum">
        <v-subheader class="font-weight-medium text-subtitle-1">
          <vue-numeric
            v-model.number="budgetDistributedSum"
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

    <div class="money-distribution-dep-row">
      <div class="money-distribution-dep-col">
        <v-autocomplete
          v-model="selectedDep"
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
              v-model.number="departmentRestDistributionSum"
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
        class="table-total-text"
      >
        Итого
      </div>

      <div
        v-if="moneyDistributionData.length > 0"
        class="table-total-val"
      >
        <vue-numeric
          v-model.number="departmentRestDistributionTotal"
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
      // сумма выделенного бюджета на текущую дату
      budgetDistributionSum: 0,
      // сумма распределенного бюджета на текущую дату
      budgetDistributedSum: 0,

      // выбранный отдел с информацией по бюджету
      department: {},
      // сумма выделенного бюджета на отделу
      depDistributionSum: null,
      // сумма распределенного бюджета по отделу
      depDistributedSum: null,

      // признак, показывающий что не распределенный бюджет по отделу меньше 0
      notDistributedLessThenZero: false,

      // id выбранного отдела
      selectedDep: null,

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
        }
      },

      // таблица данных по распределению общего бюджета по отделам
      departmentsDataTable: [],
      departmentsColumns: ['name', 'distributionSum', 'notDistributedSum'],
      departmentsOptions: {
        filterable: false,
        pagination: { show: false },
        texts: { noResults: '' },
        filterByColumn: false,
        headings: {
          name: 'Отдел',
          distributionSum: 'Выделено',
          notDistributedSum: 'Не распределено'
        }
      },

      // Итоговая сумма по колонке "Выделено"
      totalSumOfDistributionSum: 0
    }
  },
  computed: {
    // функция для расчета суммы не распределенного бюджета на день (пока не используется)
    budgetRestDistributionSum() {
      const budgetDistributedSum = this.budget.restSum < 0 ? Math.abs(this.budget.restSum) - 1 : this.budget.restSum
      const budgetRestDistributionSum = parseInt(this.budget.distributionSum
        ? this.budget.distributionSum
        : 0) - budgetDistributedSum

      this.budget.distributedSum = budgetRestDistributionSum

      return budgetRestDistributionSum
    },

    // функция для расчета суммы не распределенного бюджета на отдел (пока не используется)
    departmentRestDistributionSum() {
      const notDistributed = (this.depDistributionSum - this.depDistributedSum)
      this.notDistributedLessThenZero = (notDistributed < 0)

      return notDistributed
    },

    departmentRestDistributionTotal() {
      return this.depDistributionSum - this.departmentRestDistributionSum
    }
  },
  watch: {
    moneyDistributionData: {
      handler() {
        this.calcDepDistributedSum()
      },
      deep: true
    }
    /* depDistributionSum: {
      handler() {
        this.calcBudgetDistributedSum()
      },
      deep: true
    } */
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

    init() {
      this.findDepartments()
      this.department = {}
      this.findBudgetByDate()
    },

    // Обновление информации на форме при изменении даты
    updateAllInfo() {
      this.init()

      if (this.selectedDep) {
        this.departmentChange(this.selectedDep)
      }
    },

    // Поиск бюджета на распределение на выбранную дату
    async findBudgetByDate() {
      const data = {
        distributionDate: new Date(this.date).toLocaleDateString()
      }
      this.budget = await this.$api.payment.moneyDistributionByDepartments.findBudgetByDate(data)
      this.budgetDistributionSum = this.budget.distributionSum
      this.budgetDistributedSum = this.budget.distributionSum - this.budget.distributedSum
    },

    // Поиск отделов для выбора пользователем на форме
    async findDepartments() {
      if (!this.departments.length) {
        this.loadingType.departments = true
        this.departments = await this.$api.budgetElements.findDepartments()
        this.loadingType.departments = null
      }
      const departments = this.departments
      this.departmentsDataTable = await this.findInfoForDepDataTable(departments)
    },

    // Поиск информации о бюджетах всех отделов для демонстрации в таблице departmentsDataTable
    async findInfoForDepDataTable(departments) {
      const departmentsDataTable = []
      this.totalSumOfDistributionSum = 0
      const arrayOfPromises = []
      departments.forEach((dep) => {
        const response = this.getInfoAboutDepById(dep.id)
        arrayOfPromises.push(response)
      })
      await Promise.all(arrayOfPromises).then((results) => {
        results.forEach((result) => {
          const distSum = !result.distributionSum ? 0 : result.distributionSum
          this.totalSumOfDistributionSum += distSum
          const distributedSum = !result.distributedSum ? 0 : result.distributedSum
          const notDistSum = distSum - distributedSum
          departmentsDataTable.push({
            name: result.department.nameViddoc,
            distributionSum: this.numberToSum(distSum),
            notDistributedSum: this.numberToSum(notDistSum)
          })
        })
        departmentsDataTable.push({
          name: 'Итого:',
          distributionSum: this.numberToSum(this.totalSumOfDistributionSum)
        })
      })
      return departmentsDataTable
    },
    async getInfoAboutDepById(id) {
      if (id) {
        const data = {
          distributionDate: new Date(this.date).toLocaleDateString(),
          departmentId: id
        }
        return await this.$api.payment.moneyDistributionByDepartments.findByDepartmentId(data)
      }
    },

    // Обработка события "Выбор отдела пользователем на форме"
    async departmentChange(val) {
      await this.findByDepartmentId(val)
      await this.loadMoneyDistribution(val)

      this.depDistributedSum = this.department.distributedSum
      this.depDistributionSum = this.department.distributionSum
    },

    // Поиск информации по выбранному подразделению
    async findByDepartmentId(id) {
      const data = {
        distributionDate: new Date(this.date).toLocaleDateString(),
        departmentId: id
      }
      this.department = await this.$api.payment.moneyDistributionByDepartments.findByDepartmentId(data)
    },

    // Поиск информации о распределении бюджета на подразделения выбранного отдела
    async loadMoneyDistribution(val) {
      const data = {
        parentId: val,
        distributionDate: new Date(this.date).toLocaleDateString()
      }

      const moneyDistributionByDepartments = await this.$api.payment.moneyDistributionByDepartments.findForEdit(data)

      this.moneyDistributionData = moneyDistributionByDepartments.map((item) => {
        return { ...item, distributionSum: 0 }
      })
    },

    // Обработка события сохранения распределения бюджетов на форме
    async save() {
      this.budget.distributionSum = this.budgetDistributionSum
      this.budget.distributedSum = this.budgetDistributedSum
      this.budget.distributionDate = this.getDateForSave()

      // Сохранение распределения бюджета на отделы
      // await this.$api.payment.moneyDistributionByDepartments.save([this.budget])
      await this.$axios.$post('/oper/depMoneyDistribution/save', [this.budget])

      if (this.department.department) {
        this.department.distributionSum = this.depDistributionSum || 0
        this.department.distributedSum = this.depDistributedSum || 0

        // Сохранение распределения бюджета на выбранный отдел
        // await this.$api.payment.moneyDistributionByDepartments.save([this.department])
        await this.$axios.$post('/oper/depMoneyDistribution/save', [this.department])

        this.findByDepartmentId(this.department.department.id)

        // Сохранение распределения бюджета на подразделения отдела
        // await this.$api.payment.moneyDistributionByDepartments.save(this.moneyDistributionData)
        await this.$axios.$post('/oper/depMoneyDistribution/save', this.moneyDistributionData)
        this.loadMoneyDistribution(this.department.department.id)

        this.findDepartments()
      }

      this.findBudgetByDate()
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

.table-total-text {
  flex-basis: 398px;
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
  margin: 0px;
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
  margin: 0px;
  padding-bottom: 15px;
  position: relative;
  flex-wrap: nowrap;
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
  padding-left: 0px;
  padding-right: 0px;
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

.money-distribution-brise-input input:focus ~ label, input:valid ~ label  {
  top: 0px;
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
  left: -999px;
  transition: .25s;
  opacity: 0;
  z-index: 6;
}

.money-distribution-brise-input input:focus ~ .line {
  left: 0;
  opacity: 1;
}

.money-distribution-brise-input label {
  position: absolute;
  left: 10px;
  top: 45%;
  transition: ease-out .15s;
  color: #999;
}

.money-distribution-not-allocated-text{
  padding-left: 0px;
  padding-right: 0px;
  font-weight: 500 !important;
  font-size: 1rem !important;
  flex: 0 0 10%;
  max-width: 10%;
  margin-top: 15px;
  color: rgba(0, 0, 0, 0.6);
}

.money-distribution-not-allocated-sum{
  padding-left: 0px;
  padding-right: 0px;
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
  padding-left: 0px;
}

.money-distribution-cancel-button{
  padding-left: 0px;
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
  padding: 0px;
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
  padding: 0px;
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
