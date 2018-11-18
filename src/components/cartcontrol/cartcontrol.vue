<template>
  <div class="cartcontrol">
  	<transition name="move">
	    <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
	      <span class="inner icon-remove_circle_outline"></span>
	    </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script>
  import Vue from 'vue';

  export default {
   	props:{
   		'food':Object
   	},

   	methods:{
   		//增加购买数量
   		addCart(event){
   			//避免pc上点击两次
   			 if (!event._constructed) {
	          return;
	        }

	        if (!this.food.count) {
	        	
	        	//增加不存在的属性，用 Vue.set才能生效
	          Vue.set(this.food, 'count', 1);
	          Vue.set(this.food, 'tolPrice', 1*this.food.price)
	 
	        } else {
	          this.food.count++;
	          this.food.tolPrice=(this.food.count*this.food.price).toFixed(2)
	         
	        }
	      this.$bus.emit('updataCart')
   		},
   		//减少购买数量
   		 decreaseCart(event) {
	        if (!event._constructed) {
	          return;
	        }
	        if (this.food.count) {
	          this.food.count--;
	          this.food.tolPrice=(this.food.count*this.food.price).toFixed(2)        
	          this.$bus.emit('updataCart')
	        }
	        
	      },
	      
	     
   	}
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      transition: all 0.3s linear
      opacity: 1
      .inner
          display: inline-block
          line-height: 24px
          font-size: 24px
          color: rgb(0, 160, 220)
      &.move-enter-active
        opacity: 1
        transform: translate3d(0, 0, 0)
        .inner
          display: inline-block
          line-height: 24px
          font-size: 24px
          color: rgb(0, 160, 220)
         
          transform: rotate(0)
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 0.6rem
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
</style>