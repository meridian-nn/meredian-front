<template>
  <v-dialog
    :value="show"
    max-width="600px"
    @input="$emit('close')"
  >
    <template #activator="{ on, attrs }">
      <v-fab-transition>
        <v-btn
          color="blue"
          class="mr-2 mb-2"
          fab
          dark
          small
          fixed
          bottom
          right
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>
    </template>

    <v-card>
      <v-card-title>
        <span class="headline">Редактирование</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.num_plan"
                label="План"
              />
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="editedItem.num_zkz"
                label="Заказ"
              />
            </v-col>
          </v-row>
        </v-container>
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
          @click="$emit('save', editedItem)"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ModalEdit',

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      editedItem: {
        num_plan: '',
        num_zkz: ''
      }
    }
  }
}
</script>
