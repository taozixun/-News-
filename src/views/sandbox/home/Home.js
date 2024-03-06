import React,{useEffect,useState,useRef} from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, Col, Row ,List,Avatar,Drawer} from 'antd';
import axios from 'axios';
import * as Echarts from 'echarts';
import _ from 'lodash'
const { Meta } = Card;
const Home = () => {
    const [viewList, setviewList] = useState([]);
    const [starList, setstarList] = useState([]);
    const [allList,setallList]= useState([]);
    const [visible, setvisible] = useState(false);
    const {username,region,role:{roleName}}=JSON.parse(localStorage.getItem('token'))
    const barRef=useRef()
    const pieRef=useRef()
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(
            res=>{
                //console.log(res.data)
                setviewList(res.data)
            }
        )
    }, []);
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(
            res=>{
                //console.log(res.data)
                setstarList(res.data)
            }
        )
    }, []);
    useEffect(() => {//引入绘图
        axios.get("/news?publishState=2&_expand=category").then(res=>{
            //所有已发布的新闻,用lodash集合好
            //console.log(_.groupBy(res.data,item=>item.category.title))
            renderBarView(_.groupBy(res.data,item=>item.category.title))
            setallList(res.data)
        })
        return ()=>{//每次组件销毁时执行
            window.onresize=null
        }
    }, []);
    const renderBarView=(obj)=>{
        var myChart = Echarts.init(barRef.current);
        var option = {
            title: {
            text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data:Object.keys(obj),
                axisLabel:{
                    rotate:"45",
                    interval:0
                }
            },
            yAxis: {
                minInterval:1
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(obj).map(item=>item.length)//遍历对象的每一项，取出每一项内容的数量
                }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.onresize=()=>{//每次窗口改变时触发
            myChart.resize()
        }
    }
    const renderPieView=(obj)=>{
        //从所有新闻中分离出自己的
        var currentList=allList.filter(item=>item.author===username)
        var groupObj=_.groupBy(currentList,item=>item.category.title)
        var list=[]
        for(let i in groupObj){
            list.push({
                name:i,
                value:groupObj[i].length
            })
        }
        var option;
        option = {
        title: {
            text: '当前用户新闻分类图示',
            //subtext: 'Fake Data',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            marginRight:"50px"
        },
        series: [
            {
            name: '发布数量',
            type: 'pie',
            radius: '50%',
            data:list,
            emphasis: {
                itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
            }
        ]
        };
        let newPromise = new Promise((resolve) => {
            resolve()
        })
        newPromise.then(() => {
            //init初始化后未及时渲染，利用promise实现异步
            var myChart = Echarts.init(pieRef.current);
            myChart.setOption(option);
        })
        
    } 
        
    
    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
            <Col span={8}>
                <Card title="用户最常浏览" bordered={true}>
                    <List
                        size="small"
                        dataSource={viewList}
                        renderItem={item => <List.Item>
                                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                            </List.Item>}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card title="用户点赞最多" bordered={true}>
                    <List
                        size="small"
                        dataSource={starList}
                        renderItem={item => <List.Item>
                                <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                            </List.Item>}
                    />
                </Card>
            </Col>
            <Col span={8}>
                <Card
                    cover={
                    <img
                        alt="home"
                        src="/home.PNG"
                    />
                    }
                    actions={[
                    <SettingOutlined key="setting" onClick={()=>{
                        setvisible(true)
                        renderPieView()//初始化饼状图
                    }}/>,
                    <EditOutlined key="edit" />,
                    <EllipsisOutlined key="ellipsis" />,
                    ]}
                >
                    <Meta
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title={username}
                    description={
                        <div>
                            <b>{region?region:'全球'}</b>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {roleName}
                        </div>
                    }
                    />
                </Card>
            </Col>
            </Row>

            <Drawer title="个人新闻总览" placement="right" closable={true}
             width="500px" onClose={()=>{setvisible(false)}} open={visible}>
                <div ref={pieRef} style={{width:"100%",height:"650px",marginTop:"30px"}}></div>
            </Drawer>

            <div ref={barRef} style={{width:"100%",height:"400px",marginTop:"30px"}}></div>


        </div>
    );
}

export default Home;
