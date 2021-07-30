<template>
  <v-dialog
    :value="value"
    :fullscreen="true"
    class="edit-order-for-additional-work-main-div"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Редактирование заказа на дополнительную работу</span>
      </v-card-title>

      <v-card-text>
        <div class="edit-order-for-additional-work-row">
          <div class="edit-order-for-additional-work-production">
            <form-control label="Производство">
              <v-autocomplete
                v-model="editedItem.production"
              />
            </form-control>
          </div>

          <v-checkbox
            v-model="editedItem.allowedToPrintOnFactory"
            label="Разрешенно печать на фабриках"
          />
        </div>

        <div class="edit-order-for-additional-work-row">
          <div class="edit-order-for-additional-work-date-of-order-for-tailoring">
            <form-control label="Дата заказа на пошив">
              <v-text-field
                v-model="editedItem.dateOfTheOrderForTailoring"
                type="date"
              />
            </form-control>
          </div>

          <div class="edit-order-for-additional-work-coefficient-for-tailoring">
            <form-control label="Коэффициент на пошив">
              <v-text-field
                v-model="editedItem.coefficientForTailoring"
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
        </div>

        <div class="edit-order-for-additional-work-row">
          <div class="edit-order-for-additional-work-descr">
            <v-textarea
              v-model="editedItem.name"
              solo
              label="Наименование"
            />
          </div>

          <div class="edit-order-for-additional-work-spacer" />

          <div class="edit-order-for-additional-work-count">
            <form-control label="Кол-во">
              <v-text-field
                v-model="editedItem.count"
                outlined
                dense
                hide-details="auto"
              />
            </form-control>
          </div>
        </div>

        <div class="edit-order-for-additional-work-row">
          <div class="edit-order-for-additional-work-textarea-note">
            <v-textarea
              v-model="editedItem.note"
              solo
              label="Примечание"
            />
          </div>
        </div>

        <div class="edit-order-for-additional-work-row">
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

        <div class="edit-order-for-additional-work-row">
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
        num_zkz: '',
        production: '',
        allowedToPrintOnFactory: false,
        dateOfTheOrderForTailoring: new Date().toISOString().substr(0, 10),
        coefficientForTailoring: 0,
        dateOfRelease: new Date().toISOString().substr(0, 10),
        name: '',
        count: 0,
        note: ''
      },
      jsondata: [
        {
          kod: '',
          name: '',
          quantity: 25
        },
        {
          kod: '',
          name: '',
          quantity: 20
        },
        {
          kod: '',
          name: '',
          quantity: 19
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
.edit-order-for-additional-work-main-div {
  padding: 10px;
}

.edit-order-for-additional-work-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  min-width: 100%;
}

.edit-order-for-additional-work-production {
  width: 330px;
}

.edit-order-for-additional-work-date-of-order-for-tailoring {
  width: 330px;
}

.edit-order-for-additional-work-coefficient-for-tailoring {
  padding-top: 15px;
  margin-right: 10px;
}

.edit-order-for-additional-work-date-of-release {
  margin-bottom: 10px;
}

.edit-order-for-additional-work-descr {
  width: 88%;
}

.edit-order-for-additional-work-count {
  width: 10%;
}

.edit-order-for-additional-work-spacer {
  width: 2%
}

.edit-order-for-additional-work-textarea-note {
  width: 100%
}

</style>
