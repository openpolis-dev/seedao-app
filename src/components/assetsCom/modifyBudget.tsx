import styled from 'styled-components';
import { Card, CardHeader, CardBody, CardFooter } from '@paljs/ui/Card';
import { EvaIcon } from '@paljs/ui/Icon';
import React, { useState } from 'react';
import { Button } from '@paljs/ui';
import { InputGroup } from '@paljs/ui/Input';
import useTranslation from 'hooks/useTranslation';

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
  .btn {
    margin-right: 20px;
  }
`;

const HeaderBox = styled(CardHeader)`
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
    if (!newValue || newValue < 0) return;
    handleModify(newValue);
  };

  return (
    <Mask>
      <Card>
        <HeaderBox>
          {t('Assets.ModifySeasonBudget')}
          <div className="rht" onClick={handleClose}>
            <EvaIcon name="close-outline" />
          </div>
        </HeaderBox>
        <CardBody>
          <InputGroup fullWidth>
            <input
              type="number"
              placeholder=""
              autoFocus
              value={newValue}
              onChange={(e) => setNewValue(e.target.valueAsNumber)}
            />
          </InputGroup>
        </CardBody>
        <CardFooter>
          <Button shape="Rectangle" appearance="outline" className="btn" onClick={() => handleClose()}>
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
