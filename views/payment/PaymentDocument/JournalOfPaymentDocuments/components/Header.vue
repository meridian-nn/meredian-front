<template>
  <div name="journal-of-payment-document-header">
    <v-col cols="12">
      <div
        align="center"
        class="journal-of-payment-main-row headline"
      >
        Журнал документов на оплату
      </div>
    </v-col>

    <v-row>
      <v-col
        cols="10"
      >
        <v-subheader class="font-weight-medium text-subtitle-1">
          Остатки на расчетных счетах
        </v-subheader>
      </v-col>

      <v-col
        cols="2"
        class="journal-of-payment-docs-table-of-accounts-statistics-enter-balances"
      >
        <div
          align="right"
        >
          <v-btn
            @click="$router.push({name: 'InputOfBalances'})"
          >
            Ввод остатков по Р/С
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        class="journal-of-payment-docs-table-of-accounts-statistics"
      >
        <v-data-table
          :headers="orgAccInfoHeaders"
          :items="orgAccInfoData"
          hide-default-footer
          class="elevation-1"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>

export default {
  name: 'JournalOfPaymentDocumentsHeader',
  data() {
    return {
      // Шапка таблицы остатков по расчетным счетам
      orgAccInfoHeaders: [],

      // Данные таблицы остатков по расчетным счетам
      orgAccInfoData: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.findOrganizationsForTotalResults()
    },

    // Поиск организаций с типом "BUDGET"
    async findOrganizationsForTotalResults() {
      const data = {
        typeCode: 1
      }
      const response = await this.$axios.$get('/meridian/oper/dict/spOrg/findByOrgTypeCode', { params: data })

      this.orgAccInfoHeaders.push({
        text: '',
        value: 'name'
      })
      response.forEach((element) => {
        const columnOrgValueName = 'org' + element.id + 'Value'
        this.orgAccInfoHeaders.push({
          text: element.shortName,
          orgId: element.id,
          value: columnOrgValueName
        })
      })
      this.findOrgAccInfo()
    },

    // Поиск остатков на расчетных счетах найденных организаций
    async findOrgAccInfo() {
      const data = {
        dateOplat: new Date().toLocaleDateString()
      }
      const response = await this.$axios.$get('/meridian/oper/spOplat/groupByOrg', { params: data })
      this.orgAccInfoData = []

      const orgAccInfoDataAccounts = {}
      orgAccInfoDataAccounts.name = 'Расч. счёт'

      const orgAccInfoDataCashbox = {}
      orgAccInfoDataCashbox.name = 'Касса'

      this.orgAccInfoHeaders.forEach((orgAccElem) => {
        const responseElem = response.find(el => el.myOrg.id === orgAccElem.orgId)
        if (responseElem) {
          orgAccInfoDataAccounts[orgAccElem.value] = responseElem.saldo
          orgAccInfoDataCashbox[orgAccElem.value] = 0
        }
      })

      this.orgAccInfoData.push(orgAccInfoDataAccounts)
      this.orgAccInfoData.push(orgAccInfoDataCashbox)
    }
    /* async findOrgAccInfo() {
      if (!this.orgAccInfoData.length) {
        this.orgAccInfoData = await this.$axios.$get('/meridian/oper/spDocopl/getOrgAccInfo', this.axiosConfig)
      }
    }, */
  }
}

</script>

<style lang="scss">
.journal-of-payment-main-row {
    padding-bottom: 10px;
}
.journal-of-payment-docs-table-of-accounts-statistics-enter-balances{
  padding-left: 0px;
  padding-right: 5px;
}
.journal-of-payment-docs-table-of-accounts-statistics{
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 0px;
  flex: 0 0 99%;
  max-width: 99%;
}
</style>
