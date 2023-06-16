import Container from '@paljs/ui/Container';
import styled from 'styled-components';
import { Button } from '@paljs/ui/Button';
import React, { useEffect, useState } from 'react';
import CloseTips from 'components/projectInfoCom/closeTips';
import CloseSuccess from 'components/projectInfoCom/closeSuccess';
import useTranslation from 'hooks/useTranslation';
import { budgetObj, ReTurnProject } from 'type/project.type';
import { useRouter } from 'next/router';
import { closeProjectById } from 'requests/project';
import { AppActionType, useAuthContext } from 'providers/authProvider';

const Box = styled.div`
  margin-top: 50px;
`;

const TopImg = styled.div`
  margin-bottom: 40px;
  img {
    //max-width: 600px;
    width: 300px;
  }
`;

const InfoBox = styled.div`
  dl {
    margin-bottom: 10px;
    display: flex;
    align-items: flex-start;
  }
  .info {
    margin-right: 10px;
  }
  dt {
    line-height: 2.5em;
    display: inline-block;
    min-width: 140px;
    background: #f5f5f5;
    padding: 0 20px;
    margin-right: 20px;
  }
  dd {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
`;

const Title = styled.div`
  font-weight: bold;
  border-bottom: 1px solid #eee;
  padding: 10px 20px;
  margin-bottom: 20px;
`;
interface Iprops {
  detail: ReTurnProject | undefined;
}
export default function Info(props: Iprops) {
  const { detail } = props;
  const [show, setShow] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const { dispatch } = useAuthContext();

  const [token, setToken] = useState<budgetObj | null>();
  const [points, setPoints] = useState<budgetObj | null>();

  useEffect(() => {
    if (!id || !detail) return;
    getDetail();
  }, [id, detail]);

  const getDetail = async () => {
    const tokenArr = detail?.budgets?.filter((item) => item.name === 'USDT');
    const rt = tokenArr?.length ? tokenArr[0] : null;
    setToken(rt);
    const pArr = detail?.budgets?.filter((item) => item.name === 'SCORE');
    const rt2 = pArr?.length ? pArr[0] : null;
    setPoints(rt2);
  };

  const closeModal = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  // const handleShow = () => {
  //   setShow(true);
  // };

  const handleClosePro = async () => {
    setShow(false);
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    const rt = await closeProjectById(id);
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    setShowSuccess(true);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <Box>
      {show && <CloseTips closeModal={closeModal} handleClosePro={handleClosePro} />}
      {showSuccess && <CloseSuccess closeModal={closeSuccess} />}

      <Container>
        <TopImg>
          <img src={detail?.logo} alt="" />
        </TopImg>
        <InfoBox>
          <dl>
            <dt>{t('Project.ProjectName')}:</dt>
            <dd>
              <div className="info">{detail?.name}</div>
              <Button shape="Rectangle" appearance="outline" size="Medium" onClick={() => handleShow()}>
                {t('Project.CloseProject')}
              </Button>
            </dd>
          </dl>
          <Title>{t('Project.Budget')}</Title>
          <dl>
            <dt>{t('Project.Points')}:</dt>
            <dd>
              <div className="info">
                <span>{points?.total_amount}</span>
                <span>
                  （
                  {t('Project.HasBeenUsedAndRemains', {
                    used: Number(points?.total_amount) - Number(points?.remain_amount),
                    remain: points?.remain_amount,
                  })}
                  ）
                </span>
              </div>
              <Button shape="Rectangle" appearance="outline" size="Medium">
                {t('general.Change')}
              </Button>
            </dd>
          </dl>
          <dl>
            <dt>USDT:</dt>
            <dd>
              <div className="info">
                <span>{token?.total_amount}</span>
                <span>
                  （
                  {t('Project.HasBeenUsedAndRemains', {
                    used: Number(token?.total_amount) - Number(token?.remain_amount),
                    remain: token?.remain_amount,
                  })}
                  ）
                </span>
              </div>
              <Button shape="Rectangle" appearance="outline" size="Medium">
                {t('general.Change')}
              </Button>
            </dd>
          </dl>
        </InfoBox>
      </Container>
    </Box>
  );
}
