<template>
  <v-container
    class="py-6 px-6"
    fluid
  >
    <v-row>
      <v-col cols="4">
        <div>
          <v-text-field
            v-model="newLeadsSearch"
            append-icon="mdi-magnify"
            label="Поиск"
          />
        </div>
      </v-col>

      <v-spacer />

      <v-col cols="4">
        <div class="barcode-form-mark-main">
          <button
            class="barcode-form-mark-btn"
            @click="saveExelFIle"
          >
            Сохранить в xls
          </button>
          <button
            class="barcode-form-mark-btn"
            @click="$router.push({name: 'GtinPage'})"
          >
            GTIN
          </button>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <div class="barcode-form-mark-col-2">
        <v-text-field
          v-model="numberOfOrder"
          label="Номер заказа"
          clearable="true"
          outlined
          hide-details="auto"
        />
      </div>

      <div class="barcode-form-mark-col-date-order-text">
        <div
          align="center"
        >
          Дата заказа: с
        </div>
      </div>

      <div class="barcode-form-mark-col-date">
        <v-text-field
          v-model="startDate"
          type="date"
        />
      </div>

      <div class="barcode-form-mark-col-1">
        <div
          align="center"
        >
          по
        </div>
      </div>

      <div class="barcode-form-mark-col-date">
        <v-text-field
          v-model="endDate"
          type="date"
        />
      </div>

      <div class="barcode-form-mark-main">
        <button
          class="barcode-form-mark-btn-find"
          @click="findMarkCodeBySearchCriterias"
        >
          Найти
        </button>
      </div>

      <div class="barcode-form-mark-main">
        <button
          class="barcode-form-mark-btn-cancel-filters"
          @click="cancelFilters"
        >
          Сбросить фильтры
        </button>
      </div>

      <v-spacer />
    </v-row>

    <v-data-table
      id="barcode-form-mark-table"
      height="650"
      fixed-header
      :headers="headers"
      :items="desserts"
      sort-by="calories"
      calculate-widths
      :footer-props="footerProps"
      @current-items="getFilteredItem"
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

      <template #[`item.code`]="{ item }">
        <span
          class="barcode-form-dialog-code-btn"
          style="width: 160px"
          @click="openBarCodeDialog(item.code)"
        >{{ item.code }}</span>
      </template>
    </v-data-table>

    <v-dialog
      v-model="showDialogBarCode"
      max-width="266px"
    >
      <div class="barcode-form-dialog-code-wrapp">
        <img
          alt="Barcode Generator"
          :src="`https://barcode.tec-it.com/barcode.ashx?data=${this.barCodeData}&code=DataMatrix&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Jpeg&rotation=0&color=%23000000&bgcolor=%23ffffff&codepage=Default&qunit=Mm&quiet=0&dmsize=300px`"
        >
      </div>
    </v-dialog>
  </v-container>
</template>

<script>
import omit from 'lodash/omit'
import { json2excel } from 'js2excel'
export default {
  name: 'MarkTable',

  props: {
    value: {
      required: true,
      validator: () => true
    }
  },

  data() {
    return {
      showDialogBarCode: false,
      barCodeData: '',
      newLeadsSearch: '',
      fullDesserts: [],
      desserts: [],
      filterDesserts: [],
      activeFilters: {},
      filters: { 'prodName': [], 'color': [], 'order_id': [], 'sizeValue': [], 'sizeName': [], 'model': [], 'brand': [], 'packType': [], 'packMaterial': [], 'date_add': [] },
      footerProps: {
        'items-per-page-text': 'Количество строк на странице'
      },
      numberOfOrder: '',
      endDate: new Date().toISOString().substr(0, 10),
      startDate: new Date().toISOString().substr(0, 10)
    }
  },

  async fetch() {
    this.fullDesserts = await this.$api.code.markCodeList()

    const code = this.fullDesserts.map(item => item.code)
    const dateAdd = this.fullDesserts.map(item => item.dateAdd)
    const orderId = this.fullDesserts.map(item => item.markOrder.markCodeRequest.productionOrderId)
    const table = this.fullDesserts.map(item => item.markOrder.markCodeRequest.gtinRequest)

    const mark = table.map((item, i) => {
      return { ...item, code: code[i], date_add: dateAdd[i], order_id: orderId[i] }
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
          text: 'Дата заказа',
          value: 'date_add',
          width: '170px',
          sortable: true,
          filter: (value) => {
            return this.activeFilters.date_add ? this.activeFilters.date_add.includes(value) : true
          }
        },
        {
          text: 'Код маркировки',
          width: '170px',
          value: 'code',
          sortable: false
        },
        {
          text: 'Название',
          align: 'start',
          sortable: true,
          value: 'prodName',
          width: '200px',
          filter: (value) => {
            if ((value + '').toLowerCase().includes(this.newLeadsSearch.toLowerCase())) {
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

  mounted() {
    this.init()
  },

  methods: {
    init() {
      const date = new Date()
      this.startDate = new Date(date.getFullYear(), date.getMonth(), 2).toISOString().substr(0, 10)
    },

    openBarCodeDialog(code) {
      this.barCodeData = code

      this.showDialogBarCode = true
    },

    saveExelFIle() {
      const data = this.filterDesserts

      try {
        json2excel({
          data,
          name: 'user-data',
          formateDate: 'yyyy/mm/dd'
        })
      } catch (e) {
        console.error('export error')
      }
    },

    getFilteredItem(e) {
      this.filterDesserts = e
    },

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
    },

    async findMarkCodeBySearchCriterias() {
      const data = this.createCriteriasForMarkCodeRequest(this.numberOfOrder, this.startDate, this.endDate)

      this.fullDesserts = await this.$api.code.findBySearchCriterias(data)

      const code = this.fullDesserts.map(item => item.code)
      const dateAdd = this.fullDesserts.map(item => item.dateAdd)
      const orderId = this.fullDesserts.map(item => item.markOrder.markCodeRequest.productionOrderId)
      const table = this.fullDesserts.map(item => item.markOrder.markCodeRequest.gtinRequest)

      const mark = table.map((item, i) => {
        return { ...item, code: code[i], date_add: dateAdd[i], order_id: orderId[i] }
      })

      this.desserts = mark.map(item => omit(item, ['quantity', 'id', 'categoryId', 'publicationDate', 'trademark', 'tnved', 'manufacturerCode', 'measure', 'gcpclBrick', 'inn', 'country', 'apiExtension', 'rawMaterial', 'companyName']))
    },

    cancelFilters() {
      this.$fetch()
    }
  }

}
</script>

<style lang="scss">

#barcode-form-mark-table td {
    word-break:break-all !important;
}

.barcode-form-dialog-code {
  &-wrapp {
    background-color: #fff;

    img {
      width: 100%;
    }
  }

  &-btn {
    cursor: pointer;
    color: cornflowerblue;
  }
}

.barcode-form-mark-main {
  display:flex;
  justify-content: flex-end;
  align-items: center;
}

.barcode-form-mark-btn {
  width: 180px;
  height: 30px;
  font-size:1rem;
  background: #639db1;
  border:none;
  margin:20px;
  outline:2px solid #639db1;
  outline-offset:4px;
  border:2px solid #639db1;
  cursor: pointer;
  color: white;
  transition: all 250ms;
}

.barcode-form-mark-btn:hover{
  outline-offset: -8px;
  color: rgb(34,34,34);
  background: none;
}

.barcode-form-mark-btn-find {
  width: 70px;
  height: 30px;
  font-size:1rem;
  background: #639db1;
  border:none;
  margin:20px;
  outline:2px solid #639db1;
  outline-offset:4px;
  border:2px solid #639db1;
  cursor: pointer;
  color: white;
  transition: all 250ms;
}

.barcode-form-mark-btn-find:hover{
  outline-offset: -8px;
  color: rgb(34,34,34);
  background: none;
}

.barcode-form-mark-btn-cancel-filters {
  width: 150px;
  height: 30px;
  font-size:1rem;
  background: #639db1;
  border:none;
  margin:20px;
  outline:2px solid #639db1;
  outline-offset:4px;
  border:2px solid #639db1;
  cursor: pointer;
  color: white;
  transition: all 250ms;
}

.barcode-form-mark-btn-cancel-filters:hover{
  outline-offset: -8px;
  color: rgb(34,34,34);
  background: none;
}

.barcode-form-mark-col-2{
  padding-left: 12px;
  flex: 0 0 16%;
  max-width: 16%;
}

.barcode-form-mark-col-date{
  flex: 0 0 10%;
  max-width: 10%;
}

.barcode-form-mark-col-1{
  margin-top:20px;
  flex: 0 0 5%;
  max-width: 5%;
}

.barcode-form-mark-col-date-order-text{
  margin-top:20px;
  flex: 0 0 10%;
  max-width: 10%;
}
</style>
