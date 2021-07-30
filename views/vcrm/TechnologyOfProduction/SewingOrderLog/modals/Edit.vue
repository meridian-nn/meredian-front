<template>
  <v-dialog
    :value="value"
    max-width="800px"
    class="sewing-order-log-modal-edit"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Редактирование заказа на дополнительную работу</span>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="6">
            <form-control label="Раскрой">
              <v-autocomplete />
            </form-control>
          </v-col>

          <v-col cols="6">
            <form-control label="Плановая дата раскроя">
              <v-text-field
                v-model="endDate"
                type="date"
              />
            </form-control>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="3">
            <v-text-field
              v-model="endDate"
              label="Крой"
            />
          </v-col>

          <v-col cols="9">
            <v-textarea
              solo
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="9">
            <v-textarea
              solo
              label="Наименование"
            />
          </v-col>

          <v-col cols="3">
            <form-control label="Кол-во">
              <v-text-field
                v-model="endDate"
              />
            </form-control>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <v-autocomplete lable="Договор №" />
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="endDate"
              label="Кофициент на пошив"
            />
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="endDate"
              label="Кофициент на раскрой"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="endDate"
              label="Дата заказа на пошив"
              type="date"
            />
          </v-col>

          <v-col cols="4">
            <v-text-field
              v-model="endDate"
              label="Дата выпуска"
              type="date"
            />
          </v-col>

          <v-col cols="4">
            <v-checkbox
              v-model="govContract"
              label="Разрешено печатать на фабриках"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea
              solo
              label="Примечание"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <vue-excel-editor v-model="jsondata">
              <vue-excel-column
                field="kod"
                label="Код"
                type="string"
                width="80px"
              />
              <vue-excel-column
                field="name"
                label="Наименование"
                type="string"
                width="300px"
              />
              <vue-excel-column
                field="quntity"
                label="Количество"
                type="string"
                width="80px"
              />
              <vue-excel-column
                field="order"
                label="№ Заказа"
                type="string"
                width="80px"
              />
            </vue-excel-editor>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ModalEdit',

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      editedItem: {
        num_plan: '',
        num_zkz: ''
      },
      jsondata: [
        { kod: '', name: '', quntity: 25, order: '' },
        { kod: '', name: '', quntity: 20, order: '' },
        { kod: '', name: '', quntity: 19, order: '' }
      ]
    }
  }
}
</script>
<style lang="scss">
.sewing-order-log-modal-edit {
  .row + .row {
    margin-top: 0 !important;
  }
}
</style>
