//use $store.dispatch('methodName', payload) to do actions

import Vue from 'vue'

import VueResource from 'vue-resource' //npm install --save vue-resource
Vue.use(VueResource);

export default {
    getSites({ commit, state }){
        var url = 'http://' + state.ipAddr + '/api/cfg/site'
        console.log("Get simple site data from " + url);

        return new Promise((resolve, reject) => {
            Vue.http.get(url).then(response => {
                commit('setSites', response.body);
                resolve(response);  // Let the calling function know that http is done. You may send some data back
            }, error => {
                 console.log(error);
                reject(error);
            });
        });
    },

    getSite({ commit, state, dispatch }, siteId){
        var url = 'http://' + state.ipAddr + '/api/cfg/site' + '/' + siteId
        console.log("Get site data from " + url);

        return new Promise(function(resolve, reject){
            Vue.http.get(url).then(response => {
                commit('setCurSite', response.body);
                resolve("done");
            }, error => {
                console.log(error);
                resolve("failed");
            })
        });
    },

    patchDev({ commit, state, dispatch, getters }, devdata){
        var strurl = 'http://' + state.ipAddr + '/api/cfg/dev' + '/' + devdata.fatherId
        console.log("Patch dev data from " + strurl);

        return new Promise(function(resolve, reject){
          Vue.http({
              url: strurl,
              method: 'PATCH',
              body: JSON.stringify(devdata)
          }).then(response => {
              var data = response.body;
              if(data != ""){
                resolve(data);
              }else{
                resolve("failed");
              }
          }, error => {
              console.log(error);
              resolve("failed");
          });
        });
    },

    postDev({ commit, state, getters }, devdata){
        var strurl = 'http://' + state.ipAddr + '/api/cfg/dev' + '/' + devdata.fatherId  //'/bysite/' + getters.curSiteId
        console.log("Post dev data from " + strurl);
        return new Promise(function(resolve, reject){
          Vue.http({
              url: strurl,
              method: 'POST',
              body: JSON.stringify(devdata)
          }).then(response => {
              var data = response.body;
              if(data != ""){
                resolve(data);
              }else{
                resolve("failed");
              }
          }, error => {
              console.log(error);
              resolve("failed");
          });

        })
    },

  delDev({ commit, state, getters }, devdata){
    var strurl = 'http://' + state.ipAddr + '/api/cfg/dev' + '/' + devdata.fatherId + '/' + devdata.id
    console.log("Delete dev from " + strurl);
    return new Promise(function(resolve, reject){
      Vue.http({
        url: strurl,
        method: 'DELETE',
        //body: JSON.stringify(devdata)
      }).then(response => {
        var data = response.bodyText;
        if(data != "-1"){
          resolve(data);
        }else{
          resolve("failed");
        }
      }, error => {
        console.log(error);
        resolve("failed");
      });
    });
  },

  /*getDevWithOutChildren({ commit, state, getters }, devId){
    var strurl = 'http://' + state.ipAddr + '/api/cfg/dev' + '/nokid/' + devId
    console.log("Get no kid dev data from " + strurl);
    return new Promise(function(resolve, reject){
      Vue.http({
        url: strurl,
        method: 'GET',
      }).then(response => {
        var data = response.body;
        //commit('setTempDev', devdata);
        resolve("done");
      }, error => {
        console.log(error);
        resolve("failed");
      });
    });
  },*/

  patchVar({ commit, state, dispatch, getters }, data){
    var strurl = 'http://' + state.ipAddr + '/api/cfg/var' + '/' + data.devId;
    console.log("Patch var data from " + strurl);
    return new Promise(function(resolve, reject){
      Vue.http({
        url: strurl,
        method: 'PATCH',
        body: JSON.stringify(data)
      }).then(response => {
        //devdata = response.body;
        resolve("done");
      }, error => {
        console.log(error);
        resolve("failed");
      });
    });
  },

  postVar({ commit, state, dispatch, getters }, data){
    var strurl = 'http://' + state.ipAddr + '/api/cfg/var' + '/' + data.devId;
    console.log("Patch var data from " + strurl);
    return new Promise(function(resolve, reject){
      Vue.http({
        url: strurl,
        method: 'POST',
        body: JSON.stringify(data)
      }).then(response => {
        //devdata = response.body;
        resolve("done");
      }, error => {
        console.log(error);
        resolve("failed");
      });
    });
  },

  delVar({ commit, state, getters }, data){
    var strurl = 'http://' + state.ipAddr + '/api/cfg/var' + '/' + data.id
    console.log("Delete var from " + strurl);
    return new Promise(function(resolve, reject){
      Vue.http({
        url: strurl,
        method: 'DELETE',
      }).then(response => {
        resolve("done");
      }, error => {
        console.log(error);
        resolve("failed");
      });
    });
  },

};
