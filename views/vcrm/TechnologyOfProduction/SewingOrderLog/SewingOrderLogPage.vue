<template>
  <div class="sewing-order-log-page">
    <div class="sewing-order-log-page-row">
      <div class="sewing-order-log-page-btn mr-4">
        <v-btn
          fab
          small
          color="blue"
        >
          <v-icon color="white">
            mdi-pencil
          </v-icon>
        </v-btn>

        <v-btn
          fab
          small
          color="red"
        >
          <v-icon color="white">
            mdi-delete
          </v-icon>
        </v-btn>
      </div>

      <v-checkbox
        v-model="govContract"
        style="padding-top: 5px"
        label="ГОСКОНТРАКТ"
      />

      <v-checkbox
        v-model="noOTK"
        style="padding-top: 5px"
        label="Нет проверки ОТК"
      />

      <div class="sewing-order-log-page-btn">
        <v-btn>
          Формирование уведомления о приемке для склада
        </v-btn>
      </div>
    </div>

    <div class="sewing-order-log-page-row">
      <div class="sewing-order-log-page__table">
        <v-data-table
          id="sewing-order-log-page-records-table"
          v-model="selected"
          height="650"
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

    <div class="sewing-order-log-page-row">
      <v-subheader class="font-weight-medium text-subtitle-1">
        Заказчик:
      </v-subheader>

      <div class="sewing-order-log-page-customer-field">
        <v-text-field
          v-model.number="customerName"
          hide-details="auto"
          :readonly="true"
          outlined
        />
      </div>
    </div>

    <div class="sewing-order-log-page-row">
      <div class="sewing-order-log-page-secondary-work-rectangle" />
      <v-subheader
        class="font-weight-medium text-subtitle-1"
      >
        Заказ на дополнительную работу
      </v-subheader>

      <div class="sewing-order-log-page-order-complete-rectangle" />
      <v-subheader
        class="font-weight-medium text-subtitle-1"
      >
        Заказ выполнен
      </v-subheader>

      <div
        class="sewing-order-log-page-defect-checked-label"
      >
        Бордовым цветом подсвечены позиции, где есть проверки базы по браку
      </div>

      <div
        class="sewing-order-log-page-defect-checked-and-have-comments-label"
      >
        Красным цветом подсвечены позиции, где есть замечания базы по браку
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SewingOrderLogPage',

  async asyncData({ $api }) {
    const manufacturs = await $api.manufacturing.manufacturingRequestJournalFindAll()

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
          width: '35px',
          sortable: false
        },
        {
          text: 'Заказ',
          value: 'numZkzpsv',
          width: '40px',
          sortable: false
        },
        {
          text: 'Дата',
          value: 'dataZkzpsv',
          width: '93px',
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
          width: '60px',
          sortable: false
        },
        {
          text: 'Наименование МЦ',
          value: 'nameMc',
          width: '120px',
          sortable: false
        },
        {
          text: 'Ед.',
          value: 'nameProizv',
          width: '50px',
          sortable: false
        },
        {
          text: 'Кол-во',
          value: 'colvo',
          width: '60px',
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
          width: '95px'
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
          width: '80px'
        },
        {
          text: 'Факт',
          value: 'dataRaskroyFact',
          width: '95px'
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
          width: '40px'
        },
        {
          text: 'ТО',
          value: 'gotovTo',
          width: '40px'
        },
        {
          text: 'МЛ',
          value: 'gotovMl',
          width: '40px'
        },
        {
          text: 'ТП',
          value: 'gotovTp',
          width: '40px'
        },
        {
          text: 'ОТК',
          value: 'gotovOtk',
          width: '50px'
        },
        {
          text: 'Печать',
          value: 'print',
          width: '70px'
        },
        {
          text: 'Крой',
          value: 'kroy',
          width: '60px'
        },
        {
          text: 'Наименвоание кроя',
          value: 'nameKroy',
          width: '140px'
        },
        {
          text: 'Госконтракт',
          value: 'govcontract',
          width: '95px'
        },
        {
          text: 'Договор',
          value: 'contract',
          width: '70px'
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
      ],

      govContract: false,

      noOTK: false,

      customerName: ''
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

#sewing-order-log-page-records-table {
  border-collapse: collapse;
  width: 100%;
  height: 650px;
}

#sewing-order-log-page-records-table table {
  width: 100%;
}

#sewing-order-log-page-records-table td, #sewing-order-log-page-records-table th {
  border: 1px solid #ddd;
  word-break: break-all !important;
  padding: 0 0 !important;
  height: 0 !important;
}

#sewing-order-log-page-records-table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

.sewing-order-log-page-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
  min-width: 100%;
}

.sewing-order-log-page-btn {
  padding-top: 13px;
}

.sewing-order-log-page-secondary-work-rectangle {
  height: 30px;
  width: 50px;
  background-color: indianred;
  margin-top: 7px;
}

.sewing-order-log-page-order-complete-rectangle {
  height: 30px;
  width: 50px;
  background-color: lightyellow;
  margin-top: 7px;
}

.sewing-order-log-page-defect-checked-label {
  color: indianred;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 12px;
}

.sewing-order-log-page-defect-checked-and-have-comments-label {
  color: red;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 12px;
}

.sewing-order-log-page-customer-field {
  width: 1000px;
}
</style>
