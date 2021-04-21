<template>
  <v-card>
    <v-card-text>
      <v-container>
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
              type="date"
              v-model="date"
              @input="init"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <v-client-table
              :columns="groupByOrgColumns"
              :options="groupByOrgOptions"
              v-model="groupByOrgData"
            >
            </v-client-table>
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
          <v-col cols="8">
            <v-client-table
              :columns="oplatDataColumns"
              :options="oplatDataOptions"
              v-model="oplatData"
            >
              <input
                type="number"
                slot="saldo"
                slot-scope="{row, update}"
                v-model="row.saldo"
                @input="update(row.saldo)"
              >
              <input
                type="number"
                slot="nalich"
                slot-scope="{row, update}"
                v-model="row.nalich"
                @input="update(row.nalich)"
              >
              <input
                type="number"
                slot="vnpl"
                slot-scope="{row, update}"
                v-model="row.vnpl"
                @input="update(row.vnpl)"
              >
              <input
                type="number"
                slot="credit"
                slot-scope="{row, update}"
                v-model="row.credit"
                @input="update(row.credit)"
              >
              <input
                type="number"
                slot="endBalance"
                slot-scope="{row, update}"
                v-model="row.endBalance"
                @input="update(row.endBalance)"
              >
              <input
                type="number"
                slot="overdraft"
                slot-scope="{row, update}"
                v-model="row.overdraft"
                @input="update(row.overdraft)"
              >
            </v-client-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-btn
              @click="cancel"
            >
              Отмена
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn
              @click="save"
            >
              Сохранить
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
      groupByOrgColumns: ['saldo', 'nalich', 'vnpl', 'credit', 'endBalance', 'overdraft'],
      oplatDataColumns: ['acc.shortName', 'saldo', 'nalich', 'vnpl', 'credit', 'endBalance', 'overdraft'],
      groupByOrgOptions: {
        filterByColumn: false,
        headings: {
          'myOrg.shortName': 'Наименование',
          saldo: 'Остаток на р/с',
          nalich: 'Прочее',
          vnpl: 'ВнПл',
          credit: 'К оплате Требуется описание',
          endBalance: 'Остаток на конец  Требуется описание',
          overdraft: 'Остаток по овердрафту'
        }
      },
      oplatDataOptions: {
        filterByColumn: false,
        editableColumns: ['distributionSum', 'saldo', 'nalich', 'vnpl', 'credit', 'endBalance', 'overdraft'],
        headings: {
          'acc.shortName': 'Наименование',
          saldo: 'Остаток на р/с',
          nalich: 'Прочее',
          vnpl: 'ВнПл',
          credit: 'К оплате Требуется описание',
          endBalance: 'Остаток на конец  Требуется описание',
          overdraft: 'Остаток по овердрафту'
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
    groupByOrg() {
      const data = {
        dateOplat: new Date(this.date).toLocaleDateString()
      }
      this.$axios.$get('/meridian/oper/spOplat/groupByOrg', { params: data }).then((value) => {
        this.groupByOrgData = value
      })
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
    }
  }

}
</script>
