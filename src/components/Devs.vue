<template>
  <div style="padding: 0px;">
    <el-card id="tool-bar" class="box-card" :body-style="{padding:'8px'}">
      <div>
        <div slot="header" class="clearfix" style="margin-bottom: 0px;">
          <span style="line-height: 36px; float: left;">{{devx.name}} 设备列表</span>

          <span style="float: right;">
          <!--  <el-switch
              v-model="showAllDevs"
              on-text="所有" off-text="分层"
              on-color="#13ce66"
              off-color=gray
              @change="showAll()">
            </el-switch>
            -->
            <el-button-group>
              <el-button size="small" type="primary" @click="add(-1)" v-show="$store.getters.wndMode=='modify'">添加</el-button>
              <el-button size="small" type="primary" @click="paste" v-show="$store.getters.wndMode=='modify'"
                         :disabled="!anythingInCdata">粘贴</el-button>
              <!--<el-button size="small" type="warning"  @click="pushToServer()">更新至服务器</el-button>-->
              <el-button size="small" type="" @click="$store.getters.footPrints.pop();
                         emitShowWndMsg('goback');"
                         :disabled="$store.getters.footPrints.length==1">返回上一层</el-button>
            </el-button-group>

          </span>
        </div>
      </div>
    </el-card>

    <el-table
        :data="tbData"
        stripe
        max-height="500"
        style="width: 100%; margin-top: 5px;">

      <el-table-column label="ID" width="100"
          prop="id" sortable>
        <template scope="scope">
          <span style="margin-left: 0px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态"  width="120"
        prop="status" sortable>
        <template scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 0px">{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column label="父设备"  width="180"
        prop="fatherName" sortable>
        <template scope="scope">
          <span size="small" style="margin-left: 0px">
            {{scope.row.fatherName }}
          </span>
        </template>np
      </el-table-column>

      <el-table-column label="本地 ID" width="180"
          prop="localId" sortable>
        <template scope="scope">
          <span style="margin-left: 0px">{{ scope.row.localId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="名称"
        prop="name" sortable>
        <template scope="scope">
          <span @click="showChildren(scope.row.index)">
            <span v-show="(devCnt=childrenLength(scope.row.index))>0">
              <!--<span size="small" style="margin-left: 0px" v-for="childx in children(scope.row.index).children">
                <el-tag type="gray">{{childx.name}}</el-tag>
              </span>-->
              <span size="normal" style="margin-left: 0px">
                <el-tag type="gray" class="handWhenHover">{{devCnt}}</el-tag>
              </span>
            </span>

            <el-button type="text" >{{ scope.row.name }}</el-button>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="变量">
        <template scope="scope">
          <span @click="showVars(scope.row.index)">
            <el-tag type="gray" class="handWhenHover"> {{varsLength(scope.row.index)}}</el-tag>
          </span>
          <!--<span size="small" style="margin-left: 0px" v-for="varl in vars(scope.row.index)">
            <small>{{varl.name}}:</small> <el-tag type="success">{{varl.value}}</el-tag>
          </span>
          <span @click="showVars(scope.row.index)"><el-tag type="primary" class="handWhenHover">详细</el-tag></span>-->
        </template>
      </el-table-column>


      <el-table-column label="操作" >
        <template scope="scope" >
          <div v-show="$store.getters.wndMode=='modify'">
            <span @click="mod(scope.row.index)"><el-tag type="primary" class="handWhenHover">修改</el-tag></span>
            <span @click="add(scope.row.index)"><el-tag type="primary" class="handWhenHover">添加</el-tag></span>
            <span @click="scopeRowIndex = scope.row.index; dialogClickOk = false; dialogVisible = true;">  <el-tag type="danger"  class="handWhenHover">删除</el-tag></span>
            <span @click="copy(scope.row.index)"><el-tag type="primary" class="handWhenHover">拷贝</el-tag></span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="警告" :visible.sync="dialogVisible" size="tiny" @close="del(scopeRowIndex)" >
      <span>您确定要删除该设备吗？注意：所有的子设备会被删除！所有操作不可逆！</span>
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
import Vars from './Vars'

export default {
    computed:{
        ...mapGetters({
            devx: "tempDev",
            cDatax: "copyData",
            //siteIdx: "curSiteId",
        }),
    },

    watch:{
      devx(){
        this.fillTableData(this.devx);
      },

      cDatax(){
        this.anythingInCdata = false;
        if(this.cDatax.type != undefined){
          if(this.cDatax.type == "dev") {
            this.anythingInCdata = true;
          }
        }
      },
    },

    created(){
        this.fillTableData(this.devx);
    },

    components:{
      'templateVars': Vars,
    },

    data(){
      return{
        tbData: [{
          index: '',
          status: '',
          id: '',
          localId: '',
          name: '',
          vars: []
        }],

        dialogVisible: false,
        dialogClickOk: false,
        scopeRowIndex: -1,

        showAllDevs: false,
        anythingInCdata: false,
      }
    },

    mixins:[
        idExchange,
        utils,
    ],

    methods:{
      fillTableData(parent){
        this.tbData.splice(0);
        //console.log("fillTableData start!");
        //console.log("fillTableData parent = " + parent.children);

        var index = 0;
        var datas = parent.children;

        if(datas!=undefined){
          datas.forEach(item=>{
            //index++;
            var data = {index: 0, status: '', id: '', name: '',  fatherId: '',fatherName: '', childrenLength: 0,};

            data.index = index++;
            data.status = "normal" + index,
            data.id = item.id;
            data.localId = item.localId;
            data.name = item.name;
            data.fatherId = parent.id;
            data.fatherName = parent.name;
            data.childrenLength = item.children.length;

            this.tbData.push(data);
          });

          console.log("fillTableData finished!");
          //alert(JSON.stringify(this.tbData));
        }
      },

      getDevFromTbData(index){
        if(this.devx==undefined) return undefined;
        if(this.devx.children==undefined) return undefined;

        var dev = this.devx.children[index];
        //var dev = this.tbData[index];
        return dev;
      },

      emitShowWndMsg(action){
        this.$emit("showWnd", "Devs", action);
      },

      showAll(){
        if(this.showAllDevs){
          var parent = {childern: []};
          var devs = this.getAllDevs(undefined, undefined);

          devs.forEach(dd=>{
            parent.childern.push(devs)
          });
          this.fillTableData(parent);
        }else{

        }
      },

      childrenLength(index){
        var data = this.tbData[index];
        if(data!=undefined) {
          return data.childrenLength;
        }
      },

      vars(index){
        var dev = this.getDevFromTbData(index);
        if(dev!=undefined) {
          return dev.vars;
        }
      },

      varsLength(index){
        var dev = this.getDevFromTbData(index);
        //console.log("fillTableData.varsLength dev.vars = " + dev.vars);
        if(dev!=undefined ) {
          if(dev.vars!=undefined){
            return dev.vars.length;
          }
        }
      },

      showVars(index){
        var dev = this.getDevFromTbData(index);
        if(dev!=undefined) {
          this.$store.commit('setTempDev', dev);
          this.emitShowWndMsg("vars");
        }
      },

      showChildren(index){
        //var dev = this.tbData[index];
        var dev = this.getDevFromTbData(index);
        //console.log("showChildren row = " + index + " dev = " + dev.name);
        if(dev == undefined) return;

        if(dev.children.length>0){
          this.$store.commit('setTempDev', dev);
          this.$store.commit('pushFootPrint', dev);
        }
      },


      copy(index){
        var dev = this.getDevFromTbData(index);
        if(dev == undefined) return;

        var cdata = {type: '', data: ''};
        cdata.type = "dev";
        cdata.data = JSON.stringify(dev);
        this.$store.commit("copy", cdata);
      },


      paste(){
        var cdata = this.cDatax;
        if(cdata.type!="dev") return;

        var dev = JSON.parse(cdata.data);
        this.renewAllIds(dev);
        dev.fatherId = this.devx.id;
        console.log(JSON.stringify(dev));
        this.$store.dispatch("postDev", dev).then(ret=>{
          if(ret == "failed"){
            alert("postDev failed!");
          }else{
            this.addDev(dev);
            this.fillTableData(this.devx);
          }
        });
      },

      mod(index){
        var data = this.tbData[index];
        this.$store.commit('setTempData', data);
        //this.$store.commit("setTempDev", this.getDevFromTbData(index));
        this.$store.commit("setOpMode", "mod");
        this.emitShowWndMsg("mod");
      },

      add(index){
          var data = {id: '', localId: '', name: '', fatherId: '' };
          if(index==-1){
            data.fatherId = this.devx.id;
            data.localId = this.devx.localId + "01";
            data.name = "NewDev";
          }else{
            data = this.tbData[index];
          }
          data.id = this.getNewDevIds()[0];

          this.$store.commit('setTempData', data);

          this.$store.commit("setOpMode", "add");
          this.emitShowWndMsg("add");
      },

      del(index){
        if(this.dialogClickOk){
          var dev = this.devx.children[index];
          this.$store.dispatch("delDev", dev).then(ret=>{
            if(ret=="failed"){
              alert("delDev failed!");
            }else{
              this.delDev(dev);
              this.fillTableData(this.devx);
              this.emitShowWndMsg("del");
            }
          });
          /*
          var data = this.tbData[index];
          this.delDev(data);
          this.fillTableData(this.devx);

          this.emitShowWndMsg("del");*/
        }
      },

      /*pushToServer(){
        console.log("pushToServer dev: " + JSON.stringify(this.devx));
        this.$store.dispatch("postDev", this.devx).then(ret=>{
          if(ret != "failed"){
            alert("Data Push done!");
          }else{
            alert("Data Push failed!");
          }
        });
      },*/
    }
}
</script>

<style scoped>
  /*.underline{
    text-decoration: underline;
  }

  .text {
    font-size: 14px;
  }

  .item {
    padding: 2px ;
  }

  .clearfix:before,
  .clearfix:after {
     display: table;
     content: "";
  }
  .clearfix:after {
     clear: both
  }

  .box-card {
    width: fix;
  }


  .el-row {
    margin-bottom:10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }


  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }*/
</style>
