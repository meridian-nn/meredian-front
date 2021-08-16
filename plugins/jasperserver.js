// Плагин для взаимодействия с JasperServer
import Vue from 'vue'
Vue.mixin({
  methods: {
    getJasperLoginAndPasswordForHeaders() {
      return { 'Authorization': 'Basic amFzcGVyYWRtaW46amFzcGVyYWRtaW4=' }
    },

    getJasperRootUrl() {
      return 'http://192.168.0.245:8080/jasperserver/rest_v2/reports/reports/'
    },

    async downloadReestPaysReport(format, pdReestrPays) {
      if (!pdReestrPays) {
        return
      }

      if (!format) {
        format = 'html'
      }

      const link = this.getJasperRootUrl() +
        'ReestrPays_Blue.' +
        format + '?' + 'P_D_ReestrPays=' + pdReestrPays

      const config = {
        headers: this.getJasperLoginAndPasswordForHeaders(),
        responseType: 'blob'
      }

      const report = await this.$axios.$get(link, config)
      this.forceJasperReportDownload(report, format, 'Реестр_оплат_от_' + pdReestrPays)
    },

    async downloadOrderOnOurProductionFromJasperserver(format, zkzpsvId) {
      if (!zkzpsvId) {
        return
      }

      if (!format) {
        format = 'HTML'
      }

      const link = this.getJasperRootUrl() +
        'Zakaz_na_poshiv.' +
        format + '?' + 'zkzpsv_id=' + zkzpsvId

      const config = {
        headers: this.getJasperLoginAndPasswordForHeaders(),
        responseType: 'blob'
      }

      const report = await this.$axios.$get(link, config)
      this.forceJasperReportDownload(report, format, 'Заказ_на_наше_производство_' + zkzpsvId)
    },

    async downloadOrderOnGiversRawMaterialsFromJasperserver(format, zkzpsvId) {
      if (!zkzpsvId) {
        return
      }

      if (!format) {
        format = 'HTML'
      }

      const link = this.getJasperRootUrl() +
        'Zkzpsv_ds.' +
        format + '?' + 'zkzpsv_id=' + zkzpsvId

      const config = {
        headers: this.getJasperLoginAndPasswordForHeaders(),
        responseType: 'blob'
      }

      const report = await this.$axios.$get(link, config)
      this.forceJasperReportDownload(report, format, 'Заказ_на_пошив_из_дав_сырья_' + zkzpsvId)
    },

    async downloadInvoiceForReleaseOfFinishedProductionsFromJasperserver(format, zkzpsvId) {
      if (!zkzpsvId) {
        return
      }

      if (!format) {
        format = 'HTML'
      }

      const link = this.getJasperRootUrl() +
        'Zkzpsv_nakl.' +
        format + '?' + 'zkzpsv_id=' + zkzpsvId

      const config = {
        headers: this.getJasperLoginAndPasswordForHeaders(),
        responseType: 'blob'
      }

      const report = await this.$axios.$get(link, config)
      this.forceJasperReportDownload(report, format, 'Накладная_на_отпуск_готовой_продукции_' + zkzpsvId)
    },

    async downloadCustomCuttingCardFromJasperserver(format, zkzpsvId) {
      if (!zkzpsvId) {
        return
      }

      if (!format) {
        format = 'HTML'
      }

      const link = this.getJasperRootUrl() +
        'psv_karta_kroi.' +
        format + '?' + 'zkzpsv_id=' + zkzpsvId

      const config = {
        headers: this.getJasperLoginAndPasswordForHeaders(),
        responseType: 'blob'
      }

      const report = await this.$axios.$get(link, config)
      this.forceJasperReportDownload(report, format, 'Карта_раскроя_на_заказ_' + zkzpsvId)
    },

    async downloadRawMaterialConsumptionMapFromJasperserver(format, zkzpsvId) {
      if (!zkzpsvId) {
        return
      }

      if (!format) {
        format = 'HTML'
      }

      const link = this.getJasperRootUrl() +
        'rasx_tkan.' +
        format + '?' + 'zkzpsv_id=' + zkzpsvId

      const config = {
        headers: this.getJasperLoginAndPasswordForHeaders(),
        responseType: 'blob'
      }

      const report = await this.$axios.$get(link, config)
      this.forceJasperReportDownload(report, format, 'Карта_расхода_сырья_' + zkzpsvId)
    },

    async downloadAccessoriesConsumptionMapFromJasperserver(format, zkzpsvId) {
      if (!zkzpsvId) {
        return
      }

      if (!format) {
        format = 'HTML'
      }

      const link = this.getJasperRootUrl() +
        'rasx_furn.' +
        format + '?' + 'zkzpsv_id=' + zkzpsvId

      const config = {
        headers: this.getJasperLoginAndPasswordForHeaders(),
        responseType: 'blob'
      }

      const report = await this.$axios.$get(link, config)
      this.forceJasperReportDownload(report, format, 'Карта_расхода_фурнитуры_' + zkzpsvId)
    },

    async downloadLocationOfLogosInOrderFromJasperserver(format, zkzpsvId) {
      if (!zkzpsvId) {
        return
      }

      if (!format) {
        format = 'HTML'
      }

      const link = this.getJasperRootUrl() +
        'mclog_new.' +
        format + '?' + 'zkzpsv_id=' + zkzpsvId

      const config = {
        headers: this.getJasperLoginAndPasswordForHeaders(),
        responseType: 'blob'
      }

      const report = await this.$axios.$get(link, config)
      this.forceJasperReportDownload(report, format, 'Месторасположение_логотипов_в_заказе_' + zkzpsvId)
    },

    forceJasperReportDownload(report, format, fileName) {
      const url = window.URL.createObjectURL(new Blob([report]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName + '.' + format) // or any other extension
      document.body.appendChild(link)
      link.click()
    }
  }

})
