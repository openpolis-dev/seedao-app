import styled from 'styled-components';
import AssetList from './assetList';
import React, { useEffect, useState } from 'react';
import { BudgetType, ReTurnProject, IBudgetItem } from 'type/project.type';
import { useTranslation } from 'react-i18next';
import { formatNumber } from 'utils/number';

const Box = styled.div`
  padding: 40px 20px;
`;

const FirstLine = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  .tit {
    font-size: 1rem;
  }
  li {
    border: 1px solid #f1f1f1;
    margin-bottom: 40px;
    box-sizing: border-box;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 48%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    //background: #fff;
    color: #fff;
    div {
      text-align: center;
    }
    &:nth-child(1) {
      background: linear-gradient(to right, #f1a6b6, #8f69d2);
    }
    &:nth-child(2) {
      background: linear-gradient(to right, #3bdabe, #44b5f4);
    }
  }
  .num {
    font-size: 25px;
    padding-top: 10px;
    font-weight: bold;
  }
`;

interface IProps {
  id: number;
  detail?: ReTurnProject;
}

export default function Assets({ id, detail }: IProps) {
  const { t } = useTranslation();
  const [token, setToken] = useState<IBudgetItem>();
  const [point, setPoint] = useState<IBudgetItem>();

  useEffect(() => {
    if (!detail) {
      return;
    }
    const _token = detail?.budgets.find((b) => b.type === BudgetType.Token);
    const _point = detail?.budgets.find((b) => b.type === BudgetType.Credit);
    setToken(_token);
    setPoint(_point);
  }, [detail?.budgets]);

  return (
    <Box>
      <FirstLine>
        <li>
          <div className="line">
            <div className="tit">{t('Project.RemainingUSDBudget')}</div>
            <div className="num">{formatNumber(token?.remain_amount || 0)}</div>
          </div>
          <div>
            <div className="tit">{t('Project.USDBudget')}</div>
            <div className="num">{formatNumber(token?.total_amount || 0)}</div>
          </div>
        </li>
        <li>
          <div>
            <div className="tit">{t('Project.RemainingPointsBudget')}</div>
            <div className="num">{formatNumber(point?.remain_amount || 0)}</div>
          </div>
          <div>
            <div className="tit">{t('Project.PointsBudget')}</div>
            <div className="num">{formatNumber(point?.total_amount || 0)}</div>
          </div>
        </li>
      </FirstLine>

      <AssetList id={id} />
    </Box>
  );
}
