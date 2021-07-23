<template>
  <v-dialog
    v-model="dialog"
    width="1900px"
    :fullscreen="true"
    padding="0px"
    persistent
    class="profile-of-contractor-main-div"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        Карточка контрагента
      </v-card-title>

      <div class="profile-of-contractor-row">
        <v-subheader class="font-weight-medium text-subtitle-1">
          Начальное сальдо на:
        </v-subheader>

        <div class="profile-of-contractor-started-saldo-date-field">
          <v-text-field
            v-model.number="startedSaldoDate"
            hide-details="auto"
            type="date"
            outlined
            dense
          />
        </div>

        <v-subheader class="font-weight-medium text-subtitle-1">
          Контрагент:
        </v-subheader>

        <div class="profile-of-contractor-started-contractor-field">
          <v-text-field
            v-model.number="contractor"
            hide-details="auto"
            :readonly="true"
            outlined
            dense
          />
        </div>
      </div>

      <div class="profile-of-contractor-row">
        <v-subheader class="font-weight-medium text-subtitle-1">
          Cальдо на:
        </v-subheader>

        <div class="profile-of-contractor-saldo-date-field">
          <v-text-field
            v-model.number="saldoDate"
            hide-details="auto"
            type="date"
            outlined
            dense
          />
        </div>

        <div class="profile-of-contractor-saldo-spacer" />

        <div class="profile-of-contractor-amount-of-debit-field">
          <v-text-field
            v-model.number="pointThree"
            hide-details="auto"
            :readonly="true"
            outlined
            dense
          />
        </div>

        <div class="profile-of-contractor-amount-of-credit-field">
          <v-text-field
            v-model.number="pointFour"
            hide-details="auto"
            :readonly="true"
            outlined
            dense
          />
        </div>

        <div class="profile-of-contractor-organizations">
          <v-autocomplete
            v-model="orgId"
            label="Организация"
            :loading="loadingType.organizations"
            :items="organizations"
            outlined
            hide-details="auto"
            item-value="id"
            item-text="clName"
            dense
          />
        </div>
      </div>

      <div
        class="profile-of-contractor-row"
        style="margin-bottom: 5px"
      >
        <v-data-table
          id="profile-of-contractor-operations-table"
          v-model="operationsTableSelectedRows"
          :headers="operationsTableHeaders"
          fixed-header
          :items="operationsTableItems"
          height="310"
          item-key="id"
          :show-select="false"
          disable-pagination
          hide-default-footer
          no-data-text=""
          class="elevation-1"
        />
      </div>

      <div class="profile-of-contractor-row">
        <div class="profile-of-contractor-spacer" />

        <v-subheader class="font-weight-medium text-subtitle-1">
          Итого:
        </v-subheader>

        <div class="profile-of-contractor-amount-of-debit-field">
          <v-text-field
            v-model.number="amountOfDebit"
            hide-details="auto"
            :readonly="true"
            outlined
            dense
          />
        </div>

        <div class="profile-of-contractor-amount-of-credit-field">
          <v-text-field
            v-model.number="amountOfCredit"
            hide-details="auto"
            :readonly="true"
            outlined
            dense
          />
        </div>
      </div>

      <div class="profile-of-contractor-row">
        <v-subheader class="font-weight-medium text-subtitle-1">
          Cальдо на:
        </v-subheader>

        <div class="profile-of-contractor-saldo-date-field">
          <v-text-field
            v-model.number="secondSaldoDate"
            hide-details="auto"
            type="date"
            outlined
            dense
          />
        </div>

        <div class="profile-of-contractor-saldo-spacer" />

        <div class="profile-of-contractor-amount-of-debit-field">
          <v-text-field
            v-model.number="pointNine"
            hide-details="auto"
            :readonly="true"
            outlined
            dense
          />
        </div>

        <div class="profile-of-contractor-amount-of-credit-field">
          <v-text-field
            v-model.number="pointTen"
            hide-details="auto"
            :readonly="true"
            outlined
            dense
          />
        </div>
      </div>

      <div class="profile-of-contractor-row">
        <v-subheader
          class="font-weight-medium text-subtitle-1"
          style="margin: 0 auto"
        >
          СОСТАВ ДОКУМЕНТА
        </v-subheader>
      </div>

      <div class="profile-of-contractor-row">
        <v-data-table
          id="profile-of-contractor-items-of-operation-table"
          v-model="itemsOfOperationTableSelectedRows"
          :headers="itemsOfOperationTableHeaders"
          fixed-header
          :items="itemsOfOperationTableItems"
          height="310"
          item-key="id"
          :show-select="false"
          disable-pagination
          hide-default-footer
          no-data-text=""
          class="elevation-1"
        />
      </div>

      <div class="profile-of-contractor-row">
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="close"
        >
          Закрыть
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ProfileOfContractorPage',

  data() {
    return {
      currentDate: new Date(),

      loadingType: {},

      dialog: false,

      startedSaldoDate: this.currentDate,

      contractor: '',

      saldoDate: this.currentDate,

      pointThree: '',

      pointFour: '',

      organizations: [],
      orgId: null,

      operationsTableSelectedRows: [],
      operationsTableHeaders: [
        {
          text: '№',
          value: 'number',
          width: '60px'
        },
        {
          text: 'Дата',
          value: 'date',
          width: '60px'
        },
        {
          text: 'Операция',
          value: 'operation',
          width: '60px'
        },
        {
          text: 'Дебет',
          value: 'debit',
          width: '60px'
        },
        {
          text: 'Кредит',
          value: 'credit',
          width: '60px'
        },
        {
          text: 'Сальдо',
          value: 'saldo',
          width: '60px'
        },
        {
          text: 'Фирма',
          value: 'organization',
          width: '60px'
        },
        {
          text: 'Исполнитель',
          value: 'executor',
          width: '60px'
        },
        {
          text: 'Отдел',
          value: 'department',
          width: '60px'
        }
      ],
      operationsTableItems: [],

      amountOfDebit: 0,

      amountOfCredit: 0,

      secondSaldoDate: this.currentDate,

      pointNine: null,

      pointTen: null,

      itemsOfOperationTableSelectedRows: [],
      itemsOfOperationTableHeaders: [
        {
          text: 'Т/У',
          value: 'ty',
          width: '60px'
        },
        {
          text: 'Код',
          value: 'code',
          width: '60px'
        },
        {
          text: 'Наименование',
          value: 'name',
          width: '60px'
        },
        {
          text: 'Ед.',
          value: 'unit',
          width: '60px'
        },
        {
          text: 'Кол-во',
          value: 'amount',
          width: '60px'
        },
        {
          text: 'Цена',
          value: 'price',
          width: '60px'
        },
        {
          text: 'Стоимость',
          value: 'cost',
          width: '60px'
        }
      ],
      itemsOfOperationTableItems: []
    }
  },

  watch: {
    dialog(val) {
      if (val) {
        this.init()
      }
    }
  },

  methods: {
    init() {
      this.findOrganizations()
    },

    async findOrganizations() {
      this.loadingType.organizations = true
      const searchCriterias = this.createCriteriasToSearchActualOrganizations()
      this.organizations = await this.$api.organizations.findBySearchCriterias(searchCriterias)
      this.loadingType.organizations = null
    },

    openForm(itemOfTable) {
      console.log(itemOfTable)
      this.reset()
      this.dialog = true
    },

    close() {
      this.dialog = false
      this.$emit('close')
    },

    reset() {
      this.startedSaldoDate = null
      this.saldoDate = null
      this.secondSaldoDate = null
      this.loadingType = {}
      this.organizations = []
      this.orgId = null
    }
  }
}
</script>

<style lang="scss">
.profile-of-contractor-main-div {
  padding: 10px
}

.profile-of-contractor-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  min-width: 100%;
}

.profile-of-contractor-started-saldo-date-field {
  width: 250px;
}

.profile-of-contractor-contractor-field {
  width: 250px;
}

.profile-of-contractor-saldo-date-field {
  margin-right: 5px;
}

.profile-of-contractor-amount-of-debit-field {
  margin-right: 5px;
}

.profile-of-contractor-amount-of-credit-field {
  margin-right: 5px;
}

.profile-of-contractor-started-contractor-field {
  width: 400px;
}

.profile-of-contractor-organizations {
  width: 400px;
}

.profile-of-contractor-spacer {
  flex: 0 0 29%;
  max-width: 29%;
}

.profile-of-contractor-saldo-spacer {
  flex: 0 0 17.3%;
  max-width: 17.3%;
}

#profile-of-contractor-operations-table {
  border-collapse: collapse;
  width: 100%;
  height: 310px;
}

#profile-of-contractor-operations-table table {
  width: 100%;
}

#profile-of-contractor-operations-table td, #profile-of-contractor-operations-table th {
  border: 1px solid #ddd;
  word-break: break-all !important;
  padding: 0 0 !important;
  height: 0 !important;
}

#profile-of-contractor-operations-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

#profile-of-contractor-operations-table tr:hover {
  background-color: #ddd;
}

#profile-of-contractor-operations-table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

#profile-of-contractor-items-of-operation-table {
  border-collapse: collapse;
  width: 100%;
  height: 310px;
}

#profile-of-contractor-items-of-operation-table table {
  width: 100%;
}

#profile-of-contractor-items-of-operation-table td, #profile-of-contractor-items-of-operation-table th {
  border: 1px solid #ddd;
  word-break: break-all !important;
  padding: 0 0 !important;
  height: 0 !important;
}

#profile-of-contractor-items-of-operation-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

#profile-of-contractor-items-of-operation-table tr:hover {
  background-color: #ddd;
}

#profile-of-contractor-items-of-operation-table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}
</style>
