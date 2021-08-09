<template>
  <v-dialog
    v-model="dialog"
    max-width="1200px"
    padding="0px"
    persistent
    class="filters-for-outgoing-payment-documents"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Фильтры для таблицы "{{ nameOfTable }}"</span>
      </v-card-title>
      <v-card-text>
        <v-container class="container-data">
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
          <div
            v-if="isIncomingDocuments"
          >
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="filterItem.platName"
                  label="Плательщик"
                  :clearable="true"
                  outlined
                  hide-details="auto"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="filterItem.poluchName"
                  label="Получатель"
                  :loading="loadingType.recipients"
                  :items="recipients"
                  :clearable="true"
                  item-value="clName8"
                  item-text="clName"
                  outlined
                  hide-details="auto"
                />
              </v-col>
            </v-row>
          </div>
          <div
            v-else
          >
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="filterItem.platName"
                  label="Плательщик"
                  :loading="loadingType.payers"
                  :items="payers"
                  :clearable="true"
                  item-value="clName8"
                  item-text="clName"
                  outlined
                  hide-details="auto"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="filterItem.poluchName"
                  label="Получатель"
                  :clearable="true"
                  outlined
                  hide-details="auto"
                />
              </v-col>
            </v-row>
          </div>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="filterItem.fio"
                label="Исполнитель"
                :clearable="true"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="filterItem.fioSoisp"
                label="Соисполнитель"
                :clearable="true"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="filterItem.otdId"
                label="Отдел исполнителя"
                :loading="loadingType.departments"
                :items="departments"
                :clearable="true"
                item-value="id"
                item-text="namePodr"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="filterItem.budElem"
                label="Элемент бюджета"
                :loading="loadingType.budgetElements"
                :items="budgetElements"
                :clearable="true"
                item-value="id"
                item-text="opis"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="filterItem.numVipis"
                label="Номер выписки"
                :clearable="true"
                outlined
                hide-details="auto"
              />
            </v-col>

            <v-spacer />

            <v-col cols="6">
              <v-row>
                <v-col
                  cols="6"
                  class="pb-0"
                >
                  <v-checkbox
                    v-model="filterItem.commercial"
                    label="Коммерческие"
                    disabled
                  />
                </v-col>
                <v-col
                  cols="6"
                  class="pb-0"
                >
                  <v-checkbox
                    v-model="filterItem.nonCommercial"
                    label="Некоммерческие"
                    disabled
                  />
                </v-col>
                <v-col
                  cols="6"
                  class="pt-0"
                >
                  <v-checkbox
                    v-model="filterItem.internal"
                    label="Внутренние"
                    class="mt-0"
                    disabled
                  />
                </v-col>
              </v-row>
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
  name: 'FiltersFormFromOutgoingAndIncomingDocument',
  data() {
    return {
      loadingType: {},
      filterItem: {
        dateFrom: null,
        dateTo: null,
        poluchName: null,
        platName: null,
        fio: null,
        fioSoisp: null,
        // !!! otdId предполагаемо должно фильтроваться полем Отдел исполнителя
        otdId: null,
        // !!! budElem что фильтрует, budNelem?
        budElem: null,
        numFind: null,
        // !!! что фильтруется по чек-боксам?
        commercial: false,
        nonCommercial: false,
        internal: false
      },
      // переменная, отвечающая за отображениие модального окна
      dialog: false,
      departments: [],
      payers: [],
      recipients: [],
      // !!! не понятно что должно быть в budgetElements
      budgetElements: [],
      // id элемента, для которого будут сохранены настроики фильтров
      elementId: null,

      isIncomingDocuments: false,

      nameOfTable: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // функция инициализации формы
    init() {
      this.findDepartments()
      // this.findPayers()
      this.findBudgetElements()
    },
    // Поиск подразделений для выбора пользователем
    async findDepartments() {
      this.loadingType.departments = true
      this.departments = await this.$api.departments.findAll()
      this.loadingType.departments = null
    },
    // Поиск плательщиков для выбора пользователем
    async findPayers() {
      this.loadingType.payers = true
      this.payers = await this.$api.organizations.findInternalOrganizations()
      this.loadingType.payers = null
    },
    // Поиск получателей для выбора пользователем
    async findRecipients() {
      this.loadingType.recipients = true
      this.recipients = await this.$api.organizations.findInternalOrganizations()
      this.loadingType.recipients = null
    },
    // Поиск элементов бюджета для выбора пользователем
    async findBudgetElements() {
      this.loadingType.budgetElements = true
      this.budgetElements = await this.$api.budgetElements.findDepartments()
      this.loadingType.budgetElements = null
    },
    // функция отработки события нажития на кнопку "отмена"
    cancel() {
      this.dialog = false
      this.$emit('cancel')
    },
    // функция сохранения значений фильтров
    async saveFilters() {
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
      }
    },
    // функция открытия формы
    async openForm(nameOfTable, elementId) {
      if (!nameOfTable ||
          !elementId) {
        return
      }

      this.elementId = elementId
      this.nameOfTable = nameOfTable

      if (this.elementId === this.getIdOfIncomingDocumentsTable()) {
        this.isIncomingDocuments = true
        await this.findRecipients()
      } else {
        this.isIncomingDocuments = false
        await this.findPayers()
      }

      await this.findFiltersValues()
      this.dialog = true
    }
  }
}
</script>

<style lang="scss">
  .date-filter .v-messages__message {
    color: red;
  }
</style>
