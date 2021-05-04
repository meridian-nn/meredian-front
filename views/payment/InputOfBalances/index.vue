<template>
  <v-card>
    <v-card-text>
      <v-container class="input-of-balances-container">
        <v-row>
          <v-col cols="10">
            <div
              align="center"
              class="headline"
            >
              Ввод остатков по Р/С
            </div>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="date"
              type="date"
              @input="init"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div id="groupByOrg">
              <v-client-table
                v-model="groupByOrgData"
                :columns="groupByOrgColumns"
                :options="groupByOrgOptions"
              />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="5">
            <v-autocomplete
              v-model="orgId"
              label="Организация"
              :loading="loadingType.organizations"
              :items="organizations"
              item-value="id"
              item-text="clName"
              @change="findByDataOplatAndMyOrgId"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
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
                  v-model="row.saldo"
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
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="3">
            <v-btn
              @click="save"
            >
              Сохранить
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn
              @click="cancel"
            >
              Отмена
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
      const data = {
        dateOplat: new Date(this.date).toLocaleDateString()
      }

      const response = await this.$api.paymentAccounts.groupByOrg(data)
      // $axios.$get('/meridian/oper/spOplat/groupByOrg', { params: data })
      response.forEach(async(element) => {
        element.name = element.myOrg.shortName
        element.credit = await this.getSumOfDocumentsToPayByOrgId(element.myOrg.id)
        element.endBalance = element.saldo - element.credit
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
      // $axios.$get('/meridian/oper/spDocopl/findSpDocoplToPay', { params: data })
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
        elem.endBalance = elem.saldo - elem.credit
      })
      this.oplatData = this.oplatData.sort(this.compare('shortNameOfAcc'))
    },
    compare(field, order) {
      let len = arguments.length
      if (len === 0) {
        return (a, b) => (a < b && -1) || (a > b && 1) || 0
      }
      if (len === 1) {
        switch (typeof field) {
          case 'number':
            return field < 0
              ? (a, b) => (a < b && 1) || (a > b && -1) || 0
              : (a, b) => (a < b && -1) || (a > b && 1) || 0
          case 'string':
            return (a, b) => (a[field] < b[field] && -1) || (a[field] > b[field] && 1) || 0
        }
      }
      if (len === 2 && typeof order === 'number') {
        return order < 0
          ? (a, b) => (a[field] < b[field] && 1) || (a[field] > b[field] && -1) || 0
          : (a, b) => (a[field] < b[field] && -1) || (a[field] > b[field] && 1) || 0
      }
      let fields, orders
      if (typeof field === 'object') {
        fields = Object.getOwnPropertyNames(field)
        orders = fields.map(key => field[key])
        len = fields.length
      } else {
        fields = new Array(len)
        orders = new Array(len)
        for (let i = len; i--;) {
          fields[i] = arguments[i]
          orders[i] = 1
        }
      }
      return (a, b) => {
        for (let i = 0; i < len; i++) {
          if (a[fields[i]] < b[fields[i]]) { return orders[i] }
          if (a[fields[i]] > b[fields[i]]) { return -orders[i] }
        }
        return 0
      }
    },

    // Отмена внесенных изменений и переполучение информации для формы из api
    cancel() {
      this.init()
    },

    // Сохранение внесенных пользователем изменений
    async save() {
      await this.$axios.$post('/oper/spOplat/saveAll', this.oplatData)
      this.init()
    }
  }

}
</script>

<style lang="scss">
.input-of-balances-container{
  max-width: none;
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
  padding: 8px;
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
  padding: 8px;
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
