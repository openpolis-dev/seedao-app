import styled, { css } from 'styled-components';
import { Button } from 'react-bootstrap';
import RegList from 'components/guild/regList';
// import { EvaIcon } from '@paljs/ui/Icon';
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import { ExcelObj } from 'type/project.type';
import requests from 'requests';
// import { useCSVReader } from 'react-papaparse';
import { ApplicationType } from 'type/application.type';
import { ICreateBudgeApplicationRequest } from 'requests/applications';
import { AssetName } from 'utils/constant';
import useToast, { ToastType } from 'hooks/useToast';
import { ethers } from 'ethers';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { Download } from 'react-bootstrap-icons';
import { ContainerPadding } from 'assets/styles/global';
import Select from 'components/common/select';

const FirstBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
  margin-top: 20px;
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
`;

type ErrorDataType = {
  line: number;
  errorKeys: string[];
};

export default function Register() {
  const { t } = useTranslation();
  // const { CSVReader } = useCSVReader();
  const {
    state: { language },
  } = useAuthContext();
  const { dispatch } = useAuthContext();
  const { showToast } = useToast();

  const [list, setList] = useState<ExcelObj[]>([]);
  const [errList, setErrList] = useState<ErrorDataType[]>([]);
  const [id, setId] = useState(1);

  const [allSource, setAllSource] = useState<ISelectItem[]>([]);
  const [selectSource, setSelectSource] = useState<{ id: number; type: 'project' | 'guild' }>();

  const Clear = () => {
    setList([]);
    setErrList([]);
  };
  const updateFile = (e: FormEvent) => {
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
    dispatch({ type: AppActionType.SET_LOADING, payload: true });

    try {
      const data: ICreateBudgeApplicationRequest[] = list.map((item) => {
        const d: ICreateBudgeApplicationRequest = {
          type: ApplicationType.NewReward,
          entity: 'guild',
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
      showToast(t('Guild.SubmitSuccess'), ToastType.Success);
    } catch (error) {
      console.error('createBudgetApplications failed:', error);
      showToast(t('Guild.SubmitFailed'), ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const downloadFile = async () => {
    window.open(requests.application.getTemplateFileUrl(language), '_blank');
  };

  const getProjects = async () => {
    try {
      const res = await requests.project.getProjects({
        page: 1,
        size: 1000,
        sort_order: 'desc',
        sort_field: 'created_at',
      });
      return res.data.rows.map((item) => ({
        label: item.name,
        value: item.id,
        data: 'project',
      }));
    } catch (error) {
      console.error('getProjects in city-hall failed: ', error);
      return [];
    }
  };
  const getGuilds = async () => {
    try {
      const res = await requests.guild.getProjects({
        page: 1,
        size: 1000,
        sort_order: 'desc',
        sort_field: 'created_at',
      });
      return res.data.rows.map((item) => ({
        label: item.name,
        value: item.id,
        data: 'guild',
      }));
    } catch (error) {
      console.error('getGuilds in city-hall failed: ', error);
      return [];
    }
  };

  useEffect(() => {
    const getSources = async () => {
      const projects = await getProjects();
      const guilds = await getGuilds();
      setAllSource([...projects, ...guilds]);
    };
    getSources();
  }, []);

  return (
    <OuterBox>
      <Box>
        <ChooseSourceBox>
          <span className="title">1. 选择项目/公会</span>
          <Select
            options={allSource}
            placeholder=""
            onChange={(value: any) => {
              setSelectSource({ id: value?.value as number, type: value?.data });
            }}
          />
        </ChooseSourceBox>
        <span className="title">2. 登记信息</span>
        <FirstBox>
          <Button disabled={!list.length || !!errList.length} onClick={handleCreate}>
            {t('Project.SubmitForReview')}
          </Button>
          <RhtBox>
            <Button variant="outline-primary" className="rhtBtn" onClick={downloadFile}>
              <Download />
              <span>{t('Project.DownloadForm')}</span>
            </Button>

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
            {!!list.length && (
              <Button disabled={!list.length} onClick={() => Clear()}>
                {t('general.Clear')}
              </Button>
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
        <RegList uploadList={list} />
      </Box>
    </OuterBox>
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

const OuterBox = styled.div`
  box-sizing: border-box;
  min-height: 100%;
  ${ContainerPadding};
`;

const Box = styled.div`
  min-height: 100%;
  padding: 20px;
  background-color: #fff;
  .btnBtm {
    margin-right: 20px;
  }
  .title {
  }
`;

const ChooseSourceBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;
