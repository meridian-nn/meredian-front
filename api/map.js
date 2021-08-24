/* eslint-disable */
export const factory = send => ({
    auth: {
        login(credentials) {
            return send('POST', '', {...credentials })
        },

        user: {
            getFindByCurrentLoginUrl() {
                return '/auth/findByCurrentLogin'
            },

            get() {
                return send('GET', '/auth/findByCurrentLogin')
            },

            getRolesOfCurrentUser(id) {
                return send('GET', `/auth/findRolesByUserId?userId=${id}`)
            },

            saveNewUser(params) {
                return send('POST', `/auth/editUser?email=${params.email}&enabled=${params.enabled}&department.id=${params.departmentId}&fullName=${params.fullName}&login=${params.login}&organization=${params.organization}&password=${params.password}&phone=${params.phone}&position=${params.position}&${new URLSearchParams('roles[0].id').toString()}7`)
            },

            saveNewUserByPost(params) {
                return send('POST', `/auth/save`, params)
            },

            editUser(params) {
                return send('POST', `/auth/editUser?${new URLSearchParams(params)}`)
            },

            getUsersBySearchCriterias(params) {
                return send('POST', '/auth/findBySearchCriteriaList', params)
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
                return send('GET', '/auth/findRoles')
            },

            findBySearchCriteria(params) {
                return send('POST', `/auth/findBySearchCriteria`, params)
            }
        },

        role: {
            get() {
                return send('GET', '/auth/appRole/findAll')
            },

            save(params) {
                return send('POST', '/auth/appRole/save', params)
            }
        },

        privilege: {
            get() {
                return send('GET', '/auth/appPrivilege/findAll')
            },

            save(params) {
                return send('POST', '/auth/appPrivilege/save', params)
            }
        },
    },

    departments: {
        findAll() {
            return send('GET', `/oper/dir/spPodr/findAll`)
        },
        findBySearchCriterias(params) {
            return send('POST', '/oper/dir/spPodr/findBySearchCriteriaList', params)
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
            return send('POST', '/markCode/findBySearchCriteria', params)
        },

        findBySearchCriterias(params) {
            return send('POST', '/markCode/findBySearchCriteriaList', params)
        }
    },

    organizations: {
        findAll() {
            return send('GET', '/oper/dict/spOrg/findAll')
        },
        findByOrgTypeCode(params) {
            return send('GET', `/oper/dict/spOrg/findByOrgTypeCode?${new URLSearchParams(params).toString()}`)
        },
        findByDogId(params) {
            return send('GET', `/oper/dict/spOrg/findByDogId?${new URLSearchParams(params).toString()}`)
        },
        findPayers() {
            return send('GET', '/oper/dict/spOrg/findPayers')
        },
        findById(id) {
            return send('GET', `/oper/dict/spOrg/findById/${id}`)
        },
        findInternalOrganizations() {
            return send('GET', '/oper/dict/spOrg/findInternalOrg')
        },
        findBySearchCriterias(params) {
            return send('POST', `/oper/dict/spOrg/findBySearchCriteriaList`, params)
        },
        findBySearchCriteria(params) {
            return send('POST', `/oper/dict/spOrg/findBySearchCriteria`, params)
        }
    },

    paymentAccounts: {
        findAccByOrgId(params) {
            return send('GET', `/oper/spAcc/findByOrgId?${new URLSearchParams(params).toString()}`)
        },
        groupBy(params) {
            return send('POST', '/oper/spOplat/groupBy', params)
        },
        findByDataOplatAndMyOrgId(params) {
            return send('GET', `/oper/spOplat/findByDataOplatAndMyOrgId?${new URLSearchParams(params).toString()}`)
        },
        findBySearchCriteriaList(params) {
            return send('POST', '/oper/spOplat/findBySearchCriteriaList', params)
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
        findDepartmentsBySearchCriterias(params) {
            return send('POST', `/oper/dict/spViddocopl/findBySearchCriteriaList`, params)
        },
        findDepartmentsBySearchCriteria(params) {
            return send('POST', `/oper/dict/spViddocopl/findBySearchCriteria`, params)
        },
        findAllDocumentsTypes() {
            return send('GET', '/oper/dict/spViddocopl/findAll')
        },
        findDocumentTypeById(id) {
            return send('GET', `/oper/dict/spViddocopl/findById/${id}`)
        },
        findContracts(params) {
            return send('GET', `/oper/dogSelDogSpisSpec/findByMyDescr?${new URLSearchParams(params).toString()}`)
        },
        findGroups() {
            return send('GET', '/oper/dict/spViddocopl/findGroup')
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
        },
        findBySearchCriteria(params) {
            return send('POST', `/oper/dict/spIsp/findBySearchCriteria`, params)
        }
    },

    typeOfDocuments: {
        findAll() {
            return send('GET', '/oper/dict/spViddoc/findAll')
        },
        findBySearchCriteria(params) {
            return send('POST', '/oper/dict/spViddoc/findBySearchCriteriaList', params)
        }
    },

    productionDepartments: {
      findBySearchCriteriaList(params) {
        return send('POST', '/oper/dict/vrOtd/findBySearchCriteriaList', params)
      }
    },

    payment: {
        selOplat() {
            return send('POST', this.getSelOplatUrl())
        },

        getSelOplatUrl() {
            return '/oper/spDocopl/selOplat'
        },

        savePaymentByCashbox(params) {
            return send('POST', '/oper/payment/save', params)
        },

        findPaymentByCashboxById(id) {
            return send('GET', `/oper/payment/findById/${id}`)
        },

        findPaymentsByCashboxByCriteria(params) {
            return send('POST', '/oper/payment/findBySearchCriteria', params)
        },

        findPaymentsByCashboxByCriterias(params) {
            return send('POST', '/oper/payment/findBySearchCriteriaList', params)
        },

        findPaymentsByCashboxByPageWithCriterias(params) {
            return send('POST', `/oper/payment/findPageBySearchCriteriaList`, params)
        },

        deletePaymentUrl(params) {
            return send('POST', '/oper/payment/delete', params)
        },

        getDeletePaymentUrl() {
            return '/oper/payment/delete'
        },

        findPaymentsWithGroupBy(params) {
            return send('POST', `/oper/payment/groupBy`, params)
        },

        payDocument(params) {
            return send('POST', this.getPayDocumentUrl(), params)
        },

        getPayDocumentUrl() {
            return `/oper/spDocopl/payDocument`
        },

        findPaymentStatuses() {
            return send('GET', '/oper/spDocopl/findPaymentStatuses')
        },

        saveInternalPayment(params) {
            return send('POST', this.getSaveInternalPaymentUrl(), params)
        },

        getSaveInternalPaymentUrl() {
            return `/oper/spDocopl/saveInternalPayment`
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
                return send('POST', '/oper/spDocoplToPay/findBySearchCriteria', params)
            },

            findDocumentsByCriteriasByPage(params) {
                return send('POST', `/oper/spDocoplToPay/findPageBySearchCriteriaList`, params)
            },

            findDocumentsByCriteriasWithGroupBy(params) {
                return send('POST', `/oper/spDocoplToPay/groupBy`, params)
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
                return send('POST', '/oper/spDocoplToPay/findBySearchCriteriaList', params)
            },

            saveSpDocoplToPay(params) {
                return send('POST', this.getSaveSpDocoplToPayUrl(), params)
            },

            getSaveSpDocoplToPayUrl() {
                return '/oper/spDocopl/saveSpDocoplToPay'
            },

            deleteSelectedPayments(params) {
                return send('POST', this.getDeleteSelectedPaymentsUrl(), params)
            },

            getDeleteSelectedPaymentsUrl() {
                return `/oper/spDocopl/deleteSelectedPayments`
            }
        },

        docOplForPay: {
            findSpDocoplForPay(params) {
                return send('GET', `/oper/spDocopl/findSpDocoplForPay?${new URLSearchParams(params).toString()}`)
            },

            // Производит поиск документов на оплату, у которых переданная в параметре запроса дата находится в промежутке между data_doc и data_oplat
            findSpDocoplForPayBetweenDates(params) {
                return send('GET', `/oper/spDocopl/findSpDocoplForPayBetweenDates?${new URLSearchParams(params).toString()}`)
            },

            // Производит поиск документов на оплату, у которых data_doc находится в промеждутке между startDate и finishDate, которые переданы в параметрах запроса
            findByDataDocBetweenParamDates(params) {
                return send('GET', `/oper/spDocoplRead/findByDataDocBetween?${new URLSearchParams(params).toString()}`)
            },

            // Производит поиск документов на оплату, у которых data_oplat находится в промеждутке между startDate и finishDate, которые переданы в параметрах запроса
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
	        } */
            findDocumentsByCriteria(params) {
                return send('POST', '/oper/spDocopl/findBySearchCriteria', params)
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
                  ] */
            findDocumentsByCriterias(params) {
                return send('POST', '/oper/spDocopl/findBySearchCriteriaList', params)
            },

            // Поиск документов с кастомным респонсом для таблицы "Документы на оплату" на форме "Журнал документов на оплату"
            findDocumentsForPayByCriterias(params) {
                return send('POST', '/oper/spDocoplRead/findBySearchCriteriaList', params)
            },

            findDocumentsForPayForJournalTable(params) {
                return send('POST', '/oper/spDocoplRead/findPageBySearchCriteriaList', params)
            },

            findDocumentsWithGroupBy(params) {
                return send('POST', `/oper/spDocoplRead/groupBy`, params)
            },

            deleteSelectedPayments(params) {
                return send('POST', '/oper/spDocopl/deletePayment', params)
            },

            getDeletePaymentUrl() {
                return `/oper/spDocopl/deletePayment`
            },

            findById(id) {
                return send('GET', `/oper/spDocopl/findById/${id}`)
            },

            findByIdRead(id) {
                return send('GET', `/oper/spDocoplRead/findById/${id}`)
            },

            save(params) {
                return send('POST', '/oper/spDocopl/save', params)
            },

            savePayment(params) {
                return send('POST', '/oper/spDocopl/savePayment', params)
            },

            saveSpDocch(params) {
                return send('POST', '/oper/spDocopl/saveSpDocch', params)
            },

            deleteInternalPaymentDocument(params) {
                return send('POST', this.getDeleteInternalPaymentDocument(), params)
            },

            getDeleteInternalPaymentDocument() {
                return '/oper/spDocopl/deleteInternalPayment'
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
                return send('POST', this.getSaveUrl(), params)
            },
            getSaveUrl() {
                return `/oper/depMoneyDistribution/save`
            },
            saveAll(params) {
                return send('POST', `/oper/depMoneyDistribution/saveAll`, params)
            },
            saveList(params) {
                return send('POST', this.getSaveUrlForDepartments(), params)
            },
            getSaveUrlForDepartments() {
                return '/oper/depMoneyDistribution/saveList'
            },
            findBySearchCriterias(params) {
                return send('POST', `/oper/depMoneyDistribution/findBySearchCriteriaList`, params)
            },
            groupBy(params) {
                return send('POST', `/oper/depMoneyDistribution/groupBy`, params)
            }
        },

        balanceOfPaymentAccount: {
            save(params) {
                return send('POST', '/oper/spOplat/save', params)
            },
            saveAll(params) {
                return send('POST', this.getSaveAllUrl(), params)
            },
            getSaveAllUrl() {
                return '/oper/spOplat/saveAll'
            }
        },

        typesOfPaymentTransactions: {
            findAll() {
                return send('GET', '/oper/dir/paymentOperationType/findAll')
            },

            findById(id) {
                return send('GET', `/oper/dir/paymentOperationType/findById/${id}`)
            }
        },

        typesOfPayments: {
            findAll() {
                return send('GET', '/oper/dir/paymentType/findAll')
            },

            findById(id) {
                return send('GET', `/oper/dir/paymentType/findById/${id}`)
            }
        },

        incomingPaymentDocuments: {
            getInitIncomingPaymentDocumentProcedure() {
                return 'dbo.init_incoming_payment_document'
            },
            findPageBySearchCriteriaList(params) {
                return send('POST', `/oper/incomingPaymentDocument/findPageBySearchCriteriaList`, params);
            },
            findDocumentsWithGroupBy(params) {
                return send('POST', `/oper/incomingPaymentDocument/groupBy`, params)
            },
            findAllColoborators() {
                return send('GET', `/oper/spSoisp/findAll`)
            },
            findColoboratorBySearchCriteria(criteria) {
                return send('POST', '/oper/spSoisp/findBySearchCriteria', criteria)
            },
            getVIspfInIncomingPaymentDocumentsInitDataProcedureName() {
                return 'dbo.v_ispf'
            }
        },

        outgoingPayment: {
            getOutgoingPaymentDocumentsInitDataProcedureName() {
                return 'dbo.init_outgoing_payment_document'
            },
            getForWhomsInOutgoingPaymentDocumentsInitDataProcedureName() {
                return 'dbo.v_ispf'
            },

            getBudgetsDepartmentsInOutgoingPaymentDocumentsInitDataProcedureName() {
                return 'dbo.bud_sel_podr'
            },
            getBudgetsArticlesInOutgoingPaymentDocumentsInitDataProcedureName() {
                return 'dbo.bud_sel_stati'
            },
            getForGenerateBudgetInOutgoingPaymentDocumentsInitDataProcedureName() {
                return 'dbo.bud_ins_temp'
            },
            getDataAfterGenerateBudgetInOutgoingPaymentDocumentsInitDataProcedureName() {
                return 'dbo.bud_form'
            },
            findPageBySearchCriterias(params) {
                return send('POST', `/oper/outgoingPaymentDocument/findPageBySearchCriteriaList`, params)
            },
            findDocumentsWithGroupBy(params) {
                return send('POST', `/oper/outgoingPaymentDocument/groupBy`, params)
            },
            findAllColoborators() {
                return send('GET', `/oper/spSoisp/findAll`)
            },
            findAllBudElemends() {
                return send('GET', `/oper/budElem/findAll`)
            }
        },

        getPrepareDeletePaymentDocumentsInitDataProcedureName() {
          return 'dbo.ins_opnds_day'
        },
        getDeletePaymentDocumentsInitDataProcedureName() {
          return 'dbo.del_find'
        },
        saveNewDocument(params) {
            return send('POST', '/oper/spFind/save', params)
        },
        getPayersInPaymentDocumentsInitDataProcedureName() {
            return 'dbo.payers_for_payment_documents'
        },
    },

    uiSettings: {
        findAll() {
            return send('GET', '/uiSetting/findAll')
        },

        findById(id) {
            return send('GET', `/uiSetting/findById/${id}`)
        },

        findBySearchCriteria(params) {
            return send('POST', '/uiSetting/findBySearchCriteria', params)
        },

        findBySearchCriterias(params) {
            return send('POST', '/uiSetting/findBySearchCriteriaList', params)
        },

        save(entity) {
            return send('POST', '/uiSetting/save', entity)
        },

        saveAll(entities) {
            return send('POST', 'uiSetting/saveAll', entities)
        }
    },

    supplyElements: {
        sewingPlan: {
            findAll() {
                return send('GET', '/oper/supply/spPlanpsv/findAll')
            },

            findById(id) {
                return send('GET', `/oper/supply/spPlanpsv/findById/${id}`)
            },

            findBySearchCriteria(params) {
                return send('POST', '/oper/supply/spPlanpsv/findBySearchCriteria', params)
            },

            findBySearchCriterias(params) {
                return send('POST', '/oper/supply/spPlanpsv/findBySearchCriteriaList', params)
            },

            save(params) {
                return send('POST', '/oper/supply/spPlanpsv/save', params)
            },

            saveAll(params) {
                return send('POST', '/oper/supply/spPlanpsv/saveAll', params)
            }
        },

        supply: {
            selPlanpsvZaivk(params) {
                return send('POST', '/oper/supply/selPlanpsvZaivkOtladka/selPlanpsvZaivk', params)
            },

            findAll() {
                return send('GET', '/oper/supply/selPlanpsvZaivkOtladka/findAll')
            },

            findById(id) {
                return send('GET', `/oper/supply/selPlanpsvZaivkOtladka/findById/${id}`)
            },

            findBySearchCriteria(params) {
                return send('POST', '/oper/supply/selPlanpsvZaivkOtladka/findBySearchCriteria', params)
            },

            findBySearchCriteriaList(params) {
                return send('POST', '/oper/supply/selPlanpsvZaivkOtladka/findBySearchCriteriaList', params)
            },

            findPageBySearchCriteriaList(params) {
                return send('POST', '/oper/supply/selPlanpsvZaivkOtladka/findPageBySearchCriteriaList', params)
            }
        }
    },

    manufacturing: {
        findPageBySearchCriterias(params) {
            return send('POST', `/oper/manufacturing/manufacturingRequest/findPageBySearchCriteriaList`, params)
        },

        findMonthOfProductionBySearchCriterias(params) {
            return send('POST', `/oper/manufacturing/techZarCurrMont/findBySearchCriteriaList`, params)
        },

        getSelProizvOurProcedureName() {
            return 'dbo.sel_proizv_our'
        },

        getManufacturingRequestInitDataProcedureName() {
            return 'dbo.manufacturing_request_init_data'
        },

        getManufacturingVZkzpsv(params) {
          return send('POST', '/oper/manufacturing/vrZkzpsv/findBySearchCriteriaList', params)
        },

        getManufacturingvZkzpsvDopwork(params) {
          return send('POST', '/oper/manufacturing/vrZkzpsvDopwork/findBySearchCriteriaList', params)
        },

        getManufacturingUpdateZkzpsvDopworkProcName() {
          return 'dbo.update_zkzpsv_dopwork'
        },

        getTechTmkUpdDataProcedureName() {
            return 'dbo.tech_tmk_upd_data'
        },

        getTechZarplSetPeriodProcedureName() {
            return 'dbo.tech_zarpl_set_period'
        },

        getTechZarAllPereschetName() {
            return 'dbo.tech_zar_all_pereschet'
        },

        manufacturingRequestJournalFindAll() {
            return send('GET', '/oper/manufacturing/manufacturingRequestJournal/findAll')
        },

        manufacturingRequestJournalFindPageBySearchCriteriaList(params) {
          return send('POST', '/oper/manufacturing/manufacturingRequestJournal/findPageBySearchCriteriaList', params)
        },

        manufacturingRequestJournalRemove(params) {
            return send('POST', '/oper/manufacturing/manufacturingRequestJournal/delete', params)
        },

        manufacturingRequestJournalEdit(params) {
            return send('POST', '/oper/manufacturing/manufacturingRequestJournal/save', params)
        },

        getManufacturingRequestJournalInitDataProcedureName() {
          return 'dbo.manufacturing_request_journal_init_data'
        },

        getDelZkzpsvProcedureName() {
          return 'dbo.del_zkzpsv'
        },

        findOrgOperationsBySearchCriterias(params) {
          return send('POST', '/oper/manufacturing/orgOperation/findBySearchCriteriaList', params)
        },

        findOperationsSumsBySearchCriterias(params) {
          return send('POST', '/oper/manufacturing/operationSum/findBySearchCriteriaList', params)
        },

        findOperationsSumsFromSzTableBySearchCriterias(params) {
          return send('POST', '/oper/manufacturing/operationSumSz/findBySearchCriteriaList', params)
        },

        findSeparationSchemeBySearchCriterias(params) {
          return send('POST', '/oper/manufacturing/divisionScheme/findBySearchCriteriaList', params)
        },

        getViewOrderBySizeProcedureName() {
          return 'dbo.sel_zkzpsvrz'
        },

        getUpdateTableInViewOrderBySizeProcedureName() {
          return 'dbo.ins_zkzrz_spplnrz'
        },

        getProcedureNameForProcedureExecutionBeforeSaveDateTailoring() {
          return 'dbo.ins_temp_form'
        },

        getProcedureNameForProcedureExecutionSaveDateTailoring() {
          return 'dbo.update_zkzpsv_fact_data'
        },

        getProcedureNameForProcedureExecutionInitDataOnPrint() {
          return 'dbo.print_zkzpsv'
        },

        getProcedureNameForProcedureExecutionClearTempTable() {
          return 'dbo.del_temp_form'
        },
        getProcedureNameForProcedureExecutionClearTempTableForNewConsolidatedOrder() {
          return 'dbo.del_temp_prn'
        },
        getProcedureNameForProcedureExecutionCreateConsolidatedOrderTempTable() {
          return 'dbo.ins_temp_prn'
        },
        getProcedureNameForProcedureExecutionLoadTableForNewConsolidatedOrder() {
          return 'dbo.ins_zakaz_svod'
        },
        getProcedureNameForProcedureExecutionLoadTableForEditConsolidatedOrder() {
          return 'dbo.update_zakaz_svod'
        },
        getProcedureNameForUpdateСontractOfOrderForTailoring() {
          return 'dbo.update_zkzpsv_dog'
        },
        getProcedureNameForUpdateOrderForTailoring() {
          return 'dbo.update_zkzpsv'
        },
        getProcedureNameForCheckingForAddingCut() {
          return 'dbo.prov_new_pf_psv'
        },
        recordingTheWorkOnTheOrder: {
          findBySearchCriteriaForListOfDressmaker(params) {
            return send('POST', '/oper/manufacturing/seamstressesChoice/findBySearchCriteria', params)
          },

          findBySearchCriteriaForGetDressmaker(params) {
            return send('POST', '/oper/manufacturing/recordedWork/findBySearchCriteria', params)
          },

          findBySearchCriteriaForGetDressmakerFromSzTable(params) {
            return send('POST', '/oper/manufacturing/recordedWorkSz/findBySearchCriteria', params)
          },
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
        executeStashedFunction(params) {
            return send('POST', '/sys/storedProcedure/executeProcedure', params)
        }
    }
})
