import React,{useState,useEffect} from 'react';
import {Table,Tree,Button,Modal} from 'antd';
import { EditOutlined,DeleteOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import axios from 'axios';
const {confirm}=Modal
const RoleList = () => {
    const [dataSource, setdataSource] = useState([])
    const [rightList, setrightList] = useState([])
    const [currentRights, setcurrentRights] = useState([])
    const [currentId, setcurrentId] = useState([])
    useEffect(()=>{
        axios.get("/roles").then(res=>{
            setdataSource(res.data)
        })},[])
    useEffect(()=>{
        axios.get("/rights?_embed=children").then(res=>{
            setrightList(res.data)
        })},[])
    const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
          render:(id)=>{
            return <b>{id}</b>
          }
        },
        {
          title: '角色名称',
          dataIndex: 'roleName',
        },
        {
            title: '操作',
            render:(item)=>{
              return <div>
                <Button danger shape="circle" 
                icon={<DeleteOutlined />} onClick={()=>confirmMethod(item)} />
                <Button type='primary' shape='circle'
                icon={<EditOutlined />} onClick={()=>{
                    setIsModalOpen(true)
                    setcurrentRights(item.rights)
                    setcurrentId(item.id)
                }} />
                
              </div>
            }
          },
    ];
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
    const deleteMethod=(item)=>{ 
        //当前页面同步状态+后端同步
        setdataSource(dataSource.filter(data=>data.id!==item.id))
        axios.delete(`/roles/${item.id}`)
    }
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOk = () => {
      setIsModalOpen(false);
      //同步datasourse同步后端
      setdataSource(dataSource.map(item=>{
        if(item.id===currentId){
            return{
                ...item,
                rights:currentRights
            }
        }
        return item
      }))
      axios.patch(`/roles/${currentId}`,{
                rights:currentRights
            })
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const onCheck=(checkKeys)=>{
        setcurrentRights(checkKeys.checked)
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} 
            rowKey={(item)=>item.id}/>
            <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Tree
                checkable
                checkedKeys={currentRights}
                treeData={rightList}
                onCheck={onCheck}
                checkStrictly={true}
            />
            </Modal>
        </div>
    );
}

export default RoleList;
