<template>
<transition name="move">
 <div class="food" v-show='showFlag' >	
 	  <head-top :go-back='true' :head-title="food.name" :foodClose='true'></head-top>
 	 <div class="foodWrap" ref='food'>
 	  	<div class="food-content">   	 
      <div class="image-header">
        <img :src="getFile(food.file)">
<!--        <div class="back" @click='hide'>
          <i class="icon-arrow_lift"></i>
        </div>-->
      </div>
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
<!--        <div class="detail">
          <span class="sell-count">月售份{{food.sellCount}}</span>
          <span class="rating">好评率{{food.rating}}%</span>
        </div>-->
        <div class="price">
          <span class="now">￥{{food.price}}</span><span class="old" v-show='food.oldPrice'>￥{{food.oldPrice}}</span>
        </div>
        <div class="cartcontrol-wrapper">
        	<cartcontrol :food="food"></cartcontrol>
        </div>
     
        
      </div>
      <split v-show="food.info"></split>
      <div class="info" v-show='food.info'>
        <h1 class="title">商品信息</h1>
        <p class="text">{{food.info}}</p>
      </div>
    <split></split>
      <div class="rating">
        <h1 class="title">商品评价</h1>
       <!--	评论选择-->
        <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc"
                      :ratings="ratings" @changed='dataChange'></ratingselect>
       <div class="rating-wrapper">
          <ul v-if="ratings &&ratings.length">
          <!--	评论列表-->
            <li v-for="rating in ratings" v-show="needShow(rating.star,rating.name)"
                class="rating-item border-1px">
              <div class="user_avater" v-if='rating.user'>
              	  <img class="avater" width="12" height="12" src="../../assets/img/user.png" v-if='!rating.user.avater'> 
              	<img class="avater" width="12" height="12" :src="getFile(rating.user.avater)" v-else>               
              </div>
              <div class="user" v-if='rating.user'>
                <span class="name">{{rating.user.username}}</span>                
              </div>
              <div class="time">{{rating.created_at}}</div>
              <p class="text">
                <span :class="{'icon-thumb_up':rating.star>=3,'icon-thumb_down':rating.star<=2}"></span>{{rating.name}}
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!ratings || !ratings.length">暂无评价</div>
        </div>
      </div>
    </div> 	
 	  </div>
    
  	</div>
</transition>
</template>
<script type="text/javascript">
 import BScroll from 'better-scroll';
 import cartcontrol from './../cartcontrol/cartcontrol.vue'
 import ratingselect from './../ratingselect/ratingselect.vue'
 import split from './../split/split.vue'
  import {getFile} from './../../assets/js/util';//导入获取图片方法
 import headTop from './../header/head.vue'
 import Vue from 'vue';
 	const ALL = 2;//默认选择评论类型 查看全部
	export default{
		props:{
			'food':Object,
		},
		data(){
			return{
				showFlag:false,//商情页面显示或隐藏
				selectType:{
					type:ALL
				},//选择有内容
		        onlyContent: {
		        	cont:true
		        },//只看有内容的评价
		        desc: {//评论描述
		          all: '全部',
		          positive: '推荐',
		          negative: '吐槽'
		        },
		        ratings:[]//评论
			}
		},
		 created(){
        	//接受来自子组件的事件
  			this.$bus.on('foodClose', this.hide); 
       },
		methods:{
			getFile,//获取图片
			//商情页面显示
			show(id,isAd){
				this.showFlag = true;
		        this.selectType.type = ALL;
		        this.onlyContent.cont = true;
		       //初始化评论列表
		        this.initData(id)
		  
			},
			initData(id){
				//获取商品评论
				this.$http.get('/api/product/comment/'+id,).then((res)=>{
					this.ratings=res.data.data.comment
					 this.$nextTick(() => {						
						if (!this.scroll) {
			            this.scroll = new BScroll(this.$refs.food, {
			              click: true
			            });
			         } else {
			            this.scroll.refresh();		          
			          }	
                    })
				})
			},
			//商情页面隐藏
			hide(){
				this.showFlag=false
			},
			//增加商品
			addFirst(){							
				 Vue.set(this.food, 'count', 1);
			},
			//监听列表显示的情况
			needShow(type, text){
				//选择了只看有内容的
				if (this.onlyContent.cont && !text) {					
		          return false;
		        } 
		        if (this.selectType.type === ALL) {		        	
		          return true;
		        } else {	
		        	if(type<=2){
		        		type=1//推荐
		        	}else{
		        		type=0//吐槽
		        	}
		          return type === this.selectType.type;
		        }				 
			},
			//接受子级传来的事件
			dataChange(){
				
				 this.$nextTick(() => {
				 	//滚动页面刷新
		          this.scroll.refresh();
		        });
			}
		},
		components:{
			cartcontrol,
			ratingselect,
			split,
			headTop
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../assets/style/mixin";

  .food
    position: fixed
    left: 0
    top:0
    bottom:105px
    z-index:30
    width: 100%
    background: #fff 
    &.move-enter-active,&.move-leave-active
      transition: all .4s linear
    &.move-enter,&.move-leave-active   
      transform: translate3d(100%, 0, 0)
    .foodWrap
     position: fixed
     left: 0
     top:1.95rem
     bottom:0
     z-index:30
     width: 100%
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size:0.65rem
        font-weight: 700
        color: rgb(7, 17, 27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        .sell-count, .rating
          font-size: 0.6rem
          color: rgb(147, 153, 159)
        .sell-count
          margin-right: 12px
      .price
        font-weight: 700
        line-height: 24px
        .now
          margin-right: 8px
          font-size: 0.65rem
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: 0.6rem
        color: #fff
        background: rgb(0, 160, 220)
        &.fade-enter-active
          transition: all 0.3s
          opacity: 1
        &.fade-enter, &.fade-leave-active
          opacity: 0
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7, 17, 27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 0.65rem
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user_avater
              float:left
              margin-right:0.3rem
          	 .avater
          	   width:1rem
          	   height:1rem
          	   border-radius: 50%;
          .user
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 0.55rem
              color: rgb(147, 153, 159)                         
          .time
            position: absolute
           	right: 0
            top: 16px          	
            margin-bottom: 6px
            line-height: 0.6rem
            font-size: 0.55rem
            color: rgb(147, 153, 159)
          .text
            margin-top:0.2rem
            line-height:0.7rem
            font-size:0.6rem
            color: rgb(7, 17, 27)
            .icon-thumb_up, .icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: 0.6rem
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)

        .no-rating
          padding: 16px 0
          font-size: 0.55rem
          color: rgb(147, 153, 159)
</style>

























