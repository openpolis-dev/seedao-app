import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import requests from 'requests';
import { IBaseProposal } from 'type/proposal.type';
import { Button } from 'react-bootstrap';

import QuillViewer from 'components/proposal/quillViewer';
import useLoadQuill from 'hooks/useLoadQuill';

import useProposalCategory from 'hooks/useProposalCategory';
import { formatDate } from 'utils/time';
import LoadingBox from 'components/loadingBox';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ContainerPadding } from 'assets/styles/global';
import { AppActionType, useAuthContext } from '../../providers/authProvider';

export default function Proposal() {
  const { id: qid } = useParams();
  const enableQuill = useLoadQuill();
  const { t } = useTranslation();

  const { dispatch } = useAuthContext();

  const [data, setData] = useState<IBaseProposal>();
  const [loading, setLoading] = useState(false);

  const ProposalNav = useProposalCategory(data?.category_index_id);

  const getProposalInfo = async () => {
    const id = Number(qid);
    if (!id) {
      return;
    }
    // setLoading(true);
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const res = await requests.proposal.getProposalDetail(id);
      setData(res.data.thread);
    } catch (error) {
      console.error('get proposal detail error:', error);
    } finally {
      // setLoading(false);
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  useEffect(() => {
    getProposalInfo();
  }, [qid]);

  const lookMore = () => {
    window.open(`https://forum.seedao.xyz/thread/${qid}`, '_blank');
  };

  return (
    <BoxOuter>
      {ProposalNav}
      <ProposalContainer>
        {!data && loading && <LoadingBox />}
        {data && (
          <>
            <ProposalTitle>{data?.title}</ProposalTitle>
            <User>
              <div className="left">
                <UserAvatar src={data?.user.photo_url} alt="" />
              </div>
              <div className="right">
                <div className="name">
                  <div>{data?.user.username}</div>
                  {data.user_title?.name && <UserTag bg={data.user_title.background}>{data.user_title?.name}</UserTag>}
                </div>
                <div className="date">{formatDate(new Date(data?.updated_at || ''))}</div>
              </div>
            </User>
            <MoreButton onClick={lookMore}>{t('Proposal.LookMore')}</MoreButton>
            <Content>
              {enableQuill && data?.first_post.content && <QuillViewer content={data?.first_post.content} />}
            </Content>
            {/* <div style={{ overflow: 'hidden' }}>{data?.first_post.content}</div> */}
          </>
        )}
      </ProposalContainer>
    </BoxOuter>
  );
}

const BoxOuter = styled.div`
  min-height: 100%;
  ${ContainerPadding};
`;

const ProposalContainer = styled.div`
  background: var(--bs-box-background);
  border-radius: 16px;
  padding: 24px;
  min-height: 100%;
  position: relative;
  margin-top: 19px;
`;

const ProposalTitle = styled.div`
  font-size: 24px;
  font-family: Poppins-Bold, Poppins;
  font-weight: bold;
  color: var(--bs-body-color_active);
  @media (max-width: 900px) {
    width: 80%;
  }
`;
const User = styled.div`
  display: flex;
  gap: 10px;
  margin-block: 16px;
  .name {
    font-size: 14px;
    font-family: Poppins-SemiBold, Poppins;
    color: var(--bs-body-color_active);
    display: inline-flex;
    align-items: center;
  }
  .date {
    font-size: 13px;
    color: #999;
  }
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const MoreButton = styled.button`
  position: absolute;
  right: 20px;
  top: 30px;
  height: 24px;
  padding-inline: 12px;
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  border: 1px solid #0085ff;
  color: #0085ff;
  background-color: transparent;
  font-size: 12px;
`;

const Content = styled.div`
  color: var(--bs-body-color_active);
  max-width: 750px;
  h1 {
    margin-top: 28px;
    margin-bottom: 10px;
    font-size: 24px;
  }
  ul,
  ol {
    margin-block: 12px;
    padding-inline-start: 40px;
  }
  img {
    max-height: 600px;
  }
  p {
    margin-top: 10px;
    margin-bottom: 16px;
  }
`;

const UserTag = styled.span<{ bg: string }>`
  padding-inline: 8px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  color: #000;
  background-color: ${(props) => props.bg};
  border-radius: 6px;
  margin-left: 8px;
`;
