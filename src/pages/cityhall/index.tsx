import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import usePermission from 'hooks/usePermission';
import { PermissionAction, PermissionObject } from 'utils/constant';
import PushPanel from 'components/cityHallCom/push';
import { ContainerPadding } from 'assets/styles/global';
import GovernancePage from './governance/governance';
import BrandPanel from 'components/cityHallCom/brand';
import TechPanel from 'components/cityHallCom/tech';
import Members from 'components/cityHallCom/members';
import Tabbar from 'components/common/tabbar';
import { Route, Routes, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import useCurrentSeason from 'hooks/useCurrentSeason';
import Publicity from "../publicity";
import CreatePublicity from "../publicity/create";
import DetailPublicity from "../publicity/detail";

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

enum SubPage {
  Members = 'members',
  Governance = 'governance',
  Brand = 'brand',
  Tech = 'tech',
  Push = 'notification',
  Publicity = 'publicity',
}

export default function Index() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const canUseCityhall = usePermission(PermissionAction.AuditApplication, PermissionObject.ProjectAndGuild);

  const currentSeason = useCurrentSeason();

  const tabs = useMemo(() => {
    return canUseCityhall
      ? [
          { key: SubPage.Members, title: `${currentSeason} ${t('city-hall.Cityhall')}`, path: 'members' },
          { key: SubPage.Governance, title: t('city-hall.Governance'), path: 'governance' },
          { key: SubPage.Brand, title: t('city-hall.Brand'), path: 'brand' },
          { key: SubPage.Tech, title: t('city-hall.Tech'), path: 'tech' },
          { key: SubPage.Push, title: t('city-hall.Push'), path: 'notification' },
          { key: SubPage.Publicity, title: t('city-hall.Publicity'), path: 'publicity/list' },
        ]
      : [{ key: SubPage.Members, title: `${currentSeason} ${t('city-hall.Cityhall')}`, path: 'members' }];
  }, [canUseCityhall, t, currentSeason]);

  const handleChangeSubPage = (v: number | string) => {
    const t = tabs.find((t) => t.key === v);
    if (t) {
      navigate(`/city-hall/${t.path}`);
    }
  };

  const defaultTabKey = useMemo(() => {
    return pathname.toLocaleLowerCase().replace('/city-hall/', '');
  }, [pathname]);
  console.log('defaultTabKey', defaultTabKey);

  return (
    <Box>
      <TopBox>
        <Tabbar tabs={tabs} defaultActiveKey={defaultTabKey || SubPage.Members} onSelect={handleChangeSubPage} />
        <Content>
          <Routes>
            <Route path="/" element={<Navigate to="members" />} />
            <Route path="members" element={<Members />} />
            <Route path="governance" element={<GovernancePage />} />
            <Route path="brand" element={<BrandPanel />} />
            <Route path="tech" element={<TechPanel />} />
            <Route path="notification" element={<PushPanel />} />
            <Route path="publicity" element={<Navigate to="publicity/list" />} />
            <Route path="publicity/list" element={<Publicity />} />
            <Route path="publicity/create" element={<CreatePublicity />} />

            <Route path="publicity/edit/:id" element={<CreatePublicity />} />
          </Routes>
        </Content>
      </TopBox>
    </Box>
  );
}
