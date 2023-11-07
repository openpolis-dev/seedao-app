import React, { useEffect, useState } from 'react';
import requests from 'requests';
import { useParams } from 'react-router-dom';
import { IBaseProposal } from 'type/proposal.type';
import ProposalCard from 'components/proposal/proposalCard';
import ProposalSubNav from 'components/proposal/proposalSubNav';
import useProposalCategory from 'hooks/useProposalCategory';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';
import { AppActionType, useAuthContext } from '../../providers/authProvider';

export default function ProposalCategory() {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [proposals, setProposals] = useState<IBaseProposal[]>([]);
  const [orderType, setOrderType] = useState<'new' | 'old'>('new');
  const [hasMore, setHasMore] = useState(false);

  const ProposalNav = useProposalCategory(Number(id));

  const { dispatch } = useAuthContext();

  const getProposals = async () => {
    const _id = Number(id);
    if (!_id) {
      return;
    }
    // setLoading(true);
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const res = await requests.proposal.getProposalsBySubCategory({
        page,
        per_page: pageSize,
        category_index_id: _id,
        sort: orderType,
      });
      setProposals([...proposals, ...res.data.threads]);
      setHasMore(res.data.threads.length >= pageSize);
      setPage(page + 1);
    } catch (error) {
      console.error(error);
    } finally {
      // setLoading(false);
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
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
        <InfiniteScroll
          scrollableTarget="scrollableDiv"
          dataLength={proposals.length}
          next={getProposals}
          hasMore={hasMore}
          loader={<></>}
        >
          <ProposalBox>
            {proposals.map((p) => (
              <ProposalCard key={p.id} data={p} />
            ))}
          </ProposalBox>
        </InfiniteScroll>
      </CategoryPage>
    </BoxOuter>
  );
}

const NavBox = styled.div``;
const BoxOuter = styled.div`
  //padding: 40px;
  min-height: 100%;
`;

const CategoryPage = styled.div`
  //background: #fff;
  padding: 20px;
  min-height: 100%;
  @media (max-width: 1024px) {
    padding: 0;
  }
`;

const ProposalBox = styled.div``;
