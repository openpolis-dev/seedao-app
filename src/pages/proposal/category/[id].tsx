import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from 'Layouts';
import requests from 'requests';
import { Card, CardBody, CardFooter } from '@paljs/ui/Card';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { IBaseProposal } from 'type/proposal.type';

export default function ProposalCategory() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [proposals, setProposals] = useState<IBaseProposal[]>([]);

  const getProposals = async () => {
    const id = Number(router.query.id);
    if (!id) {
      return;
    }
    const res = await requests.proposal.getProposalsBySubCategory({
      page,
      per_page: pageSize,
      category_index_id: id,
      sort: 'latest',
    });
    console.log('res:', res);
    setProposals(res.data.threads);
  };

  useEffect(() => {
    router.query.id && getProposals();
  }, [router.query.id]);
  return (
    <Layout title="SeeDAO Proposal">
      {proposals.map((p) => (
        <Card size="Tiny" key={p.id}>
          <CardHeaderStyled>
            <div className="left">
              <UserAvatar src={p.user.photo_url} alt="" />
            </div>
            <div className="right">
              <div className="name">{p.user.username}</div>
              <div className="date">{p.updated_at}</div>
            </div>
          </CardHeaderStyled>
          <CardBody>
            <Title>{p.title}</Title>
          </CardBody>
          <CardFooterStyled>
            <div></div>
            <Tags>
              {p.tags.map((tag) => (
                <li key={tag.id}>{tag.name}</li>
              ))}
            </Tags>
          </CardFooterStyled>
        </Card>
      ))}
    </Layout>
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
