<template>
  <v-dialog max-width="500px">
    <template #activator="{ on, attrs }">
      <v-btn
        color="primary"
        dark
        class="mb-2"
        v-bind="attrs"
        v-on="on"
      >
        Новый елемент
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.name"
                label="Dessert name"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="editedItem.calories"
                label="Calories"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="editedItem.fat"
                label="Fat (g)"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="editedItem.carbs"
                label="Carbs (g)"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="editedItem.protein"
                label="Protein (g)"
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
          @click="close"
        >
          Отмена
        </v-btn>

        <v-btn
          color="blue darken-1"
          text
          @click="save"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DialogElementAdd'
}
</script>
