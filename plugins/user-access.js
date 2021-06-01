/* eslint-disable */
// Плагин для работы с ролями пользователей
import Vue from 'vue'
Vue.mixin({
    methods: {
        //Функция возвращает текущего пользователя
        getCurrentUser() {
            return this.$store.state.profile.user
        },

        //Функция проверяет, является ли текущий пользователь администратором
        //2 - id роли администратор
        isAdmin() {
            const currentUser = this.getCurrentUser()
            const rolesOfCurrentUser = currentUser.roles
            return rolesOfCurrentUser.find(role => role === 2) ? true : false
        },

        //Функция возвращает список ролей текущего пользователя из API
        async getRolesOfCurrentUser(id) {
            return await this.$api.auth.user.getRolesOfCurrentUser(id)
        },

        //Функция проверяет наличие у пользователя роли для работы с АРМ "Реестр оплат"
        //5 - id роли "Бюджет - полный доступ" 
        isHaveBudgetRole() {
            if (this.isAdmin()) {
                return true
            }

            const currentUser = this.getCurrentUser()
            const rolesOfCurrentUser = currentUser.roles
            return rolesOfCurrentUser.find(role => role === 5) ? true : false
        },

        //Функция проверяет наличие у пользователя роли для работы с АРМ "Маркировка"
        //1 - id роли "роль_Получение_GTIN_KM" 
        isHaveGTINRole() {
            if (this.isAdmin()) {
                return true
            }

            const currentUser = this.getCurrentUser()
            const rolesOfCurrentUser = currentUser.roles
            return rolesOfCurrentUser.find(role => role === 1) ? true : false
        }
    }
})