<template>
	<div id="myBusiness">
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
			}
		},
		methods: {
			//获取商品列表
			getSellGoods: function() {
				if (this.loading) {
					return
				}
				this.loading = true;
				//				this.$ajax.post("sellManage/allSellGoods?pageNo=" + this.pageNo + "&pageSize=" + this.pageSize, this.theDate, {
				this.$ajax.post("sellManage/mySellGoods?pageNo=" + this.pageNo + "&pageSize=" + this.pageSize, {}, {
						timeout: 1000 * 15
					})
					.then((data) => {
						console.log(data);
						if (data.code == 1000 && data.content.length > 0) {
							this.count = data.count;
							if (this.pageNo == 1) {
								this.dataList = data.content;
							} else {
								this.dataList = this.dataList.concat(data.content);
							}
							this.pageNo++;
							this.loading = false;
							console.log(this.dataList);
						} else if (data.code == 1000 && data.content == 0) {
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
		beforeRouteLeave(to, from, next) {

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
