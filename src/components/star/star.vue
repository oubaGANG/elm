<template>
  <div class="star" :class="starType">
     <span v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-item" :key="index"></span>
  </div>
</template>
<script>
	const LENGTH = 5;//个数
  const CLS_ON = 'on';//全星星
 const CLS_HALF = 'half';//半星星
  const CLS_OFF = 'off';//无星星
  export default{
  	//获取从父级得来的数据
  	props:{
  		size:{//星星大小
  			type:Number
  		},
      score:{//评分
  			type:Number
  		}
  	},
  	computed:{
  		starType(){//星星大小
  			return 'star-'+this.size
  		},
  		itemClasses(){//星星形状
  			var result=[]
  			//可以得出小数（4舍5入），比如原来3.6分，计算后是3.5而3.2计算后为3
  			var score=Math.floor(this.score*2)/2
  			var hasDecimal=score%1!=0//判断分数是否有小数
  			var integer=Math.floor(this.score)//得出整星有几个
  			 for (var i = 0; i < integer; i++) {
         	 	result.push(CLS_ON);//加入整星星
        	}
  			 if (hasDecimal) {
	          result.push(CLS_HALF);//加入半星
	        }
	  		while (result.length < LENGTH) {
	          result.push(CLS_OFF);//加入无星星状态
	        }
        return result;
  		}
  	}
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/style/mixin";

  .star
    font-size: 0
    .star-item
      display: inline-block
      background-repeat: no-repeat
    &.star-48
      .star-item
        width: 20px
        height: 20px
        margin-right: 22px
        background-size: 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star48_on')
        &.half
          bg-image('star48_half')
        &.off
          bg-image('star48_off')
    &.star-36
      .star-item
        width: 15px
        height: 15px
        margin-right: 6px
        background-size: 15px 15px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star36_on')
        &.half
          bg-image('star36_half')
        &.off
          bg-image('star36_off')
    &.star-24
      .star-item
        width: 10px
        height: 10px
        margin-right: 3px
        background-size: 10px 10px
        &:last-child
          margin-right: 0
        &.on
          bg-image('star24_on')
        &.half
          bg-image('star24_half')
        &.off
          bg-image('star24_off')
</style>

































