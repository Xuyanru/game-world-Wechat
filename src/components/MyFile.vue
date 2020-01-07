<template>
	<div id="MyFile">
		<div id="MyFile-top" class="clear">
			<el-avatar class="lf" shape="square" fit="fit" :src="headImg"></el-avatar>
			<div class="myName lf">
				<p class="name">{{basicMsg.nickname}}</p>
				<p class="wechatCode">个性签名：{{basicMsg.motto}}</p>
			</div>
		</div>
		<div class="itemList">
			<div class="card">
				<router-link :to="{name:'MineMsg'}" tag="li">
					<div class="item item-text-wrap item-icon-right">
						个人信息
						<i class="el-icon-arrow-right rt"></i>
					</div>
				</router-link>
			</div>
			<div class="card">
				<router-link :to="{name:'myBusiness'}" tag="li">
					<div class="item item-text-wrap item-icon-right">
						商品管理
						<i class="el-icon-arrow-right rt"></i>
					</div>
				</router-link>

			</div>
		</div>
	</div>
</template>

<script>
	import {
		IdentityCodeValid,
		checkPhone
	} from "../checkUserMsg.js";
	export default {
		name: 'MyFile',
		data() {
			return {
				headImg: "",
				basicMsg: ""
			}
		},
		mounted() {
			this.basicMsg = JSON.parse(sessionStorage.getItem("vBasicMsg"));
			this.headImg = this.basicMsg.headerimg;
		},
		methods: {

		},

		beforeRouteLeave(to, from, next) {
			if(to.name == "myBusiness") {
				to.meta.needReload = true;
				to.meta.scollTopPosition = 0;
			}
			next()
		},
		created() {
			this.isFirstEnter = true;

		},
		activated() {
			if(this.$parent.vBasicMsg) {
				this.name = this.$parent.vBasicMsg.uname;
				this.idNum = this.$parent.vBasicMsg.idnum;
				this.tel = this.$parent.vBasicMsg.utel;
			}
		}
	}
</script>

<style scoped="scoped">
	#MyFile-top {
		padding: 1rem;
		/*line-height: 100px;*/
		background: #FFFFFF;
	}
	
	#MyFile-top .el-avatar {
		width: 3.5rem;
		height: 3.5rem;
		vertical-align: middle;
		margin-right: 0.5rem;
	}
	
	#MyFile-top .myName {
		width: 12rem;
		line-height: 1.75rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	#MyFile-top .myName .name {
		font-size: 0.9rem;
		font-weight: bold;
	}
	
	#MyFile-top .myName .wechatCode {
		color: #999999;
		font-size: 0.8rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.itemList {
		margin-top: 1rem
	}
	
	.itemList .card {
		width: 100%;
		line-height: 2.5rem;
		font-size: 0.8rem;
		padding: 0 1rem;
		background: #FFFFFF;
		border-bottom: 1px solid #EFEFEF;
	}
	
	.itemList .card i {
		font-size: 1rem;
		line-height: 2.5rem;
	}
	
	.itemList .card:last-child {
		border-bottom: none;
	}
</style>