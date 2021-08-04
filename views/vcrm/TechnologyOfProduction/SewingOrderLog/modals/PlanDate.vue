<template>
  <v-dialog
    :value="value"
    max-width="500px"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        Исполнение плана пошива
      </v-card-title>

      <v-card-text>
        <form-control label="Фактическая дата пошива">
          <v-text-field
            type="date"
          />
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
          Ввод
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
  }
}
</script>
