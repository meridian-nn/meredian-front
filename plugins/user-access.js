// Плагин для работы с ролями пользователей
import Vue from 'vue'
Vue.mixin({
  computed: {

    // Функция возвращает текущего пользователя со всей доп информацией (подразделение, организация, логин и т.д.)
    getCurrentUser() {
      return this.$store.state.profile.user
    },

    // Функция проверяет, является ли текущий пользователь администратором
    // 2 - id роли администратор
    isAdmin() {
      const rolesOfCurrentUser = this.getCurrentUser.roles

      if (rolesOfCurrentUser.length === 0) {
        return true
      }

      return rolesOfCurrentUser.includes(2)
    },

    // Функция проверяет, имеет ли текущий пользователь доступ к меню реестра оплат
    isCanOpenPaymentRegister() {
      return this.isHaveBudgetRole || this.isHaveJournalRole
    },

    // Функция проверяет наличие у пользователя роли для работы с АРМ "Реестр оплат"
    // 5 - id роли "Бюджет - полный доступ"
    isHaveBudgetRole() {
      return this.getCurrentUser.roles.includes(5)
    },

    // Функция проверяет наличие у пользователя роли для работы с формой "Журнал документов на оплату" АРМ "Реестр оплат"
    // 9 - id роли "Бюджет - журнал документов"
    isHaveJournalRole() {
      return this.getCurrentUser.roles.includes(9)
    },

    // Функция проверяет наличие у пользователя роли для работы с АРМ "Маркировка"
    // 1 - id роли "роль_Получение_GTIN_KM"
    isHaveGTINRole() {
      return this.getCurrentUser.roles.includes(1)
    },

    // Функция проверяет наличие у пользователя роли для работы с АРМ "Снабжение"
    // 8 - id роли "Снабжение - полный доступ"
    isHaveSupplyRole() {
      return this.getCurrentUser.roles.includes(8)
    },

    // Функция проверяет наличие у пользователя роли для работы с АРМ "Технологии производства"
    // 11 - id роли "Производство - полный доступ"
    isHaveTechnologyOfProductionRole() {
      return this.getCurrentUser.roles.includes(11)
    }
  },
  methods: {
    // Функция возвращает список ролей текущего пользователя из API
    async getRolesOfCurrentUser(id) {
      return await this.$api.auth.user.getRolesOfCurrentUser(id)
    }

  }
})
