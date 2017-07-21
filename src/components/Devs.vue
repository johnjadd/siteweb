<template>
  <div style="padding: 0px;">
    <el-card class="box-card" :body-style="{padding:'8px'}">
      <div>
        <div slot="header" class="clearfix" style="margin-bottom: 0px;">
          <span style="line-height: 36px; float: left;">[{{devx.name}} <small>{{devx.id}}</small>] 子设备列表
            <small>总数: <U>{{getAllChildren(devx).length}}</U>
                   当前页: <U>{{tbData.length}}</U>
            </small>
          </span>

          <span style="float: right;">
            <el-button-group v-loading.body="$store.getters.fullscreenLoading">
              <el-button size="small" type="primary"
                @click="add(-1)"
                :disabled="devx.id==undefined"
                icon="plus"
                v-show="$store.getters.wndMode=='modify'">
                添加
              </el-button>
              <el-button size="small" type="primary" @click="paste" v-show="$store.getters.wndMode=='modify'"
                         :disabled="!anythingInCdata">粘贴</el-button>
              <!--<el-button size="small" type="warning"  @click="pushToServer()">更新至服务器</el-button>-->
              <el-button size="small" type="" @click="$store.getters.footPrints.pop();emitShowWndMsg('goback');"
                         :disabled="$store.getters.footPrints.length==1 || devx.id==undefined">返回上一层</el-button>

            </el-button-group>
          </span>

        </div>
      </div>
    </el-card>

    <el-table v-loading.body="$store.getters.fullscreenLoading"
        :data="tbData"
        stripe
        max-height="740"
        style="width: 100%; margin-top: 5px;">

      <!--<el-table-column type="expand">
        <template scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
           <p>变量当前值</p>
           <el-form-item label="" v-for="child in scope.row.vars" :key="child.id">
             <span>{{child.name}} : {{child.value}}</span>
           </el-form-item>
          </el-form>
        </template>
      </el-table-column>-->

      <el-table-column label="ID" width="120"
          prop="id" sortable>
        <template scope="scope">
          <span style="margin-left: 0px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="本地ID" width="120"
          prop="localId" sortable>
        <template scope="scope">
          <span style="margin-left: 0px">{{ scope.row.localId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="120"
        prop="status" sortable>
        <template scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 0px">{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <!--<el-table-column label="父设备" width="180"
        prop="fatherName" sortable>
        <template scope="scope">
          <span size="small" style="margin-left: 0px">
            {{scope.row.fatherName }}
          </span>
        </template>np
      </el-table-column>
    -->
      <el-table-column label="名称"
        prop="name" sortable>
        <template scope="scope">
          <span @click="showChildren(scope.row.index)">
            <!--<span v-show="(devCnt=childrenLength(scope.row.index))>0">-->
              <!--<span size="small" style="margin-left: 0px" v-for="childx in children(scope.row.index).children">
                <el-tag type="gray">{{childx.name}}</el-tag>
              </span>-->
            <span size="normal" style="margin-left: 0px">
              <el-tag type="gray" class="handWhenHover">{{scope.row.childrenLength}}</el-tag>
            </span>
            <el-button type="text" >{{ scope.row.name }}</el-button>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="变量"
        prop="varsLength" sortable>
        <template scope="scope">
          <span @click="showVars(scope.row.index)">
            <el-tag type="gray" class="handWhenHover"> {{scope.row.varsLength}}</el-tag>
          </span>
          <!--<el-button type="text" @click="showVars(scope.row.index)">详细</el-button>-->
          <span size="small" style="margin-left: 0px" v-for="varl in getChiefVars(scope.row)">
            <small>{{varl.name}}:</small> <el-tag type="success">0.0</el-tag>
          </span>
          <!--<span @click="showVars(scope.row.index)"><el-tag type="primary" class="handWhenHover">详细</el-tag></span>-->

        </template>
      </el-table-column>


      <el-table-column label="操作" width="220" >
        <template scope="scope" >
          <div v-show="$store.getters.wndMode=='modify'">
            <!--<span @click="mod(scope.row.index)"><el-tag type="primary" class="handWhenHover">修改</el-tag></span>
            <span @click="add(scope.row.index)"><el-tag type="primary" class="handWhenHover">添加</el-tag></span>
            <span @click="scopeRowIndex = scope.row.index; dialogClickOk = false; dialogVisible = true;">
              <el-tag type="danger" class="handWhenHover">删除</el-tag>
            </span>
            <span @click="copy(scope.row.index)"><el-tag type="primary" class="handWhenHover">拷贝</el-tag></span>-->
            <el-button type="text" icon="edit" @click="mod(scope.row.index)"></el-button>
            <el-button type="text" icon="plus" @click="add(scope.row.index)"></el-button>
            <el-button type="text" icon="delete2" @click="scopeRowIndex = scope.row.index; dialogClickOk = false; dialogVisible = true;"></el-button>
            <el-button type="text" @click="copy(scope.row.index)">拷贝</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog title="警告" :visible.sync="dialogVisible" size="tiny" @close="del(scopeRowIndex)" >
      <span>您确定要删除该设备吗？注意：所有的子设备会被删除！所有操作不可逆！</span>
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
        if(this.devx != undefined){
          this.fillTableData(this.devx.children);
        }
        //var devs = this.getAllChildren(this.devx);
        //this.fillTableData(devs, this.devx);
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
      if(this.devx != undefined){
        this.fillTableData(this.devx.children);
      }

      //  var devs = this.getAllChildren(this.devx);
      //  this.fillTableData(devs, this.devx);
    },

    components:{
      'templateVars': Vars,
    },

    data(){
      return{
        tbData: [],

        dialogVisible: false,
        dialogClickOk: false,
        scopeRowIndex: -1,

        showAllDevs: false,
        anythingInCdata: false,
      }
    },

    mixins:[
        utils,
    ],

    methods:{
      fillTableData(datas, parent){
        this.tbData.splice(0);
        var index = 0;
        //var datas = parent.children;

        if(datas!=undefined){
          datas.forEach(item=>{
            var data = JSON.parse(JSON.stringify(item));

            data.index = index++;
            data.status = "normal";
            data.fatherName = item.fatherName;
            data.childrenLength = item.children.length;
            data.varsLength = item.vars.length;
            this.tbData.push(data);
          });

          console.log("fillTableData finished!");
        }
      },

      getDevFromTbData(index){
        if(this.devx==undefined) return undefined;
        if(this.devx.children==undefined) return undefined;

        var dev = this.devx.children[index];

        return dev;
      },

      emitShowWndMsg(action){
        this.$emit("showWnd", "Devs", action);
      },

      /*childrenLength(index){
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
        if(dev!=undefined ) {
          if(dev.vars!=undefined){
            return dev.vars.length;
          }
        }
      },*/

      showVars(index){
        var dev = this.getDevFromTbData(index);
        if(dev!=undefined) {
          this.$store.commit('setTempDev', dev);
          this.$store.commit('pushFootPrint', dev);
          this.emitShowWndMsg("vars");
        }
      },

      showChildren(index){
        var dev = this.getDevFromTbData(index);
        if(dev == undefined) return;

        //if(dev.children.length>0){
          this.$store.commit('setTempDev', dev);
          this.$store.commit('pushFootPrint', dev);
        //}
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
        //console.log(JSON.stringify(dev));
        this.$store.dispatch("postDev", (dev)).then(ret=>{
          if(ret == "failed"){
            alert("postDev failed!");
          }else{
            this.addDev(dev);
            this.fillTableData(this.devx.children);
          }
        });
      },

      mod(index){
        var data = this.tbData[index];
        this.$store.commit('setTempData', data);

        this.$store.commit("setOpMode", "mod");
        this.emitShowWndMsg("mod");
      },

      add(index){
          /*var data = {id: '', localId: '', name: '', fatherId: '' };
          if(index==-1){
            data.fatherId = this.devx.id;
            data.localId = this.devx.localId + "01";
            data.name = "NewDev";
          }else{
            data = this.tbData[index];
          }
          data.id = this.getNewDevIds()[0];
          */
          var data = {id: 0};
          if(index>=0){
            data = this.tbData[index];
            //data.id = undefined; //need to renew the Id
          }
          data = this.standardizeDev(data);
          data.fatherId = this.devx.id;
          data.fatherName = this.devx.name;

          this.$store.commit('setTempData', data);

          this.$store.commit('setTempData', data);

          this.$store.commit("setOpMode", "add");
          this.emitShowWndMsg("add");
      },

      del(index){
        if(this.dialogClickOk){
          var dev = this.devx.children[index];

          this.$store.dispatch("delDev", (dev)).then(ret=>{
            if(ret=="failed"){
              alert("delDev failed!");
            }else{
              this.delDev(dev);
              this.fillTableData(this.devx.children);
              this.emitShowWndMsg("del");
            }
          });
        }
      },

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
