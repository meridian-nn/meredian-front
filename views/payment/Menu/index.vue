<template>
  <div
    name="PaymentMenu"
    class="payment-menu"
  >
    <v-row>
      <v-col cols="3" />

      <v-col cols="2">
        <router-link to="/meridian/journal_of_payment_documents">
          <v-img :src="require('@/assets/img/journal2.png')" />
        </router-link>
        <v-subheader class="font-weight-medium text-subtitle-1">
          Журнал документов на оплату
        </v-subheader>
      </v-col>

      <v-col cols="2">
        <router-link to="/meridian/payment_budget_by_departmens">
          <v-img :src="require('@/assets/img/budget.png')" />
        </router-link>
        <v-subheader class="font-weight-medium text-subtitle-1">
          Бюджет оплат по подразделениям
        </v-subheader>
      </v-col>

      <v-col cols="2">
        <router-link to="/meridian/journal_of_email_sending_payment_documents">
          <v-img :src="require('@/assets/img/email.png')" />
        </router-link>
        <v-subheader class="font-weight-medium text-subtitle-1">
          Журнал рассылки на email документов на оплату
        </v-subheader>
      </v-col>

      <v-col cols="3" />
    </v-row>

    <v-row>
      <v-col cols="3" />

      <v-col cols="2">
        <router-link to="/meridian/money_distribution">
          <v-img :src="require('@/assets/img/distribution.png')" />
        </router-link>
        <v-subheader class="font-weight-medium text-subtitle-1">
          Распределение денежных средств
        </v-subheader>
      </v-col>

      <v-col cols="2">
        <router-link to="/meridian/input_of_balances">
          <v-img :src="require('@/assets/img/bank_acc.png')" />
        </router-link>
        <v-subheader class="font-weight-medium text-subtitle-1">
          Ввод остатков по Р/С
        </v-subheader>
      </v-col>

      <v-col cols="2">
        <router-link to="/meridian/history_of_payment_documents">
          <v-img :src="require('@/assets/img/history.png')" />
        </router-link>
        <v-subheader class="font-weight-medium text-subtitle-1">
          Журнал документов на оплату (История)
        </v-subheader>
      </v-col>

      <v-col cols="3" />
    </v-row>

    <v-row>
      <v-col cols="3" />

      <v-col cols="2">
        <router-link to="/meridian/journal_of_payment_documents">
          <v-img :src="require('@/assets/img/journal2.png')" />
        </router-link>
        <v-subheader class="font-weight-medium text-subtitle-1">
          Реестр
        </v-subheader>
      </v-col>

      <v-col cols="3" />
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
</style>
