/* eslint-disable */
export const factory = send => ({
    auth: {
        login(credentials) {
            return send('POST', '', {...credentials })
        },

        user: {
            get() {
                return send('GET', '/auth/findByCurrentLogin')
            }
        },

        users: {
            get() {
                return send('GET', '/auth/findUsers')
            }
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
        }
    },

    organizations: {
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
        }
    },

    paymentAccounts: {
        findAccByOrgId(params) {
            return send('GET', `/oper/spAcc/findByOrgId?${new URLSearchParams(params).toString()}`)
        },
        groupByOrg(params) {
            return send('GET', `/oper/spOplat/groupByOrg?${new URLSearchParams(params).toString()}`)
        },
        findByDataOplatAndMyOrgId(params) {
            return send('GET', `/oper/spOplat/findByDataOplatAndMyOrgId?${new URLSearchParams(params).toString()}`)
        }
    },

    budgetElements: {
        findDepartments() {
            return send('GET', '/oper/dict/spViddocopl/findDepartments')
        },
        findDocumentTypesByParentId(params) {
            return send('GET', `/oper/dict/spViddocopl/findByParentId?${new URLSearchParams(params).toString()}`)
        },
        findDocumentTypeById(id) {
            return send('GET', `/oper/dict/spViddocopl/findById/${id}`)
        },
        findContractsByExecId(params) {
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
        }
    },

    typeOfDocuments: {
        findAll() {
            return send('GET', '/oper/dict/spViddoc/findAll')
        }
    },

    payment: {
        selOplat() {
            return send('POST', '/oper/spDocopl/selOplat')
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
                return send('POST', `/oper/spDocoplToPay/findBySearchCriterias`, params)
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
                return send('POST', `/oper/spDocopl/findBySearchCriterias`, params)
            },

            deleteSelectedPayments(params) {
                return send('POST', `/oper/spDocopl/deletePayment`, params)
            },

            findById(id) {
                return send('GET', `/oper/spDocopl/findById/${id}`)
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
        }
    }
})