<template>
	<div id="myBusiness">
		<!--售卖商品列表-->
		<div id="infiniteList2" class="infinite-list-wrapper search-list" style="overflow:auto">
			<ul class="list" v-infinite-scroll="getSellGoods" infinite-scroll-disabled="disabled">
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
				<!--<li v-for="i in count" class="list-item">{{ i }}</li>-->
			</ul>
			<p v-if="loading" align="center">加载中...</p>
			<p v-if="noMore" align="center">没有更多了</p>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'myBusiness',
		data() {
			return {

				pageNo: 1,
				pageSize: 10,
				dataList: [], //商品列表
				count: 0, //记录总条数
				loading: false,
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
			showedit: function(idx) {
				var theList = this.dataList[idx];
				console.log(theList);
				console.log(theList.showOperation);
				theList.showOperation = !(theList.showOperation);
				console.log(theList.showOperation);
			},
			//获取商品列表
			getSellGoods: function() {
				if(this.loading) {
					return
				}
				this.loading = true;
				this.$ajax.post("sellManage/mySellGoods?pageNo=" + this.pageNo + "&pageSize=" + this.pageSize, {}, {
						timeout: 1000 * 15
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content.length > 0) {
							this.count = data.count;
							for(var i = 0; i < data.content.length; i++) {
								data.content[i].showOperation = false;
							}
							if(this.pageNo == 1) {
								this.dataList = data.content;
							} else {
								this.dataList = this.dataList.concat(data.content);
							}
							this.pageNo++;
							this.loading = false;
							console.log(this.dataList);
						} else if(data.code == 1000 && data.content == 0) {
							this.count = data.count;
						} else {
							this.$parent.layerTimeout(data.msg);
							this.count = 0;
							return false
						}
					})
			},
			initGetGoods: function() {
				this.pageNo = 1;
				this.getSellGoods();
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
								listDetail.showOperation = false;
							}
						} else {
							this.$parent.layerTimeout(data.cause);
							this.count = 0;
							return false
						}
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
		computed: {
			noMore() {
				return this.dataList.length >= this.count;
			},
			disabled() {
				return this.loading || this.noMore
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				//				if(from.path === "xxx") {
				document.getElementById('infiniteList2').scrollTop = to.meta.scollTopPosition;
				//				}
			});
		},
		beforeRouteLeave(to, from, next) {
			from.meta.scollTopPosition = document.getElementById("infiniteList2").scrollTop;
			next()
		},
		created() {
			this.isFirstEnter = true;
		},
		activated() {
			this.$parent.getBasicUrlFun(this.initGetGoods);
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
	
	.search-list ul li {
		padding: .5rem;
		border-bottom: 1px solid #999
	}
	
	.search-list ul li .list-img {
		width: 5.25rem;
		height: 5.25rem
	}
	
	.search-list ul li .list-img img {
		width: 100%;
		height: 100%;
		border-radius: 10px
	}
	
	.search-list ul li .list-msg {
		height: 5.25rem;
		margin-left: 5.25rem;
		padding-left: .5rem;
	}
	
	.search-list ul li .list-msg .line-one {
		font-size: .8rem;
		line-height: 1rem;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		padding-top: .2rem;
		height: 1.5rem
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