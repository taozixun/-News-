import React,{useState,useEffect,useRef} from 'react';
import {Table,Button,Modal,Switch} from 'antd';
import { EditOutlined,DeleteOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import axios from 'axios';
import UserForm from '../../../components/user-manager/UserForm';
const {confirm}=Modal
const UserList = () => {
    const [isAddVisible, setisAddVisible] = useState(false)
    const [isUpdateVisible, setisUpdateVisible] = useState(false)
    const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
    const [dataSource, setdataSource] = useState([])
    const [roleList, setroleList] = useState([])
    const [current, setcurrent] = useState([])
    const [regionList, setregionList] = useState([])
    const addForm=useRef(null)
    const updateForm=useRef(null)
    const {roleId,region,username}=JSON.parse(localStorage.getItem('token'))
    //roleId:1超级管理员，2区域管理员，3区域编辑
    useEffect(()=>{
        axios.get("/users?_expand=role").then(res=>{
            setdataSource(roleId===1?res.data:[...res.data.filter(item=>item.username===username),
              ...res.data.filter(item=>item.region===region&&item.roleId===3)])//能看到自己和同地区比自己小的,正常后端会过滤好
        })},[roleId,region,username])
    useEffect(()=>{
        axios.get("/regions").then(res=>{
            setregionList(res.data)
        })},[])
    useEffect(()=>{
        axios.get("/roles").then(res=>{
            setroleList(res.data)
        })},[])
    const columns = [
        {
          title: '区域',
          dataIndex: 'region',
          filters:[
            ...regionList.map(item=>({
              text:item.title,
              value:item.value
            })),
            {
              text:"全球",
              value:"",
            }
          ],
          onFilter:(value,item)=>item.region===value,
          render:(region)=>{
            return <b>{region===''?'全球':region}</b>
          }
        },
        {
          title: '角色名称',
          dataIndex: 'role',
          render:(role)=>{
            return role.roleName
          }
        },
        {
          title: '用户名',
          dataIndex: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render:(roleState,item)=>{
                return <Switch checked={roleState} disabled={item.default}
                onChange={()=>handleChange(item)}></Switch>
              }
          },
        {
            title: '操作',
            render:(item)=>{
              return <div>
                <Button danger shape="circle" 
                icon={<DeleteOutlined />} onClick={()=>confirmMethod(item)} />
                <Button type='primary' shape='circle' disabled={item.default}
                icon={<EditOutlined />} onClick={()=>handleUpdate(item)} />
              </div>
            }
          },
    ];
    async function handleUpdate(item){
      await setisUpdateVisible(true)//个人理解等数据都请求完了，再调用下面的更新
      if (item.roleId===1){
        setisUpdateDisabled(true)
      }else{
        setisUpdateDisabled(false)
      }
      updateForm.current.setFieldsValue(item)
      setcurrent(item)
    }
    const handleChange=(item)=>{
      item.roleState=!item.roleState
      setdataSource([...dataSource])
      axios.patch(`/users/${item.id}`,{
            roleState:item.roleState
          })
    }

    const confirmMethod=(item)=>{
        confirm({
            title: '你确定要删除?',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            onOk() {
              deleteMethod(item)
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }
    const addFormOK=()=>{
        addForm.current.validateFields().then(value=>{
          //console.log(value)
          setisAddVisible(false)
          addForm.current.resetFields()
          axios.post(`/users`,{
            ...value,
            "roleState":true,
            "default":false,
          }).then(res=>{
            axios.get("/users?_expand=role").then(res=>{
            setdataSource(res.data)
            })
            // setdataSource([...dataSource,{...res.data,//方法没太看懂，就是回roles中又添加了数据
            //   role:roleList.filter(item=>item.id===value.roleId)[0]}])
          })
        }).catch(err=>{console.log(err)})
    }
    const deleteMethod=(item)=>{ 
        //当前页面同步状态+后端同步
        setdataSource(dataSource.filter(data=>data.id!==item.id))
        axios.delete(`/users/${item.id}`)
    }
    const updateFormOK=()=>{
      updateForm.current.validateFields().then(value=>{
        //console.log(value)
        setisUpdateVisible(false)
        setdataSource(dataSource.map(item=>{
          if(item.id===current.id){
            return{
              ...item,
              ...value,
              role:roleList.filter(data=>data.id===value.roleId)[0]
            }
          }
          return item
        }))
        setisUpdateDisabled(!isUpdateDisabled)
        axios.patch(`/users/${current.id}`,value)
      })

    }
    return (
        <div>
            <Button type='primary' onClick={()=>setisAddVisible(true)}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns} 
            pagination={{pageSize:5}}/>

            <Modal
                  open={isAddVisible}
                  title="添加用户"
                  okText="确定"
                  cancelText="取消"
                  onCancel={()=>setisAddVisible(false)}
                  onOk={() => addFormOK()}
                >
                  <UserForm regionList={regionList} roleList={roleList} 
                  ref={addForm} ></UserForm>
              </Modal>
              <Modal
                  open={isUpdateVisible}
                  title="更新用户"
                  okText="更新"
                  cancelText="取消"
                  onCancel={()=>{
                    setisUpdateVisible(false)
                    setisUpdateDisabled(!isUpdateDisabled)
                  }}
                  onOk={() => updateFormOK()}
                >
                  <UserForm regionList={regionList} roleList={roleList} 
                  ref={updateForm} isUpdateDisabled={isUpdateDisabled} 
                  isUpdate={true} ></UserForm>
                  
              </Modal>
        </div>
    );
}


export default UserList;
