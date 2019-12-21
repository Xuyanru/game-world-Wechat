<template>
	<div class="tabs">
		<!--命名路由-->
		<ul>
			<!--this inspection reports XML/HTML tags with missing mandatory attrbutes ,you can specify attrbute name that should not  be reported-->
			<!--home被点击后，一直处于激活状态，因此需要使用精确匹配模式，在router-link中添加exact属性-->
			<router-link :to="{name:'Home'}" tag="li" exact>
				<div>
					<p class="icon iconfont icon-Home"></p>
				</div>
				<div>市场</div>
			</router-link>
			<router-link :to="{name:'Cart'}" tag="li">
				<div>
					<p class="icon iconfont icon-Cart"></p>
				</div>
				<div>出售</div>
			</router-link>
			<router-link :to="{name:'MyFile'}" tag="li">
				<div>
					<p class="icon iconfont icon-Me"></p>
				</div>
				<div>我的</div>
			</router-link>
		</ul>
	</div>
</template>
<script type="text/ecmascript-6">
	export default {
		name: 'Tabs',
		data() {
			return {

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

		}
	}
</script>
<style>
	.tabs {
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		box-shadow: 0 2px 4px #000;
		width: 100%;
		z-index: 10;
	}
	
	.tabs ul {
		display: table;
		width: 100%;
	}
	
	.tabs ul>li {
		text-align: center;
		font-size: 0.6rem;
		display: table-cell;
		padding: 4px 12px;
		cursor: pointer;
	}
	
	.tabs ul>li.router-link-active {
		color: #1296db;
	}
	
	.tabs ul>li.router-link-active>div {
		/*font-size: 14px;*/
	}
	
	.tabs ul>li>div>p {
		width: 100%;
		height: 1.6rem;
	}
	
	.tabs ul>li>div>p.icon-Home {
		background: url(../../static/img/wyyy.png) no-repeat center center;
		background-size: 1.5rem;
	}
	
	.tabs ul>li.router-link-active>div .icon-Home {
		background: url(../../static/img/wyyy-a.png) no-repeat center center;
		background-size: 1.5rem;
	}
	
	.tabs ul>li>div>p.icon-Cart {
		background: url(../../static/img/yygl.png) no-repeat center center;
		background-size: 1.5rem;
	}
	
	.tabs ul>li.router-link-active>div .icon-Cart {
		background: url(../../static/img/yygl-a.png) no-repeat center center;
		background-size: 1.5rem;
	}
	
	.tabs ul>li>div>p.icon-Me {
		background: url(../../static/img/grzx.png) no-repeat center center;
		background-size: 1.5rem;
	}
	
	.tabs ul>li.router-link-active>div .icon-Me {
		background: url(../../static/img/grzx-a.png) no-repeat center center;
		background-size: 1.5rem;
	}
</style>