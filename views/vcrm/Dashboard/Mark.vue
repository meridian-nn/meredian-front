<template>
  <div class="mark-table">
    <v-data-table
      :headers="headers"
      :items="desserts"
      sort-by="calories"
      calculate-widths
    >
      <template
        v-for="(col, i) in filters"
        #[`header.${i}`]="{ header }"
      >
        <div
          :key="i"
          style="display: inline-block; padding: 16px 0;"
        >
          {{ header.text }}
        </div>
        <div
          :key="i"
          style="float: right; margin-top: 8px"
        >
          <v-menu
            :close-on-content-click="false"
            :nudge-width="200"
            offset-y
            transition="slide-y-transition"
            left
            fixed
            style="position: absolute; right: 0"
          >
            <template #activator="{ on, attrs }">
              <v-btn
                color="indigo"
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon
                  small
                  :color="activeFilters[header.value] && activeFilters[header.value].length < filters[header.value].length ? 'red' : 'default'"
                >
                  mdi-filter
                </v-icon>
              </v-btn>
            </template>
            <v-list
              flat
              dense
              class="pa-0"
            >
              <v-list-item-group
                v-model="activeFilters[header.value]"
                multiple
                class="py-2"
              >
                <template v-for="(item, i) in filters[header.value]">
                  <v-list-item
                    :key="i"
                    :value="item"
                    :ripple="false"
                  >
                    <template #default="{ active, toggle }">
                      <v-list-item-action>
                        <v-checkbox
                          :input-value="active"
                          :true-value="item"
                          color="primary"
                          :ripple="false"
                          dense
                          @click="toggle"
                        />
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title v-text="item" />
                      </v-list-item-content>
                    </template>
                  </v-list-item>
                </template>
              </v-list-item-group>

              <v-divider />

              <v-row no-gutters>
                <v-col cols="6">
                  <v-btn
                    text
                    block
                    color="success"
                    @click="toggleAll(header.value)"
                  >
                    Выбрать всё
                  </v-btn>
                </v-col>

                <v-col cols="6">
                  <v-btn
                    text
                    block
                    color="warning"
                    @click="clearAll(header.value)"
                  >
                    Очистить
                  </v-btn>
                </v-col>
              </v-row>
            </v-list>
          </v-menu>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import omit from 'lodash/omit'
export default {
  name: 'MarkTable',

  props: {
    value: {
      required: true,
      validator: () => true
    },

    search: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      newLeadsSearch: '',
      fullDesserts: [],
      desserts: [],
      activeFilters: {},
      filters: { 'prodName': [], 'color': [], 'order_id': [], 'sizeValue': [], 'sizeName': [], 'model': [], 'brand': [], 'packType': [], 'packMaterial': [] },
      defaultItem: {
        prodName: '',
        brand: '',
        packType: '',
        packMaterial: '',
        quantity: '',
        types: '',
        sizeName: '',
        sizeValue: '',
        color: '',
        model: '',
        gender: '',
        standartNumber: '',
        rawMaterial: '',
        companyName: '',
        manufacturerCode: '4650067329994',
        tnved: '6201990000',
        trademark: '',
        apiExtension: 'lp',
        status: ''
      }
    }
  },

  async fetch() {
    const { content } = await this.$axios.$get('http://192.168.1.70:9037/meridian/markCode/findAll?page=0&size=200')

    this.fullDesserts = content

    const code = this.fullDesserts.map(item => item.code)

    const orderId = this.fullDesserts.map(item => item.markOrder.markCodeRequest.productionOrderId)

    const table = this.fullDesserts.map(item => item.markOrder.markCodeRequest.gtinRequest)

    const mark = table.map((item, i) => {
      return { ...item, code: code[i], order_id: orderId[i] }
    })

    this.desserts = mark.map(item => omit(item, ['quantity', 'id', 'categoryId', 'publicationDate', 'trademark', 'tnved', 'manufacturerCode', 'measure', 'gcpclBrick', 'inn', 'country', 'apiExtension', 'rawMaterial', 'companyName']))
  },

  computed: {
    headers() {
      return [
        {
          text: 'Номер заказа',
          value: 'order_id',
          width: '170px',
          sortable: true,
          filter: (value) => {
            return this.activeFilters.order_id ? this.activeFilters.order_id.includes(value) : true
          }
        },
        {
          text: 'Код маркировки',
          value: 'code',
          width: '150px',
          sortable: false
        },
        {
          text: 'Название',
          align: 'start',
          sortable: true,
          value: 'prodName',
          width: '200px',
          filter: (value) => {
            if ((value + '').toLowerCase().includes(this.search.toLowerCase())) {
              return this.activeFilters.prodName ? this.activeFilters.prodName.includes(value) : true
            }
          }
        },
        {
          text: 'Бренд',
          value: 'brand',
          width: '140px',
          filter: (value) => {
            return this.activeFilters.brand ? this.activeFilters.brand.includes(value) : true
          }
        },
        {
          text: 'Тип упаковки',
          width: '170px',
          value: 'packType',
          filter: (value) => {
            return this.activeFilters.packType ? this.activeFilters.packType.includes(value) : true
          }
        },
        {
          text: 'Материал упаковки',
          value: 'packMaterial',
          width: '210px',
          filter: (value) => {
            return this.activeFilters.packMaterial ? this.activeFilters.packMaterial.includes(value) : true
          }
        },
        {
          text: 'Название размера',
          width: '195px',
          value: 'sizeName',
          sortable: true,
          filter: (value) => {
            return this.activeFilters.sizeName ? this.activeFilters.sizeName.includes(value) : true
          }
        },
        {
          text: 'Размер',
          width: '150px',
          value: 'sizeValue',
          sortable: true,
          filter: (value) => {
            return this.activeFilters.sizeValue ? this.activeFilters.sizeValue.includes(value) : true
          }
        },
        {
          text: 'Цвет',
          value: 'color',
          width: '120px',
          filter: (value) => {
            return this.activeFilters.color ? this.activeFilters.color.includes(value) : true
          }
        },
        {
          text: 'Модель',
          value: 'model',
          width: '150px',
          filter: (value) => {
            return this.activeFilters.model ? this.activeFilters.model.includes(value) : true
          }
        },
        {
          text: 'Пол',
          width: '110px',
          value: 'gender',
          sortable: false
        },
        {
          text: 'Технический стандарт',
          width: '185px',
          value: 'standartNumber',
          sortable: false
        },
        {
          text: 'Статус',
          width: '120px',
          value: 'status',
          sortable: false
        }
      ]
    }
  },

  watch: {
    desserts(val) {
      this.initFilters()
    },

    value() {
      this.$fetch()
    }
  },

  methods: {
    initFilters() {
      for (const col in this.filters) {
        this.filters[col] = this.desserts.map((d) => { return d[col] }).filter(
          (value, index, self) => { return self.indexOf(value) === index }
        )
      }

      this.activeFilters = Object.assign({}, this.filters)
    },

    toggleAll(col) {
      this.activeFilters[col] = this.desserts.map((d) => { return d[col] }).filter(
        (value, index, self) => { return self.indexOf(value) === index }
      )
    },

    clearAll(col) {
      this.activeFilters[col] = []
    }
  }

}
</script>

<style lang="scss">
.v-data-table {
  &__wrapper {
    tbody {
      td:nth-of-type(2) {
        max-width: 250px;
        width: 250px;
        word-wrap: break-word !important;
      }
    }
  }
}
</style>
