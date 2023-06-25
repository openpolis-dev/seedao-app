import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import AssetList from 'components/assetsCom/assetList';
import styled from 'styled-components';
import { Card } from '@paljs/ui/Card';
import requests from 'requests';
import { EvaIcon } from '@paljs/ui';
import { Button } from '@paljs/ui/Button';
import useTranslation from 'hooks/useTranslation';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import usePermission from 'hooks/usePermission';
import { PermissionAction, PermissionObject } from 'utils/constant';

const Box = styled.div`
  padding: 40px 20px;
`;
const CardBox = styled(Card)`
  min-height: 85vh;
`;

const FirstLine = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  li {
    border: 1px solid #f1f1f1;
    margin-bottom: 40px;
    box-sizing: border-box;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 48%;
    height: 152px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &.center {
      justify-content: center;
    }
    div {
      text-align: center;
    }
  }
  .num {
    font-size: 25px;
    padding-top: 10px;
    font-weight: bold;
  }
  .tips {
    font-size: 12px;
  }
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
  input {
    padding-left: 5px;
  }
  .btn-ok {
    cursor: pointer;
  }
`;
export default function Index() {
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const { Toast, showToast } = useToast();
  const canUseCityhall = usePermission(PermissionAction.AuditApplication, PermissionObject.ProjectAndGuild);

  const [tokenNum, setTokenNum] = useState<number>();
  const [asset, setAsset] = useState({
    token_remain_amount: 0,
    token_total_amount: 0,
    credit_total_amount: 0,
  });
  const [isEdit, setIsEdit] = useState(false);

  const getAssets = async () => {
    try {
      const res = await requests.treasury.getTreasury();
      setAsset({
        token_remain_amount: res.data.token_remain_amount,
        token_total_amount: res.data.token_total_amount,
        credit_total_amount: res.data.credit_total_amount,
      });
    } catch (error) {
      console.error('getTreasury error', error);
    }
  };
  useEffect(() => {
    getAssets();
  }, []);

  const handleEdit = async () => {
    if (!tokenNum || tokenNum < 0) return;
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      await requests.treasury.updateTokenBudget(tokenNum);
      setIsEdit(false);
      getAssets();
      showToast('success', ToastType.Success);
    } catch (error: any) {
      console.error('updateTokenBudget error', error);
      showToast(error?.data?.msg || 'failed', ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };
  return (
    <Layout title="SeeDAO Assets">
      {Toast}
      <CardBox>
        <Box>
          <FirstLine>
            <li>
              <div className="line">
                <div>本季度USD剩余资产</div>
                <div className="num">{asset.token_remain_amount}</div>
              </div>
              <div>
                <div>本季度USD资产</div>
                {isEdit ? (
                  <InputBox>
                    <input
                      type="number"
                      placeholder={'please input'}
                      value={tokenNum}
                      onChange={(e) => setTokenNum(e.target.valueAsNumber)}
                    />
                    <span className="btn-ok" onClick={handleEdit}>
                      <EvaIcon name="checkmark-outline" />
                    </span>
                  </InputBox>
                ) : (
                  <AssetBox className="num">
                    <span>{asset.token_total_amount}</span>
                    {canUseCityhall && (
                      <span className="btn-edit" onClick={() => setIsEdit(true)}>
                        <EvaIcon name="edit-2-outline" />
                      </span>
                    )}
                  </AssetBox>
                )}
              </div>
            </li>
            <li className="center">
              <div>
                <div>
                  <div>本季度已发放积分</div>
                  <div className="tips">(包含待发放未上链积分)</div>
                </div>

                <div className="num">{asset.credit_total_amount}</div>
              </div>
            </li>
          </FirstLine>

          <AssetList />
        </Box>
      </CardBox>
    </Layout>
  );
}

const AssetBox = styled.div`
  display: flex;
  gap: 6px;
  .btn-edit {
    cursor: pointer;
  }
`;
