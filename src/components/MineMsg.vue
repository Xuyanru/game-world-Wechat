<template>
  <!--<div>-->
    <div id="MineMsg">
      <div id="MineMsg-con">
        <p class="title text-center">请填写个人信息</p>
        <ul>
          <li class="clear fk-car">
            <p class="lf fk-car icon">游戏社区</p>
            <el-select v-model="theData.areaid" placeholder="选择游戏社区">
              <el-option v-for="item in areaList" :key="item.id" :label="item.areaname" :value="item.id">
              </el-option>
            </el-select>
          </li>
          <li class="clear fk-phone">
            <p class="lf fk-phone icon">电话</p>
            <input class="lf" v-model="theData.phone" type="text" placeholder="请输入您的电话" name="" id="" value="" />
          </li>
          <li class="clear fk-bfr">
            <p class="lf fk-bfr icon">QQ</p>
            <input class="lf" v-model="theData.qq" type="text" placeholder="请输入您的电话" name="" id="" value="" />
          </li>
          <li class="clear fk-bfr">
            <p class="lf fk-wechat icon">微信</p>
            <input class="lf" v-model="theData.wechat" type="text" placeholder="请输入您的电话" name="" id="" value="" />
          </li>
          <li class="clear fk-idcard">
            <p class="lf fk-idcard icon">角色名称</p>
            <input class="lf" v-model="theData.pid" type="text" placeholder="请输入您的电话" name="" id="" value="" />
          </li>
          <li class="clear fk-timec">
            <p class="lf fk-timec icon">在线时间</p>
            <input class="lf" v-model="theData.onlinetime" type="text" placeholder="请输入您的电话" name="" id="" value="" />
          </li>
          <li class="clear">
            <p class="lf fk-why icon">个性签名</p>
            <textarea v-model="theData.motto" name="" rows="5" cols="" placeholder="请输入来访事由或其他信息(50字符内)" maxlength="50"
              onchange="this.value=this.value.substring(0, 50)" ng-blur="scrollToTop()"></textarea>

          </li>
          <!--<li class="clear">
					<p class="lf icon fk-bfr">姓名
						<span class="icon fk-star"></span>
					</p>
					<input class="lf" v-model="name" type="text" placeholder="请输入您的姓名(必填)" name="" id="" value="" />
				</li>
				<li class="clear fk-idcard">
					<p class="lf icon fk-idcard">证件号</p>
					<input class="lf" v-model="idNum" type="text" placeholder="请输入您的身份证号码" name="" id="" value="" />
				</li>-->
        </ul>
      </div>
      <div class="text-danger theWarn">{{theWarn}}</div>
      <div class="btn" @click="submitMsg">确&nbsp;&nbsp;&nbsp;认</div>
    </div>
  <!--</div>-->

</template>

<script>
  import {
    IdentityCodeValid,
    checkPhone
  } from "../checkUserMsg.js";
  export default {
    name: 'MineMsg',
    data() {
      return {
        theData: {
          "areaid": 0,
          "gameid": 1,
          "motto": "string", //个性签名
          "onlinetime": "string", //在线时间
          "phone": "string",
          "pid": "string", //游戏角色ID
          "qq": "string",
          "wechat": "string"
        },
        areaList: [],
        theWarn: "",
      }
    },
    methods: {
      //初始化
      init: function() {
        var basicMsg = this.$parent.vBasicMsg ? this.$parent.vBasicMsg : JSON.parse(sessionStorage.getItem(
          "vBasicMsg"));
        this.theData = {
          "areaid": basicMsg.areaid ? basicMsg.areaid : "",
          "gameid": 1,
          "motto": basicMsg.motto, //个性签名
          "onlinetime": basicMsg.onlinetime, //在线时间
          "phone": basicMsg.phone,
          "pid": basicMsg.pid, //游戏角色ID
          "qq": basicMsg.qq,
          "wechat": basicMsg.wechat
        }
        this.getAreaList();
      },
      //获取区域名称
      getAreaList: function() {
        this.$ajax.get("game/areaList?gameId=" + this.theData.gameid, {
            timeout: 1000 * 5
          })
          .then((data) => {
            console.log(data);
            if (data.code == 1000 && data.content.length > 0) {
              this.areaList = data.content;
              // this.theData.areaid = data.content[0].id;
            } else if (data.code == 1000 && data.content == 0) {
              this.areaList = [];
              this.noListWarn = true;
            } else {
              this.$parent.layerTimeout(data.msg);
              return false
            }
          })
      },
      submitMsg() {
        var me = this;
        this.theWarn = "";
        if (this.theData.phone && !checkPhone(this.theData.phone)) {
          this.theWarn = "手机号输入有误";
          return false;
        }

        this.$ajax.post("user/perfect", this.theData, {
            timeout: 1000 * 5
          })
          .then((response) => {
            console.log(response);
            var data = response.data;
            if (response.code == 1000) {
              var theMsg = response.content;
              var callBack = function() {
                me.$parent.refreshMsg(theMsg);
                me.$router.push("/MyFile");
              }
              me.$parent.layerTimeout("提交成功", callBack);
            } else {
              me.$parent.layerTimeout(data.msg);
              return false
            }
          })
      }
    },

    beforeRouteLeave(to, from, next) {

      next()
    },
    created() {
      this.isFirstEnter = true;
    },
    activated() {
      this.init();
    }
  }
</script>

<style scoped="scoped">
  #MineMsg {
  	height: 100%;
  	overflow: auto;
    padding-bottom: 3rem;
    background: #FFFFFF;
  }

  #MineMsg .title {
    color: #777777;
    font-size: 0.8rem;
    line-height: 2.5rem;
    border-bottom: 1px solid #E2E2E2;
  }

  #MineMsg /deep/ input {
    border: none;
    text-align: right;
  }

  #MineMsg ul {
    padding: 0 1rem
  }

  #MineMsg ul li {
    font-size: 0.8rem;
    padding: 0.7rem 0.5rem;
    border-bottom: 1px solid #E2E2E2;
  }

  #MineMsg ul li p {
    width: 30%;
  }

  #MineMsg ul li input,
  #MineMsg ul li textarea,
  #MineMsg ul li /deep/ .el-select {
    width: 70%;
    line-height: 1rem;
    outline-style: none;
    font-size: 0.8rem;
    background: none;
    text-align: right;
  }

  #MineMsg ul li input,
  #MineMsg ul li textarea {
    padding: 0 1rem
  }

  #MineMsg ul li .el-select {
    height: 1rem;
  }

  #MineMsg /deep/ .el-input--suffix .el-input__inner {
    height: auto;
    line-height: 1rem;
    outline-style: none;
    font-size: 0.8rem;
    background: none;
    text-align: right;
  }

  #MineMsg /deep/ .el-select .el-input .el-select__caret {
    line-height: 1rem;
  }


  #MineMsg ul li textarea {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-radius: 5px;
    border: 1px solid #D0D0D0
  }

  #MineMsg .btn {
    width: 60%;
    margin: 1rem auto
  }

  #MineMsg .theWarn {
    line-height: 2rem;
    padding-left: 2rem;
    height: 2rem;
    background: #fff;
  }
</style>
