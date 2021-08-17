<template>
  <v-dialog
    :value="value"
    class="logos-order-modal"
    max-width="700px"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Изображение логотипов вышивок к заказу</span>
      </v-card-title>

      <v-card-text>
        <vue-excel-editor
          v-model="jsondata"
        >
          <vue-excel-column
            field="kod"
            label="Код"
            type="number"
            width="100px"
          />
          <vue-excel-column
            field="tovar"
            label="Наименование"
            type="string"
            width="300px"
          />
          <vue-excel-column
            field="img"
            label="Картинка"
            type="number"
            width="300px"
          />
        </vue-excel-editor>
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
          Сохранить
        </v-btn>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'LogosOrderModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },

    data: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      jsondata: [
        {
          kod: '',
          tovar: '',
          img: ''
        },
        {
          kod: '',
          tovar: '',
          img: ''
        },
        {
          kod: '',
          tovar: '',
          img: ''
        }
      ]
    }
  },

  methods: {
    close() {
      this.formOpened = false
      this.$emit('close')
    },
    updateSort(byDesc, event) {
      if (byDesc === 'by') {
        this.sortBy = event
      } else if (byDesc === 'desc') {
        this.sortDesc = event
      }
      this.page = 0
      this.baseDataTableRecords = []
      this.baseDataTableSelectedRecords = []
      this.keyLoading = Math.random()
    }
  }
}
</script>
