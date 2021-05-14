<template>
  <div
    name="PaymentMenu"
    class="payment-menu"
  >
    <v-row>
      <div class="payment-menu-col-3" />

      <div class="payment-menu-col-2">
        <router-link :to="{ name: 'JournalOfPaymentDocuments' }">
          <v-img :src="require('@/assets/img/journal3.png')" />
        </router-link>
        <div
          class="payment-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Журнал документов на оплату
        </div>
      </div>

      <div class="payment-menu-col-2">
        <router-link :to="{ name: 'PaymentBudgetByDepartments' }">
          <v-img :src="require('@/assets/img/budget2.png')" />
        </router-link>
        <div
          class="payment-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Бюджет оплат по подразделениям
        </div>
      </div>

      <div class="payment-menu-col-2">
        <router-link :to="{ name: 'JournalOfEmailSendingPaymentDocuments' }">
          <v-img :src="require('@/assets/img/email2.png')" />
        </router-link>
        <div
          class="payment-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Журнал рассылки на email документов на оплату
        </div>
      </div>

      <div class="payment-menu-col-2">
        <router-link to="/meridian/money_distribution">
          <v-img :src="require('@/assets/img/distribution2.png')" />
        </router-link>
        <div
          class="payment-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Распределение денежных средств
        </div>
      </div>

      <div class="payment-menu-col-2">
        <router-link to="/meridian/input_of_balances">
          <v-img :src="require('@/assets/img/bank_acc2.png')" />
        </router-link>
        <div
          class="payment-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Ввод остатков по Р/С
        </div>
      </div>

      <div class="payment-menu-col-2">
        <router-link to="/meridian/history_of_payment_documents">
          <v-img :src="require('@/assets/img/history2.png')" />
        </router-link>
        <div
          class="payment-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Журнал документов на оплату (История)
        </div>
      </div>

      <div class="payment-menu-col-2">
        <router-link to="/meridian/register_of_documents_to_pay">
          <v-img :src="require('@/assets/img/registry.png')" />
        </router-link>
        <div
          class="payment-menu-v-subheader font-weight-medium text-subtitle-1"
          align="center"
        >
          Реестр документов к оплате
        </div>
      </div>

      <div class="payment-menu-col-3" />
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'PaymentMenu',
  data() {
    return {}
  }
}
</script>

<style lang="scss">
.payment-menu{
  margin: 20px
}

.payment-menu-col-2 {
    flex: 0 0 10%;
    max-width: 10%;
}

.payment-menu-col-3 {
    flex: 0 0 15%;
    max-width: 15%;
}

.payment-menu-v-subheader {
    display: flex;
    height: 48px;
    font-size: 0.875rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    padding: 0 16px 0 16px;
}
</style>
