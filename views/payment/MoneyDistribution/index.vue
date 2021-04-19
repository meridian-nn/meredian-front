<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="10">
            <div
              align="center"
              class="headline"
            >
              Распределение ДС по подразделениям
            </div>
          </v-col>
          <v-col cols="2">
              <v-text-field
                type="date"
                v-model="date"
              />
          </v-col>
        </v-row>
        <v-row class="border-bottom">
          <v-col cols="3">
            <v-subheader class="font-weight-medium text-subtitle-1">
              Бюджет для распределения
            </v-subheader>
          </v-col>
          <v-col cols="3">
            <div>
              <v-text-field
                type="number"
                v-model="budget.distributionSum"
              />
            </div>
          </v-col>
          <v-col cols="3">
            <v-subheader class="font-weight-medium text-subtitle-1">
              Не распределено
            </v-subheader>
          </v-col>
          <v-col cols="3">
            <div>
              {{ budgetRestDistributionSum }}
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-autocomplete
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
          <v-col cols="2">
            <v-subheader class="font-weight-medium text-subtitle-1">
              Выделено
            </v-subheader>
          </v-col>
          <v-col cols="2">
            <v-text-field
              type="number"
              v-model="department.distributionSum"
            />
          </v-col>
          <v-col cols="2">
            <v-subheader class="font-weight-medium text-subtitle-1">
              Не распределно
            </v-subheader>
          </v-col>
          <v-col cols="3">
            {{ depurtmentRestDistributionSum }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <v-client-table
              :columns="columns"
              :options="options"
              v-model="moneyDistributionData"
            >
              <input
                type="number"
                slot="distributionSum"
                slot-scope="{row, update}"
                v-model="row.distributionSum"
                @input="update(row.distributionSum)"
              >
              <input
                type="text"
                slot="note"
                slot-scope="{row, update}"
                v-model="row.note"
                @input="update(row.note)"
              >
            </v-client-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-btn
              @click="cancel"
            >
              Отмена
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn
              @click="save"
            >
              Сохранить
            </v-btn>
          </v-col>
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
      depDistributedSum: 0,
      budget: {},
      columns: ['department.nameViddoc', 'distributionSum', 'note'],
      options: {
        filterByColumn: false,
        perPage: 100,
        dateFormat: 'YYYY-MM-DD',
        editableColumns: ['distributionSum', 'note'],
        headings: {
          'department.nameViddoc': 'Отдел',
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
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.findDepartments()
      this.department = {}
      this.findBudgetByDate()
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
    departmentChange(val) {
      this.loadMoneyDistribution(val)
      this.findByDepartmentId(val)
      this.depDistributedSum = this.department.getDistributedSum
    },
    getDateForSave() {
      return new Date(this.date).toLocaleDateString()
    },
    cancel() {
      this.init()
    },
    async save() {
      this.budget.distributionDate = this.getDateForSave()
      await this.$axios.$post('/meridian/oper/depMoneyDistribution/save', [this.budget])
      this.findBudgetByDate()
      await this.$axios.$post('/meridian/oper/depMoneyDistribution/save', [this.department])
      this.findByDepartmentId(this.department.department.id)
      await this.$axios.$post('/meridian/oper/depMoneyDistribution/save', this.moneyDistributionData)
      this.loadMoneyDistribution(this.department.department.id)
    }
  },
  computed: {
    budgetRestDistributionSum() {
      this.department.getDistributedSum = this.moneyDistributionData.length === 0
        ? 0
        : this.moneyDistributionData.reduce((a, b) => this.$numOr0(a.distributionSum) + this.$numOr0(b.distributionSum))
      this.budget.distributedSum += (this.department.getDistributedSum - this.depDistributedSum)
      return this.budget.distributionSum
        ? this.budget.distributionSum
        : 0 - this.budget.distributedSum ? this.budget.distributedSum : 0
    },
    depurtmentRestDistributionSum() {
      this.department.getDistributedSum = this.moneyDistributionData.length === 0
        ? 0
        : this.moneyDistributionData.reduce((a, b) => this.$numOr0(a.distributionSum) + this.$numOr0(b.distributionSum))
      return this.department.distributionSum
        ? this.department.distributionSum
        : 0 - this.department.distributedSum ? this.department.distributedSum : 0
    }
  }
}
</script>
