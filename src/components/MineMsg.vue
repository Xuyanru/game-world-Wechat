<template>
	<div id="MineMsg">
		<div id="MineMsg-con">
			<p class="title text-center">请填写个人信息</p>
			<ul>
				<li class="clear fk-phone">
					<p class="lf fk-phone icon">电话</p>
					<input class="lf" v-model="tel" type="text" placeholder="请输入您的电话" name="" id="" value="" />
				</li>
				<li class="clear fk-bfr">
					<p class="lf fk-bfr icon">QQ</p>
					<input class="lf" v-model="QQNum" type="text" placeholder="请输入您的电话" name="" id="" value="" />
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
				QQNum: "",
				tel: "",
				idNum: "",
				theWarn: "",
			}
		},
		methods: {
			submitMsg() {
				var me = this;
				this.theWarn = "";
				if (!this.name) {
					this.theWarn = "姓名为必填项";
					// this.$parent.layerTimeout("姓名为必填项");
					return false;
				} else if (this.tel && !checkPhone(this.tel)) {
					this.theWarn = "手机号输入有误";
					// this.$parent.layerTimeout("手机号输入有误");
					return false;
				} else if (this.idNum && !IdentityCodeValid(this.idNum)) {
					this.theWarn = "身份证号输入有误";
					// this.$parent.layerTimeout("身份证号输入有误");
					return false;
				}

				var sendMsg = {
					idnum: this.idNum,
					uname: this.name,
					utel: this.tel
				}
				this.$ajax.post("wxuser/addOrUpdateWxUser", sendMsg, {
						timeout: 1000 * 5
					})
					.then(function(response) {
						console.log(response);
						if (response.status == 200) {
							var data = response.data;
							if (data.code == 1000) {
								var theMsg = data.content;
								var callBack = function() {
									me.$parent.refreshMsg(theMsg);
								}
								me.$parent.layerTimeout("提交成功", callBack);
							} else {
								me.$parent.layerTimeout(data.msg);
								return false
							}
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
			if (this.$parent.vBasicMsg) {
				this.name = this.$parent.vBasicMsg.uname;
				this.idNum = this.$parent.vBasicMsg.idnum;
				this.tel = this.$parent.vBasicMsg.utel;
			}
		}
	}
</script>

<style scoped="scoped">
	#MineMsg-con {
		background: #FFFFFF;
	}

	#MineMsg .title {
		color: #777777;
		font-size: 0.8rem;
		line-height: 2.5rem;
		border-bottom: 1px solid #E2E2E2;
	}

	#MineMsg input {
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

	#MineMsg ul li input {
		width: 70%;
		line-height: 1rem;
		outline-style: none;
		font-size: 0.8rem;
		background: none;
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
