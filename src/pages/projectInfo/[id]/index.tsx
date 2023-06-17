import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import { Tabs, Tab } from '@paljs/ui/Tabs';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Card } from '@paljs/ui/Card';
import Info from 'components/projectInfoCom/info';
import Members from 'components/projectInfoCom/members';
import Assets from 'components/projectInfoCom/assets';
import ProjectProposal from 'components/projectInfoCom/proposal';
import Reg from 'components/projectInfoCom/reg';
import { EvaIcon } from '@paljs/ui/Icon';
import { getProjectById } from 'requests/project';
import { ReTurnProject } from 'type/project.type';
import useTranslation from 'hooks/useTranslation';
import { de } from 'date-fns/locale';
import { AppActionType, useAuthContext } from 'providers/authProvider';

const Box = styled.div`
  position: relative;
  .tab-content {
    padding: 0 !important;
  }
`;

const CardBox = styled(Card)`
  min-height: 85vh;
`;

const TopBox = styled.div`
  padding: 20px;
`;

const BackBox = styled.div`
  padding: 30px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  .icon {
    font-size: 24px;
  }
`;

export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = router.query;
  const [detail, setDetail] = useState<ReTurnProject | undefined>();
  const { dispatch } = useAuthContext();

  useEffect(() => {
    if (!id) return;
    getDetail();
  }, [id]);

  const getDetail = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    const dt = await getProjectById(id as string);
    dispatch({ type: AppActionType.SET_LOADING, payload: null });
    setDetail(dt.data);
  };

  return (
    <Layout title="SeeDAO Project">
      <CardBox>
        <Box>
          <BackBox onClick={() => router.back()}>
            <EvaIcon name="chevron-left-outline" className="icon" /> <span> {t('general.back')}</span>
          </BackBox>
          <Row>
            <Col breakPoint={{ xs: 12 }}>
              <TopBox>
                <Tabs>
                  <Tab key="0" title={t('Project.ProjectInformation')} responsive>
                    <Info detail={detail} />
                  </Tab>
                  <Tab key="1" title={t('Project.Members')} responsive>
                    <Members />
                  </Tab>
                  <Tab key="2" title={t('Project.Asset')} responsive>
                    <Assets />
                  </Tab>
                  <Tab key="3" title={t('Project.ProjectProposal')} responsive>
                    <ProjectProposal />
                  </Tab>
                  <Tab key="3" title={t('Project.Add')} responsive>
                    <Reg />
                  </Tab>
                </Tabs>
              </TopBox>
            </Col>
          </Row>
        </Box>
      </CardBox>
    </Layout>
  );
}
