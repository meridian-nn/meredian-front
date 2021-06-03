<template>
  <v-dialog
    v-model="dialog"
    :value="show"
    max-width="1200px"
    padding="0px"
    class="warehouse-inventory-modal"
    @input="$emit('close')"
  >
    <v-card class="warehouse-inventory-modal-card">
      <v-card-title>
        <span class="headline"> Просмотр складских запасов</span>
      </v-card-title>

      <v-card-text>
        <div class="warehouse-inventory-row">
          <div class="warehouse-inventory-header-left-col">
            <div class="warehouse-inventory-row">
              <v-radio-group
                v-model="typeOfFilter"
                row
              >
                <v-radio
                  label="по Холдингу"
                  value="folding"
                />
                <v-radio
                  label="по складам"
                  value="storages"
                />
                <v-radio
                  label="по партиям"
                  value="parties"
                />
              </v-radio-group>
            </div>

            <div class="warehouse-inventory-row">
              <div class="warehouse-inventory-filters-inputs-col">
                <v-autocomplete
                  v-model="groupId"
                  label="Группа"
                  :loading="loadingType.groups"
                  :items="groups"
                  item-value="id"
                  item-text="clName"
                  hide-details="auto"
                  auto-select-first="true"
                  outlined
                />

                <v-autocomplete
                  v-model="storageId"
                  style="margin-top: 10px"
                  label="Склад"
                  :loading="loadingType.storages"
                  :items="storages"
                  item-value="id"
                  item-text="clName"
                  hide-details="auto"
                  auto-select-first="true"
                  outlined
                />
              </div>

              <div class="warehouse-inventory-filters-checkboxes-col">
                <div class="warehouse-inventory-row">
                  <v-simple-checkbox
                    v-model="commodity"
                  />

                  <div
                    class="warehouse-inventory-left-col-label"
                    style="width: 60px"
                  >
                    Сырье
                  </div>
                </div>

                <div class="warehouse-inventory-row">
                  <v-simple-checkbox
                    v-model="storage"
                  />

                  <div
                    class="warehouse-inventory-left-col-label"
                    style="width: 60px"
                  >
                    Склад
                  </div>
                </div>

                <div class="warehouse-inventory-row">
                  <v-simple-checkbox
                    v-model="stuff"
                  />

                  <div
                    class="warehouse-inventory-left-col-label"
                    style="width: 60px"
                  >
                    Товар
                  </div>
                </div>
              </div>
            </div>

            <div class="warehouse-inventory-row">
              <v-simple-checkbox
                v-model="giversStorages"
              />

              <div
                class="warehouse-inventory-left-col-label"
                style="width: 160px"
              >
                Давальческие склады
              </div>

              <v-simple-checkbox
                v-model="productionStorages"
              />

              <div
                class="warehouse-inventory-left-col-label"
                style="width: 185px"
              >
                Производственные склады
              </div>

              <v-simple-checkbox
                v-model="free"
              />

              <div
                class="warehouse-inventory-left-col-label"
                style="width: 70px"
              >
                Свободно
              </div>
            </div>
          </div>

          <div class="warehouse-inventory-header-right-col">
            <div class="warehouse-inventory-row">
              <div class="warehouse-inventory-right-col-label">
                Код
              </div>

              <div class="warehouse-inventory-text-input-code">
                <v-text-field
                  v-model.number="code"
                  hide-details="auto"
                />
              </div>

              <div class="warehouse-inventory-right-col-label">
                Наименование МЦ
              </div>

              <v-simple-checkbox
                style="padding-top: 14px"
                v-model="withAnalogs"
              />

              <div
                class="warehouse-inventory-right-col-label"
                style="width: 160px"
              >
                С учетом аналогов
              </div>
            </div>

            <div class="warehouse-inventory-row">
              <div class="warehouse-inventory-text-input">
                <v-text-field
                  v-model="stringOne"
                  hide-details="auto"
                />
              </div>
            </div>

            <div class="warehouse-inventory-row">
              <div class="warehouse-inventory-text-input">
                <v-text-field
                  v-model="stringTwo"
                  hide-details="auto"
                />
              </div>
            </div>

            <div class="warehouse-inventory-row">
              <div class="warehouse-inventory-text-input">
                <v-text-field
                  v-model="stringThree"
                  hide-details="auto"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="warehouse-inventory-row">
          <div id="listOfInventoryDataTable">
            <v-client-table
              v-model="listOfWarehouseInventory"
              :columns="listOfWarehouseInventoryColumns"
              :options="listOfWarehouseInventoryOptions"
            />
          </div>
        </div>

        <div class="warehouse-inventory-row">
          <v-spacer />

          <div class="warehouse-inventory-text-input-search">
            <v-text-field
              v-model="search"
              hide-details="auto"
            />
          </div>

          <div class="warehouse-inventory-labels-in-bottom-headline">
            Итого по товару
          </div>

          <div class="warehouse-inventory-numeric-in-bottom">
            <vue-numeric
              v-model="amount"
              :precision="3"
              decimal-separator="."
              read-only="true"
              :min="0"
              :empty-value="0"
            />
          </div>

          <v-spacer />
        </div>
      </v-card-text>
    </v-card>
    <user-notification ref="userNotification" />
  </v-dialog>
</template>

<script>
import UserNotification from '~/components/information_window/UserNotification'

export default {
  name: 'WarehouseInventoryPage',

  components: {
    UserNotification
  },

  props: {
    title: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // переменная, отвечающая за отображениие модального окна
      dialog: false,

      typeOfFilter: '',

      loadingType: {},

      groupId: null,

      groups: [],

      storageId: null,

      storages: [],

      commodity: false,

      storage: false,

      stuff: false,

      giversStorages: false,

      productionStorages: false,

      free: false,

      code: 0,

      withAnalogs: false,

      stringOne: '',

      stringTwo: '',

      stringThree: '',

      listOfWarehouseInventory: [],

      listOfWarehouseInventoryColumns: [
        'code',
        'nameOfMC',
        'unit',
        'count',
        'storage',
        'batch'
      ],

      listOfWarehouseInventoryOptions: {
        filterable: false,
        pagination: { show: false },
        texts: { noResults: '' },
        filterByColumn: false,
        headings: {
          code: 'Код',
          nameOfMC: 'Наименование МЦ',
          unit: 'Ед.изм.',
          count: 'Кол-во',
          storage: 'Склад',
          batch: 'Партия'
        }
      },

      search: '',

      amount: 1
    }
  },

  watch: {
    dialog(val) {
      if (val) {
        this.init()
      }
    }
  },

  methods: {
    init() {},

    openForm() {
      this.reset()
      this.dialog = true
    },

    reset() {
      this.typeOfFilter = ''
    }
  }

}
</script>

<style lang="scss">
.warehouse-inventory-modal-card {
  max-width: 1200px;
}

.warehouse-inventory-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
  min-width: 100%;
}

.warehouse-inventory-header-left-col {
  flex: 0 0 50%;
  max-width: 50%;
}

.warehouse-inventory-header-right-col {
  flex: 0 0 50%;
  max-width: 50%;
}

.warehouse-inventory-filters-inputs-col {
  flex: 0 0 80%;
  max-width: 80%;
}

.warehouse-inventory-filters-checkboxes-col {
  flex: 0 0 20%;
  max-width: 20%;
}

.warehouse-inventory-left-col-label{
  color: rgba(0, 0, 0, 0.6);
}

.warehouse-inventory-right-col-label{
  color: rgba(0, 0, 0, 0.6);
  padding-top: 21px;
  padding-right: 10px;
}

.warehouse-inventory-text-input-code {
  width: 50px;
  margin-right: 10px
}

.warehouse-inventory-text-input-search {
  width: 150px;
}

.warehouse-inventory-text-input {
  width: 300px;
  margin-right: 10px
}

.warehouse-inventory-labels-in-bottom-headline {
  color: rgba(0, 0, 0, 0.6);
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 22px;
}

.warehouse-inventory-numeric-in-bottom {
  margin-top: 22px;
  width: 100px;
}

#listOfInventoryDataTable {
  border-collapse: collapse;
  width: 100%;
  height: 400px;
}

#listOfInventoryDataTable table{
  width: 100%
}
#listOfInventoryDataTable td, #listOfInventoryDataTable th {
  border: 1px solid #ddd;
  padding: 0;
}

#listOfInventoryDataTable tr:nth-child(even){background-color: #f2f2f2;}

#listOfInventoryDataTable tr:hover {background-color: #ddd;}

#listOfInventoryDataTable th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}
</style>
