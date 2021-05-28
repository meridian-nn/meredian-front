<template>
  <div class="payment-budget-by-deps-main-div">
    <div class="payment-budget-by-deps-row">
      <v-col cols="12">
        <div
          align="center"
          class="payment-budget-by-deps-headline"
        >
          Бюджет оплат по подразделениям
        </div>
      </v-col>
    </div>

    <div class="payment-budget-by-deps-row">
      <v-col cols="3" />

      <v-col cols="1">
        <div
          align="center"
          class="payment-budget-by-deps-header"
        >
          Дата: с
        </div>
      </v-col>

      <div class="payment-budget-by-deps-col-2">
        <v-text-field
          v-model="startDate"
          type="date"
        />
      </div>

      <v-col cols="1">
        <div
          align="center"
          class="payment-budget-by-deps-header"
        >
          по
        </div>
      </v-col>

      <div class="payment-budget-by-deps-col-2">
        <v-text-field
          v-model="endDate"
          type="date"
        />
      </div>

      <div class="payment-budget-by-deps-col-2">
        <v-btn
          class="payment-budget-by-deps-button"
          @click="findDocOplInPeriod"
        >
          Найти
        </v-btn>
      </div>

      <v-col cols="1" />
    </div>

    <div class="payment-budget-by-deps-row">
      <v-subheader class="font-weight-medium text-subtitle-1">
        История оплаты
      </v-subheader>
      <div id="paymentBudgetByDepGroupByDate">
        <v-client-table
          v-model="groupByDate"
          :columns="groupByDateColumns"
          :options="groupByDateOptions"
          @row-click="findGroupByDep"
        />
      </div>
    </div>

    <div class="payment-budget-by-deps-row">
      <v-subheader class="font-weight-medium text-subtitle-1">
        История оплаты по подразделениям
      </v-subheader>
      <div id="paymentBudgetByDepGroupByDep">
        <v-client-table
          v-model="groupByDep"
          :columns="groupByDepColumns"
          :options="groupByDepOptions"
        />
      </div>
    </div>

    <user-notification ref="userNotification" />
    </v-container>
  </div>
</template>

<script>
import UserNotification from '@/components/information_window/UserNotification'

export default {
  name: 'PaymentBudgetByDepartments',
  components: { UserNotification },
  data() {
    return {
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),

      // Таблица для отображения инфрмации о итогах по документам на оплату в разрезе по дням
      groupByDate: [],
      groupByDateColumns: ['dataOplat', 'sumDoc', 'sumOplach'],
      groupByDateOptions: {
        filterable: false,
        pagination: { show: false },
        texts: { noResults: '' },
        filterByColumn: false,
        perPage: 100,
        perPageValues: [100],
        headings: {
          dataOplat: 'Дата оплаты',
          sumDoc: 'План',
          sumOplach: 'Факт'
        },
        orderBy: {
          column: 'dataOplat'
        }
      },

      arrayForStashAllGroupsByDep: [],

      // Таблица для отображения инфрмации о итогах по документам на оплату в разрезе по подразделениям
      groupByDep: [],
      groupByDepColumns: ['dep', 'sumFact', 'prim'],
      groupByDepOptions: {
        filterable: false,
        pagination: { show: false },
        texts: { noResults: '' },
        filterByColumn: false,
        headings: {
          dep: 'Отдел',
          sumFact: 'Сумма факт',
          prim: 'Примечание'
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.fillDatesOnInit()
    },

    fillDatesOnInit() {
      const date = new Date()
      this.startDate = new Date(date.getFullYear(), date.getMonth(), 2).toISOString().substr(0, 10)
      this.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString().substr(0, 10)
    },

    async findDocOplInPeriod() {
      if (this.startDate > this.endDate) {
        this.$refs.userNotification.showUserNotification('error', 'Начальная дата выбранного периода не может быть больше конечной даты выбранного периода!')
        return
      }

      this.$refs.userNotification.showUserNotification('warning', 'Поиск документов')

      this.reset()
      const groupByDate = []
      const groupByDep = []

      const data = {
        finishDate: new Date(this.endDate).toLocaleDateString(),
        startDate: new Date(this.startDate).toLocaleDateString()
      }

      const response = await this.$api.payment.docOplForPay.findByDataOplatBetweenParamDates(data)
      for (const value of response) {
        if (value.departmentId === null) {
          continue
        }

        let record = groupByDate.find(item => item.dataOplat === value.dataOplat)
        const sumOplach = value.sumPaid === null ? 0 : value.sumPaid
        const depName = await this.findDepDocById(value.departmentId)
        if (record === undefined) {
          record = {
            dataOplat: value.dataOplat,
            sumDoc: this.numberToSum(value.sumDoc),
            sumDocNumber: value.sumDoc,
            sumOplach: this.numberToSum(sumOplach),
            sumOplachNumber: sumOplach
          }
          groupByDate.push(record)
        } else {
          record.sumDocNumber += value.sumDoc
          record.sumDoc = this.numberToSum(record.sumDocNumber)
          record.sumOplachNumber += sumOplach
          record.sumOplach = this.numberToSum(record.sumOplachNumber)
        }

        let recordDep = groupByDep.find(item => item.dataOplat === value.dataOplat && item.dep === depName)
        if (recordDep === undefined) {
          recordDep = {
            dataOplat: value.dataOplat,
            dep: depName,
            sumFact: this.numberToSum(sumOplach),
            sumFactNumber: sumOplach,
            prim: value.prim
          }
          groupByDep.push(recordDep)
        } else {
          recordDep.sumFactNumber += sumOplach
          recordDep.sumFact = this.numberToSum(recordDep.sumFactNumber)
        }
      }

      this.arrayForStashAllGroupsByDep = groupByDep
      this.groupByDate = groupByDate
      if (this.groupByDate.length > 0) {
        this.$refs.userNotification.showUserNotification('success', 'Документы найдены')
      } else {
        this.$refs.userNotification.showUserNotification('warning', 'В указанном периоде документы не найдены')
      }
    },

    reset() {
      this.groupByDate = []
      this.groupByDep = []
      this.arrayForStashAllGroupsByDep = []
    },

    async findDepDocById(departmentId) {
      const data = {
        departmentId
      }

      const response = await this.$api.payment.moneyDistributionByDepartments.findByDepartmentId(data)
      return response.department.nameViddoc
    },

    findGroupByDep(item) {
      const groupByDep = this.arrayForStashAllGroupsByDep.filter(record => record.dataOplat === item.row.dataOplat)
      this.groupByDep = groupByDep
    }
  }
}
</script>

<style lang="scss">
.payment-budget-by-deps-main-div {
  padding: 10px
}

.payment-budget-by-deps-headline {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.5rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
}

.payment-budget-by-deps-header {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.5rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
  padding-top: 12px;
  margin-top: 9px;
}

.payment-budget-by-deps-button {
  padding-top: 12px;
  margin-top: 15px;
}

.payment-budget-by-deps-col-2 {
  padding: 16px;
  flex: 0 0 12%;
  max-width: 12%;
}

.payment-budget-by-deps-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0px;
}

#paymentBudgetByDepGroupByDate {
  border-collapse: collapse;
  width: 100%;
}
#paymentBudgetByDepGroupByDate table{
  width: 100%
}
#paymentBudgetByDepGroupByDate td, #paymentBudgetByDepGroupByDate th {
  border: 1px solid #ddd;
  padding: 0px;
}

#paymentBudgetByDepGroupByDate tr:nth-child(even){background-color: #f2f2f2;}

#paymentBudgetByDepGroupByDate tr:hover {background-color: #ddd;}

#paymentBudgetByDepGroupByDate th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

#paymentBudgetByDepGroupByDep {
  border-collapse: collapse;
  width: 100%;
}
#paymentBudgetByDepGroupByDep table{
  width: 100%
}
#paymentBudgetByDepGroupByDep td, #paymentBudgetByDepGroupByDep th {
  border: 1px solid #ddd;
  padding: 0px;
}

#paymentBudgetByDepGroupByDep tr:nth-child(even){background-color: #f2f2f2;}

#paymentBudgetByDepGroupByDep tr:hover {background-color: #ddd;}

#paymentBudgetByDepGroupByDep th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

</style>
