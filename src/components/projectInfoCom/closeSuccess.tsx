import styled from 'styled-components';
import { Card, Button } from 'react-bootstrap';
import React from 'react';
import { useTranslation } from 'react-i18next';

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

const CardHeader = styled.div``;

const CardBody = styled.div``;
const CardFooter = styled.div``;
const InnerBox = styled.div`
  width: 400px;
`;

interface Iprops {
  closeModal: () => void;
}

export default function CloseSuccess(props: Iprops) {
  const { closeModal } = props;
  const { t } = useTranslation();

  return (
    <Mask>
      <Card>
        <CardHeader> {t('Project.CloseProject')}</CardHeader>
        <CardBody>
          <InnerBox>{t('Project.closeTips')}</InnerBox>
        </CardBody>
        <CardFooter>
          <Button onClick={() => closeModal()}>{t('general.ok')}</Button>
        </CardFooter>
      </Card>
    </Mask>
  );
}
