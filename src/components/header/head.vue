<template>
    <header id='head_top'>
        <section class="head_goback" v-if="goBack" @click="close">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
                <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:2"/>
            </svg>
        </section>
        <section class="title_head ellipsis" v-if="headTitle">
            <span class="title_text">{{headTitle}}</span>           
        </section>
        <section v-if='del' class="del" @click='delt'>
            <span class="title_text">删除</span>           
        </section>
    </header>
</template>

<script>

	export default{
		props: ['signinUp', 'headTitle', 'goBack','hide','footHide','del','foodClose','toAddr'],
		methods:{
			close(){
				if(this.hide){
					this.$bus.emit('close');
				}else if(this.footHide){
					this.$bus.emit('footHide')
				}else if(this.foodClose){
					this.$bus.emit('foodClose')
				}else if(this.toAddr){
					this.$router.push('#/address')
				}
				else{
					this.$router.go(-1)
				}
							
			},
			//删除
			delt(){
				this.$emit('delt')
			}
		}
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
    .head_login{
        right: 0.55rem;
        @include sc(0.65rem, #fff);
        @include ct;
        .login_span{
            color: #fff;
        }
        .user_avatar{
            fill: #fff;
            @include wh(.8rem, .8rem);
        }
    }
    .title_head{
        @include center;
        width: 50%;
        color: #fff;
        text-align: center;      
    }
     .title_text{
            @include sc(0.8rem, #fff);
            text-align: center;
        }
        .del{
        	position: absolute;
        	right: 0.3rem;
        	top:0.4rem
        }
</style>
