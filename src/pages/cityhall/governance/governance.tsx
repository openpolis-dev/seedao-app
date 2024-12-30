import styled from 'styled-components';
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Links from 'utils/links';
import AppCard, { EmptyAppCard } from 'components/common/appCard';
import { AppActionType, useAuthContext } from "providers/authProvider";
import { useNavigate } from 'react-router-dom';
import { Icon } from 'lucide-react';
import { getCityHallDetail } from "../../../requests/cityHall";
import useToast, { ToastType } from "../../../hooks/useToast";


const AppBox = styled(Row)`
  div[class^='col'] {
    min-height: 96px;
    display: flex;
    margin-bottom: 24px;
  }
  .boxApp {
    align-items: flex-start;
    padding: 16px;
  }
  .iconBox {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    .inner {
      background: #fff;
      width: 44px;
      height: 44px;
      border-radius: 8px;
    }
    img {
      width: 24px;
      height: 24px;
      border-radius: 8px;
    }

  }
`;

const AppCardBox = (props: { children: React.ReactNode }) => {
  return (
    <Col sm={12} md={6} lg={4} xl={3}>
      {props.children}
    </Col>
  );
};

const BtmBox = styled.div`
  margin-top: 20px;
  border-top: 1px solid var(--bs-border-color);
  padding-top: 40px;
  margin-left: 12px;

    .iconBox{
        margin-bottom: 18px;
        color: var(--bs-primary);
    }
`;

const LiBox = styled(Col)`
  width: 181px;
  height: 160px;
  background: var(--bs-box--background);
  box-shadow: var(--box-shadow);
  border-radius: 16px;
  border: 1px solid var(--border-box);
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-right: 20px;
  cursor: pointer;
    margin-bottom: 20px;
  .name {
    font-size: 16px;
    font-weight: 600;
    color: var(--bs-body-color_active);
    line-height: 22px;
    text-align: center;
  }
  img {
    width: 28px;
    height: 28px;
    object-fit: cover;
    object-position: center;
    margin-bottom: 18px;
  }
    &.disabled{
        opacity: 0.5!important;
        cursor: not-allowed;
    }
`;

export default function GovernancePage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [disabled,setDisabled] = useState<boolean>(false);

  const {
    state: { theme,account },
    dispatch
  } = useAuthContext();

  const navigate = useNavigate();

  const lst = useMemo(() => {
    // @ts-ignore
    return Links.governance.map((item) => ({ ...item, name: t(item.name) as string, desc: t(item.desc) as string }));
  }, [t]);

  const BList = useMemo(() => {
    // @ts-ignore
    return Links.governanceBtm.map((item) => ({ ...item, name: t(item.name) as string, desc: t(item.desc) as string,disabled }));
  }, [t,disabled]);

  const ToGo = (url: string,disabled:boolean,item:any) => {
    if(disabled && item.id ==="module-sbt")return;

    navigate(url);
  };


  const getDetail = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const dt = await getCityHallDetail();
      const members = dt.data.grouped_sponsors.G_GOVERNANCE;

      const disabledArr = members.filter((item) => item.toLowerCase() === account!.toLowerCase());
      setDisabled(!disabledArr?.length)
    } catch (error:any) {
      logError(error);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  useEffect(() => {
    if(!account)return;
    getDetail();
  }, [account]);

  return (
    <div>
      <AppBox>
        {lst.map((app, i) => (
          <AppCardBox key={i}>
            <AppCard {...app} />
          </AppCardBox>
        ))}
        {/*<AppCardBox>*/}
        {/*  <EmptyAppCard theme={theme} />*/}
        {/*</AppCardBox>*/}
      </AppBox>
      <BtmBox>
        <Row>
          {BList.map((item, index) => (
            <LiBox md={2} key={`gBtm_${index}`}  onClick={() => ToGo(item.link,item.disabled,item)} className={item.disabled && item.id==='module-sbt'?"disabled":""}>
              <div>
                {
                  item.type !== "icon" && <img src={item.icon as string} alt="" />
                }
                {
                  item.type === "icon" &&    <Icon iconNode={item.icon} size={28} className="iconBox" />
                }

              </div>
              <div className="name">{item.name}</div>
            </LiBox>
          ))}
        </Row>
      </BtmBox>
    </div>
  );
}
