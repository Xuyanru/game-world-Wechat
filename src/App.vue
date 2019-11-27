<template>
	<div id="App">
		<Tabs v-show="$route.meta.navShow"></Tabs>
		<div class="content">
			<keep-alive>
				<router-view></router-view>
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
			}
		},
		mounted() {

			// sessionStorage.setItem("openId", "o5Qtn566LlTjA5AHibqPG-I6p63w");

			//									sessionStorage.setItem("openId", "ooZz01Zpaifeq-hhvicr4eKl6-nc");
			//							15864789654

			//						sessionStorage.setItem("openId", "oELkj1QA4yeM6zS05I63LceBwDIQ");
			//							"13931021490"
			//
			//员工
			//			sessionStorage.setItem("openId", "ooZz01R3DuIQkAhf3SY5rwy-CvOw");

			//						sessionStorage.setItem("openId", "owO-_vhfW2GpWKB03CF0ReVr58Xw");
			//							15732139883
			//			sessionStorage.setItem("openId", "owO-_vv1lME25yNjI3i9IR8qKJkk");

			//															sessionStorage.setItem("openId", "owO-_vur-rxelvR-87KsbE0DQbV4");
			//									sessionStorage.setItem("openId", "E63B3DFC-4192-435F-B384-01656498262C");

			// sessionStorage.setItem("areacode", "6666");
			var me = this;
			axios.interceptors.request.use(function(config) {
				console.log(axios.defaults.baseURL);
				// Do something before request is sent
				//								 var time = new Date().getTime();
				//								 config.headers.time = time;
				// config.headers.token = md5(me.mid + me.code + time + "toB");
				return config;
			}, function(error) {
				me.layerErrorTimeout("请求超时");
				return Promise.reject(error);
			});

			// Add a response interceptor
			axios.interceptors.response.use(function(response) {
				// Do something with response data
				return response;
			}, function(error) {
				// Do something with response error
				if (error && error.response) {
					switch (error.response.status) {
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

//			this.getBasicUrlFun(me.getAllParam);
		},
		methods: {
			getBasicUrlFun: function(callBack) {
				var me = this;
				this.$ajax.defaults.baseURL = "";
				this.$ajax.get('./static/configData/config.json').then((response) => {
					me.$ajax.defaults.baseURL = response.data.theUrl;
					callBack();
				})
			},
			getBasicUrl: function() {
				this.$ajax.get('./static/configData/config.json').then((response) => {
					var data = response.data;
					return data.theUrl;
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
				var sTime = this.currTime.currYear + "-" + ((this.currTime.currMonth + 1) > 9 ? (this.currTime.currMonth + 1) : (
						"0" + (this.currTime.currMonth + 1))) + "-" + (this.currTime.currDay > 9 ? this.currTime.currDay : ("0" + this.currTime
						.currDay)) + " " + (this.currTime.currHour > 9 ? this.currTime.currHour : ("0" + this.currTime.currHour)) + ":" +
					(this.currTime.currMinute > 9 ? this.currTime.currMinute : ("0" + this.currTime.currMinute));
				return sTime;
			},
			//日期
			formetDate() {
				var theDate = this.currTime.currYear + "-" + ((this.currTime.currMonth + 1) > 9 ? (this.currTime.currMonth + 1) :
					("0" + (this.currTime.currMonth + 1))) + "-" + (this.currTime.currDay > 9 ? this.currTime.currDay : ("0" + this.currTime
					.currDay));
				return theDate;
			},

			//通过参数名称获取其值     paraName:参数的名称　　
			GetUrlParam: function(paraName) {
				var url = document.location.toString();
				var arrObj = url.split("?");
				if (arrObj.length > 1) {
					var arrPara = arrObj[1].split("&");
					var arr;
					for (var i = 0; i < arrPara.length; i++) {
						arr = arrPara[i].split("=");
						if (arr != null && arr[0] == paraName) {
							return arr[1];
						}
					}
					return "";
				} else {
					return "";
				}
			},

			//获取用户的openid
			getUserOpenId: function() {
				var me = this;
				var sendMsg = {
					code: me.theUserCode,
					areacode: "6666",
				}
				this.$ajax.post("wxmanager/getopenid", sendMsg, {
						timeout: 1000 * 5
					})
					.then(function(response) {
						console.log(response);
						if (response.status == 200) {
							var data = response.data;
							if (data.code == 0) {
								me.openId = data.openid;
								me.wxBasicMsg = data;
								if (me.isTuisong) {
									me.tuisongUrl = window.location.href
								}
								//								me.layerShow("正在加载");
								openId = me.openId;
								axios.defaults.headers.openId = openId;
								me.userMsg = data;
								sessionStorage.setItem("openId", me.openId);
								sessionStorage.setItem("userMsg", JSON.stringify(me.userMsg))
								me.getUserType();
							} else {
								me.layerShow("请求有误，请尝试重新进入该链接");
								return false
							}
						}
					})
			},

			//判断用户是否已经登录或注册过
			visitorSys: function() {
				//访客基本信息
				this.vBasicMsg = "";
				//访客基本信息
				this.theUrl = "wxuser/isLogin";
				var me = this;
				// alert(axios.defaults.headers.openId);
				this.$ajax.get("wxuser/isLogin", {
						timeout: 1000 * 5
					})
					.then(function(response) {
						console.log(response);
						if (response.status == 200) {
							var data = response.data;
							if (data.code == 1000) {
								me.vBasicMsg = data.content;
								if (data.content.areacode) {
									me.areacode = data.content.areacode;
									areacode = me.areacode;
									// axios.defaults.headers.areaCode = areacode;
									sessionStorage.setItem("areacode", me.areacode);
								}
								sessionStorage.setItem("vBasicMsg", JSON.stringify(me.vBasicMsg));
								thisurl = window.location.href;
								me.tuisongUrl = "";
								me.$router.push("/");
								sessionStorage.setItem("userType", me.userType);
							} else {
								if (data.code == 2000) {
									me.layerTimeout("请先补全信息再预约");
									me.$router.push("/Me");
								} else {
									me.layerShow()
								}
							}
						}
					});

				//				me.layerShow("正在加载")
			},

			//更新访客信息
			refreshMsg(theMsg) {
				var me = this;
				me.vBasicMsg = theMsg;
				if (theMsg.areacode) {
					me.areacode = theMsg.areacode;
					areacode = me.areacode;
					// axios.defaults.headers.areaCode = areacode;
					sessionStorage.setItem("areacode", me.areacode);
				}
				sessionStorage.setItem("vBasicMsg", JSON.stringify(me.vBasicMsg));
				thisurl = window.location.href;
				me.tuisongUrl = "";
				me.$router.push("/");
				sessionStorage.setItem("userType", me.userType);
			},

			/**判断用户是否登录过**/
			getUserType: function() {
				this.visitorSys()
			},

			//获取用户code等基本参数
			getAllParam: function() {
				if (sessionStorage.getItem("openId")) {
					if (sessionStorage.getItem("areacode") && sessionStorage.getItem("userType")) {
						this.areacode = sessionStorage.getItem("areacode");
						areacode = this.areacode;
						this.openId = sessionStorage.getItem("openId");
						openId = this.openId;
						axios.defaults.headers.openId = openId;
						// axios.defaults.headers.areaCode = areacode;
						this.syncid = sessionStorage.getItem("syncid");
						this.vBasicMsg = JSON.parse(sessionStorage.getItem("vBasicMsg"));
						this.userType = sessionStorage.getItem("userType");
						this.userMsg = JSON.parse(sessionStorage.getItem("userMsg"));
						if (sessionStorage.getItem("activeOpenId")) {
							this.activeOpenId = sessionStorage.getItem("activeOpenId")
						}
						if (this.$route.name == "examinationList") {
							this.$refs.theRouter.getList();
						}
					} else {
						this.openId = sessionStorage.getItem("openId");
						openId = this.openId;
						axios.defaults.headers.openId = openId;

						//删除
						// this.areacode = sessionStorage.getItem("areacode");
						// areacode = this.areacode;
						// axios.defaults.headers.areaCode = areacode;

						this.getMsgByUrl();
						this.getUserType()
					}
				} else {
					this.getMsgByUrl();
					this.getUserOpenId()
				}
			},

			//通过地址获取信息
			getMsgByUrl: function() {
				this.state = this.GetUrlParam("state");
				console.log(this.state);
				if (this.state) {
					this.theUserCode = this.GetUrlParam("code");
					var theLastIdx = this.state.lastIndexOf("#/");
					if (theLastIdx != -1) {
						var params = this.state.slice(0, theLastIdx).split("!")
					} else {
						var params = this.state.split("!")
					}
					thisurl = window.location.href;
					if (!this.theUserCode) {
						me.layerErrorTimeout("请求错误");
						return false
					}
					if (params[1] == 2) {
						this.isTuisong = true;
						if (params[2]) {
							this.syncid = params[2];
							sessionStorage.setItem("syncid", this.syncid)
						}
						if (params[3]) {
							this.activeOpenId = params[3];
							sessionStorage.setItem("activeOpenId", this.activeOpenId)
						}
					} else {
						this.isTuisong = false
					}
					console.log(this.userType)
				}
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
						if (callBack) {
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
			}

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
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		width: 100%;
		height: 100%;
	}

	.content {
		height: 100%;
		padding-bottom: 3rem;
		background: #E1E8FB;
	}
</style>
