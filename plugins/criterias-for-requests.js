/* eslint-disable */
// Плагин для создания критериев для запросов типа "findBySearchCriteria" и "findBySearchCriterias"
import Vue from 'vue'
Vue.mixin({
    methods: {

        // Создает объект с критериями для отбора документов оплат по кассе для запроса на бэк
        // date - дата для отбора по полю paymentDate
        // orgId - id организации
        // accId - id расчетного счета организации
        createCriteriasForRequestToSearchPaymentsByCashbox(accId, orgId, date) {
            const data = [{
                    dataType: 'DATE',
                    key: 'paymentDate',
                    operation: 'EQUALS',
                    type: 'AND',
                    values: [
                        new Date(date).toLocaleDateString()
                    ]
                },
                {
                    dataType: 'INTEGER',
                    key: 'payer.id',
                    operation: 'EQUALS',
                    type: 'AND',
                    values: [
                        orgId
                    ]
                },
                {
                    dataType: 'INTEGER',
                    key: 'acc.id',
                    operation: 'EQUALS',
                    type: 'AND',
                    values: [
                        accId
                    ]
                }
            ]
            return data
        },

        // Создает объект с критериями для отбора документов к оплате для запроса на бэк
        // date - дата для отбора по полю dataOplat
        // orgId - id организации
        // accId - id расчетного счета организации
        createCriteriasForRequestToSearchDocsToPay(accId, orgId, date) {
            const secDate = new Date(date)
            const curDateNum = secDate.getDate()
            secDate.setDate(curDateNum + 1)
            const data = [{
                    'dataType': 'INTEGER',
                    'key': 'accId',
                    'operation': 'EQUALS',
                    'type': 'AND',
                    'values': [
                        accId
                    ]
                },
                {
                    'dataType': 'INTEGER',
                    'key': 'platId',
                    'operation': 'EQUALS',
                    'type': 'AND',
                    'values': [
                        orgId
                    ]
                },
                {
                    'dataType': 'DATE',
                    'key': 'dataOplat',
                    'operation': 'BETWEEN',
                    'type': 'AND',
                    'values': [
                        new Date(date).toLocaleDateString(), secDate.toLocaleDateString()
                    ]
                }
            ]
            return data
        },

        // Создает объект с критериями отбора документов на оплату для запроса на бэк
        createCriteriasForRequestToSearchDocsFromPay(filtersParams) {
            const data = [{
                'dataType': 'DATE',
                'key': 'dataDoc',
                'operation': 'GREATER_THAN',
                'type': 'AND',
                'values': [
                    new Date().toLocaleDateString()
                ]
            }]

            if (filtersParams) {
                for (const key in filtersParams) {
                    const elemParam = filtersParams[key]
                    if (!elemParam) {
                        continue
                    }
                    const dataType = typeof elemParam === 'number' ? 'INTEGER' : 'VARCHAR'
                    const operation = key === 'nameDoc' ? 'LIKE' : 'EQUALS'
                    const dataElem = {
                        dataType,
                        key,
                        operation,
                        'type': 'AND',
                        'values': [
                            elemParam
                        ]
                    }
                    data.push(dataElem)
                }
            }


            return data
        },

        // Создает объект с критериями для отбора значений фильтров для пользователя 
        // для переданной формы и элемента
        createCriteriasToSearchForFiltersValues(formId, elementId) {
            const data = [{
                    'dataType': 'VARCHAR',
                    'key': 'formId',
                    'operation': 'EQUALS',
                    'type': 'AND',
                    'values': [
                        formId
                    ]
                },
                {
                    'dataType': 'VARCHAR',
                    'key': 'elementId',
                    'operation': 'EQUALS',
                    'type': 'AND',
                    'values': [
                        elementId
                    ]
                },
            ]
            return data
        },

        // Функция для создания критериев для отбора кодов маркировок по номеру заказа и датам
        // numberOfOrder - номер заказа
        // startDate - дата начала периода
        // endDate - дата конца периода
        createCriteriasForMarkCodeRequest(numberOfOrder, startDate, endDate) {
            const data = []

            if (numberOfOrder) {
                const criteriaByNumber = {
                    "dataType": "VARCHAR",
                    "key": "markOrder.markCodeRequest.productionOrderId",
                    "operation": "EQUALS",
                    "type": "AND",
                    "values": [
                        numberOfOrder
                    ]
                }
                data.push(criteriaByNumber)
            }

            const criteriaByDates = {
                "dataType": "DATE",
                "key": "dateAdd",
                "operation": "BETWEEN",
                "type": "AND",
                "values": [
                    new Date(startDate).toLocaleDateString(), new Date(endDate).toLocaleDateString()
                ]
            }

            data.push(criteriaByDates)

            return data
        }
    }
})