<template>
  <div
    name="PaymentMenu"
    class="payment-menu"
  >
    <v-row>
      <div class="payment-menu-col-3" />

      <div class="payment-menu-col-2">
        <router-link to="/meridian/journal_of_payment_documents">
          <v-img :src="require('@/assets/img/journal3.png')" />
        </router-link>
        <v-subheader
          class="font-weight-medium text-subtitle-1"
          align="center"
        >
          Журнал документов на оплату
        </v-subheader>
      </div>

      <div class="payment-menu-col-2">
        <router-link to="/meridian/payment_budget_by_departmens">
          <v-img :src="require('@/assets/img/budget2.png')" />
        </router-link>
        <v-subheader
          class="font-weight-medium text-subtitle-1"
          align="center"
        >
          Бюджет оплат по подразделениям
        </v-subheader>
      </div>

      <div class="payment-menu-col-2">
        <router-link to="/meridian/journal_of_email_sending_payment_documents">
          <v-img :src="require('@/assets/img/email2.png')" />
        </router-link>
        <v-subheader
          class="font-weight-medium text-subtitle-1"
          align="center"
        >
          Журнал рассылки на email документов на оплату
        </v-subheader>
      </div>

      <div class="payment-menu-col-2">
        <router-link to="/meridian/money_distribution">
          <v-img :src="require('@/assets/img/distribution2.png')" />
        </router-link>
        <v-subheader
          class="font-weight-medium text-subtitle-1"
          align="center"
        >
          Распределение денежных средств
        </v-subheader>
      </div>

      <div class="payment-menu-col-2">
        <router-link to="/meridian/input_of_balances">
          <v-img :src="require('@/assets/img/bank_acc2.png')" />
        </router-link>
        <v-subheader
          class="font-weight-medium text-subtitle-1"
          align="center"
          justify="center"
        >
          Ввод остатков по Р/С
        </v-subheader>
      </div>

      <div class="payment-menu-col-2">
        <router-link to="/meridian/history_of_payment_documents">
          <v-img :src="require('@/assets/img/history2.png')" />
        </router-link>
        <v-subheader
          class="font-weight-medium text-subtitle-1"
          align="center"
        >
          Журнал документов на оплату (История)
        </v-subheader>
      </div>

      <div class="payment-menu-col-2">
        <router-link to="/meridian/register_of_documents_to_pay">
          <v-img :src="require('@/assets/img/journal3.png')" />
        </router-link>
        <v-subheader
          class="font-weight-medium text-subtitle-1"
          align="center"
        >
          Реестр документов к оплате
        </v-subheader>
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
</style>
