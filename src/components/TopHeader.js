import React from 'react';
import { Menu,Layout,Dropdown, Avatar } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
  } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux'
const { Header } = Layout;

const TopHeader = (props) => {
    const {role:{roleName},username}=JSON.parse(localStorage.getItem('token'))
    const menu = (
        <Menu>
            <Menu.Item>{roleName}</Menu.Item>
            <Menu.Item danger onClick={()=>{
                localStorage.removeItem("token")
                props.history.replace('/login')
            }}>退出</Menu.Item>
        </Menu>
      );
      
    const changeCollapsed=()=>{
        props.changeCollapsed()
    }
    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {
                props.isCollapsed?<MenuUnfoldOutlined onClick={changeCollapsed}/>
                :<MenuFoldOutlined onClick={changeCollapsed}/>
            }
            <div style={{float:"right"}}>
                <span>欢迎<span style={{color:"#1890FF"}}>{username}</span>回来</span>
                <Dropdown overlay={menu}>
                <Avatar size={40} src="https://joeschmoe.io/api/v1/random" />
                </Dropdown>
            </div>
        </Header>
    );
}

const mapStateToProps=({CollapsedReducer:{isCollapsed}})=>{
    return {
        isCollapsed
    }
}
const mapDispatchToProps={
    changeCollapsed(){
        return{
            type:"change_collapsed",
           // payload:
        }//action
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader))
