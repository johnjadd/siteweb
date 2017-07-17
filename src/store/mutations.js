//use $store.commit('methodName', payload) to do mutations

export default {
    setSites(state, allsites){
        //state.sites = allsites;
        state.sites.splice(0);

        allsites.forEach(site=>{
            state.sites.push(site);
        });
    },

    setCurSite(state, site){
        var oldid = state.curSite.id;
        state.curSite = site;
        //state.tempDev = site.dev;

        if(oldid != site.id){
          //alert("setCurSite and footPrints cleared");
          state.footPrints.splice(0);
          //state.footPrints.push(site.dev);
        }
    },

    setTempDev(state, devdata){
        state.tempDev = devdata;
    },

    setTempVar(state, vardata){
        state.tempVar = vardata;
    },

    /*updateDev(state, devdata){
      console.log("mutations--updateDev from data: " + JSON.stringify(devdata));
      console.log("tempDev = " + state.tempDev.name);
      var tempDev = state.tempDev;
      if(devdata.id != tempDev.id) return;

      var father = tempDev.father;
      //migerate all the children from the dev to be replaced
      devdata.father = father;
      //devdata.children.splice(0);
      tempDev.children.forEach(function(dd){
        devdata.children.push(dd);
      });
      //replace
      var index = father.children.indexOf(tempDev);
      console.log("index = " + index);
      father.children.splice(index, 1, devdata);
      //set tempDev
      state.tempDev = devdata;
    },*/

    /*setTempVars(state, varsdata){
        state.tempVars.splice(0);   //clear the arrays

        if(varsdata==undefined) return;
        varsdata.forEach(varx =>{
            state.tempVars.push(varx);
        });

    },

    setVarInTempDev(state, vardata){
        var index = -1;
        var vv = state.tempDev.vars.find(vv=>{
            index++;
            return (vv.id == vardata.id);
        });

        if(vv!=undefined){  //replace with the new vardata
            state.tempDev.vars.splice(index, 1, vardata);
        }
    },

    addVarInTempDev(state, vardata){
        var vv = state.tempDev.vars.find(vv=>{
            return (vv.id == vardata.id);
        });

        if(vv==undefined){  //add new to tempDev.vars
            state.tempDev.vars.push(vardata);
        }
    },

    delVarInTempDev(state, varids){
        var indexsWaitToDelete = [];

        var index = -1;
        state.tempDev.vars.forEach(varx=>{
            index++;
            if(varids.indexOf(varx.id)>-1){
                indexsWaitToDelete.push(index);
            }
        });

        indexsWaitToDelete.reverse();
        indexsWaitToDelete.forEach(index=>{
            state.tempDev.vars.splice(index, 1);
        })
    },*/

    setWndMode(state, mode){
        state.wndMode = mode;
    },

    setOpMode(state, modex){
       state.opMode =  modex;
    },

    copy(state, data){
       console.log("copy data! data = " +JSON.stringify(data));
       state.copyData = data;
    },

    pushFootPrint(state, dev){
      if(dev!=undefined){
        var data = {id:'', name:''};
        data.id = dev.id;
        data.name = dev.name;

        state.footPrints.push(data);
      }
    },

    popFootPrint(state){
      if(state.footPrints.length>1){
        state.footPrints.pop();
      }
    },

    reposFootPrint(state, devId){
      while(state.footPrints.length>0){
        var dev = state.footPrints.pop();

        if(dev.id == devId){
          state.footPrints.push(dev);
          break;
        }
      }
    },

    setTempData(state, data){
      state.tempData = data;
    },
};
