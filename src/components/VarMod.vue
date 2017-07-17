<template>
  <el-card class="box-card smallCard" :body-style="{padding:'8px'}">
    <div slot="header" class="clearfix">
      <span style="line-height: 24px;">{{caption}}</span>
      <el-button-group style="float: right;">
        <el-button size="small" type="primary" @click="ok">保存</el-button>
        <el-button size="small" @click="cancel">返回</el-button>
      </el-button-group>
    </div>

    <el-form label-width="80px">
      <el-form-item label="ID">
        <el-input v-model="varl.id" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="名称">
        <el-input v-model="varl.name"></el-input>
      </el-form-item>

      <el-form-item label="类型">
        <template>
          <el-select v-model="varl.type" placeholder="Select">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-form-item>

    </el-form>
  </el-card>
</template>

<script>
import {mapGetters} from 'vuex'
import idExchange from "../mixins/idExchange"
import utils from "../mixins/utils"

export default{
    computed:{
        ...mapGetters({
            varx: "tempVar",
            devx: "tempDev",
            //newIdx: "newTempVarId",
            modex: "opMode",
            tempDatax: 'tempData',
        })
    },

    mixins:[
        idExchange,
        utils,
    ],

    data(){
        return{
            caption: "修改变量属性" ,
            varl: {id:'', name: '', type: "", devId: ""},
            options:[{id:'boolean', name:'开关'},
                     {id:'double', name:'模拟'}],
        }
    },
    created() {
        this.varl.id = this.tempDatax.id;
        this.varl.name = this.tempDatax.name;
        this.varl.type = this.tempDatax.type;
        this.varl.devId = this.tempDatax.devId;
        this.varl.devName = this.tempDatax.devName;

        if(this.modex=="add"){
            //this.varl.id = this.localId(this.newIdx);
            this.caption = this.varl.devName + " " + '添加新变量';
        }else{
            //this.varl.id = this.localId(this.varx.id);
            this.caption = this.varl.devName + " " + '修改变量属性';
        }
    },

    methods:{
        emitShowWndMsg(action){
            this.$emit("showWnd", "VarMod", action);
        },

        cancel(){
            this.emitShowWndMsg("cancel");
        },

        ok(){
            /*var store = this.$store;
            var cmd = "";

            if(this.modex=="mod"){
              cmd = "patchVar";
            }else if(this.modex=="add"){
              cmd = "postVar";
            }

            store.dispatch(cmd, this.varl).then(ret=>{
              if(ret=="done"){
                this.refreshDevData(this.devx.id);
              }else if(ret=="failed"){}
            });*/
            var data = this.varl;
            if(this.modex=="mod"){
              //this.modVar(this.varl);
              this.$store.dispatch("patchVar", data).then(ret=>{
                if(ret == "failed"){
                  alert("patchVar failed!");
                }else{
                  this.modVar(data);
                  this.cancel();
                  this.emitShowWndMsg('ok');
                }
              });
            }else if(this.modex=="add"){
              //this.addVar(this.varl);
              data = this.standardizeVar(data);
              this.$store.dispatch("postVar", data).then(ret=>{
                if(ret == "failed"){
                  alert("postVar failed!");
                }else{
                  this.addVar(data);
                  this.cancel();
                  this.emitShowWndMsg('ok');
                }
              });
            }

            //this.cancel();
            //this.emitShowWndMsg('ok');
        }
    }
}

</script>

<style scoped>

</style>
