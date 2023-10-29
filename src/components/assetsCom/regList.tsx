import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { IExcelObj } from 'type/project.type';
import { ExclamationDiamond } from 'react-bootstrap-icons';
import { Download } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';
import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { ethers } from 'ethers';
import * as XLSX from 'xlsx';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import requests from 'requests';
import CustomTable from './customTable';
import ExcelTable from './excelTable';
import NoItem from 'components/noItem';
import { AddButton } from './customTable';

type ErrorDataType = {
  line: number;
  errorKeys: string[];
};

enum ChooseType {
  default = 0,
  import,
  custom,
}

export default function RegList() {
  const { t } = useTranslation();

  const {
    state: { language },
  } = useAuthContext();

  const [errList, setErrList] = useState<ErrorDataType[]>([]);
  const [list, setList] = useState<IExcelObj[]>([]);

  const [chooseType, setChooseType] = useState(ChooseType.default);

  const updateFile = (e: FormEvent) => {
    setChooseType(ChooseType.import);
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

  const downloadFile = async () => {
    window.open(requests.application.getTemplateFileUrl(language), '_blank');
  };

  const onClickAdd = () => {
    setChooseType(ChooseType.custom);
  };

  useEffect(() => {
    if (!list.length) {
      setChooseType(ChooseType.default);
    }
  }, [list]);

  const getTableContent = () => {
    switch (chooseType) {
      case ChooseType.custom:
        return <CustomTable updateList={(data: IExcelObj[]) => setList(data)} />;
      case ChooseType.import:
        return <ExcelTable list={list} />;
      default:
        return (
          <TipsBox>
            <EmptyBox />
            <OptionBox>
              <AddButton onClick={onClickAdd} long={true}>
                {t('Assets.RegisterAdd')}
              </AddButton>
              <BtnBox htmlFor="fileUpload" onChange={(e) => updateFile(e)}>
                <input
                  id="fileUpload"
                  accept=".xlsx, .xls, .csv"
                  type="file"
                  hidden
                  onClick={(event) => {
                    (event.target as any).value = null;
                  }}
                />
                <Download className="iconRht" />
                <span>{t('Project.ImportForm').toUpperCase()}</span>
              </BtnBox>
            </OptionBox>
          </TipsBox>
        );
    }
  };

  return (
    <>
      <FirstBox>
        <RhtBox>
          <DownloadButton className="rhtBtn" onClick={downloadFile}>
            <Download />
            <span>{t('Project.DownloadForm')}</span>
          </DownloadButton>
          {chooseType === ChooseType.import && (
            <BtnBox htmlFor="fileUpload" onChange={(e) => updateFile(e)}>
              <input
                id="fileUpload"
                accept=".xlsx, .xls, .csv"
                type="file"
                hidden
                onClick={(event) => {
                  (event.target as any).value = null;
                }}
              />
              <Download className="iconRht" />
              <span>{t('Project.ImportForm').toUpperCase()}</span>
            </BtnBox>
          )}
        </RhtBox>
      </FirstBox>
      {!!errList.length && (
        <ErrorBox>
          <li>{t('Msg.ImportFailed')}:</li>
          {errList.map((item) => (
            <li key={item.line}>
              #{item.line}{' '}
              {item.errorKeys.map((ekey) => (
                //   @ts-ignore
                <span key={ekey}>{t('Project.ImportError', { key: t(`Project.${ekey}`) })}</span>
              ))}
            </li>
          ))}
        </ErrorBox>
      )}
      <Box>{getTableContent()}</Box>
    </>
  );
}

const Box = styled.div``;

const TipsBox = styled.div`
  padding: 40px;
  margin-top: 10px;
  text-align: center;
  color: var(--bs-primary);
  .iconTop {
    font-size: 40px;
    margin-bottom: 10px;
  }
`;

const FirstBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const RhtBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const OptionBox = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 30px;
`;

const BtnBox = styled.label`
  width: 137px;
  height: 34px;
  color: var(--bs-primary);
  text-align: center;
  border: 1px solid var(--bs-primary);
  //height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  //font-family: 'Inter-Regular';
  //font-weight: 700;
  font-size: 0.875rem;
  margin-right: 20px;
  cursor: pointer;
  .iconRht {
    margin-right: 10px;
  }
`;

const ErrorBox = styled.ul`
  li {
    color: red;
    line-height: 24px;
    span {
      margin-inline: 5px;
    }
  }
`;

const DownloadButton = styled.button`
  width: 189px;
  height: 34px;
  background: var(--bs-background);
  border-radius: 8px;
  opacity: 1;
  border: 1px solid var(--bs-svg-color);
  text-align: center;
  span {
    padding-left: 10px;
  }
`;

const EmptyBox = styled(NoItem)`
  padding: 0;
`;
