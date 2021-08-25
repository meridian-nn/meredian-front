/* eslint-disable */
// Плагин c разными системными методами
import Vue from 'vue'

Vue.mixin({
  methods: {
    //Функция возвращает id таблицы "Документы на оплату" формы "Журнал документов на оплату"
    getIdOfFromPayDocsTableOfJournalOfPaymentDocs() {
      return 'journal-of-payment-docs-from-pay-docs'
    },

    getIdOfOutgoingDocumentsTable() {
      return 'outgoing-payment-document'
    },

    getIdOfIncomingDocumentsTable() {
      return 'incoming-payment-document'
    },

    getIdOfRecordsTableOfRecordsOfWorkByCards() {
      return 'records-of-work-by-cards-table-of-records'
    },

    getIdOfFilterSewingOrderLog() {
      return 'filter-sewing-order-log'
    },

    getIdOfUserComplectsForPrintReports() {
      return 'user-complect-for-print-reports'
    },

    //Функция возвращает form id и element id для orgId и accId по умолчанию
    getObjectWithFormIdAndElementIdForDefaultOrgAndAcc() {
      return {
        formId: 'everywhere',
        elementId: 'everywhere'
      }
    },

    // Функция поиска организации и расчетного счета по умолчанию для текущего пользователя
    async findDefaultOrgAndAccIdForUser() {
      const formAndElementIdsOfOrgAndAccIds = this.getObjectWithFormIdAndElementIdForDefaultOrgAndAcc()
      const dataForFiltersQuery = this.createCriteriasToSearchForFiltersValues(formAndElementIdsOfOrgAndAccIds.formId,
        formAndElementIdsOfOrgAndAccIds.elementId, this.getCurrentUser.id)
      const response = await this.$api.uiSettings.findBySearchCriterias(dataForFiltersQuery)
      let filtersParams = {}

      if (response.length) {
        filtersParams = JSON.parse(response[0].settingValue)
      }

      return filtersParams
    },

    //Функция возвращает цвет организации по переданному id организации
    getColorForOrganization(orgId) {
      if (orgId === 159) {
        return '#639db1'
      } else {
        return this.getRandomColor()
      }
    },

    getRandomColor() {
      const letters = '0123456789ABCDEF'
      let color = '#'
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      return color
    },

    //Функция возвращает организации, у которых sp_org_type_id = 1
    async getBudgetOrganizations() {
      const data = {
        typeCode: 1
      }

      const organizations = await this.$api.organizations.findByOrgTypeCode(data)
      organizations[1] = organizations.splice(0, 1, organizations[1])[0]

      return organizations
    },

    // Функция возвращает текущую дату минус 1 год
    getCurrentDateMinusOneYearForSearchCriterias() {
      let currentDate = new Date()
      return new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate())
    },

    // Функция возвращает текущую дату минус 6 месяцев
    getCurrentDateMinusSixMonthsForSearchCriterias() {
      let currentDate = new Date()
      return new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, currentDate.getDate())
    },

    convertLocaleDateStringToDate(date) {
      const parts = date.split('.')
      return new Date(parts[2], parts[1] - 1, parts[0])
    },
    // конвертирование даты из формата ДАТА.МЕСЯЦ.ГОД в формат ГОД-МЕСЯЦ-ДАТА
    convertLocaleDateStringinISODateString(date) {
      let parts = date.split('.')
      return `${parts[2]}-${parts[1]}-${parts[0]}`
    },
    // конвертирование даты из формата ГОД-МЕСЯЦ-ДАТА в формат МЕСЯЦ.ДАТА.ГОД
    convertDateToMonthDateYear(date) {
      let parts = date.split('-')
      return `${parts[1]}.${parts[2]}.${parts[0]}`
    },

    async changeSumToPayOfPaymentAccount(accId, sumOfPaymentDocs, operationType, date) {
      if (sumOfPaymentDocs === 0) {
        return
      }

      const searchCriterias = this.createCriteriasToFindPaymentAccount(accId, date)
      const response = await this.$api.paymentAccounts.findBySearchCriteriaList(searchCriterias)
      let paymentAccount

      if (!response) {
        return
      } else {
        paymentAccount = response[0]
      }

      paymentAccount.sumToPay = paymentAccount.sumToPay ? paymentAccount.sumToPay : 0

      if (operationType === 'SUM') {
        paymentAccount.sumToPay = paymentAccount.sumToPay + sumOfPaymentDocs
      } else if (operationType === 'DEDUCT') {
        paymentAccount.sumToPay = paymentAccount.sumToPay - sumOfPaymentDocs
      }

      return await this.$api.paymentAccounts.save(paymentAccount)
    },

    async changeVnplOfPaymentAccounts(accIdOfPayer, accIdOfReceiver, sumOfPayment, dateOfDoc) {
      if (sumOfPayment === 0) {
        return
      }

      const searchCriterias = this.createCriteriasToFindTwoPaymentAccounts(accIdOfPayer, accIdOfReceiver, dateOfDoc)
      const response = await this.$api.paymentAccounts.findBySearchCriteriaList(searchCriterias)
      let paymentAccountOfPayer
      let paymentAccountOfReceiver

      if (!response) {
        return
      } else {
        paymentAccountOfPayer = response.find(el => el.acc.id === accIdOfPayer)
        paymentAccountOfReceiver = response.find(el => el.acc.id === accIdOfReceiver)
      }

      if (!paymentAccountOfPayer || !paymentAccountOfReceiver) {
        return
      }

      paymentAccountOfPayer.vnpl = paymentAccountOfPayer.vnpl ? paymentAccountOfPayer.vnpl : 0
      paymentAccountOfPayer.vnpl = paymentAccountOfPayer.vnpl - sumOfPayment

      paymentAccountOfReceiver.vnpl = paymentAccountOfReceiver.vnpl ? paymentAccountOfReceiver.vnpl : 0
      paymentAccountOfReceiver.vnpl = paymentAccountOfReceiver.vnpl + sumOfPayment

      const arrayOfPaymentAccountsForSave = [
        paymentAccountOfPayer,
        paymentAccountOfReceiver
      ]

      await this.$api.payment.balanceOfPaymentAccount.saveAll(arrayOfPaymentAccountsForSave)
    },

    getConfigForDeleteMethods() {
      return {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    },

    /* Remove the second item from the array
    array.remove(1);
    Remove the second-to-last item from the array
    array.remove(-2);
    Remove the second and third items from the array
    array.remove(1,2);
    Remove the last and second-to-last items from the array
    array.remove(-2,-1); */
    deleteElemFromArray(array, from, to) {
      const rest = array.slice((to || from) + 1 || array.length)
      array.length = from < 0 ? array.length + from : from
      return array.push.apply(array, rest)
    }
  }
})
