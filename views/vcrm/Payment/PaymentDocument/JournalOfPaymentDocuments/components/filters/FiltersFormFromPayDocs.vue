<template>
  <v-dialog
    v-model="dialog"
    :value="show"
    max-width="600px"
    padding="0px"
    class="filters-for-from-pay-docs-modal"
    @input="$emit('close')"
  >
    <v-card class="modal-card">
      <v-card-title>
        <span class="headline">Фильтры для таблицы "Документы на оплату"</span>
      </v-card-title>

      <v-card-text>
        <v-container class="container-data">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="filterItem.nameDoc"
                label="Номер документа"
                clearable="true"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="filterItem.departmentId"
                label="Подразделение"
                :loading="loadingType.departments"
                :items="departments"
                clearable="true"
                item-value="id"
                item-text="nameViddoc"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="filterItem.executorName"
                clearable="true"
                outlined
                label="Имя исполнителя"
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="filterItem.myorgId"
                label="Плательщик"
                :loading="loadingType.payers"
                :items="payers"
                clearable="true"
                item-value="id"
                item-text="clName"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="filterItem['buyer.id']"
                label="Покупатель"
                :loading="loadingType.buyers"
                :items="buyers"
                clearable="true"
                item-value="id"
                item-text="clName"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="filterItem.creatorName"
                clearable="true"
                outlined
                label="Имя создателя документа"
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="filterItem.date"
                clearable="true"
                type="date"
                outlined
                label="Дата документа начиная с"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="3">
              <v-row style="padding-top: 15px">
                <v-simple-checkbox
                  v-model="isSumToPayUsed"
                  style="padding-left: 12px; padding-top: 12px"
                />
                <div class="filters-for-from-pay-docs-modal-label">
                  К оплате >
                </div>
              </v-row>
            </v-col>
            <v-col cols="9">
              <div class="filters-for-from-pay-docs-modal-brise-input">
                <vue-numeric
                  v-model="sumToPayValue"
                  separator="space"
                  :precision="2"
                  decimal-separator="."
                  :output-type="number"
                />
                <span class="line" />
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="cancel"
        >
          Отмена
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="saveFilters"
        >
          Применить фильтры
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'FiltersFormFromPayDocs',
  data() {
    return {
      // id элемента, для которого будут сохранены настроики фильтров
      elementId: 'journal-of-payment-docs-from-pay-docs',

      // объект для отображения статусов процесса загрузки данных для полей
      loadingType: {},

      // объект, в котором храняться фильтры пользователя
      filterItem: {},

      // Значение фильтра по полю "К оплате"
      sumToPayValue: 0,

      // Признак использования фильтра по полю "К оплате"
      isSumToPayUsed: false,

      // массив плательщиков для выбора пользователем
      payers: [],

      // массив покупателей для выбора пользователем
      buyers: [],

      // массив подразделений для выбора пользователем
      departments: [],
      sumOplat: 0,
      executor: null,
      executorDepartments: null,

      // переменная, отвечающая за отображениие модального окна
      dialog: false
    }
  },

  watch: {
    dialog(val) {
      if (val) {
        this.init()
      }
    }
  },

  methods: {
    init() {
      this.findDepartments()
      this.findPayers()
      this.findBuyers()
      this.findFiltersValues()
    },

    openForm() {
      this.reset()
      this.dialog = true
    },
    // Поиск подразделений для выбора пользователем
    async findDepartments() {
      this.loadingType.departments = true
      this.departments = await this.$api.budgetElements.findDepartments()
      this.loadingType.departments = null
    },

    // Поиск плательщиков для выбора пользователем
    async findPayers() {
      this.loadingType.payers = true

      const data = {
        typeCode: 1
      }
      this.payers = await this.$api.organizations.findByOrgTypeCode(data)

      this.loadingType.payers = null
    },

    async findBuyers() {
      this.loadingType.buyers = true
      this.buyers = await this.$api.organizations.findInternalOrganizations()
      this.loadingType.buyers = null
    },

    async saveFilters() {
      this.filterItem.sumToPay = {
        sumToPayValue: this.sumToPayValue,
        isSumToPayUsed: this.isSumToPayUsed
      }

      const filterEntityForSave = this.createFilterEntityForSave(this.elementId, this.$route.name, this.filterItem, this.getCurrentUser().id)

      await this.$api.uiSettings.save(filterEntityForSave)

      this.dialog = false
      this.$emit('saveFilters')
    },

    // поиск ранее сохраненных настроек фильтров для текущего пользователя
    async findFiltersValues() {
      const data = this.createCriteriasToSearchForFiltersValues(this.$route.name, this.elementId, this.getCurrentUser().id)
      const response = await this.$api.uiSettings.findBySearchCriterias(data)

      if (response.length) {
        this.filterItem = JSON.parse(response[0].settingValue)

        if (typeof this.filterItem.sumToPay === 'object') {
          this.sumToPayValue = this.filterItem.sumToPay.sumToPayValue
          this.isSumToPayUsed = this.filterItem.sumToPay.isSumToPayUsed
        }
      }
    },

    // функция отработки события нажития на кнопку "отмена"
    cancel() {
      this.reset()
      this.dialog = false
      this.$emit('cancel')
    },

    // функция обнуления всех переменных формы
    reset() {
      this.loadingType = {}
      this.filterItem = {}
      this.payers = []
      this.departments = []
    }
  }
}
</script>

<style lang="scss">
.filters-for-from-pay-docs-modal-brise-input {
  position: relative;
  margin: 5px;
  overflow: hidden;
}

.filters-for-from-pay-docs-modal-brise-input input {
  width: 100%;
  padding: 10px;
  border: none;
  outline: none;
  border-bottom: 1px solid #999;
  box-sizing: border-box;
  font-size: 16px;
  position: relative;
  z-index: 5;
  background: none;
}

.filters-for-from-pay-docs-modal-brise-input label {
  position: absolute;
  left: 10px;
  top: 45%;
  transition: ease-out .15s;
  color: #999;
}

.filters-for-from-pay-docs-modal-brise-input input:focus ~ .line {
  left: 0;
  opacity: 1;
}

.filters-for-from-pay-docs-modal-brise-input input:valid ~ label, input:focus ~ label   {
  top: 0;
  transform: scale(0.94) translateX(-2px);
  color: #639db1;
}

.filters-for-from-pay-docs-modal-brise-input .line {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  background: #639db1;
  transition: .25s;
  opacity: 0;
  z-index: 6;
}

.filters-for-from-pay-docs-modal-label {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1rem;
  padding-top: 15px;
  padding-left: 5px;
}

</style>
