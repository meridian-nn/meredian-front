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

      async changeSumToPayOfPaymentAccount(accId, sumOfPaymentDocs, operationType) {
          if(sumOfPaymentDocs === 0) {
            return
          }

          const searchCriterias = this.createCriteriasToFindPaymentAccount(accId)
          const response = await this.$api.paymentAccounts.findBySearchCriteriaList(searchCriterias)
          let paymentAccount

          if(!response) {
            return
          } else {
            paymentAccount = response[0]
          }

          if(operationType === 'SUM') {
            if(paymentAccount.sumToPay){
              paymentAccount.sumToPay = paymentAccount.sumToPay + sumOfPaymentDocs
            } else {
              paymentAccount.sumToPay = sumOfPaymentDocs
            }
          } else if(operationType === 'DEDUCT') {
            paymentAccount.sumToPay = paymentAccount.sumToPay - sumOfPaymentDocs
          }

          return await this.$api.paymentAccounts.save(paymentAccount)
       }
    }
})
