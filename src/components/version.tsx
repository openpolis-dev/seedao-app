import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import getConfig from 'utils/envCofnig';

export default function AppVersion({ open }: any) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const toGo = () => {
    navigate('/feedback');
  };
  return (
    <>
      <VersionBox className={open ? '' : 'lft'}>
        <FeedbackBox onClick={() => toGo()}>{t('menus.feedback')}</FeedbackBox>
        <a href="https://docs.seedao.tech/seedao-app/updates" target="_blank" rel="noreferrer">
          <span> {getConfig().REACT_APP_APP_VERSION}</span>
          {open && (
            <div>
              {process.env.REACT_APP_BUILD_ID?.slice(0, 6)}.{process.env.REACT_APP_COMMIT_REF?.slice(0, 6)}
            </div>
          )}
        </a>
      </VersionBox>
    </>
  );
}

const VersionBox = styled.div`
  width: 100%;
  font-size: 12px;
  box-sizing: border-box;
  //overflow: hidden;
  text-align: left;
  //padding: 0 0 20px 0;
  //background: #f00;
  line-height: 14px;
  &.lft {
    text-align: center;
    left: -15px;
  }
  @media (max-height: 740px) {
    display: none;
  }
`;

const FeedbackBox = styled.div`
  cursor: pointer;
  color: var(--bs-body-color_active);
  margin-bottom: 6px;
`;
