<template>
	<div id="businessDetal">
		<div class="banner">
			<img src="../../static/img/banner1.png" alt="" />
		</div>
		<div class="listMsg">
			<p>业务名称：{{listMsg.qname}}</p>
			<p>已&nbsp;预&nbsp;约：{{listMsg.dcount}}</p>
			<p>剩余数量：{{listMsg.qLeft}}</p>
			<p>选择预约时间段：</p>
			<div class="clear text-center inputOut">
				<input id="reservation-STimes" class="lf" v-model="sTimes" type="" name="" value="" />
				<span>&minus;</span>
				<input id="reservation-ETime" class="rt" v-model="eTime" type="" name="" value="" />
			</div>
		</div>
		<div class="btn" @click="submitOrder">
			立即预约
		</div>
	</div>
</template>

<script>
	export default {
		name: 'businessDetal',
		data() {
			return {
				startDate: "",
				theCount: 0,
				selet: "",
				qCode: "",
				listMsg: "",
				theDate: "",
				sTimes: "",
				eTime: ""
			}
		},
		methods: {
			init() {

			},
			initTime(theDate) {
				this.$parent.getNow();
				var me = this;
				var currYear = me.$parent.currTime.currYear;
				var currMonth = me.$parent.currTime.currMonth;
				var currDay = me.$parent.currTime.currDay;
				var currHour = me.$parent.currTime.currHour;
				var currMinute = me.$parent.currTime.currMinute;
				if(theDate != this.$parent.formetDate()) {
					currYear = theDate.split("-")[0];
					currMonth = theDate.split("-")[1];
					currDay = theDate.split("-")[2];
					currHour = 8;
					currMinute = 0;
				}
				var endOption = {
					theme: "mobiscroll",
					mode: "scroller",
					display: "bottom",
					//					buttons: [],
					timeFormat: 'HH:ii',
					timeWheels: 'HHii',
					lang: "zh",
					showNow: true,
					steps: {
						minute: 10,
						zeroBased: true
					},
					invalid: [{
							start: '00:00',
							end: '08:00'
						}, // Every day
						{
							start: '18:10',
							end: '24:00'
						},
					],
					defaultValue: new Date(currYear, currMonth, currDay, currHour + 2, currMinute),
					nowText: "今天",
					minDate: new Date(currYear, currMonth, currDay, currHour, currMinute + 30),
					maxDate: new Date(currYear, currMonth, currDay, currHour + 2, currMinute),
					onPosition: function(html, windowWidth, windowHeight, inst) {
						$(".mbsc-mobiscroll .dwfl").css("min-width", 0)
					},
					onClose: function(event, inst) {
						console.log(event);
						console.log(inst);
						//				alert("111");
					}
				}
				//结束时间参数
				$("#reservation-ETime").mobiscroll().time(endOption);
				if((currHour + 2) >= 18) {
					me.eTime = "18:00";
				} else {
					me.eTime = (currHour + 2) + ":" + (currMinute > 9 ? currMinute : ("0" + currMinute));
				}

				//预约时间参数
				var startOption = {
					theme: "mobiscroll",
					mode: "scroller",
					display: "bottom",
					//					buttons: [],
					timeFormat: 'HH:ii',
					timeWheels: 'HHii',
					lang: "zh",
					showNow: true,
					steps: {
						minute: 10,
						zeroBased: true
					},
					invalid: [{
							start: '00:00',
							end: '08:00'
						}, // Every day
						{
							start: '18:10',
							end: '24:00'
						},
					],
					defaultValue: new Date(currYear, currMonth, currDay, currHour, currMinute),
					nowText: "今天",
					minDate: new Date(currYear, currMonth, currDay, currHour, currMinute),
					maxDate: new Date(currYear, currMonth, currDay, 18, 10),
					onPosition: function(html, windowWidth, windowHeight, inst) {
						$(".mbsc-mobiscroll .dwfl").css("min-width", 0)
					},
					onBeforeClose: function(event, inst) {
						console.log(event);
						var times = event;
						var hours = parseInt(times.split(":")[0]);
						var minutes = parseInt(times.split(":")[1]);
						endOption.minDate = new Date(currYear, currMonth, currDay, hours, minutes + 30);
						if((hours + 2) >= 18) {
							endOption.maxDate = new Date(currYear, currMonth, currDay, 18, 10);
						} else {
							endOption.maxDate = new Date(currYear, currMonth, currDay, hours + 2, minutes);
						}
						$("#reservation-ETime").mobiscroll().time(endOption);
						var endTime = endOption.maxDate;
						var ehour = endTime.getHours();
						var eminutes = endTime.getMinutes();
						me.eTime = (ehour > 9 ? ehour : ("0" + ehour)) + ":" + (eminutes > 9 ? eminutes : ("0" + eminutes));
					}
				}
				$("#reservation-STimes").mobiscroll().time(startOption);
				me.sTimes = (currHour > 9 ? currHour : ("0" + currHour)) + ":" + (currMinute > 9 ? currMinute : ("0" + currMinute));

				console.log(me.startDate);
			},
			submitOrder() {
				var me = this;
				var sTime = this.theDate + " " + me.sTimes + ":00";
				var eTime = this.theDate + " " + me.eTime + ":00";
				if(!this.$parent.vBasicMsg.uname) {
					me.$parent.layerTimeout("请先补全信息再预约");
					me.$router.push("/Me");
				}
				console.log(sTime, eTime);
				this.$ajax.get("wxqueue/takeOrder/" + this.$parent.openId + "/" + this.qCode + "/" + sTime + "/" + eTime, {
						timeout: 1000 * 5
					})
					.then(function(response) {
						console.log(response);
						if(response.status == 200) {
							var data = response.data;
							if(data.code == 1000) {
								var callBack = function() {
									me.$router.push("/Cart");
								}
								me.$parent.layerTimeout("预约成功", callBack);
							} else {
								me.$parent.layerTimeout(data.msg);
								return false
							}
						}
					})
			}
		},
		beforeRouteLeave(to, from, next) {
			this.init();
			next()
		},
		created() {
			this.isFirstEnter = true;
		},
		activated() {
			this.init();
			this.listMsg = this.$route.params.listMsg
			this.qCode = this.listMsg.qcode;
			this.theDate = this.$route.params.dateTime;
			this.initTime(this.theDate);
		}
	}
</script>

<style>
	#businessDetal {
		padding: 0.5rem;
	}
	
	#businessDetal .banner {
		width: 100%;
		height: 10rem;
	}
	
	#businessDetal .banner img {
		width: 100%;
		height: 100%;
	}
	
	.listMsg {
		line-height: 1.5rem;
		background: #FFFFFF;
		padding: 0.8rem
	}
	
	.inputOut {
		line-height: 2rem;
		margin-top: 0.2rem;
	}
	
	.inputOut span {
		font-size: 1rem;
	}
	
	input {
		width: 7rem;
		line-height: 2rem;
		font-size: 0.7rem;
		padding: 0 0.5rem;
		text-align: center;
		border: 1px solid #E2E2E2;
		background: #E1E8FB;
	}
	
	.mbsc-mobiscroll.dw-inline {
		margin-top: 0.5rem
	}
	
	.dw-inline .dw {
		width: 100%;
	}
	
	.dw-i {
		/*letter-spacing: 0.2rem;*/
	}
	
	.dw-li {
		padding: 0 2rem;
	}
	
	#demo-inline {
		margin-top: 0.2rem
	}
	
	.btn {
		width: 100%;
	}
</style>