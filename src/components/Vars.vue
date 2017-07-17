<template>
  <div style="padding: 0px;">
    <el-card class="box-card" :body-style="{padding:'8px'}">
      <div>
        <div slot="header" class="clearfix" style="margin-bottom: 0px;">
          <span style="line-height: 36px; float: left;">{{devx.name}} 变量列表</span>
          <el-button-group style="float: right;">
            <el-button size="small" type="primary" @click="add(-1)" v-show="$store.getters.wndMode=='modify'">添加</el-button>
            <el-button size="small" type="" @click="emitShowWndMsg('goback')">返回</el-button>
          </el-button-group>
        </div>
      </div>
    </el-card>

    <el-table
      :data="tbData"
      height="550"
      stripe
      style="width: 100%; margin-top: 5px;">
    <el-table-column
      prop="id"
      label="ID">
    </el-table-column>

    <el-table-column
      prop="name"
      label="名称">
    </el-table-column>

    <el-table-column
      prop="type"
      label="类型">
    </el-table-column>

    <el-table-column
      prop="value"
      label="当前值">
      <template scope="scope">
        <span style="margin-left: 0px">{{ scope.row.value }}</span>
        <span v-show="$store.getters.wndMode=='modify'">
          <span @click="mod(scope.row.index)"><el-tag type="primary" class="handWhenHover">历史</el-tag></span>
        </span>
      </template>
    </el-table-column>

    <el-table-column
      prop="time"
      label="更新时间">
      <template scope="scope">
        <el-icon name="time"></el-icon>
        <span style="margin-left: 0px">{{ scope.row.time }}</span>
      </template>
    </el-table-column>

    <el-table-column label="操作" >
      <template scope="scope" >
        <div v-show="$store.getters.wndMode=='modify'">
          <span @click="mod(scope.row.index)"><el-tag type="primary" class="handWhenHover">修改</el-tag></span>
          <span @click="add(scope.row.index)"><el-tag type="primary" class="handWhenHover">添加</el-tag></span>
          <span @click="scopeRowIndex = scope.row.index; dialogClickOk = false; dialogVisible = true;">  <el-tag type="danger"  class="handWhenHover">删除</el-tag></span>
        </div>
      </template>
    </el-table-column>

  </el-table>

  <el-dialog title="警告" :visible.sync="dialogVisible" size="tiny" @close="del(scopeRowIndex)" >
    <span>您确定要删除该变量吗？注意：操作不可逆！</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible=false">取 消</el-button>
      <el-button type="primary" @click="dialogClickOk=true; dialogVisible=false;">确 定</el-button>
    </span>
  </el-dialog>
</div>

</template>

<script>
import {mapGetters} from 'vuex'
import idExchange from "../mixins/idExchange"
import utils from "../mixins/utils"

export default {
  components:{
  },

  mixins:[
      idExchange,
      utils
  ],

  computed:{
      ...mapGetters({
          devx: "tempDev",
          varx: "tempVar"
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

  beforeDestroy(){
    //alert("I am leaving this page!");
  },

  data(){
    return{
      //slectedVars: [],
      tbData: [{
        index: '',
        status: '',
        id: '',
        name: '',
        type: '',
        value: '',
        time: '',
        devId: '',
        devName: '',
      }],

      dialogVisible: false,
      dialogClickOk: false,
      scopeRowIndex: -1,
    }
  },

  methods:{
    test(){
        alert("test ok!");
    },

    fillTableData(dev){
      this.tbData.splice(0);
      var index = 0;
      var datas = dev.vars;

      var myDate = (new Date()).toLocaleTimeString();

      if(datas!=undefined){
        datas.forEach(item=>{
          var data = {index: 0, id: '', name: '', type: '', value: '', time: '', devId: '', devName: ''};

          data.index = index++;
          data.id = item.id;
          data.name = item.name;
          data.type = item.type;
          data.value = item.value;
          data.time = myDate;
          data.devId = dev.id;
          data.devName = dev.name;

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
      var data = {id:'', name: '', type: '', devId: ''};

      if(index==-1){
        data.name = "NewVar";
        data.type = "boolean";
        data.devId = this.devx.id;
        data.devName = this.devx.name;
      }else{
        data = this.tbData[index];
      }
      data.id = this.getNewVarIds(this.devx, 1)[0];

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
        /*this.$store.dispatch("delVar", data).then(ret=>{
          if(ret=="done"){
              this.refreshDevData(data.devId);
          }else if(ret=="failed"){}
        });*/
        this.delVar(data);
        this.fillTableData(this.devx);

        this.emitShowWndMsg("del");
      }
    },
  }
}
</script>

<style scoped>
    .showborder{
        border:1px;
        background-color:antiquewhite;
        padding: 5px;
        margin: 1px;
    }
</style>
