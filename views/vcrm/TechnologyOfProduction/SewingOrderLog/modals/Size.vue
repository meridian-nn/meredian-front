<template>
  <v-dialog
    :value="value"
    max-width="550px"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        Просмотр заказа по размерам
      </v-card-title>

      <v-card-text>
        <vue-excel-editor
          v-model="jsondata"
        >
          <vue-excel-column
            field="size"
            label="Размер"
            type="string"
            width="150px"
          />
          <vue-excel-column
            field="growth"
            label="Рост"
            type="string"
            width="120px"
          />
          <vue-excel-column
            field="quantity"
            label="Количество"
            type="number"
            width="150px"
          />
        </vue-excel-editor>

        <form-control label="Общее количество">
          {{ totalQuantity }}
        </form-control>
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
          OK
        </v-btn>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ModalSize',

  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      jsondata: [
        {
          size: '',
          growth: '',
          quantity: 25
        },
        {
          size: '',
          growth: '',
          quantity: 20
        },
        {
          size: '',
          growth: '',
          quantity: 19
        }
      ]
    }
  },

  computed: {
    totalQuantity() {
      return this.jsondata.reduce((acc, item) => {
        return acc + item.quantity
      }, 0)
    }
  }
}
</script>
