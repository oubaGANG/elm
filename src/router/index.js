import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/home.vue'
import Shops from '@/components/shops/shops.vue'
import order from '@/components/order/order.vue'
import orderDetail from '@/components/order/children/orderDetail.vue'

import My from '@/components/my/my.vue'
import login from '@/components/login/login.vue'
import regist from '@/components/regist/regist.vue'
import forget from '@/components/forget/forget.vue'
import comment from '@/components/comment/comment.vue'
import confirmOrder from '@/components/confirmOrder/confirmOrder.vue'
import addr from '@/components/confirmOrder/children/address.vue'
import addAddr from '@/components/confirmOrder/children/children/add.vue'
import info from '@/components/my/children/info.vue'
import updateName from '@/components/my/children/children/updateName.vue'
import address from '@/components/my/children/children/address.vue'
import add from '@/components/my/children/children/children/add.vue'
Vue.use(Router)
export default new Router({
	//切换路径模式，变成history模式(地址栏不带/#)

    // 滚动条滚动的行为，不加这个默认就会记忆原来滚动条的位置
     scrollBehavior: () => ({ y: 0 }),
  routes: [
   {path:'/home',component:Home},
   {path:'/shop',component:Shops},
   //订单页
    {
    	path:'/order',
    	component:order,
    	children:[

    		{//订单详情
    			path: 'orderDetail',
    			component: orderDetail
    		}
    	]
    },
    
    
    
    {path: '/orderDetail',component: orderDetail},
    
    
    //登陆页 
    {path: '/login',component: login},
     //注册页 
    {path: '/regist',component: regist},
       //重写密码
    {path: '/forget',component: forget},
    //确认订单页面
    {
    	path:'/confirmOrder',
    	component: confirmOrder,
    	children:[
    		{
           		//地址
           path: 'address', 
           component: addr,
           children:[
	           	{//添加地址
	           	path:'add',
	           	component:addAddr
	           }
           ]
           }
           
    	]
    },
    //商品评论
     {path:'/comment',component: comment},
   //个人中心
    {
    	path:'/my',
    	component:My,
    	children:[{//个人详情页
    	   path: 'info', 
           component: info,	
           children:[
           {
           		//改名字
           path: 'updateName', 
           component: updateName,
           },
           {
           	//更改收货地址
    	   path: 'address', 
           component: address,	
           	children:[{//更改收货地址
	    	   path: 'add', 
	           component: add,	
    		}]
    	  }]
    	}]
    },
   {
      path: '/',
      redirect: '/home'
    },
/*  {
      path: '*',
      redirect: '/home'
    },*/
  ]
})
