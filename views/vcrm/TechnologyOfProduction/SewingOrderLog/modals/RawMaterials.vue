<template>
  <v-dialog
    :value="value"
    max-width="850px"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        Заказ На Пошив №{{ data.numZkzpsv }}
      </v-card-title>

      <v-card-text>
        <div>
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

        <vue-excel-editor v-model="jsondata">
          <vue-excel-column
            field="type"
            label="Тип обеспечения"
            type="string"
            width="150px"
          />
          <vue-excel-column
            field="readiness"
            label="Готовность"
            type="date"
            width="100px"
          />
          <vue-excel-column
            field="user"
            label="Пользователь"
            type="date"
            width="120px"
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
          Ввод
        </v-btn>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'RawMaterials',

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
          type: 'Сырье',
          readiness: '',
          user: ''
        },
        {
          type: 'Сырье',
          readiness: '',
          user: ''
        },
        {
          type: 'Сырье',
          readiness: '',
          user: ''
        }
      ]
    }
  }
}
</script>
