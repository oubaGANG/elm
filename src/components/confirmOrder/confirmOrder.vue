<template>
 <div id="confirm">
		
		<!--头部-->
		<head-top head-title="确认订单" goBack="true"></head-top>
	<div id="order-widget-orderconfirm" class="order-widget-orderconfirm" style="margin-top:1.95rem">
   
    <div class="recive-info item-confirm" @click='toAddr(addr)'>
		<div class="d-left">
			<i class="font font-addr"></i>
		</div>
	    <div class="d-right">
	    	<p v-show='!addr.name'>请选择地址</p>
	    	<p><span>{{addr.name}}</span>
	        <span>{{addr.phone}}</span></p>
	        <p class="address">{{addr.address}}</p>	    			
	    </div>
	 	<div>
	 		<span class="arr_right icon-keyboard_arrow_right arr_right"></span>
	 	</div>
    </div>

    <div class="pay-info">
        <div class="item-confirm">
            <ul class="pay-list">
                <li>
                    <div class="row-left">
                        <p>支付方式</p>
                    </div>
                </li>

                <li v-for='value in paymentList' @click="selectPayment(value.id)">
                    <div class="row-left payname">
                        <p>{{value.name}}</p>
                    </div>
                    <div class="row-right">
                        <span :class="{checkmark: payId == value.id,pradio: payId != value.id}"></span>
                    </div>
                </li>


            </ul>
        </div>
    </div>


    <div class="send-info item-confirm">
        <ul class="list-group">
            <li class="user-time right-arrow">
                <span class="left-span">配送时间</span>
                <div class="right-value">               	
	                <div class="time">
	                   <select class="deliveryTime" v-model='time'>
	                   	<option v-for='val in deliveryTime' :value="val">{{val}}</option>
	                   </select>
	                </div>
	                <span class="icon-keyboard_arrow_right arr_right"></span>
                </div>
           
		 		
		 	
            </li>

            <li class="user-note" style="border-bottom: 0;">
                <span class="left-span">订单备注</span>
                <input type="text" v-model="remark" placeholder="请输入订单备注" class="fr">
               
            </li>
        </ul>
    </div>

    <div class="cart-info item-confirm">
        <ul class="list-group">
            <li v-for="value in cartList" class="item">
                <span class="left-span">{{value.name}}</span>
                <span class="right-value">¥{{value.price}}*{{value.count}}</span>
            </li>
             <li v-for="fee in feeList">
                <span class="left-span">{{fee.name}}</span>
                <span class="right-value">¥{{fee.value}}</span>
            </li>
     <!--       <li ng-repeat="value in cartdata">
                <span class="left-span">{{0}}</span>
                <span class="right-value">¥{{1}} * {{1}}</span>
            </li>
            <li ng-repeat="value in cartdata">
                <span class="left-span">{{0}}</span>
                <span class="right-value">¥{{1}} * {{1}}</span>
            </li>-->
        </ul>
    </div>

   <div class="shade">
    	<div class="shade_left">
    		待支付:{{totalPrice}}元
    	</div>
    	<div class="shade_right" @click='pay'>
    		确认下单
    	</div>
    </div>
</div>
	
	  <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
	<transition name="router-slid">
            <router-view></router-view>
       </transition>  
 </div>
</template>

<script>
import headTop from '../../components/header/head'
import alertTip from './../common/alertTip.vue'
 import fetch from '../../assets/js/fetch'
import {mapGetters} from 'vuex'//导入vuex
import {Toast,Indicator} from 'mint-ui';
	export default{
		data(){
			return{
				/*addr:{},//地址信息*/
				 showAlert: false, //显示提示组件
                alertText: null, //提示的内容
				remark:'',//订单备注
				payId:1,//付款id
				paymentList:[],//所有支付方式
				deliveryTime:[],//配送时间
				time:'--请选择--',//用户选择的配送时间
				cartList:[],//购物车物品
				totalPrice:0,//总价
				wxTip:'请使用微信登陆',//微信支付时错误，后台给的提示信息
				addrList:[],//收货地址
				feeList:[]//费用
			}
		},
		created(){
			var cars=[]
			if(localStorage.cartList){
				cars=JSON.parse(localStorage.cartList)
			}
			this.cartList=this.billList||cars
			this.totalPrice=this.billCount||localStorage.totalPrice
			//获取支付方式
			if(localStorage.payment){
				this.paymentList=JSON.parse(localStorage.payment)
				this.type=this.paymentList[0].type
				this.payId=this.paymentList[0].id
			}
				this.$http.get('/api/payment').then((res)=>{			
					this.paymentList=res.data.data.payment
					this.type=this.paymentList[0].type
					this.payId=this.paymentList[0].id
					localStorage.setItem('payment',JSON.stringify(this.paymentList))
					
				})
			
				
			//配送时间
			if(localStorage.deliveryTime){
				this.deliveryTime=JSON.parse(localStorage.deliveryTime)			
			}
				this.$http.get('/api/addons/deliveryTime').then((res)=>{
					this.deliveryTime=res.data.data.delivery_time
					this.deliveryTime.unshift('--请选择--')
					localStorage.setItem('deliveryTime',JSON.stringify(this.deliveryTime))
				})
			
							
			//收货地址
			fetch('/api/contact/').then((res)=>{
				if(res.data.code==1){				
					this.addrList=res.data.data.contact	
				}				
			})
			//费用
			 this.feeList=JSON.parse(localStorage.feeList)
		},
		methods:{

			//选支付方式
			selectPayment(id){
				this.payId=id
			},
			toAddr(item){
				var id=item.id?item.id:-1
				this.$router.push({
					path:'/confirmOrder/address',
					query:{addrId:id}
				})
			},
			//付款
			pay(){			
				if(!this.addr.name){
				 this.showAlert = true;
                  this.alertText = '请选择地址';	
					return ;
				}
				if(!this.time||this.time=='--请选择--'){
				 this.showAlert = true;
                  this.alertText = '请选择配送时间';	
					return ;
				}
				if(!this.totalPrice){

                  	 Toast("订单价格出错，请重新下单!!!")
                  	this.$router.push ('/shop')
					return ;
				}
				var balance=0
				if(localStorage.user){
					balance=JSON.parse(localStorage.user).money
				}
				if(this.payId==4){
					if(parseFloat(this.billCount)>parseFloat(balance)){
			   			//余额不够不能支付
				   		this.showAlert = true;
	                    this.alertText = '你的余额不足';
						return false
			   		}
				}
				Indicator.open('生成订单中...');
				//付款
				//新增订单
				var token=window.localStorage.getItem('token')//获取token
				var addr=this.addr.id//收货地址
				var payment=this.payId//付款方式
				var cart=[]//购物车商品
				var deliveryTime=this.time//配送时间
				this.billList.forEach((bill)=>{				
					cart.push({
						id:bill.id,
						num:bill.count
					})					
				})
			 	let ids = ''
				for(let i =0;i<this.feeList.length;i++){
                	if(i<this.feeList.length-1){
                		ids += this.feeList[i].id+",";
                	}else{
                		ids+=this.feeList[i].id;
                	}               
                }

				//生成订单
              	  this.$http.post('/api/order',{
              	  		 token:token,
                          contact_id:addr,
						  payment_id:payment,
						  cartData:cart,
						  delivery_time:deliveryTime,
						  remark:this.remark,
						  fee_id:ids
                        },{//post请求必须有
                            emulateJSON:true
                        }).then(res=>{

                   if(res.data.code==1){//成功更改 
                      	var orderId=res.data.data.order.id//订单id
                      	//清空购物车
                      	this.$bus.emit('clearCart')                        	
                      	//清空保存在localstorage中的商品列表
                      	localStorage.removeItem('cartList')
                      	localStorage.removeItem('totalPrice')
                     
							if(this.payId==1){//货到付款															
	                      	 	//跳转到我的订单页面
	                      	 this.$router.push ('/order')
	                      	 this.closeTip()
	                      	Indicator.close()
							}
							if(this.payId==2){
								 	Indicator.close()
								//微信支付
								this.$http.get('/api/pay/wxpay/'+orderId).then((res)=>{	
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
								this.$router.push ('/order')
							})
							}
							if(this.payId==3){
								Indicator.close()
								//支付宝支付
								this.$http.get('/api/pay/alipay/'+orderId).then((res)=>{										 	
								if(res.data.code==1){																				
		                      	 	window.location.href=res.data.data.url		                      
								}else{									
									Toast({
									  message: '支付失败'+res.data.msg,
									  duration:3000
									})
									this.$router.push ('/order')
								}
							}).catch((res)=>{
								
								Toast({
								  message: '支付宝支付失败'+res,
								  duration:3000
								});
							this.$router.push ('/order')
							})
							}
							if(this.payId==4){
								//余额支付
								this.$http.get('/api/pay/balance/'+orderId).then((res)=>{	
									 	Indicator.close()
									let theBalance=balance-this.billCount
									theBalance=theBalance.toFixed(2)
									var user=JSON.parse(localStorage.user)
                   					user.money=theBalance
                   					localStorage.setItem('user',JSON.stringify(user))
									if(res.data.code==1){
										Toast("支付成功，正在转向订单页面...")
								setTimeout(()=>{
									this.closeTip()	
									this.$bus.emit('userUpdate')
		                      	 	this.$router.push('/order')
		                      	 },1000)
								}else{
									Toast({
									  message: '余额支付失败'+res,
									  duration:3000
									})
									this.$router.push ('/order')
								}
								}).catch((res)=>{
									Indicator.close()
									Toast({
									  message: '余额支付失败'+res,
									  duration:3000
									})
									this.$router.push ('/order')
								})
							}
                        }else{
                        	Indicator.close()
                        }
                       }).catch((res)=>{             
                        	//请求失败
                        	Toast({
								  message: '发生了错误'+res,
								  duration:3000
								})
                        	 Indicator.close()
                     
                        })
                        
			},
		 //关闭对话框
            closeTip(){
            	if(this.alertText==this.wxTip){
            		//转向登陆页面
            		this.$router.push('/login')
            	}
                this.showAlert = false;
            } 
		},
		computed:{
		//动态监听账单的值
				...mapGetters([
				       'billList','billCount','addr'
				    ]),	
		},
		components:{
			headTop,
			alertTip,
		}
	}
</script>

<style scoped>
	.shade{
		position: fixed;
		z-index: 100;
		width: 100%;
		left: 0;
		bottom: 0;
		display: flex;
		height: 1.95rem; 
		line-height: 1.95rem;
		color: #fff;
	}
	.shade .shade_left{
		flex: 1;
		background-color:#404142;
		padding-left: 0.8rem;
	}
	.shade .shade_right{
		flex: 0 0 105px;
        width: 105px;
        text-align: center;
        background-color:#3190e8
	}

	.order-widget-orderconfirm {
        font-size: 16px;
        color: #404142;
        padding-bottom: 50px;
    }

    .order-widget-orderconfirm div.recive-info {
    	display: flex;
        margin-top: -1px;
	 	padding:15px 15px;
	 	font-size: 0.65rem;	 	
	 	box-align: center;
	 	align-items: center;
	  background:#fff; 
    }

    .order-widget-orderconfirm .recive-info .editaddr {
        background: #fff;
        color: #000;
    }


    .order-widget-orderconfirm .recive-info  p {
      	word-break: break-all;
        margin-top: 5px;
        margin-right: 5px;
    }

    .order-widget-orderconfirm .recive-info .editaddr:after {
        color: #fff;
    }

    .order-widget-orderconfirm .arr_right{
       float: right;
        color: #999;
        font-size:0.8rem;
		margin-top: 1px;
			height: 43px;line-height: 43px;
		width: 20px;
    }
	.order-widget-orderconfirm .pay-info .pay-title {
        color: #999;
        font-size: 14px;
        padding-left: 15px;
        padding-top: 6px;
    }

    .order-widget-orderconfirm .item-confirm {
        position: relative;
        margin: 10px 0;
        background: #fff;
        border-top: 1px solid #f5f5f0;
        border-bottom: 1px solid #f5f5f0;
    }

    .order-widget-orderconfirm .pay-info .pay-list {
        padding: 0 15px;
    }

    ul:before, ul:after {
        display: table;
        content: "";
    }

    .order-widget-orderconfirm .pay-info .pay-list li {
        display: flex;
        width: 100%;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
    }
    .order-widget-orderconfirm .pay-info .pay-list li:last-child{
    	border: none;
    }
    .order-widget-orderconfirm .pay-info .pay-list li div {
        display: table-cell;
    }

    .order-widget-orderconfirm .pay-info .icon-pay {
        color: #de0400;
        margin: 0 3px 0 1px;
        vertical-align: text-bottom;
    }

    .icon-pay:before {
        content: "\e61e";
    }

    .order-widget-orderconfirm .pay-info .pay-list li .pay-msg {
        color: #f76c70;
        font-size: 12px;
        margin-top: 5px;
    }
.order-widget-orderconfirm .pay-info .pay-list li .row-left{
	flex: 1;
	height: 22px;
	line-height: 22px;
}
    .order-widget-orderconfirm .pay-info .pay-list li .row-right {
		height: 22px;
       flex: 0 0 40px;
    }



    .order-widget-orderconfirm .pay-info .pradio {
        display: block;
        width: 20px;
        height: 20px;
        border: 1px solid #cbcbd0;
        border-radius: 50%;
        float: right;
    }

    .order-widget-orderconfirm .pay-info .checkmark {
        display: block;
        width: 22px;
        height: 22px;
     background: url(http://web1.waimai.bdimg.com/static/mwaimai/images/checkmark_35c19cc.png) no-repeat center;
        background-size: 22px;
        float: right;
    }

    .list-group {
        background: #fff;
        padding: 0 15px;
    }

    .list-group li:last-child {
        border: 0;
    }
	.list-group .item{
		padding: 0;
		height: 43px;
		line-height: 43px;
	}
    .order-widget-orderconfirm .list-group li {
        font-size: 16px;
    }
.order-widget-orderconfirm .list-group li input{
        font-size: 14px;
	 	text-align: right;
	 	padding-right: 33px;
    }
    .list-group li {
    	height: 43px;
        border-bottom: 1px solid #eee;
    }

    .list-group .left-span {
    	height: 43px;line-height: 43px;
        max-width: 10em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        float: left;
        font-size:14px; 
    }

    .list-group .right-value {
        display: block;
        padding-right: 8px;
        text-align: right;
        color: #999;
        font-size: 14px;
        float: right;
       	height: 43px;line-height: 43px; 
    }

    .right-value input{
    	margin-left: 2rem;
    }
	.right-value .time{float: left;}

    .order-widget-orderconfirm .send-info .user-time select {
        -webkit-appearance: none;
        border: 0;
        color: #999;
        font-size: 14px;
        background: #fff;
      	padding:0 5px;
    }

    .order-widget-orderconfirm .send-info .user-time:after {
        top: 0;
    }

    .address-list.addlist {
        background-color: #ffffff;
        border-top: 1px solid #f5f5f0;
        text-align: center;
        margin: 10px 0
    }

    .address-list.addlist a {
        display: block;
        font-size: 16px;
        color: #FF4146;
        padding: 15px 0;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1
    }
    .row-left p{
    	color: #999;
    font-size: 14px;
    }
	.payname p{
		color: #000;
	}
	.d-left{
		width:1.5rem;
		line-height:1.5rem;
		text-align: center;
		color: #3B95E9;	
	}
	.d-left i{
		font-size: 1rem	
	}
	.d-right{
		flex: 1;
		width: 80%;
	}
	.fr{float: right;font-size: 0.6rem;width:5.5rem;	height: 43px;line-height: 43px;}
  .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>