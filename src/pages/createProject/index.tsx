import Layout from 'Layouts';
import { Card, CardHeader, CardBody } from '@paljs/ui/Card';
import styled from 'styled-components';
import { InputGroup } from '@paljs/ui/Input';
import React from 'react';

const UlBox = styled.ul`
  li {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 20px;

    .title {
      margin-right: 20px;
      line-height: 2.5em;
      min-width: 90px;
    }
  }
`;
export default function CreateProject() {
  return (
    <Layout title="">
      <Card>
        <CardHeader>Create Project</CardHeader>
        <CardBody>
          <UlBox>
            <li>
              <div className="title">项目名称</div>
              <InputGroup fullWidth>
                <input type="text" placeholder="Size small" />
              </InputGroup>
            </li>
            <li>
              <div className="title">负责人</div>
              <InputGroup fullWidth>
                <input type="text" placeholder="Size small" />
              </InputGroup>
            </li>
          </UlBox>
        </CardBody>
      </Card>
    </Layout>
  );
}
