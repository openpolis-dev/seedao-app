import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import { Card } from '@paljs/ui/Card';
import styled from 'styled-components';
import { Tab, Tabs } from '@paljs/ui/Tabs';
import Audit from 'components/cityHallCom/audit';
import ProjectAudit from 'components/cityHallCom/projectAudit';
import Issued from 'components/cityHallCom/issued';
import useTranslation from 'hooks/useTranslation';
import Assets from 'components/cityHallCom/assets';
import Members from 'components/cityHallCom/members';
import Proposal from 'components/cityHallCom/proposal';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { getProjectById } from 'requests/guild';
import { getCityHallDetail } from 'requests/cityHall';
import { ReTurnProject } from 'type/project.type';
import { useWeb3React } from '@web3-react/core';

const Box = styled.div`
  //position: relative;
  .tab-content {
    padding: 0 0 30px !important;
    box-sizing: border-box;
  }
`;
const CardBox = styled(Card)`
  min-height: 85vh;
`;

const TopBox = styled.div`
  padding: 20px;
  box-sizing: border-box;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const TabsBox = styled(Tabs)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  .tabs {
    height: 100%;
  }
`;
export default function Index() {
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const [detail, setDetail] = useState<ReTurnProject | undefined>();

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    const dt = await getCityHallDetail();
    dispatch({ type: AppActionType.SET_LOADING, payload: null });
    setDetail(dt.data);
  };

  return (
    <Layout title="SeeDAO City Hall">
      <Box>
        <CardBox>
          <TopBox>
            <TabsBox>
              <Tab key="0" title={t('city-hall.PointsAndTokenAudit')} responsive>
                <Audit />
              </Tab>
              <Tab key="1" title={t('city-hall.ProjectAudit')} responsive>
                <ProjectAudit />
              </Tab>
              <Tab key="2" title={t('city-hall.Send')} responsive>
                <Issued />
              </Tab>
              <Tab key="3" title={t('city-hall.Members')} responsive>
                <Members detail={detail} updateProject={getDetail} />
              </Tab>
              <Tab key="4" title={t('city-hall.Asset')} responsive>
                <Assets detail={detail} refreshProject={getDetail} />
              </Tab>
              <Tab key="5" title={t('city-hall.Proposal')} responsive>
                <Proposal detail={detail} refreshProject={getDetail} />
              </Tab>
            </TabsBox>
          </TopBox>
        </CardBox>
      </Box>
    </Layout>
  );
}
