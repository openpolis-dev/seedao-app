import Container from '@paljs/ui/Container';
import styled from 'styled-components';
import { Button } from '@paljs/ui/Button';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import CloseTips from 'components/projectInfoCom/closeTips';
import CloseSuccess from 'components/projectInfoCom/closeSuccess';
import useTranslation from 'hooks/useTranslation';
import { BudgetObj, budgetObj, InfoObj, ReTurnProject } from 'type/project.type';
import { useRouter } from 'next/router';
import { closeProjectById, UpdateBudget, UpdateInfo } from 'requests/project';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { InputGroup } from '@paljs/ui/Input';
import { Toastr, ToastrRef } from '@paljs/ui/Toastr';

const Box = styled.div`
  margin-top: 50px;
  .rht10 {
    margin-right: 20px;
  }
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
    display: flex;
    align-items: center;
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
const InputBox = styled(InputGroup)`
  margin-right: 20px;
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
  const toastrRef = useRef<ToastrRef>(null);

  const [token, setToken] = useState<budgetObj | null>();
  const [points, setPoints] = useState<budgetObj | null>();
  const [showEditPoints, setShowEditPoints] = useState(false);
  const [showEditToken, setShowEditToken] = useState(false);
  const [showName, setShowName] = useState(false);
  const [editPoint, setEditPoint] = useState('');
  const [editToken, setEditToken] = useState('');
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (!id || !detail) return;
    getDetail();
  }, [id, detail]);

  const getDetail = () => {
    setEditName(detail?.name as string);
    const tokenArr = detail?.budgets?.filter((item) => item.name === 'USDT');
    const rt = tokenArr?.length ? tokenArr[0] : null;
    setToken(rt);
    setEditToken(rt?.total_amount as string);
    const pArr = detail?.budgets?.filter((item) => item.name === 'Points');
    const rt2 = pArr?.length ? pArr[0] : null;
    setPoints(rt2);
    setEditPoint(rt2?.total_amount as string);
  };

  const closeModal = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  const handleClosePro = async () => {
    setShow(false);
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await closeProjectById(id as string);
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
      setShowSuccess(true);
    } catch (e) {
      console.error(e);
      showToastr(JSON.stringify(e), 'Failed', 'Danger');
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
      closeModal();
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
  };

  const handleShowEditPoints = () => {
    setShowEditPoints(true);
  };
  const handlecloseEditP = () => {
    setShowEditPoints(false);
    const obj: BudgetObj = {
      id: Number(points!.id!),
      totalAmount: Number(editPoint),
    };
    submitEditPT(obj);
  };
  const closeEditP = () => {
    setShowEditPoints(false);
  };

  const submitEditPT = async (obj: BudgetObj) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await UpdateBudget(id as string, obj);
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
      showToastr(t('Project.changeBudgetSuccess'), t('general.Success'), 'Primary');
    } catch (e) {
      console.error(e);
      showToastr(JSON.stringify(e), 'Failed', 'Danger');
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  const submitName = async () => {
    const obj: InfoObj = {
      logo: detail?.logo as string,
      name: editName,
    };
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await UpdateInfo(id as string, obj);
      showToastr(t('Project.changeProName'), t('general.Success'), 'Primary');
      setShowName(false);
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    } catch (e) {
      console.error(e);
      setShowEditToken(false);
      showToastr(JSON.stringify(e), 'Failed', 'Danger');
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };
  const handleShowEditToken = () => {
    setShowEditToken(true);
  };
  const handlecloseEditT = () => {
    setShowEditToken(false);
    const obj: BudgetObj = {
      id: Number(token!.id!),
      totalAmount: Number(editToken),
    };
    submitEditPT(obj);
  };
  const closeEditT = () => {
    setShowEditToken(false);
  };

  const handleInput = (e: ChangeEvent, type: string) => {
    const { value } = e.target as HTMLInputElement;
    switch (type) {
      case 'points':
        setEditPoint(value);
        break;
      case 'token':
        setEditToken(value);
        break;
      case 'name':
        setEditName(value);
        break;
    }
  };

  const handleShowName = () => {
    setShowName(true);
  };
  const closeShowName = () => {
    setShowName(false);
  };
  const showToastr = (message: string, title: string, type: string) => {
    toastrRef.current?.add(message, title, { status: type });
  };

  return (
    <Box>
      {show && <CloseTips closeModal={closeModal} handleClosePro={handleClosePro} />}
      {showSuccess && <CloseSuccess closeModal={closeSuccess} />}

      <Toastr
        ref={toastrRef}
        position="topEnd"
        status="Primary"
        duration={3000}
        icons={{
          Danger: 'flash-outline',
          Success: 'checkmark-outline',
          Info: 'question-mark-outline',
          Warning: 'alert-triangle-outline',
          Control: 'email-outline',
          Basic: 'email-outline',
          Primary: 'checkmark-outline',
        }}
        hasIcon={true}
        destroyByClick={false}
        preventDuplicates={false}
      />
      <Container>
        <TopImg>
          <img src={detail?.logo} alt="" />
        </TopImg>
        <InfoBox>
          <dl>
            <dt>{t('Project.ProjectName')}:</dt>
            <dd>
              {!showName && (
                <>
                  <div className="info">{detail?.name}</div>
                  <Button
                    shape="Rectangle"
                    appearance="outline"
                    size="Medium"
                    onClick={() => handleShowName()}
                    className="rht10"
                  >
                    {t('general.Change')}
                  </Button>
                </>
              )}

              {showName && (
                <>
                  <InputBox fullWidth>
                    <input
                      type="text"
                      placeholder={t('Project.ProjectName')}
                      value={editName}
                      onChange={(e) => handleInput(e, 'name')}
                    />
                  </InputBox>
                  <Button shape="Rectangle" size="Medium" onClick={() => submitName()} className="rht10">
                    {t('general.confirm')}
                  </Button>
                  <Button
                    shape="Rectangle"
                    size="Medium"
                    appearance="outline"
                    className="rht10"
                    onClick={() => closeShowName()}
                  >
                    {t('general.cancel')}
                  </Button>
                </>
              )}

              {!showName && (
                <Button shape="Rectangle" size="Medium" onClick={() => handleShow()}>
                  {t('Project.CloseProject')}
                </Button>
              )}
            </dd>
          </dl>
          <Title>{t('Project.Budget')}</Title>
          <dl>
            <dt>{t('Project.Points')}:</dt>
            <dd>
              {!showEditPoints && (
                <>
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
                  <Button shape="Rectangle" appearance="outline" size="Medium" onClick={() => handleShowEditPoints()}>
                    {t('general.Change')}
                  </Button>
                </>
              )}
              {showEditPoints && (
                <div className="info">
                  <InputBox fullWidth>
                    <input
                      type="text"
                      placeholder={t('Project.Points')}
                      value={editPoint}
                      onChange={(e) => handleInput(e, 'points')}
                    />
                  </InputBox>
                  <Button shape="Rectangle" size="Medium" onClick={() => handlecloseEditP()} className="rht10">
                    {t('general.confirm')}
                  </Button>
                  <Button shape="Rectangle" appearance="outline" size="Medium" onClick={() => closeEditP()}>
                    {t('general.cancel')}
                  </Button>
                </div>
              )}
            </dd>
          </dl>
          <dl>
            <dt>USDT:</dt>
            <dd>
              {!showEditToken && (
                <>
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
                  <Button shape="Rectangle" appearance="outline" size="Medium" onClick={() => handleShowEditToken()}>
                    {t('general.Change')}
                  </Button>
                </>
              )}
              {showEditToken && (
                <div className="info">
                  <InputBox fullWidth>
                    <input type="text" placeholder="USDT" value={editToken} onChange={(e) => handleInput(e, 'token')} />
                  </InputBox>
                  <Button shape="Rectangle" size="Medium" onClick={() => handlecloseEditT()} className="rht10">
                    {t('general.confirm')}
                  </Button>
                  <Button shape="Rectangle" appearance="outline" size="Medium" onClick={() => closeEditT()}>
                    {t('general.cancel')}
                  </Button>
                </div>
              )}
            </dd>
          </dl>
        </InfoBox>
      </Container>
    </Box>
  );
}
