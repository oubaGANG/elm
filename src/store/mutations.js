import getters from './getters'
const state={
    // 应用启动时，header 置为true
    footShow:true,
    cartShow:true,
    userInfo: null,
    billList:null,
    orderId:0,
    login:false,
    billCount:0,
    addr:{}
}

const mutations={
    // mutation 的第一个参数是当前的 state
    // 你可以在函数里修改 state
    showFoot(state){
        state.footShow=true//显示
    },
    hideFoot(state){
        state.footShow=false//隐藏
    },
    showCart(state){
        state.cartShow=true//显示
    },
    hideCart(state){
        state.cartShow=false//隐藏
    },
    //记录用户信息
    record_userinfo(state,info){
    	
    	state.userInfo = info;
		state.login = true;
    },
    //用户id
    orderId(state,id){
    	state.orderId=id
    },
    //传递地址
    sendAddr(state,addr){
    	state.addr=addr
    },
    //修改用户名
    retset_name(state,username){
    //Object.assign如果目标对象中的属性具有相同的键，则属性将被源中的属性覆盖。
    //后来的源的属性将类似地覆盖早先的属性
    console.log(state.userInfo)
    state.userInfo = Object.assign({},state.userInfo,{username})
  
    },
    //修改余额
    balancePay(state,money){  		
    state.userInfo = Object.assign(state.userInfo,{money})
    },
    //账单
    billList(state,data){
    	state.billList=data.bill
    	state.billCount=data.num
    },
    //退出
    out_login(state){
    	state.userInfo=null
    	state.login = false;
    }
}

export default {
    state,
    mutations,
    getters
}