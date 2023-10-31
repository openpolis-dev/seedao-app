import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ReTurnProject } from 'type/project.type';
import Members from './members';
import ReactMarkdown from 'react-markdown';
import { updateMembers } from 'requests/project';
import { Button } from 'react-bootstrap';
import React, { useState } from 'react';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import requests from 'requests';
import { useParams } from 'react-router-dom';
import CloseTips from './closeTips';
import CloseSuccess from './closeSuccess';

interface Iprops {
  detail: ReTurnProject | undefined;
  onUpdate: () => void;
  handleEdit: () => void;
}
export default function Info({ detail, onUpdate, handleEdit }: Iprops) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const { id } = useParams();
  const { dispatch } = useAuthContext();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClosePro = async () => {
    setShow(false);
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await requests.application.createCloseProjectApplication(Number(id as string));
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
      setShowSuccess(true);

      // reset project status
      // updateProjectStatus(ProjectStatus.Pending);
    } catch (e) {
      console.error(e);
      // showToast(JSON.stringify(e), ToastType.Danger);
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
      closeModal();
    }
  };
  const closeModal = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
  };
  return (
    <>
      {show && <CloseTips closeModal={closeModal} handleClosePro={handleClosePro} />}
      {showSuccess && <CloseSuccess closeModal={closeSuccess} />}
      <TopBox>
        <TopImg>
          <img src={detail?.logo} alt="" />
        </TopImg>
        <TopInfo>
          <TitleBox>{detail?.name}</TitleBox>
          <div className="desc">{detail?.desc}</div>
          <ProposalBox>
            {detail?.proposals.map((item, index) => (
              <li key={index}>
                <a href={item} target="_blank" rel="noopener noreferrer">
                  {`SIP-${index + 1}`}
                </a>
              </li>
            ))}
          </ProposalBox>
        </TopInfo>
        <div>
          <Button onClick={() => handleEdit()}>Edit project</Button>
          <TextButton onClick={() => handleShow()}>Close project</TextButton>
        </div>
      </TopBox>
      <ContentBox>
        <div>介绍</div>
        <ReactMarkdown>{detail?.intro || ''}</ReactMarkdown>
      </ContentBox>
      <Members detail={detail} updateProject={onUpdate} />
    </>
  );
}

const TopBox = styled.div`
  display: flex;
  margin-top: 46px;
  padding-bottom: 37px;
  border-bottom: 1px solid var(--bs-border-color);
`;

const TopImg = styled.div`
  margin-right: 18px;
  img {
    width: 110px;
    height: 110px;
    border-radius: 16px;
  }
`;

const TitleBox = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: var(--bs-body-color_active);
  line-height: 36px;
`;

const TopInfo = styled.div`
  flex-grow: 1;
  margin: 8px auto;
  .desc {
    width: 630px;

    font-size: 12px;
    font-weight: 400;
    color: #b0b0b0;
    line-height: 18px;
  }
`;

const ProposalBox = styled.ul`
  display: flex;
  align-items: center;
  margin-top: 14px;
  flex-wrap: wrap;
  li {
    border-radius: 5px;
    border: 1px solid #0085ff;
    font-size: 12px;
    margin-right: 12px;
    a {
      padding: 2px 12px;
      color: #0085ff;
    }
  }
`;

const TextButton = styled.div`
  margin-top: 20px;
  font-size: 14px;
  font-family: Poppins-Medium;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  cursor: pointer;
`;

const ContentBox = styled.div`
  line-height: 1.2em;
  padding-top: 40px;
  margin-top: 20px;
  h2 {
    padding: 1rem 0;
  }
  p {
    padding: 0 -0px 1rem;
  }
  img {
    max-width: 100%;
  }
`;
