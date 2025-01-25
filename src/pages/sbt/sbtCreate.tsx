import { InputGroup, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import React, { ChangeEvent, useState, FormEvent, useEffect } from "react";
import { AppActionType, useAuthContext } from "providers/authProvider";
import { useTranslation } from 'react-i18next';
import useToast, { ToastType } from "hooks/useToast";
import { X } from 'react-bootstrap-icons';
import { ContainerPadding } from 'assets/styles/global';
import UploadImg from '../../assets/Imgs/profile/upload.svg';

import { useNavigate } from 'react-router-dom';
import BackerNav from '../../components/common/backNav';
import SeeSelect from "../../components/common/select";
import { createSBT, getContracts, uploadFile } from "../../requests/cityHall";
import publicJs from "../../utils/publicJs";
import { ethers } from "ethers";
import SBTabi from "../../assets/abi/SBT.json";
import { Steps } from 'antd';
import { IExcelObj } from "../../type/project.type";
import {Input} from "antd"
import CopyBox from "../../components/copy";
import CopyIconSVG from "../../assets/Imgs/copy.svg";
const { TextArea } = Input;

const OuterBox = styled.div`
  ${ContainerPadding};
  input {
    min-height: 40px;
      background: transparent!important;
      color: var(--bs-body-color_active);
      &:disabled{
          color: var(--bs-body-color_active);
      }
  }
    textarea{
        background: transparent!important;
        color: var(--bs-body-color_active);
        &:disabled{
            color: var(--bs-body-color_active);
        }
        &::placeholder{
            color: var(--bs-body-color);
        }
    }
   .ant-steps-item-finish>.ant-steps-item-container>.ant-steps-item-content>.ant-steps-item-title{
        color: var(--bs-body-color_active)!important;
    }
     .ant-steps-item:last-child .ant-steps-item-title{
         color: var(--bs-body-color_active)!important;
    }
`;

const HeadBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
    .title{
        margin-top: 8px;
        min-width: 90px;
        display: flex;
        font-size: 14px;
        margin-right: 16px;
        color: var(--bs-body-color_active);
    }
`;
const CardBox = styled.div`
  min-height: 100%;
  @media (max-width: 1024px) {
    padding: 20px;
  }
`;
const AvatarBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  overflow: hidden;
  label {
    margin-top: 0;
  }
`;

const UlBox = styled.ul`
  width: 600px;
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
        display: flex;
        align-items: center;
        gap: 10px;
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

const TitleBox = styled.div`
  font-size: 24px;
  font-family: Poppins-Bold;
  color: var(--bs-body-color_active);
  line-height: 30px;
  margin-bottom: 40px;
`;

export default function SbtCreate() {
  const {
    state:{
      sbtToken
    },
    dispatch,
  } = useAuthContext();
  const { t } = useTranslation();
  const { Toast, showToast } = useToast();
  const [sbtName, setSbtName] = useState<string | undefined>('');
  const [metadata, setMetadata] = useState('');
  const [contract, setContract] = useState('');
  const [ipfsHash, setIpfsHash] = useState("");
  const [avatar, setAvatar] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [result,setResult] = useState<any>(null);

  const[current,setCurrent] = useState(0);

  useEffect(() => {
    getList()
  }, []);

  const getList = async() =>{
   try{
     let rt = await getContracts(sbtToken);
     rt.data.map((item:any)=>{
       item.label =`${item.name}(${item.contract_address})`;
       item.value = item.contract_address;
     })
     setList(rt.data)
   }catch(error:any){
     showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
   }

  }


  const navigate = useNavigate();

  const handleInput = (e: ChangeEvent, type: string) => {
    const { value } = e.target as HTMLInputElement;
    switch (type) {
      case 'sbtName':
        setSbtName(value);
        break;
      case 'metadata':
        setMetadata(value);
        break;
    }
  };



  const saveSBT = async () => {
    let newMeta = null;
    try{
      newMeta = JSON.parse(metadata);
      newMeta.image = ipfsHash;

    }catch(e){
      showToast(t('sbt.metadataError'), ToastType.Danger);
      return;
    }

    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    let obj = {
      "organization_contract_id": (contract as any).ID,
      "nft_name": sbtName,
      "nft_metadata": JSON.stringify(newMeta),
    }

    try{

      let result =  await createSBT(sbtToken,obj)
      setResult(result)
      setCurrent(1)

    }catch(error:any){
      // showToast(t('Msg.ApproveFailed'), ToastType.Danger);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    }finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }



  };

  const handleWeb3 = async() =>{
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try{
      const {nft_id,nft_uri} = result.data;
      const web3Provider = new ethers.providers.Web3Provider((window as any).ethereum);

      const signer = web3Provider.getSigner()
      const contractInit = new ethers.Contract((contract as any).contract_address, SBTabi, signer);

      const rt = await contractInit.setURI(nft_id,nft_uri);

      const receipt = await rt.wait()
      console.log(receipt)

      showToast(t('Msg.ApproveSuccess'), ToastType.Success);

      setTimeout(()=>{
        // navigate("/sbt/list/pending")
        window.location.reload();
      },1500)

    }catch(error:any){
      // showToast(t('Msg.ApproveFailed'), ToastType.Danger);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    }finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }

  }


  const updateLogo = async (e: FormEvent) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try{

      const { files } = e.target as any;
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      const result = await uploadFile(sbtToken,formData);
      setIpfsHash(result.data.ipfs_hash)
      let rt = await publicJs.getImage(result.data.ipfs_hash);
      setAvatar(rt as string);
      showToast(t('sbt.uploadSuccess'), ToastType.Success);
    }catch(error:any){
      console.log(error);
      setAvatar("")
      setIpfsHash("")
      // showToast(t('sbt.uploadFailed'), ToastType.Danger);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    }finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }

  };

  const removeUrl = () => {
    if(current) return;
    setAvatar('');
  };

  return (
    <OuterBox>
      {Toast}
      <CardBox>
        <BackerNav title={t('sbt.create')} to={`/city-hall/tech`} mb="40px" />
        {/*<TitleBox>{t('My.MyProfile')}</TitleBox>*/}
        <StepBox >
          <Steps
            size="small"
            current={current}
            items={[
              {
                title:t('sbt.step1'),
              },
              {
                title: t('sbt.step2'),
              },
            ]}
          />
        </StepBox>

            <HeadBox>
              <div className="title">
                {t('sbt.sbtImg')}
              </div>
              <AvatarBox>
                <UploadBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)} aria-readOnly={current === 0}>
                  {!avatar && (
                    <div>
                      <input id="fileUpload" type="file" hidden accept=".jpg, .jpeg, .png" />
                      {<img src={UploadImg} />}
                    </div>
                  )}
                  {!!avatar && (
                    <ImgBox onClick={() => removeUrl()}>
                      <div className="del">
                        <X className="iconTop" />
                      </div>
                      <img src={avatar} alt="" />
                    </ImgBox>
                  )}
                </UploadBox>
              </AvatarBox>
            </HeadBox>
            <MidBox>
              <UlBox>
                <li>
                  <div className="title">
                    {t('sbt.sbtName')}
                  </div>
                  <InputBox>
                    <Input
                      type="text"
                      placeholder=""
                      value={sbtName}
                      onChange={(e) => handleInput(e, 'sbtName')}
                      disabled={current === 1}
                    />
                  </InputBox>
                </li>
                <li>
                  <div className="title">
                    {t('sbt.Metadata')}
                  </div>
                  <InputBox>
                    <TextArea
                      placeholder={JSON.stringify({
                        "name": "第x届市政厅成员"
                      },null,4)}
                      rows={5}
                      value={metadata}
                      onChange={(e) => handleInput(e, 'metadata')}
                      readOnly={current === 1}
                    />
                  </InputBox>
                </li>
                <li>
                  <div className="title">
                    {t('sbt.selectContract')}
                  </div>
                  <div className="flex">
                    <InputBox>
                      <SeeSelect
                        width="100%"
                        options={list}
                        value={contract}
                        isClearable={false}
                        isSearchable={false}
                        onChange={(v: any) => {
                          setContract(v);
                        }}
                        isDisabled={current === 1}
                      />
                    </InputBox>
                    {
                      !!(contract as any)?.value && <CopyBox text={(contract as any)?.value}>
                      <img src={CopyIconSVG} alt="" />
                      </CopyBox>
                    }

                  </div>
                </li>
                <RhtLi>
                  {
                    current === 0 &&   <Button onClick={() => saveSBT()} disabled={!ipfsHash || !sbtName || !metadata || !contract}>{t('general.confirm')}</Button>
                  }
                  {
                    current === 1 &&   <Button onClick={() => handleWeb3()} disabled={!ipfsHash || !sbtName || !metadata || !contract}>设置URI</Button>
                  }

                </RhtLi>
              </UlBox>
            </MidBox>




      </CardBox>
    </OuterBox>
  );
}

const StepBox = styled.div`
  width: 400px;
    margin-bottom: 40px;
`

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
    .imgMax{
        height: 150px;
        width: 150px;
        object-fit: cover;
    }
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
