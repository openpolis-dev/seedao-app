import { InputGroup, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import React, { ChangeEvent, useState, useEffect } from "react";
import { AppActionType, useAuthContext } from "providers/authProvider";
import { useTranslation } from 'react-i18next';
import useToast, { ToastType } from "hooks/useToast";
import { ContainerPadding } from 'assets/styles/global';

import { useNavigate } from 'react-router-dom';
import BackerNav from '../../components/common/backNav';
import { applySBT, getSBTlist } from "../../requests/cityHall";
import publicJs from 'utils/publicJs';
import sns from "@seedao/sns-js";

const OuterBox = styled.div`
  ${ContainerPadding};
  input {
    min-height: 40px;
  }
`;


const CardBox = styled.div`
  min-height: 100%;
  @media (max-width: 1024px) {
    padding: 20px;
  }
`;


const UlBox = styled.ul`
  li {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 20px;

    .title {
      margin-right: 16px;
      margin-top: 8px;
      min-width: 90px;
      display: flex;
      font-size: 14px;
      color: var(--bs-body-color_active);
    }
    .icon {
      margin-right: 10px;
      img {
        height: 16px;
        line-height: 16px;
      }
    }
  }
  @media (max-width: 750px) {
    li {
      flex-direction: column;
      margin-bottom: 10px;
    }
  }
`;
const InputBox = styled(InputGroup)`
  max-width: 600px;
  .wallet {
    border: 1px solid #eee;
    width: 100%;
    border-radius: 0.25rem;
    height: 40px;
    padding: 0 1.125rem;
    display: flex;
    align-items: center;
    overflow-x: auto;
  }
  .copy-content {
    position: absolute;
    right: -30px;
    top: 8px;
  }
  @media (max-width: 1024px) {
    max-width: 100%;
  } ;
`;
const MidBox = styled.div`
  display: flex;
  padding-bottom: 40px;
`;

const ImgUl = styled.div`
  display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    dl{
        width: 150px;
        background: var(--bs-box-background);
        box-shadow: var(--box-shadow);
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid var(--bs-box-background);
        cursor: pointer;
        img{
            width: 100%;
        }
        &.active,&:hover{
            border: 2px solid var(--bs-primary);
        }
    }
    dd{
        font-size: 14px;
        padding: 10px;
    }
`

export default function SbtApply() {
  const {
    state:{
      sbtToken
    },
    dispatch,
  } = useAuthContext();
  const { t } = useTranslation();
  const { Toast, showToast } = useToast();

  const [snsStr, setSnsStr] = useState('');

  const [current,setCurrent] = useState<number|null>(null);
  const [list,setList] = useState<any[] >([]);


  const navigate = useNavigate();

  useEffect(() => {
    if(!sbtToken)return;
    getNftList()
  }, [sbtToken]);

  const getNftList = async () =>{
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const rt = await getSBTlist(sbtToken)
      let arr = [];

      for (let i = 0; i < rt.data.length; i++) {
        let item = rt.data[i];
        const imageUrl = await publicJs.getImage(item.nft_image);
        item.image = imageUrl;
        arr.push(item)
      }
      setList(rt.data);
    }catch(error){
      console.log(error);
    }finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  }

  const AddressZero = "0x0000000000000000000000000000000000000000";

  const handleInput = (e: ChangeEvent) => {
    const { value } = e.target as HTMLInputElement;
    setSnsStr(value);
  };

  const handleSubmit = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    const to_be_parsed:any[] = [];
    snsStr.split("\n").forEach((item) => {
      const str = item.trim();
      if (str && str.endsWith(".seedao")) {
        to_be_parsed.push(str);
      }
    });
    if (!to_be_parsed.length) {
      showToast(t('SNS.noSNSINput'), ToastType.Danger);
      return;
    }
    const unique_list = Array.from(new Set(to_be_parsed));

    try {
      let result = await sns.resolves(unique_list)
      if(result.includes(AddressZero)){
        showToast(t('sbt.snsError'), ToastType.Danger);
      }else{
        let obj ={
          token:sbtToken,
          organization_id:list[current!].organization_id,
          nft_id:list[current!].nft_id,
          receivers:result.join(","),
          organization_contract_id:list[current!].organization_contract_id
        }
        let rt = await applySBT(obj)
        console.log(rt)

        showToast(t('sbt.ApplySuccess'), ToastType.Success);
        setTimeout(()=>{
          navigate("/sbt/list/pending")
        },1500)
      }
    }catch(error){
      console.error(error);
    }finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }


  };

  const handleSelect = (e:number) => {
    setCurrent(e)
  }



  return (
    <OuterBox>
      {Toast}
      <CardBox>
        <BackerNav title={t('sbt.Apply')} to={`/city-hall/governance`} mb="40px" />
        {/*<TitleBox>{t('My.MyProfile')}</TitleBox>*/}

        <MidBox>
          <UlBox>
            <li>
              <div className="title">
                {t("sbt.type")}
              </div>
              <ImgUl>

                {
                  list.map((item, i) => (<dl key={i} onClick={() => handleSelect(i)} className={current===i?"active":""}>
                    <dt>
                      <img src={item.image} alt="" />
                    </dt>
                    <dd>{item?.nft_name}</dd>
                  </dl>))
                }
              </ImgUl>
            </li>
            <li>
              <div className="title">
                {t("sbt.sns")}
              </div>
              <InputBox>
                <Form.Control
                  placeholder=""
                  as="textarea"
                  rows={5}
                  value={snsStr}
                  onChange={(e) => handleInput(e)}
                />
              </InputBox>
            </li>

            <RhtLi>
              <Button onClick={() => handleSubmit()} disabled={!snsStr.length || current == null}>{t("general.confirm")}
              </Button>
            </RhtLi>
          </UlBox>
        </MidBox>
      </CardBox>
    </OuterBox>
  );
}

const RhtLi = styled.div`
    width: 600px;
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;

    .btn {
        padding: 10px 31px;
        font-size: 14px;
    }
`;

const UploadBox = styled.label`
    background: var(--bs-box--background);
    box-shadow: var(--box-shadow);
    height: 150px;
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    margin-top: 20px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;

    .iconRht {
        margin-right: 10px;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
  }
`;

const ImgBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .del {
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    //display: flex;
    align-items: center;
    justify-content: center;
    background: #a16eff;
    opacity: 0.5;
    color: #fff;
    cursor: pointer;
    .iconTop {
      font-size: 40px;
    }
  }
  &:hover {
    .del {
      display: flex;
    }
  }
`;
