<template>
  <div class="input-of-balances-main-div">
    <div class="input-of-balances-row">
      <div
        align="center"
        class="input-of-balances-main-row-headline"
      >
        Ввод остатков по Р/С
      </div>

      <div class="input-of-balances-date">
        <v-text-field
          v-model="date"
          type="date"
          @input="init()"
        />
      </div>
    </div>

    <div class="input-of-balances-row">
      <div id="groupByOrg">
        <v-client-table
          v-model="groupByOrgData"
          :columns="groupByOrgColumns"
          :options="groupByOrgOptions"
        />
      </div>
    </div>

    <BalanceScore
      :organizations="organizations"
      :date="date"
      @save="init()"
      @cancel="init()"
    />
  </div>
</template>

<script>
import BalanceScore from './composes/BalanceScore'
export default {
  name: 'InputOfBalances',

  components: {
    BalanceScore
  },

  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      // объект для отображения загрузки данных для полей
      loadingType: {},

      // массив организаций для выбора пользователем
      organizations: [],

      // таблица данных по остаткам на р/с организаций
      groupByOrgColumns: ['name', 'saldo', 'nalich', 'vnpl', 'sumToPay', 'endBalance'],
      groupByOrgData: [],
      groupByOrgOptions: {
        filterable: false,
        pagination: { show: false },
        texts: { noResults: '' },
        filterByColumn: false,
        headings: {
          name: 'Наименование',
          saldo: 'Остаток на р/с',
          nalich: 'Прочее',
          vnpl: 'ВнПл',
          sumToPay: 'К оплате',
          endBalance: 'Остаток на конец'
        }
      },

      // Итоги по колонкам "Наименование, Остаток на р/с, Прочее, ВнПл, К оплате и Остаток на конец"
      totalSumOfSaldo: 0,
      totalSumOfNalich: 0,
      totalSumOfVNPL: 0,
      totalSumOfCredit: 0,
      totalSumOfEndBalance: 0
    }
  },
  mounted() {
    this.init()
  },

  methods: {
    async init() {
      await this.selOplat()
      await this.findOrganizations()
      await this.groupByOrg()
      this.loadingType = {}
    },

    // Инициализация журнала оплат
    async selOplat() {
      await this.$axios.$post(this.$api.payment.getSelOplatOfSpDocoplUrl())
      // await this.$api.payment.selOplat()
    },

    // Метод получения итоговой суммы документов к оплате по организациям
    async groupByOrg() {
      this.groupByOrgData = await this.getInfoAboutOrgs()
    },

    async getInfoAboutOrgs() {
      this.totalSumOfSaldo = 0
      this.totalSumOfNalich = 0
      this.totalSumOfVNPL = 0
      this.totalSumToPay = 0
      this.totalSumOfEndBalance = 0

      const data = this.createParamsForRequestPaymentAccGroupByOrg(this.date, ['myOrg.id', 'myOrg.clName'])
      const response = await this.$api.paymentAccounts.groupBy(data)

      if (!response.length) {
        return response
      }

      response[1] = response.splice(0, 1, response[1])[0]
      for (const element of response) {
        element.name = element['myOrg.clName']
        if (!element.sum_sumToPay) {
          element.sum_sumToPay = 0
        }

        element.endBalance = element.sum_saldo + element.sum_nalich + element.sum_vnpl - element.sum_sumToPay

        this.totalSumOfSaldo += element.sum_saldo
        this.totalSumOfNalich += element.sum_nalich
        this.totalSumOfVNPL += element.sum_vnpl
        this.totalSumToPay += element.sum_sumToPay
        this.totalSumOfEndBalance += element.endBalance

        element.saldo = this.numberToSum(element.sum_saldo)
        element.nalich = this.numberToSum(element.sum_nalich)
        element.vnpl = this.numberToSum(element.sum_vnpl)
        element.sumToPay = this.numberToSum(element.sum_sumToPay)
        element.endBalance = this.numberToSum(element.endBalance)
      }

      response.push({
        'name': 'Итого:',
        'saldo': this.numberToSum(this.totalSumOfSaldo),
        'nalich': this.numberToSum(this.totalSumOfNalich),
        'vnpl': this.numberToSum(this.totalSumOfVNPL),
        'sumToPay': this.numberToSum(this.totalSumToPay),
        'endBalance': this.numberToSum(this.totalSumOfEndBalance)
      })
      return response
    },

    // Поиск организаций для выбора пользователем
    async findOrganizations() {
      if (this.organizations.length) {
        return
      }
      this.loadingType.organizations = true

      const data = {
        typeCode: 1
      }
      const organizations = await this.$api.organizations.findByOrgTypeCode(data)

      organizations[1] = organizations.splice(0, 1, organizations[1])[0]

      this.organizations = organizations
      this.loadingType.organizations = null
    }
  }

}
</script>

<style lang="scss">
.select-td {
  background-color: #0085c7;

  > input {
    color: white !important;
  }

  > span {
    color: white;
  }
}
.input-of-balances-main-div {
 padding: 10px
}

.input-of-balances-main-row-headline {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.5rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
  flex: 0 0 90%;
  max-width: 90%;
}

.input-of-balances-date {
  flex: 0 0 10%;
  max-width: 10%;
}

.input-of-balances-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
  min-width: 100%;
}

.input-of-balances-oplat-data-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
  min-width: 100%;
  padding-bottom:10px
}

.input-of-balances-org {
  flex: 0 0 40%;
  max-width: 40%;
}

.input-of-balances-save-btn {
  flex: 0 0 40%;
  max-width: 40%;
}

.input-of-balances-spacer {
  flex: 0 0 10%;
  max-width: 10%;
}

.input-of-balances-cancel-btn {
  flex: 0 0 50%;
  max-width: 50%;
}

table th, td {
  outline: none;
}

#groupByOrg {
  border-collapse: collapse;
  width: 100%;
}
#groupByOrg table{
  width: 100%
}
#groupByOrg td, #groupByOrg th {
  border: 1px solid #ddd;
  padding: 0;

}

#groupByOrg tr:nth-child(even){background-color: #f2f2f2;}

#groupByOrg tr:hover {background-color: #ddd;}

#groupByOrg th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

#oplatData {
  border-collapse: collapse;
  width: 100%;
}
#oplatData table{
  width: 100%
}
#oplatData td, #oplatData th {
  border: 1px solid #ddd;
  padding: 0;
}

#oplatData tr:nth-child(even){background-color: #f2f2f2;}

#oplatData tr:hover {background-color: #ddd;}

#oplatData th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}
</style>
