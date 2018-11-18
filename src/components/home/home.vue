<template>
	<div>

			<header class="header-bar">
		    	<div class="header-title">wemall商城</div>
		    </header>
		<div id="home">		
		   <div class="mint-swipe">
		    	  <mt-swipe :auto="0">
						  <mt-swipe-item v-for='(ad,index) in ads' :key=index v-if="ad.position.name=='幻灯片'">
						  	<img v-lazy="getFile(ad.file)"/>
						  </mt-swipe-item>
						</mt-swipe>
		    </div>
	
		  	<div class="mod-desc clearfix">
		  			<div class="mod-cnt" v-for='(ad,index) in ads' v-if="ad.position.name=='快捷菜单'">
		  				<a :href="ad.url">
		  					<div class="mod-icon">
		  						<img :src="getFile(ad.file)"/>
		  					</div>
		  					<div class="mod-txt">{{ad.name}}</div>
		  				</a>
		  			</div>

		  	</div>
		  	<section class="m-component-promotion" id="list-section">
		  		<div class="mod-title">热门活动</div>
		  		<ul class="list-unstyled">
		  			<li v-for='ad in ads'  v-if="ad.position.name=='首页广告'">
		  				<a @click=toUrl(ad.url)>
		  					<img class="page-lazyload-image" v-lazy="getFile(ad.file)"/>
		  				</a>
		  			</li>
		  			
		  		</ul>
		  	</section>
			<footguide></footguide>
		</div>
				</div>

</template>
<script type="text/javascript">
	import { Swipe, SwipeItem } from 'mint-ui';
	import {getFile} from './../../assets/js/util';//导入获取图片方法
import { Toast, Indicator } from 'mint-ui';
	import footguide from './../common/footer'
	export default{
	  data(){
	  	return{
	  		ads:[],//保存广告信息
	  		 showLoading: true, //显示加载动画
	  	}
	  },
	  components:{
	  	Swipe,
	  	SwipeItem,
	  	footguide
	  },
	  mounted(){
	  	Indicator.open('加载中...');
	  	var _this=this;
			//获取广告
		this.$http.get('/api/ads').then(function(res){
				_this.ads=res.data.data.ads	
				Indicator.close()
		})
	  },
	  methods:{
	  	 getFile,//获取图片

            //去广告的地方
            toUrl(url){
            	var reg = /[a-zA-z]+:\/\/[^\s]*/;
					if(reg.test(url)){
						location.href =url;
					}else{
					  this.$router.push({path:'/shop'})	
					 }
						/*else{
							this.$http.get('/api/search?keyword='+url).then((res)=>{
								var pro=res.data.data.product[0]
								localStorage.setItem('adPro',JSON.stringify(pro))
								this.$router.push({path:'/shop',query:{pro:pro}})	
							})
						}*/										
            }
	  }
	}
</script>
<style scoped>
	body{
		 background-color: #f5f5f0;	
	}
	#home{
		margin-top: 45px;
		margin-bottom: 60px;
	}
/*头部*/
	.header-bar{
	width: 100%;
	position: fixed;
	top: 0;
    height: 45px;
    z-index: 255;
    background-color: rgba(255, 255, 255, .9);
	}
	.header-title{
		text-align: center;
    line-height: 45px;
    width: 100%;
    position: absolute;
    font-size:0.8rem ;
	}
	/*轮播*/
	.mint-swipe{
		height: 180px;
		position: relative;
		background: #fff;
	}
.mint-swipe-item img{width: 100%;height:180px ;}
.mod-desc{

    position: relative;
    background-color: #fff;
}
.mod-desc .mod-cnt{
	  margin-top: 8px;
    width: 25%;
    float: left;
}

.mod-desc .mod-cnt .mod-icon {
    margin: 0 auto;
    height: 2rem;
    line-height: 2rem;
    width: 2rem;
    border-radius: 50%;
    text-align: center;
}

.mod-desc .mod-cnt .mod-icon img {
    width: 100%;
    height: auto;
    background: #fff;
}

.mod-desc .mod-cnt .mod-txt {
    margin: .6rem auto;
    text-align: center;
    color: #666;
    font-size: .60rem;
}
/*热门活动*/
#list-section{
 background-color: #FFFFFF;

}
#list-section a{
	height: 137px;
}
.m-component-promotion .mod-title{
	
    line-height: 1.5rem;
    font-size: 0.8rem;
    padding-left: .6rem;
    margin-top: 5px;
}
.list-unstyled{
	cursor: pointer;
	min-height: 350px;
}
.m-component-promotion > ul > li{
	margin: 0 0 1px;

}
.m-component-promotion > ul > li>a{
	  width: 96%;
    padding: 2%;
    position: relative; 
}
.list-unstyled img{
	height: 137px;
	  background: #fff;
}
.m-component-promotion .page-lazyload-image{
	  width: 100%;
	  }
img[lazy=loading]{
width:32px;
height: 32px;
position: absolute;
top: 0;left: 0;right: 0;bottom: 0;
margin: auto;

}

</style>































