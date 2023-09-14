import React, { useEffect, useState } from 'react';
import requests from 'requests';
import { IBaseProposal } from 'type/proposal.type';
import { Tabs, Tab } from 'react-bootstrap';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import styled, { css } from 'styled-components';
import ProposalCard from 'components/proposal/proposalCard';
import ProposalSubNav from 'components/proposal/proposalSubNav';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import MsgIcon from 'assets/images/proposal/message.png';

export default function Index() {
  const {
    state: { proposal_categories },
    dispatch,
  } = useAuthContext();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [proposals, setProposals] = useState<IBaseProposal[]>([]);
  const [orderType, setOrderType] = useState<'latest' | 'old'>('latest');
  const [activeTab, setActiveTab] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const getCategories = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const resp = await requests.proposal.getCategories();
      dispatch({
        type: AppActionType.SET_PROPOSAL_CATEGORIES,
        payload: resp.data.group.categories.filter((category) => category.category_id === 19),
      });
    } catch (error) {
      console.error('getCategories failed', error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const getAllProposals = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const resp = await requests.proposal.getAllProposals({ page, per_page: pageSize, sort: orderType });
      setProposals([...proposals, ...resp.data.threads]);
      setPage(page + 1);
      setHasMore(resp.data.threads.length >= pageSize);
    } catch (error) {
      console.error('getAllProposals failed', error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const handleChangeOrder = (index: number) => {
    setPage(1);
    setProposals([]);
    setOrderType(index === 0 ? 'latest' : 'old');
  };

  const handleSelectTab = (index: string) => {
    setActiveTab(Number(index));
  };

  useEffect(() => {
    if (activeTab === 0) {
      getCategories();
    } else {
      getAllProposals();
    }
  }, [activeTab, orderType]);

  return (
    <BoxOuter>
      <ProposalContainer>
        <Tabs defaultActiveKey={activeTab} onSelect={(e: any) => handleSelectTab(e)}>
          <Tab title={t('Proposal.AllCategories')} eventKey={0}></Tab>
          <Tab title={t('Proposal.TheNeweset')} eventKey={1}></Tab>
        </Tabs>
        {activeTab === 0 ? (
          <div>
            <SubCategoryCard>
              {proposal_categories[0].children.map((subCategory) => (
                <a href={`/proposal/category/${subCategory.category_id}`} key={subCategory.category_id}>
                  <SubCategoryItem>
                    <img src={MsgIcon} alt="" width="24px" height="24px" />
                    <div>
                      <div className="name">{subCategory.name}</div>
                      <div>
                        <span>{subCategory.thread_count} topics</span>
                      </div>
                    </div>
                  </SubCategoryItem>
                </a>
              ))}
            </SubCategoryCard>
          </div>
        ) : (
          <>
            <ProposalSubNav onSelect={handleChangeOrder} />
            <div>
              <InfiniteScroll dataLength={proposals.length} next={getAllProposals} hasMore={hasMore} loader={<></>}>
                <ProposalBox>
                  {proposals.map((proposal) => (
                    <ProposalCard key={proposal.id} data={proposal} />
                  ))}
                </ProposalBox>
              </InfiniteScroll>
            </div>
          </>
        )}
      </ProposalContainer>
    </BoxOuter>
  );
}

const BoxOuter = styled.div`
  padding: 40px;
  min-height: 100%;
`;

const ProposalContainer = styled.div`
  background: #fff;
  padding: 20px;
  min-height: 100%;
`;

const SubCategoryCard = styled.div`
  display: flex;
  flex-direction: column;
  //gap: 8px;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 10px;
`;

const SubCategoryItem = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    &:hover {
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
    }
    .name {
      color: ${theme.colorPrimary500};
      font-weight: 600;
    }
  `}
`;

const ProposalBox = styled.div`
  & > div {
    margin-inline: 20px;
  }
`;
