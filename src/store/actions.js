/*action 是一种专门用来被 component 调用的函数。
action 函数能够通过分发相应的 mutation 函数，来触发对 store 的更新。
action也可以先从 HTTP 后端或 store 中读取其他数据之后再分发更新事件*/
export default {
    //接受从app.vue发来的信息、
    //底部菜单隐藏与显示
    showFoot:({commit})=>{
        commit('showFoot')//提交到mutations
    },
    hideFoot:({commit})=>{
        commit('hideFoot')//提交到mutations
    },
	//购物车隐藏与显示
	showCart:({commit})=>{
        commit('showCart')//提交到mutations
    },
    hideCart:({commit})=>{
        commit('hideCart')//提交到mutations
    },
    //记录账单
    billList:({commit},data)=>{

        commit('billList',data)//提交到mutations
    },
   //记录登录状态
     record_userinfo:({commit},info)=>{
        commit('record_userinfo',info)//提交到mutations
    },
    //传递地址
    sendAddr:({commit},info)=>{
        commit('sendAddr',info)//提交到mutations
    },
    //传递选择的订单id
    orderId:({commit},id)=>{
        commit('orderId',id)//提交到mutations
    },
    //更改用户名
     retset_name:({commit},info)=>{
        commit('retset_name',info)//提交到mutations
    },
    //余额支付
    balancePay:({commit},num)=>{
        commit('balancePay',num)//提交到mutations
    },
    //退出 
    out_login:({commit})=>{
        commit('out_login')//提交到mutations
    },
}







