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
                v-model="editedItem.proizvId"
                :items="proizvList"
                item-value="id"
                item-text="namePodr"
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
                v-model="normalizeDataRaskroyPlan"
                type="date"
              />
            </form-control>
          </div>

          <div class="edit-order-for-additional-work-coefficient-for-tailoring">
            <form-control label="Коэффициент на пошив">
              <vue-numeric
                v-model.number="editedItem.coeffPoshiv"
                outlined
                separator="space"
                :precision="1"
                decimal-separator="."
                output-type="number"
                :disabled="!isCanChangeRequisitesOnEditOrderForAdditionalWork"
              />
            </form-control>
          </div>

          <div class="edit-order-for-tailoring-date-of-release">
            <form-control label="Дата выпуска">
              <v-text-field
                v-model="normalizeDataGotovFabr"
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
              v-model="editedItem.prim"
              solo
              label="Примечание"
            />
          </div>
        </div>

        <div class="edit-order-for-additional-work-row">
          <vue-excel-editor
            v-model="VZkzpsvDopwork"
          >
            <vue-excel-column
              field="posledCode"
              label="Код"
              type="number"
              width="200px"
            />
            <vue-excel-column
              field="modelName"
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
        proizvId: null,
        proizvRaskroy: null,
        prim: '',
        coeffPoshiv: 0,
        coeffRaskroy: 0,
        dataGotovFabr: null,
        dataZkzpsv: null,
        dataRaskroyPlan: null
      },
      displaytable: false,
      VZkzpsvDopwork: [],
      formOpened: this.value,
      proizvList: []
    }
  },

  computed: {
    normalizeDataGotovFabr: {
      get() {
        return this.formatDate(this.editedItem.dataGotovFabr)
      },
      set(value) {
        this.editedItem.dataGotovFabr = value
      }
    },

    normalizeDataZkzpsv: {
      get() {
        return this.formatDate(this.editedItem.dataZkzpsv)
      },
      set(value) {
        this.editedItem.dataZkzpsv = value
      }
    },

    normalizeDataRaskroyPlan: {
      get() {
        return this.formatDate(this.editedItem.dataRaskroyPlan)
      },
      set(value) {
        this.editedItem.dataRaskroyPlan = value
      }
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

    async init() {
      const [vZkzpsv, proizvList, vZkzpsvDopwork] = await Promise.all([
        this.$api.manufacturing.getManufacturingVZkzpsv([
          {
            'dataType': 'VARCHAR',
            'key': 'id',
            'operation': 'EQUALS',
            'type': 'AND',
            'values': [
              this.edit.zkzpsvId
            ]
          }
        ]),
        this.$api.productionDepartments.findBySearchCriteriaList([
          {
            'dataType': 'VARCHAR',
            'key': 'tipotdId',
            'operation': 'EQUALS',
            'type': 'OR',
            'values': [
              '2'
            ]
          },
          {
            'dataType': 'VARCHAR',
            'key': 'id',
            'operation': 'EQUALS',
            'type': 'OR',
            'values': [
              '296'
            ]
          }
        ]),
        this.$api.manufacturing.getManufacturingvZkzpsvDopwork([{
          'dataType': 'VARCHAR',
          'key': 'zkzpsvId',
          'operation': 'EQUALS',
          'type': 'AND',
          'values': [
            this.edit.zkzpsvId
          ]
        }])
      ])

      this.VZkzpsvDopwork = vZkzpsvDopwork
      this.editedItem = vZkzpsv[0]
      this.editedItem.name = this.edit.nameMc
      this.editedItem.count = this.edit.colvo
      this.proizvList = proizvList

      this.displaytable = true
    },
    formatDate(date) {
      if (!date) { return null }

      return date.split('.').reverse().join('-')
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
  padding-top: 24px;
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
