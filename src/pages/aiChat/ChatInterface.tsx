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
import { chatCompletions, getAllModels } from "../../requests/chatAI";
import {  truncateContext } from "../../utils/chatTool";
import useCheckLogin from "../../hooks/useCheckLogin";
import { SEEDAO_ACCOUNT } from "../../utils/constant";
import Copied from "./copied";


export const ChatInterface= () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [avatar, setAvatar] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const [controller, setController] = useState<any>(null);

  const [collection, setCollection] = useState<string[]>([]);
  const { add,getAll ,deleteRecord,clear} = useIndexedDB("list");
  const acc = localStorage.getItem(SEEDAO_ACCOUNT);


  const {
    state: { theme,userData,account},
    dispatch
  } = useAuthContext();

  const isLogin = useCheckLogin(account);


  useEffect(() => {
    getModels()
  }, []);

  const getModels = async() =>{
    const rt = await getAllModels();
    let arr =  rt
        .filter((item:any) => item.info?.meta?.knowledge !== undefined)
        .map((item:any) => item.info?.meta?.knowledge);

    let newIds = arr[0]?.map((item:any) => item.id) ??[];

    setCollection(newIds)
  }

  useEffect(() => {
    if(!account)return;
    getMessage()
  }, [account]);

  const getMessage = async () => {
    let rt = await getAll()
    const newMessages = rt.filter((item:Message) => item.address?.toLowerCase() === account?.toLowerCase())
    setMessages(newMessages)
  }


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages,isLoading]);

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
      content: "你是一个有帮助的AI助手。请用中文回答。当你收到消息时，首先在<think>标签内展示你的思考过程，然后提供你的回答。请确保所有回复都使用简体中文，包括思考过程。以专业、友好的语气回答，并在合适的时候使用emoji表情",
    }
    let content = "";
    let currentId = "";

    try {

      const collectionIds = collection.map((item:any) => ({"type": "collection", "id": item}));
      const newMsg = [...newMessages].map(({role, content})=>({role,content})).filter(({content})=>!!content);

      const truncatedMessages = truncateContext(newMsg, 8000-500);

      let obj = JSON.stringify({
        model: process.env.REACT_APP_DEEPSEEK_MODEL,
        messages:[systemRoleObj,...truncatedMessages],
        "files": collectionIds,
        "stream": true
      });


    let response = await chatCompletions(obj,abortController);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

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
                const thinkingMatch = content.match(/<think>([^]*?)<\/think>/);
                const responseContent = content.replace(/<think>[^]*?<\/think>/, '').trim();

              const responseMessage: Message = {
                id: currentId,
                content: responseContent??"",
                role: 'assistant',
                type: 'response',
                timestamp: Date.now(),
                uniqueId:nanoid(),
                questionId:userMessage.uniqueId,
                address:account!
              };
                if (thinkingMatch) {

                  setMessages((old)=> {
                    let msg = [...old]
                    msg[msg.length-1].content = thinkingMatch[1].trim();
                    msg[msg.length-1].type = 'thinking';
                    return msg;
                  });
                  await add({
                    content: thinkingMatch[1].trim(),
                    role: 'assistant',
                    type: 'thinking',
                    timestamp: Date.now(),
                    id:currentId,
                    uniqueId:nanoid(),
                    questionId:userMessage.uniqueId,
                    address:account!
                  })

                  if (responseContent) {
                    setMessages(prev => [...prev, responseMessage]);
                  }
                }

              if (responseContent) {
                await add(responseMessage)
              }
              return;
            }
            try {

              const data = JSON.parse(jsonStr);
              currentId = data.id;
              const text = data.choices[0]?.delta?.content || '';

              for (const char of text) {
                content+=char;
                setMessages((old)=> {
                  let msg = [...old]
                  msg[msg.length-1].content = content;
                  msg[msg.length-1].id = data.id;
                  return msg;
                });
                await new Promise(resolve => setTimeout(resolve, 50));
              }
            } catch (error) {
              console.log('解析 JSON 时出错:', error);
              console.log(jsonStr);
            }
          }
        }

        await readChunk();
      };

      setMessages(prev => [...prev, {
        id: "",
        content: "",
        role: 'assistant',
        type: 'response',
        uniqueId:nanoid(),
        questionId:userMessage.uniqueId,
        timestamp: Date.now(),
        address:account!
      }])

      await readChunk();
    } catch (error) {
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

   let newMessages = await getAll()

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
            disabled={isLoading || !inputMessage.trim()}
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
