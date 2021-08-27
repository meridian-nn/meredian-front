<template>
  <v-dialog
    :value="value"
    max-width="550px"
    persistent
    @input="$emit('close')"
  >
    <v-card class="print-list-unsecured-orders">
      <v-card-title>
        Печать отчета "Список необеспеченных заказов за период"
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-text-field
                type="date"
                label="Дата с"
                outlined
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                type="date"
                label="Дата по"
                outlined
              />
            </v-col>
          </v-row>

          <v-data-table
            id="print-list-unsecured-orders-table"
            v-model="TableSelectedRecords"
            :headers="TableHeaders"
            fixed-header
            :items="dataForTable"
            :show-select="true"
            :single-select="true"
            disable-pagination
            hide-default-footer
            no-data-text=""
            class="elevation-1 mt-3"
          />
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
        >
          Печать
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="$emit('close')"
        >
          Отмена
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ModalPrintListUnsecuredOrders',

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      dataForTable: [
      ],
      TableHeaders: [
        {
          text: '',
          value: 'nameObs',
          width: '90%',
          sortable: false
        }
      ],
      TableSelectedRecords: []
    }
  },
  mounted() {
  },
  methods: {
    init() {
      // надо уточнить у Ирины
    }
  }
}
</script>
<style lang="scss">
.print-list-unsecured-orders {
  .v-text-field__details, .v-messages {
    display: none;
  }

  .v-card__text {
    padding-bottom: 0 !important;
  }

  .v-card__actions {
    padding-top: 0 !important;
  }

  .form-control {
    margin-bottom: 10px;

    &__label {
      flex-basis: 150px;
    }
  }

  #print-list-unsecured-orders-table {
    border-collapse: collapse;
    width: 100%;
  }

  #print-list-unsecured-orders-table table {
    width: 100%;
  }

  #print-list-unsecured-orders-table td, #print-list-unsecured-orders-table th {
    border: 1px solid #ddd;
    word-break: break-all !important;
    padding: 0 0 !important;
    height: 0 !important;
  }

  #print-list-unsecured-orders-table th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #639db1 !important;
    color: white;
  }
}
</style>
