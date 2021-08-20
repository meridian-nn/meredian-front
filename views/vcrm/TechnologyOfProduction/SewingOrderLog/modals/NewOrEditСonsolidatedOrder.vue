<template>
  <v-dialog
    :value="value"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="headline">
        {{ modalTitle }}
      </v-card-title>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="close()"
        >
          Отмена
        </v-btn>

        <v-btn
          color="blue darken-1"
          text
          @click="consolidatedOrder()"
        >
          Да
        </v-btn>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ModalNewOrEditСonsolidatedOrder',
  props: {
    typeOperation: {
      type: String,
      default: null
    },
    value: {
      type: Boolean,
      default: false
    },
    dataForModalFromTable: {
      type: Array,
      default: Array
    },
    dataForModalFromContextMenu: {
      type: Object,
      default: Object
    }
  },
  computed: {
    modalTitle() {
      let header = ''
      if (this.typeOperation === 'new') { header = 'Сформировать сводный заказ?' }
      if (this.typeOperation === 'edit') { header = 'Изменить сводный заказ № ' + this.dataForModalFromContextMenu.numZkzpsv + ' ?' }
      return header
    }
  },
  methods: {
    async consolidatedOrder() {
      if (this.typeOperation === 'new') { await this.newСonsolidatedOrder() }
      if (this.typeOperation === 'edit') { await this.editСonsolidatedOrder() }
    },

    async newСonsolidatedOrder() {
      const paramsForClearTempTable = this.createStructureForClearTempTableForConsolidatedOrder()
      await this.$api.service.executeStashedFunction(paramsForClearTempTable)

      for (const key in this.dataForModalFromTable) {
        if (this.dataForModalFromTable[key].dopWork !== 0) {
          continue
        }
        const paramsForCreateTempTable = this.createStructureForCreateConsolidatedOrderTempTable(this.dataForModalFromTable[key].zkzpsvId)
        await this.$api.service.executeStashedFunction(paramsForCreateTempTable)
      }

      let errorResponse = null
      const paramsForLoadTempTable = this.createStructureForLoadTableForNewConsolidatedOrder()
      const result = await this.$api.service.executeStashedFunctionWithReturnedDataSet(paramsForLoadTempTable).catch((er) => {
        errorResponse = er
      })

      if (errorResponse || result.length === 0) {
        this.$toast.error('Новый сводный заказ НЕ сформирован')
        this.close()
        return
      }

      result.forEach((itm) => {
        this.$toast.success('Сформирован заказ №' + itm.num_zkzpsv)
      })
      this.close()
      this.$emit('successfully')
    },

    async editСonsolidatedOrder() {
      const paramsForClearTempTable = this.createStructureForClearTempTableForEditConsolidatedOrder()
      await this.$api.service.executeStashedFunction(paramsForClearTempTable)

      for (const key in this.dataForModalFromTable) {
        if (this.dataForModalFromTable[key].dopWork !== 0 || this.dataForModalFromTable[key].parent !== 0) {
          continue
        }
        const paramsForCreateTempTable = this.createStructureForCreateTempTableForEditConsolidatedOrder(this.dataForModalFromTable[key].zkzpsvId)
        await this.$api.service.executeStashedFunction(paramsForCreateTempTable)
      }

      let errorResponse = null
      const paramsForLoadTempTable = this.createStructureForLoadTableForEditConsolidatedOrder(this.dataForModalFromContextMenu.zkzpsvId)
      const result = await this.$api.service.executeStashedFunctionWithReturnedDataSet(paramsForLoadTempTable).catch((er) => {
        errorResponse = er
      })

      if (errorResponse || result.length === 0) {
        this.$toast.error('Cводный заказ НЕ скорректирован')
        this.close()
        return
      }

      result.forEach((itm) => {
        this.$toast.success('Изменен заказ № ' + itm.num_zkzpsv + ' от ' + itm.data_zkzpsv)
      })
      this.close()
      this.$emit('successfully')
    },

    close() {
      this.numOrder = ''
      this.$emit('close')
    }
  }
}
</script>
