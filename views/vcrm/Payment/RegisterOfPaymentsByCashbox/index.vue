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
          @click="updatePaymentsByCashbox"
        >
          Найти
        </v-btn>
      </div>
    </div>

    <div class="register-of-paymets-by-cashbox-row">
      <div id="registerOfPaymentsByCashboxGroupByDate">
        <v-data-table
          :headers="groupByDateHeaders"
          height="700"
          fixed-header
          :items="groupByDate"
          :show-select="false"
          disable-pagination
          hide-default-footer
          no-data-text=""
          class="elevation-1"
        >
          <template #body="{ items }">
            <tbody>
              <tr
                v-for="item in items"
                :key="item.id"
                :value="item"
              >
                <td class="register-of-paymets-by-cashbox-paymentDate">
                  {{ item.paymentDate }}
                </td>
                <td class="register-of-paymets-by-cashbox-orgName">
                  {{ item.orgName }}
                </td>
                <td class="register-of-paymets-by-cashbox-operationSum">
                  {{ item.operationSum }}
                </td>
                <td class="register-of-paymets-by-cashbox-groupName">
                  {{ item.groupName }}
                </td>
                <td class="register-of-paymets-by-cashbox-comment">
                  {{ item.comment }}
                </td>
              </tr>

              <infinite-loading
                spinner="spiral"
                :identifier="infiniteIdOfPaymentsByCashbox"
                @infinite="findPaymentsByCashboxInPeriod"
              >
                <div slot="no-more" />
                <div slot="no-results" />
              </infinite-loading>
            </tbody>
          </template>
        </v-data-table>
      </div>
    </div>

    <div class="register-of-paymets-by-cashbox-row">
      <div>
        <th>Итого</th>
      </div>

      <div class="register-of-payments-by-cashbox-results" />

      <div class="register-of-payments-by-cashbox-text">
        <th>
          <vue-numeric
            v-model="totalOperationSum"
            separator="space"
            :precision="2"
            decimal-separator="."
            output-type="number"
            :read-only="true"
          />
        </th>
      </div>
    </div>

    <user-notification ref="userNotification" />
  </div>
</template>

<script>
import UserNotification from '@/components/information_window/UserNotification'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'RegisterOfPaymentsByCashbox',
  components: {
    UserNotification,
    InfiniteLoading
  },
  data() {
    return {
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),

      // Таблица для отображения списка документов оплат по кассе по дням
      groupByDate: [],
      groupByDateColumns: ['paymentDate', 'orgName', 'operationSum', 'groupName', 'comment'],
      groupByDateHeaders: [
        {
          text: 'Дата оплаты',
          value: 'paymentDate'
        },
        {
          text: 'Организация',
          value: 'orgName'
        },
        {
          text: 'Сумма оплаты',
          value: 'operationSum'
        },
        {
          text: 'Группа',
          value: 'groupName'
        },
        {
          text: 'Примечание',
          value: 'comment'
        }
      ],

      // Переменная для реализации обновления данных в таблице
      infiniteIdOfPaymentsByCashbox: +new Date(),

      // Переменная для реализации пагинации таблицы
      pageOfPaymentsByCashbox: 0,

      // Итоговая сумма найденных документов к оплате
      totalOperationSum: 0,

      // Список типов операций
      operationTypes: []
    }
  },

  async fetch() {
    this.operationTypes = await this.$api.payment.typesOfPaymentTransactions.findAll()
  },

  computed: {
    groupByDatePaymentOperationSums() {
      return this.groupByDate.map(item => item.paymentOperationSums[0])
    },

    totalPaymentSumInPeriod() {
      return this.groupByDate.reduce((acc, item) => {
        return acc + Number(item.paymentOperationSums[0].paymentSum) || 0
      }, 0)
    }
  },
  mounted() {
    this.init()
  },

  methods: {
    async init() {
      this.reset()
      this.fillDatesOnInit()
      await this.findTotalSumPaymentsByCashbox()
    },

    fillDatesOnInit() {
      const date = new Date()
      this.startDate = new Date(date.getFullYear(), date.getMonth(), 2).toISOString().substr(0, 10)
      this.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString().substr(0, 10)
    },

    async updatePaymentsByCashbox() {
      await this.findTotalSumPaymentsByCashbox()
      this.pageOfPaymentsByCashbox = 0
      this.groupByDate = []
      this.infiniteIdOfPaymentsByCashbox += 1
    },

    async findTotalSumPaymentsByCashbox() {
      const params = this.createParamsToSearchTotalToPaySumOfPaymentsByCashboxBetweenDates(this.startDate, this.endDate)
      const response = await this.$api.payment.findPaymentsWithGroupBy(params)

      if (response.length > 0) {
        this.totalOperationSum = response[0].sum_toPaySum
      }
    },

    async findPaymentsByCashboxInPeriod($state) {
      if (this.startDate > this.endDate) {
        this.$refs.userNotification.showUserNotification('error', 'Начальная дата выбранного периода не может быть больше конечной даты выбранного периода!')
        return
      }

      this.$refs.userNotification.showUserNotification('warning', 'Поиск документов')

      const searchCriterias = this.createCriteriasForSearchPaymentsByCashboxBetweenDates(this.startDate, this.endDate)
      const data = { searchCriterias, page: this.pageOfPaymentsByCashbox }

      const { content } = await this.$api.payment.findPaymentsByCashboxByPageWithCriterias(data)
      if (content.length > 0) {
        this.pageOfPaymentsByCashbox += 1
        const arrayOfData = this.convertResponsePaymentsByCashboxToDataForTable(content, this.operationTypes)
        this.groupByDate.push(...arrayOfData)

        $state.loaded()
      } else {
        $state.complete()

        if (this.groupByDate.length > 0) {
          this.$refs.userNotification.showUserNotification('success', 'Документы найдены')
        } else {
          this.$refs.userNotification.showUserNotification('warning', 'В указанном периоде документы не найдены')
        }
      }
    },

    async findOperationTypes() {
      this.operationTypes = await this.$api.payment.typesOfPaymentTransactions.findAll()
    },

    reset() {
      this.pageOfPaymentsByCashbox = 0
      this.groupByDate = []
      this.operationTypes = []
      this.totalOperationSum = 0
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
  margin: 0;
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
  padding: 0;
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

.register-of-payments-by-cashbox-text{
  font-size: 0.75rem;
  padding-right: 15px;
}

.register-of-payments-by-cashbox-results{
  flex: 0 0 33%;
  max-width: 33%;
}

.register-of-paymets-by-cashbox-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
}

.register-of-paymets-by-cashbox-paymentDate {
  width: 90px !important
}

.register-of-paymets-by-cashbox-orgName {
  width: 250px !important
}

.register-of-paymets-by-cashbox-operationSum {
  width: 200px !important
}

.register-of-paymets-by-cashbox-groupName {
  width: 200px !important
}

.register-of-paymets-by-cashbox-comment {
  width: 200px !important
}
</style>
