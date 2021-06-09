<template>
  <div
    name="CurrentUserEditingPage"
    class="current-user-editing-main-div"
  >
    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="userInformation.fullName"
          label="Полное имя пользователя"
          outlined
          hide-details="auto"
        />
      </v-col>

      <v-col cols="6">
        <v-text-field
          v-model="userPassword"
          label="Пароль пользователя"
          outlined
          hide-details="auto"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4">
        <v-text-field
          v-model="userInformation.email"
          label="Email пользователя"
          outlined
          hide-details="auto"
        />
      </v-col>

      <v-col cols="4">
        <v-text-field
          v-model="userInformation.phone"
          label="Телефон пользователя"
          outlined
          hide-details="auto"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4">
        <v-text-field
          v-model="userInformation.position"
          label="Должность пользователя"
          outlined
          hide-details="auto"
          readonly
        />
      </v-col>

      <v-col cols="4">
        <v-text-field
          v-model="userInformation.organization"
          label="Должность пользователя"
          outlined
          hide-details="auto"
          readonly
        />
      </v-col>
    </v-row>

    <v-row>
      <div id="rolesOfCurrentUserDataTable">
        <v-client-table
          v-model="rolesOfCurrentUserDataTable"
          :columns="rolesOfCurrentUserColumns"
          :options="rolesOfCurrentUserOptions"
          aria-readonly="true"
        >
          <v-simple-checkbox
            slot="isHave"
            v-model="row.isHave"
            slot-scope="{row}"
            aria-readonly="true"
          />
        </v-client-table>
      </div>
    </v-row>

    <v-row>
      <v-btn
        color="blue darken-1"
        text
        @click="saveCurrentUser"
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
  name: 'CurrentUserEditingPage',

  components: {
    UserNotification
  },

  data() {
    return {
      userInformation: {},
      currentUser: {},
      userPassword: '',

      // таблица данных по ролям сотрудников
      rolesOfCurrentUserDataTable: [],
      rolesOfCurrentUserColumns: ['isHave', 'name'],
      rolesOfCurrentUserOptions: {
        filterable: false,
        pagination: { show: false },
        texts: { noResults: '' },
        filterByColumn: false,
        editableColumns: ['isHave'],
        headings: {
          isHave: 'Есть у пользователя',
          name: 'Имя роли'
        }
      }
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.findInfoAboutCurrentUser()
    },

    findInfoAboutCurrentUser() {
      this.currentUser = this.getCurrentUser()

      this.userInformation = {
        id: this.currentUser.id,
        fullName: this.currentUser.fullName,
        login: this.currentUser.login,
        password: this.currentUser.password,
        email: this.currentUser.email,
        phone: this.currentUser.phone,
        organization: this.currentUser.organization,
        position: this.currentUser.position,
        enabled: true,
        roles: this.currentUser.roles
      }

      this.findRolesOfCurrentUser()
    },

    async findRolesOfCurrentUser() {
      this.rolesOfCurrentUserDataTable = []
      const response = await this.$api.auth.users.getRoles()
      this.rolesOfCurrentUserDataTable = this.convertListOfRolesResponseToListOfUserRoles(response, this.userInformation.id)
    },

    async saveCurrentUser() {
      if (!this.userInformation) {
        return
      }

      if (!this.userPassword) {
        this.$refs.userNotification.showUserNotification('warning', 'Для сохранения изменений, введите Ваш текущий пароль или новый пароль')
        return
      } else {
        this.userInformation.password = this.userPassword
      }

      await this.$api.auth.user.editUser(this.userInformation)

      this.$refs.userNotification.showUserNotification('success', 'Профиль был изменен')
      this.userPassword = ''
    }

  }
}
</script>

<style lang="scss">
.current-user-editing-main-div{
  margin:20px
 }

#rolesOfCurrentUserDataTable {
  border-collapse: collapse;
  width: 100%;
}
#rolesOfCurrentUserDataTable table{
  width: 100%
}
#rolesOfCurrentUserDataTable td, #rolesOfCurrentUserDataTable th {
  border: 1px solid #ddd;
}

#rolesOfCurrentUserDataTable tr:nth-child(even){background-color: #f2f2f2;}

#rolesOfCurrentUserDataTable tr:hover {background-color: #ddd;}

#rolesOfCurrentUserDataTable th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}
</style>
