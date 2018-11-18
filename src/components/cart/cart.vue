<template>
<div>
	  <div class="shopcart">
	    <div class="content">
	      <div class="content-left" @click="toggleList">
	        <div class="logo-wrapper">
	          <div class="logo" :class="{'highlight':totalCount>0}">
	            <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
	          </div>
	          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
	        </div>
	        <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
	        <div class="desc">另需配送费￥{{fee}}元</div>
	      </div>
	      <router-link class="content-right"  :to='path'>
	        <div class="pay" :class="payClass" @click="pay">
	          {{payDesc}}
	        </div>
	      </router-link>
	    </div>
<!--    购买清单-->
<transition name="fade">
		  <div class="shopcart-list" v-show="listShow" >
	      <div class="list-header">
	        <h1 class="title">购物车</h1>
	        <span class="empty" @click="empty">清空</span>
	      </div>
	      <div class="list-content" ref='listContent'>
	        <ul>
	          <li class="food" v-for="food in selectFoods">
	            <span class="name">{{food.name}}</span>
	            <div class="price">
	              <span>￥{{food.tolPrice}}</span>
	            </div>
	            <div class="cartcontrol-wrapper">
	              <cartcontrol :food="food"></cartcontrol>
	            </div>
	          </li>
	        </ul>
	      </div>
	   </div>
</transition>
 <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
  </div>
<!--  屏幕遮罩-->
<transition name="fade">
	<div class="list-mask" @click="hideList" v-show="listShow" ></div>
</transition>
</div>
</template>
<script type="text/javascript">
  import BScroll from 'better-scroll';
  import cartcontrol from './../cartcontrol/cartcontrol';
  import alertTip from './../common/alertTip.vue'
    import fetch from './../../assets/js/fetch'
	export default{
		data(){
			return{
				//购物清单是否折叠状态
				 fold: true,
				 showAlert: false, //显示提示组件
         alertText: null, //提示的内容
				 path:'',
				 isLogin:false,
				 fee:0//配送费
			}
		},
		props:{
			//用户选择了哪些食物
			selectFoods:{
				type:Array,
				default(){
					return[{
						price: 12,
            count: 1
					}]
				}
			},
			//配送价

		      //最低起送价
		      minPrice: {
		        type: Number,
		        default: 0
		      }
		},
		created(){
			this.$bus.on('clearCart',this.empty)
			if(localStorage.feeList&&localStorage.feeList.length>0){				
						var feeList=JSON.parse(localStorage.feeList)
					feeList.forEach((item)=>{
							this.fee+=parseFloat(item.value)
						})
				
		
			}else{		
					var feeList=[]
				if(localStorage.feeList){
					feeList=JSON.parse(localStorage.feeList)
					feeList.forEach((item)=>{
							this.fee+=parseFloat(item.value)
						})
				}
		
					fetch('/api/tpl/fee').then((res)=>{
					//获取跑腿费
					if(res){ 
						 feeList=res.data.data.feeList
						 feeList.forEach((item)=>{
							this.fee+=parseFloat(item.value)
						})
					}						
					})
		
					

	          }
		},
		computed:{
			//总价
			totalPrice(){
				let total=0
				if(this.selectFoods.length>0){
					total=this.fee
					this.selectFoods.forEach((food)=>{
					total+=food.price*food.count
				})
				}
				 return total.toFixed(2);
			},			
			//购买总量
			totalCount(){
				let count = 0;
		    if(this.selectFoods){
		    	this.selectFoods.forEach((food) => {
		          count += food.count;
		        });
		    }
		        return count;
			},
			//配送信息
			payDesc(){
				if(this.totalPrice === 0){
					return `￥${this.minPrice}元起送`
				}else if(this.totalPrice<this.minPrice){
					let diff = this.minPrice - this.totalPrice;
          			return `还差￥${diff}元起送`;
				} else {
			          return '去结算';
			        }
			},
			//动态操作类样式
			payClass(){
				if(this.totalPrice < this.minPrice||this.totalPrice<=this.fee){
					return 'not-enough';
				}else{
					 return 'enough';
				}
			},
			//购物清单是否显示
			 listShow() {
			 	//没有买不显示
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
       
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
		},
		methods:{
		
			//清单显示与不显示
			 toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      //隐藏清单
      hideList() {
        this.fold = true;
      },
      //清空清单
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
       	localStorage.removeItem('cartList')
      },
      //支付
       pay() {
       	//购买的总价小于起送价
        if (this.totalPrice < this.minPrice||this.totalPrice<=0) {
        	this.path=''
          return;
        }else{
        var user=JSON.parse(window.localStorage.getItem('user'))
        var token=window.localStorage.token
				if(!token){//没有登录
					this.showAlert = true;
           this.alertText = '请先登录';	
					this.isLogin=false
					return false
				}else{
					this.isLogin=true
				}
        	//像确认订单页面发送数据
        	var data={
        		bill:this.selectFoods,
        		num:this.totalPrice
        	}
        	localStorage.setItem('totalPrice',this.totalPrice)
        	this.$store.dispatch('billList',data)
        	//this.$bus.emit('seleFood',this.selectFoods,this.totalPrice)
        	//改变地址
        	this.path='/confirmOrder'
        }
         
      },
       //关闭对话框
      closeTip(){
      				this.$router.push('/login')
             this.showAlert = false;
       }
		},
		components:{
			cartcontrol,
			alertTip
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/style/mixin.styl"

  .shopcart
    position: fixed
    left: 0
    bottom: 60px
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 0.4rem
          padding: 6px
          width: 58px
          height: 58px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 12px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right:12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 12px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: .6rem
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00a0dc
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        &.drop-transition
          transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
          .inner
            width: 16px
            height: 16px
            border-radius: 50%
            background: rgb(0, 160, 220)
            transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%      
      transform: translate3d(0, -100%, 0)
      &.fade-enter-active,&.fade-leave-active    
        transition: all .2s
      &.fade-enter,&.fade-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          height:48px
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name         	
            line-height: 24px
            font-size: 14px  
            color: rgb(7, 17, 27)
            position: absolute
            bottom:16px				
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active,&.fade-leave-active
      transition: all .5s
    &.fade-enter,&.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>