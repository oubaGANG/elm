<template>
    <div class="loginContainer">
        <head-top :head-title="profiletitle" goBack="true" :hide='true'> </head-top>
        <form class="loginForm" >
            <section class="input_container">
                <input type="text" placeholder="手机号" v-model="userAccount">
            </section>
            <section class="input_container">
                <input v-if="!showPassword" type="password" placeholder="密码"  v-model="passWord">
                <input v-else type="text" placeholder="密码"  v-model="passWord">
                <span class="icon-eyes" @click="changePassWordType"><img src="../../assets/img/eye.png"/></span>
            </section>

        </form>
        <div class="login_container" @click="login">登录</div>
             <router-link to="/regist" class="to_regist" >免费注册</router-link> 
            <router-link to="/forget" class="to_forget" >忘记密码</router-link>   
            	<!--微信登陆-->
        <div class="other-login">    	
        	<div class="other-login-title">
	  				<span class="title-msg">使用合作账号登录</span>
	  			</div>
	  			<ul class="dis-box">
	  				<li class="box-flex">
	  					<span class="log-icon" @click="wxlogin"></span>
	  				</li>
	  			</ul>
	  	</div>

             <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>               
    </div>
</template>

<script>
 import headTop from './../header/head.vue'
 import alertTip from './../common/alertTip.vue'
    export default {
        data(){
            return {
                profiletitle: '登录', 
                showPassword: false, // 是否显示密码
                phoneNumber: null, //电话号码     
                userInfo: null, //获取到的用户信息
                userAccount: null, //用户名
                passWord: null, //密码   
                 showAlert: false, //显示提示组件
                alertText: null, //提示的内容
            }
        },
        created(){
        	this.$bus.on('close', this.close)
        },
        components: {
            headTop,
            alertTip
        },
        methods: {
        	//改变密码类型
         	changePassWordType(){
                this.showPassword = !this.showPassword;
            },
        	//登陆
           login(){
           	//验证合法
           	 if (!this.userAccount) {
                   this.showAlert = true;
                   this.alertText = '请输入手机号/邮箱/用户名';
                     return
                }else if(!this.passWord){
                    this.showAlert = true;
                    this.alertText = '请输入密码';
                    return
                }
     
                
                //取用户信息
               	var _this=this;
               	  this.$http.post('/api/public/login',{
                            phone:_this.userAccount,
                            password:_this.passWord
                        },{//post请求必须有
                            emulateJSON:true
                        }).then(function(res){

                    if(res.data.code==1){//成功登陆
                        	setTimeout(() => {
              
// 				axios.defaults.headers.common['Authorization'] =res.data.data.token;  
   				window.localStorage.setItem('token',res.data.data.token)
                        	_this.userInfo=res.data.data.user;
                        	//像action发送状态
                        	_this.$store.dispatch('record_userinfo',_this.userInfo)	
                        	_this.$store.dispatch('showFoot')
                        	//保存登陆的用户
                        	window.localStorage.setItem('user',JSON.stringify(_this.userInfo))
         					_this.showAlert = false;
         					_this.$router.push('/my')
                   			 }, 1000)                       	
                        }else{
                        _this.showAlert = true;
                    	_this.alertText = res.data.msg;
                        }
                        });       
           },
           //微信登陆
           wxlogin(){
           		location.href = '/static/oauth.html#/?redirect=' + encodeURIComponent(location.origin + '/app#/my');
           },
           //离开时发送底部显示
           close(){
           		this.$store.dispatch('showFoot')
           		this.$router.push('/my')
           },
           //关闭对话框
            closeTip(){
                this.showAlert = false;
            } 
        }
    }

</script>

<style lang="scss" scoped>
   @import '../../assets/style/mixin.scss'; 

    .loginContainer{
        padding-top: 1.95rem;
        p, span, input{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .change_login{
        position: absolute;
        @include ct;
        right: 0.75rem;
        @include sc(.7rem, #fff);
    }

    .loginForm{
        background-color: #fff;
        .input_container{
            display: flex;
            justify-content: space-between;
            padding: .6rem .8rem;
            border-bottom: 1px solid #f1f1f1;
            input{
            	width: 60%;
                @include sc(.7rem, #666);
            }
            button{
                @include sc(.65rem, #fff);
                font-family: Helvetica Neue,Tahoma,Arial;
                padding: .28rem .4rem;
                border: 1px;
                border-radius: 0.15rem;
            }
            .right_phone_number{
                background-color: #4cd964;
            }
        }
        .phone_number{
            padding: .3rem .8rem;
        }
        .captcha_code_container{
            height: 2.2rem;
            .img_change_img{
                display: flex;
                align-items: center;
                img{
                    @include wh(3.5rem, 1.5rem);
                    margin-right: .2rem;
                }
                .change_img{
                    display: flex;
                    flex-direction: 'column';
                    flex-wrap: wrap;
                    width: 2rem;
                    justify-content: center;
                    p{
                        @include sc(.55rem, #666);
                    }
                    p:nth-of-type(2){
                        color: #3b95e9;
                        margin-top: .2rem;
                    }
                }
            }
        }
    }
    .login_tips{
        @include sc(.5rem, #999);
        padding: .4rem .6rem;
        line-height: .7rem;
        a{
            color: #3b95e9;
        }
    }
    .login_container{
        margin: 1rem .5rem 1rem;
        @include sc(.7rem, #fff);
        background-color: #3190e8;
        padding: .5rem 0;
        border: 1px;
        border-radius: 0.15rem;
        text-align: center;

    }

    .change_to_text{
        background-color: #4cd964;
    }
    .to_forget,.to_regist{
        float: right;
        @include sc(.6rem, #3b95e9);
        margin-right: .3rem;
    }
   .other-login{
   		margin-top:4rem ;
   }
 .other-login-title{

		text-align: center;
	}
	.title-msg{
	    padding: 6px;
	    font-size: 0.8rem;
	}
	.dis-box{
		margin-top: 30px;
	}
	.dis-box .box-flex{
		text-align: center;
	}
	.log-icon{
		display: inline-block;
		width: 60px;
		height: 60px;
		background: url('../../assets/img/weixin.png') no-repeat;
		background-size: 60px 60px;
	}

</style>
