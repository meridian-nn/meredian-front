/* eslint-disable */
// Плагин c разными системными методами
import Vue from 'vue'
Vue.mixin({
    methods: {
        //Функция возвращает id таблицы "Документы на оплату" формы "Журнал документов на оплату"
        getIdOfFromPayDocsTableOfJournalOfPaymentDocs() {
            return 'journal-of-payment-docs-from-pay-docs'
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
        }
    }
})
