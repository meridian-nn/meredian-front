<template>
  <v-dialog
    v-model="dialog"
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
                :clearable="true"
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
                :clearable="true"
                item-value="id"
                item-text="namePodr"
                outlined
                hide-details="auto"
                multiple
                @change="departmentChange"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="filterItem.executorId"
                label="Исполнитель"
                :loading="loadingType.executors"
                :items="executors"
                :clearable="true"
                no-data-text="Список пуст"
                item-value="id"
                item-text="fio"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="filterItem['myOrg.id']"
                label="Плательщик"
                :loading="loadingType.payers"
                :items="payers"
                :clearable="true"
                item-value="id"
                item-text="clName"
                outlined
                hide-details="auto"
                multiple
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="filterItem.creatorName"
                :clearable="true"
                outlined
                label="Имя создателя документа"
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-row class="date-filter">
            <v-col cols="6">
              <v-text-field
                v-model="filterItem.dateFrom"
                :clearable="true"
                type="date"
                outlined
                :max="filterItem.dateTo"
                label="Дата документа начиная с"
                :hint="filterItem.dateFrom > filterItem.dateTo ? `'Дата документа начиная с' должна быть меньше 'Даты документа заканчивая'` : ''"
                persistent-hint
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="filterItem.dateTo"
                :clearable="true"
                type="date"
                :min="filterItem.dateFrom"
                outlined
                label="Дата документа заканчивая"
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
                  output-type="String"
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
          :disabled="filterItem.dateFrom > filterItem.dateTo"
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
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // id элемента, для которого будут сохранены настроики фильтров
      elementId: null,

      // объект для отображения статусов процесса загрузки данных для полей
      loadingType: {},

      // объект, в котором храняться фильтры пользователя
      filterItem: {
        nameDoc: '',
        departmentId: null,
        executorName: '',
        'myOrg.id': null,
        creatorName: '',
        dateFrom: null,
        dateTo: null
      },

      // Значение фильтра по полю "К оплате"
      sumToPayValue: 0,

      // Признак использования фильтра по полю "К оплате"
      isSumToPayUsed: false,

      // массив плательщиков для выбора пользователем
      payers: [],

      // массив подразделений для выбора пользователем
      departments: [],
      sumOplat: 0,
      executor: null,
      executorDepartments: null,

      // переменная, отвечающая за отображениие модального окна
      dialog: false,

      // список исполнителей для выбора пользователем
      executors: []
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
      this.elementId = this.getIdOfFromPayDocsTableOfJournalOfPaymentDocs()
      this.findDepartments()
      this.findPayers()
      this.findFiltersValues()
    },

    openForm() {
      this.reset()
      this.dialog = true
    },
    // Поиск подразделений для выбора пользователем
    async findDepartments() {
      this.loadingType.departments = true
      this.departments = await this.$api.departments.findAll()
      this.loadingType.departments = null
    },

    departmentChange() {
      this.findExecutors()
    },

    async findExecutors() {
      this.loadingType.executors = true
      const data = this.createCriteriasToSearchExecutorsByDepartmentId(this.filterItem.departmentId)
      this.executors = await this.$api.executors.findBySearchCriterias(data)
      this.loadingType.executors = null
    },

    // Поиск плательщиков для выбора пользователем
    async findPayers() {
      this.loadingType.payers = true
      this.payers = await this.$api.organizations.findInternalOrganizations()
      this.loadingType.payers = null
    },

    async saveFilters() {
      this.filterItem.sumToPay = {
        sumToPayValue: this.sumToPayValue,
        isSumToPayUsed: this.isSumToPayUsed
      }

      const filterEntityForSave = this.createFilterEntityForSave(this.elementId, this.$route.name, this.filterItem,
        this.getCurrentUser.id, this.getCurrentUser.id)

      await this.$api.uiSettings.save(filterEntityForSave)

      this.dialog = false
      this.$emit('saveFilters')
    },

    // поиск ранее сохраненных настроек фильтров для текущего пользователя
    async findFiltersValues() {
      const data = this.createCriteriasToSearchForFiltersValues(this.$route.name, this.elementId, this.getCurrentUser.id)
      const response = await this.$api.uiSettings.findBySearchCriterias(data)

      if (response.length) {
        this.filterItem = JSON.parse(response[0].settingValue)

        if (typeof this.filterItem.sumToPay === 'object') {
          this.sumToPayValue = this.filterItem.sumToPay.sumToPayValue
          this.isSumToPayUsed = this.filterItem.sumToPay.isSumToPayUsed
        }
      }

      if (!this.filterItem.dateFrom) {
        this.filterItem.dateFrom = this.getCurrentDateMinusOneYearForSearchCriterias().toISOString().substr(0, 10)
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

.filters-for-from-pay-docs-modal-brise-input input:focus ~ .line {
  left: 0;
  opacity: 1;
}

.filters-for-from-pay-docs-modal-brise-input input:valid ~ label, input:focus ~ label   {
  top: 0;
  transform: scale(0.94) translateX(-2px);
  color: #639db1;
}

.filters-for-from-pay-docs-modal-label {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1rem;
  padding-top: 15px;
  padding-left: 5px;
}
.date-filter .v-messages__message {
  color: red;
}
</style>
