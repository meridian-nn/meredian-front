<template>
  <v-dialog
    v-model="dialog"
    :value="show"
    max-width="1000px"
    padding="0px"
    class="supply-menu-patchnote-window"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="12">
            <span class="headline">Список изменений в "АРМ Снабжения"</span>
          </v-col>
        </v-row>
      </v-card-title>

      <div class="supply-menu-patchnote-window-text">
        <v-container>
          <v-row>
            <v-col cols="12">
              <span class="headline">02.06.2021</span>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <ul>
                <li>Добавлена форма "Журнал заявок поставщику"</li>
              </ul>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <span class="headline">03.06.2021</span>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <ul>
                <li>Добавлена форма "Просмотр складских запасов"</li>
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
  name: 'SupplyMenuPatchnoteWindow',

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
.supply-menu-patchnote-window-text {
    padding: 0 24px 20px;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.375rem;
    letter-spacing: 0.0071428571em;
}

</style>
