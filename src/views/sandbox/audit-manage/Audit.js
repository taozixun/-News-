import axios from 'axios';
import React,{useState,useEffect} from 'react';
import {Table,Button,notification} from 'antd';
const Audit = () => {
    const [dataSource, setdataSource] = useState([])
    const {roleId,region,username}=JSON.parse(localStorage.getItem('token'))
    const columns = [
        {
          title: '新闻标题',
          dataIndex: 'title',
          render:(title,item)=>{
            return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
          }
        },
        {
          title: '作者',
          dataIndex: 'author',
        },
        {
          title: '新闻分类',
          dataIndex: 'category',
          render:(category)=>{
            return <div>{category.title}</div>
          }
        },
        {
            title: '操作',
            render:(item)=>{
              return <div>
                {/* 审核通过+待发布    审核不通过+未发布 */}
                <Button type='primary' onClick={()=>handlePassOrRefuse(item,2,1)} >通过</Button>
                <Button danger onClick={()=>handlePassOrRefuse(item,3,0)}>驳回</Button>
              </div>
            }
          },
    ];
    const handlePassOrRefuse=(item,auditState,publishState)=>{
        setdataSource(dataSource.filter(data=>data.id!==item.id))
        axios.patch(`/news/${item.id}`,{
            auditState,
            publishState
          }).then(res=>{
            notification.info({
              message: `通知`,
              description:
                `审核成功`,
              placement:'bottomRight',
            });
          })
    }
    useEffect(() => {
        //获取正在审核的
        axios.get(`/news?auditState=1&_expand=category`).then(res=>{
            setdataSource(roleId===1?res.data:[...res.data.filter(item=>item.author===username),
            ...res.data.filter(item=>item.region===region&&item.roleId===3)])//能看到自己和同地区比自己小的,正常后端会过滤好
        })

    }, [roleId,region,username]);
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} 
            pagination={{pageSize:5}}
            rowKey={item=>item.id} />
        </div>
    );
}

export default Audit;
