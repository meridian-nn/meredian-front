<template>
  <v-dialog
    :value="value"
    max-width="1150px"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        Список сырья по заказу на пошив
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="3">
            <div class="mb-2">
              <v-btn
                fab
                x-small
                color="blue"
                class="mb-2"
              >
                <v-icon color="white">
                  mdi-select
                </v-icon>
              </v-btn>

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

              <v-btn
                fab
                x-small
                color="blue"
                class="mb-2"
              >
                <v-icon color="white">
                  mdi-printer
                </v-icon>
              </v-btn>
            </div>
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

          <v-col cols="7">
            <v-textarea
              solo
              outlined
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="2">
            <form-control label="Поступ.ткан">
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

          <v-col cols="1">
            <v-checkbox
              label="Ткань"
            />
          </v-col>

          <v-col cols="3">
            <v-checkbox
              label="Сырьё и фурнитура"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <vue-excel-editor v-model="material">
              <vue-excel-column
                field="mc_id"
                label="Код"
                type="string"
                width="80px"
              />
              <vue-excel-column
                field="name_sr"
                label="Сырье"
                type="string"
                width="350px"
              />
              <vue-excel-column
                field="colvo"
                label="Кол-во"
                type="string"
                width="100px"
              />
              <vue-excel-column
                field="colvo_otpr"
                label="Отправлено"
                type="string"
                width="100px"
              />
              <vue-excel-column
                field="colvo_ost"
                label="Необходимо"
                type="string"
                width="100px"
              />
              <vue-excel-column
                field="colvo_ost"
                label="Код до замены"
                type="string"
                width="100px"
              />
              <vue-excel-column
                field="name_mc_osn"
                label="Наименование сырья до замены"
                type="string"
                width="250px"
              />
              <vue-excel-column
                field="name_proizv"
                label="Производство кроя"
                type="string"
                width="250px"
              />
              <vue-excel-column
                field="colvo_sl"
                label="Сл"
                type="string"
                width="70px"
              />
              <vue-excel-column
                field="name_srvid"
                label="В"
                type="string"
                width="70px"
              />
              <vue-excel-column
                field="name_ed"
                label="Ед."
                type="string"
                width="70px"
              />
              <vue-excel-column
                field="colvo_ed"
                label="Ср.норма"
                type="string"
                width="70px"
              />
            </vue-excel-editor>
          </v-col>
        </v-row>

        <div class="total" />
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
          Сохранить
        </v-btn>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ActualConsumptionRawMaterials',

  props: {
    edit: {
      type: Object,
      default: () => {}
    },

    value: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      material: [
        {
          mc_id: '',
          name_sr: '',
          colvo: '',
          colvo_otpr: '',
          colvo_ost: '',
          name_mc_osn: '',
          name_proizv: '',
          colvo_sl: '',
          name_srvid: '',
          name_ed: '',
          colvo_ed: ''
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

<style lang="scss" scope>
.v-input--selection-controls {
  margin-top: 0 !important;
}
.v-messages, .v-text-field__details {
  display: none;
}
.col {
  padding-bottom: 0 !important;
}
</style>
