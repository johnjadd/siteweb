export default{
    methods:{
      localId(gid){
          //if(!isNan(gid)) return -1;
          return (gid & 65535);
      },

      globalId(hostId, id){
          /*var ret = 0;

          var varid;
          var devid;
          var ids = id.split(".");
          if(ids.size==1){
              devid = id.split(".")[0];
              varid = id.split(".")[1];

              ret = devid << 16 + var
          }else {
              varid = id.split(".")[0];
          }*/
          return ((hostId * 65536) + id);
      },
  }
}
