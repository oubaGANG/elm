 <template>
  <div class="order_detail_page">
  	 <head-top head-title="订单详情" go-back='true'></head-top>
       <div id="scroll_section">
       <section>                    		
           			 <section class="order_titel">
                <img :src="getFile(seller.logo)">
                <p>订单{{order.status}}</p>
                <router-link class="order_again" to="/shop">再来一单</router-link>
            </section>
            <section class="food_list">
                <router-link class="food_list_header" to="/shop">
                    <div class="shop_name">
                        <img :src="getFile(seller.logo)">
                        <span>{{seller.name}}</span>
                    </div>
                    <span class="arrow_right">
                        <i class="icon-keyboard_arrow_right"></i>
                    </span>
                </router-link>
                <ul class="food_list_ul">
                    <li v-for="value in order.detail">
                        <p class="food_name ellipsis">{{value.product.name}}</p>
                        <div class="quantity_price">
                            <span>X{{value.num}}</span>
                            <span>¥{{value.price}}</span>
                        </div>
                    </li>
                </ul>
                <div class="deliver_fee">
                    <div class="price" v-for='item in feeList'>
                    	<div class="food_name ellipsis">{{item.name}}</div>
                    	<div class="del_price">¥{{item.value}}</div>   
                    </div>
                    <div class="price">
                    	<div class="food_name ellipsis">总计</div>
                    	<div class="del_price">¥{{order.totalprice}}</div>                        	
                    </div>
                </div>

                <div class="table">
                	<a :href="'tel:'+seller.tel">
                		<span class="icon tel"></span> 拨打卖家电话</a>
                </div>
            </section>
            <section class="order_detail_style">
                <header>配送信息</header>
                <section class="item_style">
                    <p class="item_left">送达时间：</p>
                    <div class="item_right">
                        <p>{{order.delivery_time}}</p>
                    </div>
                </section>
                <section class="item_style">
                    <p class="item_left">送货地址：</p>
                    <div class="item_right">
                        <p>{{name}}</p>
                        <p>{{phone}}</p>
                        <p>{{address}}</p>
                    </div>
                </section>
                <section class="item_style">
                    <p class="item_left">配送方式：</p>
                    <div class="item_right">
                        <p>蜂鸟专送</p>
                    </div>
                </section>
            </section>
            <section class="order_detail_style">
                <header>订单信息</header>
                <section class="item_style">
                    <p class="item_left">订单号：</p>
                    <div class="item_right">
                        <p>{{order.orderid}}</p>
                    </div>
                </section>
                <section class="item_style">
                    <p class="item_left">支付方式：</p>
                    <div class="item_right">
                        <p>{{order.payment}}</p>
                    </div>
                </section>
                <section class="item_style">
                    <p class="item_left">下单时间：</p>
                    <div class="item_right">
                        <p>{{order.created_at}}</p>
                    </div>
                </section>
                  <section class="item_style">
                    <p class="item_left">订单备注：</p>
                    <div class="item_right">
                        <p v-if="order.remark!=''">{{order.remark}}</p>
                         <p v-else>无</p>
                    </div>
                </section>
            </section>
           	
        </section>
        	</div>
    <!--    <transition name="loading">
            <loading v-if="showLoading"></loading>
        </transition>-->
    </div>
</template>

<script>
    import headTop from '../../header/head'
     import loading from '../../common/loading'
      import BScroll from 'better-scroll';
    import {getFile} from './../../../assets/js/util';//导入获取图片方法
  import { Toast} from 'mint-ui'//弹框
    export default {
     data(){
			return{
				show:false,
				name:'',//收货人姓名
				phone:'',//电话
				address:'',//地址
				seller:{},//卖家信息
				order:{},//订单信息
				feeList:[]//费用
			}
		},
		
		created(){
			var orderId=this.$route.query.orderid
			//获取卖家信息
			if(localStorage.seller){
				this.seller=JSON.parse(localStorage.seller)
			}
				this.$http.get('/api/config').then((res)=>{
				//获取商家信息
				if(res.data.data.config){ 
					this.seller=res.data.data.config
				}
						
				})
			
			//获取跑腿费
			if(localStorage.feeList){
				this.feeList=JSON.parse(localStorage.feeList)
			}
				this.$http.get('/api/tpl/fee').then((res)=>{
				if(res){ 
					this.feeList=res.data.data.feeList
				}						
				})
			
			//获取商品详情	
			this.$http.get('/api/order/'+orderId).then((res)=>{
				this.order=res.data.data.order	
				this.name=this.order.contact.name
				this.phone=this.order.contact.phone
				this.address=this.order.contact.address
			}).catch((res)=>{
				Toast({
						message: res,
						duration:3000
					})
			})
		},
		
		methods:{
			getFile,//获取图片		
		
		},
		components:{
			headTop
		}

    }
</script>
  
<style lang="scss" scoped>
    @import '../../../assets/style/mixin';
  	#scroll_section{
  		position: absolute;
		   overflow-y: scroll;  
		    top: 1.95rem;
        left: 0;
        right: 0;
        bottom: 0;
       width: 125%;
	}
	#scroll_section>section{
		width:80%;
	}
    .order_detail_page{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f1f1f1;
        z-index: 202;
        padding-top: 1.95rem;
        overflow: hidden;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .order_titel{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: .7rem;
        background-color: #fff;
        margin-bottom: 0.5rem;
        img{
            border: 0.2rem solid #3190e8;
            border-radius: 50%;
            @include wh(3rem, 3rem);
        }
        p:nth-of-type(1){
            @include sc(.9rem, #333);
            margin-top: .4rem;
        }
        p:nth-of-type(2){
            @include sc(.55rem, #999);
            width: 10rem;
            margin-top: .3rem;
            text-align: center;
        }
        .order_again{
            @include sc(.6rem, $blue);
            margin-top: .5rem;
            border: 0.025rem solid $blue;
            padding: .15rem .4rem;
            border-radius: .1rem;
        }
    }
    .item_right{width: 70%;}
    .item_right p{word-break: break-all;}
    .food_list{
        background-color: #fff;
        .food_list_header{
            @include fj;
            align-items: center;
            height: 40px;line-height: 40px;
            box-sizing: border-box;
            padding: .2rem .5rem;
            border-bottom: 1px solid #f5f5f5;
            .shop_name{
                img{
                    @include wh(1.2rem, 1.2rem);
                    vertical-align: middle;
                    margin-right: .2rem;
                }
                span{
                    @include sc(.75rem, #333);
                   
                }
            }
            .arrow_right{
            	padding-top: 5px;
            }
        }
        .food_list_ul{
            li{
                @include fj;
                align-items: center;
                padding: 0 .5rem;
                line-height: 1.5rem;
              .quantity_price{
                    flex: 1;
                    @include fj;
                    align-items: center;
                    span:nth-of-type(1){
                        @include sc(.6rem, #ccc);
                    }
                    span:nth-of-type(2){
                        @include sc(.6rem, #666);
                    }
                }
            }
        }
          .food_name{
                    @include sc(.6rem, #666);
                    flex: 4;
                }
                
        .deliver_fee{

            padding: 0 .5rem;
            
            border-top: 1px solid #f5f5f5;
             border-bottom: 1px solid #f5f5f5;
            span{
                @include sc(.6rem, #666);
            }
            .price{
            	line-height: 1.5rem;
            	display: flex;
            	.del_price{
            		font-size:0.6rem; 
            		text-align: right;
            		flex: 1;
            		color:#FF4146;
            	}

            }
        }
        .pay_ment{
            @include sc(.6rem, #fb6b23);
            line-height:1.5rem;
            padding-right: .5rem;
        }
        .table {
	        width: 100%;	       
	        text-align: center;
	         display: table;
    		table-layout: fixed;
	        vertical-align: middle;
	        font-size: 0.7rem;
			padding: 0.3rem 0;
	         a{
	         	    display: table-cell;
	         }
		     .icon {
		        background: url(http://s.geilicdn.com/user/images/user/icons.png) no-repeat;
		        background-size: 39px;
		        width: 22px;
		        height: 24px;
		        display: inline-block;
		            vertical-align: middle;
		    }
		
		    .tel {
		        background-position: -19px 2px;
		    }
    	}
    }
    .order_detail_style{
        background-color: #fff;
        margin-top: 0.5rem;
        padding-bottom: 10px;
        header{
            @include sc(.75rem, #333);
            padding:0 .5rem;
                height: 40px;line-height: 45px;
            box-sizing: border-box;
            border-bottom: 1px solid #f5f5f5;
        }
        .item_style{
            display: flex;
            padding: .15rem .5rem;
            p{
                @include sc(.65rem, #666);
                line-height: 1rem;
            }
        }
    }
    .loading-enter-active, .loading-leave-active {
        transition: opacity .7s
    }
    .loading-enter, .loading-leave-active {
        opacity: 0
    }
    
</style>
