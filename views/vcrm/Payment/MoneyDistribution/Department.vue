<template>
  <div class="department">
    <div class="money-distribution-dep-row">
      <div class="money-distribution-dep-col">
        <v-autocomplete
          v-model="selectedDep"
          label="Отдел"
          :loading="loadingType.departments"
          :items="departments"
          item-value="id"
          item-text="nameViddoc"
          hide-details="auto"
          outlined
          @change="departmentChange"
        />
      </div>

      <div class="money-distribution-dep-for-distribution-text">
        Выделено
      </div>

      <div class="money-distribution-dep-for-distribution-sum">
        <div class="money-distribution-brise-input">
          <vue-numeric
            v-model.number="depDistributionSum"
            separator="space"
            :precision="2"
            decimal-separator="."
            output-type="number"
          />
          <span class="line" />
        </div>
      </div>

      <div class="money-distribution-not-allocated-dep-text">
        Не распределено
      </div>

      <div class="money-distribution-not-allocated-dep-sum">
        <v-subheader class="font-weight-medium text-subtitle-1">
          <div :class=" {'money-distribution-text-danger': notDistributedLessThenZero}">
            <vue-numeric
              :value="departmentRestDistributionSum"
              separator="space"
              :precision="2"
              decimal-separator="."
              output-type="number"
              :read-only="true"
            />
          </div>
        </v-subheader>
      </div>
    </div>

    <div class="money-distribution-dep-row">
      <div id="moneyDistributionData">
        <v-client-table
          ref="table"
          v-model="moneyDistributionData"
          :columns="columns"
          :options="options"
        >
          <vue-numeric
            slot="distributionSum"
            :key="row.id"
            v-model="row.distributionSum"
            slot-scope="{row, update}"
            separator="space"
            :precision="2"
            decimal-separator="."
            output-type="number"
            @input="update(row.distributionSum)"
          />
          <input
            slot="note"
            v-model="row.note"
            slot-scope="{row, update}"
            type="text"
            @input="update(row.note)"
          >
        </v-client-table>
      </div>

      <div
        v-if="moneyDistributionData.length > 0"
        class="table-total-text"
      >
        Итого
      </div>

      <div
        v-if="moneyDistributionData.length > 0"
        class="table-total-val"
      >
        <vue-numeric
          :value="departmentRestDistributionTotal"
          separator="space"
          :precision="2"
          decimal-separator="."
          output-type="number"
          :read-only="true"
        />
      </div>
    </div>

    <div class="money-distribution-dep-row">
      <v-col cols="3" />

      <v-col
        cols="3"
        class="money-distribution-save-button"
      >
        <div
          align="center"
          class="headline"
        >
          <v-btn @click="save">
            Сохранить
          </v-btn>
        </div>
      </v-col>

      <v-col
        cols="3"
        class="money-distribution-cancel-button"
      >
        <div
          align="center"
          class="headline"
        >
          <v-btn
            @click="cancel"
          >
            Отмена
          </v-btn>
        </div>
      </v-col>

      <v-col cols="3" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Department',

  data() {
    return {
      date: new Date().toISOString().substr(0, 10),

      depDistributionSum: 0,
      // сумма распределенного бюджета по отделу
      depDistributedSum: 0,

      // признак, показывающий что не распределенный бюджет по отделу меньше 0
      notDistributedLessThenZero: false,

      // id выбранного отдела
      selectedDep: null,

      // таблица данных по распределению бюджета по подразделениям выбранного отдела
      moneyDistributionData: [],
      columns: ['department.nameViddoc', 'distributionSum', 'note'],
      options: {
        filterable: false,
        pagination: { show: false },
        texts: { noResults: '' },
        caption: false,
        filterByColumn: false,
        perPage: 15,
        dateFormat: 'YYYY-MM-DD',
        editableColumns: ['distributionSum', 'note'],
        headings: {
          'department.nameViddoc': 'Подразделение',
          distributionSum: 'Сумма',
          note: 'Примечание'
        },
        datepickerOptions: {
          showDropdowns: true,
          autoUpdateInput: true
        }
      },

      // таблица данных по распределению общего бюджета по отделам
      departmentsDataTable: [],
      departmentsColumns: ['name', 'distributionSum', 'notDistributedSum'],
    }
  },

  computed: {
    // функция для расчета суммы не распределенного бюджета на отдел
    departmentRestDistributionSum() {
      const notDistributed = (this.depDistributionSum - this.depDistributedSum)
      this.notDistributedLessThenZero = (notDistributed < 0)

      return notDistributed
    },

    departmentRestDistributionTotal() {
      return this.depDistributionSum - this.departmentRestDistributionSum
    },

    totalSumOfDistributionSum() {
      return this.departmentsDataTable.reduce((acc, item) => {
        return acc + Number(item.distributionSum) || 0
      }, 0)
    }
  },
  watch: {
    moneyDistributionData: {
      handler() {
        this.calcDepDistributedSum()
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },

  methods: {
    // Обработка события сохранения распределения бюджетов на форме
    save() {
      this.$emit('save', this.moneyDistributionData)
    },

    cancel() {
      this.updateAllInfo()

      this.$emit('cancel')
    }
  }
}
</script>
