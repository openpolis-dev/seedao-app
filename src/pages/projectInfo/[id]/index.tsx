import React, { useState } from 'react';
import Layout from 'Layouts';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import { Tabs, Tab } from '@paljs/ui/Tabs';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Card, CardHeader } from '@paljs/ui/Card';
import Info from 'pages/projectInfo/[id]/com/info';
import Members from 'pages/projectInfo/[id]/com/members';

const Box = styled.div`
  position: relative;
  .tab-content {
    padding: 0 !important;
  }
`;
export default function Index() {
  const router = useRouter();
  return (
    <Layout title="SeeDAO Project">
      <Card>
        <Box>
          <Row>
            <Col breakPoint={{ xs: 12 }}>
              <CardHeader>
                <Tabs>
                  <Tab key="0" title="Project Info" responsive>
                    <Info />
                  </Tab>
                  <Tab key="1" title="Members" responsive>
                    <Members />
                  </Tab>
                  <Tab key="2" title="Project Assets" responsive>
                    <div>ddd</div>
                  </Tab>
                  <Tab key="3" title="Project Proposal" responsive>
                    <div>ddd</div>
                  </Tab>
                </Tabs>
              </CardHeader>
            </Col>
          </Row>
        </Box>
      </Card>
    </Layout>
  );
}
