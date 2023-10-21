import styled from 'styled-components';
import { Card, InputGroup, Button } from 'react-bootstrap';
// import { EvaIcon } from '@paljs/ui/Icon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputNumber from 'components/inputNumber';
import { X } from 'react-bootstrap-icons';

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
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardBody = styled.div`
  padding: 20px;
`;
const CardFooter = styled.div`
  padding: 0 20px 20px;
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
        <CardHeader>
          {t('Assets.ModifySeasonBudget')}
          <div className="rht" onClick={handleClose}>
            <X />
          </div>
        </CardHeader>
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
          <Button variant="outline-primary" className="btn-cancel" onClick={() => handleClose()}>
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
