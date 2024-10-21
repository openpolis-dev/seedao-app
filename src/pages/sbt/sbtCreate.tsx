import { InputGroup, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import React, { ChangeEvent, useState, FormEvent } from 'react';
import { useAuthContext } from 'providers/authProvider';
import { useTranslation } from 'react-i18next';
import useToast from 'hooks/useToast';
import { X } from 'react-bootstrap-icons';
import { ContainerPadding } from 'assets/styles/global';
import UploadImg from '../../assets/Imgs/profile/upload.svg';

import { useNavigate } from 'react-router-dom';
import BackerNav from '../../components/common/backNav';
import { compressionFile, fileToDataURL } from 'utils/image';
import SeeSelect from "../../components/common/select";

const OuterBox = styled.div`
  ${ContainerPadding};
  input {
    min-height: 40px;
  }
`;

const HeadBox = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  margin-bottom: 40px;
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
    dispatch,
  } = useAuthContext();
  const { t } = useTranslation();
  const { Toast, showToast } = useToast();
  const [sbtName, setSbtName] = useState<string | undefined>('');
  const [metadata, setMetadata] = useState('');

  const [contract, setContract] = useState('');

  const [github, setGithub] = useState('');
  const [mirror, setMirror] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');

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
      case 'contract':
        setContract(value);
        break;
    }
  };
  const saveProfile = async () => {

  };



  const updateLogo = async (e: FormEvent) => {
    const { files } = e.target as any;
    const file = files[0];
    const new_file = await compressionFile(file, file.type);
    const base64 = await fileToDataURL(new_file);
    setAvatar(base64);
  };

  const removeUrl = () => {
    setAvatar('');
  };

  return (
    <OuterBox>
      {Toast}
      <CardBox>
        <BackerNav title={t('sbt.sbtName')} to={`/city-hall/tech`} mb="40px" />
        {/*<TitleBox>{t('My.MyProfile')}</TitleBox>*/}
        <HeadBox>
          <AvatarBox>
            <UploadBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)}>
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
                <Form.Control
                  type="text"
                  placeholder=""
                  value={sbtName}
                  onChange={(e) => handleInput(e, 'sbtName')}
                />
              </InputBox>
            </li>
            <li>
              <div className="title">
               {t('sbt.Metadata')}
              </div>
              <InputBox>
                <Form.Control
                  placeholder=""
                  as="textarea"
                  rows={5}
                  value={metadata}
                  onChange={(e) => handleInput(e, 'metadata')}
                />
              </InputBox>
            </li>
            <li>
              <div className="title">
                {t('sbt.selectContract')}
              </div>
              <InputBox>
                <SeeSelect
                  width="100%"
                  // options={TIME_OPTIONS}
                  value={contract}
                  isClearable={false}
                  isSearchable={false}
                  onChange={(v: ISelectItem) => {
                    // setSelectTime(v);
                    // searchParams.set('sort_order', v?.value ?? '');
                    // setSearchParams(searchParams);
                  }}
                />
              </InputBox>
            </li>
            <RhtLi>
              <Button onClick={() => saveProfile()}>{t('general.confirm')}</Button>
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
