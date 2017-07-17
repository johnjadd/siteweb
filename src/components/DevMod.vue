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
        <el-input v-model="devl.id" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="名称">
        <el-input v-model="devl.name"></el-input>
      </el-form-item>

      <el-form-item label="本地 ID">
        <el-input v-model="devl.localId"></el-input>
      </el-form-item>

      <el-form-item label="父设备">
        <template>
          <el-select v-model="devl.fatherId" placeholder="Select">
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
            devx: 'tempDev',
            modex: "opMode",
            tempDatax: 'tempData'
            //newIdx: "newTempDevId"
        })
    },

    mixins:[
        idExchange,
        utils,
    ],

    data(){
        return{
            caption: '修改设备属性',
            devl: {id:'', localId: '', name: '', fatherId: ''},
            options:[{id:'', name:''}],
        }
    },

    created() {
        this.devl.id = this.tempDatax.id;
        this.devl.localId = this.tempDatax.localId;
        this.devl.name = this.tempDatax.name;

        var father;
        if(this.modex=="add"){
            //this.devl.id = this.localId(this.newIdx);
            this.caption = '添加新设备';
            //this.devl.id = this.getNewDevIds(this.$store.getters.rootDev);
            this.devl.fatherId = this.tempDatax.fatherId;
        }else if(this.modex=="mod"){
            //this.devl.id = this.localId(this.tempDatax.id);
            this.caption = '修改设备属性';

            father = this.getParent(this.devl.id, undefined);
            if(father != undefined){
              this.devl.fatherId = father.id;
            }
        }
        this.fillOptions(this.$store.getters.rootDev, this.devl.id);
    },

    methods:{
      emitShowWndMsg(action){
          this.$emit("showWnd", "DevMod", action);
      },

      fillOptions(startDev, endDevId){
        this.options.splice(0);

        var devs = this.getAllDevs(startDev, endDevId);
        devs.forEach(dd=>{
          if((dd.id!=this.devl.id)){
            this.options.push(dd);
          }
        });
      },

      cancel(){
        this.emitShowWndMsg('goback');
      },

      ok(){
        var data = this.devl;
        if(this.modex=="mod"){
          //this.modDev(data);
          this.$store.dispatch("patchDev", data).then(ret=>{
            if(ret == "failed"){
              alert("pachDev failed!");
            }else{
              this.modDev(data);
              this.cancel();
              this.emitShowWndMsg('ok');
            }
          });
        }else if(this.modex=="add"){
          //this.addDev(data);
          data = this.standardizeDev(data);
          this.$store.dispatch("postDev", data).then(ret=>{
            if(ret == "failed"){
              alert("postDev failed!");
            }else{
              this.addDev(data);
              this.cancel();
              this.emitShowWndMsg('ok');
            }
          });
        }
      },
    }
}

</script>

<style>
.smallCard{
    margin-top: 0px;
    margin-bottom: 0px;
    margin-left: 400px;
    margin-right: 400px;
}
</style>
