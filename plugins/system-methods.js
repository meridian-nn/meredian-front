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
            }
        },

        //Функция возвращает текущего пользователя
        getCurrentUser() {
            return this.$store.state.profile.user
        },

        //Функция проверяет, является ли текущий пользователь администратором
        //2 - id роли администратор
        isAdmin() {
            const currentUser = this.getCurrentUser()
            const rolesOfCurrentUser = currentUser.roles
            return rolesOfCurrentUser.find(item => item === 2) ? true : false
        },

        //Функция возвращает список ролей текущего пользователя из API
        async getRolesOfCurrentUser(id) {
            return await this.$api.auth.user.getRolesOfCurrentUser(id)
        }
    }
})