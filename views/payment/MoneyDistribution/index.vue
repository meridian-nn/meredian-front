<template>
  <v-card>
    <v-card-text class="money-distribution-card-text">
      <v-container
        class="money-distribution-container"
      >
        <v-row>
          <v-col
            cols="10"
          >
            <div
              align="center"
              class="headline"
            >
              Распределение ДС по подразделениям
            </div>
          </v-col>

          <v-col cols="2">
            <v-text-field
              v-model="date"
              type="date"
              @input="updateAllInfo()"
            />
          </v-col>
        </v-row>

        <v-row class="budget-for-distribution-border-bottom">
          <v-col cols="3" />

          <v-col
            cols="9"
          >
            <v-row
              align="center"
              justify="center"
            >
              <v-col
                cols="3"
                class="budget-for-distribution-text"
              >
                <div
                  align="left"
                >
                  Бюджет для распределения
                </div>
              </v-col>

              <v-col
                cols="3"
                class="budget-for-distribution-sum"
              >
                <v-text-field
                  v-model.number="budgetDistributionSum"
                  type="number"
                  min="0"
                />
              </v-col>

              <v-col
                cols="2"
                class="not-allocated-text"
              >
                <div
                  align="right"
                >
                  Не распределено
                </div>
              </v-col>

              <v-col
                cols="4"
                class="not-allocated-sum"
              >
                <v-subheader
                  class="font-weight-medium text-subtitle-1"
                >
                  {{ budgetDistributedSum }}
                </v-subheader>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <div id="departmentsDataTable">
              <v-client-table
                v-model="departmentsDataTable"
                :loading="loadingType.departments"
                :columns="departmentsColumns"
                :options="departmentsOptions"
              />
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="2" />

          <v-col cols="8">
            <v-row
              align="center"
              justify="center"
            >
              <v-col
                class="dep-col"
                cols="3"
              >
                <v-autocomplete
                  v-model="selectedDep"
                  label="Отдел"
                  :loading="loadingType.departments"
                  :items="departments"
                  item-value="id"
                  item-text="nameViddoc"
                  outlined
                  hide-details="auto"
                  @change="departmentChange"
                />
              </v-col>

              <v-col
                cols="2"
                class="dep-for-distribution-text"
              >
                <div
                  align="right"
                >
                  Выделено
                </div>
              </v-col>

              <v-col
                cols="3"
                class="dep-for-distribution-sum"
              >
                <v-text-field
                  v-model.number="depDistributionSum"
                  type="number"
                  min="0"
                />
              </v-col>

              <v-col
                cols="2"
                class="not-allocated-dep-text"
              >
                <div
                  align="right"
                >
                  Не распределено
                </div>
              </v-col>

              <v-col
                cols="2"
                class="not-allocated-dep-sum"
              >
                <v-subheader
                  class="font-weight-medium text-subtitle-1"
                >
                  <div :class=" {'text-danger': notDistributedLessThenZero}">
                    {{ departmentRestDistributionSum }}
                  </div>
                </v-subheader>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="2" />
        </v-row>

        <v-row>
          <v-col cols="12">
            <div
              id="moneyDistributionData"
            >
              <v-client-table
                v-model="moneyDistributionData"
                :columns="columns"
                :options="options"
              >
                <input
                  slot="distributionSum"
                  v-model.number="row.distributionSum"
                  slot-scope="{row, update}"
                  type="number"
                  min="0"
                  @input="update(row.distributionSum)"
                >
                <input
                  slot="note"
                  v-model="row.note"
                  slot-scope="{row, update}"
                  type="text"
                  @input="update(row.note)"
                >
              </v-client-table>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="3" />

          <v-col
            cols="3"
            class="money-distribution-save-button"
          >
            <div
              align="center"
              class="headline"
            >
              <v-btn
                @click="save"
              >
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
        </v-row>

        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),

      // объект для отображения загрузки данных для полей
      loadingType: {},

      // объект с информацией о выделенном бюджете на выбранную дату
      budget: {},
      // сумма выделенного бюджета на текущую дату
      budgetDistributionSum: null,
      // сумма распределенного бюджета на текущую дату
      budgetDistributedSum: null,

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
      }
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
    /* calcBudgetDistributedSum() {
      this.budgetDistributedSum = (this.budgetDistributionSum - this.budget.distributedSum) - this.depDistributionSum
    }, */

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
      const arrayOfPromises = []
      departments.forEach((dep) => {
        const response = this.getInfoAboutDepById(dep.id)
        arrayOfPromises.push(response)
      })
      await Promise.all(arrayOfPromises).then((results) => {
        results.forEach((result) => {
          const distSum = !result.distributionSum ? 0 : result.distributionSum
          const distributedSum = !result.distributedSum ? 0 : result.distributedSum
          const notDistSum = distSum - distributedSum
          departmentsDataTable.push({
            name: result.department.nameViddoc,
            distributionSum: distSum,
            notDistributedSum: notDistSum
          })
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
      this.moneyDistributionData = await this.$api.payment.moneyDistributionByDepartments.findForEdit(data)
      // this.findBudgetByDate()
    },

    // Обработка события сохранения распределения бюджетов на форме
    async save() {
      this.budget.distributionSum = this.budgetDistributionSum
      this.budget.distributedSum = this.budgetDistributedSum
      this.budget.distributionDate = this.getDateForSave()

      // Сохранение распределения бюджета на отделы
      await this.$axios.$post('/oper/depMoneyDistribution/save', [this.budget])

      if (this.department.department) {
        this.department.distributionSum = this.depDistributionSum || 0
        this.department.distributedSum = this.depDistributedSum || 0

        // Сохранение распределения бюджета на выбранный отдел
        await this.$axios.$post('/oper/depMoneyDistribution/save', [this.department])
        console.log(this.department)
        this.findByDepartmentId(this.department.department.id)

        // Сохранение распределения бюджета на подразделения отдела
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
.money-distribution-save-button{
  padding-left: 0px;
}
.money-distribution-cancel-button{
  padding-left: 0px;
}
.money-distribution-container{
  max-width: none;
}
.money-distribution-table{
  min-width: 1200px;
}
.budget-for-distribution-text{
  padding-left: 0px;
  padding-right: 8px;
  font-weight: 500 !important;
  font-size: 1rem !important;
}
.budget-for-distribution-sum{
  padding-left: 0px;
  padding-right: 0px;
}
.budget-for-distribution-border-bottom {
  padding-bottom: 15px;
  position: relative;
  flex-wrap: nowrap;
}
.budget-for-distribution-border-bottom::after {
    content: '';
    position: absolute;
    bottom: 8px;
    left: 30px;
    right: 10px;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.4);
  }
.dep-for-distribution-text{
  padding-left: 0px;
  padding-right: 16px;
  font-weight: 500 !important;
  font-size: 1rem !important;
}
.dep-for-distribution-sum{
  padding-left: 0px;
  padding-right: 0px;
}
.not-allocated-text{
  padding-left: 0px;
  padding-right: 0px;
  font-weight: 500 !important;
  font-size: 1rem !important;
}
.not-allocated-sum{
  padding-left: 0px;
  padding-right: 0px;
}
.not-allocated-dep-text{
  padding-left: 0px;
  padding-right: 0px;
  font-weight: 500 !important;
  font-size: 1rem !important;
}
.not-allocated-dep-sum{
  padding-left: 0px;
  padding-right: 0px;
}
.money-distribution-card-text{
  min-height: 750px;
  padding: 0px;
}

.dep-tree-col{
  padding-top:0px;
}
.dep-col{
  padding-left:0px;
  padding-top:0px;
}
.zero-padding{
  padding-left: 0px;
  padding-right: 0px;
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
  padding: 8px;
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
  padding: 8px;
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
.text-danger {
  color: red;
}
</style>
