import React, { useEffect, useState } from 'react';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import styled from 'styled-components';
// import { useRouter } from 'next/router';
import Info from 'components/projectInfoCom/info';
import Members from 'components/projectInfoCom/members';
import Assets from 'components/projectInfoCom/assets';
import ProjectProposal from 'components/projectInfoCom/proposal';
import Reg from 'components/projectInfoCom/reg';
// import { EvaIcon } from '@paljs/ui/Icon';
import { getProjectById } from 'requests/project';
import { ProjectStatus, ReTurnProject } from 'type/project.type';
import { useTranslation } from 'react-i18next';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { listObj } from 'pages/project/index';
import useCheckLogin from 'hooks/useCheckLogin';
import usePermission from 'hooks/usePermission';
import { PermissionObject, PermissionAction } from 'utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { isNum } from 'react-toastify/dist/utils';
import { ChevronLeft } from 'react-bootstrap-icons';
import { ContainerPadding } from 'assets/styles/global';

const OuterBox = styled.div`
  min-height: 100%;
  ${ContainerPadding};
  @media (max-width: 1024px) {
    .nav {
      flex-wrap: nowrap;
    }
    .nav-item {
      white-space: nowrap;
    }
  }
`;

const Box = styled.div`
  position: relative;
  height: 100%;
  .tab-content {
    padding: 0 !important;
  }
`;

const CardBox = styled.div`
  min-height: 100%;
  background: #fff;
`;

const TopBox = styled.div`
  padding: 20px;
`;

const BackBox = styled.div`
  padding: 20px 20px 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  .iconTop {
    margin-right: 10px;
  }
`;

const LineBox = styled.div`
  width: 100%;
  overflow-x: auto;
  border-bottom: 1px solid #eee;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;

const TabsBox = styled(Tabs)`
  border-bottom: 0;
`;

const BtmBox = styled.div``;
export default function Index() {
  // const router = useRouter();
  const { t } = useTranslation();

  const {
    state: { account },
    dispatch,
  } = useAuthContext();
  const isLogin = useCheckLogin(account);
  // const { id } = router.query;

  // const { search } = window.location;
  // const id = new URLSearchParams(search).get('id');

  const { id } = useParams();

  const navigate = useNavigate();

  const projectId = Number(id);
  const [detail, setDetail] = useState<ReTurnProject | undefined>();
  const [current, setCurrent] = useState<number>(0);
  const [list, setList] = useState<listObj[]>([]);

  const canAuditApplication = usePermission(PermissionAction.CreateApplication, PermissionObject.ProjPrefix + id);

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

  const selectCurrent = (e: number) => {
    setCurrent(Number(e));
  };

  useEffect(() => {
    const _list = [
      {
        name: t('Project.ProjectInformation'),
        id: 0,
      },
      {
        name: t('Project.Members'),
        id: 1,
      },
      {
        name: t('Project.Asset'),
        id: 2,
      },
      {
        name: t('Project.ProjectProposal'),
        id: 3,
      },
    ];
    if (isLogin && canAuditApplication && detail?.status === ProjectStatus.Open) {
      _list.push({
        name: t('Project.Add'),
        id: 4,
      });
    }
    setList(_list);
  }, [t, isLogin, canAuditApplication, detail?.status]);

  const updateProjectStatus = (status: ProjectStatus) => {
    if (detail) {
      setDetail({ ...detail, status });
    }
  };

  const updateProjectName = (value: string) => {
    if (detail) {
      setDetail({ ...detail, name: value });
    }
  };

  return (
    <OuterBox>
      <CardBox>
        <Box>
          <BackBox onClick={() => navigate(-1)}>
            <ChevronLeft className="iconTop" />
            {/*<EvaIcon name="chevron-left-outline" className="icon" />*/}
            <span> {t('general.back')}</span>
          </BackBox>
          <Row>
            <Col>
              <TopBox>
                <LineBox>
                  <TabsBox defaultActiveKey={0} onSelect={(e: any) => selectCurrent(e)}>
                    {list.map((item, index) => (
                      <Tab key={item.id} title={item.name} eventKey={index} />
                    ))}
                  </TabsBox>
                </LineBox>

                <BtmBox>
                  {current === 0 && (
                    <Info
                      detail={detail}
                      updateProjectStatus={updateProjectStatus}
                      updateProjectName={updateProjectName}
                      updateProject={getDetail}
                    />
                  )}
                  {current === 1 && <Members detail={detail} updateProject={getDetail} />}
                  {current === 2 && <Assets id={projectId} detail={detail} />}
                  {current === 3 && <ProjectProposal detail={detail} refreshProject={getDetail} />}
                  {current === 4 && <Reg id={projectId} />}
                </BtmBox>
              </TopBox>
            </Col>
          </Row>
        </Box>
      </CardBox>
    </OuterBox>
  );
}
