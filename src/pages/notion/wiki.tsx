import Notion from './notion';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AppActionType, useAuthContext } from '../../providers/authProvider';
import BackerNav from '../../components/common/backNav';
import { useTranslation } from 'react-i18next';

const OuterBox = styled.div`
  min-height: 100%;
`;

const TopBox = styled.div`
  border-bottom: 1px solid #eee;
  margin: 20px 20px 0;
`;
export default function Wiki() {
  const [list, setList] = useState(null);
  const [articleId, setArticleId] = useState<string | undefined>('');
  const { id } = useParams();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const { dispatch } = useAuthContext();

  useEffect(() => {
    if (pathname?.indexOf('notion') > -1) {
      setArticleId(id);
    } else {
      setArticleId('0bad66817c464f04962b797b47056241');
    }
  }, [pathname]);
  const getData = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      let result = await axios.get(`https://kind-emu-97.deno.dev/page/${articleId}`);
      setList(result.data);
    } catch (e: any) {
      console.log(e);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  useEffect(() => {
    if (!articleId) return;
    getData();
  }, [articleId]);

  useEffect(() => {
    if (!list) return;
    let domStr = document.querySelector('.breadcrumb');
    let spacer = document.querySelector('.spacer');
    if (domStr) {
      (domStr as any).style.display = 'none';
    }
    if (spacer) {
      (spacer as any).style.display = 'none';
    }
  }, [list]);

  return (
    <OuterBox>
      <TopBox>
        <BackerNav title={t('apps.wiki')} to={`/`} mb="20px" />
      </TopBox>
      {list && <Notion recordMap={list} />}
    </OuterBox>
  );
}
