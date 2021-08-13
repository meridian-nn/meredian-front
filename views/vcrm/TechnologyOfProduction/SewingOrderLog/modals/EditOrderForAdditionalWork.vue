<template>
  <v-dialog
    :value="value"
    fullscreen
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
              field="num_zkzvsv"
              label="Код"
              type="number"
              width="200px"
            />
            <vue-excel-column
              field="tovar"
              label="Наименование"
              type="string"
              width="1200px"
            />
            <vue-excel-column
              field="colvo"
              label="Количество"
              type="number"
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
          mc_id: 22,
          tovar: '',
          colvo: 25,
          num_zkzvsv: 22
        },
        {
          mc_id: 22,
          tovar: '',
          colvo: 25,
          num_zkzvsv: 22
        }
      ],
      formOpened: this.value,
      productionList: []
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    close() {
      this.formOpened = false
      this.$emit('close')
    },

    init() {
      this.jsondata = this.$api.service.executeStashedFunctionWithReturnedDataSet({
        'params': { 'zkzpsv_id': this.edit.zkzpsvId },
        'procName': 'dbo.zn_sel_zkzpsv'
      })

      this.productionList = this.$api.productionDepartments.findBySearchCriteriaList(this.creatCriteriaEqualList('tipotdId', [2]))
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
