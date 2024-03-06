import React,{useState,useEffect} from 'react';
import {Editor} from "react-draft-wysiwyg";
import {convertToRaw,EditorState,ContentState} from 'draft-js'
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
const NewsEditor = (props) => {
    useEffect(() => {
        //把html转回draft(下面一堆都根据draft的官方文档)
        console.log(props.content)
        const html=props.content
        if(html===undefined) return;//在第一次编写新闻时不走下面，只有更新才走
        const contentBlock=htmlToDraft(html);
        if(contentBlock){
            const contentState=ContentState.createFromBlockArray
            (contentBlock.contentBlocks);
            const editorState=EditorState.createWithContent
            (contentState);
            seteditorState(editorState)
        }
    }, [props.content]);
    const [editorState,seteditorState]=useState('')
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName='wrapperClassName'
                editorClassName='editorClassName'
                onEditorStateChange={(editorState)=>
                    seteditorState(editorState)}
                
                onBlur={()=>{//每次失去焦点的时候，拿到状态值,传回父组件
                    // console.log(draftToHtml(convertToRaw(editorState.
                    //     getCurrentContent())))依据draft的官方文档
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    );
}

export default NewsEditor;
