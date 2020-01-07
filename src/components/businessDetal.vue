<template>
	<div id="businessDetal">
		<div class="banner">
			<img class="absolute-center" :src="$parent.baseURL+theDetail.bigimg" fit="contain" alt="" />
		</div>
		<div class="listMsg">
			<h3>{{theDetail.title}}</h3>
		</div>
		<div class="listMsg">
			<ul>
				<li>
					<p v-if="theDetail.equipmentname">装备名称：{{theDetail.equipmentname}}</p>
					<p v-if="theDetail.personname">角色名称：{{theDetail.personname}}</p>
				</li>
				<li>
					<p>装备属性：
						<span class="" v-for="(val, key, index) in theDetail" v-if='propertyName[key]&&val'>
							{{key!="sex"?propertyName[key]+"/"+val:propertyName[key]+"/"+(val==0?"女":"男")}}
						</span>
					</p>
					<p>装备价格：
						<span class="text-danger">{{theDetail.price}}</span>
						<span class="text-danger" v-if="theDetail.pricetype==3">金币</span>
						<span class="text-danger" v-if="theDetail.pricetype==1">元宝</span>
						<span class="text-danger" v-if="theDetail.pricetype==2">RMB</span>
						<!--<span class="">{{theDetail.isprice==0?"可议价":"不可议价"}}</span>-->
					</p>
					<p>发布时间：{{theDetail.refreshdate}}</p>
					<p>玩家在线时间：{{theDetail.onlinetime}}</p>
					<p>玩家个性签名：{{theDetail.motto}}</p>
					<p>装备说明：{{theDetail.content}}</p>
				</li>
			</ul>
		</div>
		<div class="listMsg" v-if="showConnctMsg">
			<h4>联系方式</h4>
			<p v-if="productOrnerMsg.wechat">微信：{{productOrnerMsg.wechat}}</p>
			<p v-if="productOrnerMsg.qq">QQ：{{productOrnerMsg.qq}}</p>
			<p v-if="productOrnerMsg.phone">手机：{{productOrnerMsg.phone}}</p>
		</div>
		<div class="btn" @click="getConnctMsg">
			查看联系方式
		</div>
	</div>
</template>

<script>
	export default {
		name: 'businessDetal',
		data() {
			return {
				theDetail: "",
				productOrnerMsg: "",
				showConnctMsg: false
			}
		},
		methods: {
			init() {
				console.log(this.$route.params.listMsg);
				this.theDetail = this.$route.params.listMsg;
				this.productOrnerMsg = "";
				this.showConnctMsg = false;
			},
			getConnctMsg() {
				this.$ajax.get("sellManage/showGoodsContact?equipmentGuid=" + this.theDetail.guid, {
						timeout: 1000 * 5
					})
					.then((response) => {
						console.log(response);
						if(response.code == 1000 && response.content) {
							this.showConnctMsg = true;
							this.productOrnerMsg = response.content;
						} else {
							me.$parent.layerTimeout(response.msg);
							return false
						}
					})
			}
		},
		beforeRouteLeave(to, from, next) {
			to.meta.needReload = false;
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
		font-size: 0.7rem;
		padding-bottom: 1rem;
		height: 100%;
		overflow: auto;
	}
	
	#businessDetal .banner {
		width: 100%;
		height: 10rem;
		position: relative;
		background: #FFFFFF;
	}
	
	#businessDetal .banner img {
		/*width: 100%;
		height: 100%;*/
		max-width: 100%;
		max-height: 100%;
	}
	
	.listMsg {
		line-height: 1.5rem;
		background: #FFFFFF;
		padding: 0.5rem;
		margin: 0.2rem 0;
	}
	
	.propList {
		padding-left: 2rem;
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