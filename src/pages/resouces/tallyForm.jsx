import { useEffect, useState } from "react";
import styled from "styled-components";

import useParseSNS from "../../hooks/useParseSNS";
import { AppActionType, useAuthContext } from "../../providers/authProvider";


const Box = styled.div`
    margin-inline:${props => props.align === "1" ? "32px":0};
    width:${props => props.align === "1" ? "900px":"auto"};
`

export default function TallyForm({item,id,account,userData}){
  const sns = useParseSNS(account);
  const [iframeStr,setIframeStr] = useState('');
  const { dispatch } = useAuthContext();
  const [detail,setDetail] = useState({});


  useEffect(() => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    window.Tally.loadEmbeds();


    let iframe = document.getElementById("myIframe");
    iframe.addEventListener("DOMContentLoaded",handleIframeLoad);

    return ()=>{
      iframe.removeEventListener("DOMContentLoaded",handleIframeLoad)
    }

  }, []);



  useEffect(() => {
    if(!id || !item || !userData) return;

    setDetail(item[0])

    let str = "";

    const { hiddenFields } = item[0];

    hiddenFields.map((item,index)=>{

      str += returnStr(item) + (index===hiddenFields.length-1?"":'&');
    })

    setIframeStr(str)

  }, [id,item,sns,userData]);

  const returnStr = (type) =>{
    let rt="";
    const { nickname,seed } = userData.data;


     switch (type){
       case "wallet":
          rt = `wallet=${account}`
         break;
       case "name":
         rt = `name=${nickname}`
         break;
       case "sns":
         rt = `sns=${sns}`
         break;
       case "seed":
         const seedArr = seed.map(obj => obj.token_id);
         rt = `seed=${seedArr.join(",")}`
         break;
     }
     return rt;
  }

  const handleIframeLoad = () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: false });
  };
  return <Box align={JSON.stringify(detail?.alignLeft)}>
    {/*<iframe data-tally-src="https://tally.so/embed/mBpyxe?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&name=AAA&userid=123456&wallet=0x183F09C3cE99C02118c570e03808476b22d63191" loading="lazy" width="100%" height="200" frameBorder="0" marginHeight="0" marginWidth="0" title="Hacker House application"></iframe> */}
  <iframe

        data-tally-src={`https://tally.so/embed/${id}?alignLeft=${detail?.alignLeft}&hideTitle=${detail?.hideTitle}&transparentBackground=1&dynamicHeight=1&${iframeStr}`}
        loading="lazy"
        width="100%"
        height="200"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        id="myIframe"
        onLoad={handleIframeLoad}
        title={detail?.name} />



  </Box>
}
