<template>
  <v-dialog
    :value="value"
    max-width="522px"
  >
    <v-card>
      <v-card-title class="headline">
        Сформировать заказ на дополнительную работу по заказу на пошив №{{ numOfZkzpsv }}?
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
          @click="createOrderForAdditionalWork()"
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
  name: 'CreateOrderForAdditionalWork',
  props: {
    zkzpsv: {
      type: Object,
      default: Object
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    numOfZkzpsv() {
      return this.zkzpsv.numZkzpsv
    }
  },
  methods: {
    async createOrderForAdditionalWork() {
      const zkzpsvId = this.zkzpsv.zkzpsvId
      const params = this.createStructureForFormZkzpsvDopworkProcedure(zkzpsvId)
      const response = await this.$api.service.executeStashedFunctionWithReturnedDataSet(params)
      this.close()
      this.$emit('successfully', response)
    },

    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
