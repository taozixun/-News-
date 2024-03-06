import {legacy_createStore as createStore,combineReducers} from 'redux'
import { CollapsedReducer } from './reducers/CollapsedReducer';
import { LoadingReducer } from './reducers/LoadingReducer';
//以下5个用于持久化
import {persistStore,persistReducer}from 'redux-persist'//1
import storage from 'redux-persist/lib/storage'//2

const persistConfig={//3
    key:'haha',
    storage,
    blacklist:['LoadingReducer']//不持久化他
}

const reducer=combineReducers({
    CollapsedReducer,
    LoadingReducer,
})

const persistedReducer=persistReducer(persistConfig,reducer)//4持久化reducer

const store = createStore(persistedReducer);//用持久化后的reducer创建store

const persistor=persistStore(store)//5持久化store



export {
    store,
    persistor
}

// store.dispatch()订阅
//store.subscribe()发布
//也(推荐)可用react-redux中的connect

// connect(
//     //mapStateToProps
//     //mapDispatchToProps
// )(被包装的组件)