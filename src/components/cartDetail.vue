<template>
	<div id="cartDetail">
		<div>
			<div class="cart bg-white">
				<p class="cartTitle">{{listMsg.qname}}</p>
				<p class="icon fk-car">排队号码：{{listMsg.qindex}}</p>
				<p class="icon fk-why">是否取号：{{listMsg.iscollection?"已取号":"未取号"}}</p>
				<p class="icon fk-company">验&nbsp;证&nbsp;码：{{listMsg.qcode}}</p>
				<p class="icon fk-timec">开始时间：{{listMsg.starttime?listMsg.starttime.slice(0,16):""}}</p>
				<p class="icon fk-time">结束时间：{{listMsg.endtime?listMsg.endtime.slice(0,16):""}}</p>
				<p class="icon fk-timeend" v-if="listMsg.iscollection">取号时间：{{listMsg.collectiontime?listMsg.collectiontime.slice(0,16):""}}</p>
				<p class="text-center warn" v-if="!listMsg.iscollection">请到排号机输入验证码进行取号</p>
			</div>
			<!--<div class="cart bg-white">
				<p class="cartTitle">公务</p>
				<p class="icon fk-car">排队号码：25</p>
				<p class="icon fk-why">是否取号：已取号</p>
				<p class="icon fk-company">验&nbsp;证&nbsp;码&nbsp;：123456</p>
				<p class="icon fk-timec">开始时间：2019-06-15 12:32</p>
				<p class="icon fk-time">结束时间：2019-06-15 12:32</p>
				<p class="icon fk-timeend">取号时间：2019-06-15 12:32</p>
				<p class="text-center warn">请到排号机输入验证码进行取号</p>
			</div>-->
		</div>
	</div>
</template>

<script>
	export default {
		name: 'cartDetail',
		data() {
			return {
				listMsg:""
			}
		},
		methods: {
			
		},

		beforeRouteLeave(to, from, next) {

			next()
		},
		created() {
			this.isFirstEnter = true;
		},
		activated() {
			this.listMsg = this.$route.params.did;
		},
	}
</script>

<style>
	#cartDetail{
		padding: 0.5rem;
	}
	
	#cartDetail .cart{
		padding: 1rem;
		font-size: 0.75rem;
		line-height: 1.5rem;
	}
	
	#cartDetail .cart .cartTitle{
		line-height: 2rem;
		font-size: 1rem;
		color: #6195F8;
		padding-left: 0.;
		border-bottom: 1px solid #888888;
		margin-bottom: 0.5rem;
	}
	
	#cartDetail .cart .warn{
		color: #D84C29;
		margin-top: 0.5rem;
		font-size: 0.6rem;
	}
	
	#cartDetail .icon{
		/*background-size:1rem ;*/
	}
</style>