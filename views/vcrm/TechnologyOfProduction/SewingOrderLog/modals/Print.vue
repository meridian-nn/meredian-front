<template>
  <v-dialog
    :value="value"
    max-width="850px"
    persistent
    class="modal-print"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Печать/Просмотр отчётов по заявкам на пошив
      </v-card-title>

      <v-card-text
        class="pb-0"
      >
        <div class="modal-print-list">
          <v-list
            dense
            style="height: 450px"
            class="overflow-y-auto"
          >
            <v-list-item-group
              v-model="selectedReport"
              color="primary"
            >
              <v-list-item
                v-for="(report, i) in reports"
                :key="i"
              >
                <v-list-item-icon>
                  <v-checkbox
                    v-model="report.marked"
                    class="mt-0 pt-0"
                    @change="selectedComplectId = null"
                  />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="report.text" />
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </div>
      </v-card-text>

      <v-card-text>
        <div class="modal-print__actions mt-1">
          <v-btn
            small
            @click="downloadReport"
          >
            Выполнить
          </v-btn>

          <v-btn small>
            Microsoft EXCEl
          </v-btn>

          <v-btn
            small
            @click="$emit('close')"
          >
            Закрыть
          </v-btn>

          <v-checkbox
            class="mt-0"
            label="Печать ТП с доп блоком"
            hide-details="auto"
          />
        </div>

        <div class="modal-print__actions mt-3">
          <v-checkbox
            label="Лист качества без учёта количества"
            hide-details="auto"
            class="mt-0"
          />

          <form-control
            label="Месяц поступления готовой продукции"
          >
            <v-autocomplete
              class="mt-0 pt-0"
              :items="['Test', 'test']"
              hide-details="auto"
            />
          </form-control>

          <form-control
            label="Год"
          >
            <v-autocomplete
              class="mt-0 pt-0"
              :items="['Test', 'test']"
              hide-details="auto"
            />
          </form-control>
        </div>

        <div class="modal-print__actions">
          <form-control label="Для отчёта по браку: ">
            <form-control label="Период проверки">
              <v-text-field
                class="mt-0 pt-0"
                type="date"
                hide-details="auto"
              />
            </form-control>

            <form-control label="по">
              <v-text-field
                class="mt-0 pt-0"
                type="date"
                hide-details="auto"
              />
            </form-control>
          </form-control>

          <v-radio-group
            hide-details="auto"
            class="mt-0 pt-0"
          >
            <v-radio
              label="Фабрики"
              value="radio-1"
            />
            <v-radio
              label="Давальцы"
              value="radio-2"
            />
          </v-radio-group>
        </div>

        <div class="modal-print__actions">
          <form-control label="Оперативный план до">
            <v-text-field
              class="mt-0 pt-0"
              type="date"
              hide-details="auto"
            />
          </form-control>

          <form-control label="Для маркировки упавки :">
            <v-radio-group
              row
              hide-details="auto"
              class="mt-0 pt-0"
            >
              <v-radio
                label="Самоклейка - старый шаблон"
                value="radio-1"
              />
              <v-radio
                label="Самоклейка - новый шаблон"
                value="radio-2"
              />
              <v-radio
                label="Новая самоклейка"
                value="radio-2"
              />
            </v-radio-group>
          </form-control>
        </div>

        <div class="modal-print__actions">
          <form-control label="Сортировка:">
            <v-radio-group
              hide-details="auto"
              class="mt-0 pt-0"
            >
              <v-radio
                label="Самоклейка - старый шаблон"
                value="radio-1"
              />
              <v-radio
                label="Самоклейка - новый шаблон"
                value="radio-2"
              />

              <v-radio
                label="Новая самоклейка"
                value="radio-2"
              />
            </v-radio-group>
          </form-control>

          <form-control
            label="Комплект"
          >
            <v-autocomplete
              v-model="selectedComplectId"
              :items="userComplects"
              item-value="id"
              item-text="name"
              class="mt-0 pt-0"
              hide-details="auto"
              no-data-text="Список пуст"
              @change="complectChange"
            />
          </form-control>

          <v-dialog
            v-model="saveComplectDialog"
            persistent
            max-width="400"
          >
            <template #activator="{ on, attrs }">
              <v-btn
                small
                v-bind="attrs"
                v-on="on"
              >
                Сохранить комплект
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="text-h5">
                Введите название комплекта для печати
              </v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="nameOfNewComplect"
                  label="Имя комплекта"
                  :rules="rulesForNameOfNewComplect"
                  :clearable="true"
                  outlined
                  dense
                  hide-details="auto"
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="green darken-1"
                  text
                  @click="saveUserComplect"
                >
                  Сохранить
                </v-btn>
                <v-btn
                  color="green darken-1"
                  text
                  @click="saveComplectDialog = false; nameOfNewComplect=''"
                >
                  Отмена
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-card-text>
    </v-card>
    <user-notification ref="userNotification" />
  </v-dialog>
</template>

<script>
import UserNotification from '~/components/information_window/UserNotification'

export default {
  name: 'ModalPrint',

  components: {
    UserNotification
  },

  props: {
    value: {
      type: Boolean,
      default: false
    },

    selectedRecords: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      editedItem: {
        num_plan: '',
        num_zkz: ''
      },

      selectedReport: 1,
      reports: [
        {
          text: 'Реестр оплат',
          value: 'ReestrPays',
          marked: false
        },
        {
          text: 'Заказ на пошив',
          value: 'ZakazNaPoshiv',
          marked: false
        },
        {
          text: 'Заказ на пошив1',
          value: 'ZakazNaPoshiv1',
          marked: false
        },
        {
          text: 'Заказ на пошив2',
          value: 'ZakazNaPoshiv2',
          marked: false
        }
      ],
      userComplects: [],
      saveComplectDialog: false,
      nameOfNewComplect: '',
      selectedComplectId: null,
      rulesForNameOfNewComplect: [
        value => !value || value.length < 50 || 'Длина имени нового комплекта не должна превышать 50 символов!'
      ]
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    async init() {
      await this.findUserComplects()
    },

    downloadReport() {
      const markedReports = this.reports.filter(item => item.marked)

      if (!markedReports) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите отчет для печати!')
        return
      }

      for (const report of markedReports) {
        if (report.value === 'ReestrPays') {
          this.downloadReestPays()
        } else if (report.value === 'ZakazNaPoshiv') {
          this.downloadZakazNaPoshiv()
        }
      }
    },

    downloadReestPays() {
      const params = {
        format: 'HTML',
        pdReestrPays: '2021-06-30'
      }

      this.downloadReestPaysReport(params.format, params.pdReestrPays)
    },

    downloadZakazNaPoshiv() {
      for (const selectedRecord of this.selectedRecords) {
        const params = {
          format: 'HTML',
          zkzpsvId: selectedRecord.zkzpsvId
        }

        this.downloadOrderOnSewing(params.format, params.zkzpsvId)
      }
    },

    async saveUserComplect() {
      if (!this.nameOfNewComplect) {
        this.$refs.userNotification.showUserNotification('error', 'Введите название комплекта!')
        return
      } else if (!this.nameOfNewComplect.length > 50) {
        this.$refs.userNotification.showUserNotification('error', 'Длина имени нового комплекта не должна превышать 50 символов!')
        return
      }

      const markedReports = []

      for (const report of this.reports) {
        if (report.marked) {
          markedReports.push({
            value: report.value
          })
        }
      }

      if (!markedReports || markedReports.length === 0) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите хотя бы один отчет!')
        return
      }

      const newComplect = {
        id: this.userComplects.length + 1,
        name: this.nameOfNewComplect,
        complect: markedReports
      }

      this.userComplects.push(newComplect)

      const filterEntityForSave = this.createFilterEntityForSave(this.getIdOfUserComplectsForPrintReports(), this.$route.name, this.userComplects,
        this.getCurrentUser.id, this.getCurrentUser.id)

      await this.$api.uiSettings.save(filterEntityForSave)
      this.nameOfNewComplect = ''
      this.saveComplectDialog = false
      this.selectedComplectId = newComplect.id
      this.$refs.userNotification.showUserNotification('success', 'Комплект сохранен!')
    },

    async findUserComplects() {
      const data = this.createCriteriasToSearchForFiltersValues(this.$route.name, this.getIdOfUserComplectsForPrintReports(), this.getCurrentUser.id)
      const response = await this.$api.uiSettings.findBySearchCriterias(data)

      if (response.length) {
        this.userComplects = JSON.parse(response[0].settingValue)
      }
    },

    complectChange(complectId) {
      for (const report of this.reports) {
        report.marked = false
      }

      const selectedComplect = this.userComplects.find(complect => complect.id === complectId)

      if (!selectedComplect) {
        this.$refs.userNotification.showUserNotification('error', 'Произошла ошибка, комплект не был найден в списке комплектов!')
        return
      }

      for (const complectElement of selectedComplect.complect) {
        const report = this.reports.find(report => report.value === complectElement.value)

        if (report) {
          report.marked = true
        }
      }
    }
  }
}
</script>
<style lang="scss">
.modal-print {
  &-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 0;
    margin-top: 20px;
    height: 450px;
    border-radius: 4px;
    border: 1px solid #eaeaea;

    &__item {
      font-size: 14px;
      padding: 0 20px;

      &:hover {
        background-color: #eaeaea;
      }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .v-label {
      font-size: 14px;
    }
  }
}
</style>
