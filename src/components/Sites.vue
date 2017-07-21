<template>
<div class="margin1 zeroPadding">
  <el-select v-model="siteId" placeholder="请选择机房" @change="siteChanged">
    <el-option
      v-for="site in sitesx"
     :key="site.id"
     :label="site.name"
     :value="site.id">
    </el-option>
  </el-select>
  <span type="text" @click="refresh">&nbsp&nbsp刷新</span>
</div>
</template>

<script>
import {mapGetters} from 'vuex';
import utils from "../mixins/utils"

export default {
  computed:{
    ...mapGetters({
      sitesx: 'sites',
    })
  },

  created(){
    this.refresh();
  },

  data(){
    return{
      siteId: "",
    }
  },

  mixins:[
      utils,
  ],

  methods:{
    siteChanged(){
      if((this.siteId != "") && (this.siteId != this.curSiteId)){
        this.refreshSiteFromServer(this.siteId);
      }
    },

    refresh(){
      if(this.siteId == ""){
        this.$store.dispatch('getSites').then(ret=>{
          if(ret == "failed"){
            alert("Refresh sites from server failed!");
          }else{
            if(this.sitesx.length>0){
              this.siteId = this.sitesx[0].id;  //this will cause the siteChanged() happened
            }

          }
        });
      }else{
        this.refreshSiteFromServer(this.siteId);
      }
    },

  }
}
</script>

<style scoped>
  .zeroPadding{
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
  }
</style>
