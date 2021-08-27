<template>
  <v-dialog
    :value="value"
    max-width="550px"
    persistent
    @input="$emit('close')"
  >
    <v-card class="old-order-card-modal">
      <v-card-title>
        Заказ на пошив № {{ dataFromSewingOrderLog.numZkzpsv }}
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                class="mr-1"
                style="border-radius:50%; width: 40px; height: 40px;"
                min-width="40px"
                small
                color="red"
                v-bind="attrs"
                v-on="on"
                @click="modals.printListUnsecuredOrders = true"
              >
                <v-icon color="white">
                  mdi-printer
                </v-icon>
              </v-btn>
            </template>
            <span>Скачать для печати</span>
          </v-tooltip>

          <v-data-table
            id="order-card-old"
            v-model="TableSelectedRecords"
            :headers="TableHeaders"
            fixed-header
            :items="dataForTable"
            :show-select="false"
            :single-select="true"
            disable-pagination
            hide-default-footer
            no-data-text=""
            class="elevation-1 mt-3"
            @click:row="selectRow"
          />
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="$emit('close')"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
    <modal-print-list-unsecured-orders
      v-if="modals.printListUnsecuredOrders"
      :value="modals.printListUnsecuredOrders"
      @close="closeModal('printListUnsecuredOrders')"
    />
  </v-dialog>
</template>

<script>
import ModalPrintListUnsecuredOrders from './PrintListUnsecuredOrders'

export default {
  name: 'OldOrderCardModal',

  components: {
    ModalPrintListUnsecuredOrders
  },

  props: {
    value: {
      type: Boolean,
      default: false
    },
    dataFromSewingOrderLog: {
      type: Object,
      default: Object
    }
  },

  data() {
    return {
      modals: {
        printListUnsecuredOrders: false
      },
      loadingType: {
        dataTable: false
      },
      dataForTable: [
        {
          id: 1,
          nameObs: 'Сырье',
          dataGotov: '01.01.1990',
          nameUser: ''
        },
        {
          id: 2,
          nameObs: 'Лекала',
          dataGotov: '01.01.1990',
          nameUser: ''
        },
        {
          id: 3,
          nameObs: 'Задание',
          dataGotov: '01.01.1990',
          nameUser: ''
        },
        {
          id: 4,
          nameObs: 'Карта расхода сырья',
          dataGotov: '01.01.1990',
          nameUser: ''
        },
        {
          id: 5,
          nameObs: 'Карта расхода сырья по размерам',
          dataGotov: '01.01.1990',
          nameUser: ''
        },
        {
          id: 6,
          nameObs: 'Карта расхода фурнитуры',
          dataGotov: '01.01.1990',
          nameUser: ''
        },
        {
          id: 7,
          nameObs: 'Готовность этикеток',
          dataGotov: '01.01.1990',
          nameUser: ''
        },
        {
          id: 8,
          nameObs: 'Стеганная продукция',
          dataGotov: '01.01.1990',
          nameUser: ''
        },
        {
          id: 9,
          nameObs: 'Лист качества',
          dataGotov: '01.01.1990',
          nameUser: ''
        }
      ],
      TableSelectedRecords: [],
      TableHeaders: [
        {
          text: 'Тип обеспечения',
          value: 'nameObs',
          width: '50%',
          sortable: false
        },
        {
          text: 'Готовность',
          value: 'dataGotov',
          width: '25%',
          sortable: false
        },
        {
          text: 'Пользователь',
          value: 'nameUser',
          width: '25%',
          sortable: false
        }
      ]
    }
  },
  methods: {
    selectRow(selectedRow) {
      this.TableSelectedRecords = [selectedRow]
      console.log(this.TableSelectedRecords)
    },
    closeModal(name) {
      this.modals[name] = false
    }
  }
}
</script>
<style lang="scss">
.old-order-card-modal {
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

  #order-card-old {
    border-collapse: collapse;
    width: 100%;
  }

  #order-card-old table {
    width: 100%;
  }

  #order-card-old td, #order-card-old th {
    border: 1px solid #ddd;
    word-break: break-all !important;
    padding: 0 0 !important;
    height: 0 !important;
  }

  #order-card-old th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #639db1 !important;
    color: white;
  }
}
</style>
