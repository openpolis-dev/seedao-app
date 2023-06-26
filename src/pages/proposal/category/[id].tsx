import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import requests from 'requests';
import { useRouter } from 'next/router';
import { IBaseProposal } from 'type/proposal.type';
import ProposalCard from 'components/proposal/proposalCard';
import ProposalSubNav from 'components/proposal/proposalSubNav';
import useProposalCategory from 'hooks/useProposalCategory';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';

export default function ProposalCategory() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [proposals, setProposals] = useState<IBaseProposal[]>([]);
  const [orderType, setOrderType] = useState<'new' | 'old'>('new');
  const [hasMore, setHasMore] = useState(false);

  const ProposalNav = useProposalCategory(Number(router.query.id));

  const getProposals = async () => {
    const id = Number(router.query.id);
    if (!id) {
      return;
    }
    const res = await requests.proposal.getProposalsBySubCategory({
      page,
      per_page: pageSize,
      category_index_id: id,
      sort: orderType,
    });
    console.log('res:', res);
    setProposals([...proposals, ...res.data.threads]);
    setHasMore(res.data.threads.length >= pageSize);
    setPage(page + 1);
  };

  const handleChangeOrder = (index: number) => {
    setOrderType(index === 0 ? 'new' : 'old');
    setPage(1);
    setProposals([]);
  };

  useEffect(() => {
    router.query.id && getProposals();
  }, [router.query.id, orderType]);
  return (
    <Layout title="SeeDAO Proposal">
      {ProposalNav}
      <ProposalSubNav onSelect={handleChangeOrder} />
      <InfiniteScroll dataLength={proposals.length} next={getProposals} hasMore={hasMore}>
        <ProposalBox>
          {proposals.map((p) => (
            <ProposalCard key={p.id} data={p} />
          ))}
        </ProposalBox>
      </InfiniteScroll>
    </Layout>
  );
}

const ProposalBox = styled.div`
  & > div {
    margin-inline: 20px;
  }
`;
