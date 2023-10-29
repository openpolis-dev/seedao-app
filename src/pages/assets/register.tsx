import styled from 'styled-components';
import { Form } from 'react-bootstrap';
import RegList from 'components/assetsCom/regList';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ExcelObj } from 'type/project.type';
import requests from 'requests';
import { ApplicationType } from 'type/application.type';
import { ICreateBudgeApplicationRequest } from 'requests/applications';
import { AssetName } from 'utils/constant';
import useToast, { ToastType } from 'hooks/useToast';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { ContainerPadding } from 'assets/styles/global';
import Select from 'components/common/select';
import BackIconSVG from 'components/svgs/back';
import { Link } from 'react-router-dom';

type ErrorDataType = {
  line: number;
  errorKeys: string[];
};

export default function Register() {
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const { showToast } = useToast();

  const [list, setList] = useState<ExcelObj[]>([]);
  const [errList, setErrList] = useState<ErrorDataType[]>([]);
  const [id, setId] = useState(1);

  const [allSource, setAllSource] = useState<ISelectItem[]>([]);
  const [selectSource, setSelectSource] = useState<{ id: number; type: 'project' | 'guild' }>();

  const [content, setContent] = useState('');

  const Clear = () => {
    setList([]);
    setErrList([]);
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
      <BackBox to="/assets">
        <BackIconSVG />
        <span>{t('Assets.RegisterTitle')}</span>
      </BackBox>
      <SectionBlock>
        <div className="title">{t('Assets.RegisterSelect')}</div>
        <SourceSelect
          options={allSource}
          placeholder="Search project/guild name"
          onChange={(value: any) => {
            setSelectSource({ id: value?.value as number, type: value?.data });
          }}
        />
      </SectionBlock>
      <SectionBlock>
        <div className="title">{t('Assets.RegisterList')}</div>
        <RegList />
      </SectionBlock>

      <SectionBlock>
        <div className="title">{t('Assets.RegisterIntro')}</div>
        <Form.Control
          placeholder=""
          as="textarea"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </SectionBlock>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  box-sizing: border-box;
  min-height: 100%;
  ${ContainerPadding};
  font-size: 14px;
  .btnBtm {
    margin-right: 20px;
  }
`;

const SectionBlock = styled.section`
  margin-top: 20px;
  .title {
    margin-bottom: 16px;
    line-height: 20px;
    color: var(--bs-body-color_active);
  }
`;

const BackBox = styled(Link)`
  padding: 10px 0 20px;
  display: inline-flex;
  align-items: center;
  color: var(--bs-svg-color);
  gap: 20px;
  font-family: Poppins-SemiBold, Poppins;
  font-weight: 600;
  &:hover {
    color: var(--bs-svg-color);
  }
`;

const SourceSelect = styled(Select)`
  width: 348px;
`;
