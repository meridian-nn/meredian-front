<template>
  <v-dialog
    :value="value"
    max-width="500px"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        Исполнение плана пошива
      </v-card-title>
      <template v-if="!confirmPrintModal">
        <v-card-text>
          <form-control label="Фактическая дата пошива">
            <v-text-field
              v-model="inputDate"
              type="date"
            />
          </form-control>
        </v-card-text>

        <v-card-actions>
          <loading-dialog ref="loadingDialog" />

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
            :disabled="!inputDate"
            @click="saveDate"
          >
            Ввод
          </v-btn>

          <v-spacer />
        </v-card-actions>
      </template>
      <template v-if="confirmPrintModal">
        <v-card-text>
          {{ printTitle }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="downloadDocuments(false)"
          >
            Отмена
          </v-btn>

          <v-btn
            color="blue darken-1"
            text
            @click="downloadDocuments(true)"
          >
            ПЕЧАТЬ
          </v-btn>

          <v-spacer />
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import LoadingDialog from '~/components/loading_dialog/LoadingDialog'

export default {
  name: 'ModalSize',

  components: {
    LoadingDialog
  },

  props: {
    dataForModalFromContextMenu: {
      type: Object,
      default: Object
    },
    dataForModalFromTable: {
      type: Array,
      default: Array
    },
    value: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      inputDate: null,
      confirmPrintModal: false,
      printTitle: ''
    }
  },

  methods: {
    async saveDate() {
      this.$refs.loadingDialog.showLoadingDialog('Сохранение, подождите...')

      if (this.dataForModalFromTable.length) {
        for (const itm in this.dataForModalFromTable) {
          const params = this.createStructureForProcedureExecutionBeforeSaveDateTailoring(this.dataForModalFromTable[itm].zkzpsvId)
          await this.$api.service.executeStashedFunction(params).catch((error) => {
            alert(error)
          })
        }
      } else {
        const params = this.createStructureForProcedureExecutionBeforeSaveDateTailoring(this.dataForModalFromContextMenu.zkzpsvId)
        await this.$api.service.executeStashedFunction(params).catch((error) => {
          alert(error)
        })
      }

      const paramsForSave = this.createStructureForSaveDateTailoring({ date: this.inputDate, rejim: this.dataForModalFromContextMenu.rejim })
      await this.$api.service.executeStashedFunction(paramsForSave).catch((error) => {
        alert(error)
      })

      this.$refs.loadingDialog.closeLoadingDialog()

      if (this.dataForModalFromContextMenu.rejim === 1) {
        this.printTitle = 'Напечатать накладную на отпуск готовой продукции?'
      }
      if (this.dataForModalFromContextMenu.rejim === 2) {
        this.printTitle = 'Напечатать накладную на отпуск п/фабрикатов?'
      }

      this.confirmPrintModal = true
    },

    async downloadDocuments(confirm) {
      if (!confirm) {
        this.confirmPrintModal = false
      }

      if (this.dataForModalFromContextMenu.rejim === 1 && confirm) {
        const paramsForInitDataOnPrint = this.createStructureForInitDataOnPrint(1)
        await this.$api.service.executeStashedFunctionWithReturnedDataSet(paramsForInitDataOnPrint).catch((error) => {
          alert(error)
        })

        alert('ФУНКЦИОНАЛ СКАЧИВАНИЯ ОТЧЕТА В РАЗРАБОТКЕ')
      }

      if (this.dataForModalFromContextMenu.rejim === 2 && confirm) {
        const paramsForInitDataOnPrint = this.createStructureForInitDataOnPrint(4)
        await this.$api.service.executeStashedFunctionWithReturnedDataSet(paramsForInitDataOnPrint).catch((error) => {
          alert(error)
        })

        alert('ФУНКЦИОНАЛ СКАЧИВАНИЯ ОТЧЕТА В РАЗРАБОТКЕ')
      }

      this.clearTempTable()

      this.close()
    },

    async clearTempTable() {
      const paramsForClear = this.createStructureForClearTempTable()
      await this.$api.service.executeStashedFunction(paramsForClear).catch((error) => {
        alert(error)
      })
    },

    close() {
      this.inputDate = null
      this.$emit('close')
    }
  }
}
</script>
