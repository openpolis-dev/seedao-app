import React, {useState} from "react";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {vscDarkPlus} from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Code({ node, inline, className, children, ...props }:any){


    const match = /language-([\w-]+)/.exec(className || '');
    const [codeCopied,setCodeCopied] = useState(false);
    const handleCodeCopy = ()=>{
        setCodeCopied(true);
        setTimeout(()=>{
            setCodeCopied(false);
        },1000)
    }

    return !inline && match ? (
        <>
            <div className="codeHeader">
                <span>Code</span>
                {
                    !codeCopied &&   <CopyToClipboard text= {String(children).replace(/\n$/, '')} onCopy={handleCodeCopy}>
                        <button>
                            复制
                        </button>
                    </CopyToClipboard>
                }
                {
                    codeCopied && <button>成功</button>
                }

            </div>

            <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>

        </>
    ) : (
        <code className={className} {...props}>
            {children}
        </code>
    );
}
