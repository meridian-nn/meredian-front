<template>
  <div class="journal-of-email-sending-payment-docs-main-div">
    <div class="journal-of-email-sending-payment-docs-row">
      <div
        align="center"
        class="journal-of-email-sending-payment-docs-main-row-headline"
      >
        Журнал рассылки на e-mail документов на оплату
      </div>
      <div class="journal-of-email-sending-payment-docs-date">
        <v-text-field
          v-model="date"
          type="date"
          @input="updateAllInfo()"
        />
      </div>
    </div>

    <div class="journal-of-email-sending-payment-docs-row-with-btns">
      <div class="journal-of-email-sending-payment-docs-payer">
        <v-autocomplete
          v-model="selectedPayer"
          label="Плательщик"
          :loading="loadingType.payers"
          :items="payers"
          item-value="id"
          item-text="clName"
          hide-details="auto"
          outlined
          :clearable="true"
          @change="payerChange"
        />
      </div>

      <div class="journal-of-email-sending-payment-docs-spacer">
        <download-excel
          :data="documentsForExport"
          :fields="exportFields"
          :footer="exportFooter"
          :name="exportFileName"
          :before-generate="generateNameForExportFile"
        >
          <button
            ref="downloadExcel"
          />
        </download-excel>
      </div>

      <div class="journal-of-email-sending-payment-docs-dnwld-btn">
        <v-btn @click="startDownloadExcel">
          Скачать таблицу
        </v-btn>
      </div>

      <div class="journal-of-email-sending-payment-docs-spacer-btw-btns" />

      <div class="journal-of-email-sending-payment-docs-print-btn">
        <v-btn @click="print">
          Распечатать
        </v-btn>
      </div>

      <div class="journal-of-email-sending-payment-docs-spacer-btw-btn-end" />
    </div>

    <div class="journal-of-email-sending-payment-docs-row">
      <v-data-table
        id="dataTable"
        :headers="documentsFromPayHeaders"
        :items="documentsFromPayData"
        :show-select="false"
        :items-per-page="100"
        :disable-items-per-page="true"
        hide-default-footer
        :footer-props="{ itemsPerPageText: 'Количество строк на странице:' }"
        class="elevation-1 journal-of-email-sending-payment-docs-table"
      >
        <template
          slot="body.append"
        >
          <tr>
            <th>Итого</th>
            <th />
            <th> {{ totalSumOplat }}</th>
            <th />
            <th />
            <th />
            <th />
          </tr>
        </template>
      </v-data-table>
    </div>
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
      selectedPayer: null,
      emailForSending: null,
      linkToDocumentForSending: null,

      // Шапка таблицы "Документы к оплате"
      documentsFromPayHeaders: [
        {
          text: 'Дата',
          value: 'dataDoc'
        },
        {
          text: 'Номер',
          value: 'nameDoc'
        },
        {
          text: 'Сумма оплаты',
          value: 'sumPaid'
        },
        {
          text: 'Плательщик',
          value: 'myorgName'
        },
        {
          text: 'Исполнитель',
          value: 'executorName'
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

      // Список документов таблицы "Документы к оплате"
      documentsFromPayData: [],

      // Массив документов для экпорта в excel
      documentsForExport: [],

      // Количество различных департаментов в таблице
      payersInPayData: [],

      // Текущий департамент из цикла выгрузки документов
      currentPayer: null,

      // Итоговая сумма по колонке "К оплате" документов на оплату
      totalSumOplat: 0,

      // Список колонок таблицы для экспорта в excel
      exportFields: {
        'Дата': 'dataDoc',
        'Номер': 'nameDoc',
        'Сумма оплаты': 'sumPaid',
        'Плательщик': 'myorgName',
        'Исполнитель': 'executorName',
        'Подразделение': 'depName',
        'Частичная оплата': 'partialPayment',
        'Комментарий': 'prim'
      },

      // Данные для экспорта в подвал таблицы
      exportFooter: '',

      // Имя экспортируемого файла
      exportFileName: ''

    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.findPayers()
      await this.findDefaultOrgAndAccIdForUserOnForm()
      await this.payerChange()
    },

    async findDefaultOrgAndAccIdForUserOnForm() {
      const filtersParams = await this.findDefaultOrgAndAccIdForUser()
      if (filtersParams) {
        this.selectedPayer = filtersParams.orgId
      }
    },

    async startDownloadExcel() {
      for (const payer of this.payersInPayData) {
        await this.downloadPayer(payer)
      }
    },

    downloadPayer(payer) {
      const promise = new Promise((resolve, reject) => {
        const depDocs = this.documentsFromPayData.filter(doc => doc.payerName === payer)
        let sumOfDocs = 0
        this.documentsForExport = depDocs
        this.documentsForExport.forEach((doc) => {
          sumOfDocs += doc.sumPaidNumber
        })
        this.exportFooter = 'Итого к оплате: ' + this.numberToSum(sumOfDocs)
        this.currentPayer = payer

        this.$refs.downloadExcel.click()
        resolve('download' + this.currentPayer)
      })
      return promise
    },

    async findPayers() {
      if (!this.payers.length) {
        this.loadingType.payers = true

        this.payers = await this.$api.organizations.findPayers()

        this.loadingType.payers = null
      }
    },

    updateAllInfo() {
      if (this.selectedPayer) {
        this.findSpDocoplForPay()
      }
    },

    payerChange() {
      this.findSpDocoplForPay()
    },

    // Поиск документов для таблицы "Документы на оплату" по выбранной организации
    async findSpDocoplForPay() {
      const data = this.createCriteriasToSearchDocsFromPayForEmailSendingForm(this.date, this.selectedPayer)

      this.documentsFromPayData = await this.$api.payment.docOplForPay.findDocumentsForPayByCriterias(data)
      let totalSumOplat = 0
      this.documentsFromPayData.forEach((value) => {
        if (!value.myOrg) {
          value.payerName = ''
        } else {
          value.payerName = value.myOrg.clName
        }

        if (!this.payersInPayData.includes(value.payerName)) {
          this.payersInPayData.push(value.payerName)
        }

        if (!value.sumPaid) {
          value.sumPaid = 0
        }

        totalSumOplat += value.sumPaid
        value.partialPayment = (value.sumDoc !== value.sumPaid) ? 'Да' : 'Нет'
        value.sumPaidNumber = value.sumPaid
        value.sumPaid = this.numberToSum(value.sumPaid)
      })

      this.totalSumOplat = this.numberToSum(totalSumOplat)
    },

    // Метод генерации имени для файла выгрузки
    generateNameForExportFile() {
      this.exportFileName = 'Журнал_документов_на_оплату_покуп._' + this.currentPayer + '_' + new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString() + '.xls'
      // this.linkToDocumentForSending =
    },

    send() {

    },

    // Печать таблицы документов на оплату
    print() {
      console.log(this)
      this.$htmlToPaper('dataTable')
    }
  }
}
</script>

<style lang="scss">
.v-data-table td {
    padding: 0 0 !important;
    height: 0 !important;
}

.v-data-table th {
    padding: 0 0 !important;
    height: 0 !important;
}

.journal-of-email-sending-payment-docs-main-div {
  padding: 10px;
}

.journal-of-email-sending-payment-docs-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
}

.journal-of-email-sending-payment-docs-row-with-btns {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
  padding-bottom: 5px;
}

.journal-of-email-sending-payment-docs-main-row-headline {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.5rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
  flex: 0 0 90%;
  max-width: 90%;
}

.journal-of-email-sending-payment-docs-date{
  flex: 0 0 10%;
  max-width: 10%;
}

.journal-of-email-sending-payment-docs-payer{
  flex: 0 0 20%;
  max-width: 20%;
}

.journal-of-email-sending-payment-docs-spacer{
  flex: 0 0 51%;
  max-width: 51%;
}

.journal-of-email-sending-payment-docs-dnwld-btn{
  flex: 0 0 12%;
  max-width: 12%;
}

.journal-of-email-sending-payment-docs-spacer-btw-btns{
  flex: 0 0 5%;
  max-width: 5%;
}

.journal-of-email-sending-payment-docs-print-btn{
  flex: 0 0 9%;
  max-width: 9%;
}

.journal-of-email-sending-payment-docs-spacer-btw-btn-end{
  flex: 0 0 5%;
  max-width: 5%;
}

.journal-of-email-sending-payment-docs-table{
  flex: 0 0 100%;
  max-width: 100%;
}
</style>
