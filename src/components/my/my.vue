<template>
    <div class="profile_page">	
    	 <head-top :go-back='true' :head-title="profiletitle"></head-top>
        <section class="profile-number">    
        	<router-link :to="getUserinfo? '/my/info' : '/login'" class="profile-link">
        		<span class="privateImage-span" v-if="avatar">
                	<img :src="getFile(avatar)" class="privateImage ava" >
                </span>
                <span class="privateImage-span" v-else>
                    <img src="../../assets/img/user.png" class="privateImage def"> 
                </span>
                <div class="user-info">
                    <p>{{username}}</p>
                    <p>
                        <span class="user-icon">
	     						<i class="font font-shouji"></i>
	                    </span>
                        <span class="icon-mobile-number">{{mobile}}</span>
                    </p>
                </div>
                 <span class="arrow">
                     <i class="icon-keyboard_arrow_right"></i>
                </span>
            </router-link>
        </section>
        <section class="info-data">
            <ul class="clearfix">
            	<!-- <router-link to="/profile/benefit" tag="li" class="info-data-link">
                    <span class="info-data-top"><b>{{count}}</b>个</span>
                    <span class="info-data-bottom">我的优惠</span>
                </router-link>-->
                <li class="info-data-link">
                    <span class="info-data-top"><b>{{balance}}</b>元</span>
                    <span class="info-data-bottom">我的余额</span>
                </li>
              <!--  <li class="info-data-link">
                    <span class="info-data-top"><b>{{count}}</b>个</span>
                    <span class="info-data-bottom">我的优惠</span>
                </li>-->
                <li class="info-data-link">
                    <span class="info-data-top"><b>{{pointNumber}}</b>分</span>
                    <span class="info-data-bottom">我的积分</span>
                </li>
            </ul>
        </section>
        <section class="profile-1reTe">
            <!-- 我的订单 -->
            <router-link to='/order' class="myorder">
                <aside>
                    <i class="font font-bill"></i>
                </aside>
                <div class="myorder-div">
                    <span>我的订单</span>
                    <span class="myorder-divsvg">
                       <i class="icon-keyboard_arrow_right"></i>
                    </span>
                </div>
            </router-link>
            <!-- 积分商城 -->
            <router-link to='/order' class="myorder">
                <aside>
                    <i class="font font-jifen"></i>
                </aside>
                <div class="myorder-div">
                    <span>积分商城</span>
                    <span class="myorder-divsvg">
                       <i class="icon-keyboard_arrow_right"></i>
                    </span>
                </div>
            </router-link>
            <!-- 饿了么会员卡 -->
            <!--<router-link to='/vipcard' class="myorder">
                <aside>
                    <i class="vip"></i>
                </aside>
                <div class="myorder-div">
                    <span>饿了么会员卡</span>
                    <span class="myorder-divsvg">
                        <i class="icon-keyboard_arrow_right"></i>
                    </span>
                </div>
            </router-link>-->
        </section>
        <section class="profile-1reTe">
            <!-- 服务中心 -->
            <router-link to='/service' class="myorder">
                <aside>
                    <i class="font font-fuwu"></i>
                </aside>
                <div class="myorder-div">
                    <span>服务中心</span>
                    <span class="myorder-divsvg">
                         <i class="icon-keyboard_arrow_right"></i>
                    </span>
                </div>
            </router-link>
            <!-- 下载饿了么APP -->
          <!--  <router-link to='/download' class="myorder">
                <aside>
                    <i></i>
                </aside>
                <div class="myorder-div" style="border-bottom:0;">
                    <span>下载饿了么APP</span>
                    <span class="myorder-divsvg">
                        <i></i>
                    </span>
                </div>
            </router-link>-->
        </section>
        <footguide ></footguide>
        <transition name="router-slid">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
 import {getFile} from './../../assets/js/util';//导入获取图片方法
	 import headTop from './../header/head.vue'

	  import fetch from './../../assets/js/fetch'
	 	import footguide from './../common/footer'
	export default{
	data(){
        return{
            profiletitle: '我的',
            getUserinfo: {},        //得到数据 
            username: '登陆/注册',           //用户名
            resetname: '',
            mobile: '登陆后享受更多特权',             //电话号码
            balance: '0',            //我的余额
            count : '0',             //优惠券个数
            pointNumber : '0',       //积分数
            avatar: '',             //头像地址
            config:{
             width: '200px',
             height: '18px',
             background: '#ddd'
            }
            
        }
    },
  created(){
        	//接受来自子组件的事件
  			this.$bus.on('goOut', this.change);
  		 	this.$bus.on('userUpdate', this.update);
        },
    mounted(){
 		var token=window.localStorage.token
 		if(!token){
 			this.getUserinfo =null
 			this.avatar='' 
	    	this.username='登陆/注册'
	    	this.mobile='登陆后享受更多特权'
	    	this.balance='0'
	    	this.count='0'
	    	this.pointNumber='0'
 		}else{
 			
 				var user=JSON.parse(localStorage.user)  
	   			this.username =user.username
	   			this.balance =user.money
				this.avatar =user.avater 		
			    this.mobile =user.phone		   
			    this.count = user.gift_amount||0	
			     this.pointNumber =user.score
 			
 			//获取用户列表
	/*	fetch("/api/user").then((res)=>{		
			this.getUserinfo = res.data.data.user;				
   			this.username =this.getUserinfo.username
   			this.balance =this.getUserinfo.money
			this.avatar =this.getUserinfo.avater 		
		    this.mobile =this.getUserinfo.phone		   
	    this.count = this.getUserinfo.gift_amount||0	
		     this.pointNumber =this.getUserinfo.score
			})*/

 		}
		
   },

   methods:{
    	getFile,//传图片
    	change(){
			this.getUserinfo =null
	    	this.avatar='' 
	    	this.username='登陆/注册'
	    	this.mobile='登陆后享受更多特权'
	    	this.balance='0'
	    	this.count='0'
	    	this.pointNumber='0'
    	},
    	//用户信息改变
    	update(){
    		var user=JSON.parse(localStorage.user)  
   			this.username =user.username
   			this.balance =user.money
			this.avatar =user.avater 		
		    this.mobile =user.phone		   
		    this.count = user.gift_amount||0	
		     this.pointNumber =user.score
    	}
    },
	components:{
			headTop,
			footguide
		}
	}
</script>

<style lang="scss" scoped>
   @import '../../assets/style/mixin.scss'; 
    
    .profile_page{
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
   .profile-number{
        padding-top:1.95rem;
        .profile-link{
            display:block;
            display:flex;
            box-align: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            background:$blue;
            padding: .666667rem .6rem;
            .privateImage-span{
                display:inline-block;              
                border-radius:50%;
                vertical-align:middle;             
                .privateImage{
                    border-radius:50%;
                      padding:0.2rem;
                      box-sizing: border-box;
                    @include wh(1.6rem,1.6rem);
                }
                .def{
                	 background: #fff;
                }
                .ava{
                	padding:0
                }
            }
            .user-info{
                margin-left:.4rem;
                -webkit-box-flex: 1;
                -ms-flex-positive: 1;
                flex-grow: 1;
                p{
                	line-height: 1rem;
                    font-weight:700;
                    @include sc(0.7rem,$fc);
                    .user-icon{
                        @include wh(0.5rem,0.75rem);
                        display:inline-block;
                    
                        line-height:0.75rem;
                      
                    }
                    .icon-mobile-number{
                    	margin-left: 0.2rem;
                        display:inline-block;
                        @include sc(.7rem,$fc);
						
                    }
                }
                
            }
            .arrow{
                @include wh(.46667rem,.98rem);
                display:inline-block;
                i{
                	color:#fff
                }
            }
        }
   }
   .info-data{
        width:100%;
        background:$fc;
        box-sizing: border-box;     
        ul{
        	  display: flex;
            .info-data-link{
                flex:1;
                display:inline-block;
                padding: 0.6rem 0;
                border-right:1px solid #f1f1f1;
      
                span{
                    display:block;
                    width:100%;
                    text-align:center;
                }
                .info-data-top{
                    @include sc(.55rem,#333);
                    padding: 0 0 .3rem;
                    b{
                        display:inline-block;
                        @include sc(1rem,#f90);
                        font-weight:700;
                        line-height:1rem;
                        font-family: Helvetica Neue,Tahoma;
                    }
                }
                .info-data-bottom{
                    @include sc(.57333rem,#666);
                    font-weight:400;
                }
            }
            .info-data-link:nth-of-type(2){
                .info-data-top{
                    b{
                        color:#ff5f3e;
                    }
                }
               
            }
            .info-data-link:nth-of-type(3){
                border:0;
                .info-data-top{
                    b{
                        color:#6ac20b;
                    }
                }
            }
        }   
   }
   .profile-1reTe{
        margin-top:.4rem;
        background:$fc;
        .myorder{
            padding-left:1.6rem;
            display:flex;
            align-items: center;
            aside{
                @include wh(.7rem,.7rem);
                margin-left:-.866667rem;
                margin-right:.266667rem;
                display:flex;
                align-items: center;
                i{
                	display: inline-block;
                    @include wh(100%,100%);
                }
                
            }
            .myorder-div{
                width:100%;
                padding:.6rem .266667rem .6rem 0;
                @include sc(.7rem,#333);
                display:flex;
                justify-content:space-between;
                span{
                    display:block;
                    padding-right: 0.6rem;
                }
                .myorder-divsvg{
                    @include wh(.46667rem,.466667rem);
                 	i{
                 		color:#666;
                 		font-size: 0.8rem
                 	}
                }
            }
        }
        .myorder:nth-of-type(3) .myorder-div{
            border:0;
        }
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translateX(100%);
    }
    .font{font-size: 0.8rem}
    .font-bill,.font-fuwu,.font-jifen{
    	color:#3B95E9;
    	
    }
    .font-bill{font-size: 0.7rem}
    .font-fuwu{
    	font-size: 0.85rem;
    }
</style>








































