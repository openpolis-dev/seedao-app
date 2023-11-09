import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getProjectById } from 'requests/guild';
import { ReTurnProject } from 'type/project.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { useParams, Link } from 'react-router-dom';
import { ContainerPadding } from 'assets/styles/global';
import { useTranslation } from 'react-i18next';
import Members from 'components/guild/members';
import ReactMarkdown from 'react-markdown';
import usePermission from 'hooks/usePermission';
import { PermissionObject, PermissionAction } from 'utils/constant';
import { Button } from 'react-bootstrap';
import BackerNav from 'components/common/backNav';
import SipTag from 'components/common/sipTag';

export default function Index() {
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();

  const { id } = useParams();

  const [detail, setDetail] = useState<ReTurnProject | undefined>();

  const canAuditApplication = usePermission(
    PermissionAction.CreateApplication,
    PermissionObject.GuildPrefix + detail?.id,
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
      console.error(error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  return (
    <OuterBox>
      <Box>
        <BackerNav to="/explore?tab=guild" title={detail?.name || ''} mb="40px" />
        <Content>
          <FlexLine>
            <AllBox>
              <TopBox>
                <TopImg>
                  <img src={detail?.logo} alt="" />
                </TopImg>
                <TopInfo>
                  <TitleBox>{detail?.name}</TitleBox>
                  <div className="desc">{detail?.desc}</div>
                  <ProposalBox>
                    {detail?.proposals.map((item, index) => (
                      <SipTag key={index} threadId={Number(item)} />
                    ))}
                  </ProposalBox>
                </TopInfo>
              </TopBox>
              <LastLine>
                <LftBox>
                  <InnerLft>
                    <Members detail={detail} updateProject={getDetail} />
                  </InnerLft>
                </LftBox>
                <ContentBox>
                  <ReactMarkdown>{detail?.intro || ''}</ReactMarkdown>
                </ContentBox>
              </LastLine>
            </AllBox>
            {canAuditApplication && (
              <Link to={`/guild/edit/${detail?.id}`} state={detail}>
                <Button>{t('general.edit')}</Button>
              </Link>
            )}
          </FlexLine>
        </Content>
      </Box>
    </OuterBox>
  );
}

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
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  box-sizing: border-box;
  flex-grow: 1;
  display: flex;
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
  margin-top: 60px;
  padding-bottom: 60px;
  flex-shrink: 0;
  min-height: calc(100% - 200px);
`;

const LftBox = styled.div`
  width: 246px;
`;

const InnerLft = styled.div`
  background: var(--bs-box--background);
  border-radius: 16px;
  width: 246px;
  box-sizing: border-box;
  padding: 24px;
`;

const TopBox = styled.div`
  display: flex;
`;

const TopImg = styled.div`
  margin-right: 18px;
  img {
    width: 110px;
    height: 110px;
    border-radius: 16px;
  }
`;

const TitleBox = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: var(--bs-body-color_active);
  line-height: 36px;
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
