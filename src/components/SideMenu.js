import React,{useState,useEffect} from 'react';
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import deepClone from '../deepclone'
import {connect} from 'react-redux'
import {
    HomeOutlined,UserOutlined,EditOutlined,
    ClearOutlined,IdcardOutlined,SendOutlined,
    SecurityScanOutlined,ScheduleOutlined,
    ReadOutlined,FileUnknownOutlined,
    BarsOutlined,CloudDownloadOutlined,
    CloudOutlined,CloudUploadOutlined,
    TeamOutlined,ProfileOutlined,
  } from '@ant-design/icons';
import './index.css'
const { Sider} = Layout;
// function getItem(label, key, icon, children, type) {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     type,
//   };
// }
// const menuList=[//由后端传过来该实现什么样的导航栏
//   getItem('首页', '/home', <UserOutlined />),
//   getItem('用户管理', '/user-manage', <DesktopOutlined />,[
//   getItem('用户列表', '/user-manage/list',<UserOutlined />),
//   ]),
//   getItem('权限管理', '/right-manage', <MailOutlined />, [
//   getItem('角色列表', '/right-manage/role/list',<UserOutlined />),
//   getItem('权限列表', '/right-manage/right/list',<UserOutlined />),
// ]),
// ];
// const menuList=[
//   {
//     key:'/home',
//     label:'首页',
//     icon:<UserOutlined />
//   },
//   {
//     key:'/user-manage',
//     title:'用户管理',
//     icon:<UserOutlined />,
//     children:[
//       {
//         key:'/user-manage/list',
//         title:'用户列表',
//         icon:<UserOutlined />
//       },
//     ]
//   },
//   {
//     key:'/right-manage',
//     title:'权限管理',
//     icon:<UserOutlined />,
//     children:[
//       {
//         key:'/right-manage/role/list',
//         title:'角色列表',
//         icon:<UserOutlined />
//       },{
//         key:'/right-manage/right/list',
//         title:'权限列表',
//         icon:<UserOutlined />
//       }
//     ]
//   }
// ]

const IconList={
  "/home":<HomeOutlined/>,
  "/user-manage":<UserOutlined />,
  "/right-manage":<ScheduleOutlined />,
  "/news-manage":<ReadOutlined />,
  "/audit-manage":<SecurityScanOutlined />,
  "/publish-manage":<SendOutlined />,
  "/user-manage/list":<IdcardOutlined />,
  "/right-manage/role/list":<TeamOutlined />,
  "/right-manage/right/list":<ProfileOutlined />,
  "/news-manage/add":<EditOutlined />,
  "/news-manage/draft":<ClearOutlined />,
  "/news-manage/category":<FileUnknownOutlined />,
  "/audit-manage/audit":<ReadOutlined />,
  "/audit-manage/list":<BarsOutlined />,
  "/publish-manage/unpublished":<CloudOutlined />,
  "/publish-manage/published":<CloudUploadOutlined />,
  "/publish-manage/sunset":<CloudDownloadOutlined />,
}
function makeList(menu){
  let menu2=[]
  const {role:{rights}}=JSON.parse(localStorage.getItem('token'))
  menu.map(item=>{
    if (item.pagepermisson===1&&rights.includes(item.key)){//后面判断登录者的权限是否包含这项
      let item2=deepClone(item)
      item2.label=item.title//把对象属性名中的title改为label
      delete item2.title
      item2.icon=IconList[item.key]
      if(item2.children){
        if(item2.children.length===0){
          item2.children=undefined
        }else{
          item2.children=makeList(item2.children)
        }
      }
      menu2.push(item2)
    }
    return ''//map需要return
  })
  return menu2
}
const SideMenu = (props) => {
  const [menu,setMenu]=useState([])
  useEffect(()=>{
    axios.get("/rights?_embed=children").then(res=>{
      setMenu(res.data)
    })
  },[])
  //console.log(menu)
  let menu2=makeList(menu)
  //console.log(menu2)
  const selectKeys=props.location.pathname
    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
          <div style={{display:"flex",height:"100%",flexDirection:"column"}}>
            <div className="logo" >
              <img src='/logo.jpg' alt='2' style={{width:"100%"}}></img>
              <div >小蓝怪<span style={{color:" aqua"}}>NEWS</span>系统</div>
              </div>
            <div style={{flex:1,overflow:"auto"}}>
              <Menu
                selectedKeys={[selectKeys]}
                defaultOpenKeys={["/"+selectKeys.split('/')[1]]}
                mode="inline"
                theme="dark"
                // inlineCollapsed={props.isCollapsed}
                items={menu2}
                onClick={(e)=>{
                  props.history.push(e.key)
                }
                }
              />
            </div>
          </div>
      </Sider>
    );
}

const mapStateToProps=({CollapsedReducer:{isCollapsed}})=>{
  return {
      isCollapsed
  }
}

export default connect(mapStateToProps)(withRouter(SideMenu));
