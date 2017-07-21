<template>
 <div id="app">

    <!--<router-view></router-view>-->


    <templateSite></templateSite>

  </div>
</template>


<script>
//import NavBarTop from './components/NavBarTop'
import Site from './components/Site'
//import Devs from "./components/Devs"

export default {
  name: 'app',
  components:{
    //'templateNavBarTop': NavBarTop,
    'templateSite': Site
    //'templateDevs': Devs,
  } ,
  created(){
  },
  data(){
      return{
        curView: "templateSite"
      }
  },

  methods:{
  },
}
</script>

<style>
#app {
  width: 100%;
  position: absolute;
}

.margin1{
    margin: 15px;
}




</style>
