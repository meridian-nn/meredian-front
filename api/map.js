/* eslint-disable */
export const factory = send => ({
    auth: {
        login(credentials) {
            return send('POST', '', {...credentials })
        },

        user: {
            get() {
                return send('GET', '/auth/findByCurrentLogin')
            },

            getRolesOfCurrentUser(id) {
                return send('GET', `/auth/findRolesByUserId?userId=${id}`)
            },

            saveNewUser(params) {
                return send('POST', `/auth/editUser?email=${params.email}&enabled=${params.enabled}&department.id=${params.departmentId}&fullName=${params.fullName}&login=${params.login}&organization=${params.organization}&password=${params.password}&phone=${params.phone}&position=${params.position}&${new URLSearchParams('roles[0].id').toString()}7`)
            },

            editUser(params) {
                return send('POST', `/auth/editUser?${new URLSearchParams(params)}`)
            },

            getUsersBySearchCriterias(params) {
                return send('POST', `/auth/findBySearchCriteriaList`, params)
            },

            findById(id) {
              return send('GET', `/auth/findById/${id}`)
            },

            saveUser(params) {
              return send('POST', `/auth/save`, params)
            }
        },

        users: {
            get() {
                return send('GET', '/auth/findUsers')
            },

            getRoles() {
                return send('GET', `/auth/findRoles`)
            },

            findBySearchCriteria(params) {
              return send('POST', `/auth/findBySearchCriteria`, params)
            }
        }
    },

    departments: {
      findAll() {
        return send('GET', `/oper/dir/spPodr/findAll`)
      }
    },

    code: {
        markCodeList(params) {
            return send('GET', `/markCode/findAll?page=0&size=9999${new URLSearchParams(params).toString()}`)
        },

        markCodeSave(params) {
            return send('POST', `/markCodeRequest/saveMarkCodeRequest?${new URLSearchParams(params).toString()}`)
        },

        gtinCodeList(params) {
            return send('GET', `/gtin/findAll?page=0&size=99999999&${new URLSearchParams(params).toString()}`)
        },

        gtinCodeSave(params) {
            return send('POST', `/gtinRequest/saveGtinRequest?${new URLSearchParams(params).toString()}`)
        },

        findBySearchCriteria(params) {
            return send('POST', `/markCode/findBySearchCriteria`, params)
        },

        findBySearchCriterias(params) {
            return send('POST', `/markCode/findBySearchCriteriaList`, params)
        }
    },

    organizations: {
        findAll() {
            return send('GET', `/oper/dict/spOrg/findAll`)
        },
        findByOrgTypeCode(params) {
            return send('GET', `/oper/dict/spOrg/findByOrgTypeCode?${new URLSearchParams(params).toString()}`)
        },
        findByDogId(params) {
            return send('GET', `/oper/dict/spOrg/findByDogId?${new URLSearchParams(params).toString()}`)
        },
        findPayers() {
            return send('GET', `/oper/dict/spOrg/findPayers`)
        },
        findById(id) {
            return send('GET', `/oper/dict/spOrg/findById/${id}`)
        },
        findInternalOrganizations() {
            return send('GET', '/oper/dict/spOrg/findInternalOrg')
        }
    },

    paymentAccounts: {
        findAccByOrgId(params) {
            return send('GET', `/oper/spAcc/findByOrgId?${new URLSearchParams(params).toString()}`)
        },
        groupBy(params) {
          return send('POST', `/oper/spOplat/groupBy`, params)
        },
        findByDataOplatAndMyOrgId(params) {
            return send('GET', `/oper/spOplat/findByDataOplatAndMyOrgId?${new URLSearchParams(params).toString()}`)
        },
        findBySearchCriteriaList(params) {
          return send('POST', `/oper/spOplat/findBySearchCriteriaList`, params)
        },
        findById(id) {
            return send('GET', `/oper/spAcc/findById/${id}`)
        },
        save(paymentAccount) {
          return send('POST', `/oper/spOplat/save`, paymentAccount)
        }
    },

    budgetElements: {
        findDepartments() {
            return send('GET', '/oper/dict/spViddocopl/findDepartments')
        },
        findAllDocumentsTypes() {
          return send('GET', '/oper/dict/spViddocopl/findAll')
        },
        findDocumentTypesByParentId(params) {
            return send('GET', `/oper/dict/spViddocopl/findByParentId?${new URLSearchParams(params).toString()}`)
        },
        findDocumentTypeById(id) {
            return send('GET', `/oper/dict/spViddocopl/findById/${id}`)
        },
        findContracts(params) {
            return send('GET', `/oper/dogSelDogSpisSpec/findByMyDescr?${new URLSearchParams(params).toString()}`)
        },
        findGroups() {
            return send('GET', `/oper/dict/spViddocopl/findGroup`)
        }
    },

    executors: {
        findExecutorsByDepartmentId(params) {
            return send('GET', `/oper/dict/spIsp/findByViddocopl?${new URLSearchParams(params).toString()}`)
        },
        findById(id) {
            return send('GET', `/oper/dict/spIsp/findById/${id}`)
        },
        findAll() {
          return send('GET', `/oper/dict/spIsp/findAll`)
        },
        findBySearchCriterias(params) {
          return send('POST', `/oper/dict/spIsp/findBySearchCriteriaList`, params)
        }
    },

    typeOfDocuments: {
        findAll() {
            return send('GET', '/oper/dict/spViddoc/findAll')
        },
        findBySearchCriteria(params) {
            return send('POST', `/oper/dict/spViddoc/findBySearchCriteriaList`, params)
        }
    },

    payment: {
        selOplat() {
            return send('POST', '/oper/spDocopl/selOplat')
        },

        findPaymentByCashboxById(id) {
            return send('GET', `/oper/payment/findById/${id}`)
        },

        savePaymentByCashbox(params) {
            return send('POST', `/oper/payment/save`, params)
        },

        findPaymentsByCashboxByCriteria(params) {
            return send('POST', `/oper/payment/findBySearchCriteria`, params)
        },

        findPaymentsByCashboxByCriterias(params) {
            return send('POST', `/oper/payment/findBySearchCriteriaList`, params)
        },

        payDocument(params) {
            return send('POST', `/oper/spDocopl/payDocument`, params)
        },

        findPaymentStatuses() {
            return send('GET', '/oper/spDocopl/findPaymentStatuses')
        },

        saveInternalPayment(params) {
            return send('POST', `/oper/spDocopl/saveInternalPayment`, params)
        },

        docOplToPay: {
            findSpDocoplToPay(params) {
                return send('GET', `/oper/spDocopl/findSpDocoplToPay?${new URLSearchParams(params).toString()}`)
            },

            findDocToPayByDocoplForPay(params) {
                return send('GET', `/oper/spDocopl/findDocToPayByDocoplForPay?${new URLSearchParams(params).toString()}`)
            },

            /*
                Производит поиск документов на оплату по заданным параметрам
                Пример передаваемых параметров
                {
                    "dataType": "VARCHAR",
                    "key": "nameDoc",
                    "operation": "EQUALS",
                    "type": "AND",
                    "values": [
                        "583"
                    ]
	            }
            */
            findDocumentsByCriteria(params) {
                return send('POST', `/oper/spDocoplToPay/findBySearchCriteria`, params)
            },

            /*
            Производит поиск документов на оплату по заданным параметрам
            Пример передаваемых параметров
            [
                {
                    "dataType": "DATE",
                    "key": "dataOplat",
                    "operation": "BETWEEN",
                    "type": "AND",
                    "values": [
                        "01.05.2021", "09.05.2021"
                    ]
                },
                {
                    "dataType": "VARCHAR",
                    "key": "nameDoc",
                    "operation": "EQUALS",
                    "type": "AND",
                    "values": [
                        "583"
                    ]
	            }
            ]
            */
            findDocumentsByCriterias(params) {
                return send('POST', `/oper/spDocoplToPay/findBySearchCriteriaList`, params)
            },

            saveSpDocoplToPay(params) {
                return send('POST', `/oper/spDocopl/saveSpDocoplToPay`, params)
            },

            deleteSelectedPayments(params) {
                return send('POST', `/oper/spDocopl/deleteSelectedPayments`, params)
            }
        },

        docOplForPay: {
            findSpDocoplForPay(params) {
                return send('GET', `/oper/spDocopl/findSpDocoplForPay?${new URLSearchParams(params).toString()}`)
            },

            //Производит поиск документов на оплату, у которых переданная в параметре запроса дата находится в промежутке между data_doc и data_oplat
            findSpDocoplForPayBetweenDates(params) {
                return send('GET', `/oper/spDocopl/findSpDocoplForPayBetweenDates?${new URLSearchParams(params).toString()}`)
            },

            //Производит поиск документов на оплату, у которых data_doc находится в промеждутке между startDate и finishDate, которые переданы в параметрах запроса
            findByDataDocBetweenParamDates(params) {
                return send('GET', `/oper/spDocoplRead/findByDataDocBetween?${new URLSearchParams(params).toString()}`)
            },

            //Производит поиск документов на оплату, у которых data_oplat находится в промеждутке между startDate и finishDate, которые переданы в параметрах запроса
            findByDataOplatBetweenParamDates(params) {
                return send('GET', `/oper/spDocoplRead/findByDataOplatBetween?${new URLSearchParams(params).toString()}`)
            },

            /*
            Производит поиск документов на оплату по заданным параметрам
            Пример передаваемых параметров
            {
                "dataType": "VARCHAR",
                "key": "nameDoc",
                "operation": "EQUALS",
                "type": "AND",
                "values": [
                    "583"
                ]
	        }*/
            findDocumentsByCriteria(params) {
                return send('POST', `/oper/spDocopl/findBySearchCriteria`, params)
            },

            /*
            Производит поиск документов на оплату по заданным параметрам
            Пример передаваемых параметров
            [
                {
                    "dataType": "DATE",
                    "key": "dataOplat",
                    "operation": "BETWEEN",
                    "type": "AND",
                    "values": [
                        "01.05.2021", "09.05.2021"
                    ]
                },
                {
                    "dataType": "INTEGER",
                    "key": "myorgId",
                    "operation": "EQUALS",
                    "type": "AND",
                    "values": [
                        "123"
                    ]
                }
            ]*/
            findDocumentsByCriterias(params) {
                return send('POST', `/oper/spDocopl/findBySearchCriteriaList`, params)
            },

            //Поиск документов с кастомным респонсом для таблицы "Документы на оплату" на форме "Журнал документов на оплату"
            findDocumentsForPayByCriterias(params) {
                return send('POST', `/oper/spDocoplRead/findBySearchCriteriaList`, params)
            },

            findDocumentsForPayForJournalTable(params) {
              return send('POST', `/oper/spDocoplRead/findPageBySearchCriteriaList`, params)
            },

            findDocumentsWithGroupBy(params) {
              return send('POST', `/oper/spDocoplRead/groupBy`, params)
            },

            deleteSelectedPayments(params) {
                return send('POST', `/oper/spDocopl/deletePayment`, params)
            },

            findById(id) {
                return send('GET', `/oper/spDocopl/findById/${id}`)
            },

            findByIdRead(id) {
              return send('GET', `/oper/spDocoplRead/findById/${id}`)
            },

            save(params) {
                return send('POST', `/oper/spDocopl/save`, params)
            },

            savePayment(params) {
                return send('POST', `/oper/spDocopl/savePayment`, params)
            },

            saveSpDocch(params) {
                return send('POST', `/oper/spDocopl/saveSpDocch`, params)
            }
        },

        moneyDistributionByDepartments: {
            findBudgetByDate(params) {
                return send('GET', `/oper/depMoneyDistribution/findBudgetByDate?${new URLSearchParams(params).toString()}`)
            },
            findByDepartmentId(params) {
                return send('GET', `/oper/depMoneyDistribution/findByDepartmentId?${new URLSearchParams(params).toString()}`)
            },
            findForEdit(params) {
                return send('GET', `/oper/depMoneyDistribution/findForEdit?${new URLSearchParams(params).toString()}`)
            },
            save(params) {
                return send('POST', `/oper/depMoneyDistribution/save`, params)
            }
        },

        balanceOfPaymentAccount: {
            save(params) {
                return send('POST', `/oper/spOplat/save`, params)
            },
        },

        typesOfPaymentTransactions: {
            findAll() {
                return send('GET', `/oper/dir/paymentOperationType/findAll`)
            },

            findById(id) {
                return send('GET', `/oper/dir/paymentOperationType/findById/${id}`)
            }
        },

        typesOfPayments: {
            findAll() {
                return send('GET', `/oper/dir/paymentType/findAll`)
            },

            findById(id) {
                return send('GET', `/oper/dir/paymentType/findById/${id}`)
            }
        }
    },

    uiSettings: {
        findAll() {
            return send('GET', '/uiSetting/findAll')
        },

        findById(id) {
            return send('GET', `/uiSetting/findById/${id}`)
        },

        findBySearchCriteria(params) {
            return send('POST', `/uiSetting/findBySearchCriteria`, params)
        },

        findBySearchCriterias(params) {
            return send('POST', `/uiSetting/findBySearchCriteriaList`, params)
        },

        save(entity) {
            return send('POST', `/uiSetting/save`, entity)
        },

        saveAll(entities) {
            return send('POST', `uiSetting/saveAll`, entities)
        }
    },

    supplyElements: {
        sewingPlan: {
            findAll() {
                return send('GET', `/oper/supply/spPlanpsv/findAll`)
            },

            findById(id) {
                return send('GET', `/oper/supply/spPlanpsv/findById/${id}`)
            },

            findBySearchCriteria(params) {
                return send('POST', `/oper/supply/spPlanpsv/findBySearchCriteria`, params)
            },

            findBySearchCriterias(params) {
                return send('POST', `/oper/supply/spPlanpsv/findBySearchCriteriaList`, params)
            },

            save(params) {
                return send('POST', `/oper/supply/spPlanpsv/save`, params)
            },

            saveAll(params) {
                return send('POST', `/oper/supply/spPlanpsv/saveAll`, params)
            }
        },

        supply: {
            selPlanpsvZaivk(params) {
                return send('POST', `/oper/supply/selPlanpsvZaivkOtladka/selPlanpsvZaivk`, params)
            },

            findAll() {
                return send('GET', `/oper/supply/selPlanpsvZaivkOtladka/findAll`)
            },

            findById(id) {
                return send('GET', `/oper/supply/selPlanpsvZaivkOtladka/findById/${id}`)
            },

            findBySearchCriteria(params) {
                return send('POST', `/oper/supply/selPlanpsvZaivkOtladka/findBySearchCriteria`, params)
            },

            findBySearchCriteriaList(params) {
                return send('POST', `/oper/supply/selPlanpsvZaivkOtladka/findBySearchCriteriaList`, params)
            },

            findPageBySearchCriteriaList(params) {
                return send('POST', `/oper/supply/selPlanpsvZaivkOtladka/findPageBySearchCriteriaList`, params)
            }
        }
    },

    service: {
        /* в params передавать объект вида
          {
            "params": {},
            "procName": "string"
          }
          Пример генерации params в методе 'createParamsForStashedFunctionSrSelPlanPsv'
         */

        // Функция производит вызов хранимой процедуры в бд
        // возвращает набор данных
        executeStashedFunctionWithReturnedDataSet(params) {
            return send('POST', '/sys/storedProcedure/queryForList', params)
        },

        // Функция производит вызов хранимой процедуры в бд
        // без возврата набора данных
        executedStashedFunction(params) {
            return send('POST', '/sys/storedProcedure/executeProcedure', params)
        }
    }
})
