import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { getProjectById } from 'requests/project';
import { ProjectStatus, ReTurnProject } from 'type/project.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import usePermission from 'hooks/usePermission';
import { PermissionObject, PermissionAction } from 'utils/constant';
import { useTranslation } from 'react-i18next';
import Members from 'components/projectInfoCom/members';
import SipTag from 'components/common/sipTag';
import { MdPreview } from 'md-editor-rt';
import DefaultLogo from 'assets/Imgs/defaultLogo.png';

export default function InfoPage() {
  const { t } = useTranslation();

  const {
    state: { theme },
    dispatch,
  } = useAuthContext();

  const { id } = useParams();

  const [detail, setDetail] = useState<ReTurnProject | undefined>();

  const canAuditApplication = usePermission(
    PermissionAction.CreateApplication,
    PermissionObject.ProjPrefix + detail?.id,
  );

  useEffect(() => {
    id && getDetail();
  }, [id]);

  const getDetail = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const dt = await getProjectById(id as string);
      setDetail(dt.data);
    } catch (error) {
      logError(error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  const onUpdate = () => {
    getDetail();
  };

  const showStatusComponent = () => {
    if (detail?.status === ProjectStatus.Closed) {
      return <StatusTag>{t('Project.Closed')}</StatusTag>;
    }
    if (detail?.status === ProjectStatus.Pending) {
      return <StatusTag>{t('Project.Pending')}</StatusTag>;
    }
    if (canAuditApplication) {
      return (
        <Link to={`/project/edit/${detail?.id}`} state={detail}>
          <Button>{t('Project.Edit')}</Button>
        </Link>
      );
    }
  };

  return (
    <OuterBox>
      <Box>
        <BackerNav title={detail?.name || ''} to="/explore?tab=project" mb="40px" />
        <Content>
          <FlexLine>
            <AllBox>
              <TopBox>
                <TopBoxLeft>
                  <TopImg>
                    <img src={detail?.logo || DefaultLogo} alt="" />
                  </TopImg>
                  <TopInfo>
                    <TitleBox>{detail?.name}</TitleBox>
                    <div className="desc">{detail?.desc}</div>
                    <ProposalBox>
                      {detail?.proposals?.map((item, index) => (
                        <SipTag key={index} slug={item} />
                      ))}
                    </ProposalBox>
                  </TopInfo>
                </TopBoxLeft>

                {showStatusComponent()}
              </TopBox>
              <LastLine>
                <LftBox>
                  <InnerLft>
                    <Members detail={detail} updateProject={onUpdate} />
                  </InnerLft>
                </LftBox>
                <ContentBox>
                  <TitleBox>{t('Project.ProjectIntro')}</TitleBox>
                  <MdPreview theme={theme ? 'dark' : 'light'} modelValue={detail?.intro || ''} />
                </ContentBox>
              </LastLine>
            </AllBox>
          </FlexLine>
        </Content>
      </Box>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  ${ContainerPadding};
  min-height: 100%;
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
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  box-sizing: border-box;
  flex-grow: 1;
  display: flex;
  margin-top: -30px;
`;

const AllBox = styled.div`
  flex-grow: 1;
  margin-right: 18px;
  width: 100%;
`;

const FlexLine = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
`;

const LastLine = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  margin-top: 15px;
  padding-bottom: 60px;
  flex-shrink: 0;
  min-height: calc(100% - 110px);
`;

const LftBox = styled.div`
  width: 290px;
  background: var(--bs-box--background);
  border-radius: 16px;
  flex-shrink: 0;
`;

const InnerLft = styled.div`
  box-sizing: border-box;
`;

const TopBox = styled.div`
  display: flex;
  justify-content: space-between;

  background: var(--bs-box--background);
  box-shadow: var(--box-shadow);
  border-radius: 16px;
  padding: 22px 24px;
`;

const TopBoxLeft = styled.div`
  display: flex;
`;

const TopImg = styled.div`
  margin-right: 18px;
  img {
    width: 110px;
    height: 110px;
    object-fit: cover;
    object-position: center;
    border-radius: 16px;
  }
`;

const TitleBox = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: var(--bs-body-color_active);
  line-height: 36px;
  font-family: 'Poppins-Bold';
`;

const TopInfo = styled.div`
  flex-grow: 1;
  margin: 8px auto;
  .desc {
    width: 630px;

    font-size: 12px;
    font-weight: 400;
    color: #b0b0b0;
    line-height: 18px;
  }
`;

const ProposalBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 14px;
  flex-wrap: wrap;
  gap: 12px;
`;

const ContentBox = styled.div`
  border-radius: 16px;
  background: var(--bs-box--background);
  padding: 24px;
  flex-grow: 1;
  margin-left: 16px;
  color: var(--bs-body-color_active);

  img {
    max-width: 100%;
  }
`;

const StatusTag = styled.span`
  display: inline-block;
  border-radius: 8px;
  padding-inline: 10px;
  border: 1px solid var(--bs-primary);
  line-height: 26px;
  height: 26px;
  font-size: 12px;
  color: var(--bs-primary);
`;
