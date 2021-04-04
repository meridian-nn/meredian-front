<template>
  <v-list-item
    link
    v-bind:to="{ name: link }"
  >
    <v-list-item-action class="pr-1 pl-2 mr-1">
      <v-icon class="blue--text">
        {{ icon }}
      </v-icon>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title class="font-weight-medium">
        {{ title }}
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  props: ['title', 'link', 'icon']
}
</script>
