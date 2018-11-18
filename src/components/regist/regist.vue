<template>
    <div class="loginContainer">
        <head-top :head-title="profiletitle" goBack="true"> </head-top>
        <form class="loginForm" >
            <section class="input_container">
                <input type="text" placeholder="请输入用户名" v-model="userAccount">
            </section>
            <section class="input_container">
                <input v-if="!showPassword" type="password" placeholder="密码"  v-model="passWord">
                <input v-else type="text" placeholder="请输入密码"  v-model="passWord">
               <span class="icon-eyes" @click="changePassWordType"><img src="../../assets/img/eye.png"/></span>
            </section>
 			<section class="input_container">
                <input type="text" placeholder="请输入手机号" v-model="phoneNumber" @input="inputPhone">
            </section>
             <section class="input_container phone_number">
             	<input type="text" placeholder="请输入您的验证码" v-model="mobileCode">
                <button @click.prevent="getVerifyCode" :class="{right_phone_number:rightPhoneNumber}" v-show="!computedTime">获取验证码</button>
                <button  @click.prevent v-show="computedTime">已发送({{computedTime}}s)</button>
            </section>
       
        </form>
        <div class="login_container" @click="regist">注册</div>           
             <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    	</div>
</template>

<script>
 import headTop from './../header/head.vue'
 import alertTip from './../common/alertTip.vue'
    export default {
        data(){
            return {
                profiletitle: '注册', 
                showPassword: false, // 是否显示密码
                phoneNumber: null, //电话号码  
                mobileCode: null, //短信验证码
                 rightPhoneNumber: false, //输入的手机号码是否符合要求
                captcha_uuid: null, //获取短信时返回的验证值，注册时需要
                computedTime: 0, //倒数记时
                userInfo: null, //获取到的用户信息
                userAccount: null, //用户名
                passWord: null, //密码   
                 showAlert: false, //显示提示组件
                alertText: null, //提示的内容
            }
        },
        components: {
            headTop,
            alertTip
        },
        methods: {
        	//验证输入手机号是否合法
        	 inputPhone(){
                if(/^1\d{10}$/gi.test(this.phoneNumber)){
                    this.rightPhoneNumber = true;
                }else{
                    this.rightPhoneNumber = false;
                }
            },
            //获取验证码
            getVerifyCode(){
            	 if (this.rightPhoneNumber) {
                    this.computedTime = 30;
                    this.timer = setInterval(() => {
                        this.computedTime --;
                        if (this.computedTime == 0) {
                            clearInterval(this.timer)
                        }
                    }, 1000)
                     //取用户信息
               	var _this=this;
                    //请求获取验证码
                   this.$http.post('/api/public/sendSmsCaptcha',{
                            phone:_this.phoneNumber,
                        },{//post请求必须有
                            emulateJSON:true
                        }).then(function(res){
        
                          if(res.data){
                          	//成功访问地址
                          	_this.showAlert = true;
                        	_this.alertText = res.data.msg;
                          }
                           if(res.data.data){
                          	//成功获取验证码         
                          	_this.captcha_uuid=res.data.data.uuid
                          }
						
                        });
                }else{
                 if(!this.phoneNumber) {
                   this.showAlert = true;
                   this.alertText = '请输入手机号';
                     return
                  }else{
                  	this.showAlert = true;
                    this.alertText = '您输入的手机号格式不正确';
                    return	
                  }
                
                }
            },
        	//改变密码类型
         	changePassWordType(){
                this.showPassword = !this.showPassword;
            },
        	//登陆
           regist(){
           	//验证合法
           	  if (!this.userAccount) {
                        this.showAlert = true;
                        this.alertText = '用户名';
                        return
                    }else if(!this.passWord){
                        this.showAlert = true;
                        this.alertText = '请输入密码';
                        return
                    }else if(!this.mobileCode){
                        this.showAlert = true;
                        this.alertText = '请输入验证码';
                        return
                    }if(!this.phoneNumber) {
                   		this.showAlert = true;
                   	this.alertText = '请输入手机号';
                     return
                  	}else if(!(/^\d{6}$/gi.test(this.mobileCode))){
                        this.showAlert = true;
                        this.alertText = '短信验证码不正确';
                        return
                    }
                //注册
               	var _this=this;
               	  this.$http.post('/api/public/register',{
                            phone:_this.phoneNumber,
                            password:_this.passWord,
                            username:_this.userAccount,
                            captcha:_this.mobileCode,
                            captcha_uuid:_this.captcha_uuid
                        },{//post请求必须有
                            emulateJSON:true
                        }).then(function(res){                      	
                        _this.showAlert = true;
                        _this.alertText =res.data.msg;	
                        if(res.data.code==1){
                        	setTimeout(() => {
                        		_this.showAlert = false;
         					 _this.$router.go(-1)  
                   			 }, 1000)                       	
                        }
                        });

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
                 background-color: #999;
            }
            .right_phone_number{
                background-color: #3190e8;
            }
        }
        .phone_number{
            padding: .3rem .8rem;
        }
        .phone_number input{width: 60%;}
        .phone_number button{width: 30%;}
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
        background-color:#3190e8;
        padding: .5rem 0;
        border: 1px;
        border-radius: 0.15rem;
        text-align: center;

    }
    .change_to_text{
        background-color: #3190e8;
    }
    .to_forget,.to_regist{
        float: right;
        @include sc(.6rem, #3b95e9);
        margin-right: .3rem;
    }
</style>
