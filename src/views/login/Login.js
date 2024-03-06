import React from 'react';
import {Form,Button,Input, message} from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './Login.css';
import ReactCanvasNest from 'react-canvas-nest';
import axios from 'axios';
const Login = (props) => {
    const onFinish=(values)=>{//antd
        //console.log(values)
        //搜索数据库中用户名密码相匹配且状态为可用的,并且获取其权限
        axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`)
        .then(res=>{
            // console.log(res.data)
            if(res.data.length===0){
                //登陆失败
                message.error("用户名或密码不匹配")//来源于antd
            }else{
                localStorage.setItem("token",JSON.stringify(res.data[0]))
                props.history.push("/")
            }
        })
    }
    const visitorPart=()=>{
        props.history.push("/news")
    }
    return (
        <div style={{background:"rgb(35,39,65)",height:"100%",overflow:"hidden"}}>
            {/* ReactCanvasNest是粒子效果，不用管 */}
            <ReactCanvasNest className = 'canvasNest' config = {{ pointColor: ' 255, 255, 255 ' }} style={{zIndex:99}} />

            <div className='logincenter'>
                <div className='logintitle'>
                    <div>小蓝怪<span style={{color:" aqua"}}>NEWS</span>系统</div>
                </div>
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                    >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>                      
                        <Button type="primary" onClick={()=>visitorPart()}>
                            游客访问
                        </Button>
                        <div style={{float:"right"}}>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>      
                        </div>  
                    </Form.Item>
                </Form>
            </div>   
        </div>
    );
}
export default Login;
