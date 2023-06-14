import styled from 'styled-components';
import { Button, ButtonLink } from '@paljs/ui/Button';
import RegList from 'components/projectInfoCom/regList';
import { EvaIcon } from '@paljs/ui/Icon';
import React from 'react';

const Box = styled.div`
  padding: 20px;
`;

const FirstBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
`;

const RhtBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .rhtBtn {
    margin-right: 20px;
    display: flex;
    align-items: center;
    span {
      padding-left: 10px;
    }
  }
`;
export default function Reg() {
  return (
    <Box>
      <FirstBox>
        <Button>提交审核</Button>
        <RhtBox>
          <ButtonLink className="rhtBtn" appearance="outline">
            <EvaIcon name="cloud-download-outline" />
            <span>下载模版</span>
          </ButtonLink>
          <Button>导入表格</Button>
        </RhtBox>
      </FirstBox>
      <RegList />
    </Box>
  );
}
