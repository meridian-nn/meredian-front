<template>
  <div class="journal-of-payment-docs-main-div">
    <journalOfPaymentDocumentHeader />
    <journalOfPaymentDocumentsTables />
  </div>
</template>

<script>
import JournalOfPaymentDocumentHeader from './components/Header'
import JournalOfPaymentDocumentsTables from './components/DocumentsTables'

export default {
  axiosConfig: {
    auth: {
    }
  },
  name: 'PaymentDocument',
  components: {
    JournalOfPaymentDocumentHeader,
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
