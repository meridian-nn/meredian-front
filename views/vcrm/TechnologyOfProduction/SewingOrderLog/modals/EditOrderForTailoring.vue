// номер договора не Договор сохраняется
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
                v-model="editedItem.proizvRaskroy"
                :items="raskroylist"
                item-value="id"
                item-text="namePodr"
              />
            </form-control>
          </div>

          <form-control label="Плановая дата раскроя">
            <v-text-field
              v-model="normalizeDataRaskroyPlan"
              type="date"
            />
          </form-control>
        </div>

        <div class="edit-order-for-tailoring-row">
          <div class="edit-order-for-tailoring-kroy">
            <form-control label="Крой">
              <v-text-field
                v-model="editedItem.mc_kroi"
                outlined
                dense
                hide-details="auto"
              />
            </form-control>
          </div>

          <div class="edit-order-for-tailoring-spacer" />

          <div class="edit-order-for-tailoring-descr">
            <v-textarea
              v-model="editedItem.name_kroi"
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
                  :items="contractList"
                  item-value="dog_id"
                  item-text="name_kontr"
                />
              </form-control>
            </div>

            <div class="edit-order-for-tailoring-row">
              <div class="edit-order-for-tailoring-date-of-order-for-tailoring">
                <form-control label="Дата заказа на пошив">
                  <v-text-field
                    v-model="normalizeDataZkzpsv"
                    type="date"
                  />
                </form-control>
              </div>

              <v-simple-checkbox
                v-model="kroyOnPaper"
              />

              <div
                class="edit-order-for-tailoring-label-checkbox"
              >
                Крой на бумаге
              </div>
            </div>

            <div class="edit-order-for-tailoring-textarea-note">
              <v-textarea
                v-model="editedItem.prim"
                solo
                label="Примечание"
              />
            </div>
          </div>

          <div class="edit-order-for-tailoring-spacer" />

          <div class="edit-order-for-tailoring-right-col">
            <div class="edit-order-for-tailoring-coefficient-for-tailoring">
              <form-control label="Коэффициент на пошив">
                <vue-numeric
                  v-model.number="editedItem.coeffPoshiv"
                  outlined
                  separator="space"
                  :precision="1"
                  decimal-separator="."
                  output-type="number"
                  :disabled="!isCanChangeRequisitesOnEditOrderForTailoring"
                />
              </form-control>
            </div>

            <div class="edit-order-for-tailoring-coefficient-for-raskroy">
              <form-control label="Коэффициент на раской">
                <div>
                  <vue-numeric
                    v-model.number="editedItem.coeffRaskroy"
                    outlined
                    separator="space"
                    :precision="1"
                    decimal-separator="."
                    output-type="number"
                    :disabled="!isCanChangeRequisitesOnEditOrderForTailoring"
                  />
                </div>
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

            <v-checkbox
              v-model="allowedToPrintOnFactory"
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
            v-if="displaytable"
            ref="table"
            v-model="jsondata"
          >
            <vue-excel-column
              field="mc_id"
              label="Код"
              type="number"
              width="200px"
            />
            <vue-excel-column
              field="tovar"
              label="Наименование"
              type="string"
              width="1250px"
            />
            <vue-excel-column
              field="colvo"
              label="Количество"
              type="number"
              width="100px"
            />
            <vue-excel-column
              field="num_zkzvsv"
              label="№ Заказа"
              type="number"
              width="100px"
            />
          </vue-excel-editor>
        </div>

        <div class="edit-order-for-tailoring-row mt-5">
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="close"
          >
            Закрыть
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="save"
          >
            Сохранить
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ModalEditTailoring',

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
        proizvRaskroy: null,
        descr: '',
        prim: '',
        coeffPoshiv: 0,
        coeffRaskroy: 0,
        contract: 0,
        dataGotovFabr: null,
        dataZkzpsv: null,
        dataRaskroyPlan: null
      },
      displaytable: false,
      jsondata: [],
      formOpened: this.value,
      contractList: [],
      raskroyList: [],
      vPodrPr: []
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
    },

    kroyOnPaper: {
      get() {
        return !!this.editedItem.raskroyPaper
      },

      set(value) {
        this.editedItem.raskroyPaper = value ? 1 : 0
      }
    },

    allowedToPrintOnFactory: {
      get() {
        return !!this.editedItem.prGotov
      },

      set(value) {
        this.editedItem.prGotov = value ? 1 : 0
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
      const [jsondata, provNewPfPsv, vZkzpsv, raskroy, contractList] = await Promise.all([
        this.$api.service.executeStashedFunctionWithReturnedDataSet({
          'params': { 'zkzpsv_id': this.edit.zkzpsvId },
          'procName': 'dbo.zn_sel_zkzpsv'
        }),
        this.$api.service.executeStashedFunctionWithReturnedDataSet({
          'params': {
            'priznak': '2',
            'id': this.edit.zkzpsvId,
            'descr': 'Larisa'
          },
          'procName': 'dbo.prov_new_pf_psv'
        }),
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
        this.$api.productionDepartments.findBySearchCriteriaList(this.creatCriteriaEqualList('id', [this.edit.proizvRaskroy])),
        this.$api.service.executeStashedFunctionWithReturnedDataSet({
          'params': { 'data1': '2020-06-01', 'data2': '2020-06-30' },
          'procName': 'dbo.dog_sel_spis'
        })
      ])

      this.jsondata = jsondata
      this.editedItem = vZkzpsv[0]
      this.raskroylist = raskroy
      this.contractList = contractList
      this.editedItem.mc_kroi = provNewPfPsv[0].mc_kroi
      this.editedItem.name_kroi = provNewPfPsv[0].name_kroi
      this.displaytable = true
    },

    formatDate(date) {
      if (!date) { return null }

      return date.split('.').reverse().join('-')
    },

    async save() {
      if (this.editedItem.prim.length > 700) {
        this.$toast.warning('Длина примечания превышает допустимый размер и будет обрезана!')
      }
      let prR = null
      if (!this.editedItem.proizvRaskroy) {
        if (this.edit.spplnId === 0) {
          prR = this.edit.proizvSvod
        } else {
          prR = this.edit.proizvId
        }
      } else {
        prR = this.editedItem.proizvRaskroy
      }

      if (!this.editedItem.dataGotovFabr) {
        this.editedItem.dataGotovFabr = '01.01.1900'
      }
      if (!this.editedItem.dataRaskroyPlan) {
        this.editedItem.dataRaskroyPlan = '01.01.1900'
      }
      let params = {}
      if (!this.editedItem.contract) {
        params = this.createStructureForUpdateСontractOfOrderForTailoringInitDataProcedure({
          pr: 1,
          zkzpsv_id: this.edit.zkzpsvId,
          d_id: 0
        })
      } else {
        params = this.createStructureForUpdateСontractOfOrderForTailoringInitDataProcedure({
          pr: 2,
          zkzpsv_id: this.edit.zkzpsvId,
          d_id: this.editedItem.contract
        })
      }
      await this.$api.service.executeStashedFunction(params)

      const convertDateOfOrderForTailoring = this.convertDateToMounthDateYear(this.formatDate(this.editedItem.dataZkzpsv))
      const convertReleaseDate = this.convertDateToMounthDateYear(this.formatDate(this.editedItem.dataGotovFabr))
      const convertCuttingDate = this.convertDateToMounthDateYear(this.formatDate(this.editedItem.dataRaskroyPlan))

      const paramsForUpdt = this.createStructureForUpdateOrderForTailoringInitDataProcedure({
        ...this.editedItem,
        convertDateOfOrderForTailoring,
        convertReleaseDate,
        prR,
        convertCuttingDate
      })
      await this.$api.service.executeStashedFunction(paramsForUpdt)

      const paramsForChecking = this.createStructureForCheckingForAddingCutInitDataProcedure(this.editedItem.id)
      const responsCheckingForAddingCut = await this.$api.service.executeStashedFunctionWithReturnedDataSet(paramsForChecking)

      if (!responsCheckingForAddingCut[0].empty_record) {
        this.$toast.warning('Сформирован новый код п/ф кроя: ' + responsCheckingForAddingCut[0].mc_id + ' ' + responsCheckingForAddingCut[0].name_mc)
      }

      this.$emit('save')
      this.close()
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
