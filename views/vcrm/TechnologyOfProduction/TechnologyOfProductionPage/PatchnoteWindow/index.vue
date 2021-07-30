<template>
  <v-dialog
    v-model="dialog"
    :value="show"
    max-width="1000px"
    padding="0px"
    class="technology-of-production-menu-patchnote-window"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="12">
            <span class="headline">Список изменений в "АРМ Технология производства"</span>
          </v-col>
        </v-row>
      </v-card-title>

      <div class="technology-of-production-menu-patchnote-window-text">
        <v-container>
          <v-row>
            <v-col cols="12">
              <span class="headline">06.07.2021</span>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <ul>
                <li> Добавлена форма "Запись работы по карточкам" </li>
              </ul>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <span class="headline">12.07.2021</span>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <ul>
                <li> Добавлена форма "Запись работы по заказу" </li>
              </ul>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <span class="headline">19.07.2021</span>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <ul>
                <li> Доработка добавленных форм </li>
              </ul>
              <ul>
                <li> Уткин Д. - Добавлена форма "Журнал заказов на пошив" </li>
              </ul>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <span class="headline">25.07.2021</span>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <ul>
                <li> Добавлена форма печати отчетов на форму "Журнал заказов на пошив" </li>
              </ul>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <span class="headline">30.07.2021</span>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <ul>
                <li> Уткин Д. - Добавлены формы "Редактирование заказа на дополнительную работу" и  "Редактирование заказа на пошив"</li>
              </ul>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'TechnologyOfProductionMenuPatchnoteWindow',

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // Переменная для реализации открытия модального окна
      dialog: false
    }
  },

  methods: {
    openWindow() {
      this.dialog = true
    }
  }
}
</script>

<style lang="scss">
.technology-of-production-menu-patchnote-window-text {
    padding: 0 24px 20px;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.375rem;
    letter-spacing: 0.0071428571em;
}

</style>
