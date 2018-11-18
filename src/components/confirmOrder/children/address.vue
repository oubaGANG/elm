 <template>
  	<div class="rating_page">
        <head-top head-title="收货地址" go-back='true'></head-top>
        <section class="address">
        	<ul class="addresslist">
        		<li v-for="(item,index) in addrList" @click='send(item)'>
        			<div class="row-left">
        				 <span :class="{checkmark: selId == item.id,pradio: selId != item.id}" class="checkbox"></span>
        			</div>
        			<div class="row-right">      			
        				<p><span>{{item.name}}</span><span class="phone">{{item.phone}}</span></p>
        					<p>{{item.address}}</p>
        			</div>  
        			<div class="deletesite">
        				<span @click.stop="edit(item,index)">
        					<i class="font font-edit"></i>
        				</span>
        			</div> 
        		</li>
        	</ul>
			<router-link to='/confirmOrder/address/add'>
				<div class="addsite">
						<span>新增地址</span>
						<span class="addsvg">
							 <i class="icon-keyboard_arrow_right"></i>
						</span>
				</div>
			</router-link>
        </section>
         <transition name="router-slid">
         	<edit ref='edit' :info='selectedItem'></edit>                  
        </transition>
  		     <router-view></router-view> 
  		     
  	</div>
  
</template>

<script>
    import headTop from '../../header/head'
    import fetch from '../../../assets/js/fetch'
    import edit from './children/edit'
    export default {
      data(){
            return{
    			adressList:[],
    			selectedItem:{},
    			selId:-1//选择的地址id
            }
        },
        created(){
        	//接受add发送的增加地址命令
        	this.$bus.on('addrAdd', this.Addaddr);
        	this.$bus.on('deleteAddr', this.deleteAddr);
	
			this.selId=this.$route.query.addrId	
				fetch('/api/contact/').then((res)=>{
					if(res.data.code==1){				
						this.adressList=res.data.data.contact						
						if(this.selId==-1){
							if(this.adressList.length>0){
								this.selId=this.adressList[0].id
							}
							
						}
					}
			})
		
        },
        components: {
            headTop,
            edit
        },
		computed:{
			addrList(){
				return this.adressList
			}
		},
        methods: {      
            //增加地址
            Addaddr(item){
            	this.adressList.push(item)
            	if(this.adressList.length==1){
            		this.selId=this.adressList[0].id
            	}
           		
            },
             //打开编辑页面
            edit(item,index){  
	            this.selectedItem=item
	           	this.$refs.edit.theShow(index)
            },
            //发送地址到确认订单
            send(item){ 
            	this.selId=item.id
            /*	this.$bus.emit('sendAddr', item);*/
           	this.$store.dispatch('sendAddr',item)
            	this.$router.go(-1)
            },
            //删除地址
			deleteAddr(index){
				this.adressList.splice(index,1)
			}
        }
    }
</script>
  
<style lang="scss" scoped>
    @import '../../../assets/style/mixin';
  
    .rating_page{
        position:fixed;
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
    .edit{
    	right: 0.4rem;
        @include sc(0.7rem, #fff);
        @include ct;
    }
    .address{
    	width:100%;
    	margin-top:.4rem;
    	.addresslist{
    		background:#fff;
    		li{
    			border-bottom:1px solid rgb(238, 238, 238);
    			padding:.4rem;
    			@include fj(space-between);
    			p{
    				line-height:.9rem;
    				@include sc(.6rem,#333);
    				span{
    					display:inline-block;
    					@include sc(.6rem,#333);
    					&.phone{padding-left: 0.3rem;}
    				}
    				
    			}
    			.deletesite{
    				display:flex;
    				align-items:center;
    				span{
    					display:block;
    					@include sc(.8rem,#3190e8);
    					.font-edit{
    						font-size: 0.8rem;
    					}
    				}
    			}
    			.deletesite{
    				display:flex;
    				align-items:center;
    				span{
    					display:block;
    					@include sc(.8rem,#999);
    					
    				}
    			}
    		}
    	}
    	.addsite{
    		margin-top:.4rem;
    		background:#fff;
    		padding:.2rem .4rem;
    		@include fj(space-between);
    		span{
    			display:block;
    			@include sc(.7rem,#333);
    			line-height:1.4rem;
    		}
    		.addsvg{
    			@include wh(.66667rem,1.4rem);
    		
    		}
    	}
    }
 .row-left{
 	width: 2.5rem;
	position: relative;
 }
 .addresslist .checkbox{
 	    margin:auto;
         left:0;
    	right:0;
   		top: 0;
     	bottom: 0;
        position: absolute;
 }
 .addresslist .pradio {
        width: 20px;
        height: 20px;
        border: 1px solid #cbcbd0;
        border-radius: 50%;   
    }

.addresslist .checkmark {
        display:block;
        width: 22px;
        height: 22px;
     background: url(http://web1.waimai.bdimg.com/static/mwaimai/images/checkmark_35c19cc.png) no-repeat center;
        background-size: 22px;

    }
 .row-right{
 	width:80%;
    word-wrap:break-word;
 }
.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
    transform: translateX(100%);
}
</style>
