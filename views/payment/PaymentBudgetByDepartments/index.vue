<template>
  <v-card>
    <v-card-text>
      <v-container class="payment-budget-by-deps-container">
        <v-row>
          <v-col cols="12">
            <div
              align="center"
              class="headline"
            >
              Бюджет оплат по подразделениям
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="3" />

          <v-col cols="1">
            <div
              align="center"
              class="headline payment-budget-by-deps-header"
            >
              Дата: с
            </div>
          </v-col>

          <div class="payment-budget-by-dep-col-2">
            <v-text-field
              v-model="startDate"
              type="date"
              @input="init"
            />
          </div>

          <v-col cols="1">
            <div
              align="center"
              class="headline payment-budget-by-deps-header"
            >
              по
            </div>
          </v-col>

          <div class="payment-budget-by-dep-col-2">
            <v-text-field
              v-model="endDate"
              type="date"
              @input="init"
            />
          </div>

          <div class="payment-budget-by-dep-col-2">
            <v-btn
              class="payment-budget-by-deps-header"
              @click="findDocOplInPeriod"
            >
              Найти
            </v-btn>
          </div>

          <v-col cols="1" />
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-subheader class="font-weight-medium text-subtitle-1">
              История оплаты
            </v-subheader>
            <div id="groupByDate">
              <v-client-table
                v-model="groupByDate"
                :columns="groupByDateColumns"
                :options="groupByDateOptions"
                @row-click="findGroupByDep"
              >
                <!--input
                  slot="date"
                  v-model="row.date"
                  slot-scope="{row, update}"
                  @input="update(row.date)"
                -->
              </v-client-table>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-subheader class="font-weight-medium text-subtitle-1">
              История оплаты по подразделениям
            </v-subheader>
            <div id="groupByDep">
              <v-client-table
                v-model="groupByDep"
                :columns="groupByDepColumns"
                :options="groupByDepOptions"
              />
            </div>
          </v-col>
        </v-row>

        <user-notification ref="userNotification" />
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import UserNotification from '@/views/special_components/information_window/UserNotification'

export default {
  name: 'PaymentBudgetByDepartments',
  components: { UserNotification },
  data() {
    return {
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),

      // Таблица для отображения инфрмации о итогах по документам на оплату в разрезе по дням
      groupByDate: [],
      groupByDateColumns: ['dataDoc', 'sumDoc', 'sumOplach'],
      groupByDateOptions: {
        filterable: false,
        pagination: { show: false },
        texts: { noResults: '' },
        filterByColumn: false,
        perPage: 100,
        perPageValues: [100],
        headings: {
          dataDoc: 'Дата документа',
          sumDoc: 'План',
          sumOplach: 'Факт'
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
      }

      const data = {
        finishDate: new Date(this.endDate).toLocaleDateString(),
        startDate: new Date(this.startDate).toLocaleDateString()
      }

      const groupByDate = []
      const groupByDep = []
      const response = await this.$api.payment.docOplForPay.findSpDocoplForPayBetweenParamDates(data)
      response.forEach((value) => {
        let record = groupByDate.find(item => item.dataDoc === value.dataDoc)
        if (record === undefined) {
          record = {
            dataDoc: value.dataDoc,
            sumDoc: value.sumDoc,
            sumOplach: value.sumOplach
          }
          groupByDate.push(record)
        } else {
          record.sumDoc += value.sumDoc
          record.sumOplach += value.sumOplach
        }

        let recordDep = groupByDep.find(item => item.dataDoc === value.dataDoc && item.dep === value.depName)
        if (recordDep === undefined) {
          recordDep = {
            dataDoc: value.dataDoc,
            dep: value.depName,
            sumFact: value.sumOplach,
            prim: value.prim
          }
          groupByDep.push(recordDep)
        } else {
          recordDep.sumFact += value.sumOplach
        }
      })

      this.arrayForStashAllGroupsByDep = groupByDep
      this.groupByDate = groupByDate
      // const response = this.
    },

    findGroupByDep(item) {
      console.log(item.row)
      const groupByDep = this.arrayForStashAllGroupsByDep.filter(record => record.dataDoc === item.row.dataDoc)
      this.groupByDep = groupByDep
    }
  }
}
</script>

<style lang="scss">
.payment-budget-by-deps-header {
    padding-top: 12px;
    margin-top: 9px;
}

#groupByDate {
  border-collapse: collapse;
  width: 100%;
}
#groupByDate table{
  width: 100%
}
#groupByDate td, #groupByDate th {
  border: 1px solid #ddd;
  padding: 8px;
}

#groupByDate tr:nth-child(even){background-color: #f2f2f2;}

#groupByDate tr:hover {background-color: #ddd;}

#groupByDate th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

#groupByDep {
  border-collapse: collapse;
  width: 100%;
}
#groupByDep table{
  width: 100%
}
#groupByDep td, #groupByDep th {
  border: 1px solid #ddd;
  padding: 8px;
}

#groupByDep tr:nth-child(even){background-color: #f2f2f2;}

#groupByDep tr:hover {background-color: #ddd;}

#groupByDep th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

.payment-budget-by-dep-col-2 {
    padding: 16px;
    flex: 0 0 12%;
    max-width: 12%;
}
</style>
