import { CopyToClipboard } from "react-copy-to-clipboard";
import { Copy, CopyCheck } from "lucide-react";
import React, { useState } from "react";

export default function Copied({content}: { content: string }) {
  const [isCopied, setCopied] = useState(false);

  const handleCopy = (content:string) =>{
    // console.log(content);
    setCopied(true)
    setTimeout(()=>{
      setCopied(false)
    },1000)
  }
  return <span>
    {
      !isCopied && <CopyToClipboard text={content} onCopy={handleCopy}>
        <Copy size={18} />
      </CopyToClipboard>
    }
    {
      isCopied && <CopyCheck size={18} color="#5200FF" />
    }</span>
}
