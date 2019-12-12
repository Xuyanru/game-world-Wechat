<template>
	<div id="home">
		<el-row class="top-select">
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
				<li class="clear" @click="gotoDetail(item)">
					<el-card>
						<div class="lf list-img">
							<img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" alt="" />

						</div>
						<div class="list-msg">
							<p class="line-one">
								{{"vsdvd"}}
							</p>
							<p class="line-two">
								<span class="list-addr list-icon">
									{{"vsdvd"}}
								</span>
								<span class="list-time list-icon">
									{{"vsdvd"}}
								</span>
							</p>
							<p class="line-three clear">
								<span class="lf list-sponsor">主办方:{{"vsdvd"}}</span>
								<span class="rt list-mumber">已报名:{{"vsdvd"}}</span>
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
				<el-form-item :label="item1.labeltext" v-for="(item1, index) in propertyList">
					<el-select v-model="theDate[''+item1.inputname]" placeholder="请选择">
						<el-option v-for="item2 in item1.inputvalue.split(',')" :key="item2" :label="item2" :value="item2">
						</el-option>
					</el-select>
				</el-form-item>
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
			//打开右侧搜索
			//			openFilter: function() {
			//				this.drawer = true;
			//				this.getPropertyList();
			//			},
			//获取游戏名称
			getGameList: function() {
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
				this.$ajax.post("sellManage/allSellGoods?pageNo=" + this.pageNo + "&pageSize=" + this.pageSize, this.theDate, {
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
						did: list
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
		watch: { //
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
		width: 7rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis
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
	/*#home ul li {
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
	
	.el-drawer__body {
		padding: 0.8rem;
	}*/
</style>