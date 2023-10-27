import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Members from 'components/cityHallCom/members';
import Proposal from 'components/cityHallCom/proposal';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { getCityHallDetail } from 'requests/cityHall';
import { ReTurnProject } from 'type/project.type';
import usePermission from 'hooks/usePermission';
import { PermissionAction, PermissionObject } from 'utils/constant';
import PushPanel from 'components/cityHallCom/push';
import { ContainerPadding } from 'assets/styles/global';
import GovernancePanel from 'components/cityHallCom/Governance';
import BrandPanel from 'components/cityHallCom/brand';
import TechPanel from 'components/cityHallCom/tech';
import Management from 'components/cityHallCom/projectAudit';
import Register from 'components/cityHallCom/register';

const Box = styled.div`
  min-height: 100%;
  .tab-content {
    box-sizing: border-box;
  }
  ${ContainerPadding};
  color: var(--bs-body-color_active);
`;

const TopBox = styled.div`
  box-sizing: border-box;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const TabsBox = styled(Tabs)`
  flex-wrap: nowrap;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
  .nav-item {
    white-space: nowrap;
  }
  @media (max-width: 1024px) {
    .nav {
      flex-wrap: nowrap;
    }
  }
`;
export default function Index() {
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();
  const [detail, setDetail] = useState<ReTurnProject | undefined>();
  const [current, setCurrent] = useState<number>(0);

  const canUseCityhall = usePermission(PermissionAction.AuditApplication, PermissionObject.ProjectAndGuild);

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    const dt = await getCityHallDetail();
    dispatch({ type: AppActionType.SET_LOADING, payload: null });
    setDetail(dt.data);
  };

  const getFullContent = () => {
    return (
      [
        <Members detail={detail} updateProject={getDetail} />,
        <GovernancePanel />,
        <BrandPanel />,
        <TechPanel />,
        <PushPanel id={detail?.id} />,
        <Management />,
        <Register />,
      ][current] || <></>
    );
  };

  const getShortContent = () => {
    return [<Members detail={detail} updateProject={getDetail} />][current] || <></>;
  };

  return canUseCityhall ? (
    <Box>
      <TopBox>
        <TabsBox defaultActiveKey={0} onSelect={(e: any) => setCurrent(Number(e))}>
          <Tab eventKey={0} title={t('city-hall.Members')} />
          <Tab eventKey={1} title={t('city-hall.Governance')} />
          <Tab eventKey={2} title={t('city-hall.Band')} />
          <Tab eventKey={3} title={t('city-hall.Tech')} />
          <Tab eventKey={4} title={t('city-hall.Push')} />
          <Tab eventKey={5} title={t('city-hall.management')} />
          <Tab eventKey={6} title={t('city-hall.Add')} />
        </TabsBox>
        {getFullContent()}
      </TopBox>
    </Box>
  ) : (
    <Box>
      <TopBox>
        <TabsBox defaultActiveKey={0} onSelect={(e: any) => setCurrent(Number(e))}>
          <Tab eventKey={0} title={t('city-hall.Members')} />
        </TabsBox>
        {getShortContent()}
      </TopBox>
    </Box>
  );
}
