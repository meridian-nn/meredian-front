/* eslint-disable */
// Плагин c разными системными методами
import Vue from 'vue'
Vue.mixin({
    methods: {
        //Функция возвращает id таблицы "Документы на оплату" формы "Журнал документов на оплату"
        getIdOfFromPayDocsTableOfJournalOfPaymentDocs() {
            return 'journal-of-payment-docs-from-pay-docs'
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
            formAndElementIdsOfOrgAndAccIds.elementId, this.getCurrentUser().id)
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
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
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

        getDateForCriteriasToSearchDocsFromPay() {
          let currentDate = new Date()
          return new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate())
        },

        async changeSumToPayOfPaymentAccount(accId, sumOfPaymentDocs, operationType, date) {
          if(sumOfPaymentDocs === 0) {
            return
          }

          const searchCriterias = this.createCriteriasToFindPaymentAccount(accId,date)
          const response = await this.$api.paymentAccounts.findBySearchCriteriaList(searchCriterias)
          let paymentAccount

          if(!response) {
            return
          } else {
            paymentAccount = response[0]
          }

          paymentAccount.sumToPay = paymentAccount.sumToPay ? paymentAccount.sumToPay : 0

          if(operationType === 'SUM') {
              paymentAccount.sumToPay = paymentAccount.sumToPay + sumOfPaymentDocs
          } else if(operationType === 'DEDUCT') {
            paymentAccount.sumToPay = paymentAccount.sumToPay - sumOfPaymentDocs
          }

          return await this.$api.paymentAccounts.save(paymentAccount)
        },

        async changeVnplOfPaymentAccounts(accIdOfPayer, accIdOfReceiver, sumOfPayment) {
          if(sumOfPayment === 0) {
            return
          }

          const searchCriterias = this.createCriteriasToFindTwoPaymentAccounts(accIdOfPayer, accIdOfReceiver)
          const response = await this.$api.paymentAccounts.findBySearchCriteriaList(searchCriterias)
          let paymentAccountOfPayer
          let paymentAccountOfReceiver

          if (!response) {
            return
          } else {
            paymentAccountOfPayer = response.find(el => el.acc.id === accIdOfPayer)
            paymentAccountOfReceiver = response.find(el => el.acc.id === accIdOfReceiver)
          }

          if(!paymentAccountOfPayer || !paymentAccountOfReceiver) {
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

          await this.$axios.$post(this.$api.payment.balanceOfPaymentAccount.getSaveAllUrl(), arrayOfPaymentAccountsForSave)
        },

        getConfigForDeleteMethods(){
          return {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        }
    }
})
