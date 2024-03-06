import React,{useEffect, useState} from 'react';
import {Descriptions, PageHeader, message } from 'antd';
import {HeartTwoTone } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
const Detail = (props) => {
    const [newsInfo, setnewsInfo] = useState({});
    const [hasStared, sethasStared] = useState(false);
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(
            res=>{
                setnewsInfo({
                    ...res.data,
                    view:res.data.view+1//每次访问访问数加一
                })
                return res.data//给到下一个then，用res接受
            }
        ).then(res=>{//同步后端
            axios.patch(`/news/${props.match.params.id}`,{
                view:res.view+1
            })
        })
    }, [props.match.params.id]);
    const likeIt=()=>{
        if(hasStared===false){
            sethasStared(true)
            setnewsInfo({
                ...newsInfo,
                star:newsInfo.star+1
            })
            axios.patch(`/news/${props.match.params.id}`,{
                star:newsInfo.star+1
            })
        }else{
            message.error("已经点过赞了！")
        }
    }
    return (
        <div>
            <PageHeader
                onBack={() => window.history.back()}
                title={newsInfo?.title}//?的作用是保证在ajax请求回来前不报错，也可以在整个div前&&上一个newsInfo，保证渲染出来后再执行
                subTitle={<div>
                    {newsInfo?.category?.title}
                    &nbsp;&nbsp;&nbsp;
                    <HeartTwoTone twoToneColor="#eb2f96" onClick={()=>likeIt()}/>
                </div>}
                >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsInfo?.author}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">
                        {newsInfo?.publishTime?moment(newsInfo?.publishTime)
                        .format("YYYY/MM/DD HH:mm:ss"):'-'}</Descriptions.Item>
                    <Descriptions.Item label="区域">{newsInfo?.region}</Descriptions.Item>
                    <Descriptions.Item label="访问数量"><span style={{color:"limegreen"}}>{newsInfo?.view}</span></Descriptions.Item>
                    <Descriptions.Item label="点赞数量"><span style={{color:"mediumvioletred"}}>{newsInfo?.star}</span></Descriptions.Item>
                    <Descriptions.Item label="评论数量">0</Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <div dangerouslySetInnerHTML={{
                __html:newsInfo.content
            }} style={{ border:"1px solid gray",
                        margin:"0 24px"}} >
                {/* 解析 newsInfo.content这一html代码*/}
            </div>
        </div>
    );
}

export default Detail;
