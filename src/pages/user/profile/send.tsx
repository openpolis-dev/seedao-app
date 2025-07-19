import { useTranslation } from "react-i18next";
import BasicModal from "../../../components/modals/basicModal";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import { ChangeEvent, useState } from "react";

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

  const handleInput = (e:ChangeEvent) => {
    const { value,name } = e.target as HTMLInputElement;
    if(name === "sendTo"){
      setAddress(value);
    }else{
      setAmount(value)
    }
  }

  const handleSend = () => {

    let obj= {
      address,
      amount
    }
    console.log(obj)

  }


  return <Box handleClose={handleClose} title={t('see.transfer')}>
      <dl>
        <dt>{t('see.sendTo')}</dt>
        <dd>
          <textarea name="sendTo" onChange={handleInput} value={address}  />
        </dd>
      </dl>
    <dl>
      <dt>{t('see.amount')}</dt>
      <dd>
        <input type="number" name="amount" onChange={handleInput} value={amount} />
        <span>SEE</span>
      </dd>
    </dl>
    <div>
      <Button variant="primary" onClick={()=>handleSend()}>{t('see.send')}</Button>
    </div>
  </Box>
}
