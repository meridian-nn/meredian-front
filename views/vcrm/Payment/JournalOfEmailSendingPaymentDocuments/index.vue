<template>
  <div
    class="journal-of-email-sending-payment-docs-main-div"
  >
    <div class="journal-of-email-sending-payment-docs-row">
      <div
        align="center"
        class="journal-of-email-sending-payment-docs-main-row-headline"
      >
        Журнал рассылки на e-mail документов к оплате
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
          @change="updateAllInfo"
        />
      </div>

      <div class="journal-of-email-sending-payment-docs-spacer">
        <download-excel
          :data="documentsForExport"
          :fields="exportFields"
          type="xls"
          :header="headerData"
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

    <div
      id="tableForPrint"
      class="journal-of-email-sending-payment-docs-row"
    >
      <h1 id="titleForTable" />
      <v-data-table
        id="journal-of-email-sending-payment-data-table"
        :headers="documentsToPayHeaders"
        :items="documentsToPayData"
        :show-select="false"
        :items-per-page="100"
        :disable-items-per-page="true"
        no-data-text=""
        hide-default-footer
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
import XLSX from 'xlsx'

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
      documentsToPayHeaders: [
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
      documentsToPayData: [],

      // Массив документов для экпорта в excel
      documentsForExport: [],

      // Количество различных расчетных счетов в таблице
      accsInPayData: [],

      // Текущий расчетный счет из цикла выгрузки документов
      currentAcc: null,

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

      headerData: [],

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
      await this.updateAllInfo()
    },

    async findDefaultOrgAndAccIdForUserOnForm() {
      const filtersParams = await this.findDefaultOrgAndAccIdForUser()
      if (filtersParams) {
        this.selectedPayer = filtersParams.orgId
      }
    },

    async startDownloadExcel() {
      for (const acc of this.accsInPayData) {
        await this.downloadAcc(acc)
      }
    },

    downloadPayerWithSheetJS(payer) {
      return new Promise((resolve, reject) => {
        this.currentAcc = payer
        const wb = XLSX.utils.book_new()

        const depDocsWS = XLSX.utils.json_to_sheet(this.exportFields)
        XLSX.utils.book_append_sheet(wb, depDocsWS, 'depDocs')

        const tabl = document.getElementById('dataTable')
        XLSX.utils.sheet_add_dom('depDocs', tabl)
        // const wb = XLSX.utils.table_to_book(tabl)
        // const wb = XLSX.utils.book_new()
        /* const depDocs = this.documentsFromPayData.filter(doc => doc.payerName === payer)
        const depDocsWS = XLSX.utils.json_to_sheet(depDocs)
        XLSX.utils.book_append_sheet(wb, depDocsWS, 'depDocs') */
        this.generateNameForExportFile()
        XLSX.writeFile(wb, this.exportFileName)
        resolve('download' + this.currentAcc)
      })
    },

    downloadAcc(acc) {
      return new Promise((resolve, reject) => {
        const depDocs = this.documentsToPayData.filter(doc => doc.accId === acc.acc.id)
        let sumOfDocs = 0
        this.documentsForExport = depDocs
        this.documentsForExport.forEach((doc) => {
          sumOfDocs += doc.sumPaidNumber
        })
        this.currentAcc = acc

        const startBalance = acc.saldo + acc.nalich + acc.vnpl
        const endBalance = startBalance - sumOfDocs
        this.createHeaderForDownloadingData(acc, startBalance)
        this.createFooterForDownloadingData(sumOfDocs, endBalance)

        this.$refs.downloadExcel.click()
        resolve('download' + this.currentAcc)
      })
    },

    createHeaderForDownloadingData(acc, startBalance) {
      this.headerData = [
        'Дата: ' + new Date(this.date).toLocaleDateString(),
        'Фирма: ' + acc.myOrg.clName,
        'Р/счет: ' + acc.acc.numAcc.slice(acc.acc.numAcc.length - 4) + ' ' + acc.acc.nameBank,
        'Остаток на р/с: ' + this.numberToSum(acc.saldo),
        'Прочее: ' + this.numberToSum(acc.nalich),
        'Внутренний платеж: ' + this.numberToSum(acc.vnpl),
        'Остаток на начало: ' + this.numberToSum(startBalance)
      ]
    },

    createFooterForDownloadingData(sumOfDocs, endBalance) {
      this.exportFooter = [
        'Итого к оплате: ' + this.numberToSum(sumOfDocs),
        'Остаток на р/с: ' + this.numberToSum(endBalance)
      ]
    },

    async findPayers() {
      if (!this.payers.length) {
        this.loadingType.payers = true

        this.payers = await this.$api.organizations.findPayers()

        this.loadingType.payers = null
      }
    },

    // Обновление списка документов в таблице "Документы на оплату"
    updateAllInfo() {
      this.findSpDocoplForPay()
    },

    // Поиск документов для таблицы "Документы на оплату"
    async findSpDocoplForPay() {
      // Поиск документов к оплате
      const searchCriteriasForDocsToPay = this.createCriteriasToSearchDocsToPayForEmailSendingForm(this.date, this.selectedPayer)
      const docsToPay = await this.$api.payment.docOplToPay.findDocumentsByCriterias(searchCriteriasForDocsToPay)

      // Поиск оплат по кассе
      const searchCriteriasForPaymentByCashbox = this.createCriteriasToSearchPaymentByCashboxForEmailSendingForm(this.date, this.selectedPayer)
      const paymentsByCashbox = await this.$api.payment.findPaymentsByCashboxByCriterias(searchCriteriasForPaymentByCashbox)

      // Поиск внутренних платежей
      const searchCriteriasForVNPLDocs = this.createCriteriasToSearchVNPLDocsForEmailSendingForm(this.date, this.selectedPayer)
      const vnplDocs = await this.$api.payment.docOplForPay.findDocumentsForPayByCriterias(searchCriteriasForVNPLDocs)

      // Конвертация респонсов в данные для отображения на форме
      const resultOfConvert = await this.convertVNPLPaymentByCashboxAndDocsToPayResponsesToDataForTable(
        vnplDocs,
        paymentsByCashbox,
        docsToPay,
        this.date)
      this.documentsToPayData = resultOfConvert.dataForTable
      this.totalSumOplat = resultOfConvert.totalSumOplat
      this.accsInPayData = resultOfConvert.accsInDataForTable
    },

    // Метод генерации имени для файла выгрузки
    generateNameForExportFile() {
      let numberOfAcc = ''
      if (this.currentAcc.acc.accType === 'COMMON') {
        numberOfAcc = this.currentAcc.acc.numAcc.slice(this.currentAcc.acc.numAcc.length - 4)
      } else {
        numberOfAcc = 'Касса'
      }

      this.exportFileName = 'Журнал_документов_на_оплату_покуп._' + this.currentAcc.myOrg.clName + '_' + numberOfAcc + '_' + new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString() + '.xls'
    },

    // Печать таблицы документов на оплату
    print() {
      const payer = this.payers.find(curPayer => curPayer.id === this.selectedPayer)
      const title = document.getElementById('titleForTable')
      title.innerHTML = 'Дата: ' + new Date(this.date).toLocaleDateString() + ' \n '
      title.innerHTML = title.innerHTML + (payer ? 'Фирма: ' + payer.clName : '')

      this.$htmlToPaper('tableForPrint', null, () => {
        title.innerHTML = ''
      })
    }
  }
}
</script>

<style lang="scss">
#journal-of-email-sending-payment-data-table  td {
    padding: 0 0 !important;
    height: 0 !important;
}

#journal-of-email-sending-payment-data-table  th {
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
