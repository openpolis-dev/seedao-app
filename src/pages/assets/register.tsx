import styled from 'styled-components';
import { Form } from 'react-bootstrap';
import RegList from 'components/assetsCom/regList';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IExcelObj } from 'type/project.type';
import requests from 'requests';
import { ApplicationType, ApplicationEntity } from 'type/application.type';
import { AssetName } from 'utils/constant';
import useToast, { ToastType } from 'hooks/useToast';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { ContainerPadding } from 'assets/styles/global';
import Select from 'components/common/select';
import BackIconSVG from 'components/svgs/back';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

type ErrorDataType = {
  line: number;
  errorKeys: string[];
};

export default function Register() {
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const { showToast } = useToast();

  const [list, setList] = useState<IExcelObj[]>([]);
  const [errList, setErrList] = useState<ErrorDataType[]>([]);

  const [allSource, setAllSource] = useState<ISelectItem[]>([]);
  const [selectSource, setSelectSource] = useState<{ id: number; type: ApplicationEntity }>();

  const [content, setContent] = useState('');

  const Clear = () => {
    setList([]);
    setErrList([]);
  };

  const handleCreate = async () => {
    if (!selectSource) {
      return;
    }
    // check and convert sns
    dispatch({ type: AppActionType.SET_LOADING, payload: true });

    try {
      const data = {
        entity: selectSource.type,
        entity_id: selectSource.id,
        comment: content,
        records: list.map((item) => ({
          amount: Number(item.amount),
          asset_name: item.assetType,
          comment: item.content,
          detailed_type: item.note,
          entity: selectSource.type,
          entity_id: selectSource.id,
          target_user_wallet: item.address,
        })),
      };
      await requests.application.createApplicationBundles(data);
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
        data: ApplicationEntity.Project,
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
        data: ApplicationEntity.Guild,
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
        <RegList list={list} setList={setList} />
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
      <ButtonSection>
        <Button variant="primary" onClick={handleCreate}>
          {t('Assets.RegisterSubmit')}
        </Button>
      </ButtonSection>
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

const ButtonSection = styled(SectionBlock)`
  button {
    width: 120px;
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
