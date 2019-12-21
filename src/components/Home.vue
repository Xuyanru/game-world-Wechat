<template>
	<div id="home">
		<el-row class="top-select" :gutter="1">
			<el-col :span="8">
				<el-select v-model="theDate.gameid" placeholder="游戏名称">
					<el-option v-for="item in gameList" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-col>
			<el-col :span="8">
				<el-select v-model="theDate.areaid" placeholder="游戏社区">
					<el-option v-for="item in areaList" :key="item.id" :label="item.areaname" :value="item.id">
					</el-option>
				</el-select>
			</el-col>
			<el-col :span="8">
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
          筛选
        </span>
			</el-col>
		</el-row>
		<!--售卖商品列表-->
		<div class="infinite-list-wrapper search-list" style="overflow:auto">
			<ul class="list" v-infinite-scroll="getSellGoods" infinite-scroll-disabled="disabled">
				<li class="clear" @click="gotoDetail(item)" v-for="item in dataList">
					<el-card>
						<div class="lf list-img">
							<img :src="$parent.baseURL+item.smallimg" alt="" />

						</div>
						<div class="list-msg">
							<p class="line-one">
								{{item.title}}
							</p>
							<p class="line-two">
								<span class="list-icon" v-for="(val, key, index) in item" v-if='propertyName[key]&&val'>
									{{key!="sex"?propertyName[key]+val:propertyName[key]+(val==0?"女":"男")}}
								</span>
							</p>
							<p class="line-three clear">
								<span class="lf list-sponsor text-danger">{{item.price}}</span>
								<span class="text-danger lf" v-if="item.pricetype==0">金币</span>
								<span class="text-danger lf" v-if="item.pricetype==1">元宝</span>
								<span class="text-danger lf" v-if="item.pricetype==2">RMB</span>
								<span class="rt list-mumber">{{item.refreshdate}}</span>
							</p>
						</div>
					</el-card>
				</li>
				<!--<li v-for="i in count" class="list-item">{{ i }}</li>-->
			</ul>
			<p v-if="loading" align="center">加载中...</p>
			<p v-if="noMore" align="center">没有更多了</p>
		</div>
		<!--右侧抽屉搜索-->
		<el-drawer :visible.sync="drawer" size="80%" :with-header="false">
			<h4>选择搜索的属性</h4>
			<el-form :inline="true" class="demo-form-inline">
				<el-col :span="12" v-for="(item1, index) in propertyList">
					<el-form-item :label="item1.labeltext">
						<el-select v-model="theDate[''+item1.inputname]" placeholder="请选择">
							<el-option v-for="item2 in item1.inputvalue.split(',')" :key="item2" :label="item2" :value="item2">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>

			</el-form>
			<el-button type="primary" @click="initGetGoods">确定</el-button>
		</el-drawer>
	</div>
</template>

<script>
	export default {
		name: 'Home',
		data() {
			return {
				theDate: {
					gameid: "",
					areaid: "",
					groupid: "",
					equipmenttypeid: "",
					equipmentnameid: "",
				},
				areaList: [],
				groupList: [],
				typeList: [],
				gameList: [],
				nameList: [],
				drawer: false,
				propertyList: [],

				pageNo: 1,
				pageSize: 10,
				dataList: [], //商品列表
				count: 0, //记录总条数
				loading: false,

				startDate: "",
				noListWarn: false,
				nolistMsg: "",
			}
		},
		methods: {
			//获取游戏名称
			getGameList: function() {
//				this.gameList=[{"name":"原始传奇","id":"1"}];
//				return;
				this.$ajax.get("game/gameList", {
						timeout: 1000 * 5
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
						timeout: 1000 * 5
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
				this.$ajax.get("property/groupList?gameId=" + this.theDate.gameid, {
						timeout: 1000 * 5
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
				this.$ajax.get("property/typeList?groupId=" + this.theDate.groupid, {
						timeout: 1000 * 5
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
				this.$ajax.get("property/nameList?typeId=" + this.theDate.equipmenttypeid, {
						timeout: 1000 * 5
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content.length > 0) {
							this.nameList = data.content;
							this.theDate.equipmentnameid = data.content[0].id;
						} else if(data.code == 1000 && data.content == 0) {
							this.nameList = [];
							this.theDate.equipmentnameid = "";
							this.nameList = true;
						} else {
							this.$parent.layerTimeout(data.msg);
							return false
						}
					})
			},
			//获取属性列表
			getPropertyList: function() {
				this.theDate = JSON.parse(JSON.stringify(this.theDate, ['gameid', 'areaid', 'groupid', 'equipmenttypeid', 'equipmentnameid']));
				this.$ajax.get("property/propertyList?typeId=" + this.theDate.equipmenttypeid, {
						timeout: 1000 * 5
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content.length > 0) {
							this.propertyList = data.content;

						} else if(data.code == 1000 && data.content == 0) {
							this.propertyList = [];
							this.nameList = true;
						} else {
							this.$parent.layerTimeout(data.msg);
							return false
						}
					})
			},
			//获取商品列表
			getSellGoods: function() {
				this.loading = true;
				//				this.$ajax.post("sellManage/allSellGoods?pageNo=" + this.pageNo + "&pageSize=" + this.pageSize, this.theDate, {
				this.$ajax.post("sellManage/allSellGoods?pageNo=" + this.pageNo + "&pageSize=" + this.pageSize, {}, {
						timeout: 1000 * 15
					})
					.then((data) => {
						console.log(data);
						this.loading = false;
						if(data.code == 1000 && data.content.length > 0) {
							this.count = data.count;
							if(this.pageNo == 1) {
								this.dataList = data.content;
							} else {
								this.dataList = this.dataList.concat(data.content);
							}
							console.log(this.dataList);
						} else if(data.code == 1000 && data.content == 0) {
							this.count = data.count;
						} else {
							this.$parent.layerTimeout(data.msg);
							this.count=0;
							return false
						}
					})
			},
			initGetGoods: function() {
				this.pageNo = 1;
				this.getSellGoods();
				if(this.drawer) {
					this.drawer = false;
				}
			},
			gotoDetail(list) {
				this.$router.push({
					name: 'businessDetal',
params: {
listMsg: list
}
});
},
},
computed: {
		noMore() {
			return this.dataList.length >= this.count;
		},
		disabled() {
			return this.loading || this.noMore
		}
	},
	watch: {//
			'theDate.gameid' (val) {
				if(val) {
					this.getAreaList();
					this.getGroupList();
					this.initGetGoods();
				}

			},
			'theDate.areaid' (val) {
				this.initGetGoods();
			},
			//
			'theDate.groupid' (val) {
				if(val) {
					this.getTypeList();
					this.initGetGoods();
				}
			},
			//
			'theDate.equipmenttypeid' (val) {
				if(val) {
					this.getNameList();
					this.getPropertyList();
					this.initGetGoods();
				}
			},
			'theDate.equipmentnameid' (val) {
				if(val) {
					this.initGetGoods();
				}
			},
		},
		beforeRouteLeave(to, from, next) {

			next()
		},
		created() {
			this.isFirstEnter = true;
		},
		activated() {
			this.$parent.getBasicUrlFun(this.getGameList);
			this.$route.meta.needReload = true;
		},
		mounted() {
			this.$parent.getBasicUrlFun(this.getGameList);
			this.$route.meta.needReload = true;
			console.log(this.propertyName);
		}
	}
</script>

<style>
	#home {}
	
	#home .top-select {
		/*font-size: 0.8rem;
		line-height: 40px;*/
		text-align: center;
	}
	
	#home .el-row .el-col {
		margin-bottom: 1px;
	}
	
	.el-drawer.ltr,
	.el-drawer.rtl,
	.el-drawer__container {
		overflow: auto;
	}
	
	.search-list ul li {
		padding: .5rem;
		border-bottom: 1px solid #999
	}
	
	.search-list ul li .list-img {
		width: 5.25rem;
		height: 4.5rem
	}
	
	.search-list ul li .list-img img {
		width: 100%;
		height: 100%;
		border-radius: 10px
	}
	
	.search-list ul li .list-msg {
		margin-left: 5.25rem;
		padding-left: .2rem
	}
	
	.search-list ul li .list-msg .line-one {
		font-size: .8rem;
		line-height: .8rem;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		padding-top: .2rem;
		height: 1.5rem
	}
	
	.search-list ul li .list-msg .line-two,
	.search-list ul li .list-msg .line-three {
		margin-top: .55rem;
		font-size: .7rem;
		color: #bfbfbf;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis
	}
	
	.search-list ul li .list-msg .line-three .list-sponsor {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-right: 0.2rem;
	}
	
	.search-list ul li .list-msg .line-three .lf {
		color: #a94442;
	}
	
	.list-icon {
		padding-left: .8rem
	}
	
	.search-list ul li .list-msg .line-two .list-addr {
		background: url("../../static/img/address.png") no-repeat left center
	}
	
	.search-list ul li .list-msg .line-two .list-addr {
		margin-right: .5rem
	}
	
	.search-list ul li .list-msg .line-two .list-time {
		background: url("../../static/img/time.png") no-repeat left center
	}
	
	.search-list ul li .list-msg .line-three span {
		font-size: .7rem;
		color: #bfbfbf
	}
	
	.el-drawer__body {
		padding: 0.8rem;
	}
</style>