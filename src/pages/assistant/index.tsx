import Notion from '../notion/notion';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from 'styled-components';
import { AppActionType, useAuthContext } from '../../providers/authProvider';
import BackerNav from '../../components/common/backNav';
import { useTranslation } from 'react-i18next';
import requests from "../../requests";
import { getUserLevel } from "../../requests/user";

const OuterBox = styled.div`
  min-height: 100%;
`;

const TopBox = styled.div`
  border-bottom: 1px solid #eee;
  margin: 20px 20px 0;
`;
export default function Assistant() {
  const [list, setList] = useState(null);
  const [articleId, setArticleId] = useState<string | undefined>('');
  const [level, setLevel] = useState<string>("0");
  // const { id } = useParams();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const { dispatch } = useAuthContext();
  const navigate = useNavigate();



  useEffect(() => {
    getLevel()
  }, []);

  const getLevel = async() =>{
    const res = await requests.user.getUserLevel();
    const current_lv = res.data?.current_lv;
    setLevel(current_lv);
    console.error("getUserLevel",current_lv,typeof current_lv);
  }

  useEffect(() => {
    // if (pathname?.indexOf('notion') > -1 || pathname?.indexOf('assistant') > -1) {
    //   setArticleId("d498b5e6919d4f2295bb76f80c83c4bf");
    // }else {
    //   setArticleId('0bad66817c464f04962b797b47056241');
    // }
    switch (level){
      case "2":
        setArticleId("19e87f9a7afc40ba9aa9beccded3dd61");
        break;
      case "3":
        setArticleId("2b78fc5a90584b5399bb0acb4404fd79");
        break;
      case "4":
        setArticleId("c7e2c42b05d24d529757b115455d5644");
        break;
      case "5":
        setArticleId("58272ec5de7d44ad9b665a11b1006ffb");
        break;
      case "6":
        setArticleId("566965755bd74c94944695f689e21101");
        break;
      case "1":
      default:
        setArticleId("cd2edf1da63f4b7188c81509deadabee");
        break;
    }


  }, [level]);
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

  const toBack = () =>{
    navigate(-1)
  }

  return (
    <OuterBox>
      <TopBox>
        {
          pathname?.indexOf('assistant') > -1 &&     <BackerNav title={t('apps.assistant')} onClick={()=>toBack()} to="" mb="20px" />
        }
        {
          pathname?.indexOf('assistant') === -1 &&     <BackerNav title={t('apps.assistant')} to={`/apps`} mb="20px" />
        }
      </TopBox>
      {list && <Notion recordMap={list} />}
    </OuterBox>
  );
}

