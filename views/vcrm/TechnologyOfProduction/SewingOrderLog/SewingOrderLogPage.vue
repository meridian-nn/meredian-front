<template>
  <div class="sewing-order-log-page">
    <div class="sewing-order-log-page__table">
      <v-data-table
        v-model="selected"
        fixed-header
        show-select
        :single-select="false"
        disable-pagination
        hide-default-footer
        :headers="headers"
        :items="man"
        calculate-widths
        @contextmenu:row="rightClickHandler"
      >
        <template #[`item.dataZkzpsv`]="{ item }">
          {{ item.dataZkzpsv | formatDate('DD MMMM YYYY') }}
        </template>

        <template #[`item.planDataManager`]="{ item }">
          {{ item.planDataManager | formatDate('DD MMMM YYYY') }}
        </template>

        <template #[`item.dataRaskroyFact`]="{ item }">
          {{ item.dataRaskroyFact | formatDate('DD MMMM YYYY') }}
        </template>

        <template #[`item.planData`]="{ item }">
          {{ item.planData | formatDate('DD MMMM YYYY') }}
        </template>
      </v-data-table>

      <v-menu
        v-model="fromPayMenu"
        :position-x="xFromPayMenu"
        :position-y="yFromPayMenu"
        absolute
        offset-y
      >
        <v-list>
          <v-list-item>
            <v-list-item-title>
              Сформировать заказ на доп.работу
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SewingOrderLogPage',

  async asyncData({ $api }) {
    const manufacturs = await $api.manufacturing.findAll.get()

    return { manufacturs }
  },

  data() {
    return {
      fromPayMenu: false,
      xFromPayMenu: 0,
      yFromPayMenu: 0,
      selected: [],
      headers: [
        {
          text: 'План',
          value: 'numPlanpsv',
          width: '50px',
          sortable: false
        },
        {
          text: 'Заказ',
          value: 'numZkzpsv',
          width: '70px',
          sortable: false
        },
        {
          text: 'Дата',
          value: 'dataZkzpsv',
          width: '125px',
          sortable: false
        },
        {
          text: 'Производство',
          value: 'nameProizv',
          width: '100px',
          sortable: false
        },
        {
          text: 'Код',
          value: 'mcId',
          width: '100px',
          sortable: false
        },
        {
          text: 'Наименование МЦ',
          value: 'nameMc',
          width: '100px',
          sortable: false
        },
        {
          text: 'Ед.',
          value: 'nameProizv',
          width: '100px',
          sortable: false
        },
        {
          text: 'Кол-во',
          value: 'colvo',
          width: '100px',
          sortable: false
        },
        {
          text: 'План',
          value: 'planDataManager',
          width: '125px',
          sortable: false
        },
        {
          text: 'Факт',
          value: 'dataZkzpsv',
          width: '125px'
        },
        {
          text: 'Раскрой',
          value: 'nameRaskroy',
          width: '100px'
        },
        {
          text: 'Заявка',
          value: 'numZaivk',
          width: '100px'
        },
        {
          text: 'СводЗк',
          value: 'numSvod',
          width: '100px'
        },
        {
          text: 'Факт',
          value: 'dataRaskroyFact',
          width: '125px'
        },
        {
          text: 'Исполнитель',
          value: 'numZaivk',
          width: '100px'
        },
        {
          text: 'Отв.исп',
          value: 'otvIsp',
          width: '100px'
        },
        {
          text: 'Заявка',
          value: 'numZaivk',
          width: '100px'
        },
        {
          text: 'ГОСТ/ТУ',
          value: 'gostTu',
          width: '100px'
        },
        {
          text: 'Код ЗП',
          value: 'codGra',
          width: '100px'
        },
        {
          text: 'Фабрика',
          value: 'planData',
          width: '125px'
        },
        {
          text: 'КК',
          value: 'numZaivk',
          width: '100px'
        },
        {
          text: 'ТО',
          value: 'numZaivk',
          width: '100px'
        }
      ],
      man: [
        {
          'codGra': 'string',
          'colvo': 0,
          'dataGotovFabr': '2021-07-19T16:13:04.689Z',
          'dataRaskroyFact': '2021-07-19T16:13:04.689Z',
          'dataZkzpsv': '2021-07-19T16:13:04.689Z',
          'dopWork': 0,
          'factData': '2021-07-19T16:13:04.689Z',
          'fioIsp': 'string',
          'flagDel': 0,
          'gosKontrakt': 'string',
          'gostTu': 'string',
          'gotovKonfKarta': 0,
          'gotovMlog': 0,
          'gotovTo': 0,
          'gotovTp': 0,
          'id': 0,
          'ispId': 0,
          'kontrId': 0,
          'korp': 0,
          'mcId': 0,
          'mcIdRaskroy': 0,
          'nameKontr': 'string',
          'nameMc': 'string',
          'nameMcRaskroy': 'string',
          'nameOrg': 'string',
          'nameOrgRaskroy': 'string',
          'nameProizv': 'string',
          'nameRaskroy': 'string',
          'numOsn': 0,
          'numPlanpsv': 0,
          'numSvod': 0,
          'numZaivk': 'string',
          'numZkzpsv': 0,
          'numdog': 'string',
          'orgId': 0,
          'otdId': 0,
          'otvIsp': 'string',
          'parent': 0,
          'planData': '2021-07-19T16:13:04.689Z',
          'planDataManager': '2021-07-19T16:13:04.689Z',
          'prEt': 0,
          'prGotov': 0,
          'prQuality': 0,
          'prb': 0,
          'primProv': 'string',
          'procVip': 0,
          'proizvId': 0,
          'proizvRaskroy': 0,
          'sbst': 0,
          'socrName': 'string',
          'spplnId': 0,
          'tkanData': '2021-07-19T16:13:04.689Z',
          'userId': 0,
          'zkzpsvId': 0,
          'zkzpsvOsn': 0
        },

        {
          'codGra': 'string',
          'colvo': 0,
          'dataGotovFabr': '2021-07-19T16:13:04.689Z',
          'dataRaskroyFact': '2021-07-19T16:13:04.689Z',
          'dataZkzpsv': '2021-07-19T16:13:04.689Z',
          'dopWork': 0,
          'factData': '2021-07-19T16:13:04.689Z',
          'fioIsp': 'string',
          'flagDel': 0,
          'gosKontrakt': 'string',
          'gostTu': 'string',
          'gotovKonfKarta': 0,
          'gotovMlog': 0,
          'gotovTo': 0,
          'gotovTp': 0,
          'id': 0,
          'ispId': 0,
          'kontrId': 0,
          'korp': 0,
          'mcId': 0,
          'mcIdRaskroy': 0,
          'nameKontr': 'string',
          'nameMc': 'string',
          'nameMcRaskroy': 'string',
          'nameOrg': 'string',
          'nameOrgRaskroy': 'string',
          'nameProizv': 'string',
          'nameRaskroy': 'string',
          'numOsn': 0,
          'numPlanpsv': 0,
          'numSvod': 0,
          'numZaivk': 'string',
          'numZkzpsv': 0,
          'numdog': 'string',
          'orgId': 0,
          'otdId': 0,
          'otvIsp': 'string',
          'parent': 0,
          'planData': '2021-07-19T16:13:04.689Z',
          'planDataManager': '2021-07-19T16:13:04.689Z',
          'prEt': 0,
          'prGotov': 0,
          'prQuality': 0,
          'prb': 0,
          'primProv': 'string',
          'procVip': 0,
          'proizvId': 0,
          'proizvRaskroy': 0,
          'sbst': 0,
          'socrName': 'string',
          'spplnId': 0,
          'tkanData': '2021-07-19T16:13:04.689Z',
          'userId': 0,
          'zkzpsvId': 0,
          'zkzpsvOsn': 0
        }
      ]
    }
  },

  methods: {
    rightClickHandler(event, item) {
      event.preventDefault()

      this.fromPayMenu = false
      this.xFromPayMenu = event.clientX
      this.yFromPayMenu = event.clientY
      this.$nextTick(() => {
        this.fromPayMenu = true
      })
    }
  }
}
</script>

<style lang="scss">
.sewing-order-log-page {
  padding: 20px;

  &__table {
    overflow: auto;
  }
}
</style>
