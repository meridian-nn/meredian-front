/* eslint-disable */
// Плагин для создания параметров для запросов
import Vue from 'vue'

Vue.mixin({
  methods: {
    // Функция для создания создания параметра для запроса сохранения параметров фильтров
    // this.$api.uiSettings.save
    createFilterEntityForSave(elementId, formId, filterItem, userId, creatorId) {
      const filterEntityForSave = {
        elementId: elementId,
        formId: formId,
        userId: userId,
        creatorId: creatorId,
        settingValue: JSON.stringify(filterItem)
      }
      return filterEntityForSave
    },

    createParamsForStashedFunctionSrSelPlanPsv(mcId, descr) {
      const params = {
        params: {
          'mc_id': mcId,
          'descr': descr
        },
        procName: 'dbo.sr_sel_planpsv_mc_ost'
      }

      return params
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
    }
  }
})
