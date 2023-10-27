import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
        <div>
          <span> {process.env.REACT_APP_APP_VERSION}</span>
          {open && (
            <span>
              .Build {process.env.REACT_APP_BUILD_ID?.slice(0, 6)}.{process.env.REACT_APP_COMMIT_REF?.slice(0, 6)}
            </span>
          )}
        </div>
      </VersionBox>
    </>
  );
}

const VersionBox = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 12px;
  line-height: 22px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 0 0 20px 30px;
  &.lft {
    text-align: center;
    left: -15px;
  }
`;

const FeedbackBox = styled.div`
  cursor: pointer;
  color: var(--bs-body-color_active);
`;
