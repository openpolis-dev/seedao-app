import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastType } from 'hooks/useToast';
import BasicModal from 'components/modals/basicModal';

interface Iprops {
  closeShow: () => void;
  handleConfirm: (data: string[]) => void;
  showToast: (msg: string, type: ToastType) => void;
}
export default function IssuedModal(props: Iprops) {
  const { t } = useTranslation();
  const { closeShow, handleConfirm } = props;
  const [value, setValue] = useState('');

  const onClickConfirm = () => {
    const list = value.split(';');
    const txs: string[] = list.filter((item) => !!item);
    if (!txs.length) {
      return;
    }
    handleConfirm(txs);
  };

  return (
    <IssueModal title={t('city-hall.SendCompleted')} handleClose={closeShow}>
      <CardBody>
        <ItemBox>
          <div className="title">{t('city-hall.FillInId')}</div>
          <Textarea onChange={(e: any) => setValue(e.target.value)} />
        </ItemBox>
      </CardBody>
      <CardFooter>
        <Button className="btn-cancel" onClick={() => closeShow()} variant="outline-primary">
          {t('general.cancel')}
        </Button>
        <Button onClick={onClickConfirm}>{t('general.confirm')}</Button>
      </CardFooter>
    </IssueModal>
  );
}

const IssueModal = styled(BasicModal)`
  min-width: 500px;
`;

const CardBody = styled.div`
  padding: 20px;
`;
const CardFooter = styled.div`
  padding: 0 20px;
  text-align: center;
`;

const ItemBox = styled.div`
  margin-bottom: 40px;
  &:last-child {
    margin-bottom: 0;
  }
  .title {
    margin-bottom: 10px;
  }
  ul {
    margin-top: 20px;
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    input {
      margin-right: 10px;
      min-width: 650px;
    }
    span {
      margin-left: 10px;
    }
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  line-height: 22px;
  resize: none;
  height: 120px;
  overflow-y: auto;
  outline: none;
  padding: 10px;
  border: 1px solid var(--bs-border-color);
  border-radius: 16px;
  &:focus {
    border-color: rgb(161, 100, 255);
    box-shadow: 0 0 0 0.25rem rgba(161, 100, 255, 0.25);
  }
`;
