import Container from '@paljs/ui/Container';
import styled from 'styled-components';
import { Button } from '@paljs/ui/Button';
import React, { ChangeEvent, useEffect, useState } from 'react';
import useTranslation from 'hooks/useTranslation';
import { IBudgetItem, InfoObj, ReTurnProject } from 'type/project.type';
import { useRouter } from 'next/router';
import { IUpdateBudgetParams, UpdateBudget, UpdateInfo } from 'requests/guild';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { InputGroup } from '@paljs/ui/Input';
import usePermission from 'hooks/usePermission';
import { PermissionObject, PermissionAction } from 'utils/constant';
import useToast, { ToastType } from 'hooks/useToast';

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
  updateProjectName: (name: string) => void;
  updateProject: () => void;
}
export default function Info(props: Iprops) {
  const { detail, updateProjectName, updateProject } = props;
  const { Toast, showToast } = useToast();
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const { dispatch } = useAuthContext();

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

  useEffect(() => {
    getDetail();
  }, [id, detail]);

  const getDetail = () => {
    setEditName(detail?.name as string);
    const _token = detail?.budgets?.find((item) => item.name === 'USDT');
    setToken(_token);
    setEditToken(_token?.total_amount);
    const _point = detail?.budgets?.find((item) => item.name === 'SCR');
    setPoints(_point);
    setEditPoint(_point?.total_amount);
  };

  const handleShowEditPoints = () => {
    setShowEditPoints(true);
  };
  const handlecloseEditP = () => {
    setShowEditPoints(false);
    if (!points || !editPoint || editPoint < 0) {
      return;
    }
    const obj: IUpdateBudgetParams = {
      id: points.id,
      total_amount: editPoint,
      asset_name: points.name,
    };
    submitEditPT(obj);
  };
  const closeEditP = () => {
    setShowEditPoints(false);
  };

  const submitEditPT = async (obj: IUpdateBudgetParams) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await UpdateBudget(id as string, obj);
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
      showToast(t('Guild.changeBudgetSuccess'), ToastType.Success);
      updateProject();
    } catch (e) {
      console.error(e);
      showToast(JSON.stringify(e), ToastType.Danger);
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
      showToast(t('Guild.changeProName'), ToastType.Success);
      setShowName(false);
      updateProjectName(editName);
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    } catch (e) {
      console.error(e);
      setShowEditToken(false);
      showToast(JSON.stringify(e), ToastType.Danger);

      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };
  const handleShowEditToken = () => {
    setShowEditToken(true);
  };
  const handlecloseEditT = () => {
    if (!token || !editToken || editToken < 0) {
      return;
    }
    const obj: IUpdateBudgetParams = {
      id: token.id,
      total_amount: editToken,
      asset_name: token.name,
    };
    setShowEditToken(false);
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

  return (
    <Box>
      {Toast}
      <Container>
        <TopImg>
          <img src={detail?.logo} alt="" />
        </TopImg>
        <InfoBox>
          <dl>
            <dt>{t('Guild.ProjectName')}:</dt>
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
                      placeholder={t('Guild.ProjectName')}
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
            </dd>
          </dl>
          <Title>{t('Guild.Budget')}</Title>
          <dl>
            <dt>{t('Guild.Points')}:</dt>
            <dd>
              {!showEditPoints && (
                <>
                  <div className="info">
                    <span>{points?.total_amount}</span>
                    <span>
                      （
                      {t('Guild.HasBeenUsedAndRemains', {
                        used: Number(points?.total_amount || 0) - Number(points?.remain_amount || 0),
                        remain: points?.remain_amount || 0,
                      })}
                      ）
                    </span>
                  </div>
                  {canUpdateBudget && (
                    <Button shape="Rectangle" appearance="outline" size="Medium" onClick={() => handleShowEditPoints()}>
                      {t('general.Change')}
                    </Button>
                  )}
                </>
              )}
              {showEditPoints && (
                <div className="info">
                  <InputBox fullWidth>
                    <input
                      type="text"
                      placeholder={t('Guild.Points')}
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
                      {t('Guild.HasBeenUsedAndRemains', {
                        used: Number(token?.total_amount || 0) - Number(token?.remain_amount || 0),
                        remain: token?.remain_amount || 0,
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
