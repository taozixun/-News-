import React, { forwardRef ,useState,useEffect} from 'react';
import {Form,Input,Select} from 'antd';
const {Option}=Select
const UserForm = forwardRef((props,ref)=> {
    const [isDisabled,setisDisabled]=useState(false);
    const {roleId,region}=JSON.parse(localStorage.getItem('token'));
    const checkRegionDisabled=(item)=>{//先判断是更新阶段还是创造阶段，再判断是否是超级管理员
      if(props.isUpdate){
        if(roleId===1){
          return false//不禁用
        }else{
          return true
        }
      }else{
        if(roleId===1){
          return false//不禁用
        }else{
          return item.value!==region//只可以选择（不禁用）自己地区的
        }
      }
    }
    const checkRoleDisabled=(item)=>{
      if(props.isUpdate){
        if(roleId===1){
          return false//不禁用
        }else{
          return true
        }
      }else{
        if(roleId===1){
          return false//不禁用
        }else{
          return item.id!==3//只可以添加编辑
        }
      }
    }
    useEffect(() => {
        setisDisabled(props.isUpdateDisabled)
    }, [props.isUpdateDisabled]);
    return (
                <Form 
                    ref={ref}
                    layout="vertical"
                  >
                    <Form.Item
                      name="username"
                      label="用户名"
                      rules={[{ required: true, message: 'Please input the title of collection!' }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      label="密码"
                      rules={[{ required: true, message: 'Please input the title of collection!' }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="region"
                      label="区域"
                      rules={isDisabled?[]:[{ required: true, message: 'Please input the title of collection!' }]}
                    >
                      <Select disabled={isDisabled}>
                        {
                          props.regionList.map(item=>
                            <Option value={item.value} key={item.id}
                            disabled={checkRegionDisabled(item)}>{item.title}</Option>
                          )
                        }
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="roleId"
                      label="角色"
                      rules={[{ required: true, message: 'Please input the title of collection!' }]}
                    >
                      <Select onChange={(value)=>{
                        if(value===1){
                            setisDisabled(true)
                            ref.current.setFieldsValue({
                                region:''
                            })
                        }else{
                            setisDisabled(false)
                        }
                      }}>
                        {
                          props.roleList.map(item=>
                            <Option value={item.id} key={item.id} 
                            disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
                          )
                        }
                      </Select>
                    </Form.Item>
                  </Form>
    );
})

export default UserForm;
