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

export default function Proposal() {
  const { id: qid } = useParams();
  const enableQuill = useLoadQuill();
  const { t } = useTranslation();

  const [data, setData] = useState<IBaseProposal>();
  const [loading, setLoading] = useState(false);

  const ProposalNav = useProposalCategory(data?.category_index_id);

  const getProposalInfo = async () => {
    const id = Number(qid);
    if (!id) {
      return;
    }
    setLoading(true);
    try {
      const res = await requests.proposal.getProposalDetail(id);
      setData(res.data.thread);
    } catch (error) {
      console.error('get proposal detail error:', error);
    } finally {
      setLoading(false);
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
                <div className="name">{data?.user.username}</div>
                <div className="date">{formatDate(new Date(data?.updated_at || ''))}</div>
              </div>
            </User>
            <MoreButton variant="outline-primary" onClick={lookMore}>
              {t('Proposal.LookMore')}
            </MoreButton>
            {/* <div style={{ overflow: 'hidden' }}>{data?.first_post.content}</div> */}
            {enableQuill && data?.first_post.content && <QuillViewer content={data?.first_post.content} />}
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
  background: #fff;
  padding: 20px;
  min-height: 100%;
  position: relative;
`;

const ProposalTitle = styled.div`
  font-size: 30px;
  font-weight: 600;
  line-height: 1.5em;
  @media (max-width: 900px) {
    width: 80%;
    font-size: 24px;
  }
`;
const User = styled.div`
  display: flex;
  gap: 10px;
  margin-block: 16px;
  .name {
    font-weight: 500;
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

const MoreButton = styled(Button)`
  position: absolute;
  right: 20px;
  top: 30px;
`;
