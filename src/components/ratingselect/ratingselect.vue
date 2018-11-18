<!--评论列表-->
<template>
	 <div class="ratingselect">
	    <div class="rating-type border-1px">
	      <span  class="block positive" @click="select(2,$event)" :class="{'active':selectType.type===2}">{{desc.all}}<span
	          class="count">{{ratingsLength}}</span></span>
	      <span  class="block positive" @click="select(0,$event)" :class="{'active':selectType.type===0}">{{desc.positive}}<span
	          class="count">{{positives}}</span></span>
	      <span  class="block negative" @click="select(1,$event)" :class="{'active':selectType.type===1}">{{desc.negative}}<span
	          class="count">{{negative}}</span></span>
	    </div>
	    <div class="switch" @click="toggleContent" :class="{'on':onlyContent.cont}">
	      <span class="icon-check_circle"></span>
	      <span class="text">只看有内容的评价</span>
	    </div>
  </div>
</template>
<script type="text/javascript">
	  const POSITIVE = 0;//肯定
	  const NEGATIVE = 1;//吐槽
	  const ALL = 2;//全部评论
	export default{
		props: {
	      ratings: {//评论
	        type: Array,
	        default() {
	          return [];
	        }
	      },
	      selectType: {//选择评论种类	       
	        default: ALL
	      },
	      onlyContent: {//只看有内容的评价	        
	        default: false
	      },
	      desc: {//评论描述
	        type: Object,
	        default() {
	          return {
	            all: '全部',
	            positive: '满意',
	            negative: '不满意'
	          };
	        }
	      }
    	},
    
    	computed:{
    		//有多少个推荐评论
    		positives(){
    			let count=0
    		    this.ratings.filter((rating)=>{   				
    				if(rating.star>2){
    					count++
    				}   			
    			})   		
    			return count
    		},
    		ratingsLength(){
    			return this.ratings.length
    		},
    		//有多少个吐槽
    		negative(){
    			var count=0
    			 this.ratings.filter((rating)=>{
    				if(rating.star<=2){
    					count++
    				}   	
    			})
    			return count
    		}
    	},
    	methods:{
    		//选择的种类
    	 select(type, event){
    	 	if (!event._constructed) {
          		return;
	        }
	        this.selectType.type = type;
	       //像父级发送消息
	       this.$emit('changed')
	     },
	     //是否只查看有内容
	     toggleContent(){
	        this.onlyContent.cont = !this.onlyContent.cont;
	         //像父级发送消息
	       this.$emit('changed')
		     }
    	}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/style/mixin";

  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      font-size: 0
      .block
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        line-height: 16px
        border-radius: 1px
        font-size: 0.55rem
        color: rgb(77, 85, 93)
        &.active
          color: #fff
        .count
          margin-left: 2px
          font-size: 0.55rem
        &.positive
          background: rgba(0, 160, 220, 0.2)
          &.active
            background: rgb(0, 160, 220)
        &.negative
          background: rgba(77, 85, 93, 0.2)
          &.active
            background: rgb(77, 85, 93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      border-top: 1px solid rgba(7, 17, 27, 0.1)
      color: rgb(147, 153, 159)
      font-size: 0
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        display: inline-block
        vertical-align: top
        font-size:0.55rem
</style>