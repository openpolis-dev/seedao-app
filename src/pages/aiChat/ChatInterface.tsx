import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatInterface.scss';
import {useIndexedDB} from "react-indexed-db-hook";
import { nanoid } from 'nanoid'
import {Message} from "./DBTypes";
import Code from "./code";

import LogoImg from '../../assets/Imgs/light/creditLogo2.svg';
import LogoImgDark from '../../assets/Imgs/dark/creditLogo.svg';
import { AppActionType, useAuthContext } from "../../providers/authProvider";
import PublicJs from "../../utils/publicJs";
import DefaultAvatar from "../../assets/Imgs/defaultAvatarT.png";

import {Trash2,RefreshCcw,ArrowUp,Square,Eraser} from "lucide-react";
import { useTranslation } from "react-i18next";
import { chatCompletions, loginChat } from "../../requests/chatAI";
import { estimateTokenCount, truncateContext } from "../../utils/chatTool";
import useCheckLogin from "../../hooks/useCheckLogin";
import { SEEDAO_ACCOUNT } from "../../utils/constant";
import Copied from "./copied";
import useToast, { ToastType } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";


export const ChatInterface= () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>("");

  const [avatar, setAvatar] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const [controller, setController] = useState<any>(null);
  const { add,getAll ,deleteRecord} = useIndexedDB("list");
  const acc = localStorage.getItem(SEEDAO_ACCOUNT);
  const {  showToast } = useToast();
  const navigate = useNavigate();


  const {
    state: { theme,userData,account},
    dispatch
  } = useAuthContext();

  const isLogin = useCheckLogin(account);

  useEffect(() => {
    scrollToBottom();
  }, [messages,isLoading]);

  useEffect(() => {
    if(!account)return;
    getApiKey()
    getMessage()
  }, [account]);


  const getApiKey = async () => {
    try{
      let rt = await loginChat();
      setApiKey(rt.data.apiKey)
    }catch(error:any){
      console.log(error);
      showToast(`${error?.data?.msg || error?.code || error}`, ToastType.Danger);
      setTimeout(()=>{
        navigate("/")
      },1000)
    }
  }

  const getMessage = async () => {
    let rt = await getAll()
    const newMessages = rt.filter((item:Message) => item.address?.toLowerCase() === account?.toLowerCase())
    setMessages(newMessages)
  }


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUserMsg = async() =>{

    if (!isLogin && acc === "null") {
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
      return;
    }
    if (!inputMessage.trim()) return;

    let uId = nanoid();
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      uniqueId:uId,
      questionId:uId,
      timestamp: Date.now(),
      address:account!
    };


    setMessages(prev => {
      return  [...prev, userMessage]
    });
    setInputMessage('');
    await sendMessage(userMessage)
  }

  const sendMessage = async (userMessage:Message) => {

    await add({...userMessage})
    let rt = await getAll()
    const newMessages = rt.filter((item:Message) => item.address?.toLowerCase() === account?.toLowerCase())

    setIsLoading(true);
    const abortController = new AbortController();
    setController(abortController);

    const systemRoleObj = {
      role: "system",
      // content: "你是一个有帮助的AI助手。请用中文回答。当你收到消息时，首先在<think>标签内展示你的思考过程，然后提供你的回答。请确保所有回复都使用简体中文，包括思考过程。以专业、友好的语气回答，并在合适的时候使用emoji表情",
      content: "你是一个有帮助的AI助手。请用中文回答。请务必每次回答前按照如下格式\n<think>思考内容</think>\n生成",
    }
    let content = "";
    let thinkContent = "";
    let init = false;
    let currentId = "";

    try {
      const newMsg = [...newMessages].filter((item:any)=> !!item.content && item.type!=="thinking").map(({role, content})=>({role,content}));

      const truncatedMessages = truncateContext(newMsg, 40 * 1024);

      let obj = JSON.stringify({
        model:"deepseek-reasoner",
        messages:[systemRoleObj,...truncatedMessages],
        knowledge:true,
        // "max_tokens":100,
        "stream": true
      });


    let response = await chatCompletions(obj,abortController,apiKey);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      let isThinkingMessage = false;

      const readChunk = async () => {
        const { done, value } = await reader?.read();

        if (done) {
          setIsLoading(false);
          return;
        }
        const chunkText = decoder.decode(value);
        const lines = chunkText.split('\n');

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const jsonStr = line.slice(5);
            if (jsonStr === '[DONE]') {
              setMessages((old)=>{

                let msgArr = [...old]
                const arr = msgArr.filter((msg)=>msg.isNew);

                for (let i = 0; i < arr.length; i++) {
                  let item = arr[i];
                  add(item)
                }


                msgArr.map((item)=> {
                  delete item.isNew;
                  return item;
                })
                return msgArr;

              })

            }
            try {

              const data = JSON.parse(jsonStr);
              currentId = data.id;
              let text = data.choices[0]?.delta?.content || '';
              if(!init){
                setMessages(prev => [...prev, {
                  id: "",
                  content: "",
                  role: 'assistant',
                  type: 'thinking',
                  uniqueId:nanoid(),
                  questionId:userMessage.uniqueId,
                  timestamp: Date.now(),
                  address:account!,
                  isNew:true
                }])
                init = true;
              }


              if(text === "<think>"){
                isThinkingMessage = true;
              }
              if (text === "</think>" && isThinkingMessage){

                isThinkingMessage = false;
                setMessages(prev => [...prev, {
                  id: "",
                  content: "",
                  role: 'assistant',
                  type: 'response',
                  uniqueId:nanoid(),
                  questionId:userMessage.uniqueId,
                  timestamp: Date.now(),
                  address:account!,
                  isNew:true
                }])
              }

            text =( text === "</think>"||text === "<think>") ? "" :text;

              for (const char of text) {
                if(isThinkingMessage){

                  thinkContent+=char;
                  setMessages((old)=> {
                    let msg = [...old]
                    msg[msg.length-1].content = thinkContent;
                    msg[msg.length-1].id = data.id;
                    msg[msg.length-1].type = "thinking";
                    return msg;
                  });
                }else{
                  content+=char;
                  setMessages((old)=> {
                    let msg = [...old]
                    msg[msg.length-1].content = content;
                    msg[msg.length-1].id = data.id;
                    msg[msg.length-1].type = "response";
                    return msg;
                  });
                }
                await new Promise(resolve => setTimeout(resolve, 50));
              }
            } catch (error) {
              console.log('解析 JSON 时出错:', error);
            }
          }
        }

        await readChunk();
      };


      await readChunk();
    } catch (error:any) {
      if ((error as any).name === 'AbortError') {
        const errorSystemMessage: Message = {
          id: Date.now().toString(),
          content:content?content:"...",
          role: 'assistant',
          type:"response",
          uniqueId:nanoid(),
          questionId:userMessage.uniqueId,
          timestamp: Date.now(),
          address:account!
        };
        setMessages(prev => [...prev, errorSystemMessage]);

        await add(errorSystemMessage)
      } else {
        console.error('Error sending message:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
        setError(errorMessage);
        const errorSystemMessage: Message = {
          id: Date.now().toString(),
          content: `Error: ${errorMessage}. Please try again.`,
          role: 'assistant',
          timestamp: Date.now(),
          uniqueId:nanoid(),
          questionId:userMessage.uniqueId,
          address:account!

        };
        setMessages(prev => [...prev, errorSystemMessage]);
        showToast(`${error?.data?.msg || error?.code || error}`, ToastType.Danger);
      }

    } finally {
      setIsLoading(false);
      setError(null);
    }
  };

  const handleStop = ()=>{
    if (controller) {
      controller.abort();
      setController(null);
      setIsLoading(false);
    }
  }

  const handleKeyPress = async(e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await handleUserMsg();
    }
  };

  const handleReSend = async(qid:string) =>{
    let rt = await getAll()

    const newMessages = rt.filter((item:Message) => item.address?.toLowerCase() === account?.toLowerCase())
    const needResend = newMessages.find(msg=>msg.uniqueId === qid);
    if(!needResend)return;
    const findIdx = needResend.messageId!;
    let arr = []

    for(let i = 0; i < newMessages.length; i++) {
      if(newMessages[i].messageId! >= findIdx){
        await deleteRecord(newMessages[i].messageId!)
      }else{
        arr.push(newMessages[i]);
      }

    }
    setMessages(arr)
    delete needResend.messageId;

    setMessages(prev => {
      return  [...prev, needResend]
    });

    await sendMessage(needResend);


  }
 const handleDelete = async(qid:string) =>{
   let rt = await getAll()
   const newMessages = rt.filter((item) => item.address?.toLowerCase() === account?.toLowerCase())

   const needDelete = newMessages.filter(msg=>msg.questionId === qid);
   if(!needDelete)return;

   for(let i = 0; i < needDelete.length; i++) {
     await deleteRecord(needDelete[i].messageId!)
   }
   const needDisplay = newMessages.filter(msg=>msg.questionId !== qid);

   setMessages(needDisplay);

  }


  const handleClear = async() =>{


    let rt = await getAll()

    const newMessages = rt.filter((item:Message) => item.address?.toLowerCase() === account?.toLowerCase())
    for(let i = 0; i < newMessages.length; i++) {
      await deleteRecord(newMessages[i].messageId!)
    }

    setMessages([])
  }

  useEffect(() => {


    if (!isLogin && acc === "null") {
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
      return;
    }
  }, [isLogin]);
  useEffect(() => {
    if (!isLogin) return;

    getAvatar();
  }, [userData,isLogin]);

  const getAvatar = async () => {
    let avarUrl = await PublicJs.getImage((userData as any)?.data?.avatar ?? '');
    setAvatar(avarUrl!);
  };

  return (
    <div className="chat-container">
      <div className="top-header">
        <span onClick={()=>handleClear()}>
                <Eraser size={18} /> {t("clearTips")}
        </span>

      </div>
      <div className="chat-box">
        <div className="messageBox">
          <div className="chat-messages">
            {messages.map((message) => (
              <div  key={nanoid()} className={`${message.role === 'user'?"flexBox flexEnd":"flexBox flexStart"}`}>

                {
                  message.role === 'user' && <div className="logoBox frht">
                    {
                      !!(userData as any)?.data &&  <img src={avatar || DefaultAvatar} alt="" />
                    }
                    {
                      !(userData as any)?.data && <img src={DefaultAvatar} alt="" />
                    }

                  </div>
                }
                {
                  message.role !== 'user'&&  <div className="logoBox">
                    <img src={theme ? LogoImgDark : LogoImg} alt="" />
                  </div>
                }

                <div className="flexTB">
                  <div

                    className={`${message.role === 'user' ? 'user-message' :
                      message.type === 'thinking' ? 'assistant-thinking' : 'assistant-response'}`}
                  >
                    <div className="msgFlex">

                      {message?.type === 'thinking' ? (
                        <div className="message thinking-content">
                          <div className="thinking-icon">🤔</div>
                          <div className="thinking-text">{message.content}</div>
                        </div>
                      ) : (
                        <div className="message message-content">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code({ node, inline, className, children, ...props }:any) {
                                return <Code node={node} inline={inline} className={className} children={children} />
                              },
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>



                  </div>
                  {
                    ( message.type !== 'thinking'  && !isLoading ) &&   <div className="flexLine">
  <span onClick={()=>handleReSend(message.questionId)}>
                          <RefreshCcw size={18} />
                    </span>
                      <span onClick={()=>handleDelete(message.questionId)}>
                    <Trash2 size={18} />
                  </span>
                      <Copied content={message.content} />


                    </div>
                  }
                </div>

              </div>

            ))}
            {isLoading && (
              <div className="message assistant-message">
                <div className="loading-indicator">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="chat-input">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t("aiTips")}
          rows={1}
        />
          {
            !isLoading &&<button
            onClick={handleUserMsg}
            disabled={isLoading || !inputMessage.trim()|| estimateTokenCount(inputMessage)>8000}
            >
            <ArrowUp size={18} />
            </button>
          }
          {
            isLoading && <button
              className="stop"
              onClick={()=>handleStop()}
              disabled={!isLoading}>
              <Square size={18} />
            </button>
          }


        </div>
      </div>

    </div>
  );
};
