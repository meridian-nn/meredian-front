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
        <v-data-table
          :headers="groupByDateHeaders"
          height="523"
          fixed-header
          :items="groupByDate"
          :show-select="false"
          disable-pagination
          hide-default-footer
          no-data-text=""
          class="elevation-1"
          @click:row="findGroupByDep"
        />
      </div>
    </div>

    <div class="payment-budget-by-deps-row">
      <v-subheader class="font-weight-medium text-subtitle-1">
        История оплаты по подразделениям
      </v-subheader>
      <div id="paymentBudgetByDepGroupByDep">
        <v-data-table
          :headers="groupByDepHeaders"
          height="523"
          fixed-header
          :items="groupByDep"
          :show-select="false"
          disable-pagination
          hide-default-footer
          no-data-text=""
          class="elevation-1"
        />
      </div>
    </div>

    <user-notification ref="userNotification" />
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
      groupByDateHeaders: [
        {
          text: 'Дата оплаты',
          value: 'dataOplat'
        },
        {
          text: 'План',
          value: 'sumDoc'
        },
        {
          text: 'Факт',
          value: 'sumOplach'
        }
      ],

      // Таблица для отображения инфрмации о итогах по документам на оплату в разрезе по подразделениям
      groupByDep: [],
      groupByDepColumns: ['depName', 'sumFact', 'prim'],
      groupByDepHeaders: [
        {
          text: 'Отдел',
          value: 'depName'
        },
        {
          text: 'План',
          value: 'sumDoc'
        },
        {
          text: 'Факт',
          value: 'sumOplach'
        }
      ]
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

      const paramsForRequest = this.createParamsForRequestDocForPayGroupByDataOplat(this.startDate, this.endDate, ['dataOplat'])
      const response = await this.$api.payment.docOplForPay.findDocumentsForPayWithGroupBy(paramsForRequest)
      for (const item of response) {
        if (!item.sum_sumPaid) {
          item.sum_sumPaid = 0
        }

        let record = groupByDate.find(record => record.dataOplat === item.dataOplat)
        if (record === undefined) {
          record = {
            dataOplat: item.dataOplat,
            sumDoc: this.numberToSum(item.sum_sumDoc),
            sumDocNumber: item.sum_sumDoc,
            sumOplach: this.numberToSum(item.sum_sumPaid),
            sumOplachNumber: item.sum_sumPaid
          }
          groupByDate.push(record)
        } else {
          record.sumDocNumber += item.sum_sumDoc
          record.sumDoc = this.numberToSum(record.sumDocNumber)
          record.sumOplachNumber += item.sum_sumPaid
          record.sumOplach = this.numberToSum(record.sumOplachNumber)
        }
      }

      this.groupByDate = groupByDate

      if (this.groupByDate.length > 0) {
        this.$refs.userNotification.showUserNotification('success', 'Документы найдены')
      } else {
        this.$refs.userNotification.showUserNotification('warning', 'В указанном периоде документы не найдены')
      }
    },

    async findGroupByDep(item) {
      const groupByDep = []

      const paramsForRequest = this.createParamsForRequestDocForPayGroupByDepName(item.dataOplat, ['depName'])
      const response = await this.$api.payment.docOplForPay.findDocumentsForPayWithGroupBy(paramsForRequest)
      for (const item of response) {
        if (!item.sum_sumPaid) {
          item.sum_sumPaid = 0
        }

        if (!item.depName) {
          item.depName = 'Подразделение не указано'
        }

        let record = groupByDep.find(record => record.depName === item.depName)
        if (record === undefined) {
          record = {
            depName: item.depName,
            sumDoc: this.numberToSum(item.sum_sumDoc),
            sumDocNumber: item.sum_sumDoc,
            sumOplach: this.numberToSum(item.sum_sumPaid),
            sumOplachNumber: item.sum_sumPaid
          }
          groupByDep.push(record)
        } else {
          record.sumDocNumber += item.sum_sumDoc
          record.sumDoc = this.numberToSum(record.sumDocNumber)
          record.sumOplachNumber += item.sum_sumPaid
          record.sumOplach = this.numberToSum(record.sumOplachNumber)
        }
      }

      this.groupByDep = groupByDep
    },

    reset() {
      this.groupByDate = []
      this.groupByDep = []
      this.arrayForStashAllGroupsByDep = []
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
  margin: 0;
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
  padding: 0;
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
  padding: 0;
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
