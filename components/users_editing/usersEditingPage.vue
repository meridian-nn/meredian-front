<template>
  <div
    name="users-editing-main-div"
    class="users-editing-main-div"
  >
    <div class="users-editing-row">
      <div id="usersDataTable">
        <v-client-table
          v-model="usersDataTable"
          :columns="usersColumns"
          :options="usersOptions"
          @row-click="userChosenEvent"
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
          v-model="rolesOfChosenUserDataTable"
          :columns="rolesOfChosenUserColumns"
          :options="rolesOfChosenUserOptions"
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
        Сохранить права
      </v-btn>
      <v-spacer />
    </div>

    <div v-if="currentUser">
      <span class="users-editing-headline"> Выбор организации с расчетным счетом по умолчанию для отображения на форме "Журнал документов на оплату" </span>
      <div
        class="users-editing-row"
      >
        <v-col cols="6">
          <v-autocomplete
            v-model="selectedOrganization"
            label="Организация по умолчанию в журнале документов"
            :loading="loadingType.organizations"
            :items="organizations"
            item-value="id"
            item-text="clName"
            hide-details="auto"
            @change="organizationChange"
          />
        </v-col>

        <v-col cols="6">
          <v-autocomplete
            v-model="selectedAccount"
            label="Расч. счёт организации по умолчанию в журнале документов"
            :loading="loadingType.paymentAccounts"
            :items="paymentAccounts"
            item-value="id"
            item-text="shortName"
            hide-details="auto"
          />
        </v-col>
      </div>

      <div class="users-editing-row">
        <v-btn
          color="blue darken-1"
          text
          @click="saveOrganizationWithAccountForUi"
        >
          Сохранить настройки
        </v-btn>
        <v-spacer />
      </div>
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
      rolesOfChosenUserDataTable: [],
      rolesOfChosenUserColumns: ['isHave', 'name'],
      rolesOfChosenUserOptions: {
        filterable: false,
        pagination: { show: false },
        texts: { noResults: '' },
        filterByColumn: false,
        editableColumns: ['isHave'],
        headings: {
          /* isHave(h) {
            return h('h1', {
              style: {
                color: 'red',
                fontSize: '14px'
              }
            }, 'test')
          }, */
          isHave: 'Есть у пользователя',
          name: 'Имя роли'
        }
      },

      // Выбранный администратором пользователь для отображения на форме
      currentUser: '',

      currentUserId: null,

      // Список измененных пользователей
      changedUsers: [],

      loadingType: {},

      organizations: [],

      selectedOrganization: null,

      paymentAccounts: [],

      selectedAccount: null,

      elementIdOfDefaultOrgAndAccForUISetting: null,

      formIdOfOrgAndAccForUISetting: null
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.getValuesForFormIdAndElementIdOfDefaultOrgAndAccIds()
      this.findUsersAccounts()
      this.findOrganizations()
    },

    getValuesForFormIdAndElementIdOfDefaultOrgAndAccIds() {
      const formAndElementIds = this.getObjectWithFormIdAndElementIdForDefaultOrgAndAcc()
      this.formIdOfOrgAndAccForUISetting = formAndElementIds.formId
      this.elementIdOfDefaultOrgAndAccForUISetting = formAndElementIds.elementId
    },

    async findUsersAccounts() {
      const response = await this.$api.auth.users.get()
      this.usersDataTable = response
    },

    async findOrganizations() {
      this.loadingType.organizations = true
      this.organizations = await this.getBudgetOrganizations()
      this.loadingType.organizations = null
    },

    async organizationChange(selectedOrgId) {
      this.selectedAccount = null
      await this.findPaymentAccounts(selectedOrgId)
      this.selectFirstPaymentAccount()
    },

    async findPaymentAccounts(selectedOrgId) {
      this.loadingType.paymentAccounts = true

      const data = {
        orgId: selectedOrgId
      }
      let paymentAccounts = await this.$api.paymentAccounts.findAccByOrgId(data)
      paymentAccounts = paymentAccounts.sort(this.customCompare('shortName'))
      paymentAccounts.forEach((account) => {
        account.shortName = account.shortName + ' - ' + account.numAcc.slice(account.numAcc.length - 4)
      })

      this.paymentAccounts = paymentAccounts

      this.loadingType.paymentAccounts = null
    },

    selectFirstPaymentAccount() {
      if (!this.paymentAccounts) {
        return
      }

      this.selectedAccount = this.paymentAccounts[0].id
    },

    userChosenEvent(user) {
      this.selectedOrganization = null
      this.selectedAccount = null
      this.findRolesOfChosenUser(user)
      this.findDefaultOrgAndAccIdForUser(user.row.id)
    },

    async findDefaultOrgAndAccIdForUser(userId) {
      const dataForFiltersQuery = this.createCriteriasToSearchForFiltersValues(this.formIdOfOrgAndAccForUISetting,
        this.elementIdOfDefaultOrgAndAccForUISetting, userId)
      const response = await this.$api.uiSettings.findBySearchCriterias(dataForFiltersQuery)
      let filtersParams

      if (response.length) {
        filtersParams = JSON.parse(response[0].settingValue)
        this.selectedOrganization = filtersParams.orgId
        this.selectedAccount = filtersParams.accId
        await this.findPaymentAccounts(this.selectedOrganization)
      }
    },

    async findRolesOfChosenUser(user) {
      if (this.currentUserId && this.currentUserId === user.row.id) {
        return
      }

      this.rolesOfChosenUserDataTable = []
      this.currentUserId = user.row.id
      this.currentUser = 'Выбран пользователь - ' + user.row.fullName
      const response = await this.$api.auth.users.getRoles()
      this.rolesOfChosenUserDataTable = this.convertListOfRolesResponseToListOfUserRoles(response, user.row.id)
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

    async saveChanges() {
      if (!this.currentUserId) {
        return
      }

      const userResponse = await this.$api.auth.user.findById(this.currentUserId)
      if (!userResponse) {
        return
      }
      const rolesOfUser = []

      for (const role of this.rolesOfChosenUserDataTable) {
        if (role.isHave) {
          rolesOfUser.push({
            id: role.id
          })
        }
      }

      userResponse.roles = rolesOfUser
      await this.$api.auth.user.saveUser(userResponse)

      this.$refs.userNotification.showUserNotification('success', 'Права сохранены!')
    },

    async saveOrganizationWithAccountForUi() {
      const uiSettingsValues = {
        orgId: this.selectedOrganization,
        accId: this.selectedAccount
      }

      const filterEntityForSave = this.createFilterEntityForSave(
        this.elementIdOfDefaultOrgAndAccForUISetting, this.formIdOfOrgAndAccForUISetting, uiSettingsValues,
        this.currentUserId, this.getCurrentUser.id)

      await this.$api.uiSettings.save(filterEntityForSave)

      this.$refs.userNotification.showUserNotification('success', 'Настройки интерфейса для пользователя сохранены!')
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
