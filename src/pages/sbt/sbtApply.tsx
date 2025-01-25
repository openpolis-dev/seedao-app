import { InputGroup, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import React, { ChangeEvent, useState, useEffect } from "react";
import { AppActionType, useAuthContext } from "providers/authProvider";
import { useTranslation } from 'react-i18next';
import useToast, { ToastType } from "hooks/useToast";
import { ContainerPadding } from 'assets/styles/global';

import { useNavigate } from 'react-router-dom';
import BackerNav from '../../components/common/backNav';
import { applySBT, getContracts, getSBTlist } from "../../requests/cityHall";
import publicJs from 'utils/publicJs';
import sns from "@seedao/sns-js";

import SeeSelect from "../../components/common/select";
import CopyBox from "../../components/copy";
import CopyIconSVG from "../../assets/Imgs/copy.svg";
import EmptyDarkIcon from "../../assets/Imgs/dark/empty.svg";
import EmptyLightIcon from "../../assets/Imgs/light/empty.svg";
import getConfig from "../../utils/envCofnig";

const OuterBox = styled.div`
  ${ContainerPadding};
  input {
    min-height: 40px;
  }
    .flex{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
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
    .flex{
        width: 100%;
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

        & > div{
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            text-align: center;
        }
        
    }
    .nftId{
        font-size: 10px;
    }

    .photo{

        display: flex !important;
        overflow: hidden;
        .aspect {
            padding-bottom: 100%;
            height: 0;
            flex-grow: 1 !important;
        }
        .content {
            width: 100%;
            margin-left: -100% !important;
            max-width: 100% !important;
            flex-grow: 1 !important;
            position: relative;
        }
        .innerImg{
            position: absolute;
            width: 100%;
            height: 100%;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
    .inner{
        width: 150px;
        height: 150px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &:hover{
            border: 0;
            cursor: not-allowed;
        }
        img{
            width: 75px;
        }
    }
`

export default function SbtApply() {
  const {
    state:{
      sbtToken,
      theme
    },
    dispatch,
  } = useAuthContext();
  const { t } = useTranslation();
  const { Toast, showToast } = useToast();

  const [snsStr, setSnsStr] = useState('');

  const [current,setCurrent] = useState<number|null>(null);
  const [list,setList] = useState<any[] >([]);
  const [contractList,setContractList] = useState<any[] >([]);
  const [contract, setContract] = useState('');



  useEffect(() => {
    getList()
  }, []);

  const getList = async() =>{
    let rt = await getContracts(sbtToken);
    rt.data.map((item:any)=>{
      item.label =`${item.name}(${item.contract_address})`;
      item.value = item.contract_address;
    })
    setContractList(rt.data)
  }

  useEffect(() => {
    if(!sbtToken || !contract)return;
    getNftList()
  }, [sbtToken,contract]);

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
      let arrItem:any[] = []
      rt.data.map((item:any)=>{
          if(item?.nft_contract_address?.toLowerCase() === (contract as any)?.value?.toLowerCase()){
            arrItem.push(item)
          }
      })

      setList(arrItem);
    }catch(error:any){
      console.log(error);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
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
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      let result = await sns.resolves(unique_list,getConfig().NETWORK.rpcs[0])
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

        showToast(t('sbt.ApplySuccess'), ToastType.Success);
        setTimeout(()=>{
          // navigate("/sbt/list/pending")
          window.location.reload();
        },1500)
      }
    }catch(error:any){
      console.error(error);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
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
                {t("sbt.selectContract")}
              </div>
              <div className="flex">
                <InputBox>
                  <SeeSelect
                    width="100%"
                    options={contractList}
                    value={contract}
                    isClearable={false}
                    isSearchable={false}
                    onChange={(v: any) => {
                      setContract(v);
                    }}
                  />
                </InputBox>
                {
                  !!(contract as any)?.value && <CopyBox text={(contract as any)?.value}>
                    <img src={CopyIconSVG} alt="" />
                  </CopyBox>
                }
              </div>
            </li>
            {
              !!(contract as any)?.value && !!list?.length &&  <li>
                <div className="title">
                  {t("sbt.selectSBT")}
                </div>
                <ImgUl>

                  {
                    list.map((item, i) => (
                      <dl key={i} onClick={() => handleSelect(i)} className={current === i ? "active" : ""}>
                        <dt>

                          <div className="photo">
                            <div className="aspect" />
                            <div className="content">
                              <div className="innerImg">
                                <img src={item.image} alt="" />
                              </div>
                            </div>
                          </div>

                        </dt>
                        <dd>
                          <div>{item?.nft_name}</div>
                          <div className="nftId">Token Id {item?.nft_id}</div>
                        </dd>
                      </dl>))
                  }
                </ImgUl>
              </li>
            }

          {
           !list?.length &&  <li>
              <div className="title">
                {t("sbt.selectSBT")}
              </div>
              <ImgUl>
                    <dl className="inner">
                      <dt>
                        <img src={theme ? EmptyDarkIcon : EmptyLightIcon} alt="" />
                      </dt>
                      <dd> -- </dd>
                    </dl>
              </ImgUl>
            </li>
          }

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
