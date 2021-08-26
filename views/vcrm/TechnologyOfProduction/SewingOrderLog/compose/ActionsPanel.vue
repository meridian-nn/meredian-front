<template>
  <div class="sewing-order-log-page-row">
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
            :disabled="sewingOrderTableSelectedRecords.length === 0 || sewingOrderTableSelectedRecords.length > 1"
          >
            <v-icon
              color="white"
              @click="openEditModal()"
            >
              mdi-pencil
            </v-icon>
          </v-btn>
        </div>
      </template>
      <span>Редактирование выбранного заказа на пошив</span>
    </v-tooltip>

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
            :disabled="sewingOrderTableSelectedRecords.length === 0"
          >
            <v-icon
              color="white"
              @click="deleteRecord"
            >
              mdi-delete
            </v-icon>
          </v-btn>
        </div>
      </template>
      <span>Удаление выбранных заказов на пошив</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <v-btn
          class="mr-1"
          style="border-radius:50%; width: 40px; height: 40px;"
          min-width="40px"
          small
          color="red"
          v-bind="attrs"
          :disabled="sewingOrderTableSelectedRecords.length === 0"
          @click="openModal('print')"
          v-on="on"
        >
          <v-icon color="white">
            mdi-printer
          </v-icon>
        </v-btn>
      </template>
      <span>Открытие формы печати</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <v-btn
          class="mr-1"
          style="border-radius:50%; width: 40px; height: 40px;"
          min-width="40px"
          small
          color="blue"
          v-bind="attrs"
          @click="openModal('filter')"
          v-on="on"
        >
          <v-icon color="white">
            mdi-filter
          </v-icon>
        </v-btn>
      </template>
      <span>Фильтры для заказов на пошив</span>
    </v-tooltip>

    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <v-btn
          class="mr-1"
          style="border-radius:50%; width: 40px; height: 40px;"
          min-width="40px"
          small
          color="blue"
          v-bind="attrs"
          @click="openModal('search')"
          v-on="on"
        >
          <v-icon color="white">
            mdi-magnify
          </v-icon>
        </v-btn>
      </template>
      <span>Поиск в журнале заказов на пошив</span>
    </v-tooltip>

    <div class="sewing-order-log-page-checkbox mr-4">
      <v-checkbox
        :value="govContract"
        disabled
        class="mr-2"
        label="ГОСКОНТРАКТ"
      />

      <v-checkbox
        v-model="handlerNoOtk"
        label="Нет проверки ОТК"
      />
    </div>

    <div class="sewing-order-log-page-btn">
      <v-btn small>
        Формирование уведомления о приемке для склада
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActionsPanel',

  props: {
    sewingOrderTableSelectedRecords: {
      type: Array,
      default: () => []
    },

    govContract: {
      type: Boolean,
      default: false
    },

    noOtk: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    handlerNoOtk: {
      get() {
        return this.noOtk
      },

      set(value) {
        this.$emit('no-otk', value)
      }
    }
  },

  methods: {
    openEditModal() {
      const editingRecord = this.sewingOrderTableSelectedRecords[0]

      if (editingRecord.dopWork === 0) {
        this.$emit('openModal', 'edit')
      } else {
        this.$emit('openModal', 'editAdd')
      }
    },

    openModal(name) {
      this.$emit('openModal', name)
    },

    deleteRecord() {
      this.$emit('deleteRecord')
    }
  }
}
</script>
