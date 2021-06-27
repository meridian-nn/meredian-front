/* eslint-disable */
// Плагин для создания критериев для запросов типа "findBySearchCriteria" и "findBySearchCriterias"
import Vue from 'vue'

Vue.mixin({
    methods: {

        // Создает объект с критериями для отбора документов оплат по кассе для запроса на бэк
        // date - дата для отбора по полю paymentDate
        // orgId - id организации
      // accId - id расчетного счета организации
      createCriteriasForRequestToSearchPaymentsByCashbox: function(accId, orgId, date) {
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

        createCriteriasWithoutAccIdForRequestToSearchPaymentsByCashbox(orgId, date) {
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
              values: orgId
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
                        new Date(date).toLocaleDateString(), new Date(secDate).toLocaleDateString()
                    ]
                }
            ]
            return data
        },

        createCriteriasWithoutAccIdForRequestToSearchDocsToPay(orgIds, date) {
          const secDate = new Date(date)
          const curDateNum = secDate.getDate()
          secDate.setDate(curDateNum + 1)
          const data = [
            {
              'dataType': 'INTEGER',
              'key': 'platId',
              'operation': 'EQUALS',
              'type': 'AND',
              'values': orgIds
            },
            {
              'dataType': 'DATE',
              'key': 'dataOplat',
              'operation': 'BETWEEN',
              'type': 'AND',
              'values': [
                new Date(date).toLocaleDateString(), new Date(secDate).toLocaleDateString()
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
                  (typeof filtersParams === 'object' && filtersParams.date) ? new Date(filtersParams.date).toLocaleDateString() : new Date().toLocaleDateString()
                ]
            }]

            if (filtersParams) {
                for (const key in filtersParams) {
                    let elemParam = filtersParams[key]

                    if (!elemParam || key === 'date') {
                        continue
                    }

                    if(key === 'sumToPay' && typeof elemParam === 'object') {
                       const isFilterUsed = elemParam.isSumToPayUsed

                      if(!isFilterUsed){
                          continue
                       }

                      elemParam = elemParam.sumToPayValue
                    }

                    const dataType = typeof elemParam === 'number' ? 'INTEGER' : 'VARCHAR'

                    const operation = this.getOperationTypeForRequestToSearchDocsFromPay(key)

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

        getOperationTypeForRequestToSearchDocsFromPay(key) {
          if (key === 'nameDoc'
              || key === 'creatorName'
              || key === 'executorName') {
            return 'LIKE'
          } else if (key === 'sumToPay') {
            return 'GREATER_THAN'
          } else {
            return 'EQUALS'
          }
        },

        createCriteriasToSearchDocsFromPayBetweenDataOplatDates(firstDate, lastDate) {
          return [
            {
              dataType: 'DATE',
              key: 'dataOplat',
              operation: 'GREATER_THAN',
              type: 'AND',
              values: [
                new Date(firstDate).toLocaleDateString()
              ]
            },
            {
              dataType: 'DATE',
              key: 'dataOplat',
              operation: 'LESS_THAN',
              type: 'AND',
              values: [
                new Date(lastDate).toLocaleDateString()
              ]
            }
          ]
        },

        // Создает объект с критериями для отбора значений фильтров для пользователя
        // для переданной формы и элемента
        createCriteriasToSearchForFiltersValues(formId, elementId, userId) {
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
                {
                    'dataType': 'VARCHAR',
                    'key': 'userId',
                    'operation': 'EQUALS',
                    'type': 'AND',
                    'values': [
                        userId
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
        },

        createCriteriasForCommodityLogOfSewingPlan(params){
          const criterias = {
            page: 1,
            size: 20
          }

          if(params){
            if(params.currentPage) {
              criterias.page = params.currentPage
            }
          }

          return criterias
        },

        createCriteriasToSearchBalanceOfPaymentAccount(dateOplat, orgId, accId){
          const data = [
            {
              dataType: 'DATE',
              key: 'dataOplat',
              operation: 'EQUALS',
              type: 'AND',
              values: [
                new Date(dateOplat).toLocaleDateString()
              ]
            },
            {
              dataType: 'VARCHAR',
              key: 'myOrg.id',
              operation: 'EQUALS',
              type: 'AND',
              values: [
                orgId
              ]
            },
            {
              dataType: 'VARCHAR',
              key: 'acc.id',
              operation: 'EQUALS',
              type: 'AND',
              values: [
                accId
              ]
            },
          ]
          return data
        },

        createCriteriasToSearchDocsToPayOfOrg(orgId,date){
          const data = [
            {
              dataType: 'DATE',
              key: 'dataOplat',
              operation: 'EQUALS',
              type: 'AND',
              values: [
                new Date(dateOplat).toLocaleDateString()
              ]
            }
          ]

          return data
        },

        createCriteriasToSearchUsersByDepartmentId(depId){
          const data = [
            {
              dataType: 'INTEGER',
              key: 'department.id',
              operation: 'EQUALS',
              type: 'AND',
              values: [
                depId
              ]
            }
          ]
          return data
        },

        createCriteriasToSearchTypeOfDocsForDocsForPay() {
          const data = [
            {
              dataType: 'VARCHAR',
              key: 'prOplat',
              operation: 'EQUALS',
              type: 'AND',
              values: [
                'ON_NEW_DOC_FORM'
              ]
            }
          ]

          return data
        },

        createParamsForRequestPaymentAccGroupByOrg(date, groupFields){
          const aggregateFunctions = [
            {
              "field": "saldo",
              "function": "SUM"
            },
            {
              "field": "nalich",
              "function": "SUM"
            },
            {
              "field": "credit",
              "function": "SUM"
            },
            {
              "field": "vnpl",
              "function": "SUM"
            },
            {
              "field": "sumToPay",
              "function": "SUM"
            }
          ]

          const searchCriteria = this.createSearchCriteriasForRequestPaymentAccGroupByOrg(date)

          const params = {
            aggregateFunctions: aggregateFunctions,
            groupFields: groupFields,
            searchCriteria: searchCriteria
          }

          return params
        },

        createSearchCriteriasForRequestPaymentAccGroupByOrg(date) {
          const searchCriteria = [
            {
              dataType: "DATE",
              key: "dataOplat",
              operation: "EQUALS",
              type: "AND",
              values: [
                new Date(date).toLocaleDateString()
              ]
            },
            {
              dataType: "VARCHAR",
              key: "myOrg.orgType.code",
              operation: "EQUALS",
              type: "AND",
              values: [
                "1"
              ]
            }
          ]

          return searchCriteria
        }
    }
})
