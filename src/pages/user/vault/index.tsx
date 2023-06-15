import React from 'react';
import Layout from 'Layouts';
import AssetList from 'components/vaultCom/assetList';
import styled from 'styled-components';
import { Card } from '@paljs/ui/Card';

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
  return (
    <Layout title="Vault">
      <CardBox>
        <Box>
          <FirstLine>
            <li>
              <div className="line">
                <div>USD资产</div>
                <div className="num">9999</div>
              </div>
            </li>
            <li>
              <div>
                <div>
                  <div>总积分</div>
                  <div className="tips">(包含待发放未上链积分)</div>
                </div>

                <div className="num">9999</div>
              </div>
            </li>
          </FirstLine>

          <AssetList />
        </Box>
      </CardBox>
    </Layout>
  );
}
