<template>
  <div name="journal-of-payment-docs-header">
    <v-col cols="12">
      <div
        align="center"
        class="journal-of-payment-docs-main-row headline"
      >
        Журнал документов на оплату
      </div>
    </v-col>

    <div class="journal-of-payment-docs-row">
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
    </div>

    <div class="journal-of-payment-docs-row">
      <div
        class="journal-of-payment-docs-table-of-accounts-statistics"
      >
        <v-data-table
          :headers="orgAccInfoHeaders"
          :items="orgAccInfoData"
          hide-default-footer
          class="elevation-1"
        />
      </div>
    </div>
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
      const response = await this.$api.organizations.findByOrgTypeCode(data)

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
      const response = await this.$api.paymentAccounts.groupByOrg(data)
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
.journal-of-payment-docs-main-row {
    color: rgba(0, 0, 0, 0.6);
}
.journal-of-payment-docs-row {
    display: flex;
    flex-wrap: wrap;
    flex: 1 1 auto;
    margin: 0px;
}

.journal-of-payment-docs-table-of-accounts-statistics-enter-balances{
  padding-left: 0px;
  padding-right: 5px;
}

.journal-of-payment-docs-table-of-accounts-statistics{
  padding-bottom: 0px;
  flex: 0 0 100%;
  max-width: 100%;
}
</style>
