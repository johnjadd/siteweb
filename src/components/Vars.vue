<template>
  <div style="padding: 0px;">
    <el-card class="box-card" :body-style="{padding:'8px'}">
      <div>
        <div slot="header" class="clearfix" style="margin-bottom: 0px;">
          <span style="line-height: 36px; float: left;">[{{devx.name}} <small>{{devx.id}}</small>] 变量列表
            <small>总数: <U>{{tbData.length}}</U>
                   开关量: <U>{{boolVarCnt}}</U>
                   模拟量: <U>{{tbData.length - boolVarCnt}}</U>
                   &nbsp
                   <el-icon name="star-on" v-for="child in getChiefVars(devx)"></el-icon>
            </small>

          </span>
          <el-button-group style="float: right;" v-loading.body="$store.getters.fullscreenLoading">
            <el-button size="small" type="primary" @click="add(-1)" v-show="$store.getters.wndMode=='modify'">添加</el-button>
            <el-button size="small" type="" @click="$store.getters.footPrints.pop();emitShowWndMsg('goback')">返回</el-button>
          </el-button-group>
        </div>
      </div>
    </el-card>

    <el-table v-loading.body="$store.getters.fullscreenLoading"
      :data="tbData"
      stripe
      max-height="740"
      style="width: 100%; margin-top: 5px;">
    <el-table-column
      prop="id"
      label= "ID"
      sortable width="120">
    </el-table-column>

    <el-table-column
      prop="type"
      label="类型"
      sortable width="120">
    </el-table-column>

    <el-table-column
      prop="name"
      label="名称"
      sortable>
    </el-table-column>
    <el-table-column
      prop="value"
      label="当前值"
      sortable width="120">
      <template scope="scope">
        <span style="margin-left: 0px">{{ scope.row.value }}</span>
        <span v-show="$store.getters.wndMode=='modify'">
          <!--<span @click="mod(scope.row.index)"><el-tag type="primary" class="handWhenHover">历史</el-tag></span>-->
          <el-button type="text">历史</el-button>
        </span>
      </template>
    </el-table-column>

    <el-table-column
      prop="time"
      label="更新时间"
      sortable width="180">
      <template scope="scope">
        <el-icon name="time"></el-icon>
        <span style="margin-left: 0px">{{ scope.row.time }}</span>
      </template>
    </el-table-column>

    <el-table-column
      prop="chief"
      label="重要"
      sortable width="120">
      <template scope="scope">
        <el-icon name="star-on" v-show="scope.row.chief"></el-icon>
        <el-icon name="star-off" v-show="!scope.row.chief"></el-icon>
      </template>
    </el-table-column>

    <el-table-column
      prop="calMethod"
      label="计算方法"
      sortable width="120">
    </el-table-column>

    <el-table-column
      prop = "calParam"
      label="计算参数"
      sortable>
    </el-table-column>

    <el-table-column label="操作" width="220" >
      <template scope="scope" >
        <div v-show="$store.getters.wndMode=='modify'">
          <!--<span @click="mod(scope.row.index)"><el-tag type="primary" class="handWhenHover">修改</el-tag></span>
          <span @click="add(scope.row.index)"><el-tag type="primary" class="handWhenHover">添加</el-tag></span>
          <span @click="scopeRowIndex = scope.row.index; dialogClickOk = false; dialogVisible = true;">
            <el-tag type="danger" class="handWhenHover">删除</el-tag></span>-->
          <el-button type="text" icon="edit" @click="mod(scope.row.index)"></el-button>
          <el-button type="text" icon="plus" @click="add(scope.row.index)"></el-button>
          <el-button type="text" icon="delete2" @click="scopeRowIndex = scope.row.index; dialogClickOk = false; dialogVisible = true;"></el-button>
        </div>
      </template>
    </el-table-column>

  </el-table>

  <el-dialog title="警告" :visible.sync="dialogVisible" size="tiny" @close="del(scopeRowIndex)" >
    <span>您确定要删除该变量吗？注意：操作不可逆！</span>
    <span slot="footer" class="dialog-footer">
      <el-button-group >
        <el-button size="small" @click="dialogVisible=false">取 消</el-button>
        <el-button size="small" type="primary" @click="dialogClickOk=true; dialogVisible=false;">确 定</el-button>
    </el-button-group>
    </span>
  </el-dialog>
</div>

</template>

<script>
import {mapGetters} from 'vuex'
import utils from "../mixins/utils"
import VarMod from "./VarMod"

export default {
  components:{
    'templateVarMod': VarMod,
  },

  mixins:[
      utils
  ],

  computed:{
      ...mapGetters({
          devx: "tempDev",
      })
  },

  watch:{
    devx(){
      this.fillTableData(this.devx);
    },
  },

  created(){
    //alert("This page was just created!");
    this.fillTableData(this.devx);
  },

  data(){
    return{
      tbData: [],
      dialogVisible: false,
      dialogClickOk: false,
      scopeRowIndex: -1,
      boolVarCnt: 0,
    }
  },

  methods:{
    fillTableData(dev){
      this.tbData.splice(0);
      var index = 0;
      var datas = dev.vars;
      this.boolVarCnt = 0;

      if(datas!=undefined){
        datas.forEach(item=>{
          var data = JSON.parse(JSON.stringify(item));

          data.index = index++;
          data.devId = dev.id;
          data.devName = dev.name;

          if(data.type == "boolean"){
            this.boolVarCnt++;
          }
          this.tbData.push(data);
        });
      }
    },

    getVarFromTbData(index){
      if(this.devx==undefined) return undefined;
      if(this.devx.vars==undefined) return undefined;

      var vv = this.vars[index];
      return vv;
    },

    emitShowWndMsg(action){
        this.$emit("showWnd", "Vars", action);
    },

    add(index){
      var data = {id: 0};
      if(index>=0){
        data = this.tbData[index];
        //data.id = undefined;  //need to renew the Id
      }
      data = this.standardizeVar(data, this.devx);
      console.log("add " + JSON.stringify(data));
      this.$store.commit('setTempData', data);

      this.$store.commit("setOpMode", "add");
      this.emitShowWndMsg("add");
    },

    mod(index){
      var data = this.tbData[index];

      this.$store.commit('setTempData', data);

      this.$store.commit("setOpMode", "mod");
      this.emitShowWndMsg("mod");
    },

    del(index){
      if(this.dialogClickOk){
        var data = this.tbData[index];

        this.$store.dispatch("delVar", (data)).then(ret=>{
          if(ret=="failed"){
            alert("delDev failed!");
          }else{
            this.delVar(data);
            this.fillTableData(this.devx);
            this.emitShowWndMsg("del");
          }
        });
      }
    },

  }
}
</script>

<style scoped>

</style>
