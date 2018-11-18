<template>
	<div class="comment">
		 <header id='head_top'>
	        <section class="head_goback"  @click="close">
	            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
	                <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:2"/>
	            </svg>
	        </section>
	        <section class="title_head">
	            <span class="title_text">{{shopName}}</span>
	        </section>
	        <section class="title_wz" @click='publish'>
	            <span class="title_text">发布</span>
	        </section>
    	</header>
    <section class="select">
    	<p class="select_content">{{selectText}}</p>
    	<div class="select_star">
    		<span class="star-item" v-for='(itemClass,index) in itemClasses' :class="itemClass" :key="index" @click='select(index)'></span>
    	</div>
    </section>
    <section class="content">
    	<textarea placeholder="感觉这家店怎样？环境、服务、菜品，都还满意吗？来叨叨几句吧~" v-model='text'></textarea>
    </section>
    <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip> 
	</div>
</template>
<script type="text/javascript">
  import fetch from './../../assets/js/fetch'
   import alertTip from './../common/alertTip.vue'
  import { Toast } from 'mint-ui'//alert
	const selectTexts=['非常差不会再来','感觉很一般','满意，感觉不错','很满意，下次还要来','非常棒，值得推荐给朋友']
const LENGTH = 5;//个数
  const CLS_ON = 'on';//全星星
  const CLS_OFF = 'off';//无星星
	export default{
		data(){
			return{
				shopName:'',
				selectedIndex:-1,//选中星星的下标
				selectText:'感觉怎么样，打个评分吧',//对应选中的文字
				orderId:-1,//订单id
				text:'',//评论内容
				 showAlert: false, //显示提示组件
                alertText: null, //提示的内容
			}
		},
		created(){
			//商店名字
			this.shopName=JSON.parse(localStorage.seller).name
			this.orderId=this.$route.query.orderid
		},
		computed:{				
			//为星星的class赋值
			itemClasses(){
				var result=[]
				for (var i = 0; i <=this.selectedIndex; i++) {
	         	 	result.push(CLS_ON);//加入整星星
	        	}
				while (result.length < LENGTH) {
		          result.push(CLS_OFF);//加入无星星状态
		        }
	        	return result;	
			}
		},
		methods:{
			//选中某个星星
			select(index){
				this.selectedIndex=index
				this.selectText=selectTexts[index]
			},
			//发表评论
			publish(){
				if(this.selectedIndex==-1){
					Toast({
					  message: '亲，还没有评论哦',
					  duration: 2000
					});
					return false
				}
				fetch('/api/product/comment',{
					id:this.orderId,//订单号
					star:this.selectedIndex+1,//星星个数
					name:this.text//评论内容
				}).then((res)=>{

					if(res.data.code==1){
						this.showAlert = true;
                   		this.alertText = '评论成功!!!';
					}
				})	
			},
			close(){
				this.$router.go(-1)
			},
			 //关闭对话框
            closeTip(){
                this.showAlert = false;
                this.$router.go(-1)
            } 
		},
	 components: {
            alertTip
        },
	}
</script>
<style lang="scss" scoped>
   @import '../../assets/style/mixin.scss'; 
    #head_top{
        background-color: $blue;
        position: fixed;
        z-index: 100;
        left: 0;
        top: 0;
        @include wh(100%, 1.95rem);
    }
    .head_goback{
        left: 0.4rem;
        @include wh(0.6rem, 0.8rem);
        line-height: 2.2rem;
        margin-left: .4rem;
    }
    .title_head{
        @include center;
        width: 60%;
        color: #fff;    
    }
    .title_text{
            @include sc(0.8rem, #fff);
            text-align: center;
        }
    .title_wz{
        width: 15%;
        float:right;
        margin-top: -.4rem;
       
    }
    .select{
    	margin-top: 4rem;
    	.select_content{
    		text-align: center;
    		font-size: 0.8rem;
    		}
    	.select_star{
    		margin-top: 1rem;
    		padding: 0 3rem;
    		.star-item{
    			display: inline-block;   			
    			width: 20px;
		        height: 20px;
		        margin-right: 22px;		        
		        &:last-child{
		        	 margin-right: 0
		        }
         		&.on{        			
         			background:url(./star48_on.png)no-repeat;   
         			background-size: 20px 20px;     			
         		}
          		&.off{
          			background:url(./star48_off.png)no-repeat;
          			background-size: 20px 20px;  
          		}	
       
         
    		}
    	}
    }
 .content{
 	border-top: 1px solid #ccc;
 	margin-top: 1rem;
 	textarea{
 		width: 100%;
 		box-sizing: border-box;
 		height: 5rem;
 		border: none;
 		background-color:#f5f5f0;
 		padding: 0.4rem 0.6rem;
 		outline: none;
 		font-size: 0.8rem
 	}
 }   
</style>