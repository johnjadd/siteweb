import actions from './actions'
import getters from './getters'
import mutations from './mutations'

import Vue from 'vue'
import Vuex from 'vuex' //npm install --save vuex
Vue.use(Vuex)

export const store = new Vuex.Store({
    state:{
        sites: [{id: '', name: ''}],

        curSite:{},

        tempDev: {children:[], vars:[]},
        //tempDev: {id: '', name: '', localId: '', vars: []},

        copyData: {type: '', data: ''},

        //ipAddr: "localhost:8888",

        ipAddr: "59.110.42.248:8888",

        wndMode: "modify",

        opMode: "add",

        footPrints: [{id: 0, name: "请选择要查看的机房"}],

        tempData:'',

        fullscreenLoading: false,

        devIds: [],
    },

    getters : getters,
    mutations: mutations,
    actions: actions
})
