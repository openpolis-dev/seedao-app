import React from 'react';
import { Card, CardBody } from '@paljs/ui/Card';
import { IBaseProposal } from 'type/proposal.type';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import QuillViewer from 'components/proposal/quillViewer';
import useLoadQuill from 'hooks/useLoadQuill';

export default function ProposalCard({ data }: { data: IBaseProposal }) {
  const router = useRouter();
  const enableQuill = useLoadQuill();

  const openProposal = () => {
    router.push(`/proposal/thread/${data.id}`);
  };
  return (
    <Card size="Tiny" key={data.id}>
      <div onClick={openProposal}>
        <CardHeaderStyled>
          <div className="left">
            <UserAvatar src={data.user.photo_url} alt="" />
          </div>
          <div className="right">
            <div className="name">{data.user.username}</div>
            <div className="date">{data.updated_at}</div>
          </div>
        </CardHeaderStyled>
        <CardBody>
          <Title>{data.title}</Title>
          <ProposalContent>
            {enableQuill && data?.first_post.content && <QuillViewer content={data?.first_post.content} />}
          </ProposalContent>
        </CardBody>
      </div>
    </Card>
  );
}

const CardHeaderStyled = styled.div`
  display: flex;
  gap: 10px;
  padding: 1rem 1.25rem;
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
`;

const ProposalContent = styled.div`
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webit-line-clamp: 2;
  overflow: hidden;
  height: 52px;
  .ql-editor p {
    line-height: 24px;
  }
`;
