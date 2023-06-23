import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import requests from 'requests';
import { IBaseProposal } from 'type/proposal.type';
import { Card } from '@paljs/ui/Card';
import { Button } from '@paljs/ui/Button';

import QuillViewer from 'components/proposal/quillViewer';
import useLoadQuill from 'hooks/useLoadQuill';

import useProposalCategory from 'hooks/useProposalCategory';
import { formatDate } from 'utils/time';

export default function Proposal() {
  const router = useRouter();
  const enableQuill = useLoadQuill();

  const [data, setData] = useState<IBaseProposal>();

  const ProposalNav = useProposalCategory(data?.category_index_id);

  const getProposalInfo = async () => {
    const id = Number(router.query.id);
    if (!id) {
      return;
    }
    const res = await requests.proposal.getProposalDetail(id);
    setData(res.data.thread);
  };

  useEffect(() => {
    getProposalInfo();
  }, [router.query.id]);

  const lookMore = () => {
    window.open(`https://forum.seedao.xyz/thread/${router.query.id}`, '_blank');
  };

  return (
    <Layout title="SeeDAO Proposal">
      {ProposalNav}
      <ProposalContainer>
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
        <MoreButton shape="Rectangle" appearance="outline" size="Tiny" onClick={lookMore}>
          查看更多
        </MoreButton>
        {/* <div style={{ overflow: 'hidden' }}>{data?.first_post.content}</div> */}
        {enableQuill && data?.first_post.content && <QuillViewer content={data?.first_post.content} />}
      </ProposalContainer>
    </Layout>
  );
}

const ProposalContainer = styled(Card)`
  min-height: 85vh;
  padding: 20px;
  position: relative;
`;

const ProposalTitle = styled.div`
  font-size: 30px;
  font-weight: 600;
  line-height: 50px;
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
