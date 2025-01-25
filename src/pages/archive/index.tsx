import Notion from '../notion/notion';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { AppActionType, useAuthContext } from '../../providers/authProvider';

import { useTranslation } from 'react-i18next';

import useToast, { ToastType } from "../../hooks/useToast";

const OuterBox = styled.div`
  min-height: 100%;
`;

export default function Archive() {
  const [list, setList] = useState(null);

  const { t } = useTranslation();

  const { dispatch } = useAuthContext();
  const { showToast } = useToast();


  useEffect(() => {
    getData("f57031667089473faa7ea3560d05960c")

  }, []);
  const getData = async (articleId:string) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      let result = await axios.get(`https://kind-emu-97.deno.dev/page/${articleId}`);
      setList(result.data);
    } catch (error: any) {
      console.log(error);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };



  return (
    <OuterBox>
      {/*<TopBox>*/}

      {/*  <BackerNav title={t('menus.archive')} onClick={()=>toBack()} to="" mb="20px" />*/}


      {/*</TopBox>*/}
      {list && <Notion recordMap={list} />}
    </OuterBox>
  );
}

