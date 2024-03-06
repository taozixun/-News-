import React,{useState,useEffect,useRef} from 'react';
import { PageHeader,Steps,Button,Form,Input,Select, message,notification} from 'antd';
import style from "./News.module.css"
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor';
const { Step } = Steps;
const { Option } = Select;

const NewsAdd = (props) => {
    const [current,setcurrent]=useState(0)
    const [categoryList,setcategoryList]=useState([])
    const [formInfo, setformInfo] = useState({});
    const [content, setcontent] = useState("");
    const User=JSON.parse(localStorage.getItem("token"))


    const NewsForm=useRef(null)
    const handleNext=()=>{
        if(current===0){//表单校验，判断必填项是否都填了
            NewsForm.current.validateFields().then(res=>{
                //console.log(res)
                setformInfo(res)
                setcurrent(current+1)
            }).catch(error=>{
                console.log(error)
            })
        }else{
            if(content===''||content.trim()==='<p></p>'){//如果文本框什么也没收集到trim去掉首尾空格
                message.error("新闻内容不能为空！")
            }else{
                //console.log(formInfo,content)
                setcurrent(current+1)
            }
        }
    }
    const handlePrevs=()=>{
        setcurrent(current-1)
    }
    const layout={//antd,布局4：20
        labelCol:{span:4},
        wrapperCol:{spanm:20},
    }
    useEffect(() => {
        axios.get("/categories").then(res=>{
            setcategoryList(res.data)
        })
    }, []);
    const handleSave=(auditState)=>{
        axios.post('/news',{
            ...formInfo,
            "content":content,
            "region": User.region?User.region:"全球",
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,//0草稿，1待审核，2审核通过，3审核不通过
            "publishState": 0,//"未发布","待发布","已上线","已下线"
            "createTime": Date.now(),
            "star":0,
            "view":0,
            //"publishTime": 0
        }).then(res=>{
            props.history.push(auditState===0?'/news-manage/draft':'/audit-manage/list')
            notification.info({
                message: `通知`,
                description:
                  `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的新闻`,
                placement:'bottomRight',
              });
        })

    }

    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="撰写新闻"
                subTitle="This is a subtitle"
            />
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主题内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>
            <div style={{marginTop:"50px"}}>
                <div className={current===0?'':style.hidden}>
                    <Form
                        {...layout}
                        name="basic"
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Select>
                                {
                                    categoryList.map(item=>
                                        <Option value={item.id} key={item.id}>
                                            {item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={current===1?'':style.hidden}>
                    <NewsEditor getContent={(value)=>{
                        setcontent(value)
                    }}></NewsEditor>
                </div>
                <div className={current===2?'':style.hidden}>33</div>
            </div>
            
            <div style={{marginTop:"50px"}}>
                {
                    current>0&&<Button onClick={handlePrevs}>上一步</Button>
                }
                {
                    current<2&&<Button type='primary' onClick={handleNext}>下一步</Button>
                }
                <br/>
                {
                    current===2&&<span>
                        <Button type='primary' onClick={()=>handleSave(0)}
                        >保存草稿箱</Button>
                        <Button danger onClick={()=>handleSave(1)}
                        >提交审核</Button>
                    </span>
                }
            </div>
        </div>
    );
}

export default NewsAdd;
