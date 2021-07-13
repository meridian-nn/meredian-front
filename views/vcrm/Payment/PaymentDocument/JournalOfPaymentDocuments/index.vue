<template>
  <div class="journal-of-payment-docs-main-div">
    <journalOfPaymentDocumentsTables v-if="isHaveBudgetRole" />
    <from-pay-documents v-else-if="isHaveJournalRole" />
  </div>
</template>

<script>
import FromPayDocuments from '@/views/vcrm/Payment/PaymentDocument/JournalOfPaymentDocuments/components/fromPayDocuments'
import JournalOfPaymentDocumentsTables from './components/DocumentsTables'

export default {
  name: 'PaymentDocument',
  components: {
    JournalOfPaymentDocumentsTables,
    FromPayDocuments
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
