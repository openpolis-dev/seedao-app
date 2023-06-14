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
  }
`;
const CardBox = styled(Card)`
  min-height: 85vh;
`;

const TopBox = styled.div`
  padding: 20px;
`;
export default function Index() {
  return (
    <Layout title="SeeDAO City Hall">
      <CardBox>
        <Box>
          <Row>
            <Col breakPoint={{ xs: 12 }}>
              <TopBox>
                <Tabs>
                  <Tab key="0" title="积分及token审核" responsive>
                    <Audit />
                  </Tab>
                  <Tab key="1" title="项目审核" responsive>
                    <div>ddd</div>
                  </Tab>
                  <Tab key="2" title="发放" responsive>
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
