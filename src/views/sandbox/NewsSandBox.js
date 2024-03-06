import React,{useEffect} from 'react';
import SideMenu from '../../components/SideMenu';
import TopHeader from '../../components/TopHeader';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'
import {Layout} from 'antd';
import './NewsSandBox.css'
import NewsRouter from '../../router/NewsRouter';
const {Content } = Layout;
const NewsSandBox = () => {
    NProgress.start()
    //每次更新路由都会重新渲染NewsSandBox，渲染结束调用useEffect
    useEffect(() => {
            NProgress.done()
    });
    return (
        <Layout>
            <SideMenu></SideMenu>
            <Layout className="site-layout">
                <TopHeader></TopHeader>
                <Content className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow:'auto',
                    }}>
                    <NewsRouter></NewsRouter>
                    {/* <div style={{position:"absolute",
                     height:"160px",right:"18px",bottom:'40px',zIndex:"-1"}}>
                        <img src='/pet.jpg' alt='1' style={{height:"100%"}}></img>
                    </div> */}
                </Content>
            </Layout> 
        </Layout>
    );
}
  
export default NewsSandBox;
