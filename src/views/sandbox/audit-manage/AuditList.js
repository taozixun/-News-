import axios from 'axios';
import React,{useEffect,useState} from 'react';
import {Table,Tag,Button,notification} from 'antd';
const AuditList = (props) => {
    const [dataSource, setdataSource] = useState([]);
    const {username}=JSON.parse(localStorage.getItem("token"))
    const auditList=["未审核","审核中","已通过","未通过"]
    const colorList=["","orange","green","red"]
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
          title: '审核状态',
          dataIndex: 'auditState',
          render:(auditState)=>{
            return <Tag color={colorList[auditState]} >{auditList[auditState]}</Tag>
          }
        },
        {
            title: '操作',
            render:(item)=>{
              return <div>
                {
                  item.auditState===1&&<Button onClick={()=>handleRervert(item)}>
                    撤销</Button>
                }
                {
                  item.auditState===2&&<Button type='primary' onClick={()=>handlePublish(item)}>
                    发布</Button>
                }
                {
                  item.auditState===3&&<Button danger onClick={()=>handleUpdate(item)}>
                    修改</Button>
                }
              </div>
            }
          },
    ];
    const handleRervert=(item)=>{
      setdataSource(dataSource.filter(data=>data.id!==item.id))
      axios.patch(`/news/${item.id}`,{
        auditState:0
      }).then(res=>{
        notification.info({
          message: `通知`,
          description:
            `您可以到草稿箱中查看您的新闻`,
          placement:'bottomRight',
        });
      })
    }
    const handleUpdate=(item)=>{
      props.history.push(`/news-manage/update/${item.id}`)
    }
    const handlePublish=(item)=>{
      axios.patch(`/news/${item.id}`,{
        "publishState":2,//表示已发布
        "publishTime":Date.now()
      }).then(res=>{
        props.history.push('/publish-manage/published')//跳转页面
        notification.info({
          message: `通知`,
          description:
            `您可以到【发布管理/已发布】中查看您的新闻`,
          placement:'bottomRight',
        });
      })
    }
    useEffect(() => {
        //所有新闻中作者是登录用户，不在草稿箱，发布状态小于等于1,并根据categoryId连表category
        axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1
        &_expand=category`).then(res=>{
            //console.log(res.data)
            setdataSource(res.data)
        })
    }, [username]);
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} 
            pagination={{pageSize:5}}
            rowKey={item=>item.id} />
        </div>
    );
}

export default AuditList;
