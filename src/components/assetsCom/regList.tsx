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
import AddIcon from 'assets/Imgs/add.svg';
import DownloadIconSVG from 'components/svgs/download';
import ExcellentExport from 'excellentexport';

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
    state: { language },
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
    ExcellentExport.convert({ filename: t('Assets.TemplateFileName'), format: 'xlsx', openAsDownload: true }, [
      {
        name: 'Sheet',
        from: {
          array: [
            [
              t('application.AddressName'),
              t('application.AssetType'),
              t('application.AssetAmount'),
              t('application.Content'),
              t('application.RegisterNote'),
            ],
            ['***.seedao', 'SCR', '100', '', ''],
            ['0x0000000000000000000000000000000000000000', 'USDT', '100', '', ''],
          ],
        },
      },
    ]);
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
                <img src={AddIcon} alt="" />
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
              <span>{t('Project.ImportForm').toUpperCase()}</span>
            </BtnBox>
          )}
        </RhtBox>
      </FirstBox>
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
  span {
    font-family: Poppins-SemiBold, Poppins;
  }
  &.top-import {
    background: var(--bs-background);
    border: 1px solid var(--bs-svg-color);
    color: var(--bs-svg-color);
  }
  .svg-stroke {
    stroke: var(--bs-primary) !important;
  }
`;

const DownloadButton = styled.button`
  height: 34px;
  background: var(--bs-background);
  color: var(--bs-svg-color);
  border-radius: 8px;
  border: 1px solid var(--bs-svg-color);
  text-align: center;
  padding-inline: 12px;
  span {
    padding-left: 10px;
    font-family: Poppins-SemiBold, Poppins;
  }
`;

const EmptyBox = styled(NoItem)`
  padding: 0;
`;
