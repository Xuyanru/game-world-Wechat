<template class="needHeight">
	<div id="Cart">
		<div>
			<el-row class="top-select lineOne text-center" :gutter="1">
				<el-col :span="8" class="line-one">
					<el-select v-model="theDate.gameid" placeholder="游戏名称">
						<el-option v-for="item in gameList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-col>
				<el-col :span="8" class="line-one">
					<el-select v-model="theDate.areaid" placeholder="游戏社区">
						<el-option v-for="item in areaList" :key="item.id" :label="item.areaname" :value="item.id">
						</el-option>
					</el-select>
				</el-col>
				<el-col :span="8" class="line-one">
					<el-select v-model="theDate.groupid" placeholder="商品分组">
						<el-option v-for="item in groupList" :key="item.id" :label="item.groupName" :value="item.id">
						</el-option>
					</el-select>
				</el-col>
				<el-col :span="8">
					<el-select v-model="theDate.equipmenttypeid" placeholder="装备类型">
						<el-option v-for="item in typeList" :key="item.id" :label="item.typename" :value="item.id">
						</el-option>
					</el-select>
				</el-col>
				<el-col :span="8">
					<el-select v-model="theDate.equipmentnameid" placeholder="装备名称">
						<el-option v-for="item in nameList" :key="item.id" :label="item.equipmentname" :value="item.id">
						</el-option>
					</el-select>
				</el-col>
				<el-col :span="8">
					<span @click="drawer=true">
            小贴士
          </span>
				</el-col>
			</el-row>
			<el-form :inline="true" class="demo-form-inline theDetail clear">
				<el-form-item :label="item1.labeltext" v-for="item1 in propertyList">
					<el-select v-model="theDate[''+item1.inputname]" placeholder="请选择">
						<el-option v-for="item2 in item1.inputvalue.split(',')" :key="item2" :label="item2" :value="item2">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="价格">
					<el-input v-model="theDate.price"></el-input>
				</el-form-item>
				<el-form-item label="类型">
					<el-select v-model="theDate.pricetype" placeholder="请选择">
						<el-option v-for="item in pricetypeList" :key="item.type" :label="item.name" :value="item.type">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="数量">
					<el-select v-model="theDate.count" placeholder="请选择">
						<el-option v-for="item in 10" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<el-form :inline="true" class="demo-form-inline theContent clear">
				<el-form-item label="标题">
					<el-input v-model="theDate.title"></el-input>
				</el-form-item>
				<el-form-item label="内容">
					<el-input type="textarea" v-model="theDate.content"></el-input>
				</el-form-item>
				<el-form-item label="图片" id="thePicture">
					<input type="file" accept="image/*" v-on:change="selImgCon1($event)">
					<el-button type="primary" v-show="!theImg">选择图片</el-button>
					<img :src="theImg" alt="" v-show="theImg" />
				</el-form-item>
			</el-form>
			<el-form :inline="true" class="demo-form-inline theContent clear">
				<el-form-item label="微信">
					<el-input v-model="theDate.qq"></el-input>
				</el-form-item>
				<el-form-item label="Q Q">
					<el-input v-model="theDate.wechat"></el-input>
				</el-form-item>
				<el-form-item label="角色名称">
					<el-input v-model="theDate.roleName"></el-input>
				</el-form-item>
			</el-form>
			<div class="text-center">
				<el-button class="el-col-18 el-col-offset-3" type="warning" @click="setGoodsData">发&nbsp;&nbsp;&nbsp;布</el-button>
			</div>
		</div>
		<!--右侧抽屉搜索-->
		<el-drawer :visible.sync="drawer" size="80%" :with-header="false">
			<h4>温馨小提示</h4>
			<p class="theWarn">店装只选极品属性值即可，极品白装如裁决，攻选30，方便搜索</p>
		</el-drawer>
	</div>
</template>

<script>
	import QRCode from "qrcodejs2";
	import {
		compressedImage,
		rotateImg,
		selImgCon
	} from './../myJs/compressedImage.js';
	export default {
		name: 'Cart',

		data() {
			return {
				theDate: {
					gameid: "",
					areaid: "",
					groupid: "",
					equipmenttypeid: "",
					equipmentnameid: "",
					pricetype: "",
					'count': 1,
					title: "",
					content: "",
					bigimg: "",
					roleName: "",
					qq: '',
					wechat: ''
				},
				theImg: "",
				areaList: [],
				groupList: [],
				typeList: [],
				gameList: [],
				nameList: [],
				drawer: false,
				propertyList: [],
				pricetypeList: [{
					type: 3,
					name: "金币"
				}, {
					type: 1,
					name: "元宝"
				}, {
					type: 2,
					name: "RMB"
				}],
			}
		},
		methods: {
			init: function() {
				var theBasicMsg = this.$parent.vBasicMsg ? this.$parent.vBasicMsg : JSON.parse(sessionStorage.getItem(
					"vBasicMsg"));
				this.theDate.qq = theBasicMsg.qq;
				this.theDate.wechat = theBasicMsg.wechat;
			},
			//获取该用户是否有发布权限
			getIsPublish: function() {
				this.$ajax.get("user/isPublish", {
						timeout: 1000 * 20
					})
					.then((data) => {
						console.log(data);
						if(data.code != 1000) {
							this.$parent.layerTimeout(data.msg);
							return false
						}
					})
			},
			//获取游戏名称
			getGameList: function() {
				this.$ajax.get("game/gameList", {
						timeout: 1000 * 20
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content.length > 0) {
							this.gameList = data.content;
							this.theDate.gameid = data.content[0].id;
						} else if(data.code == 1000 && data.content == 0) {
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
				this.$ajax.get("game/areaList?gameId=" + this.theDate.gameid, {
						timeout: 1000 * 20
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content.length > 0) {
							this.areaList = data.content;
							this.theDate.areaid = data.content[0].id;
						} else if(data.code == 1000 && data.content == 0) {
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
				this.$ajax.get("property/groupList?gameId=" + this.theDate.gameid + "&isAll=1", {
						timeout: 1000 * 20
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content.length > 0) {
							this.groupList = data.content;
							this.theDate.groupid = data.content[0].id;
						} else if(data.code == 1000 && data.content == 0) {
							this.groupList = [];
							this.theDate.groupid = "";
							this.noListWarn = true;
						} else {
							this.$parent.layerTimeout(data.msg);
							return false
						}
					})
			},
			//获取装备类型
			getTypeList: function() {
				this.$ajax.get("property/typeList?groupId=" + this.theDate.groupid + "&isAll=1", {
						timeout: 1000 * 20
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content.length > 0) {
							this.typeList = data.content;
							this.theDate.equipmenttypeid = data.content[0].id;
						} else if(data.code == 1000 && data.content == 0) {
							this.typeList = [];
							this.theDate.equipmenttypeid = "";
							this.nameList = [];
							this.theDate.equipmentnameid = "";
							this.noListWarn = true;
						} else {
							this.$parent.layerTimeout(data.msg);
							return false
						}
					})
			},
			//获取装备名称
			getNameList: function() {
				this.$ajax.get("property/nameList?typeId=" + this.theDate.equipmenttypeid + "&isAll=1", {
						timeout: 1000 * 20
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content.length > 0) {
							this.nameList = data.content;
							this.theDate.equipmentnameid = data.content[0].id;
						} else if(data.code == 1000 && data.content == 0) {
							this.nameList = [];
							this.theDate.equipmentnameid = "";
						} else {
							this.$parent.layerTimeout(data.msg);
							return false
						}
					})
			},
			//获取属性列表
			getPropertyList: function() {
				this.theDate = JSON.parse(JSON.stringify(this.theDate, ['gameid', 'areaid', 'groupid', 'equipmenttypeid',
					'equipmentnameid', 'qq', 'wechat', 'phone'
				]));
				this.$ajax.get("property/propertyList?typeId=" + this.theDate.equipmenttypeid, {
						timeout: 1000 * 20
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content.length > 0) {
							this.propertyList = data.content;
						} else if(data.code == 1000 && data.content == 0) {
							this.propertyList = [];
						} else {
							this.$parent.layerTimeout(data.msg);
							return false
						}
					})
			},
			//选择图片
			selImgCon1: function(e) {
				var me = this;
				var callback = function(base64) {
					me.theDate.bigimg = base64;
					me.theImg = base64;
					console.log(me.theDate);
				}
				selImgCon(e, callback);
				console.log(this.theImgSrc);
			},
			//整理发布数据
			setGoodsData: function() {
				for(var key in this.theDate) {
					if(!this.theDate[key]) {
						delete this.theDate[key];
					}
				}

				console.log(this.theDate);
				if(this.theImg) {
					var me = this;
					var callback = function(base64) {
						me.theDate.bigimg = base64.split(",")[1];
						me.comfirmGoods();
					}
					compressedImage(this.theImg, callback);
				} else {
					this.comfirmGoods();
				}
			},
			//发布物品
			comfirmGoods: function() {
				this.$parent.layerShow("正在提交信息");
				console.log(this.theDate)
				this.$ajax.post("sellManage/sellGoods", this.theDate, {
						timeout: 1000 * 5
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000) {
							this.$parent.layerTimeout("发布成功");
							this.theImg = "";
							this.getPropertyList();
						} else {
							this.$parent.layerTimeout(data.msg);
							return false
						}
					})

			},
		},
		watch: { //
			'theDate.bigimg' (val) {
				console.log(val);
			},
			'theDate.gameid' (val) {
				if(val) {
					this.getAreaList();
					this.getGroupList();
				}

			},
			'theDate.areaid' (val) {

			},
			//
			'theDate.groupid' (val) {
				if(val) {
					this.getTypeList();
					if(val == 3) {
						this.pricetypeList = [{
							type: 3,
							name: "金币"
						}, {
							type: 1,
							name: "元宝"
						}, {
							type: 2,
							name: "RMB"
						}]
					} else {
						this.pricetypeList = [{
							type: 3,
							name: "金币"
						}, {
							type: 1,
							name: "元宝"
						}]
					}
				}
			},
			//
			'theDate.equipmenttypeid' (val) {
				if(val) {
					this.getNameList();
					this.getPropertyList();
				}
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
			this.$parent.getBasicUrlFun(this.getGameList);
			this.$route.meta.needReload = true;
		},
		mounted() {
			this.$parent.getBasicUrlFun(this.getIsPublish);
			this.$parent.getBasicUrlFun(this.getGameList);
			this.$route.meta.needReload = true;
		}
	}
</script>

<style>
	#Cart {
		height: 100%;
	}
	
	#Cart>div {
		height: 100%;
		overflow: auto;
		padding-bottom: 2rem;
	}
	
	#Cart .theWarn {
		font-size: 0.7rem;
		padding: 0.5rem;
		background: #DEDEDE;
	}
	
	#Cart .top-select {
		width: 100%;
		overflow: hidden;
		/*font-size: 0.8rem;
		line-height: 40px;*/
		text-align: center;
	}
	
	#Cart .el-row .el-col {
		margin-bottom: 1px;
	}
	
	#Cart .el-row.top-select .el-col:last-child {
		padding-left: 0;
		line-height: 2rem;
	}
	
	#Cart .el-row.top-select .el-col:last-child span {
		display: inline-block;
		width: 100%;
		height: 100%;
		font-size: 14px;
		color: #606266;
		border: 0;
		border-radius: 4px;
		background-color: #FFF;
		padding-right: 0.6rem;
	}
	
	#Cart .demo-form-inline {
		padding: 10px;
	}
	
	#Cart .theDetail .el-form-item {
		float: left;
	}
	
	#Cart .theDetail .el-form-item {
		margin-bottom: 10px;
	}
	
	#Cart .theContent {
		padding-top: 0;
		text-align: left;
	}
	
	#Cart .theContent .el-form-item {
		margin-right: 0;
		float: none;
	}
	
	#thePicture .el-form-item__content {
		max-width: 15.8rem;
		height: auto;
	}
	
	#thePicture .el-form-item__content .el-button {
		width: 100%;
	}
	
	#thePicture .el-form-item__content img {
		max-width: 100%;
	}
	
	#thePicture .el-form-item__content input {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
	
	.theContent .el-form-item__label {
		width: 3rem;
		text-align: left;
	}
</style>