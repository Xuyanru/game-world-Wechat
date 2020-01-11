<template>
	<div id="home">
		<mescroll-vue class="search-list" ref="mescroll" id="" :up="mescrollUp" @init="mescrollInit">
			<div class="banner">
				<img class="full-parent" src="http://www.honghai.fun/euipmentImg/appImg/banner.png" alt="" />
			</div>
			<!--<el-carousel height="10rem">
			<el-carousel-item v-for="item in 4" :key="item">
				<img src="../../static/img/002_03.png" alt="" />
			</el-carousel-item>
		</el-carousel>-->
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
			<ul id="dataList" class="list">
				<li class="clear" @click="gotoDetail(item,)" v-for="(item,index) in dataList">
					<el-card class="clear">
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
								<span class="text-danger lf" v-if="item.pricetype==3">金币</span>
								<span class="text-danger lf" v-if="item.pricetype==1">元宝</span>
								<span class="text-danger lf" v-if="item.pricetype==2">RMB</span>
								<span class="rt" >{{item.province+" "+item.city}}</span>
								
							</p>
							<p class="line-four clear">
								<span class="lf">{{item.equipmentname}}</span>
								<span class="zan lf" @click.stop="supportFun(item,index)">
                  <i class="notSupport" v-if="item.isSupport==0"></i>
                  <i class="isSupport" v-if="item.isSupport==1"></i>
                </span>
								<span>
                  {{item.support }}
                </span>
								<span class="rt list-mumber">{{item.refreshdate}}</span>
							</p>
						</div>
					</el-card>
				</li>
			</ul>
		</mescroll-vue>

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
			<el-button type="primary" @click="resetGoods">确定</el-button>
		</el-drawer>
	</div>
</template>

<script>
	import MescrollVue from 'mescroll.js/mescroll.vue'
	export default {
		name: 'Home',
		components: {
			MescrollVue
		},
		data() {
			return {
				mescroll: null, // mescroll实例对象
				mescrollUp: {
					callback: this.getGoodsFun, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
					hardwareClass: 'mescroll-hardware',
					mustToTop: true,
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量
					},
					noMoreSize: 3, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
					//					isBounce: false,
					toTop: {
						duration: 100, // 回到顶部的动画时长,默认300ms
						src: './static/mescroll/mescroll-totop.png' // 回到顶部按钮的图片路径,支持网络图
					},
					empty: {
						// 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才生效;
						warpId: 'dataList', // 父布局的id;
						icon: './static/mescroll/mescroll-empty.png', // 图标,支持网络图
						tip: '暂无相关数据~', // 提示
						// btntext: '去逛逛 >', // 按钮,默认""
						// btnClick() { // 点击按钮的回调,默认null
						//   alert('点击了按钮,具体逻辑自行实现')
						// }
					},
					//					onScroll: function(mescroll, y, isUp) {
					//						console.log(y);
					//					},
					lazyLoad: {
						use: true // 是否开启懒加载,默认false
					}
				},
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

				startDate: "",
				nolistMsg: "",
			}
		},
		methods: {
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			//点赞或取消点赞操作
			supportFun: function(theDetail, idx) {
				if(theDetail.isSupport == 0) {
					this.dataList[idx].isSupport = 1;
					this.dataList[idx].support++;
				} else {
					this.dataList[idx].isSupport = 0;
					this.dataList[idx].support--;
				}

				this.$ajax.get("sellManage/goodsSupport?equipmentGuid=" + theDetail.guid + "&status=" + this.dataList[idx].isSupport, {
						timeout: 1000 * 20
					})
					.then((data) => {
						console.log(data);

					})
			},
			//获取游戏名称
			getGameList: function() {
				//				this.gameList=[{"name":"原始传奇","id":"1"}];
				//				return;
				var me = this;
				this.$ajax.get("game/gameList", {
						timeout: 1000 * 20
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content.length > 0) {
							me.gameList = data.content;
							me.theDate.gameid = data.content[0].id;
						} else if(data.code == 1000 && data.content == 0) {
							me.gameList = [];
						} else {
							me.$parent.layerTimeout(data.msg);
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
						} else {
							this.$parent.layerTimeout(data.msg);
							return false
						}
					})
			},
			//获取分类
			getGroupList: function() {
				this.$ajax.get("property/groupList?gameId=" + this.theDate.gameid, {
						timeout: 1000 * 20
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content.length > 0) {
							this.groupList = data.content;
							this.theDate.groupid = data.content[0].id;
						} else if(data.code == 1000 && data.content.length == 0) {
							this.groupList = [];
							this.theDate.groupid = "";
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
						} else if(data.code == 1000 && data.content.length == 0) {
							this.typeList = [];
							this.theDate.equipmenttypeid = "";
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
						} else if(data.code == 1000 && data.content.length == 0) {
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
					'equipmentnameid'
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
			//获取商品列表
			getSellGoods: function() {
				if(!this.theDate.areaid) return;
				var sendMsg = {};
				for(var key in this.theDate) {
					if(this.theDate[key]) {
						sendMsg[key] = this.theDate[key];
					}
				}
				this.$ajax.post("sellManage/allSellGoods?pageNo=" + this.mescrollUp.page.num + "&pageSize=" + this.mescrollUp
						.page.size, sendMsg, {
							//				this.$ajax.post("sellManage/allSellGoods?pageNo=" + this.mescrollUp.page.num + "&pageSize=" + this.mescrollUp.page.size, {}, {
							timeout: 1000 * 20
						})
					.then((data) => {
						console.log(data);
						//						if(data.code == 1000 && data.content.length > 0) {
						if(data.code == 1000) {
							if(this.mescrollUp.page.num === 1) {
								this.dataList = []
							}
							// 把请求到的数据添加到列表
							this.dataList = this.dataList.concat(data.content)
							// 数据渲染成功后,隐藏下拉刷新的状态
							this.$nextTick(() => {
								this.mescroll.endSuccess(data.content.length)
							})
							//							this.pageNo++;
							console.log(this.dataList);
						}else {
							this.$parent.layerTimeout(data.msg);
							this.count = 0;
							this.mescroll.endErr();
							return false
						}

					}).catch((error) => {
						this.mescroll.endErr();
					})
			},
			getGoodsFun: function() {
				this.$parent.getBasicUrlFun(this.getSellGoods);
			},
			resetGoods: function() {
				this.drawer = false;
				this.mescroll.resetUpScroll();
			},
			gotoDetail(list) {
				this.$router.push({
					name: 'businessDetal',
					params: {
						listMsg: list
					}
				});
			},
			finishRefresh: function() {},
		},
		computed: {

		},
		watch: { //
			'theDate.gameid' (val, oldVal) {
				if(val || val == 0) {
					this.getAreaList();
					this.getGroupList();
					if(!oldVal) return;
					this.mescroll.resetUpScroll() // 刷新列表数据
				}

			},
			'theDate.areaid' (val, oldVal) {
				if(!oldVal) return;
				this.mescroll.resetUpScroll() // 刷新列表数据
			},
			//
			'theDate.groupid' (val, oldVal) {
				if(val || val == 0) {
					this.getTypeList();
					if(!oldVal) return;if(!oldVal) return;
					this.mescroll.resetUpScroll() // 刷新列表数据
				}
			},
			//
			'theDate.equipmenttypeid' (val, oldVal) {
				if(val || val == 0) {
					this.getNameList();
					this.getPropertyList();
					if(!oldVal) return;
					this.mescroll.resetUpScroll() // 刷新列表数据
				}
			},
			'theDate.equipmentnameid' (val) {
				if(val || val == 0) {
					this.getPropertyList();
					this.mescroll.resetUpScroll() // 刷新列表数据
				}
			},
		},
		beforeRouteEnter(to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
			next(vm => {
				// 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
				vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
			})
		},
		beforeRouteLeave(to, from, next) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
			// 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
			this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
			next()
		},
		created() {
			this.isFirstEnter = true;
		},
		activated() {
			if(this.$route.meta.needReload) {
				// this.$parent.getBasicUrlFun(this.getGameList);
				this.$route.meta.needReload = true;
			}
		},
		mounted() {
			// this.$parent.getBasicUrlFun(this.getGameList);
			this.$route.meta.needReload = true;
			console.log(this.propertyName);
		}
	}
</script>

<style>
	#home {
		height: 100%;
	}
	
	#home .banner {
		width: 100%;
		height: 6rem;
	}
	
	.mescroll {
		position: fixed;
		top: 0;
		bottom: 3rem;
		height: auto;
		/*如设置bottom:50px,则需height:auto才能生效*/
	}
	
	.mescroll-totop {
		bottom: 4rem
	}
	
	#home .top-select {
		width: 100%;
		overflow: hidden;
		/*font-size: 0.8rem;
		line-height: 40px;*/
		text-align: center;
	}
	
	#home .el-row .el-col {
		margin-bottom: 1px;
	}
	
	#home .el-row.top-select .el-col:last-child {
		padding-left: 0;
		line-height: 2rem;
	}
	
	#home .el-row.top-select .el-col:last-child span {
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
	
	.el-drawer.ltr,
	.el-drawer.rtl,
	.el-drawer__container {
		overflow: auto;
	}
	
	.search-list ul li {
		border-bottom: 1px solid #EFEFEF
	}
	
	.search-list ul li .el-card,
	.search-list ul li .el-card.is-always-shadow {
		border: none;
		box-shadow: none;
	}
	
	.search-list ul li .list-img {
		width: 5.2rem;
		height: 5.2rem
	}
	
	.search-list ul li .list-img img {
		width: 100%;
		height: 100%;
		border-radius: 10px
	}
	
	.search-list ul li .list-msg {
		height: 5.2rem;
		margin-left: 5.2rem;
		padding-left: .5rem;
	}
	
	.search-list ul li .list-msg .line-one {
		font-size: .7rem;
		line-height: .8rem;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		padding-top: .2rem;
		height: 1.8rem
	}
	
	.search-list ul li .list-msg .line-two,
	.search-list ul li .list-msg .line-three,
	.search-list ul li .list-msg .line-four {
		height: 0.8rem;
		font-size: .6rem;
		color: #929292;
		margin-top: 0.2rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis
	}
	
	.search-list ul li .list-msg .line-three {
		height: 0.8rem;
	}
	
	.search-list ul li .list-msg .line-three .text-danger {
		font-size: 0.65rem;
	}
	
	.search-list ul li .list-msg .line-three .list-sponsor {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-right: 0.2rem;
	}
	
	.search-list ul li .list-msg .line-three span.list-mumber {
		color: #929292;
		margin-left: 0.3rem;
	}
	
	.search-list ul li .list-msg .line-four {
		line-height: 1.5rem;
		height: 1.5rem;
		font-size: 0.7rem;
	}
	
	.search-list ul li .list-msg .line-four span.zan {
		width: 1.2rem;
		height: 1.2rem;
	}
	
	.search-list ul li .list-msg .line-four span:nth-child(2) {
		margin-left: 0.5rem;
		font-size: 0.9rem;
	}
	
	.search-list ul li .list-msg .line-four span.zan i {
		display: inline-block;
		width: 100%;
		height: 100%;
	}
	
	.search-list ul li .list-msg .line-four span.zan i.notSupport {
		background: url("../../static/img/notSupport.png") no-repeat;
		background-size: 100%;
	}
	
	.search-list ul li .list-msg .line-four span.zan i.isSupport {
		background: url("../../static/img/isSupport.png") no-repeat;
		background-size: 100%;
	}
	
	.list-icon {
		padding-right: .3rem
	}
	
	.el-drawer__body {
		padding: 0.8rem;
	}
</style>