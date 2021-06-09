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

            if(rolesOfCurrentUser.length === 0) {
              return true
            }

            return !!rolesOfCurrentUser.find(role => role === 2)
        },

        //Функция возвращает список ролей текущего пользователя из API
        async getRolesOfCurrentUser(id) {
            return await this.$api.auth.user.getRolesOfCurrentUser(id)
        },

        //Функция проверяет наличие у пользователя роли для работы с АРМ "Реестр оплат"
        //5 - id роли "Бюджет - полный доступ"
        isHaveBudgetRole() {
            const currentUser = this.getCurrentUser()
            const rolesOfCurrentUser = currentUser.roles
            return !!rolesOfCurrentUser.find(role => role === 5)
        },

        //Функция проверяет наличие у пользователя роли для работы с АРМ "Маркировка"
        //1 - id роли "роль_Получение_GTIN_KM"
        isHaveGTINRole() {
            const currentUser = this.getCurrentUser()
            const rolesOfCurrentUser = currentUser.roles
            return !!rolesOfCurrentUser.find(role => role === 1)
        },

        //Функция проверяет наличие у пользователя роли для работы с АРМ "Снабжение"
        //8 - id роли "Снабжение - полный доступ"
        isHaveSupplyRole() {
            const currentUser = this.getCurrentUser()
            const rolesOfCurrentUser = currentUser.roles
            return !!rolesOfCurrentUser.find(role => role === 8)
        }
    }
})
