<template>
  <v-dialog
    :value="value"
    class="filling-defect-page"
    :fullscreen="true"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Заполнение брака по заказу на пошив</span>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="1">
            <v-btn
              fab
              small
              color="blue"
              class="mt-2"
            >
              <v-icon color="white">
                mdi-printer
              </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-subheader class="header-for-fields">
                Изделие:
              </v-subheader>
              <v-col cols="3">
                <v-text-field
                  v-model="dataToEdit.productNum"
                  outlined
                  readonly
                />
              </v-col>
              <v-col cols="7">
                <v-text-field
                  v-model="dataToEdit.productName"
                  outlined
                  readonly
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="1">
            <v-text-field
              v-model="dataToEdit.productCount"
              outlined
              readonly
              label="Кол-во"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="dataToEdit.codeSallary"
              outlined
              readonly
              label="Производство"
            />
          </v-col>
        </v-row>
        <v-divider class="mb-2" />
        <v-row>
          <v-col cols="5">
            <v-row>
              <v-col cols="3">
                <v-subheader class="pl-0 pt-1 header-for-fields">
                  Проверки базы:
                </v-subheader>
              </v-col>
              <v-col cols="3">
                <v-btn
                  fab
                  small
                  color="blue"
                  class="mt-2 mr-2"
                >
                  <v-icon color="white">
                    mdi-plus
                  </v-icon>
                </v-btn>

                <v-btn
                  fab
                  small
                  color="blue"
                  class="mt-2 mr-2"
                >
                  <v-icon color="white">
                    mdi-delete
                  </v-icon>
                </v-btn>

                <v-btn
                  fab
                  small
                  color="blue"
                  class="mt-2"
                >
                  <v-icon color="white">
                    mdi-filter
                  </v-icon>
                </v-btn>
              </v-col>
              <v-spacer />
              <v-col
                class="mt-4"
              >
                <v-btn small>
                  Перенести в свод. заказ
                </v-btn>
              </v-col>
            </v-row>
            <v-data-table
              id="base-data-table"
              v-model="baseDataTableSelectedRecords"
              height="200px"
              fixed-header
              :loading="loadingType.baseDataTableSelectedRecords"
              loading-text="Данные загружаются, подождите"
              no-data-text="Данные не найдены"
              show-select
              :single-select="false"
              disable-pagination
              hide-default-footer
              :headers="baseDataTableHeaders"
              :items="baseDataTableRecords"
              @update:sort-by="updateSort('by', $event)"
              @update:sort-desc="updateSort('desc', $event)"
            />
            <v-row class="quantity-in-batch">
              <v-col cols="2">
                <p class="pt-2 text-right font-weight-bold">
                  Итого:
                </p>
              </v-col>
              <v-col cols="2">
                <p class="pt-2 pl-2 font-weight-bold">
                  <vue-numeric
                    v-model="totalToSumBase"
                    separator="space"
                    :precision="2"
                    decimal-separator="."
                    output-type="number"
                    :read-only="true"
                  />
                </p>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="3"
                class="py-0"
              >
                <v-text-field
                  v-model="dataToEdit.returnDate"
                  outlined
                  readonly
                  label="Дата возврата"
                />
              </v-col>
              <v-col
                cols="9"
                class="py-0"
              >
                <v-text-field
                  v-model="dataToEdit.noteToReturn"
                  outlined
                  readonly
                  label="Примечание к возврату"
                />
              </v-col>
              <v-col
                cols="12"
                class="py-0"
              >
                <v-text-field
                  v-model="dataToEdit.reasonForVerification"
                  outlined
                  readonly
                  label="Причина отсутствия проверки"
                />
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="7">
            <v-row>
              <v-col cols="6">
                <div class="d-flex">
                  <v-subheader class="pl-0 pt-1 header-for-fields mr-2">
                    Нашли на базе:
                  </v-subheader>
                  <v-btn
                    fab
                    small
                    color="blue"
                    class="mt-2 mr-2"
                  >
                    <v-icon color="white">
                      mdi-plus
                    </v-icon>
                  </v-btn>

                  <v-btn
                    fab
                    small
                    color="blue"
                    class="mt-2 mr-2"
                  >
                    <v-icon color="white">
                      mdi-pencil
                    </v-icon>
                  </v-btn>

                  <v-btn
                    fab
                    small
                    color="blue"
                    class="mt-2 mr-2"
                  >
                    <v-icon color="white">
                      mdi-delete
                    </v-icon>
                  </v-btn>

                  <v-btn
                    fab
                    small
                    color="blue"
                    class="mt-2 mr-2"
                  >
                    <v-icon color="white">
                      mdi-printer
                    </v-icon>
                  </v-btn>

                  <v-btn
                    small
                    class="mt-4"
                  >
                    Дефекты
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="6">
                <v-row>
                  <v-col
                    cols="3"
                    class="pt-0"
                  >
                    <v-checkbox
                      v-model="dataToEdit.shipmentIsAllowed"
                      label="Отгрузка разрешена"
                      :true-value="1"
                      :false-value="0"
                    />
                  </v-col>
                  <v-col cols="9">
                    <v-row>
                      <v-col cols="2">
                        <v-subheader class="pl-0 pt-1 header-for-fields">
                          ОТК
                        </v-subheader>
                      </v-col>
                      <v-col cols="10">
                        <v-autocomplete
                          v-model="dataToEdit.otk"
                          :loading="loadingType.otk"
                          :items="otk"
                          item-value="id"
                          item-text="otk"
                          hide-details="auto"
                          outlined
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-data-table
              id="found-in-base-table"
              v-model="foundInBaseTableSelectedRecords"
              height="350px"
              fixed-header
              :loading="loadingType.foundInBaseTableSelectedRecords"
              loading-text="Данные загружаются, подождите"
              no-data-text="Данные не найдены"
              show-select
              :single-select="false"
              disable-pagination
              hide-default-footer
              :headers="foundInBaseTableHeaders"
              :items="foundInBaseTableRecords"
              @update:sort-by="updateSort('by', $event)"
              @update:sort-desc="updateSort('desc', $event)"
            />
            <v-row>
              <v-spacer />
              <v-col
                cols="6"
                class="pt-0"
              >
                <v-row>
                  <v-col
                    cols="4"
                    class="pt-0 "
                  >
                    <v-checkbox
                      v-model="dataToEdit.shipmentByMemo"
                      label="Отгрузка по служебной записке"
                      class="mt-1"
                      :true-value="1"
                      :false-value="0"
                    />
                  </v-col>
                  <v-col cols="8">
                    <v-text-field
                      v-model="dataToEdit.unnamed"
                      outlined
                      readonly
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider class="mb-5" />
        <v-row>
          <v-col cols="5">
            <v-row>
              <v-col cols="4">
                <v-subheader class="pl-0 pt-1 header-for-fields">
                  Проверки фабрики
                </v-subheader>
              </v-col>
              <v-col cols="8">
                <v-data-table
                  id="factory-checks-table"
                  v-model="factoryChecksTableSelectedRecords"
                  height="200px"
                  fixed-header
                  :loading="loadingType.factoryChecksTableSelectedRecords"
                  loading-text="Данные загружаются, подождите"
                  no-data-text="Данные не найдены"
                  show-select
                  :single-select="false"
                  disable-pagination
                  hide-default-footer
                  :headers="factoryChecksTableHeaders"
                  :items="factoryChecksTableRecords"
                  @update:sort-by="updateSort('by', $event)"
                  @update:sort-desc="updateSort('desc', $event)"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="7">
            <div class="d-flex">
              <div class="mr-2 d-flex">
                <v-btn
                  fab
                  small
                  color="blue"
                  class="mt-2 mr-2"
                >
                  <v-icon color="white">
                    mdi-plus
                  </v-icon>
                </v-btn>
                <v-btn
                  fab
                  small
                  color="blue"
                  class="mt-2"
                >
                  <v-icon color="white">
                    mdi-delete
                  </v-icon>
                </v-btn>
              </div>
              <div>
                <v-row>
                  <v-col cols="2">
                    <v-subheader class="filters-header header-for-fields pt-2 text-right">
                      Фильтры:
                    </v-subheader>
                  </v-col>
                  <v-col
                    cols="10"
                    class="filters-checked-factory"
                  >
                    <v-row>
                      <v-col cols="2">
                        <v-text-field
                          v-model="dataToEdit.codeSallary"
                          outlined
                          label="Код з/п"
                        />
                      </v-col>
                      <v-subheader class="header-for-fields">
                        Операция:
                      </v-subheader>
                      <v-col cols="2">
                        <v-text-field
                          v-model="dataToEdit.codeOperationOnFilter"
                          outlined
                          label="Код"
                        />
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          v-model="dataToEdit.filterNameOperation"
                          outlined
                          label="Наименование"
                        />
                      </v-col>
                      <v-btn
                        small
                        class="usage-filters-btn"
                      >
                        Применить
                      </v-btn>
                    </v-row>
                  </v-col>
                </v-row>
              </div>
            </div>
            <v-row class="mt-5">
              <v-col cols="1">
                <v-subheader class="header-for-fields">
                  Дефект
                </v-subheader>
              </v-col>
              <v-col cols="1">
                <div class="deffect-color" />
              </v-col>
              <v-spacer />
              <v-col
                cols="9"
                class="mt-5"
              >
                <v-text-field
                  v-model="dataToEdit.nameOperation"
                  outlined
                  label="Наименование операции"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-subheader class="header-for-fields mb-3 pl-0">
          Список неделимых операций по заказу на пошив
        </v-subheader>
        <v-data-table
          id="indivisible-operations-table"
          v-model="indivisibleOperationsTableSelectedRecords"
          height="400px"
          fixed-header
          :loading="loadingType.indivisibleOperationsTableSelectedRecords"
          loading-text="Данные загружаются, подождите"
          no-data-text="Данные не найдены"
          show-select
          :single-select="false"
          disable-pagination
          hide-default-footer
          :headers="indivisibleOperationsTableHeaders"
          :items="indivisibleOperationsTableRecords"
          @update:sort-by="updateSort('by', $event)"
          @update:sort-desc="updateSort('desc', $event)"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="close"
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'FillingDefectOnOrderForTailoring',
  props: {
    value: {
      type: Boolean,
      default: false
    },

    data: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      loadingType: {},
      formOpened: this.value,
      dataToEdit: {},
      page: 0,
      baseDataTableRecords: [],
      baseDataTableSelectedRecords: [],
      baseDataTableHeaders: [
        {
          text: 'Дата пров',
          value: 'dateTest',
          width: '15%',
          sortable: false
        },
        {
          text: 'Кол-во в партии',
          value: 'countVerified',
          width: '12%',
          sortable: false
        },
        {
          text: 'Проверенных',
          value: 'verified',
          width: '12%',
          sortable: false
        },
        {
          text: 'Кол-во дефектов',
          value: 'countDefects',
          width: '17%',
          sortable: false
        },
        {
          text: 'Возврат',
          value: 'return',
          width: '10%',
          sortable: false
        },
        {
          text: 'Возврат от кого',
          value: 'returnFromWhom',
          width: '17%',
          sortable: false
        },
        {
          text: 'Кол-во ед-ц с дефектом',
          value: 'countDefects',
          width: '17%',
          sortable: false
        }
      ],
      totalToSumBase: 0,
      otk: [],
      foundInBaseTableSelectedRecords: [],
      foundInBaseTableRecords: [],
      foundInBaseTableHeaders: [
        {
          text: 'Группа',
          value: 'groupe',
          width: '8%',
          sortable: false
        },
        {
          text: '№ ед-цы',
          value: 'numberUnit',
          width: '8%',
          sortable: false
        },
        {
          text: 'ОТК',
          value: 'otkTable',
          width: '10%',
          sortable: false
        },
        {
          text: 'Дефекты',
          value: 'foundDefects',
          width: '15%',
          sortable: false
        },
        {
          text: 'Кол-во дефектов',
          value: 'foundQuantityDefects',
          width: '9%',
          sortable: false
        },
        {
          text: 'Примечание',
          value: 'foundNote',
          width: '25%',
          sortable: false
        },
        {
          text: 'Не испр.',
          value: 'notFixed',
          width: '5%',
          sortable: false
        },
        {
          text: 'ФИО работника',
          value: 'workerName',
          width: '10%',
          sortable: false
        },
        {
          text: 'Код операции',
          value: 'codeOperation',
          width: '10%',
          sortable: false
        }
      ],
      factoryChecksTableSelectedRecords: [],
      factoryChecksTableRecords: [],
      factoryChecksTableHeaders: [
        {
          text: 'Дата пров',
          value: 'dateCheck',
          width: '33%',
          sortable: false
        },
        {
          text: 'Кол-во проверенных',
          value: 'numberOfVerified',
          width: '33%',
          sortable: false
        },
        {
          text: 'Кол-во операций с',
          value: 'numberOfOperationsWith',
          width: '33%',
          sortable: false
        }
      ],
      indivisibleOperationsTableSelectedRecords: [],
      indivisibleOperationsTableHeaders: [
        {
          text: 'Код з/п',
          value: 'indivisibleOperationsSallaryCode',
          width: '7%',
          sortable: false
        },
        {
          text: 'Модель',
          value: 'indivisibleOperationsModel',
          width: '15%',
          sortable: false
        },
        {
          text: 'Блок',
          value: 'indivisibleOperationsBlock',
          width: '15%',
          sortable: false
        },
        {
          text: 'Код операции',
          value: 'indivisibleOperationsCodeOperation',
          width: '12%',
          sortable: false
        },
        {
          text: 'ФИО',
          value: 'indivisibleOperationsFIO',
          width: '10%',
          sortable: false
        },
        {
          text: 'Кол-во операций',
          value: 'indivisibleOperationsQuantityOperations',
          width: '7%',
          sortable: false
        },
        {
          text: 'Дефект',
          value: 'indivisibleOperationsDefect',
          width: '15%',
          sortable: false
        },
        {
          text: 'Кол-во операций с дефектом',
          value: 'indivisibleOperationsQuantityOperationsWithDefect',
          width: '10%',
          sortable: false
        },
        {
          text: 'Таб.н',
          value: 'QuantityOperationsTab',
          width: '7%',
          sortable: false
        }
      ],
      indivisibleOperationsTableRecords: []
    }
  },

  methods: {
    close() {
      this.formOpened = false
      this.$emit('close')
    },
    updateSort(byDesc, event) {
      if (byDesc === 'by') {
        this.sortBy = event
      } else if (byDesc === 'desc') {
        this.sortDesc = event
      }
      this.page = 0
      this.baseDataTableRecords = []
      this.baseDataTableSelectedRecords = []
      this.keyLoading = Math.random()
    }
  }
}
</script>

<style lang="scss">
  .header-for-fields {
    font-weight: bold;
    font-size: 18px;
    padding-top: 32px;
  }
  #base-data-table {
    margin-top: 22px;
  }
  #base-data-table th,
  #found-in-base-table th,
  #factory-checks-table th,
  #indivisible-operations-table th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #639db1 !important;
    color: white;
    white-space: break-spaces;
  }
  #base-data-table td, #base-data-table th,
  #found-in-base-table td, #found-in-base-table th,
  #factory-checks-table td, #factory-checks-table th,
  #indivisible-operations-table td, #indivisible-operations-table th {
    border: 1px solid #ddd;
    word-break: break-all !important;
    padding: 0 0 !important;
    height: 0 !important;
  }
  .quantity-in-batch {
    font-size: 1rem;
  }
  .filters-checked-factory {
    border: 1px solid rgba(0, 0, 0, 0.6);
    padding-bottom: 0px;
  }
  .usage-filters-btn {
    margin-top: 25px;
    height: 85px;
  }
  .filters-header {
    padding-left: 50px;
  }
  .deffect-color {
    width: 100%;
    height: 50px;
    background-color: rgba(245, 166, 159);
    margin-top: 20px;
  }
</style>
