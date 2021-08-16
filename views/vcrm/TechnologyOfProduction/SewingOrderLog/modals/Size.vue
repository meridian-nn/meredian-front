<template>
  <v-dialog
    :value="value"
    max-width="550px"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        Просмотр заказа по размерам
      </v-card-title>

      <v-card-text>
        <v-subheader class="my-5 px-0">
          {{ header }}
        </v-subheader>
        <v-row>
          <v-col cols="1">
            <v-btn
              color="blue"
              class="mr-3"
              fab
              dark
              small
              @click="updateTable()"
            >
              <v-icon>
                mdi-plus
              </v-icon>
            </v-btn>
          </v-col>
          <v-spacer />
          <v-col cols="10">
            <vue-excel-editor
              v-model="dataForTable"
              no-footer
              no-data-text="Нет информации по размерам"
            >
              <vue-excel-column
                field="name_razm"
                label="Размер"
                type="string"
                width="130px"
                readonly
              />
              <vue-excel-column
                field="name_rost"
                label="Рост"
                type="string"
                width="100px"
                readonly
              />
              <vue-excel-column
                field="colvo"
                label="Количество"
                type="number"
                width="120px"
                readonly
              />
            </vue-excel-editor>

            <form-control
              label="Общее количество"
              class="mt-3 total-quantity"
            >
              <div class="total-quantity-num">
                <vue-numeric
                  v-model="totalQuantity"
                  read-only
                  separator="space"
                  output-type="number"
                  class="text-right"
                />
              </div>
            </form-control>
          </v-col>
        </v-row>
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
          OK
        </v-btn>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ModalSize',

  props: {
    dataForModal: {
      type: Object,
      default: Object
    },
    value: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      dataForTable: []
    }
  },

  computed: {
    totalQuantity: {
      get() {
        if (this.dataForTable.length) {
          return this.dataForTable.reduce((acc, item) => {
            return acc + item.colvo
          }, 0)
        }
        return 0
      },
      set() {
        return 0
      }
    },
    header() {
      if (this.dataForModal && this.dataForModal.nameMc) {
        return this.dataForModal.nameMc
      }
      return ''
    }
  },

  mounted() {
    this.initDataForModal()
  },

  methods: {
    async initDataForModal() {
      const params = this.createStructureForInitDataInViewOrderBySizeTable(this.dataForModal.zkzpsvId)
      const content = await this.$api.service.executeStashedFunctionWithReturnedDataSet(params).catch((error) => {
        alert(error)
      })
      if (content) {
        this.dataForTable = content
      }
    },
    async updateTable() {
      const params = this.createStructureUpdateTableInViewOrderBySizeTable(this.dataForModal.zkzpsvId)
      await this.$api.service.executeStashedFunction(params).catch((error) => {
        alert(error)
      })

      this.dataForTable = []
      await this.initDataForModal()
    }
  }
}
</script>

<style scoped>
  .total-quantity {
    display: flex;
    justify-content: space-between;
  }
  .total-quantity-num {
    padding-right: 30px !important;
  }
</style>
