import axios from "axios";
import {store} from '../redux/store'//因为http.js不是组件，只能用最原始的方法
//直接从index引入,所有的就都能用了
axios.defaults.baseURL="http://localhost:5000"

axios.interceptors.request.use(function(config){
    //在请求发送前执行 显示loading
    store.dispatch({
        type:"change_loading",
        payload:true
    })
    return config
},function(error){
    return Promise.reject(error)
})



axios.interceptors.response.use(function(response){
    //请求响应成功后 隐藏loading
    store.dispatch({
        type:"change_loading",
        payload:false
    })
    return response
},function(error){
    //请求响应失败后 隐藏loading
    store.dispatch({
        type:"change_loading",
        payload:false
    })
    return Promise.reject(error)
})