<template>
  <v-dialog
    v-model="dialog"
    :value="show"
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
                readonly="true"
                label="Тип документа"
                outlined
                hide-details="auto"
              />
            </v-col>

            <v-col cols="3">
              <v-text-field
                v-model="document.nameDoc"
                readonly="true"
                label="Номер документа"
                outlined
                hide-details="auto"
              />
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model="consumerOfDoc"
                :loading="loadingType.consumerOfDoc"
                readonly="true"
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
                readonly="true"
                label="Плательщик"
                outlined
                hide-details="auto"
              />
            </v-col>

            <v-col cols="3" />

            <v-col cols="3">
              <v-text-field
                v-model="document.dataOplat"
                readonly="true"
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
                readonly="true"
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
                readonly="true"
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
                readonly="true"
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
          value: 'sumOplat'
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

      // Контрагент выбранного документа
      consumerOfDoc: null,

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
      this.consumerOfDoc = null
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
      this.findTypeOfDocument(this.document.viddocId)
      this.findConsumerOfDocument(this.document.consumerId)
      this.findOrganizationOfDocument(this.document.myorgId)
      this.findExecutorOfDocument(this.document.ispId)
      this.findToPayData(this.document.id)
    },

    async findTypeOfDocument(viddocId) {
      this.loadingType.typeOfDoc = true

      const typeOfDoc = await this.$api.budgetElements.findDocumentTypeById(viddocId)

      this.typeOfDoc = typeOfDoc.nameViddoc

      this.loadingType.typeOfDoc = null
    },

    async findConsumerOfDocument(consumerId) {
      this.loadingType.consumerOfDoc = true

      const consumerOfDoc = await await this.$api.organizations.findById(consumerId)

      this.consumerOfDoc = consumerOfDoc.shortName

      this.loadingType.consumerOfDoc = null
    },

    async findOrganizationOfDocument(myorgId) {
      this.loadingType.organization = true

      const organization = await this.$api.organizations.findById(myorgId)

      this.orgOfDoc = organization.shortName

      this.loadingType.organization = null
    },

    async findExecutorOfDocument(ispId) {
      this.loadingType.executor = true

      const executor = await this.$api.executors.findById(ispId)

      this.executorOfDoc = executor.fio

      this.loadingType.executor = null
    },

    async findToPayData(documentId) {
      const data = {
        docoplForPayId: documentId
      }
      this.totalToSumOplat = 0
      this.toPayData = await this.$api.payment.docOplToPay.findDocToPayByDocoplForPay(data)

      this.toPayData.forEach((value) => {
        this.totalToSumOplat += value.sumOplat
      })
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
