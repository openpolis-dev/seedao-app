import styled from 'styled-components';
import { Button, ButtonLink } from '@paljs/ui/Button';
import RegList from 'components/projectInfoCom/regList';
import { EvaIcon } from '@paljs/ui/Icon';
import React, { FormEvent } from 'react';

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

const BtnBox = styled.label`
  background: #a16eff;
  color: #fff;
  height: 44px;
  width: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-weight: 700;
  font-size: 14px;
  .iconRht {
    margin-right: 10px;
  }
`;
export default function Reg() {
  const updateLogo = (e: FormEvent) => {
    const { files } = e.target as any;
    const { name } = files[0];
    const url = window.URL.createObjectURL(files[0]);
    // setFileName(name);
    // handleUrl(url,files[0]);
    // setFile(files[0]);
  };

  return (
    <Box>
      <FirstBox>
        <Button>提交审核</Button>
        <RhtBox>
          <ButtonLink className="rhtBtn" appearance="outline">
            <EvaIcon name="cloud-download-outline" />
            <span>下载模版</span>
          </ButtonLink>

          <BtnBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)}>
            <input id="fileUpload" type="file" hidden />
            <EvaIcon name="cloud-upload-outline" className="iconRht" />
            <span>导入表格</span>
          </BtnBox>
        </RhtBox>
      </FirstBox>
      <RegList />
    </Box>
  );
}
