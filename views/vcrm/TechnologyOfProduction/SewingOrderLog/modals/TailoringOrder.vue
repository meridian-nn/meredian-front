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
            field="name"
            label="Наименование"
            type="string"
            width="150px"
          />
          <vue-excel-column
            field="mark"
            label="Отметка о выполнении"
            type="checkTF"
            width="120px"
          />
          <vue-excel-column
            field="planData"
            label="План.дата"
            type="date"
            width="100px"
          />
          <vue-excel-column
            field="startData"
            label="Факт.дата начала"
            type="date"
            width="100px"
          />
          <vue-excel-column
            field="endData"
            label="Факт.дата окончания"
            type="number"
            width="100px"
          />
          <vue-excel-column
            field="executor"
            label="Отв исполнитель"
            type="number"
            width="150px"
          />
          <vue-excel-column
            field="factExecutor"
            label="Факт исполнитель"
            type="number"
            width="150px"
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
  name: 'TailoringOrder',

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
          name: 'Сырье',
          mark: false,
          planData: '',
          startData: '',
          endData: '',
          executor: '',
          factExecutor: ''
        },
        {
          name: 'Сырье',
          mark: false,
          planData: '',
          startData: '',
          endData: '',
          executor: '',
          factExecutor: ''
        },
        {
          name: 'Сырье',
          mark: false,
          planData: '',
          startData: '',
          endData: '',
          executor: '',
          factExecutor: ''
        }
      ]
    }
  }
}
</script>
