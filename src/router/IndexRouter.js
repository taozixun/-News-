import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import Login from '../views/login/Login';
import NewsSandBox from '../views/sandbox/NewsSandBox';
import Detail from '../views/visitor/Detail';
import News from '../views/visitor/News';
const IndexRouter = () => {
    // 登录页和游客页面
    return (
        <HashRouter>
            <Switch>
                <Route path='/login' component={Login}/>
                <Route path='/news' component={News}/>
                <Route path='/detail/:id' component={Detail}/>
                <Route path='/' render={()=> 
                    localStorage.getItem("token")?
                    <NewsSandBox></NewsSandBox>:
                    <Redirect to="/login"/>
                }/>
            </Switch>
        </HashRouter>
    );
}

export default IndexRouter;
