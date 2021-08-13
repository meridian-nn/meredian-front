// Плагин для создания параметров для вызова хранимых процедур из бд через методы API
// "/sys/storedProcedure/executeProcedure" - Выполнение процедуры без возвращаемого набора данных
// "/sys/storedProcedure/queryForList" - Выполнение процедуры с возвращаемым набором данных
import Vue from 'vue'

Vue.mixin({
  methods: {
    createStructureForSelProizvOurProcedure(userParams) {
      return {
        params: this.createParamsForSelProizvOurProcedure(userParams),
        procName: this.$api.manufacturing.getSelProizvOurProcedureName()
      }
    },

    createParamsForSelProizvOurProcedure(userParams) {
      if (userParams) {
        return userParams
      } else {
        return {
          my_descr: 'Larisa'
        }
      }
    },

    createStructureForManufacturingInitDataProcedure(paramsForRequest) {
      return {
        params: this.createParamsForManufacturingInitDataProcedure(paramsForRequest),
        procName: this.$api.manufacturing.getManufacturingRequestInitDataProcedureName()
      }
    },

    createParamsForManufacturingInitDataProcedure(paramsForRequest) {
      const params = {
        user_id: this.getCurrentUser.id
      }

      if (paramsForRequest) {
        params.proizv_id_1 = paramsForRequest.proizvId
        params.mes_1 = paramsForRequest.monthCurr
        params.god_1 = paramsForRequest.yearCurr
        params.firma_id_1 = paramsForRequest.firmaId

        if (paramsForRequest.zkzpsvId) {
          params.zkzpsv_id_1 = paramsForRequest.zkzpsvId
        }

        if (paramsForRequest.priznak) {
          params.priznak_1 = paramsForRequest.priznak
        }

        if (paramsForRequest.tmkId) {
          params.tmk_id_1 = paramsForRequest.tmkId
        }

        if (paramsForRequest.orgOperId) {
          params.org_oper_id_1 = paramsForRequest.orgOperId
        }

        if (paramsForRequest.schemeCardsId || paramsForRequest.schemeCardsId === 0) {
          params.scheme_cards_id_1 = paramsForRequest.schemeCardsId
        }

        if (paramsForRequest.schemeId || paramsForRequest.schemeId === 0) {
          params.scheme_id_1 = paramsForRequest.schemeId
        }

        if (paramsForRequest.zarSchCardsId || paramsForRequest.zarSchCardsId === 0) {
          params.zar_sch_cards_id_1 = paramsForRequest.zarSchCardsId
        }
      }

      return params
    },

    createStructureForTechTmkUpdData(chosenRecord, variablesOfForm) {
      if (!chosenRecord ||
        !variablesOfForm) {
        return false
      }

      return {
        params: this.createParamsForTechTmkUpdData(chosenRecord, variablesOfForm),
        procName: this.$api.manufacturing.getTechTmkUpdDataProcedureName()
      }
    },

    createParamsForTechTmkUpdData(chosenRecord, variablesOfForm) {
      return {
        priznak1: '1',
        proizv_id1: variablesOfForm.proizvAnfb,
        firma_id1: variablesOfForm.orgAnfb,
        mes1: variablesOfForm.mesAnfb,
        god1: variablesOfForm.godAnfb,
        zkzpsv_id1: chosenRecord.zkzpsvId,
        posled_code1: chosenRecord.posledCode,
        tmk_id1: 0,
        tab_n1: 0,
        colvo1: 0,
        org_oper_id1: 0,
        simple_oper_id1: 0,
        virab_id1: 0,
        opvir_id1: 0,
        schr_id1: 0,
        ceh_id1: 0,
        data_work1: '01.01.1900',
        cod_op1: '',
        colvo_zkzpsv1: chosenRecord.colvoMc,
        pr_upak1: 0,
        obraz1: 0,
        coeff_part1: 0,
        mc_zkzpsv1: chosenRecord.mcId,
        zar_sch_cards_id1: 0,
        scheme_cards_id1: 0,
        scheme_id1: 0,
        pr_otladka1: 0
      }
    },

    createStructureForTechZarplSetPeriod(variablesOfForm, paramsForProcedure) {
      if (!variablesOfForm ||
        !paramsForProcedure) {
        return false
      }

      return {
        params: this.createParamsForTechZarplSetPeriod(variablesOfForm, paramsForProcedure),
        procName: this.$api.manufacturing.getTechZarplSetPeriodProcedureName()
      }
    },

    createParamsForTechZarplSetPeriod(variablesOfForm, paramsForProcedure) {
      return {
        month: paramsForProcedure.newMes,
        year: paramsForProcedure.newGod,
        firma_id: variablesOfForm.orgAnfb,
        raskroy: 0,
        proizv_id: variablesOfForm.proizvAnfb
      }
    },

    createStructureForTechZarAllPereschet(variablesOfForm) {
      return {
        params: this.createParamsForTechZarAllPereschet(variablesOfForm),
        procName: this.$api.manufacturing.getTechZarAllPereschetName()
      }
    },

    createParamsForTechZarAllPereschet(variablesOfForm) {
      return {
        firma_id: variablesOfForm.proizvAnfb === 146 ? 123 : variablesOfForm.orgAnfb,
        proizv_id: variablesOfForm.proizvAnfb === 146 ? 146 : variablesOfForm.proizvAnfb,
        month: variablesOfForm.mesAnfb,
        year: variablesOfForm.godAnfb,
        ceh_id: 6
      }
    },

    createStructureForInitIncomingPaymentDocument() {
      return {
        params: this.createParamsForInitIncomingPaymentDocument(),
        procName: this.$api.payment.incomingPaymentDocuments.getInitIncomingPaymentDocumentProcedure()
      }
    },

    createParamsForInitIncomingPaymentDocument() {
      return {
        vid: 1,
        my_descr: '',
        data1: '2021-06-01',
        data2: new Date().toISOString().slice(0, 10),
        user_id: this.getCurrentUser.id
      }
    },

    createStructureForOutgoingPaymentDocumentsInitDataProcedure(paramsForRequest) {
      return {
        params: this.createParamsForOutgoingPaymentDocumentsInitDataProcedure(paramsForRequest),
        procName: this.$api.payment.outgoingPayment.getOutgoingPaymentDocumentsInitDataProcedureName()
      }
    },

    createParamsForOutgoingPaymentDocumentsInitDataProcedure(paramsForRequest) {
      const params = {
        user_id: this.getCurrentUser.id,
        vid: 1,
        data1: '2021-06-01',
        data2: new Date().toISOString().slice(0, 10)
      }
      if (paramsForRequest) {
        params.vid = paramsForRequest.vid
        params.data1 = paramsForRequest.data1
        params.data2 = paramsForRequest.data2
      }
      return params
    },

    createStructureForSewingOrderLogPageInitDataProcedure() {
      return {
        params: this.createParamsForSewingOrderLogPageInitDataProcedure(),
        procName: this.$api.manufacturing.getManufacturingRequestJournalInitDataProcedureName()
      }
    },

    createParamsForSewingOrderLogPageInitDataProcedure() {
      return {
        data1: '2021-06-01',
        data2: '2021-06-30',
        my_descr: 'Larisa',
        user_id: this.getCurrentUser.id
      }
    },

    createStructureForDelZkzpsvProcedure(idOfRecordForDelete) {
      return {
        params: this.createParamsForDelZkzpsvProcedure(idOfRecordForDelete),
        procName: this.$api.manufacturing.getDelZkzpsvProcedureName()
      }
    },

    createParamsForDelZkzpsvProcedure(idOfRecordForDelete) {
      return {
        zkzpsv_id: idOfRecordForDelete
      }
    },

    createStructureForPayersInOutgoingPaymentDocumentsInitDataProcedure() {
      return {
        params: {},
        procName: this.$api.payment.getPayersInPaymentDocumentsInitDataProcedureName()
      }
    },

    createStructureForExecutorsPaymentDocumentsInitDataProcedure(userParams) {
      return {
        params: userParams,
        procName: this.$api.payment.outgoingPayment.getForWhomsInOutgoingPaymentDocumentsInitDataProcedureName()
      }
    },

    createStructureForBudgetsDepartmentsInitDataProcedure() {
      return {
        params: {},
        procName: this.$api.payment.outgoingPayment.getBudgetsDepartmentsInOutgoingPaymentDocumentsInitDataProcedureName()
      }
    },

    createStructureForBudgetsArticlesInitDataProcedure() {
      return {
        params: {},
        procName: this.$api.payment.outgoingPayment.getBudgetsArticlesInOutgoingPaymentDocumentsInitDataProcedureName()
      }
    },

    createStructureForGenerateIdforNewPaymentDocuments(params) {
      return {
        params: { 'cNameAliasGANN': 'sp_find' },
        procName: 'dbo.getautonewnum'
      }
    },

    createStructureForPayersInIncomingPaymentDocumentsInitDataProcedure() {
      return {
        params: {},
        procName: this.$api.payment.getPayersInPaymentDocumentsInitDataProcedureName()
      }
    },

    createStructureForExecutorsPaymentIncomingDocumentsInitDataProcedure(userParams) {
      return {
        params: userParams,
        procName: this.$api.payment.incomingPaymentDocuments.getVIspfInIncomingPaymentDocumentsInitDataProcedureName()
      }
    },

    createStructureForPrepareDeleteIncomingOutgoingPaymentDocumentInitDataProcedure(paramsForRequest) {
      return {
        params: this.createParamsForPrepareDeleteIncomingOutgoingPaymentDocumentsInitDataProcedure(paramsForRequest),
        procName: this.$api.payment.getPrepareDeletePaymentDocumentsInitDataProcedureName()
      }
    },

    createParamsForPrepareDeleteIncomingOutgoingPaymentDocumentsInitDataProcedure(paramsForRequest) {
      return {
        tip_doc: 2,
        doc_id: paramsForRequest.findId,
        priznak: 1
      }
    },

    createStructureForDeleteIncomingOutgoingPaymentDocumentInitDataProcedure(paramsForRequest) {
      return {
        params: paramsForRequest,
        procName: this.$api.payment.getDeletePaymentDocumentsInitDataProcedureName()
      }
    },

    createStructureForGenerateBudgetInOutgoingPaymentDocumentInitDataProcedure(paramsForRequest) {
      return {
        params: this.createParamsForGenerateBudgetInOutgoingPaymentDocumentInitDataProcedure(paramsForRequest),
        procName: this.$api.payment.outgoingPayment.getForGenerateBudgetInOutgoingPaymentDocumentsInitDataProcedureName()
      }
    },

    createParamsForGenerateBudgetInOutgoingPaymentDocumentInitDataProcedure(paramsForRequest) {
      return {
        descr: this.getCurrentUser.login,
        doc_id: paramsForRequest.findId,
        viddoc: '1'
      }
    },

    createStructureForLoadDataAfterGenerateBudgetInOutgoingPaymentDocumentInitDataProcedure() {
      return {
        params: {
          descr: this.getCurrentUser.login
        },
        procName: this.$api.payment.outgoingPayment.getDataAfterGenerateBudgetInOutgoingPaymentDocumentsInitDataProcedureName()
      }
    }
  }

})
