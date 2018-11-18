<template>	
<div id="order">		
	<div>
		<!--头部-->
		<head-top head-title="订单列表" goBack="true"></head-top>
	<!--<div v-if='!isLogin' class="nologin">亲，请先登录</div>-->
	<div class="orderListType" id="tabPlus">
	    <ul>
	        <li :class="{cur: nowIndex==1}" @click=selectOrders(1)>全部</li>
	        <li :class="{cur: nowIndex==2}" @click=selectOrders(2)>待付款</li>
	        <li :class="{cur: nowIndex==3}" @click=selectOrders(3)>待收货</li>
	        <li :class="{cur: nowIndex==4}" @click=selectOrders(4)>已完成</li>
	    </ul>
	</div>
		<div v-show='!hasbill' class="nobill">无订单记录</div>	
	<div class="orderList" style="padding-bottom: 72px">
    <div v-for="(value,index) in orderList" v-show="isAll||(noPay&&value.pay_status=='未支付'&&value.payment!='货到付款'&&value.status!='已取消')||value.status==state">
        <nav class="shopList">
        	<h2 style="border-bottom: #eee solid 1px;">
        		<a class="left">店铺: {{seller.name}}</a>
        		<span class="right color-red" v-show="value.status=='已取消'">已取消</span>
        		<span class="right color-red" v-show="value.pay_status=='未支付'&&value.status!='已取消'&&value.payment!='货到付款'">未付款</span>
        		<span class="right color-red" v-show="value.payment=='货到付款'">货到付款</span>
        		<span class="right color-red" v-show="value.pay_status!='未支付'&&value.status=='待发货'">待发货</span>
        		<span class="right color-red" v-show="value.status=='已发货'">待收货</span>
        		<span class="right color-green" v-show="value.status=='已完成'">已完成</span>
        	</h2>
            <nav class="probody maxheight clearfix" style="border-bottom: #eee solid 1px;">
            	<div class="product" style="margin: 6px;float: left">
            		<ul @click='toDetail(value)'>
            			<li v-for='pro in value.detail'>
            				<img v-lazy="getFile(pro.product.file)" />
            			</li>
            		</ul>
            	</div>	
               
            </nav>

            <p class="p-sum ">
            	<span>共<em class="color-grey">{{value.count}}</em>件商品</span>
            	<span class="p-fee right">总价：<em class="color-dark">¥{{value.totalprice}}</em></span>
            </p>
            <p class="p-actions clearfix" v-show="value.payment!='货到付款'&&value.pay_status=='未支付'">
            	<span class="orderBtn btn-primary btnok" v-show="value.payment=='支付宝'&&value.status!='已取消'">
            		<a class="for_gaq js_continuePay" @click="alipay(value)">支付宝</a>
            	</span>
                <span class="orderBtn btn-primary btnok"  v-show="value.payment=='微信支付'&&value.status!='已取消'">
                    <a class="for_gaq js_continuePay" @click="wxpay(value)">微信支付</a>
                </span>
                <span class="orderBtn btncancel btncloseOrder" v-show="value.status!='已取消'">
                	<a class="for_gaq" @click="cancel(value)">关闭订单</a>
                </span>
            </p>
              <p class="p-actions clearfix " v-show="value.status=='已发货'">
            	<span class="confirm" @click='delivery(value)'>
            		确认收货
            	</span>
            </p>
               <p class="p-actions clearfix " v-show="value.status=='已完成'">
            	<span class="confirm" @click='toRate(value.id)'>
            		去评价
            	</span>
            </p>
        </nav>
    </div>
</div>
	<footguide v-show='footShow'></footguide>
	</div>
 <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
 <confirm-tip v-if="show" :okText="'确认'" :alertText="'请确认已收到'" :isEnter='isEnter' :isLeave='isLeave' @waitingThing="waitingThing" @confirm="confirm"></confirm-tip>             
<!--<loading v-if="showLoading"></loading>-->
	<transition name="router-slid">
            <router-view></router-view>
     </transition>
</div>
</template>	
<script>
	import headTop from '../../components/header/head'
  import {getFile} from './../../assets/js/util';//导入获取图片方法
  import fetch from './../../assets/js/fetch'
  import alertTip from './../common/alertTip.vue'
   import confirmTip from './../common/confirm.vue'
/*  import loading from './../common/loading'*/
 import Vue from 'vue';
  import {mapGetters} from 'vuex'//导入vuex
import footguide from './../common/footer'
  import { Toast, Indicator  } from 'mint-ui'//alert

	export default{
		data(){
			return{
				orderList:[],//订单列表
				nowIndex:1,//选中的索引
				isAll:true,//是否显示全部
				noPay:false,//显示未付款状态
				state:'',//商品状态(发货or完成)
				selOrder:0,//选择了哪个订单
				url:'',//转向详情地址
				hasbill:true,//是否有订单
				seller:{},//卖家信息
				 showAlert: false, //显示提示组件
                alertText: null, //提示的内容
                  show:false,
                isEnter:true,
                isLeave:false,
                confirmOrder:{},//确认收货的货物
               // showLoading: true, //显示加载动画
                orderDetial:{},//订单详情
                wxTip:'请使用微信登陆',//微信支付时错误，后台给的提示信息
			}
		},
		created(){
			
			//获取卖家信息
			if(localStorage.seller){
				this.seller=JSON.parse(localStorage.seller)
			}			
			var token=window.localStorage.token
				if(!token){//没有登录												
						this.$router.push('/login')					
					//this.hideLoading()
					
					return false
				}
				Indicator.open('加载中...');
			var _this=this
			//获取订单列表
			fetch('/api/order').then(function(res){
				if(res.data.code==1){
					_this.orderList=res.data.data.order
					_this.orderList.forEach(function(order){
						let sum=0
						order.detail.forEach(function(pro){
								sum+=1
						})
					
						Vue.set(order, 'count', sum);
					})
					//是否有订单					
			if(_this.orderList.length>0){
				//有订单
				_this.hasbill=true
			}else{
			
				_this.hasbill=false
			}
			//_this.hideLoading()
			Indicator.close()
				}
			})
		
		},
	  computed:{
	       	...mapGetters([
				'footShow'
			]),
	   		
	    },
		methods:{
			getFile,//获取图片
			toDetail(value){//点击转向详细订单
				this.orderDetial=value
				//this.$router.push('/order/orderDetail')
				this.selOrder=value.id
				this.$router.push({
					path:'/order/orderDetail',
					query:{orderid:value.id}
				})

			},
		//确认收货
			delivery(item){
				this.show=true;
                this.isEnter=true;
                this.isLeave=false;
                this.confirmOrder=item		
			},
			//去评价
			toRate(id){
				this.$router.push({
					path:'/comment',
					query:{orderid:id}
				})
			},
			//取消
			  waitingThing(){
                clearTimeout(this.timer)
                this.isEnter=false;
                this.isLeave=true;
                this.timer = setTimeout(() =>{
                    clearTimeout(this.timer)
                    this.show=false;
                },200)
            },
            //确认
            confirm(){
            	this.isEnter=false;
                this.isLeave=true;
                this.show=false;
                //请求确认收获按钮         
               fetch('/api/order/confirmReceipt/'+this.confirmOrder.id).then((res)=>{
				if(res.data.code==1){
					this.confirmOrder.status='已完成'
				} 
				})
            },
			//选择订单显示类型
			selectOrders(num){
				this.nowIndex=num
				if(num==1){//全部
					this.isAll=true
					this.noPay=false
					
				}else if(num==2){//待付款
					this.noPay=true
					this.isAll=false
					this.state=''
				}else if(num==3){//待收货
					this.state='已发货'
					this.isAll=false
					this.noPay=false
				}else{//已完成
					this.state='已完成'
					this.isAll=false
					this.noPay=false
				}
			},
			//支付宝支付
			alipay(item){
			fetch('/api/pay/alipay/'+item.id).then(function(res){
			
				if(res.data.code==1){
					window.location.href=res.data.data.url
				}else{
					Toast({
						message: res,
						duration:3000
					})
				}
			}).catch((res)=>{
				Toast({
						message: res,
						duration:3000
					})
			})
			},	
			//微信支付
			wxpay(item){
					
			fetch('/api/pay/wxpay/'+item.id).then((res)=>{
				if(res.data.code==0){
				   this.showAlert = true;
                   this.alertText = res.data.msg;	
				}else{
					WeixinJSBridge.invoke('getBrandWCPayRequest', res.data.data.jsApiParameters, function(res){
                                    if(res.err_msg == "get_brand_wcpay_request:ok"){
                                        Toast("支付成功");
                                        // 这里可以跳转到订单完成页面向用户展示
                                         this.$router.go(0)
                                    }else{
                                        Toast("支付失败，请重试");
                                    }

                                });

				}
			}).catch((res)=>{
					Toast({
						 message: '微信支付失败'+res,
						duration:3000
					});
					
			})
			},
			//关闭账单
			cancel(value){
				fetch('/api/order/',{
					id:value.id,
					status:-1
				}).then((res)=>{
					if(res.data.code==1){
						value.status='已取消'
						Toast({
						  message: res.data.msg,
						  duration: 2000
						})
						
					}else{
						Toast({
						  message: res.data.msg,
						  duration: 2000
						});
					}
				})
			},
			  //关闭对话框
            closeTip(){
            	if(this.alertText==this.wxTip){
            		//转向登陆页面
            		this.$router.push('/login')
            	}
                this.showAlert = false;
            },
             //隐藏动画
          /*  hideLoading(){
                clearTimeout(this.timer);
                 this.timer = setTimeout(() => {
                  clearTimeout(this.timer);
                   this.showLoading = false;
                 }, 600)
            },*/
		},
		components:{
			headTop,
			alertTip,
			confirmTip,
			/*loading,*/
			footguide
		}
	}
</script>
<style type="text/css" scoped>
	#order{
		position: relative;
	}
	.nologin,.nobill{
		margin-top: 5rem;
		text-align: center;
		font-size: 0.8rem;
	}
    .orderListType {
        /*padding-top: 7px;*/
        font-size: 0;
        position: fixed;
        top: 1.95rem;
        z-index: 10;
        width: 100%;
    }

    .orderListType ul {
        width: 100%;
    }

    .orderListType ul li {
        display: inline-block;
        width: 25%;
        background: #fff;
        font-size: 14px;
        line-height: 50px;
        text-align: center;
         color: #7e8c8d
    }

    .orderListType ul li.cur {
        border-bottom: 2px solid #3190e8;
         color: #3190e8;
    }
    .shopList {
        background: #fff;
        padding: 0 0.8rem 1rem;
        overflow: auto;
        margin-bottom: 7px;
    }

    nav {
        display: block;
        padding: 0;
        margin: 0;
    }

    .shopList h2 {
        height: 1.6rem;
        line-height: 1.6rem;
        color: #323232;
        font-size: 14px;
        overflow: hidden;
    }

    .left {
        float: left;
    }

    .shopList h2 span.right {
        float: right;
        color: #707070;
    }

    .color-red {
        color: #FF4146 !important;
    }
	.color-green {
        color:#4CD964 !important;
    }
    .right {
        float: right;
    }



    .product {
        
        overflow: auto;
        padding: 6px 0;
        display: block;
    }
   .product ul li{
   	position: relative;
   	display: inline-block;
   	margin-right: 0.2rem;
   	width: 2.5rem;
    height: 2.5rem;
     background: #f3f5f7;

   }
      .product ul li img{
      	width: 100%;
      	height: 100%;
      	
      }
    .product ul li:last-of-type{
    		margin-right:0
    }
    .product .p-img {
        width: 65px;
        height: 65px;
    }

    .color-dark {
        color: #222;
    }

    .color-grey {
        color: #707070;
    }

    .shopList .p-sum {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #696A6C;
    }

    .p-sum .p-fee.p-express {
        padding-right: 15px;
    }

    .shopList .p-actions {
        height: auto;
        position: relative;
        padding-top: 1em;
    }

    .p-actions .btn.btn-primary {
        border-color: #FF4146;
        color: #FF4146 !important;
    }
	  .confirm{	  		
	    background:#4CD964;
	    border-color:#4CD964;
	    float: right;
	    width: 68px;
	    height: 30px;
	    font-size: 13px;
	    text-align: center;	
	    line-height: 30px;
	    border-radius: 3px;
	    color: #fff;
	    }
    .p-actions .orderBtn {
        display: inline-block;
        float: right;
        margin-left: 8px;
        color: #666;
        width: 68px;
        font-size: 13px;
        line-height: 30px;
        height: 30px;

        border: 1px solid #999;
        border-radius: 3px;
    }

    .btnok {
        background: #FF4146;
        color: #fff;
    }

    .btncancel, .btnok {
        display: block;
        height: 44px;
        line-height: 44px;
        text-align: center;
        border-radius: 3px;
        font-size: 15px;
    }

    .p-actions .btn.btn-primary a {
        color: #FF4146 !important;
    }

    .p-actions .orderBtn a {
        color: #666 !important;
    }

    .p-actions .orderBtn {
        display: inline-block;
        float: right;
        margin-left: 8px;
        color: #666;
        width: 68px;
        font-size: 13px;
        line-height: 30px;
        height: 30px;
        background-color: #FFF;
        border: 1px solid #999;
        border-radius: 3px;
    }

    .btncancel {
        background: #f6f5f5;
        color: #ce3529;
    }

    .btncancel, .btnok {
        display: block;
        height: 44px;
        line-height: 44px;
        text-align: center;
        border-radius: 3px;
        font-size: 15px;
    }

    .p-actions .orderBtn a {
        color: #666 !important;
    }

    .orderList {
        padding: 10px 0 0;
        margin-top: 90px;
    }

    .p-actions .orderBtn.btn-primary a {
        color: #FFFFFF !important;
    }

    .p-actions .orderBtn.btn-primary {
        border-color: #FF4146;
        color: #FF4146 !important;
        background-color: #FF4146 !important;
    }

    em, footer, h1, h2, h3, h4, input, li, mark, nav, ol, p, section, span, textarea, ul {
        margin: 0;
        padding: 0;
        font-weight: 400;
        list-style: none;
        font-style: normal;
    }
.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
    transform: translateX(100%);
}
img[lazy=loading]{
width:32px !important;
height: 32px !important;
position: absolute;
top: 0;left: 0;right: 0;bottom: 0;
margin: auto;

}
</style>