import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import AssetList from 'components/vaultCom/assetList';
import styled from 'styled-components';
import { Card } from '@paljs/ui/Card';
import { Asset } from 'type/user.type';
import requests from 'requests';
import { BudgetType } from 'type/project.type';
import useTranslation from 'hooks/useTranslation';

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
    height: 152px;
    box-sizing: border-box;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    padding: 40px;
    width: 48%;
    display: flex;
    align-items: center;
    justify-content: center;
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

export default function Vault() {
  const { t } = useTranslation();
  const [token, setToken] = useState<Asset>();
  const [credit, setCredit] = useState<Asset>();

  const getUserAssets = async () => {
    try {
      const res = await requests.user.getUser();
      const assests = res.data.assets;
      const _token = assests.find((item) => item.asset_type === BudgetType.Token) || {};
      setToken({
        dealt_amount: _token.dealt_amount || 0,
        processing_amount: _token.processing_amount || 0,
        total_amount: (_token.dealt_amount || 0) + (_token.processing_amount || 0),
      });
      const _credit = assests.find((item) => item.asset_type === BudgetType.Credit) || {};
      setCredit({
        dealt_amount: _credit.dealt_amount || 0,
        processing_amount: _credit.processing_amount || 0,
        total_amount: (_credit.dealt_amount || 0) + (_credit.processing_amount || 0),
      });
    } catch (error) {
      console.error('get user assets error', error);
    }
  };

  useEffect(() => {
    getUserAssets();
  }, []);

  return (
    <Layout title="SeeDAO | My Vault">
      <CardBox>
        <Box>
          <FirstLine>
            <li>
              <div className="line">
                <div>{t('My.Assets')}</div>
                <div className="num">{token?.total_amount || 0}</div>
              </div>
            </li>
            <li>
              <div>
                <div>
                  <div>{t('My.Points')}</div>
                  {/* <div className="tips">(包含待发放未上链积分)</div> */}
                </div>

                <div className="num">{credit?.total_amount || 0}</div>
              </div>
            </li>
          </FirstLine>

          <AssetList />
        </Box>
      </CardBox>
    </Layout>
  );
}
