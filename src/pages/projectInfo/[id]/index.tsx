import React from 'react';
import Layout from 'Layouts';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import { Tabs, Tab } from '@paljs/ui/Tabs';
import styled from 'styled-components';
// import { useRouter } from 'next/router';
import { Card } from '@paljs/ui/Card';
import Info from 'components/projectInfoCom/info';
import Members from 'components/projectInfoCom/members';
import Assets from 'components/projectInfoCom/assets';

const Box = styled.div`
  position: relative;
  .tab-content {
    padding: 0 !important;
  }
`;

const CardBox = styled(Card)`
  min-height: 85vh;
`;

const TopBox = styled.div`
  padding: 20px;
`;
export default function Index() {
  // const router = useRouter();
  return (
    <Layout title="SeeDAO Project">
      <CardBox>
        <Box>
          <Row>
            <Col breakPoint={{ xs: 12 }}>
              <TopBox>
                <Tabs>
                  <Tab key="0" title="Project Info" responsive>
                    <Info />
                  </Tab>
                  <Tab key="1" title="Members" responsive>
                    <Members />
                  </Tab>
                  <Tab key="2" title="Project Assets" responsive>
                    <Assets />
                  </Tab>
                  <Tab key="3" title="Project Proposal" responsive>
                    <div>ddd</div>
                  </Tab>
                  <Tab key="3" title="登记" responsive>
                    <div>ddd</div>
                  </Tab>
                </Tabs>
              </TopBox>
            </Col>
          </Row>
        </Box>
      </CardBox>
    </Layout>
  );
}
