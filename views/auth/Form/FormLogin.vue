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
              v-model="form.username"
              :rules="loginRules"
              class="input-group--focused mr-2"
              :error-messages="error ? ['Не верный логин или пароль'] : null"
              name="email"
              label="email"
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
            />
          </v-flex>
        </v-layout>

        <v-card-actions>
          <v-btn
            elevation="4"
            block
            :loading="loading"
            type="submit"
          >
            Войти
          </v-btn>
        </v-card-actions>
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
        username: '',
        password: ''
      },

      error: false,
      loading: false,

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
        await this.$store.dispatch('auth/login', this.form)

        window.location.reload()
      } catch (err) {
        this.error = true
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
