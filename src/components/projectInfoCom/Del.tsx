import styled from 'styled-components';
import { Card, CardHeader, CardBody, CardFooter } from '@paljs/ui/Card';
import React, { useEffect } from 'react';
import { Button } from '@paljs/ui/Button';
import useTranslation from 'hooks/useTranslation';

const Mask = styled.div`
    background: rgba(0,0,0,0.3);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 999999999999999999;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .btnBtm{
    margin-right: 20px;

  }
  dl,dt,dd{
    padding: 0;
    margin: 0;
`;

const ItemBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 30px;
  img {
    width: 40px;
    height: 40px;
    border-radius: 40px;
    margin-right: 20px;
  }
`;

interface Iprops {
  closeRemove: () => void;
  selectAdminArr: number[];
  selectMemArr: number[];
}
export default function Del(props: Iprops) {
  const { closeRemove, selectAdminArr, selectMemArr } = props;
  const { t } = useTranslation();

  useEffect(() => {
    console.log(selectAdminArr);
  }, [selectAdminArr]);
  useEffect(() => {
    console.log(selectMemArr);
  }, [selectMemArr]);

  return (
    <Mask>
      <Card>
        <CardHeader>{t('Project.RemoveMember')}</CardHeader>
        <CardBody>
          <div className="tips">{t('Project.ConfirmationPopup')}</div>
          {[...Array(3)].map((item, index) => (
            <ItemBox key={index}>
              <div>
                <img src="" alt="" />
              </div>
              <div>
                <div>{t('Project.Nickname')}</div>
                <div>0x183F09C3cE99C02118c570e03808476b22d63191</div>
              </div>
            </ItemBox>
          ))}
        </CardBody>
        <CardFooter>
          <Button appearance="outline" className="btnBtm" onClick={() => closeRemove()}>
            {t('general.cancel')}
          </Button>
          <Button> {t('general.confirm')}</Button>
        </CardFooter>
      </Card>
    </Mask>
  );
}
