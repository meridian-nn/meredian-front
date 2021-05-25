<template>
  <div class="journal-of-payment-docs-main-div">
    <journalOfPaymentDocumentsTables />
  </div>
</template>

<script>
import JournalOfPaymentDocumentsTables from './components/DocumentsTables'

export default {
  name: 'PaymentDocument',
  components: {
    JournalOfPaymentDocumentsTables
  },
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {}
  }
}
</script>

<style lang="scss">
.journal-of-payment-docs-main-div {
  padding: 10px
}
</style>
