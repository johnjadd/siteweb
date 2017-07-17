export default{
  /*data(){
    return{
      tempId: '',
    };
  },*/
  methods:{
    findFathers(startDev, endDevId){
      if(startDev == undefined) return;
      if(startDev.id == endDevId) return;

      if(startDev.children!=undefined){
        startDev.children.forEach(dd=>{
          dd.fatherId = startDev.id;
          //dd.fatherName = startDev.name;
          //dd.father = startDev;
          this.findFathers(dd, endDevId);
        });
      }
    },

    refreshSiteFromServer(siteId){
      var store = this.$store;
      store.dispatch("getSite", siteId).then(ret=>{
        if(ret=="done"){
          if(store.getters.footPrints.length==0){
            store.commit('pushFootPrint', store.getters.curSite.dev);
          }

          var footDev = store.getters.footPrints.pop();
          store.commit("pushFootPrint", footDev);

          var dev = this.getDev(footDev.id, undefined);
          store.commit('setTempDev', dev);

          console.log("refreshSiteFromServer done!");
          this.findFathers(store.getters.rootDev, undefined);
        }else if (ret=="failed") {}
      });
    },

    modDev(devdata){
      console.log("modDev from data: " + JSON.stringify(devdata));
      var oldParent = this.getParent(devdata.id, undefined);
      var newParent = this.getDev(devdata.fatherId, undefined);
      if(oldParent==undefined || newParent==undefined) return;
      //console.log("devdata = " + JSON.stringify(devdata));
      var index = oldParent.children.length;
      //console.log("modDev length = " + index);
      while(index--){
        var dd = oldParent.children[index];
        //console.log("modDev dd.id = " + dd.id + " devdata.id = " + devdata.id + " index = " + index);
        if(dd.id == devdata.id){
          //console.log("devdata = " + JSON.stringify(devdata));
          this.copyUndefinedProps(dd, devdata);
          //console.log("devdata = " + JSON.stringify(devdata));
          if(oldParent.id == newParent.id){
            oldParent.children.splice(index, 1, devdata);
          }else{
            oldParent.children.splice(index, 1);
            newParent.children.push(devdata);
          }

          console.log("modDev done!");
          break;
        }
      }
    },

    addDev(data){
      var parent = this.getDev(data.fatherId, undefined);
      console.log("addDev from data: " + JSON.stringify(data) + " to parent: " + parent.name);
      if(parent == undefined) return;

      /*var sample = {id: this.getNewDevIds(this.$store.getters.rootDev) , name: 'newDev', localId: '', children: [], vars: []};
      this.copyUndefinedProps(sample, data);*/
      data = this.standardizeDev(data);
      if(data.id == 0){
        data.id = this.getNewDevIds()[0];
      }
      //console.log("devdata = " + JSON.stringify(devdata));
      parent.children.push(data);
      console.log("addDev done!");
    },

    delDev(data){
      var parent = this.getDev(data.fatherId, undefined);
      console.log("delDev from data: " + JSON.stringify(data) + " in parent: " + parent);
      if(parent == undefined) return;

      var index = parent.children.length
      while(index--){
        if(parent.children[index].id == data.id){
          //console.log("before parent children.length = " + parent.children.length + "");
          parent.children.splice(index, 1);
          //console.log("after  parent children.length = " + parent.children.length);
          console.log("delDev done!");
          break;
        }
      }
    },

    standardizeDev(data){
      var sample = {id: '0L' , name: 'newDev', localId: '', children: [], vars: []};
      this.copyUndefinedProps(sample, data);
      console.log("standardizeDev finished");
      /*var index = data.children.length;
      while(index--){
        this.standardizeDev(data.children[index]);
      }*/

      return data;
    },

    standardizeVar(data){
      var sample = {id: '0L', name: 'newVar',  type: 'double', value: '0'};
      this.copyUndefinedProps(sample, data);
      return data;
    },

    renewAllIds(startDev){
      var devs = this.getAllDevs(startDev, undefined);

      var index = devs.length;
      if(index == 0) return;

      var ids = this.getNewDevIds(undefined, index);
      while(index--){
        var dev = devs[index];
        dev.id = ids[index];

        var vars = dev.vars;
        dev.vars = [];
        var vindex = vars.length;
        var vids = this.getNewVarIds(dev, vindex);
        while(vindex--){
          var varx = vars[vindex];
          varx.id = vids[vindex];
          varx.devId = dev.id;
          dev.vars.push(varx);
        }
      }

      this.findFathers(startDev);
    },

    modVar(data){
      var dev = this.getDev(data.devId, undefined);
      console.log("modVar from data: " + JSON.stringify(data) + " in dev: " + dev.name);
      if(dev == undefined) return;

      var varx = this.getVar(data.id, dev);
      if(varx==undefined) return;

      var vars = dev.vars;
      var index = vars.length;
      while(index--){
        if(vars[index].id == data.id){
          this.copyUndefinedProps(vars[index], data);
          vars.splice(index, 1, data);
          console.log("modVar done!");
          break;
        }
      }
    },

    addVar(data){
      var dev = this.getDev(data.devId, undefined);
      console.log("addVar from data: " + JSON.stringify(data) + " to dev: " + data.name);
      if(dev == undefined) return;

      data = this.standardizeVar(data);
      if(data.id == 0){
        data.id = this.getNewVarIds(dev, 1)[0];
      }
      /*var sample = {id: this.getNewVarIds(dev), name: 'newVar',  type: 'boolean'};
      this.copyUndefinedProps(sample, data);
      */
      //console.log("devdata = " + JSON.stringify(devdata));
      dev.vars.push(data);
      console.log("addVar done!");
    },

    delVar(data){
      var dev = this.getDev(data.devId, undefined);
      console.log("delVar from data: " + JSON.stringify(data) + " in dev: " + dev.name);
      if(dev == undefined) return;

      var vars = dev.vars;
      var index = vars.length;
      while(index--){
        if(vars[index].id == data.id){
          vars.splice(index, 1);
          console.log("delVar done!");
          break;
        }
      }
    },

    getDev(devid, startDev){
      if(devid == undefined) return undefined;
      if(startDev == undefined){
        startDev = this.$store.getters.rootDev;
      }
      if(startDev.id == devid){
        return startDev;
      }

      var index = startDev.children.length;
      while(index--){
        var dev = this.getDev(devid, startDev.children[index]);
        if(dev!=undefined){
          return dev;
        };
      }

      return undefined;
    },

    getParent(devid, startDev){
      if(devid == undefined) return undefined;
      if(startDev == undefined){
        startDev = this.$store.getters.rootDev;
      }

      if(startDev.children.find(dd=>{return dd.id == devid;}) != undefined){
        return startDev;
      }

      var index = startDev.children.length;
      while(index--){
        var dev = this.getParent(devid, startDev.children[index]);
        if(dev!=undefined){
          return dev;
        };
      }

      return undefined;
    },

    getVar(varid, dev){
      if(varid == undefined) return undefined;
      if(dev == undefined) return undefined;
      if(dev.vars == undefined) return undefined;

      var index = dev.vars.length;
      while(index--){
        if(dev.vars[index].id == varid){
          return dev.vars[index];
        }
      }

      return undefined;
    },

    getFullDevName(startDev, devid){
      var name = "";
      return name;
    },

    copyUndefinedProps(so, ta){
      Object.keys(so).forEach(key=>{
        if(ta[key] == undefined){
          ta[key] = so[key];
        }
      });
    },

    getAllDevs(startDev, endDevId){
      if(startDev == undefined){
        startDev = this.$store.getters.rootDev;
      }
      if(startDev.id == endDevId) return undefined;

      var devs = [];
      devs.push(startDev);

      if(startDev.children!=undefined){
        startDev.children.forEach(dd=>{
          var dds = this.getAllDevs(dd, endDevId);
          if(dds!=undefined){
            dds.forEach(dd=>{
              devs.push(dd);
            });
          }
        });
      }


      return devs;
    },

    getNewDevIds(rootDev, count){
      if(rootDev == undefined){
        rootDev = this.$store.getters.rootDev;
      }
      if(count == undefined || count<=0){
        count = 1;
      }

      var newIds = [];
      var ids = [];
      var max = 0;

      var devs = this.getAllDevs(rootDev);
      if(devs!=undefined){
          devs.forEach(devx=>{
              ids.push(devx.id);
          });
      }

      if(ids.length > 0){
          ids.sort(function compare(id1, id2){    //find the max ids in the current vars
              if(id1 > id2) return -1;
              if(id1 < id2) return 1;
              return 0;
          });
          max = ids[0] + 1;
      }else{
          max = 1;
      }

      console.log("getNewDevIds done. ids: " + JSON.stringify(ids));
      while(count--){
        newIds.push(max++);
      }

      return newIds;
    },

    getNewVarIds(dev, count){
      if(dev==undefined) return [-1];
      if(count == undefined || count<=0){
        count = 1;
      }

      var newIds = [];
      var max = 0;
      var ids = [];

      if(dev.vars!=undefined){
          dev.vars.forEach(varx=>{
              ids.push(varx.id);
          });
      }

      if(ids.length>0){
          ids.sort(function compare(id1, id2){    //find the max ids in the current vars
              if(id1 > id2) return -1;
              if(id1 < id2) return 1;
              return 0;
          });
          max = ids[0] + 1;
      }else{
          max = dev.id*65536 + 1;
      }
      console.log("getNewVarIds done. ids: " + JSON.stringify(ids));
      while(count--){
        newIds.push(max++);
      }
      return newIds;
    },

  }
}
