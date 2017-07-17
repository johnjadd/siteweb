export default {
    curSite(state){
        return state.curSite;
    },

    curSiteId(state){
        return state.curSite.id;
    },

    sites(state){
        return state.sites;
    },

    rootDev(state){
        return state.curSite.dev;
    },

    tempDev(state){
        return state.tempDev;
    },

    tempVar(state){
        return state.tempVar;
    },

    tempVars(state){
        return state.tempVars;
    },

    ipAddr(state){
        return state.ipAddr;
    },

    wndMode(state){
        return state.wndMode;
    },

    opMode(state){
        return state.opMode;
    },

    copyData(state){
      return state.copyData;
    },

    footPrints(state){
      return state.footPrints;
    },

    footPrintsString(state){
      var str = "";
      state.footPrints.forEach(foot=>{
        str = str + "/" + foot.name;
      });
      return str;
    },

    tempData(state){
      return state.tempData;
    }
};
