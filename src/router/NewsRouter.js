import React,{useState,useEffect} from 'react';
import {Spin } from 'antd';
import { Route, Switch,Redirect} from 'react-router-dom';
import Home from '../views/sandbox/home/Home'
import UserList from '../views/sandbox/user-manage/UserList';
import RoleList from '../views/sandbox/right-manage/RoleList';
import RightList from '../views/sandbox/right-manage/RightList';
import NoPermission from '../views/sandbox/nopermission/NoPermission';
import NewsAdd from '../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../views/sandbox/news-manage/NewsCategory'
import NewsPreview from '../views/sandbox/news-manage/NewsPreview'
import Audit from '../views/sandbox/audit-manage/Audit'
import AuditList from '../views/sandbox/audit-manage/AuditList'
import Unpublished from '../views/sandbox/publish-manage/Unpublished'
import Published from '../views/sandbox/publish-manage/Published'
import Sunset from '../views/sandbox/publish-manage/Sunset'
import axios from 'axios';
import NewsUpdate from '../views/sandbox/news-manage/NewsUpdate';
import {connect} from 'react-redux'
const LocalRouterMap={
    "/home":Home,
    '/user-manage/list':UserList,
    '/right-manage/role/list':RoleList,
    '/right-manage/right/list':RightList,
    '/news-manage/add':NewsAdd,
    '/news-manage/draft':NewsDraft,
    '/news-manage/category':NewsCategory,
    '/news-manage/preview/:id':NewsPreview,
    '/news-manage/update/:id':NewsUpdate,
    '/audit-manage/audit':Audit,
    '/audit-manage/list':AuditList,
    '/publish-manage/unpublished':Unpublished,
    '/publish-manage/published':Published,
    '/publish-manage/sunset':Sunset
}


const checkRoute=(item)=>{//权限列表关闭或删除的不给分配路由
    //有这个路径，并且这个路径的渲染权限打开了
    return LocalRouterMap[item.key]&&(item.pagepermisson||item.routepermisson)
}//item.routepermission用来配置草稿箱preview的路由
const checkUserPermission=(item,rights)=>{//看登陆的用户是否有资格访问这个页面
    return rights.includes(item.key)
}
const NewsRouter = (props) => {
    const {role:{rights}}=JSON.parse(localStorage.getItem("token"))
    const [BackRouteList, setBackRouteList] = useState([]);
    if(!localStorage.getItem("token")){
        props.history.push("/login")
    }
    useEffect(()=>{
        Promise.all([//等待所有都完成
            axios.get("/rights"),
            axios.get("/children"),
        ]).then(res=>{
            //console.log(res)
            setBackRouteList([...res[0].data,...res[1].data])//侧边栏所有项
            //console.log([...res[0].data,...res[1].data])
        })
    },[])
    return (
        <Spin size="large" spinning={props.isLoading}>
        <Switch>
            {
                BackRouteList.map(item=>
                    {
                        if(checkRoute(item)&&checkUserPermission(item,rights)){
                            return <Route path={item.key} key={item.key} 
                            component={LocalRouterMap[item.key]} exact/>
                        }
                        return null
                    }
                )
            }
            <Redirect from="/" to="/home" exact/>
            {
                //防止网速慢时一开始显示这个页面
                BackRouteList.length>0 && <Route path='*' component={NoPermission}/>
            }
        </Switch>
        </Spin>
    );
}


const mapStateToProps=({LoadingReducer:{isLoading}})=>{
    return {
        isLoading
    }
  }

export default connect(mapStateToProps)(NewsRouter);
