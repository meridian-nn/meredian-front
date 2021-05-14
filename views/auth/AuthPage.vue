<template>
  <v-container
    fill-height
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm6
      md4
      lg3
    >
      <router-view />
    </v-flex>
  </v-container>
</template>

<script>
export default {
  name: 'AuthPage',

  layout: 'auth',

  middleware: 'auth-redirect',

  mounted() {
    this.submit()
  },

  methods: {
    async submit() {
      this.loading = true
      try {
        /* await this.$store.dispatch('/meridian/auth/findByCurrentLogin', {
          login: this.form.email,
          password: this.form.password
        })
        this.$emit('handler') */

        await this.$auth.loginWith('local').then(() => {
          console.log('auth success!')
        }).catch(() => {
          console.log('auth error')
        })
      } catch (err) {
        console.log('auth error')
      } finally {
        console.log('auth success!')
      }
    }
  }
}
</script>
