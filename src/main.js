// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui'//导入mint ui
import 'mint-ui/lib/style.css'//导入mint css
import './assets/js/font.js'
import './assets/style/index.styl';
import axios from 'axios'//引入通信机制
import store from './store/'//导入vuex所需要的
import { Lazyload } from 'mint-ui';//懒加载
import VueBus from 'vue-bus';//事件中心插件
import './assets/style/reset.css'
/*import VueOccupy from 'vue-occupy'//占位符
Vue.use(VueOccupy)*/
Vue.use(VueBus);
Vue.use(Mint);//引入mint ui
Vue.use(Lazyload);
Vue.config.productionTip = false
//axios的一些配置，比如发送请求显示loading，请求回来loading消失之类的
axios.interceptors.request.use(function (config) {  //配置发送请求的信息
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) { //配置请求回来的信息
  return response;
}, function (error) {

  return Promise.reject(error);
});
/*var token=window.localStorage.getItem('token')*/
var baseURL=localStorage.baseURL
axios.defaults.baseURL = baseURL;
//axios.defaults.headers.common['Authorization'] = localStorage.token; 
Vue.prototype.$http = axios  //其他页面在使用axios的时候直接  this.$http就可以了
/* eslint-disable no-new */
axios.get('/api/config').then(function(res){
	//获取商家信息
	if(res.data.data.config){ 
			localStorage.setItem('seller',JSON.stringify(res.data.data.config))
	}
			
	})
axios.get('/api/tpl/fee').then(function(res){
	//获取费用
	if(res){ 
				var feeList = res.data.data.feeList;	
			localStorage.setItem('feeList',JSON.stringify(feeList))
	}			
	})

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
