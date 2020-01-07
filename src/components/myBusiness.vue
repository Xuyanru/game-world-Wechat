<template>
	<div id="myBusiness">
		<!--售卖商品列表-->
		<mescroll-vue ref="mescroll" id="mescroll1" class="search-list" :up="mescrollUp" @init="mescrollInit">
			<ul id="dataList1" class="list">
				<li class="clear" @click="gotoDetail(item)" v-for="(item,index) in dataList">
					<el-card>
						<div class="lf list-img">
							<img :src="$parent.baseURL+item.smallimg" alt="" />

						</div>
						<div class="list-msg">
							<p class="line-one">
								<span>
									{{item.title}}
								</span>
								<!--<img class="rt" src="../../static/img/edit.png" alt="" @click.stop="showedit(index)" />-->
								<img class="rt" src="../../static/img/edit.png" alt="" @click.stop="item.showOperation=!item.showOperation" />
							</p>
							<p class="line-two">
								<span class="list-icon" v-for="(val, key, index) in item" v-if='propertyName[key]&&val'>
									{{key!="sex"?propertyName[key]+val:propertyName[key]+(val==0?"女":"男")}}
								</span>
							</p>
							<p class="line-three clear">
								<span class="list-icon">状态:{{item.status}}</span>
								<span class="list-icon">
									赞{{item.support }}
								</span>
								<span class="list-icon">
									刷新{{item.refreshcount}}
								</span>
								<span class="rt">{{item.refreshdate}}</span>
							</p>
							<p class="line-four clear text-danger">
							</p>
						</div>
						<div class="operation clear" v-if="item.showOperation">
							<!--1 上架 2 下架 3交易成功 4删除 5刷新-->
							<span class="lf" :class="{'disabled':item.status=='刷新'}" @click.stop="changeStatus(5,index,item)">
								刷新
							</span>
							<span class="lf" :class="{'disabled':item.status=='上架'}" @click.stop="changeStatus(1,index,item)">
								上架
							</span>
							<span class="lf" :class="{'disabled':item.status=='下架'}" @click.stop="changeStatus(2,index,item)">
								下架
							</span>
							<span class="lf" :class="{'disabled':item.status=='交易成功'}" @click.stop="changeStatus(3,index,item)">
								交易成功
							</span>
							<span class="lf" :class="{'disabled':item.status=='删除'}" @click.stop="changeStatus(4,index,item)">
								删除
							</span>
						</div>
					</el-card>
				</li>
			</ul>
		</mescroll-vue>
	</div>
</template>

<script>
	import MescrollVue from 'mescroll.js/mescroll.vue'
	export default {
		name: 'myBusiness',
		components: {
			MescrollVue
		},
		data() {
			return {
				mescroll: null, // mescroll实例对象
				mescrollUp: {
					callback: this.getGoodsFun, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量
					},
					noMoreSize: 3, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
					toTop: {
						duration: 100, // 回到顶部的动画时长,默认300ms
						src: './static/mescroll/mescroll-totop.png' // 回到顶部按钮的图片路径,支持网络图
					},
					empty: {
						// 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才生效;
						warpId: 'dataList1', // 父布局的id;
						icon: './static/mescroll/mescroll-empty.png', // 图标,支持网络图
						tip: '暂无相关数据~', // 提示
						// btntext: '去逛逛 >', // 按钮,默认""
						// btnClick() { // 点击按钮的回调,默认null
						// 	alert('点击了按钮,具体逻辑自行实现')
						// }
					},
					lazyLoad: {
						use: true // 是否开启懒加载,默认false
					}
				},
				pageNo: 1,
				pageSize: 10,
				dataList: [], //商品列表
				count: 0, //记录总条数
				//1 上架 2 下架 3交易成功 4删除 5刷新
				statusMsg: {
					"0": "审核",
					"1": "上架",
					"2": "下架",
					"3": "交易成功",
					"4": "删除",
					"5": "刷新"
				}
			}
		},
		methods: {
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			showedit: function(idx) {
				var theList = this.dataList[idx];
				console.log(theList);
				console.log(theList.showOperation);
				theList.showOperation = !(theList.showOperation);
				console.log(theList.showOperation);
			},
			//获取商品列表
			getSellGoods: function() {
				this.$ajax.post("sellManage/mySellGoods?pageNo=" + this.mescrollUp.page.num + "&pageSize=" + this.mescrollUp.page.size, {}, {
						timeout: 1000 * 15
					})
					.then((data) => {
						console.log(data);
						//						if(data.code == 1000 && data.content.length > 0) {
						if(data.code == 1000) {
							for(var i = 0; i < data.content.length; i++) {
								data.content[i].showOperation = false;
							}
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
						}
						//						else if(data.code == 1000 && data.content == 0) {
						//							this.count = data.count;
						//						}
						else {
							this.mescroll.endErr();
							this.$parent.layerTimeout(data.msg);
							this.count = 0;
							return false
						}

					}).catch((error) => {
						this.mescroll.endErr();
					})
			},
			getGoodsFun: function() {
				this.$parent.getBasicUrlFun(this.getSellGoods);
			},
			//改变商品状态
			changeStatus: function(idx, theIdx, listDetail) {
				if(idx == listDetail.status) return;
				var me = this;
				if(idx == 4) {
					layer.open({
						content: '是否确定删除？',
						btn: ['确定', '取消'],
						yes: function(index, layero) {
							//按钮【按钮一】的回调
							alert("111");
							me.changeStatusFun(idx, theIdx, listDetail);
							layer.closeAll();
						},
						btn1: function(index, layero) {
							//按钮【按钮二】的回调
							alert("222");
							layer.closeAll();

							//return false 开启该代码可禁止点击该按钮关闭
						}
					});
				} else {
					this.changeStatusFun(idx, theIdx, listDetail);
				}
			},
			//改变商品状态
			changeStatusFun: function(idx, theIdx, listDetail) {
				this.$ajax.get("sellManage/goodsOperate?equipmentGuid=" + listDetail.guid + "&status=" + idx, {
						timeout: 1000 * 15
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000) {
							if(idx == 4) {
								this.dataList.splice(theIdx, 1);
							} else {
								var theStatusMsg = this.statusMsg[idx];
								listDetail.status = theStatusMsg;
                listDetail.refreshdate="1秒前";
								listDetail.showOperation = false;
							}
						} else {
							this.count = 0;
							return false
						}
            this.$parent.layerTimeout(data.msg);
					})
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
			//			this.$parent.getBasicUrlFun(this.initGetGoods);
			this.$route.meta.needReload = true;
		},
		mounted() {
			// this.$parent.getBasicUrlFun(this.initGetGoods);
			this.$route.meta.needReload = true;
			console.log(this.propertyName);
		}
	}
</script>

<style scoped="scoped">
	#myBusiness {}

	.mescroll {
		position: fixed;
		top: 0;
		bottom: 0;
		height: auto;
		/*如设置bottom:50px,则需height:auto才能生效*/
	}

	.mescroll-totop{
		bottom:2rem
	}

	#myBusiness .top-select {
		/*font-size: 0.8rem;
		line-height: 40px;*/
		text-align: center;
	}

	#myBusiness .el-row .el-col {
		margin-bottom: 1px;
	}

	.el-drawer.ltr,
	.el-drawer.rtl,
	.el-drawer__container {
		overflow: auto;
	}

	.search-list ul li .el-card,
	.search-list ul li  .el-card.is-always-shadow{
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

	.search-list ul li .list-msg .line-one span {
		width: 80%;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.search-list ul li .list-msg .line-one img {
		width: 1.5rem;
		margin-top: -0.3rem;
	}

	.search-list ul li .list-msg .line-two,
	.search-list ul li .list-msg .line-three,
	.search-list ul li .list-msg .line-four {
		margin-top: 0.2rem;
		font-size: .7rem;
		color: #929292;
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

	.search-list ul li .list-msg .line-three span.list-mumber {
		color: #929292;
		margin-left: 0;
		width: 4.5rem;
	}

	.search-list ul li .list-msg .line-four {
		line-height: 1.5rem;
		margin-top: 0.3rem
	}

	.list-icon {
		padding-right: .3rem
	}

	.el-drawer__body {
		padding: 0.8rem;
	}

	.search-list ul li .operation {
		margin-top: 0.4rem;
	}

	.search-list ul li .operation span {
		width: 20%;
		line-height: 1rem;
		text-align: center;
		color: #438fef;
	}

	.search-list ul li .operation span.disabled {
		color: #9e9e9e;
	}
</style>
