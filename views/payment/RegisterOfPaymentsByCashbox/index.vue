<template>
  <div class="register-of-payments-by-cashbox-main-div">
    <div class="register-of-payments-by-cashbox-row">
      <v-col cols="12">
        <div
          align="center"
          class="register-of-payments-by-cashbox-headline"
        >
          Реестр документов оплат по кассе
        </div>
      </v-col>
    </div>

    <div class="register-of-payments-by-cashbox-row">
      <v-col cols="3" />

      <v-col cols="1">
        <div
          align="center"
          class="register-of-payments-by-cashbox-header"
        >
          Период: с
        </div>
      </v-col>

      <div class="register-of-payments-by-cashbox-col-2">
        <v-text-field
          v-model="startDate"
          type="date"
        />
      </div>

      <v-col cols="1">
        <div
          align="center"
          class="register-of-payments-by-cashbox-header"
        >
          по
        </div>
      </v-col>

      <div class="register-of-payments-by-cashbox-col-2">
        <v-text-field
          v-model="endDate"
          type="date"
        />
      </div>

      <div class="register-of-payments-by-cashbox-col-2">
        <v-btn
          class="register-of-payments-by-cashbox-btn"
          @click="findPaymentsByCashboxInPeriod"
        >
          Найти
        </v-btn>
      </div>
    </div>

    <div class="register-of-paymets-by-cashbox-row">
      <div id="registerOfPaymentsByCashboxGroupByDate">
        <v-client-table
          v-model="groupByDate"
          :columns="groupByDateColumns"
          :options="groupByDateOptions"
        />
      </div>
    </div>

    <user-notification ref="userNotification" />
  </div>
</template>

<script>
import UserNotification from '@/views/special_components/information_window/UserNotification'

export default {
  name: 'RegisterOfPaymentsByCashbox',
  components: { UserNotification },
  data() {
    return {
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),

      // Таблица для отображения списка документов оплат по кассе по дням
      groupByDate: [],
      groupByDateColumns: ['paymentDate', 'orgName', 'operationSum', 'groupName', 'comment'],
      groupByDateOptions: {
        filterable: false,
        pagination: { show: false },
        texts: { noResults: '' },
        filterByColumn: false,
        perPage: 100,
        perPageValues: [100],
        headings: {
          paymentDate: 'Дата оплаты',
          orgName: 'Организация',
          operationSum: 'Сумма оплаты',
          groupName: 'Группа',
          comment: 'Примечание'
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

    async findPaymentsByCashboxInPeriod() {
      if (this.startDate > this.endDate) {
        this.$refs.userNotification.showUserNotification('error', 'Начальная дата выбранного периода не может быть больше конечной даты выбранного периода!')
        return
      }

      this.$refs.userNotification.showUserNotification('warning', 'Поиск документов')

      this.reset()
      const data = this.createCriteriasForRequest()

      const response = await this.$api.payment.findPaymentsByCashboxByCriteria(data)
      const arrayOfData = await this.convertResponseToDataForTable(response)

      if (arrayOfData.length > 0) {
        this.groupByDate = arrayOfData
        this.$refs.userNotification.showUserNotification('success', 'Документы найдены')
      } else {
        this.$refs.userNotification.showUserNotification('error', 'В указанном периоде документы не найдены')
      }
    },

    async convertResponseToDataForTable(response) {
      const arrayOfData = []
      let totalPaymentSumInPeriod = 0
      for (const item of response) {
        let operationSum = 0
        let groupName = ''

        if (item.paymentOperationSums.length > 0) {
          operationSum = item.paymentOperationSums[0].paymentSum
          groupName = await this.findNameOfOperationTypeById(item.paymentOperationSums[0].paymentOperationTypeId)
        }

        totalPaymentSumInPeriod += operationSum

        const data = {
          paymentDate: item.paymentDate,
          orgName: item.payer.clName,
          operationSum,
          groupName,
          comment: item.comment
        }

        arrayOfData.push(data)
      }

      const data = {
        paymentDate: '',
        orgName: 'Итого',
        operationSum: totalPaymentSumInPeriod,
        groupName: '',
        comment: ''
      }
      arrayOfData.push(data)

      return arrayOfData
    },

    async findNameOfOperationTypeById(id) {
      const response = await this.$api.payment.typesOfPaymentTransactions.findById(id)
      if (Object.prototype.hasOwnProperty.call(response, 'name')) {
        return response.name
      } else {
        return ' '
      }
    },

    createCriteriasForRequest() {
      const data = {
        dataType: 'DATE',
        key: 'paymentDate',
        operation: 'BETWEEN',
        type: 'AND',
        values: [
          new Date(this.startDate).toLocaleDateString(), new Date(this.endDate).toLocaleDateString()
        ]
      }

      return data
    },

    reset() {
      this.groupByDate = []
    }
  }
}
</script>

<style lang="scss">
.register-of-payments-by-cashbox-main-div {
  padding:10px
}

.register-of-payments-by-cashbox-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0px;
}

.register-of-payments-by-cashbox-headline {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.5rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
}

.register-of-payments-by-cashbox-header {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.5rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
  padding-top: 12px;
  margin-top: 9px;
}

.register-of-payments-by-cashbox-button {
  padding-top: 12px;
  margin-top: 15px;
}

.register-of-payments-by-cashbox-col-2 {
    padding: 16px;
    flex: 0 0 12%;
    max-width: 12%;
}

#registerOfPaymentsByCashboxGroupByDate {
  border-collapse: collapse;
  width: 100%;
}
#registerOfPaymentsByCashboxGroupByDate table{
  width: 100%
}
#registerOfPaymentsByCashboxGroupByDate td, #registerOfPaymentsByCashboxGroupByDate th {
  border: 1px solid #ddd;
  padding: 0px;
}

#registerOfPaymentsByCashboxGroupByDate tr:nth-child(even){background-color: #f2f2f2;}

#registerOfPaymentsByCashboxGroupByDate tr:hover {background-color: #ddd;}

#registerOfPaymentsByCashboxGroupByDate th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}
</style>
