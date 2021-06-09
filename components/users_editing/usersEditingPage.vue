<template>
  <div
    name="users-editing-main-div"
    class="users-editing-main-div"
  >
    <span class="headline"> Данная форма пока не работает! </span>
    <div class="users-editing-row">
      <div id="usersDataTable">
        <v-client-table
          v-model="usersDataTable"
          :columns="usersColumns"
          :options="usersOptions"
          @row-click="findRolesOfChosenUser"
        >
          <v-simple-checkbox
            slot="enabled"
            v-model="row.enabled"
            slot-scope="{row, update}"
            @input="update(row.enabled); putUserChangesIntoArrayOfChangedUsers(row)"
          />
        </v-client-table>
      </div>
    </div>

    <span class="users-editing-headline"> {{ currentUser }} </span>

    <div class="users-editing-row">
      <div id="rolesOfCurrentUserDataTable">
        <v-client-table
          v-model="rolesOfUsersDataTable"
          :columns="rolesOfUsersColumns"
          :options="rolesOfUsersOptions"
        >
          <v-simple-checkbox
            slot="isHave"
            v-model="row.isHave"
            slot-scope="{row, update}"
            @input="update(row.isHave); putRoleChangesIntoArrayOfChangedUsers(row)"
          />
        </v-client-table>
      </div>
    </div>

    <div class="users-editing-row">
      <v-btn
        color="blue darken-1"
        text
        @click="saveChanges"
      >
        Сохранить
      </v-btn>
      <v-spacer />
    </div>
    <user-notification ref="userNotification" />
  </div>
</template>

<script>
import UserNotification from '@/components/information_window/UserNotification'

export default {
  name: 'UsersEditing',

  components: {
    UserNotification
  },

  data() {
    return {
      // таблица данных по аккаунтам сотрудников
      usersDataTable: [],
      usersColumns: ['fullName', 'login', 'position', 'organization', 'phone', 'email', 'enabled'],
      usersOptions: {
        filterable: false,
        pagination: { show: false },
        texts: { noResults: '' },
        filterByColumn: false,
        editableColumns: ['enabled'],
        headings: {
          fullName: 'Полное имя сотрудника',
          login: 'Логин пользователя',
          position: 'Должность',
          organization: 'Организация',
          phone: 'Телефон',
          email: 'E-mail',
          enabled: 'Аккаунт доступен'
        }
      },

      // таблица данных по ролям сотрудников
      rolesOfUsersDataTable: [],
      rolesOfUsersColumns: ['isHave', 'name'],
      rolesOfUsersOptions: {
        filterable: false,
        pagination: { show: false },
        texts: { noResults: '' },
        filterByColumn: false,
        editableColumns: ['isHave'],
        headings: {
          isHave: 'Есть у пользователя',
          name: 'Имя роли'
        }
      },

      // Выбранный администратором пользователь для отображения на форме
      currentUser: '',

      currentUserId: null,

      // Список измененных пользователей
      changedUsers: []
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.findUsersAccounts()
    },

    async findUsersAccounts() {
      const response = await this.$api.auth.users.get()
      this.usersDataTable = response
    },

    async findRolesOfChosenUser(user) {
      if (this.currentUserId && this.currentUserId === user.row.id) {
        return
      }

      this.rolesOfUsersDataTable = []
      this.currentUserId = user.row.id
      this.currentUser = 'Выбран пользователь - ' + user.row.fullName
      const response = await this.$api.auth.users.getRoles()
      this.rolesOfUsersDataTable = this.convertListOfRolesResponseToListOfUserRoles(response, user.row.id)
    },

    putUserChangesIntoArrayOfChangedUsers(user) {
      const rowInArrayOfChanges = this.changedUsers.find(row => row.userId === user.id)

      if (rowInArrayOfChanges) {
        rowInArrayOfChanges.enabled = !rowInArrayOfChanges.enabled
      } else {
        const newRowForArrayOfChanges = {
          userId: user.id,
          enabled: user.enabled,
          arrayOfRoles: []
        }

        this.changedUsers.push(newRowForArrayOfChanges)
      }
    },

    putRoleChangesIntoArrayOfChangedUsers(role) {
      if (!this.currentUserId) {
        return
      }

      const rowInArrayOfChanges = this.changedUsers.find(row => row.userId === this.currentUserId)

      if (rowInArrayOfChanges) {
        const roleOfUser = rowInArrayOfChanges.arrayOfRoles.find(row => row.idOfRole === role.id)

        if (roleOfUser) {
          roleOfUser.isHave = role.isHave
        } else {
          const newRoleOfUser = {
            idOfRole: role.id,
            isHave: role.isHave
          }
          rowInArrayOfChanges.arrayOfRoles.push(newRoleOfUser)
        }
      } else {
        const newRowForArrayOfChanges = {
          userId: this.currentUserId,
          enabled: null,
          arrayOfRoles: []
        }

        const newRoleOfUser = {
          idOfRole: role.id,
          isHave: role.isHave
        }
        newRowForArrayOfChanges.arrayOfRoles.push(newRoleOfUser)
        this.changedUsers.push(newRowForArrayOfChanges)
      }
    },

    saveChanges() {
      this.$refs.userNotification.showUserNotification('success', 'Ничего не произошло!')
    }
  }
}
</script>

<style lang="scss">
.users-editing-main-div{
    margin: 20px;
}

.users-editing-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  min-width: 100%;
}

#usersDataTable {
  border-collapse: collapse;
  width: 100%;
}
#usersDataTable table{
  width: 100%
}
#usersDataTable td, #usersDataTable th {
  border: 1px solid #ddd;
}

#usersDataTable tr:nth-child(even){background-color: #f2f2f2;}

#usersDataTable tr:hover {background-color: #ddd;}

#usersDataTable th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
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

.users-editing-headline {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1.5rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
}
</style>
