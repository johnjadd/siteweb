<template>
  <div class="margin1">
    <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="menuClicked">
      <div class="grid-content bg-purple">
        <el-menu-item index="1">悟空云</el-menu-item>
        <el-menu-item index="3"><templateSites></templateSites></el-menu-item>
      </div>

      <div class="grid-content bg-purple" style="float: right;">
        <el-menu-item index="2">登陆</el-menu-item>
         <el-menu-item index="i-wndMode">{{wndModex}}</el-menu-item>
      </div>
    </el-menu>

    <div class="smallTopBar">
      <span v-for="foot in $store.getters.footPrints">
        &nbsp&nbsp
        <el-button type="text" size="mini" @click="footClicked(foot)">
          {{foot.name}}
        </el-button>
        <small>/</small>
      </span>
    </div>
  </div>

</template>

<script>
import Sites from "./Sites"
import {mapGetters} from 'vuex'

export default {
  computed:{
      ...mapGetters({
          wndModex: "wndMode",
      })
  },

  components:{
    'templateSites': Sites
  },

  data(){
      return{
        activeIndex: '1',
      }
  },

  methods:{
    menuClicked(key, keyPath){
      console.log(key, keyPath);
      if(key == "i-wndMode"){
        if(this.wndModex == "modify"){
          this.$store.commit("setWndMode", "view");
        }else{
          this.$store.commit("setWndMode", "modify");
        }
      }
    },

    footClicked(dev){
      //if(dev.children.length>0){

        this.$store.commit("reposFootPrint", dev.id);
        this.$emit("showWnd", "NavBarTop" , "footDev");
      //}
    },
  },

}
</script>

<style scoped>
  .marginTopMenu{
    margin-left: 0px;
    margin-right: 0px;
    margin-top:0px
  }

  .smallTopBar{
      background-color: WhiteSmoke  ;
      margin-bottom: 25px;
      border-color: black;
      border-width: 2;
  }
</style>
