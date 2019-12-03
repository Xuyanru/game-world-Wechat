<template>
  <div id="home">
    <el-row class="top-select">
      <el-col :span="8">
        <el-select v-model="gameValue" placeholder="游戏名称">
          <el-option v-for="item in gameList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-select v-model="areaValue" placeholder="游戏社区">
          <el-option v-for="item in areaList" :key="item.id" :label="item.areaname" :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-select v-model="groupValue" placeholder="商品分组">
          <el-option v-for="item in groupList" :key="item.id" :label="item.groupName" :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-select v-model="typeValue" placeholder="装备名称">
          <el-option v-for="item in typeList" :key="item.id" :label="item.typename" :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-select v-model="nameValue" placeholder="装备名称">
          <el-option v-for="item in nameList" :key="item.id" :label="item.equipmentname" :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <span @click="drawer = true">
          筛选
        </span>
      </el-col>
    </el-row>
    <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false" size="80%">
      <span>我来啦!</span>
    </el-drawer>
    <div>
      <ul>
        <li class="text-center bg-white" v-for="list in dataList" @click="gotoOrder(list)">
          <div>
            <span class="text-name">{{list.qname}}</span>
            <span class="text-date">剩余数量:{{list.qLeft}}</span>
          </div>
          <span class="right-icon rt"></span>
        </li>
      </ul>

      <p class="text-center" v-if="noListWarn">{{nolistMsg}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    data() {
      return {
        gameValue: "",
        gameList: [],
        areaValue: "",
        areaList: [],
        groupValue: "",
        groupList: [],
        typeValue: "",
        typeList: [],
        nameValue: "",
        nameList: [],
        drawer: false,


        startDate: "",
        dataList: [],
        noListWarn: false,
        nolistMsg: "",
      }
    },
    methods: {
      //获取游戏名称
      getGameList: function() {
        this.$ajax.get("game/gameList", {
            timeout: 1000 * 5
          })
          .then((data) => {
            console.log(data);
            if (data.code == 1000 && data.content.length > 0) {
              this.gameList = data.content;
              this.gameValue = data.content[0].id;
            } else if (data.code == 1000 && data.content == 0) {
              this.gameList = [];
              this.noListWarn = true;
            } else {
              this.$parent.layerTimeout(data.msg);
              return false
            }
          })
      },
      //获取区域名称
      getAreaList: function() {
        this.$ajax.get("game/areaList?gameId=" + this.gameValue, {
            timeout: 1000 * 5
          })
          .then((data) => {
            console.log(data);
            if (data.code == 1000 && data.content.length > 0) {
              this.areaList = data.content;
              this.areaValue = data.content[0].id;
            } else if (data.code == 1000 && data.content == 0) {
              this.areaList = [];
              this.noListWarn = true;
            } else {
              this.$parent.layerTimeout(data.msg);
              return false
            }
          })
      },
      //获取分类
      getGroupList: function() {
        this.$ajax.get("equipment/groupList?gameId=" + this.gameValue, {
            timeout: 1000 * 5
          })
          .then((data) => {
            console.log(data);
            if (data.code == 1000 && data.content.length > 0) {
              this.groupList = data.content;
              this.groupValue = data.content[0].id;
            } else if (data.code == 1000 && data.content == 0) {
              this.groupList = [];
              this.noListWarn = true;
            } else {
              this.$parent.layerTimeout(data.msg);
              return false
            }
          })
      },
      //获取装备类型
      getTypeList: function() {
        this.$ajax.get("equipment/typeList?groupId=" + this.groupValue, {
            timeout: 1000 * 5
          })
          .then((data) => {
            console.log(data);
            if (data.code == 1000 && data.content.length > 0) {
              this.typeList = data.content;
              this.typeValue = data.content[0].id;
            } else if (data.code == 1000 && data.content == 0) {
              this.typeList = [];
              this.noListWarn = true;
            } else {
              this.$parent.layerTimeout(data.msg);
              return false
            }
          })
      },
      //获取游戏名称
      getNameList: function() {
        this.$ajax.get("equipment/nameList?typeId=" + this.typeValue, {
            timeout: 1000 * 5
          })
          .then((data) => {
            console.log(data);
            if (data.code == 1000 && data.content.length > 0) {
              this.nameList = data.content;
              this.nameValue = data.content[0].id;
            } else if (data.code == 1000 && data.content == 0) {
              this.gameList = [];
              this.nameList = true;
            } else {
              this.$parent.layerTimeout(data.msg);
              return false
            }
          })
      },
    },
    watch: {
      //
      gameValue(val) {
        this.getAreaList();
        this.getGroupList();
      },
      //
      groupValue(val) {
        this.getTypeList();
      },
      //
      typeValue(val) {
        this.getNameList();
      },
      //
      typeList(val) {

      },
      //
      nameList(val) {

      },
    },
    beforeRouteLeave(to, from, next) {

      next()
    },
    created() {
      this.isFirstEnter = true;
    },
    activated() {
      if (this.$route.meta.needReload) {
        // this.$parent.getBasicUrlFun(this.getGameList);
        // this.getCount();
      }
    },
    mounted() {
      this.$parent.getBasicUrlFun(this.getGameList);
      this.$route.meta.needReload = true;
    }
  }
</script>

<style>
  #home {}

  #home .top-select {
    font-size: 0.8rem;
    line-height: 40px;
    text-align: center;
  }

  #home .el-row .el-input__inner {
    background: none;
    color: #666666;
    font-size: 0.8rem;
    text-align: center;
    padding-left: 0;
  }

  #home .el-input--suffix .el-input__inner {
    padding-right: 2rem;
    text-align: right;
  }

  #home .el-input__suffix {
    right: 1rem;
  }

  #home .el-input__icon {
    width: 15px;
  }

  #home .el-select .el-input .el-select__caret {
    font-size: 0.7rem;
  }

  .el-select-dropdown__item {
    text-align: center;
  }

  #home ul li {
    height: 3rem;
    line-height: 3rem;
    margin: 0.3rem 0;
    background: #FFFFFF;
    position: relative;
  }

  #home ul li .right-icon {
    position: absolute;
    top: 50%;
    right: 0.2rem;
    transform: translateY(-50%);
    width: 1.5rem;
    height: 1.5rem;
  }

  #home ul li .text-name {
    font-size: 0.8rem;
    margin-right: 3rem;
  }

  #home ul li .text-date {
    font-size: 0.6rem;
    color: #777777;
  }
</style>
