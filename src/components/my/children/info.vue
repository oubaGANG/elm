<template>
    <div class="rating_page">
        <head-top head-title="账户信息" go-back='true'></head-top>
        <section class="profile-info">
            <section class="headportrait"> 
            	 <vue-core-image-upload :crop="false" class='profileinfopanel-upload' inputOfFile='image'
                	:url="baseUrl" extensions="png,gif,jpeg,jpg" :headers='token' text='' v-on:imageuploaded="imageuploaded">                		
                </vue-core-image-upload>
                <h2>头像</h2>
                <div class="headportrait-div">  
                	 <img :src="getFile(avatarinfo)" class="headportrait-div-top ava" v-if="this.avatarinfo">
                    <span class="headportrait-div-top" v-else>
                        <img src="../../../assets/img/user.png" class="privateImage def">  
                    </span>
                    <span class="headportrait-div-bottom avar_arr">
                       <i class="icon-keyboard_arrow_right"></i>
                    </span>
                </div>
            </section>
            <router-link to="/my/info/updateName" class="info-router">
                <section class="headportrait headportraitwo">
                    <h2>用户名</h2>
                    <div class="headportrait-div">
                        <p>{{username}}</p>
                        <span class="headportrait-div-bottom">
                            <i class="icon-keyboard_arrow_right"></i>
                        </span>
                    </div>
                </section>
            </router-link>
            <router-link to="/my/info/address" class="info-router">
                <section class="headportrait headportraitwo headportraithree">
                        <h2>收货地址</h2>
                        <div class="headportrait-div">
                        <span class="headportrait-div-bottom">
                            <i class="icon-keyboard_arrow_right"></i>
                            </span>
                        </div>
                </section>
            </router-link>
  <!--          <section class="bind-phone">
                账号绑定
            </section>
            <router-link to="" class="info-router">
                <section class="headportrait headportraitwo headportraithree">
                        <h2><img src="../../../assets/img/bindphone.png" style="display:inline-block;margin-right:.4rem;" alt="">手机</h2>
                        <div class="headportrait-div">
                            <p>{{infotel}}</p>
                            <span class="headportrait-div-bottom">
                               <i></i>
                            </span>
                        </div>
                </section>
            </router-link>-->
            <section class="bind-phone">
                安全设置
            </section>
            <router-link to="/forget" class="info-router">
                <section class="headportrait headportraitwo headportraithree">
                        <h2>登录密码</h2>
                        <div class="headportrait-div">
                            <p>修改</p>
                            <span class="headportrait-div-bottom">
                               <i class="icon-keyboard_arrow_right"></i>
                            </span>
                        </div>
                </section>
            </router-link>
            <section class="exitlogin" @click="exitlogin">退出登录</section>
        </section>
        <transition name="router-slid">
            <router-view></router-view>
        </transition>
         <confirm-tip v-if="show" :okText="'退出登录'" :alertText="'是否退出登录'" :isEnter='isEnter' :isLeave='isLeave' @waitingThing="waitingThing" @confirm="confirm"></confirm-tip>             
    </div>
</template>

<script>
 import {getFile} from './../../../assets/js/util';//导入获取图片方法
 import headTop from '../../../components/header/head'
 import confirmTip from './../../common/confirm.vue'
 import VueCoreImageUpload  from 'vue-core-image-upload';
    export default {
        data(){
            return{
                username:'',    //用户名
                infotel:'',     //用户手机
                getUsermes:{},  //用户信息
                avatarinfo:'',      //用户头像
                show:false,
                isEnter:true,
                isLeave:false, 
                baseUrl:'',
                token:''
            }
        },
        created(){
        	this.$bus.on('userUpdate', this.update);
        	this.baseUrl=localStorage.getItem('baseURL')+'api/avater'
        	this.token={Authorization:localStorage.token}
			this.getUsermes=JSON.parse(window.localStorage.getItem('user'))				
			this.username=this.getUsermes.username
			this.infotel=this.getUsermes.phone
			this.avatarinfo=this.getUsermes.avater				
        },

        beforeDestroy(){
            clearTimeout(this.timer)
        },
        components: {
            headTop, 
            confirmTip,
            VueCoreImageUpload
        },

        methods: {
			getFile,//获取图片
            exitlogin(){
                this.show=true;
                this.isEnter=true;
                this.isLeave=false;
            },
            waitingThing(){
                clearTimeout(this.timer)
                this.isEnter=false;
                this.isLeave=true;
                this.timer = setTimeout(() =>{
                    clearTimeout(this.timer)
                    this.show=false;
                },200)
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
	    	},
     		//图片上传成功
     		imageuploaded(res) {
               var user=JSON.parse(localStorage.user) 
               user.avater=res.data.file
               this.avatarinfo=res.data.file
               localStorage.setItem('user',JSON.stringify(user))
               this.$bus.emit('userUpdate')
           },
            //退出
            confirm(){
            	window.localStorage.clear()
        	this.$bus.emit('goOut');
               	//像action发送状态
              this.$store.dispatch('out_login')	
                this.waitingThing();
                this.$router.go(-1);
            },
        },

    }
</script>
  
<style lang="scss" scoped>
   @import '../../../assets/style/mixin.scss'; 

    .rating_page{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f2f2f2;
        z-index: 202;
        padding-top: 1.95rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .profile-info{
        @include wh(100%,3.1rem);
        .profileinfopanel-upload{
            display: block;
            position: absolute;
            opacity: 0;
            top: 2.35rem;
            left: 0;
            @include wh(100%,3.1rem);
        }
        .headportrait{
            margin-top:.4rem;
            padding:.5rem .4rem;
            @include fj(space-between);
            align-items:center;
            border-top:1px solid #eee;
            background:#fff;

            h2{
                @include sc(.6rem,#333);
                font-weight:500;
                display:flex;
                align-items:center;
            }
            .headportrait-div{
                span{
                    display:inline-block;

                }
                .ava{@include wh(1.6rem,1.6rem); }
                .headportrait-div-top{
                    @include borderRadius(50%);
                    float: left;
                    img{
                    	@include wh(1.6rem,1.6rem);                   	
                    	border-radius:50%;
                    	box-sizing: border-box;
                    	border: 1px solid #ccc;
                    	box-sizing: border-box;                   	
                    }
                    .def{
                    	padding: 6px;
                    }
                }
                .headportrait-div-bottom{
                    @include wh(.66667rem,1.4rem);
                    line-height: 1.4rem;        
                    i{
                    	 color:#7e8c8d              	                   
                    }
                }
                .avar_arr{height: 1.6rem;line-height: 1.6rem;}
            }
        }
        .headportraitwo{
            margin-top:0;
            padding:.3rem .4rem;
            .headportrait-div{
                @include fj(left) 
                p{
                    text-align:left;
                    line-height:1.39rem;
                    @include sc(.7rem,#999);
                    margin-right:.2rem;
                    font-family:Arial;
                }
                .headportrait-div-bottom{
                    top:0;
                }
            }
        }
        .headportraithree{
            border-bottom:1px solid #eee;
        }
        
        .bind-phone{
            padding:.8rem .4rem;
            @include sc(.6rem,#666);
        }
        .exitlogin{
           width:15rem;
            margin:1.3rem auto 0;
            line-height:1.5rem;
            @include borderRadius(3px);
            line-height:1.6rem;
    		background:none;
    		font-weight:700;
            text-align:center;
            background:#d8584a;
            @include sc(.6rem,#fff);

        }
        .exitlogin:active{
            opacity:.8;
            background:#C1C1C1;
        }
    }
    .info-router{
        display:block;
    }
  
.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
    transform: translateX(100%);
}
</style>
