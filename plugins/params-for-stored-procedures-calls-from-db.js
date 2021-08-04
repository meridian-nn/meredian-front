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
        my_descr: 'Larisa',
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

    createParamsForSaveNewOutgoingDocuments(createdItem) {
      return {
        numFind: createdItem.numFind ? createdItem.numFind : '',
        dataVipis: createdItem.dataVipis ? new Date(createdItem.dataVipis).toLocaleDateString() : new Date().toLocaleDateString(),
        dataOpl: createdItem.dataOpl ? new Date(createdItem.dataOpl).toLocaleDateString() : new Date().toLocaleDateString(),
        sumFind: createdItem.sumFind ? createdItem.sumFind : 0,
        orgId: createdItem.payer && createdItem.payer.client_id ? createdItem.payer.client_id : 0,
        poluchId: createdItem.poluchId ? createdItem.poluchId : 0,
        zaorgId: createdItem.forWhom && createdItem.forWhom.client_id ? createdItem.forWhom.client_id : 0,
        ispId: createdItem.isp_id,
        orgIsp: createdItem.payer && createdItem.payer.glbuch_id ? createdItem.payer.glbuch_id : 0,
        zaorgIsp: createdItem.forWhom && createdItem.forWhom.glbuch_id ? createdItem.forWhom.glbuch_id : 0,
        dispId: createdItem.executor && createdItem.executor.isp_id ? createdItem.executor.isp_id : 0,
        dsoispId: createdItem.customerCollaborator && createdItem.customerCollaborator.id ? createdItem.customerCollaborator.id : 0,
        soispId: createdItem.collaborator && createdItem.collaborator.id ? createdItem.collaborator.id : 0,
        fss: 1,
        fsn: createdItem.f_sn ? createdItem.f_sn : 0,
        fosn: createdItem.f_osn ? createdItem.f_osn : 0,
        descr: this.getCurrentUser.login,
        dataEdit: new Date().toLocaleDateString(),
        dataCreate: new Date().toLocaleDateString(),
        vidFind: createdItem.vid_find ? createdItem.vid_find : 0,
        otdId: createdItem.otd_id ? createdItem.otd_id : 0,
        statiId: createdItem.stati_id ? createdItem.stati_id : 0,
        comment: createdItem.comment ? createdItem.comment : '',
        budElem: createdItem.bud_elem ? createdItem.bud_elem : 0,
        budCfo: createdItem.bud_cfo ? createdItem.bud_cfo : 0,
        numVipis: createdItem.num_vipis ? createdItem.num_vipis : '',
        accId: 0,
        direct: 0,
        flagDel: 0,
        paccId: 0,
        tipFind: 1,
        nameFind: 'Платежное поручение',
        id: createdItem.find_id,
        descrCreate: this.getCurrentUser.login
      }
    },

    createParamsForSaveNewIncomingDocuments(createdItem) {
      return {
        poluchId: createdItem.recipient && createdItem.recipient.id ? createdItem.recipient.id : 0,
        poluchName: createdItem.recipient && createdItem.recipient.clName ? createdItem.recipient.clName : '',
        budElem: createdItem.bud_elem ? createdItem.bud_elem : 0,
        budCfo: createdItem.namePodr ? createdItem.namePodr : 0,
        dataVipis: createdItem.data_vipis ? new Date(createdItem.dateExtract).toLocaleDateString() : new Date().toLocaleDateString(),
        dataOpl: createdItem.datePayment ? new Date(createdItem.datePayment).toLocaleDateString() : new Date().toLocaleDateString(),
        numVipis: createdItem.extract ? createdItem.extract : '',
        numFind: createdItem.number ? createdItem.number : 0,
        platName: createdItem.plat_name ? createdItem.plat_name : '',
        orgId: createdItem.org_id ? createdItem.org_id : 0,
        ispId: createdItem.isp_id ? createdItem.isp_id : 0,
        fio: this.createdItem.fio ? this.createdItem.fio : '',
        soispId: this.createdItem.soisp_id ? this.createdItem.soisp_id : 0,
        fioSoisp: createdItem.fio_soisp ? createdItem.fio_soisp : '',
        sumFind: createdItem.sumToPay ? createdItem.sumToPay : 0,
        vidFind: createdItem.vid_find,
        comment: createdItem.comment ? createdItem.comment : '',
        descr: this.getCurrentUser.login,
        fss: 1,
        dataEdit: new Date().toLocaleDateString(),
        dataCreate: new Date().toLocaleDateString(),
        id: createdItem.find_id,
        tipFind: 2,
        nameFind: 'Входящий документ',
        direct: 1,
        descrCreate: this.getCurrentUser.login,
        accId: 0,
        paccId: 0,
        zaorgId: 0,
        orgIsp: 0,
        zaorgIsp: 0,
        dispId: 0,
        dsoispId: 0,
        fsn: 0,
        fosn: 0,
        otdId: 0,
        statiId: 0,
        flagDel: 0
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
    }
  }

})
