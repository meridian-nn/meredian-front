<template>
  <div class="balance-score">
    <div class="input-of-balances-row">
      <div class="input-of-balances-org">
        <v-autocomplete
          v-model="orgId"
          label="Организация"
          :loading="loadingType.organizations"
          :items="organizations"
          item-value="id"
          item-text="clName"
          @change="findByDataOplatAndMyOrgId"
        />
      </div>
    </div>

    <form @submit.prevent="save()">
      <div class="input-of-balances-oplat-data-row">
        <div id="oplatData">
          <v-client-table
            ref="table"
            v-model="oplatData"
            :columns="oplatDataColumns"
            :options="oplatDataOptions"
          >
            <input
              slot="name"
              v-model="row.name"
              slot-scope="{row}"
            >
            <vue-numeric
              slot="saldo"
              v-model.number="row.saldo"
              slot-scope="{row, update}"
              separator="space"
              :precision="2"
              decimal-separator="."
              output-type="number"
              @input="update(row.saldo)"
            />
            <vue-numeric
              slot="nalich"
              v-model.number="row.nalich"
              slot-scope="{row, update}"
              separator="space"
              :precision="2"
              decimal-separator="."
              output-type="number"
              @input="update(row.nalich)"
            />
            <vue-numeric
              slot="vnpl"
              v-model.number="row.vnpl"
              slot-scope="{row}"
              :read-only="true"
              separator="space"
              :precision="2"
              decimal-separator="."
              output-type="number"
            />
            <vue-numeric
              slot="sumToPay"
              v-model.number="row.sumToPay"
              slot-scope="{row}"
              :read-only="true"
              separator="space"
              :precision="2"
              decimal-separator="."
              output-type="number"
            />
            <vue-numeric
              slot="endBalance"
              v-model.number="row.endBalance"
              slot-scope="{row}"
              :read-only="true"
              separator="space"
              :precision="2"
              decimal-separator="."
              output-type="number"
            />
          </v-client-table>
        </div>
      </div>

      <div class="input-of-balances-row">
        <div
          align="right"
          class="input-of-balances-save-btn"
        >
          <v-btn type="submit">
            Сохранить
          </v-btn>
        </div>

        <div class="input-of-balances-spacer" />

        <div class="input-of-balances-cancel-btn">
          <v-btn
            @click="cancel"
          >
            Отмена
          </v-btn>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import ControlTable from '~/mixins/ControlTable'
export default {
  name: 'BalanceScore',

  mixins: [ControlTable],

  props: {
    organizations: {
      type: Array,
      default: () => []
    },

    date: {
      type: [String, Date],
      required: true
    }

  },

  data() {
    return {
      orgId: null,
      loadingType: {},
      oplatDataColumns: ['shortNameOfAccWithNumOfAcc', 'saldo', 'nalich', 'vnpl', 'sumToPay', 'endBalance'],
      oplatData: [],
      oplatDataOptions: {
        filterable: ['shortNameOfAccWithNumOfAcc'],
        pagination: { show: false },
        texts: { noResults: '', filter: 'Фильтр по наим. счета:', filterPlaceholder: '' },
        perPage: 100,
        perPageValues: [100],
        /* filterByColumn: true, */
        editableColumns: ['saldo', 'nalich'],
        headings: {
          shortNameOfAccWithNumOfAcc: 'Наименование',
          saldo: 'Остаток на р/с',
          nalich: 'Прочее',
          vnpl: 'ВнПл',
          sumToPay: 'К оплате',
          endBalance: 'Остаток на конец'
        }
      }
    }
  },

  watch: {
    date() {
      this.findByDataOplatAndMyOrgId()
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    async init() {
      if (!this.orgId) {
        await this.findDefaultOrgAndAccIdForUserOnForm()
        await this.findByDataOplatAndMyOrgId()
      }
    },

    // Поиск организации по умолчанию для текущего пользователя
    async findDefaultOrgAndAccIdForUserOnForm() {
      const filtersParams = await this.findDefaultOrgAndAccIdForUser()
      if (filtersParams) {
        this.orgId = filtersParams.orgId
      }
    },

    // Получение списка расч. счетов выбранной организации и их сортировка по возрастанию
    async findByDataOplatAndMyOrgId() {
      const data = {
        dateOplat: new Date(this.date).toLocaleDateString(),
        orgId: this.orgId || 0
      }
      let oplata = await this.$api.paymentAccounts.findByDataOplatAndMyOrgId(data)

      for (const elem of oplata) {
        elem.shortNameOfAcc = elem.acc.shortName
        elem.shortNameOfAccWithNumOfAcc = elem.acc.shortName + ' - ' + elem.acc.numAcc.slice(elem.acc.numAcc.length - 4)
        elem.endBalance = elem.saldo + elem.nalich + elem.vnpl - elem.sumToPay
      }

      oplata.sort(this.customCompare('shortNameOfAcc'))
      oplata = oplata.filter(item => item.shortNameOfAcc.length > 0)

      this.oplatData = oplata

      await this.$nextTick()

      this.setMaxTable(this.oplatData.length)
    },

    // Отмена внесенных изменений и переполучение информации для формы из api
    cancel() {
      this.$emit('cancel')
    },

    // Сохранение внесенных пользователем изменений
    async save() {
      document.activeElement.blur()
      await this.$axios.$post('/oper/spOplat/saveAll', this.oplatData)
      this.$emit('save')
    }
  }
}
</script>

<style scoped>

</style>
