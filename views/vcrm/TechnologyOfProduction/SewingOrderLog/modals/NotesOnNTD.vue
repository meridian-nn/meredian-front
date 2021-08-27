<template>
  <v-dialog
    :value="value"
    max-width="1050px"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        Форма ввода замечаний по НТД
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="2">
            <div class="mb-2">
              <v-btn
                fab
                x-small
                color="blue"
                class="mb-2"
              >
                <v-icon color="white">
                  mdi-plus
                </v-icon>
              </v-btn>

              <v-btn
                fab
                x-small
                color="blue"
                class="mb-2"
              >
                <v-icon color="white">
                  mdi-minus
                </v-icon>
              </v-btn>

              <v-btn
                fab
                x-small
                color="blue"
                class="mb-2"
              >
                <v-icon color="white">
                  mdi-content-save
                </v-icon>
              </v-btn>

              <v-btn
                fab
                x-small
                color="blue"
                class="mb-2"
              >
                <v-icon color="white">
                  mdi-exit-to-app
                </v-icon>
              </v-btn>
            </div>
          </v-col>

          <v-col cols="2">
            <form-control label="Заказ №">
              <v-text-field
                outlined
                dense
                hide-details="auto"
              />
            </form-control>
          </v-col>

          <v-col cols="2">
            <form-control label="Заявка">
              <v-text-field
                outlined
                dense
                hide-details="auto"
              />
            </form-control>
          </v-col>

          <v-col cols="2">
            <form-control label="Кол-во">
              <v-text-field
                outlined
                dense
                hide-details="auto"
              />
            </form-control>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <form-control label="Фабрика">
              <v-text-field
                outlined
                dense
                hide-details="auto"
              />
            </form-control>
          </v-col>

          <v-col cols="2">
            <form-control label="Код">
              <v-text-field
                outlined
                dense
                hide-details="auto"
              />
            </form-control>
          </v-col>

          <v-col cols="6">
            <form-control label="Наименование">
              <v-textarea
                outlined
                dense
                hide-details="auto"
              />
            </form-control>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <div class="notes-on-ntd-table">
              <div class="notes-on-ntd-type">
                <div class="notes-on-ntd-type__item">
                  Заполняет Фабрика
                </div>

                <div class="notes-on-ntd-type__item">
                  Заполняет Офис
                </div>
              </div>
              <div class="notes-on-ntd-discharge">
                <div class="notes-on-ntd-discharge__item" />
              </div>
              <vue-excel-editor v-model="data">
                <vue-excel-column
                  field="number"
                  label="№"
                  type="string"
                  width="50px"
                />
                <vue-excel-column
                  field="date"
                  label="Дата"
                  type="date"
                  width="70px"
                />
                <vue-excel-column
                  field="name_ntd"
                  label="Наименование НТД"
                  type="string"
                  width="150px"
                />
                <vue-excel-column
                  field="net"
                  label="Замечаний нет"
                  type="check10"
                  width="50px"
                />
                <vue-excel-column
                  field="vid"
                  label="Вид"
                  type="string"
                  width="80px"
                />
                <vue-excel-column
                  field="opis"
                  label="Описание"
                  type="string"
                  width="150px"
                />
                <vue-excel-column
                  field="fio_fabr"
                  label="ФИО"
                  type="string"
                  width="120px"
                />
                <vue-excel-column
                  field="fio_vina"
                  label="ФИО"
                  type="string"
                  width="70px"
                />
                <vue-excel-column
                  field="prichina"
                  label="Причина"
                  type="string"
                  width="70px"
                />
                <vue-excel-column
                  field="data_ispr"
                  label="Дата"
                  type="string"
                  width="70px"
                />
                <vue-excel-column
                  field="fio_ispr"
                  label="ФИО"
                  type="string"
                  width="120px"
                />
                <vue-excel-column
                  field="comments"
                  label="Комментарий"
                  type="string"
                  width="150px"
                />
              </vue-excel-editor>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="$emit('close')"
        >
          Отмена
        </v-btn>

        <v-btn
          color="blue darken-1"
          text
          @click="$emit('close')"
        >
          Ввод
        </v-btn>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'NotesOnNTD',

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      data: [
        {
          number: '',
          date: '',
          name_ntd: '',
          net: false,
          vid: '',
          opis: '',
          fio_fabr: '',
          fio_vina: '',
          prichina: '',
          data_ispr: '',
          fio_ispr: '',
          comments: ''
        },
        {
          number: '',
          date: '',
          name_ntd: '',
          net: false,
          vid: '',
          opis: '',
          fio_fabr: '',
          fio_vina: '',
          prichina: '',
          data_ispr: '',
          fio_ispr: '',
          comments: ''
        },
        {
          number: '',
          date: '',
          name_ntd: '',
          net: false,
          vid: '',
          opis: '',
          fio_fabr: '',
          fio_vina: '',
          prichina: '',
          data_ispr: '',
          fio_ispr: '',
          comments: ''
        },
        {
          number: '',
          date: '',
          name_ntd: '',
          net: false,
          vid: '',
          opis: '',
          fio_fabr: '',
          fio_vina: '',
          prichina: '',
          data_ispr: '',
          fio_ispr: '',
          comments: ''
        },
        {
          number: '',
          date: '',
          name_ntd: '',
          net: false,
          vid: '',
          opis: '',
          fio_fabr: '',
          fio_vina: '',
          prichina: '',
          data_ispr: '',
          fio_ispr: '',
          comments: ''
        },
        {
          number: '',
          date: '',
          name_ntd: '',
          net: false,
          vid: '',
          opis: '',
          fio_fabr: '',
          fio_vina: '',
          prichina: '',
          data_ispr: '',
          fio_ispr: '',
          comments: ''
        }
      ]
    }
  },

  computed: {
    total() {
      return this.data
    }
  }
}
</script>

<style lang="scss">
.notes-on-ntd-type {
  display: flex;
  min-width: 1500px;
  &__item {
    border-top: 1px solid red;
    border-left: 1px solid red;
    padding: 2px 5px;
    &:first-of-type {
      flex-basis: 710px;
    }
    &:last-of-type {
      flex: 1;
    }
  }
}
.notes-on-ntd-table {
  overflow: auto;
}
</style>
