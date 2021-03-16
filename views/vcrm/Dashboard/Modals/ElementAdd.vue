<template>
  <v-dialog
    :value="show"
    max-width="1000px"
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
        <span class="headline">{{ title }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.prodName"
                label="Название"
              />
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="editedItem.categoryId"
                label="id категории"
              />
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="editedItem.brand"
                label="Брэнд"
              />
            </v-col>

            <v-col cols="4">
              <v-autocomplete
                v-model="editedItem.packType"
                :items="packTypeList"
                label="Тип упаковки"
              />
            </v-col>

            <v-col cols="4">
              <v-autocomplete
                v-model="editedItem.packMaterial"
                :items="materialList"
                label="Материал упаковки"
              />
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="editedItem.quantity"
                type="number"
                label="Количество"
              />
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="editedItem.companyName"
                label="Название компании"
              />
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="editedItem.inn"
                label="Инн"
              />
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="editedItem.tnved"
                label="Tnved"
              />
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="editedItem.measure"
                label="Название количества"
              />
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="editedItem.gcpclBrick"
                label="Категория по классификации GS1 GPC"
              />
            </v-col>

            <v-col cols="4">
              <v-autocomplete
                v-model="editedItem.kind"
                :items="typesList"
                label="Тип"
              />
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="editedItem.sizeName"
                label="Название размера"
              />
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="editedItem.sizeValue"
                label="Размер значения"
              />
            </v-col>

            <v-col cols="4">
              <v-autocomplete
                v-model="editedItem.color"
                :items="colorList"
                label="Цвет"
              />
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="editedItem.model"
                label="Модель"
              />
            </v-col>

            <v-col cols="4">
              <v-select
                v-model="editedItem.gender"
                :items="genderList"
                label="Пол"
              />
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="editedItem.standartNumber"
                label="Технический стандарт"
              />
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="editedItem.rawMaterial"
                label="Материал"
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
  name: 'DialogElementAdd',

  props: {
    title: {
      type: String,
      default: ''
    },

    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      editedItem: {
        categoryId: '31326',
        prodName: '',
        brand: '',
        packType: '',
        packMaterial: '',
        quantity: '',
        types: '',
        sizeName: '',
        sizeValue: '',
        color: '',
        country: 'RU',
        kind: '',
        gcpclBrick: '',
        measure: '',
        inn: '5259003336 (Меридиан)',
        model: '',
        gender: '',
        standartNumber: '',
        rawMaterial: '',
        companyName: 'meridian',
        manufacturerCode: '4650067329994',
        tnved: '',
        trademark: 'Меридиан',
        apiExtension: 'lp',
        status: 'NOT_PROCESSED'
      }
    }
  }
}
</script>
