export default{
  methods:{
    mapDevId2Local(dev){
      if(dev == undefined) dev = this.$store.rootDev;
      var devs = this.getAllDevs(dev);
      if(devs == undefined) return;
      devs.forEach(dev=>{
        dev.id = this.$store.getters.devIds.indexOf(dev.id);
        dev.vars.forEach(vv=>{
          this.mapVarId2Local(vv);
        });
      });
    },

    mapDevId2Global(dev){
      if(dev == undefined) dev = this.$store.rootDev;
      var data = JSON.parse(JSON.stringify(dev));

      var devs = this.getAllDevs(data);
      if(devs == undefined) return;
      devs.forEach(dev=>{
        dev.id = this.$store.getters.devIds[dev.id];
        dev.fatherId = this.$store.getters.devIds[dev.fatherId];
      });

      return data;
    },

    mapVarId2Local(varx){
      if(varx == undefined) return;
      varx.id = (varx.id & 1024);
    },

    mapVarId2Global(varx, dev){
      if(varx == undefined) return undefined;
      if(dev == undefined){
        dev = this.getDev(varx.devId);
        if(dev == undefined) return undefined;
      };

      var data = JSON.parse(JSON.stringify(varx));
      data.id = dev.id * 1024 + varx.id;

      return data;
    },

    findFathers(startDev, endDevId){
      if(startDev == undefined) return;
      if(startDev.id == endDevId) return;

      if(startDev.children!=undefined){
        startDev.children.forEach(dd=>{
          dd.fatherId = startDev.id;
          dd.fatherName = startDev.name;
          //dd.father = startDev;
          this.findFathers(dd, endDevId);
        });
      }
    },

    refreshSiteFromServer(siteId){
      var store = this.$store;
      store.dispatch("getSite", siteId).then(ret=>{
        if(ret=="done"){
          //this.mapDevId2Local();

          if(store.getters.footPrints.length==0){
            store.commit('pushFootPrint', store.getters.curSite.dev);
          }
          var footDev = store.getters.footPrints.pop();
          store.commit("pushFootPrint", footDev);

          var dev = this.getDev(footDev.id, undefined);
          store.commit('setTempDev', dev);

          console.log("refreshSiteFromServer done!");
          this.findFathers(store.getters.rootDev, undefined);

        }else if (ret=="failed") {
          alert("Refresh site from server failed!");
        }
      });
    },

    modDev(devdata){
      //console.log("modDev from data: " + JSON.stringify(devdata));
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
      //console.log("addDev from data: " + JSON.stringify(data) + " to parent: " + parent.name);
      if(parent == undefined) return;

      data = this.standardizeDev(data);

      parent.children.push(data);
      console.log("addDev done!");
    },

    delDev(data){
      var parent = this.getDev(data.fatherId, undefined);
      //console.log("delDev from data: " + JSON.stringify(data) + " in parent: " + parent);
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

    modVar(data){
      var dev = this.getDev(data.devId, undefined);
      //console.log("modVar from data: " + JSON.stringify(data) + " in dev: " + dev.name);
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
      //console.log("addVar from data: " + JSON.stringify(data) + " to dev: " + data.name);
      if(dev == undefined) return;

      data = this.standardizeVar(data, dev);

      dev.vars.push(data);
      console.log("addVar done!");
    },

    delVar(data){
      var dev = this.getDev(data.devId, undefined);
      //console.log("delVar from data: " + JSON.stringify(data) + " in dev: " + dev.name);
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

    standardizeDev(data){
      var ret;
      var sample = {name: 'newDev', localId: '',
                    children: [], vars: []};
      //getNewDevIds will take some time
      if(data == undefined || data.id == undefined){
          sample.id = this.getNewDevIds(1)[0];
      }
      if(data != undefined){
        ret = JSON.parse(JSON.stringify(data));
        this.copyUndefinedProps(sample, ret);
      }else{
        ret = sample;
      }
      //console.log("standardizeDev finished data = " + JSON.stringify(data));
      return ret;
    },

    standardizeVar(data, dev){
      if(dev == undefined) return undefined;

      var ret;
      var sample = {name: 'newVar',
                    type: 'double', value: '0', time: (new Date()).toLocaleTimeString(),
                    calMethod: '', calParam: '', devId: dev.id};
      if(data == undefined || data.id == undefined){
          sample.id = this.getNewVarIds(dev, 1)[0];
      }
      if(data != undefined){
        ret = JSON.parse(JSON.stringify(data));
        this.copyUndefinedProps(sample, ret);
      }else{
        ret = sample;
      }
      return ret;
    },

    renewAllIds(startDev){
      var devs = this.getAllDevs(startDev, undefined);

      var index = devs.length;
      if(index == 0) return [];

      var ids = this.getNewDevIds(index);
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

    getChiefVars(dev){
      if(dev == undefined) return [];
      var vars = dev.vars.filter(vv=>{
        return vv.chief;
      });
      return vars;
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
        if(startDev == undefined){
          return [];
        }
      }
      if(startDev.id == endDevId) return [];

      var devs = [];
      devs.push(startDev);

      if(startDev.children!=undefined){
        startDev.children.forEach(dd=>{
          var dds = this.getAllDevs(dd, endDevId);
          if(dds!=undefined){
            dds.forEach(ddx=>{
              devs.push(ddx);
            });
          }
        });
      }
      return devs;
    },

    getAllChildren(startDev){
      //alert("alertDev = " + JSON.stringify(startDev));
      if(startDev == undefined){
        startDev = this.$store.getters.rootDev;

        if(startDev == undefined){
          return [];
        }
      }

      var devs = [];
      if(startDev.children != undefined){
        startDev.children.forEach(dd=>{
          devs.push(dd);

          var dds = this.getAllChildren(dd);
          dds.forEach(ddx=>{
            devs.push(ddx);
          });
        });
      }

      //console.log("getAllChildren length : " + devs.length);
      return devs;
    },

    getNewDevIds(count){
      //alert(count)
      var rootDev = this.$store.getters.rootDev;
      if(rootDev == undefined) return undefined;

      if(count == undefined){
        count = 1;
      }
      if(isNaN(count) == false){
        if(count < 1){
          count = 1;
        }
      }
      //alert(count);
      var newIds = JSON.parse(JSON.stringify(this.$store.getters.devIds));
      var devs = this.getAllDevs(rootDev);
      if(devs!=undefined){
        devs.forEach(devx=>{
          newIds.splice(newIds.indexOf(devx.id), 1);
        });
      };
      //console.log("start getNewDevIds newIds = " + JSON.stringify(newIds));
      if(isNaN(count) == false){
        if(newIds.length >= count){
          return newIds.slice(0, count);
        }
      }

      return newIds;
    },

    getNewVarIds(dev, count){
      //alert(count);
      if(dev==undefined) return [-1];
      if(count == undefined || count<=0){
        count = 1;
      }
      if(isNaN(count) == false){
        if(count < 1){
          count = 1;
        }
      }

      var newIds = [];
      var index = 0;
      for(index = 0; index < 1024; index++){
        newIds.push(dev.id*1024 + index);
      }

      var ids = [];
      if(dev.vars!=undefined){
          dev.vars.forEach(varx=>{
              ids.push(varx.id);
          });
      }

      if(ids.length>0){
          /*ids.sort(function compare(id1, id2){    //find the max ids in the current vars
              if(id1 < id2) return -1;
              if(id1 > id2) return 1;
              return 0;
          });*/

          ids.forEach(id=>{
            newIds.splice(newIds.indexOf(id), 1);
          });
      }
      //console.log("getNewVarIds done. newIds = " + newIds.join());
      if(isNaN(count) == false){
        if(newIds.length >= count){
          return newIds.slice(0, count);
        }
      }

      return newIds;
    },

  }
}
