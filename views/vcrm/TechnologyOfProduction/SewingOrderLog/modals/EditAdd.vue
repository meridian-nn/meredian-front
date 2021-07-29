<template>
  <v-dialog
    :value="value"
    max-width="600px"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Редактирование заказа на дополнительную работу</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <form-control label="Производство">
                <v-autocomplete />
              </form-control>
            </v-col>

            <v-col cols="4">
              <v-checkbox
                v-model="govContract"
                label="Разрешенно печать на фабриках"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="4">
              <form-control label="Дата заказа на пошив">
                <v-text-field
                  v-model="endDate"
                  type="date"
                />
              </form-control>
            </v-col>

            <v-col cols="4">
              <form-control label="Коффициент на пошив">
                <v-text-field
                  v-model="endDate"
                />
              </form-control>
            </v-col>

            <v-col cols="4">
              <form-control label="Дата выпуска">
                <v-text-field
                  v-model="endDate"
                  type="date"
                />
              </form-control>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="9">
              <form-control label="Наименование">
                <v-textarea
                  solo
                />
              </form-control>
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
            <v-col cols="12">
              <v-textarea
                solo
                lable="Примечание"
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
              </vue-excel-editor>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ModalEditAdd',

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
        { kod: '', name: '', quntity: 25 },
        { kod: '', name: '', quntity: 20 },
        { kod: '', name: '', quntity: 19 }
      ]
    }
  }
}
</script>
