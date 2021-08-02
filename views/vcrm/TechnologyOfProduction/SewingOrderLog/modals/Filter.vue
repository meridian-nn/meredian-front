<template>
  <v-dialog
    max-width="600px"
    :value="value"
    class="filters-modal"
    @input="$emit('close')"
  >
    <v-card class="modal-card">
      <v-card-title>
        <span class="headline">Фильтры для таблицы "Документы на оплату"</span>
      </v-card-title>

      <v-card-text>
        <v-row class="date-filter">
          <v-col cols="6">
            <v-text-field
              v-model="form.dateFrom"
              :clearable="true"
              type="date"
              outlined
              label="Период с"
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              v-model="form.dateTo"
              :clearable="true"
              type="date"
              outlined
              label="Период заканчивая"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.numZaivk"
              label="Исполнитель"
              :items="departments"
              clearable
              outlined
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.otvIsp"
              label="Отдел исполнителя"
              :items="departments"
              :clearable="true"
              outlined
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.nameProizv"
              label="Производство"
              :items="executors"
              clearable
              outlined
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.planData"
              label="Фабрика"
              :items="payers"
              clearable
              outlined
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <v-checkbox
              label="Наше производство"
            />
          </v-col>
          <v-col cols="6">
            <v-checkbox
              label="Довальческое производство"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <v-checkbox
              label="Заказы на удаление"
            />
          </v-col>
          <v-col cols="6">
            <v-checkbox
              label="Раскрой"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn
          @click="saveFilters"
        >
          Применить фильтры
        </v-btn>

        <v-btn
          @click="$emit('close')"
        >
          Отмена
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ModalFilter',

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      form: {
        dateFrom: null,
        dateTo: null,
        numZaivk: '',
        otvIsp: '',
        nameProizv: '',
        planData: ''
      }
    }
  },

  methods: {
    async saveFilet() {
      const filterEntityForSave = this.createFilterEntityForSave('filter-sewing-order-log', this.$route.name, this.filterItem,
        this.getCurrentUser.id, this.getCurrentUser.id)

      await this.$api.uiSettings.save(filterEntityForSave)

      this.$emit('save')
    },

    async findFiltersValues() {
      const data = this.createCriteriasToSearchForFiltersValues(this.$route.name, 'filter-sewing-order-log', this.getCurrentUser.id)
      const response = await this.$api.uiSettings.findBySearchCriterias(data)

      if (response.length) {
        this.form = JSON.parse(response[0].settingValue)
      }

      if (!this.filterItem.dateFrom) {
        this.filterItem.dateFrom = this.getDateForCriteriasToSearchDocsFromPay().toISOString().substr(0, 10)
      }
    }
  }
}
</script>

<style lang="scss" scope>
.col {
  padding: 0 12px !important;
}
.v-card__title {
  margin-bottom: 30px;
}
.v-input--selection-controls {
  margin-top: 0 !important;
}

.row + .row {
  margin-top: 0;
}
</style>
