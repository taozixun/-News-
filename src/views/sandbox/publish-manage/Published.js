import { Button } from 'antd';
import React from 'react';
import NewsPublish from '../../../components/publish-manage/NewsPublish';
import usePublishData from '../../../components/publish-manage/usePublishDate';

const Published = () => {
    //2代表已发布
    const {dataSource,handleSunset}=usePublishData(2)
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id)=>
                <Button danger onClick={()=>handleSunset(id)}>下线</Button>
            }></NewsPublish>
        </div>
    );
}

export default Published;
