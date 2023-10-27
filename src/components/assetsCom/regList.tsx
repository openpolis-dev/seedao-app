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
            <div className="iconTop">
              <ExclamationDiamond />
            </div>
            <OptionBox>
              <Button onClick={onClickAdd}>
                <Download className="iconRht" />
                <span>添加</span>
              </Button>
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
          <Button variant="outline-primary" className="rhtBtn" onClick={downloadFile}>
            <Download />
            <span>{t('Project.DownloadForm')}</span>
          </Button>
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
  padding: 80px;
  background: rgba(161, 100, 255, 0.08);
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

const OptionBox = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const BtnBox = styled.label`
  background: var(--bs-primary);
  color: #fff;
  //height: 42px;
  padding: 8px 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  //font-family: 'Inter-Regular';
  //font-weight: 700;
  font-size: 0.875rem;
  margin-right: 20px;
  cursor: pointer;
  .iconRht {
    margin-right: 10px;
  }
  &:hover {
    background: var(--bs-primary);
  }
  width: 200px;
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
