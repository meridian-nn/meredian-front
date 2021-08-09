<template>
  <v-dialog
    :value="value"
    max-width="550px"
    @input="$emit('close')"
  >
    <v-card class="old-order-card-modal">
      <v-card-title>
        Карточка заказа старая
      </v-card-title>

      <v-card-text>
        <v-container>
          <form-control label="Код изделия">
            <v-text-field
              outlined
              type="number"
            />
          </form-control>

          <form-control label="Наименование">
            <v-text-field outlined />
          </form-control>

          <form-control
            label="Код наименования"
          >
            <v-text-field
              outlined
              type="number"
            />
          </form-control>

          <v-row>
            <v-col cols="6">
              <form-control label="№ Заказа">
                <v-text-field outlined />
              </form-control>

              <form-control label="№ Заявки">
                <v-text-field outlined />
              </form-control>

              <form-control label="№ свод.завяки">
                <v-text-field outlined />
              </form-control>
            </v-col>

            <v-col cols="6">
              <v-radio-group>
                <v-radio
                  label="Вперед"
                  value="radio-1"
                />
                <v-radio
                  label="Назад"
                  value="radio-2"
                />
                <v-radio
                  label="Сначала"
                  value="radio-2"
                />
              </v-radio-group>
            </v-col>
          </v-row>

          <v-checkbox
            label="Различать регистры"
          />
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
          @click="$emit('close')"
        >
          Поиск
        </v-btn>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'OldOrderCardModal',

  props: {
    value: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss">
.old-order-card-modal {
  .v-text-field__details, .v-messages {
    display: none;
  }

  .v-card__text {
    padding-bottom: 0 !important;
  }

  .v-card__actions {
    padding-top: 0 !important;
  }

  .form-control {
    margin-bottom: 10px;

    &__label {
      flex-basis: 150px;
    }
  }
}
</style>
