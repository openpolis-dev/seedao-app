import styled from 'styled-components';
import { Card, InputGroup, Button } from 'react-bootstrap';
// import { EvaIcon } from '@paljs/ui/Icon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputNumber from 'components/inputNumber';

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
  .btn-cancel {
    margin-right: 20px;
  }
`;
const CardBody = styled.div``;
const CardFooter = styled.div``;

const HeaderBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .rht {
    cursor: pointer;
  }
`;
interface Iprops {
  handleClose: () => void;
  handleModify: (value: number) => void;
}

export default function ModifyBudgetModal(props: Iprops) {
  const { handleClose, handleModify } = props;
  const { t } = useTranslation();
  const [newValue, setNewValue] = useState<number>();

  const handleConfirm = () => {
    if (typeof newValue === 'undefined') return;
    if (isNaN(newValue)) return;
    if (newValue < 0) return;
    handleModify(newValue);
  };

  return (
    <Mask>
      <Card>
        <HeaderBox>
          {t('Assets.ModifySeasonBudget')}
          <div className="rht" onClick={handleClose}>
            {/*<EvaIcon name="close-outline" />*/}
          </div>
        </HeaderBox>
        <CardBody>
          <InputGroup>
            <InputNumber
              placeholder=""
              autoFocus
              value={newValue}
              onChange={(e) => setNewValue(e.target.valueAsNumber)}
            />
          </InputGroup>
        </CardBody>
        <CardFooter>
          <Button className="btn-cancel" onClick={() => handleClose()}>
            {t('general.cancel')}
          </Button>
          <Button onClick={handleConfirm} className="rht10">
            {t('general.confirm')}
          </Button>
        </CardFooter>
      </Card>
    </Mask>
  );
}
