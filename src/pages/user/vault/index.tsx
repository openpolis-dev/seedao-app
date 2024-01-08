import React, { useEffect, useState } from 'react';
// import Layout from 'Layouts';
import AssetList from 'components/vaultCom/assetList';
import styled from 'styled-components';
import { Asset } from 'type/user.type';
import requests from 'requests';
import { BudgetType } from 'type/project.type';
import { useTranslation } from 'react-i18next';
import SBTCard from './sbt';
import { formatNumber } from 'utils/number';
import { ContainerPadding } from 'assets/styles/global';

const OuterBox = styled.div`
  min-height: 100%;
  ${ContainerPadding};
`;

const Box = styled.div``;
const CardBox = styled.div`
  background: #fff;
  padding: 20px;
  min-height: 100%;
  box-sizing: border-box;
`;

const FirstLine = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  li {
    margin-bottom: 40px;
    height: 152px;
    box-sizing: border-box;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 48%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background: #008800;
    color: #fff;
    position: relative;
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
  .decorBg {
    position: absolute;
    right: 0;
    bottom: -4rem;
    font-size: 11rem;
    font-family: 'Jost-Bold';
    opacity: 0.03;
    color: #000;
  }
  .topBox {
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    margin-bottom: 20px;
    width: 100%;
    font-weight: bold;
    font-size: 1.2rem;
  }
  .num {
    font-size: 30px;
    padding-top: 10px;
    font-weight: bold;
  }
  .tips {
    font-size: 12px;
  }
  @media (max-width: 1024px) {
    li {
      padding: 26px 16px;
    }
    .num {
      padding-top: 0;
    }
  } ;
`;

export default function Vault() {
  const { t } = useTranslation();
  const [token, setToken] = useState<Asset>();
  const [credit, setCredit] = useState<Asset>();

  const getUserAssets = async () => {
    try {
      const res = await requests.user.getUser();
      const assests = (res as any).assets;
      const _token = assests.find((item: any) => item.asset_type === BudgetType.Token) || {};
      setToken({
        dealt_amount: _token.dealt_amount || 0,
        processing_amount: _token.processing_amount || 0,
        total_amount: (Number(_token.dealt_amount) || 0) + (Number(_token.processing_amount) || 0),
      });
      const _credit = assests.find((item: any) => item.asset_type === BudgetType.Credit) || {};
      setCredit({
        dealt_amount: _credit.dealt_amount || 0,
        processing_amount: _credit.processing_amount || 0,
        total_amount: (Number(_credit.dealt_amount) || 0) + (Number(_credit.processing_amount) || 0),
      });
    } catch (error) {
      logError('get user assets error', error);
    }
  };

  useEffect(() => {
    getUserAssets();
  }, []);

  return (
    <OuterBox>
      <CardBox>
        <Box>
          <FirstLine>
            <li>
              <div className="topBox">{t('My.Assets')}</div>
              <div className="num">{formatNumber(token?.total_amount || 0)}</div>
              <div className="decorBg">SEEDAO</div>
            </li>
            <li>
              <div className="topBox">
                <div>{t('My.Points')}</div>
                {/* <div className="tips">(包含待发放未上链积分)</div> */}
              </div>

              <div className="num">{formatNumber(credit?.total_amount || 0)}</div>
              <div className="decorBg">SEEDAO</div>
            </li>
          </FirstLine>
          <SBTCard />
          <AssetList />
        </Box>
      </CardBox>
    </OuterBox>
  );
}
