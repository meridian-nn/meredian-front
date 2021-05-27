/* eslint-disable */
// Плагин для создания параметров для запросов
import Vue from 'vue'
Vue.mixin({
    methods: {
        // Функция для создания создания параметра для запроса сохранения параметров фильтров
        // this.$api.uiSettings.save
        createFilterEntityForSave(elementId, formId, filterItem) {
            const filterEntityForSave = {
                elementId,
                formId,
                settingValue: JSON.stringify(filterItem)
            }
            return filterEntityForSave
        },
    }
})