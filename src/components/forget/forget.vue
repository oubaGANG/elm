<template>
    <div class="restContainer">
        <head-top head-title="重置密码" goBack="true"></head-top>
        <form class="restForm">
            <section class="input_container phone_number">
                <input type="text" placeholder="手机号" name="phone" maxlength="11" v-model="phoneNumber" @input="inputPhone">
                <button @click.prevent="getVerifyCode" :class="{right_phone_number:rightPhoneNumber}" v-show="!computedTime">获取验证码</button>
                <button  @click.prevent.stop v-show="computedTime">已发送({{computedTime}}s)</button>
            </section>
            <section class="input_container">
                <input type="text" placeholder="请输入新密码" name="newPassWord" v-model="newPassWord">
            </section>
            <section class="input_container">
                <input type="text" placeholder="请确认密码" name="confirmPassWord" v-model="confirmPassWord">
            </section>
            <section class="input_container">
                <input type="text" placeholder="验证码" name="mobileCode" maxlength="6" v-model="mobileCode">
            </section>
        </form>
        <div class="login_container" @click="resetButton">确认修改</div>
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
    import headTop from '../../components/header/head'
    import alertTip from '../../components/common/alertTip'


    export default {
        data(){
            return {
                phoneNumber: null, //电话号码
                newPassWord: null, //新密码
                rightPhoneNumber: false, //输入的手机号码是否符合要求
                confirmPassWord: null, //确认密码
   				captcha_uuid: null, //获取短信时返回的验证值，改密码时需要
                mobileCode: null, //短信验证码
                computedTime: 0, //倒数记时
                showAlert: false, //显示提示组件
                alertText: null, //提示的内容
                accountType: 'mobile',//注册方式
            }
        },
        components: {
            headTop,
            alertTip,
        },
        methods: {
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
                }
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
                        	_this.captcha_uuid=res.data.data.uuid
                          }      				
                        });
            },

            //改密码
            resetButton(){
                if (!this.rightPhoneNumber) {
                    this.showAlert = true;
                    this.alertText = '请输入正确的手机号';
                    return
                }else if(!this.newPassWord){
                    this.showAlert = true;
                    this.alertText = '请输入新密码';
                    return
                }else if(!this.confirmPassWord){
                    this.showAlert = true;
                    this.alertText = '请输确认密码';
                    return
                }else if(this.newPassWord !== this.confirmPassWord){
                    this.showAlert = true;
                    this.alertText = '两次输入的密码不一致';
                    return
                }else if(!this.mobileCode){
                    this.showAlert = true;
                    this.alertText = '请输验证码';
                    return
                }
               	var _this=this;               
                        //改密码
                this.$http.post('/api/public/resetPassword',{
                            phone:_this.phoneNumber,
                            password:_this.newPassWord,
                            captcha:_this.mobileCode,
                            captcha_uuid:_this.captcha_uuid
                        },{//post请求必须有
                            emulateJSON:true
                        }).then(function(res){
					_this.showAlert = true;
                    _this.alertText = res.data.msg;
                      if(res.data.code==1){
                        	setTimeout(() => {
                        		_this.showAlert = false;
         					 _this.$router.go(-1)  
                   			 }, 1000)                       	
                       }
                        });            
            },
            closeTip(){
                this.showAlert = false;
            }   
        }
    }

</script>

<style lang="scss" scoped>
   @import '../../assets/style/mixin.scss';

    .restContainer{
        padding-top: 1.95rem;
    }
    .restForm{
        background-color: #fff;
        .input_container{
            display: flex;
            justify-content: space-between;
            padding: .6rem .8rem;
            border-bottom: 1px solid #f1f1f1;
            input{
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
        .phone_number input{
        	width: 60%;
        }
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
    .login_container{
        margin: 1rem .5rem;
        @include sc(.7rem, #fff);
        background-color: #3190e8;
        padding: .5rem 0;
        border: 1px;
        border-radius: 0.15rem;
        text-align: center;
    }
</style>
