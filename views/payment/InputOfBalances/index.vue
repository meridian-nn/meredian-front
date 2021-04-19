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
      loadingType: {},
      groupByOrgData: [],
      groupByOrgColumns: ['saldo', 'nalich', 'vnpl', 'credit', 'endBalance', 'overdraft'],
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
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.selOplat()
      this.groupByOrg()
      this.loadingType = {}
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
    }
  }

}
</script>
