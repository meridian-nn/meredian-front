<template>
  <div class="form-control">
    <div class="form-control__label">
      <slot name="label">
        {{ label }}
      </slot>
    </div>

    <div class="form-control__body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormControl',

  props: {
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
.form-control {
  display: flex;
  align-items: center;

  &__label {
    margin-right: 7px;
    color: rgba(0, 0, 0, 0.6);
    white-space: nowrap;
  }

  &__body {
    display: flex;
    align-items: center;
    flex-basis: 100%;
  }
}
</style>
