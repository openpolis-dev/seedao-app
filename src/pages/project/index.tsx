import React, { useState } from 'react';
import Layout from 'Layouts';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import { Tabs, Tab } from '@paljs/ui/Tabs';
import ProjectAllList from 'pages/project/com/list';
import styled from 'styled-components';
import { ButtonLink } from '@paljs/ui/Button';
import { useRouter } from 'next/router';
import { Card, CardHeader } from '@paljs/ui/Card';
import { EvaIcon } from '@paljs/ui/Icon';

const Box = styled.div`
  position: relative;
  .tab-content {
    padding: 0 !important;
  }
  a:hover {
    color: #fff;
    opacity: 0.8;
  }
`;

const TopLine = styled.div`
  position: absolute;
  right: 20px;
  top: 14px;
  z-index: 9;
  cursor: pointer;
`;

const CardBox = styled(Card)``;

export default function Index() {
  const router = useRouter();
  const [current, setCurrent] = useState<number>(0);
  const [list] = useState([
    {
      name: 'ALL',
      id: 0,
    },
    {
      name: 'Closed',
      id: 1,
    },
    {
      name: 'Joined',
      id: 2,
    },
  ]);

  const selectCurrent = (e: number) => {
    setCurrent(e);
    console.log(current);
  };

  return (
    <Layout title="SeeDAO Project">
      <Card>
        <Box>
          <TopLine>
            <ButtonLink onClick={() => router.push('/createProject')} fullWidth shape="Rectangle">
              Create Project
            </ButtonLink>
          </TopLine>
          <Row>
            <Col breakPoint={{ xs: 12 }}>
              <CardHeader>
                <Tabs activeIndex={0} onSelect={(e) => selectCurrent(e)}>
                  {list.map((item) => (
                    <Tab key={item.id} title={item.name} responsive>
                      <ProjectAllList />
                    </Tab>
                  ))}
                </Tabs>
              </CardHeader>
            </Col>
          </Row>
        </Box>
      </Card>
    </Layout>
  );
}
