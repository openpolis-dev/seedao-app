import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getSeeuEventList } from 'requests/event';
import Page from 'components/pagination';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import useToast, { ToastType } from 'hooks/useToast';
import { Row, Col } from 'react-bootstrap';
import { ContainerPadding } from '../../assets/styles/global';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Tabbar from 'components/common/tabbar';
import BackerNav from '../../components/common/backNav';
import dayjs from "dayjs";
import NewEvent from "./newEvent";

interface IEventProps {
  startDay: string;
  startTime: string;
  thumbnail: string | undefined;
  poster: string;
  subject: string;
  activeTime: string;
  city:string;
  fee: string;
  type: string;
  id: number;
}

const TopBox = styled.div`
  border-bottom: 1px solid #eee;
  margin-bottom: 30px;
`;

export default function SeeuNetwork() {
  const { t } = useTranslation();

  const [lst, setLst] = useState<IEventProps[]>([]);
  const { dispatch } = useAuthContext();
  const { showToast } = useToast();


  const getList = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const resp = await fetch("/data/eventList.json");
      let rt = await resp.json();

      const list = rt.data.items;

      let arr:IEventProps[] = [];
      list.map((item:any) => {
        let startDay = dayjs(item.fields['活动日期']).format(`YYYY-MM-DD`);
        arr.push({
          startDay,
          startTime:item.fields['活动时间'] ? item.fields['活动时间'][0].text :"",
          thumbnail: "string",
          poster: item.fields['活动照片/海报'] ? item.fields['活动照片/海报'][0].name :"",
          subject:item.fields['活动名称'][0].text,
          activeTime:item.fields['活动时长'] ? item.fields['活动时长'][0].text :"",
          city:item.fields['活动地点'] ? item.fields['活动地点'][0].text :"",
          fee:item.fields['活动费用'] ?item.fields["活动费用"][0].text:"",
          type:item?.fields["活动类型"] ?? "",
          id:item.record_id
        });
      })

      // setTotal(resp.data.total);
      setLst(arr);
    } catch (error: any) {
      // showToast(error, ToastType.Danger);
      showToast(`${error?.data?.code}:${error?.data?.msg || error?.code || error}`, ToastType.Danger);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <OuterBox>
      {/*<TitBox>*/}
      {/*  <div className="titLft">*/}
      {/*    <Tabbar defaultActiveKey={0} tabs={[{ key: 0, title: t('event.events') }]} />*/}
      {/*  </div>*/}
      {/*</TitBox>*/}
      <TopBox>
        <BackerNav title={t('apps.Event')} to={`/apps`} mb="20px" />
      </TopBox>

      <Row>
        {lst.map((item, idx) => (
          <Col key={idx} sm={12} md={6} lg={3} xl={3} style={{ marginBottom: '30px', }}>
              <NewEvent item={item} />
          </Col>
        ))}
      </Row>
    </OuterBox>
  );
}

const PageBox = styled.div`
  margin: 0 40px;
`;

const OuterBox = styled.div`
  min-height: 100%;
  ${ContainerPadding};
  .itemBox {
    background-color: var(--bs-box-background);
    border: 1px solid var(--bs-border-color);
      border-radius: 10px;
      overflow: hidden;
  }
  .item-content {
    h5,
    h6 {
      font-size: 16px;
    }
    .status {
      font-size: 12px;
    }
  }
`;

const TitBox = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  .titLft {
    width: 100%;
  }
`;
