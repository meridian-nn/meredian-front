<template>
  <v-dialog
    :value="value"
    max-width="850px"
    class="modal-print"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Печать/Просмотр отчётов по заявкам на пошив
      </v-card-title>

      <v-card-text>
        <div class="modal-print-list">
          <div class="modal-print-list__item">
            Карточка примеров
          </div>
        </div>
      </v-card-text>

      <v-card-text>
        <div class="modal-print__actions">
          <v-btn small>
            Выполнить
          </v-btn>

          <v-btn small>
            Microsoft EXCEl
          </v-btn>

          <v-btn
            small
            @click="$emit('close')"
          >
            Отмена
          </v-btn>

          <v-checkbox
            v-model="govContract"
            label="Печать ТП с доп блоком"
          />
        </div>

        <div class="modal-print__actions">
          <v-checkbox
            v-model="govContract"
            label="Лист качества без учёта количества"
          />

          <form-control label="Месяц поступления готовой продукции">
            <v-autocomplete
              :items="['Test', 'test']"
            />
          </form-control>

          <form-control label="Год">
            <v-autocomplete
              :items="['Test', 'test']"
            />
          </form-control>
        </div>

        <div class="modal-print__actions">
          <form-control label="Для отчёта по браку: ">
            <form-control label="Период проверки">
              <v-text-field
                v-model="endDate"
                type="date"
              />
            </form-control>

            <form-control label="по">
              <v-text-field
                v-model="endDate"
                type="date"
              />
            </form-control>
          </form-control>

          <v-radio-group
            v-model="row"
          >
            <v-radio
              label="Фабрики"
              value="radio-1"
            />
            <v-radio
              label="Давальцы"
              value="radio-2"
            />
          </v-radio-group>
        </div>

        <div class="modal-print__actions">
          <form-control label="Оперативный план до">
            <v-text-field
              v-model="endDate"
              type="date"
            />
          </form-control>

          <form-control label="Для маркировки упавки :">
            <v-radio-group
              v-model="row"
              row
            >
              <v-radio
                label="Самоклейка - старый шаблон"
                value="radio-1"
              />
              <v-radio
                label="Самоклейка - новый шаблон"
                value="radio-2"
              />
              <v-radio
                label="Новая самоклейка"
                value="radio-2"
              />
            </v-radio-group>
          </form-control>
        </div>

        <div class="modal-print__actions">
          <form-control label="Сортировка:">
            <v-radio-group
              v-model="row"
            >
              <v-radio
                label="Самоклейка - старый шаблон"
                value="radio-1"
              />
              <v-radio
                label="Самоклейка - новый шаблон"
                value="radio-2"
              />

              <v-radio
                label="Новая самоклейка"
                value="radio-2"
              />
            </v-radio-group>
          </form-control>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ModalPrint',

  props: {
    value: {
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
<style lang="scss">
.modal-print {
  &-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    margin-top: 20px;
    height: 450px;
    border-radius: 4px;
    border: 1px solid #eaeaea;

    &__item {
      font-size: 14px;
      padding: 0 20px;

      &:hover {
        background-color: #eaeaea;
      }
    }
  }
  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .v-label {
      font-size: 14px;
    }
  }
}
</style>
