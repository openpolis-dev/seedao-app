import Container from '@paljs/ui/Container';
import styled from 'styled-components';
import { Button } from '@paljs/ui/Button';
import React from 'react';

const Box = styled.div`
  margin-top: 50px;
`;

const TopImg = styled.div`
  margin-bottom: 40px;
  img {
    //max-width: 600px;
    width: 300px;
  }
`;

const InfoBox = styled.div`
  dl {
    margin-bottom: 10px;
    display: flex;
    align-items: flex-start;
  }
  .info {
    margin-right: 10px;
  }
  dt {
    line-height: 1.5em;
    display: inline-block;
    min-width: 140px;
    background: #f5f5f5;
    padding: 0 20px;
  }
  dd {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
`;

const Title = styled.div`
  font-weight: bold;
  border-bottom: 1px solid #eee;
  padding: 10px 20px;
  margin-bottom: 20px;
`;
export default function Info() {
  return (
    <Box>
      <Container>
        <TopImg>
          <img
            src="https://img0.baidu.com/it/u=2050198963,701666245&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=501"
            alt=""
          />
        </TopImg>
        <InfoBox>
          <dl>
            <dt>Project Name:</dt>
            <dd>
              <div className="info">全球DAO场战略项目</div>
              <Button shape="Rectangle" appearance="outline" size="Tiny">
                关闭项目
              </Button>
            </dd>
          </dl>
          <Title>预算</Title>
          <dl>
            <dt>积分:</dt>
            <dd>
              <div className="info">
                <span>1000</span>
                <span>（已使用100，剩余900）</span>
              </div>
              <Button shape="Rectangle" appearance="outline" size="Tiny">
                修改
              </Button>
            </dd>
          </dl>
          <dl>
            <dt>USDT:</dt>
            <dd>
              <div className="info">
                <span>1000</span>
                <span>（已使用100，剩余900）</span>
              </div>
              <Button shape="Rectangle" appearance="outline" size="Tiny">
                修改
              </Button>
            </dd>
          </dl>
        </InfoBox>
      </Container>
    </Box>
  );
}
