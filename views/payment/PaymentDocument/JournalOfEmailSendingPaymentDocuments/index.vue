<template>
  <div>
    <v-card>
      <v-card-text class="journal-of-email-sending-payment-docs-card-text">
        <v-container
          class="journal-of-email-sending-payment-docs-container"
        />
        <v-row>
          <v-col cols="10">
            <div
              align="center"
              class="journal-of-email-sending-payment-docs-main-row headline"
            >
              Журнал рассылки на e-mail документов к оплате
            </div>
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="date"
              type="date"
              @input="updateAllInfo()"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="2">
            <v-autocomplete
              label="Плательщик"
              :loading="loadingType.payers"
              :items="payers"
              item-value="id"
              item-text="clName"
              hide-details="auto"
              outlined
              @change="payerChange"
            />
          </v-col>

          <v-col cols="2">
            <!--v-text-field
              v-model="emailFoSending"
              type="text"
              label="Email"
              outlined
              hide-details="auto"
            /-->
          </v-col>

          <v-col cols="2">
            <!--v-subheader class="font-weight-medium text-subtitle-1">
              файл рассылки
            </v-subheader-->
          </v-col>

          <v-col cols="2">
            <!--v-text-field
              v-model="linkToDocumentForSending"
              type="text"
              label="Путь к файлу"
              outlined
              hide-details="auto"
            /-->
          </v-col>

          <v-col cols="2">
            <download-excel
              :data="documentsToPayData"
              :fields="exportFields"
              :footer="exportFooter"
              :name="exportFileName"
              :before-generate="generateNameForExportFile"
            >
              <v-btn>
                Скачать таблицу
              </v-btn>
            </download-excel>
          </v-col>

          <v-col cols="2">
            <v-btn @click="print">
              Распечатать
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-data-table
              id="dataTable"
              :headers="documentsToPayHeaders"
              :items="documentsToPayData"
              :show-select="false"
              :items-per-page="100"
              :disable-items-per-page="true"
              hide-default-footer
              :footer-props="{ itemsPerPageText: 'Количество строк на странице:' }"
              class="elevation-1 journal-of-payment-docs-docs-from-pay-table"
            >
              <template
                slot="body.append"
              >
                <tr>
                  <th>Итого</th>
                  <th />
                  <th />
                  <th>{{ totalSumOplat }}</th>
                  <th />
                  <th />
                  <th />
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>

        <!--v-row>
          <v-col cols="3">
            <v-btn
              @click="send"
            >
              Отправить
            </v-btn>
          </v-col>
          <v-col cols="3" />
        </v-row-->
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>

export default {
  name: 'JournalOfEmailSendingPaymentDocuments',
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      loadingType: {},
      payers: [],
      seletedPayer: null,
      emailForSending: null,
      linkToDocumentForSending: null,

      // Шапка таблицы "Документы к оплате"
      documentsToPayHeaders: [
        {
          text: 'Дата',
          value: 'dataCreate'
        },
        {
          text: 'Номер',
          value: 'nameDoc'
        },
        {
          text: 'Контрагент',
          value: 'namePlat'
        },
        {
          text: 'Сумма оплаты',
          value: 'sumOplat'
        },
        {
          text: 'Подразделение',
          value: 'depName'
        },
        {
          text: 'Частичная оплата',
          value: 'partialPayment'
        },
        {
          text: 'Комментарий',
          value: 'prim'
        }
      ],

      // Список колонок таблицы для экспорта в excel
      exportFields: {
        'Дата': 'dataCreate',
        'Номер': 'nameDoc',
        'Контрагент': 'namePlat',
        'Сумма оплаты': 'sumOplat',
        'Подразделение': 'depName',
        'Частичная оплата': 'partialPayment',
        'Комментарий': 'prim'
      },

      // Данные для экспорта в подвал таблицы
      exportFooter: '',

      exportFileName: '',

      // Список документов таблицы "Документы к оплате"
      documentsToPayData: [],

      // Итоговая сумма по колонке "К оплате" документов на оплату
      totalSumOplat: 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.findPayers()
    },

    async findPayers() {
      if (!this.payers.length) {
        this.loadingType.payers = true

        this.payers = await this.$axios.$get(
          '/meridian/oper/dict/spOrg/findPayers'
        )

        this.loadingType.payers = null
      }
    },

    updateAllInfo() {
      if (this.seletedPayer) {
        this.findSpDocoplForPay()
      }
    },

    payerChange(val) {
      this.seletedPayer = val
      this.findSpDocoplForPay()
    },

    // Поиск документов для таблицы "Документы на оплату" по выбранной организации
    async findSpDocoplForPay() {
      this.documentsToPayData = await this.getDocumentsToPay()
    },

    // Метод получения документов к оплате выбранной организации
    async getDocumentsToPay() {
      const arrayOfDocsToPay = []
      const paymentAccounts = await this.$axios.$get('/meridian/oper/spAcc/findByOrgId?orgId=' + this.seletedPayer)
      const arrayOfDocsToPayByPaymentAccs = await this.getAllDocsToPayOfOrgByPaymentAccs(paymentAccounts)

      let totalToSumOplat = 0
      arrayOfDocsToPayByPaymentAccs.forEach((array) => {
        array.forEach((element) => {
          totalToSumOplat += element.sumOplat
          element.partialPayment = true
          arrayOfDocsToPay.push(element)
        })
      })

      this.exportFooter = 'Итого к оплате: ' + totalToSumOplat
      this.totalSumOplat = totalToSumOplat
      return arrayOfDocsToPay
    },
    async getAllDocsToPayOfOrgByPaymentAccs(paymentAccounts) {
      const arrayOfDocsToPayByPaymentAccs = []
      const arrayOfPromises = []
      paymentAccounts.forEach((account) => {
        const promise = this.getDocumentsToPayOfOrgByAccId(account.id)
        arrayOfPromises.push(promise)
      })
      await Promise.all(arrayOfPromises).then((results) => {
        results.forEach((result) => {
          if (result.length) {
            arrayOfDocsToPayByPaymentAccs.push(result)
          }
        })
      })
      return arrayOfDocsToPayByPaymentAccs
    },
    async getDocumentsToPayOfOrgByAccId(accId) {
      const data = {
        dateDoc: new Date(this.date).toLocaleDateString(),
        accId,
        orgId: this.selectedOrganization
      }

      const response = await this.$axios.$get('/meridian/oper/spDocopl/findSpDocoplToPay', { params: data })
      return response
    },

    generateNameForExportFile() {
      this.exportFileName = 'journal_of_documents_to_pay' + new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString() + '.xls'
      // this.linkToDocumentForSending =
    },

    send() {

    },

    // Пример печати документа
    print() {
      this.$htmlToPaper('dataTable')
    }
  }
}
</script>

<style lang="scss">
.journal-of-email-sending-payment-docs-card-text{
  max-height: 1000px;
}
.journal-of-email-sending-payment-docs-container{
  padding-top: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
  max-width: none;
}
.journal-of-email-sending-payment-docs-main-row {
    padding-bottom: 10px;
}

</style>
