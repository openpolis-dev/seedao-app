import React, { useEffect, useState } from 'react';
import requests from 'requests';
import { useParams } from 'react-router-dom';
import { IBaseProposal } from 'type/proposal.type';
import ProposalCard from 'components/proposal/proposalCard';
import ProposalSubNav from 'components/proposal/proposalSubNav';
import useProposalCategory from 'hooks/useProposalCategory';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';
import LoadingBox from 'components/loadingBox';

export default function ProposalCategory() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [proposals, setProposals] = useState<IBaseProposal[]>([]);
  const [orderType, setOrderType] = useState<'new' | 'old'>('new');
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const ProposalNav = useProposalCategory(Number(id));

  const getProposals = async () => {
    const _id = Number(id);
    if (!_id) {
      return;
    }
    setLoading(true);
    try {
      const res = await requests.proposal.getProposalsBySubCategory({
        page,
        per_page: pageSize,
        category_index_id: _id,
        sort: orderType,
      });
      console.log('res:', res);
      setProposals([...proposals, ...res.data.threads]);
      setHasMore(res.data.threads.length >= pageSize);
      setPage(page + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeOrder = (index: number) => {
    setOrderType(index === 0 ? 'new' : 'old');
    setPage(1);
    setProposals([]);
  };

  useEffect(() => {
    id && getProposals();
  }, [id, orderType]);
  return (
    <BoxOuter>
      <CategoryPage>
        <NavBox>{ProposalNav}</NavBox>
        <ProposalSubNav onSelect={handleChangeOrder} />
        <InfiniteScroll dataLength={proposals.length} next={getProposals} hasMore={hasMore} loader={<></>}>
          <ProposalBox>
            {proposals.map((p) => (
              <ProposalCard key={p.id} data={p} />
            ))}
          </ProposalBox>
        </InfiniteScroll>
        {loading && <LoadingBox />}
      </CategoryPage>
    </BoxOuter>
  );
}

const NavBox = styled.div`
  padding: 20px 20px 0;
`;
const BoxOuter = styled.div`
  //padding: 40px;
  min-height: 100%;
`;

const CategoryPage = styled.div`
  //background: #fff;
  padding: 20px;
  min-height: 100%;
`;

const ProposalBox = styled.div`
  & > div {
    //margin-inline: 20px;
    margin: 20px;
  }
`;
