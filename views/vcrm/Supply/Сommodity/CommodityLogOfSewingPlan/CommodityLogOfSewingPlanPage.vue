<template>
  <div
    name="commodity-log-of-sewing-plan-main-div"
    class="commodity-log-of-sewing-plan-main-div"
  >
    <div class="commodity-log-of-sewing-plan-row">
      <div class="commodity-log-of-sewing-plan-name-of-form-headline">
        Журнал заявок покупателя
      </div>

      <div class="commodity-log-of-sewing-plan-storage-btn">
        <v-btn @click="openWarehouseInventoryForm">
          Склад
        </v-btn>
      </div>

      <div class="commodity-log-of-sewing-plan-count-for-change-headline">
        кол-во для замены
      </div>

      <div class="commodity-log-of-sewing-plan-count-for-change-text-input">
        <v-text-field
          v-model.number="countForChange"
          hide-details="auto"
        />
      </div>

      <div class="commodity-log-of-sewing-plan-ratio-for-change-headline">
        коэф. для замены
      </div>

      <div class="commodity-log-of-sewing-plan-ratio-for-change-text-input">
        <vue-numeric
          v-model="ratioForChange"
          style="width: 60px"
          :precision="5"
          decimal-separator=","
          output-type="number"
        />
      </div>

      <div class="commodity-log-of-sewing-plan-material-change">
        <v-btn>
          Замена сырья
        </v-btn>
      </div>

      <div class="commodity-log-of-sewing-plan-fittings-change">
        <v-btn>
          Замена фурнитуры
        </v-btn>
      </div>

      <div class="commodity-log-of-sewing-plan-supplier-headline">
        Поставщик
      </div>

      <div class="commodity-log-of-sewing-plan-supplier-text-input">
        <v-text-field
          v-model.number="countOfSuppliers"
          hide-details="auto"
        />
      </div>

      <div class="commodity-log-of-sewing-plan-supplier-autocomplete">
        <v-autocomplete
          v-model="supplierId"
          :loading="loadingType.suppliers"
          :items="suppliers"
          item-value="id"
          item-text="clName"
          hide-details="auto"
          auto-select-first="true"
          outlined
        />
      </div>

      <v-btn style="margin-top: 10px">
        Заявка
      </v-btn>
    </div>

    <div class="commodity-log-of-sewing-plan-row">
      <div class="commodity-log-of-sewing-plan-checkboxes-col">
        <div class="commodity-log-of-sewing-plan-row">
          <v-simple-checkbox
            v-model="withUnsignedPlan"
          />

          <div
            class="commodity-log-of-sewing-plan-label-checkbox"
            style="width: 201px"
          >
            с учетом не подписанного плана
          </div>

          <v-simple-checkbox
            v-model="consolidatedPlan"
          />

          <div
            class="commodity-log-of-sewing-plan-label-checkbox"
            style="width: 87px"
          >
            сводный план
          </div>

          <v-simple-checkbox
            v-model="preliminaryCalculation"
          />

          <div
            class="commodity-log-of-sewing-plan-label-checkbox"
            style="width: 158px"
          >
            предварительный расчет
          </div>

          <v-simple-checkbox
            v-model="sewing"
          />

          <div
            class="commodity-log-of-sewing-plan-label-checkbox"
            style="width: 60px"
          >
            пошив
          </div>
        </div>

        <div class="commodity-log-of-sewing-plan-row">
          <v-simple-checkbox
            v-model="withApplicationJournal"
          />

          <div
            class="commodity-log-of-sewing-plan-label-checkbox"
            style="width: 158px"
          >
            с учетом журнала заявок
          </div>

          <v-simple-checkbox
            v-model="commodity"
          />

          <div
            class="commodity-log-of-sewing-plan-label-checkbox"
            style="width: 39px"
          >
            сырье
          </div>

          <v-simple-checkbox
            v-model="embroideriesLogos"
          />

          <div
            class="commodity-log-of-sewing-plan-label-checkbox"
            style="width: 125px"
          >
            вышивки, логотипы
          </div>

          <v-simple-checkbox
            v-model="ourFactories"
          />

          <div
            class="commodity-log-of-sewing-plan-label-checkbox"
            style="width: 92px"
          >
            наши фабрики
          </div>

          <v-simple-checkbox
            v-model="shoes"
          />

          <div
            class="commodity-log-of-sewing-plan-label-checkbox"
            style="width: 60px"
          >
            обувь
          </div>
        </div>

        <div class="commodity-log-of-sewing-plan-row">
          <v-simple-checkbox
            v-model="requiredAmountMoreThanZero"
          />

          <div
            class="commodity-log-of-sewing-plan-label-checkbox"
            style="width: 157px"
          >
            необходимое кол-во > 0
          </div>

          <v-simple-checkbox
            v-model="accessories"
          />

          <div
            class="commodity-log-of-sewing-plan-label-checkbox"
            style="width: 65px"
          >
            фурнитура
          </div>

          <v-simple-checkbox
            v-model="govContract"
          />

          <div
            class="commodity-log-of-sewing-plan-label-checkbox"
            style="width: 100px"
          >
            ГОСКОНТРАКТ
          </div>

          <v-simple-checkbox
            v-model="givers"
          />

          <div
            class="commodity-log-of-sewing-plan-label-checkbox"
            style="width: 92px"
          >
            давальцы
          </div>

          <v-simple-checkbox
            v-model="embroidery"
          />

          <div
            class="commodity-log-of-sewing-plan-label-checkbox"
            style="width: 70px"
          >
            вышивка
          </div>
        </div>
      </div>

      <div class="commodity-log-of-sewing-plan-filters-col">
        <div
          class="commodity-log-of-sewing-plan-row"
          style="margin-bottom:10px"
        >
          <div class="commodity-log-of-sewing-plan-label indentation-for-labels">
            Код
          </div>

          <div class="indentation-for-inputs">
            <v-text-field
              v-model.number="code"
              hide-details="auto"
            />
          </div>

          <div class="commodity-log-of-sewing-plan-label indentation-for-labels">
            Наименование сырья
          </div>

          <div style="width: 400px">
            <v-text-field
              v-model.number="nameOfCommodity"
              hide-details="auto"
            />
          </div>
        </div>

        <div class="commodity-log-of-sewing-plan-row">
          <div class="commodity-log-of-sewing-plan-label indentation-for-labels">
            № заявки
          </div>

          <div class="indentation-for-inputs">
            <v-text-field
              v-model.number="numberOfApplication"
              hide-details="auto"
            />
          </div>

          <div class="commodity-log-of-sewing-plan-label indentation-for-labels">
            Код изделия
          </div>

          <div class="indentation-for-inputs">
            <v-text-field
              v-model.number="codeOfItem"
              hide-details="auto"
            />
          </div>

          <div class="commodity-log-of-sewing-plan-label indentation">
            Контрагент
          </div>

          <div class="commodity-log-of-sewing-plan-contractors-autocomplete">
            <v-autocomplete
              v-model="contractorId"
              :loading="loadingType.contractors"
              :items="contractors"
              item-value="id"
              item-text="clName"
              hide-details="auto"
              auto-select-first="true"
              outlined
            />
          </div>

          <v-simple-checkbox
            v-model="exclude"
            style="margin-top: 5px"
          />

          <div
            class="commodity-log-of-sewing-plan-label indentation"
            style="width: 60px"
          >
            Исключить
          </div>
        </div>
      </div>
    </div>

    <div class="commodity-log-of-sewing-plan-row">
      <div id="listOfMaterialsDataTable">
        <v-data-table
          id="commodity-log-of-sewing-plan-list-of-materials"
          height="536"
          :headers="listOfMaterialsHeaders"
          fixed-header
          :items="listOfMaterials"
          :show-select="false"
          :footer-props="{
            showFirstLastPage: true,
            firstIcon: 'mdi-arrow-collapse-left',
            lastIcon: 'mdi-arrow-collapse-right',
            prevIcon: 'mdi-minus',
            nextIcon: 'mdi-plus'
          }"
          class="elevation-1"
        />
      </div>
    </div>

    <div class="commodity-log-of-sewing-plan-row">
      <div class="commodity-log-of-sewing-plan-free-to-sewing-rectangle" />
      <div
        class="commodity-log-of-sewing-plan-labels-in-bottom-headline"
      >
        свободный заказ на пошив
      </div>

      <div class="commodity-log-of-sewing-plan-reserved-rectangle" />
      <div
        class="commodity-log-of-sewing-plan-labels-in-bottom-headline"
      >
        резерв
      </div>

      <div class="commodity-log-of-sewing-plan-changed-rectangle" />
      <div
        class="commodity-log-of-sewing-plan-labels-in-bottom-headline"
      >
        изменено
      </div>

      <v-spacer />

      <v-btn @click="findInformationForListOfMaterials">
        На след. страницу
      </v-btn>

      <div
        class="commodity-log-of-sewing-plan-labels-in-bottom-headline"
      >
        на складе ул. Геологов
      </div>

      <div class="commodity-log-of-sewing-plan-numeric-in-bottom">
        <vue-numeric
          v-model="amountOnGeologov"
          :precision="3"
          decimal-separator="."
          read-only="true"
          :min="0"
          :empty-value="0"
        />
      </div>

      <div class="commodity-log-of-sewing-plan-labels-in-bottom-headline">
        Итого
      </div>

      <div class="commodity-log-of-sewing-plan-numeric-in-bottom">
        <vue-numeric
          v-model="amount"
          :precision="3"
          decimal-separator="."
          read-only="true"
          :min="0"
          :empty-value="0"
        />
      </div>
    </div>

    <div class="commodity-log-of-sewing-plan-row">
      <v-spacer />

      <div class="commodity-log-of-sewing-plan-labels-in-bottom-headline">
        необходимо купить
      </div>

      <div class="commodity-log-of-sewing-plan-numeric-in-bottom">
        <vue-numeric
          v-model="amountNeedToBuy"
          :precision="3"
          decimal-separator="."
          read-only="true"
          :min="0"
          :empty-value="0"
        />
      </div>

      <div class="commodity-log-of-sewing-plan-labels-in-bottom-headline">
        на складах фабрик
      </div>

      <div class="commodity-log-of-sewing-plan-numeric-in-bottom">
        <vue-numeric
          v-model="amountOnStorages"
          :precision="3"
          decimal-separator="."
          read-only="true"
        />
      </div>

      <div class="commodity-log-of-sewing-plan-labels-in-bottom-headline">
        раскр.скл.
      </div>

      <div class="commodity-log-of-sewing-plan-numeric-in-bottom">
        <vue-numeric
          v-model="amountOnRaskrStorages"
          :precision="3"
          decimal-separator="."
          read-only="true"
          :min="0"
          :empty-value="0"
        />
      </div>
    </div>

    <div class="commodity-log-of-sewing-plan-row">
      <v-spacer />

      <div class="commodity-log-of-sewing-plan-analogs-headline">
        Аналоги
      </div>

      <div class="commodity-log-of-sewing-plan-labels-in-bottom-headline">
        на складе Геологов
      </div>

      <div class="commodity-log-of-sewing-plan-numeric-in-bottom">
        <vue-numeric
          v-model="amountAnalogsOnGeologov"
          :precision="3"
          decimal-separator="."
          read-only="true"
          :min="0"
          :empty-value="0"
        />
      </div>

      <div class="commodity-log-of-sewing-plan-labels-in-bottom-headline">
        на складах фабрик
      </div>

      <div class="commodity-log-of-sewing-plan-numeric-in-bottom">
        <vue-numeric
          v-model="amountAnalogsOnStorages"
          :precision="3"
          decimal-separator="."
          read-only="true"
          :min="0"
          :empty-value="0"
        />
      </div>

      <div class="commodity-log-of-sewing-plan-labels-in-bottom-headline">
        раскр.скл.
      </div>

      <div class="commodity-log-of-sewing-plan-numeric-in-bottom">
        <vue-numeric
          v-model="amountAnalogsOnRaskrStorages"
          :precision="3"
          decimal-separator="."
          read-only="true"
          :min="0"
          :empty-value="0"
        />
      </div>
    </div>
    <user-notification ref="userNotification" />
    <warehouse-inventory-page
      ref="warehouseInventory"
      @close="closeWarehouseInventory"
    />
  </div>
</template>

<script>
import UserNotification from '~/components/information_window/UserNotification'
import WarehouseInventoryPage from '~/views/vcrm/Supply/Сommodity/WarehouseInventory/WarehouseInventoryPage'
export default {
  name: 'CommodityLogOfSewingPlan',

  components: {
    WarehouseInventoryPage,
    UserNotification
  },

  data() {
    return {
      // Таблица для отображения списка доступного сырья
      listOfMaterials: [],
      listOfMaterialsHeaders: [
        {
          text: 'ПР',
          value: 'pr',
          cellClass: 'padding:0px; height:0px'
        },
        {
          text: 'К',
          value: 'k'
        },
        {
          text: 'Счет',
          value: 'account'
        },
        {
          text: 'Фабр',
          value: 'factory'
        },
        {
          text: 'Дата',
          value: 'date'
        },
        {
          text: 'Заявка',
          value: 'application'
        },
        {
          text: 'Заявка поставщику',
          value: 'supplierRequest'
        },
        {
          text: 'Код',
          value: 'codeOfCommodity'
        },
        {
          text: 'Наименование',
          value: 'nameOfCommodity'
        },
        {
          text: 'Ед.из.',
          value: 'unitOfCommodity'
        },
        {
          text: 'Кол-во',
          value: 'countOfCommodity'
        },
        {
          text: 'Отправлено',
          value: 'send'
        },
        {
          text: 'Резерв',
          value: 'reserve'
        },
        {
          text: 'Необх.',
          value: 'need'
        },
        {
          text: 'Исполнитель',
          value: 'executor'
        },
        {
          text: 'Контрагент',
          value: 'contractor'
        },
        {
          text: 'Изделие',
          value: 'item'
        },
        {
          text: 'Кол-во',
          value: 'countOfItem'
        },
        {
          text: 'Коррекция',
          value: 'correction'
        }
      ],
      currentPageOfListOfMaterials: 1,

      // объект для отображения загрузки данных для полей
      loadingType: {},

      // Количество для замены
      countForChange: 0,

      // Коэффициент для замены
      ratioForChange: 1,

      // Количество поставщиков
      countOfSuppliers: 0,

      // Массив поставщиков для выбора пользователем на форме
      suppliers: [],

      // id выбранного поставщика
      supplierId: null,

      // с учетом не подписанного плана
      withUnsignedPlan: false,

      // сводный план
      consolidatedPlan: false,

      // предварительный расчет
      preliminaryCalculation: false,

      // пошив
      sewing: false,

      // с учетом журнала заявок
      withApplicationJournal: false,

      // сырье
      commodity: false,

      // вышивки, логотипы
      embroideriesLogos: false,

      // наши фабрики
      shoes: false,

      // необходимое кол-во > 0
      requiredAmountMoreThanZero: false,

      // фурнитура
      accessories: false,

      // госконтракт
      govContract: false,

      // давальцы
      givers: false,

      // вышивка
      embroidery: false,

      // код
      code: 0,

      // Наименование сырья
      nameOfCommodity: '',

      // номер заявки
      numberOfApplication: '',

      // код изделия
      codeOfItem: '',

      // id выбранного контрагента
      contractorId: null,

      // массив контрагентов для выбора пользователем на форме
      contractors: [],

      // исключить
      exclude: false,

      // на складе ул. Геологов
      amountOnGeologov: 1,

      // итого
      amount: 1,

      // необходимо купить
      amountNeedToBuy: 1,

      // на складах фабрик
      amountOnStorages: 1,

      // на раскр. складах
      amountOnRaskrStorages: 1,

      // Кол-во аналогов на складе ул. Геологов
      amountAnalogsOnGeologov: 1,

      // Кол-во аналогов на складах фабрик
      amountAnalogsOnStorages: 1,

      // Кол-во аналогов на раскр. складах
      amountAnalogsOnRaskrStorages: 1
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.findSuppliers()
      this.findContractors()
      this.findAmountOfCommodityInStorages()
      this.findInformationForListOfMaterials()
    },

    async findSuppliers() {
      this.loadingType.suppliers = true
      this.suppliers = await this.$api.organizations.findAll()
      this.loadingType.suppliers = null
    },

    async findContractors() {
      this.loadingType.contractors = true
      this.contractors = await this.$api.organizations.findAll()
      this.loadingType.contractors = null
    },

    async findAmountOfCommodityInStorages() {
      const paramsForStashedFunction = this.createParamsForStashedFunctionSrSelPlanPsv('185', '02.06.2021')
      const response = await this.$api.service.executeStashedFunctionWithReturnedDataSet(paramsForStashedFunction)

      if (!response.length) {
        return
      }

      this.amountOnGeologov = response[0].colvo_sklad
      this.amountOnStorages = response[0].colvo_fabr
      this.amountOnRaskrStorages = response[0].colvo_raskr

      this.amount = this.amountOnGeologov + this.amountOnStorages + this.amountOnRaskrStorages
    },

    async findInformationForListOfMaterials() {
      const params = {
        currentPage: this.currentPageOfListOfMaterials
      }
      this.currentPageOfListOfMaterials += 1

      const criterias = this.createCriteriasForCommodityLogOfSewingPlan(params)
      const response = await this.$api.supplyElements.supply.findPageBySearchCriteriaList(criterias)

      if (response.last) {
        this.currentPageOfListOfMaterials = 1
      }

      this.listOfMaterials = this.convertResponseFromFindPageBySearchCriteriaListToListOfMaterials(response.content)
    },

    openWarehouseInventoryForm() {
      this.$refs.warehouseInventory.openForm()
    },

    closeWarehouseInventory() {
      console.log('close warehouse inventory')
    }
  }
}
</script>

<style lang="scss">
.commodity-log-of-sewing-plan-main-div{
  margin: 10px;
}

.commodity-log-of-sewing-plan-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
  min-width: 100%;
}

.commodity-log-of-sewing-plan-name-of-form-headline {
  font-size: 1.5rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
  width: 270px;
  text-align: center;
}

.commodity-log-of-sewing-plan-analogs-headline {
  font-size: 1.5rem !important;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: normal !important;
  font-family: "Roboto", sans-serif !important;
  margin-right: 10px;
}

.commodity-log-of-sewing-plan-count-for-change-headline {
  color: rgba(0, 0, 0, 0.6);
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 7px;
  width: 92px
}

.commodity-log-of-sewing-plan-labels-in-bottom-headline {
  color: rgba(0, 0, 0, 0.6);
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 7px;
}

.commodity-log-of-sewing-plan-count-for-change-text-input {
  width: 50px;
}

.commodity-log-of-sewing-plan-ratio-for-change-headline {
  color: rgba(0, 0, 0, 0.6);
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 7px;
  width: 92px
}

.commodity-log-of-sewing-plan-ratio-for-change-text-input{
  width: 60px;
  padding-top: 20px
}

.commodity-log-of-sewing-plan-supplier-headline {
  color: rgba(0, 0, 0, 0.6);
  margin-top: 16px;
  margin-left: 10px;
  margin-right: 10px;
  width: 92px
}

.commodity-log-of-sewing-plan-supplier-text-input {
  width: 50px;
  margin-right: 10px
}

.commodity-log-of-sewing-plan-supplier-autocomplete {
  width:250px;
  margin-right: 10px;
  margin-top: 5px
}

.commodity-log-of-sewing-plan-label{
  color: rgba(0, 0, 0, 0.6);
}

.commodity-log-of-sewing-plan-label-checkbox{
  color: rgba(0, 0, 0, 0.6);
  font-size: 13px;
  padding-top: 1px;
  font-weight: bold;
}

.commodity-log-of-sewing-plan-material-change{
  margin-top:10px;
  margin-left: 10px;
  margin-right: 10px;
}

.commodity-log-of-sewing-plan-fittings-change{
  margin-top: 10px;
}

.commodity-log-of-sewing-plan-checkboxes-col {
  flex: 0 0 45%;
  max-width: 45%;
  margin-top: 20px;
}

.commodity-log-of-sewing-plan-filters-col {
  flex: 0 0 55%;
  max-width: 55%;
}

.commodity-log-of-sewing-plan-storage-btn{
  margin-top: 10px;
}

.commodity-log-of-sewing-plan-free-to-sewing-rectangle{
  height: 30px;
  width: 50px;
  background-color: #2BDDC8;
}

.commodity-log-of-sewing-plan-reserved-rectangle{
  height: 30px;
  width: 50px;
  background-color: #8BCAD8;
}

.commodity-log-of-sewing-plan-changed-rectangle{
  height: 30px;
  width: 50px;
  background-color: #DC0CFE;
}

.commodity-log-of-sewing-plan-contractors-autocomplete {
  width:250px;
  margin-right: 10px
}

.commodity-log-of-sewing-plan-numeric-in-bottom {
  margin-top: 7px;
  width: 100px;
}

.indentation {
  margin-top: 20px;
  margin-right: 10px;
}

.indentation-for-inputs {
  margin-right: 10px;
  width: 50px;
}

.indentation-for-labels {
  margin-top: 20px;
  margin-right: 10px;
}

#listOfMaterialsDataTable {
  border-collapse: collapse;
  width: 100%;
  height: 600px;
}

#listOfMaterialsDataTable table{
  width: 100%;
}
#listOfMaterialsDataTable td, #listOfMaterialsDataTable th {
  border: 1px solid #ddd;
  padding: 0;
}

#listOfMaterialsDataTable tr:nth-child(even){background-color: #f2f2f2;}

#listOfMaterialsDataTable tr:hover {background-color: #ddd;}

#listOfMaterialsDataTable th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

#commodity-log-of-sewing-plan-list-of-materials td {
  word-break:break-all !important;
  padding: 0 5px !important;
  height: 0 !important;
}

#commodity-log-of-sewing-plan-list-of-materials th {
  padding: 0 5px !important;
  height: 0 !important;
}
</style>
