 <template>
  	<div class="rating_page">
        <head-top head-title="收货地址" go-back='true'></head-top>
        <section class="address">
        	<ul class="addresslist">
        		<li v-for="(item,index) in addrList">
        			<div class="row-left">
        				 <i class="font font-addr"></i>
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
			<router-link to='/my/info/address/add'>
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
    import headTop from '../../../../components/header/head'
    import fetch from './../../../../assets/js/fetch'
	import edit from './children/edit'
    export default {
      data(){
            return{
    			editText:'编辑',
    			adressList:[],
    			selectedItem:{}
            }
        },
        created(){
        	//接受add发送的增加地址命令
        	this.$bus.on('addrAdd', this.Addaddr);
        	this.$bus.on('deleteAddr', this.deleteAddr);
			var _this=this;
					//获取地址
			fetch('/api/contact/').then(function(res){
				if(res.data.code==1){
				
					_this.adressList=res.data.data.contact
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
            //打开编辑页面
            edit(item,index){  
            this.selectedItem=item
           	this.$refs.edit.theShow(index)
            },
            //增加地址
            Addaddr(item){
           		this.adressList.push(item)
            },
			//删除地址
			deleteAddr(index){
				this.adressList.splice(index,1)
			}
        }
    }
</script>
  
<style lang="scss" scoped>
    @import '../../../../assets/style/mixin';
  
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

    			padding:.4rem;
    			@include fj(space-between);
    			p{
    				line-height:.9rem;
    				@include sc(.7rem,#333);
    				span{
    					display:inline-block;
    					@include sc(.7rem,#333);
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
    		}
    		li:nth-of-type(1){
    			background:#FFF8C3;
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
   		 width:1.5rem;
		line-height:1.5rem;
		text-align: center;
		color: #3B95E9;	
	}
	.row-left i{
		font-size:0.8rem
	}
    .row-right{
    	width:80%;
    	word-wrap:break-word;
    }
    .phone{padding-left:0.3rem}
.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
    transform: translateX(100%);
}
</style>
