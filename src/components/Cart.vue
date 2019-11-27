<template>
	<div id="Cart">
		<!--<div class="subItem clear">
			<p class="lf" @click="getList(0)" :class="{'active':selType==0}">当前排号</p>
			<p class="lf" @click="getList(1)" :class="{'active':selType==1}">排号记录</p>
		</div>-->
		<div id='listMsgCon'>
			<!--<v-scroll :on-refresh="onRefresh" :on-infinite="onInfinite" ref="theScroll">-->
			<div>
				<ul>
					<li class="text-center" v-for="list in listCon" @click="gotoDetail(list)">
						<div>
							<span class="text-name">{{list.qname}}</span>
							<span class="text-date">排号日期:{{list.qdate}}</span>
						</div>
						<span class="right-icon rt"></span>
					</li>
				</ul>
			</div>
			<!--</v-scroll>-->
			<p class="text-center">{{listWarn}}</p>
		</div>
		<div class="dialog" v-show="isShowCode" @click="isShowCode=false">
			<div id="" class="absolute-center">
				<div id="QRcode"></div>
				<p class="text-center">{{theCode}}</p>
			</div>
		</div>
	</div>
</template>

<script>
	import Scroll from './public/scroll';
	import QRCode from "qrcodejs2";
	export default {
		name: 'Cart',
		components: {
			'v-scroll': Scroll
		},
		data() {
			return {
				counter: 1, //默认已经显示出15条数据 count等于一是让从16条开始加载
				num: 10, // 一次显示多少条
				pageStart: 0, // 开始页数
				pageEnd: 0, // 结束页数
				listCon: [], // 下拉更新数据存放数组
				canScroll: false, //是否可以上啦记载更多
				noListWarn: false, //是否显示无列表图片
				selType: 0,
				isShowCode: false,
				theCode: "",
				listWarn:"",
				sendMsg: {
					//查询状态0:全部, 1:待审批,2:已通过,3:未通过
					"status": 0,
					//当前页码
					"pageNo": 1,
					//每页显示的个数
					"pageSize": 10
				}
			}
		},
		methods: {
			getList(idx) {
				this.selType = idx;
				var me = this;
				this.$ajax.get("wxqueue/findOrderByOpenid/" + this.$parent.openId, {
					timeout: 1000 * 10
				}).then(function(response) {
					if(response.status == 200) {
						var data = response.data;
						console.log(data);
						if(data.code == 1000 && data.content.length > 0) {
							me.listCon = data.content;
							console.log(me.listCon);
//							me.noListWarn = false;
							if(data.content.length==10){
								me.listWarn="仅显示最近10条预约信息";
							}else{
								me.listWarn="";
							}
							
							layer.closeAll();
						} else {
							if(data.code == 1000 && data.content.length == 0) {
								me.listCon = [];
								me.canScroll = false;
//								me.noListWarn = true;
								me.listWarn="无预约信息";
								layer.closeAll();
							} else {
								me.listCon = [];
								me.$parent.layerTimeout(data.msg)
							}
						}
					}
				});
			},
			onRefresh(done) {
				this.listCon = [];
				this.canScroll = true;
				//				this.$refs.theScroll.showLoaderMore = false;
				this.$refs.theScroll.loaderMoreMsg = "";
				this.sendMsg.pageNo = 1;
				//				this.getList();
				done() // call done

			},
			onInfinite(done) {
				if(!this.canScroll) {
					return
				}
				//				me.listCon = [];
				this.canScroll = false;
				//				this.$refs.theScroll.showLoaderMore = true;
				this.$refs.theScroll.loaderMoreMsg = "正在加载";
				this.$parent.getBasicUrlFun(this.getList);
				this.getList();
				done();
			},
			createCode(code) {
				console.log($("#QRcode").width());
				$("#QRcode").html("");
				new QRCode("QRcode", {
					text: code,
					width: $("#QRcode").width(),
					height: $("#QRcode").width(),
					colorDark: "#000000",
					colorLight: "#ffffff",
					correctLevel: QRCode.CorrectLevel.H
				});
				this.theCode = code;
				this.isShowCode = true;
			},
			createCodeFun(code) {
				this.$nextTick(function() {
					this.createCode(code);
				})
			},
			showCode() {
				this.createCodeFun("123456");
			},
			gotoDetail(list) {
				this.$router.push({
					name: 'cartDetail',
					params: {
						did: list
					}
				});
			},
		},

		beforeRouteLeave(to, from, next) {

			next()
		},
		created() {
			this.isFirstEnter = true;
		},
		activated() {
			this.$parent.getBasicUrlFun(this.getList);
		}
	}
</script>

<style>
	#Cart {
		height: 100%;
		overflow-y: auto;
	}
	
	/*#Cart .subItem {
		width: 100%;
	}
	
	#Cart .subItem p {
		width: 50%;
		line-height: 2.5rem;
		font-size: 0.8rem;
		text-align: center;
		color: #FFFFFF;
		background: #387EF7;
	}
	
	#Cart .subItem p.active {
		background: #306BD1;
	}*/
	
	#listMsgCon {
		width: 100%;
		height:100%;
		overflow-y: auto;
	}
	
	#listMsgCon ul {
		padding: 0.1rem 0.4rem;
	}
	
	#listMsgCon ul li {
		height: 3rem;
		line-height: 3rem;
		/*padding: 0.5rem 0;*/
		margin: 0.3rem 0;
		background: #FFFFFF;
		position: relative;
	}
	/*#listMsgCon ul li div {
		padding-bottom: 0.3rem;
		border-bottom: 1px solid #959595
	}*/
	
	#listMsgCon ul li .text-name {
		font-size: 0.8rem;
		margin-right: 3rem;
	}
	
	#listMsgCon ul li .text-date {
		font-size: 0.6rem;
		color: #777777;
	}
	
	#listMsgCon ul li .right-icon {
		position: absolute;
		top: 50%;
		right: 0.2rem;
		transform: translateY(-50%);
		width: 1.5rem;
		height: 1.5rem;
	}
	
	#listMsgCon ul li .btn {
		width: 50%;
		margin: 0.5rem auto 0;
	}
	
	.dialog {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		color: #FFFFFF;
		font-size: 1rem;
	}
	
	#QRcode {
		width: 10rem;
		height: 10rem;
		padding: 0.7rem;
		background: #FFFFFF;
		border-radius: 10px;
	}
</style>