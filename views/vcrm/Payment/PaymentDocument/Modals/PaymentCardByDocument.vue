<template>
  <v-dialog
    v-model="dialog"
    max-width="1000px"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="10">
            <span class="headline">Карточка оплат по документу</span>
          </v-col>

          <v-col cols="2">
            <div
              align="center"
            >
              {{ date }}
            </div>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="3">
              <v-text-field
                v-model="typeOfDoc"
                :loading="loadingType.typeOfDoc"
                :readonly="true"
                label="Тип документа"
                outlined
                hide-details="auto"
              />
            </v-col>

            <v-col cols="3">
              <v-text-field
                v-model="document.nameDoc"
                :readonly="true"
                label="Номер документа"
                outlined
                hide-details="auto"
              />
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model="supplierOfDoc"
                :loading="loadingType.supplierOfDoc"
                :readonly="true"
                label="Контрагент"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="orgOfDoc"
                :loading="loadingType.orgOfDoc"
                :readonly="true"
                label="Плательщик"
                outlined
                hide-details="auto"
              />
            </v-col>

            <v-col cols="3" />

            <v-col cols="3">
              <v-text-field
                v-model="document.dataOplat"
                :readonly="true"
                label="Срок"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="3">
              <v-text-field
                v-model="document.sumDoc"
                :readonly="true"
                label="Сумма"
                outlined
                hide-details="auto"
              />
            </v-col>

            <v-col cols="6" />

            <v-col cols="3">
              <v-text-field
                v-model="executorOfDoc"
                :loading="loadingType.executorOfDoc"
                :readonly="true"
                label="Исполнитель"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-data-table
                :headers="toPayHeaders"
                :items="toPayData"
                :items-per-page="5"
                :show-select="false"
                :disable-items-per-page="true"
                hide-default-footer
                class="elevation-1 journal-of-payment-docs-docs-to-pay-table"
              >
                <template slot="body.append">
                  <tr>
                    <th>Итого</th>
                    <th>{{ totalToSumOplat }}</th>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="document.prim"
                :readonly="true"
                label="Примечание"
                outlined
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          color="blue darken-1"
          text
          @click="close"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'PaymentCardByDocument',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      date: new Date().toLocaleDateString(),

      totalToSumOplat: 0,

      dialog: false,

      loadingType: {},

      // Шапка таблицы дат оплаты документа
      toPayHeaders: [
        {
          text: 'Дата',
          value: 'dataOplat'
        },
        {
          text: 'Сумма оплаты',
          value: 'sumOplatMask'
        }

      ],

      // Список дат оплаты документа
      toPayData: [],

      // Выбранный документ
      document: {},

      // ID выбранного документа
      documentId: null,

      // Тип выбранного документа
      typeOfDoc: null,

      // Поставщик выбранного документа
      supplierOfDoc: null,

      // Плательщик выбранного документа
      orgOfDoc: null,

      // Исполнитель выбранного документа
      executorOfDoc: null
    }
  },
  methods: {
    reset() {
      this.loadingType = {}
      this.toPayData = []
      this.document = {}
      this.documentId = null
      this.typeOfDoc = null
      this.supplierOfDoc = null
      this.orgOfDoc = null
      this.executorOfDoc = null
    },

    openForm(id) {
      this.reset()
      this.documentId = id
      this.dialog = true
      this.findDocument()
    },

    async findDocument() {
      this.document = await this.$api.payment.docOplForPay.findById(this.documentId)
      await this.findTypeOfDocument()
      await this.findConsumerOfDocument()
      await this.fillOrganizationOfDocument()
      await this.findExecutorOfDocument()
      await this.findToPayData()
    },

    async findTypeOfDocument() {
      if (!this.document.viddocId) {
        return
      }

      this.loadingType.typeOfDoc = true
      const typeOfDoc = await this.$api.budgetElements.findDocumentTypeById(this.document.viddocId)
      this.typeOfDoc = typeOfDoc.nameViddoc
      this.loadingType.typeOfDoc = null
    },

    async findConsumerOfDocument() {
      if (!this.document.supplierId) {
        return
      }

      this.loadingType.consumerOfDoc = true
      const consumerOfDoc = await this.$api.organizations.findById(this.document.supplierId)
      this.supplierOfDoc = consumerOfDoc.shortName
      this.loadingType.consumerOfDoc = null
    },

    fillOrganizationOfDocument() {
      if (!this.document.myOrg) {
        return
      }

      this.loadingType.organization = true
      this.orgOfDoc = this.document.myOrg.shortName
      this.loadingType.organization = null
    },

    async findExecutorOfDocument() {
      if (!this.document.executorId) {
        return
      }

      this.loadingType.executor = true

      const searchCriteria = this.createCriteriaToSearchExecutorById(this.document.executorId)
      const response = await this.$api.executors.findBySearchCriteria(searchCriteria)

      if (!response || response.length === 0) {
        this.loadingType.executor = null
        return
      }

      const executor = response[0]
      this.executorOfDoc = executor.fio

      this.loadingType.executor = null
    },

    async findToPayData() {
      const searchCriterias = this.createCriteriasToSearchDocToPayByDocoplId(this.document.id)
      this.totalToSumOplat = 0
      this.toPayData = await this.$api.payment.docOplToPay.findDocumentsByCriterias(searchCriterias)

      this.toPayData.forEach((value) => {
        value.sumOplatMask = this.numberToSum(value.sumOplat)
        this.totalToSumOplat += value.sumOplat
      })
      this.totalToSumOplat = this.numberToSum(this.totalToSumOplat)
    },

    close() {
      console.log('close')
      this.reset()
      this.dialog = false
      this.$emit('close')
    }
  }
}
</script>
