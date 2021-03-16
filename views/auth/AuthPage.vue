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

  middleware: 'auth-redirect'
}
</script>
