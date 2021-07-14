<template>
  <v-dialog
    :value="value"
    width="600"
    @input="$emit('close')"
  >
    <v-card class="user-create-role">
      <v-card-title>
        <span class="headline">Создание роли</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="$v.form.name.$model"
                :error="$v.form.name.$error"
                label="Название роли"
              />
            </v-col>

            <v-col cols="12">
              <v-virtual-scroll
                :items="privileges"
                height="300"
                item-height="24"
              >
                <template #default="{ item }">
                  <v-checkbox
                    v-model="form.privileges"
                    :label="item.description"
                    :value="item.id"
                  />
                </template>
              </v-virtual-scroll>
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
  </v-dialog>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  name: 'CreateRole',

  validations: {
    form: {
      name: { required }
    }
  },

  props: {
    value: {
      required: true,
      validator: () => true
    },

    privileges: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      form: {
        name: '',
        privileges: []
      }
    }
  },

  computed: {
    formObject() {
      return {
        ...this.form,
        privileges: this.form.privileges.map((i) => {
          return { id: i }
        })
      }
    }
  },

  methods: {
    save() {
      try {
        this.$v.$touch()

        this.$emit('save', this.formObject)
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
.user-create-role {
  .v-input--selection-controls {
    margin-top: 0 !important;
  }

  .v-input__slot {
    margin-bottom: 0;
  }
}
</style>
