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
          @input="init"
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

    <div class="input-of-balances-row">
      <div class="input-of-balances-org">
        <v-autocomplete
          v-model="orgId"
          label="Организация"
          :loading="loadingType.organizations"
          :items="organizations"
          item-value="id"
          item-text="clName"
          @change="findByDataOplatAndMyOrgId"
        />
      </div>
    </div>

    <div class="input-of-balances-oplat-data-row">
      <div id="oplatData">
        <v-client-table
          v-model="oplatData"
          :columns="oplatDataColumns"
          :options="oplatDataOptions"
        >
          <input
            slot="name"
            v-model="row.name"
            slot-scope="{row, update}"
            @input="update(row.name)"
          >
          <input
            slot="saldo"
            v-model.number="row.saldo"
            slot-scope="{row, update}"
            type="number"
            @input="update(row.saldo)"
          >
          <input
            slot="nalich"
            v-model="row.nalich"
            slot-scope="{row, update}"
            type="number"
            @input="update(row.nalich)"
          >
          <input
            slot="vnpl"
            v-model="row.vnpl"
            slot-scope="{row, update}"
            type="number"
            @input="update(row.vnpl)"
          >
          <input
            slot="credit"
            v-model="row.credit"
            slot-scope="{row, update}"
            type="number"
            @input="update(row.credit)"
          >
          <input
            slot="endBalance"
            v-model="row.endBalance"
            slot-scope="{row, update}"
            type="number"
            @input="update(row.endBalance)"
          >
        </v-client-table>
      </div>
    </div>

    <div class="input-of-balances-row">
      <div
        align="right"
        class="input-of-balances-save-btn"
      >
        <v-btn
          @click="save"
        >
          Сохранить
        </v-btn>
      </div>

      <div class="input-of-balances-spacer" />

      <div class="input-of-balances-cancel-btn">
        <v-btn
          @click="cancel"
        >
          Отмена
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),

      // id выбранной организации
      orgId: null,

      // объект для отображения загрузки данных для полей
      loadingType: {},

      // массив организаций для выбора пользователем
      organizations: [],

      // таблица данных по остаткам на р/с организаций
      groupByOrgColumns: ['name', 'saldo', 'nalich', 'vnpl', 'credit', 'endBalance'],
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
          credit: 'К оплате',
          endBalance: 'Остаток на конец'
        }
      },

      // Итоги по колонкам "Наименование, Остаток на р/с, Прочее, ВнПл, К оплате и Остаток на конец"
      totalSumOfSaldo: 0,
      totalSumOfNalich: 0,
      totalSumOfVNPL: 0,
      totalSumOfCredit: 0,
      totalSumOfEndBalance: 0,

      // таблица данных по остаткам на р/с выбранной организации
      oplatDataColumns: ['acc.shortName', 'saldo', 'nalich', 'vnpl', 'credit', 'endBalance'],
      oplatData: [],
      oplatDataOptions: {
        filterable: ['acc.shortName'],
        pagination: { show: false },
        texts: { noResults: '', filter: 'Фильтр по наим. счета:', filterPlaceholder: '' },
        perPage: 100,
        perPageValues: [100],
        /* filterByColumn: true, */
        editableColumns: ['distributionSum', 'saldo', 'nalich', 'vnpl', 'credit', 'endBalance'],
        headings: {
          'acc.shortName': 'Наименование',
          saldo: 'Остаток на р/с',
          nalich: 'Прочее',
          vnpl: 'ВнПл',
          credit: 'К оплате',
          endBalance: 'Остаток на конец'
        }
      }
    }
  },
  mounted() {
    this.init()
    this.findOrganizatios()
  },
  methods: {
    init() {
      this.selOplat()
      this.groupByOrg()
      this.loadingType = {}
      this.findByDataOplatAndMyOrgId(this.orgId)
    },

    // Инициализация журнала оплат
    async selOplat() {
      await this.$api.payment.selOplat()
    },

    // Метод получения итоговой суммы документов к оплате по организациям
    async groupByOrg() {
      this.groupByOrgData = await this.getInfoAboutOrgs()
    },
    async getInfoAboutOrgs() {
      this.totalSumOfSaldo = 0
      this.totalSumOfNalich = 0
      this.totalSumOfVNPL = 0
      this.totalSumOfCredit = 0
      this.totalSumOfEndBalance = 0

      const data = {
        dateOplat: new Date(this.date).toLocaleDateString()
      }

      const response = await this.$api.paymentAccounts.groupByOrg(data)
      // $axios.$get('/meridian/oper/spOplat/groupByOrg', { params: data })
      for (const element of response) {
        element.name = element.myOrg.shortName
        element.credit = await this.getSumOfDocumentsToPayByOrgId(element.myOrg.id)
        element.endBalance = element.saldo + element.nalich + element.vnpl + element.credit

        this.totalSumOfSaldo += element.saldo
        this.totalSumOfNalich += element.nalich
        this.totalSumOfVNPL += element.vnpl
        this.totalSumOfCredit += element.credit
        this.totalSumOfEndBalance += element.endBalance
      }

      response.push({
        'name': 'Итого:',
        'saldo': this.totalSumOfSaldo,
        'nalich': this.totalSumOfNalich,
        'vnpl': this.totalSumOfVNPL,
        'credit': this.totalSumOfCredit,
        'endBalance': this.totalSumOfEndBalance
      })
      return response
    },
    async getSumOfDocumentsToPayByOrgId(orgId) {
      const data = {
        orgId
      }
      const paymentAccounts = await this.$api.paymentAccounts.findAccByOrgId(data)
      // $axios.$get('/meridian/oper/spAcc/findByOrgId?orgId=' + orgId)
      const balance = await this.getBalanceOfOtherAccounts(paymentAccounts, orgId)
      return balance
    },
    async getBalanceOfOtherAccounts(paymentAccounts, orgId) {
      let totalToSumOplat = 0
      const arrayOfPromises = []
      paymentAccounts.forEach((account) => {
        const promise = this.getSumToPayDocsOfOrgByAccId(account.id, orgId)
        arrayOfPromises.push(promise)
      })
      await Promise.all(arrayOfPromises).then((results) => {
        results.forEach((result) => {
          totalToSumOplat += result
        })
      })
      return totalToSumOplat
    },
    async getSumToPayDocsOfOrgByAccId(accId, orgId) {
      const data = {
        dateDoc: new Date(this.date).toLocaleDateString(),
        accId,
        orgId
      }

      let totalToSumOplat = 0
      const response = await this.$api.payment.docOplToPay.findSpDocoplToPay(data)
      response.forEach((value) => {
        totalToSumOplat += value.sumOplat
      })
      return totalToSumOplat
    },

    // Поиск организаций для выбора пользователем
    async findOrganizatios() {
      if (!this.organizations.length) {
        this.loadingType.organizations = true

        const data = {
          typeCode: 1
        }
        this.organizations = await this.$api.organizations.findByOrgTypeCode(data)

        this.loadingType.organizations = null
      }
    },

    // Получение списка расч. счетов выбранной организации и их сортировка по возрастанию
    async findByDataOplatAndMyOrgId(val) {
      const data = {
        dateOplat: new Date(this.date).toLocaleDateString(),
        orgId: val || 0
      }
      this.oplatData = await this.$api.paymentAccounts.findByDataOplatAndMyOrgId(data)
      // $axios.$get('/meridian/oper/spOplat/findByDataOplatAndMyOrgId', { params: data })
      this.oplatData.forEach(async(elem) => {
        elem.shortNameOfAcc = elem.acc.shortName
        elem.credit = await this.getSumToPayDocsOfOrgByAccId(elem.acc.id, elem.myOrg.id)
        elem.endBalance = elem.saldo + elem.nalich + elem.vnpl + elem.credit
      })
      this.oplatData = this.oplatData.sort(this.customCompare('shortNameOfAcc'))
    },

    // Отмена внесенных изменений и переполучение информации для формы из api
    cancel() {
      this.init()
    },

    // Сохранение внесенных пользователем изменений
    async save() {
      // await this.$api.payment.balanceOfPaymentAccount.save(this.oplatData)
      await this.$axios.$post('/oper/spOplat/saveAll', this.oplatData)
      this.init()
    }
  }

}
</script>

<style lang="scss">
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
  margin: 0px;
  min-width: 100%;
}

.input-of-balances-oplat-data-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0px;
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

#groupByOrg {
  border-collapse: collapse;
  width: 100%;
}
#groupByOrg table{
  width: 100%
}
#groupByOrg td, #groupByOrg th {
  border: 1px solid #ddd;
  padding: 0px;
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
  padding: 0px;
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
