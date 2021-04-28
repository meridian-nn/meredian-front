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
                <input
                  slot="overdraft"
                  v-model="row.overdraft"
                  slot-scope="{row, update}"
                  type="number"
                  @input="update(row.overdraft)"
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
      orgId: null,
      loadingType: {},
      groupByOrgData: [],
      oplatData: [],
      organizations: [],
      groupByOrgColumns: ['name', 'saldo', 'nalich', 'vnpl', 'credit', 'endBalance'],
      oplatDataColumns: ['acc.shortName', 'saldo', 'nalich', 'vnpl', 'credit', 'endBalance'],
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
      oplatDataOptions: {
        filterable: false,
        pagination: { show: false },
        texts: { noResults: '' },
        perPage: 100,
        perPageValues: [100],
        filterByColumn: false,
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
    async selOplat() {
      await this.$axios.$post('/meridian/oper/spDocopl/selOplat', this.axiosConfig)
    },
    async groupByOrg() {
      const data = {
        dateOplat: new Date(this.date).toLocaleDateString()
      }
      const response = await this.$axios.$get('/meridian/oper/spOplat/groupByOrg', { params: data })
      response.forEach(async(element) => {
        element.name = element.myOrg.shortName
        element.credit = await this.getSumOfDocumentsToPayByOrgId(element.myOrg.id)
        element.endBalance = element.saldo - element.credit
      })
      this.groupByOrgData = response
    },

    // Метод получения итоговой суммы документов к оплате по организации
    async getSumOfDocumentsToPayByOrgId(orgId) {
      const paymentAccounts = await this.$axios.$get('/meridian/oper/spAcc/findByOrgId?orgId=' + orgId)
      return this.getBalanceOfOtherAccounts(paymentAccounts)
    },
    async getBalanceOfOtherAccounts(paymentAccounts) {
      let totalToSumOplat = 0
      const arrayOfPromises = []
      paymentAccounts.forEach((account) => {
        const promise = this.getSumToPayDocsOfOrgByAccId(account.id)
        arrayOfPromises.push(promise)
      })
      await Promise.all(arrayOfPromises).then((results) => {
        results.forEach((result) => {
          console.log(result)
          totalToSumOplat += result
        })
      })
      return totalToSumOplat
    },
    async getSumToPayDocsOfOrgByAccId(accId) {
      const data = {
        dateDoc: new Date(this.date).toLocaleDateString(),
        accId,
        orgId: this.selectedOrganization
      }

      let totalToSumOplat = 0
      const response = await this.$axios.$get('/meridian/oper/spDocopl/findSpDocoplToPay', { params: data })
      response.forEach((value) => {
        totalToSumOplat += value.sumOplat
      })
      return totalToSumOplat
    },

    async findOrganizatios() {
      if (!this.organizations.length) {
        this.loadingType.organizations = true
        this.organizations = await this.$axios.$get('/meridian/oper/dict/spOrg/findInternalOrg')
        this.loadingType.organizations = null
      }
    },
    async findByDataOplatAndMyOrgId(val) {
      const data = {
        dateOplat: new Date(this.date).toLocaleDateString(),
        orgId: val || 0
      }
      this.oplatData = await this.$axios.$get('/meridian/oper/spOplat/findByDataOplatAndMyOrgId', { params: data })
    },
    cancel() {
      this.init()
    },
    async save() {
      await this.$axios.$post('/meridian/oper/spOplat/saveAll', this.oplatData)
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
