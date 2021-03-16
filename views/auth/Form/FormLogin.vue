<template>
  <v-card
    class="mt-0 pt-0"
    elevation="2"
  >
    <v-card-title class="blue darken-1">
      <img
        class="header__logo"
        style="max-width: 200px"
        src="~/assets/img/Logo.png"
        alt="logo"
      >
    </v-card-title>

    <v-card-text class="mt-10">
      <form @submit.prevent="submit">
        <v-layout
          row
          wrap
        >
          <v-flex
            xs12
            md4
          >
            <v-subheader>Логин</v-subheader>
          </v-flex>

          <v-flex
            xs12
            md8
          >
            <v-text-field
              v-model="form.email"
              :rules="loginRules"
              class="input-group--focused mr-2"
              name="email"
              label="email"
              value="Input text"
            />
          </v-flex>
        </v-layout>

        <v-layout
          row
          wrap
        >
          <v-flex
            xs12
            md4
          >
            <v-subheader>Пароль</v-subheader>
          </v-flex>
          <v-flex
            xs12
            md8
          >
            <v-text-field
              v-model="form.password"
              :rules="passwordRules"
              class="input-group--focused mr-2"
              name="password"
              type="password"
              label="password"
              value="Input text"
            />
          </v-flex>
        </v-layout>

        <v-card-actions>
          <v-btn
            elevation="4"
            block
            type="submit"
          >
            Войти
          </v-btn>
        </v-card-actions>

        <v-snackbar
          v-if="error"
          v-model="error"
          :timeout="timeout"
          :top="true"
          :multi-line="mode === 'multi-line'"
          :vertical="mode === 'vertical'"
        >
          {{ text }}
          <v-btn
            class="pink--text"
            text
          >
            Закрыть
          </v-btn>
        </v-snackbar>
      </form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'FormLogin',

  data() {
    return {
      form: {
        email: '',
        password: ''
      },

      passwordRules: [
        text => !!text || 'Пароль обязателен',
        text => text.length > 2 || 'Пароль  должен быть больше 2 символов'
      ],

      loginRules: [
        text => !!text || 'Логин обязателен',
        text => text.length > 2 || 'Логин должен быть больше 2 символов'
      ]
    }
  },

  methods: {
    async submit() {
      this.loading = true
      try {
        await this.$store.dispatch('auth/login', {
          login: this.login,
          password: this.password
        })
        this.$emit('handler')
      } catch (err) {
        this.error = true
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
