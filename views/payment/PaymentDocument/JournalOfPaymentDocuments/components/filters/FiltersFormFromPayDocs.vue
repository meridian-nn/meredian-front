<template>
  <v-dialog
    v-model="dialog"
    :value="show"
    max-width="1200px"
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
      // объект для отображения статусов процесса загрузки данных для полей
      loadingType: {},

      // объект, в котором храняться фильтры пользователя
      filterItem: {},

      // массив плательщиков для выбора пользователем
      payers: [],

      // массив подразделений для выбора пользователем
      departments: [],

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

    async saveFilters() {
      /* eslint-disable vue/max-len */
      const filterEntityForSave = this.createFilterEntityForSave(this.getIdOfFromPayDocsTableOfJournalOfPaymentDocs(), this.$route.name, this.filterItem)
      await this.$api.uiSettings.save(filterEntityForSave)
      this.dialog = false
      this.$emit('saveFilters')
    },

    // поиск ранее сохраненных настроек фильтров для текущего пользователя
    async findFiltersValues() {
      const currentUser = this.getCurrentUser()
      const data = this.createCriteriasToSearchForFiltersValues(this.$route.name, this.getIdOfFromPayDocsTableOfJournalOfPaymentDocs(), currentUser.id)
      const response = await this.$api.uiSettings.findBySearchCriterias(data)
      if (response.length) {
        this.filterItem = JSON.parse(response[0].settingValue)
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
