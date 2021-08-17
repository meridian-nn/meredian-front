<template>
  <v-dialog
    max-width="600px"
    :value="value"
    padding="0px"
    persistent
    class="filters-modal"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Поиск в журнале заказов на пошив</span>
      </v-card-title>

      <v-card-text>
        <v-container class="container-data">
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="form.mcId"
                label="Код изделия"
                clearable
                outlined
                hide-details="auto"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.codGra"
                label="Код зарплаты"
                clearable
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.nameMc"
                label="Наименование"
                clearable
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="form.numZaivk"
                label="Номер заявки"
                clearable
                outlined
                hide-details="auto"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.numZkzpsv"
                label="Номер заказа"
                clearable
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="form.numSvod"
                label="Номер свод. заказа"
                clearable
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-container>
          <v-btn
            :disabled="form.dateFrom > form.dateTo"
            @click="saveFilters"
          >
            Поиск
          </v-btn>

          <v-btn @click="$emit('close')">
            Отмена
          </v-btn>
        </v-container>
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
        numZaivk: '',
        mcId: 0,
        codGra: '',
        nameMc: '',
        numZkzpsv: 0,
        numSvod: 0
      }
    }
  },

  fetch() {
    this.findFiltersValues()
  },

  methods: {
    async findFiltersValues() {
      const data = this.createCriteriasToSearchForFiltersValues(this.$route.name,
        this.getIdOfFilterSewingOrderLog(), this.getCurrentUser.id)
      const response = await this.$api.uiSettings.findBySearchCriterias(data)

      if (response.length) {
        this.form = JSON.parse(response[0].settingValue)
      }

      if (!data.dateFrom) {
        this.form.dateFrom = this.getCurrentDateMinusOneYearForSearchCriterias().toISOString().substr(0, 10)
      }
    },

    async saveFilters() {
      try {
        const filterEntityForSave = this.createFilterEntityForSave(this.getIdOfFilterSewingOrderLog(), this.$route.name, this.form,
          this.getCurrentUser.id, this.getCurrentUser.id)

        await this.$api.uiSettings.save(filterEntityForSave)

        this.$emit('save')
        this.$emit('close')
      } catch (e) {
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="scss">
.date-filter .v-messages__message {
  color: red;
}
</style>
