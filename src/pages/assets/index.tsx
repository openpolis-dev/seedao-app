import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import AssetList from 'components/assetsCom/assetList';
import styled from 'styled-components';
import { Card } from '@paljs/ui/Card';
import requests from 'requests';
import { EvaIcon } from '@paljs/ui';

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
export default function Index() {
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
  return (
    <Layout title="SeeDAO Assets">
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
                <AssetBox className="num">
                  <span>{asset.token_total_amount}</span>
                  <span className="btn-edit" onClick={() => setIsEdit(true)}>
                    <EvaIcon name="edit-2-outline" />
                  </span>
                </AssetBox>
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
