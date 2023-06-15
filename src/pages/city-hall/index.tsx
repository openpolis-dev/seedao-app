import React from 'react';
import Layout from 'Layouts';
import { Card } from '@paljs/ui/Card';
import styled from 'styled-components';
import { Tab, Tabs } from '@paljs/ui/Tabs';
import Audit from 'components/cityHallCom/audit';
import ProjectAudit from 'components/cityHallCom/projectAudit';
import Issued from 'components/cityHallCom/issued';

const Box = styled.div`
  //position: relative;
  .tab-content {
    padding: 0 0 30px !important;
    box-sizing: border-box;
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
  box-sizing: border-box;
`;

const TabsBox = styled(Tabs)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
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
                <ProjectAudit />
              </Tab>
              <Tab key="2" title="发放" responsive>
                <Issued />
              </Tab>
            </TabsBox>
          </TopBox>
        </CardBox>
      </Box>
    </Layout>
  );
}
