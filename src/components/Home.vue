<template>
	<div id="home">
		<el-row >
			<el-col :span="7">
				<div class="grid-content bg-purple"></div>
			</el-col>
			<el-col :span="7">
				<div class="grid-content bg-purple"></div>
			</el-col>
			<el-col :span="7">
				<div class="grid-content bg-purple"></div>
			</el-col>
			<el-col :span="3">
				<div class="grid-content bg-purple"></div>
			</el-col>
		</el-row>
		<div>
			<ul>
				<li class="text-center bg-white" v-for="list in dataList" @click="gotoOrder(list)">
					<div>
						<span class="text-name">{{list.qname}}</span>
						<span class="text-date">剩余数量:{{list.qLeft}}</span>
					</div>
					<span class="right-icon rt"></span>
				</li>
			</ul>

			<p class="text-center" v-if="noListWarn">{{nolistMsg}}</p>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Home',
		data() {
			return {
				dataList: [],
				noListWarn: false,
				nolistMsg: "",
			}
		},
		methods: {
			getCount() {
				console.log(this.startDate);
				var me = this;
				this.$ajax.get("wxqueue/findALLQueueBoByDate/" + this.startDate, {
						timeout: 1000 * 5
					})
					.then(function(response) {
						console.log(response);
						if(response.status == 200) {
							var data = response.data;
							if(data.code == 1000 && data.content) {
								if(data.content.total > 0 && data.content.left > 0) {
									me.noListWarn = false;
									me.$parent.getBasicUrlFun(me.getList);
									me.nolistMsg = "";
								} else if(data.content.total > 0 && data.content.left <= 0) {
									me.dataList = [];
									me.noListWarn = true;
									me.nolistMsg = "该日期已预约满，请选择其他日期";
								} else if(data.content.total <= 0) {
									me.dataList = [];
									me.noListWarn = true;
									me.nolistMsg = "该日期不可预约";
								}
							} else if(data.code == 1000 && !data.content) {
								me.dataList = [];
								me.noListWarn = true;
								me.nolistMsg = "无预约信息";
							} else {
								me.$parent.layerTimeout(data.msg);
								return false
							}
						}
					})
			},
			getList() {
				console.log(this.startDate);
				var me = this;
				this.$ajax.get("wxqueue/findQueueBoByDate/" + this.startDate, {
						timeout: 1000 * 5
					})
					.then(function(response) {
						console.log(response);
						if(response.status == 200) {
							var data = response.data;
							if(data.code == 1000 && data.content) {
								me.dataList = data.content;
								me.noListWarn = false;
							} else if(data.code == 1000 && !data.content) {
								me.dataList = [];
								me.noListWarn = true;
							} else {
								me.$parent.layerTimeout(data.msg);
								return false
							}
						}
					})
			},
			gotoOrder(listMsg) {
				if(listMsg.qLeft == 0) {
					this.$parent.layerTimeout("该日期当前业务已预约满");
					return false;
				} else {
					this.$parent.getNow();
					var currHour = this.$parent.currTime.currHour;
					var currMinute = this.$parent.currTime.currMinute;
					if((this.startDate == this.$parent.formetDate()) && currHour >= 18) {
						this.$parent.layerTimeout("当天已不可预约");
						return false;
					}
				}
				this.$router.push({
					name: 'businessDetal',
					params: {
						dateTime: this.startDate,
						listMsg: listMsg
					}
				});
			}
		},
		beforeRouteLeave(to, from, next) {

			next()
		},
		created() {
			this.isFirstEnter = true;
		},
		activated() {
			if(this.$route.meta.needReload) {
				this.$parent.getBasicUrlFun(this.getCount);
				// this.getCount();
			}
		},
		mounted() {
			// this.getCount();
			this.$parent.getBasicUrlFun(this.getCount);
			this.$route.meta.needReload = true;
			//			this.getList();
		}
	}
</script>

<style>
	#home ul li {
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
</style>