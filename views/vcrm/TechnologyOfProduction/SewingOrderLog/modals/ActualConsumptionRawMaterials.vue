<template>
  <v-dialog
    :value="value"
    max-width="950px"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        Ввод данных по фактическому расходу сырья
      </v-card-title>

      <v-card-text>
        <div class="mb-2">
          <v-btn
            fab
            small
            color="red"
          >
            <v-icon color="white">
              mdi-printer
            </v-icon>
          </v-btn>
        </div>

        <v-row>
          <v-col cols="5">
            <vue-excel-editor v-model="material">
              <vue-excel-column
                field="cod"
                label="Код"
                type="string"
                width="80px"
              />
              <vue-excel-column
                field="material"
                label="Сырье"
                type="string"
                width="150px"
              />
              <vue-excel-column
                field="ed"
                label="Eд"
                type="string"
                width="70px"
              />
            </vue-excel-editor>
          </v-col>

          <v-col cols="7">
            <vue-excel-editor v-model="data">
              <vue-excel-column
                field="size"
                label="Размер"
                type="string"
                width="100px"
              />
              <vue-excel-column
                field="growth"
                label="Рост"
                type="string"
                width="120px"
              />
              <vue-excel-column
                field="amount"
                label="Кол-во"
                type="string"
                width="80px"
              />
              <vue-excel-column
                field="rule"
                label="Норма"
                type="string"
                width="100px"
              />
              <vue-excel-column
                field="fact"
                label="Факт"
                type="string"
                width="100px"
              />
            </vue-excel-editor>
          </v-col>
        </v-row>

        <div class="total" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="$emit('close')"
        >
          Отмена
        </v-btn>

        <v-btn
          color="blue darken-1"
          text
          @click="$emit('close')"
        >
          Ввод
        </v-btn>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ActualConsumptionRawMaterials',

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      material: [
        {
          cod: '',
          material: '',
          ed: ''
        },
        {
          cod: '',
          material: '',
          ed: ''
        }
      ],

      data: [
        {
          size: '',
          growth: '',
          amount: '',
          rule: '',
          fact: ''
        },
        {
          size: '',
          growth: '',
          amount: '',
          rule: '',
          fact: ''
        }
      ]
    }
  },

  computed: {
    total() {
      return this.data
    }
  }
}
</script>

<style lang="scss">

</style>
