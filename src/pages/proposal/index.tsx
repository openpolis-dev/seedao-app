import React, { useEffect, useState } from 'react';
import requests from 'requests';
import { IBaseProposal } from 'type/proposal.type';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import styled from 'styled-components';
import ProposalCard from 'components/proposal/proposalCard';
import ProposalSubNav from 'components/proposal/proposalSubNav';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import MsgIcon from 'assets/images/proposal/message.png';
import { ContainerPadding } from 'assets/styles/global';
import { Link } from 'react-router-dom';
import Tabbar from 'components/common/tabbar';

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
        payload: resp.data.group.categories,
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

  const handleSelectTab = (index: string | number) => {
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
        <Tabbar
          tabs={[
            {
              key: 0,
              title: t('Proposal.AllCategories'),
            },
            {
              key: 1,
              title: t('Proposal.TheNeweset'),
            },
          ]}
          defaultActiveKey={activeTab}
          onSelect={handleSelectTab}
        />
        {activeTab === 0 ? (
          <div>
            {proposal_categories.map((category, index) => (
              <CategoryCard key={index}>
                <div className="cate-name">
                  <Link to={`/proposal/category/${category.category_id}`}>{category.name}</Link>
                </div>
                {!!category.children.length && (
                  <SubCategoryCard>
                    {category.children.map((subCategory) => (
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
                )}
              </CategoryCard>
            ))}
          </div>
        ) : (
          <>
            <ProposalSubNav onSelect={handleChangeOrder} />
            <div>
              <InfiniteScroll
                dataLength={proposals.length}
                next={getAllProposals}
                hasMore={hasMore}
                scrollableTarget="scrollableDiv"
                loader={<></>}
              >
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
  min-height: 100%;
  ${ContainerPadding};
`;

const ProposalContainer = styled.div`
  background: #fff;
  padding: 20px;
  min-height: 100%;
`;

const CategoryCard = styled.div`
  border: 1px solid #eee;
  border-radius: 16px;
  margin-block: 16px;
  .cate-name {
    padding-inline: 16px;
    line-height: 40px;
  }
`;

const SubCategoryCard = styled.div`
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 10px;
`;

const SubCategoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  cursor: pointer;
  .name {
    color: var(--bs-primary);
    font-weight: 600;
  }
`;

const ProposalBox = styled.div`
  & > div {
    margin: 20px;
  }
`;
