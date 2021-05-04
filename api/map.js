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
            return send('POST', `/markCodeRequest/saveGtinRequest&${new URLSearchParams(params).toString()}`)
        },

        gtinCodeList(params) {
            return send('GET', `/gtin/findAll?page=0&size=99999999&${new URLSearchParams(params).toString()}`)
        },

        gtinCodeSave(params) {
            return send('POST', `/gtinRequest/saveGtinRequest&${new URLSearchParams(params).toString()}`)
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
            return send('POST', `/oper/spDocopl/payDocument?${new URLSearchParams(params).toString()}`)
        },

        findPaymentStatuses() {
            return send('GET', '/oper/spDocopl/findPaymentStatuses')
        },

        docOplToPay: {
            findSpDocoplToPay(params) {
                return send('GET', `/oper/spDocopl/findSpDocoplToPay?${new URLSearchParams(params).toString()}`)
            },
            saveSpDocoplToPay(params) {
                return send('POST', `/oper/spDocopl/saveSpDocoplToPay?${new URLSearchParams(params).toString()}`)
            },
            deleteSelectedPayments(params) {
                return send('POST', `/oper/spDocopl/deleteSelectedPayments?${new URLSearchParams(params).toString()}`)
            }
        },

        docOplForPay: {
            findSpDocoplForPay(params) {
                return send('GET', `/oper/spDocopl/findSpDocoplForPay?${new URLSearchParams(params).toString()}`)
            },
            deleteSelectedPayments(params) {
                return send('POST', `/oper/spDocopl/deletePayment?${new URLSearchParams(params).toString()}`)
            },
            findById(id) {
                return send('GET', `/oper/spDocopl/findById/${id}`)
            },
            save(params) {
                return send('POST', `/oper/spDocopl/save`, params)
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
            }
        }
    }
})