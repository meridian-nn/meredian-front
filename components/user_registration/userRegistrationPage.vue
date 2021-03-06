<template>
  <div
    name="UserRegistration"
    class="user-registration-main-div"
  >
    <v-row>
      <v-col cols="5">
        <v-text-field
          v-model="userInformation.fullName"
          label="Полное имя пользователя"
          outlined
          hide-details="auto"
        />
      </v-col>
      <v-col cols="7">
        <v-autocomplete
          v-model="userInformation.departmentId"
          label="Подразделение"
          :loading="loadingType.departments"
          :items="departments"
          item-value="id"
          item-text="nameViddoc"
          outlined
          hide-details="auto"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="5">
        <v-text-field
          v-model="userInformation.login"
          label="Логин пользователя"
          outlined
          hide-details="auto"
        />
      </v-col>

      <v-col cols="7">
        <v-text-field
          v-model="userInformation.password"
          label="Пароль пользователя"
          outlined
          hide-details="auto"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="5">
        <v-text-field
          v-model="userInformation.position"
          label="Должность пользователя"
          outlined
          hide-details="auto"
        />
      </v-col>

      <v-col cols="7">
        <v-text-field
          v-model="userInformation.email"
          label="Email пользователя"
          outlined
          hide-details="auto"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="5">
        <v-text-field
          v-model="userInformation.phone"
          label="Телефон пользователя"
          outlined
          hide-details="auto"
        />
      </v-col>
      <v-col cols="7">
        <v-text-field
          v-model="userInformation.organization"
          label="Организация пользователя"
          outlined
          hide-details="auto"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-btn
        color="blue darken-1"
        text
        @click="saveNewUser"
      >
        Сохранить
      </v-btn>
      <v-spacer />
    </v-row>

    <user-notification ref="userNotification" />
  </div>
</template>

<script>
import UserNotification from '@/components/information_window/UserNotification'

export default {
  name: 'UserRegistration',

  components: {
    UserNotification
  },

  data() {
    return {
      userInformation: {},
      departments: [],
      loadingType: {}
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    async init() {
      await this.findDepartments()
    },

    async findDepartments() {
      this.loadingType.departments = true
      this.departments = await this.$api.budgetElements.findDepartments()
      this.loadingType.departments = null
    },

    async saveNewUser() {
      if (!this.checkNewUserParams()) {
        return
      }

      if (!await this.isLoginAvailable()) {
        this.$refs.userNotification.showUserNotification('error', 'Указанный логин уже привязан к другой учетной записи! Укажите другой!')
        return
      }

      this.userInformation.enabled = true
      this.userInformation.id = null

      this.addRolesForNewUser()

      await this.$api.auth.user.saveNewUser(this.userInformation)

      this.$refs.userNotification.showUserNotification('success', 'Новый пользователь создан')
      this.resetUserInformation()
    },

    async isLoginAvailable() {
      const criteriaForRequest = this.createCriteriaToSearchUserByLogin(this.userInformation.login)
      const response = await this.$api.auth.users.findBySearchCriteria(criteriaForRequest)
      return response.length === 0
    },

    checkNewUserParams() {
      if (!this.userInformation.login) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите логин нового пользователя')
        return false
      } else if (!this.userInformation.fullName) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите полное имя нового пользователя')
        return false
      } else if (!this.userInformation.password) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите пароль нового пользователя')
        return false
      } else if (!this.userInformation.email) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите email нового пользователя')
        return false
      } else if (!this.userInformation.position) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите должность нового пользователя')
        return false
      } else if (!this.userInformation.phone) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите телефон нового пользователя')
        return false
      } else if (!this.userInformation.organization) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите организацию, в которой работает новый пользователь')
        return false
      } else if (!this.userInformation.departmentId) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите подразделение пользователя')
        return false
      }

      return true
    },

    addRolesForNewUser() {
      this.userInformation.roles = []
      this.userInformation.roles.push(7)
    },

    resetUserInformation() {
      this.userInformation = {}
    }
  }
}
</script>

<style lang="scss">
.user-registration-main-div{
    margin:20px
}
</style>
