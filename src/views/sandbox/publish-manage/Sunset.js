import { Button } from 'antd';
import React from 'react';
import NewsPublish from '../../../components/publish-manage/NewsPublish';
import usePublishData from '../../../components/publish-manage/usePublishDate';

const Sunset = () => {
    //3代表已下线
    const {dataSource,handleDelete}=usePublishData(3)
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id)=>
                <Button danger onClick={()=>{handleDelete(id)}}>删除</Button>
            }></NewsPublish>
        </div>
    );
}

export default Sunset;
