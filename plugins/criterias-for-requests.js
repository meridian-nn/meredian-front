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
      return [{
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
    },

    createCriteriasWithoutAccIdForRequestToSearchPaymentsByCashbox(orgId, date) {
      return [{
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
    },

    // Создает объект с критериями для отбора документов к оплате для запроса на бэк
    // date - дата для отбора по полю dataOplat
    // orgId - id организации
    // accId - id расчетного счета организации
    createCriteriasForRequestToSearchDocsToPay(accId, orgId, date) {
      const secDate = new Date(date)
      secDate.setDate(secDate.getDate() + 1)
      return [{
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
          (typeof filtersParams === 'object' && filtersParams.date) ?
            new Date(filtersParams.date).toLocaleDateString() : this.getDateForCriteriasToSearchDocsFromPay().toLocaleDateString()
        ]
      }]

      if (filtersParams) {
        for (const key in filtersParams) {
          let elemParam = filtersParams[key]

          if (!elemParam || key === 'date') {
            continue
          }

          if (key === 'sumToPay' && typeof elemParam === 'object') {
            const isFilterUsed = elemParam.isSumToPayUsed

            if (!isFilterUsed) {
              continue
            }

            elemParam = elemParam.sumToPayValue
          }

          const dataType = this.getDataTypeForRequestToSearchDocsFromPay(elemParam, key)

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

    getDataTypeForRequestToSearchDocsFromPay(elemParam, key) {
      if (key === 'sumToPay') {
        return 'VARCHAR'
      } else {
        return typeof elemParam === 'number' ? 'INTEGER' : 'VARCHAR'
      }
    },

    getOperationTypeForRequestToSearchDocsFromPay(key) {
      if (key === 'nameDoc'
        || key === 'creatorName'
        || key === 'executorName'
        || key === 'prim') {
        return 'LIKE'
      } else if (key === 'sumToPay') {
        return 'GREATER_THAN'
      } else {
        return 'EQUALS'
      }
    },

    createCriteriasToSearchDocsFromPayForEmailSendingForm(date, orgId) {
      const data = [
        {
          'dataType': 'DATE',
          'key': 'dataDoc',
          'operation': 'EQUALS',
          'type': 'AND',
          'values': [
            new Date(date).toLocaleDateString()
          ]
        }
      ]

      if (orgId) {
        data.push({
          'dataType': 'INTEGER',
          'key': 'myOrg.id',
          'operation': 'EQUALS',
          'type': 'AND',
          'values': [
            orgId
          ]
        })
      }

      return data
    },

    createCriteriasToSearchDocsToPayForEmailSendingForm(date, orgId) {
      const secDate = new Date(date)
      secDate.setDate(secDate.getDate() + 1)
      const data = [
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

      if (orgId) {
        data.push({
          'dataType': 'INTEGER',
          'key': 'platId',
          'operation': 'EQUALS',
          'type': 'AND',
          'values': [
            orgId
          ]
        })
      }

      return data
    },

    createCriteriasToSearchPaymentByCashboxForEmailSendingForm(date, orgId) {
      const data = [
        {
          'dataType': 'DATE',
          'key': 'paymentDate',
          'operation': 'EQUALS',
          'type': 'AND',
          'values': [
            new Date(date).toLocaleDateString()
          ]
        }
      ]

      if (orgId) {
        data.push({
          'dataType': 'INTEGER',
          'key': 'payer.id',
          'operation': 'EQUALS',
          'type': 'AND',
          'values': [
            orgId
          ]
        })
      }

      return data
    },

    createCriteriasToSearchVNPLDocsForEmailSendingForm(date, orgId) {
      const data = [
        {
          'dataType': 'DATE',
          'key': 'dataDoc',
          'operation': 'EQUALS',
          'type': 'AND',
          'values': [
            new Date(date).toLocaleDateString()
          ]
        },
        {
          'dataType': 'VARCHAR',
          'key': 'nameDoc',
          'operation': 'LIKE',
          'type': 'AND',
          'values': [
            'ВнПл'
          ]
        }
      ]

      if (orgId) {
        data.push({
          'dataType': 'INTEGER',
          'key': 'myOrg.id',
          'operation': 'EQUALS',
          'type': 'AND',
          'values': [
            orgId
          ]
        })
      }

      return data
    },

    createParamsForRequestDocForPayGroupByDepName(dateOplat, groupFields) {
      const aggregateFunctions = [
        {
          'field': 'sumDoc',
          'function': 'SUM'
        },
        {
          'field': 'sumPaid',
          'function': 'SUM'
        }
      ]

      const searchCriteria = this.createCriteriasToSearchDocsFromPayByDataOplat(dateOplat)

      return {
        aggregateFunctions: aggregateFunctions,
        groupFields: groupFields,
        searchCriteria: searchCriteria
      }
    },

    createCriteriasToSearchDocsFromPayByDataOplat(dateOplat) {
      return [
        {
          dataType: 'DATE',
          key: 'dataOplat',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            dateOplat
          ]
        }
      ]
    },

    createParamsForRequestDocForPayGroupByDataOplat(firstDate, lastDate, groupFields) {
      const aggregateFunctions = [
        {
          'field': 'sumDoc',
          'function': 'SUM'
        },
        {
          'field': 'sumPaid',
          'function': 'SUM'
        }
      ]

      const searchCriteria = this.createCriteriasToSearchDocsFromPayBetweenDataOplatDates(firstDate, lastDate)

      return {
        aggregateFunctions: aggregateFunctions,
        groupFields: groupFields,
        searchCriteria: searchCriteria
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
      return [{
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
        }
      ]
    },

    // Функция для создания критериев для отбора кодов маркировок по номеру заказа и датам
    // numberOfOrder - номер заказа
    // startDate - дата начала периода
    // endDate - дата конца периода
    createCriteriasForMarkCodeRequest(numberOfOrder, startDate, endDate) {
      const data = []

      if (numberOfOrder) {
        const criteriaByNumber = {
          'dataType': 'VARCHAR',
          'key': 'markOrder.markCodeRequest.productionOrderId',
          'operation': 'EQUALS',
          'type': 'AND',
          'values': [
            numberOfOrder
          ]
        }
        data.push(criteriaByNumber)
      }

      const criteriaByDates = {
        'dataType': 'DATE',
        'key': 'dateAdd',
        'operation': 'BETWEEN',
        'type': 'AND',
        'values': [
          new Date(startDate).toLocaleDateString(), new Date(endDate).toLocaleDateString()
        ]
      }

      data.push(criteriaByDates)

      return data
    },

    createCriteriasForCommodityLogOfSewingPlan(params) {
      const criterias = {
        page: 1,
        size: 20
      }

      if (params) {
        if (params.currentPage) {
          criterias.page = params.currentPage
        }
      }

      return criterias
    },

    createCriteriasToSearchBalanceOfPaymentAccount(dateOplat, orgId, accId) {
      return [
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
        }
      ]
    },

    createCriteriasToSearchDocsToPayOfOrg(orgId, date) {
      return [
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
    },

    createCriteriasToSearchExecutorsByDepartmentId(depId) {
      return [
        {
          dataType: 'INTEGER',
          key: 'otdId',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            depId
          ]
        },
        {
          dataType: 'DATE',
          key: 'dataUvol',
          operation: 'BETWEEN',
          type: 'OR',
          values: [
            '01.01.1900', '02.01.1900'
          ]
        },
        {
          dataType: 'DATE',
          key: 'dataUvol',
          operation: 'GREATER_THAN',
          type: 'OR',
          values: [
            this.getDateForCriteriasToSearchExecutorsByDataUvol().toLocaleDateString()
          ]
        }
      ]
    },

    createCriteriasToSearchTypeOfDocsForDocsForPay() {
      return [
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
    },

    createParamsForRequestPaymentAccGroupByOrg(date, groupFields) {
      const aggregateFunctions = [
        {
          'field': 'saldo',
          'function': 'SUM'
        },
        {
          'field': 'nalich',
          'function': 'SUM'
        },
        {
          'field': 'credit',
          'function': 'SUM'
        },
        {
          'field': 'vnpl',
          'function': 'SUM'
        },
        {
          'field': 'sumToPay',
          'function': 'SUM'
        }
      ]

      const searchCriteria = this.createSearchCriteriasForRequestPaymentAccGroupByOrg(date)

      return {
        aggregateFunctions: aggregateFunctions,
        groupFields: groupFields,
        searchCriteria: searchCriteria
      }
    },

    createSearchCriteriasForRequestPaymentAccGroupByOrg(date) {
      return [
        {
          dataType: 'DATE',
          key: 'dataOplat',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            new Date(date).toLocaleDateString()
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'myOrg.orgType.code',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            '1'
          ]
        }
      ]
    },

    createCriteriasToGetResultsOfContent(searchCriterias) {
      const aggregateFunctions = [
        {
          'field': 'sumDoc',
          'function': 'SUM'
        },
        {
          'field': 'sumPaid',
          'function': 'SUM'
        },
        {
          'field': 'sumToPay',
          'function': 'SUM'
        }
      ]

      return {
        aggregateFunctions: aggregateFunctions,
        searchCriteria: searchCriterias
      }
    },

    createCriteriasToFindPaymentAccount(accId, date) {
      return [
        {
          dataType: 'VARCHAR',
          key: 'acc.id',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            accId
          ]
        },
        {
          dataType: 'DATE',
          key: 'dataOplat',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            new Date(date).toLocaleDateString()
          ]
        }
      ]
    },

    createCriteriasToFindTwoPaymentAccounts(firstAccId, secondAccId, dateOfDoc) {
      return [
        {
          dataType: 'VARCHAR',
          key: 'acc.id',
          operation: 'EQUALS',
          type: 'OR',
          values: [
            firstAccId
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'acc.id',
          operation: 'EQUALS',
          type: 'OR',
          values: [
            secondAccId
          ]
        },
        {
          dataType: 'DATE',
          key: 'dataOplat',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            new Date(dateOfDoc).toLocaleDateString()
          ]
        }
      ]
    },

    createCriteriasToFindPaymentAccountsByOrgIdAndDataOplat(orgId, dataOplat) {
      return [
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
          dataType: 'DATE',
          key: 'dataOplat',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            new Date(dataOplat).toLocaleDateString()
          ]
        }
      ]
    },

    createCriteriaToSearchUserByLogin(login) {
      return {
        dataType: 'VARCHAR',
        key: 'login',
        operation: 'EQUALS',
        type: 'AND',
        values: [
          login
        ]
      }
    },

    createCriteriasToSearchDocToPayByDocoplId(docoplId) {
      return [
        {
          dataType: 'VARCHAR',
          key: 'docoplId',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            docoplId
          ]
        }
      ]
    },

    createCriteriaToSearchExecutorById(executorId) {
      return {
        dataType: 'VARCHAR',
        key: 'id',
        operation: 'EQUALS',
        type: 'AND',
        values: [
          executorId
        ]
      }
    },

    createParamsToSearchTotalSumOplatOfDocsToPayBetweenDates(startDate, endDate) {
      return {
        aggregateFunctions: [
          {
            field: 'sumOplat',
            function: 'SUM'
          },
          {
            field: 'id',
            function: 'MIN'
          }
        ],
        searchCriteria: this.createCriteriasForRequestToSearchDocumentsToPayBetweenDates(startDate, endDate)
      }
    },

    createCriteriasForRequestToSearchDocumentsToPayBetweenDates(startDate, endDate) {
      return [{
        'dataType': 'DATE',
        'key': 'dataOplat',
        'operation': 'BETWEEN',
        'type': 'AND',
        'values': [
          new Date(startDate).toLocaleDateString(), new Date(endDate).toLocaleDateString()
        ]
      }]
    },

    createParamsToSearchTotalToPaySumOfPaymentsByCashboxBetweenDates(startDate, endDate) {
      return {
        aggregateFunctions: [
          {
            field: 'toPaySum',
            function: 'SUM'
          },
          {
            field: 'id',
            function: 'MIN'
          }
        ],
        searchCriteria: this.createCriteriasForSearchPaymentsByCashboxBetweenDates(startDate, endDate)
      }
    },

    createCriteriasForSearchPaymentsByCashboxBetweenDates(startDate, endDate) {
      return [{
        dataType: 'DATE',
        key: 'paymentDate',
        operation: 'BETWEEN',
        type: 'AND',
        values: [
          new Date(startDate).toLocaleDateString(), new Date(endDate).toLocaleDateString()
        ]
      }]
    },

    createCriteriasToSearchAcc(date, accId) {
      return [
        {
          dataType: 'DATE',
          key: 'dataOplat',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            new Date(date).toLocaleDateString()
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
        }
      ]
    },

    createCriteriasToFindMoneyDistributionByDepartments(date, departments) {
      const data = [
        {
          dataType: 'DATE',
          key: 'distributionDate',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            new Date(date).toLocaleDateString()
          ]
        }
      ]

      for (const department of departments) {
        const elem = {
          dataType: 'INTEGER',
          key: 'department.id',
          operation: 'EQUALS',
          type: 'OR',
          values: [
            department.id
          ]
        }
        data.push(elem)
      }

      return data
    },

    createCriteriasToSearchOrdersOnTailoringByPage(filtersParams) {
      const data = [
        {
          dataType: 'VARCHAR',
          key: 'userId',
          operation: 'EQUALS',
          type: 'OR',
          values: [
            '11'
          ]
        }
      ]

      if (filtersParams) {
        for (const key in filtersParams) {
          let elemParam = filtersParams[key]
          if (!elemParam) {
            continue
          }

          const dataType = 'VARCHAR'
          const operation = 'EQUALS'

          const dataElem = {
            dataType,
            key,
            operation,
            type: 'AND',
            values: [
              elemParam
            ]
          }
          data.push(dataElem)
        }
      }

      return data
    },

    createCriteriasToSearchOrgForRecordsOfWorkByCardsForm() {
      return {
        params: { descr: 'Larisa' },
        procName: 'dbo.sel_proizv_our'
      }
    },

    createCriteriasForSearchBudgetByDate(date) {
      return [
        {
          dataType: 'DATE',
          key: 'distributionDate',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            new Date(date).toLocaleDateString()
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'department',
          operation: 'IS_NULL',
          type: 'AND',
          'values': [
            'true'
          ]
        }
      ]
    },

    createCriteriasToSearchMoneyDistributionByDepartments(date, departments) {
      const data = [
        {
          dataType: 'DATE',
          key: 'distributionDate',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            new Date(date).toLocaleDateString()
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'department.prDel',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            '0'
          ]
        }
      ]

      for (const department of departments) {
        const dataElem = {
          dataType: 'VARCHAR',
          key: 'department.id',
          operation: 'EQUALS',
          type: 'OR',
          values: [
            department.id
          ]
        }

        data.push(dataElem)
      }

      return data
    },

    createParamsToSearchMoneyDistributionByDepParents(date, depParents) {
      return {
        aggregateFunctions: [
          {
            field: 'distributionSum',
            function: 'SUM'
          }
        ],

        groupFields: [
          'department.parentId'
        ],

        searchCriteria: this.createCriteriasToSearchMoneyDistributionByDepsParents(date, depParents)
      }
    },

    createCriteriasToSearchMoneyDistributionByDepsParents(date, depParents) {
      const data = [
        {
          dataType: 'DATE',
          key: 'distributionDate',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            new Date(date).toLocaleDateString()
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'department.prDel',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            '0'
          ]
        }
      ]

      for (const depParent of depParents) {
        const dataElem = {
          dataType: 'VARCHAR',
          key: 'department.parentId',
          operation: 'EQUALS',
          type: 'OR',
          values: [
            depParent.id
          ]
        }

        data.push(dataElem)
      }

      return data
    },

    createCriteriasToSearchMoneyDistributionByDepId(depId, date) {
      return [
        {
          dataType: 'DATE',
          key: 'distributionDate',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            new Date(date).toLocaleDateString()
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'department.prDel',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            '0'
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'department.id',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            depId
          ]
        }
      ]
    },

    createCriteriasToSearchMoneyDistributionByDepParentId(depParentId, date) {
      return [
        {
          dataType: 'DATE',
          key: 'distributionDate',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            new Date(date).toLocaleDateString()
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'department.prDel',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            '0'
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'department.parentId',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            depParentId
          ]
        }
      ]
    },

    createCriteriaToSearchMainDepartments() {
      return [
        {
          dataType: 'VARCHAR',
          key: 'parentId',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            '0'
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'prDel',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            '0'
          ]
        }
      ]
    },

    createCriteriasToSearchDivisions(depParentId) {
      return [
        {
          dataType: 'VARCHAR',
          key: 'parentId',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            depParentId
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'prDel',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            '0'
          ]
        }
      ]
    },

    createCriteriasToSearchDepartmentsForDocFromPayForm() {
      return [
        {
          dataType: 'VARCHAR',
          key: 'tipPodr',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            '2'
          ]
        }
      ]
    },

    // TODO добавить новую колонку в таблицу sp_org, которая будет обозначать актуальность организации
    createCriteriasToSearchActualOrganizations() {
      return [
        {
          dataType: 'VARCHAR',
          key: 'id',
          operation: 'EQUALS',
          type: 'OR',
          values: [
            '159'
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'id',
          operation: 'EQUALS',
          type: 'OR',
          values: [
            '123'
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'id',
          operation: 'EQUALS',
          type: 'OR',
          values: [
            '31245'
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'id',
          operation: 'EQUALS',
          type: 'OR',
          values: [
           '22110'
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'id',
          operation: 'EQUALS',
          type: 'OR',
          values: [
            '19469'
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'id',
          operation: 'EQUALS',
          type: 'OR',
          values: [
            '30238'
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'id',
          operation: 'EQUALS',
          type: 'OR',
          values: [
            '30237'
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'id',
          operation: 'EQUALS',
          type: 'OR',
          values: [
            '29001'
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'id',
          operation: 'EQUALS',
          type: 'OR',
          values: [
            '31437'
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'id',
          operation: 'EQUALS',
          type: 'OR',
          values: [
            '36314'
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'id',
          operation: 'EQUALS',
          type: 'OR',
          values: [
            '31699'
          ]
        },
        {
          dataType: 'VARCHAR',
          key: 'id',
          operation: 'EQUALS',
          type: 'OR',
          values: [
            '29224'
          ]
        },
      ]
    }
  }
})
