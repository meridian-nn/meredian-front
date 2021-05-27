<template>
  <v-container
    class="py-6 px-6"
    fluid
  >
    <v-row>
      <v-col cols="2">
        <v-text-field
          v-model="newLeadsSearch"
          append-icon="mdi-magnify"
          label="Поиск"
        />
      </v-col>

      <v-spacer />

      <v-col cols="4">
        <div class="barcode-form-gtin-main">
          <button
            class="barcode-form-gtin-btn"
            @click="$router.push({name: 'MarkPage'})"
          >
            Маркировка
          </button>
        </div>
      </v-col>
    </v-row>

    <v-data-table
      id="barcode-form-gtin-table"
      fixed-header
      height="760"
      disable-pagination
      hide-default-footer
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

      <template #item="{ item, index }">
        <tr>
          <td
            v-for="(field, i) in item"
            :key="i"
            class="text-wrap"
          >
            {{ field }}
          </td>

          <td class="text-right">
            <v-icon
              small
              class="mr-2"
              @click="openMark(index)"
            >
              mdi-plus
            </v-icon>

            <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>

            <!-- <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon> -->
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog
      v-model="dialogDelete"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="headline">
          Вы действительно хотите удалить?
        </v-card-title>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="closeDelete"
          >
            Отмена
          </v-btn>

          <v-btn
            color="blue darken-1"
            text
            @click="deleteItemConfirm"
          >
            OK
          </v-btn>

          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogMark"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="headline">
          Заказ кодов маркировки
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="mark.markCodeQuantity"
                  label="Количество"
                />
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="mark.productionOrderId"
                  label="Номер заказа"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="blue darken-1"
            text
            @click="dialogMark = false"
          >
            Отмена
          </v-btn>

          <v-btn
            color="blue darken-1"
            text
            :loading="loading"
            @click="addMarkCode"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialog"
      max-width="1000px"
    >
      <template #activator="{ on, attrs }">
        <v-fab-transition>
          <v-btn
            id="gtin-page-add-new-gtin"
            color="blue"
            class="mr-2 mb-2"
            fab
            dark
            small
            fixed
            bottom
            right
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>

      <v-card>
        <v-card-title>
          <span class="headline">{{ title }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-tabs v-model="activeTab">
                  <v-tab>Одежда</v-tab>
                  <v-tab>Обувь</v-tab>
                </v-tabs>
              </v-col>

              <v-col cols="8">
                <v-text-field
                  v-model="editedItem.prodName"
                  label="Название"
                />
              </v-col>

              <v-col cols="4">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="date"
                      label="Picker in menu"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="date"
                    no-title
                    scrollable
                  >
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="menu = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu.save(date)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="editedItem.categoryId"
                  label="id категории"
                />
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="editedItem.brand"
                  label="Брэнд"
                />
              </v-col>

              <v-col cols="4">
                <v-autocomplete
                  v-model="editedItem.packType"
                  :items="packTypeList"
                  label="Тип упаковки"
                />
              </v-col>

              <v-col cols="4">
                <v-autocomplete
                  v-model="editedItem.packMaterial"
                  :items="materialList"
                  label="Материал упаковки"
                />
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="editedItem.quantity"
                  type="number"
                  label="Количество"
                />
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="editedItem.companyName"
                  label="Название компании"
                />
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="editedItem.inn"
                  label="Инн"
                />
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="editedItem.tnved"
                  label="Tnved"
                />
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="editedItem.measure"
                  label="Название количества"
                />
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="editedItem.gcpclBrick"
                  label="Категория по классификации GS1 GPC"
                />
              </v-col>

              <v-col cols="4">
                <v-autocomplete
                  v-model="editedItem.kind"
                  :items="typesList"
                  label="Тип"
                />
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="editedItem.sizeName"
                  label="Название размера"
                />
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="editedItem.sizeValue"
                  label="Размер значения"
                />
              </v-col>

              <v-col cols="4">
                <v-autocomplete
                  v-model="editedItem.color"
                  :items="colorList"
                  label="Цвет"
                />
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="editedItem.model"
                  label="Модель"
                />
              </v-col>

              <v-col cols="4">
                <v-select
                  v-model="editedItem.gender"
                  :items="genderList"
                  label="Пол"
                />
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="editedItem.standartNumber"
                  label="Технический стандарт"
                />
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="editedItem.rawMaterial"
                  label="Материал"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="blue darken-1"
            text
            @click="close"
          >
            Отмена
          </v-btn>

          <v-btn
            color="blue darken-1"
            text
            :loading="loading"
            @click="save"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import omit from 'lodash/omit'
export default {
  name: 'GtinPage',

  data() {
    return {
      activeTab: 0,
      date: new Date().toISOString().substr(0, 10),
      loading: false,
      newLeadsSearch: '',
      dialog: false,
      dialogDelete: false,
      dialogMark: false,
      desserts: [],
      activeFilters: {},
      editedIndex: -1,
      fullDesserts: [],
      filters: { 'code': [], 'prodName': [], 'color': [], 'model': [], 'sizeValue': [], 'sizeName': [], 'kind': [], 'brand': [], 'packType': [], 'packMaterial': [] },

      genderList: [
        'ЖЕНСКИЙ',
        'МУЖСКОЙ',
        'БЕЗ УКАЗАНИЯ ПОЛА',
        'УНИВЕРСАЛЬНЫЙ (УНИСЕКС)'
      ],

      packTypeList: [
        'БЕЗ УПАКОВКИ',
        'НЕТ В СПРАВОЧНИКЕ',
        'НЕ УКАЗАН',
        'АМПУЛА',
        'АЭРОЗОЛЬНАЯ УПАКОВКА',
        'БАЛЛОН',
        'БАНКА МЕТАЛЛИЧЕСКАЯ',
        'БАНКА МЕТАЛЛИЧЕСКАЯ ДЛЯ КОНСЕРВИРОВАНИЯ',
        'БАНКА МЕТАЛЛИЧЕСКАЯ ДЛЯ НАПИТКОВ',
        'БАНКА НЕМЕТАЛЛИЧЕСКАЯ',
        'БАНКА СТЕКЛЯННАЯ',
        'БАРАБАН',
        'БИГ-БЭГ (МЯГКИЙ КОНТЕЙНЕР)',
        'БЛИСТЕРНАЯ УПАКОВКА',
        'БЛОК',
        'БОЧКА',
        'БОЧОНОК',
        'БУТЫЛКА',
        'БЭГ-ИН-БОКС',
        'ВАКУУМНАЯ УПАКОВКА',
        'ВЕДРО',
        'ГОРШОК',
        'ГОФРОКОРОБ',
        'ДВОЙНОЙ БЛИСТЕР/CLAMSHELL',
        'ДОЙПАК',
        'КАДКА',
        'КАНИСТРА',
        'КАРТОЧКА',
        'КАТУШКА',
        'КЕГ',
        'КЕЙС ДЛЯ БАНОК',
        'КЕЙС/ЧЕХОЛ/ФУТЛЯР',
        'КИПА',
        'КЛЕТЬ',
        'КОЛБАСНАЯ ОБОЛОЧКА',
        'КОНВЕРТ',
        'КОНТЕЙНЕР (ПОТРЕБИТЕЛЬСКИЙ)',
        'КОНТЕЙНЕР ДЛЯ ПРОДУКТОВ ПИТАНИЯ',
        'КОНТЕЙНЕР МЕДИЦИНСКИЙ МЯГКИЙ',
        'КОНТУРНАЯ БЕЗЪЯЧЕЙКОВАЯ УПАКОВКА',
        'КОНУС',
        'КОРЗИНА',
        'КОРОБКА С ПОДДОНОМ',
        'КОРОБКА/БОКС',
        'КУБОВЫЙ КОНТЕЙНЕР (IBC) ГИБКИЙ',
        'КУБОВЫЙ КОНТЕЙНЕР (IBC) ЖЁСТКИЙ',
        'КУВШИН',
        'ЛОТОК',
        'ЛОТОК/ПОДНОС',
        'МЕШОК',
        'МУЛЬТИПАК',
        'НА ВЕШАЛКЕ',
        'ОБВЯЗОЧНОЕ СРЕДСТВО/ОБВЯЗКА',
        'ОБЕРНУТО В ПЛЕНКУ',
        'ОБЕРТКА',
        'ОДНОРАЗОВАЯ ОБОЛОЧКА',
        'ПАКЕТ',
        'ПАКЕТ БЕЗ ФОРМЫ',
        'ПАКЕТ ПРЯМОУГОЛЬНЫЙ',
        'ПАКЕТ С БОКОВЫМИ СКЛАДКАМИ',
        'ПАКЕТ С ДОННОЙ СКЛАДКОЙ',
        'ПАКЕТ ТРЕУГОЛЬНЫЙ',
        'ПАЧКА',
        'ПОВТОРНО ЗАКРЫВАЕМАЯ УПАКОВКА',
        'ПОДДОН/ПАЛЛЕТА',
        'ПОДДОН/ПАЛЛЕТА ВОЗВРАТНАЯ',
        'ПОДДОН/ПАЛЛЕТА НЕВОЗВРАТНАЯ',
        'ПРОБИРКА МЕДИЦИНСКАЯ',
        'РУКАВ',
        'РУЛОН',
        'САШЕ',
        'СВЯЗКА',
        'СЕТКА',
        'СТАКАН',
        'СТАКАНЧИК',
        'СТРЕТЧ-ПЛЁНКА',
        'СУМКА',
        'ТАРА С ОКОШКОМ',
        'ТЕЛЕЖКА',
        'ТЕРМОУСАДОЧНАЯ/УСАДОЧНАЯ УПАКОВКА',
        'ТЕТРА ПАК',
        'ТЕТРА ФИНО АСЕПТИК',
        'ТОРТНИЦА',
        'ТРАНСПОРТНЫЙ ПАКЕТ',
        'ТУБА',
        'ТУБУС',
        'УПАКОВКА ИЗ УСАДОЧНОЙ ПЛЕНКИ',
        'УПАКОВКА С ПУЛЬВЕРИЗАТОРОМ',
        'ФЛАКОН',
        'ФЛОУПАК',
        'ФЛЯГА',
        'ФУТЛЯР',
        'ЦИЛИНДР/ТУБУС',
        'ШОУ-БОКС',
        'ШПРИЦ',
        'ЯЧЕИСТАЯ УПАКОВКА',
        'ЯЩИК'
      ],

      materialList: [
        'БЕЗ УПАКОВКИ',
        'НЕ УКАЗАН',
        'НЕТ В СПРАВОЧНИКЕ',
        'АЛЮМИНИЙ',
        'АЦЕТАТ ЦЕЛЛЮЛОЗЫ',
        'БИОПЛАСТИК',
        'БРЕЗЕНТ',
        'БУМАГА',
        'БУМАГА - ДРУГОЕ',
        'БУМАГА ВИСКОЗНАЯ',
        'БУМАГА ГОФРИРОВАННАЯ',
        'ВИНИЛ',
        'ВОЛОКНО',
        'ВСПЕНЕННЫЙ ПОЛИСТИРОЛ',
        'ГОФРОКАРТОН ДВУХСЛОЙНЫЙ',
        'ГОФРОКАРТОН ПЯТИСЛОЙНЫЙ',
        'ГОФРОКАРТОН СЕМИСЛОЙНЫЙ',
        'ГОФРОКАРТОН ТРЕХСЛОЙНЫЙ',
        'ДЖУТ',
        'ДРЕВЕСИНА',
        'ДРЕВЕСИНА МЯГКАЯ',
        'ДРЕВЕСИНА ТВЕРДАЯ',
        'ДРЕВЕСНО-СТРУЖЕЧНАЯ ПЛИТА (ДСтП)',
        'ДРЕВЕСНОВОЛОКНИСТАЯ ПЛИТА (ДВП)',
        'ДРЕВЕСНОВОЛОКНИСТАЯ ПЛИТА СРЕДНЕЙ ПЛОТНОСТИ (МДФ)',
        'ЖЕЛЕЗО',
        'ЖЕСТЬ',
        'ЗАМША',
        'ИСКУССТВЕННАЯ ОБОЛОЧКА',
        'КАРБОНАТ КАЛЬЦИЯ',
        'КАРТОН',
        'КАРТОН ЛАМИНИРОВАННЫЙ',
        'КЕРАМИКА',
        'КОЖА',
        'КОМБИНИРОВАННЫЙ МАТЕРИАЛ',
        'ЛАТУНЬ',
        'ЛЁН',
        'ЛИНЕЙНЫЙ ПОЛИЭТИЛЕН НИЗКОЙ ПЛОТНОСТИ (LLDPE)',
        'МЕТАЛЛ',
        'МЕШКОВИНА',
        'МИНЕРАЛ',
        'МНОГОСЛОЙНЫЙ ПОДЕЛОЧНЫЙ КАРТОН',
        'НАТУРАЛЬНАЯ ОБОЛОЧКА',
        'НАТУРАЛЬНЫЙ КАУЧУК',
        'НЕЙЛОН',
        'ОЛОВО',
        'ОРИЕНТИРОВАННО-СТРУЖЕЧНАЯ ПЛИТА (ОСП)',
        'ПЕНОМАТЕРИАЛ',
        'ПЕНЬКА',
        'ПЕРГАМЕНТ',
        'ПЛАСТМАССА',
        'ПЛЕНОЧНЫЕ МАТЕРИАЛЫ ВЫСОКОБАРЬЕРНЫЕ',
        'ПЛЕНОЧНЫЕ МАТЕРИАЛЫ СРЕДНЕБАРЬЕРНЫЕ',
        'ПОЛИАКРИЛОНИТРИЛ (PAN)',
        'ПОЛИАМИД',
        'ПОЛИВИНИЛИДЕНХЛОРИД (PVDC)',
        'ПОЛИВИНИЛОВЫЙ СПИРТ (PVA)',
        'ПОЛИВИНИЛХЛОРИД (PVC)',
        'ПОЛИГИДРОКСИАЛКАНОАТ (PHA)',
        'ПОЛИКАПРОЛАКТОН (PCL)',
        'ПОЛИКАРБОНАТ (PC)',
        'ПОЛИЛАКТИД (PLA)',
        'ПОЛИМЕР',
        'ПОЛИОЛЕФИН',
        'ПОЛИПРОПИЛЕН',
        'ПОЛИСТИРОЛ',
        'ПОЛИУРЕТАН (PU)',
        'ПОЛИЭТИЛЕН (PE)',
        'ПОЛИЭТИЛЕН ВЫСОКОЙ ПЛОТНОСТИ (HDPE)',
        'ПОЛИЭТИЛЕН НИЗКОЙ ПЛОТНОСТИ (LDPE)',
        'ПОЛИЭТИЛЕН СРЕДНЕЙ ПЛОТНОСТИ (MDPE)',
        'ПОЛИЭТИЛЕННАФТАЛАН (PEN)',
        'ПОЛИЭТИЛЕНТЕРЕФТАЛАТ (ПЭТ/ПЭТФ)',
        'ПРОВОЛОКА',
        'РЕЗИНА',
        'СВИНЕЦ',
        'СТАЛЬ',
        'СТАЛЬ НЕРЖАВЕЮЩАЯ',
        'СТАЛЬ/ЖЕЛЕЗО',
        'СТЕКЛО',
        'СТЕКЛО ЦВЕТНОЕ',
        'ТАЛЬК',
        'ТЕРМОПЛАСТИК',
        'ТЕРМОПЛАСТИЧНЫЙ КРАХМАЛ (TPS)',
        'ТКАНЬ',
        'ФАНЕРА',
        'ФАРФОР',
        'ФОЛЬГА',
        'ФОРМОВАННОЕ БУМАЖНОЕ ВОЛОКНО',
        'ХЛОПОК',
        'ЦЕЛЛОФАН',
        'ЧУГУН',
        'ЭПОКСИДНАЯ СМОЛА',
        'ЭТИЛЕНВИНИЛАЦЕТАТ (EVA)',
        'ЭТИЛЕНВИНИЛОВЫЙ СПИРТ (EVOH)',
        'НЕ ПРИМЕНИМО'
      ],

      typesList: [
        'ДЕТСКИЙ КОМБИНЕЗОН',
        'КОМБИНЕЗОН',
        'ПОЛУКОМБИНЕЗОН',
        'БЛУЗА',
        'ВЕРХНЯЯ СОРОЧКА',
        'ПОЛО',
        'РУБАШКА',
        'ФУТБОЛКА',
        'ФУФАЙКА',
        'ТУНИКА',
        'АНОРАК',
        'ВЕТРОВКА',
        'ДОЖДЕВИК',
        'КУРТКА',
        'ЗАЩИТНАЯ ФОРМА',
        'ЗАЩИТНЫЙ КОМБИНЕЗОН/КОСТЮМ',
        'ЗАЩИТНЫЙ ФАРТУК С НАГРУДНИКОМ',
        'КОСУХА',
        'ПАЛЬТО',
        'ПАРКА',
        'ПЛАЩ',
        'ПОЛУПАЛЬТО',
        'ПУХОВИК',
        'БЕЗРУКАВКА',
        'БЛЕЙЗЕР',
        'ЖАКЕТ',
        'ЖИЛЕТ',
        'КАРДИГАН',
        'КОФТА',
        'КУРТКА-ПИЛОТ (БОМБЕР)',
        'НАКИДКА',
        'ПИДЖАК',
        'ПОНЧО',
        'РАСПАШОНКА',
        'РУБАШЕЧКА ДЛЯ НОВОРОЖДЕННЫХ',
        'СПОРТИВНЫЙ ПИДЖАК',
        'ТОЛСТОВКА/ХУДИ',
        'БРЮКИ',
        'ШОРТЫ',
        'БРИДЖИ',
        'КЮЛОТЫ',
        'КАПРИ',
        'БОДИ',
        'КОСТЮМ',
        'ЮБКА',
        'ЮБКА-ШОРТЫ',
        'ЮБКА-БРЮКИ'
      ],

      colorList: [
        'БЕЖЕВЫЙ',
        'БЕЖЕВЫЙ МЕЛАНЖ',
        'БЕЛО-РОЗОВЫЙ',
        'БЕЛЫЙ',
        'БЕЛЫЙ/СЕРЫЙ',
        'БИРЮЗОВЫЙ',
        'БОРДОВЫЙ',
        'БРОНЗОВЫЙ',
        'В АССОРТИМЕНТЕ',
        'ВАНИЛЬ',
        'ВИШНЯ',
        'ГОЛУБОЙ',
        'ЖЁЛТЫЙ',
        'ЗЕЛЁНЫЙ',
        'ЗОЛОТИСТЫЙ',
        'ЗОЛОТОЙ',
        'ИЗУМРУДНЫЙ',
        'КАПУЧИНО',
        'КИРПИЧНЫЙ',
        'КОРАЛЛОВЫЙ',
        'КОРИЧНЕВЫЙ',
        'КРАСНЫЙ',
        'ЛАЙМ',
        'ЛЕОПАРД',
        'МАЛИНОВЫЙ',
        'МЕДНЫЙ',
        'МОЛОЧНЫЙ',
        'МЯТНЫЙ',
        'НАТУРАЛЬНЫЙ',
        'НИКЕЛЬ',
        'ОЛИВКОВЫЙ',
        'ОРАНЖЕВЫЙ',
        'ПЕСОЧНЫЙ',
        'ПЕРСИКОВЫЙ',
        'ПРОЗРАЧНЫЙ',
        'ПУРПУРНЫЙ',
        'РАЗНОЦВЕТНЫЙ',
        'РОЗОВО-БЕЖЕВЫЙ',
        'РОЗОВЫЙ',
        'РЫЖИЙ',
        'СВЕТЛО-БЕЖЕВЫЙ',
        'СВЕТЛО-ЗЕЛЕНЫЙ',
        'СВЕТЛО-КОРИЧНЕВЫЙ',
        'СВЕТЛО-РОЗОВЫЙ',
        'СВЕТЛО-СЕРЫЙ',
        'СВЕТЛО-СЕРЫЙ МЕЛАНЖ',
        'СВЕТЛО-СИНИЙ',
        'СВЕТЛО-ФИОЛЕТОВЫЙ',
        'СЕРЕБРЯНЫЙ',
        'СЕРО-ЖЕЛТЫЙ',
        'СЕРО-ГОЛУБОЙ',
        'СЕРЫЙ',
        'СЕРЫЙ МЕЛАНЖ',
        'СИНИЙ',
        'СИРЕНЕВЫЙ/ЛИЛОВЫЙ',
        'СЛИВОВЫЙ',
        'СЛОНОВАЯ КОСТЬ',
        'ТЕМНО-БЕЖЕВЫЙ',
        'ТЕМНО-ЗЕЛЕНЫЙ',
        'ТЕМНО-КОРИЧНЕВЫЙ',
        'ТЕМНО-РОЗОВЫЙ',
        'ТЕМНО-СЕРЫЙ',
        'ТЕМНО-СЕРЫЙ МЕЛАНЖ',
        'ТЕМНО-СИНИЙ',
        'ТЕМНО-ФИОЛЕТОВЫЙ',
        'ТЕРРАКОТОВЫЙ',
        'ФИОЛЕТОВЫЙ',
        'ФУКСИЯ',
        'ХАКИ',
        'ХАКИ/ОЛИВКОВЫЙ',
        'ЧЕРНЫЙ',
        'ЧЕРНЫЙ/БЕЛЫЙ',
        'ЧЕРНЫЙ/ЗОЛОТИСТЫЙ',
        'ЧЕРНЫЙ/СЕРЫЙ',
        'ШОКОЛАДНЫЙ',
        'НЕ КЛАССИФИЦИРОВАНО',
        'НЕ ОПРЕДЕЛЕНО'
      ],

      mark: {
        productionOrderId: '',
        markCodeQuantity: ''
      },

      markItem: {},

      editedItem: {
        categoryId: '31326',
        prodName: '',
        brand: '',
        packType: '',
        packMaterial: '',
        quantity: '',
        types: '',
        sizeName: '',
        sizeValue: '',
        color: '',
        country: 'RU',
        kind: '',
        gcpclBrick: '',
        measure: '',
        inn: '5259003336 (Меридиан)',
        model: '',
        gender: '',
        standartNumber: '',
        rawMaterial: '',
        companyName: 'meridian',
        manufacturerCode: '4650067329994',
        tnved: '',
        trademark: 'Меридиан',
        apiExtension: this.activeTab === 0 ? 'lp' : 'lg',
        status: 'NOT_PROCESSED'
      },

      defaultItem: {
        categoryId: '31326',
        prodName: '',
        brand: '',
        packType: '',
        packMaterial: '',
        quantity: '',
        types: '',
        sizeName: '',
        sizeValue: '',
        color: '',
        country: 'RU',
        kind: '',
        gcpclBrick: '',
        measure: '',
        inn: '5259003336 (Меридиан)',
        model: '',
        gender: '',
        standartNumber: '',
        rawMaterial: '',
        companyName: 'meridian',
        manufacturerCode: '4650067329994',
        tnved: '',
        trademark: 'Меридиан',
        apiExtension: this.activeTab === 0 ? 'lp' : 'lg',
        status: 'NOT_PROCESSED'
      }
    }
  },

  async fetch() {
    const { content } = await this.$api.code.gtinCodeList()

    this.fullDesserts = content

    const gtinRequest = this.fullDesserts.map((item) => {
      return { code: item.code, ...item.gtinRequest }
    })

    this.desserts = gtinRequest.map(item => omit(item, ['id', 'categoryId', 'quantity', 'publicationDate', 'trademark', 'tnved', 'manufacturerCode', 'measure', 'gcpclBrick', 'inn', 'country', 'apiExtension', 'rawMaterial', 'companyName']))
  },

  computed: {
    headers() {
      return [
        {
          text: 'Gtin',
          value: 'code',
          width: '150px',
          filter: (value) => {
            return this.activeFilters.code ? this.activeFilters.code.includes(value) : true
          }
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
          text: 'Тип',
          value: 'kind',
          width: '120px',
          sortable: true,
          filter: (value) => {
            return this.activeFilters.kind ? this.activeFilters.kind.includes(value) : true
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
        },
        { text: 'Действия', width: '130px', align: 'right', value: 'actions', sortable: false }
      ]
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Добавить элемент' : 'Редактировать'
    }
  },

  watch: {
    activeTab(val) {
      this.defaultItem.apiExtension = val === 1 ? 'LP' : 'SHOES'

      this.editedItem.apiExtension = val === 1 ? 'LP' : 'SHOES'
    },

    dialog(val) {
      val || this.close()
    },

    dialogDelete(val) {
      val || this.closeDelete()
    },

    desserts() {
      this.initFilters()
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
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    openMark(index) {
      this.markItem = this.fullDesserts[index]

      this.dialogMark = true
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save() {
      this.loading = true

      try {
        await this.$api.code.gtinCodeList(
          this.editedIndex > -1 ? Object.assign(this.fullDesserts[this.editedIndex], this.editedItem) : this.editedItem)

        await this.$fetch()

        this.close()
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },

    async addMarkCode() {
      const request = {
        ...this.mark,
        cisType: 'UNIT',
        'gtinRequest.apiExtension': this.markItem.gtinRequest.apiExtension,
        'gtinRequest.brand': this.markItem.gtinRequest.brand,
        'gtinRequest.categoryId': this.markItem.gtinRequest.categoryId,
        'gtinRequest.color': this.markItem.gtinRequest.color,
        'gtinRequest.companyName': this.markItem.gtinRequest.companyName,
        'gtinRequest.country': this.markItem.gtinRequest.country,
        'gtinRequest.gcpclBrick': this.markItem.gtinRequest.gcpclBrick,
        'gtinRequest.gender': this.markItem.gtinRequest.gender,
        'gtinRequest.id': this.markItem.gtinRequest.id,
        'gtinRequest.inn': this.markItem.gtinRequest.inn,
        'gtinRequest.kind': this.markItem.gtinRequest.kind,
        'gtinRequest.manufacturerCode': this.markItem.gtinRequest.manufacturerCode,
        'gtinRequest.measure': this.markItem.gtinRequest.measure,
        'gtinRequest.model': this.markItem.gtinRequest.model,
        'gtinRequest.packMaterial': this.markItem.gtinRequest.packMaterial,
        'gtinRequest.packType': this.markItem.gtinRequest.packType,
        'gtinRequest.prodName': this.markItem.gtinRequest.prodName,
        // 'gtinRequest.publicationDate': this.markItem.gtinRequest.publicationDate,
        'gtinRequest.quantity': this.markItem.gtinRequest.quantity,
        'gtinRequest.rawMaterial': this.markItem.gtinRequest.rawMaterial,
        'gtinRequest.sizeName': this.markItem.gtinRequest.sizeName,
        'gtinRequest.sizeValue': this.markItem.gtinRequest.sizeValue,
        'gtinRequest.standartNumber': this.markItem.gtinRequest.standartNumber,
        'gtinRequest.status': 'NOT_PROCESSED',
        'gtinRequest.tnved': this.markItem.gtinRequest.tnved,
        'gtinRequest.trademark': this.markItem.gtinRequest.trademark,
        id: this.markItem.id,
        ccisType: this.markItem.cisType,
        loadInfoId: this.markItem.loadInfoId,
        status: 'NOT_PROCESSED'
      }

      try {
        await this.$api.code.markCodeSave(request)
        // await this.$axios.$post(`http://192.168.1.70:9037/meridian/markCodeRequest/saveMarkCodeRequest?${new URLSearchParams(request).toString()}`)

        this.dialogMark = false
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>

.barcode-form-gtin-main {
  display:flex;
  justify-content: flex-end;
  align-items: center;
}

.barcode-form-gtin-btn {
  width: 180px;
  height: 30px;
  font-size:1.2rem;
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

.barcode-form-gtin-btn:hover{
  outline-offset: -8px;
  color: rgb(34,34,34);
  background: none;
}

</style>
