/*
在组件获取值
*/

export default {
    //箭头表达式简化了函数的命名,箭头函数的 this 始终指向函数定义时的 this，而非执行时
    footShow:(state)=>{
        return state.footShow
    },
    cartShow:(state)=>{
    	return state.cartShow
    },
    userInfo:(state)=>{//用户信息
    	return state.userInfo
    },
    billList:(state)=>{//账单
    	return state.billList
    },
    orderId:(state)=>{
    	return state.orderId
    },
    billCount:(state)=>{//账单总数
    	return state.billCount
    },
    isLogin:(state)=>{//是否登录
    	return state.login
    },
    addr:(state)=>{
    	return state.addr//传递地址
    }
}


