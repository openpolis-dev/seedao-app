import styled from 'styled-components';
import { Button, Card } from 'react-bootstrap';
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
const InnerBox = styled.div`
  width: 400px;
`;

const CardHeader = styled.div``;

const CardBody = styled.div``;
const CardFooter = styled.div``;

interface Iprops {
  closeModal: () => void;
  handleClosePro: () => void;
}

export default function CloseTips(props: Iprops) {
  const { closeModal, handleClosePro } = props;
  const { t } = useTranslation();

  return (
    <Mask>
      <Card>
        <CardHeader> {t('Project.CloseProject')}</CardHeader>
        <CardBody>
          <InnerBox>{t('Project.confirmClose')}</InnerBox>
        </CardBody>
        <CardFooter>
          <Button className="btnBtmAll" onClick={() => closeModal()}>
            {t('general.cancel')}
          </Button>
          <Button onClick={() => handleClosePro()}>{t('general.confirm')}</Button>
        </CardFooter>
      </Card>
    </Mask>
  );
}
