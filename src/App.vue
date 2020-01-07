<template>
	<div id="App">
		<Tabs v-show="$route.meta.navShow"></Tabs>
		<div class="content" :class="{'hasTab':$route.meta.navShow}">
			<keep-alive>
				<router-view ref="child"></router-view>
			</keep-alive>
		</div>
	</div>
</template>
<script>
	import Tabs from "./components/Tabs.vue";
	import Vue from 'vue';
	import axios from 'axios';
	import inputscroll from "./components/public/inputScroll";
	Vue.prototype.$ajax = axios;
	// var aiUrl = theUrl;
	//	var aiUrl = "http://qlhx.natapp4.cc/PDAICloud/";
	var areacode = "";
	var openId = "";
	var thisurl = "";

	export default {
		name: 'App',
		components: {
			Tabs
		},
		data() {
			return {
				transitionName: '',
				theUserCode: "", //用户code
				areacode: "6666", //区域参数
				userType: null, //用户性质 0:员工、1:访客、2:推送页面
				openId: "", //用户openId;
				syncid: "", //数据标识
				vBasicMsg: "", //用户基本信息
				userMsg: "", //微信用户信息
				checkIsLogIn: false, //检测用户登录情况
				thisurl: window.location.href,
				isTuisong: false, //判断是否是推送页面
				tuisongUrl: "", //推送页面地址,
				currTime: {}, //时间
				baseURL: "", //请求地址
			}
		},
		mounted() {
			var me = this;
			axios.interceptors.request.use(function(config) {
				console.log(config);
				if(config.url.search("wxChat/getUser") == -1 && config.url.search("./static/configData/config.json") == -1) {
					var guid = "";
					if(me.vBasicMsg) {
						guid = me.vBasicMsg.guid;
					} else if(sessionStorage.getItem("vBasicMsg")) {
						guid = JSON.parse(sessionStorage.getItem("vBasicMsg")).guid;
					} else {
						me.layerShow("请求有误，请尝试重新进入该链接");
					}
					config.headers.userGuid = guid;
					// config.headers.userGuid = "111111";
				}
				
				if(config.url.search("./static/configData/config.json") != -1){
					config.baseURL="";
				}
				return config;
			}, function(error) {
				me.layerErrorTimeout("请求超时");
				return Promise.reject(error);
			});

			// Add a response interceptor
			axios.interceptors.response.use(function(response) {
				// Do something with response data
				if(response.status == 200) {
					return response.data;
				} else {
					me.layerErrorTimeout("请求错误");
				}
				// return response;
			}, function(error) {
				// Do something with response error
				if(error && error.response) {
					switch(error.response.status) {
						case 400:
							me.layerErrorTimeout("请求错误");
							break;
						case 401:
							me.layerErrorTimeout("未授权，请重新登录");
							break;
						case 403:
							me.layerErrorTimeout("拒绝访问");
							break;
						case 404:
							me.layerErrorTimeout("请求出错");
							break;
						case 408:
							me.layerErrorTimeout("请求超时");
							break;
						case 500:
							me.layerErrorTimeout("服务器错误");
							break;
						case 501:
							me.layerErrorTimeout("服务未实现");
							break;
						case 502:
							me.layerErrorTimeout("网络错误");
							break;
						case 503:
							me.layerErrorTimeout("服务不可用");
							break;
						case 504:
							me.layerErrorTimeout("网络超时");
							break;
						case 505:
							me.layerErrorTimeout("HTTP版本不受支持");
							break;
						default:
							me.layerErrorTimeout("连接出错");
					}
				} else {
					me.layerErrorTimeout("连接服务器失败");
				}
				return Promise.reject(error);
			});

			$("body").on("blur", "input", function() {
				setTimeout(function() {
					window.scrollTo(0, document.body.scrollTop + 1);
					document.body.scrollTop >= 1 && window.scrollTo(0, document.body.scrollTop - 1);
				}, 10);
			});
//
			var theBasicMsg = {
				"guid": "ff6f9086-ef08-4dcf-b101-65a237039386",
				"phone": "15830733627",
				"headerimg": "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLSrpu0ZJm6p6c8n0ajPA56UgqYIcIworawMwmMtoFQKkHlZVB6nQt0hupUMmO88ReoSibtJEfdhBQ/132",
				"photo": null,
				"pid": "1dasda",
				"qq": "1564564564",
				"wechat": "dsds",
				"gameid": 1,
				"areaid": 1,
				"sex": 2,
				"city": "邯郸",
				"province": "河北",
				"country": "中国",
				"nickname": "汝",
				"remark": null,
				"level": 1,
				"score": 0,
				"onlinetime": "每天",
				"motto": "vfdvfdvd",
				"mottocheck": 1,
				"pidcheck": 0,
				"qqcheck": 0,
				"wechatcheck": 0,
				"phonecheck": 0,
				"usernum": 12270207,
				"admin": 0,
				"email": null
			}
			sessionStorage.setItem("vBasicMsg", JSON.stringify(theBasicMsg));
			this.getBasicUrlFun(this.$refs.child.getGameList);

			this.getBasicUrlFun();

			this.getBasicUrlFun(this.getAllParam);
		},
		methods: {
			getBasicUrlFun: function(callBack) {
				var me = this;
				this.$ajax.get('./static/configData/config.json').then((response) => {
					if(response.data) {
						me.$ajax.defaults.baseURL = response.data.theUrl;
					} else {
						me.$ajax.defaults.baseURL = response.theUrl;
					}
					me.baseURL = me.$ajax.defaults.baseURL;
					if(callBack) {
						callBack();
					}
				})
			},
			//获取用户信息
			getUserInfo: function() {
				this.$ajax.post('user/userInfo', {}).then((data) => {
					console.log(data);
					if(data.code == 1000 && data.content) {
						this.vBasicMsg = data.content;
						sessionStorage.setItem("vBasicMsg", JSON.stringify(data.content));
					} else if(data.code == 1000 && data.content) {
						this.layerErrorTimeout("未获取到用户信息");
					} else {
						this.$parent.layerTimeout(data.msg);
						return false
					}
				})
			},
			//获取现在时间
			getNow: function() {
				var currTimes = new Date();
				this.currTime.currTime = currTimes;
				this.currTime.currYear = currTimes.getFullYear();
				this.currTime.currMonth = currTimes.getMonth();
				this.currTime.currDay = currTimes.getDate();
				this.currTime.currHour = currTimes.getHours();
				this.currTime.currMinute = currTimes.getMinutes();
			},

			//格式化开始时间
			formetStart: function(idx) {
				var sTime = this.currTime.currYear + "-" + ((this.currTime.currMonth + 1) > 9 ? (this.currTime.currMonth + 1) :
						(
							"0" + (this.currTime.currMonth + 1))) + "-" + (this.currTime.currDay > 9 ? this.currTime.currDay : ("0" +
						this.currTime
						.currDay)) + " " + (this.currTime.currHour > 9 ? this.currTime.currHour : ("0" + this.currTime.currHour)) +
					":" +
					(this.currTime.currMinute > 9 ? this.currTime.currMinute : ("0" + this.currTime.currMinute));
				return sTime;
			},
			//日期
			formetDate() {
				var theDate = this.currTime.currYear + "-" + ((this.currTime.currMonth + 1) > 9 ? (this.currTime.currMonth + 1) :
					("0" + (this.currTime.currMonth + 1))) + "-" + (this.currTime.currDay > 9 ? this.currTime.currDay : ("0" +
					this.currTime
					.currDay));
				return theDate;
			},

			//通过参数名称获取其值     paraName:参数的名称　　
			GetUrlParam: function(paraName) {
				var url = document.location.toString();
				var arrObj = url.split("?");
				if(arrObj.length > 1) {
					var arrPara = arrObj[1].split("&");
					var arr;
					for(var i = 0; i < arrPara.length; i++) {
						arr = arrPara[i].split("=");
						if(arr != null && arr[0] == paraName) {
							return arr[1];
						}
					}
					return "";
				} else {
					return "";
				}
			},

			//获取用户的信息
			getMsgByCode: function() {
				var me = this;
				var code = this.theUserCode ? this.theUserCode : sessionStorage.getItem("code");
				if(!code) return;
				this.$ajax.get("wxChat/getUser?code=" + code, {
						timeout: 1000 * 5
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content) {
							me.vBasicMsg = data.content;
							sessionStorage.setItem("vBasicMsg", JSON.stringify(data.content));
							if(me.$route.name == "Home") {
								me.getBasicUrlFun(me.$refs.child.getGameList);
								me.getBasicUrlFun(me.getNotify);
							}
						} else {
							me.layerShow("请求有误，请尝试重新进入该链接");
							return false
						}
					})
			},
			//获取用户code等基本参数
			getAllParam: function() {
				if(!sessionStorage.getItem("vBasicMsg")) {
					this.getMsgByUrl();
					this.getBasicUrlFun(this.getMsgByCode);
				}
			},
			//更新访客信息
			refreshMsg(theMsg) {
				var me = this;
				me.vBasicMsg = theMsg;
				sessionStorage.setItem("vBasicMsg", JSON.stringify(me.vBasicMsg));
			},

			//通过地址获取信息
			getMsgByUrl: function() {
				if(this.GetUrlParam("code")) {
					this.theUserCode = this.GetUrlParam("code");
					sessionStorage.setItem("code", this.theUserCode);
				} else {
					this.layerShow("请求有误，请尝试重新进入该链接");
				}
			},
			//获取公告信息
			getNotify: function() {
				this.$ajax.get("notify/home", {
						timeout: 1000 * 20
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content) {
							var theCon=data.content;
							layer.open({
								title: theCon.title,
								content: "<p>"+theCon.content+"</p><p style='text-align:right'>"+theCon.createdate+"</p>",
								btn: ['确定'],
							});
						}
					})
			},
			//改变用户基本信息
			changeBasicMsg(sendMsg) {
				this.vBasicMsg = sendMsg;
			},
			layerTimeout(msg, callBack) {
				layer.open({
					content: msg,
					time: 2,
					end: function() {
						if(callBack) {
							callBack();
						}
					}
				});
			},

			layerErrorTimeout(msg) {
				layer.open({
					//					title: ["请求异常", 'background:red;'],
					content: msg,
					time: 2
				});
			},

			layerShow(msg) {
				layer.open({
					content: msg,
					shadeClose: false
				});
			},
			//文本框blur后页面回到顶部
			scrollToTop() {
				setTimeout(function() {
					window.scrollTo(0, document.body.scrollTop + 1);
					document.body.scrollTop >= 1 && window.scrollTo(0, document.body.scrollTop - 1);
				}, 10);
			},

		},
		// 监听路由跳转
		watch: {
			$route: {
				handler: function(to, from) {
					console.log("watch");
					console.log(to.name);
					console.log(this.$route);
					var me = this;
					// 如果to索引大于from索引,判断为前进状态,反之
					// if (to.meta.index > from.meta.index) {
					//   this.transitionName = 'slide-left';
					// } else if (to.meta.index < from.meta.index) {
					//   this.transitionName = 'slide-right';
					// } else {
					//   this.transitionName = '';
					// }
				},
				// 深度观察监听
				deep: true
			}
		},
	}
</script>
<style>
	#App {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		/*-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;*/
		width: 100%;
		height: 100%;
	}
	
	.content {
		position: static;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
		padding-bottom: 0;
		background: #EFEFEF;
		overflow-y: hidden;
		overflow-x: hidden;
		-webkit-overflow-scrolling: touch;
	}
	
	.content.hasTab {
		padding-bottom: 3rem;
	}
	
	.content>div#Cart {
		height: 100%;
	}
</style>