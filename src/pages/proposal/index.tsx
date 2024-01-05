import React, { useEffect, useState } from 'react';
import requests from 'requests';
import { IBaseProposal } from 'type/proposal.type';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import styled from 'styled-components';
import ProposalCard from 'components/proposal/proposalCard';
import ProposalSubNav from 'components/proposal/proposalSubNav';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import MsgIcon from 'assets/Imgs/message.svg';
import { ContainerPadding } from 'assets/styles/global';
import { Link } from 'react-router-dom';
import Tabbar from 'components/common/tabbar';
import ArrowIconSVG from 'components/svgs/rightArrow';
import useToast, { ToastType } from 'hooks/useToast';

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

  const { showToast } = useToast();

  const getCategories = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const resp = await requests.proposal.getCategories();
      dispatch({
        type: AppActionType.SET_PROPOSAL_CATEGORIES,
        payload: resp.data.group.categories,
      });
    } catch (error) {
      logError('getCategories failed', error);
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
    } catch (error: any) {
      logError('getAllProposals failed', error);
      showToast(error?.code || error, ToastType.Danger, { autoClose: false });
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };

  const handleChangeOrder = (index: number) => {
    let str: 'latest' | 'old' = index === 0 ? 'latest' : 'old';
    if (str === orderType) return;
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
        <ContentBox>
          {proposal_categories.map((category, index) => (
            <CategoryCard key={index}>
              <CategoryName to={`/proposal/category/${category.category_id}`}>
                <span className="dot"></span>
                <span className="name">{category.name}</span>
                <ArrowBox>
                  <ArrowIconSVG />
                </ArrowBox>
              </CategoryName>

              {!!category.children.length && (
                <SubCategoryCard>
                  {category.children.map((subCategory) => (
                    <a href={`/proposal/category/${subCategory.category_id}`} key={subCategory.category_id}>
                      <SubCategoryItem>
                        <IconBox>
                          <img src={MsgIcon} alt="" width="24px" height="24px" />
                        </IconBox>
                        <div>
                          <div className="name">{subCategory.name}</div>
                          <div className="topics">
                            {subCategory.thread_count} {t('Proposal.Topics')}
                          </div>
                        </div>
                      </SubCategoryItem>
                    </a>
                  ))}
                </SubCategoryCard>
              )}
            </CategoryCard>
          ))}
        </ContentBox>
      ) : (
        <ContentBox>
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
        </ContentBox>
      )}
    </BoxOuter>
  );
}

const BoxOuter = styled.div`
  min-height: 100%;
  ${ContainerPadding};
`;

const ContentBox = styled.div`
  margin-top: 24px;
`;

const CategoryCard = styled.div`
  margin-bottom: 40px;
`;

const SubCategoryCard = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  background-color: var(--bs-box-background);
  box-shadow: var(--box-shadow);
  border-radius: 16px;
  > a {
    width: 25%;
  }
`;

const SubCategoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  cursor: pointer;
  .name {
    color: var(--bs-body-color_active);
    font-weight: 600;
    font-size: 16px;
    font-family: Poppins-SemiBold, Poppins;
    margin-bottom: 8px;
  }
  .topics {
    font-size: 14px;
    color: var(--bs-body-color);
  }
`;

const ProposalBox = styled.div``;

const IconBox = styled.span`
  display: inline-block;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--bs-primary);
  text-align: center;
  img {
    margin-top: 11px;
  }
`;

const ArrowBox = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid var(--bs-svg-color);
`;

const CategoryName = styled(Link)`
  height: 30px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 17px;
  .dot {
    width: 4px;
    height: 18px;
    background: #14ff00;
    border-radius: 17px;
  }
  .name {
    font-size: 18px;
    font-family: Poppins-Bold, Poppins;
    font-weight: bold;
    color: var(--bs-body-color_active);
  }
  svg {
    position: relative;
    top: -6px;
    left: 3px;
  }
`;
