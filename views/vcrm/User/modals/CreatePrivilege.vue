<template>
  <v-dialog
    :value="value"
    width="600"
    @input="$emit('close')"
  >
    <v-card class="user-create-privilege">
      <v-card-title>
        <span class="headline">Создание привилегии</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="$v.newPrivilege.name.$model"
                :error="$v.newPrivilege.name.$error"
                label="Url привелегии"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="$v.newPrivilege.description.$model"
                :error="$v.newPrivilege.description.$error"
                label="Описание"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-autocomplete
                v-model="$v.newPrivilege.appGroup.$model"
                :error="$v.newPrivilege.appGroup.$error"
                label="Группа"
                :items="appGroups"
                no-data-text="Список пуст"
                hide-details="auto"
                outlined
              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="$v.newPrivilege.privilegeAction.$model"
                :error="$v.newPrivilege.privilegeAction.$error"
                label="Действие"
                :items="privilegeActions"
                no-data-text="Список пуст"
                hide-details="auto"
                outlined
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="blue darken-1"
          text
          @click="save"
        >
          Сохранить
        </v-btn>

        <v-btn
          color="blue darken-1"
          text
          @click="cancel"
        >
          Отмена
        </v-btn>
      </v-card-actions>
    </v-card>

    <user-notification ref="userNotification" />
  </v-dialog>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import UserNotification from '@/components/information_window/UserNotification'
export default {
  name: 'CreatePrivilege',

  components: {
    UserNotification
  },

  validations: {
    newPrivilege: {
      name: { required },
      description: { required },
      appGroup: { required },
      privilegeAction: { required }
    }
  },

  props: {
    value: {
      required: true,
      validator: () => true
    }
  },

  data() {
    return {
      newPrivilege: {
        name: '',
        description: '',
        appGroup: '',
        privilegeAction: ''
      },

      appGroups: [
        'GTIN',
        'AUTHENTIFICATION',
        'DIRECTORY',
        'BUDGET',
        'SNAB',
        'CONTRACT',
        'PRODUCTION'
      ],

      privilegeActions: [
        'READ'
      ]
    }
  },

  computed: {
    newPrivilegeObject() {
      return {
        ...this.newPrivilege
      }
    }
  },

  methods: {
    save() {
      try {
        this.$v.$touch()
        if (this.$v.$invalid) {
          this.$refs.userNotification.showUserNotification('error', 'Заполните основные поля!')
          return
        }
        this.$emit('save', this.newPrivilegeObject)
      } catch (e) {
        console.error(e)
      }
    },

    cancel() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.user-create-privilege {
  .v-input--selection-controls {
    margin-top: 0 !important;
  }

  .v-input__slot {
    margin-bottom: 0;
  }
}
</style>
