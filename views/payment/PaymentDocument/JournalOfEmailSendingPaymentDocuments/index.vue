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
              Журнал рассылки на e-mail документов на оплату
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
            <download-excel
              :data="documentsForExport"
              :fields="exportFields"
              :footer="exportFooter"
              :name="exportFileName"
              :before-generate="generateNameForExportFile"
            >
              <!--v-btn ref="downloadExcel">
                Скачать таблицу
              </v-btn-->

              <button
                ref="downloadExcel"
              />
            </download-excel>
          </v-col>

          <v-col cols="2">
            <v-btn @click="startDownloadExcel">
              Скачать таблицу
            </v-btn>
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
              :headers="documentsFromPayHeaders"
              :items="documentsFromPayData"
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
      documentsFromPayHeaders: [
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
          value: 'sumOplach'
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
      depsInPayData: [],

      // Текущий департамент из цикла выгрузки документов
      currentDep: null,

      // Итоговая сумма по колонке "К оплате" документов на оплату
      totalSumOplat: 0,

      // Список колонок таблицы для экспорта в excel
      exportFields: {
        'Дата': 'dataCreate',
        'Номер': 'nameDoc',
        'Контрагент': 'namePlat',
        'Сумма оплаты': 'sumOplach',
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
    init() {
      this.findPayers()
    },

    async startDownloadExcel() {
      for (const dep of this.depsInPayData) {
        const result = await this.downloadDep(dep)
        console.log(result)
      }
    },

    downloadDep(dep) {
      const promise = new Promise((resolve, reject) => {
        const depDocs = this.documentsFromPayData.filter(doc => doc.depName === dep)
        let sumOfDocs = 0
        this.documentsForExport = depDocs
        this.documentsForExport.forEach((doc) => {
          sumOfDocs += doc.sumOplach
        })
        this.exportFooter = 'Итого к оплате: ' + sumOfDocs
        this.currentDep = dep

        console.log(this.documentsForExport)
        console.log(this.currentDep)

        this.$refs.downloadExcel.click()
        resolve('download' + this.currentDep)
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
      const data = {
        dateDoc: new Date(this.date).toLocaleDateString(),
        orgId: this.seletedPayer
      }

      this.documentsFromPayData = await this.$api.payment.docOplForPay.findSpDocoplForPay(data)
      let totalSumOplat = 0
      this.documentsFromPayData.forEach((value) => {
        if (!this.depsInPayData.includes(value.depName)) {
          this.depsInPayData.push(value.depName)
        }

        totalSumOplat += value.sumOplach
        value.partialPayment = (value.sumDoc !== value.sumOplach)
      })

      this.totalSumOplat = totalSumOplat
    },

    // Метод генерации имени для файла выгрузки
    generateNameForExportFile() {
      this.exportFileName = 'Журнал_документов_на_оплату_подр._' + this.currentDep + '_' + new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString() + '.xls'
      // this.linkToDocumentForSending =
    },

    send() {

    },

    // Печать таблицы документов на оплату
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
