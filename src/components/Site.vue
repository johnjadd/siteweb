<template>
    <div id="sitepage" >

        <templateNavBarTop v-on:showWnd="showWnd"></templateNavBarTop>

        <div class="margin1">
          <component v-bind:is="curView" v-on:showWnd="showWnd"></component>
        </div>

    </div>
</template>

<script>
import Devs  from './Devs'
import Outline from './Outline'
import DevMod from './DevMod'
import VarMod from './VarMod'
import Vars from './Vars'
import NavBarTop from './NavBarTop'

import {mapGetters} from 'vuex'
import utils from "../mixins/utils"

export default {
    computed:{
        ...mapGetters({
            ft: "footPrintsString",
        })
    },
    components:{
        'templateDevs': Devs,
        'templateDevMod': DevMod,
        'templateVarMod': VarMod,
        'templateVars': Vars,
        'templateNavBarTop' : NavBarTop
    },

    data(){
        return{
            curView: 'templateDevs',
        }
    },

    mixins:[
        utils
    ],

    methods:{
        showWnd(who, action){
            //alert("who=" + who + " action=" + action + " ");
            var viewName = this.curView;

            if(action=="gohome"){
               this.$store.commit("setTempDev", this.$store.getters.curSite.dev);
               viewName = "templateDevs"

            /*}else if(action=="goback"){
               this.$store.commit("popFootPrint");
               var parent = this.$store.getters.footPrints.pop();
               if(parent != undefined){
                 this.$store.commit("setTempDev", parent);
               }
               viewName = "templateDevs"
                */
            }else if(action=="footDev" || action=="goback"){
               //console.log("showWnd action = footDev");

               var footDev = this.$store.getters.footPrints.pop();
               this.$store.commit("pushFootPrint", footDev);

               //console.log("footDev =" + footDev.name );
               var dev = this.getDev(footDev.id, undefined);
               //console.log("dev = " + dev.name);
               if(dev != undefined){
                 this.$store.commit("setTempDev", dev);
                 viewName = "templateDevs"
               }

            }else if(who=="Devs"){
                if(action=="vars"){
                    viewName = "templateVars"
                }else if(action=="add"){
                    viewName = "templateDevMod";
                }else if(action=="mod"){
                    viewName = "templateDevMod";
                }else if(action=="del"){
                    viewName = "templateDevs";
                }

            }else if(who=="DevMod"){
                if(action=="ok"){
                    viewName = "templateDevs";
                }

            }else if(who=="Vars"){
                if(action=="mod" || action=="add"){
                    viewName = "templateVarMod"
                }else if(action=="del"){
                    viewName = "templateVars";
                }

            }else if(who=="VarMod"){
                if(action=="ok"){
                    viewName = "templateVars";
                }else if(action=="cancel"){
                    viewName = "templateVars";
                }
            }
            //console.log("curView = " + viewName);
            this.curView = viewName;
        },
    }
}
</script>

<style>
    .margin1{
        margin-top: 0px;
        margin-bottom: 0px;
        margin-left: 00px;
        margin-right: 00px;
    }

    .handWhenHover{
      cursor: pointer;
    }

    .showborder{
        border:1px;
        background-color:antiquewhite;
        padding: 5px;
        margin: 1px;
    }
</style>
