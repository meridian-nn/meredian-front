<template>
  <v-dialog
    :value="value"
    :fullscreen="true"
    class="edit-order-for-tailoring"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Редактирование заказа на пошив</span>
      </v-card-title>

      <v-card-text>
        <div class="edit-order-for-tailoring-row">
          <div class="edit-order-for-tailoring-cut">
            <form-control label="Раскрой">
              <v-autocomplete
                v-model="editedItem.raskroy"
              />
            </form-control>
          </div>

          <form-control label="Плановая дата раскроя">
            <v-text-field
              v-model="editedItem.planingDateOfRaskroy"
              type="date"
            />
          </form-control>
        </div>

        <div class="edit-order-for-tailoring-row">
          <div class="edit-order-for-tailoring-kroy">
            <form-control label="Крой">
              <v-text-field
                v-model="editedItem.kroy"
                outlined
                dense
                hide-details="auto"
              />
            </form-control>
          </div>

          <div class="edit-order-for-tailoring-spacer" />

          <div class="edit-order-for-tailoring-descr">
            <v-textarea
              v-model="editedItem.descr"
              solo
            />
          </div>
        </div>

        <div class="edit-order-for-tailoring-row">
          <div class="edit-order-for-tailoring-left-col">
            <div class="edit-order-for-tailoring-contract">
              <form-control label="Договор №">
                <v-autocomplete
                  v-model="editedItem.contract"
                />
              </form-control>
            </div>

            <div class="edit-order-for-tailoring-row">
              <div class="edit-order-for-tailoring-date-of-order-for-tailoring">
                <form-control label="Дата заказа на пошив">
                  <v-text-field
                    v-model="editedItem.dateOfTheOrderForTailoring"
                    type="date"
                  />
                </form-control>
              </div>

              <v-simple-checkbox
                v-model="editedItem.kroyOnPaper"
              />

              <div
                class="edit-order-for-tailoring-label-checkbox"
              >
                Крой на бумаге
              </div>
            </div>

            <div class="edit-order-for-tailoring-textarea-note">
              <v-textarea
                v-model="editedItem.note"
                solo
                label="Примечание"
              />
            </div>
          </div>

          <div class="edit-order-for-tailoring-spacer" />

          <div class="edit-order-for-tailoring-right-col">
            <div class="edit-order-for-tailoring-coefficient-for-tailoring">
              <form-control label="Коэффициент на пошив">
                <v-text-field
                  v-model="editedItem.coefficientForTailoring"
                  outlined
                  dense
                  hide-details="auto"
                />
              </form-control>
            </div>

            <div class="edit-order-for-tailoring-coefficient-for-raskroy">
              <form-control label="Коэффициент на раской">
                <v-text-field
                  v-model="editedItem.coefficientForRaskroy"
                  outlined
                  dense
                  hide-details="auto"
                />
              </form-control>
            </div>

            <div class="edit-order-for-tailoring-date-of-release">
              <form-control label="Дата выпуска">
                <v-text-field
                  v-model="editedItem.dateOfRelease"
                  type="date"
                />
              </form-control>
            </div>

            <v-checkbox
              v-model="editedItem.allowedToPrintOnFactory"
              label="Разрешено печатать на фабриках"
            />
          </div>
        </div>

        <div class="edit-order-for-tailoring-row">
          <v-subheader
            class="font-weight-medium text-subtitle-1"
            style="margin: 0 auto"
          >
            Вышивка
          </v-subheader>
        </div>

        <div class="edit-order-for-tailoring-row">
          <vue-excel-editor
            v-model="jsondata"
          >
            <vue-excel-column
              field="kod"
              label="Код"
              type="string"
              width="200px"
            />
            <vue-excel-column
              field="name"
              label="Наименование"
              type="string"
              width="1200px"
            />
            <vue-excel-column
              field="quantity"
              label="Количество"
              type="string"
              width="200px"
            />
            <vue-excel-column
              field="order"
              label="№ Заказа"
              type="string"
              width="200px"
            />
          </vue-excel-editor>
        </div>

        <div class="edit-order-for-tailoring-row">
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="close"
          >
            Закрыть
          </v-btn>
        </div>
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
    },

    edit: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      editedItem: {
        num_plan: '',
        num_zkz: '',
        kroy: 0,
        descr: '',
        raskroy: '',
        planingDateOfRaskroy: new Date().toISOString().substr(0, 10),
        contract: '',
        kroyOnPaper: false,
        dateOfTheOrderForTailoring: new Date().toISOString().substr(0, 10),
        note: '',
        coefficientForTailoring: 0,
        coefficientForRaskroy: 0,
        dateOfRelease: new Date().toISOString().substr(0, 10),
        allowedToPrintOnFactory: false
      },
      jsondata: [
        {
          kod: '',
          name: '',
          quantity: 25,
          order: ''
        },
        {
          kod: '',
          name: '',
          quantity: 20,
          order: ''
        },
        {
          kod: '',
          name: '',
          quantity: 19,
          order: ''
        }
      ],
      formOpened: this.value
    }
  },

  methods: {
    close() {
      this.formOpened = false
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss">
.edit-order-for-tailoring-main-div {
  padding: 10px;

  .row + .row {
    margin-top: 0 !important;
  }
}

.edit-order-for-tailoring-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  min-width: 100%;
}

.edit-order-for-tailoring-cut {
  width: 400px;
}

.edit-order-for-tailoring-contract {
  width: 400px;
}

.edit-order-for-tailoring-kroy {
  width: 10%;
}

.edit-order-for-tailoring-spacer {
  width: 2%
}

.edit-order-for-tailoring-descr {
  width: 88%;
}

.edit-order-for-tailoring-left-col {
  flex: 0 0 78%;
  max-width: 78%;
}

.edit-order-for-tailoring-right-col {
  flex: 0 0 20%;
  max-width: 20%;
}

.edit-order-for-tailoring-label-checkbox {
  color: rgba(0, 0, 0, 0.6);
  font-size: 13px;
  padding-top: 24px;
  font-weight: bold;
}

.edit-order-for-tailoring-date-of-order-for-tailoring {
  width: 330px;
}

.edit-order-for-tailoring-textarea-note {
  width: 100%;
}

.edit-order-for-tailoring-coefficient-for-tailoring {
  margin-bottom: 10px;
}

.edit-order-for-tailoring-coefficient-for-raskroy {
  margin-bottom: 10px;
}

.edit-order-for-tailoring-date-of-release {
  margin-bottom: 10px;
}
</style>
