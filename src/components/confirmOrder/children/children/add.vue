 <template>
  <div class="rating_page">
        <head-top head-title="新增地址" go-back='true'></head-top>
        <section class="adddetail">
        	<form>
        		<section class="ui-padding-block">
        			<div class="input-new">
        				<input type="text" placeholder="请填写你的姓名" :class="{verifies:verify}" v-model="message" @input="inputThing">
        				<p v-if="verify">请填写您的姓名</p>
        			</div>
        			 <div class="input-new">
        				<input type="text" placeholder="请填写详细送餐地址" :class="{verifies:verifythree}" @input="inputThingthree" v-model="mesthree"/>
        				<p v-if="verifythree">{{sendaddress}}</p>
        			</div>
        			<div class="input-new">
        				<input type="text" placeholder="请填写能够联系到您的手机号" :class="{verifies:verifyfour}" v-model="telenum" @input="inputThingfour" />
        				<p v-if="verifyfour">{{telephone}}</p>
        			</div>
        		</section>
        		<section class="addbutton">
        			<button :class="{butopacity:butpart}" @click.prevent="submitThing">保存</button>
        		</section>
        	</form>
        </section>
<alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
    import headTop from '../../../header/head.vue'
    import alertTip from '../../../common/alertTip.vue'
     export default {
      data(){
            return{
    			verify:false,			//第一个输入框
    			verifythree:false,		//第三个输入框
    			verifyfour:false,		//第四个输入框
    			butpart:false,			//新增地址按钮的透明度
    			sendaddress:'',
    			message:'',
    			mesthree:'',
    			telenum:'',
    			telephone:'',
    			  showAlert: false, //显示提示组件
                alertText: null, //提示的内容
            }
       },
        components: {
            headTop,
 			alertTip
        },

        props:[],
        methods: {
        	   	 //关闭对话框
            closeTip(){
                this.showAlert = false;
            },
            inputThing(){
            	(!this.message) ? this.verify=true : this.verify=false;
            	this.bindThing()
            },
            inputThingthree(){
            	this.verifythree=true;
            	if(this.mesthree.length == 0){
            		this.sendaddress='请详细填写送餐地址';
            		
            	}else if(this.mesthree.length > 0 && this.mesthree.length <= 2){
            		this.sendaddress='送餐地址太短了，不能辨识';
            	}else{
            		this.sendaddress='';
            		this.verifythree=false;
            	}
            	this.bindThing()	
            },
            inputThingfour(){
            	this.verifyfour=true;
            	if((/^[1][358][0-9]{9}$/).test(this.telenum)){
            		this.verifyfour=false;
            	}else if(this.telenum == ''){
            		this.telephone="手机号不能为空"
            	}else{
            		this.telephone="请输入正确的手机号"
            	}
            	this.bindThing()
            },

            bindThing(){
            	if(this.message && this.mesthree && !this.verifyfour){
            		this.butpart=true;
            	}else{
            		this.butpart=false;
            	}
            },
            submitThing(){
          
            	//添加
				if(!this.message||!this.mesthree||!this.telenum){
          			this.showAlert = true;
                    this.alertText = '信息不完整';
                    return false
          			}
				if(!this.butpart){
					return false
				}
					      //增加信息
           	var _this=this;
            	  this.$http.post('/api/contact',{
                          name:_this.message,
                          phone:_this.telenum,
                          address:_this.mesthree,
                        },{//post请求必须有
                            emulateJSON:true
                        }).then(function(res){
					_this.showAlert = true;
                    _this.alertText = res.data.msg;
                   if(res.data.code==1){//成功更改
                      	setTimeout(() => {   
                      		
                      //通知address发生改变
                      _this.$bus.emit('addrAdd',res.data.data.contact);	
                       _this.showAlert = false;
						_this.$router.go(-1)
                   			 }, 1000)                      	
                        }
                        });
            }
        }
    }
</script>
  
<style lang="scss" scoped>
    @import '../../../../assets/style/mixin';
  .router-slid-enter-active, .router-slid-leave-active {
  	    transition: all .4s;
  	}
  	.router-slid-enter, .router-slid-leave-active {
  	    transform: translateX(100%);
  	}
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
    .adddetail{
    	margin-top:.4rem;
    }
    .ui-padding-block{
    	background:#fff;
    	padding-top:.4rem;
    	.add-detail{display:block;}
    	.input-new{
    		padding-bottom:.4rem;
    		input{
    			display:block;
    			width:15rem;
    			font-size:.6rem;
    			margin:0 auto;
    			padding:.3rem;
    			background:#f2f2f2;
    			@include borderRadius(3px);
    		}
    		.verifies{
				border-color:#ea3106;
    		}
    		p{
				@include sc(.55rem,#ea3106);
				padding-left:.5rem;
				margin-top:.2rem;
    		}
    	}
    	
    }
    .addbutton{
    	margin:.6rem auto;
    	width:15rem;
    	background:#3190e8;
    	@include borderRadius(3px);
    	button{
    		width:100%;
    		@include sc(.6rem,#fff);
    		line-height:1.6rem;
    		background:none;
    		font-weight:700;
    		border: none;
    		border-radius: 0.2rem;
    	}
    	.butopacity{
    		transition: all .4s;
    		opacity:1;
    	}
    }
</style>
