import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import businessDetal from '@/components/businessDetal';
import Cart from '@/components/Cart';
import cartDetail from '@/components/cartDetail';
import Me from '@/components/Me';

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
				navShow: true,
				needReload:false,
			}
		},
		{
			path: '/businessDetal',
			name: 'businessDetal',
			component: businessDetal,
			meta: {
				navShow: false
			},
			params: {
				dateTime: "",
				listMsg: ""
			}
		},
		{
			path: '/Cart',
			name: 'Cart',
			component: Cart,
			meta: {
				navShow: true
			}
		},
		{
			path: '/cartDetail',
			name: 'cartDetail',
			component: cartDetail,
			meta: {
				navShow: false
			}
		},
		{
			path: '/Me',
			name: 'Me',
			component: Me,
			meta: {
				navShow: true
			}
		}
	]
})