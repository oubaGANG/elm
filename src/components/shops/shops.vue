<template>
<div>
	<div>
	<header class="header">
			<!--公告-->
		<div class="bulletin-wrapper" @click='showDetail'>
		    <span class="notice">公告</span><span class="bulletin-text">{{seller.description}}</span>
		    <i class="icon-keyboard_arrow_right"></i>
		</div>
		 <!-- 详细信息-->
	    <transition name="fade">
	    <div v-show="detailShow" class="detail" >
	      <div class="detail-wrapper clearfix">
	        <div class="detail-main">
	         <!-- <h1 class="name">{{seller.name}}</h1>-->
	              <!--	插入星星组件-->
	       <!--   <div class="star-wrapper">
	      
	            <star :size="48" :score="4.2"></star>
	          </div>-->
	          <div class="title">
	            <div class="line"></div>
	            <div class="text">使用帮助</div>
	            <div class="line"></div>
	          </div>
	           <div class="bulletin">
	            <p class="content">{{seller.help}}</p>
	          </div>
	          <div class="title">
	            <div class="line"></div>
	            <div class="text">商家公告</div>
	            <div class="line"></div>
	          </div>
	          <div class="bulletin">
	            <p class="content">{{seller.description}}</p>
	          </div>
	        </div>
	      </div>
	      <div class="detail-close" @click='hideDetail'>
	        <i class="icon-close"></i>
	      </div>
	    </div>
	  </transition> 
	</header>
<!--	商品-->
	<div class="goods">
		  <!--	左边栏-->
		<div class="menu-wrapper" id='wrapper_menu'>
	      <ul>
	        <li v-for="(item,index) in category" class="menu-item" :class="{'current':selectIndext===index}"
	        	@click="selectMenu(index)">
	          <span class="text border-1px">{{item.name}}</span>
	        </li>
	      </ul>

	    </div>
	      <!--  	右边栏-->
	     <div class="foods-wrapper" ref='foodsWrapper' id='foodsWrapper'>
	      <ul>
	        <li v-for="item in category" class="food-list food-list-hook" >
	          <h1 class="ttitle">{{item.name}}</h1>	 
	          <ul class="dataUl">
	            <li v-for="food in goods" class="food-item border-1px" @click='selectFood(food,$event)' v-if='item.id==food.category_id'> 
	              <div class="icon">
	                <img width="57" height="57" :src="getFile(food.file)">
	              </div>
	              <div class="content">
	                <h2 class="name">{{food.name}}</h2>
<!--	                <p class="desc">{{food.remark}}</p>-->
<!--	                <div class="extra">
	                  <span class="count">月售{{food.sale}}份</span>
	                </div>-->
	                <div class="price">
	                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.old_price">￥{{food.old_price}}</span>
	                </div>              
	               <div class="cartcontrol-wrapper">
	               	<!--获取自组建传来的事件-->
	                  <cartcontrol :food="food"></cartcontrol>
	                </div>             
	              </div>
	            </li>
				
	          </ul>
	          <div v-show='isShow(goods,item)' class="noData">暂无数据</div>
	        </li>
	      </ul>
	    </div>
	</div>
	   
	<!--	购物车-->
	<cart ref='cart' :select-foods='selectFoods' 
     :min-price="seller.minPrice" v-show='cartShow'></cart>
	<!-- 底部导航-->
 <footguide v-show='footShow'></footguide>
 </div>
 <!--    商品详情-->
 <food :food='selectedFood' ref='food'></food>
<!-- <loading v-if="showLoading"></loading>-->
</div>
</template>
<script>
import BScroll from 'better-scroll';//导入滚动插件
 import star from './../star/star';//导入星星组件
 import cart from './../cart/cart';
 import food from './../food/food.vue'
 import cartcontrol from './../cartcontrol/cartcontrol';
 import {getFile} from './../../assets/js/util';//导入获取图片方法
 import {mapGetters} from 'vuex'//导入vuex
/* import loading from './../common/loading'*/
 import footguide from './../common/footer'
 import fetch from './../../assets/js/fetch'
 import { Toast, Indicator } from 'mint-ui';
  import Vue from 'vue';
	export default{
		data(){
			return{
				category:[],//菜单列表
				goods:[],//商品信息
				seller:{},//店铺信息
				listHeight: [],//右侧每个栏目的高度
				scrollY:0,//用于监听右侧滚动的距离
				detailShow: false,//是否显示详细页面的弹框
				selectedFood:{},//查看选中的食物
				ratings:[],//商品评论
				isSelect:true,
				selectIndext:0,

			}
		},
		created(){
			this.$bus.on('updataCart',this.updataCart)
		},
		mounted(){
			var cartList=localStorage.cartList
			if(cartList){
				cartList=JSON.parse(cartList)
			}
			//获取商家
			if(localStorage.seller){
				this.seller=JSON.parse(localStorage.seller)
			}
				this.$http.get('/api/config').then((res)=>{
					
					this.seller=res.data.data.config				
				})
			
			
			//获取商品菜单
			if(localStorage.category){
				this.category=JSON.parse(localStorage.category)
			}
			this.$http.get('/api/product/category').then((res)=>{
				this.category=res.data.data.category
				localStorage.setItem('category',JSON.stringify(this.category))
			})
			
			
				//获取商品
		/*		this.$http.get('/api/product').then((res)=>{
				this.goods=res.data.data.product
				localStorage.setItem('goods',JSON.stringify(this.goods))
				Indicator.close()
				this.$nextTick(() => {						
					 //计算右侧离顶部高度,用于和左侧的菜单做个映射
					this._calculateHeight();
                    })

			})*/
			if(localStorage.goods){
				this.goods=JSON.parse(localStorage.goods)
				
			}
			this.$http.get('/api/product').then((res)=>{
				this.goods=res.data.data.product
				localStorage.setItem('goods',JSON.stringify(this.goods))
				Indicator.close()
				if(cartList){
						for(var i=0;i<this.goods.length;i++){
							for(var j=0;j<cartList.length;j++){
								//从本地存储中读取曾选中的商品列表（刷新值照样存在）
								if(this.goods[i].id==cartList[j].id){
									Vue.set(this.goods[i], 'count', cartList[j].count);
									Vue.set(this.goods[i], 'tolPrice', cartList[j].tolPrice)
								}
							}
						}
					}
			this.$nextTick(() => {						
					 //计算右侧离顶部高度,用于和左侧的菜单做个映射
					this._calculateHeight();
                    })

			})
			
			
			
			
		},
		methods:{
			//接受传来的购物车改变事件，保存到本地
			updataCart(){
				let foodsList=[]
					this.goods.forEach((good)=>{				
							if(good.count){
								//当用户选择增加食物food.count会改变，实现购物车与其联动
								foodsList.push(good)
							}					
					})	
				localStorage.setItem('cartList',JSON.stringify(foodsList))	
			},
			//显示商品详细信息
			 showDetail() {
			 	//发送消息，发送到actions,隐藏底部
                this.$store.dispatch('hideFoot')
                this.$store.dispatch('hideCart')
		        this.detailShow = true;
		      },
		      //判断是否有商品
		      isShow(item,food){
		   		var list=0
		    	item.forEach((good)=>{				
							if(good.category_id==food.id){
								list++
							}					
					})
		      	if(list===0){
		      		return true
		      	}else{
					return false		      		
		      	}
		      },
		     hideDetail() {
		     	//发送消息，发送到actions,显示底部
                this.$store.dispatch('showFoot')
                 this.$store.dispatch('showCart')
		        this.detailShow = false;
		     },
		     getFile,//获取图片
		/*      //隐藏动画
            hideLoading(){
                clearTimeout(this.timer);
                 this.timer = setTimeout(() => {
                  clearTimeout(this.timer);
                   this.showLoading = false;
                 }, 600)
            },*/
		     //初始化滚动插件
			_initScroll() {	
		       	 /*右侧栏滚动*/
		         this.foodsScroll = new BScroll('#foodsWrapper', {
		          click: true,
		          probeType: 3//可以实时监听滚动y的位置
		        });
		        				//左侧
			 	this.wrapperMenu = new BScroll('#wrapper_menu', {
                    click: true
                });
		        //得到滚动y的位置
		        this.foodsScroll.on('scroll', (pos) => {
		          this.scrollY = Math.abs(Math.round(pos.y));         
		        });	  
		        this.foodsScroll.on('scroll', () => {
				  for (let i = 0; i < this.listHeight.length; i++) {
							let height1 = this.listHeight[i];
			          		let height2 = this.listHeight[i + 1];            	
						if(this.isSelect&&(!height2||(this.scrollY>=height1&&this.scrollY < height2))){
						 //当是最后一个，或者右侧滑动的距离，在某个区间		
						 this.selectIndext=i
					
						return  this.selectIndext
						 	}
						 }
						return  this.selectIndext
				})
		        
			},
			//计算右侧每一栏离顶部高度
			_calculateHeight(){		
				
				let fooList=this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				let height=0//初始每个食品列表离顶部高度
				this.listHeight.push(height)
				for(let i=0;i<fooList.length;i++){
					height+=fooList[i].clientHeight
					this.listHeight.push(height)
				}
				//初始化滚动插件
				this._initScroll();
			},
			//点击左边商品列表，右边滚动到相应位置
			selectMenu(index){
				this.isSelect=false
				 this.selectIndext=index
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
	        	let el = foodList[index];
	        	//插件的接口，滚动指定的高度。第一个参数是滚动的距离，第二个是时间，带动画效果
	        	this.foodsScroll.scrollToElement(el,300);
	        	this.foodsScroll.on('scrollEnd',()=>{
	        			setTimeout(()=>{      				
	        				this.isSelect=true
	        			},1000)
	       
	        	})
				},
			
				//点击查看食物详情
			selectFood(food,event){
					if (!event._constructed) {				
				          return;
				       }
		
				  this.selectedFood=food
						//调用food组件的方法
					this.$refs.food.show(food.id)
					
				},
		},
		computed:{
			//动态监听购物车显示与隐藏
				...mapGetters([
				       'cartShow','footShow'
				    ]),
				//选择购买食物
				selectFoods(){
					let foodsList=[]
					this.goods.forEach((good)=>{				
							if(good.count){
								//当用户选择增加食物food.count会改变，实现购物车与其联动
								foodsList.push(good)
						}					
					})					
					//localStorage.setItem('cartList',JSON.stringify(foodsList))
					return foodsList
				}	
		},
		components:{
			star,
			cart,
			cartcontrol,
			food,
/*			loading,*/
			footguide
		}
	/*	watch:{
			  //showLoading变化时说明组件已经获取初始化数据，在下一帧nextTick进行后续操作
            showLoading: function (value){
                if (!value) {
                    this.$nextTick(() => {						
					 //计算右侧离顶部高度,用于和左侧的菜单做个映射
					this._calculateHeight();
                    })
                }
            },
		}*/
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../assets/style/mixin";
  .header
    position: relative
    overflow: hidden
    color: #fff
    background: rgba(7, 17, 27, 0.2)
   .bulletin-wrapper
      position: relative
      height: 28px
      line-height: 28px
      padding: 0 25px 0 12px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      .notice
        padding-left:10px
      .bulletin-text,.notice
        vertical-align: top
        margin: 0 4px
        font-size: 0.6rem
      .icon-keyboard_arrow_right
        position: absolute
        font-size: 1rem
        right: 12px
        top: 0.13rem
/*     详细信息*/
    .detail
      position: fixed
      z-index: 100
      top: 0
      left: 0
      width: 100%
      height: 100%
      overflow: auto
      background: rgba(7, 17, 27, 0.8)
      backdrop-filter: blur(10px)
      &.fade-enter-active,&.fade-leave-active
        transition: all .5s  
      &.fade-enter,&.fade-leave-active
        opacity: 0
        background: rgba(7, 17, 27, 0)
      .detail-wrapper
        width: 100%
        min-height: 100%
        .detail-main
          padding-top: 64px
          padding-bottom: 64px
          .name
            line-height: 16px
            text-align: center
            font-size: 0.8rem
          .star-wrapper
            margin-top: 18px
            padding: 2px 0
            text-align: center
          .title
            display: flex
            width: 80%
            margin: 28px auto 24px auto
            .line
              flex: 1
              position: relative
              top: -6px
              border-bottom: 1px solid rgba(255, 255, 255, 0.2)
            .text
              padding: 0 12px
              font-size: 0.8rem

          .supports
            width: 80%
            margin: 0 auto
            .support-item
              padding: 0 12px
              margin-bottom: 12px
              font-size: 0
              &:last-child
                margin-bottom: 0           
              .text
                line-height: 16px
                font-size: 1rem
          .bulletin
            width: 80%
            margin: 0 auto
            .content
              padding: 0 12px
              line-height: 24px
              font-size: 0.7rem
      .detail-close
        position: relative
        width: 32px
        height: 32px
        margin: -64px auto 0 auto
        clear: both
        font-size: 32px	
/*商品*/
.goods
    display: flex
    position: absolute
    top: 30px
    bottom: 108px
    width: 100%
    overflow: hidden;
    .menu-wrapper
      flex: 0 0 3.8rem
      width: 3.8rem
      background: #f3f5f7
      .menu-item
        display: table
        padding: .7rem .3rem
        width: 3.8rem;
        box-sizing: border-box;
        border-bottom: .025rem solid rgba(7, 17, 27, 0.1);   
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          color:#3190e8
          border-left:2px solid #3190e8
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle         
          font-size: 0.6rem
          line-height:0.8rem
          text-align:center
    .foods-wrapper
      flex: 1
     .food-list
       background:#fff
	  .noData{
	  	height: 100px
	  	line-height: 100px
	  	color:#666;
	  	text-align: center
	  }
      .ttitle
        padding-left: 14px
        height: 1.5rem
        line-height: 1.5rem
        border-left: 2px solid #d9dde1
        font-size: 0.7rem
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin:18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
          position:relative
        .content
          flex: 1
          .name
            margin: 2px 0 10px 0
            font-size:0.7rem
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 0.6rem
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 40px
            .now
              margin-right: 8px
              font-size: 0.7rem
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 0.6rem
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px

img[lazy=loading]
	width:30px;
	height:30px;
	position: absolute;
	top: 0;left: 0;right: 0;bottom: 0;
	margin: auto;
	background: #f3f5f7
	
</style>