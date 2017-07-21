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
        <!--<el-input v-model="varl.id" :disabled="true"></el-input>-->
        <el-select v-model="varl.id" placeholder="无可用ID，无法创建"
          size="large"
          :disabled="modex=='mod'">
          <el-option
            v-for="item in optIds"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        &nbsp&nbsp可用ID总数量: <U>1024</U> 已用: <U>{{devx.vars.length}}</U>
      </el-form-item>

      <el-form-item label="名称">
        <el-input v-model="varl.name"></el-input>
      </el-form-item>

      <el-form-item label="类型">
        <template>
          <el-select v-model="varl.type" placeholder="" size="large">
            <el-option
              v-for="item in typeOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-form-item>

      <el-form-item label="重要变量">
        <template>
          <!-- `checked` 为 true 或 false -->
          <el-checkbox v-model="varl.chief">
            <el-icon name="star-on" v-show="varl.chief"></el-icon>
            <el-icon name="star-off" v-show="!varl.chief"></el-icon>
          </el-checkbox>
        </template>
      </el-form-item>

      <el-form-item label="计算方法">
        <template>
          <el-select v-model="varl.calMethod" placeholder="" size="large" >
            <el-option
              v-for="item in calMethodOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-form-item>

      <el-form-item label="计算变量">
        <el-select v-model="calVarIds" placeholder="请选择" size="large"
        multiple
        filterable
        v-show="varl.calMethod!=''">
          <el-option
            v-for="item in calVarOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="locaId" v-show="varl.calMethod==''"></el-input>
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
            devx: "tempDev",
            modex: "opMode",
            tempDatax: 'tempData',
        })
    },

    mixins:[
        utils,
    ],

    data(){
        return{
            caption: "修改变量属性" ,
            varl: "",
            typeOpts:[{value:'boolean', label:'开关量'},
                     {value:'double', label:'模拟量'}],
            calMethodOpts:[{id:0, value:'', label:'本地变量'},
                           {id:1, value:'max', label:'最大'},
                          {id:2, value:'min', label:'最小'},
                          {id:3, value:'avg', label:'平均'},
                          {id:4, value:'sum', label:'总和'},
                          {id:5, value:'and', label:'与'},
                          {id:6, value:'or', label:'或'},
                        ],
            calVarOpts: [],

            calVarIds: [],
            locaId: '',
            optIds:[],
        }
    },
    created() {
        this.varl = JSON.parse(JSON.stringify(this.tempDatax));
        console.log("calParam = " + this.varl.calParam);

        if(this.varl.calMethod!=""){
          this.varl.calParam = "[" + String(this.varl.calParam) + "]"
          this.calVarIds = JSON.parse(this.varl.calParam);
        }else{
          this.locaId = this.varl.calParam;
        }

        if(this.modex=="add"){
            this.caption = '添加新变量';
            this.fillOptIds();
            this.varl.id = this.optIds[0];
        }else{
            this.caption = '修改变量属性';
        }
        this.fillCalVarOpts();
    },

    methods:{
        emitShowWndMsg(action){
            this.$emit("showWnd", "VarMod", action);
        },

        fillCalVarOpts(){
          var devs = this.getAllDevs();
          devs.forEach(dd=>{
            dd.vars.forEach(vv=>{
              var data = {label: "[" + dd.name + "] " + vv.name, value: vv.id};
              this.calVarOpts.push(data);
            });
          });
        },

        fillOptIds(){
          this.optIds.splice(0);
          this.getNewVarIds(this.devx, "10").forEach(id=>{
            this.optIds.push(id);
          });

          console.log("optIds : " + this.optIds.join())
        },

        cancel(){
            this.emitShowWndMsg("cancel");
        },

        ok(){
            //var data = this.varl;
            var data = this.standardizeVar(this.varl, this.devx);

            var param = "";
            if(data.calMethod==""){
              param = this.locaId;
            }else{
              //param = String(JSON.stringify(this.calVarIds));
              //param = param.slice(1, param.length-1);
              param = this.calVarIds.join();
            }
            data.calParam = param;

            console.log("mod add Var var = " + data.calParam);
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
              //data = this.standardizeVar(data, this.devx);
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
        }
    }
}

</script>

<style scoped>

</style>
