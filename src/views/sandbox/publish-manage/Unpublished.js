import { Button } from 'antd';
import React from 'react';
import NewsPublish from '../../../components/publish-manage/NewsPublish';
import usePublishData from '../../../components/publish-manage/usePublishDate';

const Unpublished = () => {
    //1代表待发布的
    const {dataSource,handlePublish}=usePublishData(1)
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id)=>
                <Button type='primary' onClick={()=>handlePublish(id)}>发布</Button>
            } ></NewsPublish>
        </div>
    );
}

export default Unpublished;
