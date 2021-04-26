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
                <v-subheader class="font-weight-medium text-subtitle-1">
                  {{ departmentRestDistributionSum }}
                </v-subheader>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="2" />
        </v-row>

        <v-row>
          <v-col cols="2" />

          <v-col cols="8">
            <div
              id="moneyDistributionData"
              align="center"
              class="headline"
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

          <v-col cols="2" />
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
      moneyDistributionData: [],
      departments: [],
      loadingType: {},
      department: {},
      depDistributedSum: null,
      depDistributionSum: null,
      budgetDistributionSum: null,
      budgetDistributedSum: null,
      selectedDep: null,
      budget: {},
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
      }
    }
  },
  computed: {
    budgetRestDistributionSum() {
      const budgetDistributedSum = this.budget.restSum < 0 ? Math.abs(this.budget.restSum) - 1 : this.budget.restSum

      const budgetRestDistributionSum = parseInt(this.budget.distributionSum
        ? this.budget.distributionSum
        : 0) - budgetDistributedSum

      this.budget.distributedSum = budgetRestDistributionSum
      return budgetRestDistributionSum
    },

    departmentRestDistributionSum() {
      return (this.depDistributionSum - this.depDistributedSum)
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
    calcDepDistributedSum() {
      this.depDistributedSum = this.moneyDistributionData.length === 0
        ? 0
        : this.moneyDistributionData.reduce((acc, item) => { return acc + item.distributionSum || 0 }, 0)
    },
    /* calcBudgetDistributedSum() {
      this.budgetDistributedSum = this.budgetDistributedSum - this.depDistributionSum
    }, */
    init() {
      this.findDepartments()
      this.department = {}
      this.findBudgetByDate()
    },
    updateAllInfo() {
      this.init()
      this.findBudgetByDate()
      console.log(this.selectedDep)
      if (this.selectedDep) {
        this.departmentChange(this.selectedDep)
      }
    },
    async loadMoneyDistribution(val) {
      const data = {
        parentId: val,
        distributionDate: new Date(this.date).toLocaleDateString()
      }
      this.moneyDistributionData = await this.$axios.$get('/meridian/oper/depMoneyDistribution/findForEdit', { params: data })
      this.findBudgetByDate()
    },
    async findBudgetByDate() {
      const data = {
        distributionDate: new Date(this.date).toLocaleDateString()
      }
      this.budget = await this.$axios.$get('/meridian/oper/depMoneyDistribution/findBudgetByDate', { params: data })
      this.budgetDistributionSum = this.budget.distributionSum
      this.budgetDistributedSum = this.budget.distributionSum - this.budget.distributedSum
    },
    async findDepartments(val) {
      if (!this.departments.length) {
        this.loadingType.departments = true
        this.departments = await this.$axios.$get(
          '/meridian/oper/dict/spViddocopl/findDepartments'
        )
        this.loadingType.departments = null
      }
    },
    async findByDepartmentId(id) {
      const data = {
        distributionDate: new Date(this.date).toLocaleDateString(),
        departmentId: id
      }
      this.department = await this.$axios.$get('/meridian/oper/depMoneyDistribution/findByDepartmentId', { params: data })
    },
    async departmentChange(val) {
      await this.loadMoneyDistribution(val)
      await this.findByDepartmentId(val)
      this.depDistributedSum = this.department.distributedSum
      this.depDistributionSum = this.department.distributionSum
    },
    getDateForSave() {
      return new Date(this.date).toLocaleDateString()
    },
    cancel() {
      this.updateAllInfo()
    },
    async save() {
      this.budget.distributionDate = this.getDateForSave()
      await this.$axios.$post('/meridian/oper/depMoneyDistribution/save', [this.budget])
      this.findBudgetByDate()
      this.department.distributionSum = this.depDistributionSum || 0
      this.department.distributedSum = this.depDistributedSum || 0
      this.budget.distributionSum = this.budgetDistributionSum
      this.budget.distributedSum = this.budgetDistributedSum
      await this.$axios.$post('/meridian/oper/depMoneyDistribution/save', [this.department])
      this.findByDepartmentId(this.department.department.id)
      await this.$axios.$post('/meridian/oper/depMoneyDistribution/save', this.moneyDistributionData)
      this.loadMoneyDistribution(this.department.department.id)
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
</style>
