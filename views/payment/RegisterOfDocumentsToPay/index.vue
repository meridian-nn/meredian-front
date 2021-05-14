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
          @click="findDocsToPayInPeriod"
        >
          Найти
        </v-btn>
      </div>

      <v-col cols="1" />
    </div>

    <div class="register-of-docs-to-pay-row">
      <div id="registerOfDocsToPayGroupByDate">
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
  name: 'RegisterOfDocumentsToPay',
  components: { UserNotification },
  data() {
    return {
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),

      // Таблица для отображения инфрмации о итогах по документам к оплате в разрезе по дням
      groupByDate: [],
      groupByDateColumns: ['dataOplat', 'nameDoc', 'namePlat', 'sumOplat', 'depName', 'prim'],
      groupByDateOptions: {
        filterable: false,
        pagination: { show: false },
        texts: { noResults: '' },
        filterByColumn: false,
        perPage: 100,
        perPageValues: [100],
        headings: {
          dataOplat: 'Дата оплаты',
          nameDoc: 'Номер',
          namePlat: 'Контрагент',
          sumOplat: 'Сумма оплаты',
          depName: 'Подразделение',
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

    async findDocsToPayInPeriod() {
      if (this.startDate > this.endDate) {
        this.$refs.userNotification.showUserNotification('error', 'Начальная дата выбранного периода не может быть больше конечной даты выбранного периода!')
        return
      }

      this.$refs.userNotification.showUserNotification('warning', 'Поиск документов')

      this.reset()
      const data = this.createCriteriaForRequest()

      const response = await this.$api.payment.docOplToPay.findDocumentsByCriteria(data)
      let totalSumOplat = 0
      response.forEach((value) => {
        totalSumOplat += value.sumOplat
      })
      response.push({
        dataOplat: 'Итого:',
        nameDoc: '',
        namePlat: '',
        sumOplat: totalSumOplat,
        depName: '',
        prim: ''
      })

      if (response.length > 0) {
        this.groupByDate = response
        this.$refs.userNotification.showUserNotification('success', 'Документы найдены')
      } else {
        this.$refs.userNotification.showUserNotification('warning', 'В указанном периоде документы не найдены')
      }
    },

    createCriteriaForRequest() {
      const data = {
        'dataType': 'DATE',
        'key': 'dataOplat',
        'operation': 'BETWEEN',
        'type': 'AND',
        'values': [
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
.register-of-docs-to-pay-main-div {
  padding:10px
}

.register-of-docs-to-pay-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0px;
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
  padding: 0px;
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
</style>
