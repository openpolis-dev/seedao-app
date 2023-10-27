import React, { useEffect, useState } from 'react';
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
import Tabbar from 'components/common/tabbar';

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

const Content = styled.div`
  padding-block: 41px;
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
        <Tabbar
          tabs={[
            { key: 0, title: t('city-hall.Members') },
            { key: 1, title: t('city-hall.Governance') },
            { key: 2, title: t('city-hall.Band') },
            { key: 3, title: t('city-hall.Tech') },
            { key: 4, title: t('city-hall.Push') },
            { key: 5, title: t('city-hall.management') },
            // { key: 6, title: t('city-hall.Add') },
          ]}
          defaultActiveKey={0}
          onSelect={(v) => setCurrent(v as number)}
        />
        <Content>{getFullContent()}</Content>
      </TopBox>
    </Box>
  ) : (
    <Box>
      <TopBox>
        <Tabbar
          tabs={[{ key: 0, title: t('city-hall.Members') }]}
          defaultActiveKey={0}
          onSelect={(v) => setCurrent(v as number)}
        />
        <Content>{getShortContent()}</Content>
      </TopBox>
    </Box>
  );
}
