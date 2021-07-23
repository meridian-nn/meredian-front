<template>
   <v-dialog
    v-model="dialog"
    :value="show"
    max-width="1200px"
    padding="0px"
    persistent
    class="edit-payment-document-modal"
    @input="$emit('close')"
  >
    <v-card class="modal-card">
      <v-card-title>
        <v-container class="container-data">
          <v-row>
            <v-col cols="6">
              <span class="headline">Ввод нового входящего платежного документ</span>
            </v-col>
            <v-spacer />
            <v-col cols="4">
              <v-text-field
                v-model="createdItem.extract"
                label="Выписка"
                outlined
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-title>

      <v-card-text>
        <v-container class="container-data">
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="createdItem.number"
                label="Номер"
                outlined
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="createdItem.dateExtract"
                type="date"
                label="Дата банковской выписки"
                outlined
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="createdItem.datePayment"
                type="date"
                label="Дата оплаты"
                outlined
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="createdItem.payer"
                label="Плательщик"
                :loading="loadingType.payers"
                :items="payers"
                item-value="id"
                item-text="clName"
                hide-details="auto"
                outlined
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="createdItem.recipient"
                label="Получатель"
                :loading="loadingType.recipients"
                :items="recipients"
                item-value="id"
                item-text="clName"
                hide-details="auto"
                outlined
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-autocomplete
                v-model="createdItem.executor"
                label="Исполнитель"
                :loading="loadingType.executors"
                :items="executors"
                item-value="id"
                item-text="clName"
                hide-details="auto"
                outlined
              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="createdItem.collaborator"
                label="Соисполнитель"
                :loading="loadingType.collaborators"
                :items="collaborators"
                item-value="id"
                item-text="clName"
                hide-details="auto"
                outlined
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model.number="createdItem.sumToPay"
                type="number"
                label="Сумма по документу"
                outlined
                hide-details="auto"
                class="summ-to-pay"
              />
            </v-col>

            <v-spacer />

            <v-col cols="3">
              <v-checkbox
                v-model="createdItem.internalDocument"
                label="Внутренний документ"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col col="12">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <span class="text-h6">Для бюджета</span>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="createdItem.comment"
                          label="Комментарий"
                          outlined
                        />
                      </v-col>
                      <v-subheader class="element-header">
                        Элемент:
                      </v-subheader>
                      <v-col cols="3">
                        <v-text-field
                          v-model="createdItem.elementDate"
                          type="date"
                          outlined
                        ></v-text-field>
                      </v-col>
                      <v-spacer />
                      <v-col cols="7">
                        <v-autocomplete
                          v-model="createdItem.element"
                          :loading="loadingType.elements"
                          :items="elements"
                          item-value="id"
                          item-text="clName"
                          hide-details="auto"
                          outlined
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-autocomplete
                          v-model="createdItem.cfo"
                          label="ЦФО"
                          :loading="loadingType.cfo"
                          :items="cfo"
                          item-value="id"
                          item-text="clName"
                          hide-details="auto"
                          outlined
                        />
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="cancel"
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
  name: 'createIncomingPaymentDocument',
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
      // объект для отображения загрузки данных для полей
      loadingType: {},
      // переменная, отвечающая за отображениие модального окна
      dialog: false,
      // объект, в котором хранится создаваемый документ
      createdItem: {},
      // массив плательщиков
      payers: [],
      // массив получателей
      recipients: [],
      // массив исполнителей
      executors: [],
      // массив соисполнителей
      collaborators: [],
      // массив элементов
      elements: [],
      // массив ЦФО
      cfo: []
    }
  },
  methods: {
    // функция открытия формы для создания нового документа
    newDocument() {
      this.dialog = true
    },
    // функция отработки события нажития на кнопку "отмена"
    cancel() {
      this.dialog = false
      this.$emit('cancel')
    },

    save() {
      this.dialog = false
      this.$emit('save')
    }
  }
}
</script>

<style lang="scss">
  .modal-card {
    max-width: 1200px;
  }
  .container-data {
    margin-left: 0;
    max-width: none;
  }
  .summ-to-pay input[type='number'] {
    -moz-appearance:textfield;
  }
  .summ-to-pay input::-webkit-outer-spin-button,
  .summ-to-pay input::-webkit-inner-spin-button {
      -webkit-appearance: none;
  }
  .element-header {
    font-weight: bold;
    font-size: 18px;
    padding-top: 32px;
  }
</style>
