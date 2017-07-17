import actions from './actions'
import getters from './getters'
import mutations from './mutations'

import Vue from 'vue'
import Vuex from 'vuex' //npm install --save vuex
Vue.use(Vuex)

export const store = new Vuex.Store({
    state:{
        sites: [{id: '', name: ''}],

        //curSite: {id: '', name: '', devs:[{id: '', name: '', vars:[]}]},
        curSite:{},

        tempDev: {id: '', name: '', localId: '', vars: []},

        tempVar: {id: '',  name: '', type:'', calMethod: '', calParam: ''}, //have to define in details. only in this way can the getter updat immidialiy after state changed

        //tempVars: [],

        copyData: {type: '', data: ''},

        ipAddr: "localhost:8080",

        //ipAddr: "59.110.42.248:8080",

        wndMode: "modify",

        opMode: "add",

        footPrints: [],

        tempData:'',
    },

    getters : getters,
    mutations: mutations,
    actions: actions
})
