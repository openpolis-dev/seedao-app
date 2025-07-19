import styled from "styled-components";
import BasicModal from "../../../components/modals/basicModal";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../../../providers/authProvider";
import {CopyToClipboard} from "react-copy-to-clipboard";
import { Copy, CopyCheck } from "lucide-react";
import React, { useState } from "react";

const Box = styled(BasicModal)`
    min-width: 480px;
    
    .inner{
        background: var(--bs-menu-hover);
        display: flex;
        padding: 20px;
        align-items: center;
        justify-content: center;
        margin-top: -10px;
        img{
            width: 150px;
            height: 150px;
            box-sizing: content-box;
            padding: 5px;
            border-radius:4px;
            border: 1px solid var(--bs-d-button-border);
        }
    }
`
const BtmLine = styled.div`
  display: flex;
    justify-content: center;
    text-align: center;
    font-size: 12px;
    margin-top: 10px;
    gap: 10px;
`
export default function Receive({handleClose}:any){
  const { t } = useTranslation();
  const {
    state: { show_login_modal, language, theme, userData, account },
    dispatch,
  } = useAuthContext();

  const [codeCopied,setCodeCopied] = useState(false);

  const handleCodeCopy = ()=>{
    setCodeCopied(true);
    setTimeout(()=>{
      setCodeCopied(false);
    },1000)
  }

  return <Box  handleClose={handleClose} title={t('see.transfer')}>
      <div className="inner">
        <img src="" alt="" />
      </div>

    <BtmLine>
      <span> {account}</span>


      {
        !codeCopied &&   <CopyToClipboard text={account as any} onCopy={handleCodeCopy}>
          <Copy size={18} />
        </CopyToClipboard>
      }
      {
        codeCopied && <CopyCheck size={18}  />
      }

      </BtmLine>
  </Box>
}
