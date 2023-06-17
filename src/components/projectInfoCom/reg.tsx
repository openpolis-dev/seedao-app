import styled from 'styled-components';
import { Button, ButtonLink } from '@paljs/ui/Button';
import RegList from 'components/projectInfoCom/regList';
import { EvaIcon } from '@paljs/ui/Icon';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import useTranslation from 'hooks/useTranslation';
import * as XLSX from 'xlsx';
import { ExcelObj } from 'type/project.type';

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
  height: 42px;
  padding: 0 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  font-weight: 700;
  font-size: 14px;
  margin-right: 20px;
  cursor: pointer;
  .iconRht {
    margin-right: 10px;
  }
`;
export default function Reg() {
  const { t } = useTranslation();
  const [list, setList] = useState<ExcelObj[]>([]);

  const Clear = () => {
    setList([]);
  };
  const updateLogo = (e: FormEvent) => {
    const { files } = e.target as any;
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);

    (fileReader as any).onload = (event: ChangeEvent) => {
      try {
        const { result } = event.target as any;
        const workbook = XLSX.read(result, { type: 'binary', codepage: 65001 });
        let data: any[] = [];

        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[sheet], {
              blankrows: false,
            });

            const arrs = csvData.split('\n');
            const objs = [];

            for (const item of arrs) {
              const vals = item.split(',');
              const [address, points, token, content, note] = vals;
              objs.push({
                address,
                points,
                token,
                content,
                note,
              });
            }

            data = objs;
          }
        }

        data.splice(0, 1);
        setList(data);

        console.log('Upload file successful!');
        // props.getChildrenMsg(data);
      } catch (e) {
        console.error('Unsupported file type!');
      }
    };
  };

  return (
    <Box>
      <FirstBox>
        <Button disabled={!list.length}>{t('Project.SubmitForReview')}</Button>

        <RhtBox>
          <ButtonLink className="rhtBtn" appearance="outline">
            <EvaIcon name="cloud-download-outline" />
            <span>{t('Project.DownloadForm')}</span>
          </ButtonLink>

          <BtnBox htmlFor="fileUpload" onChange={(e) => updateLogo(e)}>
            <input
              id="fileUpload"
              accept=".xlsx, .xls, .csv"
              type="file"
              hidden
              onClick={(event) => {
                (event.target as any).value = null;
              }}
            />
            <EvaIcon name="cloud-upload-outline" className="iconRht" />
            <span>{t('Project.ImportForm')}</span>
          </BtnBox>
          {!!list.length && (
            <Button appearance="outline" disabled={!list.length} onClick={() => Clear()}>
              {t('general.Clear')}
            </Button>
          )}
        </RhtBox>
      </FirstBox>
      <RegList uploadList={list} />
    </Box>
  );
}
