import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function AppVersion() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const toGo = () => {
    navigate('/feedback');
  };
  return (
    <VersionBox>
      <FeedbackBox onClick={() => toGo()}>{t('menus.feedback')}</FeedbackBox>
      {process.env.REACT_APP_APP_VERSION} Build {process.env.REACT_APP_BUILD_ID?.slice(0, 6)}.
      {process.env.REACT_APP_COMMIT_REF?.slice(0, 6)}
    </VersionBox>
  );
}

const VersionBox = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 200px;
  font-size: 12px;
  line-height: 40px;
  text-align: center;
  box-sizing: border-box;
  color: #999;
`;

const FeedbackBox = styled.div`
  cursor: pointer;
`;
