import { InputGroup, Button, Form } from 'react-bootstrap';
import styled from 'styled-components';
import React, { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createNewProject } from 'requests/project';
import { IProject } from 'type/project.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { ContainerPadding } from 'assets/styles/global';
import CameraIconSVG from 'components/svgs/camera';
import BackerNav from 'components/common/backNav';
import SeeSelect from 'components/common/select';
import { ethers } from 'ethers';
import sns from '@seedao/sns-js';

import { compressionFile, fileToDataURL } from 'utils/image';
import DatePickerStyle from 'components/datePicker';
import useProposalCategories from 'hooks/useProposalCategories';
import { formatCategory } from 'components/proposalCom/categoryTag';
import DisableNumberInputWheel from "../../components/DisableInput";
import getConfig from "../../utils/envCofnig";

const LinkPrefix = `${window.location.origin}/proposal/thread/`;


export default function CreateProject() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const {
    dispatch,
    state: { theme },
  } = useAuthContext();
  const [proName, setProName] = useState('');
  const [desc, setDesc] = useState('');
  const [url, setUrl] = useState('');
  const [link, setLink] = useState('');
  const [contact, setContact] = useState('');
  const [sip, setSip] = useState('');

  const [startLink, setStartLink] = useState('');

  const [budget, setBudget] = useState('');
  const [budgetU, setBudgetU] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [endTime, setEndTime] = useState<Date | null>();

  const [leader, setLeader] = useState('');

  const proposalCategories = useProposalCategories();
  const categoryOptions = proposalCategories
    ? proposalCategories.map((item) => ({ value: item.id, label: formatCategory(item.name) }))
    : [];
  const [selectCategory, setSelectCategory] = useState<ISelectItem>();

  const checkBeforeSubmit = async (): Promise<IProject | undefined> => {
    // const _sip = Number(sip);
    // if (_sip <= 0 || sip.includes('.')) {
    //   showToast(t('Msg.InvalidField', { field: t('Project.SIPNumber') }), ToastType.Danger);
    //   return;
    // }
    if (!startLink.startsWith(LinkPrefix)) {
      showToast(t('Msg.InvalidField', { field: t('Project.StartProjectLink') }), ToastType.Danger);
      return;
    }
    const _endTime = endTime?.getTime();
    if (!_endTime) {
    // if (!_endTime || _endTime <= Date.now()) {
      showToast(t('Msg.InvalidField', { field: t('Project.PlanFinishTime') }), ToastType.Danger);
      return;
    }
    if (!link.startsWith('https://') && !link.startsWith('http://')) {
      showToast(t('Msg.InvalidField', { field: t('Project.OfficialLink') }), ToastType.Danger);
      return;
    }
    let _leader = leader;

    if (!ethers.utils.isAddress(leader)) {
      if (!leader!.endsWith('.seedao')) {
        showToast(t('Msg.IncorrectAddress', { content: leader }), ToastType.Danger);
        return;
      }
      try {
        dispatch({ type: AppActionType.SET_LOADING, payload: true });
        const res = await sns.resolves([leader],getConfig().NETWORK.rpcs[0]);
        if (ethers.constants.AddressZero === res[0]) {
          showToast(t('Msg.IncorrectAddress', { content: leader }), ToastType.Danger);
          return;
        }
        _leader = res[0];
      } catch (error) {
        showToast(t('Msg.QuerySNSFailed'), ToastType.Danger);
        dispatch({ type: AppActionType.SET_LOADING, payload: false });
        return;
      }
    }
    return {
      name: proName,
      desc,
      logo: url,
      OfficialLink: link,
      ContantWay: contact,
      SIP: "",
      ApprovalLink: startLink,
      OverLink: "",
      // budgets: [{ name: budget, total_amount: 0 }],
      scr_budget: budget,
      usdc_budget: budgetU,
      Deliverable: deliverables,
      Category: selectCategory!.label,
      PlanTime: String(_endTime),
      sponsors: [_leader],
    };
  };

  const handleSubmit = async () => {
    const params = await checkBeforeSubmit();
    if (!params) {
      return;
    }
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const resp = await createNewProject(params);
      showToast(t('Project.createSuccess'), ToastType.Success);
      navigate(`/project/info/${resp.data.id}`);
    } catch (error: any) {
      showToast(`${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const updateLogo = async (e: FormEvent) => {
    const { files } = e.target as any;
    const file = files[0];
    const new_file = await compressionFile(file, file.type);
    const base64 = await fileToDataURL(new_file);
    setUrl(base64);
  };

  const handleBack = () => {
    navigate('/explore?tab=project');
  };

  const submitDisabled = [proName, desc, selectCategory, startLink, budget,budgetU, leader, link, contact].some(
    (item) => !item || (typeof item === 'string' && !item.trim()),
  );

  return (
    <OuterBox>
      <DisableNumberInputWheel />
      <BackerNav title={t('Project.create')} to="/explore" />
      <FlexBox>
        <CardBody>
          <BtnBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)}>
            <ImgBox>
              {url && <img src={url} alt="" />}
              <UpladBox
                className="upload"
                bg={
                  theme
                    ? 'linear-gradient(180deg, rgba(13,12,15,0) 0%, rgba(38,27,70,0.6) 100%)'
                    : 'linear-gradient(180deg, rgba(217,217,217,0) 0%, rgba(0,0,0,0.6) 100%)'
                }
              >
                <input id="fileUpload" type="file" hidden accept=".jpg, .jpeg, .png, .svg" />
                <CameraIconSVG />
                <UploadImgText>{t('Project.upload')}</UploadImgText>
              </UpladBox>
            </ImgBox>
            {!url && (
              <UpladBox>
                <input id="fileUpload" type="file" hidden accept=".jpg, .jpeg, .png, .svg" />
                <CameraIconSVG />
                <UploadImgText>{t('Project.upload')}</UploadImgText>
              </UpladBox>
            )}
          </BtnBox>
          <RightContent>
            <UlBox>
              <li>
                <div className="title">{t('Project.ProjectName')}</div>
                <InputBox>
                  <Form.Control
                    type="text"
                    placeholder={t('Project.ProjectName')}
                    value={proName}
                    onChange={(e) => setProName(e.target.value)}
                  />
                </InputBox>
              </li>

              {/* <li>
                <div className="title">{t('Project.SIPNumber')}</div>
                <InputBox>
                  <Form.Control type="number" value={sip} onChange={(e) => setSip(e.target.value)} />
                </InputBox>
              </li> */}
              <li>
                <div className="title">{t('Project.ProjectType')}</div>
                <InputBox>
                  <SeeSelect
                    width="100%"
                    options={categoryOptions}
                    onChange={(v: ISelectItem) => setSelectCategory(v)}
                  />
                </InputBox>
              </li>
              <li>
                <div className="title">{t('Project.StartProjectLink')}</div>
                <InputBox>
                  <Form.Control
                    type="text"
                    placeholder={LinkPrefix + '...'}
                    value={startLink}
                    onChange={(e) => setStartLink(e.target.value)}
                  />
                </InputBox>
              </li>
              <li>
                <div className="title">{t('Project.Budget')}</div>
                <FlexBoxLine>
                  <InputBox>
                    <Form.Control type="number" min={0} step={1}  value={budget} onChange={(e) => {
                      const inputValue = e.target.value;
                      if (/^\d*\.?\d*$/.test(inputValue)) {
                        setBudget(inputValue);
                      }

                    }} />
                    <span> WANG</span>

                  </InputBox>
                  <InputBox>
                    <Form.Control type="number" min={0} step={1} value={budgetU} onChange={(e) => {
                      const inputValue = e.target.value;
                      if (/^\d*\.?\d*$/.test(inputValue)) {
                        setBudgetU(e.target.value);
                      }

                    }} /><span>USDC</span>
                  </InputBox>

                </FlexBoxLine>


              </li>
              <li>
                <div className="title">{t('Project.Deliverables')}</div>
                <Form.Control
                  placeholder=""
                  as="textarea"
                  rows={5}
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                />
              </li>
              <li>
                <div className="title">{t('Project.PlanFinishTime')}</div>
                <InputBox>
                  <DatePickerStyle isDate placeholder="" dateTime={endTime} onChange={(e) => setEndTime(e)} />
                </InputBox>
              </li>
              <li>
                <div className="title">{t('Project.Moderator')}</div>
                <InputBox>
                  <Form.Control
                    type="text"
                    placeholder={t('Project.AddMemberAddress')}
                    value={leader}
                    onChange={(e) => setLeader(e.target.value)}
                  />
                </InputBox>
              </li>
              <li>
                <div className="title">{t('Project.Contact')}</div>
                <InputBox>
                  <Form.Control type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
                </InputBox>
              </li>
              <li>
                <div className="title">{t('Project.OfficialLink')}</div>
                <InputBox>
                  <Form.Control
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://..."
                  />
                </InputBox>
              </li>

              <li>
                <div className="title">{t('Project.Desc')}</div>
                <Form.Control
                  placeholder=""
                  as="textarea"
                  rows={5}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </li>
            </UlBox>
          </RightContent>
        </CardBody>
        <RhtBtnBox>
          <Button style={{ width: '80px' }} onClick={() => handleSubmit()} disabled={submitDisabled}>
            {t('general.confirm')}
          </Button>
          <Button variant="light" style={{ width: '80px' }} onClick={handleBack}>
            {t('general.cancel')}
          </Button>
        </RhtBtnBox>
      </FlexBox>
    </OuterBox>
  );
}

const FlexBox = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const RhtBtnBox = styled.div`
  display: flex;
  flex-direction: column;
  .btn {
    margin-bottom: 20px;
  }
`;

const OuterBox = styled.div`
  box-sizing: border-box;
  min-height: 100%;
  ${ContainerPadding};
`;

const CardBody = styled.div`
  display: flex;
  gap: 32px;
  padding-bottom: 100px;
`;

const BtmBox = styled.div`
  margin-top: 10px;
  button {
    width: 76px;
    height: 34px;
    font-size: 14px;
  }
  button:first-child {
    margin-right: 16px;
  }
`;

const UlBox = styled.ul`
  display: flex;
  flex-direction: column;
  li {
    margin-bottom: 14px;
    .title {
      font-size: 16px;
      font-family: Poppins-SemiBold, Poppins;
      font-weight: 600;
      color: var(--bs-body-color_active);
      line-height: 22px;
      margin-bottom: 14px;
    }
  }
`;

const InputBox = styled(InputGroup)`
  width: 576px;
  height: 40px;
  @media (max-width: 870px) {
    width: 400px;
  }
`;

const DescInputBox = styled(InputBox)`
  height: 78px;
`;

const ProposalInputBox = styled(InputBox)`
  width: 480px;
`;

const MemberInputBox = styled(InputBox)`
  width: 480px;
`;

const ItemBox = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BackBox = styled.div`
  width: 100%;
  display: inline-flex;
  align-items: center;
  margin-bottom: 48px;
  cursor: pointer;

  svg {
    margin-right: 10px;
  }
`;

const BtnBox = styled.label`
  background: var(--bs-box--background);
  height: 110px;
  width: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  font-weight: 700;
  font-size: 14px;
  position: relative;
  overflow: hidden;
  .iconRht {
    margin-right: 10px;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
  .uploadIcon {
    font-size: 20px;
    margin-right: 10px;
  }
`;

const ImgBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-position: center;
    object-fit: cover;
  }
  .upload {
    display: none;
  }
  &:hover .upload {
    display: flex;
  }
`;

const IntroBox = styled.div`
  .cm-scroller,
  .md-editor-preview-wrapper {
    background: var(--bs-background);
  }
`;

const RightContent = styled.div`
  width: 576px;
  @media (max-width: 870px) {
    width: 400px;
  }
`;

const UpladBox = styled.div<{ bg?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
  background: ${(props) => props.bg};
`;

const UploadImgText = styled.p`
  font-size: 12px;
  font-family: Poppins-Regular, Poppins;
  font-weight: 400;
  color: var(--bs-svg-color);
  line-height: 12px;
`;

const RoleSelect = styled(SeeSelect)`
  .react-select__control {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

const FlexBoxLine = styled.div`
  display: flex;
    align-items: center;
    gap: 20px;
    span{
        line-height: 40px;
        padding-left: 10px;
        color:var(--bs-body-color_active);
    }
`
