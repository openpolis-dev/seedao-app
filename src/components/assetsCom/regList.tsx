import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { IExcelObj } from 'type/project.type';
import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useAuthContext } from 'providers/authProvider';
import CustomTable from './customTable';
import ExcelTable from './excelTable';
import NoItem from 'components/noItem';
import { AddButton } from './customTable';
import TableIconSVG from 'components/svgs/table';
import AddIcon from 'assets/Imgs/dark/add.svg';
import AddIconLight from 'assets/Imgs/light/add.svg';
import DownloadIconSVG from 'components/svgs/download';
import { getTemplateFileUrl } from 'requests/applications';

enum ChooseType {
  default = 0,
  import,
  custom,
}

interface IProps {
  list: IExcelObj[];
  setList: (data: IExcelObj[]) => void;
}

export default function RegList({ list, setList }: IProps) {
  const { t } = useTranslation();

  const {
    state: { theme, language },
  } = useAuthContext();

  const [chooseType, setChooseType] = useState(ChooseType.default);

  const updateFile = (e: FormEvent) => {
    setChooseType(ChooseType.import);
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
            const objs: any = [];

            arrs.forEach((item, index) => {
              console.log(index, item);
              if (index !== 0) {
                const vals = item.split(',');
                const [address, assetType, amount, content, note] = vals;
                objs.push({
                  address,
                  assetType,
                  amount,
                  content,
                  note,
                });
              }
            });

            data = objs;
          }
        }
        setList(data);

        console.log('Upload file successful!');
      } catch (e) {
        console.error('Unsupported file type!');
      }
    };
  };

  const downloadFile = async () => {
    window.open(getTemplateFileUrl(language), '_blank');
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
            <div className="inner">
              <table className="table" cellPadding="0" cellSpacing="0">
                <thead>
                  <tr>
                    <th>{t('application.AddressName')}</th>
                    <th style={{ width: '120px' }}>{t('application.AssetType')}</th>
                    <th style={{ width: '100px' }}>{t('application.AssetAmount')}</th>
                    <th>{t('application.Content')}</th>
                    <th>{t('application.RegisterNote')}</th>
                    <th></th>
                  </tr>
                </thead>
              </table>
              <EmptyBox />
              <OptionBox>
                <AddButton onClick={onClickAdd} long={true}>
                  <img src={theme ? AddIcon : AddIconLight} alt="" />
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
                  <TableIconSVG />
                  <span>{t('Project.ImportForm')}</span>
                </BtnBox>
              </OptionBox>
            </div>
          </TipsBox>
        );
    }
  };

  return (
    <>
      <FirstBox>
        <RhtBox>
          <DownloadButton className="rhtBtn" onClick={downloadFile}>
            <DownloadIconSVG />
            <span>{t('Project.DownloadForm')}</span>
          </DownloadButton>
          {chooseType === ChooseType.import && (
            <BtnBox className="top-import" htmlFor="fileUpload" onChange={(e) => updateFile(e)}>
              <input
                id="fileUpload"
                accept=".xlsx, .xls, .csv"
                type="file"
                hidden
                onClick={(event) => {
                  (event.target as any).value = null;
                }}
              />
              <TableIconSVG />
              <span>{t('Project.ImportForm')}</span>
            </BtnBox>
          )}
        </RhtBox>
      </FirstBox>
      <Box>{getTableContent()}</Box>
    </>
  );
}

const Box = styled.div`
  //background: var(--bs-box-background);
  border-radius: 16px;
`;

const TipsBox = styled.div`
  margin-top: 10px;
  text-align: center;
  color: var(--bs-primary);
  .inner {
    background: var(--bs-box-background);
    border-radius: 16px;
    padding-bottom: 40px;
  }
  .iconTop {
    font-size: 40px;
    margin-bottom: 10px;
  }
  table {
    margin-bottom: 40px;
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
  gap: 16px;
`;

const OptionBox = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 30px;
`;

const BtnBox = styled.label`
  height: 34px;
  box-sizing: border-box;
  color: var(--bs-primary);
  text-align: center;
  border: 1px solid var(--bs-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-right: 20px;
  gap: 8px;
  cursor: pointer;
  padding-inline: 12px;
  &.top-import {
    background: transparent;
    border: 1px solid var(--bs-primary);
    color: var(--bs-primary);
  }
  .svg-stroke {
    stroke: var(--bs-primary) !important;
  }
`;

const DownloadButton = styled.button`
  height: 34px;
  background: var(--bs-d-button-bg);
  color: var(--bs-svg-color);
  border-radius: 8px;
  border: 1px solid var(--bs-border-color);
  text-align: center;
  padding-inline: 12px;
  span {
    padding-left: 10px;
  }
`;

const EmptyBox = styled(NoItem)`
  padding: 0;
`;
