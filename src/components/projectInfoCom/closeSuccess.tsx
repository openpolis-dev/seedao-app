import styled from 'styled-components';
import { Card, Button } from 'react-bootstrap';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BasicModal from 'components/modals/basicModal';

const Mask = styled.div`
  background: rgba(0, 0, 0, 0.3);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 999999999999999999;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .btnBtmAll {
    margin-right: 20px;
  }
`;

const CardHeader = styled.div`
  min-width: 500px;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgb(237, 241, 247);
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  color: rgb(34, 43, 69);
  font-family: Inter-Regular, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.5rem;
`;

const CardBody = styled.div`
  color: var(--bs-body-color_active);
  font-size: 14px;
  line-height: 24px;
`;
const CardFooter = styled.div`
  text-align: center;
  margin-top: 24px;
  button {
    width: 110px;
  }
`;

interface Iprops {
  closeModal: () => void;
}

export default function CloseSuccess(props: Iprops) {
  const { closeModal } = props;
  const { t } = useTranslation();

  return (
    <BasicModal title={t('Project.CloseProject')} handleClose={closeModal}>
      <CardBody>{t('Project.closeTips')}</CardBody>
      <CardFooter>
        <Button onClick={() => closeModal()}>{t('general.ok')}</Button>
      </CardFooter>
    </BasicModal>
  );
}
