<template>
  <div class="register-of-docs-to-pay-main-div">
    <div class="register-of-docs-to-pay-row">
      <v-col cols="12">
        <div
          align="center"
          class="register-of-docs-to-pay-headline"
        >
          Реестр документов к оплате
        </div>
      </v-col>
    </div>

    <div class="register-of-docs-to-pay-row">
      <v-col cols="3" />

      <v-col cols="1">
        <div
          align="center"
          class="register-of-docs-to-pay-header"
        >
          Дата: с
        </div>
      </v-col>

      <div class="register-of-docs-to-pay-col-2">
        <v-text-field
          v-model="startDate"
          type="date"
        />
      </div>

      <v-col cols="1">
        <div
          align="center"
          class="register-of-docs-to-pay-header"
        >
          по
        </div>
      </v-col>

      <div class="register-of-docs-to-pay-col-2">
        <v-text-field
          v-model="endDate"
          type="date"
        />
      </div>

      <div class="register-of-docs-to-pay-col-2">
        <v-btn
          class="register-of-docs-to-pay-button"
          @click="updateDocsToPay"
        >
          Найти
        </v-btn>
      </div>

      <v-col cols="1" />
    </div>

    <div class="register-of-docs-to-pay-row">
      <div id="registerOfDocsToPayGroupByDate">
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
                <td class="register-of-docs-to-pay-dataOplat">
                  {{ item.dataOplat }}
                </td>
                <td class="register-of-docs-to-pay-nameDoc">
                  {{ item.nameDoc }}
                </td>
                <td class="register-of-docs-to-pay-namePlat">
                  {{ item.namePlat }}
                </td>
                <td class="register-of-docs-to-pay-sumOplat">
                  {{ item.sumOplat }}
                </td>
                <td class="register-of-docs-to-pay-executorDepartmentName">
                  {{ item.executorDepartmentName }}
                </td>
                <td class="register-of-docs-to-pay-prim">
                  {{ item.prim }}
                </td>
              </tr>

              <infinite-loading
                spinner="spiral"
                :identifier="infiniteIdOfToPayDocs"
                @infinite="findDocsToPayInPeriod"
              >
                <div slot="no-more" />
                <div slot="no-results" />
              </infinite-loading>
            </tbody>
          </template>
        </v-data-table>
      </div>
    </div>

    <div class="register-of-docs-to-pay-row">
      <div>
        <th>Итого</th>
      </div>

      <div class="register-of-docs-to-pay-for-toPay-results" />

      <div class="register-of-docs-to-pay-result-text">
        <th>
          <vue-numeric
            v-model="totalToSumOplat"
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
  name: 'RegisterOfDocumentsToPay',
  components: {
    UserNotification,
    InfiniteLoading
  },
  data() {
    return {
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),

      // Таблица для отображения инфрмации о итогах по документам к оплате в разрезе по дням
      groupByDate: [],
      groupByDateColumns: ['dataOplat', 'nameDoc', 'namePlat', 'sumOplat', 'executorDepartmentName', 'prim'],
      groupByDateHeaders: [
        {
          text: 'Дата оплаты',
          value: 'dataOplat'
        },
        {
          text: 'Номер',
          value: 'nameDoc'
        },
        {
          text: 'Контрагент',
          value: 'namePlat'
        },
        {
          text: 'Сумма оплаты',
          value: 'sumOplat'
        },
        {
          text: 'Подразделение',
          value: 'executorDepartmentName'
        },
        {
          text: 'Примечание',
          value: 'prim'
        }
      ],

      // Переменная для реализации обновления данных в таблице
      infiniteIdOfToPayDocs: +new Date(),

      // Переменная для реализации пагинации таблицы
      pageOfToPayDocs: 0,

      // Итоговая сумма найденных документов к оплате
      totalToSumOplat: 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.reset()
      this.fillDatesOnInit()
      await this.findTotalSumOfDocsToPay()
    },

    fillDatesOnInit() {
      const date = new Date()
      this.startDate = new Date(date.getFullYear(), date.getMonth(), 2).toISOString().substr(0, 10)
      this.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString().substr(0, 10)
    },

    async findTotalSumOfDocsToPay() {
      const params = this.createParamsToSearchTotalSumOplatOfDocsToPayBetweenDates(this.startDate, this.endDate)
      const response = await this.$api.payment.docOplToPay.findDocumentsByCriteriasWithGroupBy(params)

      if (response.length > 0) {
        this.totalToSumOplat = response[0].sum_sumOplat
      }
    },

    async updateDocsToPay() {
      await this.findTotalSumOfDocsToPay()
      this.pageOfToPayDocs = 0
      this.groupByDate = []
      this.infiniteIdOfToPayDocs += 1
    },

    async findDocsToPayInPeriod($state) {
      if (this.startDate > this.endDate) {
        this.$refs.userNotification.showUserNotification('error', 'Начальная дата выбранного периода не может быть больше конечной даты выбранного периода!')
        return
      }

      this.$refs.userNotification.showUserNotification('warning', 'Поиск документов')

      const searchCriterias = this.createCriteriasForRequestToSearchDocumentsToPayBetweenDates(this.startDate, this.endDate)
      const data = { searchCriterias, page: this.pageOfToPayDocs }

      const { content } = await this.$api.payment.docOplToPay.findDocumentsByCriteriasByPage(data)
      if (content.length > 0) {
        this.pageOfToPayDocs += 1

        content.forEach((value) => {
          value.sumOplat = this.numberToSum(value.sumOplat)
        })

        this.groupByDate.push(...content)
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

    reset() {
      this.pageOfToPayDocs = 0
      this.groupByDate = []
    }
  }
}
</script>

<style lang="scss">
.register-of-docs-to-pay-main-div {
  padding:10px
}

.register-of-docs-to-pay-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
}

.register-of-docs-to-pay-headline {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.5rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
}

.register-of-docs-to-pay-header {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.5rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
  padding-top: 12px;
  margin-top: 9px;
}

.register-of-docs-to-pay-button {
  padding-top: 12px;
  margin-top: 15px;
}

.register-of-docs-to-pay-col-2 {
    padding: 16px;
    flex: 0 0 12%;
    max-width: 12%;
}

#registerOfDocsToPayGroupByDate {
  border-collapse: collapse;
  width: 100%;
}
#registerOfDocsToPayGroupByDate table{
  width: 100%
}
#registerOfDocsToPayGroupByDate td, #registerOfDocsToPayGroupByDate th {
  border: 1px solid #ddd;
  padding: 0;
}

#registerOfDocsToPayGroupByDate tr:nth-child(even){background-color: #f2f2f2;}

#registerOfDocsToPayGroupByDate tr:hover {background-color: #ddd;}

#registerOfDocsToPayGroupByDate th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

.register-of-docs-to-pay-result-text{
  font-size: 0.75rem;
  padding-right: 15px;
}

.register-of-docs-to-pay-for-toPay-results{
  flex: 0 0 46%;
  max-width: 46%;
}

.register-of-docs-to-pay-dataOplat{
  width: 92px !important
}

.register-of-docs-to-pay-nameDoc{
  width: 200px !important
}

.register-of-docs-to-pay-namePlat{
  width: 300px !important
}

.register-of-docs-to-pay-sumOplat{
  width: 250px !important
}

.register-of-docs-to-pay-executorDepartmentName{
  width: 200px !important
}

.register-of-docs-to-pay-prim{
  width: 200px !important
}
</style>
