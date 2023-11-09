import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { useParams, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { getProjectById } from 'requests/project';
import { ReTurnProject } from 'type/project.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import usePermission from 'hooks/usePermission';
import { PermissionObject, PermissionAction } from 'utils/constant';
import { useTranslation } from 'react-i18next';
import Members from 'components/projectInfoCom/members';

export default function InfoPage() {
  const { t } = useTranslation();
  const { dispatch } = useAuthContext();

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
      console.error(error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  const onUpdate = () => {
    getDetail();
  };

  return (
    <OuterBox>
      <Box>
        <BackerNav title={detail?.name || ''} to="/explore?tab=project" mb="40px" />
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
                      <li key={index}>
                        <a href={`https://forum.seedao.xyz/thread/${item}`} target="_blank" rel="noopener noreferrer">
                          {`SIP-${item}`}
                        </a>
                      </li>
                    ))}
                  </ProposalBox>
                </TopInfo>
              </TopBox>
              <LastLine>
                <LftBox>
                  <InnerLft>
                    <Members detail={detail} updateProject={onUpdate} />
                  </InnerLft>
                </LftBox>
                <ContentBox>
                  <ReactMarkdown>{detail?.intro || ''}</ReactMarkdown>
                </ContentBox>
              </LastLine>
            </AllBox>

            {canAuditApplication && detail?.status !== 'pending_close' && (
              <Link to={`/project/edit/${detail?.id}`} state={detail}>
                <Button>{t('Project.Edit')}</Button>
              </Link>
            )}
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

const ProposalBox = styled.ul`
  display: flex;
  align-items: center;
  margin-top: 14px;
  flex-wrap: wrap;
  li {
    border-radius: 5px;
    border: 1px solid #0085ff;
    font-size: 12px;
    margin-right: 12px;
    a {
      padding: 2px 12px;
      color: #0085ff;
    }
  }
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
