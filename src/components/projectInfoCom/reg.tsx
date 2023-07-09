import styled, { css } from 'styled-components';
import { Button, ButtonLink } from '@paljs/ui/Button';
import RegList from 'components/projectInfoCom/regList';
import { EvaIcon } from '@paljs/ui/Icon';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import useTranslation from 'hooks/useTranslation';
import * as XLSX from 'xlsx';
import { ExcelObj } from 'type/project.type';
import requests from 'requests';
import { ApplicationType } from 'type/application.type';
import { ICreateBudgeApplicationRequest } from 'requests/applications';
import Loading from 'components/loading';
import { ethers } from 'ethers';
import useToast, { ToastType } from 'hooks/useToast';
import { AssetName } from 'utils/constant';

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
  ${({ theme }) => css`
    background: ${theme.colorPrimary500};
    color: #fff;
    height: 42px;
    padding: 0 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-family: 'Inter-Regular';
    font-weight: 700;
    font-size: 0.875rem;
    margin-right: 20px;
    cursor: pointer;
    .iconRht {
      margin-right: 10px;
    }
    &:hover {
      background: ${theme.colorPrimary400};
    }
  `}
`;

type ErrorDataType = {
  line: number;
  errorKeys: string[];
};
export default function Reg({ id }: { id: number }) {
  const { t } = useTranslation();
  const { Toast, showToast } = useToast();
  // const { CSVReader } = useCSVReader();
  const [loading, setLoading] = useState(false);

  const [list, setList] = useState<ExcelObj[]>([]);
  const [errList, setErrList] = useState<ErrorDataType[]>([]);

  const Clear = () => {
    setList([]);
    setErrList([]);
  };
  const updateLogo = (e: FormEvent) => {
    const { files } = e.target as any;
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    const _errs: ErrorDataType[] = [];

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
            const objs: any = [];

            arrs.forEach((item, index) => {
              console.log(index, item);
              if (index !== 0) {
                const vals = item.split(',');
                const [address, points, token, content, note] = vals;
                objs.push({
                  address,
                  points,
                  token,
                  content,
                  note,
                });
                const _is_valid_address = ethers.utils.isAddress(address);
                const _token_val = Number(token);
                const _is_valid_token = !!_token_val && _token_val > 0;
                const _credit_val = Number(points);
                const _is_valid_credit = !!_credit_val && _credit_val > 0;
                const e: ErrorDataType = { line: index, errorKeys: [] };

                if (!_is_valid_address) {
                  e.errorKeys.push('Address');
                }
                if (!_is_valid_token && !_is_valid_credit) {
                  e.errorKeys.push('PointsOrToken');
                } else if (!_is_valid_token && (isNaN(_token_val) || _token_val < 0)) {
                  e.errorKeys.push('Token');
                } else if (!_is_valid_credit && (isNaN(_credit_val) || _credit_val < 0)) {
                  e.errorKeys.push('Credit');
                }
                if (e.errorKeys.length) {
                  _errs.push(e);
                }
              }
            });

            data = objs;
          }
        }
        setList(data);
        setErrList(_errs);

        console.log('Upload file successful!');
      } catch (e) {
        console.error('Unsupported file type!');
      }
    };
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const data: ICreateBudgeApplicationRequest[] = list.map((item) => {
        const d: ICreateBudgeApplicationRequest = {
          type: ApplicationType.NewReward,
          entity: 'project',
          entity_id: id,
          detailed_type: item.content || '',
          comment: item.note || '',
          target_user_wallet: item.address,
        };
        if (Number(item.points)) {
          d.credit_amount = Number(item.points);
          d.credit_asset_name = AssetName.Credit;
        }
        if (Number(item.token)) {
          d.token_amount = Number(item.token);
          d.token_asset_name = AssetName.Token;
        }
        return d;
      });
      await requests.application.createBudgetApplications(data);
      Clear();
      showToast(t('Project.SubmitSuccess'), ToastType.Success);
    } catch (error) {
      console.error('createBudgetApplications failed:', error);
      showToast(t('Project.SubmitFailed'), ToastType.Danger);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async () => {
    window.open(requests.application.getTemplateFileUrl(), '_blank');
  };

  return (
    <Box>
      {loading && <Loading />}
      {Toast}
      <FirstBox>
        <Button disabled={!list.length || !!errList.length} onClick={handleCreate}>
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
            <span>{t('Project.ImportForm').toUpperCase()}</span>
          </BtnBox>
          {!!list.length && (
            <Button appearance="outline" disabled={!list.length} onClick={() => Clear()}>
              {t('general.Clear')}
            </Button>
          )}
        </RhtBox>
      </FirstBox>
      {!!errList.length && (
        <ErrorBox>
          <li>Import failed:</li>
          {errList.map((item) => (
            <li key={item.line}>
              #{item.line}{' '}
              {item.errorKeys.map((ekey) => (
                <span key={ekey}>{t('Project.ImportError', { key: t(`Project.${ekey}`) })}</span>
              ))}
            </li>
          ))}
        </ErrorBox>
      )}

      <RegList uploadList={list} />
    </Box>
  );
}

const ErrorBox = styled.ul`
  li {
    color: red;
    line-height: 24px;
    span {
      margin-inline: 5px;
    }
  }
`;
