import styled from 'styled-components';
import { Button, ButtonLink } from '@paljs/ui/Button';
import RegList from 'components/projectInfoCom/regList';
import { EvaIcon } from '@paljs/ui/Icon';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import useTranslation from 'hooks/useTranslation';
import * as XLSX from 'xlsx';
import { ExcelObj } from 'type/project.type';
import requests from 'requests';
import { useCSVReader } from 'react-papaparse';
import { ApplicationType } from 'type/application.type';
import { ICreateBudgeApplicationRequest } from 'requests/applications';
import Loading from 'components/loading';

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
export default function Reg({ id }: { id: number }) {
  const { t } = useTranslation();
  // const { CSVReader } = useCSVReader();
  const [loading, setLoading] = useState(false);

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
      } catch (e) {
        console.error('Unsupported file type!');
      }
    };
  };

  const handleCreate = async () => {
    // TODO check invalid data
    setLoading(true);
    try {
      const data: ICreateBudgeApplicationRequest[] = list.map((item) => ({
        type: ApplicationType.NewReward,
        entity: 'project',
        entity_id: id,
        credit_amount: Number(item.points) || 0,
        token_amount: Number(item.token) || 0,
        detailed_type: item.content || '',
        comment: item.note || '',
        target_user_wallet: item.address,
      }));
      await requests.application.createBudgetApplications(data);
      Clear();
      // TODO alert success
    } catch (error) {
      console.error('createBudgetApplications failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async () => {
    const res = await requests.application.getTemplateFile();
    console.log('~', res);
  };

  return (
    <Box>
      {loading && <Loading />}
      <FirstBox>
        <Button disabled={!list.length} onClick={handleCreate}>
          {t('Project.SubmitForReview')}
        </Button>
        <RhtBox>
          <ButtonLink className="rhtBtn" appearance="outline" onClick={downloadFile}>
            <EvaIcon name="cloud-download-outline" />
            <span>{t('Project.DownloadForm')}</span>
          </ButtonLink>

          {/* <CSVReader
            onUploadAccepted={(results: { data: any[] }) => {
              handleCSVfile(results.data);
            }}
          >
            {({ getRootProps }) => (
              <>
                <div {...getRootProps()}>
                  <BtnBox>
                    <EvaIcon name="cloud-upload-outline" className="iconRht" />
                    <span>{t('Project.ImportForm')}</span>
                  </BtnBox>
                </div>
              </>
            )}
          </CSVReader> */}

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
