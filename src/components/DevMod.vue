<template>
  <el-card class="box-card smallCard" :body-style="{padding:'8px'}">
    <div slot="header" class="clearfix">
      <span style="line-height: 24px;">[{{devx.name}} <small>{{devx.id}}</small>] {{caption}}</span>
      <el-button-group style="float: right;">
        <el-button size="small" type="primary" @click="ok">保存</el-button>
        <el-button size="small" @click="cancel">返回</el-button>
      </el-button-group>
    </div>

    <el-form label-width="80px">
      <el-form-item label="ID">
        <!--<el-input v-model="devl.id" :disabled="true"></el-input>-->
        <el-select v-model="devl.id" placeholder="无可用ID，无法创建"
          size="large"
          :disabled="modex=='mod'">
          <el-option
            v-for="item in optIds"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        &nbsp&nbsp可用ID总数量: <U>{{$store.getters.devIds.length}}</U> 已用: <U>{{getAllDevs().length}}</U>
      </el-form-item>

      <el-form-item label="名称">
        <el-input v-model="devl.name"></el-input>
      </el-form-item>

      <el-form-item label="本地 ID">
        <el-input v-model="devl.localId"></el-input>
      </el-form-item>

      <el-form-item label="父设备">
        <template>
          <el-select v-model="devl.fatherId" placeholder="Select" size="large">
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
import utils from "../mixins/utils"

export default{
    computed:{
        ...mapGetters({
            devx: 'tempDev',
            modex: "opMode",
            tempDatax: 'tempData'
        })
    },

    mixins:[
        utils,
    ],

    data(){
        return{
            caption: '修改设备属性',
            devl: "",
            options:[{id:'', name:''}],
            optIds:[],
        }
    },

    created() {
        this.devl = JSON.parse(JSON.stringify(this.tempDatax));

        if(this.modex=="add"){
            this.caption = '添加新子设备';
            this.fillOptIds();
            this.devl.id = this.optIds[0];
        }else{
            this.caption = '修改子设备属性';
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

      fillOptIds(){
        this.optIds.splice(0);
        this.getNewDevIds("10").forEach(id=>{
          this.optIds.push(id);
        });

        console.log("optIds : " + JSON.stringify(this.optIds))
      },

      cancel(){
        this.emitShowWndMsg('goback');
      },

      ok(){
        var data = this.devl;
        if(this.modex=="mod"){
          this.$store.dispatch("patchDev", (data)).then(ret=>{
            if(ret == "failed"){
              alert("pachDev failed!");
            }else{
              this.modDev(data);
              this.cancel();
              this.emitShowWndMsg('ok');
            }
          });
        }else if(this.modex=="add"){
          data = this.standardizeDev(data);
          this.$store.dispatch("postDev", (data)).then(ret=>{
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
    width: 600px;
    margin: auto;
}
</style>
