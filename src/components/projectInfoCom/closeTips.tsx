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
  padding: 20px;
`;
const CardFooter = styled.div`
  padding: 0 20px 20px;
`;
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
          <Button variant="outline-primary" className="btnBtmAll" onClick={() => closeModal()}>
            {t('general.cancel')}
          </Button>
          <Button onClick={() => handleClosePro()}>{t('general.confirm')}</Button>
        </CardFooter>
      </Card>
    </Mask>
  );
}
