<template>
  <div class="role-edit-page">
    <div class="role-edit-page__head">
      <v-btn
        color="primary"
        @click="openModalCreate"
      >
        Создать роль
      </v-btn>
    </div>

    <v-expansion-panels accordion>
      <v-expansion-panel
        v-for="(role, i) in roles"
        :key="i"
      >
        <v-expansion-panel-header>
          <div class="subtitle-1">
            {{ role.name }}
          </div>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <v-virtual-scroll
            :items="privileges"
            height="300"
            item-height="24"
          >
            <template #default="{ item }">
              <v-checkbox
                v-model="role.privileges"
                :label="item.description"
                :value="item.id"
                @change="saveRolePrivileges(privilegesObject[i])"
              />
            </template>
          </v-virtual-scroll>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <user-notification ref="userNotification" />

    <create-role
      :value="modal.createRole"
      :privileges="privileges"
      @close="closeModalCreate"
      @save="createRole"
    />
  </div>
</template>

<script>
import UserNotification from '@/components/information_window/UserNotification'
import CreateRole from './modals/CreateRole.vue'
export default {
  name: 'RoleEditPage',

  components: {
    UserNotification,
    CreateRole
  },

  async asyncData({ $api }) {
    const [roles, privileges] = await Promise.all([
      $api.auth.role.get(),
      $api.auth.privilege.get()
    ])

    return { roles, privileges }
  },

  data() {
    return {
      modal: {
        createRole: false
      }
    }
  },

  computed: {
    privilegesObject() {
      return this.roles.map((e) => {
        return {
          ...e,
          privileges: e.privileges.map((i) => {
            return { id: i }
          }),
          users: e.users.map((i) => {
            return { id: i }
          })
        }
      })
    }
  },

  methods: {
    openModalCreate() {
      this.modal.createRole = true
    },

    closeModalCreate() {
      this.modal.createRole = false
    },

    async createRole(form) {
      try {
        await this.saveRolePrivileges(form)

        this.getRoles()

        this.closeModalCreate()
      } catch (e) {
        console.error(e)
      }
    },

    async saveRolePrivileges(roles) {
      try {
        await this.$api.auth.role.save(roles)
      } catch (e) {
        this.$refs.userNotification.showUserNotification('error', 'Ошибка сервера. Поробуйте позже')
        console.error(e)
      }
    },

    async getRoles() {
      this.roles = await this.$api.auth.role.get()
    }
  }
}
</script>

<style lang="scss">
.role-edit-page {
  padding: 20px 120px 20px 20px;

  .v-input--selection-controls {
    margin-top: 0 !important;
  }

  .v-input__slot {
    margin-bottom: 0;
  }

  &__head {
    margin-bottom: 15px;
  }
}
</style>
