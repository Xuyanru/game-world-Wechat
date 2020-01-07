import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import businessDetal from '@/components/businessDetal';
import Cart from '@/components/Cart';
import cartDetail from '@/components/cartDetail';
import MineMsg from '@/components/MineMsg';
import MyFile from '@/components/MyFile';
import myBusiness from '@/components/myBusiness';

Vue.use(Router);

var theUrl = "";

export default new Router({
	//mode: 'history',
	//base: __dirname,
	//linkActiveClass: 'active', // 更改激活状态的Class值
	routes: [{
			path: '/',
			name: 'Home',
			component: Home,
			meta: {
        index: 1,
				navShow: true,
				needReload: true,
				keepAlive: true,
				scollTopPosition: 0
			}
		},
		{
			path: '/Home',
			name: 'Home',
			component: Home,
			meta: {
        index: 1,
				navShow: true,
				needReload: true,
				keepAlive: true,
				scollTopPosition: 0
			}
		},
		{
			path: '/businessDetal',
			name: 'businessDetal',
			component: businessDetal,
			meta: {
        index: 2,
				navShow: false,
				keepAlive: true
			},
			params: {
				listMsg: ""
			}
		},
		{
			path: '/Cart',
			name: 'Cart',
			component: Cart,
			meta: {
        index: 1,
				navShow: true,
				keepAlive: true
			}
		},
		{
			path: '/cartDetail',
			name: 'cartDetail',
			component: cartDetail,
			meta: {
        index: 2,
				navShow: false,
				keepAlive: true
			}
		},
		{
			path: '/MyFile',
			name: 'MyFile',
			component: MyFile,
			meta: {
        index: 1,
				navShow: true,
				keepAlive: true
			}
		},
		{
			path: '/MineMsg',
			name: 'MineMsg',
			component: MineMsg,
			meta: {
        index: 2,
				navShow: false,
				keepAlive: true
			}
		},
		{
			path: '/myBusiness',
			name: 'myBusiness',
			component: myBusiness,
			meta: {
        index: 2,
				navShow: false,
				needReload: true,
				keepAlive: true,
				scollTopPosition:0
			}
		}
	]
})