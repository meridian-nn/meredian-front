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
        ispId: createdItem.ispId ? createdItem.ispId : 0,
        orgIsp: createdItem.payer && createdItem.payer.glbuch_id ? createdItem.payer.glbuch_id : 0,
        zaorgIsp: createdItem.zaorg_isp ? createdItem.zaorg_isp : 0,
        dispId: createdItem.dispId ? createdItem.dispId : 0,
        dsoispId: createdItem.dsoispId ? createdItem.dsoispId : 0,
        soispId: createdItem.collaborator && createdItem.collaborator.id ? createdItem.collaborator.id : 0,
        fioSoisp: createdItem.collaborator && createdItem.collaborator.fio ? createdItem.collaborator.fio : '',
        fss: 1,
        fsn: createdItem.fsn ? createdItem.fsn : 0,
        fosn: createdItem.fosn ? createdItem.fosn : 0,
        descr: this.getCurrentUser.login,
        dataEdit: new Date().toLocaleDateString(),
        dataCreate: createdItem.dataCreate ? createdItem.dataCreate : new Date().toLocaleDateString(),
        vidFind: createdItem.vidFind ? createdItem.vidFind : 0,
        otdId: createdItem.otdId ? createdItem.otdId : 0,
        statiId: createdItem.statiId ? createdItem.statiId : 0,
        comment: createdItem.comment ? createdItem.comment : '',
        budElem: createdItem.budElem ? createdItem.budElem : 0,
        budCfo: createdItem.budCfo ? createdItem.budCfo : 0,
        numVipis: createdItem.numVipis ? createdItem.numVipis : '',
        accId: 0,
        direct: 0,
        flagDel: 0,
        paccId: 0,
        tipFind: 1,
        nameFind: 'Платежное поручение',
        id: createdItem.objId,
        descrCreate: createdItem.descrCreate ? createdItem.descrCreate : this.getCurrentUser.login
      }
    },

    createParamsForSaveNewIncomingDocuments(createdItem) {
      return {
        poluchId: createdItem.recipient && createdItem.recipient.client_id ? createdItem.recipient.client_id : 0,
        poluchName: createdItem.recipient && createdItem.recipient.cl_name ? createdItem.recipient.cl_name : '',
        budElem: createdItem.budElem ? createdItem.budElem : 0,
        budCfo: createdItem.namePodr ? createdItem.namePodr : 0,
        dataVipis: createdItem.dataVipis ? new Date(createdItem.dataVipis).toLocaleDateString() : new Date().toLocaleDateString(),
        dataOpl: createdItem.dataOpl ? new Date(createdItem.dataOpl).toLocaleDateString() : new Date().toLocaleDateString(),
        numVipis: createdItem.numVipis ? createdItem.numVipis : '',
        numFind: createdItem.numFind ? createdItem.numFind : 0,
        platName: createdItem.payer && createdItem.payer.clName ? createdItem.payer.clName  : '',
        orgId: createdItem.payer  && createdItem.payer.id ? createdItem.payer.id : 0,
        ispId: createdItem.ispId ? createdItem.ispId : 0,
        fio: this.createdItem.fioIsp ? this.createdItem.fioIsp : '',
        soispId: this.createdItem.soispId ? this.createdItem.soispId : 0,
        fioSoisp: createdItem.fioSoisp ? createdItem.fioSoisp : '',
        sumFind: createdItem.sumFind ? createdItem.sumFind : 0,
        vidFind: createdItem.vidFind,
        comment: createdItem.comment ? createdItem.comment : '',
        descr: this.getCurrentUser.login,
        fss: 1,
        dataEdit: new Date().toLocaleDateString(),
        dataCreate: new Date().toLocaleDateString(),
        id: createdItem.objId,
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
