import styled from 'styled-components';
import { useEffect, useMemo, useState } from "react";
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Links from 'utils/links';
import AppCard, { EmptyAppCard } from 'components/common/appCard';
import { AppActionType, useAuthContext } from "../../providers/authProvider";
import { getCityHallDetail } from "../../requests/cityHall";
import publicJs from "../../utils/publicJs";
import useToast, { ToastType } from "../../hooks/useToast";

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

export default function TechPanel() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const {
    state: { theme,account },
    dispatch
  } = useAuthContext();

  const [disabled,setDisabled] = useState<boolean>(false);

  const lst = useMemo(() => {
    // @ts-ignore
    return Links.tech.map((item) => ({ ...item, name: t(item.name) as string, desc: t(item.desc) as string,disabled }));
  }, [t,disabled]);


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
          <Col sm={12} md={6} lg={4} xl={3} key={i}>
            <AppCard {...app} />
          </Col>
        ))}
        <Col sm={12} md={6} lg={4} xl={3}>
          <EmptyAppCard theme={theme} />
        </Col>
      </AppBox>
    </div>
  );
}
