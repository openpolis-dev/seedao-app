import React from 'react';
import Layout from 'Layouts';
import { Card, CardHeader, CardBody } from '@paljs/ui/Card';
import styled from 'styled-components';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import { Tab, Tabs } from '@paljs/ui/Tabs';
import Audit from 'components/cityHallCom/audit';
import { Button } from '@paljs/ui/Button';

const Box = styled.div`
  position: relative;
  .tab-content {
    padding: 0 !important;
    height: 100% !important;
  }
`;
const CardBox = styled(Card)`
  min-height: 85vh;
`;

const TopBox = styled.div`
  padding: 20px;
  box-sizing: border-box;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const TabsBox = styled(Tabs)`
  flex-grow: 1;
  .tabs {
    height: 100%;
  }
`;
export default function Index() {
  return (
    <Layout title="SeeDAO City Hall">
      <Box>
        <CardBox>
          <TopBox>
            <TabsBox>
              <Tab key="0" title="积分及token审核" responsive>
                <Audit />
              </Tab>
              <Tab key="1" title="项目审核" responsive>
                <div>ddd</div>
              </Tab>
              <Tab key="2" title="发放" responsive>
                <div>ddd</div>
              </Tab>
            </TabsBox>
          </TopBox>
        </CardBox>
      </Box>
    </Layout>
  );
}
