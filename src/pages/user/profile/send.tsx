import { useTranslation } from "react-i18next";
import BasicModal from "../../../components/modals/basicModal";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import { ChangeEvent, useState } from "react";
import {ScanLine,X} from "lucide-react";
import QrScanner from "./scan";
import { transferSEE } from "../../../requests/see";
import useToast, { ToastType } from "../../../hooks/useToast";
import sns from "@seedao/sns-js";
import getConfig from "../../../utils/envCofnig";

const Box = styled(BasicModal)`
  min-width: 480px;
    dl{
        margin-bottom: 10px;

    }
    dt{
        font-size: 12px;
        margin-bottom: 5px;
        color: var(--bs-body-color_active);
    }
    dd{
        display: flex;
        align-items: center;
        gap: 10px;
        textarea,input{
            flex-grow: 1;
            border: 1px solid var(--table-border);
            background: var(--home-right);
            border-radius: 4px;
            padding: 4px 6px;
            &:focus{
                outline: none;
            }
        }
        span{
            color: var(--bs-body-color_active);
        }
    }
`

export default function SendModal({handleClose}:any){
  const { t } = useTranslation();
  const [amount, setAmount] = useState<number|string>(0);
  const [address, setAddress] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const { showToast } = useToast();
  const handleScanResult = (result: string | null) => {
    setAddress(result ?? "")
    if (result) setIsScanning(false);
  };


  const handleInput = (e:ChangeEvent) => {
    const { value,name } = e.target as HTMLInputElement;

    if(name === "sendTo"){
      setAddress(value);
    }else if(name === "comment"){
      setComment(value)
    }else{
      setAmount(value)
    }
  }

  const handleSend = async() => {



    try {
      const rpc  = getConfig().NETWORK.rpcs[0];
      let snsAddress = await sns.resolve(address,rpc);
      console.log(snsAddress);
      const isZeroAddress = snsAddress === "0x0000000000000000000000000000000000000000";
      if(isZeroAddress){
        showToast(t('Msg.RequiredWallet'), ToastType.Danger);
        return;
      }

      let obj= {
      to:snsAddress,
      amount,
      asset_name:"SEE",
      comment
    }

      await transferSEE(obj)
      showToast(t('see.transferSuccess'), ToastType.Success);
      handleClose()
      window.location.reload();
    } catch(error:any) {
      console.error(error)
      showToast(`${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    }
  }


  return <Box handleClose={handleClose} title={t('see.transfer')}>
    <QrScanner
      isScanning={isScanning}
      onScanResult={handleScanResult}
    />
      <dl>
        <dt>{t('see.sendTo')}</dt>
        <dd>
          <input type="text" name="sendTo" onChange={handleInput} value={address}  />
          <span onClick={() => setIsScanning(!isScanning)}>{isScanning?<X />:<ScanLine />}</span>
        </dd>
      </dl>


    <dl>
      <dt>{t('see.amount')}</dt>
      <dd>
        <input type="number" name="amount" onChange={handleInput} value={amount} />
        <span>SEE</span>
      </dd>
    </dl>
    <dl>
      <dt>{t('see.comment')}</dt>
      <dd>
        <textarea name="comment" onChange={handleInput} value={comment}  />
      </dd>
    </dl>
    <div>
      <Button variant="primary" onClick={()=>handleSend()}>{t('see.send')}</Button>
    </div>
  </Box>
}
