<template>
	<footer class="navigation-wrap">
				<div class="navigation-item">
					<router-link to='/home' active-class="active">
						<div class="icon-home"></div>
						<p>首页</p>
					</router-link>				
				</div>
			<div class="navigation-item">
				<router-link to='/shop' active-class="active">
						<div class="icon-shop"></div>
						<p>全部商品</p>
				</router-link>
				</div>
				<div class="navigation-item">
					<router-link to='/order' active-class="active">
						<div class="icon-order"></div>
						<p>订单</p>
					</router-link>					
				</div>
				<div class="navigation-item">
					<router-link to='/my' active-class="active">
						<div class="icon-my"></div>
						<p>我的</p>
					</router-link>					
				</div>
		</footer>
</template><script type="text/javascript">
	export default{
		
	}
</script>
<style scoped>
	.navigation-wrap{
	position: fixed;
	bottom: 0px;
  height: 60px;
  width: 100%;
    display: -webkit-box;
    -webkit-box: horizontal;
    -webkit-box-align: center;
  border-top: 1px solid #eee;
  background-color: rgba(255, 255, 255, 1);
  z-index: 100;
}
.navigation-item {
    position: relative;
    font-size: 13px;
    text-align: center;
    cursor: pointer;
        -webkit-box-flex: 1;
    -webkit-box-pack: center;
    display:box;
      -webkit-box-orient: vertical;
    -webkit-box-align: center;
}
.navigation-item a.active .icon-home{
	background-image: url(../../assets/img/home2.jpg); 
}
.navigation-item a.active .icon-shop{
	background-image: url(../../assets/img/shop2.jpg); 
}
.navigation-item a.active .icon-order{
	background-image: url(../../assets/img/order2.png); 
}
.navigation-item a.active .icon-my{
	background-image: url(../../assets/img/my2.jpg); 
}
.navigation-item a.active p{
	color:#3190e8;
}
[class^=icon-], [class*=" icon-"] {
    font-family: -webkit-pictograph;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
     width: 25px;
    height: 25px;
    margin: 0 auto;
     background-size: 100%;
    margin-bottom: 5px;
}
.icon-home{ 
    background-image: url(../../assets/img/home.png);  
}
.icon-shop{ 
    background-image: url(../../assets/img/shops.png);  
}
.icon-order{ 
    background-image: url(../../assets/img/order.png);  
}
.icon-my{ 
    background-image: url(../../assets/img/my.png);  
}
.navigation-item p{color: #000;}
</style>