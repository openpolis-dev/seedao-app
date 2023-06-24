import Container from '@paljs/ui/Container';
import styled from 'styled-components';
import { Button } from '@paljs/ui/Button';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import CloseTips from 'components/guild/closeTips';
import CloseSuccess from 'components/guild/closeSuccess';
import useTranslation from 'hooks/useTranslation';
import { BudgetObj, IBudgetItem, InfoObj, ProjectStatus, ReTurnProject } from 'type/project.type';
import { useRouter } from 'next/router';
import { closeProjectById, UpdateBudget, UpdateInfo } from 'requests/guild';
import requests from 'requests';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { InputGroup } from '@paljs/ui/Input';
import { Toastr, ToastrRef } from '@paljs/ui/Toastr';
import usePermission from 'hooks/usePermission';
import { PermissionObject, PermissionAction } from 'utils/constant';

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
  updateProjectStatus: (status: ProjectStatus) => void;
}
export default function Info(props: Iprops) {
  const { detail, updateProjectStatus } = props;
  const [show, setShow] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const { dispatch } = useAuthContext();
  const toastrRef = useRef<ToastrRef>(null);

  const [token, setToken] = useState<IBudgetItem>();
  const [points, setPoints] = useState<IBudgetItem>();
  const [showEditPoints, setShowEditPoints] = useState(false);
  const [showEditToken, setShowEditToken] = useState(false);
  const [showName, setShowName] = useState(false);
  const [editPoint, setEditPoint] = useState<number>();
  const [editToken, setEditToken] = useState<number>();
  const [editName, setEditName] = useState('');

  const canUpdateInfo = usePermission(PermissionAction.Modify, PermissionObject.GuildPrefix + id);
  const canUpdateBudget = usePermission(PermissionAction.UpdateBudget, PermissionObject.GuildPrefix + id);
  const canCloseProject = usePermission(PermissionAction.Close, PermissionObject.GuildPrefix + id);

  useEffect(() => {
    getDetail();
  }, [id, detail]);

  const getDetail = () => {
    setEditName(detail?.name as string);
    const _token = detail?.budgets?.find((item) => item.name === 'USDT');
    setToken(_token);
    setEditToken(_token?.total_amount);
    const _point = detail?.budgets?.find((item) => item.name === 'Points');
    setPoints(_point);
    setEditPoint(_point?.total_amount);
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
      await requests.application.createCloseProjectApplication(Number(id as string));
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
      setShowSuccess(true);
      // reset project status
      updateProjectStatus(ProjectStatus.Pending);
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
        setEditPoint(Number(value) || 0);
        break;
      case 'token':
        setEditToken(Number(value) || 0);
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

  const showProjectStatusComponent = () => {
    if (showName) {
      return <></>;
    }
    switch (detail?.status) {
      case ProjectStatus.Pending:
        return 'pending close';
      case ProjectStatus.Closed:
        return 'closed';
    }
    if (canCloseProject) {
      return (
        <Button shape="Rectangle" size="Medium" onClick={() => handleShow()}>
          {t('Project.CloseProject')}
        </Button>
      );
    }
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
                  {canUpdateInfo && (
                    <Button
                      shape="Rectangle"
                      appearance="outline"
                      size="Medium"
                      onClick={() => handleShowName()}
                      className="rht10"
                    >
                      {t('general.Change')}
                    </Button>
                  )}
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
              {showProjectStatusComponent()}
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
                      (
                      {t('Project.HasBeenUsedAndRemains', {
                        used: Number(token?.total_amount) - Number(token?.remain_amount),
                        remain: token?.remain_amount,
                      })}
                      )
                    </span>
                  </div>
                  {canUpdateBudget && (
                    <Button shape="Rectangle" appearance="outline" size="Medium" onClick={() => handleShowEditToken()}>
                      {t('general.Change')}
                    </Button>
                  )}
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
