 <template>
  <div class="rating_page" v-show='show'>
        <head-top :head-title="'编辑地址'" :go-back='true' :hide='true' :del='true' @delt='del' :toAddr='true'></head-top>
        <section class="adddetail">
        	<form>
        		<section class="ui-padding-block">
        			<div class="input-new">
        				<input type="text" placeholder="请填写你的姓名" :class="{verifies:verify}" v-model="info.name" @input="inputThing">
        				<p v-if="verify">请填写您的姓名</p>
        			</div>
        			 <div class="input-new">
        				<input type="text" placeholder="请填写详细送餐地址" :class="{verifies:verifythree}" @input="inputThingthree" v-model="info.address"/>
        				<p v-if="verifythree">{{sendaddress}}</p>
        			</div>
        			<div class="input-new">
        				<input type="text" placeholder="请填写能够联系到您的手机号" :class="{verifies:verifyfour}" v-model="info.phone" @input="inputThingfour" />
        				<p v-if="verifyfour">{{telephone}}</p>
        			</div>

        		</section>
        		<section class="addbutton">
        			<button :class="{butopacity:butpart}" @click.prevent="submitThing">编辑完成</button>
        		</section>
        	</form>
        </section>
    
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
    import headTop from '../../../header/head'
     import alertTip from '../../../common/alertTip.vue'
      import fetch from '../../../../assets/js/fetch'
    export default {
    	props:{
    		'info':Object
    	},
      data(){
            return{
    			verify:false,			//第一个输入框
    			verifythree:false,		//第三个输入框
    			verifyfour:false,		//第四个输入框				
    			butpart:false,			//新增地址按钮的透明度
    			show:false,//是否显示
    			sendaddress:'',
    			telephone:'',
            	showAlert: false, //显示提示组件
                alertText: null, //提示的内容
                uid:'',//用户id
                index:-1
            }
        },
        created(){
        	//接受来自子组件的事件
  			this.$bus.on('close', this.theHide);
        },
		
        components: {
            headTop,
            alertTip
        },

        methods: {
        	 //关闭对话框
            closeTip(){
                this.showAlert = false;
            },
        	//点击显示
        	theShow(num){
        		this.show=true
        		this.index=num
        	},
        	//隐藏
        	theHide(){
        		this.show=false        	
        	},
        	//检测是否输入了内容
            inputThing(){
            	(!this.info.name) ? this.verify=true : this.verify=false;
            	this.bindThing()
            },
            //检测输入的地址是否合法
            inputThingthree(){
            	this.verifythree=true;
            	if(this.info.address.length == 0){
            		this.sendaddress='请详细填写送餐地址';
            		
            	}else if(this.info.address.length > 0 && this.info.address.length <= 2){
            		this.sendaddress='送餐地址太短了，不能辨识';
            	}else{
            		this.sendaddress='';
            		this.verifythree=false;
            	}
            	this.bindThing()	
            },
            //删除该地址
            del(){
            	console.log('---'+this.info.id)
				fetch('/api/contact/',{
	                id:this.info.id,
	                status:0
	              }).then((res) => {
	                     if(res.data.code==1){//成功删除	                
	                       	this.$bus.emit('deleteAddr',this.index)
	                         this.theHide();	                    	                       
	                    }
	                }); 
            },
            //检测手机号
            inputThingfour(){
            	this.verifyfour=true;
            	if((/^[1][358][0-9]{9}$/).test(this.info.phone)){
            		this.verifyfour=false;
            	}else if(this.info.phone == ''){
            		this.telephone="手机号不能为空"
            	}else{
            		this.telephone="请输入正确的手机号"
            	}
            	this.bindThing()
            },
            bindThing(){
            	if(this.info.name && this.info.address && !this.verifyfour){
            		this.butpart=true;
            	}else{
            		this.butpart=false;
            	}
            },
            //提交编辑
            submitThing(){ 

          		if(!this.info.name||!this.info.address||!this.info.phone){
          			this.showAlert = true;
                    this.alertText = '信息不完整';
                    return false
          		}
          		if(!this.butpart){
					return false
				}
            		      //取用户信息
               	var _this=this;
               	  this.$http.post('/api/contact',{
               	  		 id:_this.info.id,
                          name:_this.info.name,
                          phone:_this.info.phone,
                          address:_this.info.address,
                        },{//post请求必须有
                            emulateJSON:true
                        }).then(function(res){
					_this.showAlert = true;
                    _this.alertText = res.data.msg;
                   if(res.data.code==1){//成功更改
                      	setTimeout(() => { 
                      	_this.showAlert = false;
         				_this.theHide()
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
    			border:1px solid #ddd;
    			@include borderRadius(3px);
    		}
    		.verifies{
				border-color:#ea3106;
    		}
    		p{
				@include sc(.4rem,#ea3106);
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
    		border-radius: 0.2rem;
    		border: none;
    	}
    	.butopacity{
    		transition: all .4s;
    		opacity:1;
    	}
    }
</style>
