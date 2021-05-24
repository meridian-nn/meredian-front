<template>
  <v-dialog
    v-model="dialog"
    :value="show"
    max-width="1000px"
    padding="0px"
    class="payment-menu-patchnote-window"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="12">
            <span class="headline">Список изменений в "Реестре оплат"</span>
          </v-col>
        </v-row>
      </v-card-title>

      <div class="payment-menu-patchnote-window-text">
        <v-container>
          <v-row>
            <v-col cols="12">
              <span class="headline">21.05.2021</span>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <ul>
                <li>Добавлено отображение денежных сумм с пробелами между разрядами на всех формах</li>
                <li>
                  Доработана форма "Журнал документов на оплату" - теперь можно посмотреть список документов к оплате и остатки на р/с на конкретную дату,
                  в списоке документов на оплату отображаются только документы на текущую дату
                </li>
                <li>
                  Примечание документов на оплату перенесено в конец таблицы -
                  теперь чтобы посмотреть примечание конкретного документа нужно на него нажать левой кнопкой мыши в таблице "Документы на оплату"
                </li>
                <li>
                  Добавлена возможность оплачивать документы на оплату по
                  нажатию правой кнопкой мыши по документу в таблице "Документы на оплату"
                </li>
              </ul>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <span class="headline">24.05.2021</span>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <ul>
                <span class="headline">Журнал документов на оплату</span>
                <li>Установлена фиксированная ширина для колонок таблицы "Документы на оплату" </li>
                <li>
                  Шапка таблицы "Документы на оплату"  зафиксирована
                </li>
                <li>
                  Итоги таблицы "Документы на оплату" выведены под таблицу
                </li>
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
  name: 'PaymentMenuPatchnoteWindow',

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
.payment-menu-patchnote-window-text {
    padding: 0 24px 20px;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.375rem;
    letter-spacing: 0.0071428571em;
}

</style>
