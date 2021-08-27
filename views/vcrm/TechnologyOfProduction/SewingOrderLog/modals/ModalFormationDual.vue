<template>
  <v-dialog
    id="modal-formation-dual"
    :value="value"
    persistent
    :fullscreen="true"
    @input="$emit('close')"
  >
    <v-card>
      <v-container>
        <v-card-title>
          Формирование спарок для {{ data.numZkzpsv }} {{ data.nameMc }}
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="1 d-flex">
              <div>
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <div
                      class="mr-1"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-btn
                        style="border-radius:50%; width: 40px; height: 40px;"
                        min-width="40px"
                        small
                        color="red"
                      >
                        <v-icon
                          color="white"
                        >
                          mdi-printer
                        </v-icon>
                      </v-btn>
                    </div>
                  </template>
                  <span>Печать размеров</span>
                </v-tooltip>
              </div>
              <div>
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <div
                      class="mr-1"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-btn
                        style="border-radius:50%; width: 40px; height: 40px;"
                        min-width="40px"
                        small
                        color="blue"
                      >
                        <v-icon
                          color="white"
                        >
                          mdi-printer
                        </v-icon>
                      </v-btn>
                    </div>
                  </template>
                  <span>Печать раскладок</span>
                </v-tooltip>
              </div>
            </v-col>

            <v-col cols="2">
              <v-autocomplete
                v-model="item.typeOfFabric"
                label="Вид ткани"
                :loading="loadingType.typeOfFabrics"
                :items="typeOfFabrics"
                item-value="id"
                item-text="typeOfFabric"
                outlined
                hide-details="auto"
              />
            </v-col>
            <v-spacer />
            <v-col cols="5">
              <v-row>
                <v-col cols="2">
                  <v-subheader class="mt-1 font-weight-bold">
                    Формула:
                  </v-subheader>
                </v-col>
                <v-col cols="10">
                  <div class="d-flex justify-content-between">
                    <div class="formula d-flex pt-4">
                      <p class="mx-2 mt-1">+</p>
                      <div class="formula-input">
                        <vue-numeric
                          v-model.number="item.valCm1"
                          separator="space"
                          :precision="1"
                          decimal-separator="."
                          output-type="number"
                        />
                      </div>
                      <p class="mx-2 mt-1">см  +</p>
                      <div class="formula-input">
                        <vue-numeric
                          v-model.number="item.valPercent"
                          separator="space"
                          :precision="1"
                          decimal-separator="."
                          output-type="number"
                        />
                      </div>
                      <p class="mx-2 mt-1">%  +</p>
                      <div class="formula-input">
                        <vue-numeric
                          v-model.number="item.valCm2"
                          separator="space"
                          :precision="1"
                          decimal-separator="."
                          output-type="number"
                        />
                      </div>
                      <p class="mx-2 mt-1">см</p>
                    </div>
                    <p class="mt-5 mx-2">*  кол-во в спарке</p>
                    <v-btn
                      class="mt-4 ml-3"
                      elevation="2"
                      outlined
                      small
                    >
                      Пересчитать
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="4">
              <v-row>
                <v-col cols="2">
                  <v-subheader class="mt-1 font-weight-bold">
                    Ткани:
                  </v-subheader>
                </v-col>
                <v-col cols="10">
                  <v-row>
                    <v-col
                      cols="2"
                      class="pb-0"
                      style="height: 75px"
                    >
                      <v-text-field
                        v-model="item.fabric.val1"
                        outlined=""
                      />
                    </v-col>
                    <v-col
                      cols="2"
                      class="pb-0"
                      style="height: 75px"
                    >
                      <v-text-field
                        v-model="item.fabric.val2"
                        outlined=""
                      />
                    </v-col>
                    <v-col
                      cols="2"
                      class="pb-0"
                      style="height: 75px"
                    >
                      <v-text-field
                        v-model="item.fabric.val3"
                        outlined=""
                      />
                    </v-col>
                    <v-col
                      cols="2"
                      class="pb-0"
                      style="height: 75px"
                    >
                      <v-text-field
                        v-model="item.fabric.val4"
                        outlined=""
                      />
                    </v-col>
                    <v-col
                      cols="2"
                      class="pb-0"
                      style="height: 75px"
                    >
                      <v-text-field
                        v-model="item.fabric.val5"
                        outlined=""
                      />
                    </v-col>
                    <v-col
                      cols="10"
                      class="pt-0"
                    >
                      <v-btn
                        elevation="2"
                        outlined
                        block
                      >
                        Расход, м/настил
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="4"
            >
              <v-subheader class="font-weight-bold table-header pl-0">
                Размеры в заказе
              </v-subheader>
              <v-data-table
                id="size-in-order-table"
                v-model="selectedSizeInOrder"
                height="600"
                :headers="sizeInOrderHeaders"
                fixed-header
                :items="sizeInOrderItems"
                :show-select="false"
                :single-select="false"
                disable-pagination
                hide-default-footer
                class="elevation-1"
              />
              <div class="d-flex total-size-in-order mt-2">
                <v-subheader class="font-weight-bold">
                  Всего
                </v-subheader>
                <div style="width: 80px">
                  <v-text-field
                    v-model="totalSizeInOrder"
                    type="number"
                    outlined
                    readonly
                  />
                </div>
              </div>
            </v-col>

            <v-col
              cols="2"
              class="middle-block"
            >
              <div class="add-btn">
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      color="blue"
                      class="mr-2 mb-2"
                      style="border-radius:50%; width: 40px; height: 40px;"
                      min-width="40px"
                      dark
                      small
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-arrow-right</v-icon>
                    </v-btn>
                  </template>
                  <span>Добавить</span>
                </v-tooltip>
              </div>

              <v-checkbox
                v-model="item.newDual"
                label="Создать новую спарку"
              />
              <v-checkbox
                v-model="item.addInDual"
                label="Добавить в выбранную спарку"
              />
              <v-checkbox
                v-model="item.splitSize"
                label="Разбить 1 размер для одной спарки"
              />
              <v-text-field
                v-model="item.quantityRepeat"
                label="Кол-во повторений"
                type="number"
                outlined
              />
              <v-text-field
                v-model="item.quantityLayers"
                label="Кол-во слоев в настиле"
                type="number"
                outlined
              />
              <div class="description">
                <p class="mb-0">Удалить размер из спарки - двойной клик по ячейке с размером</p>
              </div>
              <div class="description">
                <p class="mb-0">Размножить расход ткани приклада - правая кнопка мыши в столбце приклада</p>
              </div>
            </v-col>

            <v-col
              cols="6"
              style="position: relative"
            >
              <v-subheader class="font-weight-bold table-header pl-0">
                Спарки
              </v-subheader>
              <div
                class="d-flex"
                style="position: absolute; z-index: 5;"
              >
                <div class="size-rows">
                  <span>
                    Размеры
                  </span>
                </div>
                <div class="buttstock-rows">
                  <span>
                    Приклад
                  </span>
                </div>
              </div>
              <v-data-table
                id="sparks-table"
                v-model="selectedDual"
                height="600"
                :headers="dualHeaders"
                fixed-header
                :items="dualItems"
                :show-select="false"
                :single-select="false"
                disable-pagination
                hide-default-footer
                class="elevation-1"
              />
              <div class="d-flex total-sparks mt-2">
                <v-subheader class="font-weight-bold">
                  Всего
                </v-subheader>
                <div style="width: 60px; padding-right: 5px;">
                  <v-text-field
                    v-model="totalSparks1"
                    type="number"
                    outlined
                    readonly
                  />
                </div>
                <div style="width: 60px; padding-right: 5px;">
                  <v-text-field
                    v-model="totalSparks2"
                    type="number"
                    outlined
                    readonly
                  />
                </div>
                <div style="width: 60px; padding-right: 5px;">
                  <v-text-field
                    v-model="totalSparks3"
                    type="number"
                    outlined
                    readonly
                  />
                </div>
                <div style="width: 60px; padding-right: 5px;">
                  <v-text-field
                    v-model="totalSparks4"
                    type="number"
                    outlined
                    readonly
                  />
                </div>
                <div style="width: 60px; padding-right: 5px;">
                  <v-text-field
                    v-model="totalSparks5"
                    type="number"
                    outlined
                    readonly
                  />
                </div>
              </div>
              <div class="d-flex total-sparks-under">
                <v-subheader class="font-weight-bold">
                  Расход на одно изделие
                </v-subheader>
                <div style="width: 60px; padding-right: 5px;">
                  <v-text-field
                    v-model="totalSparks1under"
                    type="number"
                    outlined
                    readonly
                  />
                </div>
                <div style="width: 60px; padding-right: 5px;">
                  <v-text-field
                    v-model="totalSparks2under"
                    type="number"
                    outlined
                    readonly
                  />
                </div>
                <div style="width: 60px; padding-right: 5px;">
                  <v-text-field
                    v-model="totalSparks3under"
                    type="number"
                    outlined
                    readonly
                  />
                </div>
                <div style="width: 60px; padding-right: 5px;">
                  <v-text-field
                    v-model="totalSparks4under"
                    type="number"
                    outlined
                    readonly
                  />
                </div>
                <div style="width: 60px; padding-right: 5px;">
                  <v-text-field
                    v-model="totalSparks5under"
                    type="number"
                    outlined
                    readonly
                  />
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="$emit('close')"
          >
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'ModalFormationDual',

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
      totalSparks: 0,
      totalSizeInOrder: 0,

      // сори за корявый нэйминг, всё равно все названия поменяются в момент написания логики
      totalSparks1: 0,
      totalSparks2: 0,
      totalSparks3: 0,
      totalSparks4: 0,
      totalSparks5: 0,
      totalSparks1under: 0,
      totalSparks2under: 0,
      totalSparks3under: 0,
      totalSparks4under: 0,
      totalSparks5under: 0,

      item: {
        fabric: {},
        newDual: true
      },
      typeOfFabrics: [],
      loadingType: {
        typeOfFabrics: false
      },
      selectedSizeInOrder: [],
      sizeInOrderItems: [],
      sizeInOrderHeaders: [
        {
          text: '№',
          value: 'num',
          width: '7%',
          sort: () => false
        },
        {
          text: 'Размер/рост',
          value: 'size',
          width: '23%',
          sort: () => false
        },
        {
          text: 'Кол-во в заявке',
          value: 'quantityInOrder',
          width: '20%',
          sort: () => false
        },
        {
          text: 'Кол-во в заявке',
          value: 'quantityInDuals',
          width: '15%',
          sort: () => false
        },
        {
          text: 'Остаток',
          value: 'remains',
          width: '15%',
          sort: () => false
        },
        {
          text: 'Номер спарки',
          value: 'numSpark',
          width: '15%',
          sort: () => false
        },
        {
          text: 'Выбор',
          value: 'choice',
          width: '5%',
          sort: () => false
        }
      ],
      selectedDual: [],
      dualHeaders: [
        {
          text: '№ спарки',
          value: 'numDual',
          width: '7%',
          sort: () => false
        },
        {
          text: '1',
          value: 'size1',
          width: '10%',
          class: 'size-sell',
          sort: () => false
        },
        {
          text: '2',
          value: 'size2',
          width: '10%',
          class: 'size-sell',
          sort: () => false
        },
        {
          text: '3',
          value: 'size3',
          width: '10%',
          class: 'size-sell',
          sort: () => false
        },
        {
          text: '4',
          value: 'size4',
          width: '10%',
          class: 'size-sell',
          sort: () => false
        },
        {
          text: '5',
          value: 'size5',
          width: '10%',
          class: 'size-sell',
          sort: () => false
        },
        {
          text: 'Кол-во слоев в настиле',
          value: 'quantityLayers',
          width: '7%',
          sort: () => false
        },
        {
          text: 'Ткань верха',
          value: 'upperFabric',
          width: '7%',
          sort: () => false
        },
        {
          text: 'Подкладка',
          value: 'lining',
          width: '7%',
          sort: () => false
        },
        {
          text: '1',
          value: 'buttstock1',
          class: 'size-sell',
          width: '7%',
          sort: () => false
        },
        {
          text: '2',
          value: 'buttstock2',
          class: 'size-sell',
          width: '8%',
          sort: () => false
        },
        {
          text: '3',
          value: 'buttstock3',
          class: 'size-sell',
          width: '7%',
          sort: () => false
        }
      ],
      dualItems: []
    }
  }
}
</script>

<style lang="scss">
  #sparks-table .size-sell {
    padding-top: 15px !important;
  }
  #size-in-order-table,
  #sparks-table {
    border-collapse: collapse;
    width: 100%;
  }

  #size-in-order-table table,
  #sparks-table table {
    width: 100%;
  }

  #size-in-order-table td, #size-in-order-table th,
  #sparks-table td, #sparks-table th {
    border: 1px solid #ddd;
    word-break: break-all !important;
    padding: 0 0 !important;
    height: 0 !important;
  }

  #size-in-order-table th,
  #sparks-table th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #639db1 !important;
    color: white;
  }
  .table-header {
    font-size: 20px;
  }
  .formula {
    .formula-input {
      width: 47px;
      border: 1px solid rgba(0, 0, 0, 0.5);
      border-radius: 5px;
      height: max-content;
      padding: 2px;
    }
    input {
      width: 40px;
    }
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 5px;
  }
  .size-rows {
    width: 425px;
    margin-left: 60px;
    text-align: center;
    font-size: 12px;
    color: #fff;
    background-color: #639db1;
    border-bottom: 1px solid #fff;
  }
  .buttstock-rows {
    width: 185px;
    margin-left: 180px;
    text-align: center;
    font-size: 12px;
    color: #fff;
    background-color: #639db1;
    border-bottom: 1px solid #fff;
  }
  .middle-block {
    margin-top: 70px;
  }
  .add-btn {
    width: 100%;
    text-align: center;
  }
  .description {
    margin-bottom: 10px;
    padding: 10px;
    font-size: 12px;
    color: rgb(184, 75, 206);
    border: 1px solid rgb(184, 75, 206);
  }
  .total-size-in-order {
    margin-left: 210px;
  }
  .total-size-in-order input{
    width: 80px;
  }
  .total-sparks {
    margin-left: 400px;
    height: 60px;
  }
  .total-sparks-under {
    margin-left: 277px;
  }
</style>
