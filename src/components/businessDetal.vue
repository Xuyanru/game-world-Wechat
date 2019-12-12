<template>
	<div id="businessDetal">
		<div class="banner">
			<img src="../../static/img/banner1.png" alt="" />
		</div>
		<div class="listMsg">
			<p>业务名称：{{listMsg.qname}}</p>
			<p>已&nbsp;预&nbsp;约：{{listMsg.dcount}}</p>
			<p>剩余数量：{{listMsg.qLeft}}</p>
		</div>
		<div class="btn" @click="submitOrder">
			立即预约
		</div>
	</div>
</template>

<script>
	export default {
		name: 'businessDetal',
		data() {
			return {
				startDate: "",
				theCount: 0,
				selet: "",
				qCode: "",
				listMsg: "",
				theDate: "",
				sTimes: "",
				eTime: ""
			}
		},
		methods: {
			init() {

			},
			submitOrder() {
				var me = this;
				var sTime = this.theDate + " " + me.sTimes + ":00";
				var eTime = this.theDate + " " + me.eTime + ":00";
				if(!this.$parent.vBasicMsg.uname) {
					me.$parent.layerTimeout("请先补全信息再预约");
					me.$router.push("/Me");
				}
				console.log(sTime, eTime);
				this.$ajax.get("wxqueue/takeOrder/" + this.$parent.openId + "/" + this.qCode + "/" + sTime + "/" + eTime, {
						timeout: 1000 * 5
					})
					.then(function(response) {
						console.log(response);
						if(response.status == 200) {
							var data = response.data;
							if(data.code == 1000) {
								var callBack = function() {
									me.$router.push("/Cart");
								}
								me.$parent.layerTimeout("预约成功", callBack);
							} else {
								me.$parent.layerTimeout(data.msg);
								return false
							}
						}
					})
			}
		},
		beforeRouteLeave(to, from, next) {
			this.init();
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

<style>
	#businessDetal {
		padding: 0.5rem;
	}
	
	#businessDetal .banner {
		width: 100%;
		height: 10rem;
	}
	
	#businessDetal .banner img {
		width: 100%;
		height: 100%;
	}
	
	.listMsg {
		line-height: 1.5rem;
		background: #FFFFFF;
		padding: 0.8rem
	}
	
	.inputOut {
		line-height: 2rem;
		margin-top: 0.2rem;
	}
	
	.inputOut span {
		font-size: 1rem;
	}
	
	input {
		width: 7rem;
		line-height: 2rem;
		font-size: 0.7rem;
		padding: 0 0.5rem;
		text-align: center;
		border: 1px solid #E2E2E2;
		background: #E1E8FB;
	}
	
	.mbsc-mobiscroll.dw-inline {
		margin-top: 0.5rem
	}
	
	.dw-inline .dw {
		width: 100%;
	}
	
	.dw-i {
		/*letter-spacing: 0.2rem;*/
	}
	
	.dw-li {
		padding: 0 2rem;
	}
	
	#demo-inline {
		margin-top: 0.2rem
	}
	
	.btn {
		width: 100%;
	}
</style>