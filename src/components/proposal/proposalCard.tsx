import React from 'react';
import { Card, CardBody, CardFooter } from '@paljs/ui/Card';
import { IBaseProposal } from 'type/proposal.type';
import styled from 'styled-components';
import { useRouter } from 'next/router';

export default function ProposalCard({ data }: { data: IBaseProposal }) {
  const router = useRouter();
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
        </CardBody>
        <CardFooterStyled>
          <div></div>
          <Tags>
            {data.tags.map((tag) => (
              <li key={tag.id}>{tag.name}</li>
            ))}
          </Tags>
        </CardFooterStyled>
      </div>
    </Card>
  );
}

const CardHeaderStyled = styled.div`
  display: flex;
  gap: 10px;
  padding: 1rem 1.25rem;
`;

const CardFooterStyled = styled(CardFooter)`
  display: flex;
  justify-content: space-between;
`;

const Tags = styled.ul`
  display: flex;
  gap: 10px;
  li {
    padding-inline: 12px;
    border-radius: 12px;
    border: 1px solid #ccc;
  }
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
