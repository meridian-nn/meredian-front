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
        <span class="headline">Фильтры для журнала заказов на пошив</span>
      </v-card-title>

      <v-card-text>
        <v-container class="container-data">
          <v-row class="date-filter">
            <v-col cols="6">
              <v-text-field
                v-model="form.dateFrom"
                :clearable="true"
                type="date"
                outlined
                label="Период с"
                :hint="form.dateFrom > form.dateTo ? `'Период с' должен быть меньше 'Период заканчивая'` : ''"
                persistent-hint
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
                v-model="form.fioIsp"
                label="Исполнитель"
                clearable
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.depOfIsp"
                label="Отдел исполнителя"
                :clearable="true"
                disabled
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.nameProizv"
                label="Производство"
                clearable
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.planData"
                label="Фабрика"
                clearable
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="6"
              class="pt-0"
            >
              <v-checkbox
                class="mt-0"
                label="Наше производство"
                hide-details="auto"
              />
            </v-col>
            <v-col
              cols="6"
              class="pt-0"
            >
              <v-checkbox
                class="mt-0"
                label="Давальческое производство"
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="6"
              class="pt-0"
            >
              <v-checkbox
                class="mt-0"
                label="Заказы на удаление"
                hide-details="auto"
              />
            </v-col>
            <v-col
              cols="6"
              class="pt-0"
            >
              <v-checkbox
                class="mt-0"
                label="Раскрой"
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn
          :disabled="form.dateFrom > form.dateTo"
          @click="saveFilters"
        >
          Применить фильтры
        </v-btn>

        <v-btn @click="$emit('close')">
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
        from: null,
        to: null,
        numZaivk: '',
        otvIsp: '',
        nameProizv: '',
        planData: ''
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
